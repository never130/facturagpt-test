import React from 'react'
import styles from './NewUserInformation.module.css'
import ProfileModalTemplate from '../ProfileModalTemplate/ProfileModalTemplate'
import { useTranslation } from 'react-i18next';

const Step1 = () => {
  const { t } = useTranslation("navbarAdmin");
  return (
    <div className={styles.Step1Container}>
            <ProfileModalTemplate
           type='popup'
            sticky={true}
               customStyle={{
                 height: "auto",
                 width: "40%",
                 aspectRatio:'1/1'
               }}
               camStyles={{
                 padding: "0"
               }}
             />
             <h3>{t('welcomeToFacturagpt')}, <strong className={styles.green}>[[firstname]]</strong></h3>
       
       <span className={styles.completePersonalInformation}>{t('completePersonalInformation')}</span>

      <div className={styles.step1Form}>
      <div>
        <p>{t('firstname')}</p>
        <input type="text" placeholder={t('firstname')}/>
       </div>

       <div>
        <p>{t('surname')}</p>
        <input type="text" placeholder={t('surname')}/>
       </div>

       <div>
        <p>{t('secondSurname')}</p>
        <input type="text" placeholder={t('secondFamilyName')}/>
       </div>

       <div>
        <p>{t('alias')}</p>
        <input type="text" placeholder={t('fullname')}/>
       </div>
      </div>
    </div>
  )
}

export default Step1