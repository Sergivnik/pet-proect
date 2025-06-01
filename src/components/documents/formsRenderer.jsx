import React from 'react';
import { InvoiceForm } from './invoiceForm.jsx';
import { ActForm } from './actForm.jsx';
import { AppForm } from './appForm.jsx';
import './billsForm.sass';

export const FormsRenderer = ({
  dataDoc,
  getNewNumber,
  getStrText,
  strObj,
  showAddStr,
  getAddStr,
  addStrObj,
  addData,
  editDataReason,
  showInvoice,
  showDocWithoutStamp,
  showApplication,
  id,
  appData,
  getEditData,
}) => {
  const commonProps = {
    dataDoc,
    getNewNumber,
    getStrText,
    strObj,
    showAddStr,
    getAddStr,
    addStrObj,
    addData,
    editDataReason,
  };

  return (
    <div className="docPrintDiv">
      {showInvoice && (
        <div className="docWithStamp">
          <InvoiceForm {...commonProps} stamp={true} />
          <ActForm {...commonProps} stamp={true} />
        </div>
      )}

      {showDocWithoutStamp && (
        <div className="docWithoutStamp">
          <InvoiceForm {...commonProps} stamp={false} />
          <ActForm {...commonProps} stamp={false} address={false} />
          <ActForm {...commonProps} stamp={false} address={true} />
        </div>
      )}
      {showApplication && (
        <div className="applicationForm">
          <AppForm
            dataDoc={dataDoc}
            id={id}
            stamp={appData.stamp}
            getEditData={getEditData}
            driverApp={false}
          />
        </div>
      )}
    </div>
  );
};
