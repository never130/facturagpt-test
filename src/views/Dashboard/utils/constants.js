export const getNextPaymentDate = (inputDate) => {
  const currentDate = inputDate ? new Date(inputDate) : new Date();

  const nextMonth = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear() + (nextMonth > 11 ? 1 : 0);
  const month = nextMonth % 12;

  const nextPaymentDate = new Date(year, month, 1);

  return nextPaymentDate.toISOString();
};

export const getPreviousPaymentDate = (inputDate) => {
  const currentDate = new Date(inputDate);

  const previousMonth = currentDate.getMonth() - 1;
  const year = currentDate.getFullYear() + (previousMonth < 0 ? -1 : 0);
  const month = (previousMonth + 12) % 12;

  const previousPaymentDate = new Date(year, month, 12, 0, 0, 0, 0);

  return previousPaymentDate.toISOString();
};

export const hasDatePassed = (dateString) => {
  const inputDate = new Date(dateString);

  const currentDate = new Date();

  return inputDate < currentDate;
};
