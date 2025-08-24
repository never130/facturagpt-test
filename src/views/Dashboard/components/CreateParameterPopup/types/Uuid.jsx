import React from 'react'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import { useTranslation } from 'react-i18next'
import styles from '../CreateParameterPopup.module.css'
import EditableField from '../components/EditableField'
import Button from '../../Button/Button'
import CustomDropdown from '../../CustomDropdown/CustomDropdown'
import DeleteButton from '../../DeleteButton/DeleteButton'
import {ReactComponent as CloseXIcon} from '../../../assets/CloseXIcon.svg'
import OptionsSwitchComponent from '../../OptionsSwichComponent/OptionsSwitchComponent'

const Uuid = ({parameterData, handleChange}) => {
    const [t] = useTranslation("");
  // Estado local para mostrar/ocultar el selector
  const [showSelector, setShowSelector] = React.useState(false);
  // Estado local para la opción seleccionada temporalmente
  const [selectedOption, setSelectedOption] = React.useState(parameterData?.systemPrefix || "");


  return (
    <div>
           <BasicAdvancedSelector
   selectedMode={parameterData.mode}
   onModeChange={(mode) =>
    handleChange({ target: { name: "mode", value: mode } })
  }
 />


    <div>
        <div className={styles.uuidRow}>
        <EditableField
            title={"UUID"}
            type="text"
            name="uuid"
            value={parameterData.uuid}
            onChange={handleChange}
            placeholder="UUID"
            description={t("visibleNameInTables")}
            toggleEdit={false}
          />
        <EditableField
            title={"series"}
            type="text"
            name="series"
            value={parameterData.series}
            onChange={handleChange}
            placeholder="series"
            description={t("compositeIDForPrints")}
            toggleEdit={false}
          />
          <Button type='gray' headerStyle={{backgroundColor: '#F3F3F3',color:"#666666",border:"none",fontWeight:"500"}}>{t('copy')}</Button>
        </div>
        <div>
            <EditableField
            title={"typeUUID"}
            type="customDropdown"
            name="typeUUID"
            value={parameterData.typeUUID}
            onChange={handleChange}
            placeholder="typeUUID"
            toggleEdit={false}
            options={["UUID", "UUIDv4", "UUIDv5"]}
            setSelectedOption={(option) => {
                handleChange({ target: { name: "typeUUID", value: option } });
              }}
              selectedOption={parameterData.typeUUID}
          />
            </div>
            {(() => {
  // Aseguramos que systemPrefixAvailable siempre sea un array
  let systemPrefix = [];
  if (Array.isArray(parameterData?.systemPrefixAvailable)) {
    systemPrefix = parameterData.systemPrefixAvailable;
  } else if (typeof parameterData?.systemPrefixAvailable === "string" && parameterData.systemPrefixAvailable !== "") {
    // Si por error viene como string, intentamos convertirlo a array
    try {
      const parsed = JSON.parse(parameterData.systemPrefixAvailable);
      systemPrefix = Array.isArray(parsed) ? parsed : [parameterData.systemPrefixAvailable];
    } catch {
      systemPrefix = [parameterData.systemPrefixAvailable];
    }
  } else if (parameterData?.systemPrefixAvailable) {
    systemPrefix = [parameterData.systemPrefixAvailable];
  }

  // Función para agregar el prefijo del sistema seleccionado al estado global
  const handleAddSystemPrefix = () => {
    if (
      selectedOption &&
      !systemPrefix.includes(selectedOption)
    ) {
      // Actualiza el estado parameterData usando handleChange
      handleChange({
        target: {
          name: "systemPrefixAvailable",
          value: [...systemPrefix, selectedOption],
        },
      });
      // Limpia la selección temporal
      setSelectedOption("");
      // Opcional: Oculta el selector después de agregar
      // setShowSelector(false);
    }
  };

  return (
    <div>
      <p className={styles.textContent}>{t("systemPrefixAvailable")}</p>
      {/* Renderizar los prefijos del sistema seleccionados */}
      {systemPrefix.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {systemPrefix.map((systemPrefix, idx) => (
                          <span
                key={systemPrefix + idx}
                className={styles.currencyItem}
              >
                {systemPrefix}
              <DeleteButton
              type='grey'
              customIconStyles={{
                height: "20px",
                width: "20px",
              }}
              colorIcon={'#fff'}
                action={() => {
                  // Elimina el prefijo del sistema del estado
                  const newSystemPrefixes = systemPrefix.filter((m, i) => i !== idx);
                  handleChange({
                    target: {
                      name: "systemPrefixAvailable",
                      value: newSystemPrefixes,
                    },
                  });
                }}
                CustonIcon={CloseXIcon}
                />
               
            </span>
          ))}
        </div>
      )}

  <div className={styles.addCurrencyContainer}>


      {true && (
        <div className={styles.addCurrencyDropdown}>
          <CustomDropdown
            options={['p. ej. PROD- o uuid:','p. ej. PROD- o uuid:']}
            setSelectedOption={(option) => setSelectedOption(option)}
            selectedOption={selectedOption}
            father="automate"
          />

          <button
           
            onClick={handleAddSystemPrefix}
            disabled={!selectedOption}
          >
            {t("add")}
          </button>
        </div>
      )}
  </div>
    </div>
  );
})()}
    </div>
    {parameterData.mode !== "basic" && (
    <div>

{(() => {
  // Aseguramos que systemPrefixAvailable siempre sea un array
  let systemPrefix = [];
  if (Array.isArray(parameterData?.systemPrefixAvailable)) {
    systemPrefix = parameterData.systemPrefixAvailable;
  } else if (typeof parameterData?.systemPrefixAvailable === "string" && parameterData.systemPrefixAvailable !== "") {
    // Si por error viene como string, intentamos convertirlo a array
    try {
      const parsed = JSON.parse(parameterData.systemPrefixAvailable);
      systemPrefix = Array.isArray(parsed) ? parsed : [parameterData.systemPrefixAvailable];
    } catch {
      systemPrefix = [parameterData.systemPrefixAvailable];
    }
  } else if (parameterData?.systemPrefixAvailable) {
    systemPrefix = [parameterData.systemPrefixAvailable];
  }

  // Función para agregar el prefijo del sistema seleccionado al estado global
  const handleAddSystemPrefix = () => {
    if (
      selectedOption &&
      !systemPrefix.includes(selectedOption)
    ) {
      // Actualiza el estado parameterData usando handleChange
      handleChange({
        target: {
          name: "systemPrefixAvailable",
          value: [...systemPrefix, selectedOption],
        },
      });
      // Limpia la selección temporal
      setSelectedOption("");
      // Opcional: Oculta el selector después de agregar
      // setShowSelector(false);
    }
  };

  return (
    <div>
      <p className={styles.textContent}>{t("systemPrefixAvailable")}</p>
      {/* Renderizar los prefijos del sistema seleccionados */}
      {systemPrefix.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {systemPrefix.map((systemPrefix, idx) => (
                          <span
                key={systemPrefix + idx}
                className={styles.currencyItem}
              >
                {systemPrefix}
              <DeleteButton
              type='grey'
              customIconStyles={{
                height: "20px",
                width: "20px",
              }}
              colorIcon={'#fff'}
                action={() => {
                  // Elimina el prefijo del sistema del estado
                  const newSystemPrefixes = systemPrefix.filter((m, i) => i !== idx);
                  handleChange({
                    target: {
                      name: "systemPrefixAvailable",
                      value: newSystemPrefixes,
                    },
                  });
                }}
                CustonIcon={CloseXIcon}
                />
               
            </span>
          ))}
        </div>
      )}

  <div className={styles.addCurrencyContainer}>


      {true && (
        <div className={styles.addCurrencyDropdown}>
          <CustomDropdown
            options={['p. ej. PROD- o uuid:','p. ej. PROD- o uuid:']}
            setSelectedOption={(option) => setSelectedOption(option)}
            selectedOption={selectedOption}
            father="automate"
          />

          <button
           
            onClick={handleAddSystemPrefix}
            disabled={!selectedOption}
          >
            {t("add")}
          </button>
        </div>
      )}
  </div>
    </div>
  );
})()}

<div className={styles.uuidRow} style={{alignItems:"end"}}>
        <EditableField
            title={"casing"}
            type="text"
            name="casing"
            value={parameterData.casing}
            onChange={handleChange}
            placeholder="casing"
            toggleEdit={false}
          />
      
          <Button type='gray' headerStyle={{backgroundColor: '#F3F3F3',color:"#666666",border:"none",fontWeight:"500"}}>{t('copy')}</Button>
        </div>

        <div className={styles.switchContainer}>
         <OptionsSwitchComponent
                border={"none"}
                marginLeft={"0"}
                isChecked={parameterData?.validateRFC || false}
                                 setIsChecked={(value) =>
                   handleChange({ target: { name: "validateRFC", value: value } })
                 }
              />
              <div className={styles.switchDescription}>
              <p>{t("validateRFC")}</p>
              <span>{t("validateRFCDescription")}</span>
              </div>
      </div>
        <div className={styles.switchContainer}>
         <OptionsSwitchComponent
                border={"none"}
                marginLeft={"0"}
                isChecked={parameterData?.additionalValidation || false}
                                 setIsChecked={(value) =>
                   handleChange({ target: { name: "additionalValidation", value: value } })
                 }
              />
              <div className={styles.switchDescription}>
              <p>{t("additionalValidation")}</p>
              <span>{t("additionalValidationDescription")}</span>
              </div>
      </div>
        <div className={styles.switchContainer}>
         <OptionsSwitchComponent
                border={"none"}
                marginLeft={"0"}
                isChecked={parameterData?.addIncrementalNumber || false}
                                 setIsChecked={(value) =>
                   handleChange({ target: { name: "addIncrementalNumber", value: value } })
                 }
              />
              <div className={styles.switchDescription}>
              <p>{t("addIncrementalNumber")}</p>
              <span>{t("addIncrementalNumberDescription")}</span>
              </div>
      </div>
      {parameterData?.addIncrementalNumber && (
         <EditableField
         title={"seriesStartWith"}
         type="customDropdown"
         name="seriesStartWith"
         value={parameterData.seriesStartWith}
         onChange={handleChange}
         placeholder="seriesStartWith"
         toggleEdit={false}
         options={["UUID", "UUIDv4", "UUIDv5"]}
         setSelectedOption={(option) => {
             handleChange({ target: { name: "seriesStartWith", value: option } });
           }}
           selectedOption={parameterData.seriesStartWith}
       />
      )}
    </div>
 )}
    </div>
  )
}

export default Uuid