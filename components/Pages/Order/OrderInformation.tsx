import { useContext } from 'react';

import { styled } from 'styled-components';
import { Badge, ConfigProvider, Descriptions, Typography, theme } from 'antd';

import { orderStatusLogs } from 'common/constants';

import SectionContent from 'components/Fragments/SectionContent';
import { OrderContext } from './OrderProvider';

const OrderInformationWrapper = styled.div`
  .ant-descriptions {
    .ant-descriptions-view {
      .ant-descriptions-row:nth-child(2n) {
        &:not(:last-child) {
          .ant-descriptions-item-container {
            margin-bottom: 16px;
          }
        }
        .ant-descriptions-item {
          padding-bottom: 0;
        }
      }
      .ant-descriptions-item-label {
        font-weight: 500;
      }
    }
  }
`;

const OrderInformation = () => {
  const { order } = useContext(OrderContext);
  const statusLogs = orderStatusLogs[order.status];
  return (
    <SectionContent
      title='Thông tin đơn hàng'
      extra={<Badge status={statusLogs.badge} text={statusLogs.status} />}
    >
      <OrderInformationWrapper>
        <ConfigProvider theme={{ token: { padding: 4, colorTextTertiary: '#000000', colorText: '#666666' } }}>
          <Descriptions layout='vertical' column={1} colon={false}>
            <Descriptions.Item label='Mã đơn hàng' contentStyle={{ fontWeight: 500 }}>
              <Typography.Text style={{ color: theme.useToken().token.colorPrimary }}>
                {order.order_no}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label='Địa chỉ nhận hàng'>
              {`${order.order_delivery.name}, ${order.order_delivery.phone}`}
              <br />
              {`${order.order_delivery.street}, ${order.order_delivery.district}, ${order.order_delivery.ward}, ${order.order_delivery.city}`}
            </Descriptions.Item>
            <Descriptions.Item label='Ghi chú'>
              {order.order_delivery.note ?? 'Không có ghi chú'}
            </Descriptions.Item>
            {order.referrer && (
              <Descriptions.Item label='Người giới thiệu'>
                {order.referrer.name} ({order.referrer.code})
              </Descriptions.Item>
            )}
          </Descriptions>
        </ConfigProvider>
      </OrderInformationWrapper>
    </SectionContent>
  );
};

export default OrderInformation;
