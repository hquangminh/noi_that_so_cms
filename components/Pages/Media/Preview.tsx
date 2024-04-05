import dayjs from 'dayjs';
import { Divider, Image, Modal, ModalProps, Space, Typography } from 'antd';
import { MediaItem } from 'interface/Media';

type Props = { data?: MediaItem; onClose?: () => void };

const MediaPreview = ({ data, onClose }: Props) => {
  const modalProps: ModalProps = {
    open: typeof data !== 'undefined',
    title: (
      <Space split={<Divider type='vertical' />}>
        <Typography.Text>{data?.fileName}</Typography.Text>
        <Typography.Text type='secondary'>{data?.fileType}</Typography.Text>
        <Typography.Text type='secondary' italic>
          {dayjs(data?.created_at).format('hh:mm DD/MM/YYYY')}
        </Typography.Text>
      </Space>
    ),
    centered: true,
    footer: null,
    width: 900,
    onCancel: onClose,
  };

  return (
    <Modal {...modalProps}>
      <Image src={data?.fileUrl} alt='' preview={false} />
    </Modal>
  );
};

export default MediaPreview;
