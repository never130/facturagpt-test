import React, { useCallback, useEffect, useState } from "react";
import styles from "./General.module.css";
import Button from "../../Button/Button";
import { ReactComponent as BlackCircleChecked } from "../../../assets/blackCircleChecked.svg";
import DropdownFlags from "./DropdownFlags/DropdownFlags";
import SeeHistory from "../../SeeHistory/SeeHistory";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CorporativeModalText from "../../CorporativeModalText/CorporativeModalText";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import SelectCurrencyPopup from "../../SelectCurrencyPopup/SelectCurrencyPopup"
import { setThemeColor, setTheme, defaultColor } from "../../../../../slices/themeSlices";
import { useDispatch, useSelector } from "react-redux";
import { use } from "i18next";
import { color } from "d3";
import { getAllInvoices, getLastPayment } from "../../../../../actions/user";
import { finishTutorial,loginToManager } from "../../../../../actions/user";
import { setShowModal, setTutorialAgain } from "../../../../../slices/userSlices";

const General = ({
  setDeleteChats,
  selectedCurrency,
  setSelectedCurrency,
  userData,
  setUserData,
  setSeeBill,
  setTypeDelete,
  setEditingCurrency,
  editingCurrency,
  maxAccount,
  configuration,
  setConfiguration,
  secondaryColor
}) => {
  const [showSelectCurrency, setShowSelectCurrency] = useState(false);
  const { t,i18n } = useTranslation("accountSetting");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seeHistory, setSeeHistory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [colorActive, setColorActive] = useState(2);
  const [editingMaxAccount,setEditingMaxAccount] = useState(0)

  const {lastPayment} = useSelector((state) => state.user);
  const {themeColor} = useSelector((state) => state.theme);

  const [styleFixed, setStyleFixed] = useState(false)

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
  
  // Modifies the alpha value of an rgba string
  function changeRgbaOpacity(rgbaString, newAlpha) {
    // Extract numbers from the rgba string (accepts decimals)
    const match = rgbaString.match(/rgba?\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,?\s*([\d\.]+)?\s*\)/);
    if (!match) return rgbaString; // Return original if not valid

    const [, r, g, b] = match;
    // Use newAlpha or keep original if not provided
    return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
  }

  
 

  const changeCountry = useCallback(
    (country) => {
      setUserData((prevUserData) => ({
        ...prevUserData,
        language: country,
      }));
    },
    [setUserData]
  );

  const [editingLabel, setEditingLabel] = useState({
    color: false,
    language: false,
    currency: false,
  });


const [symbolSelected, setSymbolSelected] = useState("$");
  const [showCorporativeModal, setShowCorporativeModal] = useState(false);
  const [corporativeTitle, setCorporativeTitle] = useState("");
  const [corporativeMessage, setCorporativeMessage] = useState("");
  const [logout, setLogout] = useState(false);
  const [date, setDate] = useState("AAAA-MM-DD")
  const [hour, setHour] = useState("AM-PM/24HS")

  useEffect(() => {
    if (logout) {
      localStorage.clear();
      navigate("/login");
    }
  }, [logout]);

  const handleLogOut = () => {
    setShowCorporativeModal(true);
    setCorporativeTitle(t('logout'));
    setCorporativeMessage(t('areYouSureLogout'));
  };

  const [tempMaxAccount,setTempMaxAccount] = useState(0)

  useEffect(() => {
    
  setTempMaxAccount(maxAccount)
  
  }, [maxAccount])

  const languageMap = {
    Español: "es",
    English: "en",
    日本語: "ja",
    普通话: "zh",
    Deutsch: "de",
    Français: "fr",
    Italiano: "it",
    Português: "pt",
  };
  
  const langCode = languageMap[i18n.language] || "es";

  useEffect(() => {
 const getLastPay = async () => {
 await dispatch(getLastPayment())
 }
 getLastPay()
  }, [])
  

  const dateToFormat = lastPayment;
  const formattedDate = dateToFormat
    ? new Intl.DateTimeFormat(langCode, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(dateToFormat))
    : "";


    const [invoices,setInvoices] = useState([])
    useEffect(() => {
      const fetchInvoices = async () => {
        const res = await dispatch(getAllInvoices());
        setInvoices(res?.payload?.invoices)
      };
    
      fetchInvoices();
    }, []); 

    const handleConfigurationChange = (field, value, index = null, filterIndex = null) => {
      setConfiguration(prev => {
        const updatedLabels = Array.isArray(prev.labels) ? [...prev.labels] : [];
    
        if (index !== null && updatedLabels[index]) {
          const label = { ...updatedLabels[index] };
    
          if (filterIndex !== null && Array.isArray(label.filters)) {
            const updatedFilters = [...label.filters];
            const filter = { ...updatedFilters[filterIndex] };
    
            if (field === "variables") {
              const currentArray = Array.isArray(filter.variables) ? [...filter.variables] : [];
              const exists = currentArray.some(v => v._id === value._id);
    
              filter.variables = exists
                ? currentArray.filter(v => v._id !== value._id)
                : [...currentArray, value];
            } else {
              filter[field] = value;
            }
    
            updatedFilters[filterIndex] = filter;
            label.filters = updatedFilters;
          }
          else if (["plainTextLabels", "labels", "variables"].includes(field)) {
            label[field] = value;
          }
    
          updatedLabels[index] = label;
    
          return {
            ...prev,
            labels: updatedLabels
          };
        }
    
        return {
          ...prev,
          [field]: value
        };
      });
    };

    const handleActiveHelp = async () => {
      await dispatch(finishTutorial())
      dispatch(setTutorialAgain(true))
    }
    
  return (
    <div className={styles.generalContainer}>
      <div className={styles.labelGeneral}>
        <div className={styles.row}>
          <p>{t("lastBilling")}</p>
          <Button
            type="button"
            action={() => {
              setSeeHistory(true);
            }}
          >
            {t("viewHistorial")}
          </Button>
        </div>
        <div className={styles.row}>
          <p>
            {t('plan')} <strong className={styles.typePlan}>{userData?.typePlan || "Basic"}</strong>
          </p>
          <p>{formattedDate}</p>
        </div>
        {invoices?.some(inv => inv.status !== "succeeded") && (
  <div className={styles.row}>
    {t('youHaveBillsToPay')}
    <Button>{t('payBill')}</Button>
  </div>
)}

      </div>
      <div className={styles.labelGeneral}>
        <div className={`${styles.row} ${styles.editButton}`}>

        </div>
        <div className={styles.row}>
          <p>{t('color')}</p>
          <div className={styles.colors}>
            <div
              className={styles.color}
              // might change! this is a new feature
              onClick={() => { 
                themeColor === secondaryColor
                  ? dispatch(setShowModal('colorPicker'))
                  : dispatch(setThemeColor(secondaryColor))
              }}
              style={{
                background: secondaryColor,
                cursor: editingLabel.color && "pointer",
                boxShadow: themeColor == secondaryColor ? `0 0 0 4px ${changeRgbaOpacity(secondaryColor, 0.4)}` : 'none',
               transition: 'box-shadow 0.3s ease',
              }}
            ></div>
            <div
              className={styles.color}
              onClick={() => {
                dispatch(setTheme('light'))
                dispatch(setThemeColor(defaultColor))
              }}
              style={{
                background: defaultColor,
                cursor: editingLabel.color && "pointer",
                boxShadow: themeColor == defaultColor ? `0 0 0 4px ${changeRgbaOpacity(defaultColor, 0.4)}` : 'none',
               transition: 'box-shadow 0.3s ease',

              }}
            ></div>
          </div>
        </div>
      </div>

      <div className={styles.labelGeneral}>
   
        <div className={styles.row}>
          <p>{t('language')}</p>
          <DropdownFlags
            selectedCountry={userData?.language}
            setSelectedCountry={changeCountry}
            editing={'edit'}
            type="language"
          />
        </div>
      </div>
       <div className={styles.labelGeneral} style={{border:"none"}}>
        <div className={styles.row}>
          
          <p>{t('date')}</p>
          <div>
          <CustomDropdown
        generalStyleFilterSort={{fontSize: "14px",
         color: "black",
         fontWeight: "400",background:"transparent"}}
        generalDropdownHeader={{color: "black", fontSize:"15px", fontWeight: "400", marginLeft:"29px"}}  
        height="25px"
        options={["AAAA-MM-DD", "DD-MM-AAAA", "MM-DD-AAAA"]}
        selectedOption={date}
        setSelectedOption={(option) => setDate(option)}
        father={"general"}/>
          </div>
        </div>
      </div>

       <div className={styles.labelGeneral}>
        <div className={styles.row}>
          <p>{t('hour')}</p>
    <div>
          <CustomDropdown
        generalStyleFilterSort={{fontSize: "14px",
         color: "black",
         fontWeight: "400",background:"transparent"}}
        generalDropdownHeader={{color: "black", fontSize:"15px", fontWeight: "400", marginLeft:"29px"}}  
        height="25px"
        options={["24 hs", "12 hs AM/PM"]}
        selectedOption={hour}
        setSelectedOption={(option) => setHour(option)}
        father={"general"}/>
          </div>        
        </div>
      </div>
      <div className={styles.labelGeneral}>
 
        <div className={styles.row}>
          <p>{t('badge')}</p>
          <div
            className={`${styles.currencyDropdown}`}
            onClick={() => {
                setShowSelectCurrency(true)
            }}
          >
            {selectedCurrency}
          </div>
        </div>
      </div>
      
      <div className={styles.labelGeneral}>
        <div className={styles.row}>
          <p>{t('activateGuidedHelp')}</p>
          <Button
            type="white"
            headerStyle={{
              borderRadius: " 9999px",
            }}
            action={() => handleActiveHelp()}
          >
            {t('activate')}
          </Button>
        </div>
      </div>

      <div className={styles.labelGeneral}>
        <div className={styles.row}>
          <p>{t('logoutOnThisDevice')}</p>
          <Button
            type="white"
            headerStyle={{
              borderRadius: " 9999px",
            }}
            action={handleLogOut}
          >
            {t('logout')}
          </Button>
        </div>
      </div>

 
     

      {showCorporativeModal && (
        <CorporativeModalText
          title={corporativeTitle}
          message={corporativeMessage}
          setState={setShowCorporativeModal}
          action={true}
          setAction={setLogout}
        />
      )}
      {seeHistory && (
        <SeeHistory
          setSeeHistory={setSeeHistory}
          seeHistory={seeHistory}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          setSeeBill={setSeeBill}
        />
      )}
      {showSelectCurrency && <SelectCurrencyPopup
       setShowSelectCurrencyPopup={setShowSelectCurrency}
          setSelectedCurrency={setSelectedCurrency}
          selectedCurrency={selectedCurrency}
          symbolSelected={symbolSelected}
          setSymbolSelected={setSymbolSelected}
          configuration={configuration}
          handleConfigurationChange={handleConfigurationChange}
          styleFixed={styleFixed}
          setStyleFixed={setStyleFixed}
          father={"general"}

      />}
    </div>
  );
};

export default General;
