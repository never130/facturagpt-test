import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./SelectLocation.module.css";
import folderIcon from "../../assets/S3/folderIcon.svg";
import curvedLine from "../../assets/S3/curvedLine.svg";
import CustomCheckboxWithLabel from "../CustomCheckboxWithLabel/CustomCheckboxWithLabel";
import CreateFolderModal from "../CreateFolderModal/CreateFolderModal";
import blackChevron from "../../assets/blackChevron.svg";
import HeaderCard from "../HeaderCard/HeaderCard";
import { ReactComponent as HouseContainer } from "../../assets/blackHouse.svg";
import FolderClosed from "../../assets/folderClosed.svg";
import Button from "../Button/Button";

import { setNotification } from "@src/slices/notificationsSlices";
import { getUserFiles } from "../../../../actions/scaleway";
import useCloseOnEsc from "../../../../utils/useClose";
import { useTranslation } from "react-i18next";
import { handleFileUpload } from "../../../../utils/pdfUtils";
import { setShowModal } from "../../../../slices/userSlices";
import { setFromHome } from "../../../../slices/scalewaySlices";

const SelectLocation = ({
  onClose,
  pickLocation = () => { },
  state,
  setSelectedLocationNew,
  selectedLocationNew,
  showNewFolder = true,
  emailListColab,
  configuration,
  setIsLoading,
  existCreateFolder,
  setFatherLocationModal,
  fatherLocationModal,
  uploadFile=true,
  
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("InvoiceForm");

  const { user } = useSelector((state) => state.user);
  const { userFiles } = useSelector((state) => state.scaleway);
  
  const [isClosing, setIsClosing] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState(new Set());
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const { workspaceSelected } = useSelector((state) => state.workspace);
  const [selectedLocation, setSelectedLocation] = useState(workspaceSelected?._id + "/");


  const buildFolderStructure = (files) => {
    const root = {};
    files?.forEach((file) => {
      const parts = file.Key.split("/").filter(Boolean);
      let current = root;
      parts?.forEach((part, index) => {
        if (!current[part]) {
          current[part] = { __files: [], __folders: {} };
        }
        if (index === parts.length - 1 && !file.Key.endsWith("/")) {
          current[part].__files.push(file);
        }
        current = current[part].__folders;
      });
    });
    return root;
  };

  const folderStructure = buildFolderStructure(
    userFiles?.filter((file) => file.Key.endsWith("/"))
  );

  const handleClose = () => {
     setFatherLocationModal && setFatherLocationModal(false)
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const toggleFolder = (path) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };



  
  const renderFolders = (folders, path = "", depth = 0) => {
    if (!folderStructure || Object.keys(folderStructure).length === 0 && !showNewFolder) {
      return (<div
        onClick={() => {
          existCreateFolder ? handleClose() :
            setShowCreateFolderModal(true);
        }}
        className={styles.newFolderButton}
      >
        {t('newFolder')}
      </div>)
    }

    const renderFolderName = (folderName) => {
      if(folderName == "S3"){
        return "S3"
      }
      return folderName
    }

    return Object.keys(folders).map((folderName) => {
      const currentPath = `${path}${folderName}/`;
      const isExpanded = expandedPaths.has(currentPath) || currentPath === "";
      const subFolders = folders[folderName].__folders;
      const hasMultipleSubFolders = Object.keys(subFolders).length > 1;
      const shouldExpand = path === "" || isExpanded;

      return (
        <div
          key={currentPath}
          className={`${styles.folderItem} ${shouldExpand ? styles.expanded : ""}`}
        >
          <div
            style={{
              backgroundColor:
                currentPath === `${workspaceSelected?._id}/` ? "#F4F4F4" : "#fff",
            }}
            className={styles.folderInnerContainer}
            onClick={() => {
              toggleFolder(currentPath);
            }}
          >
            {subFolders &&
              currentPath !== `${workspaceSelected?._id}/` &&
              Object.keys(subFolders).length > 0 && (
                <img
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  className={styles.chevron}
                  src={blackChevron}
                  alt="Open Folder"
                />
              )}
            <CustomCheckboxWithLabel
              checked={selectedLocation === currentPath}
              onChange={(e) => {
                e.stopPropagation();
                setSelectedLocation((prev) =>
                  prev === currentPath && currentPath !== workspaceSelected?._id + "/"
                    ? `${workspaceSelected?._id}/`
                    : currentPath
                );
              }}
            />
            <div
              style={{
                marginLeft: depth * 40 - 13,
              }}
              className={styles.folderHeader}
            >
              {depth > 0 && (
                <img
                  className={styles.curvedLine}
                  src={curvedLine}
                  alt="Curved Line"
                />
              )}
              {path == "" ? (
                <HouseContainer />
              ) : isExpanded ? (
                <img src={folderIcon} alt="Folder Icon" />
              ) : (
                <img src={FolderClosed} alt="Folder Icon" />
              )}

              <span>
                 {folderName === `${workspaceSelected?._id}` ? "/Inicio" : `/${currentPath?.split("/")?.slice(1,2)?.join("") || "Not found"}`}
              </span>
            </div>
          </div>
          {(path === "" || isExpanded) && (
            <div className={styles.subFolders}>
              {hasMultipleSubFolders && (
                <div
                  style={{
                    left: depth * 40 + 72,
                  }}
                  className={styles.verticalLine}
                />
              )}
              {renderFolders(
                folders[folderName].__folders,
                currentPath,
                depth + 1
              )}
            </div>
          )}
        </div>
      );
    });
  };

  const handleUploadFile = async (location) => {
    try {
      setIsLoading(true)

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".pdf,.jpg,.jpeg,.png,.webp";

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;


        dispatch(setNotification({
          id: 'is-loading',
          type: 'folder',
          text: 'notification #1'
        }));

        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const objectUrl = URL.createObjectURL(file);

   
        const userLocalStorage = localStorage.getItem("user");
        const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;

       
        await handleFileUpload(file, location,"","","","",selectedLocation);
        await dispatch(getUserFiles({ userId: user.id, token: parsedUser.accessToken }));
        dispatch(setFromHome(true))
          await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
          dispatch(setFromHome(false))
        img.src = objectUrl;

        setIsLoading(false);

        dispatch(setNotification({
          id: 'is-completed',
          type: 'folder',
          text: 'notification #1',
          fileName:file
        }));
      };

      fileInput.click();
    } catch (error) {
      console.error("Error in handleUploadFile:", error);
    }
  };
  
  useCloseOnEsc(onClose)





  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
      className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ""}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`${styles.modalContent} ${isClosing ? styles.scaleDown : ""}`}
      >
        <HeaderCard title={t('ubication')} setState={handleClose}>
          <Button type="white" action={handleClose}>
            {t('cancel')}
          </Button>
          <Button
            action={() => {
              if(fatherLocationModal){
                setSelectedLocationNew && setSelectedLocationNew(selectedLocation);
                dispatch(setShowModal("createFolder"))
                setFatherLocationModal && setFatherLocationModal(false)
              }else{
                pickLocation(selectedLocation);
              setSelectedLocationNew && setSelectedLocationNew(selectedLocation);
              uploadFile && handleUploadFile(selectedLocation) 
              handleClose();
              }
            }}
          >
            {t('select')}
          </Button>
        </HeaderCard>
        <div className={styles.contentContainer}>
          <div className={styles.content}>

            {renderFolders(folderStructure)}
            {showNewFolder && (
              <div
                onClick={() => {
                  setShowCreateFolderModal(true);
                }}
                className={styles.newFolderButton}
              >
                {t('newFolder')}
              </div>
            )}
          </div>
        </div>
      </div>
      {showCreateFolderModal && (
        <CreateFolderModal
          onClose={() => setShowCreateFolderModal(false)}
          location={selectedLocation}
          createFile={"dont show"}
          emailListColab={emailListColab}
          configuration={configuration}
        />
      )}
    </div>
  );
};

export default SelectLocation;
