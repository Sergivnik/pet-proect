import update from "react-addons-update";
import { initialStore } from "./dataStore.js";
import {
  ADD_ODER,
  DEL_ODER,
  EDIT_ODER,
  SET_PROXY,
  MAKE_PAYMENT_CUSTOMER_SUCCESS,
} from "../actions/oderActions.js";
import {
  GET_DATA_SUCCESS,
  GET_DATA_REQUEST,
  GET_DATA_FAILURE,
  GET_FILTER_SUCCESS,
  GET_FILTER_FAILURE,
} from "../middlewares/initialState.js";

export const oderReducer = (store = initialStore, action) => {
  switch (action.type) {
    case ADD_ODER: {
      const oderId = store.odersList[store.odersList.length - 1]._id + 1;
      return update(store, {
        odersList: {
          $merge: {
            [store.odersList.length]: {
              _id: oderId,
              date: action.data.date,
              idDriver: action.data.driver,
              idCustomer: action.data.oder,
              idLoadingPoint: action.data.loadingPoint,
              idUnloadingPoint: action.data.unloadingPoint,
              customerPrice: action.data.oderPrice,
              driverPrice: action.data.driverPrice,
            },
          },
        },
      });
    }
    case EDIT_ODER: {
      let index = store.odersList.findIndex((item) => item._id == action.id);
      let originIndex = store.originOdersList.findIndex(
        (item) => item._id == action.id
      );
      let newOder = store.odersList[index];
      let newIncome = store.income;
      switch (action.field) {
        case "date":
          newOder.date = action.newValue;
          break;
        case "driver":
          newOder.idDriver = action.newValue;
          break;
        case "oders":
          newOder.idCustomer = action.newValue;
          break;
        case "loadingPoint":
          newOder.idLoadingPoint = action.newValue;
          break;
        case "unloadingPoint":
          newOder.idUnloadingPoint = action.newValue;
          break;
        case "oderPrice":
          newOder.customerPrice = action.newValue;
          break;
        case "driverPrice":
          newOder.driverPrice = action.newValue;
          break;
        case "proxy":
          newOder.proxy = action.newValue;
          break;
        case "complited":
          newOder.complited = action.newValue;
          break;
        case "document":
          switch (action.newValue) {
            case 1:
              let now = new Date();
              newOder.document = "Ок";
              newOder.dateOfSubmission = now;
              break;
            case 2:
              newOder.document = "Нет";
              break;
            case 3:
              newOder.document = "Факс";
              break;
            default:
              break;
          }
          break;
        case "customerPayment":
          let newValue = store.statusCustomerPay.find(
            (item) => item._id == action.newValue
          );

          if (
            store.odersList[index].customerPayment == "Ок" &&
            action.newValue != 1
          ) {
            newIncome =
              Number(store.income) -
              Number(store.odersList[index].customerPrice);
          }
          if (store.odersList[index].customerPayment == "Частично оплачен") {
            if (action.newValue == 1) {
              newIncome =
                Number(store.income) -
                Number(store.odersList[index].partialPaymentAmount) +
                Number(store.odersList[index].customerPrice);
            } else {
              newIncome =
                Number(store.income) -
                Number(store.odersList[index].partialPaymentAmount);
            }
            newOder.partialPaymentAmount = null;
          }
          if (action.newValue == 1) {
            if (
              store.odersList[index].customerPayment != "Частично оплачен" &&
              store.odersList[index].customerPayment != "Ок"
            ) {
              newIncome =
                Number(store.income) +
                Number(store.odersList[index].customerPrice);
            }
          }
          if (
            action.newValue == 1 ||
            action.newValue == 2 ||
            action.newValue == 6 ||
            action.newValue == 7 ||
            action.newValue == 8
          ) {
            newOder.dateOfPromise = null;
          }
          if (
            action.newValue == 3 ||
            action.newValue == 4 ||
            action.newValue == 5
          ) {
            let now = new Date();
            newOder.dateOfPromise = now;
          }
          newOder.customerPayment = newValue.value;
          break;
        case "dateOfPromise":
          newOder.dateOfPromise = action.newValue;
          break;
        case "driverPayment":
          if (
            store.odersList[index].driverPayment == "Ок" &&
            action.newValue != 1
          ) {
            newIncome =
              Number(store.income) + Number(store.odersList[index].driverPrice);
          }
          if (
            store.odersList[index].driverPayment != "Ок" &&
            action.newValue == 1
          ) {
            newIncome =
              Number(store.income) - Number(store.odersList[index].driverPrice);
          }
          switch (action.newValue) {
            case 1:
              newOder.driverPayment = "Ок";
              break;
            case 2:
              newOder.driverPayment = "нет";
              break;
            default:
              break;
          }
          break;
        case "accountNumber":
          newOder.accountNumber = action.newValue;
          break;
        case "sumPartPay":
          newOder.partialPaymentAmount = action.newValue;
          newIncome =
            Number(store.income) +
            Number(store.odersList[index].partialPaymentAmount);
          break;
        default:
          break;
      }
      return update(store, {
        odersList: {
          $merge: {
            [index]: newOder,
          },
        },
        originOdersList: {
          $merge: {
            [originIndex]: newOder,
          },
        },
        income: { $set: newIncome },
      });
    }

    case SET_PROXY: {
      return store;
    }
    case DEL_ODER: {
      let arrOders = store.odersList.filter((item) => item._id != action.id);
      return { ...store, odersList: [...arrOders] };
    }

    case GET_FILTER_SUCCESS: {
      console.log(action.dataServer);
      function compareObj(a, b) {
        if (a.value > b.value) return 1;
        if (a.value == b.value) return 0;
        if (a.value < b.value) return -1;
      }
      let filteredDriverlist = [];
      action.dataServer.driver.forEach((item) => {
        if (item.idDriver)
          filteredDriverlist.push(
            store.driverlist.find((elem) => elem._id == item.idDriver)
          );
      });
      filteredDriverlist.sort(compareObj);
      let filteredCustomerlist = [];
      action.dataServer.customer.forEach((item) => {
        if (item.idCustomer)
          filteredCustomerlist.push(
            store.clientList.find((elem) => elem._id == item.idCustomer)
          );
      });
      filteredCustomerlist.sort(compareObj);
      let filteredLoadinglist = [];
      action.dataServer.loadingPoint.forEach((item) => {
        if (item.idLoadingPoint != null && item.idLoadingPoint.length === 1) {
          filteredLoadinglist.push(
            store.citieslist.find((elem) => elem._id == item.idLoadingPoint[0])
          );
        }
      });
      filteredLoadinglist.sort(compareObj);
      let filteredUnloadinglist = [];
      action.dataServer.unloadingPoint.forEach((item) => {
        if (
          item.idUnloadingPoint != null &&
          item.idUnloadingPoint.length === 1
        ) {
          filteredUnloadinglist.push(
            store.citieslist.find(
              (elem) => elem._id == item.idUnloadingPoint[0]
            )
          );
        }
      });
      filteredUnloadinglist.sort(compareObj);
      let filteredCustomerpayment = [];
      action.dataServer.customerPayment.forEach((item) => {
        if (item.customerPayment)
          filteredCustomerpayment.push(
            store.statusCustomerPay.find(
              (elem) => elem.value == item.customerPayment
            )
          );
      });
      let filteredAccountNumber = [];
      action.dataServer.filterAccount.forEach((item) => {
        if (item.accountNumber)
          filteredAccountNumber.push(
            store.accountList.find((elem) => elem.value == item.accountNumber)
          );
      });
      return {
        ...store,
        odersList: action.dataServer.odersList,
        filteredDateList: action.dataServer.date,
        filteredLoading: filteredLoadinglist,
        filteredUnloading: filteredUnloadinglist,
        filteredDrivers: filteredDriverlist,
        filteredClients: filteredCustomerlist,
        filteredCustomerPrice: action.dataServer.filteredCustomerPrice,
        filteredDriverPrice: action.dataServer.filteredDriverPrice,
        filteredStatusCustomerPayment: filteredCustomerpayment,
        filteredAccountList: filteredAccountNumber,
        request: {
          status: "SUCCESS",
          error: null,
        },
      };
    }
    case GET_FILTER_FAILURE: {
      return {
        ...store,
        request: {
          status: "FAILURE",
          error: true,
        },
      };
    }

    case GET_DATA_SUCCESS: {
      let accountList = [];
      let i = 1;
      action.dataServer.accountList.forEach((item) => {
        if (item.accountNumber) {
          accountList.push({ _id: i, value: item.accountNumber });
        }
        i++;
      });
      return {
        ...store,
        dateList: action.dataServer.date,
        filteredDateList: action.dataServer.date,
        citieslist: action.dataServer.citieslist,
        filteredLoading: action.dataServer.citieslist,
        filteredUnloading: action.dataServer.citieslist,
        driverlist: action.dataServer.driverlist,
        filteredDrivers: action.dataServer.driverlist,
        clientList: action.dataServer.clientList,
        filteredClients: action.dataServer.clientList,
        odersList: action.dataServer.odersList,
        originOdersList: action.dataServer.odersList,
        filteredCustomerPrice: [
          Number(action.dataServer.minCustomerPrice),
          Number(action.dataServer.maxCustomerPrice),
        ],
        filteredDriverPrice: [
          Number(action.dataServer.minDriverPrice),
          Number(action.dataServer.maxDriverPrice),
        ],
        filteredStatusCustomerPayment: store.statusCustomerPay,
        accountList: accountList,
        filteredAccountList: accountList,
        income: action.dataServer.income,
        expenses: action.dataServer.expenses,
        customerWithoutPayment: action.dataServer.customerWithoutPayment,
        request: {
          status: "SUCCESS",
          error: null,
        },
      };
    }
    case GET_DATA_FAILURE: {
      return {
        ...store,
        request: {
          status: "FAILURE",
          error: true,
        },
      };
    }
    case GET_DATA_REQUEST: {
      return {
        ...store,
        request: {
          status: "LOADING",
          error: null,
        },
      };
    }
    case MAKE_PAYMENT_CUSTOMER_SUCCESS: {
      let sum=store.income+Number(action.sumCustomerPayment)
      let [...arr] = store.odersList;
      action.dataServer.forEach((elem) => {
        let index = arr.findIndex((item) => item._id == elem._id);
        arr[index] = elem;
      });
      return {
        ...store,
        odersList: arr,
        originOdersList: arr,
        income: sum,
      };
    }

    default:
      return store;
  }
};
