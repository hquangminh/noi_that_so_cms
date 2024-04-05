import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useMutation } from '@apollo/client';
import { Button, Col, Form, FormProps, Modal, Row, Space } from 'antd';

import { API_AddPortfolio, API_DeletePortfolio, API_EditPortfolio } from 'graphql/portfolio/mutation';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';
import PortfolioFormGeneral from './General';
import PortfolioFormSeo from './Seo';
import * as handleNotification from '../Notification';

import { PortfolioDetail } from 'interface/Portfolio';

type Props = { type?: 'add' | 'edit'; data?: PortfolioDetail };

const PortfolioForm = ({ type = 'add', data }: Props) => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [addPortfolio] = useMutation(API_AddPortfolio);
  const [editPortfolio] = useMutation(API_EditPortfolio);
  const [deletePortfolio, { loading: deleting }] = useMutation(API_DeletePortfolio);

  const onAddPortfolio = async (values: any) => {
    try {
      setSubmitting(true);
      const { image, room, style, hashtags, ...otherField } = values;
      const body = {
        ...otherField,
        image: await s3Services.uploadFile(image[0].originFileObj),
        portfolio_rooms: { data: room.map((room_id: number) => ({ room_id })) },
        portfolio_styles: { data: style.map((style_id: number) => ({ style_id })) },
        portfolio_hashtags: hashtags
          ? { data: hashtags.map((hashtag_id: number) => ({ hashtag_id })) }
          : undefined,
      };
      await addPortfolio({ variables: { objects: body } });
      handleNotification.AddPortfolioSuccess();
      router.push('/portfolio');
    } catch (error) {
      handleNotification.AddPortfolioFail();
      setSubmitting(false);
    }
  };

  const onEditPortfolio = async (values: any) => {
    try {
      setSubmitting(true);
      const { image, room, style, hashtags, ...otherField } = values;
      const portfolio_id = data?.id;
      const body = {
        portfolioID: portfolio_id,
        portfolio: {
          ...otherField,
          image: image[0].originFileObj ? await s3Services.uploadFile(image[0].originFileObj) : undefined,
        },
        rooms: room.map((room_id: number) => ({ portfolio_id, room_id })),
        styles: style.map((style_id: number) => ({ portfolio_id, style_id })),
        hashtags: hashtags ? hashtags.map((hashtag_id: number) => ({ portfolio_id, hashtag_id })) : undefined,
      };
      await editPortfolio({ variables: body });
      handleNotification.EditPortfolioSuccess();
      router.push('/portfolio');
    } catch (error) {
      handleNotification.EditPortfolioFail();
      setSubmitting(false);
    }
  };

  const onSubmit = (values: any) => {
    if (type === 'add') onAddPortfolio(values);
    if (type === 'edit') onEditPortfolio(values);
  };

  const handleConfirmDelete = () => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa Portfolio này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          deletePortfolio({ variables: { id: data?.id } }),
        ])
          .then(() => {
            handleNotification.DeletePortfolioSuccess();
            router.push('/portfolio');
          })
          .catch(() => handleNotification.DeletePortfolioFail()),
    });
  };

  const formProps: FormProps = {
    autoComplete: 'off',
    labelCol: { flex: '110px' },
    validateMessages: {
      required: 'Vui lòng nhập ${label}!',
      whitespace: '${label} không thể chứa mỗi khoảng trắng',
      types: { url: 'Vui lòng nhập url hợp lệ!' },
    },
    initialValues: data
      ? {
          ...data,
          image: [{ url: data.image }],
          room: data.portfolio_rooms.map((i) => i.room_id),
          style: data.portfolio_styles.map((i) => i.style_id),
          hashtags: data.portfolio_hashtags.map((i) => i.hashtag_id),
        }
      : undefined,
    onFinish: onSubmit,
  };

  return (
    <Form {...formProps}>
      <PortfolioFormGeneral imageInit={data?.image} />
      <PortfolioFormSeo />

      <SectionContent size='small' fixedBottom>
        <Row justify='space-between'>
          <Col>
            {type === 'edit' && (
              <Button danger disabled={submitting} loading={deleting} onClick={handleConfirmDelete}>
                Xóa
              </Button>
            )}
          </Col>
          <Col>
            <Space>
              <Button disabled={submitting || deleting}>
                <Link href='/portfolio'>Thoát</Link>
              </Button>
              <Button type='primary' htmlType='submit' loading={submitting}>
                Lưu
              </Button>
            </Space>
          </Col>
        </Row>
      </SectionContent>

      {contextHolder}
    </Form>
  );
};

export default PortfolioForm;
