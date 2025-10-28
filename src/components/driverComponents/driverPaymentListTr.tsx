import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DriverDebt, DriverDebtInfo, DriverPayment, Point, TrackDriver } from '../tsTypes.js';
import { Driver } from '../tsTypes.js';
import { OrderType } from '../tsTypes.js';
import { findValueBy_Id, findValueById } from '../myLib/myLib.js';
import { delDriverPayment } from '../../actions/driverActions.js';
import './driverForms.sass';

export const DriverPaymentListTr = (props: any) => {
  const [showOrderList, setShowOrderList] = useState<boolean>(false);
  const [showDebtList, setShowDebtList] = useState<boolean>(false);
  const [classNameTr, setClassNameTr] = useState<string>('');
  let payment: DriverPayment = props.payment;
  let orderList: number[] = payment.listOfOders;
  let debtList: DriverDebtInfo[] = payment.listOfDebts;

  const driverList: Driver[] = useSelector((state: any) => state.oderReducer.driverlist);
  const orderFullList: OrderType[] = useSelector((state: any) => state.oderReducer.originOdersList);
  const trackDriverList: TrackDriver[] = useSelector(
    (state: any) => state.oderReducer.trackdrivers
  );
  const pointList: Point[] = useSelector((state: any) => state.oderReducer.citieslist);
  const driverDebtList: DriverDebt[] = useSelector(
    (state: any) => state.oderReducer.driverDebtList
  );

  const dispatch = useDispatch();

  const handleClickTr = (payment: DriverPayment) => {
    console.log(payment);
    if (classNameTr == '') {
      setClassNameTr('blueTr');
    } else {
      setClassNameTr('');
    }
    if (payment.listOfOders.length > 0) setShowOrderList(!showOrderList);
    if (payment.listOfDebts.length > 0) setShowDebtList(!showDebtList);
  };
  const handleClickDelete = () => {
    let password = prompt('Подтвердите удаление', 'Пароль');
    if (password == 'Пароль') {
      dispatch(delDriverPayment(payment.id));
    }
  };
  return (
    <React.Fragment>
      <tr onClick={() => handleClickTr(payment)} className={classNameTr}>
        <td className="driverPaymentTd">{new Date(payment.date).toLocaleDateString()}</td>
        <td className="driverPaymentTd">{findValueBy_Id(payment.idDriver, driverList).value}</td>
        <td className="driverPaymentTd">{payment.sumOfPayment}</td>
        <td className="driverPaymentTd">
          {showOrderList == false && showDebtList == false ? (
            payment.sumOfDebts
          ) : (
            <React.Fragment>
              <span>{payment.sumOfPayment}</span>
              <div className="customerPaymentTrClose" onClick={handleClickDelete}>
                <svg width="20px" height="20px" viewBox="0 0 60 60">
                  <g transform="translate(232.000000, 228.000000)">
                    <polygon points="-207,-205 -204,-205 -204,-181 -207,-181    " />
                    <polygon points="-201,-205 -198,-205 -198,-181 -201,-181    " />
                    <polygon points="-195,-205 -192,-205 -192,-181 -195,-181    " />
                    <polygon points="-219,-214 -180,-214 -180,-211 -219,-211    " />
                    <path d="M-192.6-212.6h-2.8v-3c0-0.9-0.7-1.6-1.6-1.6h-6c-0.9,0-1.6,0.7-1.6,1.6v3h-2.8v-3     c0-2.4,2-4.4,4.4-4.4h6c2.4,0,4.4,2,4.4,4.4V-212.6" />
                    <path d="M-191-172.1h-18c-2.4,0-4.5-2-4.7-4.4l-2.8-36l3-0.2l2.8,36c0.1,0.9,0.9,1.6,1.7,1.6h18     c0.9,0,1.7-0.8,1.7-1.6l2.8-36l3,0.2l-2.8,36C-186.5-174-188.6-172.1-191-172.1" />
                  </g>
                </svg>
              </div>
            </React.Fragment>
          )}
        </td>
      </tr>
      {showOrderList && (
        <tr>
          <td colSpan={4}>
            <table className="driverOrdersLitTable">
              <thead className="driverPaymentsListMainTableThead">
                <tr>
                  <td>Дата</td>
                  <td>Водитель</td>
                  <td>Погрузка</td>
                  <td>Выгрузка</td>
                  <td>Цена</td>
                  <td>Номер счета</td>
                </tr>
              </thead>
              <tbody>
                {orderList.map((orderId: number) => {
                  let order: OrderType | null = findValueBy_Id(orderId, orderFullList) || null;
                  console.log(order);
                  if (order != null) {
                    let trackdriver: TrackDriver = findValueBy_Id(
                      order.idTrackDriver,
                      trackDriverList
                    );
                    let pointLoadList: string[] = order.idLoadingPoint.map((idPoint: number) => {
                      return findValueBy_Id(idPoint, pointList).value;
                    });
                    let pointUnloadList: string[] = order.idUnloadingPoint.map(
                      (idPoint: number) => {
                        return findValueBy_Id(idPoint, pointList).value;
                      }
                    );
                    return (
                      <tr key={`payment${payment.id}-order${orderId}`}>
                        <td className="driverPaymentTd">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="driverPaymentTd">{trackdriver.value}</td>
                        <td className="driverPaymentTd">{pointLoadList.join(' - ')}</td>
                        <td className="driverPaymentTd">{pointUnloadList.join(' - ')}</td>
                        <td className="driverPaymentTd">{order.driverPrice}</td>
                        <td className="driverPaymentTd">{order.accountNumber}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={`payment${payment.id}-order${orderId}`}>
                        <td className="driverPaymentTd" colSpan={6}>
                          Заказ не найден или удален
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </td>
        </tr>
      )}
      {showDebtList && (
        <tr>
          <td colSpan={4}>
            <table className="driverDebtsListTable">
              <thead className="driverPaymentsListMainTableThead">
                <tr>
                  <td>Дата</td>
                  <td>Категория</td>
                  <td>Суммк</td>
                  <td>Оплачено</td>
                  <td>Примечание</td>
                </tr>
              </thead>
              <tbody>
                {debtList.map(debtInfo => {
                  let debt: DriverDebt | null = findValueById(debtInfo.id, driverDebtList) || null;
                  if (debt != null) {
                    return (
                      <tr key={`payment${payment.id}-debt${debt.id}`}>
                        <td className="driverPaymentTd">
                          {new Date(debt.date).toLocaleDateString()}
                        </td>
                        <td className="driverPaymentTd">{debt.category}</td>
                        <td className="driverPaymentTd">{debt.sumOfDebt}</td>
                        <td className="driverPaymentTd">{debtInfo.sum}</td>
                        <td className="driverPaymentTd">{debt.addInfo}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={`payment${payment.id}-debt${debtInfo.id}`}>
                        <td className="driverPaymentTd" colSpan={3}>
                          Долг не найден или удален
                        </td>
                        <td className="driverPaymentTd" colSpan={2}>
                          {debtInfo.sum}
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};
