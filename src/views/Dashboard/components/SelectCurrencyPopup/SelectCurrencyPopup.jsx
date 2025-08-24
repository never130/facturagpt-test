import React, { useState } from "react";
import styles from "./SelectCurrencyPopup.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import { ReactComponent as Check } from "../../assets/grayCheck.svg";
import { useTranslation } from "react-i18next";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";

const SelectCurrencyPopup = ({
  setShowSelectCurrencyPopup,
  setSelectedCurrency,
  selectedCurrency,
  symbolSelected,
  setSymbolSelected,
  handleConfigurationChange,
  configuration,
  setStyleFixed,
  styleFixed,
  father
}) => {

   const close = () => {
    setShowSelectCurrencyPopup(false)
    setStyleFixed(false)
  };
  

  const [selectedCode, setSelectedCode] = useState(selectedCurrency); 
  const [tempSelectedSymbol, setTempSelectedSymbol] = useState(symbolSelected);
  const currencies = [
    { name: "United States Dollar", code: "USD", symbol: "US$" },
    { name: "Euro", code: "EUR", symbol: "€" },
    { name: "British Pound", code: "GBP", symbol: "£" },
    { name: "Australian Dollar", code: "AUD", symbol: "A$" },
    { name: "Canadian Dollar", code: "CAD", symbol: "CA$" },
    { name: "Israeli Shekel", code: "ILS", symbol: "₪" },
    { name: "Brazilian Real", code: "BRL", symbol: "R$" },
    { name: "Hong Kong Dollar", code: "HKD", symbol: "HK$" },
    { name: "Swedish Krona", code: "SEK", symbol: "SEK" },
    { name: "New Zealand Dollar", code: "NZD", symbol: "NZ$" },
    { name: "Singapore Dollar", code: "SGD", symbol: "SGD" },
    { name: "Swiss Franc", code: "CHF", symbol: "CHF" },
    { name: "South African Rand", code: "ZAR", symbol: "ZAR" },
    { name: "Chinese Renminbi Yuan", code: "CNY", symbol: "CN¥" },
    { name: "Indian Rupee", code: "INR", symbol: "₹" },
    { name: "Malaysian Ringgit", code: "MYR", symbol: "MYR" },
    { name: "Mexican Peso", code: "MXN", symbol: "MX$" },
    { name: "Pakistani Rupee", code: "PKR", symbol: "PKR" },
    { name: "Philippine Peso", code: "PHP", symbol: "₱" },
    { name: "New Taiwan Dollar", code: "TWD", symbol: "NT$" },
    { name: "Thai Baht", code: "THB", symbol: "THB" },
    { name: "Turkish New Lira", code: "TRY", symbol: "TRY" },
    { name: "United Arab Emirates Dirham", code: "AED", symbol: "AED" },
  ];
  const [t] = useTranslation("InvoiceForm");

  const handleSelectCurrency = (currency) => {
    setSelectedCode(currency.code); 
    setTempSelectedSymbol(currency.symbol);
  };

  const handleConfirmSelection = () => {
    const updateCurrencyInTotalAmount = {
      ...configuration?.totalAmount,
      currency: selectedCode,
    };
    if (selectedCode) {
      setSelectedCurrency(selectedCode); 
      setShowSelectCurrencyPopup(false); 
      setSymbolSelected(tempSelectedSymbol);
      handleConfigurationChange("totalAmount", updateCurrencyInTotalAmount);
    }
    setStyleFixed(false)
  };


  return (
    <div style={ father == "general" ? {
      zIndex: "9099",
      position: "absolute"
    }:{}}>

    { father == "general" ? <ModalBlackBgTemplate
        close={close}
        customStyle={{minHeight: "fit-content",
    height: "0%",
    width: "70%",
    maxHeight:"fit-content"
  }}
      >

      <div className={styles.ShowSelectCurrencyPopup} style={{padding:" 0px 0px 8px", position: "relative",}}>
        <HeaderCard
          title={t('selectCurrency')}
          setState={setShowSelectCurrencyPopup}
        >
          <Button type="white" action={() => {setShowSelectCurrencyPopup(false), setStyleFixed(false)}}>
            {t('cancel')}
          </Button>
          <Button action={handleConfirmSelection} disabled={!selectedCode}>
            {t('select')}
          </Button>
        </HeaderCard>
      <div className={styles.scroll}>
      <div className={styles.currencyContent}>
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className={`${styles.currencyItem} ${
                selectedCode === currency.code ? styles.selected : ""
              }`}
              onClick={() => handleSelectCurrency(currency)}
            >
              <div>
                <p
                  className={`${styles.currencyName} ${
                    selectedCode === currency.code ? styles.selectedName : ""
                  }`}
                >
                  {currency.name}
                </p>
                <p className={styles.currencyDesc}>
                  ({currency.symbol}) {currency.code}
                </p>
              </div>
              {selectedCode === currency.code && <Check />}
            </div>
          ))}
        </div>
      </div>
      </div>

        </ModalBlackBgTemplate>: <>
         <div
        className={styleFixed ? styles.bgFixed : styles.bg} 
        onClick={() => {setShowSelectCurrencyPopup(false),setStyleFixed(false)}}
      ></div>
      <div className={styles.ShowSelectCurrencyPopup}>
        <HeaderCard
          title={t('selectCurrency')}
          setState={setShowSelectCurrencyPopup}
        >
          <Button type="white" action={() => {setShowSelectCurrencyPopup(false), setStyleFixed(false)}}>
            {t('cancel')}
          </Button>
          <Button action={handleConfirmSelection} disabled={!selectedCode}>
            {t('select')}
          </Button>
        </HeaderCard>
      <div className={styles.scroll}>
      <div className={styles.currencyContent}>
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className={`${styles.currencyItem} ${
                selectedCode === currency.code ? styles.selected : ""
              }`}
              onClick={() => handleSelectCurrency(currency)}
            >
              <div>
                <p
                  className={`${styles.currencyName} ${
                    selectedCode === currency.code ? styles.selectedName : ""
                  }`}
                >
                  {currency.name}
                </p>
                <p className={styles.currencyDesc}>
                  ({currency.symbol}) {currency.code}
                </p>
              </div>
              {selectedCode === currency.code && <Check />}
            </div>
          ))}
        </div>
      </div>
      </div>
        
        </> }
    </div>
  );
};

export default SelectCurrencyPopup;
