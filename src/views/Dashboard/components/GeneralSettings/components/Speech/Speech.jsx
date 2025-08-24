import React, { useState,useCallback } from "react";
import styles from "./speech.module.css";
import { useTranslation } from "react-i18next";

import CustomDropdown from "../../../CustomDropdown/CustomDropdown";


const Speech = ({ userData, setUserData

}) => {
  const { t } = useTranslation("accountSetting")

  const changeLenguage = useCallback(
      (lenguage) => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          speechLenguage: lenguage,
        }));
      },
      [setUserData]
    );

      const changeVoice = useCallback(
      (voice) => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          speechVoice: voice,
        }));
      },
      [setUserData]
    );
 
  return (
    <div className={styles.generalContainer}>
       <div className={styles.labelGeneral} >
        <div className={styles.row}>
          
          <p>{t('voice')}</p>
          <div>
          <CustomDropdown
        generalStyleFilterSort={{fontSize: "14px",
         color: "black",
         fontWeight: "400",background:"transparent"}}
        generalDropdownHeader={{color: "black", fontSize:"15px", fontWeight: "400", marginLeft:"29px"}}  
        height="25px"
        options={[t('woman'), t('man')]}
        selectedOption={userData.speechVoice||`${t('woman')}/${t('man')}` }
        setSelectedOption={changeVoice}
        father={"general"}/>
          </div>
        </div>
      </div>
       <div className={styles.labelGeneral}>
        <div className={styles.row}>
          <p>{t('lenguage')}</p>
    <div>
          <CustomDropdown
        generalStyleFilterSort={{fontSize: "14px",
         color: "black",
         fontWeight: "400",background:"transparent"}}
        generalDropdownHeader={{color: "black", fontSize:"15px", fontWeight: "400", marginLeft:"29px"}}  
        height="25px"
        options={[t('auto'), t('detect')]}
        selectedOption={userData?.speechLenguage || `${t('auto')}/${t('detect')}`}
        setSelectedOption={changeLenguage}
        father={"general"}/>
          </div>        
        </div>
      </div>
    </div>
  );
};

export default Speech;
