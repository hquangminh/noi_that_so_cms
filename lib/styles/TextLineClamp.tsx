import { styled } from 'styled-components';

const TextLineClamp = styled.p<{ line?: number }>`
  display: -webkit-box;
  -webkit-line-clamp: ${({ line }) => line || 1};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export default TextLineClamp;
