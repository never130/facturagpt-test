import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "./FileExplorer.module.css";
import folderIcon from "../../assets/folderClosed.svg";
import imageIcon from "../../assets/S3/imageIcon.svg";
import codeIcon from "../../assets/S3/codeIcon.svg";
import fileIcon from "../../assets/S3/fileIcon.svg";
import { ReactComponent as DownloadIcon } from "../../assets/downloadIconGray.svg";
import horizontalDots from "../../assets/S3/horizontalDots.svg";
import filterIcon from "../../assets/S3/filterIconBars.svg";
import filterIconGreen from "../../assets/filtersIconBarGreen.svg";

import { MutatingDots } from "react-loader-spinner";
import { ReactComponent as HouseIcon } from "../../assets/HouseIcon.svg";
import { ReactComponent as ArrowRightText } from "../../assets/arrowRightText.svg";
import pdfIcon2 from "../../assets/pdfIcon2.svg";
import imageIcon2 from "../../assets/imageIcon2.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPath,
  setFromHome,
  setUserFiles,
} from "../../../../slices/scalewaySlices";
import l from "../../assets/lIcon.svg";
import {
  deleteObject,
  duplicateFolderFiles,
  emptyFolder,
  getUserFiles,
  moveObject,
  updateNameFolderS3,
  uploadFiles,
} from "../../../../actions/scaleway";
import SelectLocation from "../SelectLocation/SelectLocation";
import { FileOptionsPopup, FolderOptionsPopup } from "./FileOptionsPopup";

import FilesFilterModal from "../FilesFilterModal/FilesFilterModal";
import SearchIconWithIcon from "../SearchIconWithIcon/SearchIconWithIcon";
import SelectCurrencyPopup from "../SelectCurrencyPopup/SelectCurrencyPopup";
import useFocusShortcut from "../../../../utils/useFocusShortcut";

import { deleteManyPDF, deletePDF, fetchMetadataPDF, handleFileUpdate, handleFileUpload, moveManyFileLocally } from "../../../../utils/pdfUtils";

import { useTranslation } from "react-i18next";
import { selectDocument,setGlobalSearch} from "../../../../slices/userSlices";
import TruncatedText from "./TruncatedText/TruncatedText";
import { getAssetsByTags } from "../../../../actions/assets";
import DeleteChatAgents from "../DeleteChatAgents/DeleteChatAgents";
import ColorPicker from "../ColorPicker/ColorPicker";
import { getDocsBGColor, updateDocBGColorAction } from "../../../../actions/docs";
export default function FileExplorer({
  isOpen,
  swiped,
  leftWidth,
  setSelectedFileS3,
  setFileNameS3,
}) {
  const { t } = useTranslation("PanelTemplate");
  const { user,globalSearch } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPath, userFiles, getFilesLoading, uploadingFilesLoading,fromHome } = useSelector((state) => state.scaleway);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userFilters, setUserFilters] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDeleteChatsAgents, setShowDeleteChatsAgents] = useState(false);
  const [typeDeleteChatsAgents, setSTypeDeleteChatsAgents] = useState(null);
  const [varianteDeleteChatsAgent, setVarianteDeleteChatsAgent] = useState('simple')
  const [selectedOptionToDelete, setSelectedOptionToDelete] = useState(null)
  const optionsButtonRefs = useRef([]);
  const fileExplorerRef = useRef(null);
  const breadCrumbsRef = useRef(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [symbolSelected, setSymbolSelected] = useState("$");
  const [showSelectCurrencyPopup, setShowSelectCurrencyPopup] = useState(false);
  const [filtersCount,setFiltersCount] = useState(0)
  const [iconSkeleton, setIconSkeleton] = useState(false);
  const [onChangeColorLabel, SetonChangeColorLabel] = useState(false);
  const [presetColors, setPresetColors] = useState([]);
  const [showColorPicker,setShowColorPicker] = useState(false)
  const [colorPk, setColor] = useState("");
  const [selectedFileKey, setSelectedFileKey] = useState(null);
  const handleMouseDown = (e) => {
    const element = breadCrumbsRef.current;
    element.isDragging = true;
    element.startX = e.pageX - element.offsetLeft;
    element.scrollLeft = element.scrollLeft;
  };
  const { path } = useParams();
  const [tempPath, setTempPath] = useState("");
  const [truncateActive, setTruncateActive] = useState(false);
  const [selectedLocationNew, setSelectedLocationNew] = useState(
    user?.id + "/"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [existCreateFolder, setExistCreateFolder] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });
  const truncate = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 2) + '..';
  };

  const handleContextMenu = (e, item, index) => {
    e.preventDefault();
    // En lugar de mostrar un menú contextual nuevo, ejecutar handleOptionsClick
    handleOptionsClick(index, e);
  };

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0
    });
  };

  const handleContextMenuContainer = (e) => {
    e.preventDefault();
    // console.log('handleContextMenuContainer ejecutado');
    // console.log('currentPath:', currentPath);
    // console.log('segmentos:', currentPath ? currentPath.split("/").filter(Boolean).length : 0);
    
    // Solo mostrar menú contextual si estamos dentro de una carpeta (currentPath tiene más de 2 segmentos)
    // if (currentPath && currentPath.split("/").filter(Boolean).length >= 2) {
      // Calcular posición ajustada para evitar que se salga de la pantalla
      let x = e.clientX;
      let y = e.clientY;
      // Ajustar posición horizontal si se sale por la derecha
      if (x + 200 > window.innerWidth) {
        x = window.innerWidth - 200;
      }
      
      // Ajustar posición vertical si se sale por abajo
      if (y + 150 > window.innerHeight) {
        y = window.innerHeight - 150;
      }
      
      setContextMenu({
        visible: true,
        x: x,
        y: y
      });
    // } else {
      console.log('No se muestra menú contextual - no estamos en una subcarpeta');
    // }
  };
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    setSearchTerm(globalSearch)
  }, [globalSearch]);

  useEffect(() => {
    handleColorSelect(colorPk);
  }, [colorPk]);

  const handleColorSelect = useCallback((color) => {
      setSelectedColor(color);
    }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.visible) {
        // No cerrar si se hace click en el menú contextual mismo o en los popups existentes
        if (event.target.closest('.context-menu') || 
            event.target.closest(`.${styles.optionsPopup}`) ||
            activePopup !== null) {
          return;
        }
        closeContextMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && contextMenu.visible) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.visible, activePopup]);

  // Cerrar menú contextual cuando se abre otro popup
  useEffect(() => {
    if (activePopup !== null && contextMenu.visible) {
      closeContextMenu();
    }
  }, [activePopup, contextMenu.visible]);

  useEffect(() => {
    if (currentPath) {
      const encodedPath = encodeURIComponent(currentPath);
      const trimmed = encodedPath.split("%2F").slice(1).join("%2F");
      if(fromHome){
        dispatch(setFromHome(false))
      }
      else if (trimmed && path !== trimmed) {
        navigate(`/admin/panel/path/${trimmed}`, { replace: true });
      }
    }
  }, [currentPath]);
  useEffect(() => {
    if (path) {

      setTempPath(`${user.selectedWorkspace}/${decodeURIComponent(path)}`);
      dispatch(setCurrentPath(`${user.selectedWorkspace}/${decodeURIComponent(path)}`));
    }else{
      setTempPath(`${user.selectedWorkspace}/`);
      dispatch(setCurrentPath(`${user.selectedWorkspace}/`));

    }
  }, [dispatch, path]);

  useEffect(() => {
    dispatch(setCurrentPath(tempPath));
  }, [tempPath]);

  const handleMouseMove = (e) => {
    const element = breadCrumbsRef.current;
    if (!element.isDragging) return;
    const x = e.pageX - element.offsetLeft;
    const walk = (x - element.startX) * 0.05;
    element.scrollLeft = element.scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    const element = breadCrumbsRef.current;
    element.isDragging = false;
  };

  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const userLocalStorage = localStorage.getItem("user");
    const parsedUser = userLocalStorage
      ? JSON.parse(userLocalStorage)
      : null;

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    setDropTarget(item);
  };

  function moveSingleFileLocally(userFiles, sourceKey, destinationKey) {
    const fileName = sourceKey.split("/").pop();
    const newKey = `${destinationKey}${fileName}`;

    const updated = userFiles.map((item) => {
      if (item.Key === sourceKey) {
        return { ...item, Key: newKey };
      }
      return item;
    });
    return updated;
  }

  function moveFolderLocally(userFiles, sourceKey, destinationKey) {
    if (!sourceKey.endsWith("/")) {
      sourceKey += "/";
    }
    if (!destinationKey.endsWith("/")) {
      destinationKey += "/";
    }

    const folderSegments = sourceKey.split("/").filter(Boolean);
    const folderName = folderSegments[folderSegments.length - 1];
    const targetFolderKey = `${destinationKey}${folderName}/`;

    moveManyFileLocally({initialPath: sourceKey,destinationPath: destinationKey})

    const updated = userFiles.map((item) => {
      if (item.Key.startsWith(sourceKey)) {
        if (item.Key === sourceKey) {
          return { ...item, Key: targetFolderKey };
        }

        const relativePath = item.Key.slice(sourceKey.length);
        const newKey = `${targetFolderKey}${relativePath}`;
        return { ...item, Key: newKey };
      }
      return item;
    });

    const final = updated.filter((item) => item.Key !== sourceKey);

    return final;
  }

  const dispatchLocalMove = (sourceKey, destinationKey, isFolder) => {
    let updatedFiles;

    if (!isFolder) {
      updatedFiles = moveSingleFileLocally(
        userFiles,
        sourceKey,
        destinationKey
      );
    } else {
      updatedFiles = moveFolderLocally(userFiles, sourceKey, destinationKey);
    }

    dispatch(setUserFiles(updatedFiles));
  };

  const handleDrop = async (e, targetItem) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    if (!targetItem.Key.endsWith("/")) {
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    const destinationKey = targetItem.Key;
    const sourceKey = draggedItem.Key;
    const isFolder = sourceKey.endsWith("/");


    dispatchLocalMove(sourceKey, destinationKey, isFolder);

   await  dispatch(
      moveObject({
        sourceKey,
        destinationKey,
        isFolder,
      })
    );

    if(!isFolder) handleFileUpdate({destinationKey, eTag:draggedItem.ETag.replace(/^"|"$/g, '')})

    await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
                              dispatch(setFromHome(true))
                              await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
                              dispatch(setFromHome(false))

    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  const [popupPosition, setPopupPosition] = useState(null);

  const handleOptionsClick = (index, event) => {

    event.stopPropagation();

    const ref = optionsButtonRefs.current[index];
    if (!ref) return;

    const rect = ref.getBoundingClientRect();
    const popupHeight = 120;
    const padding = 0;

    let top;

    if (rect.bottom + popupHeight > window.innerHeight) {
      top = rect.top - popupHeight + 15;
    } else {
      top = rect.top + rect.height;
    }

    setPopupPosition({
      top,
      left: rect.left,
    });

    setActivePopup(prev => (prev !== index ? index : null));
  };

  useEffect(() => {
    if (user && !currentPath) {
      dispatch(setCurrentPath(user.selectedWorkspace + "/"));
    }
  }, [user]);

  const getFileIcon = (key) => {
    if (key.endsWith("/")) {
      return folderIcon;
    }

    const extension = key.split(".").pop().toLowerCase();

    if (["svg", "gif"].includes(extension)) {
      return imageIcon2;
    }

    if (["jpg", "jpeg", "JPG", "JPEG"].includes(extension)) {
      return imageIcon2;
    }

    if (["js", "css", "java"].includes(extension)) {
      return codeIcon;
    }

    if (["pdf", "PDF"].includes(extension)) {
      return pdfIcon2;
    }

    if (["xml", "XML"].includes(extension)) {
      return codeIcon;
    }

    if (["html", "HTML"].includes(extension)) {
      return codeIcon;
    }

    if (["json", "JSON"].includes(extension)) {
      return codeIcon;
    }

    if (["png", "PNG"].includes(extension)) {
      return imageIcon2;
    }

    return fileIcon;
  };

  const getBackground = (key) => {
    if (key.endsWith("/")) {
      return "#ADD8E6"; // Azul claro para carpetas
    }

    const extension = key.split(".").pop().toLowerCase();

    if (["svg", "gif"].includes(extension)) {
      return "#7FFFD4"; // Aguamarina para SVG/GIF
    }

    if (["jpg", "jpeg"].includes(extension)) {
      return "#90EE90"; // Verde claro para JPG/JPEG
    }

    if (["js", "css", "java"].includes(extension)) {
      return "#B0C4DE"; // Azul pizarra para JS/CSS/Java
    }

    if (["pdf"].includes(extension)) {
      return "#FFB6C1"; // Rosa claro para PDF
    }

    if (["xml"].includes(extension)) {
      return "#DAA520"; // Oro para XML
    }

    if (["html"].includes(extension)) {
      return "#FFA07A"; // Salmón claro para HTML
    }

    if (["json"].includes(extension)) {
      return "#D8BFD8"; // Cardo para JSON
    }

    if (["png"].includes(extension)) {
      return "#ADFF2F"; // Verde amarillo para PNG
    }

    return "#D3D3D3"; // Gris claro por defecto para otros archivos
  };

  const renderBreadcrumbs = () => {
    if (!currentPath) return null;

    const pathSegments = currentPath.split("/").filter(Boolean);

    if (pathSegments.length && pathSegments[0] === user.selectedWorkspace) {
      pathSegments.shift();
    }

    const breadcrumbs = [
      <span key="inicio" className={styles.breadcrumb}>
        {pathSegments.length > 0 && (
          <span className={styles.breadcrumbSeparator}>
            <ArrowRightText />{" "}
          </span>
        )}
      </span>,
    ];

    pathSegments.forEach((segment, index) => {
      const partialSegments = pathSegments.slice(0, index + 1);
      const partialPath = `${user.selectedWorkspace}/${partialSegments.join("/")}/`;

      breadcrumbs.push(
        <span key={partialPath} className={styles.breadcrumb}>
          <div
            onClick={() => handleBreadcrumbClick(partialPath)}
            className={`${index == pathSegments.length - 1 && styles.finalBreadcrumbButton} ${styles.breadcrumbButton}`}
          >
            {segment}
          </div>
          {index < pathSegments.length - 1 && (
            <span className={styles.breadcrumbSeparator}>
              {" "}
              <ArrowRightText />{" "}
            </span>
          )}
        </span>
      );
    });

    return (
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        ref={breadCrumbsRef}
        className={styles.breadcrumbs}
      >
        {breadcrumbs}
      </div>
    );
  };

  const handleBreadcrumbClick = (path) => {
    dispatch(setCurrentPath(path));
  };
  const [filteredAssetIds, setFilteredAssetIds] = useState([]);

  useEffect(() => {
    const getAssetsByTagsFn = async () => {
      const res = await dispatch(getAssetsByTags({ tags: selectedTags }));
      const matchingIds = res?.payload?.data || [];
      setFilteredAssetIds(matchingIds);
    };

    getAssetsByTagsFn();
  }, [selectedTags]);


  
  useEffect(() => {
    const getFilesS3 = async () => {
      const userLocalStorage = localStorage.getItem("user");
      const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;
     await dispatch(
        getUserFiles({ userId: user?.id, token: parsedUser?.accessToken,filters: userFilters,currentPath })
      );
    }

    getFilesS3()
  }, [userFilters,currentPath])
  

  const filteredFiles = useMemo(() => {
    if (!userFiles) return [];

    let processedFiles = userFiles; 
    


    const {
      keyWord = "",
      selectedCategory,
      allFiles = false,
      selectedTypes = [],
      selectedTags = [],
      selectedOption = {}
    } = userFilters || {};


    const lowerKeyWord = keyWord.toLowerCase().trim();
    const lowerSearchTerm = searchTerm.trim().toLowerCase();

    let filesWithNames = processedFiles.map(item => {
      const isFolder = item.Key.endsWith("/");
      const fileName = isFolder
        ? item.Key.split("/").slice(-2, -1)[0]
        : item.Key.split("/").pop().split("_").slice(1).join("_");
      return { ...item, fileName: fileName }
    })
    let baseFiltered = filesWithNames.filter((item) => {
      const isFolder = item.Key.endsWith("/");
      const fileName = isFolder
        ? item.Key.split("/").slice(-2, -1)[0]
        : item.Key.split("/").pop();

      if (!lowerSearchTerm) {
        return true;
      } else {
        return fileName.toLowerCase().includes(lowerSearchTerm);
      }
    });

    let finalFiltered = baseFiltered.filter((item) => {
      const isFolder = item.Key.endsWith("/");
      const fileName = isFolder
        ? item.Key.split("/").slice(-2, -1)[0]
        : item.Key.split("/").pop();


      if (lowerKeyWord) {
        if (!fileName.toLowerCase().includes(lowerKeyWord)) {
          return false;
        }
      }

      if (Array.isArray(filteredAssetIds)) {
        if (filteredAssetIds.length === 0) {
          if (userFilters && (userFilters?.selectedTags?.length > 0)) {
            return false; 
          } else {
            return true; 
          }
        }
        const fileKeyName = item.Key.split("/").pop(); // ej: FILE-uuid_nombre.pdf
        const matchesAssetId = filteredAssetIds.some(id => fileKeyName.includes(id));
        if (!matchesAssetId) return false;
      }

      if (allFiles) {
        return true;
      }

      if (selectedCategory === "Imagenes") {
        const extension = fileName.split(".").pop()?.toLowerCase() || "";
        const imageExtensions = ["png", "jpg", "jpeg", "svg", "gif"];
        if (!imageExtensions.includes(extension)) {
          return false;
        }
      } else if (selectedCategory === "Documentos") {
        const extension = fileName.split(".").pop()?.toLowerCase() || "";
        const docExtensions = ["pdf", "doc", "docx", "xlsx"];
        if (!docExtensions.includes(extension)) {
          return false;
        }
      }

      if (selectedTypes.length > 0) {
        const extension = fileName.split(".").pop()?.toLowerCase();
        const extensionMap = {
          PDF: ["pdf"],
          DOC: ["doc", "docx"],
          XLS: ["xlsx"],
          JPEG: ["jpeg", "jpg"],
          PNG: ["png"],
          SVG: ["svg"],
          GIF: ["gif"],
        };
        let matchesType = false;
        for (const t of selectedTypes) {
          const exts = extensionMap[t] || [];
          if (exts.includes(extension)) {
            matchesType = true;
            break;
          }
        }
        if (!matchesType) {
          return false;
        }
      }

      return true;
    });

    finalFiltered.sort((a, b) => {
      const isFolderA = a.Key.endsWith("/");
      const isFolderB = b.Key.endsWith("/");
      if (isFolderA && !isFolderB) return -1;
      if (!isFolderA && isFolderB) return 1;
      return 0;
    });

    if (selectedOption["Orden Alfabético"]) {
      finalFiltered.sort((a, b) => {
        const isFolderA = a.fileName;
        const isFolderB = b.fileName;
        return selectedOption["Orden Alfabético"] === "A-Z"
        ?isFolderB.localeCompare(isFolderA)
        :isFolderA.localeCompare(isFolderB)
      });
    }
    let definitiveFiltered
    if (selectedOption.date) {
      if (selectedOption.date) {
        const now = new Date();
        let limitDate = new Date();

        switch (selectedOption.date) {
          case "1month":
            limitDate.setMonth(now.getMonth() - 1);
            break;
          case "3month":
            limitDate.setMonth(now.getMonth() - 3);
            break;
          case "6month":
            limitDate.setMonth(now.getMonth() - 6);
            break;
          case "1year":
            limitDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            limitDate = null;
        }

        if (limitDate) {
          definitiveFiltered = finalFiltered.filter(item => {
            return item.LastModified > limitDate.toISOString()
          })
        }
      }
    }

    if (selectedOption.date && definitiveFiltered) {
      return definitiveFiltered;
    } else {
      return finalFiltered;
    }

  }, [userFiles, currentPath, searchTerm, userFilters, filteredAssetIds]);



  const handleDropFiles = async (event) => {
    event.preventDefault();
    if (!draggedItem) {
      const files = Array.from(event.dataTransfer.files);
      const uploadResponse = await dispatch(
        uploadFiles({ files, currentPath })
      );
      const ETag = uploadResponse.payload[0].ETag;

      const pdfFiles = files.filter((file) => file.type === "application/pdf");

      if (pdfFiles.length > 0) {
        try {
          for (const file of pdfFiles) {
            await handleFileUpload(file, ETag,"","","","",currentPath);
          }
          const userLocalStorage = localStorage.getItem("user");
          const parsedUser = userLocalStorage
            ? JSON.parse(userLocalStorage)
            : null;
      
          dispatch(setFromHome(true))
          await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
          dispatch(setFromHome(false))

        } catch (error) {
          console.error("Error al subir archivo(s):", error);
        }
      } else {
        console.warn("No se ha soltado un archivo PDF");
      }
    }
  };

  const [dragingOverContainer, setDragingOverContainer] = useState(false);
  const handleContainerDragOver = (event) => {
    event.preventDefault();
    setDragingOverContainer(true);
  };
  const handleDownload = (item) => {
    const location = `https://s3.fr-par.scw.cloud/factura-gpt/${item.Key}`;
    const link = document.createElement("a");
    link.href = location;
    link.target = "_blank";
    link.download = item.Key.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const { id } = useParams();
  const handleDelete = (item) => {
    const oldUserFiles = userFiles;
    const newUserFiles = removeItemLocally(oldUserFiles, item);
console.log('eliminando', item)

    dispatch(setFromHome(true))
    dispatch(setUserFiles(newUserFiles));
    dispatch(setFromHome(false))
    dispatch(setUserFiles(newUserFiles));

    dispatch(deleteObject({ key: item.Key, isFolder: item.Key.endsWith("/") }))
      .unwrap()
      .catch((error) => {
        console.error("Delete failed, reverting local change:", error);
        dispatch(setUserFiles(oldUserFiles));
      });


      const fn = async () => {
        const metadata = await fetchMetadataPDF(item?.ETag?.replace(/^"|"$/g, ''));

        if(item.Key.endsWith("/"))  deleteManyPDF(item.Key)
          else deletePDF(metadata?._id)
      }
      fn()



    if (id === item.ETag) {
      dispatch(selectDocument(null));
      setSelectedFileS3(null)
      navigate("/admin/panel");

    }

  };
  const handleDuplicateFolder = async (e, item) => {
    const coincidencias = userFiles.filter(
      (file) => file.Key.includes(item.Key) && file.Key !== item.Key
    );

    const cleanItemKey = (key) => {
      const index = key.indexOf("/");
      if (index === -1) return key;

      let cleaned = key.substring(index + 1);

      if (cleaned.endsWith("/")) {
        cleaned = cleaned.slice(0, -1);
      }

      return cleaned;
    };

    const cleanFileName = (key) => {
      const filename = key.split("/").pop();

      const index = filename.indexOf("_", filename.indexOf("-") + 1);

      if (index === -1) return filename;

      const cleanName = filename.substring(index + 1);
      return cleanName;
    };
    const cleaned = cleanItemKey(item.Key);
    const archivosLimpios = coincidencias.map((file) =>
      cleanFileName(file.Key)
    );

    const res = await dispatch(
      duplicateFolderFiles({
        userId: user?.id,
        sourceFolder: cleaned,
        destinationFolder: cleaned,
        newText:t('new')
      })
    );

    const userLocalStorage = localStorage.getItem("user");
    const parsedUser = userLocalStorage
      ? JSON.parse(userLocalStorage)
      : null;

    await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
    dispatch(setFromHome(true))
    await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
    dispatch(setFromHome(false))
  };
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
  console.log('userFiles',userFiles)

  const handleShare = (item) => {
    const fileUrl = `https://facturagpt.com/admin/panel/${encodeURIComponent(item.ETag)}`;

    if (navigator.share) {
      navigator
        .share({
          title: t("checkoutThisFile"),
          text: t("haveLookThisFile"),
          url: fileUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(fileUrl).then(
        () => {
          alert(t("linkCopied"));
        },
        (err) => {
          console.error("Failed to copy link:", err);
        }
      );
    }
  };
  const handleApplyFilters = (filters) => {
    setUserFilters(filters);
  };


  const searchInputRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  useFocusShortcut(searchInputRef, "/");



  const hasActiveFilters =
    userFilters &&
    (userFilters.keyWord !== "" ||
      userFilters.maxValue !== "" ||
      userFilters.minValue !== "" ||
      userFilters.selectedCategory !== "" ||
      userFilters.selectedCurrency !== "" ||
      (userFilters.selectedTags && userFilters.selectedTags.length > 0) ||
      (userFilters.selectedTypes && userFilters.selectedTypes.length > 0));

const getDocumentsBackground = () => {

}

  const [renameFolder, setRenameFolder] = useState("");
  const [tempFileNames, setTempFileNames] = useState({});
const [customColors, setCustomColors] = useState({}); // key: color
  const inputRefs = useRef({});

  useEffect(() => {
    if (renameFolder && inputRefs.current[renameFolder]) {
      inputRefs.current[renameFolder].focus();
    }
  }, [renameFolder]);

  const [bgDocuments,setBgDocuments] = useState([])

  const getBGDocs = async () => {
    const res = await dispatch(getDocsBGColor())
    setBgDocuments(res?.payload?.docs)
  }

useEffect(() => {
  getBGDocs()
}, [currentPath,userFilters,])

  const iconToUserFiles = (key,ETag,isFolder) => {
    let matchedDoc = null;

  if (isFolder) {
    // Para carpetas: busca por `path`
    matchedDoc = bgDocuments.find(doc => doc.path === key);
  } else {
    // Para archivos: busca por `ETag`
    matchedDoc = bgDocuments.find(doc => doc.ETag === ETag);
  }

  const customBgColor = matchedDoc?.bgColor;

  const color = customBgColor || getBackground(key); // Usa el color personalizado o el por defecto

  return (
    <>
      <div
        style={iconSkeleton ? { opacity: "0" } : { opacity: "1" }}
        className={styles.loadingImage}
      />
      <div 
        style={{ background: color }} 
        className={styles.backGroundImg}
      >
        <img
          src={getFileIcon(key)}
          className={`${styles.iconImages} ${key.split('/').pop() === "" ? styles.iconClosed : ""}`}
          onLoad={() => setIconSkeleton(true)}
          alt="file-icon"
        />
      </div>
    </>
  );
};

  return (
    <>
      <div
        style={{
          maxWidth: `${leftWidth}px`,
          display: isOpen ? "block" : "none",
        }}
        className={`
          ${styles.container} 
          ${styles.asideBar} 
          ${isMobile ? styles.mobileMenu : ""} 
          ${swiped ? "" : styles.offAsideBar}
          `}
        ref={fileExplorerRef}
        onDrop={handleDropFiles}
        onDragOver={handleContainerDragOver}
        onDragLeave={() => setDragingOverContainer(false)}
      >
        <div className={styles.filesContainer}>
          <div className={styles.fileListt} onContextMenu={handleContextMenuContainer}>
            {getFilesLoading ? (
              <div className={styles.loaderContainer}>
                <MutatingDots
                  visible={true}
                  height="100"
                  width="100"
                  color="#000"
                  secondaryColor="#3f3f3f"
                  radius="10"
                  ariaLabel="mutating-dots-loading"
                />
              </div>
            ) : (
              ((userFiles?.length === 0 || !userFiles) &&
                (hasActiveFilters || searchTerm !== "") && (
                  <div className={styles.noFilesContainerMessage}>
                    <h4>{t("noResultsFound")}</h4>
                    <h4>{t("toAddDocumentDragHere")}</h4>
                    <div className={styles.searchContainer} style={{ 
                        position: 'absolute', 
                        bottom: '10px', 
                        right: '10px', 
                        justifyContent: "end" 
                      }}>
                    <div onClick={() => setIsFilterOpen(true)}>
                      {userFilters &&
                      Object.keys(userFilters).length > 0 &&
                      hasActiveFilters ? (
                        <img
                          src={filterIconGreen}
                          alt="filterIcon"
                          className={styles.searchContainerIcon}
                          style={{ width: "auto", height: "auto" }}
                        />
                      ) : (
                        <img
                          src={filterIcon}
                          alt="filterIcon"
                          className={styles.searchContainerIcon}
                          style={{ width: "auto", height: "auto" }}
                        />
                      )}
                    </div>
                  </div>
                  </div>
                )) ||
              (userFiles?.length === 0 && (
                <div onClick={() => setShowLocationModal(true)}
                  style={{ background: dragingOverContainer && "var(--f0-border)" }}
                  className={styles.noFilesContainer}
                >
                  <h3>{t("dragYourFilesHereToUpload")}</h3>
                  <DownloadIcon />
                </div>

              )) ||
              filteredFiles
                .map((item, index) => {
                  const isFolder = item?.Key?.endsWith("/");
                  let fileName = isFolder
                    ? item.Key.split("/").slice(-2, -1)[0]
                    : item.Key.split("/").pop();
                  const filePrefix = /^FILE-([^_]+)/;
                  const match = fileName.match(filePrefix);
                  const uuid = match ? match[1] : null;
                  if (id === uuid) {
                    setSelectedFileS3(item);
                  }

                  fileName = fileName.replace(/^FILE-[^_]+_/, "");
                  const tempFileName = tempFileNames[item.Key] || fileName;
                  return (
                    <div

                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragOver={(e) => handleDragOver(e, item)}
                      onDrop={(e) => {
                        handleDrop(e, item);
                      }}
                      onDragEnd={handleDragEnd}
                      onContextMenu={(e) => handleContextMenu(e, item, index)}
                      className={styles.fileItem}
                    >
                      <div onMouseEnter={() => setTruncateActive(index)}
                        onMouseLeave={() => setTruncateActive(false)}
                        className={styles.itemInner}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFolder) {
                            dispatch(setCurrentPath(item.Key));
                            dispatch(setGlobalSearch(""))
                          }

                          if (isFolder) {
                          } else if (uuid) {
                            if (typeof setSelectedFileS3 === "function") {
                              setSelectedFileS3(item);
                            }
                            setFileNameS3(item.Key.split("/").pop());
                            dispatch(selectDocument({ item }));
                            dispatch(setGlobalSearch(""))
                            navigate("/admin/panel/" + uuid);
                          } else {
                            navigate(
                              "/admin/panel/" + item.ETag.replace(/"/g, "")
                            );
                            setSelectedFileS3(item);
                            dispatch(selectDocument({ item }));
                            dispatch(setGlobalSearch(""))
                            setFileNameS3(item.Key.split("/").pop());
                          }
                        }}
                      >
                        {iconToUserFiles(item.Key,item?.ETag?.replace(/"/g, ""), item?.isFolder)}
                        {renameFolder == item.Key ? (
                          <input
                            ref={(el) => {
                              if (el) inputRefs.current[item.Key] = el;
                            }}
                            value={tempFileNames[item.Key]}
                            onChange={(e) => {
                              setTempFileNames((prev) => ({
                                ...prev,
                                [item.Key]: e.target.value,
                              }));
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                const keyParts = item.Key.split("/");

                                const userId = keyParts[0];
                                const oldFolder = keyParts[1];
                                const newFolder = tempFileNames[item.Key];

                                setRenameFolder(null);
                                await dispatch(
                                  updateNameFolderS3({
                                    userId,
                                    oldFolder,
                                    newFolder,
                                  })
                                );
                                
                      await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
    dispatch(setFromHome(true))
    await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
    dispatch(setFromHome(false))


                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onBlur={async () => {
                              const keyParts = item.Key.split("/");
                              const userId = keyParts[0];
                              const oldFolder = keyParts[1];
                              const newFolder = tempFileNames[item.Key];

                              setRenameFolder(null);

                             await  dispatch(
                                updateNameFolderS3({
                                  userId,
                                  oldFolder,
                                  newFolder,
                                })
                              );

                              await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
    dispatch(setFromHome(true))
    await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
    dispatch(setFromHome(false))
                            }}
                          />
                        ) : (
                          <span  className={styles.itemText}>
                            {truncateActive === index ? <TruncatedText style={{ width: "100%" }} text={tempFileNames[item.Key] || fileName} /> : (tempFileNames[item.Key] || fileName)}
                          </span>
                        )}
                        <button
                          ref={(el) => (optionsButtonRefs.current[index] = el)}
                          className={styles.moreButton}
                          aria-label="More options"
                          onClick={(e) => {handleOptionsClick(index, e)
                            dispatch(setGlobalSearch(""))
                          }}
                        >
                          <div className={styles.dotsWrapperHoverHorizontal}>
                            <div
                              className={styles.shadowContainerHorizontal}
                            ></div>
                            <img className={styles.rotate}  src={horizontalDots} alt="horizontalDots" />{" "}
                          </div>
                        </button>
                      </div>
                      {activePopup === index &&
                        (isFolder ? (
                          <FolderOptionsPopup
                            parentRef={optionsButtonRefs.current[index]}
                            onClose={() => setActivePopup(null)}
                              onChangeColor={() => {
                                    SetonChangeColorLabel(true);
                                    console.log('seleccionando esto: ',item)
                                    // Aquí guardas la key del archivo seleccionado
                                    setSelectedFileKey(item); // Añade este estado
                                  }}
                            onRename={() => {
                              setRenameFolder(item.Key);
                              setTempFileNames((prev) => ({
                                ...prev,
                                [item.Key]: tempFileNames[item.Key] || fileName,
                              }));
                            }}
                            onDuplicate={(e) => handleDuplicateFolder(e, item)}
                            onDelete={() => {
                              setShowDeleteChatsAgents(true)
                              setSTypeDeleteChatsAgents("folder");
                              setVarianteDeleteChatsAgent('simple')
                              setSelectedOptionToDelete(item)
                            }}
                            style={{
                              position: "fixed",
                              top: `${popupPosition.top}px`,
                              left: `${popupPosition.left}px`,

                            }}
                          />
                        ) : (
                          <FileOptionsPopup
                            parentRef={optionsButtonRefs.current[index]}
                            onDownload={() => handleDownload(item)}
                            onShare={() => handleShare(item)}
                            onDelete={() => {
                              setShowDeleteChatsAgents(true)
                              setSTypeDeleteChatsAgents("fileS3");
                              setVarianteDeleteChatsAgent('simple')
                              setSelectedOptionToDelete(item)
                            }}
                            onEdit={() => {
                              if (typeof setSelectedFileS3 === "function") {
                                setSelectedFileS3(item);
                              }
                              setFileNameS3(item.Key.split("/").pop());
                              dispatch(selectDocument({ item }));
                              navigate("/admin/panel/" + (uuid || item.ETag.replace(/"/g, "")));
                            }}
                            onClose={() => setActivePopup(null)}
                            onChangeColor={() => {
                                    SetonChangeColorLabel(true);
                                    // Aquí guardas la key del archivo seleccionado
                                    setSelectedFileKey(item); // Añade este estado
                                  }}
                            style={{
                              position: "fixed",
                              top: `${popupPosition.top}px`,
                              left: `${popupPosition.left}px`,

                            }}
                          />
                        ))}
                        {onChangeColorLabel && selectedFileKey && (
                            <ColorPicker
                            selectedFileKey={selectedFileKey.Key}
                              setShowColorPicker={() => SetonChangeColorLabel(null)}
                              color={customColors[selectedFileKey?.Key] || getBackground(selectedFileKey?.Key)}
                              setColor={ async (newColor) => {
                              await dispatch(updateDocBGColorAction({bgColor:newColor,etag:selectedFileKey?.ETag?.replace(/^"|"$/g, '') || selectedFileKey?.Key}))
                              getBGDocs()
                // await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken,userFilters,currentPath })).unwrap();
                              
                                // setCustomColors((prev) => ({
                                //   ...prev,
                                //   [selectedFileKey]: newColor,
                                // }));
                                // Opcional: cerrar el picker después de seleccionar
                                SetonChangeColorLabel(null);
                              }}
                              presetColors={presetColors}
                              setPresetColors={setPresetColors}
                            />
                          )}
                    </div>
                  );

                })
            )}

            {uploadingFilesLoading && (
              <div className={styles.bottomLoaderContainer}>
                <MutatingDots
                  visible={true}
                  height="100"
                  width="100"
                  color="#000"
                  secondaryColor="#3f3f3f"
                  radius="10"
                  ariaLabel="mutating-dots-loading"
                />
              </div>
            )}
          <div className={styles.searchContainer} style={{ 
                        position: 'absolute', 
                        bottom: '10px', 
                        right: '10px', 
                        justifyContent: "end" 
                      }}>
                    <div onClick={() => setIsFilterOpen(true)}>
                      {userFilters &&
                      Object.keys(userFilters).length > 0 &&
                      hasActiveFilters ? (
                        <img
                          src={filterIconGreen}
                          alt="filterIcon"
                          className={styles.searchContainerIcon}
                          style={{ width: "auto", height: "auto" }}
                        />
                      ) : (
                        <img
                          src={filterIcon}
                          alt="filterIcon"
                          className={styles.searchContainerIcon}
                          style={{ width: "auto", height: "auto" }}
                        />
                      )}
                    </div>
                  </div>
          </div>
          {currentPath?.split("/").filter(Boolean).length >= 2 && (
            <div className={styles.bottomMenuContainer}  style={{
              width: `${leftWidth}px`,
              display: isOpen ? "block" : "none",
            }}>
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUpOrLeave}
              onMouseUp={handleMouseUpOrLeave}
              ref={breadCrumbsRef}
              className={styles.bottomMenu}
            >
              <div
                className={styles.houseContainer}
                onClick={() => {
                  navigate("/admin/panel/");
                  dispatch(setCurrentPath(user.selectedWorkspace + "/"));
                  dispatch(setGlobalSearch("")) 
                }}
              >
                <HouseIcon
                  onClick={() => {
                    navigate("/admin/panel/");
                    dispatch(setCurrentPath(user.selectedWorkspace + "/"));
                    dispatch(setGlobalSearch(""))
                  }}
                  className={`${styles.icon} ${styles.house}`}
                />
              </div>

              {renderBreadcrumbs()}
            </div>
            </div>
          )}
        </div>
        <FilesFilterModal
          onClose={() => setIsFilterOpen(false)}
          handleApplyFilters={handleApplyFilters}
          isFilterOpen={isFilterOpen}
          setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
          setSelectedCurrency={setSelectedCurrency}
          selectedCurrency={selectedCurrency}
          symbolSelected={symbolSelected}
          selectedTags={selectedTags} setSelectedTags={setSelectedTags}
          setFiltersCount={setFiltersCount}
        />{" "}
        {showSelectCurrencyPopup && (
          <SelectCurrencyPopup
            setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
            setSelectedCurrency={setSelectedCurrency}
            selectedCurrency={selectedCurrency}
            setSymbolSelected={setSymbolSelected}
          />
        )}

        {showLocationModal && (
          <SelectLocation
            onClose={() => setShowLocationModal(false)}
            setSelectedLocationNew={setSelectedLocationNew}
            selectedLocationNew={selectedLocationNew}
            showNewFolder={false}
            setIsLoading={setIsLoading}
            existCreateFolder={existCreateFolder}
            father={'fileExplorer'}
          />
        )}
        

        {showDeleteChatsAgents && (
          <DeleteChatAgents
            user={user}
            setDeleteChats={setShowDeleteChatsAgents}
            type={typeDeleteChatsAgents}
            deleteFileS3={() => {
              const key = selectedOptionToDelete.Key.split("/").pop();
              const match = key.match(/^FILE-([a-f0-9\-]+)/i);

              if (match && match[1]) {
                const cleanId = match[1];
                deletePDF(cleanId); 
              } else {
                console.error("No se pudo extraer el ID desde el key:", selectedOptionToDelete.Key);
              }

              handleDelete(selectedOptionToDelete);
            }}
            deleteFolder={() => {
              handleDelete(selectedOptionToDelete)
            }}

            variant={varianteDeleteChatsAgent}
            setVariant={setVarianteDeleteChatsAgent}
          />
        )}

        {/* Menú contextual */}
        {contextMenu.visible && (
          // Menú contextual para el contenedor (solo aparece cuando estamos dentro de una carpeta)
          <div
            className={`${styles.optionsPopup} context-menu ${styles.visible}`}
            style={{
              // position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              // zIndex: 1000,
              // backgroundColor: 'white',
              // border: '1px solid #ccc',
              // borderRadius: '4px',
              // boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              // padding: '4px 0',
              // minWidth: '150px',
            }}
          >
            <button
              className={styles.optionItem}
              onClick={async () => {
                closeContextMenu();
                await dispatch(emptyFolder({ key: currentPath }));
                await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken,userFilters,currentPath })).unwrap();
                console.log('Carpeta actualaaaa:', currentPath);
              }}
            >
              {t('emptyFolder')}
            </button>
        
          </div>
        )}
        
      </div>
    </>
  );
}
