const dataSupportForm = require("./support-form");
const dataPromoEmail = require("./promo-email");
const dataConfirmEmail = require("./confirm-email");
const dataRecoverPassword = require("./recover-password");
const dataConfirmAccess = require("./confirm-access");
const dataEndedPremium = require("./ended-premium");
const dataPremiumConfirm = require("./premium-confirm");
const dataStartPremium = require("./start-premium");
const dataApiStatusError = require("./api-status-error"); 




const getData = (input, lan = 'es') => {
  const words = input
    .split("-")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    );

  const camelCaseString = words.join("");

  const camelCaseResult =
    "data" + camelCaseString.charAt(0).toUpperCase() + camelCaseString.slice(1);

  if (typeof eval(camelCaseResult) !== "undefined") {
    const data = eval(camelCaseResult)
    return data[lan];
  } else {
    return null
  }
};

module.exports = { getData };
