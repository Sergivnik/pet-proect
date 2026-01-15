import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDataDriverDebt } from '../../actions/driverActions.js';
import { makeCardPayment } from '../../actions/cardAction.js';
import { dateLocal, findValueBy_Id } from '../myLib/myLib.js';
import { TdSum } from './tdSum.tsx';
import { VAT } from '../../middlewares/initialState.js';

import './reports.sass';

type Category = 'Топливо' | 'Проценты' | 'Пинк' | 'Аванс' | 'Прочее';

type DebtClosed = 'Ок' | 'нет' | 'частично';

interface Debt {
  id: number;
  date: string;
  idDriver: number;
  category: Category;
  sumOfDebt: number;
  debtClosed: DebtClosed;
  addInfo: string;
  paidPartOfDebt: number;
  card: boolean;
}

interface CustomerAddDebt {
  id: number;
  customerId: number;
  sum: number;
  safe: boolean;
  card: boolean;
  orderId: number;
  customerPayment: boolean;
  returnPayment: boolean;
  date: string;
  interest: number;
}

interface Driver {
  id: number;
  value: string;
  phone: string;
  companyName: string;
  TIN: string;
  address: string;
  currentAccount: string;
  contract: string;
  active: boolean;
  addInfo: string;
}

interface cardTransaction {
  driverDebtsId: number[];
  customerDebtsId: number[];
}
export const CardReport = () => {
  const dispatch: any = useDispatch();

  const driverDebtCard: Debt[] = useSelector((state: any) => state.oderReducer.driverDebtList);
  const customerDebtCard: CustomerAddDebt[] = useSelector(
    (state: any) => state.oderReducer.addtable
  );
  const driverList: Driver[] = useSelector((state: any) => state.oderReducer.driverlist);
  const customerList: Driver[] = useSelector((state: any) => state.oderReducer.clientList);
  const orderList: any = useSelector((state: any) => state.oderReducer.originOdersList);

  const [unReturnedDebt, setUnReturnedDebt] = useState<Debt[] | null>(null);
  const [unClosedCustomerDebt, setUnClosedCustomerDebt] = useState<CustomerAddDebt[] | null>(null);
  const [choiseSum, setChoisenSum] = useState<number>(0);
  const [isCtrl, setIsCtrl] = useState<boolean>(false);
  const [isCardChecked, setIsCardChecked] = useState<boolean>(true);
  const [cardTransaction, setCardTransaction] = useState<cardTransaction>({
    driverDebtsId: [],
    customerDebtsId: [],
  });
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [sumSelected, setSumSelected] = useState<number>(0);

  const tableRef = useRef<HTMLDivElement>(null);

  const setStyle = (typeOfDebt: string, id: number) => {
    if (typeOfDebt === 'driver') {
      let arr: number[] = cardTransaction.driverDebtsId;
      if (arr.includes(id)) {
        return 'markedTr';
      } else return '';
    }
    if (typeOfDebt === 'customer') {
      let arr: number[] = cardTransaction.customerDebtsId;
      if (arr.includes(id)) {
        return 'markedTr';
      } else return '';
    }
  };

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [driverDebtCard, customerDebtCard]);

  useEffect(() => {
    dispatch(getDataDriverDebt());
  }, [dispatch]);

  useEffect(() => {
    let unReturnedDebt: Debt[] = driverDebtCard.filter(
      (debt: Debt) => debt.card == false || debt.debtClosed != 'Ок'
    );
    let unClosedCustomerDebt: CustomerAddDebt[] = customerDebtCard.filter(
      (debt: CustomerAddDebt) =>
        debt.safe == false ||
        debt.card == false ||
        debt.customerPayment == false ||
        debt.returnPayment == false
    );
    setUnReturnedDebt(unReturnedDebt);
    setUnClosedCustomerDebt(unClosedCustomerDebt);
  }, [driverDebtCard, customerDebtCard]);

  useEffect(() => {
    if (cardTransaction.driverDebtsId.length || cardTransaction.customerDebtsId.length) {
      setIsSelected(true);
      let sumToCard: number = 0;
      let arrDriver: number[] = cardTransaction.driverDebtsId;
      let arrCustomer: number[] = cardTransaction.customerDebtsId;
      unReturnedDebt.map(debt => {
        if (arrDriver.includes(debt.id)) {
          sumToCard = sumToCard + Number(debt.sumOfDebt);
        }
      });
      unClosedCustomerDebt.map((debt: CustomerAddDebt) => {
        if (arrCustomer.includes(debt.id)) {
          let order: any = orderList.find((order: any) => order._id == debt.orderId);
          let sumOfdebt: number = updateVATByDate(order.date)
            ? ((order.customerPrice - debt.sum) * (100 - debt.interest)) / (100 + VAT)
            : ((order.customerPrice - debt.sum) * (100 - debt.interest)) / 100;
          sumToCard = sumToCard + sumOfdebt;
        }
      });
      setSumSelected(sumToCard);
    } else setIsSelected(false);
  }, [cardTransaction]);

  const handleClickSumm = (sum: number) => {
    setChoisenSum(choiseSum + sum);
  };
  const handleClickDiv = (e: any) => {
    let nameElem = e.target.getAttribute('data-name');
    if (nameElem != 'sumTd') {
      setChoisenSum(0);
      setIsCtrl(false);
    } else {
      setIsCtrl(true);
    }
  };
  const handleClickCardChecked = () => {
    setIsCardChecked(!isCardChecked);
    if (isCardChecked) {
      let unReturnedDebt: Debt[] = driverDebtCard.filter((debt: Debt) => debt.card == false);
      let unClosedCustomerDebt: CustomerAddDebt[] = customerDebtCard.filter(
        (debt: CustomerAddDebt) => debt.card == false
      );
      setUnReturnedDebt(unReturnedDebt);
      setUnClosedCustomerDebt(unClosedCustomerDebt);
    } else {
      let unReturnedDebt: Debt[] = driverDebtCard.filter(
        (debt: Debt) => debt.card == false || debt.debtClosed != 'Ок'
      );
      let unClosedCustomerDebt: CustomerAddDebt[] = customerDebtCard.filter(
        (debt: CustomerAddDebt) =>
          debt.safe == false ||
          debt.card == false ||
          debt.customerPayment == false ||
          debt.returnPayment == false
      );
      setUnReturnedDebt(unReturnedDebt);
      setUnClosedCustomerDebt(unClosedCustomerDebt);
    }
  };
  const handleClickCardDebt = (e: any, typeOfDebt: string, id: number, card: boolean) => {
    if (!e.ctrlKey) {
      if (typeOfDebt === 'driver' && !card) {
        let arr: number[] = cardTransaction.driverDebtsId;
        if (arr.includes(id)) {
          let index: number = arr.findIndex((debtId: number) => debtId == id);
          arr.splice(index, 1);
        } else {
          arr.push(id);
        }
        setCardTransaction({
          driverDebtsId: arr,
          customerDebtsId: cardTransaction.customerDebtsId,
        });
      }
      if (typeOfDebt === 'customer' && !card) {
        let arr: number[] = cardTransaction.customerDebtsId;
        if (arr.includes(id)) {
          let index: number = arr.findIndex((debtId: number) => debtId == id);
          arr.splice(index, 1);
        } else {
          arr.push(id);
        }
        setCardTransaction({
          driverDebtsId: cardTransaction.driverDebtsId,
          customerDebtsId: arr,
        });
      }
    }
  };
  const handleClickBtn = () => {
    console.log(cardTransaction);
    dispatch(makeCardPayment(cardTransaction));
  };
  const updateVATByDate = (date: string | Date) => {
    if (date) {
      const orderDate = typeof date === 'string' ? new Date(date) : date;
      const thresholdDate = new Date('2026-01-01');
      return orderDate >= thresholdDate;
    } else {
      return false;
    }
  };

  return (
    <div className="mainCardReportForm" onClick={handleClickDiv}>
      <header className="mainReportFormHeader">
        <label>
          На карту
          <input type="checkBox" checked={isCardChecked} onChange={handleClickCardChecked} />
        </label>
        {isSelected && (
          <div className="cardReportTransactionWrap">
            <p className="cardReportSumP">К переводу на карту {sumSelected}</p>
            <button className="cardRepornTransactionBtn" onClick={handleClickBtn}>
              Провести
            </button>
          </div>
        )}
        <p className="cardReportSumP">{choiseSum}</p>
      </header>
      <div className="tableWrapper" ref={tableRef}>
        <table className="cardReportTable">
          <thead className="cardReportThead">
            <tr>
              <td className="cardReportTd">Дата</td>
              <td className="cardReportTd">Водитель</td>
              <td className="cardReportTd">Категория</td>
              <td className="cardReportTd">Сумма</td>
              <td className="cardReportTd">Долг закрыт</td>
              <td className="cardReportTd">Примечание</td>
              <td className="cardReportTd">Остаток долга</td>
              <td className="cardReportTd">Карта</td>
            </tr>
          </thead>
          <tbody>
            {unReturnedDebt
              ? unReturnedDebt.map((debt: Debt) => {
                  return (
                    <tr
                      key={`driverDebt${debt.id}`}
                      className={setStyle('driver', debt.id)}
                      onClick={e => handleClickCardDebt(e, 'driver', debt.id, debt.card)}
                    >
                      <td className="cardReportTd">{debt ? dateLocal(debt.date) : null}</td>
                      <td className="cardReportTd">
                        {debt ? findValueBy_Id(debt.idDriver, driverList).value : null}
                      </td>
                      <td className="cardReportTd">{debt ? debt.category : null}</td>
                      <TdSum
                        sum={debt ? debt.sumOfDebt : null}
                        isCtrl={isCtrl}
                        handleClickSumm={handleClickSumm}
                      />
                      <td className="cardReportTd">{debt ? debt.debtClosed : null}</td>
                      <td className="cardReportTd">{debt ? debt.addInfo : null}</td>
                      <td className="cardReportTd">
                        {debt.paidPartOfDebt ? debt.paidPartOfDebt : '0.00'}
                      </td>
                      <td className="cardReportTd">{debt ? (debt.card ? 'Ок' : 'нет') : null}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
        <table className="cardReportTable">
          <thead className="cardReportThead">
            <tr>
              <td className="cardReportTd">Клиент</td>
              <td className="cardReportTd">Сумма</td>
              <td className="cardReportTd">Сейф</td>
              <td className="cardReportTd">Карта</td>
              <td className="cardReportTd">Оплата заказа</td>
              <td className="cardReportTd">Оплата клиенту</td>
              <td className="cardReportTd">Дата оплаты</td>
            </tr>
          </thead>
          <tbody>
            {unClosedCustomerDebt
              ? unClosedCustomerDebt.map((debt: CustomerAddDebt) => {
                  let order: any = orderList.find((order: any) => order._id == debt.orderId);
                  let sumOfdebt: number = updateVATByDate(order.date)
                    ? (((order.customerPrice - debt.sum) / (1 + VAT / 100)) *
                        (100 - debt.interest)) /
                      100
                    : ((order.customerPrice - debt.sum) * (100 - debt.interest)) / 100;
                  return (
                    <tr
                      key={`customerDebt${debt.id}`}
                      className={setStyle('customer', debt.id)}
                      onClick={e => handleClickCardDebt(e, 'customer', debt.id, debt.card)}
                    >
                      <td className="cardReportTd">
                        {debt ? findValueBy_Id(debt.customerId, customerList).value : null}
                      </td>
                      <TdSum sum={sumOfdebt} isCtrl={isCtrl} handleClickSumm={handleClickSumm} />
                      <td className="cardReportTd">{debt ? (debt.safe ? 'Ок' : 'нет') : null}</td>
                      <td className="cardReportTd">{debt ? (debt.card ? 'Ок' : 'нет') : null}</td>
                      <td className="cardReportTd">
                        {debt ? (debt.customerPayment ? 'Ок' : 'нет') : null}
                      </td>
                      <td className="cardReportTd">
                        {debt ? (debt.returnPayment ? 'Ок' : 'нет') : null}
                      </td>
                      <td className="cardReportTd">{debt ? dateLocal(debt.date) : null}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};
