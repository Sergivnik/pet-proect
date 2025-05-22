import { clientStore } from './clientStore.js';
import {
  GET_OWNER_LOGIST_REQUEST,
  GET_OWNER_LOGIST_SUCCESS,
  GET_OWNER_LOGIST_FAILURE,
} from '../actions/ownerLogistAction';

export const clientReducer = (store = clientStore, action) => {
  switch (action.type) {
    case GET_OWNER_LOGIST_REQUEST: {
      console.log('hi');
      return { ...store, status: 'REQUEST' };
    }
    case GET_OWNER_LOGIST_SUCCESS: {
      return {
        ...store,
        ownerLogist: action.data,
        status: null,
      };
    }
    case GET_OWNER_LOGIST_FAILURE: {
      return {
        ...store,
        status: null,
      };
    }
    default:
      return store;
  }
};
