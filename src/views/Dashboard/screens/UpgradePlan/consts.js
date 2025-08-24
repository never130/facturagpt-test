import visaIcon from "../../assets/visaIcon.svg";
import mastercardIcon from "../../assets/mastercardIcon.svg";
import americanIcon from "../../assets/americanIcon.svg";
import paypalIcon from "../../assets/paypalIcon.svg";
import gPayIcon from "../../assets/gPayIcon.svg";
import applePayIcon from "../../assets/applePayIcon.svg";
import stripeIcon from "../../assets/stripeIcon.svg";
import metamaskIcon from "../../assets/metamaskIcon.svg";
import coinbaseIcon from "../../assets/coinbaseIcon.svg";
import klarnaIcon from "../../assets/klarnaIcon.svg";

export const paymentMethods = [
  {
    icons: [visaIcon, mastercardIcon, americanIcon],
    type: "creditCard",
    isDefault:true,
    disabledInput:false
  },
  {
    icons: [stripeIcon],
    type: "stripe",
    disabledInput:true
  },
  {
    icons: [paypalIcon],
    type: "paypal",
    disabledInput:true
  },
  {
    icons: [metamaskIcon],
    type: "metamask",
    disabledInput:true
  },
  {
    icons: [gPayIcon],
    type: "gPay",
    disabledInput:true
  },
  {
    icons: [coinbaseIcon],
    type: "crypto",
    disabledInput:true
  },
  {
    icons: [applePayIcon],
    type: "applePay",
    disabledInput:true
  },



];

export const currentPaymentMethods = [
  {
    icons: [gPayIcon],
    name: "gPay",
    title: "Google Pay",
    description: "***** **** ***** 0880",
    cvc: true,
  },
  
];

export const plansPricing = {
  Plus: {
    docs: "20-2.000 documentos",
    pricing: "3,99 € - 322,20 €",
  },
  Pro: {
    docs: "2.000-20.000 documentos",
    pricing: "322,20 € - 2.412,20 €",
  },
  Enterprise: {
    docs: "20.000-50.000 documentos",
    pricing: "2.412,20 € - 7.612,20 €",
  },
};
