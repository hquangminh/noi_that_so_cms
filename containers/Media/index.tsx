import { Fragment, useState } from 'react';

import { useQuery } from '@apollo/client';
import { CopyOutlined, CloudUploadOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Modal, Row } from 'antd';

import { API_GetMedia } from 'graphql/media/query';

import SectionContent from 'components/Fragments/SectionContent';
import MediaSearch from 'components/Pages/Media/Search';

import { MediaItem } from 'interface/Media';
import { styled } from 'styled-components';
import { copyToClipboard } from 'functions';
import MediaPreview from 'components/Pages/Media/Preview';

const MediaCard = styled(Card)`
  ul.ant-card-actions {
    & > li {
      margin: 10px 0 !important;
    }
  }
`;

const MediaContainer = () => {
  const [preview, setPreview] = useState<MediaItem>();

  const { data } = useQuery<{ media: MediaItem[] }>(API_GetMedia);

  const ButtonUpload = (
    <Button
      type='primary'
      icon={<CloudUploadOutlined />}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      Tải lên
    </Button>
  );

  return (
    <Fragment>
      <MediaSearch />

      <SectionContent title='Danh sách tệp' extra={ButtonUpload}>
        <Row>
          {data?.media.map((file) => (
            <Col flex='none' key={file.id}>
              <MediaCard
                cover={<Image src={file.fileUrl} alt='' style={{ width: 200 }} preview={false} />}
                actions={[
                  <CopyOutlined key='copy' onClick={() => copyToClipboard(file.fileUrl)} />,
                  <EyeOutlined key='view' onClick={() => setPreview(file)} />,
                ]}
                bodyStyle={{ padding: 0 }}
              />
            </Col>
          ))}
        </Row>
      </SectionContent>

      <MediaPreview data={preview} onClose={() => setPreview(undefined)} />
    </Fragment>
  );
};

export default MediaContainer;
