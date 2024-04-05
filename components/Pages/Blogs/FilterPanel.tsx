import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';

import { removeEmptyObject } from 'functions';
import { API_GetBlogCategory } from 'graphql/blog/query';

import SectionContent from 'components/Fragments/SectionContent';

import { BlogCategory } from 'interface/Blog';

const BlogFilterPanel = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const { loading: fetchingCategory, data: category } = useQuery<{ blog_category: BlogCategory[] }>(
    API_GetBlogCategory,
    { fetchPolicy: 'network-only' },
  );

  const onFilter = (value: Record<string, string>) => {
    router.replace({ query: removeEmptyObject(value) }, undefined, { shallow: true });
  };

  const onReset = () => {
    form.resetFields();
    router.replace({ query: undefined }, undefined, { shallow: true });
  };

  return (
    <SectionContent title='Công cụ tìm kiếm'>
      <Form form={form} onFinish={onFilter}>
        <Row gutter={[16, 10]}>
          <Col flex='auto'>
            <Row gutter={[16, 10]}>
              <Col span={12}>
                <Form.Item name='title' noStyle>
                  <Input placeholder='Nhập tiêu đề Blog' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='category' noStyle>
                  <Select
                    style={{ width: '100%' }}
                    placeholder='Chọn danh mục'
                    allowClear
                    loading={fetchingCategory}
                    options={category?.blog_category.map((i) => ({ label: i.name, value: i.id }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col flex='none'>
            <Space>
              <Button type='primary' block htmlType='submit'>
                Tìm kiếm
              </Button>
              <Button block onClick={onReset}>
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </SectionContent>
  );
};

export default BlogFilterPanel;
