import axios from "axios";
import { DOMENNAME } from "../middlewares/initialState";

export const GET_REPORT_DATA_SUCCESS = "GET_REPORT_DATA_SUCCESS";
export const GET_REPORT_DATA_FAILURE = "GET_REPORT_DATA_FAILURE";
export const SAVE_REPORT_PDF_SUCCESS = "SAVE_REPORT_PDF_SUCCESS";
export const SAVE_REPORT_PDF_FAILURE = "SAVE_REPORT_PDF_FAILURE";
export const SEND_REPORT_EMAIL_SUCCESS = "SEND_REPORT_EMAIL_SUCCESS";
export const SEND_REPORT_EMAIL_FAILURE = "SEND_REPORT_EMAIL_FAILURE";
export const GET_REPORT_PDF_SUCCESS = "GET_REPORT_PDF_SUCCESS";
export const GET_REPORT_PDF_FAILURE = "GET_REPORT_PDF_FAILURE";

export const getReportData = (data) => {
  console.log(data);
  return (dispatch) => {
    axios
      .post(DOMENNAME + "/API/getReportData", { body: data })
      .then((res) => {
        return dispatch(getReportDataSuccess(res.data, data));
      })
      .catch((e) => {
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
export const saveReportPdf = (docHtml) => {
  return (dispatch) => {
    axios
      .post(DOMENNAME + "/API/saveReportPdf", { body: docHtml })
      .then((res) => {
        console.log(res.data);
        return dispatch(saveReportPdfSuccess());
      })
      .catch((e) => {
        console.log(e.message);
        return dispatch(saveReportPdfFailure());
      });
  };
};
export const saveReportPdfSuccess = () => ({
  type: SAVE_REPORT_PDF_SUCCESS,
});
export const saveReportPdfFailure = () => ({
  type: SAVE_REPORT_PDF_FAILURE,
});

export const sendReportEmail = (email) => {
  return (dispatch) => {
    axios
      .get(DOMENNAME + "/API/sendReportEmail/" + email)
      .then((res) => {
        console.log(res.data);
        return dispatch(sendReportEmailSuccess(id));
      })
      .catch((e) => {
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
  return (dispatch) => {
    axios
      .get(DOMENNAME + "/API/getReportPdf", {
        responseType: "blob",
      })
      .then((res) => {
        let blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        let newWin = window.open();
        newWin.location.href = url;
        //dispatch(getReportPdfSuccess(dataServer));
      })
      .catch((e) => {
        console.log(e.message);
        dispatch(getReportPdfFailure());
      });
  };
};
export const getReportPdfSuccess = (dataServer) => ({
  type: GET_REPORT_PDF_SUCCESS,
  dataServer,
});
export const getReportPdfFailure = () => ({
  type: GET_REPORT_PDF_FAILURE,
});
