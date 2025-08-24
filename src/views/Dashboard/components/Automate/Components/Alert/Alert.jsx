import React from "react";
import styles from "./Alert.module.css";
import { ReactComponent as AdvertencyIcon } from "../../../../assets/AdvertencyIcon.svg";

const Alert = ({ text, children }) => {
  return (
    <div className={styles.advertencyContainer}>
      <div className={styles.advertencyContent}>
        <div className={styles.AdvertencyIconContainer}>
          <AdvertencyIcon />
        </div>
        <p>{text}</p>
      </div>
      {children}
    </div>
  );
};

export default Alert;
