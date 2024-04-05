import { AggregateCount, AggregateSum, GraphQlAggregate } from './Global';
import { ProductType } from './Product';
import { ReferrerType } from './Referrer';

export enum OrderStatus {
  NEW = 1,
  PROCESSING = 2,
  PREPARING = 3,
  SHIPPING = 4,
  SUCCESS = 5,
  CANCEL = 6,
}

export enum OrderStatusKey {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  PREPARING = 'PREPARING',
  SHIPPING = 'SHIPPING',
  SUCCESS = 'SUCCESS',
  CANCEL = 'CANCEL',
}

export enum OrderTypeLog {
  NEW = 1,
  PROCESSING = 2,
  PREPARING = 3,
  SHIPPING = 4,
  SUCCESS = 5,
  CANCEL = 6,
}

export enum OrderActionName {
  CHANGE_QUANTITY = 'CHANGE_QUANTITY',
  CHANGE_STATUS = 'CHANGE_STATUS',
}

export type OrderDelivery = {
  name: string;
  phone: string;
  email: string;
  street: string;
  district: string;
  ward: string;
  city: string;
  note?: string;
};

export type OrderProductItem = {
  id: number;
  product_id: number;
  variation_id: number;
  purchase_quantity: number;
  delivery_quantity: number;
  product_info: {
    name: string;
    image: string;
    price: number;
    variation: string | null;
  };
  product: ProductType;
};

export type OrderChangeLogItem = {
  id: number;
  type: OrderTypeLog;
  note: string | null;
  created_at: string;
};

export type OrderNoteItem = {
  id: number;
  note: string;
  created_at: string;
  updated_at?: string;
};

export type OrderType = {
  id: number;
  order_no: string;
  amount: number;
  note?: string;
  status: OrderStatus;
  created_at: string;
  order_delivery: Pick<OrderDelivery, 'name'>;
  order_products: OrderProductItem[];
  products_aggregate: GraphQlAggregate<AggregateCount & AggregateSum<{ purchase_quantity: number }>>;
  products_update_aggregate: GraphQlAggregate<AggregateCount & AggregateSum<{ delivery_quantity: number }>>;
};

export type OrderDetail = OrderType & {
  order_delivery: OrderDelivery;
  order_logs: OrderChangeLogItem[];
  order_notes: OrderNoteItem[];
  referrer?: ReferrerType;
};
