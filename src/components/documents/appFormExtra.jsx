import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { AppForm } from './appForm.jsx';
import { findValueBy_Id, dateLocal } from '../myLib/myLib.js';
import { createApp, getPdf } from '../../actions/documentAction.js';
import { saveReportPdf, getReportPdf } from '../../actions/reportActions.js';
import './billsForm.sass';

export const AppFormExtra = ({ id, orderId, isLogistApp, order }) => {
  const dispatch = useDispatch();
  const ordersList = useSelector(state => state.oderReducer.originOdersList);
  const clientList = useSelector(state => state.oderReducer.clientList);
  const requestStatus = useSelector(state => state.reportReducer.requestStatus);

  const currentOrder = order || findValueBy_Id(id, ordersList);
  const customer = findValueBy_Id(currentOrder.idCustomer, clientList).value;
  const orderDate = new Date(currentOrder.date);
  const year = orderDate.getFullYear();

  const [stamp, setStamp] = useState(true);
  const [driverApp, setDriverApp] = useState(false);
  const [appEditData, setAppEditData] = useState({});
  const [nameBtn, setNameBtn] = useState('Сохранить');
  const [isPressedSave, setIsPressedSave] = useState(false);

  const getEditData = useCallback(editData => {
    setAppEditData(editData);
  }, []);

  const handleClickStamp = useCallback(() => {
    setStamp(prev => !prev);
    setNameBtn('Сохранить');
    setIsPressedSave(false);
  }, []);

  const handleClickDriverApp = useCallback(() => {
    setDriverApp(prev => !prev);
    setNameBtn('Сохранить');
    setIsPressedSave(false);
  }, []);

  const handleSave = useCallback(() => {
    const htmlDoc = document.querySelector('.applicationForm');
    const appTitle = `${id} от ${dateLocal(appEditData.appDate)}`;

    if (!orderId) {
      if (isLogistApp) {
        if (nameBtn === 'Сохранить') {
          dispatch(saveReportPdf(htmlDoc.innerHTML));
        } else {
          dispatch(getReportPdf());
        }
      } else {
        if (nameBtn === 'Сохранить') {
          dispatch(createApp(htmlDoc.innerHTML, id, year, customer, appTitle));
        } else {
          dispatch(getPdf(orderId, 'app'));
        }
      }
    } else {
      if (nameBtn === 'Сохранить') {
        const orderDate = new Date(order.date);
        const year = orderDate.getFullYear();
        const customer = findValueBy_Id(order.idCustomer, clientList).value;
        dispatch(createApp(htmlDoc.innerHTML, orderId, year, customer, appTitle));
      } else {
        dispatch(getPdf(orderId, 'app'));
      }
    }
    setIsPressedSave(true);
  }, [
    dispatch,
    id,
    orderId,
    isLogistApp,
    nameBtn,
    year,
    customer,
    appEditData.appDate,
    order,
    clientList,
  ]);

  useEffect(() => {
    if (requestStatus === null && nameBtn === 'Сохранить' && isPressedSave) {
      setNameBtn('Печать');
    }
  }, [requestStatus, nameBtn, isPressedSave]);

  return (
    <div className="appFormExtraContaiter">
      <header className="appFormExtraHeader">
        <label className="appFormExtraLabel">
          <span className="appFormExtraSpan">Печать</span>
          <input type="checkbox" onChange={handleClickStamp} checked={stamp} />
        </label>
        <label className="appFormExtraLabel">
          <span className="appFormExtraSpan">Заявка Перевозчику</span>
          <input type="checkbox" onChange={handleClickDriverApp} checked={driverApp} />
        </label>
        <button className="appFormExtraBtn" onClick={handleSave}>
          {nameBtn}
        </button>
      </header>
      <main className="appFormExtraMain">
        <div className="applicationForm">
          <AppForm
            dataDoc={{ number: null, odersListId: [id] }}
            id={1}
            stamp={stamp}
            getEditData={getEditData}
            driverApp={driverApp}
            isLogistApp={isLogistApp}
          />
        </div>
        {requestStatus && <div className="divSaving">Saving...</div>}
      </main>
    </div>
  );
};

AppFormExtra.propTypes = {
  id: PropTypes.string.isRequired,
  orderId: PropTypes.string,
  isLogistApp: PropTypes.bool,
  order: PropTypes.shape({
    date: PropTypes.string.isRequired,
    idCustomer: PropTypes.string.isRequired,
  }),
};

AppFormExtra.defaultProps = {
  orderId: undefined,
  isLogistApp: false,
  order: null,
};
