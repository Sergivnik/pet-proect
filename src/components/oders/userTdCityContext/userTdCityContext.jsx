import React, { useEffect, useState } from "react";
import { editOder } from "../../../actions/oderActions.js";
import { useDispatch } from "react-redux";

export const UserTdCityContext = (props) => {
  const [stylePUp, setStylePUp] = useState({ color: "#000000" });
  const [stylePDown, setStylePDown] = useState({ color: "#000000" });
  const [stylePDelete, setStylePDelete] = useState({ color: "#000000" });
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.loadingPointList.length === 1) {
      setStylePUp({ color: "#bbbbbb" });
      setStylePDown({ color: "#bbbbbb" });
      setStylePDelete({ color: "#bbbbbb" });
    }
    if (props.pId == 0) {
      setStylePUp({ color: "#bbbbbb" });
    }
    if (props.pId == props.loadingPointList.length - 1) {
      setStylePDown({ color: "#bbbbbb" });
    }
  }, [props.pId]);

  const handleClickUpCity = (e) => {
    e.stopPropagation();
    let [...arr] = props.loadingPointList;
    let pId = Number(props.pId);
    if (pId > 0) {
      arr[pId - 1] = props.loadingPointList[pId];
      arr[pId] = props.loadingPointList[pId - 1];
      if (props.colNumber == 3)
        dispatch(editOder(props.trId, "loadingPoint", arr, 'oderslist'));
      if (props.colNumber == 4)
        dispatch(editOder(props.trId, "unloadingPoint", arr, 'oderslist'));
      props.hideContextMenu();
    }
  };

  const handleClickDownCity = (e) => {
    e.stopPropagation();
    let [...arr] = props.loadingPointList;
    let pId = Number(props.pId);
    if (pId < props.loadingPointList.length - 1) {
      arr[pId] = props.loadingPointList[pId + 1];
      arr[pId + 1] = props.loadingPointList[pId];
      if (props.colNumber == 3)
        dispatch(editOder(props.trId, "loadingPoint", arr, 'oderslist'));
      if (props.colNumber == 4)
        dispatch(editOder(props.trId, "unloadingPoint", arr, 'oderslist'));
      props.hideContextMenu();
    }
  };

  const handleClickDeleteCity = (e) => {
    e.stopPropagation();
    if (props.loadingPointList.length > 1) {
      let [...arr] = props.loadingPointList;
      arr.splice(props.pId, 1);
      if (props.colNumber == 3)
        dispatch(editOder(props.trId, "loadingPoint", arr, 'oderslist'));
      if (props.colNumber == 4)
        dispatch(editOder(props.trId, "unloadingPoint", arr, 'oderslist'));
      props.hideContextMenu();
    }
  };

  return (
    <div className="odersDivContextMenu" style={props.coord}>
      <h4 className="odersContextH4">Выбрать действие</h4>
      <hr />
      <p className="odersContextP" onClick={props.handleClickAddCity}>
        Добавить место
      </p>
      <hr />
      <p className="odersContextP" style={stylePUp} onClick={handleClickUpCity}>
        Поднять место
      </p>
      <hr />
      <p
        className="odersContextP"
        style={stylePDown}
        onClick={handleClickDownCity}
      >
        Опустить место
      </p>
      <hr />
      <p
        className="odersContextP"
        style={stylePDelete}
        onClick={handleClickDeleteCity}
      >
        Удалить место
      </p>
      <hr />
    </div>
  );
};
