import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContract } from '../../../actions/editDataAction';
import { EditP } from './editP.jsx';
import { dateLocal, formatDateToRu } from '../../myLib/myLib';
import { DOMENNAME } from '../../../middlewares/initialState.js';

import './contract.css';

export const ContractForm = props => {
  const dispatch = useDispatch();
  const customer = props.currentCustomer;
  const ownerLogist = useSelector(state => state.oderReducer.currentOwner);
  const status = useSelector(state => state.oderReducer.request);

  const getInitials = fullName => {
    const names = fullName.trim().split(' ');
    const lastName = names.shift();
    const firstName = names.shift();
    let middleName = '';

    if (names.length > 0) {
      middleName = names.reduce((initials, name) => initials + name.charAt(0).toUpperCase(), '');
    }

    return `${lastName} ${firstName.charAt(0).toUpperCase()}.${middleName.toUpperCase()}`;
  };

  const [date, setDate] = useState(null);
  const [isEditDate, setIsEditDate] = useState(false);
  const [firstParagraph, setFirstParagraph] = useState('');
  const [checkBox, setCheckBox] = useState(true);

  useEffect(() => {
    let now = new Date();
    setDate(now);
    if (!ownerLogist) {
      setFirstParagraph('Нет данных об экспедиторе');
    } else {
      const exp = ownerLogist;
      setFirstParagraph(
        `${exp.fullNameOwner || exp.nameOwner}, действующий на основании ОГРНИП ${exp.OGRN || ''} от ${formatDateToRu(exp.dateOfReg) || ''}, именуемый в дальнейшем «Экспедитор», с одной стороны, и ${customer.companyName} в лице директора ${customer.bossName}, действующей на основании Устава, именуемая в дальнейшем «Заказчик», с другой стороны, а совместно именуемые «Стороны», заключили настоящий договор о нижеследующем:`
      );
    }
  }, [ownerLogist]);
  useEffect(() => {
    console.log(status);
  }, [status]);

  const changeDate = () => {
    setIsEditDate(true);
  };
  const handleChangeDate = e => {
    setDate(e.currentTarget.value);
  };
  const handleEnter = e => {
    if (e.key == 'Enter' || e.key == 'Tab') {
      setIsEditDate(false);
    }
  };
  const handleBlur = () => {
    setIsEditDate(false);
  };
  const handleCheck = () => {
    setCheckBox(!checkBox);
  };
  const handleClickSave = () => {
    const styles = require('!!raw-loader!./contract.css').default;
    let htmlDoc = document.querySelector('.contractContentDiv');
    dispatch(addContract(props.currentCustomer, htmlDoc.innerHTML, styles));
  };

  if (!ownerLogist) {
    return <div>Нет данных об экспедиторе</div>;
  }
  const exp = ownerLogist;

  return (
    <div className="contractFormContainer">
      <div className="contractContentDiv">
        <div className="contractContentWrapper">
          <header className="contractHeader">
            <h4 className="contractHeaderH4">Договор № {customer.contract}</h4>
            <h4 className="contractHeaderH4">на перевозку грузов автомобильным транспортом.</h4>
            <div className="wrapperPlaceDate">
              <span>г.Таганрог</span>
              {isEditDate ? (
                <input
                  type="date"
                  onChange={handleChangeDate}
                  onKeyDown={handleEnter}
                  onBlur={handleBlur}
                  value={date}
                />
              ) : (
                <span onDoubleClick={changeDate}>{dateLocal(date)}</span>
              )}
            </div>
          </header>
          <EditP>{firstParagraph}</EditP>
          <section>
            <header className="contractSectionHeader">1. Предмет договора.</header>
            <article>
              <EditP>
                1.1. <span>Экспедитор</span> обязуется своими силами и материально-техническими
                средствами оказывать Заказчику услуги по перевозке грузов, а Заказчик обязуется
                оплачивать услуги Экспедитора в соответствии с условиями настоящего договора.
              </EditP>
              <EditP>
                1.2. Перевозка грузов по настоящему договору осуществляется по заданию Заказчика.
                Маршрут отражается в путевых листах, товарно-транспортных накладных, являющихся
                неотъемлемой частью настоящего договора и основанием для составления Акта об
                оказании услуг.{' '}
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">2.Провозная плата. Порядок расчетов.</header>
            <article>
              <EditP>
                2.1.Размер тарифов, в соответствии с которыми осуществляется перевозка грузов по
                настоящему договору, устанавливается Экспедитором. Окончательная провозная плата
                согласуется сторонами в Акте об оказании услуг, подписываемом сторонами.
              </EditP>
              <EditP>
                В размер провозной платы включены все расходы Экспедитора, связанные с перевозкой
                груза.
              </EditP>
              <EditP>
                2.2.Основанием для составления Акта об оказании услуг являются данные путевых
                листов, товарно-транспортные накладные.
              </EditP>
              <EditP>
                2.3. Заказчик обязуется оплатить услуги Экспедитора в течение 10 (десяти) банковских
                дней с даты предоставления Счета и Акта выполненных работ Экспедитором. Оплата
                осуществляется перечислением денежных средств на расчетный счет Экспедитора или
                внесения денежных средств в кассу Экспедитора. Днем оплаты считается день зачисления
                денежных средств на расчетный счет/получение в кассу Экспедитора.
              </EditP>
              <EditP>
                2.4. При несоблюдении условий оплаты Заказчик выплачивает Экспедитору пени в размере
                0,01% от суммы просроченного платеже за каждый день просрочки с момента предъявления
                письменной претензии.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">3. Обязанности сторон.</header>
            <article>
              <EditP>3.1. Обязанности Экспедитора:</EditP>
              <EditP>
                3.1.1.Передавать Заказчику информацию о транспортных средств, предназначенных для
                выполнения перевозок, фамилии, имена, отчества водителей, данные для заполнения
                доверенности на получение груза на складе грузоотправителя;
              </EditP>
              <EditP>
                3.1.2.в срок, указанный в заявке подавать транспортные средства под погрузку в
                согласованном количестве, исправном состоянии, отвечающем санитарным нормам и
                правилам перевозки соответствующего вида груза;
              </EditP>
              <EditP>
                3.1.3. доставлять переданный Заказчиком груз в пункт назначения и выдавать его
                уполномоченному на получение груза лицу (грузополучателю);
              </EditP>
              <EditP>
                3.1.4. по окончании перевозки передать Заказчику товарно-сопроводительную
                документацию на перевозимые грузы.
              </EditP>
              <EditP>
                3.1.5. Экспедитор вправе не принимать к перевозке грузы, не обеспеченные
                соответствующей товарно-транспортной документацией. Ответственность за нарушение
                сроков поставки, Экспедитор в этом случае не несет.
              </EditP>
              <br />
              <EditP>3.2. Обязанности Заказчика:</EditP>
              <EditP>
                3.2.1. передавать Экспедитору заявку с указанием технических характеристик
                транспортного средства с учетом вида и количества груза, в следующие сроки:
              </EditP>
              <EditP>
                3.2.2. до прибытия автотранспортного средства Экспедитора подготовить груз к
                перевозке затарить, сгруппировать по грузополучателям, подготовить
                товарно-сопроводительные, перевозочные документы (счет-фактуру, товарные накладные,
                товарно-транспортные накладные, копию договора поставки, иные документы, необходимые
                в соответствии с требованиями действующего законодательства для перевозки груза), а
                также пропуски (при необходимости) на право въезда/выезда к месту погрузки/выгрузки
                грузов.
              </EditP>
              <div className="page-break"></div>
              <EditP>
                В случае получения груза у грузоотправителя – третьего лица, Заказчик обязан
                предоставить Экспедитору надлежащим образом оформленную доверенность на получение
                груза.
              </EditP>
              <EditP>
                3.2.3. проверить пригодность предоставленного автотранспортного средства к
                перевозке. В случае выявления несоответствий письменно/по телефону сообщить
                Экспедитору. В случае отсутствия уведомления, транспортное средство считается
                соответствующим условиям перевозки груза, указанного в заявке.
              </EditP>
              <EditP>
                3.2.4. содержать подъездные пути к пунктами погрузки/разгрузки автотранспортных
                средств, погрузочные площадки в исправном состоянии, обеспечивающем время
                осуществление перевозок, беспрепятственное и безопасное движение и свободное
                маневрирование автомобилей грузоподъемностью до 25 тонн; иметь устройства освещения
                подъездных путей и рабочих мест при работе в вечернее и ночное время, а также
                необходимые для погрузки и выгрузки приспособления.
              </EditP>
              <EditP>
                3.2.5. осуществлять своими силами и средствами с соблюдением требований безопасности
                и обеспечения сохранности грузов и автомобильной техники погрузку на автомобили
                (автопоезда) и разгрузку с автомобилей (автопоездов_ грузов на своих складах и
                базах, не допуская простоя автомобилей (автопоездов) под погрузкой и/или выгрузкой;
              </EditP>
              <EditP>
                3.2.6.обеспечивать своевременное и надлежащее оформление в установленном порядке
                товарно-транспортных документов, фиксировать (при необходимости) фактическое время
                прибытия и убытия автомобилей из пунктов погрузки и выгрузки;
              </EditP>
              <EditP>
                3.2.7. предоставлять номера для телефонной связи в пунктах погрузки/разгрузки
                транспортных средств представителям Экспедитора для служебного пользования.
              </EditP>
              <EditP>
                3.2.8. обеспечить бесплатный, беспрепятственный въезд, выезд автотранспортного
                средства Экспедитора на территорию погрузки/разгрузки.
              </EditP>
              <EditP>
                3.2.9. оплачивать услуги Экспедитора в соответствии с условиями настоящего договора.
              </EditP>
              <EditP>
                3.2.10. по получении Акта об оказании услуг подписать его и направить Экспедитору.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">4. Расчеты за перевозку</header>
            <article>
              <EditP>
                4.1. Размер платы за перевозку определяется на основании цены, указанной в
                договоре-заявке, которая подписывается сторонами в виде оригинала или копии,
                отправленной по факсу или электронной почте.
              </EditP>
              <EditP>
                4.2. Оплата производится платежным поручением на расчетный счет Экспедитора в
                течении семи банковских дней с момента предоставления Экспедитором Счета, Акта
                выполненных работ и товарно-транспортных документов с отметками получателя на
                фактически произведенную перевозку согласно цены, которая указана в договоре-заявке,
                либо наличными денежными средствами, а также в иной, согласованной сторонами форме.
              </EditP>
              <EditP>
                4.3. При оплате по безналичному расчету Экспедитор предоставляет по
                факсу/электронной почте счет на оплату за грузоперевозку, а акт выполненных работ
                отправляет по почте заказным письмом Заказчику.
              </EditP>
              <EditP>
                4.4. При изменении цены перевозки Экспедитор направляет Заказчику новую
                договор-заявку с внесенными изменениями.
              </EditP>
              <EditP>
                4.5.При несоблюдении условий оплаты Заказчик выплачивает Экспедитору пени в размере
                0,1% от суммы просроченного платежа за каждый банковский день просрочки с момента
                предъявления письменной претензии.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">5. Ответственность сторон</header>
            <article>
              <EditP>
                5.1.За неисполнение или ненадлежащее исполнение своих обязательств по настоящему
                договору стороны несут ответственность в соответствии с действующим
                законодательством РФ.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">6. Форс-мажор</header>
            <article>
              <EditP>
                6.1. Стороны освобождаются от ответственности за частичное или полное неисполнение
                обязательств по настоящему договору, если это неисполнение явилось следствием
                непреодолимой силы, в том числе: войны, наводнения, землетрясения и других природных
                катаклизмов либо предписаний действующего законодательства, ограничивающих
                деятельность сторон, а также вследствие запрета государственных органов или
                забастовок (за исключением забастовок на предприятиях Экспедитора и Заказчика). При
                этом срок исполнения обязательств по настоящему договору отодвигается соразмерно
                времени, в течение которых действовали такие обстоятельства.
              </EditP>
              <EditP>
                6.2.Обе стороны обязуются в течение 2-х дней сообщить друг другу в письменной форме
                о начале и окончании действий обстоятельств непреодолимой силы.
              </EditP>
              <EditP>
                6.3.Доказательством наступления вышеуказанных обстоятельств и их продолжительности
                является письменное подтверждение компетентного госоргана.
              </EditP>
              <div className="page-break"></div>
              <EditP>
                6.4.Если данные обстоятельства будут продолжаться более трёх месяцев, то обе стороны
                вправе расторгнуть настоящий договор. В этом случае ни одна из сторон не вправе
                требовать от другой стороны возмещения убытков.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">7. Арбитраж</header>
            <article>
              <EditP>
                7.1.Споры, возникающие при исполнении настоящего договора, разрешаются в
                претензионном порядке.
              </EditP>
              <EditP>
                7.2.Если спор не решён в претензионном порядке, то заинтересованная сторона передает
                спор на рассмотрение в Арбитражный суд Ростовской области.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">8. Прочие условия</header>
            <article>
              <EditP>
                8.1.Все изменения и дополнения к настоящему договору должны быть оформлены в
                письменной форме и подписаны уполномоченными представителями обеих сторон, если иное
                не предусмотрено настоящим договором.
              </EditP>
              <EditP>
                8.2.В случаях, не предусмотренных настоящим договором, стороны руководствуются
                действующим законодательством РФ.
              </EditP>
              <EditP>
                8.3. Настоящий договор вступает в силу с момента его подписания обеими сторонами.
                Срок действия договора не ограничен.
              </EditP>
              <EditP>
                8.4. Любая из сторон вправе расторгнуть настоящий договор в одностороннем порядке,
                письменно уведомив об этом другую сторону не менее чем за 10 (десять) календарных
                дней до даты расторжения.
              </EditP>
              <EditP>
                8.5. Если, на момент расторжения договора, указанный Экспедитором, какие-либо грузы
                Заказчика находятся в пути, действие настоящего договора продлевается до момента
                полного исполнения обязательств сторонами.
              </EditP>
              <EditP>
                8.6.Стороны устанавливают, что факсимильные копии настоящего договора,
                дополнительных соглашений к нему, а также документов, относящихся к настоящему
                договору, имеют юридическую силу. Предоставление подлинников сторонами обязательно.
              </EditP>
              <EditP>
                8.7.Настоящий договор составлен в 2-х экземплярах, имеющих равную юридическую силу,
                по одному для каждой из сторон.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">
              9. Юридические адреса и банковские реквизиты сторон
            </header>
            <article>
              <table className="contractTable">
                <thead>
                  <tr className="contractHeaderTr">
                    <td className="contractTd">Экспедитор</td>
                    <td className="contractTd">Заказчик</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="contractBodyTr">
                    <td className="contractTd">
                      {`${exp.fullNameOwner || exp.nameOwner || ''} ${exp.address || ''}`}
                    </td>
                    <td className="contractTd">{`${customer.companyName ? customer.companyName : ''} ${customer.address ? customer.address : ''}`}</td>
                  </tr>
                  <tr className="contractBodyTr">
                    <td className="contractTd">ИНН {exp.TIN || ''}</td>
                    <td className="contractTd">{`ИНН ${customer.TIN ? customer.TIN : ''} `}</td>
                  </tr>
                  <tr className="contractBodyTr">
                    <td className="contractTd">КПП {exp.KPP || ''}</td>
                    <td className="contractTd">{`КПП ${customer.KPP ? customer.KPP : ''} `}</td>
                  </tr>
                  <tr className="contractBodyTr">
                    <td className="contractTd">ОГРНИП {exp.OGRN || ''}</td>
                    <td className="contractTd">{`ОГРН ${customer.OGRN ? customer.OGRN : ''} `}</td>
                  </tr>
                  <tr className="contractBodyTr">
                    <td className="contractTd">
                      {`${exp.bankName || ''} ${exp.bankAddress || ''}`}
                      <br />
                      {`БИК ${exp.RCBIC || ''}`}
                      <br />
                      {`р\с ${exp.Acc || ''}`}
                      <br />
                      {`к/сч ${exp.CorAcc || ''}`}
                    </td>
                    <td className="contractTd">
                      {`${customer.bankName ? customer.bankName : ''} ${customer.bankAddress ? customer.bankAddress : ''}`}
                      <br />
                      {`БИК ${customer.RCBIC ? customer.RCBIC : ''}`}
                      <br />
                      {`р\с ${customer.Acc ? customer.Acc : ''}`}
                      <br />
                      {`к/сч ${customer.CorAcc ? customer.CorAcc : ''}`}
                    </td>
                  </tr>
                  <tr className="contractBodyTr">
                    <td className="signTd">
                      <p className="bossNameP">
                        {exp.shortFio || exp.bossName || exp.nameOwner || ''}
                      </p>
                      <p className="signLine">__________________/________________</p>
                      <p className="stampP">М.П.</p>
                      {checkBox && (
                        <img
                          className="stampImg"
                          height="170"
                          width="170"
                          src={`${DOMENNAME}/img/stamp.png`}
                        />
                      )}
                      {checkBox && (
                        <img
                          className="signImg"
                          height="120"
                          width="120"
                          src={`${DOMENNAME}/img/sign.png`}
                        />
                      )}
                    </td>
                    <td className="signTd">
                      <div className="signBossNameWrapper">
                        <div className="editPwrapperDiv">
                          <EditP>Директор &nbsp;&nbsp;</EditP>
                        </div>
                        <p className="bossNameP">
                          {customer.bossName ? getInitials(customer.bossName) : ''}
                        </p>
                      </div>
                      <p className="signLine">__________________/________________</p>
                      <p className="stampP">М.П.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </article>
          </section>
        </div>
      </div>
      <div className="btnSaveWrapper">
        <label className="checkBoxLabel">
          {' '}
          Печать
          <input type="checkbox" checked={checkBox} onChange={handleCheck} />
        </label>
        <button className="btnSave" onClick={handleClickSave}>
          Сохранить
        </button>
      </div>
      {status.status == 'REQUEST' && <div className="statusRequest">Saving...</div>}
    </div>
  );
};
