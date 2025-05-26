import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ClientData } from './types';
import { addData } from '../../actions/editDataAction';
import './clientForm.sass';

interface AddClientFormProps {
  onBack: () => void;
}

export const AddClientForm: React.FC<AddClientFormProps> = ({ onBack }) => {
  const dispatch = useDispatch();
  const [newClient, setNewClient] = useState<Partial<ClientData>>({
    nameOwner: '',
    fullNameOwner: '',
    TIN: '',
    address: '',
    email: '',
    phone: '',
    bossName: '',
    addInfo: '',
    KPP: '',
    OGRN: '',
    bankName: '',
    bankAddress: '',
    Acc: '',
    CorAcc: '',
    RCBIC: '',
    postAddress: '',
    email_copy1: '',
    phone_copy1: '',
  });
  const [editingField, setEditingField] = useState<keyof ClientData | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<Array<keyof ClientData>>([]);

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setNewClient(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDoubleClick = (field: keyof ClientData) => {
    setEditingField(field);
    setPreviousValue(newClient[field]?.toString() || null);
  };

  const handleBlur = (field: keyof ClientData) => {
    if (newClient[field] && !filledFields.includes(field)) {
      setFilledFields(prev => [...prev, field]);
    }
    setEditingField(null);
    setPreviousValue(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof ClientData) => {
    if (e.key === 'Enter') {
      if (newClient[field] && !filledFields.includes(field)) {
        setFilledFields(prev => [...prev, field]);
      }
      setEditingField(null);
      setPreviousValue(null);
    } else if (e.key === 'Escape' && editingField) {
      setNewClient(prev => ({
        ...prev,
        [editingField]: previousValue,
      }));
      setEditingField(null);
      setPreviousValue(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addData(newClient, 'ownerlogist'));
    onBack();
  };

  const renderInput = (field: keyof ClientData, value: string | null) => {
    if (editingField === field || !filledFields.includes(field)) {
      return (
        <input
          type={field.includes('email') ? 'email' : field.includes('phone') ? 'tel' : 'text'}
          value={value || ''}
          onChange={e => handleInputChange(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          onKeyDown={e => handleKeyDown(e, field)}
          className="detailInput"
          autoFocus={editingField === field}
          placeholder="Введите значение"
        />
      );
    }
    return <div onDoubleClick={() => handleDoubleClick(field)}>{value || '-'}</div>;
  };

  return (
    <div className="clientDetailsContainer">
      <div className="clientDetailsHeader">
        <button className="backButton" onClick={onBack}>
          Назад к списку
        </button>
        <button className="saveButton" onClick={handleSubmit}>
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
              <td className="detailCell">{renderInput('nameOwner', newClient.nameOwner)}</td>
              <td className="detailCell">
                {renderInput('fullNameOwner', newClient.fullNameOwner)}
              </td>
              <td className="detailCell">{renderInput('TIN', newClient.TIN)}</td>
              <td className="detailCell">{renderInput('address', newClient.address)}</td>
              <td className="detailCell">{renderInput('email', newClient.email)}</td>
              <td className="detailCell">{renderInput('phone', newClient.phone)}</td>
              <td className="detailCell">{renderInput('bossName', newClient.bossName)}</td>
              <td className="detailCell">{renderInput('addInfo', newClient.addInfo)}</td>
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
              <td className="detailCell">{renderInput('KPP', newClient.KPP)}</td>
              <td className="detailCell">{renderInput('OGRN', newClient.OGRN)}</td>
              <td className="detailCell">{renderInput('bankName', newClient.bankName)}</td>
              <td className="detailCell">{renderInput('bankAddress', newClient.bankAddress)}</td>
              <td className="detailCell">{renderInput('Acc', newClient.Acc)}</td>
              <td className="detailCell">{renderInput('CorAcc', newClient.CorAcc)}</td>
              <td className="detailCell">{renderInput('RCBIC', newClient.RCBIC)}</td>
              <td className="detailCell">{renderInput('postAddress', newClient.postAddress)}</td>
              <td className="detailCell">{renderInput('email_copy1', newClient.email_copy1)}</td>
              <td className="detailCell">{renderInput('phone_copy1', newClient.phone_copy1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
