export const formatAgoDate = ({ dateString, t }) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);

  let result = "";

  if (diffInSeconds < 60) {
    result = t("just_now", { ns: "Preview", });
  } else if (diffInMinutes < 60) {
    result = t(diffInMinutes === 1 ? "minutes_ago_one" : "minutes_ago_other", { ns: "Preview",count: diffInMinutes });
  } else if (diffInHours < 24) {
    result = t(diffInHours === 1 ? "hours_ago_one" : "hours_ago_other", { ns: "Preview",count: diffInHours });
  } else if (diffInDays < 30) {
    result = t(diffInDays === 1 ? "days_ago_one" : "days_ago_other", { ns: "Preview",count: diffInDays });
  } else if (diffInMonths < 12) {
    result = t(diffInMonths === 1 ? "months_ago_one" : "months_ago_other", { ns: "Preview",count: diffInMonths });
  } else {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    result = `${day}/${month}/${year}`;
  }

  return result;
};
