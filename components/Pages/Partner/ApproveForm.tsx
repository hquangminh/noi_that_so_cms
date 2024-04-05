import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { UploadOutlined } from '@ant-design/icons';
import { Divider, Form, FormProps, Input, Modal, ModalProps, Upload } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';

import { handleErrorCatch } from 'lib/utils';
import {
  beforeUpload,
  getBase64,
  isUrlImage,
  normFile,
  removeEmptyObject,
  removeSpaceString,
} from 'functions';
import { regex } from 'common/constants';
import { API_PartnerApprove } from 'graphql/partner/mutation';
import s3Services from 'services/s3-services';

import { ApprovePartnerFailure, ApprovePartnerSuccess } from './Notification';
import NotExecutedNotification from 'components/Fragments/NotExecutedNotification';

import { PartnerDetail, PartnerType } from 'interface/Partner';

import { FormItemUploadImage } from 'lib/styles';

type Props = { data: PartnerDetail; open: boolean; onClose: () => void; onApproved: () => void };

const PartnerApproveForm = ({ data, open, onClose, onApproved }: Props) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [onApprove] = useMutation<{ update_partner?: { returning: PartnerType[] } }>(API_PartnerApprove);

  const onFieldsChange = async (changedFields: FieldData[]) => {
    const fieldNamePath = changedFields[0].name;
    const fieldName = typeof fieldNamePath === 'object' ? fieldNamePath[0] : fieldNamePath;

    const fieldValue = changedFields[0].value;

    if (fieldName === 'logo' && fieldValue && fieldValue[0].originFileObj)
      setImage(await getBase64(fieldValue[0].originFileObj));
  };

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const { logo, name, ...fieldOther } = values;
      const linkImg = image && isUrlImage(image) ? image : await s3Services.uploadFile(logo[0].originFileObj);
      setImage(linkImg);
      const param = { ...fieldOther, name: removeSpaceString(name), logo: linkImg, status: 2 };

      await onApprove({ variables: { id: data.id, data: param } }).then(({ data }) => {
        if (data?.update_partner && data.update_partner.returning.length > 0) {
          onApproved();
          ApprovePartnerSuccess();
        } else NotExecutedNotification();
      });

      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      handleErrorCatch(error, ApprovePartnerFailure);
    }
  };

  const formProps: FormProps = {
    form,
    labelCol: { flex: '110px' },
    validateMessages: { whitespace: '${label} không thể chứa mỗi khoảng trắng' },
    initialValues: removeEmptyObject({ ...data, logo: undefined }),
    onFieldsChange: onFieldsChange,
    onFinish: onSubmit,
  };

  const modalProps: ModalProps = {
    open,
    title: <p style={{ textAlign: 'center' }}>Phê duyệt đối tác</p>,
    closable: false,
    maskClosable: false,
    destroyOnClose: true,
    okText: 'Xác nhận',
    okButtonProps: { loading },
    cancelButtonProps: { disabled: loading },
    onCancel: onClose,
    onOk: form.submit,
    afterClose: () => {
      setImage(undefined);
      form.resetFields;
    },
  };

  return (
    <Modal {...modalProps}>
      <Divider />
      <Form {...formProps}>
        <FormItemUploadImage>
          <Form.Item
            name='logo'
            label='Logo'
            rules={[{ required: true, message: 'Vui lòng thêm Logo thương hiệu!' }]}
            valuePropName='fileList'
            getValueFromEvent={normFile}
          >
            <Upload
              className='thumbnail_upload'
              listType='picture-circle'
              showUploadList={false}
              maxCount={1}
              beforeUpload={(file) => beforeUpload(file)}
            >
              {image ? <img src={image} alt='' /> : <UploadOutlined style={{ fontSize: 20 }} />}
            </Upload>
          </Form.Item>
        </FormItemUploadImage>

        <Form.Item name='name' label='Tên đối tác' rules={[{ required: true }, { whitespace: true }]}>
          <Input placeholder='Ví dụ: Nội thất số' />
        </Form.Item>

        <Form.Item name='phone_number' label='Số điện thoại' rules={[{ required: true }]}>
          <Input
            maxLength={13}
            placeholder='Ví dụ: 0123123123'
            onChange={(e) => form.setFieldValue('phone_number', e.target.value.replace(/\D+/g, ''))}
          />
        </Form.Item>

        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true },
            { pattern: regex.Email, message: 'Email không phải kiểu email hợp lệ' },
          ]}
        >
          <Input placeholder='Ví dụ: contact@noithatso.com.vn' />
        </Form.Item>

        <Form.Item
          name='website'
          label='Website'
          rules={[{ pattern: regex.URL, message: 'Website không phải kiểu url hợp lệ' }]}
        >
          <Input placeholder='Ví dụ: https://wwww.noithatso.com.vn' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PartnerApproveForm;
