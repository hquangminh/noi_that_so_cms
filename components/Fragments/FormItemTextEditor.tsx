import { styled } from 'styled-components';
import { Form, FormItemProps } from 'antd';

import TinyEditor from './TinyEditor';

const FormItem = styled.div`
  .ant-form-item-has-error {
    .tox-tinymce {
      border-color: #ff4d4f;
    }
  }
`;

const FormItemTextEditor = (props: FormItemProps & { height?: number }) => {
  return (
    <FormItem>
      <Form.Item
        {...props}
        rules={[
          ...(props.rules ?? []),
          () => ({
            validator(_, value) {
              const valueSize = new Blob([value]).size;
              const valueSizeMb = Number(valueSize / 1000000).toFixed(1);
              if (valueSize > 500000)
                return Promise.reject(
                  new Error(`Chỉ hỗ trợ nội dung dưới 0.5mb. Hiện tại là ${valueSizeMb}mb.`),
                );
              return Promise.resolve();
            },
          }),
        ]}
        getValueFromEvent={(value) => value}
      >
        {/* <TextEditor height={props.height} onChange={() => undefined} /> */}
        <TinyEditor height={props.height} onChange={() => undefined} />
      </Form.Item>
    </FormItem>
  );
};

export default FormItemTextEditor;
