import update from 'immutability-helper';
import { initialStore } from './dataStore.js';

// Функция для сортировки списка заказов
const sortOrdersList = ordersList => {
  return ordersList.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    if (a.date == b.date) {
      if ((b.accountNumber == null || b.accountNumber == '') && a.accountNumber) return -1;
      if ((a.accountNumber == null || a.accountNumber == '') && b.accountNumber) return 1;
      if (
        (b.accountNumber == null || b.accountNumber == '') &&
        (a.accountNumber == null || a.accountNumber == '')
      ) {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
      }
      if (a.accountNumber < b.accountNumber) return -1;
      if (a.accountNumber > b.accountNumber) return 1;
      if (a.accountNumber == b.accountNumber) {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
      }
    }
  });
};
import {
  ADD_ODER_SUCCESS,
  DEL_ODER_SUCCESS,
  EDIT_ODER_SUCCESS,
  EDIT_ODER_FAILURE,
  EDIT_ODER_NEW_SUCCESS,
  EDIT_ODER_NEW_FAILURE,
  SET_PROXY,
  MAKE_PAYMENT_CUSTOMER_SUCCESS,
  MAKE_PAYMENT_CUSTOMER_FAILURE,
  DEL_PRINTED_MARK_SUCCESS,
  DEL_PRINTED_MARK_FAILURE,
  ADD_ORDER_APP_SUCCESS,
  ADD_ORDER_APP_FAILURE,
  CLEAR_REQUEST_STATUS,
} from '../actions/oderActions.js';
import {
  GET_DATA_SUCCESS,
  GET_DATA_REQUEST,
  GET_DATA_FAILURE,
  GET_FILTER_SUCCESS,
  GET_FILTER_FAILURE,
  GET_PAYMENTS_DATA_SUCCESS,
  GET_PAYMENTS_DATA_FAILURE,
  DELETE_PAYMENT_DATA_SUCCESS,
  DELETE_PAYMENT_DATA_FAILURE,
  GET_DATA_SUCCESS5000,
} from '../middlewares/initialState.js';
import {
  GET_DATA_DRIVER_DEBT_SUCCESS,
  GET_DATA_DRIVER_DEBT_FAILURE,
  ADD_DATA_DRIVER_DEBT_SUCCESS,
  DEL_DATA_DRIVER_DEBT_SUCCESS,
  EDIT_DATA_DRIVER_DEBT_SUCCESS,
  MAKE_PAYMENT_DRIVER_SUCCESS,
  MAKE_PAYMENT_DRIVER_FAILURE,
  DEL_DRIVER_PAYMENT_SUCCESS_ORDER,
} from '../actions/driverActions.js';
import {
  GET_DATA_CONTRACTORS_SUCCESS,
  GET_DATA_CONTRACTORS_FAILURE,
  ADD_DATA_CONTRACTORS_SUCCESS,
  ADD_DATA_CONTRACTORS_FAILURE,
  DEL_DATA_CONTRACTORS_SUCCESS,
  DEL_DATA_CONTRACTORS_FAILURE,
} from '../actions/contractorActions.js';
import {
  EDIT_DATA_SUCCESS,
  EDIT_DATA_FAILURE,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAILURE,
  DEL_DATA_SUCCESS,
  DEL_DATA_FAILURE,
  ADD_CONTRACT_REQUEST,
  ADD_CONTRACT_FAILURE,
  ADD_CONTRACT_SUCCESS,
  ADD_DRIVER_CONTRACT_REQUEST,
  ADD_DRIVER_CONTRACT_FAILURE,
  ADD_DRIVER_CONTRACT_SUCCESS,
} from '../actions/editDataAction.js';
import {
  CREATE_NEW_INVOICE_SUCCESS,
  CREATE_NEW_INVOICE_FAILURE,
  CREATE_NEW_INVOICE_REQUEST,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_FAILURE,
  CREATE_APP_SUCCESS,
  GET_PDF_WITHOUT_STAMP_SUCCESS,
  GET_PDF_WITHOUT_STAMP_FAILURE,
  CREATE_DOC_WITHOUT_STAMP_REQUEST,
  CREATE_DOC_WITHOUT_STAMP_SUCCESS,
  CREATE_DOC_WITHOUT_STAMP_FAILURE,
  CREATE_SOMEDOC_NEW_REQUEST,
  ADD_CONSIGNMENT_NOTE_SUCCESS,
  ADD_CONSIGNMENT_NOTE_FAILURE,
} from '../actions/documentAction.js';
import {
  EDIT_ADDDATA_SUCCESS,
  EDIT_ADDDATA_FAILURE,
  DELETE_ADDDATE_SUCCESS,
  DELETE_ADDDATE_FAILURE,
} from '../actions/specialAction.js';
import {
  AUTH_GET_USER_SUCCESS,
  AUTH_SIGN_IN_SUCCESS,
  AUTH_SIGN_OUT_SUCCESS,
} from '../actions/auth.js';
import { EDIT_YEAR_CONST_SUCCESS, EDIT_YEAR_CONST_FAILURE } from '../actions/reportActions.js';
import {
  MAKE_CARD_PAYMENT_REQUEST,
  MAKE_CARD_PAYMENT_FAILURE,
  MAKE_CARD_PAYMENT_SUCCESS,
} from '../actions/cardAction.js';
import {
  ADD_POST_TRACK_SUCCESS,
  ADD_POST_TRACK_REQUEST,
  ADD_POST_TRACK_FAILURE,
} from '../actions/postAction.js';

export const oderReducer = (store = initialStore, action) => {
  switch (action.type) {
    case CLEAR_REQUEST_STATUS: {
      return { ...store, request: {} };
    }
    case ADD_ODER_SUCCESS: {
      console.log(action);
      if (action.orderTable == 'oderslist') {
        return update(store, {
          odersList: {
            $merge: {
              [store.odersList.length]: {
                _id: action.dataServer.insertId,
                date: action.data.date,
                idDriver: action.data.idDriver,
                idCustomer: action.data.idCustomer,
                idLoadingPoint: action.data.idLoadingPoint,
                idUnloadingPoint: action.data.idUnloadingPoint,
                customerPrice: action.data.customerPrice,
                driverPrice: action.data.driverPrice,
                idTrackDriver: action.data.idTrackDriver,
                idTrack: action.data.idTrack,
                idManager: action.data.idManager,
                loadingInfo: action.data.loadingInfo,
                unloadingInfo: action.data.unloadingInfo,
                completed: action.data.completed,
                colorTR: action.data.colorTR,
                applicationNumber: action.data.applicationNumber,
                proxy: 1,
                document: 'нет',
                dateOfSubmission: null,
                customerPayment: 'нет',
                dateOfPromise: null,
                driverPayment: 'нет',
              },
            },
          },
        });
      } else {
        return update(store, {
          driverOrderList: {
            $merge: {
              [store.driverOrderList.length]: {
                _id: action.dataServer.insertId,
                date: action.data.date,
                idDriver: action.data.idDriver,
                idCustomer: action.data.idCustomer,
                idLoadingPoint: action.data.idLoadingPoint,
                idUnloadingPoint: action.data.idUnloadingPoint,
                customerPrice: action.data.customerPrice,
                driverPrice: action.data.driverPrice,
                idTrackDriver: action.data.idTrackDriver,
                idTrack: action.data.idTrack,
                idManager: action.data.idManager,
                loadingInfo: action.data.loadingInfo,
                unloadingInfo: action.data.unloadingInfo,
                completed: action.data.completed,
                colorTR: action.data.colorTR,
                applicationNumber: action.data.applicationNumber,
                proxy: 1,
                document: 'нет',
                dateOfSubmission: null,
                customerPayment: 'нет',
                dateOfPromise: null,
                driverPayment: 'нет',
              },
            },
          },
        });
      }
    }
    case ADD_ORDER_APP_SUCCESS: {
      return update(store, {
        odersList: {
          $merge: {
            [store.odersList.length]: {
              _id: action.dataServer.insertId,
              date: action.data.date,
              idDriver: action.data.idDriver,
              idCustomer: action.data.idCustomer,
              idLoadingPoint: action.data.idLoadingPoint,
              idUnloadingPoint: action.data.idUnloadingPoint,
              customerPrice: action.data.customerPrice,
              driverPrice: action.data.driverPrice,
              idTrackDriver: action.data.idTrackDriver,
              idTrack: action.data.idTrack,
              idManager: action.data.idManager,
              loadingInfo: action.data.loadingInfo,
              unloadingInfo: action.data.unloadingInfo,
              completed: action.data.completed,
              colorTR: action.data.colorTR,
              applicationNumber: action.data.applicationNumber,
              proxy: 1,
              document: 'нет',
              dateOfSubmission: null,
              customerPayment: 'нет',
              dateOfPromise: null,
              driverPayment: 'нет',
            },
          },
        },
      });
    }
    case EDIT_ODER_NEW_SUCCESS: {
      if (action.orderTable == 'oderslist') {
        let index = store.odersList.findIndex(item => item._id == action.data._id);
        if (store.odersList[index].colorTR == 'hotpink') {
          let addIndex = store.addtable.findIndex(elem => elem.orderId == action.data._id);
          let { ...addObj } = store.addtable[addIndex];
          addObj.sum = action.data.price;
          addObj.interest = action.data.interest;
          return update(store, {
            odersList: {
              $merge: { [index]: action.data },
            },
            originOdersList: {
              $merge: { [index]: action.data },
            },
            addtable: {
              $merge: { [addIndex]: addObj },
            },
          });
        } else
          return update(store, {
            odersList: {
              $merge: { [index]: action.data },
            },
            originOdersList: {
              $merge: { [index]: action.data },
            },
          });
      } else {
        let index = store.driverOrderList.findIndex(item => item._id == action.data._id);
        return update(store, {
          driverOrderList: {
            $merge: { [index]: action.data },
          },
        });
      }
    }
    case EDIT_ODER_SUCCESS: {
      let index = store.odersList.findIndex(item => item._id == action.id);
      let originIndex = store.originOdersList.findIndex(item => item._id == action.id);
      let newOder = store.odersList[index];
      let newIncome = store.income;
      switch (action.field) {
        case 'date':
          newOder.date = action.newValue;
          break;
        case 'driver':
          newOder.idDriver = action.newValue;
          break;
        case 'oders':
          newOder.idCustomer = action.newValue;
          break;
        case 'loadingPoint':
          newOder.idLoadingPoint = action.newValue;
          break;
        case 'unloadingPoint':
          newOder.idUnloadingPoint = action.newValue;
          break;
        case 'oderPrice':
          newOder.customerPrice = action.newValue;
          break;
        case 'driverPrice':
          newOder.driverPrice = action.newValue;
          break;
        case 'proxy':
          newOder.proxy = action.newValue;
          break;
        case 'completed':
          newOder.completed = action.newValue;
          break;
        case 'document':
          let now = new Date();
          switch (action.newValue) {
            case 1:
              newOder.document = 'Ок';
              newOder.dateOfSubmission = now;
              break;
            case 2:
              newOder.document = 'Нет';
              newOder.dateOfSubmission = null;
              break;
            case 3:
              newOder.document = 'Факс';
              newOder.dateOfSubmission = now;
              break;
            case 4:
              newOder.document = 'Сдал';
              newOder.dateOfSubmission = now;
              break;
            default:
              break;
          }
          break;
        case 'customerPayment':
          let newValue = store.statusCustomerPay.find(item => item._id == action.newValue);

          if (store.odersList[index].customerPayment == 'Ок' && action.newValue != 1) {
            newIncome = Number(store.income) - Number(store.odersList[index].customerPrice);
          }
          if (store.odersList[index].customerPayment == 'Частично оплачен') {
            if (action.newValue == 1) {
              newIncome =
                Number(store.income) -
                Number(store.odersList[index].partialPaymentAmount) +
                Number(store.odersList[index].customerPrice);
            } else {
              newIncome =
                Number(store.income) - Number(store.odersList[index].partialPaymentAmount);
            }
            newOder.partialPaymentAmount = null;
          }
          if (action.newValue == 1) {
            if (
              store.odersList[index].customerPayment != 'Частично оплачен' &&
              store.odersList[index].customerPayment != 'Ок'
            ) {
              newIncome = Number(store.income) + Number(store.odersList[index].customerPrice);
            }
          }
          if (
            action.newValue == 1 ||
            action.newValue == 2 ||
            action.newValue == 6 ||
            action.newValue == 8
          ) {
            newOder.dateOfPromise = null;
          }
          if (
            action.newValue == 3 ||
            action.newValue == 4 ||
            action.newValue == 5 ||
            action.newValue == 7
          ) {
            let now = new Date();
            newOder.dateOfPromise = now;
          }
          newOder.customerPayment = newValue.value;
          break;
        case 'dateOfPromise':
          newOder.dateOfPromise = action.newValue;
          break;
        case 'driverPayment':
          if (store.odersList[index].driverPayment == 'Ок' && action.newValue != 1) {
            newIncome = Number(store.income) + Number(store.odersList[index].driverPrice);
          }
          if (store.odersList[index].driverPayment != 'Ок' && action.newValue == 1) {
            newIncome = Number(store.income) - Number(store.odersList[index].driverPrice);
          }
          switch (action.newValue) {
            case 1:
              newOder.driverPayment = 'Ок';
              break;
            case 2:
              newOder.driverPayment = 'нет';
              break;
            default:
              break;
          }
          break;
        case 'accountNumber':
          newOder.accountNumber = action.newValue;
          break;
        case 'applicationNumber':
          newOder.applicationNumber = action.newValue;
          break;
        case 'sumPartPay':
          newOder.partialPaymentAmount = action.newValue;
          newIncome = Number(store.income) + Number(store.odersList[index].partialPaymentAmount);
          break;
        default:
          break;
      }
      return update(store, {
        odersList: {
          $merge: { [index]: newOder },
        },
        originOdersList: {
          $merge: { [originIndex]: newOder },
        },
        income: { $set: newIncome },
        request: { $set: { status: 'SUCCESS', error: null } },
      });
    }
    case EDIT_ODER_FAILURE: {
      alert(action.dataServer.error);
      return { ...store, request: {} };
    }

    case SET_PROXY: {
      return store;
    }
    case DEL_ODER_SUCCESS: {
      console.log(action);
      if (action.orderTable == 'oderslist') {
        let arrAddTable = [...store.addtable];
        let color = store.odersList.find(item => item._id == action.id).colorTR;
        if (color == 'hotpink') {
          arrAddTable = store.addtable.filter(item => item.orderId != action.id);
        }
        let arrOders = store.odersList.filter(item => item._id != action.id);
        return { ...store, odersList: [...arrOders], addtable: [...arrAddTable] };
      } else {
        let arrOrders = store.driverOrderList.filter(order => order._id != action.id);
        return { ...store, driverOrderList: [...arrOrders] };
      }
    }

    case GET_FILTER_SUCCESS: {
      console.log(action.dataServer);
      function compareObj(a, b) {
        if (a.value > b.value) return 1;
        if (a.value == b.value) return 0;
        if (a.value < b.value) return -1;
      }
      let filteredDriverlist = [];
      action.dataServer.driver.forEach(item => {
        if (item.idDriver)
          filteredDriverlist.push(store.driverlist.find(elem => elem._id == item.idDriver));
      });
      filteredDriverlist.sort(compareObj);
      let filteredCustomerlist = [];
      action.dataServer.customer.forEach(item => {
        if (item.idCustomer)
          filteredCustomerlist.push(store.clientList.find(elem => elem._id == item.idCustomer));
      });
      filteredCustomerlist.sort(compareObj);
      let filteredLoadinglist = [];
      action.dataServer.loadingPoint.forEach(item => {
        if (item.idLoadingPoint != null && item.idLoadingPoint.length === 1) {
          filteredLoadinglist.push(
            store.citieslist.find(elem => elem._id == item.idLoadingPoint[0])
          );
        }
      });
      filteredLoadinglist.sort(compareObj);
      let filteredUnloadinglist = [];
      action.dataServer.unloadingPoint.forEach(item => {
        if (item.idUnloadingPoint != null && item.idUnloadingPoint.length === 1) {
          filteredUnloadinglist.push(
            store.citieslist.find(elem => elem._id == item.idUnloadingPoint[0])
          );
        }
      });
      filteredUnloadinglist.sort(compareObj);
      let filteredCustomerpayment = [];
      action.dataServer.customerPayment.forEach(item => {
        if (item.customerPayment)
          filteredCustomerpayment.push(
            store.statusCustomerPay.find(elem => elem.value == item.customerPayment)
          );
      });
      let filteredAccountNumber = [];
      action.dataServer.filterAccount.forEach(item => {
        if (item.accountNumber)
          filteredAccountNumber.push(
            store.accountList.find(elem => elem.value == item.accountNumber)
          );
      });
      let ordersList = sortOrdersList(action.dataServer.odersList);
      return {
        ...store,
        odersList: ordersList,
        filteredDateList: action.dataServer.date,
        filteredLoading: filteredLoadinglist,
        filteredUnloading: filteredUnloadinglist,
        filteredDrivers: filteredDriverlist,
        filteredClients: filteredCustomerlist,
        filteredCustomerPrice: action.dataServer.filteredCustomerPrice,
        filteredDriverPrice: action.dataServer.filteredDriverPrice,
        filteredStatusCustomerPayment: filteredCustomerpayment,
        filteredAccountList: filteredAccountNumber,
        request: { status: 'SUCCESS', error: null },
      };
    }
    case GET_FILTER_FAILURE: {
      return {
        ...store,
        request: {
          status: 'FAILURE',
          error: action.error,
        },
      };
    }

    case GET_DATA_SUCCESS: {
      let accountList = [];
      let i = 1;
      action.dataServer.accountList.forEach(item => {
        if (item.accountNumber) {
          accountList.push({ _id: i, value: item.accountNumber });
        }
        i++;
      });
      let ordersList = sortOrdersList(action.dataServer.odersList);
      let driverOrderList = sortOrdersList(action.dataServer.driverorderlist);
      let clone = [];
      ordersList.forEach(elem => {
        clone.push(Object.assign({}, elem));
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
        odersList: ordersList,
        clientmanager: action.dataServer.clientmanager,
        trackdrivers: action.dataServer.trackdrivers,
        tracklist: action.dataServer.tracklist,
        originOdersList: clone,
        driverOrderList: driverOrderList,
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
        addtable: action.dataServer.addtable,
        storelist: action.dataServer.storelist,
        driverpayments: action.dataServer.driverpayments,
        contractorsPayments: action.dataServer.contractorspayments,
        customerPaymentsList: action.dataServer.customerpayment,
        contractorsList: action.dataServer.contractors,
        incomereport: action.dataServer.incomereport,
        yearconst: action.dataServer.yearconst[0],
        request: {
          status: 'SUCCESS',
          error: null,
        },
      };
    }
    case GET_DATA_SUCCESS5000: {
      let ordersList = sortOrdersList(action.dataServer);
      let clone = [];
      ordersList.forEach(elem => {
        clone.push(Object.assign({}, elem));
      });
      return {
        ...store,
        odersList: ordersList,
        originOdersList: clone,
      };
    }
    case GET_DATA_FAILURE: {
      return {
        ...store,
        request: {
          status: 'FAILURE',
          error: true,
        },
      };
    }
    case GET_DATA_REQUEST: {
      return {
        ...store,
        request: {
          status: 'REQUEST',
          message: 'LOADING...',
          error: null,
        },
      };
    }
    case MAKE_PAYMENT_CUSTOMER_SUCCESS: {
      let extraPayments;
      let customerId = action.dataServer[0].idCustomer;
      let [...arrCustomer] = store.clientList;
      let indexCustomer = arrCustomer.findIndex(item => item._id == customerId);
      let sumChosenOders = action.arr.reduce(
        (sumCustumerPrice, item) => sumCustumerPrice + item.customerPrice,
        0
      );
      if (sumChosenOders == action.sumCustomerPayment + action.extraPayments) {
        extraPayments = null;
      } else {
        extraPayments = action.extraPayments + Number(action.sumCustomerPayment) - sumChosenOders;
      }
      let sum =
        store.income + Number(action.sumCustomerPayment) + action.extraPayments - extraPayments;
      let [...arr] = store.odersList;
      action.dataServer.forEach(elem => {
        let index = arr.findIndex(item => item._id == elem._id);
        arr[index] = elem;
      });
      arrCustomer[indexCustomer].extraPayments = extraPayments;
      return {
        ...store,
        odersList: arr,
        originOdersList: arr,
        income: sum,
        clientList: arrCustomer,
      };
    }
    case MAKE_PAYMENT_CUSTOMER_FAILURE: {
      alert(action.message.message);
      return store;
    }
    case GET_PAYMENTS_DATA_SUCCESS: {
      return {
        ...store,
        customerPaymentsList: action.dataServer,
      };
    }
    case GET_PAYMENTS_DATA_FAILURE: {
      return {
        ...store,
        request: {
          status: 'FAILURE',
          error: true,
        },
      };
    }
    case DELETE_PAYMENT_DATA_SUCCESS: {
      let [...newCustomerPaymentList] = store.customerPaymentsList;
      let delPaymentIndex = newCustomerPaymentList.findIndex(elem => elem.id == action.id);
      let delPayment = newCustomerPaymentList[delPaymentIndex];
      let [...newOderList] = store.odersList;
      let [...newClientList] = store.clientList;
      let client = newClientList.find(elem => elem._id == delPayment.idCustomer);
      let newIncome = store.income;
      let sum = 0;
      delPayment.listOfOders.forEach(elem => {
        let oder = newOderList.find(item => item._id == elem.id);
        sum = sum + elem.customerPrice;
        if (elem.customerPrice == oder.customerPrice) {
          oder.customerPayment = 'Нет';
          newIncome = newIncome - oder.customerPrice;
        } else {
          if (oder.customerPayment == 'Ок') {
            oder.customerPayment = 'Частично оплачен';
            oder.partialPaymentAmount = oder.customerPrice - elem.customerPrice;
            newIncome = newIncome - elem.customerPrice;
          } else {
            if (oder.partialPaymentAmoun == elem.customerPrice) {
              oder.customerPayment = 'Нет';
              oder.partialPaymentAmoun = null;
              newIncome = newIncome - elem.customerPrice;
            } else {
              oder.partialPaymentAmount = oder.partialPaymentAmount - elem.customerPrice;
              newIncome = newIncome - elem.customerPrice;
            }
          }
        }
      });
      console.log(newIncome);
      let diff = sum - delPayment.sumOfPayment;
      client.extraPayments = client.extraPayments + diff;
      newCustomerPaymentList.splice(delPaymentIndex, 1);
      return {
        ...store,
        customerPaymentsList: newCustomerPaymentList,
        odersList: newOderList,
        originOdersList: newOderList,
        clientList: newClientList,
        filteredClients: newClientList,
        income: newIncome,
      };
    }
    case DELETE_PAYMENT_DATA_FAILURE: {
      return {
        ...store,
        request: {
          status: 'FAILURE',
          error: true,
        },
      };
    }

    case GET_DATA_DRIVER_DEBT_SUCCESS: {
      return {
        ...store,
        driverDebtList: action.dataServer,
      };
    }

    case ADD_DATA_DRIVER_DEBT_SUCCESS: {
      let [...arr] = store.driverDebtList;
      arr.push({
        id: action.dataServer,
        date: action.data.date,
        idDriver: action.data.idDriver,
        category: action.data.categoryValue,
        sumOfDebt: action.data.sumOfDebt,
        debtClosed: action.data.debtClosedValue,
        addInfo: action.data.addInfo,
      });
      return {
        ...store,
        driverDebtList: arr,
      };
    }

    case EDIT_DATA_DRIVER_DEBT_SUCCESS: {
      let [...arr] = store.driverDebtList;
      let index = arr.findIndex(elem => elem.id == action.data.id);
      if (action.data.editField == 'date') {
        arr[index].date = action.data.newValue;
      }
      if (action.data.editField == 'idDriver') {
        arr[index].idDriver = action.data.newValue;
      }
      if (action.data.editField == 'category') {
        arr[index].category = action.data.newValue;
      }
      if (action.data.editField == 'sumOfDebt') {
        arr[index].sumOfDebt = action.data.newValue;
      }
      if (action.data.editField == 'addInfo') {
        arr[index].addInfo = action.data.newValue;
      }
      if (action.data.editField == 'debtClosed') {
        arr[index].debtClosed = action.data.newValue;
      }
      if (action.data.editField == 'card') {
        arr[index].card = action.data.newValue;
      }
      return {
        ...store,
        driverDebtList: arr,
      };
    }

    case DEL_DATA_DRIVER_DEBT_SUCCESS: {
      let [...arr] = store.driverDebtList;
      let index = arr.findIndex(elem => elem.id == action.id);
      arr.splice(index, 1);
      return { ...store, driverDebtList: arr };
    }

    case MAKE_PAYMENT_DRIVER_SUCCESS: {
      let [...arrOriginOders] = store.originOdersList;
      let [...arrOders] = store.odersList;
      let [...arrDebts] = store.driverDebtList;
      let expenses = Number(store.expenses);
      let sum = 0;
      let now = new Date();
      action.chosenOders.forEach(elem => {
        let index = arrOriginOders.findIndex(oder => oder._id == elem);
        arrOriginOders[index].driverPayment = 'Ок';
        arrOriginOders[index].dateOfPayment = now;
        index = arrOders.findIndex(oder => oder._id == elem);
        arrOders[index].driverPayment = 'Ок';
        arrOders[index].dateOfPayment = now;
      });
      action.chosenDebts.forEach(elem => {
        let index = arrDebts.findIndex(debt => debt.id == elem.id);
        let sumOfDebt = Number(arrDebts[index].sumOfDebt);
        let paidPartOfDebt = Number(arrDebts[index].paidPartOfDebt);
        sum = sum + elem.sum;
        if (sumOfDebt > paidPartOfDebt + elem.sum) {
          arrDebts[index].paidPartOfDebt = paidPartOfDebt + elem.sum;
          arrDebts[index].debtClosed = 'частично';
        } else {
          arrDebts[index].paidPartOfDebt = 0;
          arrDebts[index].debtClosed = 'Ок';
        }
      });
      expenses = expenses + action.currentDriverSumOfOders - sum;
      return {
        ...store,
        originOdersList: arrOriginOders,
        odersList: arrOders,
        driverDebtList: arrDebts,
        expenses: expenses,
      };
    }
    case MAKE_PAYMENT_DRIVER_FAILURE: {
      alert(action.message.message);
      return store;
    }
    case GET_DATA_CONTRACTORS_SUCCESS: {
      return {
        ...store,
        contractorsList: action.dataServer.contractors,
        contractorsPayments: action.dataServer.contractorsPayments,
      };
    }
    case ADD_DATA_CONTRACTORS_SUCCESS:
      console.log(action.dataServer, action.data);
      let expenses = Number(store.expenses);
      let [...arrContractorsPayment] = store.contractorsPayments;
      let { ...contractorPayment } = action.data;
      contractorPayment.id = action.dataServer;
      expenses = Number(expenses) + Number(action.data.sum);
      arrContractorsPayment.push(contractorPayment);
      return {
        ...store,
        expenses: expenses,
        contractorsPayments: arrContractorsPayment,
      };
    case EDIT_DATA_SUCCESS:
      console.log(action.dataServer, action.newData, action.editTable);
      switch (action.editTable) {
        case 'drivers':
          let [...arrDrivers] = store.driverlist;
          let indexDriver = arrDrivers.findIndex(elem => elem._id == action.newData._id);
          arrDrivers[indexDriver] = action.newData;
          return { ...store, driverlist: arrDrivers };
        case 'trackdrivers':
          let [...arrTrackDrivers] = store.trackdrivers;
          let indexTrackDriver = arrTrackDrivers.findIndex(elem => elem._id == action.newData._id);
          arrTrackDrivers[indexTrackDriver] = action.newData;
          return { ...store, trackdrivers: arrTrackDrivers };
        case 'tracklist':
          let [...arrTrack] = store.tracklist;
          let indexTrack = arrTrack.findIndex(elem => elem._id == action.newData._id);
          arrTrack[indexTrack] = action.newData;
          return { ...store, tracklist: arrTrack };
        case 'cities':
          let [...arrPoints] = store.citieslist;
          let indexPoint = arrPoints.findIndex(elem => elem._id == action.newData._id);
          arrPoints[indexPoint] = action.newData;
          return { ...store, citieslist: arrPoints };
        case 'oders':
          let [...arrCustomers] = store.clientList;
          let indexCustomer = arrCustomers.findIndex(elem => elem._id == action.newData._id);
          arrCustomers[indexCustomer] = action.newData;
          return { ...store, clientList: arrCustomers };
        case 'clientmanager':
          let [...arrManagers] = store.clientmanager;
          let indexManager = arrManagers.findIndex(elem => elem._id == action.newData._id);
          arrManagers[indexManager] = action.newData;
          return { ...store, clientmanager: arrManagers };
        case 'incomereport': {
          let arr = [...store[action.editTable]];
          let index = arr.findIndex(elem => elem._id == action.newData._id);
          arr[index] = action.newData;
          return { ...store, [action.editTable]: arr };
        }
        case 'storelist': {
          let arr = [...store[action.editTable]];
          let index = arr.findIndex(elem => elem._id == action.newData._id);
          arr[index] = action.newData;
          return { ...store, [action.editTable]: arr };
        }
        case 'contractors': {
          let arr = [...store.contractorsList];
          let index = arr.findIndex(elem => elem._id == action.newData._id);
          arr[index] = action.newData;
          return { ...store, contractorsList: arr };
        }
        case 'contractorspayments': {
          let arr = [...store.contractorsPayments];
          let index = arr.findIndex(elem => elem.id == action.newData.id);
          arr[index] = action.newData;
          return { ...store, contractorsPayments: arr };
        }
        default:
          break;
      }
    case ADD_DATA_SUCCESS:
      console.log(action.dataServer, action.data, action.editTable);
      switch (action.editTable) {
        case 'drivers':
          let [...arrDrivers] = store.driverlist;
          action.data._id = action.dataServer.insertId;
          arrDrivers.push(action.data);
          return { ...store, driverlist: arrDrivers };
        case 'trackdrivers':
          let [...arrTrackDrivers] = store.trackdrivers;
          action.data._id = action.dataServer.insertId;
          arrTrackDrivers.push(action.data);
          return { ...store, trackdrivers: arrTrackDrivers };
        case 'tracklist':
          let [...arrTrack] = store.tracklist;
          action.data._id = action.dataServer.insertId;
          arrTrack.push(action.data);
          return { ...store, tracklist: arrTrack };
        case 'cities':
          let [...arrPoints] = store.citieslist;
          action.data._id = action.dataServer.insertId;
          arrPoints.push(action.data);
          return { ...store, citieslist: arrPoints };
        case 'oders':
          let [...arrCustomers] = store.clientList;
          action.data._id = action.dataServer.insertId;
          arrCustomers.push(action.data);
          return { ...store, clientList: arrCustomers };
        case 'clientmanager':
          let [...arrManagers] = store.clientmanager;
          action.data._id = action.dataServer.insertId;
          arrManagers.push(action.data);
          return { ...store, clientmanager: arrManagers };
        case 'storelist':
          let [...arrStories] = store.storelist;
          action.data._id = action.dataServer.insertId;
          arrStories.push(action.data);
          return { ...store, storelist: arrStories };
        case 'incomereport': {
          let arr = [...store[action.editTable]];
          action.data._id = action.dataServer.insertId;
          arr.push(action.data);
          return { ...store, [action.editTable]: arr };
        }
        case 'contractors': {
          let arr = [...store.contractorsList];
          action.data._id = action.dataServer.insertId;
          arr.push(action.data);
          return { ...store, contractorsList: arr };
        }
        default:
          break;
      }

    case ADD_DATA_FAILURE:
      console.log(action.message);
      return { ...store, message: 'err' };

    case DEL_DATA_SUCCESS:
      switch (action.editTable) {
        case 'drivers':
          let [...arrDrivers] = store.driverlist;
          let indexDriver = arrDrivers.findIndex(elem => elem._id == action.id);
          arrDrivers.splice(indexDriver, 1);
          return { ...store, driverlist: arrDrivers };
        case 'trackdrivers':
          let [...arrTrackDrivers] = store.trackdrivers;
          let indexTrackDriver = arrTrackDrivers.findIndex(elem => elem._id == action.id);
          arrTrackDrivers.splice(indexTrackDriver, 1);
          return { ...store, trackdrivers: arrTrackDrivers };
        case 'tracklist':
          let [...arrTrack] = store.tracklist;
          let indexTrack = arrTrack.findIndex(elem => elem._id == action.id);
          arrTrack.splice(indexTrack, 1);
          return { ...store, tracklist: arrTrack };
        case 'cities':
          let [...arrPoints] = store.citieslist;
          let indexPoint = arrPoints.findIndex(elem => elem._id == action.id);
          arrPoints.splice(indexPoint, 1);
          return { ...store, citieslist: arrPoints };
        case 'oders':
          let [...arrCustomers] = store.clientList;
          let indexCustomer = arrCustomers.findIndex(elem => elem._id == action.id);
          arrCustomers.splice(indexCustomer, 1);
          return { ...store, clientList: arrCustomers };
        case 'clientmanager':
          let [...arrManagers] = store.clientmanager;
          let indexManager = arrManagers.findIndex(elem => elem._id == action.id);
          arrManagers.splice(indexManager, 1);
          return { ...store, clientmanager: arrManagers };
        case 'storelist':
          let [...arrStories] = store.storelist;
          let indexStore = arrStories.findIndex(elem => elem._id == action.id);
          arrStories.splice(indexStore, 1);
          return { ...store, storelist: arrStories };
        case 'contractors':
          let [...arrContractors] = store.contractorsList;
          let indexContractor = arrContractors.findIndex(elem => elem._id == action.id);
          arrContractors.splice(indexContractor, 1);
          return { ...store, contractorsList: arrContractors };
        default:
          break;
      }

    case DEL_DATA_FAILURE:
      console.log(action.message);
      return { ...store, message: action.message };

    case DEL_DATA_CONTRACTORS_SUCCESS: {
      console.log(action.id);
      let expenses = Number(store.expenses);
      let [...arrContractorsPayment] = store.contractorsPayments;
      let index = arrContractorsPayment.findIndex(elem => elem.id == action.id);
      expenses = Number(expenses) - Number(arrContractorsPayment[index].sum);
      arrContractorsPayment.splice(index, 1);
      return {
        ...store,
        expenses: expenses,
        contractorsPayments: arrContractorsPayment,
      };
    }

    case CREATE_NEW_INVOICE_SUCCESS: {
      console.log('hi25');

      let [...arr] = store.odersList;
      let docNumber = action.invoiceNumber;
      if (!isNaN(docNumber)) {
        if (docNumber < 10 && docNumber > 0) docNumber = '000' + docNumber;
        if (docNumber < 100 && docNumber > 9) docNumber = '00' + docNumber;
        if (docNumber < 1000 && docNumber > 99) docNumber = '0' + docNumber;
        if (docNumber < 10000 && docNumber > 999) docNumber = '' + docNumber;
      }
      action.arrOrderId.forEach(id => {
        let index = arr.findIndex(elem => elem._id == id);
        arr[index].accountNumber = docNumber;
      });
      return { ...store, odersList: arr, originOdersList: arr, request: {} };
    }
    case CREATE_NEW_INVOICE_REQUEST: {
      return { ...store, request: { status: 'REQUEST', message: 'Create new invoice' } };
    }
    case CREATE_NEW_INVOICE_FAILURE: {
      return { ...store, request: { status: 'FAILURE', error: action.error } };
    }
    case SEND_EMAIL_SUCCESS: {
      let index = store.odersList.findIndex(item => item._id == Number(action.id));
      let originIndex = store.originOdersList.findIndex(item => item._id == action.id);
      let newOder = store.odersList[index];
      if (newOder.customerPayment == 'Нет' || newOder.customerPayment == 'Печать') {
        newOder.customerPayment = 'Мыло';
        newOder.dateOfPromise = new Date();
      }
      return update(store, {
        odersList: {
          $merge: { [index]: newOder },
        },
        originOdersList: {
          $merge: { [originIndex]: newOder },
        },
      });
    }
    case DELETE_ADDDATE_SUCCESS: {
      let [...arr] = store.addtable;
      console.log(arr);
      arr = store.addtable.filter(elem => elem.id != action.id);
      return { ...store, addtable: arr };
    }
    case EDIT_ADDDATA_SUCCESS: {
      console.log(action);
      let index = store.addtable.findIndex(elem => elem.id == action.data.id);
      return update(store, {
        addtable: { $merge: { [index]: action.data } },
        request: { $merge: { status: 'SUCCESS', error: null } },
      });
    }
    case EDIT_ADDDATA_FAILURE: {
      console.log(action, store.request);
      alert('Shit happens!');
      return {
        ...store,
        request: {
          status: 'FAILURE',
          error: true,
        },
      };
    }
    case AUTH_SIGN_IN_SUCCESS: {
      console.log(action);
      if (action.dataServer.error) {
        return { ...store, currentUser: {} };
      } else {
        return { ...store, currentUser: action.dataServer };
      }
    }
    case AUTH_GET_USER_SUCCESS: {
      console.log(action);
      if (action.dataServer.error) {
        return { ...store, currentUser: {} };
      } else {
        return {
          ...store,
          currentUser: action.dataServer.userData,
          currentOwner: action.dataServer.ownerData,
        };
      }
    }
    case AUTH_SIGN_OUT_SUCCESS: {
      return { ...store, currentUser: { name: null, role: null } };
    }
    case CREATE_APP_SUCCESS: {
      console.log(action);
      let index = store.odersList.findIndex(item => item._id == action.id);
      let originIndex = store.originOdersList.findIndex(item => item._id == action.id);
      let newOder = store.odersList[index];
      newOder.applicationNumber = action.appNumber;
      return update(store, {
        odersList: {
          $merge: { [index]: newOder },
        },
        originOdersList: {
          $merge: { [originIndex]: newOder },
        },
      });
    }
    case EDIT_YEAR_CONST_SUCCESS: {
      console.log(action);
      let obj = { ...store.yearconst };
      obj[action.name] = action.data;
      return { ...store, yearconst: obj };
    }
    case GET_PDF_WITHOUT_STAMP_SUCCESS: {
      let index = store.odersList.findIndex(order => order._id == action.id);
      let originIndex = store.originOdersList.findIndex(order => order._id == action.id);
      let newOrder = store.odersList[index];
      newOrder.wasItPrinted = 1;
      console.log(newOrder);
      return update(store, {
        odersList: {
          $merge: { [index]: newOrder },
        },
        originOdersList: {
          $merge: { [originIndex]: newOrder },
        },
      });
    }
    case DEL_PRINTED_MARK_SUCCESS: {
      let index = store.odersList.findIndex(order => order._id == action.id);
      let originIndex = store.originOdersList.findIndex(order => order._id == action.id);
      let newOrder = store.odersList[index];
      newOrder.wasItPrinted = 0;
      console.log(newOrder);
      return update(store, {
        odersList: {
          $merge: { [index]: newOrder },
        },
        originOdersList: {
          $merge: { [originIndex]: newOrder },
        },
      });
    }
    case ADD_CONTRACT_REQUEST: {
      return { ...store, request: { status: 'REQUEST' } };
    }
    case ADD_CONTRACT_FAILURE: {
      return { ...store, request: { status: 'FAILURE', error: 'error' } };
    }
    case ADD_CONTRACT_SUCCESS: {
      return { ...store, request: {} };
    }
    case ADD_DRIVER_CONTRACT_REQUEST: {
      return { ...store, request: { status: 'REQUEST' } };
    }
    case ADD_DRIVER_CONTRACT_FAILURE: {
      return { ...store, request: { status: 'FAILURE', error: 'error' } };
    }
    case ADD_DRIVER_CONTRACT_SUCCESS: {
      return { ...store, request: {} };
    }

    case MAKE_CARD_PAYMENT_REQUEST: {
      return { ...store, request: { status: 'REQUEST' } };
    }
    case MAKE_CARD_PAYMENT_FAILURE: {
      return { ...store, request: { status: 'FAILURE', error: 'error' } };
    }
    case MAKE_CARD_PAYMENT_SUCCESS: {
      let now = new Date();
      let Year = now.getFullYear();
      let Month = now.getMonth();
      let Day = now.getDate();
      let date = `${Year}-${Month}-${Day}`;
      let sumOfDriverDebts = action.dataServer.sumOfDriverDebts;
      let sumOfCustomerDebts = action.dataServer.sumOfCustomerDebts;
      let expenses = Number(store.expenses) + sumOfDriverDebts + sumOfCustomerDebts;
      let [...addtable] = store.addtable;
      let customerDebtsId = action.data.customerDebtsId;
      customerDebtsId.forEach(id => {
        let index = addtable.findIndex(debt => debt.id == id);
        addtable[index].card = 1;
      });
      let [...contractorsPayments] = store.contractorsPayments;
      if (action.dataServer.customerPaymentId) {
        contractorsPayments.push({
          id: action.dataServer.customerPaymentId,
          idContractor: 5,
          date: date,
          sum: action.dataServer.sumOfCustomerDebts,
          category: 3,
        });
      }
      if (action.dataServer.driverPaymentId) {
        contractorsPayments.push({
          id: action.dataServer.driverPaymentId,
          idContractor: 5,
          date: date,
          sum: action.dataServer.sumOfDriverDebts,
          category: 2,
        });
      }
      let [...driverDebtList] = store.driverDebtList;
      let driverDebtsId = action.data.driverDebtsId;
      driverDebtsId.forEach(id => {
        let index = driverDebtList.findIndex(debt => debt.id == id);
        driverDebtList[index].card = 1;
      });

      return {
        ...store,
        expenses: expenses,
        addtable: [...addtable],
        contractorsPayments: contractorsPayments,
        driverDebtList: driverDebtList,
      };
    }
    case ADD_POST_TRACK_SUCCESS: {
      let listOfOders = action.data.orderList;
      let newOrderList = [...store.odersList];
      let newOriginOrderLis = [...store.originOdersList];
      console.log('hi');

      listOfOders.forEach(id => {
        let index = newOrderList.findIndex(order => order._id == id);
        if (index != -1) {
          newOrderList[index].postTracker = action.data.postTrackNumber;
          if (
            newOrderList[index].customerPayment != 'Ок' &&
            newOrderList[index].customerPayment != 'Частично оплачен'
          )
            newOrderList[index].customerPayment = 'Почта';
        }
        let indexOrigin = newOriginOrderLis.findIndex(order => order._id == id);
        if (indexOrigin != -1) {
          newOriginOrderLis[indexOrigin].postTracker = action.data.postTrackNumber;
          if (
            newOriginOrderLis[indexOrigin].customerPayment != 'Ок' &&
            newOriginOrderLis[indexOrigin].customerPayment != 'Частично оплачен'
          )
            newOriginOrderLis[indexOrigin].customerPayment = 'Почта';
        }
      });
      return {
        ...store,
        odersList: newOrderList,
        originOdersList: newOriginOrderLis,
        request: {},
      };
    }
    case ADD_POST_TRACK_REQUEST: {
      return { ...store, request: { status: 'REQUEST' } };
    }
    case ADD_POST_TRACK_FAILURE: {
      alert(action.data.error);
      return { ...store, request: {} };
    }
    case DEL_DRIVER_PAYMENT_SUCCESS_ORDER: {
      const arrPayments = [...store.driverpayments];
      const arrOriginOders = [...store.originOdersList];
      const arrOders = [...store.odersList];
      const arrDebts = [...store.driverDebtList];
      let expenses = Number(store.expenses);

      let index = arrPayments.findIndex(payment => payment.id == action.id);
      let payment = arrPayments[index];
      let listOfOders = payment.listOfOders;
      let listOfDebtsInfo = payment.listOfDebts;
      listOfOders.forEach(orderId => {
        let index = arrOriginOders.findIndex(order => order._id == orderId);
        arrOriginOders[index].driverPayment = 'нет';
        index = arrOders.findIndex(order => order._id == orderId);
        arrOders[index].driverPayment = 'нет';
      });
      listOfDebtsInfo.forEach(debtInfo => {
        let index = arrDebts.findIndex(debt => debt.id == debtInfo.id);
        if (arrDebts[index].sumOfDebt == debtInfo.sum) {
          arrDebts[index].debtClosed = 'нет';
          arrDebts[index].paidPartOfDebt = null;
        } else {
          let paidPartOfDebt = arrDebts[index].paidPartOfDebt - debtInfo.sum;
          if (paidPartOfDebt == 0) {
            arrDebts[index].debtClosed = 'нет';
            arrDebts[index].paidPartOfDebt = null;
          } else {
            arrDebts[index].debtClosed = 'частично';
            arrDebts[index].paidPartOfDebt = paidPartOfDebt;
          }
        }
      });
      arrPayments.splice(index, 1);
      expenses = expenses - Number(payment.sumOfPayment) + Number(payment.sumOfDebts);
      return {
        ...store,
        driverpayments: arrPayments,
        originOdersList: arrOriginOders,
        odersList: arrOders,
        driverDebtList: arrDebts,
        expenses: expenses,
      };
    }
    case CREATE_SOMEDOC_NEW_REQUEST: {
      return { ...store, request: { status: 'REQUEST', message: 'SAVING' } };
    }
    case ADD_CONSIGNMENT_NOTE_SUCCESS: {
      return { ...store, request: {} };
    }
    case ADD_CONSIGNMENT_NOTE_FAILURE: {
      return { ...store, request: { status: 'FAILURE', error: 'error' } };
    }
    case CREATE_DOC_WITHOUT_STAMP_REQUEST: {
      return {
        ...store,
        request: { status: 'REQUEST', message: 'Saving new invoice without stamp...' },
      };
    }
    case CREATE_DOC_WITHOUT_STAMP_SUCCESS: {
      return { ...store, request: {} };
    }
    case CREATE_DOC_WITHOUT_STAMP_FAILURE: {
      return { ...store, request: { status: 'FAILURE', error: action.error } };
    }

    default:
      return store;
  }
};
