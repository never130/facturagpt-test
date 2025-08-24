const { v4: uuidv4 } = require("uuid");

function generateUniqueToken() {
  return uuidv4();
}

function calculateExpirationDateFor30Min() {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + 30 * 60 * 1000);

  return expirationDate;
}

function calculateExpirationDateForOneDay() {
  const now = new Date();
  const expirationDate = new Date(now);

  expirationDate.setDate(expirationDate.getDate() + 1);
  expirationDate.setHours(now.getHours());
  expirationDate.setMinutes(now.getMinutes());
  expirationDate.setSeconds(now.getSeconds());

  return expirationDate;
}

function friendlyExpirationDate() {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const now = new Date();
  const expirationDate = new Date(now);
  expirationDate.setDate(expirationDate.getDate() + 1);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  let formattedExpiration = expirationDate.toLocaleString(undefined, options);

  formattedExpiration = formattedExpiration.replace(/ [A-Z]{3}$/, "");

  const dayOfWeek = formattedExpiration.split(",")[0];
  formattedExpiration = formattedExpiration.replace(
    dayOfWeek,
    capitalizeFirstLetter(dayOfWeek.trim())
  );

  return formattedExpiration;
}

module.exports = {
  generateUniqueToken,
  friendlyExpirationDate,
  calculateExpirationDateFor30Min,
  calculateExpirationDateForOneDay,
};
