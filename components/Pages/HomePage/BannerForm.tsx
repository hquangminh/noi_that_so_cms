import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useMutation } from '@apollo/client';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Space, Switch, Upload, notification } from 'antd';
import ImgCrop from 'antd-img-crop';

import { handleErrorCatch } from 'lib/utils';
import { beforeUpload, getBase64, normFile } from 'functions';
import {
  API_AddHomePageBanner,
  API_DeleteHomePageBanner,
  API_EditHomePageBanner,
} from 'graphql/homepage/mutation';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';
import { TitleTooltip } from './BannerTooltip';

import { HomePageBanner } from 'interface/HomePage';

import { FormItemUploadImage } from 'lib/styles';

type Props = { type: 'add' | 'edit'; data?: HomePageBanner };

const HomePageBannerForm = ({ type, data }: Props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const [addBanner] = useMutation(API_AddHomePageBanner);
  const [editBanner] = useMutation(API_EditHomePageBanner);
  const [deleteBanner, { loading: deleting }] = useMutation(API_DeleteHomePageBanner);

  const [image, setImage] = useState<string | undefined>(data?.image);
  const [background, setBackground] = useState<string | undefined>(data?.background);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const backgroundFile = Form.useWatch('background', form);

  const onConvertBackground = useCallback(async () => {
    if (backgroundFile && backgroundFile[0].originFileObj)
      setBackground(await getBase64(backgroundFile[0].originFileObj));
  }, [backgroundFile]);

  useEffect(() => {
    onConvertBackground();
  }, [onConvertBackground]);

  const onCrop = async (file: any) => {
    form.setFieldValue('image', [{ ...file, originFileObj: file }]);
    setImage(await getBase64(file));
  };

  const onSubmit = async (values: Record<string, any>) => {
    try {
      setSubmitting(true);

      const { image: imageFile, background: backgroundFile, ...otherValues } = values;
      const body = {
        ...otherValues,
        image: imageFile[0].originFileObj ? await s3Services.uploadFile(imageFile[0].originFileObj) : image,
        background:
          backgroundFile && backgroundFile[0].originFileObj
            ? await s3Services.uploadFile(backgroundFile[0].originFileObj)
            : background,
      };

      if (type === 'add') {
        await addBanner({ variables: { data: body } });
        notification.success({
          key: 'add-banner-success',
          message: 'Thêm Banner',
          description: 'Đã thêm Banner thành công',
        });
      }
      if (type === 'edit' && data) {
        await editBanner({ variables: { id: data.id, data: body } });
        notification.success({
          key: 'edit-banner-success',
          message: 'Chỉnh sửa Banner',
          description: 'Đã chỉnh sửa Banner thành công',
        });
      }

      router.push('/landing-page/banner');
    } catch (error) {
      handleErrorCatch(error, () =>
        notification.error({
          key: type + '-banner-failed',
          message: 'Thất bại',
          description: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        }),
      );
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = (id: number) => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa Banner này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          deleteBanner({ variables: { id } }),
        ])
          .then(() => {
            if (data) s3Services.deleteFile([data.image, data?.background]);
            router.push('/homepage/banner');
            notification.success({
              key: 'delete-banner-success',
              message: 'Xóa Banner',
              description: 'Đã xóa Banner thành công',
            });
          })
          .catch(() =>
            notification.error({
              key: 'delete-banner-failed',
              message: 'Xóa Banner',
              description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
            }),
          ),
    });
  };

  const FormAction = [
    <Row key='action' justify='space-between'>
      <Col>
        {data && (
          <Button
            danger
            disabled={submitting}
            loading={deleting}
            onClick={() => handleConfirmDelete(data.id)}
          >
            Xóa
          </Button>
        )}
      </Col>
      <Col>
        <Space>
          <Button disabled={submitting || deleting}>
            <Link href={'/landing-page/banner'}>Thoát</Link>
          </Button>
          <Button type='primary' disabled={deleting} loading={submitting} onClick={form.submit}>
            Lưu
          </Button>
        </Space>
      </Col>
    </Row>,
  ];

  return (
    <SectionContent actions={FormAction}>
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <FormItemUploadImage>
          <Row>
            <Col span={12}>
              <Form.Item
                name='image'
                label='Hình ảnh'
                initialValue={data ? [{ url: data.image }] : undefined}
                rules={[{ required: true, message: 'Vui lòng tải lên Hình ảnh!' }]}
                valuePropName='fileList'
              >
                <ImgCrop
                  modalTitle='Cắt hình ảnh'
                  fillColor='transparent'
                  beforeCrop={(file) => beforeUpload(file, undefined, 'upload-crop')}
                  onModalOk={onCrop}
                >
                  <Upload listType='picture-circle' showUploadList={false} maxCount={1} accept='image/*'>
                    {image ? <img src={image} alt='' /> : <UploadOutlined style={{ fontSize: 20 }} />}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name='background'
                label='Hình nền'
                initialValue={data && data.background ? [{ url: data.background }] : undefined}
                valuePropName='fileList'
                getValueFromEvent={normFile}
              >
                <Upload
                  listType='picture-circle'
                  showUploadList={false}
                  maxCount={1}
                  beforeUpload={(file) => beforeUpload(file)}
                >
                  {background ? <img src={background} alt='' /> : <UploadOutlined style={{ fontSize: 20 }} />}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </FormItemUploadImage>

        <Form.Item
          name='title'
          label='Tiêu đề'
          tooltip={<TitleTooltip />}
          initialValue={data?.title}
          rules={[{ required: true }, { whitespace: true }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2 }}
            placeholder='Nhiều bộ sưu tập <br/><span>đồ nội thất</span> để trang trí <br/>góc nhà của bạn.'
          />
        </Form.Item>

        <Form.Item
          name='caption'
          label='Phụ đề'
          initialValue={data?.caption}
          rules={[{ required: true }, { whitespace: true }]}
        >
          <Input.TextArea autoSize={{ minRows: 2 }} />
        </Form.Item>

        <Form.Item
          name='link'
          label='Link'
          tooltip='Nhập /san-pham thay vì https://noithatso.com.vn/san-pham nếu sử dụng liên kết từ Nội Thất Số'
          initialValue={data?.link}
          rules={[{ required: true }, { whitespace: true }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={[50, 0]}>
          <Col flex='auto'>
            <Form.Item
              name='index'
              label='Vị trí'
              initialValue={data?.index}
              rules={[{ required: true }, { type: 'integer' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col flex='150px'>
            <Form.Item
              name='status'
              label='Kích hoạt'
              initialValue={data?.status || false}
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {contextHolder}
    </SectionContent>
  );
};

export default HomePageBannerForm;
