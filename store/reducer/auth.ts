import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, AppStateAuth } from 'store/type';
import { AccountType } from 'interface/Account';

const initialState: AppStateAuth = {};

export const slice = createSlice({
  name: 'webRedux',
  initialState,
  reducers: {
    SetAuth: (state, action: PayloadAction<{ me: AccountType; token: string }>) => {
      state.me = action.payload.me;
      state.token = action.payload.token;
    },
  },
});

// Action creators are generated for each case reducer function
export const { SetAuth } = slice.actions;

export const getMe = (state: AppState) => state.auth?.me;

export default slice.reducer;
