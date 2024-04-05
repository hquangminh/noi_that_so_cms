import { useRouter } from 'next/router';

import { Button, Col, ConfigProvider, Form, Input, Row, Select, Space } from 'antd';

import { removeEmptyObject } from 'functions';

import SectionContent from 'components/Fragments/SectionContent';

const FilterPanelHashtag = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFilter = (values: any) => {
    router.replace({ query: removeEmptyObject({ ...router.query, ...values }) }, undefined, {
      shallow: true,
    });
  };

  const onReset = () => {
    const filter = { name: undefined, status: undefined, count: undefined };
    router.replace({ query: removeEmptyObject({ ...router.query, ...filter }) }, undefined, {
      shallow: true,
    });
    form.setFieldsValue({ name: undefined, status: 0, count: 'decrease' });
  };

  const ButtonSearch = [
    <Space key='search-action' style={{ display: 'flex', justifyContent: 'end', cursor: 'auto' }}>
      <Button type='primary' onClick={form.submit}>
        Tìm kiếm
      </Button>
      <Button onClick={onReset}>Đặt lại</Button>
    </Space>,
  ];

  return (
    <SectionContent title='Công cụ tìm kiếm' actions={ButtonSearch}>
      <ConfigProvider theme={{ components: { Form: { marginLG: 0 } } }}>
        <Form form={form} onFinish={onFilter}>
          <Row gutter={16}>
            <Col span={24} lg={8}>
              <Form.Item name='name' label='Tên' initialValue={router.query.name}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={24} lg={8}>
              <Form.Item name='status' label='Trạng thái' initialValue={router.query.status ?? 0}>
                <Select
                  options={[
                    { label: 'Tất cả', value: 0 },
                    { label: 'Hoạt động', value: 'true' },
                    { label: 'Không hoạt động', value: 'false' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24} lg={8}>
              <Form.Item name='count' label='Lượt tìm kiếm' initialValue={router.query.count ?? 'decrease'}>
                <Select
                  options={[
                    { label: 'Giảm dần', value: 'decrease' },
                    { label: 'Tăng dần', value: 'ascending' },
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

export default FilterPanelHashtag;
