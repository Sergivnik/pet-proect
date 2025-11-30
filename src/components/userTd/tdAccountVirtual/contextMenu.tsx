import React, { useState, useEffect } from 'react';
import './tdAccountVirtual.sass';
import { OrderType, Coords } from '../../tsTypes';

interface ContextMenuProps {
  order: OrderType;
  coords: Coords;
  handleClickContextMenu: (menuPoint: string) => void;
}

export const ContextMenu = ({ order, coords, handleClickContextMenu }: ContextMenuProps) => {
  const [isAppExist, setIsAppExist] = useState<boolean>(false);
  const [appBtn, setAppBtn] = useState<string>('Печать заявки');

  return (
    <div
      className="virtualDivContext"
      style={{
        top: coords.top - 20,
        left: coords.left,
      }}
    >
      {order.accountNumber == null ? (
        <p className="contextmenu" onClick={() => handleClickContextMenu('createBill')}>
          Создать счет
        </p>
      ) : (
        <p className="contextmenu" onClick={() => handleClickContextMenu('editBill')}>
          Изменить счет
        </p>
      )}
      <p className="contextmenu" onClick={() => handleClickContextMenu('printBill')}>
        Печать счета
      </p>
      <p className="contextmenu" onClick={() => handleClickContextMenu('printBillwhithoutStamp')}>
        Печать без штампа
      </p>
      <p className="contextmenu" onClick={() => handleClickContextMenu('deleteBill')}>
        Удалить счет
      </p>
      <hr className="contextMenuHr" />
      <p
        className="contextmenu"
        onClick={() => {
          isAppExist ? handleClickContextMenu('editApp') : handleClickContextMenu('createApp');
        }}
      >
        {isAppExist ? 'Изменить заявку' : 'Создать заявку'}
      </p>
      <p className="contextmenu" onClick={() => handleClickContextMenu('printApp')}>
        {appBtn}
        {/*Печать заявки*/}
      </p>
      <p className="contextmenu" onClick={() => handleClickContextMenu('addAppPdf')}>
        Добавить Заявку pdf
      </p>
      <hr className="contextMenuHr" />
      <p className="contextmenu" onClick={() => handleClickContextMenu('addTtn')}>
        Добавить ТТН
      </p>
      <p className="contextmenu" onClick={() => handleClickContextMenu('printTtn')}>
        Печать ТТН
      </p>
      <hr className="contextMenuHr" />
      <p className="contextmenu" onClick={() => handleClickContextMenu('sendEmail')}>
        Отправить Email
      </p>
    </div>
  );
};
