import { AccountType } from './Account';

export type PageProps = {
  auth: AccountType & { token: string };
};

export type GraphQlAggregate<T> = { aggregate: T };
export type AggregateCount = { count: number };
export type AggregateSum<T> = { sum: T };
