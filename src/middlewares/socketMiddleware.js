import { io } from 'socket.io-client';
import { DOMENNAME } from './initialState';

// Actions для заказов
import {
  addOderSuccess,
  delOderSuccess,
  editOrderFailure,
  editOrderSuccess,
  editOderNewSuccess,
  makePaymentCustomerSuccess,
  addOrderAppSuccess,
  delPrintedMarkSuccess,
} from '../actions/oderActions';

// Actions для документов
import {
  createNewInvoiceSuccess,
  sendEmailSuccess,
  createAppSuccess,
} from '../actions/documentAction';

// Actions для водителей
import {
  delDriverPaymentSuccessDriver,
  makePaymentDriverSuccess,
  delDriverPaymentSuccessOrder,
  addDataDriverDebtSuccess,
  delDataDriverDebtSuccess,
  editDataDriverDebtSuccess,
} from '../actions/driverActions';

// Actions для данных
import { editDataSuccess, addDataSuccess, delDataSuccess } from '../actions/editDataAction';

const socket = io(DOMENNAME);

export const socketMiddleware = store => next => action => {
  // Подписываемся на событие только один раз
  if (!socket.hasListeners('orderAdded')) {
    socket.on('orderAdded', data => {
      console.log('Получен новый заказ через WebSocket:', data);
      store.dispatch(addOderSuccess(data.data, data.dataOrder, data.orderTable));
    });
  }
  if (!socket.hasListeners('orderDelete')) {
    socket.on('orderDeleted', data => {
      console.log('Удален заказ через WebSocket:', data);
      store.dispatch(delOderSuccess(data.id, data.orderTable));
    });
  }
  if (!socket.hasListeners('orderChanged')) {
    socket.on('orderChanged', data => {
      console.log('Изменен заказ через WebSocket:', data);
      if (data.data.error) {
        store.dispatch(editOrderFailure(data.data));
      } else {
        store.dispatch(
          editOrderSuccess(
            data.dataOrder.id,
            data.dataOrder.field,
            data.dataOrder.newValue,
            data.dataOrder.orderTable
          )
        );
      }
    });
  }
  if (!socket.hasListeners('orderChangedNew')) {
    socket.on('orderChangedNew', data => {
      console.log('Изменен заказ через WebSocket New:', data);
      store.dispatch(editOderNewSuccess(data.data, data.orderTable));
    });
  }
  if (!socket.hasListeners('madePaymentCustomer')) {
    socket.on('madePaymentCustomer', data => {
      console.log('Проведена оплата заказов через WebSocket New:', data);
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
  if (!socket.hasListeners('madeOrderFromApp')) {
    socket.on('madeOrderFromApp', data => {
      console.log('Создан заказ из заявки через WebSocket New:', data);
      store.dispatch(addOrderAppSuccess(data.data, data.dataIo, data.appId));
    });
  }
  if (!socket.hasListeners('DeletedPrintedMark')) {
    socket.on('DeletedPrintedMark', data => {
      console.log('Удалена метка печати счета через WebSocket New:', data);
      store.dispatch(delPrintedMarkSuccess(data));
    });
  }
  if (!socket.hasListeners('createdDoc')) {
    socket.on('createdDoc', data => {
      console.log('создан pdf документ через WebSocket New:', data);
      store.dispatch(createNewInvoiceSuccess(data.invoiceNumber, data.arrOrderId));
    });
  }
  if (!socket.hasListeners('createdApp')) {
    socket.on('createdApp', data => {
      console.log('Создана заявка через WebSocket New:', data);
      store.dispatch(createAppSuccess(data.id, data.appNumber));
    });
  }
  if (!socket.hasListeners('sentEmail')) {
    socket.on('sentEmail', data => {
      console.log('Отправлен pdf документ по Email через WebSocket New:', data);
      store.dispatch(sendEmailSuccess(data));
    });
  }
  if (!socket.hasListeners('madePaymentDriver')) {
    socket.on('madePaymentDriver', data => {
      console.log('Отправлен платеж водителю через WebSocket New:', data);
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
  if (!socket.hasListeners('deletedDriverPayment')) {
    socket.on('deletedDriverPayment', data => {
      console.log('Удален платеж водителю через WebSocket New:', data);
      store.dispatch(delDriverPaymentSuccessOrder(data));
      store.dispatch(delDriverPaymentSuccessDriver(data));
    });
  }
  if (!socket.hasListeners('addedDriversDebt')) {
    socket.on('addedDriversDebt', data => {
      console.log('Добавлен долг водителя через WebSocket New:', data);
      store.dispatch(addDataDriverDebtSuccess(data.data, data.dataIo));
    });
  }
  if (!socket.hasListeners('deletedDriverDebt')) {
    socket.on('deletedDriverDebt', data => {
      console.log('Удален долг водителя через WebSocket New:', data);
      store.dispatch(delDataDriverDebtSuccess(data));
    });
  }
  if (!socket.hasListeners('editedDriverDebt')) {
    socket.on('editedDriverDebt', data => {
      console.log('Изменен долг водителя через WebSocket:', data);
      store.dispatch(editDataDriverDebtSuccess(data));
    });
  }
  if (!socket.hasListeners('editedData')) {
    socket.on('editedData', data => {
      console.log('Изменены данные через WebSocket:', data);
      store.dispatch(editDataSuccess(data.dataServer, data.newData, data.editTable));
    });
  }
  if (!socket.hasListeners('addedData')) {
    socket.on('addedData', data => {
      console.log('Добавлены данные через WebSocket:', data);
      store.dispatch(addDataSuccess(data.dataServer, data.newData, data.editTable));
    });
  }
  if (!socket.hasListeners('delData')) {
    socket.on('delData', data => {
      console.log('Удалены данные через WebSocket:', data);
      store.dispatch(delDataSuccess(data.id, data.editTable));
    });
  }

  return next(action);
};
