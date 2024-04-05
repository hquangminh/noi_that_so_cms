import { PresetColorType, PresetStatusColorType } from 'antd/es/_util/colors';
import { LiteralUnion } from 'antd/es/_util/type';
import { HashtagType } from 'interface/Category';

import { OrderStatus, OrderTypeLog } from 'interface/Order';

export const MaxIntegerPostgreSQL = 2147483647;

export const regex = {
  URL: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
  Email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

export const orderStatus: Record<OrderStatus, string> = {
  1: 'Mới',
  2: 'Đang xử lý',
  3: 'Đang chuẩn bị hàng',
  4: 'Đang giao hàng',
  5: 'Đã hoàn tất',
  6: 'Đã hủy',
};

interface OrderStatusLogsItem {
  title: string;
  caption: string;
  status: string;
  badge: PresetStatusColorType;
  tag: LiteralUnion<PresetColorType | PresetStatusColorType>;
}
export const orderStatusLogs: Record<OrderTypeLog, OrderStatusLogsItem> = {
  1: {
    title: 'Đơn đã đặt',
    caption: 'Đơn hàng đã được đặt',
    status: 'Mới',
    badge: 'default',
    tag: 'gold',
  },
  2: {
    title: 'Đang xử lý',
    caption: 'Đơn hàng đang được xử lý',
    status: 'Đang xử lý',
    badge: 'processing',
    tag: 'processing',
  },
  3: {
    title: 'Chuẩn bị hàng',
    caption: 'Nhà bán hàng đang chuẩn bị hàng',
    status: 'Đang chuẩn bị',
    badge: 'processing',
    tag: 'processing',
  },
  4: {
    title: 'Đang vận chuyển',
    caption: 'Đơn hàng đang trên đường giao đến người mua',
    status: 'Đang giao hàng',
    badge: 'warning',
    tag: 'cyan',
  },
  5: {
    title: 'Đã hoàn thành',
    caption: 'Đơn hàng được giao thành công',
    status: 'Đã hoàn tất',
    badge: 'success',
    tag: 'success',
  },
  6: {
    title: 'Đã hủy',
    caption: 'Đơn hàng đã bị hủy',
    status: 'Đã hủy',
    badge: 'error',
    tag: 'error',
  },
};

export const hashtagType: Record<HashtagType, string> = {
  1: 'Sản phẩm',
  2: 'Ý tưởng thiết kế',
  3: 'Bài viết',
};
