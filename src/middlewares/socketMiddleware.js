import { io } from "socket.io-client";
import {
  addOderSuccess,
  delOderSuccess,
  editOrderFailure,
  editOrderSuccess,
  editOderNewSuccess,
  makePaymentCustomerSuccess,
  addOrderAppSuccess,
  delPrintedMarkSuccess,
} from "../actions/oderActions";
import {
  createNewInvoiceSuccess,
  sendEmailSuccess,
  createAppSuccess,
} from "../actions/documentAction";
import { DOMENNAME } from "./initialState";
import { makePaymentDriverSuccess } from "../actions/driverActions";

const socket = io(DOMENNAME);

export const socketMiddleware = (store) => (next) => (action) => {
  // Подписываемся на событие только один раз
  if (!socket.hasListeners("orderAdded")) {
    socket.on("orderAdded", (data) => {
      console.log("Получен новый заказ через WebSocket:", data);
      store.dispatch(addOderSuccess(data.data, data.dataOrder));
    });
  }
  if (!socket.hasListeners("orderDelete")) {
    socket.on("orderDeleted", (data) => {
      console.log("Удален заказ через WebSocket:", data);
      store.dispatch(delOderSuccess(data));
    });
  }
  if (!socket.hasListeners("orderChanged")) {
    socket.on("orderChanged", (data) => {
      console.log("Изменен заказ через WebSocket:", data);
      if (data.data.error) {
        store.dispatch(editOrderFailure(data.data));
      } else {
        store.dispatch(
          editOrderSuccess(
            data.dataOrder.id,
            data.dataOrder.field,
            data.dataOrder.newValue
          )
        );
      }
    });
  }
  if (!socket.hasListeners("orderChangedNew")) {
    socket.on("orderChangedNew", (data) => {
      console.log("Изменен заказ через WebSocket New:", data);
      store.dispatch(editOderNewSuccess(data));
    });
  }
  if (!socket.hasListeners("madePaymentCustomer")) {
    socket.on("madePaymentCustomer", (data) => {
      console.log("Проведена оплата заказов через WebSocket New:", data);
      store.dispatch(
        makePaymentCustomerSuccess(
          data.data,
          data.dataIo.sumCustomerPayment,
          data.dataIo.extraPayments,
          data.dataIo.arr
        )
      );
    });
  }
  if (!socket.hasListeners("madeOrderFromApp")) {
    socket.on("madeOrderFromApp", (data) => {
      console.log("Создан заказ из заявки через WebSocket New:", data);
      store.dispatch(addOrderAppSuccess(data.data, data.dataIo, data.appId));
    });
  }
  if (!socket.hasListeners("DeletedPrintedMark")) {
    socket.on("DeletedPrintedMark", (data) => {
      console.log("Удалена метка печати счета через WebSocket New:", data);
      store.dispatch(delPrintedMarkSuccess(data));
    });
  }
  if (!socket.hasListeners("createdDoc")) {
    socket.on("createdDoc", (data) => {
      console.log("создан pdf документ через WebSocket New:", data);
      store.dispatch(
        createNewInvoiceSuccess(data.invoiceNumber, data.arrOrderId)
      );
    });
  }
  if (!socket.hasListeners("createdApp")) {
    socket.on("createdApp", (data) => {
      console.log("Создана заявка через WebSocket New:", data);
      store.dispatch(createAppSuccess(data.id, data.appNumber));
    });
  }
  if (!socket.hasListeners("sentEmail")) {
    socket.on("sentEmail", (data) => {
      console.log("Отправлен pdf документ по Email через WebSocket New:", data);
      store.dispatch(sendEmailSuccess(data));
    });
  }
  if (!socket.hasListeners("madePaymentDriver")) {
    socket.on("madePaymentDriver", (data) => {
      console.log("Отправлен платеж водителю через WebSocket New:", data);
      store.dispatch(
        makePaymentDriverSuccess(
          data.data,
          data.dataIo.chosenOders,
          data.dataIo.chosenDebts,
          data.dataIo.currentDriverSumOfOders
        )
      );
    });
  }

  return next(action);
};
