import React from 'react'
import styles from '../CreateParameterPopup.module.css'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import { useTranslation } from 'react-i18next'
import Barcode from 'react-barcode';
import EditableField from '../components/EditableField';
const BarCode = ({parameterData, handleChange}) => {
    const { t } = useTranslation();

    const handleModeChange = (mode) => {
        handleChange({ target: { name: 'mode', value: mode } });
      };
  return (
    <div>

        <div>
             <EditableField
          title={t("barCode")}
          type="text"
          name="barCode"
          value={parameterData.barCode}
          onChange={(e) => handleChange({ target: { name: 'barCode', value: e.target.value } })}
          placeholder="000000000"
        />
          <div className={styles.qrCodeContainer}>
          <Barcode value={parameterData?.barCode} />
          </div>
            </div>
  
    </div>
  )
}

export default BarCode