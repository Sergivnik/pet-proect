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
  ({ elem, style, colWidths, ...rest }, ref) => {
    const getTdStyle = (index: number) => {
      return {
        width: `${colWidths[index]}%`,
      };
    };

    return (
      <tr ref={ref} style={{ ...style }} {...rest}>
        <TdDate style={getTdStyle(0)} date={elem.date} />
        <TdDriver
          style={getTdStyle(1)}
          idDriver={elem.idDriver}
          idTrackDriver={elem.idTrackDriver}
        />
        <TdCustomer style={getTdStyle(2)} idCustomer={elem.idCustomer} idManager={elem.idManager} />
        <TdLoadingPoint
          style={getTdStyle(3)}
          idLoadingPoint={elem.idLoadingPoint}
          loadingInfo={elem.loadingInfo}
        />
        <TdUnoadingPoint
          style={getTdStyle(4)}
          idUnloadingPoint={elem.idUnloadingPoint}
          unLoadingInfo={elem.unloadingInfo}
        />
        <TdCustomerPrice
          style={getTdStyle(5)}
          customerPrice={elem.customerPrice}
          customerPayment={elem.customerPayment}
          partialPaymentAmount={elem.partialPaymentAmount}
        />
        <TdDriverPrice
          style={getTdStyle(6)}
          driverPrice={elem.driverPrice}
          driverPayment={elem.driverPayment}
        />
        <TdCompleted style={getTdStyle(7)} completed={elem.completed} />
        <TdDocument
          style={getTdStyle(8)}
          document={elem.document}
          dateOfSubmission={elem.dateOfSubmission}
        />
        <TdCustomerPayment
          style={getTdStyle(9)}
          customerPayment={elem.customerPayment}
          dateOfPromise={elem.dateOfPromise}
        />
        <TdDriverPayment
          style={getTdStyle(10)}
          driverPayment={elem.driverPayment}
          dateOfPayment={elem.dateOfPayment}
        />
        <TdAccountNumber
          style={getTdStyle(11)}
          accountNumber={elem.accountNumber}
          customerPayment={elem.customerPayment}
        />
      </tr>
    );
  }
);
