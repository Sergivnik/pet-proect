import axios from 'axios';
import { URL } from '../middlewares/initialState';

export const EDIT_DATA_SUCCESS = 'EDIT_DATA_SUCCESS';
export const EDIT_DATA_FAILURE = 'EDIT_DATA_FAILURE';
export const ADD_DATA_SUCCESS = 'ADD_DATA_SUCCESS';
export const ADD_DATA_FAILURE = 'ADD_DATA_FAILURE';
export const DEL_DATA_SUCCESS = 'DEL_DATA_SUCCESS';
export const DEL_DATA_FAILURE = 'DEL_DATA_FAILURE';
export const ADD_CONTRACT_REQUEST = 'ADD_CONTRACT_REQUEST';
export const ADD_CONTRACT_FAILURE = 'ADD_CONTRACT_FAILURE';
export const ADD_CONTRACT_SUCCESS = 'ADD_CONTRACT_SUCCESS';
export const ADD_DRIVER_CONTRACT_REQUEST = 'ADD_DRIVER_CONTRACT_REQUEST';
export const ADD_DRIVER_CONTRACT_FAILURE = 'ADD_DRIVER_CONTRACT_FAILURE';
export const ADD_DRIVER_CONTRACT_SUCCESS = 'ADD_DRIVER_CONTRACT_SUCCESS';

export const editDataSuccess = (dataServer, newData, editTable) => ({
  type: EDIT_DATA_SUCCESS,
  dataServer,
  newData,
  editTable,
});
export const editDataFailure = () => ({
  type: EDIT_DATA_FAILURE,
});
export const editData = (newData, editTable) => {
  return dispatch => {
    axios
      .patch(URL + '/editData', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: { newData: newData, editTable: editTable },
      })
      .then(res => {
        // Socket event will handle the update
        // return dispatch(editDataSuccess(res.data, newData, editTable));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(editDataFailure());
      });
  };
};
export const addDataSuccess = (dataServer, data, editTable) => ({
  type: ADD_DATA_SUCCESS,
  dataServer,
  data,
  editTable,
});
export const addDataFailure = message => ({
  type: ADD_DATA_FAILURE,
  message,
});
export const addData = (newData, editTable) => {
  return dispatch => {
    axios
      .post(
        URL + '/addData',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: { newData: newData, editTable: editTable },
        },
        { withCredentials: true }
      )
      .then(res => {
        // Socket event will handle the update
        // return dispatch(addDataSuccess(res.data, newData, editTable));
      })
      .catch(e => {
        return dispatch(addDataFailure(e.response.data));
      });
  };
};
export const delDataSuccess = (id, editTable) => ({
  type: DEL_DATA_SUCCESS,
  id,
  editTable,
});
export const delDataFailure = message => ({
  type: DEL_DATA_FAILURE,
  message,
});
export const delData = (id, editTable) => {
  return dispatch => {
    axios
      .delete(URL + '/deleteData' + '/' + id, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { editTable: editTable },
      })
      .then(res => {
        // Socket event will handle the update
        // return dispatch(delDataSuccess(id, editTable));
      })
      .catch(e => {
        return dispatch(delDataFailure(e.response.data));
      });
  };
};

export const addContract = (customer, html, css) => {
  return dispatch => {
    dispatch(addContractRequest());
    axios
      .create({ withCredentials: true })
      .post(URL + '/addContract', {
        customer: customer,
        html: html,
        css: css,
      })
      .then(res => {
        console.log(res.data);
        dispatch(addContractSuccess());
      })
      .catch(e => {
        console.log(e);
        dispatch(addContractFailure());
      });
  };
};
export const addContractRequest = () => ({
  type: ADD_CONTRACT_REQUEST,
});
export const addContractSuccess = () => ({
  type: ADD_CONTRACT_SUCCESS,
});
export const addContractFailure = () => ({
  type: ADD_CONTRACT_FAILURE,
});

export const addDriverContract = (driver, html, css) => {
  return dispatch => {
    dispatch(addContractRequest());
    axios
      .create({ withCredentials: true })
      .post(URL + '/addDriverContract', {
        driver: driver,
        html: html,
        css: css,
      })
      .then(res => {
        console.log(res.data);
        dispatch(addDriverContractSuccess());
      })
      .catch(e => {
        console.log(e);
        dispatch(addDriverContractFailure());
      });
  };
};
export const addDriverContractRequest = () => ({
  type: ADD_DRIVER_CONTRACT_REQUEST,
});
export const addDriverContractSuccess = () => ({
  type: ADD_DRIVER_CONTRACT_SUCCESS,
});
export const addDriverContractFailure = () => ({
  type: ADD_DRIVER_CONTRACT_FAILURE,
});
