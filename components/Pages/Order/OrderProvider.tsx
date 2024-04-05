import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';

import { isArrayEmpty } from 'functions';

import { OrderActionName, OrderDetail, OrderStatus } from 'interface/Order';

type OrderContextValue = {
  order: OrderDetail;
  updateOrder: Dispatch<SetStateAction<OrderDetail>>;
  openEditQuantity: boolean;
  onChangeOpenEditQuantity: Dispatch<SetStateAction<boolean>>;
  openAddProduct: boolean;
  onChangeOpenAddProduct: Dispatch<SetStateAction<boolean>>;
  openCancelOrder: boolean;
  onChangeOpenCancelOrder: Dispatch<SetStateAction<boolean>>;
  actionProgress: OrderActionName | null;
  onChangeActionProgress: Dispatch<SetStateAction<OrderActionName | null>>;
  allowEditProduct: boolean;
  apiNotification: NotificationInstance;
};

export const OrderContext = createContext<OrderContextValue>({} as OrderContextValue);

const OrderProvider = ({ order: initOrder, children }: { order: OrderDetail; children: ReactNode }) => {
  const [apiNotification, notificationContextHolder] = notification.useNotification();

  const [order, updateOrder] = useState<OrderDetail>(initOrder);
  const [openEditQuantity, onChangeOpenEditQuantity] = useState<boolean>(false);
  const [openAddProduct, onChangeOpenAddProduct] = useState<boolean>(false);
  const [openCancelOrder, onChangeOpenCancelOrder] = useState<boolean>(false);
  const [actionProgress, onChangeActionProgress] = useState<OrderActionName | null>(null);

  const allowEditProduct = [OrderStatus.PROCESSING, OrderStatus.SHIPPING, OrderStatus.SUCCESS].includes(
    order.status,
  );

  const value: OrderContextValue = {
    order,
    updateOrder,
    openEditQuantity,
    onChangeOpenEditQuantity,
    openAddProduct,
    onChangeOpenAddProduct,
    openCancelOrder,
    onChangeOpenCancelOrder,
    actionProgress,
    onChangeActionProgress,
    allowEditProduct,
    apiNotification,
  };

  if (isArrayEmpty(Object.keys(order))) return null;

  return (
    <OrderContext.Provider value={value}>
      {notificationContextHolder}
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
