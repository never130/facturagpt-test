import React from "react";
import styles from "./CurrencyDropdownBtn.module.css";
import { ReactComponent as GrayArrow } from "../../assets/arrowDownBold.svg";
const CurrencyDropdownBtn = ({
  selectedCurrency,
  setShowSelectCurrencyPopup,
  setStyleFixed
}) => {
  return (
    <div className={styles.currencyContainer}>
      <div
        className={styles.currencyDropdownButton}
        onClick={() => {setShowSelectCurrencyPopup(true), setStyleFixed(true)}}
      >
        <span style={{ textTransform: "uppercase" }}>{selectedCurrency}</span>
        <GrayArrow className={styles.chevronIcon} color="#71717A" size={12} />
      </div>
    </div>
  );
};

export default CurrencyDropdownBtn;
