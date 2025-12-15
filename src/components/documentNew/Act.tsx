import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OrderType, Driver } from '../tsTypes';
import { sumInWords, shortName } from '../myLib/myLib';
import { DOMENNAME } from '../../middlewares/initialState.js';

interface ActProps {
  order: OrderType;
  strings: DocString[];
  currentTable: string;
  reason: boolean;
  stamp: boolean;
  getStringData: (strings: DocString[]) => void;
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
interface DocString {
  mainPart: string;
  numberOfShipments: number;
  customerPrice: number;
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
  titleRow: {
    width: '100%',
    marginBottom: '20px',
    fontWeight: 700,
    fontSize: '18px',
  } as React.CSSProperties,
  headerTable: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '14px',
    marginBottom: '15px',
  } as React.CSSProperties,
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '12px',
    border: '2px solid black',
  } as React.CSSProperties,
  tableCell: {
    border: '1px solid black',
  } as React.CSSProperties,
};

export const Act = ({ order, strings, currentTable, reason, stamp, getStringData }: ActProps) => {
  const customerList = useSelector((state: any) => state.oderReducer.clientList);
  const driverList = useSelector((state: any) => state.oderReducer.driverlist);
  const currentOwner = useSelector((state: any) => state.oderReducer.currentOwner);
  const orderList = useSelector((state: any) => state.oderReducer.originOdersList);
  const driverOrderList = useSelector((state: any) => state.oderReducer.driverOrderList);
  const yearConst = useSelector((state: any) => state.oderReducer.yearconst);

  const customer = customerList.find((item: any) => item._id === order.idCustomer);
  const driver = driverList.find((item: Driver) => item._id === order.idDriver);
  const IGC = yearConst.IGC;

  const [accountOwner, setAccountOwner] = useState<ClientData | null>(null);
  const [actNumber, setActNumber] = useState<string | number>('');
  const [routeStrings, setRouteStrings] = useState<DocString[]>(strings);
  const [editString, setEditString] = useState<boolean>(false);
  const [editNum, setEditNum] = useState<boolean>(false);
  const [editPrice, setEditPrice] = useState<boolean>(false);
  const [editReason, setEditReason] = useState<boolean>(false);
  const [textReason, setTextReason] = useState<string>(`  ИГК ${IGC}`);
  const [heighrEditInput, setHeightEditInput] = useState<number>(0);

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
        actList = orderList.filter((item: OrderType) => new Date(item.date) >= firstDateOfYear);
      } else {
        actList = driverOrderList.filter(
          (item: OrderType) => new Date(item.date) >= firstDateOfYear
        );
      }
      const lastActNumber = actList.reduce((maxNumber: number, item: OrderType) => {
        const num = Number(item.accountNumber) || 0;
        return Math.max(maxNumber, num);
      }, 0);
      setActNumber(lastActNumber + 1);
    }
  }, [order, currentTable, orderList, driverOrderList]);

  useEffect(() => {
    setRouteStrings(strings);
  }, [strings]);

  const handleDblClkMainPart = (e: React.MouseEvent<HTMLElement>) => {
    const height = e.currentTarget.clientHeight;
    setHeightEditInput(height);
    setEditString(true);
  };
  const handleChangeMainPart = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const editStrings = [...routeStrings];
    editStrings[0].mainPart = e.currentTarget.value;
    setRouteStrings(editStrings);
  };
  const handleEnterMainPart = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      setEditString(false);
      getStringData(routeStrings);
    }
  };
  const handleDblClkNum = (e: React.MouseEvent<HTMLElement>) => {
    const height = e.currentTarget.clientHeight;
    setHeightEditInput(height);
    setEditNum(true);
  };
  const handleChangeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editStrings = [...routeStrings];
    editStrings[0].numberOfShipments = Number(e.currentTarget.value);
    setRouteStrings(editStrings);
  };
  const handleEnterNum = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      setEditNum(false);
      getStringData(routeStrings);
    }
  };
  const handleDblClkPrice = (e: React.MouseEvent<HTMLElement>) => {
    const height = e.currentTarget.clientHeight;
    setHeightEditInput(height);
    setEditPrice(true);
  };
  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editStrings = [...routeStrings];
    editStrings[0].customerPrice = Number(e.currentTarget.value);
    setRouteStrings(editStrings);
  };
  const handleEnterPrice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      setEditPrice(false);
      getStringData(routeStrings);
    }
  };
  const handleDblClkReason = () => {
    setEditReason(true);
  };
  const handleChangeReason = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextReason(e.currentTarget.value);
  };
  const handleEnterReason = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') setEditReason(false);
  };

  const totalSum = routeStrings.reduce(
    (sum, item) => sum + item.customerPrice * item.numberOfShipments,
    0
  );
  const totalCount = routeStrings.reduce((sum, item) => sum + item.numberOfShipments, 0);

  return (
    <div className="invoicePrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.titleRow}>
          Акт № {actNumber} от {new Date(order.date).toLocaleDateString()}
        </div>

        <table style={styles.headerTable}>
          <tbody>
            <tr>
              <td style={{ width: '12%', padding: '3px 5px' }}>Исполнитель:</td>
              <td style={{ padding: '3px 5px', fontWeight: 700 }}>
                {accountOwner?.name}, ИНН {accountOwner?.inn}, свидетельство № {accountOwner?.ogrn}{' '}
                от {accountOwner?.dateOfReg} {accountOwner?.address}
              </td>
            </tr>
            <tr>
              <td style={{ width: '12%', padding: '3px 5px' }}>Заказчик:</td>
              <td style={{ padding: '3px 5px', fontWeight: 700 }}>
                {customer?.companyName} ИНН {customer?.TIN}, {customer?.address}
              </td>
            </tr>
            {reason && (
              <tr>
                <td style={{ width: '12%', padding: '3px 5px' }}>Основание:</td>
                <td style={{ padding: '3px 5px', fontWeight: 700 }}>
                  {editReason ? (
                    <input
                      type="text"
                      value={textReason}
                      onChange={handleChangeReason}
                      onKeyDown={handleEnterReason}
                    />
                  ) : (
                    <span onDoubleClick={handleDblClkReason}>{textReason}</span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <table style={styles.table}>
          <thead>
            <tr
              style={{
                lineHeight: 1.8,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              <td style={{ ...styles.tableCell, width: '5.7%' }}>№</td>
              <td style={{ ...styles.tableCell, width: '51.3%' }}>Наименование работы (услуги)</td>
              <td style={{ ...styles.tableCell, width: '9.7%' }}>Кол-во</td>
              <td style={{ ...styles.tableCell, width: '5.6%' }}>Ед.</td>
              <td style={{ ...styles.tableCell, width: '11.4%' }}>Цена</td>
              <td style={{ ...styles.tableCell, width: '14.3%' }}>Сумма</td>
            </tr>
          </thead>
          <tbody>
            {routeStrings.map((string, index) => (
              <tr key={`actString${index}`}>
                <td style={{ ...styles.tableCell, textAlign: 'center' }}>{index + 1}</td>
                <td
                  style={{ ...styles.tableCell, padding: '4px' }}
                  onDoubleClick={handleDblClkMainPart}
                >
                  {editString ? (
                    <textarea
                      style={{ height: `${heighrEditInput}px` }}
                      className="inputInTd"
                      value={string.mainPart}
                      onChange={handleChangeMainPart}
                      onKeyDown={handleEnterMainPart}
                    />
                  ) : (
                    string?.mainPart
                  )}
                </td>
                <td
                  style={{ ...styles.tableCell, textAlign: 'center' }}
                  onDoubleClick={handleDblClkNum}
                >
                  {editNum ? (
                    <input
                      type="number"
                      style={{ height: `${heighrEditInput}px` }}
                      className="inputInTd"
                      value={string.numberOfShipments}
                      onChange={handleChangeNum}
                      onKeyDown={handleEnterNum}
                    />
                  ) : (
                    string?.numberOfShipments
                  )}
                </td>
                <td style={{ ...styles.tableCell, textAlign: 'center' }}>шт</td>
                <td
                  style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '8px' }}
                  onDoubleClick={handleDblClkPrice}
                >
                  {editPrice ? (
                    <input
                      type="number"
                      style={{ height: `${heighrEditInput}px` }}
                      className="inputInTd"
                      value={string.customerPrice}
                      onChange={handleChangePrice}
                      onKeyDown={handleEnterPrice}
                    />
                  ) : (
                    string.customerPrice.toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  )}
                </td>
                <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '8px' }}>
                  {(string.customerPrice * string.numberOfShipments).toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
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
                }}
              >
                Всего наименований {totalCount}, на сумму{' '}
                {totalSum.toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                руб без НДС
              </td>
              <td
                style={{
                  width: '14%',
                  margin: '5px',
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
                Итого:{' '}
                {totalSum.toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ width: '100%', fontWeight: 700 }}>
                ({sumInWords(totalSum)})
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: '13px', marginTop: '15px' }}>
          <p style={{ margin: '4px 0' }}>
            Всего оказано услуг на сумму: {sumInWords(totalSum)} без НДС
          </p>
          <p style={{ margin: '4px 0' }}>
            Вышеуказанные услуги выполнены полностью и в срок. Заказчик претензий по объему,
            качеству и срокам оказания услуг не имеет
          </p>
        </div>

        <div style={{ position: 'relative', height: '100px', marginTop: '40px', fontSize: '14px' }}>
          <p style={{ marginTop: '20px' }}>
            Исполнитель _____________________ {shortName(accountOwner?.bossName)}
                Заказчик ________________________ {shortName(customer?.bossName)}
          </p>
          {stamp && (
            <img
              style={{
                position: 'absolute',
                left: '60px',
                top: '-70px',
                opacity: '0.7',
                zIndex: '-2',
              }}
              height="170"
              width="170"
              src={`${DOMENNAME}/img/stamp.png`}
            />
          )}
          {stamp && (
            <img
              style={{
                position: 'absolute',
                left: '60px',
                top: '-70px',
                opacity: '0.7',
                zIndex: '-2',
              }}
              height="120"
              width="120"
              src={`${DOMENNAME}/img/sign.png`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
