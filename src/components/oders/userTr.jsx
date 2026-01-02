import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { DocFormNew } from '../documentNew/docFormNew.tsx';
import { Window } from '../userWindow/window.tsx';

export const UserTr = props => {
  const [showEdit, setShowEdit] = useState(true);
  const [showDocForm, setShowDocForm] = useState(false);
  const [windowWidth, setWindowWidth] = useState(800);
  const [order, setOrder] = useState(props.elem);

  const handleClickEdit = () => {
    setShowEdit(false);
  };
  const handleClickSave = (isChanged, order) => {
    setShowEdit(true);
    if (isChanged) {
      setShowDocForm(true);
      setOrder(order);
    }
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

  const getTypeOfDoc = typeOfDoc => {
    if (typeOfDoc === 'Invoice') {
      setWindowWidth(1300);
    } else {
      setWindowWidth(800);
    }
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
            orderTable={'oderslist'}
          />
          <TdDriverPayment
            driverPayment={props.elem.driverPayment}
            dateOfPayment={props.elem.dateOfPayment}
            currentTR={props.trId}
            edit={true}
            orderTable={'oderslist'}
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

      {showDocForm
        ? createPortal(
            <Window
              title="Документы для печати"
              startX={400}
              startY={200}
              width={windowWidth}
              onClose={() => setShowDocForm(false)}
            >
              <DocFormNew order={order} currentTable="oderslist" getTypeOfDoc={getTypeOfDoc} />
            </Window>,
            document.body
          )
        : null}
    </>
  );
};
