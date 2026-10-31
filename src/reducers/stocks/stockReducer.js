import { stockStore } from './stockStore.js';
import { ADD_DATA_SUCCESS, EDIT_DATA_SUCCESS } from '../../actions/editDataAction';

export const stockReducer = (store = stockStore, action) => {
  switch (action.type) {
    case 'GET_STOCK_TRANSACTIONS_SUCCESS':
      console.log('GET_STOCK_TRANSACTIONS_SUCCESS', action.data);
      return {
        ...store,
        stock_transactions: action.data.stock_transactions,
        stocks: action.data.stock,
        stock_dividends: action.data.stock_dividends || [],
        status: null,
      };
    case 'GET_STOCK_TRANSACTIONS_REQUEST':
      return { ...store, status: 'LOADING' };
    case 'GET_STOCK_TRANSACTIONS_FAILURE':
      return { ...store, status: 'ERROR' };
    case ADD_DATA_SUCCESS: {
      console.log('ADD_DATA_SUCCESS', action.data);
      if (action.editTable === 'stocks') {
        const newStock = {
          ...action.data,
          id: action.dataServer.insertId,
        };
        return {
          ...store,
          stocks: [...store.stocks, newStock],
          status: null,
        };
      }
      if (action.editTable === 'stock_transactions') {
        const newTransaction = {
          ...action.data,
          id: action.dataServer.insertId,
        };
        return {
          ...store,
          stock_transactions: [...store.stock_transactions, newTransaction],
          status: null,
        };
      }
      if (action.editTable === 'stock_dividends') {
        const newDividend = {
          ...action.data,
          id: action.dataServer.insertId,
        };
        return {
          ...store,
          stock_dividends: [...store.stock_dividends, newDividend],
          status: null,
        };
      }
    }
    case EDIT_DATA_SUCCESS: {
      console.log('EDIT_DATA_SUCCESS', action.newData);
      if (action.editTable === 'stocks') {
        let arrStocks = [...store.stocks];
        let indexStock = arrStocks.findIndex(stock => stock.id == action.newData.id);
        arrStocks[indexStock] = action.newData;
        return { ...store, stocks: arrStocks };
      }
      if (action.editTable === 'stock_transactions') {
        let arrTransactions = [...store.stock_transactions];
        let indexTransaction = arrTransactions.findIndex(
          transaction => transaction.id == action.newData.id
        );
        arrTransactions[indexTransaction] = action.newData;
        arrTransactions[indexTransaction].total_amount =
          action.newData.quantity * action.newData.price + action.newData.commission;
        return { ...store, stock_transactions: arrTransactions };
      }
      if (action.editTable === 'stock_dividends') {
        let arrDividends = [...store.stock_dividends];
        let indexDividend = arrDividends.findIndex(item => item.id == action.newData.id);
        arrDividends[indexDividend] = action.newData;
        return { ...store, stock_dividends: arrDividends };
      }
    }
    default:
      return store;
  }
};
