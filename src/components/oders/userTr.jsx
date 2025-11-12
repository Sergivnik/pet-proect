import React, { useEffect, useState } from 'react';
import { CreateOderNew } from '../createOder/createOderNew.jsx';
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
import { DocForm } from '../documents/docForm.jsx';

export const UserTr = props => {
  const [showEdit, setShowEdit] = useState(true);
  const [showDocForm, setShowDocForm] = useState(false);

  const handleClickEdit = () => {
    setShowEdit(false);
  };
  const handleClickSave = isChanged => {
    setShowEdit(true);
    if (isChanged) setShowDocForm(true);
  };
  const handleClickClose = () => {
    setShowDocForm(false);
  };
  const trGetId = () => {
    props.getCurrentTR(props.elem._id);
  };
  const handleClickGenerate = () => {
    props.handleClickGenerate(props.elem);
  };
  const setFontColor = () => {
    return { color: props.elem.colorTR };
  };
  const handleClickCtrl = (id, name) => {
    props.handleClickCtrl(id, name);
  };
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        if (!showEdit) {
          setShowEdit(true);
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [showEdit]);

  return (
    <>
      {showEdit ? (
        <tr
          id={props.elem._id}
          style={setFontColor()}
          onClick={e => {
            props.handleClickTR(e, props.elem);
          }}
          onContextMenu={props.handleClickTR}
          onMouseDown={e => {
            if (e.target.tagName === 'TD') e.preventDefault();
          }}
        >
          <TdDate date={props.elem.date} currentTR={props.trId} edit={true} />
          <TdDriver
            idDriver={props.elem.idDriver}
            idTrackDriver={props.elem.idTrackDriver}
            currentTR={props.trId}
            handleClickCtrl={handleClickCtrl}
            edit={true}
          />
          <TdCustomer
            idCustomer={props.elem.idCustomer}
            idManager={props.elem.idManager}
            applycation={props.elem.applicationNumber}
            currentTR={props.trId}
            handleClickCtrl={handleClickCtrl}
            edit={true}
          />
          <TdLoadingPoint
            idLoadingPoint={props.elem.idLoadingPoint}
            loadingInfo={props.elem.loadingInfo}
            getCurrentTR={trGetId}
            currentTR={props.trId}
            edit={true}
          />
          <TdUnoadingPoint
            idUnloadingPoint={props.elem.idUnloadingPoint}
            unLoadingInfo={props.elem.unloadingInfo}
            getCurrentTR={trGetId}
            currentTR={props.trId}
            edit={true}
          />
          <TdCustomerPrice
            customerPrice={props.elem.customerPrice}
            customerPayment={props.elem.customerPayment}
            partialPaymentAmount={props.elem.partialPaymentAmount}
            currentTR={props.trId}
            edit={true}
          />
          <TdDriverPrice
            driverPrice={props.elem.driverPrice}
            driverPayment={props.elem.driverPayment}
            currentTR={props.trId}
            edit={true}
          />
          <TdCompleted
            completed={props.elem.completed}
            elemId={props.elem._id}
            edit={true}
            orderTable={'oderslist'}
          />
          <TdDocument
            document={props.elem.document}
            dateOfSubmission={props.elem.dateOfSubmission}
            currentTR={props.trId}
            edit={true}
            elem={props.elem}
            orderTable={'oderslist'}
          />
          <TdCustomerPayment
            customerPayment={props.elem.customerPayment}
            dateOfPromise={props.elem.dateOfPromise}
            currentTR={props.trId}
            postTrack={props.elem.postTracker}
            edit={true}
          />
          <TdDriverPayment
            driverPayment={props.elem.driverPayment}
            dateOfPayment={props.elem.dateOfPayment}
            currentTR={props.trId}
            edit={true}
          />
          <TdAccountNumber
            accountNumber={props.elem.accountNumber}
            customerPayment={props.elem.customerPayment}
            currentTR={props.trId}
            handleClickGenerate={handleClickGenerate}
            edit={true}
            elem={props.elem}
          />
          {props.showDelete && props.elem._id == props.trId && (
            <td>
              <button className="odersTdBtn" onClick={handleClickEdit}>
                Edit
              </button>
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td colSpan="13" className="orderNewCreateTD">
            <CreateOderNew elem={props.elem} clickSave={handleClickSave} orderTable="oderslist" />
          </td>
          {/* <td>
            <button className="odersTdBtn" onClick={handleClickEdit}>
              Edit
            </button>
          </td> */}
        </tr>
      )}
      {showDocForm && (
        <div className="orderDivDocForm">
          <DocForm
            dataDoc={{
              number: props.elem.accountNumber,
              odersListId: [props.elem._id],
            }}
            handleClickClose={handleClickClose}
          />
        </div>
      )}
    </>
  );
};
