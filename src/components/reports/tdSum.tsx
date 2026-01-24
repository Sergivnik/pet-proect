import React, { useEffect, useState } from 'react';

import './reports.sass';

interface TdSumProps {
  sum: number | null;
  isCtrl: boolean;
  handleClickSumm: (sum: number) => void;
}

export const TdSum = (props: TdSumProps) => {
  const [isChoisen, setIsChoisen] = useState<boolean>(false);

  useEffect(() => {
    if (!props.isCtrl) {
      setIsChoisen(false);
    }
  }, [props.isCtrl]);

  const styleTd = (isChoisen: boolean) => {
    if (isChoisen) {
      return 'cardReportTd grayTd';
    } else {
      return 'cardReportTd';
    }
  };
  const handleClickSumm = (e: any, sum: number) => {
    if (e.ctrlKey) {
      setIsChoisen(!isChoisen);
      if (isChoisen) {
        props.handleClickSumm(Number(-sum));
      } else {
        props.handleClickSumm(Number(sum));
      }
    }
  };

  return (
    <td
      data-name="sumTd"
      className={styleTd(isChoisen)}
      onClick={e => handleClickSumm(e, props.sum)}
    >
      {Number(props.sum).toFixed(2)}
    </td>
  );
};
