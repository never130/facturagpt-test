import React, { useEffect, useRef, useState, useMemo } from "react";
import html2pdf from "html2pdf.js";
import Navbar from "../../components/Navbar/Navbar";
import FooterLanding from "../../components/FooterLanding/FooterLanding";
import styles from "./HelpPage.module.css";
import { ReactComponent as HelpIcon } from "../../assets/HelpIcon.svg";
import KIcon from "../../assets/KIcon.svg";
import { ReactComponent as Arrow } from "../../assets/BlackDiagonalArrow.svg";
import { ReactComponent as ControlPanelIcon } from "../../assets/ControlPanelIcon.svg";
import { ReactComponent as WebNewsOportunityIcon } from "../../assets/WebNewsOportunityIcon.svg";
import { ReactComponent as IconSettings } from "../../assets/IconSettings.svg";
import { ReactComponent as BlackProfileIcon } from "../../assets/BlackProfileIcon.svg";
import { ReactComponent as ManagementIcon } from "../../assets/ManagementIcon.svg";
import { ReactComponent as SpeechAndAccesibilityIcon } from "../../assets/SpeechAndAccesibilityIcon.svg";
import { ReactComponent as CubeIcon } from "../../assets/CubeIcon.svg";
import { ReactComponent as InviteMembersIcon } from "../../assets/InviteMembersIcon.svg";
import { ReactComponent as AppsMOdelAndLanguage } from "../../assets/AppsMOdelAndLanguage.svg";
import { ReactComponent as DataControlHelpIcon } from "../../assets/DataControlHelpIcon.svg";

import { ReactComponent as Rocket } from "../../assets/Rocket.svg";
import { ReactComponent as Account } from "../../assets/account.svg";
import { ReactComponent as Bd } from "../../assets/bd.svg";
import { ReactComponent as Workflows } from "../../assets/code-pull-req.svg";
import { ReactComponent as Agent } from "../../assets/Frame.svg";
import { ReactComponent as ClipPath } from "../../assets/Clippathgroup.svg";
import { ReactComponent as ButtonIcon } from "../../assets/buttonicon.svg";
import { ReactComponent as Vector } from "../../assets/Vector.svg";
import { ReactComponent as SecurityIcon } from "../../assets/Security.svg";
import { ReactComponent as Star } from "../../assets/star-alt.svg";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import SearchIconWithIcon from "../../components/SearchIconWithIcon/SearchIconWithIcon";
import TemplateArticleHelp from "./TemplateArticleHelp/TemplateArticleHelp";
import YourAccount from "./YourAccount/YourAccount";
import Team from "./Team/Team";
import Table from "./Table/Table";
import DocumentManagement from "./DocumentManagement/DocumentManagement";
import ContactManagement from "./ContactManagement/ContactManagement";
import AssetManagement from "./AssetManagement/AssetManagement";
import Transactions from "./Transactions/Transactions";
import ControlPanel from "./ControlPanel/ControlPanel";
import Security from "./Security/Security";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import HelpCategory from "./HelpCategory/HelpCategory";
import { Frame, Subscript } from "lucide-react";
import FirstSteeps from "./FirstSteeps/FirstSteeps";
import SubcategoriesList from "./SubcategoriesList/SubcategoriesList";
import Subscription from "./Subscription/Subscription";
import AllCategoryList from "./AllCategoryList/AllCategoryList";


const HelpPage = () => {
  const { t } = useTranslation(["helpPage", "ChatView"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchInputRef = useRef();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  useFocusShortcut(searchInputRef, "k");
  const [isFocused, setIsFocused] = useState(false);
  const pdfRef = useRef(null);

  const pageAdmin = useMemo(() => {
    if (location.pathname.includes('/admin')) {
      return true;
    }
    return false;
  })

  const baseHelpPath = pageAdmin ? "/admin/help" : "/help";

  const UpdateHelpCategory = (category) => {
    setSelectedCategory(category);
    navigate(`/help/${category}`);
  }


  const articles = [

    {
      icon: (
        <>
          <Rocket />
        </>
      ),
      title: t("firstSteeps"),
      quantity: 3,
    },
    {
      icon: (
        <>
          <Account />
        </>
      ),
      title: t("yourAccount"),
      quantity: 5,
    },
    {
      icon: (
        <>
          <Bd />
        </>
      ),
      title: t("tables"),
      quantity: 3,
    },
    {
      icon: (
        <>
          <Workflows />
        </>
      ),
      title: t("automatize"),
      quantity: 3,
    },
    {
      icon: (
        <>
          <Agent />
        </>
      ),
      title: t("agents"),
      quantity: 5,
    },
    {
      icon: (
        <>
          <ClipPath />
        </>
      ),
      title: t("docs"),
      quantity: 5,
    },
    {
      icon: (
        <>
          <ButtonIcon />
        </>
      ),
      title: t("activity"),
      quantity: 6,
    },
    {
      icon: (
        <>
          <Vector />
        </>
      ),
      title: t("comunity"),
      quantity: 3,
    },
    {
      icon: (
        <>
          <SecurityIcon />
        </>
      ),
      title: t("security"),
      quantity: 3,
    },
    {
      icon: (
        <>
          <Star />
        </>
      ),
      title: t("subscription"),
      quantity: 3,
    },
  ];
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = -100; // Subir 5px
      const elementPosition = element.getBoundingClientRect().top; // Posición del elemento respecto al viewport
      const offsetPosition = elementPosition + window.pageYOffset + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  const categories = [
    {
      id: "yourAccount",
      name: t("yourAccount"),
      articles: [
        { title: t("controlPanel"), id: "controlPanel", icon: <ControlPanelIcon/> },
        { title: t('news_and_opportunities'), id: "news_and_opportunities" , icon: <WebNewsOportunityIcon/> },
        { title: t("access_to_settings"), id: "access_to_settings" },
        { title: t("general_settings"), id: "general_settings", icon :<IconSettings/> },
        { title: t("account_profile"), id: "account_profile", icon :<BlackProfileIcon/> },
        { title: t("device_session_management"), id: "device_session_management", icon :<ManagementIcon/> },
        { title: t("speech_and_accessibility"), id: "speech_and_accessibility", icon :<SpeechAndAccesibilityIcon/> },
        { title: t("workspaces"), id: "workspaces", icon :<CubeIcon/> },
        { title: t("invite_team_roles_access"), id: "invite_team_roles_access", icon :<InviteMembersIcon/> },
        { title: t("connected_apps_llms"), id: "connected_apps_llms", icon :<AppsMOdelAndLanguage/> },
        { title: t("data_control"), id: "data_control", icon :<DataControlHelpIcon/> },
      ],
    },
    {
      id: "firstSteeps",
      name: t("firstSteeps"),
      articles: [
        { title: t("whatIsFacturaGPT"), id: "whatIsFacturaGPT" },
        { title: t('navigation_menu_title'), id: "sessionsKeyNavbar" },
        { title: t("register_steps_title"), id: "registerSteeptoSteep" },
        { title: t("first_token_activation"), id: "first_token_activation" },
        { title: t("workspace_creation_title"), id: "workspace_creation_title" },
        { title: t("upload_first_document_title"), id: "upload_first_document_title" },
        { title: t("automate_first_flow_title"), id: "automate_first_flow_title" },
        { title: t("activate_first_agent_title"), id: "activate_first_agent_title" },
        { title: t("useCases"), id: "useCases" },
        { title: t("quick_glossary_and_shortcuts"), id: "quick_glossary_and_shortcuts" },
      ],
    },
    {
      id: "tables",
      name: t("tables"),
      articles: [
        { title: t("createYourGPTs"), id: "createYourGPTs" },
        { title: t("automate"), id: "automate" },
        { title: t("notifications"), id: "notifications" },
      ],
    },
    {
      id: "automatize",
      name: t("automatize"),
      articles: [
        { title: t("fileUpload"), id: "fileUpload" },
        { title: t("navigateFolders"), id: "navigateFolders" },
        { title: t("classificationConcepts"), id: "classificationConcepts" },
        { title: t("quickActions"), id: "quickActions" },
      ],
    },
    {
      id: "agents",
      name: t("agents"),
      articles: [
        { title: t("contactRegistrationControl"), id: "contactRegistrationControl" },
        { title: t("importContacts"), id: "importContacts" },
        { title: t("settingsParameters"), id: "settingsParameters" },
        { title: t("exportContacts"), id: "exportContacts" },
        { title: t("historyTraceability"), id: "historyTraceability" },
      ],
    },
    {
      id: "docs",
      name: t("docs"),
      articles: [
        { title: t("assetRegistrationControl"), id: "assetRegistrationControl" },
        { title: t("discountsTaxes"), id: "discountsTaxes" },
        { title: t("customSettings"), id: "customSettings" },
        { title: t("exportAssets"), id: "exportAssets" },
        { title: t("historyTraceability"), id: "historyTraceability" },
      ],
    },
    {
      id: "activity",
      name: t("activity"),
      articles: [
        { title: t("invoiceManagement"), id: "invoiceManagement" },
        { title: t("transactionQueries"), id: "transactionQueries" },
        { title: t("documentApproval"), id: "documentApproval" },
        { title: t("transactionStatuses"), id: "transactionStatuses" },
        { title: t("paymentAutomation"), id: "paymentAutomation" },
        { title: t("stripeRefundsInProgress"), id: "stripeRefundsInProgress" },
      ],
    },
    {
      id: "comunity",
      name: t("comunity"),
      articles: [
        { title: t("kpiMonitoring"), id: "kpiMonitoring" },
        { title: t("incomeExpenses"), id: "incomeExpenses" },
        { title: t("timeTrackingManagement"), id: "timeTrackingManagement" },
      ],
    },
    {
      id: "security",
      name: t("security"),
      articles: [
        { title: t("documentCustody"), id: "documentCustody" },
        { title: t("deleteAccount"), id: "deleteAccount" },
        { title: t("passwordRecovery"), id: "passwordRecovery" },
      ],
    },
    {
      id: "subscription",
      name: t("subscription"),
      articles: [
        { title: t("documentCustody"), id: "documentCustody" },
        { title: t("deleteAccount"), id: "deleteAccount" },
        { title: t("passwordRecovery"), id: "passwordRecovery" },
      ],
    },
  ];

  const filteredCategories = categories
    .map((category) => {
      const matchesCategory = category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const filteredArticles = category.articles.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchesCategory) {
        return category;
      } else if (filteredArticles.length > 0) {
        return { ...category, articles: filteredArticles };
      }

      return null;
    })
    .filter(Boolean);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const SelectedSubCategory = (subcategory) => {
    setSelectedSubCategory(subcategory);
  }
  const categoryComponents = {
    firstSteeps: <FirstSteeps setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    yourAccount: <YourAccount setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    tables: <Table setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    automatize: <DocumentManagement setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    agents: <ContactManagement setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    docs: <AssetManagement setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    activity: <Transactions setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    comunity: <ControlPanel setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    security: <Security setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
    subscription: <Subscription setSelectedCategory={setSelectedCategory} setSelectedSubCategory={selectedSubCategory} />,
  };

  useEffect(() => {
    if (!categoryId) return;

    const matched = categories.find(
      (cat) => cat.id.toLowerCase() === categoryId.toLowerCase()
    );

    if (matched) {
      setSelectedCategory(matched.id);
    }
  }, [categoryId]);
  React.useEffect(
    () => {
      const translationId = localStorage.getItem("translationId");
      document.title = `${translationId?.replace(translationId
        ?.slice(translationId?.length - 3, translationId?.length), 'GPT')
        ?.toUpperCase() || t("ChatView:facturaGPT")} - ${t('helpCenter')}`;
    }, []
  )
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const selectedArticle = articles.find(
    article => article.title === selectedCategoryData?.name
  );


  const handleDownload = async () => {
    try {
      if (!pdfRef.current) return;

      const node = pdfRef.current;

      const elementWidth = Math.max(
        node.scrollWidth,
        node.clientWidth,
        node.offsetWidth
      );
      const elementHeight = Math.max(
        node.scrollHeight,
        node.clientHeight,
        node.offsetHeight
      );

      // Compute a safe scale to avoid exceeding browser canvas limits
      const MAX_CANVAS_DIMENSION = 16384; // common browser limit
      const maxDim = Math.max(elementWidth, elementHeight);
      const scale = Math.min(1, Math.max(0.1, MAX_CANVAS_DIMENSION / Math.max(1, maxDim)));

      console.log("pdf node size:", { elementWidth, elementHeight, scale });

      // Clone the node to avoid issues with floats/transforms/overflow
      const clone = node.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.left = "0px";
      clone.style.top = "0px";
      clone.style.width = `${elementWidth}px`;
      clone.style.maxWidth = "none";
      clone.style.background = "#ffffff";
      clone.style.zIndex = "-1";
      clone.style.opacity = "1";
      clone.style.transform = "none";
      clone.style.float = "none";
      document.body.appendChild(clone);

      const options = {
        margin: [10, 10, 10, 10],
        filename: "help-center.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: true,
          backgroundColor: "#ffffff",
          letterRendering: true,
          scrollX: 0,
          // Use negative window scroll to avoid cropping when page is scrolled
          scrollY: -window.scrollY,
          windowWidth: Math.max(
            clone.scrollWidth || elementWidth,
            document.documentElement.clientWidth
          ),
          windowHeight: Math.max(
            clone.scrollHeight || elementHeight,
            document.documentElement.clientHeight
          ),
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      };

      // Ensure images inside the node are loaded before rendering
      const images = Array.from(clone.querySelectorAll("img"));
      await Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = img.onerror = res;
              })
        )
      );

      await html2pdf().set(options).from(clone).save();

      // Cleanup clone
      document.body.removeChild(clone);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }
  return (
    <div className={styles.HelpPage}>
      {!pageAdmin && <Navbar />}
      <div className={styles.HelpPageContent} >
        <h2>
          <HelpIcon /> {t("helpCenter")}
        </h2>
        <div className={styles.searchArticleContainer}>
          <h3>{t("howCanWeHelp")}</h3>
          <p>{t("detailedInfo")}</p>
          <div className={styles.inputContainer}>
            <SearchIconWithIcon
              ref={searchInputRef}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              classNameIconRight={styles.searchContainerL}
              placeholder={t("searchPlaceholder")}
              onFocusP={() => setIsFocused(true)}
              onBlurP={() => setIsFocused(false)}
            >
              <img
                src={KIcon}
                alt="filterIcon"
                className={styles.searchContainerIcon}
              />
            </SearchIconWithIcon>
            {searchTerm && isFocused && filteredCategories.length > 0 && (
              <div className={styles.recomendQuestions}>
                {filteredCategories.map((category, index) => (
                  <div key={index} className={styles.recommendationItem}>
                    {category.articles.map((article, articleIndex) => (
                      <div
                        key={articleIndex}
                        onMouseDown={() => {
                          navigate(`${baseHelpPath}/${category.id}`);
                          setSelectedCategory(category.id);
                          // 👇 Aquí va el setTimeout con handleScrollTo
                          setTimeout(() => {
                            handleScrollTo(article.id);
                          }, 100);
                        }}
                        className={styles.articleItem}
                      >
                        <div>
                          <p>
                            <strong>{category.name}</strong>
                          </p>
                          <span>{article.title}</span>
                        </div>
                        <Arrow />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div onClick={handleDownload}>
            download here
          </div>
          {/* <div 
         
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "red",
            float: "right",
          }}
          >
           
            <AllCategoryList
             ref={pdfRef} 
              />
          </div> */}
        </div>
        {!selectedCategory ? (
          <div className={styles.articlesContainer}>
            {articles.map((article, index) => {
              const category = categories.find(
                (cat) => cat.name === article.title
              );
              return (
                <div
                  key={index}
                  className={styles.articleCard}
                  onMouseDown={() => {
                    navigate(`${baseHelpPath}/${category.id}`);
                    setSelectedCategory(category.id);
                  }}
                >
                  <div className={styles.articleIcon}>{article.icon}</div>
                  <h4>{article.title}</h4>
                  <p>
                    {article.quantity} {t("articles")}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.selectedCategoryContainer}>
            <HelpCategory category={selectedCategory} updateCategory={UpdateHelpCategory} />
            <div className={styles.categoryArticles}>
              {categoryComponents[selectedCategory] || <p>{t("categoryNotFound")}</p>}
            </div>
            <SubcategoriesList
              subcategories={categories.find(cat => cat.id === selectedCategory)?.articles || []}
              onSelectSubCategory={SelectedSubCategory}
              selectedCategoryName={categories.find(cat => cat.id === selectedCategory)?.name || ""}
              article={articles.find(article => article.title === categories.find(cat => cat.id === selectedCategory)?.name)}
              icon={selectedArticle?.icon}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleScrollTo={handleScrollTo}
            />
          </div>
        )}
      </div>
      {!pageAdmin && <FooterLanding />}
    </div>
  );
};

export default HelpPage;
