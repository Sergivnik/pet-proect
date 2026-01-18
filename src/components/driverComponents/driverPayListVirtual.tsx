import React, { useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useSelector, useDispatch } from 'react-redux';
import { getDataDriverPayments, getDataDriverDebt } from '../../actions/driverActions.js';
import { DriverPayment, Driver } from '../tsTypes.ts';
import { findValueBy_Id, findValueById } from '../myLib/myLib.js';
import { DriverPayTrVirtual } from './driverPayTrVirtual.tsx';
import './driverForms.sass';


export const DriverPayListVirtual = () => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [statusRequest, setStatusRequest] = useState<string | null>(null);
  const [paymentList, setPaymentList] = useState<DriverPayment[] | null>(null);
  const [openRowId, setOpenRowId] = React.useState<number | null>(null);

  const driverPaymentList: DriverPayment[] = useSelector(
    (state: any) => state.driverReducer.driverpayment
  );
  const driverList: Driver[] = useSelector((state: any) => state.oderReducer.driverlist);
  const status: string = useSelector((state: any) => state.driverReducer.status);

  const rowVirtualizer = useVirtualizer({
    count: driverPaymentList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 25, // базовая высота строки
    overscan: 8,
  });

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

  return (
    <div className="driverPaymentsListMainDiv">
      <div className="virtualTable">
        {/*  Header  */}
        <div className="virtualHeader">
          <div className="virtualCell">Дата</div>
          <div className="virtualCell">Перевозчик</div>
          <div className="virtualCell">Сумма платежа</div>
          <div className="virtualCell">Сумма списанная из долга</div>
        </div>
        {/*   Body   */}
        <div ref={parentRef} className="virtualBody">
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const payment = driverPaymentList[virtualRow.index];
              if (!payment) return null;

              const isOpen = payment.id === openRowId;

              return (
                <div
                  key={virtualRow.key}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  className={`virtualRow ${isOpen ? 'open' : ''}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  onClick={() => setOpenRowId(prev => (prev === payment.id ? null : payment.id))}
                >
                  <DriverPayTrVirtual payment={payment} isOpen={isOpen}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
