import axios from 'axios';
import { URL } from '../middlewares/initialState';

export const GET_STOCK_TRANSACTIONS_SUCCESS = 'GET_STOCK_TRANSACTIONS_SUCCESS';
export const GET_STOCK_TRANSACTIONS_REQUEST = 'GET_STOCK_TRANSACTIONS_REQUEST';
export const GET_STOCK_TRANSACTIONS_FAILURE = 'GET_STOCK_TRANSACTIONS_FAILURE';

export const getStockTransactions = () => {
  return dispatch => {
    dispatch(getStockTransactionsRequest());
    axios
      .create({ withCredentials: true })
      .get(URL + '/stock_transactions')
      .then(res => {
        dispatch(getStockTransactionsSuccess(res.data));
      })
      .catch(e => {
        console.log(e);
        dispatch(getStockTransactionsFailure());
      });
  };
};

export const getStockTransactionsRequest = () => ({
  type: GET_STOCK_TRANSACTIONS_REQUEST,
});

export const getStockTransactionsSuccess = data => ({
  type: GET_STOCK_TRANSACTIONS_SUCCESS,
  data,
});

export const getStockTransactionsFailure = () => ({
  type: GET_STOCK_TRANSACTIONS_FAILURE,
});
