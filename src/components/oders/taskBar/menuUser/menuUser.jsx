import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './menuUser.sass';
import { checkLog } from '../../../../actions/tasksActions';
import { UserWindow } from '../../../userWindow/userWindow.jsx';
import { ClientForm } from '../../../clientPart/clientForm.tsx';

export const MenuUser = props => {
  const logList = useSelector(state => state.tasksReducer.logList);
  const dispatch = useDispatch();
  const { tasksNumber, user, handleClickTasks, handleClickUser, handleClickExit } = props;
  let showTimeout;
  let hideTimeout;
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showClient, setShowClient] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    clearTimeout(hideTimeout);
  };

  const handleMouseLeave = () => {
    if (isTooltipVisible) {
      clearTimeout(showTimeout);
      hideTimeout = setTimeout(() => {
        setIsTooltipVisible(false);
        setIsHovered(false);
      }, 3000);
    } else {
      setIsHovered(false);
      setIsTooltipVisible(false);
      clearTimeout(showTimeout);
    }
  };
  const handleClickTasksSpan = e => {
    if (e.target.className === 'tooltipSpanTask') handleClickTasks();
  };
  const handleClickUserSpan = e => {
    if (e.target.className === 'orderMenuUserSpan') handleClickUser();
  };
  const handleClickLogSpan = e => {
    console.log('logList:', logList);
    if (e.target.className === 'tooltipSpanTask') {
      dispatch(checkLog());
      setShowLogs(true);
      setIsTooltipVisible(false);
    }
  };
  const handleClickWindowClose = () => {
    setShowLogs(false);
    setShowClient(false);
  };
  const handleClickClientSpan = () => {
    console.log('admin', user.role);
    if (user.role == 'admin') {
      setShowClient(true);
      setIsTooltipVisible(false);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);
  useEffect(() => {
    showTimeout = setTimeout(() => {
      if (isHovered) {
        setIsTooltipVisible(true);
      }
    }, 1000);
  }, [isHovered]);

  return (
    <div className="orderMenuUser">
      {tasksNumber != null && tasksNumber != 0 && (
        <div className="orderMenuUserCircle" onClick={handleClickTasks}>
          {tasksNumber}
        </div>
      )}
      <span
        className="orderMenuUserSpan"
        onClick={handleClickUserSpan}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {user.name}
        {isTooltipVisible && isHovered && (
          <div className="tooltip">
            <span onClick={handleClickTasksSpan} className="tooltipSpanTask">
              Вход в список заданий ctrl+З
            </span>
            {user.role == 'admin' && (
              <span className="tooltipSpanTask" onClick={handleClickLogSpan}>
                Отчет логов ctrl+О
              </span>
            )}
            {user.role == 'admin' && (
              <span className="tooltipSpanTask" onClick={handleClickClientSpan}>
                Добавление клиента ctrl+К
              </span>
            )}
          </div>
        )}
      </span>
      <button className="orderMenuUserBtn" onClick={handleClickExit}>
        Выйти
      </button>
      {showLogs && (
        <UserWindow
          header="Список логов"
          width={400}
          handleClickWindowClose={handleClickWindowClose}
          windowId="logsWindow"
          left="-40%"
        >
          <dir className="logWrapper">
            <table>
              <thead>
                <tr>
                  <td>Дата время</td>
                  <td>ФИО</td>
                </tr>
              </thead>
              <tbody>
                {logList.map(log => {
                  return (
                    <tr key={`log${log.id}`}>
                      <td>{log.date}</td>
                      <td>{log.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </dir>
        </UserWindow>
      )}
      {showClient && (
        <UserWindow
          header="Добавление клиента"
          width={1250}
          handleClickWindowClose={handleClickWindowClose}
          windowId="clientWindow"
          left="-450%"
          top="300%"
        >
          <ClientForm />
        </UserWindow>
      )}
    </div>
  );
};
