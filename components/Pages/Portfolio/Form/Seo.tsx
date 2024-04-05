import { Form, Input } from 'antd';

import SectionContent from 'components/Fragments/SectionContent';

const PortfolioFormSeo = () => {
  return (
    <SectionContent title='Thông tin SEO'>
      <Form.Item name='seo_title' label='Title' rules={[{ whitespace: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name='seo_description' label='Description' rules={[{ whitespace: true }]}>
        <Input />
      </Form.Item>
    </SectionContent>
  );
};

export default PortfolioFormSeo;
