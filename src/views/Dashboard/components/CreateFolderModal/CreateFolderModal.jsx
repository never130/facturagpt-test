import React, { useEffect, useState } from "react";
import styles from "./CreateFolderModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { createFolder, getUserFiles } from "../../../../actions/scaleway";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import InputComponent from "../InputComponent/InputComponent";
import SearchSVG from "../Automate/svgs/SearchSVG";
import CustomAutomationsWrapper from "../CustomAutomationsWrapper/CustomAutomationsWrapper";
import OptionsSwitchComponent from "../OptionsSwichComponent/OptionsSwitchComponent";
import DeleteButton from "../DeleteButton/DeleteButton";
import { ReactComponent as TwoPeople } from "../../assets/twoPeopleWhite.svg";
import useCloseOnEsc from "../../../../utils/useClose";
import { useTranslation } from "react-i18next";
import { setShowModal } from "../../../../slices/userSlices";
const CreateFolderModal = ({
  onClose,
  location,
  setShowLocationModal,
  setFatherLocationModal,
  createFile,
  emailListColab,
  configuration,
  setSelectedLocationNew
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { createFolderLoading ,currentPath} = useSelector((state) => state.scaleway);
  const { workspaceSelected } = useSelector((state) => state.workspace);
  const { t } = useTranslation("navbarAdmin");
  
  const userLocalStorage = localStorage.getItem("user");
    const parsedUser = userLocalStorage
      ? JSON.parse(userLocalStorage)
      : null;


  const [isClosing, setIsClosing] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderError, setFolderError] = useState("");

  const [addColab, setAddColab] = useState(false);

  const [emailInput, setEmailInput] = useState(""); 
  const [emailList, setEmailList] = useState([]); 
  const [emailError, setEmailError] = useState(""); 

  const validateFolderName = (name) => {
    if (!name) {
      setFolderError(t("folderNameRequired"));
      return false;
    }
    setFolderError("");
    return true;
  };

  useEffect(() => {
    setEmailList(configuration?.emailListColab);
  }, [configuration?.emailListColab]);

  const handleCreateFolder = async () => {
    if (!validateFolderName(folderName)) return;

    const fullPath = location.endsWith("/")
      ? `${location}${folderName}`
      : `${location}/${folderName}`;

    try {
     await  dispatch(createFolder({ folderPath: fullPath }));
     
      await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken,currentPath })).unwrap();
      
      setFolderName("");
      handleClose();
    } catch (error) {
      console.error("Error creating folder:", error);
      setFolderError(t("errorCreatingFolder"));
    }
  };

  ("emailList", emailList);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleAddEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput)) {
      setEmailError(t("enterValidEmailAddress"));
      return;
    }

    if (emailList.includes(emailInput)) {
      setEmailError(t("emailAlreadyOnTheList"));
      return;
    }

    setEmailList([...emailList, emailInput]);
    emailListColab([...emailList, emailInput]);
    setEmailInput("");
    setEmailError(""); 
  };

  const handleDeleteEmail = (index) => {
    const updatedList = emailList.filter((_, i) => i !== index);
    setEmailList(updatedList);
    emailListColab(updatedList);
  };
  useCloseOnEsc(onClose);
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
        <HeaderCard title={t("newFolder")} setState={handleClose}>
          <Button type="white" action={handleClose}>
            {t("cancel")}
          </Button>
          <Button
            action={() => {
              handleCreateFolder();
              !createFolderLoading && handleClose();
              setSelectedLocationNew && setSelectedLocationNew( workspaceSelected?._id + "/");
            }}
          >
            {createFolderLoading ? t("creating") : t("save")}
          </Button>
        </HeaderCard>
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.contentInnerContainer}>
              <span>{t("folderName")}</span>
              <input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                type="text"
                placeholder={t("name")}
                className={styles.input}
              />
              {folderError && (
                <div className={styles.errorMessage}>{folderError}</div>
              )}
            </div>

            <div className={styles.contentInnerContainer}>
              <span className={styles.titleContentInput}>{t("ubication")}</span>
              <InputComponent
                readOnly={true}
                value={location.replace(workspaceSelected?._id, "Inicio")}
                textButton={
                  createFile === "dont show" ? "" : t("selectUbication")
                }
                placeholder="/Inicio"
                icon={<SearchSVG />}
                action={() => {
                  dispatch(setShowModal("location"))
                  setFatherLocationModal("folder")
                }}
              />
            </div>
            {false && (
              <CustomAutomationsWrapper
                Icon={<TwoPeople />}
                showContent={addColab}
              >
                <div className={styles.infoContainerWrapper}>
                  <div className={styles.infoContainer}>
                    <div>{t('addColaborators')}</div>
                  </div>

                  <OptionsSwitchComponent
                    border={"none"}
                    marginLeft={"auto"}
                    isChecked={addColab || false}
                    setIsChecked={setAddColab}
                  />
                </div>
                <div
                  className={`${styles.contentContainerWrapp} ${
                    addColab ? styles.active : styles.disabled
                  }`}
                >
                  <input
                    type="text"
                    placeholder="johnDoe@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <div className={styles.inviteButton} onClick={handleAddEmail}>
                    {t('invite')}
                  </div>
                </div>
                {emailError && (
                  <div className={styles.errorMessage}>{emailError}</div>
                )}
                <div className={styles.emailList}>
                  {emailList?.map((email, index) => (
                    <div key={index} className={styles.emailItem}>
                      <div className={styles.nameEmail}>
                        <div className={styles.logo}>{email.slice(0, 1)}</div>
                        <span>{email}</span>
                      </div>

                      <DeleteButton
                        action={(e) => {
                          e.stopPropagation();
                          handleDeleteEmail(index);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CustomAutomationsWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
