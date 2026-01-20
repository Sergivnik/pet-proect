import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import { DriverPaymentDebtTr } from './driverPaymentDebtTr.jsx';
import { DriverPaymentTr } from './driverPaymentTr.jsx';
import { ObjIncludesId } from '../myLib/myLib.js';
import { getDataDriverDebt, makePaymentDriver } from '../../actions/driverActions.js';
import './driverForms.sass';

export const DriverPaymentForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDataDriverDebt());
  }, []);
  const odersList = useSelector(state => state.oderReducer.originOdersList);
  const driversList = useSelector(state => state.oderReducer.driverlist);
  const driverDebtList = useSelector(state => state.oderReducer.driverDebtList);
  const trackDriverList = useSelector(state => state.oderReducer.trackdrivers);

  const [odersWithoutPayment, setOdersWithoutPayment] = useState([]);
  const [filteredOdersList, setFilteredOdersList] = useState([]);
  const [driverListWithoutPayment, setDriverListWithoutPayment] = useState([]);
  const [driverDebts, setDriverDebts] = useState([]);
  const [chosenDriver, setChosenDriver] = useState(null);
  const [chosenDriverId, setChosenDriverId] = useState(null);
  const [showInputFieldDriver, setShowInputFieldDriver] = useState(true);
  const [currentDriverDebt, setCurrentDriverDebt] = useState(null);
  const [currentDriverSum, setCurrentDriverSum] = useState(null);
  const [currentDriverSumOfOders, setCurrentDriverSumOfOders] = useState(null);
  const [currentDriverSumOfDebts, setCurrentDriverSumOfDebts] = useState(null);
  const [chosenOders, setChosenOders] = useState([]);
  const [chosenDebts, setChosenDebts] = useState([]);
  const [showDetailsOders, setShowDetailsOders] = useState(false);
  const [showInputFieldOfDebt, setShowInputFieldOfDebt] = useState(true);
  const [sumOfChosenDebt, setSumOfChosenDebt] = useState(null);
  const [showDebts, setShowDebts] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [choiceEnabled, setChoiceEnabled] = useState(false);
  const [partialDebt, setPartialDebt] = useState({ id: null, sum: null });
  const [isDebtsChosen, setIsDebtsChosen] = useState(false);
  const [trakDriverSum, setTrackDriverSum] = useState([]);

  useEffect(() => {
    let arr = odersList.filter(elem => elem.driverPayment != 'Ок' && elem.colorTR != 'Orange');
    setOdersWithoutPayment(arr);
    setFilteredOdersList(arr);
    let arrDriver = [];
    arr.forEach(elem => {
      if (!arrDriver.includes(elem.idDriver)) arrDriver.push(elem.idDriver);
    });
    let arrObj = [];
    arrDriver.forEach(elem => {
      let driver = driversList.find(item => item._id == elem);
      arrObj.push(driver);
    });
    setDriverListWithoutPayment(arrObj);
    if (chosenDriverId) {
      console.log(chosenDriverId);
      let arrOders = arr.filter(elem => elem.idDriver == chosenDriverId);
      setFilteredOdersList(arrOders);
      let arrDebts = driverDebtList.filter(
        elem => elem.idDriver == chosenDriverId && elem.debtClosed != 'Ок'
      );
      setDriverDebts(arrDebts);
      setSumOfChosenDebt(null);
    }
  }, [odersList, driverDebtList]);

  const setValue = data => {
    let arr = odersWithoutPayment.filter(elem => elem.idDriver == data._id);
    setFilteredOdersList(arr);
    let sumOders = arr.reduce((sum, elem) => sum + Number(elem.driverPrice), 0);
    setCurrentDriverSum(sumOders);
    let arrDebt = driverDebtList.filter(
      elem => elem.idDriver == data._id && elem.debtClosed != 'Ок'
    );
    let clone = [];
    arrDebt.forEach(elem => {
      clone.push(Object.assign({}, elem));
    });
    setDriverDebts(clone);
    let sumDebt = arrDebt.reduce(
      (sum, elem) => sum + Number(elem.sumOfDebt) - Number(elem.paidPartOfDebt),
      0
    );
    setChosenDriverId(data._id);
    setChosenDriver(data.value);
    setShowInputFieldDriver(false);
    setCurrentDriverDebt(sumDebt);
    setCurrentDriverSumOfOders(null);
    setShowDetailsOders(true);
    setChosenOders([]);
    setChosenDebts([]);
    setSumOfChosenDebt(null);
    setCurrentDriverSumOfDebts(null);
    setIsDebtsChosen(false);
    setShowInputFieldOfDebt(true);
    setTrackDriverSum([]);
    if (sumDebt != 0) {
      setShowDebts(true);
    } else setShowDebts(false);
  };
  const handleEnter = e => {
    if (e.key == 'Enter') {
      setSumOfChosenDebt(e.currentTarget.value);
      setShowInputFieldOfDebt(false);
      setChoiceEnabled(true);
      if (e.currentTarget.value == 0) setShowBtn(true);
    }
  };
  const handleClickInputDebt = () => {
    setShowInputFieldOfDebt(true);
    setChoiceEnabled(false);
  };
  const handleClickInputDriver = () => {
    setShowInputFieldDriver(true);
  };
  const choiseOders = (oderId, driverPrice) => {
    let [...arr] = chosenOders;
    let sum = currentDriverSumOfOders;
    let [...arrTrackDriver] = trakDriverSum;
    let order = odersList.find(order => order._id == oderId);
    let indexTrackDriver = arrTrackDriver.findIndex(
      trackDriver => trackDriver.id == order.idTrackDriver
    );
    if (indexTrackDriver == -1) {
      indexTrackDriver = arrTrackDriver.length;
      arrTrackDriver.push({
        id: order.idTrackDriver,
        sum: 0,
        name: trackDriverList.find(trackdriver => trackdriver._id == order.idTrackDriver).value,
      });
    }
    if (!arr.includes(oderId)) {
      arr.push(oderId);
      sum = sum + driverPrice;
      arrTrackDriver[indexTrackDriver].sum = arrTrackDriver[indexTrackDriver].sum + driverPrice;
    } else {
      let index = arr.findIndex(elem => elem == oderId);
      arr.splice(index, 1);
      sum = sum - driverPrice;
      arrTrackDriver[indexTrackDriver].sum = arrTrackDriver[indexTrackDriver].sum - driverPrice;
    }
    setChosenOders(arr);
    setCurrentDriverSumOfOders(sum);
    setTrackDriverSum(arrTrackDriver);
    if (!showDebts) setShowBtn(true);
  };
  const choiseDebts = (debtId, sumOfDebt) => {
    let [...arr] = chosenDebts;
    let sum = currentDriverSumOfDebts;
    console.log(sum);
    if (!ObjIncludesId(debtId, arr)) {
      if (sum + sumOfDebt < Number(sumOfChosenDebt)) {
        arr.push({ id: debtId, sum: sumOfDebt });
        setCurrentDriverSumOfDebts(sum + sumOfDebt);
      } else {
        arr.push({ id: debtId, sum: Number(sumOfChosenDebt) - sum });
        setCurrentDriverSumOfDebts(Number(sumOfChosenDebt));
        setPartialDebt({ id: debtId, sum: sumOfDebt });
        let [...arrDebts] = driverDebts;
        let indexDebt = arrDebts.findIndex(elem => elem.id == debtId);
        let lastDebtPart = Number(sumOfChosenDebt) - sum;
        arrDebts[indexDebt].sumOfDebt = lastDebtPart + Number(arrDebts[indexDebt].paidPartOfDebt);
        arrDebts[indexDebt].debtClosed = 'частично';
        setDriverDebts(arrDebts);
        setShowBtn(true);
        setIsDebtsChosen(true);
      }
    } else {
      if (partialDebt.id != debtId) {
        let index = arr.findIndex(elem => elem.id == debtId);
        arr.splice(index, 1);
        setCurrentDriverSumOfDebts(sum - sumOfDebt);
      } else {
        let index = arr.findIndex(elem => elem.id == debtId);
        arr.splice(index, 1);
        setCurrentDriverSumOfDebts(sum - sumOfDebt);
        let [...arrDebts] = driverDebts;
        let indexDebt = arrDebts.findIndex(elem => elem.id == debtId);
        arrDebts[indexDebt].sumOfDebt =
          Number(partialDebt.sum) + Number(arrDebts[indexDebt].paidPartOfDebt);
        if (Number(arrDebts[indexDebt].paidPartOfDebt) == 0) arrDebts[indexDebt].debtClosed = 'нет';
        setDriverDebts(arrDebts);
        setIsDebtsChosen(false);
      }
      setShowBtn(false);
    }
    setChosenDebts(arr);
  };
  const handleClickBtn = () => {
    dispatch(makePaymentDriver(chosenDriverId, chosenOders, chosenDebts, currentDriverSumOfOders));
    setCurrentDriverSumOfDebts(null);
    setSumOfChosenDebt(null);
    setIsDebtsChosen(false);
    setPartialDebt({ id: null, sum: null });
    setChosenOders([]);
    setChosenDebts([]);
    setShowBtn(false);
  };
  return (
    <div className="driverPaymentMainDiv">
      <header className="driverPaymentHeader">
        <div className="driverPaymentChoise">
          <p className="driverPaymentChoiseP">Перевозчик</p>
          {showInputFieldDriver ? (
            <ChoiseList name="driver" arrlist={driverListWithoutPayment} setValue={setValue} />
          ) : (
            <div onClick={handleClickInputDriver}>{chosenDriver}</div>
          )}
        </div>
        {showDetailsOders && (
          <div className="driverPaymentDetails">
            <p className="driverPaymentChoiseP">Стоимость рейсов</p>
            <div>{currentDriverSum}</div>
          </div>
        )}
        {showDetailsOders && (
          <div className="driverPaymentDetails">
            <p className="driverPaymentChoiseP">Выбрано для оплаты</p>
            <div>{currentDriverSumOfOders}</div>
            <div>
              {trakDriverSum.map(trakDriver => {
                return (
                  <p className="trackDriverP" key={`keyTrackDriver${trakDriver.id}`}>
                    {trakDriver.name}
                    {'   '}
                    {trakDriver.sum}
                  </p>
                );
              })}
            </div>
          </div>
        )}
        {showDebts && (
          <div className="driverPaymentDetails">
            <p className="driverPaymentChoiseP">Долг перевозчика</p>
            <div>{currentDriverDebt}</div>
          </div>
        )}
        {showDebts && (
          <div className="driverPaymentDetails">
            <p className="driverPaymentChoiseP">Заплатить из долга</p>
            {showInputFieldOfDebt ? (
              <input type="Number" onKeyDown={handleEnter} />
            ) : (
              <div onClick={handleClickInputDebt}>{sumOfChosenDebt - currentDriverSumOfDebts}</div>
            )}
          </div>
        )}
        {showDetailsOders && (
          <div className="driverPaymentDetails">
            <p className="driverPaymentChoiseP">Сумма к оплате</p>
            <div>{currentDriverSumOfOders - sumOfChosenDebt}</div>
          </div>
        )}
      </header>
      <div className="driverDebtTableDiv">
        {showDebts && <span className="driverPaymentTableSpan">Долги перевозчика</span>}
        {showDebts && (
          <div className="driverPaymentDebtsDiv">
            <table className="driverDebtMainTable">
              <thead className="driverDebtMainHeader">
                <tr className="driverDebtMainHeaderTr">
                  <td className="driverDebtMainHeaderTd">
                    <span>Дата</span>
                  </td>
                  <td className="driverDebtMainHeaderTd">
                    <span>Перевозчик</span>
                  </td>
                  <td className="driverDebtMainHeaderTd">
                    <span>Категория</span>
                  </td>
                  <td className="driverDebtMainHeaderTd">
                    <span>Сумма</span>
                  </td>
                  <td className="driverDebtMainHeaderTd">Примечание</td>
                  <td className="driverDebtMainHeaderTd">
                    <span>Долг закрыт</span>
                  </td>
                </tr>
              </thead>
              <tbody>
                {driverDebts.map(elem => {
                  return (
                    <DriverPaymentDebtTr
                      key={elem.id}
                      debtData={elem}
                      choiseDebts={choiseDebts}
                      choiceEnabled={choiceEnabled}
                      isDebtsChosen={isDebtsChosen}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <span className="driverPaymentTableSpan">Рейсы перевозчика</span>
        <div className="driverPaymentOdersDiv">
          <table className="driverDebtMainTable">
            <thead className="driverDebtMainHeader">
              <tr className="driverDebtMainHeaderTr">
                <td className="driverDebtMainHeaderTd">
                  <span>Дата</span>
                </td>
                <td className="driverDebtMainHeaderTd">
                  <span>Перевозчик</span>
                </td>
                <td className="driverDebtMainHeaderTd">
                  <span>Заказчик</span>
                </td>
                <td className="driverDebtMainHeaderTd">
                  <span>Погрузка</span>
                </td>
                <td className="driverDebtMainHeaderTd">
                  <span>Выгрузка</span>
                </td>
                <td className="driverDebtMainHeaderTd">
                  <span>Сумма</span>
                </td>
                <td className="driverDebtMainHeaderTd">
                  <span>Документы</span>
                </td>
                <td className="driverDebtMainHeaderTd">
                  <span>Номер акта</span>
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredOdersList.map(elem => {
                return <DriverPaymentTr key={elem._id} elem={elem} choiseOders={choiseOders} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showBtn && <button onClick={handleClickBtn}>Провести</button>}
    </div>
  );
};
