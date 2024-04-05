import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import { Form, FormProps, Input, InputNumber, Modal, ModalProps, Select, Switch } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { hashtagType } from 'common/constants';
import { API_AddHashtag, API_EditHashtag } from 'graphql/category/mutation';

import { HashtagItem, HashtagType } from 'interface/Category';

type Props = { open: boolean; data?: HashtagItem; onClose: () => void; onSuccess: () => void };

const HashtagForm = ({ open, data, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [addHashtag] = useMutation(API_AddHashtag);
  const [editHashtag] = useMutation(API_EditHashtag);

  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (open && data) form.setFieldsValue(data);
  }, [open, data, form]);

  const onSubmit = async (values: Record<string, string | number>) => {
    try {
      setSubmitting(true);

      if (!data) await addHashtag({ variables: { data: values } });
      else await editHashtag({ variables: { id: data.id, data: values } });

      onClose();
      onSuccess();
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      handleErrorCatch(error);
    }
  };

  const modalProps: ModalProps = {
    open,
    closable: !submitting,
    closeIcon: null,
    destroyOnClose: true,
    title: (data ? 'Chỉnh sửa' : 'Thêm') + ' Hashtag',
    style: { textAlign: 'center' },
    okText: 'Lưu',
    okButtonProps: { loading: submitting },
    cancelButtonProps: { disabled: submitting },
    onCancel: onClose,
    onOk: form.submit,
    afterClose: () => form.resetFields(),
  };

  const formProps: FormProps = {
    form,
    labelCol: { flex: '100px' },
    style: { marginTop: 20, textAlign: 'left' },
    onFinish: onSubmit,
  };

  return (
    <Modal {...modalProps}>
      <Form {...formProps} autoComplete='off'>
        <Form.Item name='name' label='Tên' rules={[{ required: true }, { whitespace: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name='type'
          label='Phân loại'
          rules={[{ required: true, message: 'Vui lòng chọn ${label}!' }]}
        >
          <Select
            disabled={typeof data !== 'undefined'}
            options={Object.keys(hashtagType).map((i) => ({
              label: hashtagType[Number(i) as HashtagType],
              value: Number(i),
            }))}
          />
        </Form.Item>

        <Form.Item
          name='count'
          label='Lượt tìm kiếm'
          rules={[{ type: 'integer' }]}
          initialValue={data?.count ?? 0}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name='status' label='Kích hoạt' valuePropName='checked'>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HashtagForm;
