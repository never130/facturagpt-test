import React from 'react'
import styles from '../../CreateParameterPopup.module.css'
import { useTranslation } from 'react-i18next'
import RelationshipsFormulas from '../RelationshipsFormulas/RelationshipsFormulas'

const OneToMany = ({parameterData, handleChange}) => {
    const { t } = useTranslation()
  return (
    <div>
    <p className={styles.textContent}>{t("oneToMany")}</p>
    <RelationshipsFormulas parameterData={parameterData} handleChange={handleChange} />
</div>
  )
}

export default OneToMany