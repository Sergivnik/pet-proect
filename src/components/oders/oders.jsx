import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserThead } from './userThead.jsx';
import { UserTr } from './userTr.jsx';
import { CreateOderNew } from '../createOder/createOderNew.jsx';
import { UserWindow } from '../userWindow/userWindow.jsx';
import { CustomerPaymentForm } from '../customerPaymentForm/customerPaymentForm.jsx';
import { CustomerPayments } from '../customerPayments/customerPayments.jsx';
import { DriverPaymentForm } from '../driverComponents/driverPaymentForm.jsx';
import { DriverDebtForm } from '../driverComponents/driverDebtForm.jsx';
import { ContractorsPayments } from '../contractors/contractorsPayments.jsx';
import { getData, filterData } from '../../middlewares/initialState.js';
import { delOder } from '../../actions/oderActions.js';
import { clearRequestStatus } from '../../actions/oderActions.js';
import { EditDataForm } from '../editData/editDataForm.jsx';
import { PrintFormBill } from '../printForm/printFormBill.jsx';
import { BillsForm } from '../documents/billsForm.jsx';
import { Report } from '../reports/reports.jsx';
import { SpecialTable } from '../specialTable/specialTable.jsx';
import { authSignOut } from '../../actions/auth.js';
import { ChangePassword } from '../auth/changePassword.jsx';
import { getApps, getNewApp } from '../../actions/appAction.js';
import { CustomerApps } from '../customerPart/cusstomerApp/customerApps.jsx';
import { getNewTasks } from '../../actions/tasksActions.js';
import { UserTaskTable } from '../userTask/userTaskTable.jsx';
import { MenuUser } from './taskBar/menuUser/menuUser.jsx';
import { MenuAccount } from './taskBar/menuAccount/menuAccount.jsx';
import { MenuMain } from './taskBar/menuAccount/menuMain/menuMain.jsx';
import { PostForm } from '../postForm/postForm.tsx';
import { DriverPaymentsList } from '../driverComponents/driverPaymentsList.tsx';
import { VirtualizedDriverTable } from './virtualizedDriverTable.tsx';
import './oders.sass';

export const Oders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApps());
    dispatch(getNewTasks());
    let timerId = setInterval(() => {
      dispatch(getNewApp());
      dispatch(getNewTasks());
    }, 60000 * 5);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    dispatch(getData());
    setShowEdit(true);
    setAddData(0);
  }, [dispatch]);

  const odersList = useSelector(state => state.oderReducer.odersList);
  const clientList = useSelector(state => state.oderReducer.clientList);
  const income = useSelector(state => state.oderReducer.income);
  const expenses = useSelector(state => state.oderReducer.expenses);
  const filteredAccountList = useSelector(state => state.oderReducer.filteredAccountList);
  const requestStatus = useSelector(state => state.oderReducer.request);
  const user = useSelector(state => state.oderReducer.currentUser);
  const numberApps = useSelector(state => state.customerReducer.newAppNumber);
  const tasksNumber = useSelector(state => state.tasksReducer.tasksNumber);
  const driverOrderList = useSelector(state => state.oderReducer.driverOrderList);

  const [oders, setOders] = useState(odersList.slice(-1000));

  const [showCreateOder, setShowCreateOder] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showWindow, setShowWindow] = useState(false);
  const [showEditDataWindow, setShowEditDataWindow] = useState(false);
  const [windowHeader, setWindowHeader] = useState(null);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [showSecretTable, setShowSecretTable] = useState(false);
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const [showUserWindow, setShowUserWindow] = useState(false);
  const [showVerticalMenu, setShowVerticalMenu] = useState(false);
  const [showAppWindow, setShowAppWindow] = useState(false);
  const [showNewApps, setShowNewApps] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  const [trId, setTrId] = useState(null);
  const [addData, setAddData] = useState(0);
  const [currentTR, setCurrentTR] = useState(null);
  const [currentElem, setCurrentElem] = useState(null);
  const [filterList, setFilterList] = useState({
    date: [],
    driver: [],
    oder: [],
    cityLoading: [],
    cityUnloading: [],
    customerPrice: [],
    driverPrice: [],
    proxy: [],
    completed: [],
    documents: [],
    customerPayment: [],
    driverPayment: [],
    accountList: [],
  });
  const [showLast, setShowLast] = useState(true);
  const [sumAccount, setSumAccount] = useState(0);
  const [editTable, setEditTable] = useState(null);
  const [idEdit, setIdEdit] = useState(null);
  const [showDriversTrips, setShowDriversTrips] = useState(false);

  useEffect(() => {
    console.log(requestStatus);
  }, [requestStatus]);
  useEffect(() => {
    setShowEdit(true);
    setAddData(0);
  }, []);
  useEffect(() => {
    console.log(income, expenses, addSum);
    let addSum = clientList.reduce((s, item) => s + Number(item.extraPayments), 0);
    let income100 = Math.round(Number(income) * 100);
    let expenses100 = Math.round(Number(expenses) * 100);
    let addSum100 = Math.round(Number(addSum) * 100);
    let sum = (income100 - expenses100 + addSum100) / 100;
    setSumAccount(sum);
  }, [income, expenses]);
  useEffect(() => {
    console.log('test');
    if (numberApps != null) {
      setShowNewApps(true);
    } else {
      setShowNewApps(false);
    }
  }, [numberApps]);

  useEffect(() => {
    if (tasksNumber > 0) setShowTasks(true);
  }, [tasksNumber]);
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        dispatch(clearRequestStatus());
        if (currentTR) currentTR.style.backgroundColor = '';
        setShowDelete(false);
        setShowEdit(false);
        setTrId(null);
        setEditTable(null);
        setIdEdit(null);
        if (showWindow === true) {
          //setShowWindow(false);
          dispatch(filterData(filterList));
        }
      }
      if (e.ctrlKey && e.code == 'KeyK') {
        e.preventDefault();
        if (user.role == 'admin') setShowSecretTable(true);
      }
      if (e.ctrlKey && e.code == 'KeyP') {
        e.preventDefault();
        setShowTasks(true);
      }
      if (e.ctrlKey && e.code == 'KeyS') {
        e.preventDefault();
        handleClickDriversTrips();
      }
      if (e.code == 'Delete' && currentElem) {
        if (currentElem.completed == 0) {
          console.log('I am listening Delete', trId, currentElem);
          handleClickDelete();
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [trId, showDelete, showWindow, showSecretTable, showTasks, showDriversTrips]);

  useEffect(() => {
    let length = odersList.length;
    let condotion = true;
    for (let key in filterList) {
      if (filterList[key].length > 0) {
        condotion = false;
        break;
      }
    }
    //if (condotion && length > 0 && length != 5000) dispatch(getData5000());
    console.log(length);
    if (length > 100) {
      setOders(odersList.slice(length - 100 - addData, length - addData));
    } else {
      setOders(odersList);
    }
  }, [odersList, addData]);

  useEffect(() => {
    if (showLast) {
      let div = document.getElementsByClassName('odersDiv')[0];
      div.scrollTop = div.scrollHeight + 300;
    }
  }, [oders]);

  const writeFilterList = (chosenList, name) => {
    let { ...arr } = filterList;
    switch (name) {
      case 'Date':
        arr.date = chosenList;
        setFilterList(arr);
        let arrdate = [];
        let localDate = '';
        chosenList = chosenList.map(elem => {
          arrdate = elem.split('-');
          localDate = `${arrdate[0]}-${Number(arrdate[1]) + 1}-${arrdate[2]}`;
          return localDate;
        });
        arr.date = chosenList;
        break;
      case 'Driver':
        arr.driver = chosenList;
        setFilterList(arr);
        break;
      case 'Customer':
        arr.oder = chosenList;
        setFilterList(arr);
        break;
      case 'LoadingCity':
        arr.cityLoading = chosenList;
        setFilterList(arr);
        break;
      case 'UnloadingCity':
        arr.cityUnloading = chosenList;
        setFilterList(arr);
        break;
      case 'CustomerPrice':
        arr.customerPrice = chosenList;
        setFilterList(arr);
        break;
      case 'DriverPrice':
        arr.driverPrice = chosenList;
        setFilterList(arr);
        break;
      case 'Proxy':
        arr.proxy = chosenList;
        setFilterList(arr);
        break;
      case 'Completed':
        arr.completed = chosenList;
        setFilterList(arr);
        break;
      case 'Documents':
        arr.documents = chosenList;
        setFilterList(arr);
        break;
      case 'CustomerPayment':
        arr.customerPayment = chosenList;
        setFilterList(arr);
        break;
      case 'DriverPayment':
        arr.driverPayment = chosenList;
        setFilterList(arr);
        break;
      case 'AccountList':
        let tempArr = [];
        console.log(filteredAccountList, chosenList);
        chosenList.forEach(element => {
          tempArr.push(filteredAccountList.find(item => item._id == element));
        });
        console.log(tempArr);
        arr.accountList = tempArr;
        setFilterList(arr);
        break;
      default:
        break;
    }
    dispatch(filterData(arr));
  };

  const onScroll = event => {
    let heightTable = event.target.children[0].clientHeight;
    let heightDiv = event.target.clientHeight;
    let length = odersList.length;
    if (event.target.scrollTop < 200) {
      if (addData < length - 110) {
        setAddData(addData + 10);
        event.target.scrollTop = 300;
      }
    }
    if (event.target.scrollTop > heightTable - heightDiv - 50 && oders.length > 90) {
      setAddData(addData - 10);
      if (addData != 0) {
        event.target.scrollTop = 1800;
      } else {
        let div = document.getElementsByClassName('odersDiv')[0];
        div.scrollTop = div.scrollHeight;
      }
    }
    if (addData != 0) setShowLast(false);
  };

  const handleClick = () => {
    let newElem;
    if (trId != null) {
      let currentElem = oders.find(elem => elem._id == trId);
      newElem = { ...currentElem };
      newElem.document = 'Нет';
      newElem.customerPayment = 'Нет';
      newElem.driverPayment = 'Нет';
    }
    setShowCreateOder(!showCreateOder);
    setWindowWidth(1400);
    setShowWindow(true);
    setWindowHeader('Добавить заказ');
    setChildren(<CreateOderNew addOder={addOder} elem={newElem} orderTable="oderslist" />);
  };

  const addOder = () => {
    setShowWindow(false);
    setShowCreateOder(false);
    setAddData(0);
    setShowLast(true);
    setTrId(null);
  };

  const getCurrentTR = id => {
    setTrId(id);
  };

  const handleClickTR = (e, elem) => {
    setCurrentElem(elem);
    let curTR = e.currentTarget;
    if (currentTR) currentTR.style.backgroundColor = '';
    setCurrentTR(curTR);
    if (e.target.tagName == 'TD') {
      setTrId(e.currentTarget.id);
      curTR.style.backgroundColor = '#ccc';
      setShowDelete(true);
    }
    if (e.target.tagName == 'P') {
      setTrId(e.currentTarget.id);
      curTR.style.backgroundColor = '#ccc';
      setShowDelete(true);
    }
  };
  const handleClickDelete = () => {
    let check = confirm('100% ?');
    if (check) {
      dispatch(delOder(trId));
      setTrId(null);
    }
  };
  const [children, setChildren] = useState(null);
  const handleClickBtnMenu = e => {
    setShowDropDownMenu(false);
    setShowVerticalMenu(false);
    if (e.target.name == 'dataEdit') {
      setShowEditDataWindow(true);
    }
    if (e.target.name == 'customerApp') {
      setShowAppWindow(true);
    }
    if (e.target.name == 'post') {
      setShowPostForm(true);
    }
    if (!showWindow) {
      let btnClick = e.target.name;
      if (btnClick == 'customPay') {
        setWindowHeader('Оплата заказчика');
        setShowWindow(true);
        setWindowWidth(1200);
        setChildren(<CustomerPaymentForm />);
      }
      if (btnClick == 'customPayments') {
        setWindowHeader('Входящие платежи');
        setShowWindow(true);
        setWindowWidth(1200);
        setChildren(<CustomerPayments />);
      }
      if (btnClick == 'driverPay') {
        setWindowHeader('Оплата перевозчику');
        setShowWindow(true);
        setWindowWidth(1200);
        setChildren(<DriverPaymentForm />);
      }
      if (btnClick == 'driverPayments') {
        setWindowHeader('Платежи перевозчикам');
        setShowWindow(true);
        setWindowWidth(1200);
        setChildren(<DriverPaymentsList />);
      }
      if (btnClick == 'driversDebt') {
        setWindowHeader('Задолженность перевозчика');
        setShowWindow(true);
        setWindowWidth(1200);
        setChildren(<DriverDebtForm />);
      }
      if (btnClick == 'otherPay') {
        setWindowHeader('Прочие расходы');
        setShowWindow(true);
        setWindowWidth(1200);
        setChildren(<ContractorsPayments />);
      }
      if (btnClick == 'bill') {
        setWindowHeader('Выставление счета');
        setShowWindow(true);
        setWindowWidth(1200);
        setChildren(<BillsForm />);
      }
      if (btnClick == 'reports') {
        setWindowHeader('Отчеты');
        setShowWindow(true);
        setWindowWidth(1200);
        setChildren(<Report />);
      }
    }
  };
  const handleClickWindowClose = () => {
    setShowWindow(false);
  };
  const handleClickSecretWindowClose = () => {
    setShowSecretTable(false);
  };
  const handleClickUserWindowClose = () => {
    setShowUserWindow(false);
  };
  const handleClickEditWindowClose = () => {
    setShowEditDataWindow(false);
    setEditTable(null);
    setIdEdit(null);
  };
  const handleClicAppkWindowClose = () => {
    setShowAppWindow(false);
  };
  const handleClickPostWindowClose = () => {
    setShowPostForm(false);
  };
  const handleClickMainDiv = () => {
    let contextDiv = document.querySelector('.divContext');
    if (contextDiv != null) {
      contextDiv.blur();
    }
  };
  const handleClickGenerate = elem => {
    setCurrentElem(elem);
    console.log(elem);
    setShowPrintForm(true);
  };
  const handleClosePrintForm = () => {
    setShowPrintForm(false);
  };
  const handleClickBtnDrop = () => {
    setShowDropDownMenu(!showDropDownMenu);
  };
  const handleClickExit = () => {
    dispatch(authSignOut());
  };
  const handleClickDriversTrips = () => {
    console.log('driversTrips', showDriversTrips);
    if (showDriversTrips) {
      setShowDriversTrips(false);
    } else {
      setShowDriversTrips(true);
    }
  };
  const handleClickUser = () => {
    setShowUserWindow(true);
  };
  const handleClickSmallMenu = () => {
    setShowVerticalMenu(!showVerticalMenu);
  };
  const handleClickTasks = () => {
    setShowTasks(true);
  };
  const handleClickTaskWindowClose = () => {
    setShowTasks(false);
  };
  const handleClickCtrl = (id, name) => {
    console.log(id, name);
    setShowEditDataWindow(true);
    setEditTable(name);
    setIdEdit(id);
  };

  return (
    <React.Fragment>
      <div className="odersDivInfo">
        <MenuAccount sumAccount={sumAccount} />
        <MenuMain
          handleClickSmallMenu={handleClickSmallMenu}
          handleClickBtnDrop={handleClickBtnDrop}
          showDropDownMenu={showDropDownMenu}
          handleClickBtnMenu={handleClickBtnMenu}
          showNewApps={showNewApps}
          numberApps={numberApps}
          showVerticalMenu={showVerticalMenu}
        />
        <MenuUser
          tasksNumber={tasksNumber}
          user={user}
          handleClickTasks={handleClickTasks}
          handleClickUser={handleClickUser}
          handleClickExit={handleClickExit}
          handleClickDriversTrips={handleClickDriversTrips}
        />
      </div>
      {showWindow && (
        <UserWindow
          header={windowHeader}
          width={windowWidth}
          handleClickWindowClose={handleClickWindowClose}
          windowId="commonWindow"
        >
          {children}
        </UserWindow>
      )}
      {showPrintForm && <PrintFormBill elem={currentElem} closePrintForm={handleClosePrintForm} />}
      {showEditDataWindow && (
        <UserWindow
          header="Редактирование данных"
          width={1400}
          handleClickWindowClose={handleClickEditWindowClose}
          windowId="editDataWindow"
          top="12%"
          left="12%"
        >
          <EditDataForm editTable={editTable} id={idEdit} />
        </UserWindow>
      )}
      {showAppWindow && (
        <UserWindow
          header="Заявки клиентов"
          width={1400}
          handleClickWindowClose={handleClicAppkWindowClose}
          windowId="applicationWindow"
          top="12%"
          left="12%"
        >
          <CustomerApps />
        </UserWindow>
      )}
      {showSecretTable && (
        <UserWindow
          header="Secret Table"
          width={1400}
          handleClickWindowClose={handleClickSecretWindowClose}
          windowId="secretWindow"
        >
          <SpecialTable />
        </UserWindow>
      )}
      {showUserWindow && (
        <UserWindow
          header="Смена пароля"
          width={500}
          height={371}
          left="40%"
          top="15%"
          handleClickWindowClose={handleClickUserWindowClose}
          windowId="changePasswordWindow"
        >
          <ChangePassword />
        </UserWindow>
      )}
      {showPostForm && (
        <UserWindow
          header="Почта"
          width={1400}
          handleClickWindowClose={handleClickPostWindowClose}
          windowId="postWindow"
          top="12%"
          left="12%"
        >
          <PostForm />
        </UserWindow>
      )}
      <div className="odersDiv" onScroll={onScroll} onClick={handleClickMainDiv}>
        {showDriversTrips ? (
          <VirtualizedDriverTable rows={driverOrderList} />
        ) : (
          <table className="odersTable">
            <UserThead
              handleClick={handleClick}
              filterList={filterList}
              writeFilterList={writeFilterList}
              trId={trId}
            />
            <tbody className="odersTbody">
              {oders.map(elem => {
                return (
                  <UserTr
                    key={elem._id}
                    elem={elem}
                    handleClickTR={handleClickTR}
                    showEdit={showEdit}
                    showDelete={showDelete}
                    handleClickDelete={handleClickDelete}
                    trId={trId}
                    getCurrentTR={getCurrentTR}
                    handleClickGenerate={handleClickGenerate}
                    handleClickCtrl={handleClickCtrl}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {showTasks && (
        <UserWindow
          header="Список дел"
          width={1200}
          handleClickWindowClose={handleClickTaskWindowClose}
          windowId="tasksWindow"
        >
          <UserTaskTable />
        </UserWindow>
      )}
      {requestStatus.status == 'REQUEST' && (
        <div className="requestStatus">{requestStatus.message}</div>
      )}
      {requestStatus.status == 'FAILURE' && (
        <div className="requestStatus">{requestStatus.error ? requestStatus.error : 'Error'}</div>
      )}
    </React.Fragment>
  );
};
