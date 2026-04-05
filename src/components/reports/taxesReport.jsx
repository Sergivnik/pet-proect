import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { findValueBy_Id } from '../myLib/myLib';
import { TAX } from '../../middlewares/initialState.js';
import { VAT } from '../../middlewares/initialState.js';
import './reports.sass';
import { log } from 'three/src/utils.js';

export const TaxesDriver = () => {
  const customerPayments = useSelector(state => state.oderReducer.customerPaymentsList);
  const contractorsPayments = useSelector(state => state.oderReducer.contractorsPayments);
  const driverpayments = useSelector(state => state.oderReducer.driverpayments);
  const driverlist = useSelector(state => state.oderReducer.driverlist);
  const clientList = useSelector(state => state.oderReducer.clientList);
  const contractorsList = useSelector(state => state.oderReducer.contractorsList);
  const ordersList = useSelector(state => state.oderReducer.odersList);

  const [dateBegin, setDateBegin] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summIn, setSumIn] = useState(0);
  const [summOut, setSumOut] = useState(0);

  const handleEnter = e => {
    if (e.key == 'Enter') {
      let date = new Date(e.currentTarget.value);
      if (e.currentTarget.name == 'dateBegin') setDateBegin(date);
      if (e.currentTarget.name == 'dateEnd') setDateEnd(date);
    }
  };
  const handleBlur = e => {
    if (e.currentTarget.value != '') {
      let date = new Date(e.currentTarget.value);
      if (e.currentTarget.name == 'dateBegin') setDateBegin(date);
      if (e.currentTarget.name == 'dateEnd') setDateEnd(date);
    }
  };
  const handleDBLClick = e => {
    e.preventDefault();
    console.log(e);
    if (e.currentTarget.id == 'dateBegin') setDateBegin(null);
    if (e.currentTarget.id == 'dateEnd') setDateEnd(null);
  };
  const handleClickBtn = () => {
    if (dateBegin != null && dateEnd != null) {
      let arr = [];
      let index = 0;
      const border = new Date('2026-01-01');
      let isPayWithVAT;
      customerPayments.forEach(elem => {
        let date = new Date(elem.date);
        if (date >= dateBegin && date <= dateEnd) {
          let allBeforeBorder = elem.listOfOders.every(listOfOders => {
            let order = ordersList.find(order => order._id == listOfOders.id);
            if (new Date(order.date) < border) {
              return true;
            }
          });
          let allAfterBorder = elem.listOfOders.every(listOfOders => {
            let order = ordersList.find(order => order._id == listOfOders.id);
            if (new Date(order.date) >= border) {
              return true;
            }
          });
          if (!allBeforeBorder && !allAfterBorder) {
            alert('Есть заказы и до, и после 01.01.2026 — проверь данные');
            return; // прерываем текущий элемент
          }
          if (allBeforeBorder) isPayWithVAT = false;
          if (allAfterBorder) isPayWithVAT = true;
          arr.push({
            id: index++,
            date: date,
            counterparty: findValueBy_Id(elem.idCustomer, clientList).companyName,
            sumIn: isPayWithVAT
              ? Math.round((elem.sumOfPayment / (100 + VAT)) * 100 * 100) / 100
              : elem.sumOfPayment,
            sumOut: null,
          });
        }
      });
      contractorsPayments.forEach(elem => {
        let date = new Date(elem.date);
        if (date >= dateBegin && date <= dateEnd && elem.category == 1) {
          arr.push({
            id: index++,
            date: date,
            counterparty: findValueBy_Id(elem.idContractor, contractorsList).value,
            sumIn: elem.sum < 0 ? elem.sum * -1 : null,
            sumOut: elem.sum > 0 ? elem.sum : null,
          });
        }
      });
      driverpayments.forEach(elem => {
        let date = new Date(elem.date);
        if (date >= dateBegin && date <= dateEnd) {
          arr.push({
            id: index++,
            date: date,
            counterparty: findValueBy_Id(elem.idDriver, driverlist).companyName,
            sumIn: null,
            sumOut: elem.sumOfPayment - elem.sumOfDebts,
          });
        }
      });
      let sumArrIn = 0;
      let sumArrOut = 0;
      arr.forEach(elem => {
        sumArrIn = sumArrIn + Number(elem.sumIn);
        sumArrOut = sumArrOut + Number(elem.sumOut);
      });
      arr.sort((a, b) => {
        let aDate = new Date(a.date);
        let bDate = new Date(b.date);
        if (aDate > bDate) return 1;
        if (aDate == bDate) return 0;
        if (aDate < bDate) return -1;
      });
      console.log(arr);
      setReportData(arr);
      setSumIn(sumArrIn);
      setSumOut(sumArrOut);
      setShowReport(true);
    }
  };

  useEffect(() => {
    let div = document.querySelector('.taxReportMainDiv');
    div.scrollTop = div.scrollHeight;
  }, [reportData]);

  return (
    <div className="divContainer">
      <header className="taxReportHeader">
        <h3 className="taxReportH3">Отчет по УСН</h3>
        <div className="taxReportHeaderDiv">
          <span>Дата с </span>
          {dateBegin == null ? (
            <div>
              <input name="dateBegin" type="date" onKeyDown={handleEnter} onBlur={handleBlur} />
            </div>
          ) : (
            <span
              id="dateBegin"
              onDoubleClick={handleDBLClick}
              onMouseDown={e => {
                e.preventDefault();
                return false;
              }}
            >
              {dateBegin.toLocaleDateString()}
            </span>
          )}
          <span>по </span>
          {dateEnd == null ? (
            <div>
              <input name="dateEnd" type="date" onKeyDown={handleEnter} onBlur={handleBlur} />
            </div>
          ) : (
            <span
              id="dateEnd"
              onDoubleClick={handleDBLClick}
              onMouseDown={e => {
                e.preventDefault();
                return false;
              }}
            >
              {dateEnd.toLocaleDateString()}
            </span>
          )}
          <button onClick={handleClickBtn}>Сформировать</button>
        </div>
      </header>
      <div className="taxReportMainDiv">
        {showReport && (
          <table className="taxReportTable">
            <thead className="taxReportTableHeader">
              <tr>
                <td className="taxReportTableHeaderTd">Дата</td>
                <td className="taxReportTableHeaderTd">Контрагент</td>
                <td className="taxReportTableHeaderTd">Приход</td>
                <td className="taxReportTableHeaderTd">Расход</td>
              </tr>
            </thead>
            <tbody>
              {reportData.map(elem => {
                return (
                  <tr key={`taxReport${elem.id}`}>
                    <td className="taxReportTableTd">{elem.date.toLocaleDateString()}</td>
                    <td className="taxReportTableTd">{elem.counterparty}</td>
                    <td className="taxReportTableTd">
                      {elem.sumIn ? elem.sumIn.toLocaleString() : null}
                    </td>
                    <td className="taxReportTableTd">
                      {elem.sumOut ? elem.sumOut.toLocaleString() : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td>{summIn ? summIn.toLocaleString() : null}</td>
                <td>{summOut ? summOut.toLocaleString() : null}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};
