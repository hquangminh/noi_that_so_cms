import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, AppStateWeb } from 'store/type';

const initialState: AppStateWeb = {
  visitedFirstTime: true,
};

export const slice = createSlice({
  name: 'webRedux',
  initialState,
  reducers: {
    ClientVisited: (state) => {
      state.visitedFirstTime = false;
    },
    ChangeSidebarCollapse: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ClientVisited, ChangeSidebarCollapse } = slice.actions;

export const detectClientVisited = (state: AppState) => state.web.visitedFirstTime;
export const selectCollapse = (state: AppState) => state.web.sidebarCollapsed;

export default slice.reducer;
