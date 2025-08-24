import React, { useEffect } from "react";
import styles from "./CorporativeModalText.module.css";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import facturaGPT from "../../assets/FacturaGPTBlack.svg";
import circleLock from "../../assets/circleLock.svg"

const CorporativeModalText = ({ title, message, setState, action, setAction, father }) => {
  const { t } = useTranslation("navbarAdmin");

  const close = () => {
    setState(false);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'y') {
        setAction(true);
      } else if (event.key.toLowerCase() === 'n') {
        setState(false);
      }
    };

    if (action) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [action, setAction, setState]);

  return (
    <div style={{
      zIndex: "9099",
      position: "absolute"
    }}>
      <ModalBlackBgTemplate
        close={close}
        customStyle={father === "logout" ? {
          minHeight: "fit-content",
          width: "40%",
          maxWidth: "400px",
        } : {
          minHeight: "fit-content",
          width: "40%",
          height: "20%",
          zIndex: ""
        }}
      >

        <div className={styles.modalAndHeaderContainer} style={{ padding: father == "logout" && "0 0 8px 0" }} >
          <HeaderCard title={title} setState={setState}>

          </HeaderCard>
          {father !== 'logout' &&
            <div className={styles.textContainerGeneral}>

              <p>{message}</p>
            </div>}
          {father === 'logout' &&
            <div className={styles.modalContainer}>
              <div className={styles.CorporativeModalText}>
                {father === 'logout' && <div>
                  <img src={circleLock} alt="Icon" />
                </div>}

                {father === 'logout' &&
                  <div className={styles.textContainer}>
                    {t('AreYouSureYouWantToLogOut?')}
                    <p>{t('YouWillNeedToLogInAgainToContinue.')}</p>
                  </div>}


                {action && (
                  <div className={styles.buttonContainer}>

                    <Button
                      headerStyle={{ background: "var(--white-background)", color: 'var(--595959-color)', width: "90%", }}
                      action={() => setState(false)}
                    >
                      {t('cancel')} (N)
                    </Button>
                    <Button
                      headerStyle={{ width: "90%" }}
                      action={() => setAction(true)}
                    >
                      {t('confirm')} (Y)
                    </Button>
                  </div>
                )}


              </div>
            </div>}
          {father === 'logout' &&
            <div className={styles.iconContainer}>
              <img src={facturaGPT} alt="Icon" />
            </div>}
        </div>
      </ModalBlackBgTemplate>
    </div>
  );
};

export default CorporativeModalText;
