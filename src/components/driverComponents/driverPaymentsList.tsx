import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDataDriverPayments, getDataDriverDebt } from '../../actions/driverActions.js';
import { Driver } from '../tsTypes.ts';
import { DriverPaymentListTr } from './driverPaymentListTr.tsx';
import { DriverPayment } from '../tsTypes.ts';
import './driverForms.sass';

export const DriverPaymentsList = () => {
  const [statusRequest, setStatusRequest] = useState<string | null>(null);
  const [paymentList, setPaymentList] = useState<DriverPayment[] | null>(null);

  const driverPaymentList: DriverPayment[] = useSelector(
    (state: any) => state.driverReducer.driverpayment
  );
  const status: string = useSelector((state: any) => state.driverReducer.status);
  const driverList: Driver[] = useSelector((state: any) => state.oderReducer.driverlist);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDataDriverPayments());
    dispatch(getDataDriverDebt());
  }, []);
  useEffect(() => {
    setStatusRequest(status);
  }, [status]);
  useEffect(() => {
    setPaymentList(driverPaymentList);
  }, [driverPaymentList]);
  useEffect(() => {
    let div = document.getElementsByClassName('driverPaymentsListMainDiv')[0];
    div.scrollTop = div.scrollHeight;
  }, [paymentList]);

  return (
    <div className="driverPaymentsListMainDiv">
      {statusRequest != null && <div className="statusRequestDiv">{statusRequest}</div>}
      <table className="driverPaymentsListMainTable">
        <thead className="driverPaymentsListMainTableThead">
          <tr>
            <td>Дата</td>
            <td>Перевозчик</td>
            <td>Сумма платежа</td>
            <td>Сумма списанная из долга</td>
          </tr>
        </thead>
        <tbody>
          {paymentList != null &&
            paymentList.map((payment: DriverPayment) => {
              return (
                <DriverPaymentListTr key={`keyDriverPayment${payment.id}`} payment={payment} />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
