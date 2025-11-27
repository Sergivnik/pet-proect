import React, { useState, useEffect } from 'react';
import './tdAccountVirtual.sass';
import { OrderType, Coords } from '../../tsTypes';

interface ContextMenuProps {
  order: OrderType;
  coords: Coords;
}

export const ContextMenu = ({ order, coords }: ContextMenuProps) => {
  const [isAppExist, setIsAppExist] = useState<boolean>(false);
  const [showContextEmail, isShowContextEmail] = useState<boolean>(false);
  const [appBtn, setAppBtn] = useState<string>('Печать заявки');

  const handleCreateBill = () => {};
  const handleChangeBill = () => {};
  const handleClickPrint = () => {};
  const handleClickPrintWithoutStamp = () => {};
  const handleDeleteBill = () => {};
  const handleClikCreateApp = () => {};
  const handleClikPrintApp = () => {};
  const handleClickAddDoc = (e, typeOfDoc) => {};
  const handleClickPrintTTN = () => {};
  const handleClickSendDoc = () => {};
  return (
    <div
      className="virtualDivContext"
      style={{
        top: coords.top - 20,
        left: coords.left,
      }}
    >
      {order.accountNumber == null ? (
        <p className="contextmenu" onClick={handleCreateBill}>
          Создать счет
        </p>
      ) : (
        <p className="contextmenu" onClick={handleChangeBill}>
          Изменить счет
        </p>
      )}
      <p className="contextmenu" onClick={handleClickPrint}>
        Печать счета
      </p>
      <p className="contextmenu" onClick={handleClickPrintWithoutStamp}>
        Печать без штампа
      </p>
      <p className="contextmenu" onClick={handleDeleteBill}>
        Удалить счет
      </p>
      <hr className="contextMenuHr" />
      <p className="contextmenu" onClick={handleClikCreateApp}>
        {isAppExist ? 'Изменить заявку' : 'Создать заявку'}
      </p>
      <p className="contextmenu" onClick={handleClikPrintApp}>
        {appBtn}
        {/*Печать заявки*/}
      </p>
      <p className="contextmenu" onClick={e => handleClickAddDoc(e, 'app')}>
        Добавить Заявку pdf
      </p>
      <hr className="contextMenuHr" />
      <p
        className={order.accountNumber != null ? 'contextmenu' : 'contextmenu greyFont'}
        onClick={e => handleClickAddDoc(e, 'ttn')}
      >
        Добавить ТТН
      </p>
      <p
        className={order.accountNumber != null ? 'contextmenu' : 'contextmenu greyFont'}
        onClick={handleClickPrintTTN}
      >
        Печать ТТН
      </p>
      <hr className="contextMenuHr" />
      {showContextEmail && (
        <p className="contextmenu" onClick={handleClickSendDoc}>
          Отправить Email
        </p>
      )}
    </div>
  );
};
