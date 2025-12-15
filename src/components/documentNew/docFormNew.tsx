import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bill } from './bill';
import { Act } from './act.tsx';
import { Invoice } from './invoice';
import { OrderType, TrackDriver } from '../tsTypes';
import { findValueBy_Id } from '../myLib/myLib';
import './docFormNew.sass';

interface checkBoxType {
  ttn: boolean;
  contract: boolean;
  app: boolean;
  trackTrailer: boolean;
  dateFromApp: boolean;
  reason: boolean;
}
interface DocFormNewProps {
  order: OrderType;
  currentTable: string;
}
interface DocString {
  mainPart: string;
  numberOfShipments: number;
  customerPrice: number;
}

export const DocFormNew = ({ order, currentTable }: DocFormNewProps) => {
  const [checkBoxesValue, setCheckBoxesValue] = useState<checkBoxType>({
    ttn: false,
    contract: false,
    app: false,
    trackTrailer: false,
    dateFromApp: false,
    reason: false,
  });
  const [choisenTypeDoc, setChosenTypeDoc] = useState<string | null>('Bill');
  const [ttnData, setTtnData] = useState<string>('');
  const [editTtn, setEditTtn] = useState<boolean>(true);
  const [addData, setAddData] = useState({ checkBoxesValue, ttnData });
  const [strings, setStrings] = useState<DocString[]>([
    { mainPart: '', numberOfShipments: 1, customerPrice: 0 },
  ]);

  const customerList = useSelector((state: any) => state.oderReducer.clientList);
  const citiesList = useSelector((state: any) => state.oderReducer.citieslist);
  const trackDriverList = useSelector((state: any) => state.oderReducer.trackdrivers);
  const trackList = useSelector((state: any) => state.oderReducer.tracklist);
  const appList = useSelector((state: any) => state.customerReducer.customerOrders);

  const customer = customerList.find((item: any) => item._id === order.idCustomer);
  const trackDriver = trackDriverList.find((item: TrackDriver) => item._id === order.idTrackDriver);
  const track = trackList.find((item: any) => item._id === order.idTrack);
  const application = appList.find((item: any) => item.orderId == order._id);

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name as keyof checkBoxType;
    setCheckBoxesValue({
      ...checkBoxesValue,
      [name]: e.currentTarget.checked,
    });
  };
  const handleClickTypeDoc = (e: React.MouseEvent<HTMLDivElement>) => {
    setChosenTypeDoc(e.currentTarget.id);
  };
  const getTtnData = e => {
    setTtnData(e.currentTarget.value);
  };
  const handleEnterTtn = e => {
    if (e.code == 'Enter') {
      setEditTtn(false);
    }
  };
  const handleDblClkTtn = e => {
    e.stopPropagation();
    setEditTtn(true);
  };
  const getClassTypeDoc = (id: string) => {
    if (id === choisenTypeDoc) {
      return 'typeOfDoc typeOfDocActive';
    } else {
      return 'typeOfDoc';
    }
  };
  const getStringData = (strings: DocString[]) => {
    setStrings(strings);
  };
  const handleAddString = () => {
    let arr = structuredClone(strings);
    arr.push(strings[0]);
    setStrings(arr);
  };
  useEffect(() => {
    let string = 'Перевозка по маршруту загрузка ';
    const { ttn, contract, app, trackTrailer, dateFromApp, reason } = addData?.checkBoxesValue;
    const loadingString = order.idLoadingPoint.map((item, index: number) => {
      if (currentTable == 'oderslist') {
        if (dateFromApp) {
          const dateOfLoading = application.dateOfLoading;
          return dateOfLoading[index] + ' ' + findValueBy_Id(item, citiesList).value + ' ';
        } else {
          return findValueBy_Id(item, citiesList).value + ' ';
        }
      }
      if (currentTable == 'driverorderlist') {
        if (dateFromApp) {
          return 'dateOfLoading' + ' ' + findValueBy_Id(item, citiesList).value + ' ';
        } else {
          return findValueBy_Id(item, citiesList).value + ' ';
        }
      }
    });
    const unloadingString = order.idUnloadingPoint.map((item, index: number) => {
      if (currentTable == 'oderslist') {
        if (dateFromApp) {
          const dateOfUploading = application.dateOfLoading;
          return dateOfUploading[index] + ' ' + findValueBy_Id(item, citiesList).value + ' ';
        } else {
          return findValueBy_Id(item, citiesList).value + ' ';
        }
      }
      if (currentTable == 'driverorderlist') {
        if (dateFromApp) {
          return 'dateOfUploading' + ' ' + findValueBy_Id(item, citiesList).value + ' ';
        } else {
          return findValueBy_Id(item, citiesList).value + ' ';
        }
      }
    });
    const trackDriverString = trackDriver.name + ' ';
    const trackString = track.model + ' ' + track.value + ' ';
    let ttnString: string = '';
    if (ttn) ttnString = ` ТТН № ${addData.ttnData}`;
    let contractString: string = '';
    if (contract) {
      if (currentTable == 'oderslist') contractString = ` по договору № ${customer.contract}`;
      if (currentTable == 'driverorderlist') contractString = ` по договору № `;
    }
    let appString: string = '';
    if (app) appString = ` по заявке № ${order.applicationNumber}`;
    let trackTrailerString: string = '';
    if (trackTrailer) trackTrailerString = ` прецеп ${track.trackTrailerLicensePlate}`;
    string =
      string +
      loadingString.join('') +
      'выгрузка ' +
      unloadingString.join('') +
      ' водитель ' +
      'A/M ' +
      trackDriverString +
      trackString +
      trackTrailerString +
      ttnString +
      contractString +
      appString;
    setStrings(prev => {
      const copy = [...prev];
      copy[0] = { mainPart: string, numberOfShipments: 1, customerPrice: order.customerPrice };
      return copy;
    });
  }, [addData]);
  useEffect(() => {
    setAddData({ checkBoxesValue, ttnData });
  }, [checkBoxesValue, ttnData]);
  return (
    <React.Fragment>
      <header className="divHeader">
        <div className="wrapperCheckBox">
          <span>ТТН</span>
          <input
            type="checkbox"
            checked={checkBoxesValue.ttn}
            onChange={handleCheckBox}
            name="ttn"
          />
          {checkBoxesValue.ttn &&
            (editTtn ? (
              <input type="text" value={ttnData} onChange={getTtnData} onKeyDown={handleEnterTtn} />
            ) : (
              <span onDoubleClick={handleDblClkTtn}>{ttnData}</span>
            ))}
        </div>
        <div className="wrapperCheckBox">
          <span>Договор</span>
          <input
            type="checkbox"
            checked={checkBoxesValue.contract}
            onChange={handleCheckBox}
            name="contract"
          />
        </div>
        <div className="wrapperCheckBox">
          <span>Заявка</span>
          <input
            type="checkbox"
            checked={checkBoxesValue.app}
            onChange={handleCheckBox}
            name="app"
          />
        </div>
        <div className="wrapperCheckBox">
          <span>Прицеп</span>
          <input
            type="checkbox"
            checked={checkBoxesValue.trackTrailer}
            onChange={handleCheckBox}
            name="trackTrailer"
          />
        </div>
        <div className="wrapperCheckBox">
          <span>Дата погр.</span>
          <input
            type="checkbox"
            checked={checkBoxesValue.dateFromApp}
            onChange={handleCheckBox}
            name="dateFromApp"
          />
        </div>
        <div className="wrapperCheckBox">
          <span>Основание</span>
          <input
            type="checkbox"
            checked={checkBoxesValue.reason}
            onChange={handleCheckBox}
            name="reason"
          />
        </div>
      </header>
      <div className="wrapperMenuDoc">
        <div className="wrapperTypeOfDoc">
          <div id="Bill" className={getClassTypeDoc('Bill')} onClick={handleClickTypeDoc}>
            Счет
          </div>
          <div
            id="BillNoStamp"
            className={getClassTypeDoc('BillNoStamp')}
            onClick={handleClickTypeDoc}
          >
            Счет без печати
          </div>
          <div id="Invoice" className={getClassTypeDoc('Invoice')} onClick={handleClickTypeDoc}>
            Счет-фактура
          </div>
        </div>
        <div className="wrapperBtnBlock">
          <button onClick={handleAddString}>Добавить строку</button>
          <button>Сохранить</button>
        </div>
      </div>
      <div className="wrapperTable">
        {choisenTypeDoc === 'Invoice' && (
          <Invoice
            order={order}
            strings={strings}
            currentTable={currentTable}
            reason={checkBoxesValue.reason}
            getStringData={getStringData}
          />
        )}
        {choisenTypeDoc === 'Bill' && (
          <React.Fragment>
            <Bill
              order={order}
              strings={strings}
              currentTable={currentTable}
              reason={checkBoxesValue.reason}
              stamp={true}
              getStringData={getStringData}
            />
            <Act
              order={order}
              strings={strings}
              currentTable={currentTable}
              reason={checkBoxesValue.reason}
              stamp={true}
              getStringData={getStringData}
            />
          </React.Fragment>
        )}
        {choisenTypeDoc === 'BillNoStamp' && (
          <React.Fragment>
            <Bill
              order={order}
              strings={strings}
              currentTable={currentTable}
              reason={checkBoxesValue.reason}
              stamp={false}
              getStringData={getStringData}
            />
            <Act
              order={order}
              strings={strings}
              currentTable={currentTable}
              reason={checkBoxesValue.reason}
              stamp={false}
              getStringData={getStringData}
            />
            <Act
              order={order}
              strings={strings}
              currentTable={currentTable}
              reason={checkBoxesValue.reason}
              stamp={false}
              getStringData={getStringData}
            />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};
