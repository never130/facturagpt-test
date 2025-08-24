import React , { useState, useEffect, useMemo, useRef } from "react";
import style from "./LeftPanel.module.css";
import ActionButtons from "../ActionButtons/ActionButtons";
import { useTranslation } from "react-i18next";
import { getAllContacts } from "@src/actions/contacts"
import { getAllAssets } from "@src/actions/assets"
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import { formatAgoDate } from "../../../../../../utils/agoDateUtil"
import { ReactComponent as IconSearch } from '../assets/icon-search.svg';
import { ReactComponent as DocumentsDontFound } from '../assets/documentsDontFound.svg';
import { ReactComponent as Folder } from '../assets/folder.svg';
import { ReactComponent as LittleClock } from '../assets/littleClock.svg';
import { ReactComponent as CheckCircleBlack } from '../assets/checkCircleBlack.svg';
import { ReactComponent as Padlock } from '../assets/padlock.svg';
import { ReactComponent as CheckGreen } from '../assets/checkGreen.svg';
import { ReactComponent as Defeated } from '../assets/defeated.svg';
import { ReactComponent as Draft } from '../assets/draft.svg';
import { ReactComponent as Fail } from '../assets/fail.svg';
import { ReactComponent as Canceled } from '../assets/canceled.svg';
import { ReactComponent as Paid } from '../assets/paid.svg';
import { ReactComponent as DocumentIcon } from '../assets/documentIcon.svg';
import { ReactComponent as ImageIcon } from '../assets/imageIcon.svg';
import { ReactComponent as HouseIcon } from '../../../../assets/HouseIcon.svg';
import {ReactComponent as StarExplore} from "../../../../assets/starExplore.svg"
import { ReactComponent as IconDots } from '../assets/icon-dots.svg';
import { ReactComponent as IconImage } from '../assets/icon-avatar.svg';
import { ReactComponent as IconFilter } from '../assets/icon-filter.svg';
import { ReactComponent as IconDocument } from '../assets/icon-doc.svg';
import { ReactComponent as WebIcon } from '../assets/webIcon.svg';
import { ReactComponent as PhoneIcon } from '../assets/phoneIcon.svg';
import { ReactComponent as EmailIcon } from '../assets/emailIcon.svg';
import { ReactComponent as TagIcon } from '../assets/tagIcon.svg';
import { ReactComponent as ImageDefaultAsset } from '../assets/imageDefaultAsset.svg';
import imageDefaultAsset from '../assets/imageDefaultAsset.svg';
import { ReactComponent as ThreeVerticalPoints } from '../assets/threeVerticalPoints.svg';
import { ReactComponent as MapIcon } from '../assets/mapIcon.svg';
import { ReactComponent as FilterIcon1InExplore } from "../../../../assets/filterIcon1InExplore.svg"
import { ReactComponent as ImageDefaultContact } from "../../../../assets/imageDefaultContact.svg"
import { ReactComponent as GreenMailIcon } from "../../../../assets/greenMailIcon.svg";
import { ReactComponent as GreenWebIcon } from "../../../../assets/greenWebIcon.svg";
import { ReactComponent as GreenPhoneIcon } from "../../../../assets/greenPhoneIcon.svg";
import { ReactComponent as GrayTagIcon } from "../../../../assets/tagNewIcon.svg";
import { ReactComponent as IconPending } from '../assets/icon-status-pendent.svg';
import { ReactComponent as NoData } from '../../../../assets/noData.svg';
import pdfIcon2 from "../../../../assets/pdfIcon2.svg";
import imageIcon2 from "../../../../assets/imageIcon2.svg";
import codeIcon from "../../../../assets/S3/codeIcon.svg";
import fileIcon from "../../../../assets/S3/fileIcon.svg";
import folderIcon from "../../../../assets/folderClosed.svg";
import imageEmpty from "../../../../assets/ImageEmpty.svg";
import imageDefaultContact from "../../../../assets/imageDefaultContact.svg"
import { useSelector, useDispatch } from "react-redux";
import AmountTransaction from "../../../AmountTransaction/AmountTransaction";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setAsset, setFatherNewAsset } from "../../../../../../slices/assetsSlices";
import { setTab } from "../../../../../../slices/dashboardSlices";
import { setContact, setFatherNewContact } from "../../../../../../slices/contactsSlices";
import PaginationTables from "../../..//PaginationTables/PaginationTables";
import FiltersDropdownContainer from "../../../FiltersDropdownContainer/FiltersDropdownContainer";
import { FileOptionsPopup, FolderOptionsPopup } from "../../../FileExplorer/FileOptionsPopup";
import DeleteChatAgents from "../../../DeleteChatAgents/DeleteChatAgents";
import { getAgents } from "../../../../../../actions/agents.js";
import { clearCurrentChat } from "@src/slices/chatSlices";
import {
  deleteAgent,
  getAgentById,
  getImagesAgents,
  getPublicAgents,
  restartLastMessage,
  searchInWebAction,
} from "../../../../../../actions/chat.js";


import {
  fetchByMenu,
  fetchByChat,
  deleteChat,
  validateTokenGPT,
} from "@src/actions/chat";

import Button from "../../../Button/Button";
import NewTag from "../../../NewTag/NewTag";
import { updateContact } from "../../../../../../actions/contacts.js";
import { updateAsset } from "../../../../../../actions/assets.js";
import { deleteObject, duplicateFolderFiles, getUserFiles, moveObject, updateNameFolderS3 } from "../../../../../../actions/scaleway.js";
import { setCurrentPath, setFromHome, setUserFiles } from "../../../../../../slices/scalewaySlices.js";
import { selectDocument } from "../../../../../../slices/userSlices.js";
import { fetchMetadataPDF, handleFileUpdate,deletePDF, deleteManyPDF, weighFolder, moveManyFileLocally } from "../../../../../../utils/pdfUtils.js";

const NavigationTabs = ({ tabs, activeTab, onTabChange, totalPagination, limit, page, setPage, setLimit,tabEffect }) => {

  return (
    <div className={style.navTabs}>
      <div className={style.buttonsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${style.navTab} ${tabEffect === tab.value ? style.active : ''}`}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div>
        <PaginationTables
          customPaginationNumbers={{ gap: "2px" }}
          customPaginationContainer={{ gap: "2px" }}
          totalData={totalPagination}
          limit={limit}
          page={page}
          setPage={setPage}
          setLimit={setLimit}
          father={"home"}
        />
      </div>
    </div>
  );
};


const SearchBar = ({ searchQuery, onSearchChange, setSelectedOption, selectedOption, options }) => {

 const {isAppleOS} = useSelector(state => state.user)

  const searchInputRef = useRef(null)
  return (
    <div className={style.searchSection}>
      <div className={style.searchBar}>
        <IconSearch />
        <input ref={searchInputRef}
          type="text"
          className={style.searchInput}
          placeholder="Buscar por nombre, número fiscal, número de factura o referencia"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <FiltersDropdownContainer customFilterSort={{ whiteSpace: "nowrap" }} customDropdownContainer={{ minWidth: "auto" }}
          setSelectedFilters={setSelectedOption}
          selectedFilters={selectedOption}
          options={options}
          father={"home"}
        />
       {isAppleOS &&  <FilterIcon1InExplore style={{ width: "28px", height: "28px" }} />}
        <span onClick={() => searchInputRef.current.focus()} className={style.searchIcon} >
          K
        </span>
      </div>
    </div>
  );
};


const IncomeSection = ({ incomes, t , incomeRef}) => {
  const [selected, setSelected] = useState(1)


  return (
    <div className={style.contentSection} ref={incomeRef} name={'income'}>
      <div id="typeContact" className={`${style.typeContact}`}>
      
                  <div >
                    
                    <button
                      className={`${style.categoryButton} ${selected == 1 && style.selected}`}
                      onClick={() => setSelected(1)}
                      type="button"
                    > {selected == 1 && <CheckCircleBlack/>}
                      {t('all')}
                    </button>
                  </div>
                  <div >
                    
                    <button
                      className={`${style.categoryButton} ${selected == 2 && style.selected}`}
                      onClick={() => setSelected(2)}
                      type="button"
                    > {selected == 2 && <CheckCircleBlack/>}
                      {t('expenseAccounts')}
                    </button>
                  </div>
                  <div >
                    
                    <button
                      className={`${style.categoryButton} ${selected == 3 && style.selected}`}
                      onClick={() => setSelected(3)}
                      type="button"
                    > {selected == 3 && <CheckCircleBlack/>}
                      {t('incomeAccounts')}
                    </button>
                  </div>
      
                </div>

      {/* <div className={style.sectionHeader}>
        <span className={style.sectionTitle}>
          Ingresos y Gastos

          tengo que recuperarlo todo :

        </span>
      </div> */}
      {incomes?.length > 0 ? incomes?.map((income) => (
        <IncomeItem key={income.id} income={income} />
      )) : null}
    </div>
  )
}




const DocumentsSection = ({ documents, t, documentsRef,searchQuery,user ,handleDownload,
  userFiles
 }) => {


  const { id } = useParams();
  const dispatch = useDispatch()
  const breadCrumbsRef = useRef(null);
  const [userFilters, setUserFilters] = useState(null);
  const [filteredAssetIds, setFilteredAssetIds] = useState([]);
  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [tempFileNames, setTempFileNames] = useState({});
  const [currentPath, setCurrentPath] = useState("")
  const draggedItemRef = useRef(null);


  const hasActiveFilters =
  userFilters &&
  (userFilters.keyWord !== "" ||
    userFilters.maxValue !== "" ||
    userFilters.minValue !== "" ||
    userFilters.selectedCategory !== "" ||
    userFilters.selectedCurrency !== "" ||
    (userFilters.selectedTags && userFilters.selectedTags.length > 0) ||
    (userFilters.selectedTypes && userFilters.selectedTypes.length > 0));


  const handleMouseDown = (e) => {
    const element = breadCrumbsRef.current;
    element.isDragging = true;
    element.startX = e.pageX - element.offsetLeft;
    element.scrollLeft = element.scrollLeft;
  };

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

  const renderBreadcrumbs = () => {
    if (!currentPath) return null;


    const pathSegments = currentPath.split("/").filter(Boolean);

    if (pathSegments.length && pathSegments[0] === user.id) {
      pathSegments.shift();
    }

    const breadcrumbs = [
      <span key="inicio" className={style.firstSpan}>
        {pathSegments.length > 0 && (
          <span className={style.firstSpan}>
            {/* <ArrowRightText />{" "} */}{`>`}
          </span>
        )}
      </span>,
    ];

    pathSegments.forEach((segment, index) => {
      const partialSegments = pathSegments.slice(0, index + 1);
      const partialPath = `${user.id}/${partialSegments.join("/")}/`;

      breadcrumbs.push(
        <span key={partialPath} className={`${style.firstSpan} ${((pathSegments.length - 1) == index) && style.black} `} style={{color: ((pathSegments.length - 1) == index) && "black"}}>
          <div
            onClick={() => handleBreadcrumbClick(partialPath)}
            className={`${index == pathSegments.length - 1 && style.finalBreadcrumbButton} ${style.breadcrumbButton}`}
          >
            {segment}
          </div>
          {index < pathSegments.length - 1 && (
            <span className={style.firstSpan}>
              {" "} {`>`}
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
        className={style.breadcrumbs}
        style={{display:"flex"}}
      >
        {breadcrumbs}
      </div>
    );
  };
  const handleBreadcrumbClick = (path) => {
    setCurrentPath(path)
    dispatch(setFromHome(true))
  };

  useEffect(() => {
    const getFilesS3 = async () => {
      const userLocalStorage = localStorage.getItem("user");
      const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;
      dispatch(setFromHome(true))
     await dispatch(
        getUserFiles({ userId: user?.id, token: parsedUser?.accessToken,filters: userFilters,currentPath })
      );
      dispatch(setFromHome(false))
    }

    getFilesS3()
  }, [currentPath])



  return (
    <div className={style.contentSection} ref={documentsRef} name={'documents'}>
      <div className={style.documentsRoutes}>
      {currentPath?.split("/").filter(Boolean).length >= 2 && (
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUpOrLeave}
              onMouseUp={handleMouseUpOrLeave}
              ref={breadCrumbsRef}
              className={style.pathContainer}
            >
              <div
                className={style.houseContainer}
                onClick={() => {
                  setCurrentPath(user.id + "/")
                  dispatch(setFromHome(true))

                }}
              >
                <HouseIcon
                  onClick={() => {
                    setCurrentPath(user.id + "/")
                    dispatch(setFromHome(true))
                  }}
                  className={`${style.icon} ${style.house}`}
                />
              </div>

              {renderBreadcrumbs()}
            </div>
          )}
      </div>
      <div className={style.filesContainer}>
          <div className={style.fileListt}>
              {true && (
              ((userFiles?.length === 0 || !userFiles) &&
                (hasActiveFilters || searchQuery !== "") && (
                  <div className={style.noFilesContainerMessage}>
                  </div>
                )) ||
              (userFiles?.length === 0 && (
                <div 
                  className={style.noFilesContainer}
                >
                </div>

              )) ||
              userFiles
                ?.filter((item) => {
                  if (!filteredAssetIds || filteredAssetIds.length === 0) return true;

                  const fileName = item.Key.split("/").pop(); // ej: FILE-uuid-nombre.pdf
                  return filteredAssetIds.some(id => fileName.includes(id));
                }).map((item, index) => {
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
                  return (<DocumentItem t={t} searchQuery={searchQuery} user={user} setSelectedFileS3={setSelectedFileS3}
                    tempFileNames={tempFileNames} setTempFileNames={setTempFileNames} item={item} index={index} isFolder={isFolder}
                    fileName={fileName} uuid={uuid} draggedItemRef={draggedItemRef} id={id} handleDownload={handleDownload} 
                    setCurrentPath={setCurrentPath} currentPath={currentPath} userFiles={userFiles}/>)})
                )}
                
                  </div>
                  </div>
    </div>
  );
};



const IncomeItem = ({ income }) => {
  const max = 100
  const currentTotal = 30
  const progressPercent = Math.min((currentTotal / max) * 100, 100);
  return (
    <div className={style.incomeItemContainer}>
    <div className={style.incomeItem}>
      <div className={style.left}>
        <span>{income.title}</span>
      </div>
      <div>
        <div className={style.contactAmount} style={{
          flexDirection: income.subCategory == "insurance" && "row",
          gap: income.subCategory == "insurance" && "20px"
          }} >
                            <span>{'0,00€ ~ 0,00€ (0%)'}</span>
                            {income.subCategory == "insurance" ? 
                             <span>{'0,00€ ~ 0,00€ (0%)'}</span>
                            : 
                            <div className={style.progressWrapper}>
                                  {currentTotal > 0 &&
                                    <div className={style.progressBar}>
                                      <div
                                        className={style.progressFill}
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  }
                                </div>
                            }
                               
                          </div>
      </div>
      {/* <button>
        <IconDots />
      </button>
      <input type="checkbox" className={style.checkbox} />
      <div className={style.documentIcon}>
        <IconDocument />
      </div>
      <div className={style.documentInfo}>
        <span className={style.documentId}>{income.id}</span>
        <span className={`${style.statusBadge} ${style[`status-${income.statusColor}`]}`}>
          {income.status}
        </span>
        <div className={style.statusDots}>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className={style.statusDot} />
          ))}
        </div>
      </div> */}
    </div>
    </div>
  );
};


const DocumentItem = ({t, key, document,searchQuery,user,
  setSelectedFileS3,setTempFileNames,tempFileNames,item,
  index,isFolder,fileName,uuid,draggedItemRef, id,handleDownload,
  setCurrentPath,currentPath,userFiles}) => {


  const dispatch = useDispatch()
  const navigate = useNavigate()


    const [fileNameS3, setFileNameS3] = useState(null);
    const [renameFolder, setRenameFolder] = useState("");
    const [popupPosition, setPopupPosition] = useState(null);
    const [activePopup, setActivePopup] = useState(null);
    const [showDeleteChatsAgents, setShowDeleteChatsAgents] = useState(false);
    const [typeDeleteChatsAgents, setSTypeDeleteChatsAgents] = useState(null);
    const [varianteDeleteChatsAgent, setVarianteDeleteChatsAgent] = useState('simple')
    const [selectedOptionToDelete, setSelectedOptionToDelete] = useState(null)
    const [metadataFiles, setMetadataFiles] = useState(false)
    const breadCrumbsRef = useRef(null);
    const optionsButtonRefs = useRef([]);

    useEffect(() => {
      const fn = async () => {
        const metadata = await fetchMetadataPDF(item.ETag.replace(/^"|"$/g, ''));
        setMetadataFiles(metadata)
        setOptionSelected(metadata?.stateStripe === "undefined" ? "Seleccione estado" : metadata?.stateStripe ? metadata?.stateStripe : "Seleccione estado")
        setSelectedColor(colors[options.findIndex(option => option == metadata?.stateStripe)])
      }
      !metadataFiles && !isFolder &&  fn()
      if(isFolder){ setMetadataFiles(false)
        setOptionSelected("")
        setSelectedColor("")
      }
    },[currentPath, isFolder])

    

const dropTargetRef = useRef(null);
const inputRefs = useRef({});

  useEffect(() => {
    if (renameFolder && inputRefs.current[renameFolder]) {
      inputRefs.current[renameFolder].focus();
    }
  }, [renameFolder]);

  const userLocalStorage = localStorage.getItem("user");
    const parsedUser = userLocalStorage
      ? JSON.parse(userLocalStorage)
      : null;

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

      dispatch(setFromHome(true))
    await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
    dispatch(setFromHome(false))
    await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
  };


    const handleDragStart = (e, item) => {
      draggedItemRef.current = item;
      e.dataTransfer.effectAllowed = "move";
    };
    
    const handleDragOver = (e, item) => {
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      dropTargetRef.current = item;
    };
    
    const handleDrop = async (e, targetItem) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }
      const draggedItem = draggedItemRef.current;
    
      if (!draggedItem || !targetItem.Key.endsWith("/")) {
        console.warn("[Drop] El destino no es una carpeta:", targetItem.Key);
        draggedItemRef.current = null;
        dropTargetRef.current = null;
        return;
      }
    
      const destinationKey = targetItem.Key;
      const sourceKey = draggedItem.Key;
      const isFolder = sourceKey.endsWith("/");
    
      dispatchLocalMove(sourceKey, destinationKey, isFolder);
    
      await dispatch(
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
    
      draggedItemRef.current = null;
      dropTargetRef.current = null;
    };
    
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
        console.log('esto es updatedFiles',updatedFiles)
      }
      dispatch(setUserFiles(updatedFiles));
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

    const iconToUserFiles = (key) => {
      return (<>
        <div
          className={style.loadingImage}
        />
        {getFileIcon(key)}

      </>)
    };

    const getFileIcon = (key) => {
      if (key.endsWith("/")) {
       return  <Folder/>
      }

  
      const extension = key.split(".").pop().toLowerCase();
  
      if (["svg", "gif"].includes(extension)) {
        return <ImageIcon/>
      }
  
      if (["jpg", "jpeg", "JPG", "JPEG"].includes(extension)) {
        return <ImageIcon/>
      }
  
      if (["js", "css", "java"].includes(extension)) {
        return codeIcon;
      }
  
      if (["pdf", "PDF"].includes(extension)) {
        return <DocumentIcon/>
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
        return  <ImageIcon/>
      }

      return <DocumentIcon/>
  
    };

    const handleDragEnd = (e) => {
      draggedItemRef.current = null;
      dropTargetRef.current = null;
    };

    const handleOptionsClick = (index, event) => {

      event.stopPropagation();
  
      const ref = optionsButtonRefs.current[index];
      if (!ref) return;
  
      const rect = ref.getBoundingClientRect();
      const popupHeight = 120;
      const padding = 0;
  
      let top;
  
      if (rect.bottom + popupHeight > window.innerHeight) {
        top = rect.top - popupHeight -10;
      } else {
        top = rect.top + rect.height;
      }
  
      setPopupPosition({
        top,
        left: rect.left - 130,
      });
  
      setActivePopup(prev => (prev !== index ? index : null));
    };

    const handleDelete = (item) => {
    const oldUserFiles = userFiles;
    const newUserFiles = removeItemLocally(oldUserFiles, item);

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

      if(item.Key.endsWith("/"))  deleteManyPDF(item.Key)
      else deletePDF(metadataFiles?._id)


    if (id === item.ETag) {
      dispatch(selectDocument(null));
      setSelectedFileS3(null)
    }

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

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  const match = item?.Key?.match(/^account_([^_]+@[^_]+)\_/);

const userName = match ? match[1] : null;
const [folderSize, setFolderSize] = useState(null) // Inicializar con null para que el useEffect se ejecute

useEffect(() => {
  if (isFolder && item.Key) {
    const getFolderSize = async () => {
      try {
        const response = await weighFolder(item.Key);
        setFolderSize(response.totalSize); // Asegúrate de que response.totalSize es el valor correcto
      } catch (error) {
        console.error("Error al obtener el peso de la carpeta:", error);
        setFolderSize(0); 
      }
    };
    getFolderSize();
  }

}, [isFolder, item.Key, item]); 


  const options =[t('Paid'), t('pending'),t('defaulted'),t('due'),t('voided'),t('draft')]

    const colors = ["#009F7A",
    "#FF9D00",
     "#FF5500",
      "#C5221F",
      "#8A0300",
       "#4F5660",]

  const [optionSelected, setOptionSelected] = useState(() => {
    const value = metadataFiles?.stateStripe;
    return (!value || value === "undefined") ? "Seleccione estado" : value;
  });
  const [selectedColor, setSelectedColor] = useState("")
  const [currentIcon, setCurrentIcon] = useState(null)
  useEffect(()=> {
    if(optionSelected?.type == "span") return
    else setCurrentIcon(optionSelected)
  },[optionSelected])

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
                      className={style.documentItem}
                    >
                      <div 
                        className={style.left}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFolder) {
                            setCurrentPath(item.Key)
                            dispatch(setFromHome(true))

                          }

                          if (isFolder) {
                          } else if (uuid) {
                            if (typeof setSelectedFileS3 === "function") {
                              setSelectedFileS3(item);
                            }
                            setFileNameS3(item.Key.split("/").pop());
                            dispatch(selectDocument({ item }));
                            navigate("/admin/panel/" + uuid);
                          } else {

                            
                            navigate( "/admin/panel/" + item.ETag.replace(/"/g, ""));
                            setSelectedFileS3(item);
                            dispatch(selectDocument({ item }));
                            setFileNameS3(item.Key.split("/").pop());
                          }
                        }}
                      >
                        {iconToUserFiles(item.Key)}
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
                            onBlur={async (e) => {
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
                            }}
                          />
                        ) : (isFolder ?
                          (<span className={style.itemText} style={{fontSize:"14px"}}>
                           {  (tempFileNames[item.Key] || fileName)}
                          </span>):
                              <div className={style.notFolderContainer} style={{display:"flex:", flexDirection:"columns"}}>
                                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                             <span>{(tempFileNames[item.Key] || fileName)}</span> 
                             <div style={{background:"#0000ff", height:"2px", width:"2px", padding:"3px", borderRadius:"100%", border: "2px solid #22222233"}}></div>
                             <div style={{background:"#b07974", height:"2px", width:"2px", padding:"3px", borderRadius:"100%", border: "2px solid #22222233"}}></div>
                                </div>
                            <div>
                            <span className={style.firstSpan}>{"Factura"}</span> <span className={style.secondSpan}>{"Gastos Operativos"}</span>
                            </div>
                            </div>
                        )}
                      </div>

                      <div className={style.right}>
         <div className={style.firstPart}>
           <div className={style.textContainer}>
              <span>{`${t('modifiedLastTimeFor')} ${userName ? userName : ""} ${item?.LastModified ? formatAgoDate({ dateString: item.LastModified, t }): t("just_now")}`}</span> 
             <span className={style.clear}>{`${t('createdBy')} ${userName ? userName : ""}  ${metadataFiles?.createdAt ? formatAgoDate({ dateString: metadataFiles.createdAt, t }): item?.LastModified ? formatAgoDate({ dateString: item.LastModified, t }): t("just_now")}`}</span>
           </div>
         <div className={ document?.separation == "point" && style.pointSeparator} style={{marginLeft:"5px"}}></div>
          <span style={{ whiteSpace: "nowrap" }} 
          className={ true ? style.barSeparator : document?.separation == "point" ? style.pointsSeparator : style.lessSeparator }>
            {isFolder ? (folderSize !== null ? formatBytes(folderSize,0) : 'Cargando...') : (item?.Size ? formatBytes(item.Size,0) : (metadataFiles?._attachments?.[metadataFiles?.documentTitle]?.length ? formatBytes(metadataFiles?._attachments?.[metadataFiles?.documentTitle]?.length,0) : null))}</span>
          {document?.type != "folder" &&  <div className={document?.separation == "point" && style.pointSeparator} style={{marginRight:"10px"}}></div>}
         </div>
       {!isFolder &&   
      
      <div className={style.secondPart} style={{display: "flex",    alignItems: "center",    gap: "5px", marginRight:"20px"}}>
            {currentIcon == null ? (document?.statusColor == "paid"? <Paid/> : document?.statusColor == "fail"? <Fail/> :document?.statusColor == "canceled"? <Canceled/> :
            document?.statusColor == "draft"? <Draft/> :document?.statusColor == "defeated"? <Defeated/> :document?.statusColor == "pending"? <IconPending/>  :<></>):
            (currentIcon == t('Paid')? <Paid/> : currentIcon == t('defaulted')? <Fail/> :currentIcon == t('voided')? <Canceled/> :
            currentIcon == t('draft')? <Draft/> :currentIcon == t('due')? <Defeated/> :currentIcon == t('pending')? <IconPending/>  :<></>)
            }
          <div>
             <CustomDropdown
                    height="25px"
                    options={options}
                    selectedOption={optionSelected}
                    setSelectedOption={(options) => setOptionSelected(options)}
                    father={"docHome"}
                    generalStyleFilterSort={{background: "transparent",flexDirection: "row-reverse", minWidth: "10px"}}
                    arrowSizeCustom={12}
                    stateStripe={true}
                    generalDropdownHeader={{fontWeight: "bold"}}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                  />
          </div>
          <CheckGreen/>
          <span></span>
          <Button action={ async () => { await handleFileUpdate({stateStripe:optionSelected, eTag:item.ETag.replace(/^"|"$/g, '')})
          setMetadataFiles(await fetchMetadataPDF(item.ETag.replace(/^"|"$/g, '')))
        }} headerStyle={{padding:"6px 12px"}}> <Padlock  width={9} height={9}/> {t('approve')} </Button>
        </div>
        
        }
        <div ref={(el) => (optionsButtonRefs.current[index] = el)}
         onClick={(e) => handleOptionsClick(index, e)} className={style.thirdPart} style={{width:"10px"}}>
          <ThreeVerticalPoints/>
        </div>
      </div>
                      {activePopup === index &&
                        (isFolder ? (
                          <FolderOptionsPopup
                            parentRef={optionsButtonRefs.current[index]}
                            onClose={() => setActivePopup(null)}
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
                            style={{
                              position: "fixed",
                              top: `${popupPosition.top}px`,
                              left: `${popupPosition.left}px`,

                            }}
                          />
                        ))}

{showDeleteChatsAgents && (
          <DeleteChatAgents
            user={user}
            setDeleteChats={setShowDeleteChatsAgents}
            type={typeDeleteChatsAgents}
            deleteFileS3={() => {
              const key = selectedOptionToDelete.Key.split("/").pop(); // obtiene "FILE-uuid_nombre.ext"
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
                    </div>
                  );

      


  
};


const ContactsSection = ({ contacts,  t, handleSelectCard, result, contactsRef  }) => {

  return (
    <div className={style.contentSection} ref={contactsRef} name={'contacts'}>
   
      {result?.contacts?.length > 0 ? result.contacts.map((contact, index) => (
        <ContactItem key={index} contact={contact} t={t} handleSelectCard={handleSelectCard}
        />
      )) : null}
    </div>
  );
};


const ContactItem = ({ contact, t, handleSelectCard }) => {
  const dispatch = useDispatch()
  const max = 100
  const currentTotal = 30
  const progressPercent = Math.min((currentTotal / max) * 100, 100);
  let { _id, _rev, ...contactData } = contact

  const [showAddTagsContact, setShowAddTagsContact] = useState(false);
  const [selectedTagsContact, setSelectedTagsContact] = useState(contactData?.selectedtags?.length > 0 ? contactData?.selectedtags : []);
  const [tagsContact, setTagsContact] = useState(contactData?.tags?.length > 0 ? contactData?.tags : []);
  const [saveTime, setSaveTime] = useState(false)

  useEffect(() => {
    if (saveTime) {
      dispatch(updateContact({ id: _id, contactData: { ...contactData, selectedtags: [...selectedTagsContact], tags: [...tagsContact] } }))
      setSaveTime(false)
    }
  }, [tagsContact, selectedTagsContact])

  const handleBtnsActions = (type) => {
    if (!contact) return;

    const { companyPhoneNumber, webSite, companyEmail } = contact;

    switch (type) {

      case 'callPhoneNumber':
        if (companyPhoneNumber?.length > 0) {
          const { code, number } = companyPhoneNumber[0];
          window.location.href = `tel:${code}${number}`;
        }
        break;

      case 'website':
        if (webSite) {
          const formattedWebsite = webSite.startsWith('http://') || webSite.startsWith('https://')
            ? webSite
            : `https://${webSite}`;
          window.open(formattedWebsite, '_blank');
        }
        break;

      case 'email':
        if (companyEmail) {
          window.location.href = `mailto:${companyEmail}`;
        }
        break;
      default:
        console.warn('Tipo de acción no reconocido:', type);
    }

  };

  return (
    <div className={style.contactItem}
    >
      <div className={style.contactAvatar}>
        <img onError={(e) => {
          e.target.onerror = null;
          e.target.src = imageDefaultContact;
        }}
          src={contact.image || <ImageDefaultContact />}
          alt="Contact"
          width="30"
          height="30"
        />
      </div>
            <div className={style.contactInfo}>
                <div className={style.contactName}>{contact.contactName || t('contactName')}</div>
                <div className={style.contactStats}>
                    {"# Transacciones "}    <div style={{ marginLeft: "5px", marginRight: "5px" }}><AmountTransaction row={contact} /></div> {` Total 0  (${formatAgoDate({ dateString: contact.createdAt, t })}) `}
                </div>
            </div>
            <div className={style.contactRightColumn}>
              <div className={style.firstPart}>
                <div className={style.btnContactInfoContainer}>
                      {/* {contact?.companyPhoneNumber?.length > 0 && ( */}
                            {true && (               
                         <PhoneIcon style={{width:"34px", height:"34px", cursor:"pointer"}}  onClick={(e) => {
                                e.stopPropagation()
                                handleBtnsActions("callPhoneNumber")}} />
                        )}


                         {/* {contact?.companyEmail && ( */}
                            {true && (
                            <EmailIcon style={{width:"34px", height:"34px", cursor:"pointer"}} onClick={(e) => {
                                e.stopPropagation()
                                handleBtnsActions("email")}} />
                        )}


                      {/* {contact?.webSite && ( */}
                        {true && (
                            <WebIcon style={{width:"34px", height:"34px", cursor:"pointer"}}  onClick={(e) => {
                                e.stopPropagation()
                                handleBtnsActions("website")}} />
                        )}


                          <TagIcon style={{width:"34px", height:"34px", cursor:"pointer"}} onClick={(e) => {
                            e.stopPropagation()
                            setShowAddTagsContact(true);
                          }}
                            className={showAddTagsContact && style.activeBtn}
                          />
                      </div>
                          <div className={style.contactAmount} >
                            <span>{'0,00€ ~ 0,00€ (0%)'}</span>
                            
                               <div className={style.progressWrapper}>
                                  {currentTotal > 0 &&
                                    <div className={style.progressBar}>
                                      <div
                                        className={style.progressFill}
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  }
                                </div>
                          </div>
                        </div>
                          <div style={{width:"10px"}}>
                            <ThreeVerticalPoints/>
                          </div>
            </div>
             {showAddTagsContact && (
                      <NewTag
                        customoBg={{background:"#00000008"}}
                        setShowNewTagModal={setShowAddTagsContact}
                        setSelectedTags={setSelectedTagsContact}
                        selectedTags={selectedTagsContact}
                        setTags={setTagsContact}
                        tags={tagsContact}
                        setSaveTime={setSaveTime}
                      />
                    )}

    </div>
  );
};




const AssetsSection = ({ assets, t, handleSelectCard, result, assetsRef }) => {
  const dispatch = useDispatch()

  return (
    <div className={style.contentSection} ref={assetsRef} name={'assets'}>
      {/* <div className={style.sectionHeader}>
                <span className={style.sectionTitle}>Activos</span>
                <span className={style.sectionTitle}>Importe</span>
            </div> */}
      {result?.assets?.length > 0 ? result?.assets?.map((asset, index) => (
        <AssetItem key={index} asset={asset} t={t} handleSelectCard={handleSelectCard} />
      )) : null}
    </div>
  );
};


const AssetItem = ({ asset, t, handleSelectCard }) => {

  const dispatch = useDispatch()
  const max = 100
  const currentTotal = 30
  const progressPercent = Math.min((currentTotal / max) * 100, 100);

  let { _id, _rev, ...assetData } = asset

  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState(assetData?.selectedtags?.length > 0 ? assetData?.selectedtags : []);
  const [tags, setTags] = useState(assetData?.tags?.length > 0 ? assetData?.tags : []);
  const [saveTime, setSaveTime] = useState(false)

  useEffect(() => {
    if (saveTime) {
      dispatch(updateAsset({ id: _id, assetData: { ...assetData, selectedtags: [...selectedTags], tags: [...tags] } }))
      setSaveTime(false)
    }
  }, [tags, selectedTags])

  const handleBtnsActions = (type) => {
    if (!asset) return;

    const { companyPhoneNumber, webSite, companyEmail } = userData;
    switch (type) {
      case 'clipboard':
        navigator.clipboard.writeText(window.location.href)
          .then(() => console.log('URL copiada al portapapeles'))
          .catch((err) => console.error('Error al copiar al portapapeles:', err));
        setCopyclipboard(true)
        setTimeout(() => {
          setCopyclipboard(false)
        }, 5000);
        break;

      case 'callPhoneNumber':
        if (companyPhoneNumber?.length > 0) {
          const { code, number } = companyPhoneNumber[0];
          window.location.href = `tel:${code}${number}`;
        }
        break;

      case 'website':
        if (webSite) {
          const formattedWebsite = webSite.startsWith('http://') || webSite.startsWith('https://')
            ? webSite
            : `https://${webSite}`;
          window.open(formattedWebsite, '_blank');
        }
        break;

      case 'email':
        if (companyEmail) {
          window.location.href = `mailto:${companyEmail}`;
        }
        break;

      case "inputFileTitle":
        setEditingFileTitle((prev) => !prev)
        break;
      default:
        console.warn('Tipo de acción no reconocido:', type);
    }
  };

  return (
    <div className={style.contactItem}
    >
      <div className={style.contactAvatar} style={{ borderRadius: "4px" }}>
        <img style={{ borderRadius: "0px" }} onError={(e) => {
          e.target.onerror = null;
          e.target.src = imageDefaultAsset;
        }}
          src={asset.image || <ImageDefaultAsset />}
          alt="Asset"
        />

      </div>
      <div className={style.contactInfo}>
        <div className={style.contactName}>{asset.name || t('assetTitle')}</div>
        <div className={style.contactStats}>
          {"# Transacciones "}    <div style={{ marginLeft: "5px", marginRight: "5px" }}><AmountTransaction row={asset} /></div> {` Total 0  (${formatAgoDate({ dateString: asset.createdAt, t })}) `}
        </div>
      </div>
   
                <div className={style.contactRightColumn}>
                   <div className={style.firstPart}>
                <div className={style.btnContactInfoContainer}>
                      {/* {contact?.companyPhoneNumber?.length > 0 && ( */}
                            {true && (               
                         <MapIcon style={{width:"34px", height:"34px", cursor:"pointer"}}  onClick={(e) => {
                                e.stopPropagation()
                                handleBtnsActions("map")}} />
                        )}


                      {/* {contact?.webSite && ( */}
                        {true && (
                            <WebIcon style={{width:"34px", height:"34px", cursor:"pointer"}}  onClick={(e) => {
                                e.stopPropagation()
                                handleBtnsActions("website")}} />
                        )}


                          <TagIcon style={{width:"34px", height:"34px", cursor:"pointer"}} onClick={(e) => {
                            e.stopPropagation()
                            setShowAddTags(true);
                          }}
                          />
                      </div>
                          <div className={style.contactAmount} >
                            <span>{'0,00€ ~ 0,00€ (0%)'}</span>
                            
                               <div className={style.progressWrapper}>
                                  {currentTotal > 0 &&
                                    <div className={style.progressBar}>
                                      <div
                                        className={style.progressFill}
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  }
                                </div>
                          </div>
                    </div>
                          <div style={{width:"10px"}}>
                            <ThreeVerticalPoints/>
                          </div>
            </div>
{showAddTags && (
                      <NewTag
                      customoBg={{background:"#00000008"}}
                        setShowNewTagModal={setShowAddTags}
                        setSelectedTags={setSelectedTags}
                        selectedTags={selectedTags}
                        setTags={setTags}
                        tags={tags}
                        setSaveTime={setSaveTime}
                      />
                    )}

    </div>
  );
};

const TeamSection = ({t, handleSelectCard, teams, teamRef  }) => {

  return (
    <div className={style.contentSection} ref={teamRef} name={'team'}>
      {/* <div className={style.sectionHeader}>
                <span className={style.sectionTitle}>Contacto</span>
                <span className={style.sectionTitle}>Importe</span>
            </div> */}
      {teams?.length > 0 ? teams.map((team, index) => (
        <TeamItem key={index} team={team} t={t} handleSelectCard={handleSelectCard}
        />
      )) : null}
    </div>
  );
};


const TeamItem = ({team, key, t, handleSelectCard }) => {
  const dispatch = useDispatch()
  const nada = [
    {
          id: 'T001',
          status: 'Aprobado',
          my:true
          
        },
        {
          id: 'T002',
          status: 'Aprobado',
          email: 'example@email.com',

        },
         {
          id: 'T003',
          status: 'Aprobado',
          email: 'example@email.com'          
        },
        {
          id: 'T004',
          status: 'pending',
          email: 'example@email.com',
        },
  ]

  return (
    <div className={style.teamItem}
    >
      <div className={style.teamLeftColumn}>
      <div className={style.contactAvatar} style={{position:"relative"}}>
        {team.my?
        <div className={style.imageProfileDefault}></div>
        :
        
        <img onError={(e) => {
          e.target.onerror = null;
          e.target.src = imageDefaultContact;
        }}
          src={team.image || <ImageDefaultContact />}
          alt="Contact"
          width="30"
          height="30"
        />
        }
       { team.statusColor &&  <div className={style.statusColor} style={{background:team.statusColor == "green" ? "var(--_10a37f-background)" : team.statusColor == "grey" ? "#c3c3c3" :""}}></div>}
      </div>
            <div className={style.textContainer}>
                <div className={style.topPart}>{team.my ? t('you') : team.status == "pending" ? team.email : t('memberName')}
                 {team.status == "pending" ? <button>{t('pending')}</button> : <StarExplore/>} 

                </div>
                <div className={style.bottomPart}>
                   <span>{t('typeOfAccess')} </span> <div className={style.littlePoint}></div>  <span>{t('role')} </span> {team.status != "pending" && <div className={style.littlePoint}></div>}   { team.my ? <span className={style.clearColor}>{t('memberSince1YearAgo')} </span> : team.status == "pending" ?"" : <span span className={style.clearColor}>{ team.email} </span> }
                </div>
            </div></div>
            <div className={style.teamRightColumn}>
              <div className={style.firstPart}>
                <div className={style.topPart}>
                  <span> {`0,00€ ${t('spent')}`}</span>
                  <span> {`0,00€ ${t('limit')}`}</span>
                </div>
                <div className={style.bottomPart}>
                  <span>{`# ${t('signatures')} `}</span>
                  <span className={style.blackColor}>0</span>
                  <span>{`# ${t('estimatedHours')} `}</span>
                  <span className={style.blackColor}>0</span>
                   <span>{`# ${t('hoursWorked')} `}</span>
                   <span className={style.blackColor}>0</span>
                  <div className={style.pointColor}></div>
                  <span className={style.blackColor}>02:02:02</span>
                  <LittleClock/>
                  <button>{t('vacations')}</button>
                </div>
                        </div>
                          <div style={{width:"10px"}}>
                            <ThreeVerticalPoints/>
                          </div>
            </div>
    </div>
  );
};

const ChatSection = ({ agentsChats, handleSelectCard, t }) => {
  return (
    <div className={style.contentSection}>
      <div className={style.sectionHeader}>
        <span className={style.sectionTitle}>Agentes y Chats</span>
        <span className={style.sectionTitle}></span>
      </div>
      {agentsChats?.length > 0 ? agentsChats.slice(0, 2).map((agent, index) => (
        <ChatItem key={index} agent={agent} handleSelectCard={handleSelectCard} />
      )) : null}
    </div>
  );
};


const ChatItem = ({ agent, t, handleSelectCard }) => {
  return (
    <div className={style.contactItem} onClick={() => handleSelectCard(agent, agent?.type || "agent")}>
      <div className={style.contactAvatar}>
        <IconImage />
      </div>
      <div className={style.contactInfo}>
        <div className={style.contactName}>{agent?.name || agent?.agent}</div>
        <div className={style.contactStats}>
          {agent?.type === 'chat' ? <span>{`Chat del agente: ${agent?.agent}`}</span> :
            <span>{`Agente`}</span>}
        </div>
      </div>
      <div className={style?.contactAmount}>
      </div>
    </div>
  );
};

const LeftPanel = ( {incomeRef,
      documentsRef,
      contactsRef,
      assetsRef,
      contenedorRef,
      teamRef}) => {
  const { user } = useSelector((state) => state.user);
  const { contacts, totalContacts } = useSelector((state) => state.contacts);
  const { assets, totalAssets: totalAssetsSlice } = useSelector((state) => state.assets);
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(2);
  const [page, setPage] = useState(0);
  const [totalPagination, setTotalPagination] = useState()
  const [tabEffect, setTabEffect] = useState('document')

  const {
    agents,
    loading: loadingAgent,
    error,
    selectedAgentSlice,
  } = useSelector((state) => state.agents);

     const {  homeUserFiles } =
  useSelector((state) => state.scaleway);
 

  const { chatList, searchTerm: searchTermState } = useSelector(
    (state) => state.chat
  );

  const  formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
  
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation(["dashboard", "Preview"]);



  const handleVisible = (nombre) => {
    setTabEffect(nombre)
  };

useEffect(() => {
    if (!contenedorRef?.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nombre = entry.target.getAttribute("name");
            handleVisible(nombre);
          }
        });
      },
      {
        root: contenedorRef.current,
        rootMargin: "-20px 0px 0px 0px",
        threshold: 0.1,
      }
    );

    [incomeRef, documentsRef, contactsRef, assetsRef, teamRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      [incomeRef, documentsRef, contactsRef, assetsRef, teamRef].forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [contenedorRef]);

   const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z",
    Estado: "Todos",
    "Moneda Preferida": "USD",
    "# Transacciones": "Mayor a menos",
    "Ingresos/Costes": "Ingresos de mayor a menor",
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
      name: "Estado",
      label: t("status"),
      subOptions: [
        { display: t("all"), value: "Todos" },
        { display: t("approved"), value: "Aprobados" },
        { display: t("notApproved"), value: "No aprobados" },
        { display: t("paid"), value: "Pagados" },
        { display: t("pending"), value: "Pendiente" },
        { display: t("defaulted"), value: "Incumplidos" },
        { display: t("expired"), value: "Vencido" },
        { display: t("cancelled"), value: "Anulados" },
      ],
    },
    {
      name: "Moneda Preferida",
      label: t("preferredCurrency"),
      subOptions: "currencies",
    },
    {
      name: "# Transacciones",
      label: t("transactions"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menos" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },
    {
      name: "Ingresos/Costes",
      label: t("incomeCosts"),
      subOptions: [
        {
          display: t("incomeHigherToLower"),
          value: "Ingresos de mayor a menor",
        },
        {
          display: t("incomeLowerToHigher"),
          value: "Ingresos de menor a mayor",
        },
        { display: t("costsHigherToLower"), value: "Costes de mayor a menor" },
        { display: t("costsLowerToHigher"), value: "Costes de menor a mayor" },
      ],
    },
    {
      name: "dateFilter",
      label: t("dateFilter"),
      subOptions: [
        { display: t('1month'), value: "1month" },
        { display: t('3month'), value: "3month" },
        { display: t('6month'), value: "6month" },
        { display: t('1year'), value: "1year" },

      ],
    },
    {
      name: "dateOrder",
      label: t("dateOrder"),
      subOptions: [
        { display: t('ascendant'), value: "ascendant" },
        { display: t('falling'), value: "falling" },
      ],
    },
  ];

  const handleSelectCard = (team, type) => {
    if (type === 'asset') {
      dispatch(setFatherNewAsset('home'))
      dispatch(setAsset(team));
      dispatch(setTab(t('assets')))
      navigate(`/admin/assets/${team._id}`, { state: { backgroundLocation: location } })

    } else if (type === 'contact') {
      dispatch(setContact(team));
      dispatch(setTab(t('contacts')))
      dispatch(setFatherNewContact('home'))
      navigate(`/admin/contacts/${team._id}`, { state: { backgroundLocation: location } })
    } else if (type === "agent") {
      navigate(`/admin/chat/${team._id}`)
    } else if (type === "chat") {
      const agentId = agents.agents.filter(agent => agent.name === team.agent)[0]._id
      navigate(`/admin/chat/${agentId}/${team.id}`)
    }
  };



  useEffect(() => {
    dispatch(fetchByMenu({ query: searchQuery }));
    dispatch(getAgents({ search: searchQuery }))
  }, [user, searchQuery]);

  const [resultAssets, setResultAssets] = useState("")

    useEffect(() => {
    const fn = async () => {
      const result = await dispatch(getAllAssets({
        search: searchQuery,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"],
        statusFilter: selectedOption.Estado,
        sortDate: selectedOption.dateFilter,
        sortQuantity: selectedOption.Generado,
        dateOrder: selectedOption.dateOrder
      }));
      setResultAssets(result.payload)
    }
    fn()
  }, [searchQuery, limit, page, selectedOption])

    const [resultContacts, setResultContacts] = useState({})

  useEffect(() => {
    const fn = async () => {
      const result = await dispatch(
        getAllContacts({
          search: searchQuery,
          limit,
          skip: page * limit,
          sortAlpha: selectedOption["Orden Alfabético"],
          statusFilter: selectedOption.Estado,
          sortDate: selectedOption.dateFilter,
          sortQuantity: selectedOption.Generado,
          dateOrder: selectedOption.dateOrder
        })
      );
      setResultContacts(result.payload)
    }
    fn()

  }, [searchQuery, limit, page, selectedOption])

  const filteredContacts = useMemo(() => {
    return contacts || [];
  }, [contacts]);

  const filteredAssets = useMemo(() => {
    return assets || [];
  }, [assets]);

  const agentsChats = useMemo(() => {
    const filteredAgents = agents?.agents || [];
    const filteredChats = chatList || [];

    return [
      ...filteredAgents.map(agent => ({ ...agent, type: 'agent' })).slice(0, 1),
      ...filteredChats.map(chat => ({ ...chat, type: 'chat' })).slice(0, 1)
    ];
  }, [agents, chatList]);
 
  
  const filteredDocuments = useMemo(() => {
    let processedDocuments = homeUserFiles || []; 

    const dateOrder = selectedOption.dateOrder
    const sortAlpha = selectedOption["Orden Alfabético"]
    const sortDate = selectedOption.dateFilter
  
    if(searchQuery){
      processedDocuments = processedDocuments.filter(file => {
        const isFolder = file?.Key?.endsWith("/");
        const fileName = isFolder
          ? file.Key.split("/").slice(-2, -1)[0]
          : file.Key.split("/").pop();
        return fileName?.toLowerCase().includes(searchQuery?.toLowerCase());
      });
    } 

    if (sortDate) {
      const now = new Date();
      let limitDate = new Date();
      switch (sortDate) {
        case "1month": limitDate.setMonth(now.getMonth() - 1); break;
        case "3month": limitDate.setMonth(now.getMonth() - 3); break;
        case "6month": limitDate.setMonth(now.getMonth() - 6); break;
        case "1year": limitDate.setFullYear(now.getFullYear() - 1); break;
        default: limitDate = null;
      }
      if (limitDate) {
        processedDocuments = processedDocuments.filter(item => {
          return item.LastModified && new Date(item.LastModified) >= limitDate;
        });
      }
    }

    if (dateOrder) {
      processedDocuments = [...processedDocuments].sort((a, b) => {
        const aDate = a.LastModified ? new Date(a.LastModified) : new Date(0);
        const bDate = b.LastModified ? new Date(b.LastModified) : new Date(0);

        return dateOrder === "falling" 
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      });
    }

    if (sortAlpha) {
      processedDocuments = [...processedDocuments].sort((a, b) => {
        const getFileName = (item) => {
          const isFolder = item?.Key?.endsWith("/");
          return isFolder ? item.Key.split("/").slice(-2, -1)[0] : item.Key.split("/").pop();
        };
        const aName = getFileName(a)?.toLowerCase() || "";
        const bName = getFileName(b)?.toLowerCase() || "";

        return sortAlpha === "A-Z"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
    }


    return processedDocuments; 
  }, [searchQuery, homeUserFiles, selectedOption]); 
  

    const filteredTeam = useMemo(() => {
    if (searchQuery.length === 0) {
      return [
        {
          id: 'T001',
          status: 'Aprobado',
          my:true
          
        },
        {
          id: 'T002',
          status: 'Aprobado',
          statusColor: 'green',
          email: 'example@email.com',

        },
         {
          id: 'T003',
          status: 'Aprobado',
          statusColor: 'grey',
          email: 'example@email.com'          
        },
        {
          id: 'T004',
          status: 'pending',
          email: 'example@email.com',
        },
      ];
    } else {
      return [];
    }
  }, [searchQuery,selectedOption]);


  const filteredIncomes = useMemo(() => {
    if (searchQuery.length === 0) {
      return [
        {
          title: t('exceptionalExpenses'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "expense",
          type: "pay",
          category: "expense"
        },
        {
          title: t('otherLosses'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "other_management_losses",
          type: "pay",
          category: "expense"
        },
        {
          title: t('socialSecurity'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "company_social_security",
          type: "pay",
          category: "expense"
        },
        {
          title: t('compensations'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "compensations",
          type: "pay",
          category: "expense"
        },
        {
          title: t('salareisAndWages'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "wages_and_salaries",
          type: "pay",
          category: "expense"
        },
        {
          title: t('otherServices'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "other_services",
          type: "pay",
          category: "expense"
        },
        {
          title: t('supplies'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "utilities",
          type: "pay",
          category: "expense"
        },
        {
          title: t('publicRelations'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "advertising_and_pr",
          type: "pay",
          category: "expense"
        },
        {
          title: t('bankingAndSimilarServices'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "banking_services",
          type: "pay",
          category: "expense"
        },
        {
          title: t('insurancePremiums'),
          amount: "0,00€",
          percentage: "0%",
          subCategory: "insurance",
          type: "pay",
          category: "expense"
        },
       
      ];
    } else {
      return [];
    }
  }, [searchQuery, t]);

  const getTabsWithData = () => {
    const tabsWithData = [];

    if (true) {
      tabsWithData.push({
        title: t('documents'),
        value: 'documents'
      });
    }

    if (filteredIncomes.length > 0) {
      tabsWithData.push({
        title: t('incomeAndExpenses'),
        value: 'income'
      });
    }

    if (filteredDocuments?.length > 0) {
      tabsWithData.push({
        title: 'Transacciones',
        value: 'transactions'
      });
    }

    if (filteredContacts.length > 0) {
      tabsWithData.push({
        title: 'Contactos',
        value: 'contacts'
      });
    }

    if (filteredAssets.length > 0) {
      tabsWithData.push({
        title: 'Activos',
        value: 'assets'
      });
    }


    if (agentsChats.length > 0) {
      tabsWithData.push({
        title: t('team'),
        value: 'team'
      });
    }

    return tabsWithData;
  };

  const tabs = getTabsWithData();


  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(tab => tab.value === activeTab)) {
      setActiveTab(tabs[0].value);
    }
    if(activeTab == "contacts") setTotalPagination(resultContacts.total)
    else if(activeTab == "assets") setTotalPagination(resultAssets.total)
  }, [tabs, activeTab]);


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

  const getOrderedSections = () => {
    const sections = [

      { id: 'income', component: <IncomeSection incomes={filteredIncomes} t={t} incomeRef={incomeRef} />, hasData: filteredIncomes.length > 0 },
      { id: 'documents', component: <DocumentsSection handleDownload={handleDownload} user={user} searchQuery={searchQuery}  documents={filteredDocuments} t={t} 
      documentsRef={documentsRef} userFiles={filteredDocuments}/>, hasData: true },

      {
        id: 'contacts', component: <ContactsSection  contactsRef={contactsRef}
          contacts={filteredContacts} t={t} handleSelectCard={handleSelectCard} result={resultContacts} />, hasData: filteredContacts.length > 0 
      },
      {
        id: 'assets', component: <AssetsSection assetsRef={assetsRef}
         result={resultAssets}
          assets={filteredAssets} t={t} handleSelectCard={handleSelectCard} /> , hasData: filteredAssets.length > 0 
      },
       { id: 'team', component: <TeamSection t={t} handleSelectCard={handleSelectCard} teams={filteredTeam} teamRef={teamRef} />, hasData: filteredTeam.length > 0 },
    ];


    const sectionsWithData = sections.filter(section => section.hasData);


    if (sectionsWithData.length === 0) {
      return [];
    }


    const activeIndex = sectionsWithData.findIndex(section => section.id === activeTab);


    if (activeIndex === -1) {
      return sectionsWithData.map(section => section.component);
    }


    const reorderedSections = [
      sectionsWithData[activeIndex],
      ...sectionsWithData.slice(0, activeIndex),
      ...sectionsWithData.slice(activeIndex + 1)
    ];

    return reorderedSections.map(section => section.component);
  };


  const hasAnyData = () => {

    const hasIncomeData = filteredIncomes.length > 0;

    const hasDocumentData = filteredDocuments.length > 0;

    const hasContactData = filteredContacts.length > 0;

    const hasAssetData = filteredAssets.length > 0;

    const hasChatData = agentsChats.length > 0;


    return hasIncomeData || hasDocumentData || hasContactData || hasAssetData || hasChatData;
  };


  

  return (
    <div className={style.LeftPanelContainer}>
      <div className={style.leftPanel}>

         <div className={style.sectionHeaderContainer}>
        <NavigationTabs tabEffect={tabEffect} tabs={tabs} activeTab={activeTab} onTabChange={(value) => {setActiveTab(value)
        setTabEffect(value)
        }} totalPagination={totalPagination || 0}
          limit={limit} setLimit={setLimit} page={page} setPage={setPage} />
        <div className={style.searchContainer}>
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        </div>
      </div>
    

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
         >
          {getOrderedSections()}
        </div>
      </div>
      {/* <ActionButtons /> */}

      {!hasAnyData() && (

        <div className={style.documentsDontFound}>
        <DocumentsDontFound/>
        <span>{t('NoResultsHaveBeenFoundWithTheseSpecifications')}</span>
        </div>
      )}

    </div>
  );
};

export default LeftPanel;