import axios from 'axios';
import { URL } from '../middlewares/initialState';

// Action types
export const GET_OWNER_LOGIST_REQUEST = 'GET_OWNER_LOGIST_REQUEST';
export const GET_OWNER_LOGIST_SUCCESS = 'GET_OWNER_LOGIST_SUCCESS';
export const GET_OWNER_LOGIST_FAILURE = 'GET_OWNER_LOGIST_FAILURE';

// Action creators
export const getOwnerLogistRequest = () => ({
  type: GET_OWNER_LOGIST_REQUEST,
});

export const getOwnerLogistSuccess = data => ({
  type: GET_OWNER_LOGIST_SUCCESS,
  data,
});

export const getOwnerLogistFailure = () => ({
  type: GET_OWNER_LOGIST_FAILURE,
});

// Thunk action creator
export const getOwnerLogist = () => {
  return dispatch => {
    dispatch(getOwnerLogistRequest());
    axios
      .get(`${URL}/ownerlogist`)
      .then(res => {
        console.log(res.data);
        dispatch(getOwnerLogistSuccess(res.data));
      })
      .catch(error => {
        console.log(error.message);
        dispatch(getOwnerLogistFailure());
      });
  };
};
