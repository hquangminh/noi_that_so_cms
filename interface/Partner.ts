export enum PartnerStatus {
  NEW = 1,
  APPROVED = 2,
  REJECT = 3,
}

export type PartnerType = {
  id: number;
  name: string;
  logo?: string;
  phone_number: string;
  created_at: string;
};

export type PartnerDetail = PartnerType & {
  email: string;
  website?: string;
  registrant_name: string;
  status: PartnerStatus;
};
