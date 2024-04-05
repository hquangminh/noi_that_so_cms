import { useState } from 'react';

import { styled } from 'styled-components';
import { useQuery } from '@apollo/client';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Select, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

import { beforeUpload, getBase64 } from 'functions';
import { regex } from 'common/constants';
import { API_GetHashtag, API_GetRoomType, API_GetStyleType } from 'graphql/category/query';

import SectionContent from 'components/Fragments/SectionContent';

import { CategoryRoomType, CategoryStyleType, HashtagItem } from 'interface/Category';

const Wrapper = styled.div`
  .thumbnail_upload .ant-upload.ant-upload-select {
    margin: 0 !important;
    border-radius: ${({ theme }) => theme.borderRadius} !important;
    overflow: hidden;
    &:has(img) {
      border-style: solid !important;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .ant-form-item-has-error .ant-upload.ant-upload-select {
    border-color: ${({ theme }) => theme.colorError} !important;
  }
`;

type Props = { imageInit?: string };

const PortfolioFormGeneral = ({ imageInit }: Props) => {
  const form = Form.useFormInstance();

  const [image, setImage] = useState<string | undefined>(imageInit);

  const { loading: fetchingRoom, data: room } = useQuery<{ room_type: CategoryRoomType[] }>(API_GetRoomType, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const { loading: fetchingStyle, data: style } = useQuery<{ style_type: CategoryStyleType[] }>(
    API_GetStyleType,
    { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true },
  );
  const { loading: fetchHashtag, data: hashtag } = useQuery<{ hashtag: HashtagItem[] }>(API_GetHashtag, {
    variables: { filter: { type: { _eq: 2 } } },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const onCrop = async (file: any) => {
    form.setFieldValue('image', [{ ...file, originFileObj: file }]);
    setImage(await getBase64(file));
  };

  return (
    <SectionContent title='Thông tin cơ bản'>
      <Wrapper>
        <Form.Item
          name='image'
          label='Hình ảnh'
          rules={[{ required: true, message: 'Vui lòng tải lên Hình ảnh!' }]}
          valuePropName='fileList'
        >
          <ImgCrop
            modalTitle='Cắt hình ảnh'
            fillColor='transparent'
            beforeCrop={(file) => beforeUpload(file, undefined, 'upload-crop')}
            onModalOk={onCrop}
          >
            <Upload
              className='thumbnail_upload'
              listType='picture-circle'
              showUploadList={false}
              maxCount={1}
              accept='image/*'
            >
              {image ? <img src={image} alt='' /> : <UploadOutlined style={{ fontSize: 20 }} />}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item name='name' label='Tên Portfolio' rules={[{ required: true }, { whitespace: true }]}>
          <Input maxLength={120} showCount />
        </Form.Item>

        <Form.Item name='room' label='Phòng' rules={[{ required: true, message: 'Vui lòng chọn Phòng!' }]}>
          <Select
            mode='multiple'
            loading={fetchingRoom}
            allowClear
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) || false
            }
            options={room?.room_type.map((i) => ({ label: i.name, value: i.id }))}
          />
        </Form.Item>

        <Form.Item
          name='style'
          label='Phong cách'
          rules={[{ required: true, message: 'Vui lòng chọn Phong cách!' }]}
        >
          <Select
            mode='multiple'
            loading={fetchingStyle}
            allowClear
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) || false
            }
            options={style?.style_type.map((i) => ({ label: i.name, value: i.id }))}
          />
        </Form.Item>

        <Form.Item
          name='portfolio_link'
          label='Portfolio Link'
          rules={[
            { required: true, message: 'Vui lòng nhập liên kết Archisketch Portfolio!' },
            { pattern: regex.URL, message: 'Vui lòng nhập URL hợp lệ!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name='hashtags' label='Hashtag'>
          <Select
            mode='multiple'
            loading={fetchHashtag}
            allowClear
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase()) || false
            }
            options={hashtag?.hashtag.map((i) => ({ label: i.name, value: i.id }))}
          />
        </Form.Item>
      </Wrapper>
    </SectionContent>
  );
};

export default PortfolioFormGeneral;
