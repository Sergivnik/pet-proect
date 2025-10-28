import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChoiseList } from "../../choiseList/choiseList.jsx";
import { addData, editData, delData } from "../../../actions/editDataAction.js";
import { Contractor } from "../../tsTypes.js";

import "./contractorsForm.sass";


export const ContractorsForm = () => {
  const dispatch = useDispatch();

  const contractorListFull: Contractor[] = useSelector(
    (state: any) => state.oderReducer.contractorsList
  );

  const [contractorList, setContractorList] = useState(contractorListFull);
  const [choisenContractorId, setChoisenContractorId] = useState<number | null>(
    null
  );
  const [chosenId, setChosenId] = useState<number | null>(null);
  const [currentContractor, setCurrentContractor] = useState<Contractor | null>(
    null
  );
  const [colNumber, setColNumber] = useState<number | null>(null);
  const [showAddTr, setShowAddTr] = useState<boolean>(false);
  const [newContractor, setNewContractor] = useState<Contractor | null>(null);

  useEffect(() => {
    if (choisenContractorId != null) {
      let list: Contractor[] = contractorListFull.filter(
        (contractor: Contractor) => contractor._id == choisenContractorId
      );
      setContractorList(list);
    } else {
      setContractorList(contractorListFull);
    }
  }, [contractorListFull]);
  useEffect(() => {
    if (showAddTr) {
      let div: Element = document.querySelector(".contractorMain");
      div.scrollTop = div.scrollHeight;
    }
  }, [showAddTr]);
  useEffect(() => {
    const onKeyPress = (e) => {
      if (e.key == "Escape") {
        setChosenId(null);
        setColNumber(null);
        setShowAddTr(null);
      }
      if (e.key == "Delete" && chosenId != null) {
        console.log(chosenId);
        let password: string = prompt("Подтвердите удаление", "Пароль");
        if (password == "Пароль") {
          dispatch(delData(chosenId, "contractors"));
        }
      }
    };
    document.addEventListener("keydown", onKeyPress);
    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [chosenId]);

  const setValue = (data: any) => {
    console.log(data);
    let list: Contractor[] = contractorListFull.filter(
      (contractor: Contractor) => contractor._id == data._id
    );
    setContractorList(list);
    setChoisenContractorId(data._id);
  };
  const handleClickReset = () => {
    setContractorList(contractorListFull);
    setChoisenContractorId(null);
  };
  const handleClickAdd = () => {
    if (showAddTr) {
      dispatch(addData(newContractor, "contractors"));
    }
    setShowAddTr(!showAddTr);
    setColNumber(0);
    setChosenId(null);
  };
  const handleClickTr = (contractor: Contractor) => {
    setChosenId(contractor._id);
    setCurrentContractor(contractor);
    if (contractor != currentContractor) setColNumber(null);
  };
  const handleDblClick = (e) => {
    let column: number = e.currentTarget.cellIndex;
    setColNumber(column);
  };
  const handleChange = (e) => {
    let contractor: Contractor = { ...currentContractor };
    switch (colNumber) {
      case 0:
        contractor.value = e.currentTarget.value;
        setCurrentContractor(contractor);
        break;
      case 1:
        contractor.fullName = e.currentTarget.value;
        setCurrentContractor(contractor);
        break;
      case 2:
        contractor.TIN = e.currentTarget.value;
        setCurrentContractor(contractor);
        break;
      default:
        break;
    }
  };
  const handleEnter = (e) => {
    if (e.key == "Enter") {
      setColNumber(null);
      dispatch(editData(currentContractor, "contractors"));
    }
  };
  const handleChangeAdd = (e) => {
    let contractor: Contractor = { ...newContractor };
    switch (colNumber) {
      case 0:
        contractor.value = e.currentTarget.value;
        setNewContractor(contractor);
        break;
      case 1:
        contractor.fullName = e.currentTarget.value;
        setNewContractor(contractor);
        break;
      case 2:
        contractor.TIN = e.currentTarget.value;
        setNewContractor(contractor);
        break;
      default:
        break;
    }
  };
  const handleBlur = () => {
    setColNumber(null);
  };
  const handleEnterAdd = (e) => {
    if (e.key == "Tab" || e.key == "Enter") {
      if (colNumber < 2) {
        setColNumber(colNumber + 1);
      } else {
        setColNumber(null);
      }
    }
  };
  return (
    <div className="contractorWrapper">
      <header className="contractorHeader">
        <h2 className="contractorHeaderH2">Таблица контрагентов</h2>
        <div className="contractorFilter">
          <div className="pointChoise">
            <ChoiseList
              name="point"
              arrlist={contractorList}
              setValue={setValue}
            />
          </div>
          <button className="pointAddBtn" onClick={handleClickReset}>
            Сброс
          </button>
          <button className="pointAddBtn" onClick={handleClickAdd}>
            {showAddTr ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </header>
      <main className="contractorMain">
        <table className="contractorTable">
          <thead className="contractorThead">
            <tr>
              <td className="contractorTD">Краткое название</td>
              <td className="contractorTD">Полное название</td>
              <td className="contractorTD">ИНН</td>
            </tr>
          </thead>
          <tbody>
            {contractorList.map((contractor: Contractor) => {
              return (
                <tr
                  key={`contractor-${contractor._id}`}
                  onClick={() => handleClickTr(contractor)}
                  className={
                    contractor._id == chosenId ? "contractorActiveTr" : ""
                  }
                >
                  <td className="contractorTD" onDoubleClick={handleDblClick}>
                    {colNumber == 0 && contractor._id == chosenId ? (
                      <input
                        type="text"
                        className="contractorInputTd"
                        value={
                          currentContractor.value ? currentContractor.value : ""
                        }
                        onChange={handleChange}
                      />
                    ) : (
                      contractor.value
                    )}
                  </td>
                  <td className="contractorTD" onDoubleClick={handleDblClick}>
                    {colNumber == 1 && contractor._id == chosenId ? (
                      <input
                        type="text"
                        className="contractorInputTd"
                        value={
                          currentContractor.fullName
                            ? currentContractor.fullName
                            : ""
                        }
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                      />
                    ) : (
                      contractor.fullName
                    )}
                  </td>
                  <td className="contractorTD" onDoubleClick={handleDblClick}>
                    {colNumber == 2 && contractor._id == chosenId ? (
                      <input
                        type="text"
                        className="contractorInputTd"
                        value={
                          currentContractor.TIN ? currentContractor.TIN : ""
                        }
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                      />
                    ) : (
                      contractor.TIN
                    )}
                  </td>
                </tr>
              );
            })}
            {showAddTr && (
              <tr className="contractorAddTr">
                <td className="contractorTD">
                  {colNumber == 0 ? (
                    <input
                      type="text"
                      className="contractorInputTd"
                      onChange={handleChangeAdd}
                      onBlur={handleBlur}
                      onKeyDown={handleEnterAdd}
                    />
                  ) : newContractor ? (
                    newContractor.value
                  ) : (
                    ""
                  )}
                </td>
                <td className="contractorTD">
                  {colNumber == 1 ? (
                    <input
                      type="text"
                      className="contractorInputTd"
                      onChange={handleChangeAdd}
                      onBlur={handleBlur}
                      onKeyDown={handleEnterAdd}
                    />
                  ) : newContractor ? (
                    newContractor.fullName
                  ) : (
                    ""
                  )}
                </td>
                <td className="contractorTD">
                  {colNumber == 2 ? (
                    <input
                      type="text"
                      className="contractorInputTd"
                      onChange={handleChangeAdd}
                      onBlur={handleBlur}
                      onKeyDown={handleEnterAdd}
                    />
                  ) : newContractor ? (
                    newContractor.TIN
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};
