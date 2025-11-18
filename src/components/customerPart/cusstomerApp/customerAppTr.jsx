import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TdPoinWithToolTip } from '../../myLib/tdPointWithToolTip/tdPointWithToolTip.jsx';
import { TdDate } from '../../userTd/tdDate.jsx';
import { TdCustomer } from '../../userTd/tdCustomer.jsx';
import './customerApps.sass';

export const CustomerAppTr = props => {
  let elem = props.elem;
  const citiesList = useSelector(state => state.oderReducer.citieslist);

  const [loadingList, setLoadingList] = useState([]);
  const [loadingInfo, setLoadingInfo] = useState([]);
  const [unLoadingList, setUnloadingList] = useState([]);
  const [unloadingInfo, setUnloadingInfo] = useState([]);
  const [styleTr, setStyleTr] = useState('trWhite');

  useEffect(() => {
    let arrCityId = elem.idLoadingPoint;
    let arrCityName = [];
    arrCityId.forEach(pointId => {
      arrCityName.push(citiesList.find(city => pointId == city._id).value);
    });
    setLoadingList(arrCityName);
    setLoadingInfo(elem.loadingInfo);
    arrCityId = elem.idUnloadingPoint;
    arrCityName = [];
    arrCityId.forEach(pointId => {
      arrCityName.push(citiesList.find(city => pointId == city._id).value);
    });
    setUnloadingList(arrCityName);
    setUnloadingInfo(elem.unloadingInfo);
  }, [elem]);
  useEffect(() => {
    if (props.currentId == elem._id) {
      setStyleTr('trGrey');
    } else {
      setStyleTr('trWhite');
    }
  }, [props.currentId]);

  const handleClickTr = () => {
    props.getId(elem._id);
  };
  const handleDblClick = e => {
    e.preventDefault();
    props.dubleClick();
  };
  const preventDefaultDBL = e => {
    e.preventDefault();
  };
  return (
    <tr className={styleTr} onClick={handleClickTr} onDoubleClick={handleDblClick}>
      <TdCustomer idCustomer={elem.customerId} idManager={elem.idManager} />
      <TdDate date={elem.dateOfApp} />
      <TdPoinWithToolTip pointsList={loadingList} pointInfoList={loadingInfo} />
      <TdPoinWithToolTip pointsList={unLoadingList} pointInfoList={unloadingInfo} />
      <td className="customerAppBodyTd" onMouseDown={preventDefaultDBL}>
        {elem.customerPrice ? Number(elem.customerPrice).toLocaleString() : null}
      </td>
      <td className="customerAppBodyTd">{elem.orderId ? 'привязан' : ''}</td>
      <td className="customerAppBodyTd">{elem.applicationNumber ? elem.applicationNumber : ''}</td>
    </tr>
  );
};
