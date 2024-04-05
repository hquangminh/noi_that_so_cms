import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { theme } from 'antd';

const IconCheckOrUncheck = ({ checked }: { checked?: boolean }) => {
  const { token } = theme.useToken();

  return checked ? (
    <CheckCircleTwoTone twoToneColor='#52c41a' />
  ) : (
    <CloseCircleTwoTone twoToneColor={token.colorError} />
  );
};

export default IconCheckOrUncheck;
