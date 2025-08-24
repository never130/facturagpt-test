import React, { use, useEffect, useRef, useState } from "react";
import CardAutomate from "./Components/CardAutomate/CardAutomate";
import { AutomateDataComponent } from "./utils/automatesJson";
import styles from "./automate.module.css";
import { useDispatch, useSelector } from "react-redux";
import k from "../../assets/k.svg";
import { ReactComponent as IconLock } from "./panelAutomate/assets/icon_lock.svg";
import { ReactComponent as Automation } from "../../assets/automation.svg";
import { ReactComponent as AutomationBlack } from "../../assets/automateBlack.svg";
import { ReactComponent as EmptyAutomate } from "../../assets/emptyAutomate.svg";
import { ReactComponent as AutomateEmpty } from "../../assets/automateEmpty.svg";
import { ReactComponent as GreenIcon } from "../../assets/GreenIconBackgroundWhiteCheck.svg";
import { ReactComponent as XGreenIcon } from "../../assets/xGreenIcon.svg";
import { ReactComponent as WalletGreenicon } from "../../assets/walletGreenIcon.svg";
import { ReactComponent as MedicalGreenIcon } from "../../assets/medicalGreenIcon.svg";
import { ReactComponent as InterrogateGreenIcon } from "../../assets/interrogaGreenIcon.svg";
import { ReactComponent as AutomateWhiteGrey } from "../../assets/AutomateWhite.svg";
import { IoShareSocialSharp } from "react-icons/io5";
import searchMagnify from "../../assets/searchMagnify.svg";
import { ReactComponent as FilterIcon1InExplore } from "../../assets/filterIcon1InExplore.svg"

import automation from "../../assets/automation.svg";

import { ReactComponent as AutomationIconGrey } from "../../assets/automationIconGrey.svg";
import IniAutomate from "./panelAutomate/IniAutomate";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import {
  driveIsAuthenticated,
  getAuth,
  getUserAutomatiosByInputSearch,
  getUserDevices,
  oneDriveIsAuthenticated,
  outlookIsAuthenticated,
  telematelIsAuthenticated,
} from "../../../../actions/automate";
import { useTranslation } from "react-i18next";
import PaginationTables from "../PaginationTables/PaginationTables";
import FiltersDropdownContainer from "../FiltersDropdownContainer/FiltersDropdownContainer";
import { setAutomateSelected } from "../../../../slices/automateSlices";
import { setRoleAutomateSlice, setSelectedAutomationDataSlice, setTypeContentAutomateSlice } from "../../../../slices/userSlices";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { Background } from "reactflow";

const Automate = ({
  close,
  newData,
  typeContent,
  isModalAutomate,
  setIsModalAutomate,
  isAnimating,
  setIsAnimating,
  type,
  showDeletePopup,
  setShowDeletePopup,
  setSelectedAutomateToDelete,
  search,
  setHideAutomate,
  hideAutomate,
  setRoleAutomate,
}) => {
  const data = AutomateDataComponent();
  const [t] = useTranslation("Automate");
  const { showModal, isAppleOS } = useSelector((state) => state.user);
  const { userAutomations } = useSelector((state) => state.automate);
  const { user } = useSelector((state) => state.user);
  const [selectedType, setSelectedType] = useState(t("all"));


  const [dataFilter, setDataFilter] = useState(data || newData);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showIniAutomate, setShowIniAutomate] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("in");
  const [visible, setVisible] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [animateState, setAnimateState] = useState(null);
  const [filterCategory, setfilterCategory] = useState(null);
  const [filteredDate, setFilteredDate] = useState(null);
  const [selected, setSelected] = useState(1)
  const [selected2, setSelected2] = useState()

  const handleShowContentAutomate = (
    type,
    automationData,
    fromSelectedAutomation
  ) => {
    console.log('type', type)
    console.log('automationData', automationData)
    console.log('fromSelectedAutomation', fromSelectedAutomation)
    if (fromSelectedAutomation) {
      console.log('mostrando estooooo 11111')
      dispatch(setTypeContentAutomateSlice(""))
      setTimeout(() => {
        dispatch(setTypeContentAutomateSlice(type))
        dispatch(setSelectedAutomationDataSlice(automationData))
      }, 300);
    } else {
      dispatch(setTypeContentAutomateSlice(""))
      dispatch(setSelectedAutomationDataSlice(''))
      console.log('mostrando estooooo 22222')
      setTimeout(() => {
        dispatch(setTypeContentAutomateSlice(type))
        dispatch(setSelectedAutomationDataSlice(automationData))
      }, 300);
    }
  };

  useEffect(() => {
    if (search) {
      if (userAutomations.length > 0) {
        let automationData = userAutomations.find(
          (automation) => automation._id == search
        );
        dispatch(setAutomateSelected(automationData));
        typeContent ? typeContent(automationData?.type, automationData) :
          handleShowContentAutomate(automationData?.type, automationData)
      }
    }
  }, [userAutomations]);

  const handleDataFilter = (searchTerm) => {
    const filteredData = data.filter((card) =>
      card.automateName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDataFilter(filteredData);
  };

  const userId = useSelector((state) => state?.user?.user?.id);
  useEffect(() => {
    dispatch(getAuth("Gmail"));
    dispatch(getUserDevices(userId));
    dispatch(outlookIsAuthenticated());
    dispatch(driveIsAuthenticated());
    dispatch(oneDriveIsAuthenticated());
    dispatch(telematelIsAuthenticated());
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setDataFilter(data || newData);
    } else {
      handleDataFilter(searchTerm);
    }
  }, [searchTerm]);

  const handleCloseNewClient = () => {
    setIsAnimating(true);
    setAnimationDirection("out");
    setAnimateState("out");
    window.history.pushState({}, "", `${window.location.pathname}`);
    setTimeout(() => {
      setIsModalAutomate(false);
      setIsAnimating(false);
      close();
    }, 300);
  };

  useEffect(() => {
    if (hideAutomate) {
      setVisible(false);
      setAnimateState("out");
      setTimeout(() => {
        setAnimateState(null);
      }, 300);
    } else {
      setVisible(true);
      setAnimateState("init");
      setTimeout(() => setAnimateState("in"), 10);
    }
  }, [hideAutomate]);

  const searchInputRef = useRef(null);
  useFocusShortcut(searchInputRef, "k");

  const filteredData = React.useMemo(() => {
    // Si no hay datos, devolvemos array vacío
    if (!userAutomations || userAutomations.length === 0) {
      return [];
    }

    let result = [...userAutomations];

    // 1. Filtro por tipo: "all", "input", "output"
    if (selectedType && selectedType !== "all") {
      result = result.filter((item) => item.role === selectedType);
    }

    if (filterCategory) {
      result = result.filter((item) => item.category === filterCategory);
    }

    if (filteredDate) {
      const getLimitDate = (period) => {
        const now = new Date();
        switch (period) {
          case "1month":
            return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          case "3month":
            return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          case "6month":
            return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          case "1year":
            return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          default:
            return null;
        }
      };

      const limitDate = getLimitDate(filteredDate);
      if (limitDate) {
        result = result.filter((item) => {
          if (!item.createdAt) return false;
          const createdAt = new Date(item.createdAt);
          // Validar que la fecha sea correcta
          return !isNaN(createdAt.getTime()) && createdAt >= limitDate;
        });
      }
    }

    return result;
  }, [userAutomations, selectedType, filterCategory, filteredDate]); // Dependencias correctas
  const inputFilterAutomate = (e) => {
    const inputSearchTerm = e.target.value;
    setSearchTerm(inputSearchTerm);
    dispatch(
      getUserAutomatiosByInputSearch({
        userId: user.id,
        inputValue: inputSearchTerm,
      })
    );
  };

  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);

  const [selectedOption, setSelectedOption] = useState({
    [t("alphabeticOrder")]: "A-Z",
    [t("orderByType")]: "all",
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
      name: t("orderByType"),
      label: t("orderByType"),
      subOptions: [
        { display: t("all"), value: "all" },
        { display: t("input"), value: "input" },
        { display: t("output"), value: "output" },
      ],
    },
    {
      name: t("orderByCategory"),
      label: t("orderByCategory"),
      subOptions: [
        { display: t("Import"), value: t("Import") },
        { display: t("ERP"), value: t("ERP") },
        { display: t("CRM"), value: t("CRM") },
        {
          display: t("PublicAdministration"),
          value: t("PublicAdministration"),
        },
        { display: t("Files"), value: t("Files") },
        { display: t("Communications"), value: t("Communications") },
        { display: t("Meetings"), value: t("Meetings") },
        { display: t("AI"), value: t("AI") },
        { display: t("HR"), value: t("HR") },
        { display: t("Logistics"), value: t("Logistics") },
        { display: t("Fintech"), value: t("Fintech") },
        { display: t("Ecommerce"), value: t("Ecommerce") },
      ],
    },
    {
      name: "date",
      label: t("date"),
      subOptions: [
        { display: t("1month"), value: "1month" },
        { display: t("3month"), value: "3month" },
        { display: t("6month"), value: "6month" },
        { display: t("1year"), value: "1year" },
      ],
    },
  ];

  useEffect(() => {
    setSelectedType(selectedOption[t("orderByType")]);
  }, [selectedOption[t("orderByType")]]);

  useEffect(() => {
    setfilterCategory(selectedOption[t("orderByCategory")]);
  }, [selectedOption[t("orderByCategory")]]);

  useEffect(() => {
    setFilteredDate(selectedOption["date"]);
  }, [selectedOption["date"]]);


  const handleIniAutomate = () => {
    setShowIniAutomate(false);
  };

  return (
    <>
      <div
        style={{ opacity: visible ? 1 : 0 }}
        className={`
          ${styles.content}
          ${styles.expand}
          ${userAutomations?.length <= 0 && searchTerm.length === 0
            ? styles.iniAutomateContainer
            : showIniAutomate
              ? styles.iniAutomateContainer
              : styles.automateContainer
          }
        `}
      >


        <div id="typeContact" className={`${styles.typeContact}`}>

          <React.Fragment >
            <div className={styles.categorContainerButton}>
              <GreenIcon />
              <div className={styles.ContainerRowDirection}>
                <button
                  className={`${styles.categoryButton} ${styles.selected}`}
                  onClick={() => setSelected(1)}
                  type="button"
                >
                  <p>
                    {t('completedSuccessfully')}
                  </p>
                  <span>0</span>
                </button>
              </div>
            </div>
          </React.Fragment>
          <React.Fragment >
            <div className={styles.categorContainerButton}>
              <XGreenIcon />
              <div className={styles.ContainerRowDirection}>

                <button
                  className={`${styles.categoryButton} ${styles.selected}`}
                  onClick={() => setSelected(2)}
                  type="button"
                >
                  <p>
                    {t('failedByError')}
                  </p>
                  <span>0</span>
                </button>
              </div>
            </div>
          </React.Fragment>
          <React.Fragment >
            <div className={styles.categorContainerButton}>
              <InterrogateGreenIcon />
              <div className={styles.ContainerRowDirection}>
                <button
                  className={`${styles.categoryButton} ${styles.selected}`}
                  onClick={() => setSelected(3)}
                  type="button"
                >
                  <p>
                    {t('pendingGluing')}
                  </p>
                  <span>0</span>
                </button>
              </div>
            </div>
          </React.Fragment>
          <React.Fragment >
            <div className={styles.categorContainerButton}>
              <MedicalGreenIcon />
              <div className={styles.ContainerRowDirection}>
                <button
                  className={`${styles.categoryButton} ${styles.selected}`}
                  onClick={() => setSelected(4)}
                  type="button"
                >
                  <p>
                    {t('tokenConsumption')}
                  </p>
                  <span>0</span>
                </button>
              </div>
            </div>
          </React.Fragment>
          <React.Fragment >
            <div className={styles.categorContainerButton}>
              <WalletGreenicon />
              <div className={styles.ContainerRowDirection}>
                <button
                  className={`${styles.categoryButton} ${styles.selected}`}
                  onClick={() => setSelected(5)}
                  type="button"
                >
                  <p>
                    {t('cost')}
                  </p>
                  <span>0</span>
                </button>
              </div>
            </div>
          </React.Fragment>

        </div>
        <div className={styles.filterContainer}>
          <div className={styles.containerDropdowm}>
            <CustomDropdown
              options={[
                t("Import"),
                t("ERP"),
                t("CRM"),
                t("PublicAdministration"),
                "Files",
                "Communications",
                "Meetings",
                "AI",
                "HR",
                "Logistics",
                "Fintech",
                "Ecommerce",
              ]}
              selectedOption={selectedOption[t('orderByCategory')]}

              generalDropdownHeader={{ color: 'black' }}

              height="31px"

              textStyles={{
                display: "flex",

                gap: "5px",
                fontWeight: 500,
                color: "#717182",
                marginLeft: "6px",
                userSelect: "none",
              }}

              setSelectedOption={(selected) =>
                setSelectedOption((prev) => ({
                  ...prev,
                  [t('orderByCategory')]: selected
                }))
              }
            />

          </div>
          <div className={styles.containerDropdowm}>

            <CustomDropdown
              options={["all", "input", "output"]}
              selectedOption={selectedOption[t('orderByType')]}
              height="31px"
              textStyles={{
                display: "flex",

                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              setSelectedOption={(selected) =>
                setSelectedOption((prev) => ({
                  ...prev,
                  [t('orderByType')]: selected
                }))
              }
            />
          </div>
          <div className={styles.containerDropdowm}>
            <CustomDropdown
              options={["1month", "6month", "9month", "1year"]}
              selectedOption={selectedOption[t('date')]}
              height="31px"
              textStyles={{
                display: "flex",

                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              setSelectedOption={(selected) =>
                setSelectedOption((prev) => ({
                  ...prev,
                  [t('date')]: selected
                }))
              }
            />
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <div className={styles.searchIcon}>
              <img src={searchMagnify} alt="searchMagnify" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t("searchYourAutomates")}
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => inputFilterAutomate(e)}
            />
            <FiltersDropdownContainer
              setSelectedFilters={setSelectedOption}
              selectedFilters={selectedOption}
              options={options}
            />
            {isAppleOS && <FilterIcon1InExplore />}
            <div
              style={{ marginLeft: "7px" }}
              className={styles.searchIconsWrappers}
            >
              <img src={k} alt="kIcon" />
            </div>
          </div>
          <div className={styles.rightButtonsContainer} >
            {/* <Button
                headerStyle={{ all: "unset" }}
                action={() => setShowIniAutomate((prev) => !prev)}
              >
              </Button> */}

            <Button
              action={() => {
                typeContent ? (
                  typeContent("workflow", {
                    labels: [
                      {
                        name: "",
                        conditions: [
                          {
                            title: "",
                            description: "",
                          },
                        ],
                        newCondition: {
                          title: "",
                          description: "",
                        },
                        filters: [
                          {
                            id: Date.now(),
                            conditionCurrency: {
                              title: "",
                              description: "",
                            },
                            conditionOperator: "CONTAINS",
                            conditionValue: "",
                            type: "Condition",
                          },
                        ],
                      },
                    ],

                  })) : handleShowContentAutomate("Gmail", {
                    labels: [
                      {
                        name: "",
                        conditions: [
                          {
                            title: "",
                            description: "",
                          },
                        ],
                        newCondition: {
                          title: "",
                          description: "",
                        },
                        filters: [
                          {
                            id: Date.now(),
                            conditionCurrency: {
                              title: "",
                              description: "",
                            },
                            conditionOperator: "CONTAINS",
                            conditionValue: "",
                            type: "Condition",
                          },
                        ],
                      },
                    ],
                  })
                setRoleAutomate && setRoleAutomate("workflow")
                dispatch(setRoleAutomateSlice("workflow"))
              }}
            >
              <div className={styles.automationIconContainer}>
                <AutomateWhiteGrey />
              </div>
              {" "}
              {t("newWorkflow")}
            </Button>
          </div>
        </div>

        <div className={styles.buttonsContainer} style={{ width: "auto" }}>
          <div id="typeContact" className={`${styles.typeContactFilter}`}
            style={{
              padding: 0,
              width: 'auto'
            }}>

            <React.Fragment >
              <div >

                <button
                  className={`${styles.categoryButton} ${selectedType == 'all' && styles.selected}`}
                  onClick={() => {
                    setSelected2('all')
                    setSelectedType('all')
                  }}
                  type="button"
                >
                  {t('allSingular')}
                  {selectedType == 'all' && <span>{filteredData.length}</span>}
                </button>
              </div>

            </React.Fragment>
            <React.Fragment >
              <div>
                <button
                  className={`${styles.categoryButton} ${selectedType == 'input' && styles.selected}`}
                  onClick={() => {
                    setSelected2('input')
                    setSelectedType('input')
                  }}
                  type="button"
                >
                  {t('input')}
                  {selectedType == 'input' && <span>{filteredData.length}</span>}
                </button>
              </div>
            </React.Fragment>
            <React.Fragment >
              <div>
                <button
                  className={`${styles.categoryButton} ${selectedType == 'output' && styles.selected}`}
                  onClick={() => {
                    setSelected2('output')
                    setSelectedType('output')
                  }}
                  type="button"
                >
                  {t('output')}
                  {selectedType == 'output' && <span>{filteredData.length}</span>}
                </button>
              </div>
            </React.Fragment>
          </div>

        </div>

        {showIniAutomate ||
          (userAutomations?.length <= 0 && searchTerm.length) === 0 ? (
          <div className={styles.iniContainer}>
            <IniAutomate setShowIniAutomate={setShowIniAutomate} typeContent={typeContent} handleShowContentAutomate={handleShowContentAutomate} type={type} />
          </div>
        ) : (
          <div className={styles.automate_content}>


            <div className={styles.contentContainerScroll}>
              <div className={styles.contentContainer}>
                {!filteredData?.length && (
                  <div className={styles.noAutomations}>
                    <AutomateEmpty
                      width={180}
                      height={180}
                      style={{ padding: "40px" }}
                    />

                    <span style={{ fontWeight: "bold" }}>
                      {t("noAutomationsAvailable")}
                    </span>
                    <div className={styles.noAutomationsTextWrapper}>
                      <span style={{ color: "var(--_6-color)" }}>
                        {t("YourDashboardIsEmpty")}
                      </span>
                      <span style={{ color: "var(--_6-color)" }}>
                        {t("yourFirstWorkflow")}
                      </span>
                    </div>

                    <div style={{ marginBottom: "5%" }}>
                      <Button action={() => typeContent ? typeContent("Gmail") : handleShowContentAutomate("Gmail")}>
                        {" "}
                        <Automation
                          height="21px"
                          width="21px"
                          style={{ height: "21px", width: "21px" }}
                        />{" "}
                        {t("newAutomate")}
                      </Button>
                    </div>
                  </div>
                )}
                {userAutomations?.length > 0 &&
                  filteredData
                    ?.sort((a, b) => {
                      const order = selectedOption[t("alphabeticOrder")];
                      const nameA = (
                        a.inputValue ||
                        a.type ||
                        ""
                      ).toLowerCase();
                      const nameB = (
                        b.inputValue ||
                        b.type ||
                        ""
                      ).toLowerCase();
                      if (order === "A-Z") return nameA.localeCompare(nameB);
                      if (order === "Z-A") return nameB.localeCompare(nameA);
                      return 0;
                    })
                    .slice(page * limit, (page + 1) * limit)
                    .map((card, i) => {
                      const filteredAutomation = data.find(
                        (automation) => automation?.type === card?.type
                      );
                      console.log('filteredAutomation',filteredAutomation)
                      return (
                        <>
                          <CardAutomate
                            index={i}
                            loadingTime={card.selectedActionFrequency || 0}
                            fullContent={true}
                            type={filteredAutomation?.type}
                            typeContent={typeContent}
                            handleShowContentAutomate={handleShowContentAutomate}
                            key={card.id}
                            name={filteredAutomation?.automateName}
                            nameTitle={card.inputValue}
                            image={filteredAutomation?.image}
                            rol={card?.role || filteredAutomation?.role}
                            automationData={card}
                            isBorders={true}
                            last={i === dataFilter.length - 1}
                            id={card.id}
                            fromWhere={"selectedAutomate"}
                            searchTerm={searchTerm}
                            handleCloseNewClient={handleCloseNewClient}
                            showDeletePopup={showDeletePopup}
                            setShowDeletePopup={setShowDeletePopup}
                            setSelectedAutomateToDelete={
                              setSelectedAutomateToDelete
                            }
                            allowDoubleClick={true}
                            canSetEditingAutomation={true}
                            close={close}
                            setHideAutomate={setHideAutomate}
                            setRoleAutomate={setRoleAutomate}
                          // editAutomate={editAutomate}
                          />
                        </>
                      );
                    })}
              </div>
            </div>
            {filteredData.length > 20 && (
              <div className={styles.paginationTableContainer}>
                <PaginationTables
                  totalData={filteredData.length}
                  limit={limit}
                  page={page}
                  setPage={setPage}
                  setLimit={setLimit}
                  father={"automate"}
                />
              </div>
            )}
          </div>
        )}

        {userAutomations?.length <= 0 && (
          <div className={styles.footer}>
            <IconLock />
            <span>{t("facturaAnalyzeData")}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Automate;
