import axios from 'axios';
import { DOMENNAME } from '../middlewares/initialState';

// Общий экземпляр axios с передачей cookies
const api = axios.create({ withCredentials: true });

export const GET_REPORT_DATA_SUCCESS = 'GET_REPORT_DATA_SUCCESS';
export const GET_REPORT_DATA_FAILURE = 'GET_REPORT_DATA_FAILURE';
export const SAVE_REPORT_PDF_REQUEST = 'SAVE_REPORT_PDF_REQUEST';
export const SAVE_REPORT_PDF_SUCCESS = 'SAVE_REPORT_PDF_SUCCESS';
export const SAVE_REPORT_PDF_FAILURE = 'SAVE_REPORT_PDF_FAILURE';
export const SEND_REPORT_EMAIL_SUCCESS = 'SEND_REPORT_EMAIL_SUCCESS';
export const SEND_REPORT_EMAIL_FAILURE = 'SEND_REPORT_EMAIL_FAILURE';
export const GET_REPORT_PDF_SUCCESS = 'GET_REPORT_PDF_SUCCESS';
export const GET_REPORT_PDF_FAILURE = 'GET_REPORT_PDF_FAILURE';
export const EDIT_YEAR_CONST_SUCCESS = 'EDIT_YEAR_CONST_SUCCESS';
export const EDIT_YEAR_CONST_FAILURE = 'EDIT_YEAR_CONST_FAILURE';

// ReceiptIntoBankAccount: поступления по диапазону дат
export const GET_RECEIPTS_BY_DATE_SUCCESS = 'GET_RECEIPTS_BY_DATE_SUCCESS';
export const GET_RECEIPTS_BY_DATE_FAILURE = 'GET_RECEIPTS_BY_DATE_FAILURE';

// ReceiptIntoBankAccount: рейсы по диапазону дат
export const GET_TRIPS_BY_DATE_SUCCESS = 'GET_TRIPS_BY_DATE_SUCCESS';
export const GET_TRIPS_BY_DATE_FAILURE = 'GET_TRIPS_BY_DATE_FAILURE';

export const getReportData = data => {
  console.log(data);
  return dispatch => {
    api
      .post(DOMENNAME + '/API/getReportData', { body: data })
      .then(res => {
        return dispatch(getReportDataSuccess(res.data, data));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(getReportDataFailure());
      });
  };
};
export const getReportDataSuccess = (dataServer, data) => ({
  type: GET_REPORT_DATA_SUCCESS,
  dataServer,
  data,
});
export const getReportDataFailure = () => ({
  type: GET_REPORT_DATA_FAILURE,
});
export const saveReportPdf = docHtml => {
  console.log(docHtml);
  return dispatch => {
    dispatch(saveReportPdfRequest());
    api
      .post(DOMENNAME + '/API/saveReportPdf', { body: docHtml })
      .then(res => {
        console.log(res.data);
        return dispatch(saveReportPdfSuccess());
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(saveReportPdfFailure(e.message));
      });
  };
};
export const saveReportPdfRequest = () => ({
  type: SAVE_REPORT_PDF_REQUEST,
});
export const saveReportPdfSuccess = () => ({
  type: SAVE_REPORT_PDF_SUCCESS,
});
export const saveReportPdfFailure = message => ({
  type: SAVE_REPORT_PDF_FAILURE,
  message,
});

export const sendReportEmail = email => {
  return dispatch => {
    api
      .get(DOMENNAME + '/API/sendReportEmail/' + email)
      .then(res => {
        console.log(res.data);
        return dispatch(sendReportEmailSuccess(id));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(sendReportEmailFailure());
      });
  };
};
export const sendReportEmailSuccess = () => ({
  type: SEND_REPORT_EMAIL_SUCCESS,
});
export const sendReportEmailFailure = () => ({
  type: SEND_REPORT_EMAIL_FAILURE,
});
export const getReportPdf = () => {
  return dispatch => {
    api
      .get(DOMENNAME + '/API/getReportPdf', {
        responseType: 'blob',
      })
      .then(res => {
        let blob = new Blob([res.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let newWin = window.open();
        newWin.location.href = url;
        //dispatch(getReportPdfSuccess(dataServer));
      })
      .catch(e => {
        console.log(e.message);
        dispatch(getReportPdfFailure());
      });
  };
};
export const getReportPdfSuccess = dataServer => ({
  type: GET_REPORT_PDF_SUCCESS,
  dataServer,
});
export const getReportPdfFailure = () => ({
  type: GET_REPORT_PDF_FAILURE,
});
export const editYearConst = (name, data) => {
  return dispatch => {
    api
      .post(DOMENNAME + '/API/editYearConst', { name: name, data: data })
      .then(res => {
        console.log(res.data);
        dispatch(editYearConstSuccess(name, data));
      })
      .catch(e => {
        console.log(e.message);
        dispatch(editYearConstSuccess());
      });
  };
};
export const editYearConstSuccess = (name, data) => ({
  type: EDIT_YEAR_CONST_SUCCESS,
  name,
  data,
});
export const editYearConstFailure = () => ({
  type: EDIT_YEAR_CONST_FAILURE,
});

// Получить суммы поступлений по клиентам за период
export const getReceiptsByDate = (dateBegin, dateEnd) => {
  return dispatch => {
    api
      .post(DOMENNAME + '/API/reports/receiptsByDate', { dateBegin, dateEnd })
      .then(res => {
        console.log(res.data);
        return dispatch(getReceiptsByDateSuccess(res.data));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(getReceiptsByDateFailure());
      });
  };
};
export const getReceiptsByDateSuccess = data => ({
  type: GET_RECEIPTS_BY_DATE_SUCCESS,
  data,
});
export const getReceiptsByDateFailure = () => ({
  type: GET_RECEIPTS_BY_DATE_FAILURE,
});

// Получить суммы рейсов по клиентам за период
export const getTripsByDate = (dateBegin, dateEnd) => {
  return dispatch => {
    api
      .post(DOMENNAME + '/API/reports/tripsByDate', { dateBegin, dateEnd })
      .then(res => {
        console.log(res.data);
        return dispatch(getTripsByDateSuccess(res.data));
      })
      .catch(e => {
        console.log(e.message);
        return dispatch(getTripsByDateFailure());
      });
  };
};
export const getTripsByDateSuccess = data => ({
  type: GET_TRIPS_BY_DATE_SUCCESS,
  data,
});
export const getTripsByDateFailure = () => ({
  type: GET_TRIPS_BY_DATE_FAILURE,
});
