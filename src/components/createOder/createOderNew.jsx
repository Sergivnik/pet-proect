import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import { PointsForm } from './pointsForm.jsx';
import { addOder, addOrderApp, editOderNew } from '../../actions/oderActions.js';
import { dateLocal, findValueBy_Id } from '../myLib/myLib.js';
import { InputText } from '../myLib/inputText.jsx';
import { VAT } from '../../middlewares/initialState.js';
import './createOder.sass';

export const CreateOderNew = props => {
  const driverlist = useSelector(state => state.oderReducer.driverlist);
  const clientList = useSelector(state => state.oderReducer.clientList);
  const orderList = useSelector(state => state.oderReducer.originOdersList);
  const clientManagerFull = useSelector(state => state.oderReducer.clientmanager);
  const trackdriversFull = useSelector(state => state.oderReducer.trackdrivers);
  const pointList = useSelector(state => state.oderReducer.citieslist);
  const tracksFull = useSelector(state => state.oderReducer.tracklist);
  const addtable = useSelector(state => state.oderReducer.addtable);
  const dispatch = useDispatch();

  const [mainDivStyle, setMainDivStyle] = useState('crOderMainDiv');

  const [odersData, setOdersData] = useState({
    date: '',
    idLoadingPoint: [],
    idUnloadingPoint: [],
    valueLoadingPoint: [],
    valueUnloadingPoint: [],
    loadingInfo: [],
    unloadingInfo: [],
    price: 0,
    interest: 10,
    customerPriceNohVAT: '',
    applicationNumber: '',
    customerPrice: '',
    customerPriceWithVAT: '',
    driverPrice: '',
  });

  const [clientManager, setClientManager] = useState(clientManagerFull);
  const [trackdrivers, setTrackdrivers] = useState(trackdriversFull);
  const [tracks, setTracks] = useState(tracksFull);
  const [showDateInput, setShowDateInput] = useState(true);
  const [showClientInput, setShowClientInput] = useState(true);
  const [showManagerInput, setShowManagerInput] = useState(true);
  const [showAppInput, setShowAppInput] = useState(true);
  const [showClientPrice, setShowClientPrice] = useState(true);
  const [showOwnerInput, setShowOwnerInput] = useState(true);
  const [showTrackDriverInput, setShowTrackDriverInput] = useState(true);
  const [showTrackInput, setShowTrackInput] = useState(true);
  const [showDriverPrice, setShowDriverPrice] = useState(true);
  const [checkBox, setCheckBox] = useState(false);
  const [checkPayment, setCheckPayment] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [btnName, setBtnName] = useState('Добавить');
  const [showAddFields, setShowAddFields] = useState(false);
  const [debtOfCustomer, setDebtOfCustomer] = useState(null);
  const [limit, setLimit] = useState(null);
  const [isCustomerActive, setIsCustomerActive] = useState(true);
  const [withVAT, setWithVAT] = useState(false);

  const updateVATByDate = date => {
    if (date) {
      const orderDate = new Date(date);
      const thresholdDate = new Date('2026-01-01');
      setWithVAT(orderDate >= thresholdDate);
    } else {
      setWithVAT(false);
    }
  };

  useEffect(() => {
    if (props.clickSave) setMainDivStyle('crOderMainDiv');
    if (props.elem) {
      let { ...obj } = props.elem;
      obj.valueLoadingPoint = [];
      obj.valueUnloadingPoint = [];
      if (obj.loadingInfo == null) obj.loadingInfo = [];
      if (obj.unloadingInfo == null) obj.unloadingInfo = [];
      if (props.clickSave || props.isMadeFromApp) {
        if (obj.date != null) {
          setShowDateInput(false);
        }
      }
      if (obj.idCustomer != null) {
        setShowClientInput(false);
        obj.valueCustomer = clientList.find(elem => elem._id == obj.idCustomer).value;
      }
      if (obj.idManager != null) {
        setShowManagerInput(false);
        obj.valueManager = clientManagerFull.find(elem => elem._id == obj.idManager).value;
      }
      if (obj.applicationNumber != null) {
        setShowAppInput(false);
      }
      if (obj.customerPrice != null) {
        if (withVAT) {
          obj.customerPriceWithVAT = Number(obj.customerPrice);
          obj.customerPriceNohVAT = Number(obj.customerPrice) / (1 + VAT / 100);
        } else {
          obj.customerPriceNohVAT = Number(obj.customerPrice);
          obj.customerPriceWithVAT = '';
        }
        setShowClientPrice(false);
      }
      if (obj.idDriver != null) {
        setShowOwnerInput(false);
        obj.valueDriver = driverlist.find(elem => elem._id == obj.idDriver).value;
      }
      if (obj.idTrackDriver != null) {
        setShowTrackDriverInput(false);
        obj.valueTrackDriver = trackdriversFull.find(elem => elem._id == obj.idTrackDriver).value;
      }
      if (obj.idTrack != null) {
        setShowTrackInput(false);
        obj.valueTrack = tracksFull.find(elem => elem._id == obj.idTrack).value;
      }
      if (obj.idLoadingPoint != null) {
        obj.idLoadingPoint.forEach(elem => {
          let pointValue = pointList.find(item => item._id == elem).value;
          obj.valueLoadingPoint.push(pointValue);
        });
      }
      if (obj.idUnloadingPoint != null) {
        obj.idUnloadingPoint.forEach(elem => {
          let pointValue = pointList.find(item => item._id == elem).value;
          obj.valueUnloadingPoint.push(pointValue);
        });
      }
      if (obj.colorTR == 'Blue') {
        setCheckBox(true);
      }
      if (obj.colorTR == 'hotpink') {
        let addInfo = addtable.find(elem => elem.orderId == obj._id);
        if (addInfo != undefined) {
          obj.price = addInfo.sum;
          obj.interest = addInfo.interest;
        }
      }
      if (obj.colorTR == 'Orange') {
        setCheckPayment(true);
      }
      setOdersData(obj);
      if (props.clickSave) setBtnName('Сохранить');
      setShowClientPrice(false);
      if (props.isMadeFromApp) {
        setShowDriverPrice(true);
      } else {
        setShowDriverPrice(false);
      }
      if (obj.date) {
        updateVATByDate(obj.date);
        console.log(obj.date);
      }
    }
  }, []);

  useEffect(() => {
    setShowBtn(
      !(showDateInput || showClientInput || showClientPrice) &&
        odersData.idLoadingPoint.length > 0 &&
        odersData.idUnloadingPoint.length > 0
    );
  }, [odersData]);
  useEffect(() => {
    if (odersData.idCustomer) {
      let sumOfDebt = 0;
      orderList.forEach(order => {
        if (order.idCustomer == odersData.idCustomer && order.customerPayment != 'Ок') {
          sumOfDebt = sumOfDebt + Number(order.customerPrice);
        }
      });
      setDebtOfCustomer(sumOfDebt);
      let customerLimit = clientList.find(elem => elem._id == odersData.idCustomer).limit;
      let isCustomerActive = clientList.find(elem => elem._id == odersData.idCustomer).active;
      setLimit(customerLimit);
      setIsCustomerActive(isCustomerActive);
    }
  }, [odersData.idCustomer]);
  useEffect(() => {
    if (odersData.date) {
      updateVATByDate(odersData.date);
    }
  }, [odersData.date]);
  useEffect(() => {
    if (withVAT && odersData.customerPrice != null) {
      let { ...obj } = odersData;
      obj.customerPriceWithVAT = Number(obj.customerPrice);
      obj.customerPriceNohVAT = Number(obj.customerPrice) / (1 + VAT / 100);
      setOdersData(obj);
    }
    if (!withVAT && odersData.customerPriceWithVAT) {
      let { ...obj } = odersData;
      obj.customerPriceNohVAT = Number(obj.customerPrice);
      obj.customerPriceWithVAT = '';
      setOdersData(obj);
    }
  }, [withVAT]);

  useEffect(() => {
    const secretKey = e => {
      if (e.code == 'NumpadAdd' && e.ctrlKey) {
        e.preventDefault();
        // let div = document.querySelector("#createOrderDiv");
        // div.style.height = "400px";
        setShowAddFields(true);
      }
    };
    document.addEventListener('keydown', secretKey);
    return () => {
      document.removeEventListener('keydown', secretKey);
    };
  }, []);
  const handleChangeAppNumber = e => {
    let { ...obj } = odersData;
    obj.applicationNumber = e.currentTarget.value;
    setOdersData(obj);
  };
  const handleChangeImput = e => {
    let { ...obj } = odersData;
    if (e.currentTarget.className == 'crOderDateInput') {
      obj.date = e.currentTarget.value;
    }
    if (e.currentTarget.className == 'crOderPriceInputNoVAT') {
      if (withVAT) {
        obj.customerPriceNohVAT = e.currentTarget.value;
        obj.customerPriceWithVAT = e.currentTarget.value * (1 + VAT / 100);
      } else {
        obj.customerPriceNohVAT = e.currentTarget.value;
      }
    }
    if (e.currentTarget.className == 'crOderPriceInputWithVAT') {
      obj.customerPriceWithVAT = e.currentTarget.value;
      obj.customerPriceNohVAT = e.currentTarget.value / (1 + VAT / 100);
    }
    if (e.currentTarget.className == 'crOderDriverPriceInput') {
      obj.driverPrice = e.currentTarget.value;
    }
    setOdersData(obj);
  };
  const handleLostFocus = e => {
    let { ...obj } = odersData;
    if (e.target.className == 'crOderDateInput') {
      let now = new Date();
      let date = new Date(e.target.value);
      if (date > now) {
        obj.completed = false;
      } else {
        obj.completed = true;
      }
      obj.date = e.target.value;
      updateVATByDate(e.target.value);
      if (e.target.value != '') {
        setShowDateInput(false);
        let emptyElem = document.querySelectorAll('.containerChoise');
        if (emptyElem.length > 0) {
          let nextFocus = emptyElem[0].firstChild;
          nextFocus.focus();
        }
      }
    }
    if (e.target.className == 'crOderApplication') {
      obj.applicationNumber = e.target.value;
      if (e.target.value != '') setShowAppInput(false);
    }
    if (
      e.target.className == 'crOderPriceInputWithVAT' ||
      e.target.className == 'crOderPriceInputNoVAT'
    ) {
      if (props.elem ? props.elem.customerPayment != 'Ок' : true) {
        if (withVAT) {
          obj.customerPrice = obj.customerPriceWithVAT;
        } else {
          obj.customerPrice = obj.customerPriceNohVAT;
        }
        if (e.target.value != '') setShowClientPrice(false);
      } else {
        alert('Change is unacceptable!!!');
        setShowClientPrice(false);
      }
    }
    if (e.target.className == 'crOderDriverPriceInput') {
      if (props.elem ? props.elem.driverPayment != 'Ок' : true) {
        obj.driverPrice = e.target.value;
        if (e.target.value != '') setShowDriverPrice(false);
      } else {
        alert('Change is unacceptable!!!');
        setShowDriverPrice(false);
      }
    }
    setOdersData(obj);
  };
  const handleDblClick = e => {
    if (e.target.className == 'crOderDateP') {
      setShowDateInput(true);
    }
    if (e.target.className == 'crOderClientP' || e.target.className == 'crOderClientP red') {
      setShowClientInput(true);
    }
    if (e.target.className == 'crOderManagerP') {
      setShowManagerInput(true);
    }
    if (e.target.className == 'crOderApplicationP') {
      setShowAppInput(true);
    }
    if (e.target.className == 'crOderPriceP') {
      setShowClientPrice(true);
    }
    if (e.target.className == 'crOderOwnerP') {
      setShowOwnerInput(true);
    }
    if (e.target.className == 'crOderTrackDriverP') {
      setShowTrackDriverInput(true);
    }
    if (e.target.className == 'crOderTrackP') {
      setShowTrackInput(true);
      let arr = tracksFull.filter(elem => elem.idOwner == odersData.idDriver);
      setTracks(arr);
    }
    if (e.target.className == 'crOderDriverPriceP') {
      setShowDriverPrice(true);
    }
  };
  const setValue = (value, e) => {
    let { ...obj } = odersData;
    if (value.field == 'client') {
      obj.idCustomer = value._id;
      obj.valueCustomer = value.value;
      let arr = clientManagerFull.filter(elem => elem.odersId == value._id);
      setClientManager(arr);
      setShowClientInput(false);
      let choiseElements = document.querySelectorAll('.containerChoise');
      if (choiseElements.length > 1) {
        let nextFocus = choiseElements[1].firstChild;
        nextFocus.focus();
      }
    }
    if (value.field == 'manager') {
      obj.idManager = value._id;
      obj.valueManager = value.value;
      setShowManagerInput(false);
      //let nextFocus = document.querySelector(".PFContentPoint").firstChild;
      //nextFocus.focus();
    }
    if (value.field == 'owner') {
      obj.idDriver = value._id;
      obj.valueDriver = value.value;
      setShowOwnerInput(false);
      let arr = trackdriversFull.filter(elem => elem.idOwner == value._id);
      setTrackdrivers(arr);
      if (arr != undefined) {
        if (arr.length == 1) {
          obj.idTrackDriver = arr[0]._id;
          obj.valueTrackDriver = arr[0].value;
          setShowTrackDriverInput(false);
        } else {
          setShowTrackDriverInput(true);
        }
        if (arr.length == 0) {
          setShowTrackDriverInput(false);
        }
      }
      arr = tracksFull.filter(elem => elem.idOwner == value._id);
      setTracks(arr);
      if (arr != undefined) {
        if (arr.length == 1) {
          obj.idTrack = arr[0]._id;
          obj.valueTrack = arr[0].value;
          setShowTrackInput(false);
        } else {
          setShowTrackInput(true);
        }
        if (arr.length == 0) {
          setShowTrackInput(false);
        }
      }
      /* let nextFocus = document.querySelector(".PFContentPoint").firstChild;
      nextFocus.focus(); */
    }
    if (value.field == 'trackDriver') {
      obj.idTrackDriver = value._id;
      obj.valueTrackDriver = value.value;
      setShowTrackDriverInput(false);
      let trackId = findValueBy_Id(value._id, trackdrivers).idTrack;
      if (trackId != null) {
        obj.idTrack = trackId;
        obj.valueTrack = findValueBy_Id(trackId, tracks).value;
        setShowTrackInput(false);
      }
      /* let nextFocus = document.querySelector(".PFContentPoint").firstChild;
      nextFocus.focus(); */
    }
    if (value.field == 'track') {
      obj.idTrack = value._id;
      obj.valueTrack = value.value;
      setShowTrackInput(false);
      /* let nextFocus = document.querySelector(".PFContentPoint").firstChild;
      nextFocus.focus(); */
    }
    setOdersData(obj);
  };

  const delPoint = (index, name) => {
    let { ...obj } = odersData;
    if (name == 'LoadingPoint') {
      obj.idLoadingPoint.splice(index, 1);
      obj.valueLoadingPoint.splice(index, 1);
      obj.loadingInfo.splice(index, 1);
    }
    if (name == 'UnloadingPoint') {
      obj.idUnloadingPoint.splice(index, 1);
      obj.valueUnloadingPoint.splice(index, 1);
      obj.unloadingInfo.splice(index, 1);
    }
    setOdersData(obj);
  };
  const addPoint = (data, name) => {
    let { ...obj } = odersData;
    if (name == 'LoadingPoint') {
      obj.idLoadingPoint.push(data.id);
      obj.valueLoadingPoint.push(data.value);
      obj.loadingInfo.push(data.info);
    }
    if (name == 'UnloadingPoint') {
      obj.idUnloadingPoint.push(data.id);
      obj.valueUnloadingPoint.push(data.value);
      obj.unloadingInfo.push(data.info);
    }
    setOdersData(obj);
  };
  const editPoint = (data, name, index) => {
    let { ...obj } = odersData;
    if (name == 'LoadingPoint') {
      console.log(obj, data, name, index);
      obj.loadingInfo[index] = data;
    }
    if (name == 'UnloadingPoint') {
      console.log(obj, data, name, index);
      obj.unloadingInfo[index] = data;
    }
    setOdersData(obj);
  };
  const handleCheck = e => {
    let { ...obj } = odersData;
    if (e.currentTarget.checked) {
      obj.colorTR = 'Blue';
      setCheckBox(true);
    } else {
      obj.colorTR = 'Black';
      setCheckBox(false);
    }
    setOdersData(obj);
  };
  const handleCheckPayment = e => {
    let { ...obj } = odersData;
    if (e.currentTarget.checked) {
      obj.colorTR = 'Orange';
      setCheckPayment(true);
    } else {
      obj.colorTR = 'Black';
      setCheckPayment(false);
    }
    setOdersData(obj);
  };
  const handleCheckVAT = e => {
    const checked = e.currentTarget.checked;
    setWithVAT(checked);
    let { ...obj } = odersData;
    if (checked && obj.customerPrice) {
      obj.customerPriceWithVAT = Number(obj.customerPrice) * (1 + VAT / 100);
      obj.customerPriceNohVAT = Number(obj.customerPrice);
    }
    if (!checked && obj.customerPrice) {
      obj.customerPriceWithVAT = '';
      obj.customerPriceNohVAT = Number(obj.customerPrice);
    }
    setOdersData(obj);
  };
  const handleClick = () => {
    let check = true;
    if (Number(odersData.customerPriceNohVAT) * (1 - VAT / 100) < Number(odersData.driverPrice)) {
      check = confirm('Наценка меньше 5 % !! Продолжить?');
    }
    if (check) {
      let dataToSave = { ...odersData };
      if (withVAT && odersData.customerPriceWithVAT != null) {
        dataToSave.customerPrice = odersData.customerPriceWithVAT;
      }
      if (!withVAT && odersData.customerPriceNohVAT != null) {
        dataToSave.customerPrice = odersData.customerPriceNohVAT;
      }
      delete dataToSave.customerPriceWithVAT;
      delete dataToSave.customerPriceNohVAT;
      if (btnName == 'Добавить') {
        if (props.isMadeFromApp) {
          dispatch(addOrderApp(dataToSave, props.appId));
          props.addOder();
        } else {
          dispatch(addOder(dataToSave, props.orderTable));
          props.addOder();
        }
      }
      if (btnName == 'Сохранить') {
        let isChanged = false;
        for (let key in props.elem) {
          if (
            key != 'idLoadingPoint' ||
            key != 'idUnloadingPoint' ||
            key != 'loadingInfo' ||
            key != 'unloadingInfo'
          ) {
            const compareValue =
              key == 'customerPrice' && withVAT ? dataToSave.customerPrice : dataToSave[key];
            if (props.elem[key] != compareValue) isChanged = true;
          } else {
            props.elem[key].forEach((elem, index) => {
              if (elem != dataToSave[key][index]) isChanged = true;
            });
          }
        }
        if (isChanged && props.elem.accountNumber != null) {
          isChanged = confirm('Заказ изменен, необходимо перевыставить счет?');
        } else {
          isChanged = false;
        }
        dispatch(editOderNew(dataToSave, props.orderTable));
        props.clickSave(isChanged, dataToSave);
      }
    }
  };
  const getText = (name, text) => {
    let { ...obj } = odersData;
    obj.colorTR = 'hotpink';
    if (name == 'price') obj.price = text;
    if (name == 'interest') obj.interest = text;
    setOdersData(obj);
  };

  return (
    <div className={mainDivStyle} id="createOrderDiv">
      <h4 className="crOderCustomerHeader">
        Информация о заказе{' '}
        {props.elem != undefined && props.elem.accountNumber ? props.elem.accountNumber : null}
      </h4>
      <div className="crOderCustomDiv">
        <div className="crOderDate">
          <h4 className="crOderCustomHeader">Дата</h4>
          {showDateInput ? (
            <div className="containerInput">
              <input
                type="date"
                className="crOderDateInput"
                onBlur={handleLostFocus}
                value={odersData.date ?? ''}
                onChange={handleChangeImput}
              />
            </div>
          ) : (
            <div className="containerInput">
              <p
                className="crOderDateP"
                onDoubleClick={handleDblClick}
                onMouseDown={e => {
                  if (e.target.className == 'crOderDateP') e.preventDefault();
                }}
              >
                {dateLocal(odersData.date)}
              </p>
            </div>
          )}
        </div>
        <div className="crOderCLient">
          <h4 className="crOderCustomHeader">Заказчик</h4>
          <div className="crOderCLientContent">
            <div className="crOderClientPart">
              <h5 className="crOderCustomHeader">Клиент</h5>
              {showClientInput ? (
                <div className="containerChoise">
                  <ChoiseList name="client" arrlist={clientList} setValue={setValue} />
                </div>
              ) : (
                <p
                  className={isCustomerActive ? 'crOderClientP' : 'crOderClientP red'}
                  onDoubleClick={handleDblClick}
                  onMouseDown={e => {
                    if (
                      e.target.className == 'crOderClientP' ||
                      e.target.className == 'crOderClientP red'
                    )
                      e.preventDefault();
                  }}
                >
                  {odersData.valueCustomer}
                </p>
              )}
            </div>
            <div className="crOderClientPart">
              <h5 className="crOderCustomHeader">Менеджер</h5>
              {showManagerInput ? (
                <div className="containerChoise">
                  <ChoiseList name="manager" arrlist={clientManager} setValue={setValue} />
                </div>
              ) : (
                <p
                  className="crOderManagerP"
                  onDoubleClick={handleDblClick}
                  onMouseDown={e => {
                    if (e.target.className == 'crOderManagerP') e.preventDefault();
                  }}
                >
                  {odersData.valueManager}
                </p>
              )}
            </div>
          </div>
          <div className="applicationContainer">
            <h5 className="appHeader">Заявка</h5>
            {showAppInput ? (
              <input
                type="text"
                className="crOderApplication"
                value={odersData.applicationNumber ?? ''}
                onChange={handleChangeAppNumber}
                onBlur={handleLostFocus}
              />
            ) : (
              <p
                className="crOderApplicationP"
                onDoubleClick={handleDblClick}
                onMouseDown={e => {
                  if (e.target.className == 'crOderApplicationP') e.preventDefault();
                }}
              >
                {odersData.applicationNumber}
              </p>
            )}
          </div>
        </div>
        <div className="crOderRoute">
          <h4 className="crOderCustomHeader routeH15px">Маршрут</h4>
          <div className="crOderRouteContent">
            <div className="crOderLoadPart">
              <h5 className="crOderLoadHeader routeH15px">Погрузка</h5>
              <PointsForm
                name="LoadingPoint"
                pointsList={odersData.valueLoadingPoint}
                infoList={odersData.loadingInfo}
                delPoint={delPoint}
                addPoint={addPoint}
                editPoint={editPoint}
              />
            </div>
            <div className="crOderUnloadPart">
              <h5 className="crOderUnloadHeader routeH15px">Разгрузка</h5>
              <PointsForm
                name="UnloadingPoint"
                pointsList={odersData.valueUnloadingPoint}
                infoList={odersData.unloadingInfo}
                delPoint={delPoint}
                addPoint={addPoint}
                editPoint={editPoint}
              />
            </div>
          </div>
        </div>
        <div className="crOderPrice">
          <div className="createOrderPriceHeaderWrap">
            <h4 className="crOderCustomPriceHeader">Цена</h4>
            <div className="createOrderVATWrap">
              НДС 5% <input type="checkbox" onChange={handleCheckVAT} checked={withVAT} />
            </div>
          </div>
          <div className="crOderPriceWrap">
            {withVAT ? (
              <>
                <div className="createOrderTaxPriceWrap">
                  <span className="createOrderTypeTaxP">без НДС</span>
                  {showClientPrice ? (
                    <input
                      type="number"
                      className="crOderPriceInputNoVAT"
                      value={odersData.customerPriceNohVAT ?? ''}
                      onChange={handleChangeImput}
                      onBlur={handleLostFocus}
                    />
                  ) : (
                    <p
                      className="crOderPriceP"
                      onDoubleClick={handleDblClick}
                      onMouseDown={e => {
                        if (e.target.className == 'crOderPriceP') e.preventDefault();
                      }}
                    >
                      {Number(odersData.customerPriceNohVAT).toFixed(2)} руб
                    </p>
                  )}
                </div>
                <div className="createOrderTaxPriceWrap">
                  <span className="createOrderTypeTaxP">НДС 5%</span>
                  {showClientPrice ? (
                    <input
                      type="number"
                      className="crOderPriceInputWithVAT"
                      value={odersData.customerPriceWithVAT ?? ''}
                      onChange={handleChangeImput}
                      onBlur={handleLostFocus}
                    />
                  ) : (
                    <p
                      className="crOderPriceP"
                      onDoubleClick={handleDblClick}
                      onMouseDown={e => {
                        if (e.target.className == 'crOderPriceP') e.preventDefault();
                      }}
                    >
                      {odersData.customerPriceWithVAT
                        ? Number(odersData.customerPriceWithVAT).toFixed(2)
                        : ''}{' '}
                      руб
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="createOrderTaxPriceWrap">
                <span className="createOrderTypeTaxP">без НДС</span>
                {showClientPrice ? (
                  <input
                    type="number"
                    className="crOderPriceInputNoVAT"
                    value={odersData.customerPriceNohVAT ?? ''}
                    onChange={handleChangeImput}
                    onBlur={handleLostFocus}
                  />
                ) : (
                  <p
                    className="crOderPriceP"
                    onDoubleClick={handleDblClick}
                    onMouseDown={e => {
                      if (e.target.className == 'crOderPriceP') e.preventDefault();
                    }}
                  >
                    {odersData.customerPriceNohVAT} руб
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <h4 className="crOderDriverHeader">Информация о перевозчике</h4>
      <div className="crOderDriverDiv">
        <div className="crOderOwner">
          <h4 className="crOderOwnerHeader">Перевозчик</h4>
          {showOwnerInput ? (
            <div className="containerChoise">
              <ChoiseList name="owner" arrlist={driverlist} setValue={setValue} />
            </div>
          ) : (
            <p
              className="crOderOwnerP"
              onDoubleClick={handleDblClick}
              onMouseDown={e => {
                if (e.target.className == 'crOderOwnerP') e.preventDefault();
              }}
            >
              {odersData.valueDriver}
            </p>
          )}
        </div>
        <div className="crOderTrackDriver">
          <h4 className="crOderTrackDriverHeader">Водитель</h4>
          {showTrackDriverInput ? (
            <div className="containerChoise">
              <ChoiseList name="trackDriver" arrlist={trackdrivers} setValue={setValue} />
            </div>
          ) : (
            <p
              className="crOderTrackDriverP"
              onDoubleClick={handleDblClick}
              onMouseDown={e => {
                if (e.target.className == 'crOderTrackDriverP') e.preventDefault();
              }}
            >
              {odersData.valueTrackDriver}
            </p>
          )}
        </div>
        <div className="crOderTrack">
          <h4 className="crOderTrackHeader">Номер АМ</h4>
          {showTrackInput ? (
            <div className="containerChoise">
              <ChoiseList name="track" arrlist={tracks} setValue={setValue} />
            </div>
          ) : (
            <p
              className="crOderTrackP"
              onDoubleClick={handleDblClick}
              onMouseDown={e => {
                if (e.target.className == 'crOderTrackP') e.preventDefault();
              }}
            >
              {odersData.valueTrack}
            </p>
          )}
        </div>
        <div className="crOderPrice">
          <h4 className="crOderDriverPriceHeader">Цена</h4>
          <div className="crOderDriverPriceWrap">
            {showDriverPrice ? (
              <input
                type="number"
                className="crOderDriverPriceInput"
                value={odersData.driverPrice ?? ''}
                onChange={handleChangeImput}
                onBlur={handleLostFocus}
              />
            ) : (
              <p
                className="crOderDriverPriceP"
                onDoubleClick={handleDblClick}
                onMouseDown={e => {
                  if (e.target.className == 'crOderDriverPriceP') e.preventDefault();
                }}
              >
                {odersData.driverPrice} руб
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="footer">
        {showAddFields && (
          <div className="addFields">
            <span>еще цена</span>
            <div className="wrapInput">
              <InputText name="price" typeInput="number" text={odersData.price} getText={getText} />
            </div>
            <span>проц</span>
            <div className="wrapInput">
              <InputText
                name="interest"
                typeInput="number"
                text={odersData.interest}
                getText={getText}
              />
            </div>
          </div>
        )}
        <div className="rightPathWrap">
          <div className={debtOfCustomer < limit || limit == null ? 'infoBlock' : 'infoBlock red'}>
            {debtOfCustomer ? `Долг клиента составляет ${debtOfCustomer} руб` : null}
          </div>
          <div className="footerCheckBox">
            Не включать в оплату{' '}
            <input type="checkbox" onChange={handleCheckPayment} checked={checkPayment} />
          </div>
          <div className="footerCheckBox">
            Выделить цветом <input type="checkbox" onChange={handleCheck} checked={checkBox} />
          </div>
          {showBtn && (
            <button className="crOdBtn" onClick={handleClick}>
              {btnName}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
