import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { findValueBy_Id, dateLocal } from "../myLib/myLib.js";
import { ChoiseList } from "../choiseList/choiseList.jsx";

import "./editData.sass";

export const TrackDraverAddTr = (props) => {
  const driversListFull = useSelector((state) => state.oderReducer.driverlist);
  const tracklistFull = useSelector((state) => state.oderReducer.tracklist);

  const [editColNumber, setEditColNumber] = useState(0);
  const [addTrackDriverObj, setAddTrackDriverObj] = useState({});
  const [tracklist, setTracklist] = useState(tracklistFull);

  const getKeyObj = (col) => {
    switch (col) {
      case 0:
        return "value";
      case 1:
        return "name";
      case 2:
        return "shortName";
      case 3:
        return "passportNumber";
      case 4:
        return "department";
      case 5:
        return "dateOfIssue";
      case 6:
        return "driverLicense";
      case 7:
        return "phoneNumber";
      default:
        break;
    }
  };
  const handleEnter = (e) => {
    if (e.key == "Enter") {
      if (
        addTrackDriverObj.value != "" &&
        addTrackDriverObj.value != undefined
      ) {
        let obj = { ...addTrackDriverObj };
        switch (editColNumber) {
          case 0:
            obj.value = e.currentTarget.value;
            break;
          case 1:
            obj.name = e.currentTarget.value;
            break;
          case 2:
            obj.shortName = e.currentTarget.value;
            break;
          case 3:
            obj.passportNumber = e.currentTarget.value;
            break;
          case 4:
            obj.department = e.currentTarget.value;
            break;
          case 5:
            obj.dateOfIssue = e.currentTarget.value;
            break;
          case 6:
            obj.driverLicense = e.currentTarget.value;
            break;
          case 7:
            obj.phoneNumber = e.currentTarget.value;
            break;
          default:
            break;
        }
        if (obj.dateOfIssue == "") obj.dateOfIssue = null;
        setAddTrackDriverObj(obj);
        props.handleAddTrackDriver(obj);
      } else {
        setEditColNumber(0);
        if (e.currentTarget.tagName == "INPUT" && e.currentTarget.value != "") {
          let { ...obj } = addTrackDriverObj;
          obj.value = e.currentTarget.value;
          props.handleAddTrackDriver(obj);
        }
      }
    }
    if (e.key == "Tab") {
      let { ...obj } = addTrackDriverObj;
      switch (editColNumber) {
        case 0:
          obj.value = e.currentTarget.value;
          setEditColNumber(editColNumber + 1);
          break;
        case 1:
          obj.name = e.currentTarget.value;
          setEditColNumber(editColNumber + 1);
          break;
        case 2:
          obj.shortName = e.currentTarget.value;
          setEditColNumber(editColNumber + 1);
          break;
        case 3:
          obj.passportNumber = e.currentTarget.value;
          setEditColNumber(editColNumber + 1);
          break;
        case 4:
          obj.department = e.currentTarget.value;
          setEditColNumber(editColNumber + 1);
          break;
        case 5:
          obj.dateOfIssue = e.currentTarget.value;
          setEditColNumber(editColNumber + 1);
          break;
        case 6:
          obj.driverLicense = e.currentTarget.value;
          setEditColNumber(editColNumber + 1);
          break;
        case 7:
          obj.phoneNumber = e.currentTarget.value;
          setEditColNumber(editColNumber + 2);
          break;
        default:
          break;
      }
      setAddTrackDriverObj(obj);
    }
  };
  const handleLostFocus = (e) => {
    let obj = { ...addTrackDriverObj };
    switch (editColNumber) {
      case 0:
        obj.value = e.currentTarget.value;
        break;
      case 1:
        obj.name = e.currentTarget.value;
        break;
      case 2:
        obj.shortName = e.currentTarget.value;
        break;
      case 3:
        obj.passportNumber = e.currentTarget.value;
        break;
      case 4:
        obj.department = e.currentTarget.value;
        break;
      case 5:
        obj.dateOfIssue = e.currentTarget.value;
        break;
      case 6:
        obj.driverLicense = e.currentTarget.value;
        break;
      case 7:
        obj.phoneNumber = e.currentTarget.value;
        break;
      default:
        break;
    }
    setAddTrackDriverObj(obj);
  };
  const setValue = (data) => {
    let { ...obj } = addTrackDriverObj;
    if (editColNumber == 8) {
      obj.idOwner = data._id;
      setEditColNumber(editColNumber + 1);
      setAddTrackDriverObj(obj);
    }
    if (editColNumber == 9) {
      if (obj.value != "") {
        obj.idTrack = data._id;
        setEditColNumber(null);
        props.handleAddTrackDriver(obj);
      } else {
        setEditColNumber(0);
      }
    }
  };
  const handleClick = (e) => {
    setEditColNumber(e.currentTarget.cellIndex);
  };
  const handleChange = (e) => {
    let obj = { ...addTrackDriverObj };
    obj[getKeyObj(editColNumber)] = e.currentTarget.value;
    setAddTrackDriverObj(obj);
  };

  useEffect(() => {
    let div = document.querySelector(".EDFTableDiv");
    div.scrollTop = div.scrollHeight;
    if (props.driverId != null) {
      let arr = tracklistFull.filter((elem) => elem.idOwner == props.driverId);
      let { ...obj } = addTrackDriverObj;
      obj.idOwner = props.driverId;
      setAddTrackDriverObj(obj);
      setTracklist(arr);
    }
  }, []);
  useEffect(() => {
    if (editColNumber < 8 && editColNumber != null) {
      let parent = document.querySelector(".driverAddTr");
      let input = parent.querySelector(".driverTrInput");
      input.focus();
    }
  }, [editColNumber]);

  return (
    <tr className="driverAddTr">
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 0 ? (
          <input
            type="text"
            className="driverTrInput"
            onKeyDown={handleEnter}
            onBlur={handleLostFocus}
            value={addTrackDriverObj.value}
            onChange={handleChange}
          />
        ) : (
          addTrackDriverObj.value
        )}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 1 ? (
          <input
            type="text"
            className="driverTrInput"
            onKeyDown={handleEnter}
            onBlur={handleLostFocus}
            value={addTrackDriverObj.name}
            onChange={handleChange}
          />
        ) : (
          addTrackDriverObj.name
        )}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 2 ? (
          <input
            type="text"
            className="driverTrInput"
            onKeyDown={handleEnter}
            onBlur={handleLostFocus}
            value={addTrackDriverObj.shortName}
            onChange={handleChange}
          />
        ) : (
          addTrackDriverObj.shortName
        )}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 3 ? (
          <input
            type="text"
            className="driverTrInput"
            onKeyDown={handleEnter}
            onBlur={handleLostFocus}
            value={addTrackDriverObj.passportNumber}
            onChange={handleChange}
          />
        ) : (
          addTrackDriverObj.passportNumber
        )}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 4 ? (
          <input
            type="text"
            className="driverTrInput"
            onKeyDown={handleEnter}
            onBlur={handleLostFocus}
            value={addTrackDriverObj.department}
            onChange={handleChange}
          />
        ) : (
          addTrackDriverObj.department
        )}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 5 ? (
          <input
            type="date"
            className="driverTrInput"
            onKeyDown={handleEnter}
            onBlur={handleLostFocus}
            value={addTrackDriverObj.dateOfIssue}
            onChange={handleChange}
          />
        ) : (
          dateLocal(addTrackDriverObj.dateOfIssue)
        )}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 6 ? (
          <input
            type="text"
            className="driverTrInput"
            onKeyDown={handleEnter}
            onBlur={handleLostFocus}
            value={addTrackDriverObj.driverLicense}
            onChange={handleChange}
          />
        ) : (
          addTrackDriverObj.driverLicense
        )}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 7 ? (
          <input
            type="text"
            className="driverTrInput"
            onKeyDown={handleEnter}
            onBlur={handleLostFocus}
            value={addTrackDriverObj.phoneNumber}
            onChange={handleChange}
          />
        ) : (
          addTrackDriverObj.phoneNumber
        )}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {findValueBy_Id(addTrackDriverObj.idOwner, driversListFull).value}
      </td>
      <td className="trackDriverTd" onClick={handleClick}>
        {editColNumber == 9 ? (
          <ChoiseList name="track" arrlist={tracklist} setValue={setValue} />
        ) : (
          findValueBy_Id(addTrackDriverObj.idTrack, tracklist).value
        )}
      </td>
    </tr>
  );
};
