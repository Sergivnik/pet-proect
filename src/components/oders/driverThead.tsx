import React from 'react';

interface Props {
  getColStyle: (index: number) => { width: string; minWidth: number };
}

export const DriverThead: React.FC<Props> = ({ getColStyle }) => {
  return (
    <thead style={{ position: 'sticky', top: 0, zIndex: 2 }} className="virtualTHead">
      <tr>
        <th style={{ ...getColStyle(0), position: 'relative' }}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Дата</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>

        <th style={getColStyle(1)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Водитель</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(2)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Заказчик</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(3)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Погрузка</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(4)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Выгрузка</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(5)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Цена клиента</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(6)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Цена водителя</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(7)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Выполнен</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(8)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Док-ты</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(9)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Клиент Оплата</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(10)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Водитель Оплата</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
        <th style={getColStyle(11)}>
          <span style={{ marginRight: '20px', display: 'inline-block' }}>Номер счета</span>
          <svg
            width="18" // 12 * 1.5
            height="18" // 12 * 1.5
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              bottom: '4px', // отступ от низа
              right: '4px', // отступ от правого края
            }}
          >
            <path
              d="M2 4 L6 8 L10 4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </th>
      </tr>
    </thead>
  );
};
