import React from "react";
import styles from "./Advertency.module.css";
import { ReactComponent as AdvertencyIcon } from "../../../../assets/AdvertencyIcon.svg";
import { Link } from "react-router-dom";

const Advertency = ({ text, type, addConnection, marginTop,customStyle }) => {
  return (
    <div
      className={`${styles.AdvertencyContainer} ${type == "error" && styles.AdvertencyContainerError}`}
      style={{ marginTop: marginTop,...customStyle }}
    >
      <div className={styles.AdvertencyIconContainer}>
        <AdvertencyIcon className={styles.icon} />
      </div>
      <div>
      {text}{" "}
      {addConnection && (
        <Link to={"https://myaccount.google.com/apppasswords"} className={styles.addConnection}>Aqui</Link>
      )}
      </div>
    </div>
  );
};

export default Advertency;
