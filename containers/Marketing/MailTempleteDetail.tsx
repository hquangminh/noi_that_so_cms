import { useRef, useState } from 'react';
import { useRouter } from 'next/router';

import dayjs from 'dayjs';
import { styled } from 'styled-components';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Spin, Typography, notification } from 'antd';
import { EditorRef, EmailEditor } from 'react-email-editor';

import { isUnlayerEmpty } from 'functions';
import { API_EmailMarketingDetail } from 'graphql/email-marketing/query';
import { API_EditEmailMarketing } from 'graphql/email-marketing/mutation';
import { APT_GetSubscribe } from 'graphql/subscribe/query';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';

import { AccountType } from 'interface/Account';
import { EmailMarketing, EmailMarketingStatus } from 'interface/Marketing';

const Wrapper = styled.div`
  .ant-spin {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 40px);
    height: calc(100vh - 208px);
  }
`;
const EditorWrapper = styled.div`
  #marketing-email-editor {
    height: calc(100vh - 208px);
  }
  iframe {
    min-width: unset !important;
  }
`;

const MarketingMailTemplateDetailContainer = ({ auth }: { auth: AccountType }) => {
  const { push, query } = useRouter();

  const { data, loading } = useQuery<{ email_marketing: EmailMarketing[] }>(API_EmailMarketingDetail, {
    variables: { id: query.templateID },
    fetchPolicy: 'network-only',
  });
  const [getEmailSubscribe] = useLazyQuery<{ subscribe: { email: string }[] }>(APT_GetSubscribe);
  const [onSaveTemplate] = useMutation(API_EditEmailMarketing);

  const emailEditorRef = useRef<EditorRef>(null);

  const onReady = () => {
    if (!loading) emailEditorRef.current?.editor?.loadDesign(data?.email_marketing[0].design as any);
  };

  const onSubmit = async (isSend?: boolean) => {
    try {
      emailEditorRef.current?.editor?.exportHtml(async (dataEditor) => {
        const { design, html } = dataEditor;
        if (isUnlayerEmpty(design))
          return notification.error({
            key: 'email-content-empty',
            message: 'Không thể thực hiện thao tác',
            description: 'Nội dung email không được để trống',
          });
        else {
          const designValues: Record<string, any> | undefined = design.body.values as Record<string, any>;
          await onSaveTemplate({
            variables: {
              id: data?.email_marketing[0].id,
              data: { name: designValues?.preheaderText, design, html },
            },
          });
          if (isSend) {
            const { data: subscribeData } = await getEmailSubscribe();
            if (subscribeData) {
              await s3Services.sendMail({
                senderEmail: 'order@vrstyler.com',
                receiverEmail: subscribeData.subscribe.map((i) => i.email),
                title: 'Noi that so',
                content: html,
              });

              await onSaveTemplate({ variables: { id: data?.email_marketing[0].id, data: { status: 2 } } });
              push('/marketing/email');
            }
          }
        }
      });
    } catch (error) {}
  };

  const SectionContentTitle = (
    <Space split={<Divider type='vertical' />} style={{ fontWeight: 400 }}>
      <Typography>
        <Typography.Text type='secondary'>Người tạo: </Typography.Text>
        <Typography.Text>{data?.email_marketing[0].creator}</Typography.Text>
      </Typography>
      <Typography>
        <Typography.Text type='secondary'>Ngày tạo: </Typography.Text>
        <Typography.Text>
          {dayjs(data?.email_marketing[0].created_at).format('hh:mm DD/MM/YYYY')}
        </Typography.Text>
      </Typography>
    </Space>
  );

  const SectionContentExtra =
    data?.email_marketing[0].status === EmailMarketingStatus.NEW ? (
      <Space>
        <Button icon={<SaveOutlined />} onClick={() => onSubmit()}>
          Lưu bản nháp
        </Button>
        <Button type='primary' icon={<SendOutlined />} onClick={() => onSubmit(true)}>
          Gửi Mail
        </Button>
      </Space>
    ) : undefined;

  return (
    <SectionContent title={SectionContentTitle} extra={SectionContentExtra}>
      <Wrapper>
        {loading && <Spin />}
        {data?.email_marketing[0].status === EmailMarketingStatus.NEW ? (
          <EditorWrapper>
            <EmailEditor
              ref={emailEditorRef}
              editorId='marketing-email-editor'
              options={{ displayMode: 'email' }}
              locale='vi-VN'
              onReady={onReady}
              style={{ opacity: !loading ? 1 : 0 }}
            />
          </EditorWrapper>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: data?.email_marketing[0].html || '' }} />
        )}
      </Wrapper>
    </SectionContent>
  );
};

export default MarketingMailTemplateDetailContainer;
