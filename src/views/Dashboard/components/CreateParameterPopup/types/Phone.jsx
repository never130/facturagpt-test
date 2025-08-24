import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
import FlagPhoneDropdown from "../../FlagPhoneDropdown/FlagPhoneDropdown";
import Button from "../../Button/Button";
import DynamicTable from "../../DynamicTable/DynamicTable";
import { countryFlags } from "../../../../../utils/flags";
import DeleteButton from "../../DeleteButton/DeleteButton";
import {ReactComponent as CloseXIcon} from "../../../assets/CloseXIcon.svg";


const Phone = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("Contacts");
  const [phoneData, setPhoneData] = useState({
    // phone: [{ id: Date.now(), code: "", number: "", default: true }]
  });
  const [currentCode, setCurrentCode] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  
  // Estados para el modo avanzado de países
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [selectedCountryOption, setSelectedCountryOption] = useState("");

  console.log('parameterData', parameterData)
  // Sincronizar con parameterData si existe
  useEffect(() => {
    if (parameterData.phone && parameterData.phone.length > 0) {
      setPhoneData({ phone: parameterData.phone });
    }
  }, [parameterData.phone]);

  const options = [
    "España, (+34)",
    "Estados Unidos, (+1)",
    "México, (+52)",
    "Argentina, (+54)",
    "Brasil, (+55)",
    "Reino Unido, (+44)",
    "Francia, (+33)",
    "Alemania, (+49)",
  ]



  const handleModeChange = (mode) => {
    handleChange({ target: { name: 'mode', value: mode } });
  };

  const handleChangePhoneNumbers = (id, field, value) => {
    const updatedNumbers = [...phoneData.phone];

    if (field === "default") {
      if (value === true) {
        updatedNumbers.forEach((phone) => {
          phone.default = phone.id === id;
        });
      } else {
        const target = updatedNumbers.find((phone) => phone.id === id);
        if (target) target.default = false;
      }
    } else {
      const target = updatedNumbers.find((phone) => phone.id === id);
      if (target) target[field] = value;
    }

    setPhoneData(prev => ({ ...prev, phone: updatedNumbers }));
    handleChange("phone", updatedNumbers);
  };

  const handleAddPhone = () => {
    if (currentCode && currentNumber) {
      // Buscar el país en countryFlags basado en el código
      const countryInfo = countryFlags.find(flag => flag.value === currentCode);
      
      const newPhone = {
        id: Date.now(),
        code: currentCode,
        number: currentNumber,
        country: countryInfo ? countryInfo.country : "",
        default: false
      };

      handleChange({ target: { name: 'phone', value: [...(parameterData.phone || []), newPhone] } });
      
      setPhoneData(prev => ({ 
        ...prev, 
        phone: [...prev?.phone || [], newPhone] 
      }));
      
      // Limpiar los campos actuales
      setCurrentCode("");
      setCurrentNumber("");
    }
  };

  const handleNumberChange = (e) => {
    // Solo permitir números
    const value = e.target.value.replace(/\D/g, '');
    setCurrentNumber(value);
  };

  // Lógica para manejar países seleccionados en modo avanzado
  const getSelectedCountriesArray = () => {
    let selectedCountriesArray = [];
    if (Array.isArray(parameterData?.countriesAvailable)) {
      selectedCountriesArray = parameterData.countriesAvailable;
    } else if (typeof parameterData?.countriesAvailable === "string" && parameterData.countriesAvailable !== "") {
      try {
        const parsed = JSON.parse(parameterData.countriesAvailable);
        selectedCountriesArray = Array.isArray(parsed) ? parsed : [parameterData.countriesAvailable];
      } catch {
        selectedCountriesArray = [parameterData.countriesAvailable];
      }
    } else if (parameterData?.countriesAvailable) {
      selectedCountriesArray = [parameterData.countriesAvailable];
    }
    return selectedCountriesArray;
  };

  const handleAddCountry = () => {
    const selectedCountriesArray = getSelectedCountriesArray();
    if (selectedCountryOption && !selectedCountriesArray.includes(selectedCountryOption)) {
      handleChange({
        target: {
          name: "countriesAvailable",
          value: [...selectedCountriesArray, selectedCountryOption],
        },
      });
      setSelectedCountryOption("");
    }
  };
const tableHeaders = [
  {
    key: "",
    label: t(""),
  },
  {
    key: "phone",
    label: t("phone"),
  },
  {
    key: "country",
    label: t("country"),
  },
{
  key: "prefix",
  label: t("prefix"),
},
]

const renderRow = (item, index) => {
  return (
    <tr key={index}>
      <td><input type="checkbox" checked={item.default} /></td>
      <td>{item.number}</td>
      <td>{item.country}</td>
      <td>{item.code}</td>
    </tr>
  );
};
console.log('phoneData', phoneData)

  return (
    <>
      <BasicAdvancedSelector
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
        <>
             <div>
       <FlagPhoneDropdown
          options={currentCode}
          setSelectedOptionProp={(option) => {
              setCurrentCode(option);
          }}
          editing={true}
        />
        
        <input 
          type="text" 
          placeholder="000 000 000" 
          value={currentNumber}
          onChange={handleNumberChange}
        />
         <Button 
       type='white' 
       headerStyle={{borderRadius:"999px"}}
       action={handleAddPhone}
     >
       {t('addPhone')}
     </Button>
      </div>
           <DynamicTable
        columns={tableHeaders}
        data={phoneData.phone || []}
        renderRow={renderRow}
        hideCheckbox={true}
        father={"pricing"}
      />
                                  
        </>
        
        {parameterData.mode !== "basic" && (
         <div>
         <p className={styles.textContent}>{t("countryAvailable")}</p>
         {/* Renderizar los países seleccionados */}
         {getSelectedCountriesArray().length > 0 && (
           <div className={styles.selectedCountriesContainer}>
             {getSelectedCountriesArray().map((country, idx) => (
               <span
                 key={country + idx}
                 className={styles.currencyItem}
               >
                 {country}
                 <DeleteButton
                 type='grey'
                 customIconStyles={{
                   height: "20px",
                   width: "20px",
                 }}
                 colorIcon={'#fff'}
                   action={() => {
                     // Elimina el país del estado
                     const newCountries = getSelectedCountriesArray().filter((c, i) => i !== idx);
                     handleChange({
                       target: {
                         name: "countriesAvailable",
                         value: newCountries,
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
     <Button
           type="white"
           headerStyle={{ borderRadius: "999px" }}
           action={() => setShowCountrySelector((prev) => !prev)}
         >
           {t("addBadge")}
         </Button>
   
         {showCountrySelector && (
           <div className={styles.addCurrencyDropdown}>
             <CustomDropdown
               options={[
                 t("all"),
                 ...countryFlags.map(
                   (country) =>
                     `${country.country} (${country.value})`
                 )
               ]}
               setSelectedOption={(option) => setSelectedCountryOption(option)}
               selectedOption={selectedCountryOption}
               father="automate"
             />
   
             <button
              
               onClick={handleAddCountry}
               disabled={!selectedCountryOption}
             >
               {t("add")}
             </button>
           </div>
         )}
     </div>
       </div>
      )}  
    </>
  );
};

export default Phone;
