import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChoiseList } from "../choiseList/choiseList.jsx";
import {
  getReportData,
  saveReportPdf,
  sendReportEmail,
  getReportPdf,
} from "../../actions/reportActions.js";
import { dateLocal } from "../myLib/myLib.js";
import { DOMENNAME } from "../../middlewares/initialState.js";

import "./reports.sass";

export const ReconciliationAct = () => {
  const dispatch = useDispatch();

  const customerList = useSelector((state) => state.oderReducer.clientList);
  const driversList = useSelector((state) => state.oderReducer.driverlist);

  const reconciliation = useSelector(
    (state) => state.reportReducer.reconciliation
  );

  const [currentTab, setCurrentTab] = useState("TabOrder");
  const [showChoise, setShowChoise] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [stamp, setStamp] = useState(true);
  const [btnName, setBtnName] = useState("Отчет");
  const [reqData, setReqData] = useState({
    name: null,
    id: null,
    dateBegin: null,
    dateEnd: null,
    value: null,
  });

  let debt = 0;
  let income = 0;
  let outcome = 0;

  const divTabStyle = (tabId) => {
    if (tabId == currentTab) {
      return "divTab divWithWhiteBottom";
    } else return "divTab";
  };

  const handleClickTabDiv = (e) => {
    setCurrentTab(e.currentTarget.id);
  };
  const setValue = (data) => {
    console.log(data);
    setShowChoise(false);
    let { ...obj } = reqData;
    obj.name = data.field;
    obj.id = data._id;
    obj.value = data.value;
    setReqData(obj);
  };
  const handleEnterTab = (e) => {
    if (e.key == "Enter" || e.key == "Tab") {
      let { ...obj } = reqData;
      let date = new Date(e.currentTarget.value);
      if (e.currentTarget.name == "dateBegin") obj.dateBegin = date;
      if (e.currentTarget.name == "dateEnd") obj.dateEnd = date;
      setReqData(obj);
    }
  };
  const handleClickReport = () => {
    if (btnName == "Отчет") {
      dispatch(getReportData(reqData));
      setShowReport(true);
      setBtnName("Сохранить");
    }
    if (btnName == "Сохранить") {
      let reportElement = document.querySelector("#reportElement");
      dispatch(saveReportPdf(reportElement.innerHTML));
      setBtnName("Отправить Email");
    }
    if (btnName == "Отправить Email") {
      let email = customerList.find((elem) => elem._id == reqData.id).email;
      if (email == null) email = "";
      let regexp = /[-.\w]+@([\w-]+\.)+[\w-]+/g;
      if (email.match(regexp) != null) {
        dispatch(sendReportEmail(email));
      } else {
        alert("Мыла - нет!");
      }
    }
  };
  const handleChecked = () => {
    setStamp(!stamp);
  };
  const handleReset = () => {
    setShowChoise(true);
    setShowReport(false);
    setBtnName("Отчет");
    setReqData({
      name: null,
      id: null,
      dateBegin: null,
      dateEnd: null,
      value: null,
    });
  };
  const handlePrint = () => {
    dispatch(getReportPdf());
  };
  return (
    <div className="reconciliationDiv">
      <header style={{ height: "25%" }}>
        <h4 className="headerH">АктСверки</h4>
        <div className="tabsContainer">
          <div style={{ display: "flex" }}>
            <div
              id="TabOrder"
              className={divTabStyle("TabOrder")}
              onClick={handleClickTabDiv}
            >
              Заказчик
            </div>
            <div
              id="TabDriver"
              className={divTabStyle("TabDriver")}
              onClick={handleClickTabDiv}
            >
              Перевозчик
            </div>
          </div>
          <div className="btnContainer">
            <button className="reconciliationBtn" onClick={handleReset}>
              Сброс
            </button>
            <span>С печатью </span>
            <input type="checkbox" checked={stamp} onChange={handleChecked} />
            <button className="reconciliationBtn" onClick={handleClickReport}>
              {btnName}
            </button>
            <button className="reconciliationBtn" onClick={handlePrint}>
              Печать
            </button>
          </div>
        </div>
        <div className="divParamSearch">
          <span>{currentTab == "TabOrder" ? "Заказчик" : "Перевозчик"}</span>
          {showChoise ? (
            <div className="divParamChoise">
              <ChoiseList
                name={currentTab == "TabOrder" ? "customer" : "driver"}
                arrlist={currentTab == "TabOrder" ? customerList : driversList}
                setValue={setValue}
              />
            </div>
          ) : (
            <span>{reqData.value !== null ? reqData.value : ""}</span>
          )}
          <span>Дата с </span>
          {reqData.dateBegin == null ? (
            <div>
              <input name="dateBegin" type="date" onKeyDown={handleEnterTab} />
            </div>
          ) : (
            <span>{reqData.dateBegin.toLocaleDateString()}</span>
          )}
          <span> по </span>
          {reqData.dateEnd == null ? (
            <div>
              <input name="dateEnd" type="date" onKeyDown={handleEnterTab} />
            </div>
          ) : (
            <span>{reqData.dateEnd.toLocaleDateString()}</span>
          )}
        </div>
      </header>
      {showReport && (
        <main
          id="reportElement"
          style={{
            width: "100%",
            overflowY: "auto",
            height: "75%",
            backgroundColor: "white",
          }}
        >
          <div style={{ padding: "5mm 5mm 5mm 20mm", fontSize: "16px" }}>
            <h3 style={{ textAlign: "center" }}>Ведомость по контрагентам</h3>
            <h4 style={{ textAlign: "center" }}>{`C ${dateLocal(
              reqData.dateBegin
            )} по ${dateLocal(reqData.dateEnd)} контрагент ${
              reqData.name == "customer"
                ? customerList.find((elem) => elem._id == reqData.id)
                    .companyName
                : driversList.find((elem) => elem._id == reqData.id).companyName
            }`}</h4>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  <td style={{ border: "1px solid black" }}>Дата</td>
                  <td style={{ border: "1px solid black" }}>
                    Документы движения
                  </td>
                  <td style={{ border: "1px solid black" }}>Приход</td>
                  <td style={{ border: "1px solid black" }}>Расход</td>
                  <td style={{ border: "1px solid black" }}>Наш долг</td>
                  <td style={{ border: "1px solid black" }}>Долг клиента</td>
                </tr>
              </thead>
              <tbody>
                {reconciliation.map((elem, index) => {
                  const lengthArr = reconciliation.length;
                  const styleTr = (index) => {
                    if (index == 0 || index == lengthArr - 1) {
                      return { fontWeight: 900 };
                    } else return {};
                  };
                  if (elem.type == "outCome") {
                    debt = debt + Number(elem.sum);
                    if (index != 0 && index != lengthArr - 1)
                      outcome = outcome + Number(elem.sum);
                  }
                  if (elem.type == "inCome") {
                    debt = debt - Number(elem.sum);
                    if (index != 0 && index != lengthArr - 1) {
                      if (reqData.name == "customer") {
                        income = income + Number(elem.sum);
                      } else {
                        income =
                          income + Number(elem.sum) - Number(elem.sumOfDebts);
                      }
                    }
                  }
                  return (
                    <tr key={"reconciliation" + elem.id} style={styleTr(index)}>
                      <td style={{ border: "1px solid black" }}>
                        {dateLocal(elem.date)}
                      </td>
                      <td
                        style={{ border: "1px solid black", textAlign: "left" }}
                      >
                        {elem.textInfo}
                      </td>
                      <td style={{ border: "1px solid black" }}>
                        {elem.type == "inCome"
                          ? `${
                              reqData.name == "customer"
                                ? elem.sum
                                : `${elem.sum - elem.sumOfDebts} (${
                                    elem.sumOfDebts
                                  })`
                            }`
                          : ""}
                      </td>
                      <td style={{ border: "1px solid black" }}>
                        {elem.type == "outCome" ? elem.sum : ""}
                      </td>
                      <td style={{ border: "1px solid black" }}>
                        {debt > 0 ? "" : -debt}
                      </td>
                      <td style={{ border: "1px solid black" }}>
                        {debt > 0 ? debt : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6}></td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black" }} rowSpan={2}>
                    Итого
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    Начальный долг клиента
                  </td>
                  <td style={{ border: "1px solid black" }}>Приход</td>
                  <td style={{ border: "1px solid black" }}>Расход</td>
                  <td style={{ border: "1px solid black" }} colSpan={2}>
                    Долг клиента на конец периода
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black" }}>
                    {reconciliation.length != 0 ? reconciliation[0].sum : ""}
                  </td>
                  <td style={{ border: "1px solid black" }}>{income}</td>
                  <td style={{ border: "1px solid black" }}>{outcome}</td>
                  <td style={{ border: "1px solid black" }} colSpan={2}>
                    {reconciliation.length != 0
                      ? reconciliation[reconciliation.length - 1].sum
                      : ""}
                  </td>
                </tr>
              </tfoot>
            </table>
            <div
              style={{
                position: "relative",
                height: "100px",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "90px",
              }}
            >
              <div>
                <span style={{ width: "50%" }}>Исполнитель</span>
                <span style={{ textDecoration: "underline" }}>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Иванов
                  С.Н.&emsp;&emsp;
                </span>
              </div>
              <div>
                <span style={{ width: "50%" }}>Заказчик</span>
                <span style={{ textDecoration: "underline" }}>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; &emsp;&emsp;
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                </span>
              </div>
              {/* <p style={{ marginTop: "75px", fontSize: "14px" }}>
                Исполнитель{" "}
                <span style={{ textDecoration: "underline" }}>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                  Иванов С.Н.&emsp;&emsp;
                </span>
                &emsp;&emsp;Заказчик{" "}
                <span style={{ textDecoration: "underline" }}>
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                  &emsp;&emsp;&emsp;&emsp; &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                </span>{" "}
              </p> */}
              {stamp && (
                <img
                  style={{
                    position: "absolute",
                    left: "70px",
                    top: "-70px",
                    opacity: "0.7",
                    zIndex: "1",
                  }}
                  height="170"
                  width="170"
                  src={`${DOMENNAME}/img/stamp.png`}
                />
              )}
              {stamp && (
                <img
                  style={{
                    position: "absolute",
                    left: "140px",
                    top: "-75px",
                    zIndex: "2",
                    transform: "rotate(15deg)",
                  }}
                  height="120"
                  width="120"
                  src={`${DOMENNAME}/img/sign.png`}
                />
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
