import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DriverPayment, Driver } from '../tsTypes.ts';
import { findValueBy_Id, findValueById } from '../myLib/myLib.js';
import './driverForms.sass';

type DriverPayTrProps = {
  payment: DriverPayment;
  isOpen: boolean;
};

export const DriverPayTrVirtual = ({ payment, isOpen }: DriverPayTrProps) => {
  const driverList: Driver[] = useSelector((state: any) => state.oderReducer.driverlist);
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
        </div>
      )}
    </React.Fragment>
  );
};
