import React from 'react'
import styles from "./NewUserInformation.module.css";
import Button from '../Button/Button';
import {ReactComponent as HelpcenterCircleIcon} from '../../assets/HelpcenterCircleIcon.svg'
import { useTranslation } from 'react-i18next';
const Step3 = () => {
  const { t } = useTranslation("navbarAdmin");
  return (
    <div className={styles.Step3Container}>
        <span>{t('learnHowAutomateTasks')}</span>
        <Button type='white'>{t('visitHelpCenter')} <HelpcenterCircleIcon className={styles.HelpcenterCircleIcon}/></Button>
    </div>
  )
}

export default Step3