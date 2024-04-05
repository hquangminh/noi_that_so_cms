import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { AxiosError } from 'axios';
import { styled } from 'styled-components';
import { useMutation } from '@apollo/client';
import { Button, Col, Form, FormProps, Modal, Row, Space, notification } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { removeSpaceString } from 'functions';
import { API_AddProduct, API_DeleteProduct } from 'graphql/product/mutation';
import s3Services from 'services/s3-services';
import productServices from 'services/product-services';

import SectionContent from 'components/Fragments/SectionContent';
import ProductFormGeneral from './General';
import ProductFormDescription from './Description';
import ProductFormSale from './Sale';
import * as handleNotification from '../Notification';

import { ProductDetail, ProductVariationType } from 'interface/Product';

const FormWrapper = styled.div`
  .ant-form-item-label label {
    margin-right: 10px;
    white-space: pre-line;
    &::after {
      display: none;
    }
  }
`;

type Props = { type?: 'add' | 'edit'; data?: ProductDetail };

const FormProductComponent = ({ type = 'add', data }: Props) => {
  const router = useRouter();

  const [form] = Form.useForm();
  const [modal, contextModal] = Modal.useModal();
  const [apiNotification, contextNotification] = notification.useNotification();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [addProduct] = useMutation(API_AddProduct);
  const [deleteBlog] = useMutation(API_DeleteProduct);

  useEffect(() => {
    if (data) {
      const {
        product_category_relations,
        product_hashtags,
        product_options,
        product_rooms,
        product_styles,
        product_variations,
        partner,
        ...otherField
      } = data;
      form.setFieldsValue({
        ...otherField,
        image: [{ url: data?.image }],
        category: product_category_relations.map((i) => i.category_id),
        material: otherField.material ?? undefined,
        room: product_rooms?.map((i) => i.room_id),
        style: product_styles?.map((i) => i.style_id),
        hashtags: product_hashtags?.map((i) => i.hashtag_id),
        partner_id: partner?.id,
        options: product_options?.map(({ name, options }) => ({
          name,
          options: options.map((name) => ({ name })),
        })),
        pre_order: typeof data.preparation_time === 'number',
      });

      if (product_variations.every((v) => v.type === ProductVariationType.ByProduct))
        form.setFieldsValue({
          ...product_variations[0],
          promotion_price:
            product_variations[0].price !== product_variations[0].promotion_price
              ? product_variations[0].promotion_price
              : undefined,
        });

      if (product_variations.every((v) => v.type === ProductVariationType.ByOption))
        setTimeout(
          () =>
            form.setFieldsValue({
              variations: data.product_variations?.map((i) => ({
                ...i,
                promotion_price: i.price !== i.promotion_price ? i.promotion_price : undefined,
              })),
            }),
          100,
        );
    }
  }, [data, form]);

  const onAddProduct = async (values: Record<string, any>) => {
    try {
      setSubmitting(true);

      // prettier-ignore
      const { name, category, image, style, options, room, hashtags, variations, price, promotion_price, stock, sku, size, link, pre_order, preparation_time, ...valuesForm } = values;

      let body: Record<string, any> = {
        ...valuesForm,
        name: removeSpaceString(name),
        preparation_time: pre_order ? preparation_time : null,
      };
      body['image'] = values.image[0].originFileObj
        ? await s3Services.uploadFile(values.image[0].originFileObj)
        : '';

      if (category && category.length > 0)
        body['product_category_relations'] = { data: category.map((i: number) => ({ category_id: i })) };

      if (room && room.length > 0)
        body['product_rooms'] = { data: room.map((i: number) => ({ room_id: i })) };

      if (style && style.length > 0)
        body['product_styles'] = { data: style.map((i: number) => ({ style_id: i })) };

      if (hashtags && hashtags.length > 0)
        body['product_hashtags'] = { data: hashtags.map((i: number) => ({ hashtag_id: i })) };

      if (options && options.length > 0)
        body['product_options'] = {
          data: options.map(({ name, options }: any, index: number) => ({
            name,
            options: options.map(({ name }: Record<string, any>) => name),
            index,
          })),
        };

      body['product_variations'] = {
        data:
          variations && variations.length > 0
            ? variations.map(({ price, promotion_price, stock, ...i }: Record<string, string | number>) => {
                return {
                  ...i,
                  price,
                  promotion_price: promotion_price ?? price,
                  stock: pre_order ? 0 : stock,
                  type: 2,
                };
              })
            : [
                {
                  price,
                  promotion_price: promotion_price ?? price,
                  stock: pre_order ? 0 : stock,
                  sku,
                  size,
                  link,
                },
              ],
      };

      await addProduct({ variables: { objects: body } });
      handleNotification.AddProductSuccess();
      router.push('/products?sort=newest');
    } catch (error) {
      setSubmitting(false);
      handleErrorCatch(error, handleNotification.AddProductFail);
    }
  };

  const onEditProduct = async (values: Record<string, any>) => {
    try {
      setSubmitting(true);

      // prettier-ignore
      const { name, category, image, style, hashtags, options, room, variations, price, promotion_price, stock, sku, size, link, pre_order, preparation_time, ...valuesForm } = values;

      let product: Record<string, any> = {
        ...valuesForm,
        name: removeSpaceString(name),
        preparation_time: pre_order ? preparation_time : null,
      };
      product['image'] = values.image[0].originFileObj
        ? await s3Services.uploadFile(values.image[0].originFileObj)
        : data?.image;

      const product_id = data?.id;
      const categoryInsert = category.map((i: number) => ({ product_id, category_id: i }));
      const roomInsert = room?.map((i: number) => ({ product_id, room_id: i }));
      const styleInsert = style?.map((i: number) => ({ product_id, style_id: i }));
      const hashtagInsert = hashtags?.map((i: number) => ({ product_id, hashtag_id: i }));
      const optionInsert = options?.map(({ name, options }: any, index: number) => ({
        name,
        options: options.map(({ name }: Record<string, any>) => name),
        index,
        product_id,
      }));

      const variationInsert =
        variations && variations.length > 0
          ? variations.map(
              ({ __typename, price, promotion_price, stock, ...i }: Record<string, string | number>) => {
                return {
                  ...i,
                  product_id,
                  price,
                  promotion_price: promotion_price ?? price,
                  stock: pre_order ? 0 : stock,
                  type: 2,
                };
              },
            )
          : [
              {
                id:
                  data?.product_variations[0].type === ProductVariationType.ByProduct
                    ? data.product_variations[0].id
                    : undefined,
                combUnicode: '0',
                price,
                promotion_price: promotion_price ?? price,
                stock: pre_order ? 0 : stock,
                sku,
                link,
                size,
                product_id,
              },
            ];

      await productServices.update(product_id ?? 0, {
        product,
        category: categoryInsert,
        room: roomInsert,
        style: styleInsert,
        hashtag: hashtagInsert,
        option: optionInsert,
        variation: variationInsert,
      });

      if (data && product['image'] !== data.image && !data.order_products_aggregate.aggregate.count)
        s3Services.deleteFile(data?.image || '');

      handleNotification.EditProductSuccess();
      router.push('/products');
    } catch (error) {
      const showNotification = () =>
        apiNotification.error({
          key: 'edit-product-fail',
          message: 'Chỉnh sửa thất bại',
          description:
            error instanceof AxiosError && error.response?.data.error_message
              ? error.response.data.error_message
              : 'Chỉnh sửa sản phẩm thất bại. Vui lòng thử lại sau.',
        });
      handleErrorCatch(error, showNotification);
      setSubmitting(false);
    }
  };

  const onFinish = async (values: Record<string, any>) => {
    if (type === 'add') await onAddProduct(values);
    if (type === 'edit' && data) await onEditProduct(values);
  };

  const handleDelete = async () => {
    await deleteBlog({ variables: { productID: data?.id } })
      .then(({ data }) => {
        if (data?.delete_product) s3Services.deleteFile(data.delete_product.returning[0].image);
        handleNotification.DeleteProductSuccess();
        router.push('/products');
      })
      .catch(() => handleNotification.DeleteProductFail());
  };

  const handleConfirmDelete = () => {
    if (data && data.order_products_aggregate.aggregate.count > 0)
      return apiNotification.error({
        key: 'product-not-allow-delete',
        message: 'Không thể xóa sản phẩm',
        description: 'Không thể xóa sản phẩm đã có đơn hàng',
      });

    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa sản phẩm này?',
      onOk: async () =>
        await Promise.all([modalConfirm.update({ cancelButtonProps: { disabled: true } }), handleDelete()]),
    });
  };

  const formProps: FormProps = {
    form,
    autoComplete: 'off',
    labelCol: { flex: '120px' },
    validateMessages: {
      required: 'Vui lòng nhập ${label}!',
      whitespace: '${label} không thể chứa mỗi khoảng trắng',
      types: { integer: '${label} phải là số nguyên' },
    },
    onFinish,
  };

  return (
    <FormWrapper>
      <Form {...formProps}>
        <ProductFormGeneral image={data?.image} />
        <ProductFormSale
          allowAddOption={
            !data ||
            data.order_products_aggregate.aggregate.count === 0 ||
            data.product_variations[0].type === ProductVariationType.ByOption
          }
        />
        <ProductFormDescription />

        <SectionContent fixedBottom size='small'>
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
                <Button disabled={submitting}>
                  <Link href='/products'>Thoát</Link>
                </Button>
                <Button type='primary' htmlType='submit' loading={submitting}>
                  Lưu
                </Button>
              </Space>
            </Col>
          </Row>
        </SectionContent>
      </Form>

      {contextNotification}
      {contextModal}
    </FormWrapper>
  );
};

export default FormProductComponent;
