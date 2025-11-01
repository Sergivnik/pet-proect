import axios from 'axios';
import { getDataRequest, URL } from '../middlewares/initialState';
export const ADD_ODER = 'ADD_ODER';
export const ADD_ODER_SUCCESS = 'ADD_ODER_SUCCESS';
export const ADD_ODER_FAILURE = 'ADD_ODER_FAILURE';
export const DEL_ODER = 'DEL_ODER';
export const DEL_ODER_SUCCESS = 'DEL_ODER_SUCCESS';
export const EDIT_ODER_SUCCESS = 'EDIT_ODER_SUCCESS';
export const EDIT_ODER_FAILURE = 'EDIT_ODER_FAILURE';
export const EDIT_ODER_NEW = 'EDIT_ODER_NEW';
export const EDIT_ODER_NEW_SUCCESS = 'EDIT_ODER_NEW_SUCCESS';
export const EDIT_ODER_NEW_FAILURE = 'EDIT_ODER_NEW_FAILURE';
export const SET_PROXY = 'SET_PROXY';
export const MAKE_PAYMENT_CUSTOMER = 'MAKE_PAYMENT_CUSTOMER';
export const MAKE_PAYMENT_CUSTOMER_SUCCESS = 'DATA::MAKE_PAYMENT_CUSTOMER_SUCCESS';
export const MAKE_PAYMENT_CUSTOMER_FAILURE = 'DATA::MAKE_PAYMENT_CUSTOMER_FAILURE';
export const DEL_PRINTED_MARK_SUCCESS = 'DEL_PRINTED_MARK_SUCCESS';
export const DEL_PRINTED_MARK_FAILURE = 'DEL_PRINTED_MARK_FAILURE';
export const ADD_ORDER_APP_SUCCESS = 'ADD_ORDER_APP_SUCCESS';
export const ADD_ORDER_APP_FAILURE = 'ADD_ORDER_APP_FAILURE';
export const CLEAR_REQUEST_STATUS = 'CLEAR_REQUEST_STATUS';

export const addOder = (data, orderTable) => {
  console.log(data);

  return dispatch =>
    axios
      .post(URL + '/addOder', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        orderTable: orderTable,
      })
      .then(res => {
        //return dispatch(addOderSuccess(res.data, data));
      })
      .catch(e => {
        console.log(e.message);
      });
};
export const addOderSuccess = (dataServer, data, orderTable) => ({
  type: ADD_ODER_SUCCESS,
  dataServer,
  data,
  orderTable,
});
export const addOderFailure = () => ({
  type: ADD_ODER_FAILURE,
});

export const editOrderSuccess = (id, field, newValue) => ({
  type: EDIT_ODER_SUCCESS,
  id,
  field,
  newValue,
});
export const editOrderFailure = dataServer => ({
  type: EDIT_ODER_FAILURE,
  dataServer,
});

export const editOder = (id, field, newValue) => {
  console.log(id);
  return dispatch => {
    dispatch(getDataRequest());
    axios
      .create({ withCredentials: true })
      .patch(URL + '/edit', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: { id: id, field: field, newValue: newValue },
      })
      .then(res => {
        if (res.data.error) {
          return dispatch(editOrderFailure(res.data));
        }
      })
      .catch(res => {
        console.log(res);
      });
  };
};

export const editOderNew = data => {
  return dispatch =>
    axios
      .patch(URL + '/editOderNew', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e.message);
      });
};
export const editOderNewSuccess = data => ({
  type: EDIT_ODER_NEW_SUCCESS,
  data,
});
export const editOderNewFailure = () => ({
  type: EDIT_ODER_NEW_FAILURE,
});

export const setProxy = id => ({
  type: SET_PROXY,
  id,
});

export const delOder = id => {
  return dispatch =>
    axios
      .delete(URL + '/' + id)
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e.message);
      });
};
export const delOderSuccess = id => ({
  type: DEL_ODER_SUCCESS,
  id,
});

export const makePaymentCustomer = (arr, sumCustomerPayment, extraPayments, date) => {
  return dispatch =>
    axios
      .patch(URL + '/makePaymentCustomer', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          arr: arr,
          sumCustomerPayment: sumCustomerPayment,
          extraPayments: extraPayments,
          date: date,
        },
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e.response.data);
        return dispatch(makePaymentCustomerFailure(e.response.data));
      });
};

export const makePaymentCustomerSuccess = (dataServer, sumCustomerPayment, extraPayments, arr) => ({
  type: MAKE_PAYMENT_CUSTOMER_SUCCESS,
  dataServer,
  sumCustomerPayment,
  extraPayments,
  arr,
});

export const makePaymentCustomerFailure = message => ({
  type: MAKE_PAYMENT_CUSTOMER_FAILURE,
  message,
});

export const delPrintedMark = id => {
  return dispatch => {
    axios
      .create({ withCredentials: true })
      .patch(URL + '/delPrintedMark/' + id)
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e);
        return dispatch(delPrintedMarkFailure());
      });
  };
};
export const delPrintedMarkSuccess = id => ({
  type: DEL_PRINTED_MARK_SUCCESS,
  id,
});
export const delPrintedMarkFailure = () => ({
  type: DEL_PRINTED_MARK_FAILURE,
});
export const addOrderApp = (data, appId) => {
  return dispatch => {
    axios
      .post(URL + '/addOrderApp', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        appId: appId,
      })
      .then(res => {
        // return dispatch(addOrderAppSuccess(res.data, data, appId));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(addOrderAppFailure(e.message));
      });
  };
};
export const addOrderAppSuccess = (dataServer, data, appId) => ({
  type: ADD_ORDER_APP_SUCCESS,
  dataServer,
  data,
  appId,
});
const addOrderAppFailure = e => ({
  type: ADD_ORDER_APP_FAILURE,
  e,
});

export const clearRequestStatus = () => ({
  type: CLEAR_REQUEST_STATUS,
});
