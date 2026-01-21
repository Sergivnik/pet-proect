import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Driver,
  DriverDebt,
  DriverDebtInfo,
  DriverPayment,
  Point,
  TrackDriver,
  OrderType,
} from '../tsTypes.js';
import { findValueBy_Id, findValueById } from '../myLib/myLib.js';
import './driverForms.sass';

type DriverPayTrProps = {
  payment: DriverPayment;
  isOpen: boolean;
};

export const DriverPayTrVirtual = ({ payment, isOpen }: DriverPayTrProps) => {
  const driverList: Driver[] = useSelector((state: any) => state.oderReducer.driverlist);
  const orderList: number[] = payment.listOfOders;
  let debtList: DriverDebtInfo[] = payment.listOfDebts;
  const orderFullList: OrderType[] = useSelector((state: any) => state.oderReducer.originOdersList);
  const trackDriverList: TrackDriver[] = useSelector(
    (state: any) => state.oderReducer.trackdrivers
  );
  const pointList: Point[] = useSelector((state: any) => state.oderReducer.citieslist);
  const driverDebtList: DriverDebt[] = useSelector(
    (state: any) => state.oderReducer.driverDebtList
  );

  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <div className="virtualRowMain">
        <div className="virtualCell">{new Date(payment.date).toLocaleDateString()}</div>
        <div className="virtualCell">{findValueBy_Id(payment.idDriver, driverList).value}</div>
        <div className="virtualCell">{payment.sumOfPayment} ₽</div>
        <div className="virtualCell lastCell">
          <div>{payment.sumOfDebts}</div>
          {isOpen && (
            <div className="wrapperSvg">
              <svg width="17px" height="17px" viewBox="0 0 60 60">
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
          )}
          <div>{isOpen ? '▲' : '▼'}</div>
        </div>
      </div>

      {isOpen && (
        <div className="virtualRowDetails">
          <div className="virtualHeaderDetails">
            <div className="virtualCell">Дата</div>
            <div className="virtualCell">Водитель</div>
            <div className="virtualCell">Погрузка</div>
            <div className="virtualCell">Выгрузка</div>
            <div className="virtualCell">Цена</div>
            <div className="virtualCell">Номер счета</div>
          </div>
          {orderList.map((orderId: number) => {
            const order: OrderType | null = findValueBy_Id(orderId, orderFullList) || null;
            if (order != null) {
              let trackdriver: TrackDriver = findValueBy_Id(order.idTrackDriver, trackDriverList);
              let pointLoadList: string[] = order.idLoadingPoint.map((idPoint: number) => {
                return findValueBy_Id(idPoint, pointList).value;
              });
              let pointUnloadList: string[] = order.idUnloadingPoint.map((idPoint: number) => {
                return findValueBy_Id(idPoint, pointList).value;
              });
              return (
                <div className="virtualRowBodyDetails">
                  <div className="virtualCell">{new Date(order.date).toLocaleDateString()}</div>
                  <div className="virtualCell">{trackdriver.value}</div>
                  <div className="virtualCell">{pointLoadList.join(' - ')}</div>
                  <div className="virtualCell">{pointUnloadList.join(' - ')}</div>
                  <div className="virtualCell">{order.driverPrice}</div>
                  <div className="virtualCell">{order.accountNumber}</div>
                </div>
              );
            } else {
              return <div className="virtualCell error">Заказ не найден или удален</div>;
            }
          })}
          <div className="virtualHeaderDebtDetails">
            <div className="virtualCell">Дата</div>
            <div className="virtualCell">Категория</div>
            <div className="virtualCell">Сумма</div>
            <div className="virtualCell">Оплачено</div>
            <div className="virtualCell">Примечание</div>
          </div>
          {debtList.map(debtInfo => {
            let debt: DriverDebt | null = findValueById(debtInfo.id, driverDebtList) || null;
            if (debt != null) {
              return (
                <div className="virtualRowBodyBebtDetails">
                  <div className="virtualCell">{new Date(debt.date).toLocaleDateString()}</div>
                  <div className="virtualCell">{debt.category}</div>
                  <div className="virtualCell">{debt.sumOfDebt}</div>
                  <div className="virtualCell">{debtInfo.sum}</div>
                  <div className="virtualCell">{debt.addInfo}</div>
                </div>
              );
            } else {
              return (
                <div className="debtError">
                  <div className="virtualCell">Долг не найден или удален</div>
                  <div className="virtualCell">{debtInfo.sum}</div>
                </div>
              );
            }
          })}
        </div>
      )}
    </React.Fragment>
  );
};
