import axios from 'axios';
import { URL } from '../middlewares/initialState';

export const AUTH_SIGN_UP_SUCCESS = 'AUTH_SIGN_UP_SUCCESS';
export const AUTH_SIGN_UP_FAILURE = 'AUTH_SIGN_UP_FAILURE';
export const AUTH_SIGN_IN_SUCCESS = 'AUTH_SIGN_IN_SUCCESS';
export const AUTH_SIGN_IN_FAILURE = 'AUTH_SIGN_IN_FAILURE';
export const AUTH_GET_USER_SUCCESS = 'AUTH_GET_USER_SUCCESS';
export const AUTH_GET_USER_FAILURE = 'AUTH_GET_USER_FAILURE';
export const AUTH_SIGN_OUT_SUCCESS = 'AUTH_SIGN_OUT_SUCCESS';
export const AUTH_SIGN_OUT_FAILURE = 'AUTH_SIGN_OUT_FAILURE';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';

export const authSignOut = () => {
  return dispatch => {
    axios
      .create({ withCredentials: true })
      .get(URL + '/signOut')
      .then(res => {
        console.log(res.data);
        return dispatch(authSignOutSuccess());
      })
      .catch(e => {
        console.log(e.message);
      });
  };
};
export const authSignOutSuccess = () => ({
  type: AUTH_SIGN_OUT_SUCCESS,
});
export const authGetUser = () => {
  return dispatch => {
    axios
      .create({ withCredentials: true })
      .get(URL + '/getUser')
      .then(res => {
        console.log(res.data);
        return dispatch(authGetUserSuccess(res.data));
      })
      .catch(e => {
        console.log(e.message);
      });
  };
};
export const authGetUserSuccess = dataServer => ({
  type: AUTH_GET_USER_SUCCESS,
  dataServer,
});
export const authSignUp = data => {
  return dispatch => {
    axios
      .create({ withCredentials: true })
      .post(URL + '/signUp', {
        Headers: { 'Content-Type': 'application/json' },
        body: data,
      })
      .then(res => {
        alert('Пользователь успешно добавлен');
        return dispatch(authSignUpSucces(res.data));
      })
      .catch(e => {
        alert(e.message);
        console.log(e.message);
        return dispatch(authSignUpFailure(e));
      });
  };
};
export const authSignUpSucces = dataServer => ({
  type: AUTH_SIGN_UP_SUCCESS,
  dataServer,
});
export const authSignUpFailure = e => ({
  type: AUTH_SIGN_UP_FAILURE,
  e,
});

export const authSignIn = data => {
  return dispatch => {
    axios
      .create({ withCredentials: true })
      .post(URL + '/signIn', data)
      .then(res => {
        console.log(res.data);
        return dispatch(authSignInSuccess(res.data));
      })
      .catch(res => {
        console.log(res.data);
        return dispatch(authSignInFailure(res.data));
      });
  };
};
export const authSignInSuccess = dataServer => ({
  type: AUTH_SIGN_IN_SUCCESS,
  dataServer,
});
export const authSignInFailure = e => ({
  type: AUTH_SIGN_IN_FAILURE,
  e,
});
export const changePasswordSuccess = () => ({
  type: CHANGE_PASSWORD_SUCCESS,
});
export const changePasswordFailure = () => ({
  type: CHANGE_PASSWORD_FAILURE,
});
export const changePassword = (login, oldPassword, newPassword) => {
  return dispatch => {
    axios
      .create({ withCredentials: true })
      .post(URL + '/changePassword', {
        login: login,
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then(res => {
        console.log(res.data);
        return dispatch(changePasswordSuccess());
      })
      .catch(res => {
        console.log(res.data);
        return dispatch(changePasswordFailure());
      });
  };
};
