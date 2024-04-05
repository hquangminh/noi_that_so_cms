import { styled } from 'styled-components';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { regex } from 'common/constants';

const OptionSection = styled.div`
  padding: 2px 10px 8px;
  background: #f6f6f6;
  border-radius: 4px;
  .ant-form-item {
    margin-bottom: 0;
    .ant-form-item-row {
      display: flex;
      align-items: center;
    }
    .ant-form-item-label > label {
      height: auto;
      font-size: 12px;
    }
    .ant-form-item-control > div:not([class]) {
      display: none !important;
    }
    .ant-input,
    .ant-input-number-input {
      height: 24px;
      font-size: 12px;
    }
  }
`;

const ProductFormVariation = () => {
  const form = Form.useFormInstance();
  const isPreOrder = Form.useWatch('pre_order', form);
  const formVariations = Form.useWatch('variations', form);

  return (
    <Form.Item label={'Danh sách phân loại hàng'} noStyle={formVariations === undefined}>
      <Form.List name='variations'>
        {(variations) => {
          return (
            <Row gutter={[10, 10]}>
              {variations.map((v) => (
                <Col span={12} xxl={8} key={v.name}>
                  <OptionSection>
                    <Form.Item label='Tên biến thể'>
                      <strong>{formVariations && formVariations[v.key]?.combName}</strong>
                    </Form.Item>

                    <Row gutter={[10, 0]}>
                      <Col span={12}>
                        <Form.Item
                          name={[v.name, 'price']}
                          label='Giá'
                          labelCol={{ flex: '60px' }}
                          rules={[
                            { required: true },
                            { type: 'integer' },
                            () => ({
                              validator(_, value) {
                                if (parseInt(value) < 1000)
                                  return Promise.reject(new Error('Giá trị phải ít nhất 1,000'));
                                else if (parseInt(value) > 1000000000)
                                  return Promise.reject(new Error('Giá tối đa là 1,000,000,000'));
                                else return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            size='small'
                            placeholder='Tối thiểu 1,000 và tối đa 1,000,000,000'
                            addonAfter='₫'
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          name={[v.name, 'promotion_price']}
                          label='Giá KM'
                          labelCol={{ flex: '60px' }}
                          rules={[
                            { type: 'integer' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const price = getFieldValue('variations')[v.name].price;
                                if (typeof value === 'number' && (value >= price || value < 1000))
                                  return Promise.reject(new Error('Giá khuyễn mãi không hợp lệ'));
                                else return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            size='small'
                            placeholder='Tối thiểu 1,000 và tối đa 1,000,000,000'
                            addonAfter='₫'
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                      </Col>

                      {!isPreOrder && (
                        <Col span={12}>
                          <Form.Item
                            name={[v.name, 'stock']}
                            label='Kho'
                            labelCol={{ flex: '60px' }}
                            rules={[
                              { required: true },
                              { type: 'integer' },
                              () => ({
                                validator(_, value) {
                                  if (parseInt(value) < 0)
                                    return Promise.reject(new Error('Kho không được nhỏ hơn 0'));
                                  else if (parseInt(value) > 1000000)
                                    return Promise.reject(new Error('Kho tối đa là 1,000,000'));
                                  else return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <InputNumber
                              size='small'
                              style={{ width: '100%' }}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      <Col span={12}>
                        <Form.Item
                          name={[v.name, 'sku']}
                          label='SKU'
                          labelCol={{ flex: '60px' }}
                          rules={[{ whitespace: true }]}
                        >
                          <Input size='small' />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          name={[v.name, 'link']}
                          label='Link'
                          labelCol={{ flex: '60px' }}
                          rules={[{ required: true }, { pattern: regex.URL }]}
                        >
                          <Input
                            size='small'
                            placeholder='https://cylinder.archisketch.com/?id=YfkVYAZ6BC2F4A591B64855'
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          name={[v.name, 'size']}
                          label='Size'
                          labelCol={{ flex: '60px' }}
                          rules={[{ whitespace: true }]}
                        >
                          <Input style={{ width: '100%' }} size='small' placeholder='Dài x Rộng x Cao' />
                        </Form.Item>
                      </Col>
                    </Row>
                  </OptionSection>
                </Col>
              ))}
            </Row>
          );
        }}
      </Form.List>
    </Form.Item>
  );
};

export default ProductFormVariation;
