import { useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { styled } from 'styled-components';
import { useMutation } from '@apollo/client';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Space, Spin, notification } from 'antd';
import { EditorRef, EmailEditor } from 'react-email-editor';

import { isUnlayerEmpty } from 'functions';
import { API_AddEmailMarketing } from 'graphql/email-marketing/mutation';

import SectionContent from 'components/Fragments/SectionContent';

import { AccountType } from 'interface/Account';

const Wrapper = styled.div`
  .ant-spin {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 40px);
    height: calc(100vh - 207px);
  }
`;
const EditorWrapper = styled.div`
  #marketing-email-editor {
    height: calc(100vh - 207px);
  }
  iframe {
    min-width: unset !important;
  }
`;

const MarketingAddMailTemplateContainer = ({ auth }: { auth: AccountType }) => {
  const { push } = useRouter();

  const [loaded, setLoaded] = useState<boolean>(false);

  const [onSaveTemplate] = useMutation(API_AddEmailMarketing);

  const emailEditorRef = useRef<EditorRef>(null);

  const onSubmit = async (isSend?: boolean) => {
    try {
      emailEditorRef.current?.editor?.exportHtml(async (data) => {
        const { design, html } = data;

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
              data: {
                auth_id: auth.id,
                creator: auth.first_name + ' ' + auth.last_name,
                name: designValues?.preheaderText,
                design,
                html,
                status: 1,
              },
            },
          });
          push('/marketing/email');
        }
      });
    } catch (error) {}
  };

  return (
    <SectionContent
      extra={
        <Space>
          <Button icon={<SaveOutlined />} onClick={() => onSubmit()}>
            Lưu bản nháp
          </Button>
          <Button type='primary' icon={<SendOutlined />} onClick={() => onSubmit(true)}>
            Gửi Mail
          </Button>
        </Space>
      }
    >
      <Wrapper>
        {!loaded && <Spin />}
        <EditorWrapper>
          <EmailEditor
            ref={emailEditorRef}
            editorId='marketing-email-editor'
            options={{ displayMode: 'email' }}
            locale='vi-VN'
            onReady={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0 }}
          />
        </EditorWrapper>
      </Wrapper>
    </SectionContent>
  );
};

export default MarketingAddMailTemplateContainer;
