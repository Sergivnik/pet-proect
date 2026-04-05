import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dateLocal } from '../myLib/myLib.js';
import { addData, editData } from '../../actions/editDataAction.js';
import { TdWithText } from '../myLib/myTd/tdWithText.jsx';
import { editYearConst } from '../../actions/reportActions.js';
import { TAX } from '../../middlewares/initialState.js';

import './reports.sass';

export const IncomeReport = () => {
  const dispatch = useDispatch();

  const VAT = 5;

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
  const [yearVAT, setYearVAT] = useState(null);
  const [paidVAT, setPaidVAT] = useState(0);
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
  const [prepayment, setPrepayment] = useState(yearconst ? yearconst.prePay : null);
  const [showEditPrepayment, setShowEditPrepayment] = useState(false);

  useEffect(() => {
    const firstDateOfYear = new Date(new Date().getFullYear(), 0, 1);
    const orderYearList = ordersList.filter(order => new Date(order.date) >= firstDateOfYear);
    let sumOfVAT = 0;
    orderYearList.forEach(order => {
      sumOfVAT =
        sumOfVAT + Math.round((Number(order.customerPrice) * VAT * 100) / (100 + VAT)) / 100;
    });
    setYearVAT(sumOfVAT);
  }, [ordersList]);
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
    let daysThisYear = Math.ceil((dateEnd.getTime() - dateBegin.getTime()) / (1000 * 3600 * 24));
    let sumIn = 0;
    let sumInWithVAT = 0;
    let sumOut = 0;
    let sumVAT = 0;
    customerPayments.forEach(elem => {
      console.log(elem);
      let date = new Date(elem.date);
      if (date >= dateBegin && date <= dateEnd) {
        sumIn = sumIn + Number(elem.sumOfPayment);
        let checkDateOfOrder = false;
        elem.listOfOders.forEach(orderId => {
          let order = ordersList.find(order => order._id == orderId.id);
          let dateOfOrder = new Date(order.date);
          if (dateOfOrder >= new Date('2026-01-01')) {
            checkDateOfOrder = true;
          }
        });
        if (checkDateOfOrder) {
          sumInWithVAT =
            sumInWithVAT + Math.round((Number(elem.sumOfPayment) * 10000) / (100 + VAT)) / 100;
        } else {
          sumInWithVAT = sumInWithVAT + Math.round(Number(elem.sumOfPayment) * 100) / 100;
        }
      }
    });
    contractorsPayments.forEach(elem => {
      let date = new Date(elem.date);
      if (date >= dateBegin && date <= dateEnd && elem.category == 1) {
        if (Number(elem.sum) > 0) sumOut = sumOut + Number(elem.sum);
        if (Number(elem.sum) < 0) {
          sumIn = sumIn - Number(elem.sum);
          sumInWithVAT = sumInWithVAT - Number(elem.sum);
        }
        if (elem.idContractor === 22) sumVAT = sumVAT + Number(elem.sum);
      }
    });
    setPaidVAT(sumVAT);
    driverpayments.forEach(elem => {
      let date = new Date(elem.date);
      if (date >= dateBegin && date <= dateEnd) {
        sumOut = sumOut + Number(elem.sumOfPayment) - Number(elem.sumOfDebts);
      }
    });
    if (((sumInWithVAT - sumOut) * TAX) / 100 > sumInWithVAT / 100) {
      setCurrentTax(
        ((sumInWithVAT - sumOut) * TAX) / 100 +
          (Number(yearconst.fixedincometax) / 365) * daysThisYear +
          (sumInWithVAT - sumOut) / 100
      );
    } else {
      if (sumInWithVAT > sumOut) {
        let tax =
          sumInWithVAT / 100 +
          (Number(yearconst.fixedincometax) / 365) * daysThisYear +
          (sumInWithVAT - sumOut) / 100;
        setCurrentTax(tax);
      } else {
        let tax =
          sumInWithVAT / 100 +
          (Number(yearconst ? yearconst.fixedincometax : 0) / 365) * daysThisYear;
        setCurrentTax(tax);
      }
    }
  }, [customerPayments, contractorsPayments, driverpayments]);
  useEffect(() => {
    let sumPink = 0;
    addtable.forEach(elem => {
      if (elem.card == 0) {
        let price = Number(ordersList.find(order => order._id == elem.orderId).customerPrice);
        sumPink =
          sumPink +
          Math.round(
            (((price - Number(elem.sum)) / (100 + VAT)) * (100 - Number(elem.interest))) / 100
          ) *
            100;
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
      sumPink +
      paidVAT -
      yearVAT +
      Number(prepayment);
    setIncomeTotal(income);
  }, [sumAccount, customerDebt, driverDebt, yearconst, currentTax, sumPink, paidVAT, yearVAT]);
  useEffect(() => {
    let lastMonthDate = new Date(
      incomeList[incomeList.length - 1] ? incomeList[incomeList.length - 1].date : null
    );
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
    if (e.currentTarget.name == 'prepayment') setPrepayment(e.currentTarget.value);
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
      if (e.currentTarget.name == 'prepayment') {
        dispatch(editYearConst('prePay', prepayment));
        setShowEditPrepayment(false);
      }
    }
  };
  const handleLastYearDebtDblClick = () => {
    setShowEditLastYearTaxDebt(true);
  };
  const handleTaxAdvanceDblClick = () => {
    setShowEditTaxAdvance(true);
  };
  const handlePrepaymentDblClick = () => {
    setShowEditPrepayment(true);
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
          <div className="incomeReportDivWraper" style={{ minWidth: '135px' }}>
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
          <div className="incomeReportDivWraper" style={{ minWidth: '110px' }}>
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
          <div className="incomeReportDivWraper" style={{ minWidth: '135px' }}>
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
              {currentTax
                ? Number(currentTax).toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) + ' руб'
                : null}
            </p>
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">НДС уплаченный с начала года</span>
            <p className="incomeReportP">{paidVAT ? paidVAT.toLocaleString() + ' руб' : null}</p>
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">НДС начисленный с начала года</span>
            <p className="incomeReportP">{yearVAT ? yearVAT.toLocaleString() + ' руб' : null}</p>
          </div>
          <div className="incomeReportDivWraper">
            <span className="incomeReportSpan">Предоплата</span>
            {showEditPrepayment ? (
              <input
                type="number"
                name="prepayment"
                value={prepayment}
                onChange={handleChangeConstInput}
                onKeyDown={handleEnterInput}
              />
            ) : (
              <p className="incomeReportP" onDoubleClick={handlePrepaymentDblClick}>
                {prepayment ? Number(prepayment).toLocaleString() + ' руб' : null}
              </p>
            )}
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
