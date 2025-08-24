import React from 'react';
import HeaderCard from '../HeaderCard/HeaderCard';
import Button from '../Button/Button';
import styles from './DiscardChange.module.css';
import { useTranslation } from 'react-i18next';
const DiscardChange = ({ actionDiscard, actionSave }) => {
  const [t] = useTranslation("InfoBill");

  return (
    <div className={styles.discardChangeContainer}>
      <HeaderCard title={t('wantSaveBeforeExiting')}>
        <Button action={actionDiscard} type="discard">
          {t('dicard')}
        </Button>
        <Button action={actionSave}>{t('save')}</Button>
      </HeaderCard>

      <div className={styles.content}>
        <p>{t('youHaveMadeChange')}</p>
        <p>
          {t('ifYouChosseNotSave')}
        </p>
      </div>
    </div>
  );
};

export default DiscardChange;
