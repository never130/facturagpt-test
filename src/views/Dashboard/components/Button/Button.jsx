import React, { useEffect, useState } from "react";
import styles from "./Button.module.css";



const Button = ({
  children,
  type = "green",
  action,
  headerStyle = {},
  disabledOption = false,
  actionCategory,
  fromWhere,
  filteredUserAutomationSelected,
  rounded = false,
}) => {
  const typeClasses = {
    green: styles.buttonTemplateGreen,
    white: styles.buttonTemplateWhite,
    gray: styles.buttonTemplateGray,
    lightGray: styles.buttonTemplateLightGray,
    discard: styles.buttonTemplateDiscard,
    button: styles.buttonTemplateButton,
    border: styles.buttonTemplateBorder,
  };

  return (
    <button
      onClick={actionCategory ? () => actionCategory(true) : action}
      type="button"
      className={`${styles.buttonTemplate} ${typeClasses[type] || ""} ${filteredUserAutomationSelected ? styles.filteredUserAutomationSelected : ""}`}
      style={{
        ...(fromWhere
          ? { background: "var(--white-background)", color: "var(--black-color)", border: "1px solid gray" }
          : headerStyle),
        ...(rounded ? { borderRadius: "999px" } : {})
      }}
      disabled={disabledOption}
    >
      {children}
    </button>
  );
};



export const ButtonDiferentContentScreen = ({ threshold, smallContent, largeContent, buttonProps }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
      <Button {...buttonProps} >
        {screenWidth < threshold ? smallContent : largeContent}
      </Button>

  );
};

export default Button;
