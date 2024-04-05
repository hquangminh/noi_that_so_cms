import { Button, Col, Input, Row, Space } from 'antd';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { removeEmptyObject } from 'functions';

import SectionContent from 'components/Fragments/SectionContent';

const PartnerFilter = () => {
  const { replace, query } = useRouter();

  const [keySearch, setKeySearch] = useState<string | undefined>(query.name?.toString());

  const onSearch = (name?: string) =>
    replace({ query: removeEmptyObject({ ...query, name }) }, undefined, { shallow: true });

  return (
    <SectionContent title='Công cụ tìm kiếm'>
      <Row gutter={[16, 0]} justify='space-between'>
        <Col flex='auto'>
          <Input
            style={{ width: '100%' }}
            value={keySearch}
            placeholder='Nhập tên đối tác'
            onChange={(e) => setKeySearch(e.target.value)}
          />
        </Col>
        <Col flex='none'>
          <Space>
            <Button type='primary' onClick={() => onSearch(keySearch)}>
              Tìm kiếm
            </Button>
            <Button
              onClick={() => {
                setKeySearch(undefined);
                onSearch();
              }}
            >
              Đặt lại
            </Button>
          </Space>
        </Col>
      </Row>
    </SectionContent>
  );
};

export default PartnerFilter;
