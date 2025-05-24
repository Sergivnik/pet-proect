import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ClientData } from './types.ts';
import { editData } from '../../actions/editDataAction.js';
import './clientForm.sass';

export const ClientDetails = ({ client, onBack }: { client: ClientData; onBack: () => void }) => {
  const dispatch = useDispatch();
  const [editedClient, setEditedClient] = useState<ClientData>(client);
  const [editingField, setEditingField] = useState<keyof ClientData | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setEditedClient(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleDoubleClick = (field: keyof ClientData) => {
    setEditingField(field);
    setPreviousValue(editedClient[field]?.toString() || null);
  };

  const handleBlur = () => {
    setEditingField(null);
    setPreviousValue(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditingField(null);
      setPreviousValue(null);
    } else if (e.key === 'Escape' && editingField) {
      setEditedClient(prev => ({
        ...prev,
        [editingField]: previousValue,
      }));
      setEditingField(null);
      setPreviousValue(null);
    }
  };

  const handleSave = () => {
    if (!isSaved) {
      dispatch(editData(editedClient, 'ownerlogist'));
      setIsSaved(true);
    }
  };

  const handleBack = () => {
    if (!isSaved) {
      const confirm = window.confirm(
        'Есть несохраненные изменения. Вы уверены, что хотите выйти без сохранения?'
      );
      if (confirm) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const renderCell = (field: keyof ClientData, value: string | null) => {
    if (editingField === field) {
      return (
        <input
          type={field.includes('email') ? 'email' : field.includes('phone') ? 'tel' : 'text'}
          value={value || ''}
          onChange={e => handleInputChange(field, e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="detailInput"
          autoFocus
        />
      );
    }
    return <div onDoubleClick={() => handleDoubleClick(field)}>{value || '-'}</div>;
  };

  return (
    <div className="clientDetailsContainer">
      <div className="clientDetailsHeader">
        <button className="backButton" onClick={handleBack}>
          Назад к списку
        </button>
        <button className="saveButton" onClick={handleSave}>
          Сохранить
        </button>
      </div>
      <div className="clientDetailsTables">
        <table className="mainDataTable">
          <thead>
            <tr>
              <th className="detailHeader">Название</th>
              <th className="detailHeader">Полное название</th>
              <th className="detailHeader">ИНН</th>
              <th className="detailHeader">Адрес</th>
              <th className="detailHeader">Email</th>
              <th className="detailHeader">Телефон</th>
              <th className="detailHeader">Руководитель</th>
              <th className="detailHeader">Доп. информация</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="detailCell">{renderCell('nameOwner', editedClient.nameOwner)}</td>
              <td className="detailCell">
                {renderCell('fullNameOwner', editedClient.fullNameOwner)}
              </td>
              <td className="detailCell">{renderCell('TIN', editedClient.TIN)}</td>
              <td className="detailCell">{renderCell('address', editedClient.address)}</td>
              <td className="detailCell">{renderCell('email', editedClient.email)}</td>
              <td className="detailCell">{renderCell('phone', editedClient.phone)}</td>
              <td className="detailCell">{renderCell('bossName', editedClient.bossName)}</td>
              <td className="detailCell">{renderCell('addInfo', editedClient.addInfo)}</td>
            </tr>
          </tbody>
        </table>

        <table className="otherDataTable">
          <thead>
            <tr>
              <th className="detailHeader">КПП</th>
              <th className="detailHeader">ОГРН</th>
              <th className="detailHeader">Банк</th>
              <th className="detailHeader">Адрес банка</th>
              <th className="detailHeader">Расчетный счет</th>
              <th className="detailHeader">Корр. счет</th>
              <th className="detailHeader">БИК</th>
              <th className="detailHeader">Почтовый адрес</th>
              <th className="detailHeader">Доп. email</th>
              <th className="detailHeader">Доп. телефон</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="detailCell">{renderCell('KPP', editedClient.KPP)}</td>
              <td className="detailCell">{renderCell('OGRN', editedClient.OGRN)}</td>
              <td className="detailCell">{renderCell('bankName', editedClient.bankName)}</td>
              <td className="detailCell">{renderCell('bankAddress', editedClient.bankAddress)}</td>
              <td className="detailCell">{renderCell('Acc', editedClient.Acc)}</td>
              <td className="detailCell">{renderCell('CorAcc', editedClient.CorAcc)}</td>
              <td className="detailCell">{renderCell('RCBIC', editedClient.RCBIC)}</td>
              <td className="detailCell">{renderCell('postAddress', editedClient.postAddress)}</td>
              <td className="detailCell">{renderCell('email_copy1', editedClient.email_copy1)}</td>
              <td className="detailCell">{renderCell('phone_copy1', editedClient.phone_copy1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
