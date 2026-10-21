import { stockStore } from './stockStore.js';
import { ADD_DATA_SUCCESS } from '../../actions/editDataAction';

export const stockReducer = (store = stockStore, action) => {
  switch (action.type) {
    case 'GET_STOCK_TRANSACTIONS_SUCCESS':
      return {
        ...store,
        stock_transactions: action.data.stock_transactions,
        stocks: action.data.stock,
        status: null,
      };
    case 'GET_STOCK_TRANSACTIONS_REQUEST':
      return { ...store, status: 'LOADING' };
    case 'GET_STOCK_TRANSACTIONS_FAILURE':
      return { ...store, status: 'ERROR' };
    case ADD_DATA_SUCCESS:
      console.log('ADD_DATA_SUCCESS', action.data);
      const newStock = {
        ...action.data,
        idStock: action.dataServer.insertId,
      };
      return {
        ...store,
        stocks: [...store.stocks, newStock],
        status: null,
      };
    default:
      return store;
  }
};
