import axios from 'axios';
import { URL } from '../middlewares/initialState';
import { addDataFailure } from './editDataAction';

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

// Thunk для добавления нового ownerlogist
export const addNewOwnerLogist = newClient => {
  return dispatch => {
    axios
      .post(
        `${URL}/addNewOwnerLogist`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: { newData: newClient, editTable: 'ownerlogist' },
        },
        { withCredentials: true }
      )
      .then(res => {
        // Обновление придёт по сокету; локальный dispatch не требуется
      })
      .catch(e => {
        dispatch(addDataFailure(e?.response?.data));
      });
  };
};

// Thunk для удаления ownerlogist
export const delOwnerLogist = id => {
  return dispatch => {
    axios
      .delete(`${URL}/deleteOwnerLogist/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { editTable: 'ownerlogist' },
      })
      .then(res => {
        // Обновление придёт по сокету
      })
      .catch(e => {
        console.log(e?.response?.data);
      });
  };
};
