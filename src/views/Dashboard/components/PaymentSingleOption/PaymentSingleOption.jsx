import React, { useState } from "react";
import styles from "./PaymentSingleOption.module.css";
import visaIcon from "../../assets/visaIcon.svg";

import mastercardIcon from "../../assets/mastercardIcon.svg";
import americanIcon from "../../assets/americanIcon.svg";
import paypalIcon from "../../assets/paypalIcon.svg";
import gPayIcon from "../../assets/gPayIcon.svg";
import applePayIcon from "../../assets/applePayIcon.svg";
import stripeIcon from "../../assets/stripeIcon.svg";
import metamaskIcon from "../../assets/metamaskIcon.svg";
import coinbaseIcon from "../../assets/coinbaseIcon.svg";
import { formatAgoDate } from "../../../../utils/agoDateUtil";

import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";


const PaymentSingleOption = ({
  icons,
  name,
  id,
  disabledInput,
  type,
  last4,
  isDefault,
  exp_month,
  exp_year,
  createdAt,
  setPaymethods,
  payMethods,
  onSaveUser,
  showDate = true
}) => {
  const { t } = useTranslation("Preview")
  const dispatch = useDispatch()


  const [cvcNumber, setCvcNumber] = useState("");
  const paymentIcons = [
    { type: "visa", icon: visaIcon },
    { type: "creditCard", icon: visaIcon },
    { type: "creditCard", icon: mastercardIcon },
    { type: "creditCard", icon: americanIcon },
    { type: "paypal", icon: paypalIcon },
    { type: "gPay", icon: gPayIcon },
    { type: "applePay", icon: applePayIcon },
    { type: "stripe", icon: stripeIcon },
    { type: "metamask", icon: metamaskIcon },
    { type: "crypto", icon: coinbaseIcon },

  ];
  
  const matchedIcons = paymentIcons.filter((item) => item.type === type);


  return (
    <div key={id} className={`${styles.paymentSingleOptionContainer} ${disabledInput && styles.paymentSingleOptionContainerDisabled}`} >

      <input
        type="radio"
        id={id}
        name="paymentMethod"
        checked={isDefault}
        onChange={async () => {
          if (!Array.isArray(payMethods)) return;
          const updatedPayMethods = payMethods.map((method) => ({
            ...method,
            default: method.id === id, 
          }));

          setPaymethods((prev) => ({
            ...prev,
            payMethod: updatedPayMethods
          }));

          setTimeout(() => {
            onSaveUser(updatedPayMethods);
          }, 0);


        }}

        className={disabledInput && styles.radioInputDisabled}
        disabled={disabledInput}
      />

      <div className={styles.paymentSingleOptionIcons}>
        {matchedIcons.map((item, index) => (
          <div key={index} className={styles.iconWrapper}>
            <img src={item.icon} alt={type} />
          </div>
        ))}
      </div>

      {type && showDate && (
        <div className={styles.paymentSingleOptionText}>
          <div>{type}</div>
          <span>***** **** ***** {last4}</span>
        </div>
      )}

      {showDate && formatAgoDate({dateString: createdAt,t} )}

    </div>
  );
};

export default PaymentSingleOption;
