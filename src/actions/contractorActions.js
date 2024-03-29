import axios from "axios";
import { URL } from "../middlewares/initialState";

export const GET_DATA_CONTRACTORS_SUCCESS =
  "DATA::GET_DATA_CONTRACTORS_SUCCESS";
export const GET_DATA_CONTRACTORS_FAILURE =
  "DATA::GET_DATA_CONTRACTORS_FAILURE";
export const ADD_DATA_CONTRACTORS_SUCCESS =
  "DATA::ADD_DATA_CONTRACTORS_SUCCESS";
export const ADD_DATA_CONTRACTORS_FAILURE =
  "DATA::ADD_DATA_CONTRACTORS_FAILURE";
export const DEL_DATA_CONTRACTORS_SUCCESS =
  "DATA::DEL_DATA_CONTRACTORS_SUCCESS";
export const DEL_DATA_CONTRACTORS_FAILURE =
  "DATA::DEL_DATA_CONTRACTORS_FAILURE";

export const getDataContractorsSuccess = (dataServer) => ({
  type: GET_DATA_CONTRACTORS_SUCCESS,
  dataServer,
});
export const getDataContractorsFailure = () => ({
  type: GET_DATA_CONTRACTORS_FAILURE,
});
export const getDataContractors = () => {
  return (dispatch) => {
    axios
      .get(URL + "/dataContractors")
      .then((res) => {
        return dispatch(getDataContractorsSuccess(res.data));
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(getDataContractorsFailure());
      });
  };
};

export const addDataContractorstSuccess = (dataServer, data) => ({
  type: ADD_DATA_CONTRACTORS_SUCCESS,
  dataServer,
  data,
});
export const addDataContractorsFailure = () => ({
  type: ADD_DATA_CONTRACTORS_FAILURE,
});
export const addDataContractorPayment = (data) => {
  return (dispatch) => {
    axios
      .patch(URL + "/addDataContractorPayment", {
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
      .then((res) => {
        return dispatch(addDataContractorstSuccess(res.data, data));
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(addDataContractorsFailure());
      });
  };
};
export const delDataContractorPaymentSuccess = (id) => ({
  type: DEL_DATA_CONTRACTORS_SUCCESS,
  id,
});
export const delDataContractorPaymentFailure = (message) => ({
  type: delDataContractorPaymentFailure,
  message,
});
export const delDataContractorPayment = (id) => {
  console.log(id);
  return (dispatch) => {
    axios
      .delete(URL + "/deleteContractorPayment/" + id, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        return dispatch(delDataContractorPaymentSuccess(id));
      })
      .catch((e) => {
        return dispatch(delDataContractorPaymentFailure(e.response.data));
      });
  };
};
