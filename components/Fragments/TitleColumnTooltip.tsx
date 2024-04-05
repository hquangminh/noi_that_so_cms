import { generate } from '@ant-design/colors';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Space, Tooltip, theme } from 'antd';

type Props = { title: string; tooltip: string };

const TitleColumnTooltip = ({ title, tooltip }: Props) => {
  const { token } = theme.useToken();
  const colors = generate(token.colorPrimary);

  return (
    <Space>
      {title}
      <Tooltip title={tooltip}>
        <InfoCircleOutlined style={{ color: colors.at(3) }} />
      </Tooltip>
    </Space>
  );
};

export default TitleColumnTooltip;
