import { useContext } from 'react';

import dayjs from 'dayjs';
import { ConfigProvider, Space, Timeline, Typography } from 'antd';

import { orderStatusLogs } from 'common/constants';

import { OrderContext } from './OrderProvider';

import { OrderChangeLogItem, OrderTypeLog } from 'interface/Order';

const OrderTimeline = () => {
  const { order } = useContext(OrderContext);
  const lastLogs = order.order_logs.at(0);

  return (
    <ConfigProvider theme={{ token: { fontSize: 12 } }}>
      <Timeline
        style={{ marginBlockStart: 20 }}
        mode='left'
        items={order.order_logs.map((item) => ({
          color: lastLogs?.id === item.id ? TimelineColor(item.type) : 'gray',
          children: TimelineItem(item),
        }))}
      />
    </ConfigProvider>
  );
};

export default OrderTimeline;

const TimelineItem = ({ type, note, created_at }: OrderChangeLogItem) => (
  <Space direction='vertical' size={0}>
    <Typography.Text strong>{orderStatusLogs[type].title}</Typography.Text>
    <Typography.Text type='secondary'>{orderStatusLogs[type].caption}</Typography.Text>
    {type === OrderTypeLog.CANCEL && <Typography.Text type='secondary'>Lý do: {note}</Typography.Text>}
    <Typography.Text type='secondary'>{dayjs(created_at).format('HH:mm DD/MM/YYYY')}</Typography.Text>
  </Space>
);

const TimelineColor = (type: OrderTypeLog) => {
  switch (type) {
    case OrderTypeLog.SUCCESS:
      return 'green';
    case OrderTypeLog.CANCEL:
      return 'red';
    default:
      return undefined;
  }
};
