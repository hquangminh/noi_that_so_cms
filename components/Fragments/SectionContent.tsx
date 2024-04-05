import { useEffect, useState } from 'react';
import { Card, CardProps } from 'antd';
import { css, styled } from 'styled-components';

const CardWrapper = styled(Card)<{ $fixedBottom?: boolean }>`
  ${({ $fixedBottom }) => {
    if ($fixedBottom) {
      return css`
        position: sticky !important;
        bottom: 0;
        z-index: 10;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
          0 2px 4px 0 rgba(0, 0, 0, 0.02) !important;
      `;
    }
  }}
  border-top:1px solid #f5f5f5;

  &:not(:last-child) {
    margin-bottom: 16px;
  }
  &:not(:has(~ .ant-card)) {
    margin-top: 16px !important;
  }
  .ant-tabs {
    .ant-tabs-nav:before {
      display: none;
    }
    .ant-tabs-tab {
      padding: 16px 0;
    }
  }
  .ant-card-actions {
    padding: 0 24px !important;
    & > li > span {
      cursor: auto !important;
    }
  }
`;

type Props = CardProps & { fixedBottom?: boolean };

const SectionContent = (props: Props) => {
  const { fixedBottom, ...cardProps } = props;

  const [isFixedBottom, setFixedBottom] = useState<boolean>(false);

  useEffect(() => {
    if (fixedBottom) {
      const AntLayout = document.querySelector('.ant-layout.ant-layout-has-sider > section.ant-layout');
      if (AntLayout) {
        const handleScroll = () => {
          const { scrollHeight, scrollTop, clientHeight } = AntLayout;
          setFixedBottom(scrollHeight - scrollTop - clientHeight > 20);
        };
        AntLayout.addEventListener('scroll', handleScroll, { passive: true });
        return () => AntLayout.removeEventListener('scroll', handleScroll);
      }
    }
  }, [fixedBottom]);

  return (
    <CardWrapper {...cardProps} bordered={false} tabProps={{ size: 'middle' }} $fixedBottom={fixedBottom}>
      {props.children}
    </CardWrapper>
  );
};

export default SectionContent;
