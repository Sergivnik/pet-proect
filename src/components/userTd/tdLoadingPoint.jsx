import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import { UserTdCityContext } from '../oders/userTdCityContext/userTdCityContext.jsx';

export const TdLoadingPoint = props => {
  const dispatch = useDispatch();
  const citieslist = useSelector(state => state.oderReducer.citieslist);

  const [pointLoadInfo, setPointLoadingInfo] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [editCityIndex, setEditCityIndex] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [pIndex, setPIndex] = useState(null);
  const [addPoint, setAddPoint] = useState(false);
  const [coord, setCoord] = useState({ left: 0, top: 0 });

  const getValue = (id, arrObj) => {
    if (id) {
      let value = arrObj.find(elem => elem._id == id);
      return value.value;
    }
  };
  const handleMouseOver = e => {
    if (props.loadingInfo) {
      if (props.loadingInfo.length > 0) setPointLoadingInfo(props.loadingInfo[e.currentTarget.id]);
    }
  };
  const handleMouseLeave = () => {
    setPointLoadingInfo(null);
  };
  const handleDBLClick = e => {
    setEditCityIndex(Number(e.currentTarget.id));
    let element = e.currentTarget.parentElement.parentElement;
    if (props.edit) {
      setShowEdit(true);
      element.parentElement.style.backgroundColor = '#fff';
      setCurrentId(element.parentElement.id);
    }
  };
  const setValue = data => {
    let [...arr] = props.idLoadingPoint;
    if (addPoint) {
      arr.push(data._id);
    } else {
      arr[data.index] = data._id;
    }
    dispatch(editOder(currentId, 'loadingPoint', arr, 'oderslist'));
    setShowEdit(false);
    setCurrentId(null);
    setAddPoint(false);
  };
  const handleContext = e => {
    let TdX = e.currentTarget.offsetParent.getBoundingClientRect().x;
    let X = e.clientX;
    let TdY = e.currentTarget.offsetParent.getBoundingClientRect().y;
    let Y = e.clientY;
    setCoord({ left: X - TdX, top: Y - TdY });
    if (props.edit) {
      e.preventDefault();
      props.getCurrentTR();
      let id = e.currentTarget.parentElement.parentElement.parentElement.id;
      setPIndex(e.currentTarget.id);
      setCurrentId(Number(id));
      setShowContextMenu(true);
    }
  };
  const hideContextMenu = () => {
    setShowContextMenu(false);
  };
  const handleClickAddCity = () => {
    setAddPoint(true);
    setShowContextMenu(false);
    setShowEdit(true);
  };

  useEffect(() => {
    if (props.currentTR != currentId) {
      setShowEdit(false);
      setCurrentId(null);
    }
  }, [props.currentTR]);
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        if (showContextMenu) setShowContextMenu(false);
        if (showEdit) {
          setShowEdit(false);
          setCurrentId(null);
          setCoord({ left: 0, top: 0 });
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [showContextMenu, showEdit]);

  return (
    <td style={props.style} className="userTd mobileViewOff">
      {pointLoadInfo && <div className="oderTdTooltip">{pointLoadInfo}</div>}
      {props.idLoadingPoint.map((idCity, index) =>
        showEdit ? (
          <div className="divChoise" key={`ChoiseList-${index}`}>
            <ChoiseList
              name="loadingPoint"
              parent="oders"
              arrlist={citieslist}
              setValue={setValue}
              index={editCityIndex}
            />
          </div>
        ) : (
          <div className="odersDivP" key={`divLP-${index}`}>
            <p
              className="odersP"
              id={index}
              onDoubleClick={handleDBLClick}
              onContextMenu={handleContext}
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
            >
              {getValue(idCity, citieslist)}
            </p>
            {showContextMenu && currentId == props.currentTR && pIndex == index && (
              <UserTdCityContext
                coord={coord}
                loadingPointList={props.idLoadingPoint}
                hideContextMenu={hideContextMenu}
                trId={currentId}
                pId={pIndex}
                colNumber={3}
                handleClickAddCity={handleClickAddCity}
              />
            )}
          </div>
        )
      )}
    </td>
  );
};
