import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';
import { getPdf, getWithoutStampPdf } from '../../actions/documentAction.js';
import { FormAddDoc } from '../userTrNew/formAddDoc.jsx';
import { FormAddEmailData } from '../userTrNew/fornAddEmailData.jsx';
import { UserWindow } from '../userWindow/userWindow.jsx';
import { AppFormExtra } from '../documents/appFormExtra.jsx';
import { DocForm } from '../documents/docForm.jsx';
import { CreateAppForm } from '../customerPart/cusstomerApp/createAppForm.tsx';

export const TdAccountNumber = props => {
  const orderList = useSelector(state => state.oderReducer.odersList);
  const appList = useSelector(state => state.customerReducer.customerOrders);

  const order = props.elem ? orderList.find(elem => elem._id == props.elem._id) : null;

  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showInputFile, setShowInputFile] = useState(false);
  const [showEmailData, setShowEmailData] = useState(false);
  const [showAppForm, setShowAppForm] = useState(false);
  const [showCreateAppForm, setShowCreateAppForm] = useState(false);
  const [currentTD, setCurrentTD] = useState(null);
  const [showContextEmail, setShowContextEmail] = useState(true);
  const [typeDoc, setTypeDoc] = useState(null);
  const [appBtn, setAppBtn] = useState('');
  const [top, setTop] = useState(0);
  const [classTD, setClassTD] = useState('odersTd');
  const [divBottomCoord, setDivBottomCoord] = useState(null);
  const [isAppExist, setIsAppExist] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [printObj, setPrintObj] = useState({ number: null, odersListId: [] });

  const handleDBLClick = e => {
    let element = e.currentTarget;
    if (e.target.tagName != 'TD') return false;
    if (props.edit) {
      setShowEdit(true);
      e.currentTarget.parentElement.style.backgroundColor = '#fff';
      setCurrentId(e.currentTarget.parentElement.id);
      setCurrentElement(element);
    }
  };
  const handleEnter = e => {
    if (e.key == 'Enter') {
      dispatch(editOder(currentId, 'accountNumber', e.currentTarget.value));
      setShowEdit(false);
      setCurrentId(null);
      setCurrentElement(null);
    }
  };
  const handleDeleteBill = () => {
    dispatch(editOder(currentId, 'accountNumber', null));
    setShowEdit(false);
    setCurrentId(null);
    setCurrentElement(null);
    setShowContextMenu(false);
  };
  const handleContaxtMenu = e => {
    e.preventDefault();
    setCurrentId(e.currentTarget.parentElement.id);
    setShowContextMenu(true);
    let div = document.querySelector('.odersDiv');
    setDivBottomCoord(div.clientHeight - e.clientY);
  };
  const handleClickPrint = () => {
    dispatch(getPdf(currentId, 'doc'));
    setShowContextMenu(false);
  };
  const handleClickPrintTTN = () => {
    if (props.elem.accountNumber !== null && props.elem.document == 'Ок') {
      let a = dispatch(getPdf(currentId, 'ttn'));
      console.log(a);
      setShowContextMenu(false);
    } else {
      setShowContextMenu(false);
      alert('Нет привязанных ТТН');
    }
  };
  const handleClickPrintWithoutStamp = () => {
    dispatch(getWithoutStampPdf(currentId));
    setShowContextMenu(false);
  };
  const handleClickAddDoc = (e, typeDoc) => {
    if (props.elem.accountNumber !== null || typeDoc !== 'ttn') {
      const TD = e.currentTarget.parentElement.parentElement;
      setCurrentTD(TD);
      setShowInputFile(true);
      setShowContextMenu(false);
      setTypeDoc(typeDoc);
    } else {
      setShowContextMenu(false);
      alert('Не гоже привязывать ТТН без счета!');
    }
  };
  const handleClickSendDoc = e => {
    let TD = e.currentTarget.parentElement.parentElement;
    setCurrentTD(TD);
    setShowEmailData(true);
    setShowContextMenu(false);
  };
  const handleClickClose = isSuccess => {
    setShowInputFile(false);
    setShowEmailData(false);
    if (isSuccess) alert('Не забудьте внести номер заявки в заказ!!!');
  };
  const handleClikPrintApp = e => {
    if (appBtn == 'Печать заявки') {
      dispatch(getPdf(currentId, 'app'));
      setShowContextMenu(false);
    } else {
      // надо будет убрать потом
      let elem = e.currentTarget;
      if (elem) console.log(elem, elem.getBoundingClientRect());
      const rect = elem.getBoundingClientRect();
      const top = rect.top + window.scrollY - 130;
      setTop(Math.round(top));
      setShowAppForm(true);
      setShowContextMenu(false);
    }
  };
  const handleClikCreateApp = e => {
    let elem = e.currentTarget.parentElement.parentElement;
    if (elem) console.log(elem, elem.getBoundingClientRect());
    const rect = elem.getBoundingClientRect();
    const top = rect.top + window.scrollY - 130;
    setTop(Math.round(top));
    console.log(top);
    setShowContextMenu(false);
    setShowCreateAppForm(true);
  };
  const handleCreateBill = () => {
    let i = orderList.length - 1;
    while (orderList[i].accountNumber == null) {
      i = i - 1;
    }
    let { ...obj } = printObj;
    obj.number = Number(orderList[i].accountNumber) + 1;
    obj.odersListId = [props.elem._id];
    setPrintObj(obj);
    setShowDocForm(true);
    setShowContextMenu(false);
  };
  const handleChangeBill = () => {
    let { ...obj } = printObj;
    obj.number = Number(props.elem.accountNumber);
    obj.odersListId = [props.elem._id];
    setPrintObj(obj);
    setShowDocForm(true);
    setShowContextMenu(false);
    if (props.elem.customerPayment == 'Ок') {
      alert('Счет уже оплачен!!!');
      setShowDocForm(false);
    }
  };
  const handleClickCloseDoc = () => {
    setShowDocForm(false);
  };
  const getNewNumber = newNumber => {
    let { ...obj } = printObj;
    obj.number = newNumber;
    setPrintObj(obj);
  };

  const handleClickUserWindowClose = () => {
    setShowAppForm(false);
    setShowCreateAppForm(false);
  };

  useEffect(() => {
    if (showContextMenu) {
      let DivContextAll = document.querySelectorAll('.divContext');
      let DivContext;
      if (DivContextAll.length > 1) {
        DivContext = DivContextAll[1];
      } else {
        DivContext = DivContextAll[0];
      }
      let heghtDivContext = DivContext.clientHeight;
      if (divBottomCoord - heghtDivContext < 0) {
        DivContext.style.top = DivContext.offsetTop + divBottomCoord - heghtDivContext + 'px';
      }
      let customerPayment = props.customerPayment;
      if (
        customerPayment == 'Нет' ||
        customerPayment == 'Печать' ||
        customerPayment == 'Мыло' ||
        customerPayment == 'Ок' ||
        customerPayment == 'Почта'
      ) {
        setShowContextEmail(true);
      } else {
        setShowContextEmail(false);
      }
      DivContext.focus();
    }
  }, [showContextMenu]);
  useEffect(() => {
    if (currentElement) currentElement.firstChild.firstChild.focus();
  }, [currentElement]);
  useEffect(() => {
    if (props.currentTR != currentId) {
      setShowEdit(false);
      setCurrentId(null);
      setShowContextMenu(false);
    }
    if (props.elem) {
      if (props.currentTR == props.elem._id && props.elem.applicationNumber) {
        console.log(props.currentTR, props.elem._id);
        setClassTD('odersTd backGroundGrey');
      } else {
        setClassTD('odersTd');
      }
    }
  }, [props.currentTR]);
  useEffect(() => {
    if (showContextMenu) {
      let id = props.elem ? props.elem._id : null;
      let check = appList.find(app => app.orderId == id);
      console.log(check);
      if (check) {
        setIsAppExist(true);
      } else {
        setIsAppExist(false);
      }
    }
  }, [showContextMenu]);
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        if (showEdit) {
          setShowEdit(false);
          setCurrentId(null);
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [showEdit]);
  useEffect(() => {
    setAppBtn('Печать заявки');
  }, [orderList]);

  return (
    <td
      style={props.style}
      className={classTD}
      onDoubleClick={handleDBLClick}
      onContextMenu={handleContaxtMenu}
    >
      {showEdit ? (
        <div className="divChoise">
          <input name="accountNumber" type="text" onKeyDown={handleEnter} />
        </div>
      ) : (
        props.accountNumber
      )}
      {showContextMenu ? (
        <div tabIndex="0" className="divContext">
          {props.accountNumber == null || props.accountNumber == '' ? (
            <p className="contextmenu" onClick={handleCreateBill}>
              Создать счет
            </p>
          ) : (
            <p className="contextmenu" onClick={handleChangeBill}>
              Изменить счет
            </p>
          )}
          <p className="contextmenu" onClick={handleClickPrint}>
            Печать счета
          </p>
          <p className="contextmenu" onClick={handleClickPrintWithoutStamp}>
            Печать без штампа
          </p>
          <p className="contextmenu" onClick={handleDeleteBill}>
            Удалить счет
          </p>
          <hr className="contextMenuHr" />
          <p className="contextmenu" onClick={handleClikCreateApp}>
            {isAppExist ? 'Изменить заявку' : 'Создать заявку'}
          </p>
          <p className="contextmenu" onClick={handleClikPrintApp}>
            {appBtn}
            {/*Печать заявки*/}
          </p>
          <p className="contextmenu" onClick={e => handleClickAddDoc(e, 'app')}>
            Добавить Заявку pdf
          </p>
          <hr className="contextMenuHr" />
          <p
            className={props.elem.accountNumber != null ? 'contextmenu' : 'contextmenu greyFont'}
            onClick={e => handleClickAddDoc(e, 'ttn')}
          >
            Добавить ТТН
          </p>
          <p
            className={props.elem.accountNumber != null ? 'contextmenu' : 'contextmenu greyFont'}
            onClick={handleClickPrintTTN}
          >
            Печать ТТН
          </p>
          <hr className="contextMenuHr" />
          {showContextEmail && (
            <p className="contextmenu" onClick={handleClickSendDoc}>
              Отправить Email
            </p>
          )}
        </div>
      ) : null}
      {showInputFile ? (
        <FormAddDoc
          TD={currentTD}
          currentId={currentId}
          typeDoc={typeDoc}
          handleClickClose={handleClickClose}
        />
      ) : null}
      {showEmailData && (
        <FormAddEmailData
          TD={currentTD}
          currentId={currentId}
          typeDoc={typeDoc}
          handleClickClose={handleClickClose}
        />
      )}
      {showAppForm && (
        <UserWindow
          header="Оформление заявки"
          width={800}
          height={800}
          left="-50vw"
          top={`${-1 * top}px`}
          handleClickWindowClose={handleClickUserWindowClose}
          windowId="fillApplication"
        >
          <AppFormExtra id={props.elem._id} />
        </UserWindow>
      )}
      {showDocForm && (
        <DocForm
          dataDoc={printObj}
          handleClickClose={handleClickCloseDoc}
          getNewNumber={getNewNumber}
        />
      )}
      {showCreateAppForm && (
        <UserWindow
          header="Создание заявки"
          width={1200}
          height={700}
          left="-70vw"
          top={`${-1 * top}px`}
          handleClickWindowClose={handleClickUserWindowClose}
          windowId="createApplication"
        >
          <CreateAppForm order={order} />
        </UserWindow>
      )}
    </td>
  );
};
