import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { OrderType, Driver } from '../tsTypes';
import { shortName } from '../myLib/myLib';

interface InvoiceProps {
  order: OrderType;
  strings: DocString[];
  currentTable: string;
  reason: boolean;
  actNumberString: string;
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
    fontSize: '12px',
  } as React.CSSProperties,
  header: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '16px',
    marginBottom: '10px',
  } as React.CSSProperties,
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '11px',
    border: '1px solid black',
  } as React.CSSProperties,
  tableCell: {
    border: '1px solid black',
    padding: '3px',
  } as React.CSSProperties,
  headerCell: {
    border: '1px solid black',
    padding: '3px',
    fontWeight: 700,
    textAlign: 'center',
    verticalAlign: 'middle',
  } as React.CSSProperties,
  infoTable: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '11px',
    marginBottom: '10px',
  } as React.CSSProperties,
  infoCell: {
    padding: '3px',
    verticalAlign: 'top',
  } as React.CSSProperties,
  signatureBlock: {
    marginTop: '20px',
    fontSize: '11px',
  } as React.CSSProperties,
};

export const Invoice = ({
  order,
  strings,
  currentTable,
  reason,
  actNumberString,
  getStringData,
}: InvoiceProps) => {
  const customerList = useSelector((state: any) => state.oderReducer.clientList);
  const driverList = useSelector((state: any) => state.oderReducer.driverlist);
  const currentOwner = useSelector((state: any) => state.oderReducer.currentOwner);

  const customer = customerList.find((item: any) => item._id === order.idCustomer);
  const driver = driverList.find((item: Driver) => item._id === order.idDriver);

  const [accountOwner, setAccountOwner] = useState<ClientData | null>(null);
  const [routeStrings, setRouteStrings] = useState<DocString[]>(strings);
  const [editString, setEditString] = useState<boolean>(false);
  const [editNum, setEditNum] = useState<boolean>(false);
  const [editPrice, setEditPrice] = useState<boolean>(false);
  const [heighrEditInput, setHeightEditInput] = useState<number>(0);
  const [indexEditString, setIndexEditString] = useState<number>();
  const [vatRate, setVatRate] = useState<number>(5);
  const [paymentDocNumber, setPaymentDocNumber] = useState<string>('');
  const [shipmentDoc, setShipmentDoc] = useState<string>('');

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

  const handleDblClkMainPart = (e: React.MouseEvent<HTMLElement>, index: number) => {
    const height = e.currentTarget.clientHeight;
    setIndexEditString(index);
    setHeightEditInput(height);
    setEditString(true);
  };
  const handleChangeMainPart = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let editStrings = [...routeStrings];
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
    let editStrings = [...routeStrings];
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
    let editStrings = [...routeStrings];
    editStrings[indexEditString].customerPrice = Number(e.currentTarget.value);
    setRouteStrings(editStrings);
  };
  const handleEnterPrice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      setEditPrice(false);
      getStringData(routeStrings);
    }
  };

  const totalSumWithoutVat = routeStrings.reduce(
    (sum, item) => sum + item.customerPrice * item.numberOfShipments,
    0
  );
  const totalVat = (totalSumWithoutVat * vatRate) / 100;
  const totalSumWithVat = totalSumWithoutVat + totalVat;

  return (
    <div className="invoicePrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          СЧЕТ-ФАКТУРА № {actNumberString}
          <br />
        </div>

        <table style={styles.infoTable}>
          <tbody>
            <tr>
              <td style={{ ...styles.infoCell, width: '15%' }}>(1) Продавец</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {accountOwner?.name}
                <br />
                {accountOwner?.address}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(2) Адрес</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{accountOwner?.address}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(2а) ИНН/КПП продавца</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {accountOwner?.inn} / {accountOwner?.kpp}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(3) Грузоотправитель и его адрес</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {accountOwner?.name}, {accountOwner?.address}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(4) Грузополучатель и его адрес</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {customer?.companyName}, {customer?.address}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(5) К платежно-расчетному документу №</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{paymentDocNumber || '-'}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(6) Документ об отгрузке: наименование, №</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{shipmentDoc || '-'}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(2) Покупатель</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {customer?.companyName}
                <br />
                {customer?.address}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(2а) Адрес</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{customer?.address}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(2б) ИНН/КПП покупателя</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {customer?.TIN} / {customer?.KPP || '-'}
              </td>
            </tr>
          </tbody>
        </table>

        <table style={styles.table}>
          <thead>
            <tr>
              <td style={{ ...styles.headerCell, width: '30%' }} rowSpan={2}>
                (1) Наименование товара (описание выполненных работ, оказанных услуг),
                имущественного права
              </td>
              <td style={{ ...styles.headerCell, width: '5%' }} rowSpan={2}>
                (2) Код вида товара
              </td>
              <td style={{ ...styles.headerCell, width: '5%' }} rowSpan={2}>
                (2а) Условие обозначение (национальное)
              </td>
              <td style={{ ...styles.headerCell, width: '6%' }} rowSpan={2}>
                (3) Количество (объем)
              </td>
              <td style={{ ...styles.headerCell, width: '8%' }} rowSpan={2}>
                (4) Цена (тариф) за единицу измерения
              </td>
              <td style={{ ...styles.headerCell, width: '10%' }} rowSpan={2}>
                (5) Стоимость товаров (работ, услуг), имущественных прав без налога - всего
              </td>
              <td style={{ ...styles.headerCell, width: '5%' }} rowSpan={2}>
                (5а) Налоговая ставка
              </td>
              <td style={{ ...styles.headerCell, width: '8%' }} rowSpan={2}>
                (6) Сумма налога, предъявленная покупателю
              </td>
              <td style={{ ...styles.headerCell, width: '10%' }} rowSpan={2}>
                (7) Стоимость товаров (работ, услуг), имущественных прав с налогом - всего
              </td>
              <td style={{ ...styles.headerCell, width: '8%' }} rowSpan={2}>
                (8) В том числе сумма налога
              </td>
            </tr>
          </thead>
          <tbody>
            {routeStrings.map((string, index) => {
              const sumWithoutVat = string.customerPrice * string.numberOfShipments;
              const vat = (sumWithoutVat * vatRate) / 100;
              const sumWithVat = sumWithoutVat + vat;
              return (
                <tr key={`invoiceString${index}`}>
                  <td
                    style={{ ...styles.tableCell, padding: '4px' }}
                    onDoubleClick={e => handleDblClkMainPart(e, index)}
                  >
                    {editString && indexEditString == index ? (
                      <textarea
                        style={{ height: `${heighrEditInput}px`, width: '100%' }}
                        className="inputInTd"
                        value={string.mainPart}
                        onChange={handleChangeMainPart}
                        onKeyDown={handleEnterMainPart}
                      />
                    ) : (
                      string?.mainPart
                    )}
                  </td>
                  <td style={styles.tableCell}></td>
                  <td style={styles.tableCell}></td>
                  <td
                    style={{ ...styles.tableCell, textAlign: 'center' }}
                    onDoubleClick={e => handleDblClkNum(e, index)}
                  >
                    {editNum && indexEditString == index ? (
                      <input
                        type="number"
                        style={{ height: `${heighrEditInput}px`, width: '100%' }}
                        className="inputInTd"
                        value={string.numberOfShipments}
                        onChange={handleChangeNum}
                        onKeyDown={handleEnterNum}
                      />
                    ) : (
                      string?.numberOfShipments
                    )}
                  </td>
                  <td
                    style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '4px' }}
                    onDoubleClick={e => handleDblClkPrice(e, index)}
                  >
                    {editPrice && indexEditString == index ? (
                      <input
                        type="number"
                        style={{ height: `${heighrEditInput}px`, width: '100%' }}
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
                  <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '4px' }}>
                    {sumWithoutVat.toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>{vatRate}%</td>
                  <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '4px' }}>
                    {vat.toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '4px' }}>
                    {sumWithVat.toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td style={styles.tableCell}></td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: 700 }}>
              <td style={styles.tableCell} colSpan={4}></td>
              <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '4px' }}>
                {totalSumWithoutVat.toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td style={styles.tableCell}></td>
              <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '4px' }}>
                {totalVat.toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '4px' }}>
                {totalSumWithVat.toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td style={styles.tableCell}></td>
            </tr>
            <tr>
              <td style={styles.tableCell} colSpan={10}>
                Всего к оплате (9)
              </td>
            </tr>
          </tbody>
        </table>

        <div style={styles.signatureBlock}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', padding: '5px' }}>
                  Руководитель организации или иное уполномоченное лицо
                  <br />
                  (подпись) _____________________________ (ф.и.о.)
                </td>
                <td style={{ width: '50%', padding: '5px' }}>
                  Индивидуальный предприниматель или иное уполномоченное лицо
                  <br />
                  (подпись) _____________________________ (ф.и.о.)
                  <br />
                  (реквизиты свидетельства о государственной регистрации индивидуального
                  предпринимателя)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '5px' }}>
                  Главный бухгалтер или иное уполномоченное лицо
                  <br />
                  (подпись) _____________________________ (ф.и.о.)
                </td>
                <td style={{ padding: '5px' }}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
