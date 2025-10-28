import React from 'react';
import { TdDate } from '../userTd/tdDate.jsx';
import { TdDriver } from '../userTd/tdDriver.jsx';
import { TdCustomer } from '../userTd/tdCustomer.jsx';
import { TdLoadingPoint } from '../userTd/tdLoadingPoint.jsx';
import { TdUnoadingPoint } from '../userTd/tdUnloadingPoint.jsx';
import { TdCustomerPrice } from '../userTd/tdCustomerPrice.jsx';
import { TdDriverPrice } from '../userTd/tdDriverPrice.jsx';
import { TdCompleted } from '../userTd/tdCompleted.jsx';
import { TdDocument } from '../userTd/tdDocument.jsx';
import { TdCustomerPayment } from '../userTd/tdCustomerPayment.jsx';
import { TdDriverPayment } from '../userTd/tdDriverPayment.jsx';
import { TdAccountNumber } from '../userTd/tdAccountNumber.jsx';

export const DriverTr = React.forwardRef<HTMLTableRowElement, any>(
  ({ elem, style, ...rest }, ref) => {
    return (
      <tr
        id={elem._id.toString()}
        ref={ref}
        style={{
          ...style,
          display: 'table',
          tableLayout: 'fixed',
          width: '100%',
        }}
        {...rest}
      >
        <TdDate date={elem.date} />
        <TdDriver idDriver={elem.idDriver} idTrackDriver={elem.idTrackDriver} />
        <TdCustomer idCustomer={elem.idCustomer} idManager={elem.idManager} />
        <TdLoadingPoint idLoadingPoint={elem.idLoadingPoint} loadingInfo={elem.loadingInfo} />
        <TdUnoadingPoint
          idUnloadingPoint={elem.idUnloadingPoint}
          unLoadingInfo={elem.unloadingInfo}
        />
        <TdCustomerPrice
          customerPrice={elem.customerPrice}
          customerPayment={elem.customerPayment}
          partialPaymentAmount={elem.partialPaymentAmount}
        />
        <TdDriverPrice driverPrice={elem.driverPrice} driverPayment={elem.driverPayment} />
        <TdCompleted completed={elem.completed} />
        <TdDocument document={elem.document} dateOfSubmission={elem.dateOfSubmission} />
        <TdCustomerPayment
          customerPayment={elem.customerPayment}
          dateOfPromise={elem.dateOfPromise}
        />
        <TdDriverPayment driverPayment={elem.driverPayment} dateOfPayment={elem.dateOfPayment} />
        <TdAccountNumber
          accountNumber={elem.accountNumber}
          customerPayment={elem.customerPayment}
        />
      </tr>
    );
  }
);
