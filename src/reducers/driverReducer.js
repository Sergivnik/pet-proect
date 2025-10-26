//import update from "react-addons-update";
import { driverStore } from "./driverStore.js";
import {
  GET_DRIVER_PAYMENTS_REQUEST,
  GET_DRIVER_PAYMENTS_SUCCESS,
  GET_DRIVER_PAYMENTS_FAILURE,
  DEL_DRIVER_PAYMENT_REQUEST,
  DEL_DRIVER_PAYMENT_SUCCESS_DRIVER,
  DEL_DRIVER_PAYMENT_FAILURE,
} from "../actions/driverActions.js";

export const driverReducer = (store = driverStore, action) => {
  switch (action.type) {
    case GET_DRIVER_PAYMENTS_REQUEST: {
      console.log("hi");
      return { ...store, status: "REQUEST" };
    }
    case GET_DRIVER_PAYMENTS_SUCCESS: {
      return {
        ...store,
        driverpayment: action.dataServer,
        status: null,
      };
    }
    case GET_DRIVER_PAYMENTS_FAILURE: {
      return {
        ...store,
        status: null,
      };
    }
    case DEL_DRIVER_PAYMENT_REQUEST: {
      console.log("hi");
      return { ...store, status: "REQUEST" };
    }
    case DEL_DRIVER_PAYMENT_FAILURE: {
      return {
        ...store,
        status: null,
      };
    }
    case DEL_DRIVER_PAYMENT_SUCCESS_DRIVER: {
      let [...arrDriverPayments] = store.driverpayment;
      let indexPayment = arrDriverPayments.findIndex(
        (payment) => payment.id == action.id
      );
      arrDriverPayments.splice(indexPayment, 1);
      return { ...store, driverpayment: arrDriverPayments };
    }
    default:
      return store;
  }
};
