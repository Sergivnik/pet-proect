import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { OrderType, Driver } from '../tsTypes';
import { DOMENNAME, VAT } from '../../middlewares/initialState.js';

interface InvoiceProps {
  order: OrderType;
  strings: DocString[];
  currentTable: string;
  reason: boolean;
  actNumberString: string;
  getStringData: (strings: DocString[]) => void;
  getTextReason: (textReason: string) => void;
  textReason: string;
  invoiceSeal: boolean;
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
    width: 'calc(100% - 40px)',
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
  getTextReason,
  textReason,
  invoiceSeal,
}: InvoiceProps) => {
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
  const [heighrEditInput, setHeightEditInput] = useState<number>(0);
  const [indexEditString, setIndexEditString] = useState<number>();
  const [vatRate, setVatRate] = useState<number>(VAT);
  const [paymentDocNumber, setPaymentDocNumber] = useState<string>('');
  const [shipmentDoc, setShipmentDoc] = useState<string>(
    `Акт выполненных работ № ${actNumberString}`
  );
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [correctionNumber, setCorrectionNumber] = useState<string>('');
  const [correctionDate, setCorrectionDate] = useState<string>('');
  const [currency, setCurrency] = useState<string>('Российский рубль, 643');
  const [contractId, setContractId] = useState<string>(IGC);
  const [textReasonIGC, setTextReasonIGC] = useState<string>(textReason);

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
    // Устанавливаем дату счета-фактуры из заказа
    if (order?.date) {
      const date = new Date(order.date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setInvoiceDate(`${day}.${month}.${year}`);
    } else {
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      setInvoiceDate(`${day}.${month}.${year}`);
    }
  }, [currentTable, currentOwner, driver, order]);

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

  const totalSumWithVat = routeStrings.reduce(
    (sum, item) => sum + item.customerPrice * item.numberOfShipments,
    0
  );
  const totalSumWithoutVat = totalSumWithVat / (1 + vatRate / 100);
  const totalVat = totalSumWithVat - totalSumWithoutVat;

  return (
    <div className="invoicePrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <div style={{ textAlign: 'right', fontSize: '10px', marginBottom: '5px' }}>
          Приложение № 1
          <br />к постановлению Правительства РФ от 26.12.2011 N 1137 (в редакции постановления
          Правительства РФ от 16.08.2024 № 1096)
        </div>
        <div style={styles.header}>
          СЧЕТ-ФАКТУРА № {actNumberString}
          {correctionNumber && (
            <>
              <br />
              ИСПРАВЛЕНИЕ N {correctionNumber} от {correctionDate || '__________'}
            </>
          )}
        </div>

        <table style={styles.infoTable}>
          <tbody>
            <tr>
              <td style={{ ...styles.infoCell, width: '30%' }}>(1) Продавец</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{accountOwner?.name}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(1a) Адрес</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{accountOwner?.address}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(2) ИНН/КПП продавца</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {accountOwner?.inn} / {accountOwner?.kpp}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(2а) Грузоотправитель и его адрес</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {accountOwner?.name}, {accountOwner?.address}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(2б) Грузополучатель и его адрес</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {customer?.companyName}, {customer?.address}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(3) К платежно-расчетному документу №</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{paymentDocNumber || '-'}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(4) Документ об отгрузке: наименование, №</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{shipmentDoc || '-'}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(5) Покупатель</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {customer?.companyName}
                <br />
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(5a) Адрес</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{customer?.address}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(6) ИНН/КПП покупателя</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {customer?.TIN} / {customer?.KPP || '-'}
              </td>
            </tr>
            <tr>
              <td style={styles.infoCell}>(6a) Валюта: наименование, код</td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>{currency}</td>
            </tr>
            <tr>
              <td style={styles.infoCell}>
                (6б) Идентификатор государственного контракта, договора (соглашения) (при наличии)
              </td>
              <td style={{ ...styles.infoCell, fontWeight: 700 }}>
                {reason ? textReasonIGC : '-'}
              </td>
            </tr>
          </tbody>
        </table>

        <table style={styles.table}>
          <thead>
            <tr>
              <td style={{ ...styles.headerCell, width: '24%', minWidth: '250px' }} rowSpan={2}>
                (1) Наименование товара (описание выполненных работ, оказанных услуг),
                имущественного права
              </td>
              <td style={{ ...styles.headerCell, width: '5%' }} rowSpan={2}>
                (1б) Код вида товара
              </td>
              <td style={{ ...styles.headerCell, width: '4%' }} colSpan={2}>
                Единица измерения
              </td>
              <td style={{ ...styles.headerCell, width: '5%' }} rowSpan={2}>
                (3) Количество (объем)
              </td>
              <td style={{ ...styles.headerCell, width: '6%' }} rowSpan={2}>
                (4) Цена (тариф) за единицу измерения
              </td>
              <td style={{ ...styles.headerCell, width: '8%' }} rowSpan={2}>
                (5) Стоимость товаров (работ, услуг), имущественных прав без налога - всего
              </td>
              <td style={{ ...styles.headerCell, width: '5%' }} rowSpan={2}>
                (6) В том числе сумма акциза
              </td>
              <td style={{ ...styles.headerCell, width: '5%' }} rowSpan={2}>
                (7) Налоговая ставка
              </td>
              <td style={{ ...styles.headerCell, width: '7%' }} rowSpan={2}>
                (8) Сумма налога, предъявляемая покупателю
              </td>
              <td style={{ ...styles.headerCell, width: '8%' }} rowSpan={2}>
                (9) Стоимость товаров (работ, услуг), имущественных прав с налогом - всего
              </td>
              <td style={{ ...styles.headerCell, width: '4%' }} colSpan={2}>
                (10) Страна происхождения товара
              </td>
              <td style={{ ...styles.headerCell, width: '4%' }} rowSpan={2}>
                (11) Регистрационный номер декларации на товары или регистрационный номер партии
                товара, подлежащего прослеживаемости
              </td>
            </tr>
            <tr>
              <td style={{ ...styles.headerCell, width: '2%' }}>(2) код</td>
              <td style={{ ...styles.headerCell, width: '2%' }}>
                (2а) условное обозначение (национальное)
              </td>
              <td style={{ ...styles.headerCell, width: '2%' }}>(10) цифровой код</td>
              <td style={{ ...styles.headerCell, width: '2%' }}>(10а) краткое наименование</td>
            </tr>
          </thead>
          <tbody>
            {routeStrings.map((string, index) => {
              const sumWithVat = string.customerPrice * string.numberOfShipments;
              const sumWithoutVat = sumWithVat / (1 + vatRate / 100);
              const vat = sumWithVat - sumWithoutVat;
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
                      (string.customerPrice / (1 + VAT / 100)).toLocaleString('ru-RU', {
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
                  <td style={styles.tableCell}></td>
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
                  <td style={styles.tableCell}></td>
                  <td style={styles.tableCell}></td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: 700 }}>
              <td style={styles.tableCell} colSpan={5}></td>
              <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '4px' }}>
                {totalSumWithoutVat.toLocaleString('ru-RU', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td style={styles.tableCell}></td>
              <td style={styles.tableCell}>X</td>
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
              <td style={styles.tableCell} colSpan={4}></td>
            </tr>
            <tr>
              <td style={styles.tableCell} colSpan={9}>
                Всего к оплате (9)
              </td>
              <td style={styles.tableCell} colSpan={6}></td>
            </tr>
          </tbody>
        </table>

        <div style={styles.signatureBlock}>
          <div style={{ marginTop: '30px', width: '100%', display: 'flex' }}>
            <div style={{ marginBottom: '15px', display: 'flex' }}>
              <div style={{ width: '40%' }}>
                Руководитель организации или иное уполномоченное лицо
              </div>
              <div style={{ width: '60%' }}>(подпись) _____________________________ (ф.и.о.)</div>
            </div>
            <div style={{ marginBottom: '15px', display: 'flex' }}>
              <div style={{ width: '40%' }}>Главный бухгалтер или иное уполномоченное лицо</div>
              <div style={{ width: '60%' }}>(подпись) _____________________________ (ф.и.о.)</div>
            </div>
          </div>
          <div
            style={{ marginTop: '30px', width: '100%', display: 'flex', justifyContent: 'start' }}
          >
            <div style={{ width: '25%' }}>
              Индивидуальный предприниматель или иное уполномоченное лицо (подпись)
            </div>
            <div style={{ width: '25%' }}>
              ___________________________________ (ф.и.о.)
              {invoiceSeal && (
                <img
                  style={{
                    position: 'relative',
                    left: '30px',
                    top: '-95px',
                    opacity: '0.7',
                  }}
                  height="120"
                  width="120"
                  src={`${DOMENNAME}/img/sign.png`}
                />
              )}
            </div>

            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
              }}
            >
              {currentTable == 'oderslist' ? (
                <div>
                  {accountOwner?.ogrn} от {new Date(accountOwner?.dateOfReg).toLocaleDateString()}
                </div>
              ) : (
                <div></div>
              )}
              <div style={{ borderTop: '1px solid black' }}>
                (реквизиты свидетельства о государственной регистрации индивидуального
                предпринимателя)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
