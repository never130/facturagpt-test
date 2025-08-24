import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from '../CreateParameterPopup.module.css'
import CustomDropdown from '../../CustomDropdown/CustomDropdown'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import Button from '../../Button/Button'
import DeleteButton from '../../DeleteButton/DeleteButton'
import {ReactComponent as CloseXIcon} from '../../../assets/CloseXIcon.svg'

const Currency = ({parameterData, handleChange}) => {
    const [t] = useTranslation("");

      
  // Estado local para mostrar/ocultar el selector
  const [showSelector, setShowSelector] = React.useState(false);
  // Estado local para la opción seleccionada temporalmente
  const [selectedOption, setSelectedOption] = React.useState(parameterData?.defaultCurrency || "");


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
   onModeChange={(mode) =>
    handleChange({ target: { name: "mode", value: mode } })
  }
 />


     <div>
        <p className={styles.textContent}>{t("currency")}</p>
    <CustomDropdown
      options={currenciesOptions.map(
        (currency) =>
          `${currency.name} (${currency.symbol}) ${currency.code}`
      )}
      setSelectedOption={(option) => {
        // Buscar el objeto currency completo según la opción seleccionada
        const currencyObj = currenciesOptions.find(
          (currency) =>
            `${currency.name} (${currency.symbol}) ${currency.code}` === option
        );
        handleChange({ target: { name: "currency", value: currencyObj } });
      }}
      selectedOption={
        parameterData.currency
          ? `${parameterData.currency.name} (${parameterData.currency.symbol}) ${parameterData.currency.code}`
          : ""
      }
      father="automate"
    />
    </div>
    {parameterData.mode !== "basic" && (
    <div>
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
    </div>
 )}
    </div>
  )
}

export default Currency