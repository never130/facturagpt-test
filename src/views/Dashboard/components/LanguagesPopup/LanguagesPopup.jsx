import React from 'react'
import styles from './LanguagesPopup.module.css'
import { languageFlags } from "../../../../utils/flags";
import HeaderCard from '../HeaderCard/HeaderCard';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18';


const LanguagesPopup = ({ setShowlanguageMobile }) => {
    const [t] = useTranslation("Landing");

    const handleLanguage = (lng) => {
        localStorage.setItem("language", lng);
        i18n.changeLanguage(lng);
    };

    return (
      <>
      
        <div className={styles.LanguagesPopupContainer}>
          <HeaderCard title={t('selectLanguage')} setState={setShowlanguageMobile}/>

          <div className={styles.containerLanguages}>
            <div className={styles.content}>
                   {languageFlags.map((item) => (
                    <div
                        key={item.code || item.value} 
                        onClick={() => {
                            handleLanguage(item.label)
                        }}

                    >
                        {item.flag}
                        {item.value}
                        {item.label}
                    </div>
                ))}
            </div>
          </div>
        </div>
      </>
    )
}

export default LanguagesPopup