import React from "react";
import minus from "../../assets/minus.svg";
import styles from "./DeleteButton.module.css";
const DeleteButton = ({ 
  action, 
  CustonIcon, 
  type,
  disabled, 
  customIconStyles,
  customStyleAssetLine ,
  colorIcon
}) => {
  return CustonIcon ? (
    <div className={styles.deleteContainer} onClick={action} style={{
      background: type == "black" ? "black" : type == "grey" ? "#4F5660":"",
      ...customIconStyles
    }}>
      <CustonIcon alt="Icon" style={{ width: "40%", height: "40%",color:colorIcon && colorIcon, fill:colorIcon && colorIcon }} />
    </div>
  ) : (
    <img
      src={minus}
      alt="Icon"
      className={`${styles.delete} ${disabled && styles.disabled}`}
      style={{
        background: type == "black" ? "black": type == "grey" ? "#4F5660":"",  ...customStyleAssetLine
      }}
      onClick={(e) => action(e)}
    />
  );
};

export default DeleteButton;
