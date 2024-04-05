import { ReactNode, useState } from 'react';

import { useQuery } from '@apollo/client';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Select, Switch, TreeSelect, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

import { API_GetCategoryHashtagPartner } from 'graphql/product/query';
import { beforeUpload, getBase64, normFile } from 'functions';

import SectionContent from 'components/Fragments/SectionContent';

import { CategoryProductType, CategoryRoomType, CategoryStyleType, HashtagItem } from 'interface/Category';
import { PartnerType } from 'interface/Partner';

import { FormItemUploadImage } from 'lib/styles';

type Props = { image?: string };

type CategoryResponse = {
  product_category: CategoryProductType[];
  room_type: CategoryRoomType[];
  style_type: CategoryStyleType[];
  hashtag: HashtagItem[];
  partner: PartnerType[];
};

interface TreeData {
  key: string | number;
  title: ReactNode;
  value: string | number;
  children?: TreeData[];
}

const ProductFormGeneral = ({ image: imageInit }: Props) => {
  const form = Form.useFormInstance();
  const background_color = Form.useWatch('background_color', form);

  const [image, setImage] = useState<string | undefined>(imageInit);

  const { loading: fetchingCategory, data: category } = useQuery<CategoryResponse>(
    API_GetCategoryHashtagPartner,
    { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true },
  );

  const onCrop = async (file: any) => {
    form.setFieldValue('image', [{ ...file, originFileObj: file }]);
    form.validateFields(['image']);
    setImage(await getBase64(file));
  };

  return (
    <SectionContent title='Thông tin cơ bản'>
      <Row>
        <Col span={12}>
          <FormItemUploadImage background={image ? background_color : undefined}>
            <Form.Item
              name='image'
              label='Hình ảnh'
              rules={[{ required: true, message: 'Vui lòng tải lên Hình ảnh!' }]}
              valuePropName='fileList'
              getValueFromEvent={normFile}
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
          </FormItemUploadImage>
        </Col>

        <Col span={12}>
          <Form.Item
            name='background_color'
            label='Màu nền sản phẩm'
            labelCol={{ flex: '200px' }}
            rules={[{ required: true }]}
          >
            <input type='color' style={{ width: 200, height: 98 }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name='name' label='Tên sản phẩm' rules={[{ required: true }, { whitespace: true }]}>
        <Input autoComplete='off' maxLength={120} showCount />
      </Form.Item>

      <Form.Item
        name='category'
        label='Danh mục'
        rules={[{ required: true, message: 'Vui lòng chọn Danh mục!' }]}
      >
        <TreeSelect
          treeData={category?.product_category.map(({ id, parent_id: pId, name: title }) => {
            return { id, pId, title, value: id };
          })}
          treeDataSimpleMode
          treeCheckable
          allowClear
          loading={fetchingCategory}
          filterTreeNode={(input, treeNode) =>
            treeNode.title?.toString().toLowerCase().includes(input.toLowerCase()) || false
          }
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name='style'
        label='Phong cách'
        rules={[{ required: true, message: 'Vui lòng chọn ${label}!' }]}
      >
        <Select
          mode='multiple'
          loading={fetchingCategory}
          allowClear
          filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase()) || false}
          options={category?.style_type.map((i) => ({ label: i.name, value: i.id }))}
        />
      </Form.Item>

      <Form.Item name='material' label='Vật liệu'>
        <Select mode='tags' open={false} loading={fetchingCategory} allowClear suffixIcon={null} />
      </Form.Item>

      <Form.Item name='room' label='Phòng'>
        <Select
          mode='multiple'
          loading={fetchingCategory}
          allowClear
          filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase()) || false}
          options={category?.room_type.map((i) => ({ label: i.name, value: i.id }))}
        />
      </Form.Item>

      <Form.Item name='hashtags' label='Hashtag'>
        <Select
          mode='multiple'
          loading={fetchingCategory}
          allowClear
          filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase()) || false}
          options={category?.hashtag.map((i) => ({ label: i.name, value: i.id }))}
        />
      </Form.Item>

      <Form.Item name='partner_id' label='Đối tác'>
        <Select
          loading={fetchingCategory}
          allowClear
          filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase()) || false}
          options={category?.partner.map((i) => ({ label: i.name, value: i.id }))}
        />
      </Form.Item>

      <Form.Item name='status' label='Hiển thị' valuePropName='checked'>
        <Switch />
      </Form.Item>
    </SectionContent>
  );
};

export default ProductFormGeneral;
