import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTripsByDate, getReceiptsByDate } from '../../actions/reportActions.js';
import './reports.sass';

export const ReceiptIntoBankAccount = () => {
  const dispatch = useDispatch();
  const receiptsByDate: any[] = useSelector(
    (state: any) => state.reportReducer?.receiptsByDate || []
  );
  const tripsByDate: any[] = useSelector((state: any) => state.reportReducer?.tripsByDate || []);
  const clientList: any[] = useSelector((state: any) => state.oderReducer?.clientList || []);
  const [dateBegin, setDateBegin] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [reportData, setReportData] = useState<
    { id: number; customerName: string; sumIn: number; sumTrips: number }[]
  >([]);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

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
  useEffect(() => {
    if (!showReport) return;
    const findName = (id: number) => {
      const rec = clientList.find(c => Number(c._id) === Number(id) || Number(c.id) === Number(id));
      return (rec && rec.value) || `Клиент ${id}`;
    };
    const map = new Map<
      number,
      { id: number; customerName: string; sumIn: number; sumTrips: number }
    >();
    receiptsByDate.forEach((row: any) => {
      const id = Number(row.customerId);
      const sumIn = Number(row.sumIn) || 0;
      map.set(id, { id, customerName: findName(id), sumIn, sumTrips: 0 });
    });
    tripsByDate.forEach((row: any) => {
      const id = Number(row.customerId);
      const sumTrips = Number(row.sumTrips) || 0;
      if (map.has(id)) {
        const item = map.get(id)!;
        item.sumTrips = sumTrips;
        map.set(id, item);
      } else {
        map.set(id, { id, customerName: findName(id), sumIn: 0, sumTrips });
      }
    });
    setReportData(Array.from(map.values()));
  }, [receiptsByDate, tripsByDate, showReport, clientList]);
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
                <tr
                  key={`receiptTable${row.id}`}
                  onMouseEnter={() => setHoveredRowId(row.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  onClick={() => setSelectedRowId(row.id)}
                  style={{
                    opacity: hoveredRowId === row.id ? 0.6 : 1,
                    backgroundColor: selectedRowId === row.id ? '#e6f0ff' : 'transparent',
                    cursor: 'pointer',
                    transition: 'opacity 120ms ease, background-color 120ms ease',
                  }}
                >
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
