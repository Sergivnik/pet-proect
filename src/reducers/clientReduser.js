import { clientStore } from './clientStore.js';
import {
  GET_OWNER_LOGIST_REQUEST,
  GET_OWNER_LOGIST_SUCCESS,
  GET_OWNER_LOGIST_FAILURE,
} from '../actions/ownerLogistAction';
import { EDIT_DATA_SUCCESS, EDIT_DATA_FAILURE } from '../actions/editDataAction';

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
    case EDIT_DATA_SUCCESS: {
      // Проверяем, что изменения относятся к таблице ownerlogist
      if (action.editTable === 'ownerlogist') {
        const updatedOwnerLogist = store.ownerLogist.map(client =>
          client.id === action.newData.id ? action.newData : client
        );
        return {
          ...store,
          ownerLogist: updatedOwnerLogist,
          status: null,
        };
      }
      return store;
    }
    case EDIT_DATA_FAILURE: {
      return {
        ...store,
        status: 'ERROR',
      };
    }
    default:
      return store;
  }
};
