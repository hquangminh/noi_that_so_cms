import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useMutation } from '@apollo/client';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, FormProps, Input, Space, Upload } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';

import { handleErrorCatch } from 'lib/utils';
import { regex } from 'common/constants';
import { beforeUpload, getBase64, isUrlImage, normFile, removeSpaceString } from 'functions';
import { API_AddPartner } from 'graphql/partner/mutation';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';
import { AddPartnerFailure, AddPartnerSuccess } from 'components/Pages/Partner/Notification';

import { FormItemUploadImage } from 'lib/styles';

const PartnerAddContainer = ({ authName }: { authName: string }) => {
  const { push } = useRouter();

  const [form] = Form.useForm();
  const [image, setImage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [onAddPartner] = useMutation(API_AddPartner);

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
      const param = {
        ...fieldOther,
        logo: linkImg,
        name: removeSpaceString(name),
        status: 2,
        registrant_name: authName,
      };
      await onAddPartner({ variables: { data: param } });
      AddPartnerSuccess();
      push('/partner');
    } catch (error) {
      setLoading(false);
      handleErrorCatch(error, AddPartnerFailure);
    }
  };

  const actionSection = [
    <div key='action-btn' style={{ textAlign: 'end' }}>
      <Space>
        <Button disabled={loading}>
          <Link href='/partner'>Hủy</Link>
        </Button>
        <Button type='primary' loading={loading} onClick={form.submit}>
          Thêm
        </Button>
      </Space>
    </div>,
  ];

  const formProps: FormProps = {
    form,
    labelCol: { flex: '110px' },
    validateMessages: { whitespace: '${label} không thể chứa mỗi khoảng trắng' },
    onFieldsChange,
    onFinish: onSubmit,
  };

  return (
    <SectionContent actions={actionSection}>
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
          <Input placeholder='Nội thất số' />
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
    </SectionContent>
  );
};

export default PartnerAddContainer;
