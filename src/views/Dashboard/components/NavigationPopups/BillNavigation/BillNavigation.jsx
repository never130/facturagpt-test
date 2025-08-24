import React, { useEffect, useRef, useState } from "react";
import styles from "./BillNavigation.module.css";
import ItemNavigation from "../ItemNavigation/ItemNavigation";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KIcon from "../../../assets/KIcon.svg";
import { ReactComponent as ArrowDown } from "../../../assets/arrowDownGray.svg";

import { ReactComponent as LittleIconStateStripePending } from "../../../assets/littleIconStateStripePending.svg";
import { ReactComponent as LittleIconStateStripeDue } from "../../../assets/littleIconStateStripeDue.svg";
import { ReactComponent as LittleIconStateStripePaid2 } from "../../../assets/littleIconStateStripePaid2.svg";
import { ReactComponent as LittleIconStateStripeDefaulted2 } from "../../../assets/littleIconStateStripeDefaulted2.svg";
import { ReactComponent as LockIcon } from "../../../assets/WhiteLock.svg";
import { ReactComponent as GreenCheck } from "../../../assets/GreenCheckBold.svg";
import { ReactComponent as LittleIconStateStripeVoided2 } from "../../../assets/littleIconStateStripeVoided2.svg";
import { ReactComponent as LittlePDFIcon } from "../../../assets/littlePDFIcon.svg";
import { ReactComponent as LittleWordIcon } from "../../../assets/littleWordIcon.svg";
import { ReactComponent as LittleImageIcon } from "../../../assets/littleImageIcon.svg";
import { ReactComponent as AddBlack } from "../../../assets/addBlack.svg";
import { ReactComponent as LittleExcelIcon } from "../../../assets/littleExcelIcon.svg";
import { ReactComponent as LittleIcon5OfNewBill } from "../../../assets/littleIcon5OfNewBill.svg";
import { ReactComponent as LittleDocIcon } from "../../../assets/littleDocIcon.svg";
import { ReactComponent as PencilForPopup } from "../../../assets/pencilForPopup.svg";
import { ReactComponent as StarMagicGrey } from "../../../assets/starMagicGrey.svg";
import { ReactComponent as PencilWithStarIcon } from "../../../assets/pencilWithStarIcon.svg";
import { ReactComponent as TalkWithAIIcon } from "../../../assets/talkWithAIIcon.svg";
import Button from "../../Button/Button";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import EditableRow from "../../Preview/EditableRow/EditableRow";
import AddDiscount from "../../AddDiscount/AddDiscount";
import SeeBill from '../../Preview/SeeBill/SeeBill'
import AddTax from "../../AddTax/AddTax";
import SearchIconWithIcon from "../../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../../utils/useFocusShortcut";
import {
  // fetchMetadataPDF,
  // fetchPDF,
  getPdfBase64,
  handleFileUpload,
} from "../../../../../utils/pdfUtils";
import { getUserFiles } from "../../../../../actions/scaleway";
import { useDispatch, useSelector } from "react-redux";
import { languageFlags } from "../../../../../utils/flags";
import { ReactComponent as PrintIcon } from "../../../assets/printIcon.svg";
import { ReactComponent as MoveToFolder } from "../../../assets/moveToFolderIcon.svg";
import { ReactComponent as SendMail } from "../../../assets/sendMail.svg";
import { ReactComponent as AutomateBlack } from "../../../assets/automateBlack.svg";
import { ReactComponent as DuplicateNewIcon } from "../../../assets/duplicateNewIcon.svg";
import { ReactComponent as SettingNewIcon } from "../../../assets/settingNewIcon.svg";
import { ReactComponent as GrayTagIcon } from "../../../assets/tagNewIcon.svg";
import { ReactComponent as DownloadNewIcon } from "../../../assets/downloadNewIcon.svg";
import { ReactComponent as UploadNewIcon } from "../../../assets/uploadNewIcon.svg";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import DeleteButton from "../../DeleteButton/DeleteButton";
import SortableAssetItem from "./SortableAssetItem";
const BillNavigation = ({
  assets,
  setInfoBill,
  infoBill,
  addAssetsLine,
  setShowNewBill,
  setShowDiscountModalNavigation,
  setShowTaxModalNavigation,
  docsId,
  beforeApproveDocument,
  setBeforeApproveDocument,
  handleBtnsActions,
  setShowAddTags,
  // showAddTags,
  setSelectedTags,
  fileInputRef,
  typeContainer,
  setSeeBill,
  seeBill
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const { t } = useTranslation("navbarAdmin");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfName, setPdfName] = useState(null);
  const [pdfType, setPdfType] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [errorLoadingPdf, setErrorLoadingPdf] = useState(false);

  const [stateStripe, setStateStripe] = useState(t("Paid"));
  const [isAnimating, setIsAnimating] = useState(false);
  const [isParametersVisible, setIsParameterVisible] = useState(true);
  const [pendingFile, setPendingFile] = useState(null);

  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [file, setFile] = useState(null);
  const [mailModal, setMailModal] = useState(false);

  const colorMap = {
    [t("Paid")]: "#009F7A",
    [t("pending")]: "#FF9D00",
    [t("defaulted")]: "#FF5500",
    [t("due")]: "#C5221F",
    [t("voided")]: "#8A0300",
  };

  const optionsName = [
    t("Paid"),
    t("pending"),
    t("defaulted"),
    t("due"),
    t("voided"),
  ];

  const [selectedColor, setSelectedColor] = useState(colorMap[optionsName[0]]);
  const iconMap = {
    [t('Paid')]: 0,
    [t('pending')]: 1,
    [t('defaulted')]: 2,
    [t('due')]: 3,
    [t('voided')]: 4,
  };
  
  const icons = [
    <LittleIconStateStripePaid2 />,
    <LittleIconStateStripePending />,
    <LittleIconStateStripeDefaulted2 />,
    <LittleIconStateStripeDue />,
    <LittleIconStateStripeVoided2 />,
  ];
  useEffect(() => {
    const stateKey = infoBill.stateStripe; // ejemplo: "Paid"
    const translatedState = t(stateKey);
    const newColor = colorMap[translatedState];
  
    setSelectedColor(newColor);
  
    const iconIndex = iconMap[t(stateKey)];
    if (iconIndex !== undefined) {
      setIcon(iconIndex);
    }
  
  }, [infoBill.stateStripe, t]);
  
  const [language, setlanguage] = useState();
  const [localIcon, setIcon] = useState(0);

  const billItems = [
    { id: "generalInformation", label: t("generalInformation"),  Icon: null},
    { id: "invoiceHeader", label: t("invoiceHeader"),  Icon: null},
    { id: "invoiceFooter", label: t("invoiceFooter"),  Icon: null},
    { id: "concepts", label: t("concepts"),  Icon: null},
    { id: "advanceOptions", label: t("advanceOptions"),  Icon: null},
    { id: "paymentMethods", label: t("paymentMethods"),  Icon: null},
  ];

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const idToUse = docsId || infoBill?._id;

      if (idToUse) {
        setCurrentId(idToUse);
        const pdf = await getPdfBase64(idToUse);
        setInfoBill((prev) => ({
          ...prev,
          pdfUrl: pdf?.data?.pdfBase64,
        }));
      }
    };

    fetchPdf();
  }, [infoBill?._id, docsId]);

  const handleDropFiles = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer
      ? Array.from(event.dataTransfer.files)
      : Array.from(event.target.files);

    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length > 0) {
      const file = pdfFiles[0];

      const previewUrl = URL.createObjectURL(file);
      setPendingFile(file);

      setInfoBill((prev) => ({
        ...prev,
        pdfUrl: previewUrl,
        pdfFile: file,
      }));

      setPdfUrl(previewUrl);
      setPdfName(file.name);
      setPdfType(file.type);
    }
  };

  useEffect(() => {
    const maybeUpload = async () => {
      if (infoBill?.ETag && pendingFile) {
        try {
          await handleFileUpload(pendingFile, infoBill?.ETag);
          setPendingFile(null);

          const userLocalStorage = localStorage.getItem("user");
          const parsedUser = userLocalStorage
            ? JSON.parse(userLocalStorage)
            : null;
          await dispatch(
            getUserFiles({ userId: user.id, token: parsedUser.accessToken })
          ).unwrap();
          setShowNewBill(false);
        } catch (err) {
          console.error("Error al subir el archivo:", err);
        }
      }
    };

    maybeUpload();
  }, [infoBill?.ETag, pendingFile]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
  };



  useEffect(() => {
    setSelectedColor(colorMap[stateStripe]);
  }, [stateStripe]);

  const handlePercentageChange = async (value, field, isPercentage = false) => {

    setInfoBill((prev) => {
      const subtotal = prev.subtotal;
      const parsedValue = parseFloat(value);

      if (!value || isNaN(parsedValue)) {
        return prev;
      }

      const updatedDoc = { ...prev };
      let computedValue;
      let computedPercentage;

      if (isPercentage) {
        computedValue = Number(
          ((parsedValue / 100) * (subtotal || 0)).toFixed(2)
        );
        computedPercentage = Number(parsedValue.toFixed(2));
      } else {
        computedValue = Number(parsedValue.toFixed(2));

        if (!subtotal || subtotal === 0) {
          console.warn("No se puede calcular el porcentaje: subtotal es 0");
          computedPercentage = 0;
        } else {
          computedPercentage = Number(
            ((parsedValue / subtotal) * 100).toFixed(2)
          );
        }
      }

      updatedDoc[field] = computedValue;

      if (field === "discount") {
        updatedDoc.discountPercentage = computedPercentage;
      } else if (field === "tax") {
        updatedDoc.taxPercentage = computedPercentage;
      }

      const discount =
        field === "discount" ? computedValue : prev.discount || 0;
      const tax = field === "tax" ? computedValue : prev.tax || 0;
      const effectiveSubtotal =
        field === "subtotal" ? computedValue : subtotal || 0;
      const total = field === "total" ? computedValue : prev.total || 0;

      if (field === "total") {
        updatedDoc.subtotal = Number((total + discount - tax).toFixed(2));
      } else if (["discount", "tax", "subtotal"].includes(field)) {
        updatedDoc.total = Number(
          (effectiveSubtotal - discount + tax).toFixed(2)
        );
      }

      return updatedDoc;
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const searchInputRef = useRef(null);
  useFocusShortcut(searchInputRef, "k");

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


  const sensors = useSensors(useSensor(PointerSensor));

  const filteredAssets = assets?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let titleSectionWithAssets = []
  if (filteredAssets?.length > 0) titleSectionWithAssets = [{ name: "Título sección (2)", id: "gtde1564dsf1e5wf65s5d3f", type: "section" }, ...filteredAssets]

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = assets.findIndex((a) => a.id === active.id);
      const newIndex = assets.findIndex((a) => a.id === over.id);
      const reordered = arrayMove(assets, oldIndex, newIndex);
      setInfoBill((prev) => ({
        ...prev,
        assetLines: reordered
      }));

    }
  };


  return (
    <div className={styles.BillNavigation}>
      <div>
        {" "}
        {infoBill?.pdfUrl ? (
          <div className={styles.seeBillContainer}>
            <embed
              src={`${infoBill?.pdfUrl}#toolbar=0`}
              type="application/pdf"
              height="300px"
              width="100%"
            />
            <div
              className={styles.seeBillContent}
              onClick={() => {
                setFile(null);
                setSeeBill(true);
              }}
            >
              {t("viewPreview")}
            </div>
          </div>
        ) : loadingPdf ? (
          <div className={styles.centedText}>{t("loading")}</div>
        ) : (
          true && (
            <div
              className={styles.centedText}
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                cursor: "pointer",
                padding: "20px",
                border: "2px dashed #ccc",
              }}
            >
              {t("invoiceDoesntContainFile")}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(event) => {
                  handleDropFiles(event, currentId)
                }
                }
              />
            </div>
          )
        )}
      </div>
      {beforeApproveDocument ? (
        <div className={styles.approved}>{t('approved')} <GreenCheck /></div>
      ) : (
        <Button action={() => setBeforeApproveDocument(true)} headerStyle={{ width: "100%", height: "40px" }}>
          <LockIcon /> {t("approveDocument")}
        </Button>
      )}

      {typeContainer === "popup" &&
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div>
            <LittlePDFIcon />
            <LittleImageIcon />
            <LittleExcelIcon />
            <LittleWordIcon />
            <LittleIcon5OfNewBill />
            <LittleDocIcon />
          </div>
          <span>{t('documentTitle')}</span>
          <Button
            headerStyle={{ all: "unset", cursor: "pointer" }}
            type="border"
            action={() => console.log("")}
          >
            <PencilForPopup />
          </Button>
        </div>
      }
      {typeContainer === "popup" &&
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ width: "180px" }}>
            <CustomDropdown
              options={["a", "b"]}
              selectedOption={<span style={{
                color: "#717171"
                , display: "flex"
                , alignItems: "center",
                gap: "5px"
              }}>{t('selectCategory2')} <StarMagicGrey /></span>}
              setSelectedOption={""}
              customStyles={{ color: "#717171" }}
              generalStyleFilterSort={{ padding: "0" }}

            />
          </div>
          <div style={{ background: "85px" }}>
            <CustomDropdown
              options={["a", "b"]}
              selectedOption={<span style={{ color: "#717171" }}>{t('conceptOnly')}</span>}
              setSelectedOption={""}
              customStyles={{ color: "#717171" }}
              generalStyleFilterSort={{ padding: "0", minWidth: "85px" }}
            />
          </div>
        </div>

      }
      <div className={styles.btnContactInfoContainer} style={{ justifyContent: typeContainer === "popup" ? "start" : "center" }}>

        <>
          <Button
            type="border"
            action={() => handleBtnsActions("clipboard")}
          >
            <PrintIcon
              className={false && styles.activeBtn}
            />
          </Button>
          <Button
            type="border"
            action={() => handleBtnsActions("clipboard")}
          >
            <MoveToFolder
              className={false && styles.activeBtn}
            />
          </Button>
          <Button
            type="border"
            action={() => handleBtnsActions("clipboard")}
          >
            <DuplicateNewIcon
              className={false && styles.activeBtn}
            />
          </Button>
          <Button
            type="border"
            action={() => setShowAddTags(true)}
          >
            <GrayTagIcon
              className={false && styles.activeBtn}
            />
          </Button>
          <Button
            type="border"
            action={() => handleBtnsActions("clipboard")}
          >
            <SettingNewIcon
              className={false && styles.activeBtn}
            />
          </Button>
          <Button
            type="border"
            action={() => handleBtnsActions("clipboard")}
          >
            <DownloadNewIcon
              className={false && styles.activeBtn}
            />
          </Button>
          <Button
            type="border"
            action={() => handleBtnsActions("clipboard")}
          >
            <UploadNewIcon
              className={false && styles.activeBtn}
            />
          </Button>
          <Button
            type="border"
            action={() => handleBtnsActions("clipboard")}
          >
            <SendMail
              className={false && styles.activeBtn}
            />
          </Button>
          <Button
            type="border"
            action={() => handleBtnsActions("clipboard")}
          >
            <AutomateBlack
              className={false && styles.activeBtn}
            />
          </Button>
          {typeContainer === "popup" &&
            <Button headerStyle={{ all: "unset" }}

              action={() => console.log()}
            >
              <PencilWithStarIcon style={{ width: "25px", height: "25px", fill: "none" }} />
            </Button>
          }
        </>



      </div>

      {typeContainer == "popup" &&
        <div style={{ borderRadius: "8px" }}>
          <CustomDropdown
            options={["a", "b"]}
            selectedOption={<span style={{
              color: "#4F5660", display: "flex",
              alignItems: "center",
              gap: "5px", fontWeight: "bold"
            }}><DeleteButton type={"grey"} />{t('draft')}</span>}
            setSelectedOption={""}
            customStyles={{ color: "#717171" }}
            generalStyleFilterSort={{ background: "#FFFFFF", borderRadius: "8px" }}
          />
        </div>}

      {infoBill.selectedTags && (
        <div className={styles.tagsContainer}>
          {infoBill?.selectedtags?.map((tag) => (
            <div className={styles.tag}>
              <span
                style={{
                  background: tag.color,
                }}
              >
                {tag.name}
              </span>
              <DeleteButton
                action={() =>
                  setSelectedTags((prevSelected) =>
                    prevSelected.filter(
                      (tags) => tags.id !== tag.id
                    )
                  )
                }
                type={'black'}
                CustonIcon={WhiteXCloseIcon}
                customIconStyles={{ height: "30px", minWidth: "30px", background: "#6E6E80" }}
              />
            </div>
          ))}
        </div>
      )}

      {typeContainer == "popup" &&
        <div style={{
          borderRadius: "8px", background: 'linear-gradient(to right,  white, transparent)',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 0px"
        }}>
          <TalkWithAIIcon />

          <div>
            <span
              style={{
                background: 'linear-gradient(to right, var(--_10a37f-background), black)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              {t('talkWithAI')}
            </span>
          </div>
        </div>}


      {typeContainer !== "popup" &&
        <ItemNavigation items={billItems} />}

      {typeContainer !== "popup" &&
        <div className={styles.infoBill}>
          <div className={styles.state}>
            <p>{t("state")}:</p>
            <div className={styles.stateStripeContainer}>
              {icons[localIcon]}

              <CustomDropdown
                editable={true}
                editing={true}
                options={optionsName}
                icons={icons}
                stateStripe={true}
                selectedOption={t(infoBill?.stateStripe)}
                setSelectedOption={(option) => {
                  setInfoBill((prev) => ({
                    ...prev,
                    stateStripe: option,
                  }));
                }}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                setIcon={setIcon}
                iconSelected={localIcon}
              />
            </div>
          </div>

          <div className={styles.state}>
            <p>{t("language")}:</p>
            <div className={styles.stateStripeContainer}>
              <CustomDropdown
                editable={true}
                editing={true}
                options={languageFlags.map((flag) => flag.text)}
                selectedOption={infoBill?.language}
                setSelectedOption={(option) => {
                  setInfoBill((prev) => ({
                    ...prev,
                    language: option,
                  }));
                }}
                customStyles={styles.background}
              />
            </div>
          </div>

          <div className={styles.state}>
            <p>{t("currency")}:</p>
            <div className={styles.stateStripeContainer}>
              <CustomDropdown
                editable={true}
                editing={true}
                options={currenciesOptions.map((currency) => currency.code)}
                selectedOption={infoBill?.currency}
                setSelectedOption={(option) => {
                  setInfoBill((prev) => ({
                    ...prev,
                    currency: option,
                  }));
                }}
                customStyles={styles.background}
              />
            </div>
          </div>
          <EditableRow
            name={t("discount")}
            type="discount"
            value={infoBill?.discount}
            onValueChange={handlePercentageChange}
            isReadOnly={false}
            isPercentage={true}
            percentValue={infoBill?.discountPercentage}
            action={() => setShowDiscountModalNavigation(true)}
          />
          <EditableRow
            name={t("tax")}
            type="tax"
            value={infoBill?.tax}
            onValueChange={handlePercentageChange}
            isReadOnly={false}
            isPercentage={true}
            percentValue={infoBill?.taxPercentage}
            action={() => setShowTaxModalNavigation(true)}
          />
        </div>}

      {typeContainer !== "popup" &&
        <div className={`${styles.infoBill} ${styles.payInfo}`}>

          <p>
            <span>{t("BaseImponible")} 21%</span>
            <span>0,00 €</span>
          </p>

          <p>
            <span>{t("iva")} 21%</span>
            <span>0,00 €</span>
          </p>

          <p>
            <span>{t("retention")} (0%)</span>
            <span>-0,00 €</span>
          </p>

          <p>
            <span>{t("expensesCovered")}</span>
            <span>0,00 €</span>
          </p>
          <p className={styles.total}>
            <span>{t("Total")}</span>
            <span>0,00 €</span>
          </p>
          <p>
            <span>{t("amountAlreadyPaid")}</span>
            <span>0,00 €</span>
          </p>

          <div className={styles.totalToPay}>
            <p>{t("totalToPay")}</p>
            <span>0 €</span>
          </div>
        </div>}

      <Button
        type="white"
        headerStyle={{
          borderRadius: "999px",
          width: typeContainer == "popup" ? "auto" : "fit-content",
          border: typeContainer == "popup" && "none",
        }}
        action={addAssetsLine}
      >
        <AddBlack />   {typeContainer == "popup" ? t("addAssetLine") : t("newAssetsLine")}
      </Button>

      {typeContainer === "popup" &&
        <Button
          type="white"
          headerStyle={{
            borderRadius: "999px",
            width: typeContainer == "popup" ? "auto" : "fit-content",
            background: "rgba(255, 255, 255, 0.59)", border: "none"

          }}
          action={console.log()}
        >
          <AddBlack />  <span style={{ color: "#666666" }}>{t("addSectionTitle")}</span>
        </Button>

      }


      <div
        className={styles.parameters}
        onClick={() => {
          setIsParameterVisible((prev) => !prev);
        }}
      >
        <ArrowDown
          style={{
            transform: isParametersVisible && "rotate(180deg)",
            transition: "all 300ms",
          }}
        />
        {typeContainer == "popup" ? t("lines") : t("assets")} <span> {assets?.length > 1 &&
          `(${assets?.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).length
          })`}</span>
      </div>

      <SearchIconWithIcon
        ref={searchInputRef}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        classNameIconRight={styles.searchContainerL}
        onClickIconRight={() => setIsFilterOpen(true)}
        placeholder={t("searchAutomations")}
        stylesComponent={{ padding: "0" }}
      >
        <>
          <div
            style={{ marginLeft: "5px" }}
            className={styles.searchIconsWrappers}
          >
            <img src={KIcon} alt="kIcon" />
          </div>
        </>
      </SearchIconWithIcon>
      <div
        className={styles.parametersContainer}
        style={{
          height: isParametersVisible ? "auto" : "0px",
          overflow: "hidden",
        }}
      >
        {assets && (

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={assets?.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul>
                {typeContainer === "popup" ? titleSectionWithAssets?.map((asset, index) => (
                  <SortableAssetItem key={asset.id} asset={asset} index={index} typeContainer={typeContainer} />
                )) : filteredAssets?.map((asset, index) => (
                  <SortableAssetItem key={asset.id} asset={asset} index={index} typeContainer={typeContainer} />
                ))
                }
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {showDiscountModal && (
        <AddDiscount
          showDiscountModal={showDiscountModal}
          setShowDiscountModal={setShowDiscountModal}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          setDiscountQuantity={setInfoBill}
          handlePercentageChange={handlePercentageChange}
        />
      )}
      {showTaxModal && (
        <AddTax
          setShowTaxModal={setShowTaxModal}
          showTaxModal={showTaxModal}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          setTaxQuantity={setInfoBill}
          handlePercentageChange={handlePercentageChange}
        />
      )}
      {mailModal && (
        <SendEmailModal
          setMailModal={setMailModal}
          mailModal={mailModal}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          currentId={currentId}
          pdfUrl={infoBill?.pdfUrl}
          setSeeBill={setSeeBill}
          file={infoBill?.file}
          setFile={setFile}
          pdfName={pdfName}
          pdfType={pdfType}
        />
      )}

      {seeBill && (
        <SeeBill pdfUrl={infoBill?.pdfUrl} file={infoBill?.file} setSeeBill={setSeeBill} setMailModal={setMailModal} />
      )}
    </div>
  );
};

export default BillNavigation;
