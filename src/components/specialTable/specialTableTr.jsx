import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editAddData, deleteAddData } from '../../actions/specialAction';
import { dateLocal, findValueBy_Id } from '../myLib/myLib.js';
import { TdWithList } from '../myLib/myTd/tdWithList.jsx';
import { VAT } from '../../middlewares/initialState.js';
import './specialTable.sass';

export const SpecialTableTr = props => {
  const dispatch = useDispatch();
  const elem = props.elem;
  const customers = useSelector(state => state.oderReducer.clientList);
  const odersList = useSelector(state => state.oderReducer.originOdersList);
  const orderPrice = findValueBy_Id(elem.orderId, odersList).customerPrice;

  const yesNoList = [
    { _id: 0, value: 'нет' },
    { _id: 1, value: 'Ок' },
  ];

  const [addData, setAddData] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [classTr, setClassTr] = useState('');
  const [classTd, setClassTd] = useState('specialTableBodyTd');
  const [withVAT, setwithVAT] = useState(false);
  const [sum, setSum] = useState(null);

  useEffect(() => {
    setAddData(elem);
  }, [elem]);

  useEffect(() => {
    if (withVAT) {
      setSum(
        (((Number(orderPrice) - Number(elem.sum)) / (1 + VAT / 100)) *
          (100 - Number(elem.interest))) /
          100
      );
    } else {
      setSum(((Number(orderPrice) - Number(elem.sum)) * (100 - Number(elem.interest))) / 100);
    }
  }, [withVAT]);

  useEffect(() => {
    const order = odersList.find(order => order._id == elem.orderId);
    if (order) setwithVAT(new Date(order.date) >= new Date('2026-01-01'));
  }, [elem]);

  useEffect(() => {
    if (props.currentId == elem.id) {
      setShowDelete(true);
      setClassTr('specialClassTr');
    } else {
      setShowDelete(false);
      setClassTr('');
    }
  }, [props.currentId]);
  useEffect(() => {
    if (!props.isCtrl) {
      setClassTd('specialTableBodyTd');
    }
  }, [props.isCtrl]);

  const callBack = data => {
    let { ...obj } = addData;
    if (data.name == 'customer') {
      obj.customerId = data.id;
    }
    if (data.name == 'safe') {
      obj.safe = data.id;
    }
    if (data.name == 'card') {
      obj.card = data.id;
    }
    if (data.name == 'customerPayment') {
      obj.customerPayment = data.id;
    }
    if (data.name == 'returnPayment') {
      let now = new Date();
      obj.returnPayment = data.id;
      if (data.id == 1) {
        obj.date = now;
      } else {
        obj.date = null;
      }
    }
    setAddData(obj);
    dispatch(editAddData(obj));
  };

  const handleClicktr = () => {
    props.getCurrentId(elem.id);
  };
  const handleClickDelete = () => {
    let check = confirm('Are you sure?');
    if (check) dispatch(deleteAddData(props.currentId));
  };
  const handleClickSum = e => {
    if (e.ctrlKey) {
      e.stopPropagation();
      if (classTd == 'specialTableBodyTd') {
        props.getSum(sum, true);
        setClassTd('specialTableBodyTd specialClassTd');
      } else {
        props.getSum(-sum, true);
        setClassTd('specialTableBodyTd');
      }
    } else {
      props.getSum(0, false);
      setClassTd('specialTableBodyTd');
    }
  };

  return (
    <tr className={classTr} onClick={handleClicktr}>
      <TdWithList
        name="customer"
        list={customers}
        id={addData.customerId}
        filedId="_id"
        field="value"
        callBack={callBack}
        showChoise={false}
      />
      <td className={classTd} onClick={handleClickSum}>
        {Number(sum).toFixed(2)}
      </td>
      <TdWithList
        name="safe"
        list={yesNoList}
        id={addData.safe}
        filedId="_id"
        field="value"
        callBack={callBack}
        showChoise={true}
      />
      <TdWithList
        name="card"
        list={yesNoList}
        id={addData.card}
        filedId="_id"
        field="value"
        callBack={callBack}
        showChoise={true}
      />
      <td className="specialTableBodyTd">
        {findValueBy_Id(elem.orderId, odersList).accountNumber}
      </td>
      <td className="specialTableBodyTd">
        {dateLocal(findValueBy_Id(elem.orderId, odersList).date)}
      </td>
      <TdWithList
        name="customerPayment"
        list={yesNoList}
        id={addData.customerPayment}
        filedId="_id"
        field="value"
        callBack={callBack}
        showChoise={true}
      />
      <TdWithList
        name="returnPayment"
        list={yesNoList}
        id={addData.returnPayment}
        filedId="_id"
        field="value"
        callBack={callBack}
        showChoise={true}
      />
      <td className="specialTableBodyTd">
        {dateLocal(addData.date)}
        {showDelete && (
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
      </td>
    </tr>
  );
};
