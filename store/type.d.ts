import { AccountType } from 'interface/Account';

export type AppState = {
  web: AppStateWeb;
  auth?: AppStateAuth;
};

export type AppStateWeb = {
  visitedFirstTime: boolean;
  sidebarCollapsed?: boolean;
};

export type AppStateAuth = {
  me?: AccountType;
  token?: string;
};
