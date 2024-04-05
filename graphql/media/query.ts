import { gql } from '@apollo/client';

export const API_GetMedia = gql`
  query {
    media {
      id
      fileUrl
      fileType
      fileName
      created_at
    }
  }
`;
