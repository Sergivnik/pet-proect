import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dateLocal } from '../myLib/myLib.js';
import { addData, editData } from '../../actions/editDataAction.js';
import { TdWithText } from '../myLib/myTd/tdWithText.jsx';

import './reports.sass';
import { editYearConst } from '../../actions/reportActions.js';

export const IncomeReport = () => {
  const dispatch = useDispatch();

  const incomereport = useSelector(state => state.oderReducer.incomereport);
  const ordersList = useSelector(state => state.oderReducer.originOdersList);
  const yearconst = useSelector(state => state.oderReducer.yearconst);
  const clientList = useSelector(state => state.oderReducer.clientList);
  const income = useSelector(state => state.oderReducer.income);
  const expenses = useSelector(state => state.oderReducer.expenses);
  const customerPayments = useSelector(state => state.oderReducer.customerPaymentsList);
  const contractorsPayments = useSelector(state => state.oderReducer.contractorsPayments);
  const driverpayments = useSelector(state => state.oderReducer.driverpayments);
  const addtable = useSelector(state => state.oderReducer.addtable);

  const [sumAccount, setSumAccount] = useState(null);
  const [extraPay, setExtraPay] = useState(null);
  const [customerDebt, setCustomerDebt] = useState(null);
  const [driverDebt, setDriverDebt] = useState(null);
  const [currentTax, setCurrentTax] = useState(null);
  const [sumPink, setSumPink] = useState(null);
  const [incomeToyal, setIncomeTotal] = useState(null);
  const [showAddTr, setShowAddTr] = useState(false);
  const [incomeList, setIncomeList] = useState(incomereport ? incomereport : []);
  const [showBtn, setShowBtn] = useState(false);
  const [newMonthData, setNewMonthData] = useState({
    date: null,
    incomeFirst: null,
  });
  const [showEditLastYearTaxDebt, setShowEditLastYearTaxDebt] = useState(false);
  const [lastYearTaxDebt, setLastYearTaxDebt] = useState(
    yearconst ? yearconst.lastyeartaxdebt : null
  );
  const [showEditTaxAdvance, setShowEditTaxAdvance] = useState(false);
  const [taxAdvance, setTaxAdvance] = useState(yearconst ? yearconst.taxadvance : null);

  useEffect(() => {
    let addSum = clientList.reduce((s, item) => s + Number(item.extraPayments), 0);
    setExtraPay(addSum);
    let sum = Math.floor((Number(income) - Number(expenses) + addSum + 0.0) * 100) / 100;
    setSumAccount(sum);
  }, [income, expenses]);
  useEffect(() => {
    let customerDebt = 0;
    let driverDebt = 0;
    ordersList.forEach(elem => {
      if (elem.customerPayment != 'Ок') {
        if (elem.customerPayment == 'Частично оплачен') {
          customerDebt =
            customerDebt + Number(elem.customerPrice) - Number(elem.partialPaymentAmount);
        } else {
          customerDebt = customerDebt + Number(elem.customerPrice);
        }
      }
      if (elem.driverPayment != 'Ок') {
        driverDebt = driverDebt + Number(elem.driverPrice);
      }
    });
    setCustomerDebt(customerDebt - Number(extraPay));
    setDriverDebt(driverDebt);
    console.log(yearconst);
  }, [ordersList, extraPay]);
  useEffect(() => {
    let dateBegin = new Date(new Date().getFullYear(), 0, 1);
    let dateEnd = new Date();
    let daysThisYear = (dateEnd.getTime() - dateBegin.getTime()) / (1000 * 3600 * 24);
    let sumIn = 0;
    let sumOut = 0;
    customerPayments.forEach(elem => {
      let date = new Date(elem.date);
      if (date >= dateBegin && date <= dateEnd) {
        sumIn = sumIn + Number(elem.sumOfPayment);
      }
    });
    contractorsPayments.forEach(elem => {
      let date = new Date(elem.date);
      if (date >= dateBegin && date <= dateEnd && elem.category == 1) {
        if (Number(elem.sum) > 0) sumOut = sumOut + Number(elem.sum);
        if (Number(elem.sum) < 0) sumIn = sumIn - Number(elem.sum);
      }
    });
    driverpayments.forEach(elem => {
      let date = new Date(elem.date);
      if (date >= dateBegin && date <= dateEnd) {
        sumOut = sumOut + Number(elem.sumOfPayment) - Number(elem.sumOfDebts);
      }
    });
    if ((sumIn - sumOut) / 10 > sumIn / 100) {
      setCurrentTax(
        (sumIn - sumOut) / 10 +
          (Number(yearconst.fixedincometax) / 365) * daysThisYear +
          (sumIn - sumOut) / 100
      );
    } else {
      if (sumIn > sumOut) {
        let tax =
          sumIn / 100 +
          (Number(yearconst.fixedincometax) / 365) * daysThisYear +
          (sumIn - sumOut) / 100;
        setCurrentTax(tax);
      } else {
        let tax =
          sumIn / 100 + (Number(yearconst ? yearconst.fixedincometax : 0) / 365) * daysThisYear;
        setCurrentTax(tax);
      }
    }
  }, [customerPayments, contractorsPayments, driverpayments]);
  useEffect(() => {
    let sumPink = 0;
    addtable.forEach(elem => {
      if (elem.card == 0) {
        let price = Number(ordersList.find(order => order._id == elem.orderId).customerPrice);
        sumPink = sumPink + ((price - Number(elem.sum)) * (100 - Number(elem.interest))) / 100;
      }
    });
    setSumPink(sumPink);
  }, [addtable]);
  useEffect(() => {
    let arr = [...incomereport];
    arr.forEach((elem, index) => {
      if (index < arr.length - 1) {
        elem.incomeMonth = Number(arr[index + 1].incomeFirst) - Number(elem.incomeFirst);
      } else {
        elem.incomeMonth = null;
      }
    });
    setIncomeList(arr);
  }, [incomereport]);
  useEffect(() => {
    let income =
      sumAccount +
      customerDebt -
      driverDebt -
      Number(yearconst ? yearconst.lastyeartaxdebt : 0) +
      Number(yearconst ? yearconst.taxadvance : 0) -
      currentTax -
      sumPink;
    setIncomeTotal(income);
  }, [sumAccount, customerDebt, driverDebt, yearconst, currentTax, sumPink]);
  useEffect(() => {
    let lastMonthDate = new Date(incomeList[incomeList.length - 1] ? incomeList[incomeList.length - 1].date : null);
    let now = new Date();
    if (
      now.getFullYear() > lastMonthDate.getFullYear() ||
      now.getMonth() > lastMonthDate.getMonth()
    ) {
      setShowBtn(true);
    } else {
      setShowBtn(false);
    }
    let div = document.querySelector('.incomeReportMain');
    div.scrollTop = div.scrollHeight;
  }, [incomeList]);

  const handleChangeConstInput = e => {
    if (e.currentTarget.name == 'lastYearTaxDebt') setLastYearTaxDebt(e.currentTarget.value);
    if (e.currentTarget.name == 'taxAdvdnce') setTaxAdvance(e.currentTarget.value);
  };
  const handleEnterInput = e => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      if (e.currentTarget.name == 'lastYearTaxDebt') {
        console.log(lastYearTaxDebt);
        dispatch(editYearConst('lastyeartaxdebt', lastYearTaxDebt));
        setShowEditLastYearTaxDebt(false);
      }
      if (e.currentTarget.name == 'taxAdvdnce') {
        console.log(lastYearTaxDebt);
        dispatch(editYearConst('taxadvance', taxAdvance));
        setShowEditTaxAdvance(false);
      }
    }
  };
  const handleLastYearDebtDblClick = () => {
    setShowEditLastYearTaxDebt(true);
  };
  const handleTaxAdvanceDblClick = () => {
    setShowEditTaxAdvance(true);
  };

  const handleClick = () => {
    setShowAddTr(true);
    let now = new Date();
    let firstDay = `${now.getFullYear()}-${now.getMonth() + 1}-1`;
    let obj = { ...newMonthData };
    obj.date = firstDay;
    obj.incomeFirst = incomeToyal;
    setNewMonthData(obj);
  };
  const getEditText = (text, name) => {
    let obj = { ...newMonthData };
    obj[name] = text;
    setNewMonthData(obj);
    dispatch(addData(obj, 'incomereport'));
  };
  const getNewData = (text, name, elem) => {
    let date = new Date(elem.date);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let obj = {
      _id: elem._id,
      date: `${year}-${month}-${day}`,
      [name]: text,
    };
    dispatch(editData(obj, 'incomereport'));
    console.log(obj);
  };
  // Р.сч.+ДолгКлиента-ДолгВодителям-ДолгНалогЯпрошлГод+ПлатежиНалогЯтекГод-НакоплНалогЯтекГод-ДолгРозовым

  return (
    <div className="incomeReportContainer">
      <header className="incomeReportHeader">
        <div className="incomeReportDivHeader">
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">Рас.сч.</span>
            <p className="incomeReportP">
              {sumAccount ? sumAccount.toLocaleString() + ' руб' : null}
            </p>
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">Долг заказчиков</span>
            <p className="incomeReportP">
              {customerDebt ? customerDebt.toLocaleString() + ' руб' : null}
            </p>
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">Долг перевозчикам</span>
            <p className="incomeReportP">
              {driverDebt ? driverDebt.toLocaleString() + ' руб' : null}
            </p>
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">Долг по налогам прошлого года</span>
            {showEditLastYearTaxDebt ? (
              <input
                type="number"
                name="lastYearTaxDebt"
                value={lastYearTaxDebt}
                onChange={handleChangeConstInput}
                onKeyDown={handleEnterInput}
              />
            ) : (
              <p className="incomeReportP" onDoubleClick={handleLastYearDebtDblClick}>
                {yearconst ? Number(yearconst.lastyeartaxdebt).toLocaleString() + ' руб' : null}
              </p>
            )}
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">Аванм по налогам текущего года</span>
            {showEditTaxAdvance ? (
              <input
                type="Number"
                name="taxAdvdnce"
                value={taxAdvance}
                onChange={handleChangeConstInput}
                onKeyDown={handleEnterInput}
              />
            ) : (
              <p className="incomeReportP" onDoubleClick={handleTaxAdvanceDblClick}>
                {yearconst ? Number(yearconst.taxadvance).toLocaleString() + ' руб' : null}
              </p>
            )}
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">Налоги текущего года</span>
            <p className="incomeReportP">
              {currentTax ? currentTax.toLocaleString() + ' руб' : null}
            </p>
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">Розовые</span>
            <p className="incomeReportP">{sumPink ? sumPink.toLocaleString() + ' руб' : null}</p>
          </div>
        </div>
        <h3 className="incomeReportHeaderH3">
          {incomeToyal ? incomeToyal.toLocaleString() + ' руб' : null}
        </h3>
      </header>
      <main className="incomeReportMain">
        <table className="incomeReportTable">
          <thead className="incomeReportThead">
            <tr>
              <td className="incomeReportTableTd">Дата</td>
              <td className="incomeReportTableTd">Доход на начало месяца</td>
              <td className="incomeReportTableTd">Доход за месяц</td>
              <td className="incomeReportTableTd">Примечание</td>
            </tr>
          </thead>
          <tbody>
            {incomeList.map(elem => {
              return (
                <tr key={`incomeReport${elem._id}`}>
                  <td className="incomeReportTableTd">{dateLocal(elem.date)}</td>
                  <TdWithText
                    text={elem.incomeFirst}
                    name="incomeFirst"
                    getData={getNewData}
                    elem={elem}
                  />
                  <td className="incomeReportTableTd">
                    {elem.incomeMonth
                      ? Number(elem.incomeMonth).toLocaleString()
                      : (Number(incomeToyal) - Number(elem.incomeFirst)).toLocaleString()}
                  </td>
                  <td className="incomeReportTableTd">{elem.addInfo}</td>
                </tr>
              );
            })}
            {showAddTr && (
              <tr key={`incomeReportNew`}>
                <td className="incomeReportTableTd">{dateLocal(newMonthData.date)}</td>
                <TdWithText
                  text={newMonthData.incomeFirst}
                  name="incomeFirst"
                  getData={getEditText}
                />
                <td className="incomeReportTableTd"></td>
                <td className="incomeReportTableTd"></td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
      <footer className="incomeReportFooter">
        {showBtn && <button onClick={handleClick}>Закрыть месяц</button>}
      </footer>
    </div>
  );
};
