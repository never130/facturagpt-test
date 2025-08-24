import { useEffect, useState } from "react";
import styles from "./DatePicker.module.css";
import { useTranslation } from "react-i18next";

const DatePicker = ({setDatePicker,firstDatePicker, secondDatePicker, order }) => {
  const [selectedDate, setSelectedDate] = useState();
  
  useEffect(()=>{
    order !== "second" && setSelectedDate(new Date().toISOString().split("T")[0]);
  },[])

  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation("dashboard");

  const handleDateChange = (event) => { 
      setSelectedDate(event.target.value);
      setDatePicker && setDatePicker(event.target.value)
  };

  return (
    <div className={styles.datePicker}>
      {order ? order === "first" ? 
      <input
        max={secondDatePicker}
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        autoFocus
        className={styles.input}
      />:
      <input
        min={firstDatePicker}
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        autoFocus
        className={styles.input}
      />:
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        autoFocus
        className={styles.input}
      />
    }
      
    </div>
  );
};

export default DatePicker;
