import { useMutation } from '@apollo/client';
import { Divider, Form, Input, Modal, ModalProps, Typography } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { partnerReject } from 'lib/email-template';
import { API_PartnerReject } from 'graphql/partner/mutation';
import s3Services from 'services/s3-services';

import { RejectPartnerFailure, RejectPartnerSuccess } from './Notification';
import NotExecutedNotification from 'components/Fragments/NotExecutedNotification';

import { PartnerDetail, PartnerType } from 'interface/Partner';

type Props = { data: PartnerDetail; open: boolean; onClose: () => void; onFinish: () => void };

const PartnerRejectForm = ({ data, open, onClose, onFinish }: Props) => {
  const [form] = Form.useForm();

  const [onReject, { loading }] = useMutation<{ update_partner?: { returning: PartnerType[] } }>(
    API_PartnerReject,
  );

  const onSubmit = async ({ note }: { note: string }) => {
    try {
      await onReject({ variables: { id: data.id, note } }).then(({ data: dataReject }) => {
        if (dataReject?.update_partner && dataReject.update_partner.returning.length > 0) {
          s3Services.sendMail({
            senderEmail: 'orders@vrstyler.com',
            receiverEmail: data.email,
            title: 'Từ chối yêu cầu trở thành đối tác của Nội Thất Số',
            content: partnerReject
              .replace('{{note}}', note)
              .replace('{{registrant_name}}', data.registrant_name),
          });
          onFinish();
          RejectPartnerSuccess();
        } else NotExecutedNotification();
      });
      onClose();
    } catch (error) {
      handleErrorCatch(error, RejectPartnerFailure);
    }
  };

  const modalProps: ModalProps = {
    open,
    title: 'Từ chối đối tác',
    closable: false,
    maskClosable: false,
    destroyOnClose: true,
    okText: 'Xác nhận',
    okButtonProps: { loading },
    cancelButtonProps: { disabled: loading },
    onCancel: onClose,
    onOk: form.submit,
    afterClose: () => form.resetFields(),
  };

  return (
    <Modal {...modalProps}>
      <Typography.Text type='secondary' italic>
        Sau khi từ chối bạn sẽ không thể thao tác với yêu cầu này nữa.
      </Typography.Text>
      <Divider />
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Form.Item
          name='note'
          label='Lý do từ chối'
          rules={[
            { required: true },
            { whitespace: true, message: 'Lý do từ chối không thể chứa mỗi khoảng trắng' },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 5 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PartnerRejectForm;
