import React, { useEffect, useRef, useState } from "react";
import styles from "./ActionsPanel.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMetadataPDF, fetchPDF, getPdfBase64 } from "../../../../utils/pdfUtils";
import KIcon from "../../assets/KIcon.svg";
import { ReactComponent as SendMail } from "../../assets/sendMail.svg";
import { ReactComponent as MoveToFolder } from "../../assets/moveToFolderIcon.svg";
import { ReactComponent as PrintIcon } from "../../assets/printIcon.svg";
import { ReactComponent as AddNoteGray } from "../../assets/addNoteBlack.svg";
import { ReactComponent as DownloadIconUpdated } from "../../assets/downloadIconUpdated.svg";
import { ReactComponent as DoubleIcon } from "../../assets/doubleIcon.svg";
import { ReactComponent as ShareDiagonalIcon } from "../../assets/shareDiagonalIcon.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AutomateDataComponent from "../Automate/utils/automatesJson";
import SearchIconWithIcon from "../SearchIconWithIcon/SearchIconWithIcon";
import CardAutomate from "../Automate/Components/CardAutomate/CardAutomate";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import {
  deleteObject,
} from "../../../../actions/scaleway";
import { setUserFiles } from "../../../../slices/scalewaySlices";
import { selectDocument } from "../../../../slices/userSlices";

const ButtonActionsWithText = ({
  children,
  classStyle,
  click,
  disabledValue,
}) => {
  return (
    <button className={classStyle} onClick={click} disabled={disabledValue}>
      {children}
    </button>
  );
};

const ActionsPanel = ({ selectedFile, setShowSelectLocation }) => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [currentId, setCurrentId] = useState(id?.replace(/^"|"$/g, ""));
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [t] = useTranslation("InvoiceForm");
  const [options, setOptions] = useState(0);
  const [showMovetoFolder, setShowMovetoFolder] = useState(false);
  const [mailModal, setMailModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [seeBill, setSeeBill] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [statesStripe, setStatesStripe] = useState([]);
  const [stateStripe, setStateStripe] = useState("Pagado");
  const [showStatesStripes, setShowStatesStripes] = useState(false);
  const [currentIdDoc, setCurrentIdDoc] = useState();
  const [pdfName, setPdfName] = useState(null);
  const [pdfType, setPdfType] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [errorLoadingPdf, setErrorLoadingPdf] = useState(false);
  const fileInputRef = useRef(null);
  let documentoPDF;

  try {
    documentoPDF = require("../../assets/pdfs/document.pdf");
  } catch (error) {
    console.warn("El archivo document.pdf no existe:", error.message);
    documentoPDF = null;
  }

  const fetchPdfAndSetId = async () => {
    setLoadingPdf(false);
    setErrorLoadingPdf(false);
    setPdfUrl(null);
    setPdfName(null);
    setPdfType(null);
    if (currentId) {
      const cleanId = currentId.replace(/^"|"$/g, "");
      const pdf = await getPdfBase64(cleanId);
      const url = await fetchPDF(cleanId);
      const metadataFiles = await fetchMetadataPDF(cleanId);
      const originalFilename = metadataFiles?.filename;
      const parts = originalFilename?.split("-");
      const realFilename = parts?.slice(1).join("-");
      if (!url) {
        setErrorLoadingPdf(true);
      }

      setLoadingPdf(true);
      setTimeout(() => {
        setPdfUrl(pdf?.data?.pdfBase64);
        setPdfName(realFilename);
        setPdfType(metadataFiles?.type);
        setLoadingPdf(false);
      }, 200);
    }
  };
  useEffect(() => {
    fetchPdfAndSetId();
  }, [currentId]);

  const handleShare = () => {

    const fileUrl = `${window.location.origin}/view/${id}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this file",
          text: "Have a look at this file",
          url: fileUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(fileUrl).then(
        () => {
          alert("Link copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy link:", err);
        }
      );
    }
  };

  const { currentPath, userFiles, getFilesLoading, uploadingFilesLoading } =
    useSelector((state) => state.scaleway);

  function removeItemLocally(userFiles, item) {

    const isFolder = item.Key.endsWith("/");
    const sourceKey = item.Key;

    if (!isFolder) {
      return userFiles.filter((f) => f.Key !== sourceKey);
    } else {
      let folderKey = sourceKey;
      if (!folderKey.endsWith("/")) {
        folderKey += "/";
      }
      return userFiles.filter((f) => !f.Key.startsWith(folderKey));
    }
  }


  const handleDelete = (item) => {



    const oldUserFiles = userFiles;
    const newUserFiles = removeItemLocally(oldUserFiles, item);

    dispatch(setUserFiles(newUserFiles));

    dispatch(deleteObject({ key: item.Key, isFolder: item.Key.endsWith("/") }))
      .unwrap()
      .catch((error) => {
        console.error("Delete failed, reverting local change:", error);
        dispatch(setUserFiles(oldUserFiles));
      });


    if (id === item.ETag?.replace(/^"|"$/g, '')) {
      dispatch(selectDocument(null));

      navigate("/admin/panel");
    }


  };
  const actions = [
    {
      text: t("share"),
      icon: ShareDiagonalIcon,
      click: () => {
        handleShare();
      },
    },
    {
      text: t("duplicate"),
      icon: DoubleIcon,
      click: async () => {
        setShowSelectLocation(true);
      },
    },
    {
      text: t("sendMail"),
      icon: SendMail,
      click: () => {
        setMailModal(true);
      },
    },
    {
      text: t("download"),
      icon: DownloadIconUpdated,
      click: () => {
        const link = document.createElement("a");
        link.href = documentoPDF;
        link.download = "archivo.pdf";
        link.click();
      },
    },
    {
      text: t("addNote"),
      icon: AddNoteGray,
      click: () => {
        handleAddNote();
        setEditingNote(false);
      },
    },
    {
      text: t("moveFolder"),
      icon: MoveToFolder,
      type: "default",
      click: () => {
        setShowMovetoFolder(true);
      },
    },
    {
      text: t("print"),
      action: "Descargar",
      icon: PrintIcon,
      type: "small",
      click: () => {
        const printWindow = window.open(documentoPDF, "_blank");
        printWindow.onload = () => {
          printWindow.print();
        };
      },
    },
    {
      text: t("delete"),
      icon: PrintIcon,
      type: "small",
      click: () => {
        const cleanedId = id.trim();

        const matchedFile = userFiles.find(file => {
          const cleanedETag = file.ETag?.replace(/^"|"$/g, '');
          return cleanedETag === cleanedId;
        });

        if (matchedFile) {
          handleDelete(matchedFile);
        } else {
          console.warn('No se encontró el archivo con ETag igual a id:', id);
        }
      }

    },
  ];

  useEffect(() => {
    setCurrentId(id);
  }, [id]);
  const [searchTerm, setSearchTerm] = useState("");
  const data = AutomateDataComponent();
  const [dataFilter, setDataFilter] = useState(data || newData);
  const handleDataFilter = (searchTerm) => {
    const filteredData = data.filter((card) =>
      card.automateName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDataFilter(filteredData);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setDataFilter(data || newData);
    } else {
      handleDataFilter(searchTerm);
    }
  }, [searchTerm]);

  const searchInputRef = useRef(null);
  useFocusShortcut(searchInputRef, "k");

  const [typeContentAutomate, setTypeContentAutomate] = useState("");
  const [selectedAutomationData, setSelectedAutomationData] = useState(null);

  const handleShowContentAutomate = (type, automationData) => {
    setTypeContentAutomate(type);
    setSelectedAutomationData(automationData);
  };

  return (
    <div className={styles.ActionsPanel}>
      <div className={styles.buttonActionsContainer}>
        {actions.map((action) => {
          if (action.componente) {
            return action.componente;
          } else if (action.action === 'Descargar') {
            return (
              <a href={pdfUrl && documentoPDF} download="Factura" key={action.text} className={!pdfUrl && styles.linkDisabled}>
                <action.icon />
                {action.text}
              </a>
            );
          } else {
            return (
              <ButtonActionsWithText
                key={action.text}
                classStyle={`${action.text ? styles.btnWithText : action.classOption} ${styles.btnAutomation}`}
                click={action.click}
                disabledValue={!(action.text === t("addNote") || action.text === t("delete")) && !pdfUrl}

                type={action.type}
              >
                <action.icon style={{
                  width:
                    action.type === "small"
                      ? "25px"
                      : action.type !== "default"
                        ? "15px"
                        : undefined,
                  height:
                    action.type === "small"
                      ? "25px"
                      : action.type !== "default"
                        ? "15px"
                        : undefined,
                }} />
                
                {action.text}
              </ButtonActionsWithText>
            );
          }
        })}


      </div>

      <div className={styles.searchContainer}>
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
      </div>

     
      {dataFilter
        .sort((a, b) => b.available - a.available)
        .filter((card) => card.role === "output")
        .map((card) => (
          <CardAutomate
            fromPanel={true}
            key={card.id}
            type={card.type}
            name={card.automateName}
            image={card.image}
            available={card.available}
            contactType={card.contactType}
            typeContent={handleShowContentAutomate}
            description={card.description}
          />
        ))}


    </div>
  );
};

export default ActionsPanel;
