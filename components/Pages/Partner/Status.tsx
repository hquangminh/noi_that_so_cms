import { Tag } from 'antd';
import { PartnerStatus } from 'interface/Partner';

const PartnerStatusTag = ({ status }: { status: PartnerStatus }) => {
  switch (status) {
    case PartnerStatus.APPROVED:
      return <Tag color='success'>Đã phê duyệt</Tag>;
    case PartnerStatus.REJECT:
      return <Tag color='error'>Đã từ chối</Tag>;
    default:
      return <Tag color='warning'>Chờ xử lý</Tag>;
  }
};

export default PartnerStatusTag;
