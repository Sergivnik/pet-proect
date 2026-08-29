import { stockStore } from './stockStore.js';

export const stockReducer = (store = stockStore, action) => {
  switch (action.type) {
    case 'GET_STOCK_TRANSACTIONS_SUCCESS':
      return { ...store, stock_transactions: action.data };
    case 'GET_STOCK_TRANSACTIONS_REQUEST':
      return { ...store, status: 'LOADING' };
    case 'GET_STOCK_TRANSACTIONS_FAILURE':
      return { ...store, status: 'ERROR' };
    default:
      return store;
  }
};
