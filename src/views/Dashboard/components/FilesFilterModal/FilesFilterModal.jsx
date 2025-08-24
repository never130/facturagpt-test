import React, { useState, useEffect } from "react";
import styles from "./FilesFilterModal.module.css";
import InputWithTitle from "../InputWithTitle/InputWithTitle";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CheckboxWithText from "../CheckboxWithText/CheckboxWithText";
import minusIcon from "../../assets/minusIcon.svg";
import searchGray from "../../assets/searchGray.svg";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import DeleteButton from "../DeleteButton/DeleteButton";
import useCloseOnEsc from "../../../../utils/useClose";
import { useDispatch, useSelector } from "react-redux";
import { getVariable } from "../../../../actions/user";
import { useTranslation } from "react-i18next";
import FiltersDropdownContainer from "../FiltersDropdownContainer/FiltersDropdownContainer";

const FilesFilterModal = ({
  onClose,
  handleApplyFilters,
  isFilterOpen,
  setSelectedCurrency,
  selectedCurrency,
   setSelectedTags,
   setFiltersCount
}) => {
  const colors = [
    "#0B06FF",
    "#FF0000",
    "#12A27F",
    "#7329A5",
    "#7086FD",
    "#FF8C00",
    "#16C098",
    "#C075EE",
    "#EEFF00",
  ];
  const { t } = useTranslation("PanelTemplate");
  const [isClosing, setIsClosing] = useState(isFilterOpen);
  const [keyWord, setKeyWord] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allFiles, setAllFiles] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [showVariables, setShowVariables] = useState([]);
  const variables = useSelector((state) => state.variables.variables);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTagsFilters, setSelectedTagsFilters] = useState([]);
  const [tag, setTag] = useState("");

    const [selectedOption, setSelectedOption] = useState({
      "Orden Alfabético": "A-Z",
      "date": '1year',

    });

  const options = [
    {
      name: "Orden Alfabético",
      label: t("alphabeticOrder"),
      subOptions: [
        { display: "A-Z", value: "A-Z" },
        { display: "Z-A", value: "Z-A" },
      ],
    },
    {
      name: "date",
      label: t("date"),
      subOptions: [
        { display: t('1month'), value: "1month" },
        { display: t('3month'), value: "3month" },
        { display: t('6month'), value: "6month" },
        { display: t('1year'), value: "1year" },

      ],
    },

  ];

  const handleClose = () => {
    setIsClosing(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVariable({ type: "category" }));
  }, [dispatch]);
  useEffect(() => {
    if (Array.isArray(variables.data)) {
      const titlesOnly = variables.data.map((v) => v.title);
      setShowVariables(titlesOnly);
    }
  }, [variables]);

  const handleCancel = () => {

    setKeyWord("");
    setSelectedCategory("");
    setAllFiles(false);
    setSelectedTypes([]);
    setMinValue("");
    setMaxValue("");
    setSelectedCurrency("EUR");
    setSelectedTagsFilters([]);
    setTag("");
    setSelectedTags([])
setFiltersCount(0)
    handleClose();
    handleApplyFilters({});
  };

  const [keyWordsList, setKeyWordsList] = useState([]);
  let count = 0

  const handleApplyFiltering = () => {
    const filters = {
      keyWord,
      keyWordsList,
      selectedCategories,
      allFiles,
      selectedTypes,
      minValue,
      maxValue,
      selectedCurrency,
      selectedTagsFilters,
      selectedOption
    };
    if(keyWordsList.length > 0) count++
    if(selectedCategories.length > 0) count++
    if(selectedTagsFilters.length > 0) count++
    if(selectedTypes.length > 0) count++
    setFiltersCount(count)
    handleApplyFilters(filters);
    setSelectedTags(selectedTagsFilters)


    handleClose();
  };

  useEffect(() => {
    setIsClosing(isFilterOpen);
  }, [isFilterOpen]);

  const fileTypes = ["PDF", "PNG", "JPEG", "SVG", "XLS"];
  useEffect(() => {
    if (allFiles) {
      setSelectedTypes(fileTypes); 
    } else {
      setSelectedTypes([]); 
    }
  }, [allFiles]);


  useCloseOnEsc(onClose);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
      className={`${styles.modalOverlay} ${!isClosing ? styles.fadeOut : ""}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`${styles.modalContent} ${!isClosing ? styles.scaleDown : ""}`}
      >


        <HeaderCard title={t('filter')} setState={handleClose}>
          <Button
            type="white"
            action={() => {
              handleCancel();
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            action={() => {
              handleApplyFiltering();
            }}
          >
            {t('search')}
          </Button>
        </HeaderCard>
        <div style={{padding:"0px 20px 10px 20px"}}>
        <div className={styles.contentContainer}>
          <div>
              <FiltersDropdownContainer
                            setSelectedFilters={setSelectedOption}
                            selectedFilters={selectedOption}
                            options={options}
                          />
          </div>
          <div>
            {" "}
            <h2 className={styles.inputTitle}>{t('searchByKeyword')}</h2>
            {keyWordsList.length >= 1 && (
              <div className={styles.keyWordContainer}>
                {keyWordsList?.map((keyword) => (
                  <div className={styles.keyword}>
                    {keyword}{" "}
                    <DeleteButton
                      action={() => {
                        setKeyWordsList((prev) =>
                          prev.filter((item) => item !== keyword)
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <InputWithTitle
              bgColor="var(--f4-background)"
              titleColor="var(--_18181b-color)"
              textStyles={{
                display: "flex",

                gap: "5px",
                fontWeight: 500,
                color: "var(--_3d3c42-color)",
                marginLeft: "6px",
                userSelect: "none",
              }}
              inputHeight="31px"
              title=""
              placeholder={t('titlesContainsEmailOrAddress')}
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onKeyDownProp={(e) => {
                if (e.key === "Enter" && keyWord.trim().length > 0) {
                  e.preventDefault(); 

                  const newWords = keyWord
                    .split(",")
                    .map((word) => word.trim())
                    .filter(
                      (word) => word.length > 0 && !keyWordsList.includes(word)
                    );

                  if (newWords.length > 0) {
                    setKeyWordsList((prev) => [...prev, ...newWords]);
                  }

                  setKeyWord(""); 
                }
              }}
            />
          </div>
          <div>
            <h2 className={styles.inputTitle}>{t('searchByCategory')}</h2>
            {selectedCategories.length >= 1 && (
              <div className={styles.keyWordContainer}>
                {selectedCategories?.map((keyword) => (
                  <div className={styles.keyword}>
                    {keyword}{" "}
                    <DeleteButton
                      action={() => {
                        setSelectedCategories((prev) =>
                          prev.filter((item) => item !== keyword)
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <CustomDropdown
              height="31px"
              textStyles={{
                display: "flex",

                gap: "5px",
                fontWeight: 500,
                color: "var(--_3d3c42-color)",
                marginLeft: "6px",
                userSelect: "none",
              }}
              options={showVariables}
              selectedOption={selectedCategory}
              setSelectedOption={(clickedItem) => {
                setSelectedCategories((prevSelected) => {
                  if (prevSelected.includes(clickedItem)) {
                    return prevSelected.filter((item) => item !== clickedItem);
                  }
                  return [...prevSelected, clickedItem];
                });
              }}
            />
          </div>
          <div>
            <h2 className={styles.inputTitle}>{t('searchByType')}</h2>
            <CheckboxWithText
              state={allFiles}
              setState={setAllFiles}
              text={t('allowAllFileTypes')}
            />

            {!allFiles && (
              <>
                <div className={styles.cardTypesContainer}>
                  {selectedTypes.map((type) => (
                    <div className={styles.singleTypeCard}>
                      <span>{type}</span>
                      <div
                        onClick={() =>
                          setSelectedTypes(
                            selectedTypes.filter((option) => option !== type)
                          )
                        }
                        className={styles.minusIcon}
                      >
                        <img src={minusIcon} alt="minusIcon" />
                      </div>
                    </div>
                  ))}
                </div>

                <CustomDropdown
                  options={fileTypes}
                  selectedOption={selectedTypes}
                  height="31px"
                  textStyles={{
                    display: "flex",

                    gap: "5px",
                    fontWeight: 500,
                    color: "var(--_3d3c42-color)",
                    marginLeft: "6px",
                    userSelect: "none",
                  }}
                  setSelectedOption={(selected) =>
                    setSelectedTypes((prev) => {
                      if (prev.includes(selected)) {
                        return prev.filter((option) => option !== selected);
                      } else {
                        return [...prev, selected];
                      }
                    })
                  }
                />
              </>
            )}
          </div>
       
          <div>
            <h2 className={styles.inputTitle}>{t('searchByTag')}</h2>
            <div
              style={{ backgroundColor: "var(--f4-background)", height: "31px" }}
              className={styles.inputContainer}
            >
              <img src={searchGray} alt="searchGray" />
              <input
                type="text"
                placeholder={t('searchTag')}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className={styles.inputWithTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tag.trim().length > 0) {
                    e.preventDefault(); 

                    const newTags = tag
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t.length > 0 && !selectedTagsFilters.includes(t)); 

                    if (newTags.length > 0) {
                      setSelectedTagsFilters((prev) => [...prev, ...newTags]);
                    }

                    setTag(""); 
                  }
                }}
              />
            </div>
            <div className={styles.tagsContainer}>
              {selectedTagsFilters.map((tag, index) => (
                <div
                  className={styles.singleTag}
                  style={{ backgroundColor: colors[index % colors.length] }}
                  key={index}
                >
                  <span>{tag}</span>
                  <DeleteButton
                    action={() =>
                      setSelectedTagsFilters(
                        selectedTagsFilters.filter((option) => option !== tag)
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FilesFilterModal;
