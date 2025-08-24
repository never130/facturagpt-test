import { useEffect, useState } from "react";
import { countryFlags, languageFlags } from "../../../../../../utils/flags";
import styles from "./DropdownFlags.module.css";
import { useTranslation } from "react-i18next";
import {ReactComponent as AccountDefaultIcon} from '../../../../assets/AccountDefaultIcon.svg'

const DropdownFlags = ({ selectedCountry, setSelectedCountry, type = "country",editing,customStyles ={},accountDefault}) => {
const [t] = useTranslation('navbarAdmin')
  const [isOpen, setIsOpen] = useState(false);
  const defaultLanguageOption = {
    code: "default",
    text: t("accountDefault"),
    flag: <AccountDefaultIcon/>,
    label: t("accountDefault"), 
  };


  const options =
  type === "country"
    ? countryFlags
    : accountDefault
    ? [defaultLanguageOption, ...languageFlags]
    : languageFlags;


  const toggleDropdown = () => {
    if(editing){
      setIsOpen((prev) => !prev);
    }
  };
  const handleSelect = (item) => {
    
    setSelectedCountry(item); 
    setIsOpen(false); 
  };
useEffect(() => {
  
if(!editing) {
setIsOpen(false)
}
 
}, [editing])

  return (
    <div className={styles.dropdownContainer}>
      <div className={`${styles.dropdownHeader} ${!editing && styles.disabledDropdownHeader}`} onClick={toggleDropdown}   style={{ ...customStyles }}>
        {selectedCountry
          ? (
              <>
              {type === "country" && selectedCountry} 
                {options.find(option => option.value === selectedCountry)?.label }
                {options.find(option => option.text === selectedCountry)?.flag }
              {type !== "country" && selectedCountry} 
              </>
            )
          : `${t('selectLanguage')} ${type === "country" ? t('country') : t('language')}`}
      </div>
      {isOpen && (
        <div className={styles.dropdownList}>
          {options.map((item) => (
            <div
              key={item.code || item.value} 
              className={styles.dropdownItem}
              onClick={() => {
                if(editing) {
                  type === "country"? 
                  handleSelect( item.value):
                  handleSelect( item.text )
                }
              }}
            >
              {item.flag}
              {item.value}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownFlags;
