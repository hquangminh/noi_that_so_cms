import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import web from './reducer/web';
import auth from './reducer/auth';

const reducer = combineReducers({ web, auth });
const store = configureStore({ reducer });
export default store;
