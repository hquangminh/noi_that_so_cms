import { Fragment, useCallback, useEffect } from 'react';

import { styled } from 'styled-components';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, InputNumber, Radio, Row, Space, Typography } from 'antd';

import { isArrayEmpty } from 'functions';
import { regex } from 'common/constants';

import SectionContent from 'components/Fragments/SectionContent';
import ProductFormVariation from './Variation';

const GroupSection = styled.div`
  position: relative;
  margin-top: 16px;
  padding: 16px;
  background: #f6f6f6;
  border-radius: 4px;
  .Product_Group_Remove {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    font-size: 16px;
    color: #333;
    cursor: pointer;
  }
  .ant-select .ant-select-selection-item {
    background-color: ${({ theme }) => theme.palette.primary.mainBg};
  }
`;

type Props = { allowAddOption?: boolean };

const ProductFormSale = ({ allowAddOption = true }: Props) => {
  const form = Form.useFormInstance();
  const options = Form.useWatch('options', form);
  const variations = Form.useWatch('variations', form);
  const isPreOrder = Form.useWatch('pre_order', form);

  const onCreateVariations = useCallback(async () => {
    if (options) {
      let productVariations: { name: string; values: string[] }[] = options
        .filter(({ options }: any) => !isArrayEmpty(options) && options.some(({ name }: any) => name))
        .map(({ name, options }: any) => {
          options = options.filter(({ name }: Record<string, any>) => name);
          const values = options.map(({ name }: any, index: number) => ({ value: name, unicode: index }));
          return { name, values };
        });

      if (productVariations.length > 0) {
        const cartesian: any = (...a: string[][]) =>
          a.reduce((a: any, b) => a.flatMap((d: any) => b.map((e) => [d, e].flat())));

        const productValues = productVariations.map(({ values }) => values);

        const permutations = cartesian(...productValues).map((e: any) => ({
          combName: Array.isArray(e) ? e.map((i: { value: string }) => i.value).join(', ') : e.value,
          combUnicode: Array.isArray(e)
            ? e.map((i: { unicode: number }) => i.unicode).join('-')
            : e.unicode.toString(),
        }));

        const variationsForm = permutations.map((i: { combUnicode: string; combName: string }) =>
          variations?.length === permutations.length
            ? { ...variations?.find((v: Record<string, any>) => v.combUnicode === i.combUnicode), ...i }
            : { ...variations?.find((v: Record<string, any>) => v.combName === i.combName), ...i },
        );

        form.setFieldValue('variations', variationsForm);
      } else form.setFieldValue('variations', undefined);
    }
  }, [form, options, variations]);

  useEffect(() => {
    onCreateVariations();
  }, [onCreateVariations]);

  return (
    <SectionContent title='Thông tin bán hàng'>
      <Form.Item name='pre_order' label='Hàng đặt trước' style={{ marginBottom: 5 }}>
        <Radio.Group
          defaultValue={false}
          options={[
            { label: 'Không', value: false },
            { label: 'Đồng ý', value: true },
          ]}
        />
      </Form.Item>
      {isPreOrder && (
        <Form.Item label=' ' style={{ marginBottom: 0 }}>
          <Typography.Text type='secondary' style={{ display: 'flex', alignItems: 'center', columnGap: 5 }}>
            Tôi cần
            <Form.Item
              name='preparation_time'
              noStyle
              rules={[
                { required: true, message: 'Vui lòng nhập thời gian chuẩn bị hàng' },
                { type: 'integer', message: 'Ngày phải là số nguyên' },
                () => ({
                  validator(_, value) {
                    if (value && value < 0) return Promise.reject(new Error('Ngày phải lớn hơn 0'));
                    else return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber size='small' controls={false} style={{ width: '50px' }} />
            </Form.Item>
            ngày để chuẩn bị hàng
          </Typography.Text>
        </Form.Item>
      )}
      <Divider />

      <Form.Item label='Phân loại hàng'>
        <Form.List name='options'>
          {(groups, { add, remove }) => (
            <>
              <Space>
                <Button
                  type='dashed'
                  icon={<PlusOutlined />}
                  disabled={groups.length === 2 || !allowAddOption}
                  onClick={() => add({ options: [{ name: undefined }] })}
                >
                  Thêm nhóm phân loại
                </Button>
                {!allowAddOption && (
                  <Typography.Text type='secondary' italic>
                    (Không thể thêm phân loại vì sản phẩm đã được bán)
                  </Typography.Text>
                )}
              </Space>

              <Row gutter={[16, 0]}>
                {groups.map((g, index) => (
                  <Col span={12} key={g.key}>
                    <GroupSection>
                      <Button
                        className='Product_Group_Remove'
                        type='text'
                        size='small'
                        icon={<CloseOutlined />}
                        onClick={() => remove(g.name)}
                      />
                      <Row align='top'>
                        <Col flex='120px' style={{ marginTop: 5 }}>
                          Nhóm phân loại {index + 1}
                        </Col>
                        <Col flex='auto'>
                          <Form.Item
                            name={[g.name, 'name']}
                            rules={[
                              { required: true, message: 'Vui lòng nhập Tên nhóm phân loại!' },
                              { whitespace: true, message: 'Vui lòng không nhập khoảng trống!' },
                            ]}
                          >
                            <Input autoComplete='off' style={{ maxWidth: 'calc(100% - 30px)' }} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row align='top'>
                        <Col flex='120px' style={{ marginTop: 5 }}>
                          Phân loại hàng
                        </Col>
                        <Col flex='calc(100% - 120px)'>
                          <Form.List name={[g.name, 'options']}>
                            {(itemOptions, { add, remove }) => (
                              <Fragment>
                                <Row gutter={[10, 10]} style={{ maxWidth: 'calc(100% - 25px)' }}>
                                  {itemOptions.map((i, index2) => (
                                    <Col key={index2} span={12} xxl={8}>
                                      <Space size={5}>
                                        <Form.Item
                                          name={[i.name, 'name']}
                                          rules={[{ required: true, message: '' }]}
                                          style={{ marginBottom: 0 }}
                                        >
                                          <Input />
                                        </Form.Item>
                                        <Button
                                          danger
                                          type='dashed'
                                          size='small'
                                          shape='circle'
                                          icon={<CloseOutlined style={{ fontSize: 12 }} />}
                                          disabled={itemOptions.length === 1}
                                          onClick={() => remove(i.name)}
                                        />
                                      </Space>
                                    </Col>
                                  ))}
                                </Row>
                                <Divider dashed style={{ margin: '15px 0' }} />
                                <Button icon={<PlusOutlined />} onClick={add}>
                                  Thêm phân loại
                                </Button>
                              </Fragment>
                            )}
                          </Form.List>
                        </Col>
                      </Row>
                    </GroupSection>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Form.List>
      </Form.Item>

      <ProductFormVariation />

      {(!options || options.length === 0) && (
        <>
          <Form.Item
            name='price'
            label='Giá'
            rules={[
              { required: true },
              { type: 'integer' },
              () => ({
                validator(_, value) {
                  if (parseInt(value) < 1000) return Promise.reject(new Error('Giá phải ít nhất 1,000'));
                  else if (parseInt(value) > 1000000000)
                    return Promise.reject(new Error('Giá tối đa là 1,000,000,000'));
                  else return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              style={{ width: '50%' }}
              placeholder='Tối thiểu 1,000 và tối đa 1,000,000,000'
              addonAfter='₫'
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name='promotion_price'
            label='Giá khuyến mãi'
            rules={[
              { type: 'integer' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const price = getFieldValue('price');
                  if (typeof value === 'number' && (value >= price || value < 1000))
                    return Promise.reject(new Error('Giá khuyến mãi phải tối thiểu là 1,000 và nhỏ hơn Giá'));
                  else return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              style={{ width: '50%' }}
              placeholder='Giá khuyến mãi phải nhỏ hơn Giá'
              addonAfter='₫'
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          {!isPreOrder && (
            <Form.Item
              name='stock'
              label='Kho'
              rules={[
                { required: true },
                { type: 'integer' },
                () => ({
                  validator(_, value) {
                    if (parseInt(value) < 0) return Promise.reject(new Error('Kho không được nhỏ hơn 0'));
                    else if (parseInt(value) > 1000000)
                      return Promise.reject(new Error('Kho tối đa là 1,000,000'));
                    else return Promise.resolve();
                  },
                }),
              ]}
              initialValue={0}
            >
              <InputNumber
                style={{ width: '50%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          )}

          <Form.Item name='sku' label='SKU' rules={[{ whitespace: true }]}>
            <Input style={{ width: '50%' }} />
          </Form.Item>

          <Form.Item name='size' label='Kích thước' rules={[{ whitespace: true }]}>
            <Input style={{ width: '50%' }} placeholder='Dài x Rộng x Cao' />
          </Form.Item>

          <Form.Item
            name='link'
            label='Cylinder link'
            rules={[
              { required: true },
              { pattern: regex.URL, message: '${label} không phải kiểu url hợp lệ' },
            ]}
          >
            <Input style={{ width: '50%' }} />
          </Form.Item>
        </>
      )}
    </SectionContent>
  );
};

export default ProductFormSale;
