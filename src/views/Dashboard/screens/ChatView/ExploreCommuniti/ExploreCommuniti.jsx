import React, { useEffect, useRef, useState } from "react";
import styles from "./ExploreCommuniti.module.css";
import HeaderCard from "../../../components/HeaderCard/HeaderCard";
import Button from "../../../components/Button/Button";
import { useTranslation } from "react-i18next";
import CardExplore from "./CardExplore/CardExplore";
import { ReactComponent as StarExploreWhite } from "../../../assets/starExploreWhite.svg";
import { ReactComponent as FilterIcon1InExplore } from "../../../assets/filterIcon1InExplore.svg";
import { ReactComponent as FilterIcon2InExplore } from "../../../assets/filterIcon2InExplore.svg";
import { ReactComponent as AgentMarketplace } from "../../../assets/agentMarketplace.svg";
import { ReactComponent as CubeMarketplace } from "../../../assets/cubeMarketplace.svg";
import { ReactComponent as CommunityDocIcon } from "../../../assets/communityDocIcon.svg";
import { ReactComponent as CircleInternetIcon } from "../../../assets/InternetWhiteMarketplace.svg";
import { ReactComponent as HomeClock } from "../../../assets/homeClock.svg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import searchMagnify from "../../../assets/searchMagnify.svg";
import k from "../../../assets/k.svg";
import FiltersDropdownContainer from "../../../components/FiltersDropdownContainer/FiltersDropdownContainer";
import PaginationTables from "../../../components/PaginationTables/PaginationTables";
import { useDispatch, useSelector } from "react-redux";
import { getAllAgentsWithCreator } from "../../../../../actions/chat";
import CustomDropdown from "../../../components/CustomDropdown/CustomDropdown";
import DocumentCard from "./DocumentCard/DocumentCard";
import AppsCard from "./AppsCard/AppsCard";
const ExploreCommuniti = ({ close }) => {
  const [t] = useTranslation("ChatView");
  const [selected, setSelected] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValueBots, setInputValueBots] = useState("");
  const searchInputRef = useRef(null);
  const searchInputBotsRef = useRef(null);
  const [botsOpen, setBotsOpen] = useState(true);
  const [animationBots, setAnimationBots] = useState(false);
  const [workspacesOpen, setWorkspacesOpen] = useState(true);
  const [documentsOpen, setDocumentsOpen] = useState(true);
  const [appsOpen, setAppsOpen] = useState(true);
  const [animationWorkspaces, setAnimationWorkspaces] = useState(false);
  const [animationDocuments, setAnimationDocuments] = useState(false);
  const [animationApps, setAnimationApps] = useState(false);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [typeYear, setTypeYear] = useState("Año completo");
  const [year, setYear] = useState("2025");
  const dispatch = useDispatch();
  const { isAppleOS } = useSelector((state) => state.user);
  const { publicAgents } = useSelector((state) => state.chat);
  const [selectedOption, setSelectedOption] = useState({
    [t("alphabeticOrder")]: "A-Z",
    "# Transacciones": "Mayor a menos",
  });

  useEffect(() => {
    if (botsOpen) {
      setTimeout(() => {
        setAnimationBots(true);
      }, 200);
    } else {
      setTimeout(() => {
        setAnimationBots(false);
      }, 200);
    }
  }, [botsOpen]);
  useEffect(() => {
    if (workspacesOpen) {
      setTimeout(() => {
        setAnimationWorkspaces(true);
      }, 200);
    } else {
      setTimeout(() => {
        setAnimationWorkspaces(false);
      }, 200);
    }
  }, [workspacesOpen]);
  useEffect(() => {
    if (appsOpen) {
      setTimeout(() => {
        setAnimationApps(true);
      }, 200);
    } else {
      setTimeout(() => {
        setAnimationApps(false);
      }, 200);
    }
  }, [appsOpen]);

  useEffect(() => {
    if (documentsOpen) {
      setTimeout(() => {
        setAnimationDocuments(true);
      }, 200);
    } else {
      setTimeout(() => {
        setAnimationDocuments(false);
      }, 200);
    }
  }, [documentsOpen]);
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
        { display: t("all"), value: t("all") },
        { display: t("input"), value: t("input") },
        { display: t("output"), value: t("output") },
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
  ];

  useEffect(() => {
    const getPublicAgents = async () => {
      const res = await dispatch(
        getAllAgentsWithCreator({ search: inputValueBots })
      );
    };
    getPublicAgents();
  }, [inputValueBots]);

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${styles.exploreContainer} ${styles.iniAutomateContainer}`}
      >
        <div className={styles.buttonsContainer}>
          <div id="typeContact" className={`${styles.typeContact}`}>
            <React.Fragment>
              <button
                className={`${styles.categoryButton} ${selected == 1 && styles.selected}`}
                onClick={() => setSelected(1)}
                type="button"
              >
                {t("allSingular")}
              </button>
            </React.Fragment>
            <React.Fragment>
              <button
                className={`${styles.categoryButton} ${selected == 2 && styles.selected}`}
                onClick={() => setSelected(2)}
                type="button"
              >
                {t("categoryAZ")}
              </button>
            </React.Fragment>
            <React.Fragment>
              <button
                className={`${styles.categoryButton} ${selected == 3 && styles.selected}`}
                onClick={() => setSelected(3)}
                type="button"
              >
                {t("popularCategory")}
              </button>
            </React.Fragment>
          </div>

          <div className={styles.chartControls}>
            <CustomDropdown
              height="25px"
              options={[1, 2]}
              selectedOption={
                <>
                  <HomeClock />
                  <span>{typeYear}</span>
                </>
              }
              setSelectedOption={(option) => setTypeYear(option)}
              generalDropdownHeader={{ color: "#6E6E80" }}
              generalStyleFilterSort={{
                whiteSpace: "nowrap",
                padding: "0px 6px 0px 0px",
              }}
              arrowColorCustom={"#6E6E80"}
              arrowSizeCustom={12}
            />
            <CustomDropdown
              height="25px"
              options={[1, 2]}
              selectedOption={year}
              setSelectedOption={(option) => setYear(option)}
              backgroundColor={"transparent"}
              generalDropdownHeader={{ color: "#6E6E80" }}
              generalStyleFilterSort={{ justifyContent: "end" }}
              arrowColorCustom={"#6E6E80"}
              arrowSizeCustom={12}
              type={"pagination"}
            />
          </div>

          <div className={styles.buttonsRight}>
            <Button
              type="white"
              headerStyle={{
                borderRadius: "40px",
                zIndex: "1",
                fontWeight: "bold",
                fontSize: "12px",
                padding: "5px",
              }}
              action={() => console.log()}
            >
              {" "}
              <CircleInternetIcon fill={"#030303"} /> {t("published")}
            </Button>
            <Button
              type="white"
              headerStyle={{
                borderRadius: "40px",
                zIndex: "1",
                fontWeight: "bold",
                fontSize: "12px",
                background: "#4F5660",
                padding: "5px",
              }}
              action={() => console.log()}
            >
              {" "}
              <CircleInternetIcon fill={"white"} /> {t("published")}
            </Button>
          </div>
        </div>
        <div className={styles.boxContainer}>
          <div className={styles.box}>
            <div className={styles.firstLine}>
              <div className={styles.left}>
                <span>{t("publishedBots")}</span>
              </div>
              <div className={styles.right}>
                <span className={styles.colorGreen}>0,00 €</span>
                <span className={styles.colorGrey}> {t("incredits")} </span>
              </div>
            </div>
            <div className={styles.secondLine}>
              <div className={styles.left}>
                <AgentMarketplace />
              </div>

              <div className={styles.right}>00</div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.firstLine}>
              <div className={styles.left}>
                <span>{t("publishedWorkspaces")}</span>
              </div>
              <div className={styles.right}>
                <span className={styles.colorGreen}>0,00 €</span>
                <span className={styles.colorGrey}> {t("incredits")} </span>
              </div>
            </div>
            <div className={styles.secondLine}>
              <div className={styles.left}>
                <CubeMarketplace />
              </div>

              <div className={styles.right}>00</div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.firstLine}>
              <div className={styles.left}>
                <span>{t("documents")}</span>
              </div>
              <div className={styles.right}>
                <span className={styles.colorGreen}>0,00 €</span>
                <span className={styles.colorGrey}> {t("incredits")} </span>
              </div>
            </div>
            <div className={styles.secondLine} style={{ height: "50px" }}>
              <div className={styles.left}>
                <CommunityDocIcon />
              </div>

              <div className={styles.right}>00</div>
            </div>
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
              placeholder={t("searchForBotsAndWorkspaces")}
              className={styles.searchInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div>
              <FiltersDropdownContainer
                setSelectedFilters={setSelectedOption}
                selectedFilters={selectedOption}
                options={options}
              />
            </div>
            {isAppleOS && <FilterIcon1InExplore />}
            <div
              onClick={() => searchInputRef.current.focus()}
              style={{ marginLeft: "7px" }}
              className={styles.searchIconsWrappers}
            >
              <img src={k} alt="kIcon" />
            </div>
          </div>
          <FilterIcon2InExplore style={{ paddingRight: "15px" }} />
        </div>
        <div className={styles.buttonsContainer}>
          <div id="typeContact" className={`${styles.typeContact}`}>
            <React.Fragment>
              <button
                className={`${styles.categoryButton} ${selected == 1 && styles.selected}`}
                onClick={() => setSelected(1)}
                type="button"
              >
                {t("allSingular")}
              </button>
            </React.Fragment>
            <React.Fragment>
              <button
                className={`${styles.categoryButton} ${selected == 2 && styles.selected}`}
                onClick={() => setSelected(2)}
                type="button"
              >
                {t("categoryAZ")}
              </button>
            </React.Fragment>
            <React.Fragment>
              <button
                className={`${styles.categoryButton} ${selected == 3 && styles.selected}`}
                onClick={() => setSelected(3)}
                type="button"
              >
                {t("popularCategory")}
              </button>
            </React.Fragment>
          </div>
          <div className={styles.buttonsRight}>
            <Button
              type="white"
              headerStyle={{
                borderRadius: "40px",
                zIndex: "1",
                fontWeight: "bold",
                fontSize: "12px",
                padding: "5px",
              }}
              action={() => console.log()}
            >
              {" "}
              <CircleInternetIcon fill={"var(--_030303-color)"} />{" "}
              {t("published")}
            </Button>
            <Button
              type="white"
              headerStyle={{
                borderRadius: "40px",
                zIndex: "1",
                fontWeight: "bold",
                fontSize: "12px",
                background: "#4F5660",
                padding: "5px",
              }}
              action={() => console.log()}
            >
              {" "}
              <CircleInternetIcon fill={"white"} /> {t("published")}
            </Button>
          </div>
        </div>
        <div>
          <div className={styles.subTitleContainer}>
            <div className={styles.subTitle}>
              <AgentMarketplace width={15} height={15} /> <h5>{t("bots")}</h5>
            </div>
            <div>
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <div className={styles.searchIcon}>
                    <img src={searchMagnify} alt="searchMagnify" />
                  </div>
                  <input
                    ref={searchInputBotsRef}
                    type="text"
                    placeholder={t("search")}
                    className={styles.searchInput}
                    value={inputValueBots}
                    onChange={(e) => setInputValueBots(e.target.value)}
                  />
                  <div>
                    <FiltersDropdownContainer
                      setSelectedFilters={setSelectedOption}
                      selectedFilters={selectedOption}
                      options={options}
                    />
                  </div>
                  {isAppleOS && <FilterIcon1InExplore />}
                  <div
                    onClick={() => searchInputRef.current.focus()}
                    style={{ marginLeft: "7px" }}
                    className={styles.searchIconsWrappers}
                  >
                    <span className={styles.IconA}>A</span>
                    {/* <img src={k} alt="kIcon" /> */}
                  </div>
                </div>
                {/* <FilterIcon2InExplore style={{ paddingRight: "15px" }} /> */}
              </div>
            </div>
          </div>
          <div
            className={`${styles.cardsContainer} ${botsOpen && styles.cardContainerOpen} ${animationBots && styles.animation}`}
          >
            {/* {publicAgents.map((agent) => (
              <CardExplore
                review={4.5}
                name={agent?.name}
                imageUrl={agent.image}
                creator={agent.creator}
                data={agent}
              />
              ))} */}
              <CardExplore
                review={4.5}
              />
          </div>

          <div
            onClick={() => setBotsOpen(!botsOpen)}
            className={styles.showMoreContainer}
          >
            <div className={styles.linea}></div>
            <div className={styles.showMore}>
              {t("showMore")}{" "}
              <FaChevronDown
                size={16}
                fill={"var(--_10a37f-background)"}
                className={`${styles.chevronIcon} ${botsOpen && styles.rotated}`}
                style={{ opacity: 1 }}
              />
            </div>
            <div className={styles.linea}></div>
          </div>

          <div className={styles.subTitleContainer}>
            <div className={styles.subTitle}>
              <CubeMarketplace width={15} height={15} />{" "}
              <h5>{t("workspaces")}</h5>
            </div>
            <div>
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <div className={styles.searchIcon}>
                    <img src={searchMagnify} alt="searchMagnify" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("search")}
                    className={styles.searchInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div>
                    <FiltersDropdownContainer
                      setSelectedFilters={setSelectedOption}
                      selectedFilters={selectedOption}
                      options={options}
                    />
                  </div>
                  {isAppleOS && <FilterIcon1InExplore />}
                  <div
                    onClick={() => searchInputRef.current.focus()}
                    style={{ marginLeft: "7px" }}
                    className={styles.searchIconsWrappers}
                  >
                    <span className={styles.IconA}>A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.cardsContainer} ${workspacesOpen && styles.cardContainerOpen} ${animationWorkspaces && styles.animation}`}
          >
            <CardExplore father={"workspace"} review={4.5}
            //  data={workspace}
             />
          </div>

          <div
            onClick={() => setWorkspacesOpen(!workspacesOpen)}
            className={styles.showMoreContainer}
          >
            <div className={styles.linea}></div>
            <div className={styles.showMore}>
              {t("showMore")}{" "}
              <FaChevronDown
                size={16}
                fill={"var(--_10a37f-background)"}
                className={`${styles.chevronIcon} ${workspacesOpen && styles.rotated}`}
                style={{ opacity: 1 }}
              />
            </div>
            <div className={styles.linea}></div>
          </div>

          <div className={styles.subTitleContainer}>
            <div className={styles.subTitle}>
              <CubeMarketplace width={15} height={15} />{" "}
              <h5>{t("documentsAndTemplates")}</h5>
            </div>
            <div>
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <div className={styles.searchIcon}>
                    <img src={searchMagnify} alt="searchMagnify" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("search")}
                    className={styles.searchInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div>
                    <FiltersDropdownContainer
                      setSelectedFilters={setSelectedOption}
                      selectedFilters={selectedOption}
                      options={options}
                    />
                  </div>
                  {isAppleOS && <FilterIcon1InExplore />}
                  <div
                    onClick={() => searchInputRef.current.focus()}
                    style={{ marginLeft: "7px" }}
                    className={styles.searchIconsWrappers}
                  >
                    <span className={styles.IconA}>A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${styles.cardsContainer} ${documentsOpen && styles.cardContainerOpen} ${styles.documentCardContainer} ${animationDocuments && styles.animation}`}
          >
            <DocumentCard />
            <DocumentCard />
            <DocumentCard />
            <DocumentCard />
          </div>
          <div
            onClick={() => setDocumentsOpen(!documentsOpen)}
            className={styles.showMoreContainer}
          >
            <div className={styles.linea}></div>
            <div className={styles.showMore}>
              {t("showMore")}{" "}
              <FaChevronDown
                size={16}
                fill={"var(--_10a37f-background)"}
                className={`${styles.chevronIcon} ${documentsOpen && styles.rotated}`}
                style={{ opacity: 1 }}
              />
            </div>
            <div className={styles.linea}></div>
          </div>
{/* 
          <div
            onClick={() => setWorkspacesOpen(!workspacesOpen)}
            className={styles.showMoreContainer}
          >
            <div className={styles.linea}></div>
            <div className={styles.showMore}>
              {t("showMore")}{" "}
              <FaChevronDown
                size={16}
                fill={"var(--_10a37f-background)"}
                className={`${styles.chevronIcon} ${workspacesOpen && styles.rotated}`}
                style={{ opacity: 1 }}
              />
            </div>
            <div className={styles.linea}></div>
          </div> */}

          <div className={styles.subTitleContainer}>
            <div className={styles.subTitle}>
              <CubeMarketplace width={15} height={15} />{" "}
              <h5>{t("apps")}</h5>
            </div>
            <div>
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <div className={styles.searchIcon}>
                    <img src={searchMagnify} alt="searchMagnify" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("search")}
                    className={styles.searchInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div>
                    <FiltersDropdownContainer
                      setSelectedFilters={setSelectedOption}
                      selectedFilters={selectedOption}
                      options={options}
                    />
                  </div>
                  {isAppleOS && <FilterIcon1InExplore />}
                  <div
                    onClick={() => searchInputRef.current.focus()}
                    style={{ marginLeft: "7px" }}
                    className={styles.searchIconsWrappers}
                  >
                    <span className={styles.IconA}>A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${styles.cardsContainer} ${appsOpen && styles.cardContainerOpen} ${styles.appsCardContainer} ${animationApps && styles.animation}`}
          >
            <AppsCard />
            <AppsCard />
            <AppsCard />
            <AppsCard />
          </div>
          <div
            onClick={() => setAppsOpen(!appsOpen)}
            className={styles.showMoreContainer}
          >
            <div className={styles.linea}></div>
            <div className={styles.showMore}>
              {t("showMore")}{" "}
              <FaChevronDown
                size={16}
                fill={"var(--_10a37f-background)"}
                className={`${styles.chevronIcon} ${appsOpen && styles.rotated}`}
                style={{ opacity: 1 }}
              />
            </div>
            <div className={styles.linea}></div>
          </div>



        </div>
      </div>
    </>
  );
};

export default ExploreCommuniti;
