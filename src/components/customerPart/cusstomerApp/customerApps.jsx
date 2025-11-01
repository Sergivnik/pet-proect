import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CustomerAppTr } from "./customerAppTr.jsx";
import { UserWindow } from "../../userWindow/userWindow.jsx";
import { CustomerCreateApp } from "../customerOrders/customerCreateApp.jsx";
import { AppCustomerDriverPart } from "./appCustomerDriverPart.jsx";
import { delCustomerApp } from "../../../actions/customerOrderAction.js";
import { AppFormExtra } from "../../documents/appFormExtra.jsx";
import { CreateOderNew } from "../../createOder/createOderNew.jsx";
import { dateLocal } from "../../myLib/myLib.js";
import "./customerApps.sass";

export const CustomerApps = () => {
  const dispatch = useDispatch();

  const appList = useSelector((state) => state.customerReducer.customerOrders);

  const user = useSelector((state) => state.oderReducer.currentUser);
  const [currentId, setCurrentId] = useState(null);
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [dataDriver, setDataDriver] = useState(null);
  const [dataCustomer, setDataCustoner] = useState(null);
  const [copyApp, setCopyApp] = useState(false);
  const [showPrintApp, setShowPrintApp] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [appListFiltred, setAppListFiltred] = useState(appList);
  const [isOrderLinked, setIsOrderLinked] = useState(true);

  useEffect(() => {
    const onKeypress = (e) => {
      if (e.code == "Escape") {
        setCurrentId(null);
        setShowCreateApp(false);
      }
    };
    document.addEventListener("keydown", onKeypress);
    return () => {
      document.removeEventListener("keydown", onKeypress);
    };
  }, []);
  useEffect(() => {
    let arr = appList.filter((elem) => elem.orderId == null);
    setAppListFiltred(arr);
  }, [appList]);

  const getId = (id) => {
    setCurrentId(id);
    let currentApp = appList.find((app) => app._id == id);
    let offLoadingDate =
      currentApp.dateOfUnloading[currentApp.dateOfUnloading.length - 1];
    let order = {
      date: offLoadingDate,
      idDriver: currentApp.idDriver,
      idCustomer: currentApp.customerId,
      idLoadingPoint: currentApp.idLoadingPoint,
      idUnloadingPoint: currentApp.idUnloadingPoint,
      customerPrice: currentApp.customerPrice,
      idTrackDriver: currentApp.idTrackDriver,
      idTrack: currentApp.idTrack,
      idManager: currentApp.idManager,
      loadingInfo: currentApp.loadingText,
      unloadingInfo: currentApp.unloadingText,
      applicationNumber: `${currentApp._id} от ${dateLocal(
        currentApp.dateOfApp
      )}`,
      completed: false,
      colorTR: null,
    };
    setOrderData(order);
  };
  const handleClickCreateApp = () => {
    setShowCreateApp(true);
  };
  const handleClickEditApp = () => {
    setShowCreateApp(true);
  };
  const handleClickEditWindowClose = () => {
    setShowCreateApp(false);
  };
  const getDriverData = (data) => {
    setDataDriver(data);
  };
  const getCustomerData = (data) => {
    setDataCustoner(data);
  };
  const handleDubleClick = () => {
    setShowCreateApp(true);
  };
  const handleClickCopy = () => {
    setCopyApp(true);
    setShowCreateApp(true);
  };
  const handlecleckDelete = () => {
    dispatch(delCustomerApp(currentId));
  };
  const handlecleckPrint = () => {
    setShowPrintApp(true);
  };
  const handlecleckCreateOrder = () => {
    setShowCreateOrder(true);
  };
  const handleClickUserWindowClose = () => {
    setShowPrintApp(false);
  };
  const handleClickSave = () => {
    setShowCreateOrder(false);
  };
  const handleChangeOrderLink = () => {
    setIsOrderLinked(!isOrderLinked);
    if (isOrderLinked) {
      setAppListFiltred(appList);
    } else {
      let arr = appList.filter((elem) => elem.orderId == null);
      setAppListFiltred(arr);
    }
  };

  return (
    <div className="customerAppContainer">
      <menu className="customerAppMenu">
        <div className="customerAppMenuBtnContainer">
          {currentId == null ? (
            <button
              className="customerAppMenuBtn"
              onClick={handleClickCreateApp}
            >
              Создать заявку
            </button>
          ) : (
            <button className="customerAppMenuBtn" onClick={handleClickEditApp}>
              Редактировать заявку
            </button>
          )}
          {currentId != null && (
            <button className="customerAppMenuBtn" onClick={handleClickCopy}>
              Копировать заявку
            </button>
          )}
          {currentId != null && (
            <button className="customerAppMenuBtn" onClick={handlecleckDelete}>
              Удалить заявку
            </button>
          )}
          {currentId != null && (
            <button className="customerAppMenuBtn" onClick={handlecleckPrint}>
              Печать заявки
            </button>
          )}
          {currentId != null && (
            <button
              className="customerAppMenuBtn"
              onClick={handlecleckCreateOrder}
            >
              Создать заказ
            </button>
          )}
        </div>
        <div className="customerAppMenuFilterContainer">
          <label>
            <input
              type="checkbox"
              checked={isOrderLinked}
              onChange={handleChangeOrderLink}
            />
            Без заказов
          </label>
        </div>
      </menu>
      <main className="customerAppMain">
        <table className="customerAppTable">
          <thead className="customerAppThead">
            <tr>
              <td className="customerAppTd">Заказчик</td>
              <td className="customerAppTd">Дата</td>
              <td className="customerAppTd">Пункты погрузки</td>
              <td className="customerAppTd">Пункты выгрузки</td>
              <td className="customerAppTd">Цена</td>
              <td className="customerAppTd">Заказ</td>
            </tr>
          </thead>
          <tbody>
            {appListFiltred.map((elem) => {
              return (
                <CustomerAppTr
                  key={`customerAppTr${elem._id}`}
                  elem={elem}
                  getId={getId}
                  currentId={currentId}
                  dubleClick={handleDubleClick}
                />
              );
            })}
          </tbody>
        </table>
      </main>
      {showCreateApp && (
        <UserWindow
          header="Создание заявки"
          width={1200}
          height={700}
          top={"10px"}
          handleClickWindowClose={handleClickEditWindowClose}
          windowId="createAppWindow"
        >
          <CustomerCreateApp
            id={currentId}
            user={user}
            closeWindow={handleClickEditWindowClose}
            dataDriver={dataDriver}
            dataCustomer={dataCustomer}
            copyApp={copyApp}
          >
            <AppCustomerDriverPart
              id={currentId}
              getDriverData={getDriverData}
              getCustomerData={getCustomerData}
            />
          </CustomerCreateApp>
        </UserWindow>
      )}
      {showPrintApp && (
        <UserWindow
          header="Оформление заявки"
          width={800}
          height={800}
          left="20vw"
          top="-20px"
          handleClickWindowClose={handleClickUserWindowClose}
          windowId="fillApplication"
        >
          <AppFormExtra id={currentId} isLogistApp={true} />
        </UserWindow>
      )}
      {showCreateOrder && (
        <UserWindow
          header="Создание заказа"
          width={1200}
          height={400}
          top={"10px"}
          handleClickWindowClose={handleClickSave}
          windowId="createOrderWindow"
        >
          <CreateOderNew
            elem={orderData}
            isMadeFromApp={true}
            appId={currentId}
            addOder={handleClickSave}
            orderTable="oderslist"
          />
        </UserWindow>
      )}
    </div>
  );
};
