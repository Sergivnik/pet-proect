import React, { useState, useEffect } from 'react';
import { Bill } from './bill';
import { Act } from './act.tsx';
import { OrderType } from '../tsTypes.ts';
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

export const DocFormNew = ({ order, currentTable }: DocFormNewProps) => {
  const [checkBoxesValue, setCheckBoxesValue] = useState<checkBoxType>({
    ttn: false,
    contract: false,
    app: false,
    trackTrailer: false,
    dateFromApp: false,
    reason: false,
  });
  const [choisenTypeDoc, setChosenTypeDoc] = useState<string | null>(null);
  const [ttnData, setTtnData] = useState<string>('');
  const [editTtn, setEditTtn] = useState<boolean>(true);
  const [addData, setAddData] = useState({ checkBoxesValue, ttnData });

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
  const blockDblClk = e => {
    e.stopPropagation();
  };
  const getClassTypeDoc = (id: string) => {
    if (id === choisenTypeDoc) {
      return 'typeOfDoc typeOfDocActive';
    } else {
      return 'typeOfDoc';
    }
  };
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
              <input
                type="text"
                value={ttnData}
                onChange={getTtnData}
                onKeyDown={handleEnterTtn}
                onDoubleClick={blockDblClk}
              />
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
          <button>Добавить строку</button>
          <button>Сохранить</button>
        </div>
      </div>
      <div className="wrapperTable">
        <Bill order={order} addData={addData} currentTable={currentTable} />
        <Act />
      </div>
    </React.Fragment>
  );
};
