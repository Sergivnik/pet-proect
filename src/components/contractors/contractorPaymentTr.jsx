import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './contractorForm.sass';
import { dateLocal, formatDate } from '../myLib/myLib.js';
import { delDataContractorPayment } from '../../actions/contractorActions';
import { getPdf } from '../../actions/documentAction';
import { TdWithList } from '../myLib/myTd/tdWithList.jsx';
import { TdWithText } from '../myLib/myTd/tdWithText.jsx';
import { editData } from '../../actions/editDataAction.js';

export const ContractorPaymentTr = props => {
  const dispatch = useDispatch();
  const [styleTr, setStyleTr] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const contractorsList = useSelector(state => state.oderReducer.contractorsList);
  let elem = props.paymentData;
  let now = new Date();
  let date = new Date(elem.date);
  useEffect(() => {
    if (date > now) {
      setStyleTr('contrPayBodyTr');
    }
  }, []);
  useEffect(() => {
    if (props.currentId != elem.id) {
      if (date > now) {
        setStyleTr('contrPayBodyTr');
      } else setStyleTr(null);
    }
  }, [props.currentId]);

  const findValueById = id => {
    let value = contractorsList.find(item => item._id == id);
    if (value != undefined) {
      return value.value;
    } else {
      return '';
    }
  };
  const handleClick = e => {
    console.log(elem);
    setStyleTr('driverActiveTr');
    props.getCurrentId(elem.id);

    // Если клик без CTRL, сбрасываем выбор
    if (!e.ctrlKey && props.onCellClick) {
      props.onCellClick(null, e);
    }
  };
  const handleClickDelete = () => {
    dispatch(delDataContractorPayment(elem.id));
  };
  const handleLeftClcik = e => {
    e.preventDefault();
    setStyleTr('driverActiveTr');
    props.getCurrentId(elem.id);
    setShowContextMenu(true);
  };
  const handleClickCreateDoc = () => {
    props.handleAddDoc(elem.id);
    setShowContextMenu(false);
  };
  const handleClickAddDoc = () => {};
  const handleClickPrintDoc = () => {
    dispatch(getPdf(elem.id, 'contractor'));
    setShowContextMenu(false);
  };
  const handleClickDeleteDoc = () => {};
  const callBack = data => {
    console.log(elem, data);
    let newData = { ...elem };
    let textDate = formatDate(elem.date);
    newData.date = textDate;
    newData[data.name] = data.id;
    console.log(newData);
    dispatch(editData(newData, 'contractorspayments'));
  };
  const getNewData = (newValue, name) => {
    console.log(newValue, name);
    let newData = { ...elem };
    let textDate = formatDate(elem.date);
    newData.date = textDate;
    newData[name] = newValue;
    console.log(newData);
    dispatch(editData(newData, 'contractorspayments'));
  };
  useEffect(() => {
    if (props.currentId != props.paymentData.id) {
      setShowContextMenu(false);
    }
  }, [props.currentId]);
  return (
    <tr className={styleTr} onClick={handleClick} onContextMenu={handleLeftClcik}>
      <td className="contrPayBodyTd">{dateLocal(elem.date)}</td>
      <td className="contrPayBodyTd">{findValueById(elem.idContractor)}</td>
      <TdWithText
        text={elem.sum}
        name="sum"
        getData={getNewData}
        elem={elem}
        onCellClick={props.onCellClick}
        paymentId={elem.id}
        isSelected={props.isSelected}
      />
      {/* <td className="contrPayBodyTd">{elem.sum}</td> */}
      <TdWithList
        name="category"
        list={[
          { _id: 1, value: 'Да' },
          { _id: 2, value: 'нет' },
          { _id: 3, value: 'прочее' },
        ]}
        id={elem.category}
        filedId="_id"
        field="value"
        callBack={callBack}
        showChoise={false}
      />
      <td className="contrPayBodyTd">
        {elem.addInfo}
        {styleTr == 'driverActiveTr' && (
          <div className="customerPaymentTrClose" onClick={handleClickDelete}>
            <svg width="20px" height="20px" viewBox="0 0 60 60">
              <g transform="translate(232.000000, 228.000000)">
                <polygon points="-207,-205 -204,-205 -204,-181 -207,-181    " />
                <polygon points="-201,-205 -198,-205 -198,-181 -201,-181    " />
                <polygon points="-195,-205 -192,-205 -192,-181 -195,-181    " />
                <polygon points="-219,-214 -180,-214 -180,-211 -219,-211    " />
                <path d="M-192.6-212.6h-2.8v-3c0-0.9-0.7-1.6-1.6-1.6h-6c-0.9,0-1.6,0.7-1.6,1.6v3h-2.8v-3     c0-2.4,2-4.4,4.4-4.4h6c2.4,0,4.4,2,4.4,4.4V-212.6" />
                <path d="M-191-172.1h-18c-2.4,0-4.5-2-4.7-4.4l-2.8-36l3-0.2l2.8,36c0.1,0.9,0.9,1.6,1.7,1.6h18     c0.9,0,1.7-0.8,1.7-1.6l2.8-36l3,0.2l-2.8,36C-186.5-174-188.6-172.1-191-172.1" />
              </g>
            </svg>
          </div>
        )}
        {showContextMenu && (
          <div className="divContextMenu">
            <p className="pContextMenu" onClick={handleClickCreateDoc}>
              Создать документ
            </p>
            <p className="pContextMenu" onClick={handleClickAddDoc}>
              Добавить документ
            </p>
            <p className="pContextMenu" onClick={handleClickPrintDoc}>
              Печать документ
            </p>
            <p className="pContextMenu" onClick={handleClickDeleteDoc}>
              Удалить документ
            </p>
          </div>
        )}
      </td>
    </tr>
  );
};
