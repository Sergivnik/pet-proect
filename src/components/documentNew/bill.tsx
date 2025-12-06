import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { OrderType, TrackDriver, Driver } from '../tsTypes';
import { findValueBy_Id, sumInWords, shortName } from '../myLib/myLib';

interface BillProps {
  order: OrderType;
  addData: any;
  currentTable: string;
}
interface ClientData {
  name: string;
  address: string;
  inn: string;
  kpp: string;
  account: string;
  corAccount: string;
  bic: string;
  bankName: string;
  bankAddress: string;
  bossName: string;
  ogrn: string;
  dateOfReg: string;
}

const styles = {
  container: {
    pageBreakAfter: 'always',
  } as React.CSSProperties,
  mainContent: {
    width: 'calc(100% - 40px)',
    display: 'block',
    minHeight: '500px',
    padding: '20px',
    marginTop: '19px',
    fontFamily: 'arial',
  } as React.CSSProperties,
  warningText: {
    width: '95%',
    margin: '0 auto',
    textAlign: 'center',
    fontSize: '11px',
    lineHeight: '1',
    fontWeight: 300,
  } as React.CSSProperties,
  paymentSample: {
    width: '95%',
    margin: '20px auto 0 auto',
    textAlign: 'center',
    fontSize: '14px',
  } as React.CSSProperties,
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '14px',
  } as React.CSSProperties,
  tableCell: {
    border: '1px solid black',
  } as React.CSSProperties,
  invoiceNumber: {
    borderBottom: '2px solid black',
    fontSize: '16px',
  } as React.CSSProperties,
  invoiceTitle: {
    fontWeight: 700,
    margin: '17px 0 17px 0',
    fontSize: '18px',
  } as React.CSSProperties,
};

export const Bill = ({ order, addData, currentTable }: BillProps) => {
  const { ttn, contract, app, trackTrailer, dateFromApp, reason } = addData?.checkBoxesValue;
  const customerList = useSelector((state: any) => state.oderReducer.clientList);
  const driverList = useSelector((state: any) => state.oderReducer.driverlist);
  const citiesList = useSelector((state: any) => state.oderReducer.citieslist);
  const trackDriverList = useSelector((state: any) => state.oderReducer.trackdrivers);
  const trackList = useSelector((state: any) => state.oderReducer.tracklist);
  const currentOwner = useSelector((state: any) => state.oderReducer.currentOwner);
  const orderList = useSelector((state: any) => state.oderReducer.originOdersList);
  const driverOrderList = useSelector((state: any) => state.oderReducer.driverOrderList);

  const customer = customerList.find((item: any) => item._id === order.idCustomer);
  const driver = driverList.find((item: Driver) => item._id === order.idDriver);
  const trackDriver = trackDriverList.find((item: TrackDriver) => item._id === order.idTrackDriver);
  const track = trackList.find((item: any) => item._id === order.idTrack);

  const [accountOwner, setAccountOwner] = useState<ClientData | null>(null);
  const [actNumber, setActNumber] = useState<string | number>('');
  const [routeStrings, setRouteStrings] = useState<string[]>([]);
  const [mainPartOfString, setMainPartOfString] = useState<string>('');
  const [editNum, setEditNum] = useState<boolean>(false);
  const [numberOfShipments, setNumberOfShipments] = useState<number>(1);
  const [editPrice, setEditPrice] = useState<boolean>(false);
  const [customerPrice, setCustomerPrice] = useState<number>(order.customerPrice);

  useEffect(() => {
    if (currentTable === 'oderslist' && currentOwner) {
      setAccountOwner({
        name: currentOwner.fullNameOwner,
        address: currentOwner.address,
        inn: currentOwner.TIN,
        kpp: currentOwner.KPP,
        account: currentOwner.Acc,
        corAccount: currentOwner.CorAcc,
        bic: currentOwner.RCBIC,
        bankName: currentOwner.bankName,
        bankAddress: currentOwner.bankAddress,
        bossName: currentOwner.shortFio,
        ogrn: currentOwner.OGRN,
        dateOfReg: currentOwner.dateOfReg,
      });
    }
    if (currentTable === 'driverorderlist' && driver) {
      setAccountOwner({
        name: driver.companyName,
        address: driver.address,
        inn: driver.TIN,
        kpp: driver.KPP,
        account: driver.Acc,
        corAccount: driver.CorAcc,
        bic: driver.RCBIC,
        bankName: driver.bankName,
        bankAddress: driver.bankAddress,
        bossName: driver.bossName,
        ogrn: driver.OGRN,
        dateOfReg: driver.dateOfReg,
      });
    }
  }, [currentTable, currentOwner, driver]);
  useEffect(() => {
    if (order.accountNumber != null && order.accountNumber != '') {
      setActNumber(order.accountNumber);
    } else {
      const firstDateOfYear = new Date(new Date().getFullYear(), 0, 1);
      let actList;
      if (currentTable === 'oderslist') {
        actList = orderList.filter((order: OrderType) => new Date(order.date) >= firstDateOfYear);
      } else {
        actList = driverOrderList.filter(
          (order: OrderType) => new Date(order.date) >= firstDateOfYear
        );
      }
      const lastActNumber = actList.reduce((maxNumber: number, order: OrderType) => {
        const num = Number(order.accountNumber) || 0;
        return Math.max(maxNumber, num);
      }, 0);
      setActNumber(lastActNumber + 1);
    }
    let string = 'Перевозка по маршруту загрузка ';
    const loadingString = order.idLoadingPoint.map((item: number) => {
      return findValueBy_Id(item, citiesList).value + ' ';
    });
    const unloadingString = order.idUnloadingPoint.map((item: number) => {
      return findValueBy_Id(item, citiesList).value + ' ';
    });
    const trackDriverString = trackDriver.name + ' ';
    const trackString = track.model + ' ' + track.value + ' ';
    string =
      string +
      loadingString.join('') +
      'выгрузка ' +
      unloadingString.join('') +
      ' водитель ' +
      'A/M ' +
      trackDriverString +
      trackString;
    setMainPartOfString(string);
  }, [order]);
  useEffect(() => {
    if (addData) {
      const strings = [...routeStrings];
      strings[0] = mainPartOfString + `${ttn ? ` ТТН № ${addData.ttnData}` : ``}`;
      setRouteStrings(strings);
    }
  }, [addData]);

  const handleDblClkNum = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setEditNum(true);
  };
  const handleChangeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setNumberOfShipments(Number(e.currentTarget.value));
  };
  const handleEnterNum = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') setEditNum(false);
  };

  const handleDblClkPrice = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setEditPrice(true);
  };
  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setCustomerPrice(Number(e.currentTarget.value));
  };
  const handleEnterPrice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') setEditPrice(false);
  };
  return (
    <div className="invoicePrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <h5 style={styles.warningText}>
          Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление
          об оплате
          <br />
          обязательно, в противном случае не гарантируется наличие товара на складе. Товар
          отпускается по факту
          <br />
          прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта.
        </h5>
        <h4 style={styles.paymentSample}>Образец заполнения платежного поручения</h4>
        <table style={styles.table}>
          <tbody>
            <tr style={{ lineHeight: '1' }}>
              <td style={{ ...styles.tableCell, width: '34.3%' }}>ИНН {accountOwner?.inn}</td>
              <td style={{ ...styles.tableCell, width: '31.3%' }}>КПП {accountOwner?.kpp}</td>
              <td
                style={{
                  ...styles.tableCell,
                  borderBottom: 'none',
                  width: '6.7%',
                }}
              >
                Сч.№
              </td>
              <td style={{ ...styles.tableCell, width: '25.7%' }}>{accountOwner?.account}</td>
            </tr>
            <tr style={{ lineHeight: '1' }}>
              <td style={styles.tableCell} colSpan={2}>
                {accountOwner?.name}
                <br />
                <span
                  style={{
                    fontSize: '12px',
                    paddingTop: '6px',
                    display: 'inline-block',
                  }}
                >
                  Получатель
                </span>
              </td>
              <td style={{ ...styles.tableCell, borderTop: 'none' }}></td>
              <td style={{ ...styles.tableCell, borderTop: 'none' }}></td>
            </tr>
            <tr style={{ lineHeight: '1' }}>
              <td style={styles.tableCell} rowSpan={2} colSpan={2}>
                {accountOwner?.bankName} {accountOwner?.bankAddress}
                <br />
                <span
                  style={{
                    fontSize: '12px',
                    paddingTop: '6px',
                    display: 'inline-block',
                  }}
                >
                  Банк получателя
                </span>
              </td>
              <td style={styles.tableCell}>БИК</td>
              <td style={{ ...styles.tableCell, borderBottom: 'none' }}>{accountOwner?.bic}</td>
            </tr>
            <tr>
              <td style={styles.tableCell}>Сч.№</td>
              <td style={{ ...styles.tableCell, borderTop: 'none' }}>{accountOwner?.corAccount}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <div style={styles.invoiceNumber}>
            <h4 style={styles.invoiceTitle}>
              Счет № {actNumber} от {new Date(order.date).toLocaleDateString()}
            </h4>
          </div>
        </div>
        <div style={{ fontSize: '14px' }}>
          <div style={{ height: '60px' }}>
            <div
              style={{
                padding: '5px',
                verticalAlign: 'top',
                float: 'left',
                display: 'inline-block',
                width: '10%',
              }}
            >
              Поставщик:
            </div>
            <div
              style={{
                padding: '5px',
                fontWeight: 700,
                float: 'right',
                display: 'inline-block',
                width: '86%',
              }}
            >
              {accountOwner?.name}, ИНН {accountOwner?.inn}, свидетельство № {accountOwner?.ogrn} от
              {accountOwner?.dateOfReg} {accountOwner?.address}
            </div>
          </div>
          <div>
            <div
              style={{
                padding: '5px',
                verticalAlign: 'top',
                float: 'left',
                display: 'inline-block',
                width: '10%',
              }}
            >
              Покупатель:
            </div>
            <div
              style={{
                padding: '5px',
                fontWeight: 700,
                float: 'right',
                display: 'inline-block',
                width: '86%',
              }}
            >
              {customer?.companyName}, ИНН {customer?.TIN}, {customer?.address}
            </div>
          </div>
        </div>

        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: '12px',
            border: '2px solid black',
          }}
        >
          <thead>
            <tr
              style={{
                lineHeight: 1.8,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              <td style={{ border: '1px solid black', width: '5.7%' }}>№</td>
              <td style={{ border: '1px solid black', width: '51.3%' }}>
                Наименование работы (услуги)
              </td>
              <td style={{ border: '1px solid black', width: '9.7%' }}>Кол-во</td>
              <td style={{ border: '1px solid black', width: '5.6%' }}>Ед.</td>
              <td style={{ border: '1px solid black', width: '11.4%' }}>Цена</td>
              <td style={{ border: '1px solid black', width: '14.3%' }}>Сумма</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{routeStrings[0]}</td>
              <td
                style={{ border: '1px solid black', textAlign: 'center' }}
                onDoubleClick={handleDblClkNum}
              >
                {editNum ? (
                  <input
                    type="number"
                    className="inputInTd"
                    value={numberOfShipments}
                    onChange={handleChangeNum}
                    onKeyDown={handleEnterNum}
                  />
                ) : (
                  numberOfShipments
                )}
              </td>
              <td style={{ border: '1px solid black', textAlign: 'center' }}>шт</td>
              <td
                style={{ border: '1px solid black', textAlign: 'right', paddingRight: '8px' }}
                onDoubleClick={handleDblClkPrice}
              >
                {editPrice ? (
                  <input
                    type="number"
                    className="inputInTd"
                    value={customerPrice}
                    onChange={handleChangePrice}
                    onKeyDown={handleEnterPrice}
                  />
                ) : (
                  customerPrice.toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                )}
              </td>
              <td style={{ border: '1px solid black', textAlign: 'right', paddingRight: '8px' }}>
                {(customerPrice * numberOfShipments).toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
            marginTop: '10px',
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: '84%',
                  margin: '5px',
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
                Итого:
              </td>
              <td
                style={{
                  width: '14%',
                  margin: '5px',
                  paddingRight: '10px',
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
                {(customerPrice * numberOfShipments).toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td style={{ width: '80%' }}>
                Всего наименований {numberOfShipments}, на сумму{' '}
                {(customerPrice * numberOfShipments).toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                руб без НДС
              </td>
            </tr>
            <tr style={{ borderBottom: '2px solid black' }}>
              <td style={{ width: '80%', fontWeight: 700 }}>
                {sumInWords(order.customerPrice * numberOfShipments)}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ position: 'relative', height: '100px' }}>
          <p style={{ marginTop: '50px' }}>
            Индивидуальный предприниматель _____________________________{' '}
            {shortName(accountOwner?.bossName)}
          </p>
        </div>
      </div>
    </div>
  );
};
