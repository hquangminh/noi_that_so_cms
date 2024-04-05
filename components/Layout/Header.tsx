import { styled, useTheme } from 'styled-components';
import { BellFilled } from '@ant-design/icons';
import { Avatar, Badge, Col, Divider, Dropdown, MenuProps, Row, Space } from 'antd';

import { AccountType } from 'interface/Account';
import onLogout from 'lib/logout';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 5px 10px 5px 0px;
  background-color: ${({ theme }) => theme.bodyColor};
  box-shadow: 0 1px 4px 0 rgba(74, 74, 78, 0.12);
  z-index: 1;
  & > .ant-row {
    width: 100%;
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;

  img {
    max-width: calc(100% - 50px);
    max-height: calc(100% - 30px);
    object-fit: contain;
  }
`;

type Props = { auth: AccountType };

const LayoutHeader = ({ auth }: Props) => {
  const theme = useTheme();

  const items: MenuProps['items'] = [
    { key: 'me', label: `Xin chào ${auth.first_name} ${auth.last_name}`, type: 'group' },
    { type: 'divider' },
    { key: 'logout', label: 'Đăng xuất', onClick: onLogout },
  ];

  return (
    <HeaderWrapper>
      <Row align='middle'>
        <Col flex='220px'>
          <Logo>
            <img src='/static/logo.svg' alt='' width='100%' />
          </Logo>
        </Col>
        <Col flex='auto'>
          <Row>
            <Col span={12}></Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Space split={<Divider type='vertical' />}>
                <Badge count={5}>
                  <BellFilled style={{ fontSize: '28px', color: 'grey' }} />
                </Badge>

                <Dropdown
                  menu={{ items, style: { width: 200 } }}
                  trigger={['click']}
                  placement='bottomRight'
                  arrow={{ pointAtCenter: true }}
                >
                  <Space.Compact block>
                    <a onClick={(e) => e.preventDefault()}>
                      <Avatar style={{ backgroundColor: theme?.palette.primary.main }}>
                        {auth.username.slice(0, 1).toLocaleUpperCase()}
                      </Avatar>
                    </a>
                  </Space.Compact>
                </Dropdown>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </HeaderWrapper>
  );
};

export default LayoutHeader;
