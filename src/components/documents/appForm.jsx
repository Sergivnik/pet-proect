import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dateLocal, sumInWords } from '../myLib/myLib';
import { DOMENNAME } from '../../middlewares/initialState.js';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import { InputText } from '../myLib/inputText.jsx';
import { addData } from '../../actions/editDataAction';
import { SpanWithList } from '../myLib/mySpan/spanWithList.jsx';
import { SpanWithText } from '../myLib/mySpan/spanWithText.jsx';
import { SpanWithDate } from '../myLib/mySpan/spanWithDate.jsx';
import { VAT } from '../../middlewares/initialState.js';
import './billsForm.sass';

export const AppForm = props => {
  const dispatch = useDispatch();
  console.log(props);
  const odersList = useSelector(state => state.oderReducer.originOdersList);
  const clientList = useSelector(state => state.oderReducer.clientList);
  const managerList = useSelector(state => state.oderReducer.clientmanager);
  const citiesList = useSelector(state => state.oderReducer.citieslist);
  const tracksList = useSelector(state => state.oderReducer.tracklist);
  const trackDriversList = useSelector(state => state.oderReducer.trackdrivers);
  const storelist = useSelector(state => state.oderReducer.storelist);
  const driverList = useSelector(state => state.oderReducer.driverlist);
  const appList = useSelector(state => state.customerReducer.customerOrders);

  console.log(props.isLogistApp);
  const order = props.isLogistApp
    ? appList.find(app => app._id == props.dataDoc.odersListId[props.id - 1])
    : odersList.find(elem => elem._id == props.dataDoc.odersListId[props.id - 1]);
  const client = props.isLogistApp
    ? clientList.find(client => client._id == order.customerId)
    : clientList.find(elem => elem._id == order.idCustomer);
  const manager = order.idManager ? managerList.find(elem => elem._id == order.idManager) : null;
  const driver = order.idDriver ? driverList.find(elem => elem._id == order.idDriver) : null;
  const track = order.idTrack ? tracksList.find(elem => elem._id == order.idTrack) : null;
  const trackDriver = order.idTrackDriver
    ? trackDriversList.find(elem => elem._id == order.idTrackDriver)
    : null;

  const [editData, setEditData] = useState({
    appDate: props.isLogistApp ? order.dateOfApp : order.date,
    goodsName: '',
    goodsWeight: 20,
    loadingData: [],
    unLoadingData: [],
    customerId: null,
    driverId: trackDriver ? trackDriver._id : null,
    managerId: null,
    customerPrice: order.customerPrice,
    driverPrice: order.driverPrice,
    addCondition: '',
    taxRate: `Безналичный расчет НДС ${VAT} %`,
  });
  const [showEditWindow, setShowEditWindow] = useState(false);
  const [showChoiseList, setShowChoiseList] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [newStore, setNewStore] = useState({});
  const [storeFilterList, setStoreFilterList] = useState(storelist);
  const [managerShortList, setManagerShortList] = useState(managerList);
  const [clientEdit, setClientEdit] = useState(client);
  const [trackDriverEdit, setTrackDriverEdit] = useState();
  const [trackEdit, setTrackEdit] = useState(track);

  const styleDivRow = { display: 'flex', marginBottom: '-1px' };
  const styleCellLeft = {
    width: '25%',
    border: '1px solid black',
    paddingLeft: '5px',
  };
  const styleCellRight = {
    width: '75%',
    border: '1px solid black',
    marginLeft: '-1px',
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '5px',
  };
  const styleCellCargo = {
    width: '33.33%',
    borderRight: '1px solid Black',
    margin: '-1px',
    textAlign: 'center',
  };
  const styleCellPoint = {
    width: '80%',
    borderRight: '1px solid Black',
    margin: '-1px',
    textAlign: 'left',
  };
  const styleCellDate = {
    width: '20%',
    borderRight: '1px solid Black',
    margin: '-1px',
    textAlign: 'center',
  };
  const styleDiv50 = { width: '50%', position: 'relative' };
  const stylePOther = { margin: 0, fontSize: '11px' };

  useEffect(() => {
    let obj = { ...editData };
    obj.customerId = client._id;
    obj.managerId = order.idManager;
    obj.goodsWeight = order.weight ? order.weight : 20;
    order.idLoadingPoint.forEach((idCity, index) => {
      const point = citiesList.find(elem => elem._id == idCity).value;
      const storeId = order.loadingStoreId ? order.loadingStoreId[index] : null;
      let addInfo = '';
      let storeName = '';
      if (storeId == null) {
        if (order.loadingText) {
          if (order.loadingText[index] != '') {
            addInfo = order.loadingText[index] ? order.loadingText[index] : '';
            let text = order.loadingInfo[index] ? order.loadingInfo[index] : '';
            if (text) addInfo = addInfo + ', ' + text;
          } else {
            addInfo = order.loadingInfo[index] ? order.loadingInfo[index] : '';
          }
          storeName = 'по ТТН';
        }
      } else {
        const store = storelist.find(store => store._id == storeId);
        addInfo = store.address;
        storeName = store.value;
      }
      obj.loadingData.push({
        text: `${point}, ${addInfo}`,
        point: `${point}`,
        store: storeName,
        date: dateLocal(props.isLogistApp ? order.dateOfLoading[index] : order.date),
        edit: false,
      });
    });
    order.idUnloadingPoint.forEach((idCity, index) => {
      const point = citiesList.find(elem => elem._id == idCity).value;
      const storeId = order.unloadingStoreId ? order.unloadingStoreId[index] : null;
      let addInfo = '';
      let storeName = '';
      if (storeId == null) {
        if (order.unloadingText) {
          if (order.unloadingText[index] != '') {
            addInfo = order.unloadingText[index] ? order.unloadingText[index] : '';
            let text = order.unloadingInfo[index] ? order.unloadingInfo[index] : '';
            if (text) addInfo = addInfo + ', ' + text;
          } else {
            addInfo = order.unloadingInfo[index] ? order.unloadingInfo[index] : '';
          }
          storeName = 'по ТТН';
        }
      } else {
        const store = storelist.find(store => store._id == storeId);
        addInfo = store.address;
        storeName = store.value;
      }
      obj.unLoadingData.push({
        text: `${point}, ${addInfo}`,
        point: `${point}`,
        store: storeName,
        date: dateLocal(props.isLogistApp ? order.dateOfUnloading[index] : order.date),
        edit: false,
      });
    });
    obj.addCondition = order.textInfo ? order.textInfo : '';
    setEditData(obj);
  }, []);
  useEffect(() => {
    setStoreFilterList(storelist.filter(elem => elem.idCity == order.idLoadingPoint[currentIndex]));
  }, [storelist]);
  useEffect(() => {
    let arr = managerList.filter(elem => elem.odersId == editData.customerId);
    if (arr.length > 0) setManagerShortList(arr);
    let clientNew = clientList.find(elem => elem._id == editData.customerId);
    if (clientNew) setClientEdit(clientNew);
    let trackDriverNew = trackDriversList.find(elem => elem._id == editData.driverId);
    if (trackDriverNew) setTrackDriverEdit(trackDriverNew);
    let trackNew = trackDriverNew
      ? tracksList.find(elem => elem._id == trackDriverNew.idTrack)
      : null;
    if (trackNew) setTrackEdit(trackNew);
    console.log(trackDriverNew);
  }, [editData]);
  useEffect(() => {
    props.getEditData(editData);
  }, [editData]);
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        if (showEditWindow) {
          setShowEditWindow(false);
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [showEditWindow]);

  const handleChangePoint = (e, index, name) => {
    function padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    }
    e.preventDefault();
    e.stopPropagation();
    setShowEditWindow(true);
    let arr = [];
    if (name == 'loadingPoint') {
      arr = storelist.filter(elem => elem.idCity == order.idLoadingPoint[index]);
      let date = new Date(editData.loadingData[index].date);
      let dateStr = `${date.getFullYear()}-${padTo2Digits(
        date.getDate()
      )}-${padTo2Digits(date.getMonth() + 1)}`;
      setCurrentDate(dateStr);
    }
    if (name == 'unLoadingPoint') {
      arr = storelist.filter(elem => elem.idCity == order.idUnloadingPoint[index]);
      let date = new Date(editData.unLoadingData[index].date);
      let dateStr = `${date.getFullYear()}-${padTo2Digits(
        date.getDate()
      )}-${padTo2Digits(date.getMonth() + 1)}`;
      setCurrentDate(dateStr);
    }
    setStoreFilterList(arr);
    setCurrentIndex(index);
    setCurrentPoint(name);
  };
  const handleClickRadio = e => {
    if (e.currentTarget.value == 'storelist') {
      setShowChoiseList(true);
      setChecked1(true);
      setChecked2(false);
    } else {
      setShowChoiseList(false);
      setChecked1(false);
      setChecked2(true);
    }
  };
  const setValue = data => {
    let obj = { ...editData };
    let store = storelist.find(elem => elem._id == data._id);
    if (currentPoint == 'loadingPoint') {
      obj.loadingData[currentIndex].text =
        obj.loadingData[currentIndex].point + ' ' + store.address;
      obj.loadingData[currentIndex].store = data.value;
    }
    if (currentPoint == 'unLoadingPoint') {
      obj.unLoadingData[currentIndex].text =
        obj.unLoadingData[currentIndex].point + ' ' + store.address;
      obj.unLoadingData[currentIndex].store = data.value;
    }
    setEditData(obj);
  };
  const getText = (name, text) => {
    console.log(text);
    let obj = { ...editData };
    if (currentPoint == 'loadingPoint') {
      if (obj.loadingData[currentIndex].text != text) {
        obj.loadingData[currentIndex].text = text;
        setEditData(obj);
      }
    }
    if (currentPoint == 'unLoadingPoint') {
      if (obj.unLoadingData[currentIndex].text != text) {
        obj.unLoadingData[currentIndex].text = text;
        setEditData(obj);
      }
    }
  };
  const handleClickAddStore = () => {
    setShowAddStore(true);
    let obj = { ...newStore };
    obj.storeName = '';
    obj.storeAddress = '';
    if (currentPoint == 'loadingPoint') {
      obj.idPoint = order.idLoadingPoint[currentIndex];
      obj.valuePoint = editData.loadingData[currentIndex].point;
    }
    if (currentPoint == 'unLoadingPoint') {
      obj.idPoint = order.idUnloadingPoint[currentIndex];
      obj.valuePoint = editData.unLoadingData[currentIndex].point;
    }
    setNewStore(obj);
  };
  const getDataStore = (name, text) => {
    let obj = { ...newStore };
    if (name == 'storeName') obj.storeName = text;
    if (name == 'storeAddress') obj.storeAddress = text;
    console.log(name, text);
    setNewStore(obj);
  };
  const handleAddStore = () => {
    let obj = {};
    obj.idCity = newStore.idPoint;
    obj.address = newStore.storeAddress;
    obj.value = newStore.storeName;
    dispatch(addData(obj, 'storelist'));
    setShowAddStore(false);
  };

  const handleGetDate = e => {
    function padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    }
    let date = new Date(e.currentTarget.value);
    let obj = { ...editData };
    let dateStr = `${date.getFullYear()}-${padTo2Digits(
      date.getMonth() + 1
    )}-${padTo2Digits(date.getDate())}`;
    setCurrentDate(dateStr);
    if (currentPoint == 'loadingPoint') {
      obj.loadingData[currentIndex].date = dateLocal(date);
    }
    if (currentPoint == 'unLoadingPoint') {
      obj.unLoadingData[currentIndex].date = dateLocal(date);
    }
    setEditData(obj);
  };
  const handleClickSavePoint = () => {
    setShowEditWindow(false);
  };
  const getId = (id, name) => {
    let obj = { ...editData };
    obj[name] = id;
    console.log(obj);
    setEditData(obj);
  };
  const getEditText = (text, name) => {
    let obj = { ...editData };
    obj[name] = text;
    setEditData(obj);
  };

  return (
    <div
      style={{
        margin: '15px 25px 15px 60px',
        position: 'relative',
        fontSize: '14px',
      }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: '25%' }}>
          <img src={`${DOMENNAME}/img/track.png`} height="150" width="200" />
        </div>
        <div style={{ width: '75%' }}>
          <h1 style={{ textAlign: 'center', margin: 0 }}>ИП Иванов С.Н.</h1>
          <p style={{ margin: 0, paddingLeft: '50px' }}>
            ИНН 615408271552 347323, г.Таганрог, ул.Ломакина д.108 кв.2
          </p>
          <p style={{ margin: 0, paddingLeft: '50px' }}>
            Фактический адрес 347324, г.Таганрог, ул.Москатова д.31/2 оф.34
          </p>
          <p style={{ margin: 0, paddingLeft: '50px' }}>
            телефон: +7-991-366-13-66 Вячеслав email: saver911@yandex.ru
          </p>
          <h3 style={{ textAlign: 'center', padding: '0 15px', fontSize: '15px' }}>
            {`ДОГОВОР-ЗАЯВКА НА ПЕРЕВОЗКУ ГРУЗА № ${
              props.isLogistApp ? order.applicationNumber : props.dataDoc.odersListId[props.id - 1]
            } от  `}
            <SpanWithDate date={editData.appDate} name="appDate" getDate={getEditText} />
          </h3>
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Заказчик</span>
        </div>
        <div style={styleCellRight}>
          {props.driverApp ? (
            'ИП Иванов С.Н.'
          ) : (
            <SpanWithList
              list={clientList}
              name="customerId"
              id={editData.customerId}
              filedId="_id"
              fieldPrint="companyName"
              getId={getId}
            />
          )}
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Контактное лицо</span>
        </div>
        <div style={styleCellRight}>
          <SpanWithList
            list={managerShortList}
            name="managerId"
            id={editData.managerId}
            filedId="_id"
            fieldPrint="name"
            getId={getId}
          />
          <SpanWithList
            list={managerShortList}
            name="managerId"
            id={editData.managerId}
            filedId="_id"
            fieldPrint="phone"
            getId={getId}
          />
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Наименование груза</span>
        </div>
        <div style={styleCellRight}>
          <div style={styleCellCargo}>
            <span>Количество мест погрузки</span>
          </div>
          <div style={styleCellCargo}>
            <span>Количество мест разгрузки</span>
          </div>
          <div style={styleCellCargo}>
            <span>Вес, тонн</span>
          </div>
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>{editData.goodsName}</span>
        </div>
        <div style={styleCellRight}>
          <div style={styleCellCargo}>
            <span>{order.idLoadingPoint.length}</span>
          </div>
          <div style={styleCellCargo}>
            <span>{order.idUnloadingPoint.length}</span>
          </div>
          <div style={styleCellCargo}>
            <SpanWithText name="goodsWeight" text={editData.goodsWeight} getText={getEditText} />
          </div>
        </div>
      </div>
      {editData.loadingData.map((elem, index) => {
        return (
          <div
            className="divPoint"
            key={`Loading${index}`}
            onDoubleClick={e => handleChangePoint(e, index, 'loadingPoint')}
          >
            <div style={styleDivRow}>
              <div style={styleCellLeft}>
                <span>{`Адрес, дата загрузки ${index + 1}`}</span>
              </div>
              <div style={styleCellRight}>
                <div style={styleCellPoint}>
                  <span>{elem.text}</span>
                </div>
                <div style={styleCellDate}>
                  <span>{elem.date}</span>
                </div>
              </div>
            </div>
            <div style={styleDivRow}>
              <div style={styleCellLeft}>
                <span>{`Название организации`}</span>
              </div>
              <div style={styleCellRight}>
                <span>{elem.store}</span>
              </div>
            </div>
          </div>
        );
      })}
      {editData.unLoadingData.map((elem, index) => {
        return (
          <div
            className="divPoint"
            key={`unloading${index}`}
            onDoubleClick={e => handleChangePoint(e, index, 'unLoadingPoint')}
          >
            <div style={styleDivRow}>
              <div style={styleCellLeft}>
                <span>{`Адрес, дата разгрузки ${index + 1}`}</span>
              </div>
              <div style={styleCellRight}>
                <div style={styleCellPoint}>
                  <span>{elem.text}</span>
                </div>
                <div style={styleCellDate}>
                  <span>{elem.date}</span>
                </div>
              </div>
            </div>
            <div style={styleDivRow}>
              <div style={styleCellLeft}>
                <span>{`Название организации`}</span>
              </div>
              <div style={styleCellRight}>
                <span>{elem.store}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Стоимость перевозки</span>
        </div>
        <div style={styleCellRight}>
          <div style={{ width: '20%' }}>
            <SpanWithText
              name="customerPrice"
              text={
                //props.driverApp ? editData.driverPrice : editData.customerPrice
                editData.customerPrice
              }
              getText={getEditText}
            />
          </div>
          <span style={{ width: '80%' }}>
            {sumInWords(
              //props.driverApp ? editData.driverPrice : editData.customerPrice
              editData.customerPrice
            )}
          </span>
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Форма оплаты</span>
        </div>
        <div style={styleCellRight}>
          <SpanWithText name="taxRate" text={editData.taxRate} getText={getEditText} />
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Ставка простоя</span>
        </div>
        <div style={styleCellRight}>
          <span></span>
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Дополнительные условия</span>
        </div>
        <div style={styleCellRight}>
          <SpanWithText name="addCondition" text={editData.addCondition} getText={getEditText} />
        </div>
      </div>
      <div style={{ paddingTop: '15px' }}>
        <p style={stylePOther}>ПРОЧИЕ УСЛОВИЯ:</p>
        <p style={stylePOther}>
          1.1. В своей деятельности стороны руководствуются положениями настоящего договора-заявки.
        </p>
        <p style={stylePOther}>
          1.2. Заказчик обеспечивает загрузку/разгрузу автотранспортного средства в течении 4 часов
          с момента прибытия транспорта. Свыше указанного времени простой автомобиля оплачивается
          исходя из ставки простоя указанной в заявке.
        </p>
        <p style={stylePOther}>
          1.3. Перевозчик несет ответственность перед Заказчиком в виде возмещения реального ущерба
          за утрату недостачу или порчу груза, принятого для перевозки,если не докажет, что утрата,
          недостача или повреждение (порча) груза произошли вследствие обстоятельств, которые
          перевозчик не мог предотвратить или устранить по независящим от него причинам.
        </p>
        <p style={stylePOther}>1.4. Заказчик несет ответственность:</p>
        <p style={stylePOther}>
          {' '}
          1.4.1. За срыв перевозки по договору-заявке: 20% от стоимости перевозки
        </p>
        <p style={stylePOther}>
          {' '}
          1.4.2. За несвоевременную (согласно договора) оплату за выполненную перевозку : 0,1% от
          суммы просроченного платежа за каждый день просрочки с момента предъявления письменной
          претензии
        </p>
        <p style={stylePOther}>
          1.5. Стороны могут отказываться от выполнения обязательств по утвержденной (подписанной)
          ими заявке без несения материальной ответственности не позденее 24 часов до загрузки
        </p>
        <p style={stylePOther}>
          1.6. Копия заявки считается действительной и имеет юридическую силу.
        </p>
        <p style={stylePOther}>
          1.7. В случае перегруза транспортного средства Заказчик компенсирует Перевозчику, расходы
          по по уплате штрафов по пути следовани автомобиля.
        </p>
        <p style={{ margin: 0, paddingTop: '15px' }}>
          ПРОСИМ ПОДТВЕРДИТЬ ПРИНЯТИЕ ЗАЯВКИ ПЕЧАТЬЮ И ПОДПИСЬЮ
        </p>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>МАРКА, № А/М, № П/П</span>
        </div>
        <div style={styleCellRight}>
          <span>
            {trackEdit
              ? `${trackEdit.model} ${trackEdit.value}        прицеп ${trackEdit.trackTrailerLicensePlate}`
              : ''}
          </span>
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>ФИО водителя</span>
        </div>
        <div style={styleCellRight}>
          <SpanWithList
            list={trackDriversList}
            name="driverId"
            id={editData.driverId}
            filedId="_id"
            fieldPrint="name"
            getId={getId}
          />
          {/* <span>{`${trackDriver.name}`}</span> */}
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Паспортные данные</span>
        </div>
        <div style={styleCellRight}>
          <span>
            {trackDriverEdit
              ? `${trackDriverEdit.passportNumber} ${
                  trackDriverEdit.department
                } выдан ${dateLocal(trackDriverEdit.dateOfIssue)}`
              : ''}
          </span>
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Водительское удостоверение</span>
        </div>
        <div style={styleCellRight}>
          <span>{trackDriverEdit ? `${trackDriverEdit.driverLicense}` : ''}</span>
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleCellLeft}>
          <span>Тел. водителя</span>
        </div>
        <div style={styleCellRight}>
          <span>{trackDriverEdit ? `${trackDriverEdit.phoneNumber}` : ''}</span>
        </div>
      </div>
      <div style={styleDivRow}>
        <div style={styleDiv50}>
          <h4>{props.driverApp ? 'Заказчик' : 'Исполнитель'}</h4>
          <p style={{ height: '75px' }}>
            ИП Иванов С.Н. 347923, г. Таганрог Ростовская область, ул.Ломакина д.108 кв. 2, ИНН
            615408271552
          </p>
          <p style={{ marginTop: '50px' }}>Подпись ______________________Иванов С.Н.</p>
          {props.stamp && (
            <img
              style={{
                position: 'absolute',
                left: '60px',
                top: '110px',
                opacity: '0.7',
                zIndex: '-2',
              }}
              height="170"
              width="170"
              src={`${DOMENNAME}/img/stamp.png`}
            />
          )}
          {props.stamp && (
            <img
              style={{
                position: 'absolute',
                left: '90px',
                top: '110px',
                zIndex: '-1',
                transform: 'rotate(15deg)',
              }}
              height="120"
              width="120"
              src={`${DOMENNAME}/img/sign.png`}
            />
          )}
        </div>
        <div style={styleDiv50}>
          <h4>{props.driverApp ? 'Исполнитель' : 'Заказчик'}</h4>
          {!props.driverApp && (
            <p style={{ height: '75px' }}>{`${clientEdit.companyName} ИНН ${
              clientEdit.TIN ? clientEdit.TIN : ''
            }, ${clientEdit.address ? clientEdit.address : ''}`}</p>
          )}
          {props.driverApp && (
            <p style={{ height: '75px' }}>{`${driver.companyName} ИНН ${
              driver.TIN ? driver.TIN : ''
            }, ${driver.address ? driver.address : ''}`}</p>
          )}
          <p style={{ marginTop: '50px' }}>Подпись ______________________</p>
        </div>
      </div>
      {showEditWindow && (
        <div className="editWindowDiv">
          <label>
            <input
              type="radio"
              name="wayToGetAddress"
              value="storelist"
              checked={checked1}
              onChange={handleClickRadio}
            />
            Выбрать склад из списка
          </label>
          <label>
            <input
              type="radio"
              name="wayToGetAddress"
              value="text"
              checked={checked2}
              onChange={handleClickRadio}
            />
            Ввести адрес вручную
          </label>

          <div>
            {showChoiseList ? (
              <div>
                <div className="choiseWrapStore">
                  <ChoiseList name="store" arrlist={storeFilterList} setValue={setValue} />
                </div>
                <button onClick={handleClickAddStore}>добавить новый склад</button>
                {showAddStore && (
                  <div>
                    <table className="editWindowTable">
                      <thead>
                        <tr>
                          <td className="editWindowTd">Название склада</td>
                          <td className="editWindowTd">Город</td>
                          <td className="editWindowTd">Адрес склада</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="editWindowTd">
                            {newStore.storeName == '' ? (
                              <div>
                                <InputText
                                  name="storeName"
                                  typeInput="text"
                                  text={newStore.storeName}
                                  getText={getDataStore}
                                />
                              </div>
                            ) : (
                              newStore.storeName
                            )}
                          </td>
                          <td className="editWindowTd">
                            <div>{newStore.valuePoint}</div>
                          </td>
                          <td className="editWindowTd">
                            {newStore.storeAddress == '' ? (
                              <div>
                                <InputText
                                  name="storeAddress"
                                  typeInput="text"
                                  text={newStore.storeAddress}
                                  getText={getDataStore}
                                />
                              </div>
                            ) : (
                              newStore.storeAddress
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="btnSave" onClick={handleAddStore}>
                      Соранить
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <InputText
                name="textAddress"
                typeInput="text"
                text={
                  currentPoint == 'loadingPoint'
                    ? editData.loadingData[currentIndex].text
                    : editData.unLoadingData[currentIndex].text
                }
                getText={getText}
              />
            )}
          </div>
          <div className="editDateDiv">
            <label>
              Дата погрузки
              <input
                className="editDateInput"
                type="date"
                name="pointDate"
                onChange={handleGetDate}
                value={currentDate}
              />
            </label>
          </div>
          <button onClick={handleClickSavePoint}>Сохранить</button>
        </div>
      )}
    </div>
  );
};
