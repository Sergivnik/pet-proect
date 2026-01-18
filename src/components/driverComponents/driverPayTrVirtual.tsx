import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DriverPayment, Driver } from '../tsTypes.ts';
import { findValueBy_Id, findValueById } from '../myLib/myLib.js';
import './driverForms.sass'

type DriverPayTrProps = {
  payment: DriverPayment;
  isOpen: boolean;
}

export const DriverPayTrVirtual = ({ payment, isOpen }: DriverPayTrProps) => {
  const driverList: Driver[] = useSelector((state: any) => state.oderReducer.driverlist);
  return (<React.Fragment>
    <div className="virtualRowMain">
      <div className="virtualCell">{new Date(payment.date).toLocaleDateString()}</div>
      <div className="virtualCell">
        {findValueBy_Id(payment.idDriver, driverList).value}
      </div>
      <div className="virtualCell">{payment.sumOfPayment} ₽</div>
      <div className="virtualCell">{isOpen ? '▲' : '▼'}</div>
    </div>

    {isOpen && <div className="virtualRowDetails">{payment.sumOfDebts}</div>}
  </React.Fragment>)
}