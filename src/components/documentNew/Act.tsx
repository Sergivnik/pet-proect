import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OrderType, Driver } from '../tsTypes.js';
import { sumInWords, shortName } from '../myLib/myLib.js';
import { DOMENNAME } from '../../middlewares/initialState.js';

interface ActProps {
  order: OrderType;
  strings: DocString[];
  currentTable: string;
  reason: boolean;
  stamp: boolean;
  actNumberString: string;
  getStringData: (strings: DocString[]) => void;
  withVAT: boolean;
  getTextReason: (textReason: string) => void;
  textReason: string;
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

export const Act = ({
  order,
  strings,
  currentTable,
  reason,
  stamp,
  actNumberString,
  getStringData,
  withVAT,
  getTextReason,
  textReason,
}: ActProps) => {
  const customerList = useSelector((state: any) => state.oderReducer.clientList);
  const driverList = useSelector((state: any) => state.oderReducer.driverlist);
  const currentOwner = useSelector((state: any) => state.oderReducer.currentOwner);
  const yearConst = useSelector((state: any) => state.oderReducer.yearconst);

  const customer = customerList.find((item: any) => item._id === order.idCustomer);
  const driver = driverList.find((item: Driver) => item._id === order.idDriver);
  const IGC = yearConst.IGC;

  const [accountOwner, setAccountOwner] = useState<ClientData | null>(null);
  const [routeStrings, setRouteStrings] = useState<DocString[]>(strings);
  const [editString, setEditString] = useState<boolean>(false);
  const [editNum, setEditNum] = useState<boolean>(false);
  const [editPrice, setEditPrice] = useState<boolean>(false);
  const [editReason, setEditReason] = useState<boolean>(false);
  const [textReasonIGC, setTextReasonIGC] = useState<string>(`  ИГК ${IGC}`);
  const [heighrEditInput, setHeightEditInput] = useState<number>(0);
  const [indexEditString, setIndexEditString] = useState<number>();

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
    setRouteStrings(strings);
  }, [strings]);
  useEffect(() => {
    console.log(textReason);
    if (textReason) {
      setTextReasonIGC(textReason);
    } else {
      setTextReasonIGC(`  ИГК ${IGC}`);
    }
  }, [textReason, reason]);

  const handleDblClkMainPart = (e: React.MouseEvent<HTMLElement>, index: number) => {
    const height = e.currentTarget.clientHeight;
    setIndexEditString(index);
    setHeightEditInput(height);
    setEditString(true);
  };
  const handleChangeMainPart = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const editStrings = [...routeStrings];
    editStrings[indexEditString].mainPart = e.currentTarget.value;
    setRouteStrings(editStrings);
  };
  const handleEnterMainPart = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      setEditString(false);
      getStringData(routeStrings);
    }
  };
  const handleDblClkNum = (e: React.MouseEvent<HTMLElement>, index: number) => {
    const height = e.currentTarget.clientHeight;
    setIndexEditString(index);
    setHeightEditInput(height);
    setEditNum(true);
  };
  const handleChangeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editStrings = [...routeStrings];
    editStrings[indexEditString].numberOfShipments = Number(e.currentTarget.value);
    setRouteStrings(editStrings);
  };
  const handleEnterNum = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      setEditNum(false);
      getStringData(routeStrings);
    }
  };
  const handleDblClkPrice = (e: React.MouseEvent<HTMLElement>, index: number) => {
    const height = e.currentTarget.clientHeight;
    setIndexEditString(index);
    setHeightEditInput(height);
    setEditPrice(true);
  };
  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editStrings = [...routeStrings];
    editStrings[indexEditString].customerPrice = Number(e.currentTarget.value);
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
    setTextReasonIGC(e.currentTarget.value);
  };
  const handleEnterReason = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      setEditReason(false);
      getTextReason(textReasonIGC);
    }
  };

  const VAT_RATE = 5;
  const getVat = (sum: number) => (sum * VAT_RATE) / (100 + VAT_RATE);
  const getSumWithoutVAT = (sum: number) => (100 * sum) / (100 + VAT_RATE);

  const getPrice = (sum: number) => {
    if (withVAT) {
      return getSumWithoutVAT(sum);
    } else {
      return sum;
    }
  };

  const totalSum = routeStrings.reduce(
    (sum, item) => sum + item.customerPrice * item.numberOfShipments,
    0
  );
  const totalCount = routeStrings.reduce((sum, item) => sum + item.numberOfShipments, 0);

  return (
    <div className="invoicePrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.titleRow}>Акт № {actNumberString}</div>

        <table style={styles.headerTable}>
          <tbody>
            <tr>
              <td style={{ width: '12%', padding: '3px 5px' }}>Исполнитель:</td>
              <td style={{ padding: '3px 5px', fontWeight: 700 }}>
                {accountOwner?.name}, ИНН {accountOwner?.inn}, свидетельство № {accountOwner?.ogrn}{' '}
                от {new Date(accountOwner?.dateOfReg).toLocaleDateString()} {accountOwner?.address}
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
                      value={textReasonIGC}
                      onChange={handleChangeReason}
                      onKeyDown={handleEnterReason}
                    />
                  ) : (
                    <span onDoubleClick={handleDblClkReason}>{textReasonIGC}</span>
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
              <td style={{ border: '1px solid black', width: withVAT ? '40%' : '51.3%' }}>
                Наименование работы (услуги)
              </td>
              <td style={{ border: '1px solid black', width: withVAT ? '5%' : '9.7%' }}>Кол-во</td>
              <td style={{ border: '1px solid black', width: withVAT ? '4%' : '5.6%' }}>Ед.</td>
              <td style={{ border: '1px solid black', width: withVAT ? '6%' : '11.4%' }}>Цена</td>
              <td style={{ border: '1px solid black', width: withVAT ? '9%' : '14.3%' }}>Сумма</td>
              {withVAT && (
                <>
                  <td style={{ border: '1px solid black', width: '5.6%' }}>Ставка НДС, %</td>
                  <td style={{ border: '1px solid black', width: '11.4%' }}>НДС, руб.</td>
                  <td style={{ border: '1px solid black', width: '14.3%' }}>Сумма с НДС, руб.</td>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {routeStrings.map((string, index) => (
              <tr key={`actString${index}`}>
                <td style={{ ...styles.tableCell, textAlign: 'center' }}>{index + 1}</td>
                <td
                  style={{ ...styles.tableCell, padding: '4px' }}
                  onDoubleClick={e => handleDblClkMainPart(e, index)}
                >
                  {editString && indexEditString == index ? (
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
                  onDoubleClick={e => handleDblClkNum(e, index)}
                >
                  {editNum && indexEditString == index ? (
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
                  style={{ border: '1px solid black', textAlign: 'right', paddingRight: '8px' }}
                  onDoubleClick={e => handleDblClkPrice(e, index)}
                >
                  {editPrice && indexEditString == index && !withVAT ? (
                    <input
                      type="number"
                      style={{ height: `${heighrEditInput}px` }}
                      className="inputInTd"
                      value={string.customerPrice}
                      onChange={handleChangePrice}
                      onKeyDown={handleEnterPrice}
                    />
                  ) : (
                    getPrice(string.customerPrice).toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  )}
                </td>
                <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '8px' }}>
                  {(getPrice(string.customerPrice) * string.numberOfShipments).toLocaleString(
                    'ru-RU',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                {withVAT && (
                  <>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{VAT_RATE}</td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                      {((string.customerPrice / 21) * string.numberOfShipments).toLocaleString(
                        'ru-RU',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td
                      style={{
                        border: '1px solid black',
                        textAlign: 'right',
                        paddingRight: '8px',
                      }}
                      onDoubleClick={e => handleDblClkPrice(e, index)}
                    >
                      {editPrice && indexEditString == index && withVAT ? (
                        <input
                          type="number"
                          style={{ height: `${heighrEditInput}px` }}
                          className="inputInTd"
                          value={string.customerPrice}
                          onChange={handleChangePrice}
                          onKeyDown={handleEnterPrice}
                        />
                      ) : (
                        (string.customerPrice * string.numberOfShipments).toLocaleString('ru-RU', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      )}
                    </td>
                  </>
                )}
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
                {totalSum.toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
            {withVAT && (
              <tr>
                <td
                  style={{
                    width: '84%',
                    margin: '5px',
                    textAlign: 'right',
                    fontWeight: 700,
                  }}
                >
                  В том числе НДС:
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
                  {getVat(totalSum).toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            )}
            <tr>
              <td style={{ width: '80%' }}>
                Всего наименований {totalCount}, на сумму{' '}
                {totalSum.toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {withVAT
                  ? `в том числе НДС - ${getVat(totalSum).toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} руб.`
                  : 'руб без НДС'}
              </td>
            </tr>
            <tr style={{ borderBottom: '2px solid black' }}>
              <td style={{ width: '80%', fontWeight: 700 }}>{sumInWords(totalSum)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: '13px', marginTop: '15px' }}>
          <p style={{ margin: '4px 0' }}>
            Всего оказано услуг на сумму: {sumInWords(totalSum)}{' '}
            {withVAT
              ? `в том числе НДС - ${getVat(totalSum).toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} руб.`
              : 'без НДС'}
          </p>
          <p style={{ margin: '4px 0' }}>
            Вышеуказанные услуги выполнены полностью и в срок. Заказчик претензий по объему,
            качеству и срокам оказания услуг не имеет
          </p>
        </div>

        <div style={{ position: 'relative', height: '100px', marginTop: '40px', fontSize: '14px' }}>
          <p style={{ marginTop: '20px' }}>
            Исполнитель _____________________ {shortName(accountOwner?.bossName)}
                Заказчик ________________________
          </p>
          {stamp && (
            <img
              style={{
                position: 'absolute',
                left: '100px',
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
                left: '140px',
                top: '-90px',
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
