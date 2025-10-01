import React, { useState } from 'react';
import { DriverReport } from './driverReport.jsx';
import { ReconciliationAct } from './reconciliationAct.jsx';
import { TaxesDriver } from './taxesReport.jsx';
import { IncomeReport } from './incomeReport.jsx';
import { CardReport } from './cardReport.tsx';
import { ReceiptIntoBankAccount } from './receiptIntoBankAccount.tsx';

import './reports.sass';

export const Report = () => {
  const [currentReport, setCurrentReport] = useState(null);

  const handleClickBtnMenu = e => {
    let btnName = e.currentTarget.name;
    switch (btnName) {
      case 'drivers':
        setCurrentReport(<DriverReport />);
        break;
      case 'reconciliationAct':
        setCurrentReport(<ReconciliationAct />);
        break;
      case 'taxesReport':
        setCurrentReport(<TaxesDriver />);
        break;
      case 'incomeReport':
        setCurrentReport(<IncomeReport />);
        break;
      case 'cardReport':
        setCurrentReport(<CardReport />);
        break;
      case 'receiptIntoBankAccount':
        setCurrentReport(<ReceiptIntoBankAccount />);
        break;
      default:
        break;
    }
  };
  return (
    <div className="mainReportForm">
      <header className="headerReportForm">
        <button name="drivers" className="headerReportBtn" onClick={handleClickBtnMenu}>
          Отчет по водителям
        </button>
        <button name="reconciliationAct" className="headerReportBtn" onClick={handleClickBtnMenu}>
          Акт сверки с заказчиком
        </button>
        <button name="taxesReport" className="headerReportBtn" onClick={handleClickBtnMenu}>
          Отчет по УСН
        </button>
        <button name="incomeReport" className="headerReportBtn" onClick={handleClickBtnMenu}>
          Отчет по доходам
        </button>
        <button name="cardReport" className="headerReportBtn" onClick={handleClickBtnMenu}>
          Карта
        </button>
        <button
          name="receiptIntoBankAccount"
          className="headerReportBtn"
          onClick={handleClickBtnMenu}
        >
          Анализ поступлений
        </button>
      </header>
      <main className="reportTable">{currentReport}</main>
    </div>
  );
};
