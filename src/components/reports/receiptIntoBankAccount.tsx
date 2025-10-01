import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTripsByDate, getReceiptsByDate } from '../../actions/reportActions.js';
import './reports.sass';

export const ReceiptIntoBankAccount = () => {
  const dispatch = useDispatch();
  const [dateBegin, setDateBegin] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [reportData, setReportData] = useState<
    { id: number; customerName: string; sumIn: number; sumTrips: number }[]
  >([]);


  const handleEnter = (e: any) => {
    if (e.key == 'Enter') {
      const date = new Date(e.currentTarget.value);
      if (e.currentTarget.name == 'dateBegin') setDateBegin(date);
      if (e.currentTarget.name == 'dateEnd') setDateEnd(date);
    }
  };
  const handleBlur = (e: any) => {
    if (e.currentTarget.value != '') {
      const date = new Date(e.currentTarget.value);
      if (e.currentTarget.name == 'dateBegin') setDateBegin(date);
      if (e.currentTarget.name == 'dateEnd') setDateEnd(date);
    }
  };
  const handleDBLClick = (e: any) => {
    e.preventDefault();
    if (e.currentTarget.id == 'dateBegin') setDateBegin(null);
    if (e.currentTarget.id == 'dateEnd') setDateEnd(null);
  };
  const handleClickBtn = () => {
    if (dateBegin == null || dateEnd == null) {
      alert('Выберите даты');
      return;
    }
    dispatch(getTripsByDate(dateBegin, dateEnd));
    dispatch(getReceiptsByDate(dateBegin, dateEnd));
    // Здесь позже можно подставить реальный расчет данных
    setShowReport(true);
    setReportData([]);
  };
  return (
    <div className="divContainer">
      <header className="taxReportHeader">
        <h3 className="taxReportH3">Анализ поступлений</h3>
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
                <td className="taxReportTableHeaderTd">Название клиента</td>
                <td className="taxReportTableHeaderTd">Сумма поступлений</td>
                <td className="taxReportTableHeaderTd">Сумма рейсов</td>
              </tr>
            </thead>
            <tbody>
              {reportData.map(row => (
                <tr key={`receiptTable${row.id}`}>
                  <td className="taxReportTableTd">{row.customerName}</td>
                  <td className="taxReportTableTd">{row.sumIn.toLocaleString()}</td>
                  <td className="taxReportTableTd">{row.sumTrips.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
