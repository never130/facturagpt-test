import React from 'react'
import LabelParameters from '../LabelParameters'
import { useTranslation } from 'react-i18next';
import styles from '../CreateParameterPopup.module.css'
import { FaChevronDown } from "react-icons/fa";
import BasicAdvancedSelector from '../components/BasicAdvancedSelector';
import EditableField from '../components/EditableField';
import Button from '../../Button/Button';
import CustomDropdown from '../../CustomDropdown/CustomDropdown';
import DeleteButton from '../../DeleteButton/DeleteButton';
import {ReactComponent as CloseXIcon} from '../../../assets/CloseXIcon.svg'
const Amount = ({parameterData, handleChange,editingInput,setEditingInput,showSelectCurrencyPopup,setShowSelectCurrencyPopup,selectedCurrency,setSelectedCurrency}) => {
  const [t] = useTranslation("Contacts");
  
  // Estado local para mostrar/ocultar el selector
  const [showSelector, setShowSelector] = React.useState(false);
  // Estado local para la opción seleccionada temporalmente
  const [selectedOption, setSelectedOption] = React.useState(parameterData?.defaultCurrency || "");

  const handleModeChange = (mode) => {
    handleChange({ target: { name: 'mode', value: mode } });
  };

   // Función optimizada para manejar incremento y decremento
   const handleValueChange = (fieldName, operation) => {
    const currentValue = parameterData[fieldName] || 0;
    let newValue;
    
    if (operation === 'increment') {
      newValue = currentValue + 1;
    } else if (operation === 'decrement') {
      newValue = Math.max(0, currentValue - 1); // Evita valores negativos
    }
    
    handleChange({ 
      target: { 
        name: fieldName, 
        value: newValue 
      } 
    });
  };

  const currenciesOptions = [
    { name: "United States Dollar", code: "USD", symbol: "US$" },
    { name: "Euro", code: "EUR", symbol: "€" },
    { name: "British Pound", code: "GBP", symbol: "£" },
    { name: "Australian Dollar", code: "AUD", symbol: "A$" },
    { name: "Canadian Dollar", code: "CAD", symbol: "CA$" },
    { name: "Israeli Shekel", code: "ILS", symbol: "₪" },
    { name: "Brazilian Real", code: "BRL", symbol: "R$" },
    { name: "Hong Kong Dollar", code: "HKD", symbol: "HK$" },
    { name: "Swedish Krona", code: "SEK", symbol: "SEK" },
    { name: "New Zealand Dollar", code: "NZD", symbol: "NZ$" },
    { name: "Singapore Dollar", code: "SGD", symbol: "SGD" },
    { name: "Swiss Franc", code: "CHF", symbol: "CHF" },
    { name: "South African Rand", code: "ZAR", symbol: "ZAR" },
    { name: "Chinese Renminbi Yuan", code: "CNY", symbol: "CN¥" },
    { name: "Indian Rupee", code: "INR", symbol: "₹" },
    { name: "Malaysian Ringgit", code: "MYR", symbol: "MYR" },
    { name: "Mexican Peso", code: "MXN", symbol: "MX$" },
    { name: "Pakistani Rupee", code: "PKR", symbol: "PKR" },
    { name: "Philippine Peso", code: "PHP", symbol: "₱" },
    { name: "New Taiwan Dollar", code: "TWD", symbol: "NT$" },
    { name: "Thai Baht", code: "THB", symbol: "THB" },
    { name: "Turkish New Lira", code: "TRY", symbol: "TRY" },
    { name: "United Arab Emirates Dirham", code: "AED", symbol: "AED" },
  ];

  return (
    <div>
      <BasicAdvancedSelector
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
        {/* <LabelParameters value={parameterData.amount} text={'amount'} editingInput={editingInput} setEditingInput={setEditingInput}> */}
     
        <EditableField
          title={t("amount")}
          type="number"
          name="amount"
          value={parameterData?.amount}
          onChange={handleChange}
          placeholder={t('amount')}
          rightSection={<div>
            <div className={styles.currencyContainer} onClick={() => setShowSelectCurrencyPopup(true)}>
              {parameterData?.currency?.name} {parameterData?.currency?.symbol} {parameterData?.currency?.code}
            </div>
          </div>}

        />
        {parameterData.mode !== "basic" && (
      <>
        <div className={styles.advancedModeTextbox}>
        <div>
          <p>{t("decimals")}</p>
          <div>
                   <Button 
               type="white" 
               action={() => handleValueChange('decimals', 'decrement')}
             >
               -
             </Button>
             <input
               type="number"
               name="decimals"
               value={parameterData.decimals || 0}
               onChange={handleChange}
             />
             <Button 
               type="white" 
               action={() => handleValueChange('decimals', 'increment')}
             >
               +
             </Button>
          </div>
        </div>
      </div>

      <EditableField 
        title={t("defaultCurrency")}
        type="customDropdown"
        options={currenciesOptions.map(currency => `${currency.name} (${currency.symbol}) ${currency.code}`)}
        name="defaultCurrency"
        value={parameterData?.defaultCurrency}
        onChange={handleChange}
        placeholder='[userCurrency]'
      />
{/*
  Lógica para mostrar/ocultar el selector y manejar las monedas seleccionadas
*/}
{(() => {
  // Aseguramos que currenciesAvailable siempre sea un array
  let selectedCurrenciesArray = [];
  if (Array.isArray(parameterData?.currenciesAvailable)) {
    selectedCurrenciesArray = parameterData.currenciesAvailable;
  } else if (typeof parameterData?.currenciesAvailable === "string" && parameterData.currenciesAvailable !== "") {
    // Si por error viene como string, intentamos convertirlo a array
    try {
      const parsed = JSON.parse(parameterData.currenciesAvailable);
      selectedCurrenciesArray = Array.isArray(parsed) ? parsed : [parameterData.currenciesAvailable];
    } catch {
      selectedCurrenciesArray = [parameterData.currenciesAvailable];
    }
  } else if (parameterData?.currenciesAvailable) {
    selectedCurrenciesArray = [parameterData.currenciesAvailable];
  }

  // Función para agregar la moneda seleccionada al estado global
  const handleAddCurrency = () => {
    if (
      selectedOption &&
      !selectedCurrenciesArray.includes(selectedOption)
    ) {
      // Actualiza el estado parameterData usando handleChange
      handleChange({
        target: {
          name: "currenciesAvailable",
          value: [...selectedCurrenciesArray, selectedOption],
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
      <p className={styles.textContent}>{t("currencyAvailable")}</p>
      {/* Renderizar las monedas seleccionadas */}
      {selectedCurrenciesArray.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {selectedCurrenciesArray.map((currency, idx) => (
            <span
              key={currency + idx}
              className={styles.currencyItem}
            >
              {currency}
              <DeleteButton
              type='grey'
              customIconStyles={{
                height: "20px",
                width: "20px",
              }}
              colorIcon={'#fff'}
                action={() => {
                  // Elimina la moneda del estado
                  const newCurrencies = selectedCurrenciesArray.filter((m, i) => i !== idx);
                  handleChange({
                    target: {
                      name: "currenciesAvailable",
                      value: newCurrencies,
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
        action={() => setShowSelector((prev) => !prev)}
      >
        {t("addBadge")}
      </Button>

      {showSelector && (
        <div className={styles.addCurrencyDropdown}>
          <CustomDropdown
            options={currenciesOptions.map(
              (currency) =>
                `${currency.name} (${currency.symbol}) ${currency.code}`
            )}
            setSelectedOption={(option) => setSelectedOption(option)}
            selectedOption={selectedOption}
            father="automate"
          />

          <button
           
            onClick={handleAddCurrency}
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



        {/* <div className={styles.amountContainer}>
        <div className={styles.selectCurrencyBtn} onClick={() => setShowSelectCurrencyPopup(true)}>
                {parameterData.currency || 'Euro'}
                {` (${parameterData.code })`|| '(€)'}
                <FaChevronDown
              className={styles.chevronIcon}
              style={{
                transform: showSelectCurrencyPopup ? "rotate(180deg)" : "",
                transition: "transform 0.3s ease-in-out",
              }}
            />
            </div>
<input
          type="number"
          value={parameterData?.amount}
          name={'amount'}
          onChange={handleChange}
          placeholder='00.00'
        />
        </div> */}
      </>
       
      )}
{/* </LabelParameters> */}
    </div>
  )
}

export default Amount