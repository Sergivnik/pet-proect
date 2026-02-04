import axios from 'axios';

//export const DOMENNAME = "http://localhost:8080"; //develop
export const DOMENNAME = 'http://localhost:80'; //develop
//export const DOMENNAME = "http://192.168.0.101:80";//work
//export const DOMENNAME = "http://192.168.0.114:80";//home
//export const DOMENNAME = 'http://82.114.226.75'; //vps
//export const DOMENNAME = 'http://atpivanova.ru:80'; //vps

export const URL = DOMENNAME + '/API';
export const VAT = 5; // VAT rate
export const TAX = 15; // Tax rate
// Создаем единый экземпляр axios с настройками для работы с сессиями
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: URL,
});

export const GET_DATA_REQUEST = 'DATA::GET_DATA_REQUEST';
export const GET_DATA_SUCCESS = 'DATA::GET_DATA_SUCCESS';
export const GET_DATA_FAILURE = 'DATA::GET_DATA_FAILURE';
export const GET_DATA_SUCCESS5000 = 'DATA::GET_DATA_SUCCESS5000';
export const GET_DATA_FAILURE5000 = 'DATA::GET_DATA_FAILURE5000';
export const GET_FILTER_SUCCESS = 'DATA::GET_FILTER_SUCCESS';
export const GET_FILTER_FAILURE = 'DATA::GET_FILTER_FAILURE';
export const FILTER_DATA = 'FILTER_DATA';
//export const GET_PAYMENTS_DATA = "DATA::GET_PAYMENTS_DATA";
export const GET_PAYMENTS_DATA_SUCCESS = 'DATA::GET_PAYMENTS_DATA_SUCCESS';
export const GET_PAYMENTS_DATA_FAILURE = 'DATA::GET_PAYMENTS_DATA_FAILURE';
export const DELETE_PAYMENT_DATA = 'DATA::DELETE_PAYMENT_DATA';
export const DELETE_PAYMENT_DATA_SUCCESS = 'DATA::DELETE_PAYMENT_DATA_SUCCESS';
export const DELETE_PAYMENT_DATA_FAILURE = 'DATA::DELETE_PAYMENT_DATA_FAILURE';

export const filterData = filterObj => {
  if (
    filterObj.date.length == 0 &&
    filterObj.driver.length == 0 &&
    filterObj.oder.length == 0 &&
    filterObj.cityLoading.length == 0 &&
    filterObj.cityUnloading.length == 0 &&
    filterObj.customerPrice.length == 0 &&
    filterObj.driverPrice.length == 0 &&
    filterObj.proxy.length == 0 &&
    filterObj.completed.length == 0 &&
    filterObj.documents.length == 0 &&
    filterObj.customerPayment.length == 0 &&
    filterObj.driverPayment.length == 0 &&
    filterObj.accountList.length == 0
  ) {
    return dispatch => {
      dispatch(getDataRequest());
      axiosInstance
        .get('/data')
        .then(res => {
          return dispatch(getDataSuccess(res.data));
        })
        .catch(e => {
          console.log(e.message);
          return dispatch(getDataFailure(e.message));
        });
    };
  } else
    return dispatch => {
      dispatch(getDataRequest());
      axiosInstance
        .post('/filter', { body: filterObj })
        .then(res => {
          dispatch(getFilterSuccess(res.data));
        })
        .catch(e => {
          console.log(e.message);
          dispatch(getFilterFailure(e.message));
        });
    };
};

export const getFilterSuccess = dataServer => ({
  type: GET_FILTER_SUCCESS,
  dataServer,
});

export const getFilterFailure = error => ({
  type: GET_FILTER_FAILURE,
  error,
});

export const getDataRequest = () => ({
  type: GET_DATA_REQUEST,
});

export const getDataSuccess = dataServer => ({
  type: GET_DATA_SUCCESS,
  dataServer,
});

export const getDataFailure = () => ({
  type: GET_DATA_FAILURE,
});

export const getData = () => {
  return dispatch => {
    dispatch(getDataRequest());
    axiosInstance
      .get('/data')
      .then(res => {
        return dispatch(getDataSuccess(res.data));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(getDataFailure());
      });
  };
};

export const getData5000 = () => {
  return dispatch => {
    axiosInstance
      .get('/data5000')
      .then(res => {
        return dispatch(getDataSuccess5000(res.data));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(getDataFailure5000());
      });
  };
};

export const getDataSuccess5000 = dataServer => ({
  type: GET_DATA_SUCCESS5000,
  dataServer,
});

export const getDataFailure5000 = () => ({
  type: GET_DATA_FAILURE5000,
});

export const getDataPaymentsSuccess = dataServer => ({
  type: GET_PAYMENTS_DATA_SUCCESS,
  dataServer,
});

export const getDataPaymentsFailure = () => ({
  type: GET_PAYMENTS_DATA_FAILURE,
});

export const getPaymentsData = () => {
  return dispatch => {
    axiosInstance
      .get('/dataPayments')
      .then(res => {
        return dispatch(getDataPaymentsSuccess(res.data));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(getDataPaymentsFailure());
      });
  };
};

export const deletePaymentDataSuccess = (dataServer, id) => ({
  type: DELETE_PAYMENT_DATA_SUCCESS,
  dataServer,
  id,
});

export const deletePaymentDataFailure = () => ({
  type: DELETE_PAYMENT_DATA_FAILURE,
});

export const deletePaymentData = id => {
  return dispatch => {
    axiosInstance
      .delete('/deleteDataPatmenrs/' + id)
      .then(res => {
        return dispatch(deletePaymentDataSuccess(res.data, id));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(deletePaymentDataFailure());
      });
  };
};
