import { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import dayjs from 'dayjs';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Col, Descriptions, Image, Modal, Row, Space, Typography } from 'antd';

import { API_GetPartnerDetail } from 'graphql/partner/query';
import { API_PartnerReject } from 'graphql/partner/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import PartnerStatusTag from 'components/Pages/Partner/Status';
import PartnerRejectForm from 'components/Pages/Partner/RejectForm';
import PartnerApproveForm from 'components/Pages/Partner/ApproveForm';

import { PartnerDetail, PartnerStatus } from 'interface/Partner';

const PartnerViewContainer = () => {
  const { query } = useRouter();
  const [modal, contextHolder] = Modal.useModal();

  const [action, setAction] = useState<'reject' | 'approve'>();

  const { data, loading, refetch } = useQuery<{ partner: [PartnerDetail] }>(API_GetPartnerDetail, {
    variables: { id: query.partnerID },
    fetchPolicy: 'network-only',
  });
  const [onReject] = useMutation(API_PartnerReject, { onCompleted: refetch });

  const handleConfirmReject = () => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn từ chối yêu cầu của đối tác này không?',
      content: (
        <Typography.Text type='danger' italic>
          Sau khi từ chối bạn sẽ không thể thao tác với đối tác này nữa.
        </Typography.Text>
      ),
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          onReject({ variables: { id: data?.partner[0].id } }),
        ]),
    });
  };

  const ButtonAction = [
    <Row key='partner-action' justify='space-between'>
      <Col>
        <Button>
          <Link href='/partner'>Thoát</Link>
        </Button>
      </Col>
      <Col>
        <Space>
          {/* {data?.partner[0].status === PartnerStatus.APPROVED && (
            <Button danger onClick={handleConfirmReject}>
              Khóa
            </Button>
          )} */}
          {data?.partner[0].status === PartnerStatus.NEW && (
            <>
              <Button danger onClick={() => setAction('reject')}>
                Từ chối
              </Button>
              <Button type='primary' onClick={() => setAction('approve')}>
                Phê duyệt
              </Button>
            </>
          )}
        </Space>
      </Col>
    </Row>,
  ];

  return (
    <Fragment>
      <SectionContent
        loading={loading}
        title='Thông tin đối tác'
        actions={!loading ? ButtonAction : undefined}
      >
        <Descriptions>
          {data?.partner[0].logo && (
            <Descriptions.Item span={3} label='Logo thương hiệu'>
              <Image src={data.partner[0].logo} alt='' width='150px' />
            </Descriptions.Item>
          )}
          <Descriptions.Item label='Tên đối tác'>{data?.partner[0].name}</Descriptions.Item>
          <Descriptions.Item label='Số điện thoại'>{data?.partner[0].phone_number}</Descriptions.Item>
          <Descriptions.Item label='Email'>{data?.partner[0].email}</Descriptions.Item>
          {data?.partner[0].website && (
            <Descriptions.Item label='Website'>{data.partner[0].website}</Descriptions.Item>
          )}
          <Descriptions.Item label='Người đăng ký'>{data?.partner[0].registrant_name}</Descriptions.Item>
          <Descriptions.Item label='Ngày đăng ký'>
            {dayjs(data?.partner[0].created_at).format('hh:mm DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label='Trạng thái'>
            {data && <PartnerStatusTag status={data.partner[0].status} />}
          </Descriptions.Item>
        </Descriptions>
      </SectionContent>

      {data && (
        <Fragment>
          <PartnerApproveForm
            data={data.partner[0]}
            open={action === 'approve'}
            onClose={() => setAction(undefined)}
            onApproved={refetch}
          />
          <PartnerRejectForm
            data={data.partner[0]}
            open={action === 'reject'}
            onClose={() => setAction(undefined)}
            onFinish={refetch}
          />
        </Fragment>
      )}

      {contextHolder}
    </Fragment>
  );
};

export default PartnerViewContainer;
