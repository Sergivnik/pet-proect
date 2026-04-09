import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VAT } from '../../middlewares/initialState.js';

export const Forecast = () => {
  const ordersList = useSelector(state => state.oderReducer.originOdersList);
  const addDataList = useSelector(state => state.oderReducer.addtable);
  const contractorsPaymentsList = useSelector(state => state.oderReducer.contractorsPayments);

  const [forecastIncome, setForecastIncome] = useState(0);

  const getDayInMonth = month => {
    const now = new Date();
    const isLeapYear = year => {
      if (year % 4 == 0) {
        return true;
      } else {
        return false;
      }
    };
    switch (month) {
      case 0:
        return 31;
      case 1:
        if (isLeapYear(now.getFullYear())) {
          return 29;
        } else {
          return 28;
        }
      case 2:
        return 31;
      case 3:
        return 30;
      case 4:
        return 31;
      case 5:
        return 30;
      case 6:
        return 31;
      case 7:
        return 31;
      case 8:
        return 30;
      case 9:
        return 31;
      case 10:
        return 30;
      case 11:
        return 31;
      default:
        return 0;
    }
  };
  const directIncome = now => {
    let income = 0;
    let lastDate;
    ordersList.forEach(elem => {
      let date = new Date(elem.date);
      let elemYear = date.getFullYear();
      let elemMonth = date.getMonth();
      let nowYear = now.getFullYear();
      let nowMonth = now.getMonth();
      if (elemYear == nowYear && elemMonth == nowMonth) {
        income =
          income + (Number(elem.customerPrice) * 100) / (100 + VAT) - Number(elem.driverPrice);
        if (elem.colorTR == 'hotpink') {
          let addData = addDataList.find(addElem => addElem.orderId == elem._id);
          let addExp = addData
            ? ((Number(elem.customerPrice) - Number(addData.sum)) *
                (100 - Number(addData.interest))) /
              100
            : 0;
          income = income - addExp;
        }
      }
      lastDate = date;
    });
    let dateBegin = new Date(lastDate);
    dateBegin.setFullYear(dateBegin.getFullYear() - 1);
    let sumOPEX = 0;
    contractorsPaymentsList.forEach(elem => {
      let paymentDay = new Date(elem.date);
      if (paymentDay >= dateBegin && paymentDay <= lastDate && elem.category != 3) {
        sumOPEX = sumOPEX + Number(elem.sum);
      }
    });
    sumOPEX = sumOPEX / 12;
    let dayInMonth = getDayInMonth(now.getMonth());
    let curDay = lastDate ? lastDate.getDate() : 0;
    income = (income / curDay) * dayInMonth - sumOPEX;
    console.log(dayInMonth);
    return income;
  };

  const now = new Date();
  //now.setDate(now.getDate() - 3);
  useEffect(() => {
    let income = directIncome(now);
    income = Math.round(income * 100) / 100;
    setForecastIncome(income);
  }, [ordersList, addDataList, contractorsPaymentsList]);

  return (
    <React.Fragment>
      <span>Прогноз {forecastIncome.toLocaleString()}</span>
    </React.Fragment>
  );
};
