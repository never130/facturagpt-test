import React, { useRef, useState, useEffect } from "react";
import styles from "./FiltersDropdownContainer.module.css";
import { FaChevronDown } from "react-icons/fa";
import { ReactComponent as BlackCircleChecked } from "../../assets/blackCircleChecked.svg";
import { ReactComponent as GrayArrow } from "../../assets/grayArrow2.svg";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as FilterIcon } from "../../assets/S3/filterIconBars.svg";

const FiltersDropdownContainer = ({
  selectedFilters = {},
  setSelectedFilters,
  options = [],
  father,
  setLastSelectedOption,
  customFilterSort,
  customDropdownContainer,
  customDropdownOptions,
  bottomNext
}) => {
  const [t] = useTranslation('Contacts')
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customDate, setCustomDate] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef(null);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null)



  if(father != "home" && father != "selectAgent" && father != "tables"){
  useEffect(() => {
    if (location.search) {
      let path = location.search.slice(1,)
      if (path.includes("&")) {
        path = path.split("&").filter(filter => {
          let type = filter.split("=").slice(0, 1)
          if (type == "filter") return true
          else return false
        })
        const [type, filter] = path.join("").split("=")

        const searchParams = new URLSearchParams(location.search);
        const valorOriginal = decodeURIComponent(searchParams.get('filter') || '');
        let [category, subOption] = valorOriginal.split("_")
        if (currentOptionSelected !== `${category} ${subOption}` && filter) {
          setTimeout(() => {
            addFilterPath(`${category}_${subOption}`)
          }, 50)
          handleSubOptionClick(category, subOption)
        }

      } else {
        if (location.search.split("=")[0] == "?filter") {
          const searchParams = new URLSearchParams(location.search);
          const valorOriginal = decodeURIComponent(searchParams.get('filter') || '');
          let [category, subOption] = valorOriginal.split("_")
          if (currentOptionSelected !== `${category} ${subOption}`) {
            setTimeout(() => {
              addFilterPath(`${category}_${subOption}`)
            }, 50)
            handleSubOptionClick(category, subOption)
          }
        }
      }




    }
  }, [location.search])
}

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    setSelectedCategory(null);
    setShowCustomInput(false);
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSubOptionClick = (category, subOption) => {
    addFilterPath(`${category}_${subOption}`)
    if(setLastSelectedOption) {
      setLastSelectedOption(`${category}`)
    }
    setCurrentOptionSelected(`${category} ${subOption}`)
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (updatedFilters[category] && updatedFilters[category] === subOption) {
        updatedFilters[category] = null;
      } else {
        updatedFilters[category] = subOption;
      }

      return updatedFilters;
    });

    if (subOption !== "Custom") {
      setShowCustomInput(false);
    } else {
      setShowCustomInput(true);
    }
  };

  const handleCustomDateChange = (e) => {
    const selectedDate = e.target.value;

    setCustomDate(selectedDate);

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      Fecha: selectedDate,
    }));
  };

  const addFilterPath = (nuevoFiltro) => {
    if(father != "home" && father != "selectAgent" && father != "tables"){
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('filter', nuevoFiltro);

    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    }, { replace: true });
  }
  }
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isOpen && (
        <div className={styles.bg} onClick={handleDropdownToggle}></div>
      )}
      <div className={styles.dropdownContainer} style={{ minWidth: width <= 768 && 'fit-content',...customDropdownContainer} }>
        <div style={customFilterSort}
          className={styles.filterSort}
          onClick={handleDropdownToggle}
          ref={dropdownRef}
        >
          {width <= 768 ? (
            <>
              <div className={styles.searchIconsWrappers}>
                <FilterIcon />
              </div>
            </>
          ) : (
            <>
              <span className={styles.sortBy}>
                {t('sortBy')}:
              </span>
              <b>
                {currentOptionSelected && father == "chatToken" ?t(`${currentOptionSelected.slice(0,13)} ${currentOptionSelected.slice(20,25)}`) :currentOptionSelected 
                  ? t(`${currentOptionSelected}`)
                  : selectedFilters && Object.keys(selectedFilters).length
                    ? t('filtersApplied')
                    : t('select')}
              </b>
              <FaChevronDown className={styles.chevronIcon} />
            </>

          )}
        </div>

        {isOpen && (
          <div className={styles.dropdownOptions} style={bottomNext ? customDropdownOptions : {}}>
            {!selectedCategory && (
              <>
                <div
                  className={styles.dropdownOption}
                  onClick={() => {
                    setSelectedFilters({});
                    setCurrentOptionSelected(null)
                    setIsOpen(false);
                    setSelectedCategory(null);
                  }}
                >
                  {t('restartFilters')}
                </div>
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={styles.dropdownOption}
                    onClick={() => handleCategoryClick(option.name)}
                  >
                    <GrayArrow /> {option.label}
                  </div>
                ))}
              </>
            )}

            {selectedCategory && !showCustomInput && (
              <div className={styles.subOptions}>
                {options.find((opt) => opt.name === selectedCategory)
                  ?.subOptions === "currencies"
                  ? currenciesOptions.map((currency, subIndex) => {
                    const subOption = `${currency.name} (${currency.code}) - ${currency.symbol}`;
                    return (
                      <div
                        key={subIndex}
                        className={styles.dropdownOption}
                        onClick={() =>
                          handleSubOptionClick(
                            selectedCategory,
                            currency.code
                          )
                        }
                      >
                        {subOption}
                        {selectedFilters[selectedCategory] === subOption && (
                          <BlackCircleChecked />
                        )}
                      </div>
                    );
                  })
                  : options
                    .find((opt) => opt.name === selectedCategory)
                    ?.subOptions.map((subOption, subIndex) => (
                      <div
                        key={subIndex}
                        className={styles.dropdownOption}
                        onClick={() =>
                          handleSubOptionClick(selectedCategory, subOption.value)
                        }
                      >
                        {subOption.display}{" "}
                        {selectedFilters[selectedCategory] === subOption.value && (
                          <BlackCircleChecked />
                        )}
                      </div>
                    ))}
              </div>
            )}

            {showCustomInput && (
              <div className={styles.customDateInput}>
                <input
                  type="date"
                  value={customDate}
                  onChange={handleCustomDateChange}
                  placeholder={t('selectDate')}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}


export default FiltersDropdownContainer;
