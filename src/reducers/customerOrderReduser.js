//import update from "react-addons-update";
import { customerStore } from "./customerStore.js";
import {
  GET_CUSTOMER_DATA_SUCCESS,
  GET_CUSTOMER_DATA_FAILURE,
  ADD_CUSTOMER_APP_SUCCESS,
  ADD_CUSTOMER_APP_FAILURE,
  EDIT_CUSTOMER_APP_SUCCESS,
  EDIT_CUSTOMER_APP_FAILURE,
  DEL_CUSTOMER_APP_SUCCESS,
  DEL_CUSTOMER_APP_FAILURE,
} from "../actions/customerOrderAction.js";
import {
  GET_APPS_SUCCESS,
  GET_APPS_FAILURE,
  GET_NEW_APP_SUCCESS,
  GET_NEW_APP_FAILURE,
} from "../actions/appAction.js";
import {
  ADD_ORDER_APP_SUCCESS,
  ADD_ORDER_APP_FAILURE,
} from "../actions/oderActions.js";

export const customerReducer = (store = customerStore, action) => {
  switch (action.type) {
    case GET_CUSTOMER_DATA_SUCCESS: {
      return {
        ...store,
        ordersList: action.dataServer.ordersList,
        customerData: action.dataServer.customerData,
        managerList: action.dataServer.managerList,
        driversList: action.dataServer.driversList,
        trackList: action.dataServer.trackList,
        userList: action.dataServer.userList,
        citiesList: action.dataServer.citiesList,
        storelist: action.dataServer.storelist,
        customerOrders: action.dataServer.customerOrders,
        customerclients: action.dataServer.customerclients,
      };
    }
    case ADD_CUSTOMER_APP_SUCCESS: {
      console.log(action);
      let arrCustomerApp = [...store.customerOrders];
      action.appData._id = action.id;
      arrCustomerApp.push(action.appData);
      return { ...store, customerOrders: arrCustomerApp };
    }
    case EDIT_CUSTOMER_APP_SUCCESS: {
      let arrCustomerApp = [...store.customerOrders];
      console.log(action);
      let index = store.customerOrders.findIndex(
        (elem) => elem._id == action.id
      );
      arrCustomerApp[index] = action.appData;
      arrCustomerApp[index]._id = action.id;
      return { ...store, customerOrders: arrCustomerApp };
    }
    case DEL_CUSTOMER_APP_SUCCESS: {
      console.log(action);
      let arrCustomerApp = store.customerOrders.filter(
        (elem) => elem._id != action.id
      );
      return { ...store, customerOrders: arrCustomerApp };
    }
    case GET_APPS_SUCCESS: {
      console.log(action);
      return {
        ...store,
        customerOrders: action.data.ordersList,
        driversList: action.data.driversList,
        trackList: action.data.trackList,
        managerList: action.data.managerList,
        citiesList: action.data.citiesList,
        storelist: action.data.storelist,
      };
    }
    case GET_NEW_APP_SUCCESS: {
      console.log(action);
      let oldApp = store.customerOrders.length;
      if (action.data == oldApp) {
        return { ...store, newAppNumber: null };
      } else {
        return { ...store, newAppNumber: action.data - oldApp };
      }
    }
    case ADD_ORDER_APP_SUCCESS: {
      console.log(action);
      let arrCustomerApp = [...store.customerOrders];
      let index = store.customerOrders.findIndex(
        (elem) => elem._id == action.appId
      );
      arrCustomerApp[index].orderId = action.dataServer.insertId;
      return { ...store, customerOrders: arrCustomerApp };
    }
    default:
      return store;
  }
};
