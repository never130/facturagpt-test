import React, { useState, useEffect } from "react";
import styles from "./Pricing.module.css";
import Navbar from "../../components/Navbar/Navbar";
import PricingPlanCard from "../../components/PricingPlanCard/PricingPlanCard";
import { PricingCard } from "../../components/PricingCard/PricingCard";
import star from "../../assets/star.svg";
import diagonalArrow from "../../assets/diagonalArrow.svg";
import topTrustpilotStar from "../../assets/topTrustpilotStar.svg";
import bottomTrustpilotStar from "../../assets/bottomTrustpilotStar.svg";
import googleLogo from "../../assets/googleLogo.svg";
import googleStar from "../../assets/googleStar.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CookiePopup from "../../components/CookiePopup/CookiePopup";
import SubtitleTemplate from "../../components/SubtitleTemplate/SubtitleTemplate";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import { ReactComponent as Included } from "../../assets/includedIcon.svg";
import { ReactComponent as NotIncluded } from "../../assets/notIncludedIcon.svg";
import { ReactComponent as CheckCircleFeatures } from "../../assets/checkCircleFeatures.svg";
import { ReactComponent as ArrowDiagonal } from "../../assets/diagonalArrowWhite.svg";
import { ReactComponent as HelpBlackCircleIcon } from "../../assets/HelpBlackCircleIcon.svg";
import { ReactComponent as HelpIcon } from "../../assets/HelpIcon.svg";
import BillingSlider from "../../components/BillingSlider/BillingSlider";
import FooterLanding from "../../components/FooterLanding/FooterLanding";
import PlanSelector from "./PlanSelector/PlanSelector";
import Button from "../../components/Button/Button";
import FAQ from "../../components/Faqs/Faqs";
const Pricing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["pricingCard", "Landing"]);
  const [sliderValue, setSliderValue] = useState(10);
  const [selectedCard, setSelectedCard] = useState(0);
  const [currentPlan, setCurrentPlan] = useState({
    documents: "+100.000 Documentos",
    price: "0,05",
  });
  const [displayValue, setDisplayValue] = useState("0’00€");
  const [additionalInfo, setAdditionalInfo] = useState('');
  const plansData = [
    {
      title: "Free",
      features: [
        t("features_free1"),
        t("features_free2"),
        t("features_free3"),
        t("features_free4"),
      ],
      pricing: t("features_free_Pricing"),
    },
    {
      title: "Plus",
      features: [
        t("features_plus1"),
        t("features_plus2"),
        t("features_plus3"),
        t("features_plus4"),
      ],
      pricing: t("features_plus_Pricing"),
    },
    {
      title: "Pro",
      features: [
        t("features_pro1"),
        t("features_pro2"),
        t("features_pro3"),
        t("features_pro4"),
        t("features_pro5"),
      ],
      pricing: t("features_pro_Pricing"),
    },
    {
      title: "Enterprise",
      features: [
        t("features_enterprise1"),
        t("features_enterprise2"),
        t("features_enterprise3"),
        t("features_enterprise4"),
        t("features_enterprise5"),
      ],
      pricing: t("features_enterprise_Pricing"),
    },
    {
      title: "Custom",
      features: [
        t("features_custom1"),
        t("features_custom2"),
        t("features_custom3"),
      ],
      pricing: t("features_custom_Pricing"),
      buttonType: true,
    },
  ];

  const benefits = [
    {
      name: t("documents"),
      basic: t("basic_documents"),
      standard: t("standard_documents"),
      pro: t("pro_documents"),
      enterprise: t("enterprise_documents"),
    },
    {
      name: t("contact_creation"),
      basic: t("basic_contacts"),
      standard: t("standard_contacts"),
      pro: t("pro_contacts"),
      enterprise: t("enterprise_contacts"),
    },
    {
      name: t("asset_management"),
      basic: t("basic_assets"),
      standard: t("standard_assets"),
      pro: t("pro_assets"),
      enterprise: t("enterprise_assets"),
    },
    {
      name: t("chat_responses"),
      basic: t("basic_chat_responses"),
      standard: t("standard_chat_responses"),
      pro: t("pro_chat_responses"),
      enterprise: t("enterprise_chat_responses"),
    },
    {
      name: t("currencies"),
      basic: t("basic_currencies"),
      standard: t("standard_currencies"),
      pro: t("pro_currencies"),
      enterprise: t("enterprise_currencies"),
    },
    {
      name: t("invoice_access"),
      basic: t("basic_invoice_access"),
      standard: t("standard_invoice_access"),
      pro: t("pro_invoice_access"),
      enterprise: t("enterprise_invoice_access"),
    },
    {
      name: t("daily_backups"),
      basic: t("basic_daily_backups"),
      standard: t("standard_daily_backups"),
      pro: t("pro_daily_backups"),
      enterprise: t("enterprise_daily_backups"),
    },
    {
      name: t("unlimited_storage"),
      basic: t("basic_unlimited_storage"),
      standard: t("standard_unlimited_storage"),
      pro: t("pro_unlimited_storage"),
      enterprise: t("enterprise_unlimited_storage"),
    },
    {
      name: t("real_time_access"),
      basic: t("basic_real_time_access"),
      standard: t("standard_real_time_access"),
      pro: t("pro_real_time_access"),
      enterprise: t("enterprise_real_time_access"),
    },
    {
      name: t("advanced_document_search"),
      basic: t("basic_advanced_document_search"),
      standard: t("standard_advanced_document_search"),
      pro: t("pro_advanced_document_search"),
      enterprise: t("enterprise_advanced_document_search"),
    },
    {
      name: t("quote_to_invoice_conversion"),
      basic: t("basic_quote_to_invoice_conversion"),
      standard: t("standard_quote_to_invoice_conversion"),
      pro: t("pro_quote_to_invoice_conversion"),
      enterprise: t("enterprise_quote_to_invoice_conversion"),
    },
    {
      name: t("bank_integration"),
      basic: t("basic_bank_integration"),
      standard: t("standard_bank_integration"),
      pro: t("pro_bank_integration"),
      enterprise: t("enterprise_bank_integration"),
    },
    {
      name: t("pdf_invoice_signing"),
      basic: t("basic_pdf_invoice_signing"),
      standard: t("standard_pdf_invoice_signing"),
      pro: t("pro_pdf_invoice_signing"),
      enterprise: t("enterprise_pdf_invoice_signing"),
    },
    {
      name: t("qr_code"),
      basic: t("basic_qr_code"),
      standard: t("standard_qr_code"),
      pro: t("pro_qr_code"),
      enterprise: t("enterprise_qr_code"),
    },
    {
      name: t("invoice_status_control"),
      basic: t("basic_invoice_status_control"),
      standard: t("standard_invoice_status_control"),
      pro: t("pro_invoice_status_control"),
      enterprise: t("enterprise_invoice_status_control"),
    },
    {
      name: t("unlimited_invoice_sending"),
      basic: t("basic_unlimited_invoice_sending"),
      standard: t("standard_unlimited_invoice_sending"),
      pro: t("pro_unlimited_invoice_sending"),
      enterprise: t("enterprise_unlimited_invoice_sending"),
    },
    {
      name: t("invoice_import"),
      basic: t("basic_invoice_import"),
      standard: t("standard_invoice_import"),
      pro: t("pro_invoice_import"),
      enterprise: t("enterprise_invoice_import"),
    },
    {
      name: t("data_export"),
      basic: t("basic_data_export"),
      standard: t("standard_data_export"),
      pro: t("pro_data_export"),
      enterprise: t("enterprise_data_export"),
    },
    {
      name: t("invoice_print_and_email"),
      basic: t("basic_invoice_print_and_email"),
      standard: t("standard_invoice_print_and_email"),
      pro: t("pro_invoice_print_and_email"),
      enterprise: t("enterprise_invoice_print_and_email"),
    },
    {
      name: t("invoice_attachments"),
      basic: t("basic_invoice_attachments"),
      standard: t("standard_invoice_attachments"),
      pro: t("pro_invoice_attachments"),
      enterprise: t("enterprise_invoice_attachments"),
    },
    {
      name: t("sepa_receipts"),
      basic: t("basic_sepa_receipts"),
      standard: t("standard_sepa_receipts"),
      pro: t("pro_sepa_receipts"),
      enterprise: t("enterprise_sepa_receipts"),
    },
    {
      name: t("income_and_costs"),
      basic: t("basic_income_and_costs"),
      standard: t("standard_income_and_costs"),
      pro: t("pro_income_and_costs"),
      enterprise: t("enterprise_income_and_costs"),
    },
    {
      name: t("vat_management"),
      basic: t("basic_vat_management"),
      standard: t("standard_vat_management"),
      pro: t("pro_vat_management"),
      enterprise: t("enterprise_vat_management"),
    },
    {
      name: t("automatic_invoice_submission"),
      basic: t("basic_automatic_invoice_submission"),
      standard: t("standard_automatic_invoice_submission"),
      pro: t("pro_automatic_invoice_submission"),
      enterprise: t("enterprise_automatic_invoice_submission"),
    },
    {
      name: t("discount_management"),
      basic: t("basic_discount_management"),
      standard: t("standard_discount_management"),
      pro: t("pro_discount_management"),
      enterprise: t("enterprise_discount_management"),
    },
    {
      name: t("bulk_upload"),
      basic: t("basic_bulk_upload"),
      standard: t("standard_bulk_upload"),
      pro: t("pro_bulk_upload"),
      enterprise: t("enterprise_bulk_upload"),
    },
    {
      name: t("multiple_addresses"),
      basic: t("basic_multiple_addresses"),
      standard: t("standard_multiple_addresses"),
      pro: t("pro_multiple_addresses"),
      enterprise: t("enterprise_multiple_addresses"),
    },
    {
      name: t("alerts_and_notifications"),
      basic: t("basic_alerts_and_notifications"),
      standard: t("standard_alerts_and_notifications"),
      pro: t("pro_alerts_and_notifications"),
      enterprise: t("enterprise_alerts_and_notifications"),
    },
    {
      name: t("comparative_analysis"),
      basic: t("basic_comparative_analysis"),
      standard: t("standard_comparative_analysis"),
      pro: t("pro_comparative_analysis"),
      enterprise: t("enterprise_comparative_analysis"),
    },
    {
      name: t("cash_flow_analysis"),
      basic: t("basic_cash_flow_analysis"),
      standard: t("standard_cash_flow_analysis"),
      pro: t("pro_cash_flow_analysis"),
      enterprise: t("enterprise_cash_flow_analysis"),
    },
    {
      name: t("billing_analysis"),
      basic: t("basic_billing_analysis"),
      standard: t("standard_billing_analysis"),
      pro: t("pro_billing_analysis"),
      enterprise: t("enterprise_billing_analysis"),
    },
    {
      name: t("warehouse_management"),
      basic: t("basic_warehouse_management"),
      standard: t("standard_warehouse_management"),
      pro: t("pro_warehouse_management"),
      enterprise: t("enterprise_warehouse_management"),
    },
  ];

  const dataAcessTeamCommunity = [
    {
      name: t("workspace"),
      free: 1,
      basic: 1,
      autonomous: 1,
      professional: 2,
      business: 6,
      company: 6,
      corporation: 10,
    },
    {
      name: t("users(access)"),
      free: 1,
      basic: 1,
      autonomous: 3,
      professional: 5,
      business: 10,
      company: 20,
      corporation: 25,
    },
    {
      name: t("customizeBrandColor"),
      free: 'not include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("accessOnAnyDevice"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("accessCustodyInvoices"),
      free: t('3month'),
      basic: t('legalPeriod'),
      autonomous: t('legalPeriod'),
      professional: t('legalPeriod'),
      business: t('legalPeriod'),
      company: t('legalPeriod'),
      corporation: t('legalPeriod'),
    },
  ]

  const dynamicDatabases = [
    {
      name: t("automatedProcesses"),
      free: 1,
      basic: 5,
      autonomous: 10,
      professional: 15,
      business: 20,
      company: 50,
      corporation: 120,
    },
    {
      name: t("dynamicInformationTables"),
      free: 2,
      basic: 5,
      autonomous: 10,
      professional: 30,
      business: 50,
      company: 120,
      corporation: 250,
    }, {
      name: t("massUploadInformation"),
      free: 'not include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("automaticDataExtraction"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("variablesInAllParameters"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("allIntegrations"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("scenarioSimulation"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("customAgents"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("contextualMemory"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("conditionalRules"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("intelligentSemanticQueries"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("comparativeAnalysis"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("graphGeneration"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("reportGeneration"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("voiceAndTextInteraction"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("privateInformationEnviroment"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("differentLlmsAvailable"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
  ]
  const documentManagementBilling = [
    {
      name: t("anyTypeDocumentation"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("exportMultipleFormats"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("printingSendingInvoice"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("documentPreview"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("documentVersioning"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("identificationQR"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("documentationGeneration"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("billingRecord"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("documentEditor"),
      free: 'not include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("verifactuSystem"),
      free: 'not include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("silSystem"),
      free: 'not include',
      basic: 'not include',
      autonomous: 'not include',
      professional: 'not include',
      business: 'include',
      company: 'not include',
      corporation: 'include',
    },
  ]

  const alertsAndNotification = [
    {
      name: t("managingInconsitencies"),
      free: 'not include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("automatedAlerts"),
      free: 'not include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("internalNotifications"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("calendarEntries"),
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: t("tasks"),
      free: t('3Cards'),
      basic: t('unlimited'),
      autonomous: t('unlimited'),
      professional: t('unlimited'),
      business: t('unlimited'),
      company: t('unlimited'),
      corporation: t('unlimited'),
    },
  ]
  const infrastructureAndSecurity = [
    {
      name: t("storageIncluded"),
      free: '500 MB',
      basic: '1 GB',
      autonomous: '5 GB',
      professional: '15 GB',
      business: '50 GB',
      company: '150 GB',
      corporation: '300 GB',
    },
    {
      name: t("dailyBackups"),
      free: 'not include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: 'ISO 27001/9001',
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: 'GDPR',
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
    {
      name: 'SOC2 Compilant-Ready',
      free: 'include',
      basic: 'include',
      autonomous: 'include',
      professional: 'include',
      business: 'include',
      company: 'include',
      corporation: 'include',
    },
  ]
  const cardsData = [
    {
      title: t("until20Pages"),
      price: t("price1"),
      min: 0,
      max: 12799,
      sliding: 0,
    },
    {
      title: t("200Year"),
      price: t("price2"),
      min: 12800,
      max: 22099,
      sliding: 12800,
    },
    {
      title: t("2000Year"),
      price: t("price3"),
      min: 22100,
      max: 31699,
      sliding: 22100,
    },
    {
      title: t("6000Year"),
      price: t("price4"),
      min: 31700,
      max: 41099,
      sliding: 31700,
    },
    {
      title: t("10000Year"),
      price: t("price5"),
      min: 41100,
      max: 49999,
      sliding: 41100,
    },
    {
      title: t("20000Year"),
      price: t("price6"),
      min: 50000,
      max: 96599,
      sliding: 50000,
    },

  ];

  const getSelectedPlanIndex = () => {
    if (sliderValue <= 9000) return 0;
    if (sliderValue <= 49000) return 1;
    if (sliderValue <= 69000) return 2;
    if (sliderValue <= 99000) return 3;
    return 4;
  };

  const selectedPlanIndex = getSelectedPlanIndex();
  const selectedPlan = plansData[selectedPlanIndex];

  const tableHeaders = [
    { label: t(""), key: "" },
    { label: t("free"), key: "free" },
    { label: t("basic"), key: "basic" },
    { label: t("autonomous"), key: "autonomous" },
    { label: t("professional"), key: "professional" },
    { label: t("business"), key: "business" },
    { label: t("company"), key: "company" },
    { label: t("corporation"), key: "corporation" },

  ];

  const cardsAutomatePricing = [
    {
      title: t("storage"),
      price: `1,00€/${t("month")}`,
      quantity: t("1GbExtra"),
    },
    {
      title: t("users"),
      price: `5,00€/${t("month")}`,
      quantity: t("extraAccess"),
    },
    {
      title: t("workspace"),
      price: `10,00€/${t("month")}`,
      quantity: t("extraEnvironment"),
    },
    {
      title: t("extraction"),
      price: t("from020"),
      quantity: t("perPage"),
      textButton: t("seeMore"),
    },
    {
      title: t("automation"),
      price: `2,00€/${t("month")}`,
      quantity: t("anyIntegration"),
      textButton: t("seeMore"),
    },
    {
      title: t("dynamicTable"),
      price: `1,00€/${t("month")}`,
      quantity: t("perExtraTable"),
    },
    {
      title: t("configuration"),
      price: t("tailorMade"),
      quantity: t("byInstitutionCompany"),
    },
    {
      title: t("training"),
      price: t("tailorMade"),
      quantity: t("byInstitutionCompany"),
    },
  ];
  const renderRow = (row, index, onSelect) => (
    <tr key={row.name}>
      <td
        style={{
          minWidth: "300px",
          position: "initial",
          whiteSpace: "normal",
          width: "auto",
          maxWidth: "fit-content",
        }}
      >
        {row.name}
      </td>
      <td>
        {row.free == "include" ? (
          <Included height="15px" />
        ) : row.free == "not include" ? (
          <NotIncluded height="15px" />
        ) : (
          row.free
        )}
      </td>
      <td>
        {" "}
        {row.basic == "include" ? (
          <Included height="15px" />
        ) : row.basic == "not include" ? (
          <NotIncluded height="15px" />
        ) : (
          row.basic
        )}
      </td>
      <td>
        {" "}
        {row.autonomous == "include" ? (
          <Included height="15px" />
        ) : row.autonomous == "not include" ? (
          <NotIncluded height="15px" />
        ) : (
          row.autonomous
        )}
      </td>
      <td>
        {" "}
        {row.professional == "include" ? (
          <Included height="15px" />
        ) : row.professional == "not include" ? (
          <NotIncluded height="15px" />
        ) : (
          row.professional
        )}
      </td>
      <td>
        {" "}
        {row.business == "include" ? (
          <Included height="15px" />
        ) : row.business == "not include" ? (
          <NotIncluded height="15px" />
        ) : (
          row.business
        )}
      </td>
      <td>
        {" "}
        {row.company == "include" ? (
          <Included height="15px" />
        ) : row.company == "not include" ? (
          <NotIncluded height="15px" />
        ) : (
          row.company
        )}
      </td>
      <td>
        {" "}
        {row.corporation == "include" ? (
          <Included height="15px" />
        ) : row.corporation == "not include" ? (
          <NotIncluded height="15px" />
        ) : (
          row.corporation
        )}
      </td>
    </tr>
  );

  useEffect(() => {
    const index = cardsData.findIndex(
      (card) => sliderValue >= card.min && sliderValue <= card.max
    );
    const card = cardsData[index];
    if (card) {
      setCurrentPlan({
        documents: card.title,
        price: card.price,
      });
      setSelectedCard(index);
    }
  }, [sliderValue]);
  React.useEffect(() => {
    const translationId = localStorage.getItem("translationId");
    document.title = `${translationId
        ?.replace(
          translationId?.slice(
            translationId?.length - 3,
            translationId?.length
          ),
          "GPT"
        )
        ?.toUpperCase() || t("facturaGPT")
      } - ${t("Landing:pricing")}`;
  }, []);

  return (
    <div className={styles.pricingContainer}>
      <Navbar />
      <div className={styles.containerP}>
        <div className={styles.plansHeader}>
          <h1 className={styles.plansTitle} style={{ width: "100%" }}>{t("plansTitle")}</h1>
          <SubtitleTemplate
            text={
              <>
                <p>{t("subtitle1")}</p>
                <p>{t("subtitle2")}</p>
              </>
            }

          />
          <PlanSelector />
          <div className={styles.cardsPlansContainer}>
            <div className={styles.cardsContainer}>

            </div>
            <div>
              <SubtitleTemplate
                text={
                  <>
                    <p>{t("taxNotIncluded")}</p>

                  </>
                }
              />
            </div>
            <div className={styles.cardsContainer}>
              {cardsAutomatePricing.map((card) => (
                <div
                  className={`${styles.card} ${styles.cardsAutomatePricing}`}
                >
                  <div className={styles.cardsAutomatePricingInfo}>
                    <p>{card.title}</p>
                    <h4>{card.price}</h4>
                    <span>{card.quantity}</span>
                  </div>
                  <div className={styles.hireButton}>
                    <p>
                      {card.textButton || t("hire")} <ArrowDiagonal />
                    </p>

                    <HelpBlackCircleIcon />
                  </div>
                </div>
              ))}


            </div>
          </div>
        </div>

        <div className={styles.infoCardsData}>
          <h3 className={styles.extractionAndStructuring}><strong className={styles.black}>{t('extractionAnd')}</strong> {' '} <strong className={styles.green}>{t('structuring')}</strong> {' '} {t('ofTheInformation')}</h3>
          <p>{t('recognizeAllParameters')}</p>
        </div>

        <div className={styles.infoContainer}>
          <h3>
            {displayValue} {displayValue !== t('evenMore') && <span>/ {t('month')}</span>}
          </h3>

          {additionalInfo == t('contactSales') ? (
            <Button headerStyle={{ width: '100%', borderRadius: "99px", padding: "8px 12px", height: '47px' }}>{t('contactWithSales')} <img src={diagonalArrow} /></Button>
          ) : <p>{additionalInfo}</p>}
        </div>
        <div className={styles.parent}>
          {cardsData.map((card, index) => (
            <div className={styles.pricingCardContainer}>
              <PricingCard
                key={index}
                index={index}
                title={card.title || t("title1")}
                price={card.price || t("price1")}
                setSelectedCard={setSelectedCard}
                selectedCard={selectedCard}
                buyBtn={false}
                compareSelected={true}
                customStyles={true}
                setSliderValue={setSliderValue}
                min={card.min}
              />
            </div>
          ))}
        </div>

        <BillingSlider
          setSliderValue={setSliderValue}
          sliderValue={sliderValue}
          setDisplayValue={setDisplayValue}
          displayValue={displayValue}
          additionalInfo={additionalInfo}
          setAdditionalInfo={setAdditionalInfo}
        />
      </div>

      <div className={styles.tableBenefitsContainer}>
        <SubtitleTemplate
          stylesProp={{ maxWidth: "800px" }}
          text={
            <>
              <p>“{t("companiesLost8minutes")}</p>
            </>
          }
        />
        <h2 className={styles.plansTitle}>{t('with')} {' '} <strong>FacturaGPT</strong> {' '} <strong className={styles.green}>{t('youSave')}</strong>  {' '} {t('moreThan')} <strong>[xxx€] {t('perYear')}</strong> {' '} — <strong className={styles.green}>{t('equivalentToRecovering')}</strong> <strong>[YYY€] {t('perHour')}</strong>”</h2>
        <SubtitleTemplate
          text={
            <>
              <p className={styles.whatInclude}><span>{t("whatInclude")}</span> {' '} {t('everyPlan')}</p>
              <p>{t("easilyViewFeaturesLevel")}</p>
            </>
          }
        />
        <div className={styles.benefitsTable}>
          <h3 className={styles.tablesTitle}>{t('accesTeamCommunity')}</h3>
          <DynamicTable
            columns={tableHeaders}
            data={dataAcessTeamCommunity}
            renderRow={renderRow}
            hideCheckbox={true}
            father={"pricing"}
          />
          <h3 className={styles.tablesTitle}>{t('dynamicDatabases')}</h3>
          <DynamicTable
            columns={tableHeaders}
            data={dynamicDatabases}
            renderRow={renderRow}
            hideCheckbox={true}
            father={"pricing"}
          />
          <h3 className={styles.tablesTitle}>{t('documentManagementBilling')}</h3>
          <DynamicTable
            columns={tableHeaders}
            data={documentManagementBilling}
            renderRow={renderRow}
            hideCheckbox={true}
            father={"pricing"}
          />
          <h3 className={styles.tablesTitle}>{t('alertsAndNotification')}</h3>
          <DynamicTable
            columns={tableHeaders}
            data={alertsAndNotification}
            renderRow={renderRow}
            hideCheckbox={true}
            father={"pricing"}
          />
          <h3 className={styles.tablesTitle}>{t('infrastructureAndSecurity')}</h3>
          <DynamicTable
            columns={tableHeaders}
            data={infrastructureAndSecurity}
            renderRow={renderRow}
            hideCheckbox={true}
            father={"pricing"}
          />
        </div>
      </div>
      <FAQ father={'pricing'} showContactButton={true} />

      <h1 className={styles.reviewsTitle}>{t("JoinUsToday")}</h1>
      <SubtitleTemplate
        stylesProp={{ maxWidth: "800px" }}
        text={t("oneStepCloser")}
      />

      <div className={styles.trustContainer}>
        <div className={styles.googleCard}>
          <div className={styles.starsContainer}>
            <img
              className={styles.topTrustpilotStar}
              src={googleStar}
              alt="googleStar"
            />
            <img
              className={styles.topTrustpilotStar}
              src={googleStar}
              alt="googleStar"
            />
            <img
              className={styles.topTrustpilotStar}
              src={googleStar}
              alt="googleStar"
            />
            <img
              className={styles.topTrustpilotStar}
              src={googleStar}
              alt="googleStar"
            />
            <img
              className={styles.topTrustpilotStar}
              src={googleStar}
              alt="googleStar"
            />
          </div>
          <img className={styles.googleLogo} src={googleLogo} alt="google" />
        </div>
        <div className={styles.trustpilotCard}>
          <div className={styles.topContainer}>
            <img
              className={styles.topTrustpilotStar}
              src={topTrustpilotStar}
              alt="topTrustpilotStar"
            />
            Trustpilot
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.trustpilotBottomStars}>
              <div className={styles.trustStarContainer}>
                <img src={bottomTrustpilotStar} alt="bottomTrustpilotStar" />
              </div>
              <div className={styles.trustStarContainer}>
                <img src={bottomTrustpilotStar} alt="bottomTrustpilotStar" />
              </div>
              <div className={styles.trustStarContainer}>
                <img src={bottomTrustpilotStar} alt="bottomTrustpilotStar" />
              </div>
              <div className={styles.trustStarContainer}>
                <img src={bottomTrustpilotStar} alt="bottomTrustpilotStar" />
              </div>
              <div className={styles.trustStarContainer}>
                <img src={bottomTrustpilotStar} alt="bottomTrustpilotStar" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="/freetrial" className={styles.startButton}>
        {t("freeTrial")} <img src={diagonalArrow} />
      </a>

      <CookiePopup />
      <FooterLanding />
    </div>
  );
};

export default Pricing;
