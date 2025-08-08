import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CustomerAddTr } from './customerAddTr.jsx';
import { CustomerTr } from './customerTr.jsx';
import { CustomerManagerTr } from './customerManagerTr.jsx';
import { CustomerManagerAddTr } from './customerManagerAddTr.jsx';
import { addData, editData } from '../../actions/editDataAction.js';
import { ChoiseTwoList } from '../choiseList/choiseTwoList.jsx';
import { InputText } from '../myLib/inputText.jsx';
import { CustomerAccountTr } from './customerAccountTr.jsx';
import { UserWindow } from '../userWindow/userWindow.jsx';
import { CustomerAddDiv } from './customerAddDiv.jsx';
import { ContractForm } from './contractForm/contractForm.jsx';
import './editData.sass';
import { FormAddDoc } from '../userTrNew/formAddDoc.jsx';

export const CustomerTable = ({ id }) => {
  const dispatch = useDispatch();
  const clientListFull = useSelector(state => state.oderReducer.clientList);
  const clientManagerFull = useSelector(state => state.oderReducer.clientmanager);
  const orderList = useSelector(state => state.oderReducer.originOdersList);

  const [customerList, setCustomerList] = useState(clientListFull);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [clientManager, setClientManager] = useState(clientManagerFull);
  const [check, setCheck] = useState(true);
  const [chosenId, setChosenId] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [showAddTr, setShowAddTr] = useState(false);
  const [showAddContract, setShowAddContract] = useState(false);
  const [showManagerTable, setShowManagerTable] = useState(false);
  const [showAddManagerTr, setShowAddManagerTr] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [reset, setReset] = useState(false);
  const [showAddPdfFile, setShowAddPdfFile] = useState(false);
  const [currentTD, setCurrentTD] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [debtOfCustomer, setDebtOfCustomer] = useState(null);
  const [limit, setLimit] = useState(null);
  const [turnover, setTurnover] = useState(0);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [averagePaymentTerm, setAveragePaymentTerm] = useState(0);
  const [maxPaymentTerm, setMaxPaymentTerm] = useState(0);

  const setValue = data => {
    let arr = clientListFull.filter(elem => elem._id == data._id);
    let arrManager = clientManagerFull.filter(elem => elem.odersId == data._id);
    setCustomerList(arr);
    setChosenId(data._id);
    setShowManagerTable(true);
    setClientManager(arrManager);
    setCurrentCustomer(arr[0]);
    console.log(data);
    let manager = arrManager.find(manager => manager.phone == data.value);
    if (manager) setCurrentId(manager._id);
  };
  const handleChangeBox = e => {
    if (e.currentTarget.checked) {
      let [...arr] = clientListFull;
      setCheck(true);
      setCurrentCustomer(null);
      setCustomerList(arr.filter(elem => elem.active == 1));
    } else {
      setCustomerList(clientListFull);
      setCheck(false);
    }
  };
  const getCurrentId = id => {
    setCurrentId(id);
  };
  const handleClickAdd = () => {
    setShowAddTr(true);
  };
  const handleAddCustomer = data => {
    dispatch(addData(data, 'oders'));
    setShowAddTr(false);
    setIsNewCustomer(true);
  };
  useEffect(() => {
    if (isNewCustomer) {
      let newCustomer = clientListFull[clientListFull.length - 1];
      setValue({ _id: newCustomer._id, value: newCustomer.value });
      setIsNewCustomer(false);
    }
  }, [clientListFull]);
  const handleClickClear = () => {
    setChosenId(null);
    setReset(true);
    setShowManagerTable(false);
    setCurrentCustomer(null);
    if (check) {
      setCustomerList(clientListFull.filter(elem => elem.active == 1));
    } else {
      setCustomerList(clientListFull);
    }
  };
  const handleClickAddManager = () => {
    setShowAddManagerTr(true);
  };
  const handleAddManager = data => {
    dispatch(addData(data, 'clientmanager'));
    setShowAddManagerTr(false);
  };
  const handleChangeAddInfo = e => {
    e.preventDefault();
    setShowInput(true);
    console.log(customerList[0]);
  };
  const getAddInfo = (name, text) => {
    let obj = { ...customerList[0] };
    obj.addInfo = text;
    dispatch(editData(obj, 'oders'));
    console.log(obj);
    setShowInput(false);
  };
  const handleClickWindowClose = windowId => {
    if (windowId == 'customerAddWindow') setShowAddTr(false);
    if (windowId == 'contractAddWindow') setShowAddContract(false);
  };
  const handleClickAddContract = () => {
    setShowAddContract(true);
  };
  const handleClickAddPdfContract = () => {
    let currentElement = document.querySelector('.EDFmainForm');
    setCurrentTD(currentElement);
    setShowAddPdfFile(true);
  };
  const handleClickClose = () => {
    setShowAddPdfFile(false);
  };

  useEffect(() => {
    let [...arr] = clientListFull.filter(elem => elem.active == 1);
    setCustomerList(arr);
  }, []);
  useEffect(() => {
    if (chosenId != null) {
      let arr = clientListFull.filter(elem => elem._id == chosenId);
      setCustomerList(arr);
    } else {
      if (check) {
        setCustomerList(clientListFull.filter(elem => elem.active == 1));
      } else {
        setCustomerList(clientListFull);
      }
    }
    //setCurrentCustomer(null);
  }, [clientListFull, chosenId]);
  useEffect(() => {
    setReset(false);
  }, [reset]);
  useEffect(() => {
    if (showManagerTable) {
      let [...arr] = clientManagerFull.filter(elem => elem.odersId == chosenId);
      setClientManager(arr);
    }
  }, [clientManagerFull]);
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        if (showInput) {
          setShowInput(false);
        } else {
          setShowAddManagerTr(false);
          setShowAddTr(false);
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [showInput]);
  useEffect(() => {
    let arr = clientListFull.filter(elem => elem._id == id);
    let arrManager = clientManagerFull.filter(elem => elem.odersId == id);
    setCustomerList(arr);
    setChosenId(id);
    setShowManagerTable(true);
    setClientManager(arrManager);
    setCurrentCustomer(arr[0]);
  }, [id]);
  useEffect(() => {
    if (currentCustomer != null) {
      let sumOfDebt = 0;
      let turnover = 0;
      let now = new Date();
      let yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      let numberOfOrders = 0;
      let averagePaymentTerm = 0;
      let maxPaymentTerm = 0;
      orderList.forEach(order => {
        if (order.idCustomer == currentCustomer._id && order.customerPayment != 'Ок') {
          sumOfDebt = sumOfDebt + Number(order.customerPrice);
        }

        if (order.idCustomer == currentCustomer._id && new Date(order.date) > yearAgo) {
          turnover = turnover + Number(order.customerPrice);
          numberOfOrders = numberOfOrders + 1;
          if (order.customerPayment == 'Ок' && order.dateOfSubmission != null) {
            const date1 = new Date(order.date); // Первая дата
            const date2 = new Date(order.dateOfSubmission); // Вторая дата

            // Разница в миллисекундах
            let diffInMs = date2 - date1;
            if (diffInMs < 0) diffInMs = 0;
            // Переводим миллисекунды в дни
            const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
            averagePaymentTerm = averagePaymentTerm + diffInDays;
            if (diffInDays > maxPaymentTerm) maxPaymentTerm = diffInDays;
          }
        }
      });
      setTurnover(turnover);
      setNumberOfOrders(numberOfOrders);
      setAveragePaymentTerm(Math.ceil(averagePaymentTerm / numberOfOrders));
      setMaxPaymentTerm(maxPaymentTerm);
      setDebtOfCustomer(sumOfDebt);
      setLimit(currentCustomer.limit);
    }
  }, [currentCustomer]);

  useEffect(() => {
    if (chosenId != null && customerList.length == 1) {
      let updatedCustomer = clientListFull.find(elem => elem._id == chosenId);
      if (updatedCustomer) {
        setCustomerList([updatedCustomer]);
      }
    }
  }, [clientListFull, chosenId]);

  return (
    <React.Fragment>
      <h2 className="customerH2">Таблица заказчиков</h2>
      <div className="customerFilter">
        <span>Заказчик</span>
        <div className="customerChoise">
          <ChoiseTwoList
            arr1={customerList}
            arr2={clientManagerFull}
            field1="phone"
            field2="phone"
            field3="value"
            fieldSearch="odersId"
            setValue={setValue}
            reset={reset}
          />
        </div>
        <button className="driverAddBtn" onClick={handleClickClear}>
          Сброс
        </button>
        <span>Активный</span>
        <input type="checkbox" onChange={handleChangeBox} checked={check} />
        <button className="driverAddBtn" onClick={handleClickAdd}>
          Добавить
        </button>
      </div>
      <div className="tableDiv">
        <table className="customerTbl">
          <thead>
            <tr>
              <td className="customerTdHeader">Название</td>
              <td className="customerTdHeader">Полное название</td>
              <td className="customerTdHeader">ИНН</td>
              <td className="customerTdHeader">Адрес</td>
              <td className="customerTdHeader">Почтовый адрес</td>
              <td className="customerTdHeader">E-mail</td>
              <td className="customerTdHeader">Телефон</td>
              <td className="customerTdHeader">Договор</td>
              <td className="customerTdHeader">Активный</td>
              <td className="customerTdHeader">Лимит</td>
            </tr>
          </thead>
          <tbody className="customerTbody">
            {customerList.map(elem => {
              return (
                <CustomerTr
                  key={'customer' + elem._id}
                  elem={elem}
                  getCurrentId={getCurrentId}
                  currentId={currentId}
                />
              );
            })}
          </tbody>
        </table>
        {showAddTr && (
          // <CustomerAddTr handleAddCustomer={handleAddCustomer} />
          <UserWindow
            header="Добавить нового Клиента"
            width={1200}
            handleClickWindowClose={handleClickWindowClose}
            windowId="customerAddWindow"
          >
            <CustomerAddDiv handleAddCustomer={handleAddCustomer} />
          </UserWindow>
        )}
        {customerList.length == 1 && (
          <table className="customerTbl">
            <thead>
              <tr>
                <td className="customerTdHeader">КПП</td>
                <td className="customerTdHeader">ОГРН</td>
                <td className="customerTdHeader">ФИО директора в род. падеже</td>
                <td className="customerTdHeader">БИК</td>
                <td className="customerTdHeader">р/сч</td>
                <td className="customerTdHeader">кор/сч</td>
                <td className="customerTdHeader">Банк</td>
                <td className="customerTdHeader">Адрес банка</td>
              </tr>
            </thead>
            <tbody>
              <CustomerAccountTr customer={customerList[0]} />
            </tbody>
          </table>
        )}
        {showManagerTable && (
          <div className="tableManagerDiv">
            <header className="managerHeader">
              <div className="addContractBtnWrap">
                <button className="addContractBtn" onClick={handleClickAddContract}>
                  Создать договор
                </button>
                <button className="addContractBtn" onClick={handleClickAddPdfContract}>
                  Добавить договор
                </button>
              </div>
              <div className="divAddInfo">
                <span className="spanAddInfo">{'Особые условия '}</span>
                {!showInput && (
                  <span
                    className="spanAddInfoInput"
                    onDoubleClick={handleChangeAddInfo}
                    onMouseDown={e => {
                      e.preventDefault();
                      return false;
                    }}
                  >
                    {customerList[0]
                      ? ` ${customerList[0].addInfo ? customerList[0].addInfo : ''}`
                      : ''}
                  </span>
                )}
                {showInput && (
                  <InputText
                    name="addInfo"
                    typeInput="text"
                    className="inputAddInfo"
                    text={customerList[0].addInfo ? customerList[0].addInfo : ''}
                    getText={getAddInfo}
                  />
                )}
              </div>
              <button className="managerAddBtn" onClick={handleClickAddManager}>
                Добавить Сотрудника
              </button>
            </header>
            <div
              className={
                debtOfCustomer < limit || limit == null
                  ? 'divDebtOfCustomer'
                  : 'divDebtOfCustomer red'
              }
            >
              {`Долг клиента равен ${debtOfCustomer} руб`}
              <div className="divInfoOfCustomer">
                <div className="divInfoData">Оборот {turnover} руб</div>
                <div className="divInfoData">Срок оплаты средний {averagePaymentTerm} дн</div>
                <div className="divInfoData">Срок оплаты иакс {maxPaymentTerm} дн</div>
                <div className="divInfoData">Кол-во заказов {numberOfOrders} </div>
              </div>
            </div>
            <table className="managerTbl">
              <thead>
                <tr>
                  <td className="customerManagerTdHeader">Имя</td>
                  <td className="customerManagerTdHeader">ФИО</td>
                  <td className="customerManagerTdHeader">Телефон</td>
                  <td className="customerManagerTdHeader">e-mail</td>
                  <td className="customerManagerTdHeader">Доп. телефон</td>
                  <td className="customerManagerTdHeader">Клиент</td>
                  <td className="customerManagerTdHeader">Уволен</td>
                </tr>
              </thead>
              <tbody className="customerManagerTbody">
                {clientManager.map(elem => {
                  return (
                    <CustomerManagerTr
                      key={'customerManager' + elem._id}
                      elem={elem}
                      getCurrentId={getCurrentId}
                      currentId={currentId}
                    />
                  );
                })}
                {showAddManagerTr && (
                  <CustomerManagerAddTr handleAddManager={handleAddManager} customerId={chosenId} />
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showAddContract && (
        <UserWindow
          header="Создание нового договора"
          width={800}
          handleClickWindowClose={handleClickWindowClose}
          windowId="contractAddWindow"
        >
          <ContractForm currentCustomer={currentCustomer} />
        </UserWindow>
      )}
      {showAddPdfFile && (
        <FormAddDoc
          TD={currentTD}
          currentId={chosenId}
          typeDoc="customerContract"
          handleClickClose={handleClickClose}
        />
      )}
    </React.Fragment>
  );
};
