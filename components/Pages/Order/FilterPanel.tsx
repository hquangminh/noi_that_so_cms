import { useRouter } from 'next/router';
import { Button, Col, ConfigProvider, Form, Input, Row, Select, Space } from 'antd';

import { removeEmptyObject } from 'functions';

import SectionContent from 'components/Fragments/SectionContent';

const OrderFilterPanel = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const onSearch = (values: Record<string, string>) =>
    router.replace({ query: removeEmptyObject({ ...router.query, ...values }) }, undefined, {
      shallow: true,
    });

  const onReset = () => {
    const filter = { order_code: undefined, sort: undefined };
    router.replace({ query: removeEmptyObject({ ...router.query, ...filter }) }, undefined, {
      shallow: true,
    });
    form.setFieldsValue({ order_code: '', sort: 'newest' });
  };

  const ButtonAction = [
    <Space key='btn-action' style={{ display: 'flex', justifyContent: 'end' }}>
      <Button type='primary' onClick={form.submit}>
        Tìm kiếm
      </Button>
      <Button onClick={onReset}>Đặt lại</Button>
    </Space>,
  ];

  return (
    <SectionContent title='Công cụ tìm kiếm' actions={ButtonAction}>
      <ConfigProvider theme={{ components: { Form: { marginLG: 0 } } }}>
        <Form form={form} initialValues={router.query} onFinish={onSearch}>
          <Row gutter={16}>
            <Col span={24} lg={12}>
              <Form.Item name='order_code' label='Mã đơn hàng'>
                <Input placeholder='NTS1689145669379' />
              </Form.Item>
            </Col>

            <Col span={24} lg={12}>
              <Form.Item name='sort' label='Sắp xếp'>
                <Select
                  defaultValue='newest'
                  options={[
                    { label: 'Mới nhất', value: 'newest' },
                    { label: 'Cũ nhất', value: 'oldest' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ConfigProvider>
    </SectionContent>
  );
};

export default OrderFilterPanel;
