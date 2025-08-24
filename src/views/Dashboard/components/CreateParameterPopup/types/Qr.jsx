import React from 'react'
import styles from '../CreateParameterPopup.module.css';
import BasicAdvancedSelector from '../components/BasicAdvancedSelector';
import ReactQRCode from 'react-qr-code';
import EditableField from '../components/EditableField';
import { useTranslation } from 'react-i18next';

const Qr = ({parameterData, handleChange}) => {
    const { t } = useTranslation();
    const handleModeChange = (mode) => {
        handleChange({ target: { name: 'mode', value: mode } });
      };
  return (
    <div>
         <BasicAdvancedSelector
      selectedMode={parameterData.mode}
      onModeChange={handleModeChange}
    />

 
        <div>
             <EditableField
          title={t("informationToBeEncoded")}
          type="text"
          name="qrUrl"
          value={parameterData.qrUrl}
          onChange={(e) => handleChange({ target: { name: 'qrUrl', value: e.target.value } })}
          placeholder="000000000"
        />
          <div className={styles.qrCodeContainer}>
          <ReactQRCode
            value={parameterData.qrUrl || 'www.facturagpt.com'}
            size={'100%'}
            style={{ width: '100%', height: 'auto' }}
          />
          </div>
            </div>
            {parameterData.mode !== "basic" && (
        <div>
          
        </div>
    )}
    </div>
  )
}

export default Qr