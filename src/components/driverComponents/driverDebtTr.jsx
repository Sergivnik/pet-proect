import React, { useState } from "react";
import { useSelector } from "react-redux";

export const DriverDebtTr = (props) => {
  const driverList = useSelector((state) => state.oderReducer.driverlist);
  const elem = props.debtData;

  const DateStr = (date) => {
    date = new Date(date);
    return date.toLocaleDateString();
  };
  const getDriverById = (id) => {
      if (driverList.length)
        return driverList.find((driver) => driver._id == id).value;
  };
  return (
    <React.Fragment>
      <tr className="driverDebtMainTd">
        <td className="driverDebtMainTr">{DateStr(elem.date)}</td>
        <td className="driverDebtMainTr">{getDriverById(elem.idDriver)}</td>
        <td className="driverDebtMainTr">{elem.category}</td>
        <td className="driverDebtMainTr">{elem.sumOfDebt}</td>
        <td className="driverDebtMainTr">{elem.addInfo}</td>
        <td className="driverDebtMainTr">{elem.debtClosed}</td>
      </tr>
    </React.Fragment>
  );
};