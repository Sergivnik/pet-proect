import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDriverContract } from '../../../actions/editDataAction';
import { EditP } from './editP.jsx';
import { dateLocal, formatDateToRu } from '../../myLib/myLib';
import { DOMENNAME } from '../../../middlewares/initialState.js';

import './contract.css';

export const DriverContractForm = ({ driver }) => {
  const dispatch = useDispatch();

  const status = useSelector(state => state.oderReducer.request);
  const ownerLogist = useSelector(state => state.oderReducer.currentOwner);

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
        `${exp.fullNameOwner || exp.nameOwner}, действующий на основании ОГРНИП ${exp.OGRN || ''} от ${formatDateToRu(exp.dateOfReg) || ''}, именуемый в дальнейшем «Экспедитор», с одной стороны, и ${driver.companyName} в лице ${driver.bossName}, действующей на основании свидетельства ${driver.OGRN}, именуемый в дальнейшем «Перевозчик», с другой стороны, а совместно именуемые «Стороны», заключили настоящий договор о нижеследующем:`
      );
    }
  }, []);
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
    dispatch(addDriverContract(driver, htmlDoc.innerHTML, styles));
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
            <h4 className="contractHeaderH4">Договор № {driver.contract}</h4>
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
                1.1. <span> Перевозчик </span> обязуется принимать, а Экспедитор предъявлять к
                перевозке грузы и оплачивать их доставку согласно условиям настоящего договора.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">2. Условия перевозки грузов</header>
            <article>
              <EditP>
                2.1 Условия перевозки грузов Перевозка грузов осуществляется на основании заявок
                Экспедитор по заранее согласованному графику. Экспедитор предоставляет заявку на
                перевозку грузов в письменной или устной форме. В заявке необходимо указать:
                требуемое количество единиц автотранспорта, характеристику груза, пункт погрузки,
                время прибытия в пункт погрузки, пункт разгрузки, получателя груза.
              </EditP>
              <EditP>
                Перевозчик обязан: обеспечивать подачу подвижного состава по типу и количеству в
                указанный пункт погрузки, в указанные часы, в соответствии с заявкой и графиком
                Экспедитора; подавать под погрузку исправный подвижной состав в состоянии пригодном
                для перевозки указанного в заявке вида груза и отвечающем санитарным требованиям
                принимать к перевозке груз согласно товарно-транспортным документам; принимать на
                себя ответственность за сохранность в пути всех перевозимых в соответствии с заявкой
                грузов; доставлять вверенный ему Экспедитор груз в пункт назначения в сроки,
                определенные настоящим договором, и выдавать его уполномоченному на получение груза
                лицу (грузополучателю);
              </EditP>
              <EditP>
                Экспедитор обязан: обеспечить беспрепятственный прием и отпуск в соответствии с
                заявкой осуществлять своими силами и средствами с соблюдением требований
                безопасности движения и обеспечения сохранности грузов и подвижного состава,
                погрузку на автомобили грузов на своих складах и базах, не допуская простоя
                автомобилей; предоставлять Перевозчику на предъявленный к перевозке груз
                товарно-транспортные документы; содержать подъездные пути в пунктах погрузки и
                выгрузки, а также погрузочно-разгрузочные площадки в исправном состоянии,
                обеспечивающем в любое время осуществление беспрепятственного и безопасного движения
                и свободное маневрирование автомобилей; предоставлять при необходимости в пунктах
                погрузки водителям Перевозчика телефонную связь.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">3. Расчеты за перевозку</header>
            <article>
              <EditP>
                3.1Размер платы за перевозку определяется на основании цены, указанной в
                договоре-заявке, которая оформляется индивидуально на каждую перевозку и
                подписывается сторонами по факсу.
              </EditP>
              <EditP>
                3.2. Оплата производится платежным поручением на расчетный счет Перевозчика в
                течении десяти календарных дней с момента предоставления Перевозчиком счета, акта
                выполненных работ и товарно-транспортных документов с отметками получателя на
                фактически произведенную перевозку согласно тарифу, который указывается в
                договоре-заявке, либо наличными денежными средствами, а также в иной, согласованной
                сторонами форме.
              </EditP>
              <EditP>
                При оплате по безналичному расчету Перевозчик в течении одного календарного дня
                предоставляет по факсу счет на оплату за грузоперевозку, а акт выполненных работ и
                счет-фактуру отправляет по почте заказным письмом Экспедитор .
              </EditP>
              <EditP>
                При изменении цен на перевозки Перевозчик направляет Экспедитор письменное
                уведомление для согласования за 10 рабочих дней до их предполагаемого введения.
              </EditP>
              <EditP>
                При несоблюдении условий оплаты Экспедитор выплачивает Перевозчику пени в размере
                0,01% от суммы просроченного платеже за каждый день просрочки с момента предъявления
                письменной претензии.
              </EditP>
              <div className="page-break"></div>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">4. Ответственности сторон</header>
            <article>
              <EditP>
                В случае неисполнения либо ненадлежащего исполнения обязательств по перевозке
                стороны несут ответственность, предусмотренную Законодательством РФ, а также
                соглашением сторон по настоящему договору.
              </EditP>
              <EditP>
                Перевозчик и Экспедитор освобождаются от ответственности в случае неподачи
                транспортных средств либо не использования транспортных средств, если это произошло
                вследствие:
              </EditP>
              <EditP>
                 непреодолимой силы, а также иных явлений стихийного характера, а также военных
                действий
              </EditP>
              <EditP>
                 прекращения или ограничения перевозки грузов в определенных направлениях,
                установленного в порядке, предусмотренном законом РФ.
              </EditP>
              <EditP>
                Перевозчик несет ответственность за не сохранность груза, происшедшую после принятия
                его к перевозке и до выдачи грузополучателю или управомоченному им лицу, если не
                докажет, что утрата, недостача или повреждение (порча) груза произошли вследствие
                обстоятельств, которые перевозчик не мог предотвратить и устранение которых от него
                не зависело.
              </EditP>
              <EditP>Ущерб, причиненный при перевозке груза, возмещается перевозчиком:</EditP>
              <EditP>
                 в случае утраты или недостачи груза - в размере стоимости утраченного или
                недостающего груза
              </EditP>
              <EditP>
                 в случае повреждения (порчи) груза - в размере суммы, на которую понизилась его
                стоимость, а при невозможности восстановления поврежденного груза- в размере его
                стоимости.
              </EditP>
              <EditP>
                 в случае утраты груза, сданного к перевозке с объявлением его ценности - в размере
                объявленной стоимости груза. Стоимость груза определяется исходя из его цены,
                указанной в сопроводительных документах или предусмотренной приложением.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">5. Прочие условия</header>
            <article>
              <EditP>
                Настоящий договор вступает в силу с момента его подписания обеими сторонами. Срок
                действия договора не ограничен.
              </EditP>
              <EditP>
                Любая из сторон вправе расторгнуть настоящий договор в одностороннем порядке,
                письменно уведомив об этом другую сторону не менее чем за 10 (десять) календарных
                дней до даты расторжения.
              </EditP>
              <EditP>
                {' '}
                Настоящий договор составлен в 2 экземплярах, имеющих одинаковую юридическую силу.
                Все изменения и дополнения к настоящему договору вступают в силу после подписания
                обеими сторонами соответствующих приложений и дополнений к договору.
              </EditP>
            </article>
          </section>
          <section>
            <header className="contractSectionHeader">
              6. Юридические адреса и банковские реквизиты сторон
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
                    <td className="contractTd">{`${
                      driver.companyName ? driver.companyName : ''
                    } ${driver.address ? driver.address : ''}`}</td>
                  </tr>
                  <tr className="contractBodyTr">
                    <td className="contractTd">ИНН {exp.TIN || ''}</td>
                    <td className="contractTd">{`ИНН ${driver.TIN ? driver.TIN : ''} `}</td>
                  </tr>
                  <tr className="contractBodyTr">
                    <td className="contractTd">КПП {exp.KPP || ''}</td>
                    <td className="contractTd">{`КПП ${driver.KPP ? driver.KPP : ''} `}</td>
                  </tr>
                  <tr className="contractBodyTr">
                    <td className="contractTd">ОГРНИП {exp.OGRN || ''}</td>
                    <td className="contractTd">{`ОГРН ${driver.OGRN ? driver.OGRN : ''} `}</td>
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
                      {`${driver.bankName ? driver.bankName : ''} ${
                        driver.bankAddress ? driver.bankAddress : ''
                      }`}
                      <br />
                      {`БИК ${driver.RCBIC ? driver.RCBIC : ''}`}
                      <br />
                      {`р\с ${driver.Acc ? driver.Acc : ''}`}
                      <br />
                      {`к/сч ${driver.CorAcc ? driver.CorAcc : ''}`}
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
                          <EditP>ИП &nbsp;&nbsp;</EditP>
                        </div>
                        <p className="bossNameP">
                          {driver.bossName ? getInitials(driver.bossName) : ''}
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
