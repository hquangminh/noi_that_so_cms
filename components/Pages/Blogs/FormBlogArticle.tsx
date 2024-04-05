import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { styled } from 'styled-components';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Space, Switch, Upload, notification } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';
import ImgCrop from 'antd-img-crop';

import { handleErrorCatch } from 'lib/utils';
import { beforeUpload, getBase64, isArrayEmpty } from 'functions';
import { API_CheckBlogCategoryActive, API_GetBlogCategory } from 'graphql/blog/query';
import { API_AddBlog, APT_DeleteBlog, APT_EditBlog } from 'graphql/blog/mutation';
import { API_GetProductForAttachment } from 'graphql/product/query';
import { API_GetHashtag } from 'graphql/category/query';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';
import FormItemTextEditor from 'components/Fragments/FormItemTextEditor';
import * as Notification from './Notification';

import { BlogCategory, BlogType } from 'interface/Blog';
import { HashtagItem } from 'interface/Category';
import { ProductType } from 'interface/Product';

import { FormItemUploadImage } from 'lib/styles';

const Wrapper = styled.div`
  .thumbnail_upload .ant-upload.ant-upload-select {
    max-width: 150px;
  }
`;

type Props = { type?: 'add' | 'edit'; data?: BlogType };

const FormBlogArticle = ({ type = 'add', data }: Props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [modal, contextModal] = Modal.useModal();
  const [noti, contextNoti] = notification.useNotification();

  const [products, setProducts] = useState<ProductType[] | undefined>(
    data?.blog_products?.map((i) => i.product),
  );
  const [image, setImage] = useState<string | undefined>(data?.image);
  const [loading, setLoading] = useState<boolean>(false);

  const { loading: fetchingCategory, data: category } = useQuery<{ blog_category: BlogCategory[] }>(
    API_GetBlogCategory,
    { fetchPolicy: 'network-only' },
  );
  const { loading: fetchHashtag, data: hashtag } = useQuery<{ hashtag: HashtagItem[] }>(API_GetHashtag, {
    variables: { filter: { type: { _eq: 3 } }, limit: 2147483647 },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [getProduct, { loading: searchingProduct }] = useLazyQuery<{ product: ProductType[] }>(
    API_GetProductForAttachment,
    { fetchPolicy: 'network-only', onCompleted: ({ product }) => setProducts(product) },
  );
  const [checkCategoryActive] = useLazyQuery<{ blog_category: BlogCategory[] }>(API_CheckBlogCategoryActive, {
    fetchPolicy: 'network-only',
    onError: handleErrorCatch,
  });
  const [addBlog] = useMutation(API_AddBlog);
  const [editBlog] = useMutation(APT_EditBlog);
  const [deleteBlog] = useMutation<{ delete_blog: { returning: { image: string }[] } }>(APT_DeleteBlog);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const isCategoryActive = await checkCategoryActive({ variables: { id: values.category_id } })
        .then(({ data }) => data && data?.blog_category.length > 0)
        .catch(() => false);

      if (!isCategoryActive) throw new Error('Danh mục được chọn không hoạt động');

      const { image: thumbnail, hashtags, products, ...otherValue } = values;

      const image = thumbnail[0].originFileObj
        ? await s3Services.uploadFile(thumbnail[0].originFileObj, data?.image)
        : data?.image;

      if (otherValue.status && (!data || !data.publish_date)) otherValue['publish_date'] = 'now()';

      if (type === 'add') {
        const blog_products =
          products && !isArrayEmpty(products)
            ? { data: products.map((i: number) => ({ product_id: i })) }
            : undefined;
        const blog_hashtags = {
          data: hashtags ? hashtags.map((hashtag_id: number) => ({ hashtag_id })) : [],
        };
        await addBlog({ variables: { objects: { ...otherValue, image, blog_hashtags, blog_products } } });
      }
      if (type === 'edit') {
        const product = products.map((i: number) => ({ blog_id: data?.id, product_id: i }));
        const hashtag = hashtags.map((i: number) => ({ blog_id: data?.id, hashtag_id: i }));
        await editBlog({
          variables: { id: data?.id, _set: { ...otherValue, image }, product, hashtags: hashtag },
        });
      }

      noti.success({
        key: 'save-blog',
        message: 'Lưu bài viết',
        description: 'Bài viết đã được lưu thành công',
      });
      router.push('/blogs');
    } catch (error: any) {
      const notiError = () => noti.error({ message: 'Không thể lưu bài viết', description: error.message });
      handleErrorCatch(error, notiError);
      setLoading(false);
    }
  };

  const onFieldsChange = async (changedFields: FieldData[]) => {
    const fieldNamePath = changedFields[0].name;
    const fieldName = typeof fieldNamePath === 'object' ? fieldNamePath[0] : fieldNamePath;

    const fieldValue = changedFields[0].value;

    if (fieldName === 'image' && fieldValue && fieldValue[0].originFileObj)
      setImage(await getBase64(fieldValue[0].originFileObj));
  };

  const onCrop = async (file: any) => {
    form.setFieldValue('image', [{ ...file, originFileObj: file }]);
    setImage(await getBase64(file));
  };

  const handleDelete = async () => {
    await deleteBlog({ variables: { id: data?.id } })
      .then(({ data }) => {
        if (data?.delete_blog) s3Services.deleteFile(data.delete_blog.returning[0].image);
        Notification.DeleteBlogSuccess();
        router.push('/blogs');
      })
      .catch(() => Notification.DeleteBlogFail());
  };

  const handleConfirmDelete = () => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa Blog này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([modalConfirm.update({ cancelButtonProps: { disabled: true } }), handleDelete()]),
    });
  };

  return (
    <Wrapper>
      <Form
        form={form}
        layout='vertical'
        initialValues={data ? { ...data, image: [{ url: data.image }] } : undefined}
        onFieldsChange={onFieldsChange}
        onFinish={onFinish}
      >
        <SectionContent title='Nội dung Blog'>
          <FormItemUploadImage>
            <Form.Item
              name='image'
              label='Hình ảnh'
              rules={[{ required: true, message: 'Vui lòng tải lên Hình ảnh!' }]}
              valuePropName='fileList'
            >
              <ImgCrop
                modalTitle='Cắt hình ảnh'
                fillColor='transparent'
                aspect={1.5}
                beforeCrop={(file) => beforeUpload(file, undefined, 'upload-crop')}
                onModalOk={onCrop}
              >
                <Upload
                  className='thumbnail_upload'
                  listType='picture-circle'
                  showUploadList={false}
                  maxCount={1}
                  accept='image/*'
                >
                  {image ? <img src={image} alt='' /> : <UploadOutlined style={{ fontSize: 20 }} />}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </FormItemUploadImage>

          <Form.Item name='title' label='Tiêu đề' rules={[{ required: true }, { whitespace: true }]}>
            <Input />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col md={9}>
              <Form.Item
                name='category_id'
                label='Danh mục'
                rules={[
                  { required: true, message: 'Vui lòng chọn Danh mục!' },
                  () => ({
                    validator(_, value) {
                      if (value && category?.blog_category.find((i) => i.id === value)?.status)
                        return Promise.resolve();
                      return Promise.reject(
                        new Error('Danh mục này không hoạt động. Vui lòng chọn danh mục khác!'),
                      );
                    },
                  }),
                ]}
              >
                <Select
                  loading={fetchingCategory}
                  options={category?.blog_category
                    .sort((a, b) => Number(b.status) - Number(a.status))
                    .map((i) => ({ label: i.name, value: i.id, disabled: !i.status }))}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name='hashtags'
                label='Hashtag'
                initialValue={data?.blog_hashtags?.map((i) => i.hashtag_id)}
              >
                <Select
                  mode='multiple'
                  allowClear
                  loading={fetchHashtag}
                  options={hashtag?.hashtag.map((i) => ({ label: i.name, value: i.id }))}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) || false
                  }
                />
              </Form.Item>
            </Col>

            <Col md={3}>
              <Form.Item name='status' label='Xuất bản' valuePropName='checked'>
                <Switch defaultChecked={data?.status || false} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='summary' label='Tóm tắt' rules={[{ required: true }, { whitespace: true }]}>
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
          </Form.Item>

          <FormItemTextEditor
            name='content'
            label='Nội dung'
            rules={[{ required: true }, { whitespace: true }]}
            height={400}
          />

          <Form.Item
            name='products'
            label='Sản phẩm được đề cập'
            initialValue={data?.blog_products?.map((i) => i.product.id)}
          >
            <Select
              mode='multiple'
              placeholder='Tìm kiếm sản phẩm'
              filterOption={false}
              loading={searchingProduct}
              options={products?.map((i) => ({
                label: (
                  <Space>
                    <img src={i.image} alt='' width='25' />
                    {i.name}
                  </Space>
                ),
                value: i.id,
              }))}
              onSearch={(value) =>
                value.trim().length > 1 && getProduct({ variables: { name: `%${value.trim()}%` } })
              }
            />
          </Form.Item>
        </SectionContent>

        <SectionContent title='Nội dung SEO'>
          <Form.Item name='seo_title' label='Tiêu đề' rules={[{ whitespace: true }]}>
            <Input maxLength={70} showCount placeholder='Nội dung nên có độ dài từ 10 đến 70 ký tự' />
          </Form.Item>

          <Form.Item name='seo_description' label='Mô tả' rules={[{ whitespace: true }]}>
            <Input.TextArea
              maxLength={300}
              showCount
              autoSize={{ minRows: 3 }}
              placeholder='Nội dung nên có độ dài từ 160 đến 300 ký tự'
            />
          </Form.Item>
        </SectionContent>

        <SectionContent size='small' fixedBottom>
          <Row justify='space-between'>
            <Col>
              {type === 'edit' && (
                <Button danger onClick={handleConfirmDelete}>
                  Xóa
                </Button>
              )}
            </Col>
            <Col>
              <Space>
                <Button disabled={loading}>
                  <Link href='/blogs'>Thoát</Link>
                </Button>
                <Button type='primary' htmlType='submit' loading={loading}>
                  Lưu
                </Button>
              </Space>
            </Col>
          </Row>
        </SectionContent>
      </Form>

      {contextModal}
      {contextNoti}
    </Wrapper>
  );
};

export default FormBlogArticle;
