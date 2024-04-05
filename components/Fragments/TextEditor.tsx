import React, { memo, useMemo } from 'react';

import dynamic from 'next/dynamic';

import styled from 'styled-components';

const JoditEditor: any = dynamic(() => import('jodit-react'), { ssr: false });

type Props = {
  value?: string;
  height?: number | string;
  onChange: (value?: string) => void;
};

const TextEditor = (props: Props) => {
  const { value, height, onChange } = props;

  const config = useMemo(() => {
    return {
      height: height || 200,
      toolbarButtonSize: 'small',
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_clear_html',
    };
  }, [height]);

  return (
    <JoditContainer>
      <JoditEditor
        value={value}
        config={config}
        onBlur={(value: string) => {
          const isHasImage = /\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/.test(value);
          const isHasContent = value?.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, '').length > 0;
          const content = isHasImage || isHasContent ? value : undefined;
          onChange(!content && value.includes('&nbsp;') ? '   ' : content);
        }}
      />
    </JoditContainer>
  );
};

export default memo(TextEditor);

const JoditContainer = styled.div`
  .jodit-workplace {
    max-height: 100% !important;
    overflow: hidden;
    overflow-y: auto;
  }

  .jodit-container {
    .jodit-wysiwyg {
      background-color: #fff;
      overflow-y: scroll;
    }

    &.jodit-jodit_fullsize_true {
      .jodit-wysiwyg {
        max-height: 100%;
      }
    }
  }
`;
