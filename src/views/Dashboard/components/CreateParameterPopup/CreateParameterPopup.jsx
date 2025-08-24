import React, { useEffect, useState } from "react";
import styles from "./CreateParameterPopup.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { ReactComponent as CharacterParamIcon } from "../../assets/CharacterParamIcon.svg";
import { ReactComponent as TextBoxParamIcon } from "../../assets/TextBoxParamIcon.svg";
import { ReactComponent as UnitMeasureParamIcon } from "../../assets/UnitMeasureParamIcon.svg";
import { ReactComponent as DateParamIcon } from "../../assets/DateParamIcon.svg";
import { ReactComponent as LocationParamIcon } from "../../assets/LocationParamIcon.svg";
import { ReactComponent as ContactIdentification } from "../../assets/contactIdentificationIcon.svg";
import { ReactComponent as TextBoxIcon } from "../../assets/TextBoxIcon.svg";
import { ReactComponent as NumberIcon } from "../../assets/NumberIcon.svg";
import { ReactComponent as UnitOfMeasurementIcon } from "../../assets/UnitOfMeasurementIcon.svg";
import { ReactComponent as AmountIcon } from "../../assets/AmountIcon.svg";
import { ReactComponent as DiscountIcon } from "../../assets/DiscountIcon.svg";
import { ReactComponent as PercentageIcon } from "../../assets/PercentageIcon.svg";
import { ReactComponent as DateIcon } from "../../assets/DateIcon.svg";
import { ReactComponent as DateRangesIcon } from "../../assets/DateRangesIcon.svg";
import { ReactComponent as LocationIcon } from "../../assets/LocationIcon.svg";
import { ReactComponent as FilesMediaIcon } from "../../assets/FilesMediaIcon.svg";
import { ReactComponent as listIcon } from "../../assets/ListIconNew.svg";
import { ReactComponent as CategoryIcon } from "../../assets/CategoryIcon.svg";
import { ReactComponent as TagIcon } from "../../assets/TagIconNew.svg";
import { ReactComponent as StatusIcon } from "../../assets/StatusIcon.svg";
import { ReactComponent as ChecklistIcon } from "../../assets/ChecklistIcon.svg";
import { ReactComponent as EmailIcon } from "../../assets/EmailIconNew.svg";
import { ReactComponent as PhoneIcon } from "../../assets/phoneIcon.svg";
import { ReactComponent as ContactIcon } from "../../assets/ContactIcon.svg";
import { ReactComponent as AssetIcon } from "../../assets/AssetIcon.svg";
import { ReactComponent as UrlIcon } from "../../assets/UrlIcon.svg";
import { ReactComponent as ChronometerIcon } from "../../assets/ChronometerIcon.svg";
import { ReactComponent as VoiceRecorderIcon } from "../../assets/VoiceRecorderIcon.svg";
import { ReactComponent as LanguageIcon } from "../../assets/LanguageIcon.svg";
import { ReactComponent as FormulaIcon } from "../../assets/FormulaIcon.svg";
import { ReactComponent as AssessmentIcon } from "../../assets/AssessmentIcon.svg";
import { ReactComponent as PencilEditIcon } from "../../assets/pencilEdit.svg";
import NavigationPopups from "../NavigationPopups/NavigationPopups";
import Textbox from "./types/Textbox";
import NumberComponent from "./types/NumberComponent";
import UnitOfMeasurement from "./types/UnitOfMeasurement";
import Amount from "./types/Amount";
import { ReactComponent as BlackCircleChecked } from "../../assets/blackCircleChecked.svg";
import Discount from "./types/Discount";
import Percentage from "./types/Percentage";
import DateComponent from "./types/Date";
import DateRanges from "./types/DateRanges";
import Location from "./types/Location";
import FilesMedia from "./types/FilesMedia";
import List from "./types/List";
import Category from "./types/Category";
import ColorList from "./types/ColorList";
import Tag from "./types/Tag";
import NewTag from "../NewTag/NewTag";
import Status from "./types/Status";
import Checklist from "./types/Checklist";
import Email from "./types/Email";
import Phone from "./types/Phone";
import Contact from "./types/Contact";
import Asset from "./types/Asset";
import Url from "./types/Url";
import Chronometer from "./types/Chronometer";
import VoiceRecorder from "./types/VoiceRecorder";
import LanguageType from "./types/LanguageType";
import Assessment from "./types/Assessment";
import Formula from "./types/Formula";
import Hour from "./types/Hour";
import DateAndHour from "./types/DateAndHour";
import RichTextEditor from "./types/RichTextEditor";
import Html from "./types/Html";
import SelectCurrencyPopup from "../SelectCurrencyPopup/SelectCurrencyPopup";
import Array from "./types/Array";
import Object from "./types/Object";
import Json from "./types/Json";
import Xml from "./types/Xml";
import Currency from "./types/Currency";
import Uuid from "./types/Uuid";
import Qr from "./types/Qr";
import BarCode from "./types/BarCode";
import DigitalSignature from "./types/DigitalSignature";
import Coordinates from "./types/Coordinates";
import Audio from "./types/Audio";
import DatabaseRelationship from "./DatabaseRelationship/DatabaseRelationship";

const CreateParameterPopup = ({
  setState,
  setShowCreateParameter,
  setLocationState,
  setTypeLocation,
  locationParameter,
  saveParameter,
  updateParameter,
  tableId,
  initialParameterType,
  setInitialParameterType,
  setCurrentParameter,
  currentParameter
}) => {
  const [t] = useTranslation("Contacts");

  const [editingInput, setEditingInput] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [showSelectCurrencyPopup, setShowSelectCurrencyPopup] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [parameterType, setParameterType] = useState(initialParameterType || currentParameter?.type || "textBox");
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [parameterData, setParameterData] = useState({
    name: "",
    type:"input",
    value:"",
    value2: "",
    mode: "basic",
    maxMBFiles: 1000000,
    maxMBAudio: 1000000,
    databaseRelationship: t('oneToOne'),
    modeRelationship: "basic",
    currency:{
      name: "Euro",
      code: "EUR",
      symbol: "€"
    },
    ...currentParameter
  });

  console.log("currentParameter", currentParameter);

  const handleChange = (eOrObj) => {
    console.log("eOrObj", eOrObj);
    if (eOrObj?.target) {
      const { name, value } = eOrObj.target;
      setParameterData((prev) => ({ ...prev, [name]: value }));
    } else if (eOrObj?.name && eOrObj?.newValue !== undefined) {
      const { name, newValue } = eOrObj;
      setParameterData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleTitleEdit = () => {
    setEditingTitle(true);
  };

  const handleTitleSave = () => {
    setEditingTitle(false);
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setEditingTitle(false);
    }
  };

  const handleAddParameter = () => {
    if (!parameterData || typeof parameterData !== "object") {
      console.error("parameterData no es un objeto válido:", parameterData);
      return;
    }

    if (currentParameter) {
      console.log('parameterData', parameterData)
      updateParameter({...parameterData, id: currentParameter.id, rowId: currentParameter.rowId, type: parameterType}, tableId);
      setCurrentParameter(null)
      setShowCreateParameter(false);
    } else {
     

    const newParam = {
      ...parameterData,
      subName: "",
      delete: false,
      noDelete: false,
      type: parameterType,
      id: Date.now().toString(36) + Math.random().toString(36),
    };

    setState((prev) => ({
      ...prev,
      parameters: [...(prev.parameters || []), newParam],
    }));
    setInitialParameterType(null)
    setShowCreateParameter(false);

    setParameterData({
      name: "",
      type: parameterType,
      value: "",
      value2: "",
    });

    saveParameter(newParam, tableId);

  }
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

  useEffect(() => {
    setParameterData((prev) => ({
      ...prev,
      // selectedtags: selectedTags,
      tags: tags,
    }));
  }, [selectedTags, tags]);

  const parameterInfo = {
    textBox: {
      title: t("textBoxTitle"),
      description: t("textBoxDescription"),
      icon: <TextBoxIcon />,
      type: t("textBoxType"),
    },
    number: {
      title: t("numberTitle"),
      description: t("numberDescription"),
      icon: <NumberIcon />,
      type: t("numberType"),
    },
    unitOfMeasurement: {
      title: t("unitOfMeasurementTitle"),
      description: t("unitOfMeasurementDescription"),
      icon: <UnitOfMeasurementIcon />,
      type: t("unitOfMeasurementType"),
    },
    amount: {
      title: t("amountTitle"),
      description: t("amountDescription"),
      icon: <AmountIcon />,
      type: t("amountType"),
    },
    // discount: {
    //   title: t("discountTitle"),
    //   description: t("discountDescription"),
    //   icon: <DiscountIcon />,
    //   type: t("discountType"),
    // },
    percentage: {
      title: t("percentageTitle"),
      description: t("percentageDescription"),
      icon: <PercentageIcon />,
      type: t("percentageType"),
    },
    date: {
      title: t("dateTitle"),
      description: t("dateDescription"),
      icon: <DateIcon />,
      type: t("dateType"),
    },
    dateRanges: {
      title: t("dateRangesTitle"),
      description: t("dateRangesDescription"),
      icon: <DateRangesIcon />,
      type: t("dateRangesType"),
    },
    hour: {
      title: t("hourTitle"),
      description: t("hourDescription"),
      icon: <DateIcon />,
      type: t("hourType"),
    },
    dateAndHour: {
      title: t("dateAndHourTitle"),
      description: t("dateAndHourDescription"),
      icon: <DateIcon />,
      type: t("dateAndHourType"),
    },
    richTextEditor: {
      title: t("richTextEditorTitle"),
      description: t("richTextEditorDescription"),
      icon: <DateIcon />,
      type: t("richTextEditorType"),
    },
    html: {
      title: t("htmlTitle"),
      description: t("htmlDescription"),
      icon: <DateIcon />,
      type: t("htmlType"),
    },
    array: {
      title: t("arrayTitle"),
      description: t("arrayDescription"),
      icon: <DateIcon />,
      type: t("arrayType"),
    },
    object: {
      title: t("objectTitle"),
      description: t("objectDescription"),
      icon: <DateIcon />,
      type: t("objectType"),
    },
    location: {
      title: t("locationTitle"),
      description: t("locationDescription"),
      icon: <LocationIcon />,
      type: t("locationType"),
    },
    filesMedia: {
      title: t("filesMediaTitle"),
      description: t("filesMediaDescription"),
      icon: <FilesMediaIcon />,
      type: t("filesMediaType"),
    },
    List: {
      title: t("listTitle"),
      description: t("listDescription"),
      icon: <listIcon />,
      type: t("listType"),
    },
    category: {
      title: t("categoryTitle"),
      description: t("categoryDescription"),
      icon: <CategoryIcon />,
      type: t("categoryType"),
    },
    colorList: {
      title: t("colorListTitle"),
      description: t("colorListDescription"),
      icon: <CharacterParamIcon />,
      type: t("colorListType"),
    },
    tag: {
      title: t("tagTitle"),
      description: t("tagDescription"),
      icon: <TagIcon />,
      type: t("tagType"),
    },
    status: {
      title: t("statusTitle"),
      description: t("statusDescription"),
      icon: <StatusIcon />,
      type: t("statusType"),
    },
    checklist: {
      title: t("checklistTitle"),
      description: t("checklistDescription"),
      icon: <ChecklistIcon />,
      type: t("checklistType"),
    },
    json: {
      title: t("jsonTitle"),
      description: t("jsonDescription"),
      icon: <ChecklistIcon />,
      type: t("jsonType"),
    },
    xml: {
      title: t("xmlTitle"),
      description: t("xmlDescription"),
      icon: <ChecklistIcon />,
      type: t("xmlType"),
    },
    uuid: {
      title: t("uuidTitle"),
      description: t("uuidDescription"),
      icon: <ChecklistIcon />,
      type: t("uuidType"),
    },
    qr: {
      title: t("qrTitle"),
      description: t("qrDescription"),
      icon: <ChecklistIcon />,
      type: t("qrType"),
    },
    barCode: {
      title: t("barCodeTitle"),
      description: t("barCodeDescription"),
      icon: <ChecklistIcon />,
      type: t("barCodeType"),
    },
    digitalSignature: {
      title: t("digitalSignatureTitle"),
      description: t("digitalSignatureDescription"),
      icon: <ChecklistIcon />,
      type: t("digitalSignatureType"),
    },
    coordinates: {
      title: t("coordinatesTitle"),
      description: t("coordinatesDescription"),
      icon: <ChecklistIcon />,
      type: t("coordinatesType"),
    },
    audio: {
      title: t("audioTitle"),
      description: t("audioDescription"),
      icon: <LanguageIcon />,
      type: t("audioType"),
    },
    email: {
      title: t("emailTitle"),
      description: t("emailDescription"),
      icon: <EmailIcon />,
      type: t("emailType"),
    },
    phone: {
      title: t("phoneTitle"),
      description: t("phoneDescription"),
      icon: <PhoneIcon />,
      type: t("phoneType"),
    },
    contact: {
      title: t("contactTitle"),
      description: t("contactDescription"),
      icon: <ContactIcon />,
      type: t("contactType"),
    },
    asset: {
      title: t("assetTitle"),
      description: t("assetDescription"),
      icon: <AssetIcon />,
      type: t("assetType"),
    },
    url: {
      title: t("urlTitle"),
      description: t("urlDescription"),
      icon: <UrlIcon />,
      type: t("urlType"),
    },
    chronometer: {
      title: t("chronometerTitle"),
      description: t("chronometerDescription"),
      icon: <ChronometerIcon />,
      type: t("chronometerType"),
    },
    voiceRecorder: {
      title: t("voiceRecorderTitle"),
      description: t("voiceRecorderDescription"),
      icon: <VoiceRecorderIcon />,
      type: t("voiceRecorderType"),
    },
    language: {
      title: t("languageTitle"),
      description: t("languageDescription"),
      icon: <LanguageIcon />,
      type: t("languageType"),
    },
    assessment: {
      title: t("assessmentTitle"),
      description: t("assessmentDescription"),
      icon: <AssessmentIcon />,
      type: t("assessmentType"),
    },
    formula: {
      title: t("relationShipTitle"),
      description: t("relationShipDescription"),
      icon: <FormulaIcon />,
      type: t("relationShipType"),
    },
  };

  const renderParameterDescription = () => {
    const currentParameter = parameterInfo[parameterType];

    if (!currentParameter) {
      return null;
    }

    return (
      <div className={styles.parameterInfoContainer}>
        <div className={styles.parameterInfoHeader}>
          <div className={styles.parameterInfoIcon}>
            {currentParameter.icon}
          </div>
          <div className={styles.parameterInfoContent}>
            <div className={styles.parameterInfoType}>
              <h4 className={styles.parameterTitle}>
                {currentParameter.title}
              </h4>
              <span>{currentParameter.type}</span>
            </div>
            <p className={styles.parameterDescription}>
              {currentParameter.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderParameterInput = () => {
    switch (parameterType) {
      case "textBox":
        return (
          <Textbox
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "number":
        return (
          <NumberComponent
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "unitOfMeasurement":
        return (
          <UnitOfMeasurement
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "amount":
        return (
          <Amount
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            showSelectCurrencyPopup={showSelectCurrencyPopup}
            setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
            setSelectedCurrency={setSelectedCurrency}
            selectedCurrency={selectedCurrency}
          />
        );
      // case "discount":
      //   return (
      //     <Discount
      //       parameterData={parameterData}
      //       handleChange={handleChange}
      //       editingInput={editingInput}
      //       setEditingInput={setEditingInput}
      //     />
      //   );
      case "percentage":
        return (
          <Percentage
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "date":
        return (
          <DateComponent
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "hour":
        return (
          <Hour
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "dateAndHour":
        return (
          <DateAndHour
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "richTextEditor":
        return (
          <RichTextEditor
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "html":
        return (
          <Html
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "array":
        return (
          <Array
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );  
      case "object":
        return (
          <Object
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "dateRanges":
        return (
          <DateRanges
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
          />
        );
      case "location":
        return (
          <Location
            parameterData={parameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
          />
        );
      case "filesMedia":
        return (
          <FilesMedia
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
          />
        );
      case "List":
        return (
          <List
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
          />
        );
      case "category":
        return (
          <Category
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
          />
        );
      case "colorList":
        return (
          <ColorList
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
          />
        );
      case "tag":
        return (
          <Tag
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "status":
        return (
          <Status
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "checklist":
        return (
          <Checklist
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "json":
        return (
          <Json
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "xml":
        return (
          <Xml
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "currency":
        return (
          <Currency
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "uuid":
        return (
          <Uuid
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "qr":
        return (
          <Qr
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "barCode":
        return (
          <BarCode
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "digitalSignature":
        return (
          <DigitalSignature
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "coordinates":
        return (
          <Coordinates
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "email":
        return (
          <Email
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "phone":
        return (
          <Phone
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "contact":
        return (
          <Contact
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "asset":
        return (
          <Asset
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "url":
        return (
          <Url
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "chronometer":
        return (
          <Chronometer
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "voiceRecorder":
        return (
          <VoiceRecorder
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "language":
        return (
          <LanguageType
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "audio":
        return (
          <Audio
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
          />
        );
      case "assessment":
        return (
          <Assessment
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      case "formula":
        return (
          <Formula
            parameterData={parameterData}
            setParameterData={setParameterData}
            handleChange={handleChange}
            editingInput={editingInput}
            setEditingInput={setEditingInput}
            setTypeLocation={setTypeLocation}
            setLocationState={setLocationState}
            locationParameter={locationParameter}
            setShowAddTags={setShowAddTags}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className={styles.CreateParameterPopup}>
        <div
          className={styles.bg}
          onClick={() => setShowCreateParameter(false)}
        ></div>
        <div className={styles.CreateParameterPopupContent}>
          <HeaderCard
            title={t("newParameterLinkeram")}
            setState={setShowCreateParameter}
          >
            <Button type="white">{t("discard")}</Button>
            <Button action={handleAddParameter}>{t("add")}</Button>
          </HeaderCard>

          <div className={styles.contentContiner}>
            <div className={styles.leftSide}>
              <NavigationPopups
                type={"parameter"}
                text={t("parameter")}
                setParameterType={setParameterType}
                initialParameterType={initialParameterType || currentParameter?.type}
              />
            </div>
            <div className={styles.contentParameter}>
                {renderParameterDescription()}
                             <div>
                 <p className={styles.textContent}>{t("parameterTitle")}</p>
                 {editingTitle ? (
                   <input
                     type="text"
                     name="name"
                     value={parameterData.name}
                     onChange={handleChange}
                     onBlur={handleTitleSave}
                     onKeyPress={handleTitleKeyPress}
                     placeholder={t("parameterTitle")}
                     autoFocus
                   />
                 ) : (
                   <div className={styles.titleDisplay}>
                     <span className={styles.titleText}>
                       {parameterData.name || t("parameterTitle")}
                     </span>
                     <PencilEditIcon 
                       className={styles.editIcon}
                       onClick={handleTitleEdit}
                     />
                   </div>
                 )}
               </div>
              {/* <div className={styles.categoryParameter}>
            <p className={styles.textContent}>{t("parameterTitle")}</p>
                <div className={styles.rightSideCategoryParameter}>
               <div className={styles.row}>
               <CustomDropdown
              editable={true}
              editing={true}
              options={[
                t("length"),
                t("weight"),
                t("volumen"),
                t("time"),
                t("speed"),
              ]}
              customStyles={styles.noPadding}
              selectedOption={parameterData?.physicalQuantities}
              setSelectedOption={(option) =>
                handleChange({ name: "categoryParameter", newValue: option })
              }
              father={'automate'}
            />
            <Button type="white" headerStyle={{borderRadius:"999px"}}>{t('newCategory')}</Button>
               </div>
               <p>{t('parameterCanBeBlocked')}</p>
                </div>
            </div> */}

            {/* <DatabaseRelationship parameterData={parameterData} handleChange={handleChange}/> */}

              <div>{renderParameterInput()}</div>
            </div>
          </div>
        </div>
      </div>
      {showSelectCurrencyPopup && (
        <>
          <div
            className={styles.bgCurrency}
            onClick={() => setShowSelectCurrencyPopup(false)}
          ></div>
          <div className={styles.newCurrencyPopup}>
            {currenciesOptions.map((currency, subIndex) => {
              const subOption = `${currency.name} (${currency.code}) - ${currency.symbol}`;
              return (
                <div
                  key={subIndex}
                  className={styles.dropdownOption}
                  onClick={async () => {
                    const newCurrency = currency;
                    console.log("newCurrency", newCurrency);

                    setParameterData((prev) => ({
                      ...prev,
                      currency: currency,
                    }));
                  }}
                >
                  {subOption}
                  {parameterData.code === currency.code && (
                    <BlackCircleChecked />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* {showSelectCurrencyPopup && ( <SelectCurrencyPopup
          setShowSelectCurrencyPopup={() => setShowSelectCurrencyPopup(false)}
          setSelectedCurrency={setSelectedCurrency}
          selectedCurrency={selectedCurrency}
          father="general"
        />
      )} */}
      {showAddTags && (
        <NewTag
          setShowNewTagModal={setShowAddTags}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          setTags={setTags}
          tags={tags}
        />
      )}
    </div>
  );
};

export default CreateParameterPopup;
