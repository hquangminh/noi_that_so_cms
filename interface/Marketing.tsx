export enum EmailMarketingStatus {
  'NEW' = 1,
  'SEND' = 2,
}

export type EmailMarketing = {
  id: number;
  name: string;
  design: JSON;
  html: string;
  status: EmailMarketingStatus;
  creator: string;
  auth_id: string;
  created_at: string;
};
