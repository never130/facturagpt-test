import React from 'react'
import RelationshipsFormulas from '../RelationshipsFormulas/RelationshipsFormulas'
import styles from '../../CreateParameterPopup.module.css'
import { useTranslation } from 'react-i18next'
const ManyToManyRelationship = ({parameterData, handleChange}) => {
    const { t } = useTranslation()
  return (
    <div>
        <p className={styles.textContent}>{t("manyToMany")}</p>
        <RelationshipsFormulas parameterData={parameterData} handleChange={handleChange} maxLevels={99} />
    </div>
  )
}

export default ManyToManyRelationship