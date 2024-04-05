import { PaginationProps } from 'antd';

const PaginationShowTotal: PaginationProps['showTotal'] = (total) => `Tổng cộng ${total} mục`;

export default PaginationShowTotal;
