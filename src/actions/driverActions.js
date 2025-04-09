import axios from "axios";
import { URL } from "../middlewares/initialState";

export const GET_DATA_DRIVER_DEBT_SUCCESS =
  "DATA::GET_DATA_DRIVER_DEBT_SUCCESS";
export const GET_DATA_DRIVER_DEBT_FAILURE =
  "DATA::GET_DATA_DRIVER_DEBT_FAILURE";
export const ADD_DATA_DRIVER_DEBT_SUCCESS =
  "DATA::ADD_DATA_DRIVER_DEBT_SUCCESS";
export const ADD_DATA_DRIVER_DEBT_FAILURE =
  "DATA::ADD_DATA_DRIVER_DEBT_FAILURE";
export const DEL_DATA_DRIVER_DEBT_SUCCESS =
  "DATA::DEL_DATA_DRIVER_DEBT_SUCCESS";
export const DEL_DATA_DRIVER_DEBT_FAILURE =
  "DATA::DEL_DATA_DRIVER_DEBT_FAILURE";
export const EDIT_DATA_DRIVER_DEBT_SUCCESS =
  "DATA::EDIT_DATA_DRIVER_DEBT_SUCCESS";
export const EDIT_DATA_DRIVER_DEBT_FAILURE =
  "DATA::EDIT_DATA_DRIVER_DEBT_FAILURE";
export const MAKE_PAYMENT_DRIVER_SUCCESS = "DATA::MAKE_PAYMENT_DRIVER_SUCCESS";
export const MAKE_PAYMENT_DRIVER_FAILURE = "DATA::MAKE_PAYMENT_DRIVER_FAILURE";
export const GET_DRIVER_PAYMENTS_REQUEST = "GET_DRIVER_PAYMENTS_REQUEST";
export const GET_DRIVER_PAYMENTS_SUCCESS = "GET_DRIVER_PAYMENTS_SUCCESS";
export const GET_DRIVER_PAYMENTS_FAILURE = "GET_DRIVER_PAYMENTS_FAILURE";
export const DEL_DRIVER_PAYMENT_REQUEST = "DEL_DRIVER_PAYMENT_REQUEST";
export const DEL_DRIVER_PAYMENT_SUCCESS_ORDER =
  "DEL_DRIVER_PAYMENT_SUCCESS_ORDER";
export const DEL_DRIVER_PAYMENT_SUCCESS_DRIVER =
  "DEL_DRIVER_PAYMENT_SUCCESS_DRIVER";
export const DEL_DRIVER_PAYMENT_FAILURE = "DEL_DRIVER_PAYMENT_FAILURE";

export const getDataDriverDebtSuccess = (dataServer) => ({
  type: GET_DATA_DRIVER_DEBT_SUCCESS,
  dataServer,
});
export const getDataDriverDebtFailure = () => ({
  type: GET_DATA_DRIVER_DEBT_FAILURE,
});
export const getDataDriverDebt = () => {
  return (dispatch) => {
    axios
      .get(URL + "/dataDriverDebt")
      .then((res) => {
        return dispatch(getDataDriverDebtSuccess(res.data));
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(getDataDriverDebtFailure());
      });
  };
};
export const addDataDriverDebtSuccess = (dataServer, data) => ({
  type: ADD_DATA_DRIVER_DEBT_SUCCESS,
  dataServer,
  data,
});
export const addDataDriverDebtFailure = () => ({
  type: ADD_DATA_DRIVER_DEBT_FAILURE,
});
export const addDataDriverDebt = (data) => {
  return (dispatch) => {
    axios
      .patch(URL + "/addDataDriverDebt", {
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
      .then((res) => {
        console.log(res.data);
        //return dispatch(addDataDriverDebtSuccess(res.data, data));
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(addDataDriverDebtFailure());
      });
  };
};
export const delDataDriverDebtSuccess = (id) => ({
  type: DEL_DATA_DRIVER_DEBT_SUCCESS,
  id,
});
export const delDataDriverDebtFailure = () => ({
  type: DEL_DATA_DRIVER_DEBT_FAILURE,
});
export const delDataDriverDebt = (id) => {
  return (dispatch) => {
    axios
      .delete(URL + "/deletedriverDebt" + "/" + id)
      .then((res) => {
        console.log(res.data);
        //return dispatch(delDataDriverDebtSuccess(id));
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(delDataDriverDebtFailure());
      });
  };
};

export const editDataDriverDebtSuccess = (data) => ({
  type: EDIT_DATA_DRIVER_DEBT_SUCCESS,
  data,
});
export const editDataDriverDebtFailure = () => ({
  type: EDIT_DATA_DRIVER_DEBT_FAILURE,
});
export const editDataDriverDebt = (data) => {
  console.log(data);
  return (dispatch) => {
    axios
      .patch(URL + "/editDriverDebt", {
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
      .then((res) => {
        console.log(res.data);
        // Socket event will handle the update
        // return dispatch(editDataDriverDebtSuccess(data));
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(editDataDriverDebtFailure());
      });
  };
};
export const makePaymentDriver = (
  idDriver,
  chosenOders,
  chosenDebts,
  currentDriverSumOfOders
) => {
  return (dispatch) =>
    axios
      .patch(URL + "/makePaymentDriver", {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          id: idDriver,
          chosenOders: chosenOders,
          chosenDebts: chosenDebts,
          currentDriverSumOfOders: currentDriverSumOfOders,
        },
      })
      .then((res) => {
        console.log(res.data);
        // return dispatch(
        //   makePaymentDriverSuccess(
        //     res.data,
        //     chosenOders,
        //     chosenDebts,
        //     currentDriverSumOfOders
        //   )
        // );
      })
      .catch((e) => {
        return dispatch(makePaymentDriverFailure(e.response.data));
      });
};
export const makePaymentDriverSuccess = (
  dataServer,
  chosenOders,
  chosenDebts,
  currentDriverSumOfOders
) => ({
  type: MAKE_PAYMENT_DRIVER_SUCCESS,
  dataServer,
  chosenOders,
  chosenDebts,
  currentDriverSumOfOders,
});
export const makePaymentDriverFailure = (message) => ({
  type: MAKE_PAYMENT_DRIVER_FAILURE,
  message,
});
export const getDataDriverPayments = () => {
  return (dispatch) => {
    dispatch(getDataDriverDebtRequest());
    axios
      .get(URL + "/getDriverPayments")
      .then((res) => {
        return dispatch(getDriverPaymentsSuccess(res.data));
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(getDriverPaymentsFailure());
      });
  };
};
export const getDataDriverDebtRequest = () => ({
  type: GET_DRIVER_PAYMENTS_REQUEST,
});
export const getDriverPaymentsSuccess = (dataServer) => ({
  type: GET_DRIVER_PAYMENTS_SUCCESS,
  dataServer,
});
export const getDriverPaymentsFailure = () => ({
  type: GET_DRIVER_PAYMENTS_FAILURE,
});
export const delDriverPayment = (id) => {
  return (dispatch) => {
    dispatch(delDriverPaymentRequest());
    axios
      .delete(URL + "/delDriverPayment/" + id)
      .then((res) => {
        console.log(res.data);
        // dispatch(delDriverPaymentSuccessOrder(id));
        // dispatch(delDriverPaymentSuccessDriver(id));
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(delDriverPaymentFailure());
      });
  };
};
export const delDriverPaymentRequest = () => ({
  type: DEL_DRIVER_PAYMENT_REQUEST,
});
export const delDriverPaymentSuccessOrder = (id) => ({
  type: DEL_DRIVER_PAYMENT_SUCCESS_ORDER,
  id,
});
export const delDriverPaymentSuccessDriver = (id) => ({
  type: DEL_DRIVER_PAYMENT_SUCCESS_DRIVER,
  id,
});
export const delDriverPaymentFailure = () => ({
  type: DEL_DRIVER_PAYMENT_FAILURE,
});
