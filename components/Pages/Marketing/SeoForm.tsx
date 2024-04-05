import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useMutation } from '@apollo/client';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormProps, Input, Modal, Row, Select, Space, Upload, notification } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';

import { handleErrorCatch } from 'lib/utils';
import { beforeUpload, getBase64, normFile, removeSpaceString } from 'functions';
import { API_AddSeoPage, API_DeleteSeoPage, API_EditSeoPage } from 'graphql/seo-page/mutation';
import globalServices from 'services/global-service';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';

import { FormItemUploadImage } from 'lib/styles';

import { SeoPageType } from 'interface/SeoPage';

export const PageList = [
  { label: 'Trang chủ', value: 'index' },
  { label: 'Blog', value: 'blog' },
  { label: 'Portfolio', value: 'portfolio' },
  { label: 'Sản phẩm', value: 'product' },
];

type Props = { type: 'add' | 'edit'; data?: SeoPageType };

const MarketingSeoForm = ({ type, data }: Props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(data?.image);

  const [onAddSeoPage] = useMutation(API_AddSeoPage);
  const [onEditSeoPage] = useMutation(API_EditSeoPage);
  const [onDelete] = useMutation<{ delete_seo_page: { returning: SeoPageType[] } }>(API_DeleteSeoPage, {
    variables: { id: data?.id },
    onCompleted: ({ delete_seo_page }) => {
      if (delete_seo_page.returning[0]?.image) s3Services.deleteFile(delete_seo_page.returning[0].image);
      DeleteSeoSuccess();
      router.push('/marketing/seo');
    },
    onError: () => DeleteSeoFailed(),
  });

  const handleConfirmDelete = () => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa không?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([modalConfirm.update({ cancelButtonProps: { disabled: true } }), onDelete()]),
    });
  };

  const onFieldsChange = async (changedFields: FieldData[]) => {
    const fieldNamePath = changedFields[0].name;
    const fieldName = Array.isArray(fieldNamePath) ? fieldNamePath[0] : fieldNamePath;

    const fieldValue = changedFields[0].value;

    if (fieldName === 'image' && fieldValue && fieldValue[0].originFileObj)
      setImage(await getBase64(fieldValue[0].originFileObj));
  };

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const { image, page, title, description, keyword } = values;

      const params = { name: page, table: 'seo-page' };
      const exist =
        page !== data?.page ? await globalServices.checkItemExist(params).then((data) => data.exist) : false;

      if (exist) {
        setSubmitting(false);
        return notification.error({
          key: 'seo-page-is-exist',
          message: (type === 'add' ? 'Tạo' : 'Chỉnh sửa') + ' nội dung SEO',
          description: 'Trang bạn chọn đã tồn tại',
        });
      } else {
        const linkImg =
          image && image[0].originFileObj ? await s3Services.uploadFile(image[0].originFileObj) : undefined;

        const param = {
          page,
          image: linkImg,
          title: removeSpaceString(title),
          description: removeSpaceString(description),
          keyword: Array.isArray(keyword) ? keyword?.join(', ') : undefined,
        };
        if (type === 'add') await onAddSeoPage({ variables: { data: param } });
        if (type === 'edit') {
          await onEditSeoPage({ variables: { id: router.query.seoID, data: param } });
          if (data?.image) s3Services.deleteFile(data.image);
        }
      }

      notification.success({
        key: type + '-seo-page-failed',
        message: (type === 'add' ? 'Tạo' : 'Chỉnh sửa') + ' nội dung SEO',
        description: `SEO đã được ${type === 'add' ? 'tạo' : 'chỉnh sửa'} thành công`,
      });
      router.push('/marketing/seo');
    } catch (error) {
      setSubmitting(false);
      handleErrorCatch(error, () =>
        notification.error({
          key: type + '-seo-page-failed',
          message: (type === 'add' ? 'Tạo' : 'Chỉnh sửa') + ' nội dung SEO',
          description: `Không thể ${type === 'add' ? 'tạo' : 'chỉnh sửa'} SEO. Vui lòng thử lại sau`,
        }),
      );
    }
  };

  const formProps: FormProps = {
    form,
    labelCol: { flex: '80px' },
    validateMessages: {
      required: 'Vui lòng nhập ${label}!',
      whitespace: '${label} không thể chứa mỗi khoảng trắng',
    },
    initialValues: {
      ...data,
      keyword: data?.keyword ? data.keyword.split(',') : undefined,
      image: data?.image ? [{ url: data.image }] : undefined,
    },
    onFieldsChange,
    onFinish: onSubmit,
  };

  const FormAction = [
    <Row key='action' justify='space-between'>
      <Col>
        {type === 'edit' && (
          <Button danger onClick={handleConfirmDelete}>
            Xóa
          </Button>
        )}
      </Col>
      <Col>
        <Space>
          <Button disabled={submitting}>
            <Link href='/marketing/seo'>Thoát</Link>
          </Button>
          <Button type='primary' loading={submitting} onClick={form.submit}>
            {type === 'add' ? 'Tạo' : 'Cập nhật'}
          </Button>
        </Space>
      </Col>
    </Row>,
  ];

  return (
    <SectionContent actions={FormAction}>
      <Form {...formProps}>
        <FormItemUploadImage>
          <Form.Item name='image' label='Hình ảnh' valuePropName='fileList' getValueFromEvent={normFile}>
            <Upload
              listType='picture-card'
              showUploadList={false}
              maxCount={1}
              beforeUpload={(file) => beforeUpload(file)}
            >
              {image ? <img src={image} alt='' /> : <UploadOutlined style={{ fontSize: 20 }} />}
            </Upload>
          </Form.Item>
        </FormItemUploadImage>

        <Form.Item name='page' label='Trang' rules={[{ required: true, message: 'Vui lòng chọn ${label}!' }]}>
          <Select options={PageList} />
        </Form.Item>

        <Form.Item name='title' label='Tiêu đề' rules={[{ required: true }, { whitespace: true }]}>
          <Input maxLength={70} showCount placeholder='Nội dung nên có độ dài từ 10 đến 70 ký tự' />
        </Form.Item>

        <Form.Item name='description' label='Nội dung' rules={[{ required: true }, { whitespace: true }]}>
          <Input.TextArea
            maxLength={300}
            showCount
            autoSize={{ minRows: 5 }}
            placeholder='Nội dung nên có độ dài từ 160 đến 300 ký tự'
          />
        </Form.Item>

        <Form.Item name='keyword' label='Từ khóa'>
          <Select
            mode='tags'
            open={false}
            showArrow={false}
            placeholder='Nhập và bấm Enter để thêm từ khóa'
          />
        </Form.Item>
      </Form>

      {contextHolder}
    </SectionContent>
  );
};

export default MarketingSeoForm;

export const DeleteSeoSuccess = () =>
  notification.success({
    key: 'delete-seo-page-success',
    message: 'Xóa SEO',
    description: 'Đã xóa thành công',
  });

export const DeleteSeoFailed = () =>
  notification.success({
    key: 'delete-seo-page-failed',
    message: 'Xóa SEO',
    description: 'Xóa không thành công. Vui lòng thử lại sau.',
  });
