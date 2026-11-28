import React, { useEffect, useState } from 'react';
import { deposit, holder, CurrencySymbol } from '../stockType.tsx';
import './depositCurrencies.sass';

interface DepositCurrenciesProps {
  depositList: deposit[];
  holders: holder[];
}

export const DepositCurrencies = ({ depositList = [], holders = [] }: DepositCurrenciesProps) => {
  const currencies: CurrencySymbol[] = ['$', '€', '₽', '₺'];
  return (
    <div className="depositCurrnciesContent">
      <div className="depositCurrnciesHeader">
        {holders.map((holder: holder) => {
          return (
            <div key={`holder${holder.id}`} className="headerDiwHolderWrap">
              {holder.holderName}
            </div>
          );
        })}
      </div>
      {currencies.map((currencySymbol: CurrencySymbol) => {
        return (
          <div key={`currencySymbol${currencySymbol}`} className="currencySymbolString">
            <div className="currencySymbolWrap">{currencySymbol}</div>
            <div className="currencyHolderSum">
              {holders.map((holder: holder) => {
                const calcDepositBalance = (
                  depositList: deposit[],
                  currencySymbol: CurrencySymbol,
                  holderId: number
                ) => {
                  let listDepositHolderCurrency: deposit[] = depositList.filter(
                    (deposit: deposit) =>
                      deposit.currencySymbol === currencySymbol && deposit.holderId === holderId
                  );
                  let sumOfDepositCurrency: number = 0;
                  listDepositHolderCurrency.forEach((deposit: deposit) => {
                    if (deposit.txTypeId == 1) {
                      sumOfDepositCurrency =
                        sumOfDepositCurrency +
                        Number(deposit.sumDeposit) +
                        Number(deposit.sumInterest);
                    } else sumOfDepositCurrency = sumOfDepositCurrency - Number(deposit.sumDeposit);
                  });
                  return Math.round(sumOfDepositCurrency * 100) / 100;
                };
                return (
                  <div
                    key={`currencyHolderSum${currencySymbol}${holder.holderName}`}
                    className="currencyHolderSumWrap"
                  >
                    {calcDepositBalance(depositList, currencySymbol, Number(holder.id))}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
