import { stockStore } from './stockStore.js';
import { ADD_DATA_SUCCESS, EDIT_DATA_SUCCESS } from '../../actions/editDataAction';

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
        id: action.dataServer.insertId,
      };
      return {
        ...store,
        stocks: [...store.stocks, newStock],
        status: null,
      };
    case EDIT_DATA_SUCCESS: {
      if (action.editTable === 'stocks') {
        let arrStocks = [...store.stocks];
        let indexStock = arrStocks.findIndex(stock => stock.id == action.newData.id);
        arrStocks[indexStock] = action.newData;
        return { ...store, stocks: arrStocks };
      }
    }
    default:
      return store;
  }
};
