import React, { useState, useEffect } from "react";
import styles from "./AutomateCreateIn.module.css";
import HeaderFormsComponent from "../../../HeadersFormsComponent/HeaderFormsComponent";
import SelectLocation from "../../../SelectLocation/SelectLocation";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ReactComponent as GrayChevron } from "../../../../assets/grayChevron.svg";
import { ReactComponent as SearchWhite } from "../../../../assets/searchWhite.svg";
import { ReactComponent as SearchGreen } from "../../../../assets/SearchIconGreen.svg";
import EditableInput from "../FileInput/Input";

import FileInputNotification from "../FileInput/Notification";
import FileInputImport from "../FileInput/Import";
import SelectInfoToProcess from "../FileInput/selectInfoToProcces/SelectInfoToProcess";
import { promptAutomate } from "@src/actions/automate";
import {
  cleanTryConnectionAutomate,
  setAutomateNameTitleIn,
  setSelectedEmailConnection,
} from "../../../../../../slices/automateSlices";

import ModalAddConnection from "../ModalsAddConnection/ModalAddConnection";

import { ReactComponent as IconMagic } from "../../../../assets/icon-magic.svg";
import { ReactComponent as Gmail } from "../../../../assets/gmailCircle.svg";
import { ReactComponent as GmailEnG } from "../../../../assets/GmailEnG.svg";
import { ReactComponent as MicrosoftLogo } from "../../../../assets/MicrosoftLogo.svg";
import { ReactComponent as CircleOutlook } from "../../../../assets/outlookCircle.svg";
import { ReactComponent as EmailGray } from "../../../../assets/EmailGray.svg";
import { ReactComponent as GoogleDrive } from "../../../../assets/driveCircle.svg";
import { ReactComponent as DropBox } from "../../../../assets/dropboxCircle.svg";
import { ReactComponent as OneDrive } from "../../../../assets/oneDriveCircle.svg";
import { ReactComponent as GmailIcon } from "../../../../assets/gmailwithoutbg.svg";
import { ReactComponent as OutlookIcon } from "../../../../assets/outlook.svg";
import { ReactComponent as EmailIcon } from "../../../../assets/email.svg";
import { ReactComponent as DriveIcon } from "../../../../assets/driveCircle.svg";
import { ReactComponent as DropboxIcon } from "../../../../assets/dropbox-icon.svg";
import { ReactComponent as WhatsAppIcon } from "../../../../assets/whatsappIcon.svg";
import { ReactComponent as SharepointIcon } from "../../../../assets/sharePointCircle.svg";
import { ReactComponent as OneDriveIcon } from "../../../../assets/oneDriveCircle.svg";
import AttachmentNotification from "../AttachmentNotification/AttachmentNotification";
import { useTranslation } from "react-i18next";
import FilterInfoDateKey from "../FilterInfoDateKey/FilterInfoDateKey";
import StatsAutomate from "../StatsAutomate/StatsAutomate";
import ChatAutomate from "./ChatAutomate/ChatAutomate";
import CustomAutomationsWrapper from "../../../CustomAutomationsWrapper/CustomAutomationsWrapper";
import { ReactComponent as FacturagptIcon } from "../../../../assets/logo-facturagpt.svg";

const AutomateCreateIn = ({
  type,
  configuration,
  setConfiguration,
  setShowCategory,
  formAutomateContainerRef,
  iconType,
  IconHeaderModAddConnection,
  typeVariableModal,
  setTypeVariableModal,
  showVariableListModal,
  setShowVariableListModal,
  showVariableModal,
  setShowVariableModal,
  selectedAgent,
  toggleChatSettings,
  setToggleChatSettings
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("AutomatesComponent");
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [authData, setAuthData] = useState([]);
  const [authOutlook, setAuthOutlook] = useState([]);
  const [authDrive, setAuthDrive] = useState([]);
  const [userDevices, setUserDevices] = useState([]);
  const [authOneDrive, setAuthOneDrive] = useState([]);
console.log('userDevices',userDevices)
  const iconComponents = {
    "Gmail": <GmailIcon />,
    "Outlook": <OutlookIcon />,
    "SMTP": <EmailIcon />,
    "Google Drive": <DriveIcon />,
    "Dropbox": <DropboxIcon />,
    "WhatsApp": <WhatsAppIcon />,
    "Sharepoint": <SharepointIcon />,
    "One Drive": <OneDriveIcon />,
    "facturagpt": <FacturagptIcon />,
  };

  const [showContent, setShowContent] = useState({
    info1: false,
  });
  const { workspaces, selectedWorkspaceId } = useSelector(
    (state) => ({
      workspaces: state.workspace.workspaces,
      selectedWorkspaceId: state.workspace.selectedWorkspaceId,
    }),
    shallowEqual
  );

  const [showSelectOutputLocation, setShowSelectOutputLocation] =
    useState(false);

  const [showOutlookModalAddConnection, setShowOutlookModalAddConnection] =
    useState(false);

  const { automate } = useSelector((state) => state);
  const [showGmailModalAddConnection, setShowGmailModalAddConnection] =
    useState(false);

    const [isOpenAutomate, setIsOpenAutomate] = useState(false);



  const handleConfigurationChange = (field, value, index = null, filterIndex = null) => {
    setConfiguration(prev => {
      const updatedLabels = Array.isArray(prev.labels) ? [...prev.labels] : [];

      if (index !== null && updatedLabels[index]) {
        const label = { ...updatedLabels[index] };

        if (filterIndex !== null && Array.isArray(label.filters)) {
          const updatedFilters = [...label.filters];
          const filter = { ...updatedFilters[filterIndex] };

          if (field === "variables") {
            const currentArray = Array.isArray(filter.variables) ? [...filter.variables] : [];
            const exists = currentArray.some(v => v._id === value._id);

            filter.variables = exists
              ? currentArray.filter(v => v._id !== value._id)
              : [...currentArray, value];
          } else {
            filter[field] = value;
          }

          updatedFilters[filterIndex] = filter;
          label.filters = updatedFilters;
        }
        else if (["plainTextLabels", "labels", "variables"].includes(field)) {
          label[field] = value;
        }

        updatedLabels[index] = label;

        return {
          ...prev,
          labels: updatedLabels
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  };

  const OutlookAddConnection = (connection) => {
    const updatedConnections = [
      ...(configuration?.emailConnectionData || []),
      connection,
    ];
    handleConfigurationChange("emailConnectionData", updatedConnections);
    if (!configuration?.selectedEmailConnection) {
      handleConfigurationChange("selectedEmailConnection", connection.email);
    }
  };

  const defaultAddConnection = (connection) => {
    const updatedConnections = [
      ...(configuration?.defaultConnectionData || []),
      connection,
    ];
    handleConfigurationChange("defaultConnectionData", updatedConnections);
    if (!configuration?.selectedDefaultConnection) {
      handleConfigurationChange(
        "selectedDefaultConnection",
        connection.clientId
      );
    }
  };

  


  
  const handleModalAddConnection = (modalType) => {
    if (modalType === "Gmail") {
      setShowGmailModalAddConnection(true);
    } else if (modalType === "Outlook") {
      setShowOutlookModalAddConnection(true);
    }
  };


  const handlePromptAutomateAI = async () => {
    const response = await dispatch(promptAutomate({
      prompt: configuration.inputValue,
    }))


    if (response.payload && response.payload.success) {

      setConfiguration({
        ...configuration,
        ...response.payload.data,
        showContentFilterInfoDateKey: {
          info9: true,
        },
        showContentSelectInfoToProcess: {
          info9: true,
        },
        showContentImport: {
          info1: true,
        },
        showContentCustomNotify: {
          info4: true
        },
        actionExtractionFrequency: true,
      })

    }
  }



  useEffect(() => {
    if (configuration.selectedEmailConnection) {
      dispatch(
        setSelectedEmailConnection(configuration.selectedEmailConnection || "")
      );
    }
    return () => {
      dispatch(setSelectedEmailConnection(""));
    };
  }, [configuration.selectedEmailConnection]);

  useEffect(() => {

    return () => {
      dispatch(cleanTryConnectionAutomate());
    };
  }, []);

  useEffect(() => {
    if (type === "Gmail") {
      if (automate.authData) {
        setAuthData(automate.authData);
      }
    } else if (type === "Outlook") {
      if (automate.authOutlook?.success) {
        const constructorEqualAuthData = automate.authOutlook?.data?.map(
          (ele) => {
            return {
              email: ele.account?.mail,
              userId: ele.userId,
              type: type,
              id: ele._id,
            };
          }
        );
        setAuthOutlook(constructorEqualAuthData);
      }
    } else if (type === "Google Drive") {
      if (automate.authDrive?.success) {
        const constructorEqualAuthData = automate.authDrive?.data?.map(
          (ele) => {
            return {
              email: ele.email,
              userId: ele.userId,
              type: type,
              id: ele._id,
            };
          }
        );
        setAuthDrive(constructorEqualAuthData);
      }
    } else if (type === "WhatsApp") {
      if (automate.userDevices?.success) {
        const devices = automate.userDevices?.devices.map((ele) => {
          return {
            email: ele.deviceId,
            userId: ele.userId,
            type: ele.type,
            id: ele.id,
          };
        });
        setUserDevices(devices);
      }
    } else if (type === "One Drive") {
      if (automate.authOneDrive?.success) {

        const constructorEqualAuthDataOneDrive = automate.authOneDrive?.data?.map(
          (ele) => {
            return {
              email: ele.account?.mail,
              userId: ele.userId,
              type: type,
              id: ele._id,
            };
          }
        );
        setAuthOneDrive(constructorEqualAuthDataOneDrive);
      }
    } else {
      setAuthData([]);
      setAuthOutlook([]);
      setUserDevices([]);
    }
  }, [
    automate.authData,
    automate.authOutlook?.success,
    automate.authDrive?.data,
    automate.userDevices,
    type,
  ]);

  useEffect(() => {
    if (configuration.id) {
      dispatch(setAutomateNameTitleIn(`${t("modifyYourInvoices")} ${type}`));
    } else {
      dispatch(setAutomateNameTitleIn(`${t("addYourInvoices")} ${type}`));
    }
  }, [type, configuration.id]);


  return (
    <div style={{
      height: toggleChatSettings == 'chat' && '90%',
    }}>
      {automate.tryConnectionAutomate.success && (
        <AttachmentNotification
          attachments={automate.tryConnectionAutomate.data}
          type={type}
          automationId={configuration.id}
        />
      )}
      <HeaderFormsComponent
        selectedEmailConnection={
          configuration?.selectedEmailConnection?.email || ""
        }
        setToggleChatSettings={setToggleChatSettings}
        toggleChatSettings={toggleChatSettings}
        setSelectedEmailConnection={(value) =>
          handleConfigurationChange("selectedEmailConnection", value)
        }
        emailConnections={
          type === "Gmail"
            ? authData
            : type === "Outlook"
              ? authOutlook
              : type === "Google Drive"
                ? authDrive
                : type === "WhatsApp"
                  ? userDevices
                  : type === "One Drive"
                    ? authOneDrive
                    : type === "facturagpt"
                      ? workspaces.map(workspace => ({
                        email: workspace.title,
                        userId: workspace.createdBy,
                        type: 'facturagpt',
                        id: workspace._id,
                      }))
                    : []
        }
        action={() => {
          if (type === "WhatsApp") {
            setShowCategory("qr");
          } else {
            setShowAddConnection(true);
          }
        }}
        icon={iconComponents[type]}
        handleConfigurationChange={handleConfigurationChange}
        placeholder={
          authData?.length > 0 || authOutlook?.length > 0
            ? t("selectAnAccount")
            : t("notYetAdded")
        }
        type={type}
        CustomDropdownOptionStyles={{
          maxWidth: "250px",
          width: "unset",
        }}
        setIsOpenAutomate={setIsOpenAutomate}
        isOpenAutomate={isOpenAutomate}
      />
      {toggleChatSettings == 'setting' ? (
        <div className={styles.automateContainer}>

          <StatsAutomate />

          <div className={styles.inputContainer}>

            {configuration?.inputValue?.split(' ').length > 3 && (
              <button
                className={styles.iconMagic}
                onClick={handlePromptAutomateAI}>
                <IconMagic />
              </button>
            )}
          </div>


          <FilterInfoDateKey
                configuration={configuration}
                handleConfigurationChange={handleConfigurationChange}
                formAutomateContainerRef={formAutomateContainerRef}
                type={type}
              />

          {/* <FilterInfoDateKey
          configuration={configuration}
          handleConfigurationChange={handleConfigurationChange}
          formAutomateContainerRef={formAutomateContainerRef}
          type={type}
        /> */}

          <SelectInfoToProcess
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
            setShowSelectOutputLocation={setShowSelectOutputLocation}
            formAutomateContainerRef={formAutomateContainerRef}
            type={type}
            setShowVariableModal={setShowVariableModal}
            setTypeVariableModal={setTypeVariableModal}
          />

          {/* <FileInputImport
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
            setShowSelectOutputLocation={setShowSelectOutputLocation}
            setShowCategory={setShowCategory}
            formAutomateContainerRef={formAutomateContainerRef}
            typeVariableModal={typeVariableModal}
            setTypeVariableModal={setTypeVariableModal}
            showVariableListModal={showVariableListModal}
            setShowVariableListModal={setShowVariableListModal}
            showVariableModal={showVariableModal}
            setShowVariableModal={setShowVariableModal}

          /> */}

          {/* <CustomAutomationsWrapper
            Icon={<SearchWhite />}
            showContent={showContent.info1}
          >
            <div
              className={styles.infoContainerWrapper}
              onClick={() => setShowContent({ ...showContent, info1: !showContent.info1 })}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showContent.info1 && <SearchGreen />}
                <div className={styles.infoContainer}>
                  <div>{t("configureKeyData")}</div>
                  <span>{t("configureFiltersToExtractKey")}</span>
                </div>
              </div>
              <GrayChevron
                style={{
                  transform: showContent.info1 ? "rotate(180deg)" : "",
                  transition: "transform 0.3s ease-in-out",
                  fill: '#71717A'
                }}
              />
            </div>
            <div
              className={` ${styles.contentContainer} ${showContent.info1 ? styles.active : styles.disabled}`}
              style={{
                display: showContent.info1 ? "flex" : "none",
                flexDirection: "column",
              }}
            >

              <FilterInfoDateKey
                configuration={configuration}
                handleConfigurationChange={handleConfigurationChange}
                formAutomateContainerRef={formAutomateContainerRef}
                type={type}
              />
            </div>
          </CustomAutomationsWrapper> */}
          {/* <FileInputNotification
          configuration={configuration}
          handleConfigurationChange={handleConfigurationChange}
          formAutomateContainerRef={formAutomateContainerRef}
          setShowCategory={setShowCategory}
          setShowGmailModalAddConnection={handleModalAddConnection}
        /> */}
        </div>
      ) : (
        <ChatAutomate type={type} configuration={configuration} />
      )}

      {showSelectOutputLocation && (
        <SelectLocation
          onClose={() => setShowSelectOutputLocation(false)}
          pickLocation={(location) => {
            handleConfigurationChange("folderLocation", location);
          }}
          emailListColab={(emailListColab) => {
            handleConfigurationChange("emailListColab", emailListColab);
          }}
          configuration={configuration}
        />
      )}
      {showAddConnection &&
        (() => {
          switch (type) {
            case "Gmail":
              return (
                <ModalAddConnection
                  type={type}
                  IconHeader={Gmail}
                  IconLogin={GmailEnG}
                  textLogin={t("signinWithGoogle")}
                  close={() => setShowAddConnection(false)}
                  selectedAgent={selectedAgent}
                />
              );
            case "SMTP":
              return (
                <ModalAddConnection
                  type={type}
                  IconHeader={CircleOutlook}
                  close={() => setShowAddConnection(false)}
                  addType={t("imapSmtp")}
                  selectedAgent={selectedAgent}
                />
              );
            case "Outlook":
              return (
                <ModalAddConnection
                  type={type}
                  IconHeader={CircleOutlook}
                  IconLogin={MicrosoftLogo}
                  textLogin={t("signinWithMicrosoft")}
                  IconLogin2={EmailGray}
                  TextLogin2={t("emailConnectionImapSmtp")}
                  close={() => setShowAddConnection(false)}
                  addType={t("imapSmtp")}
                  selectedAgent={selectedAgent}
                />
              );
            case "One Drive":
              return (
                <ModalAddConnection
                  type={type}
                  IconHeader={OneDrive}
                  IconLogin={MicrosoftLogo}
                  textLogin={t("signinWithMicrosoft")}
                  close={() => setShowAddConnection(false)}
                  addType={t("imapSmtp")}
                  selectedAgent={selectedAgent}
                />
              );
            case "Google Drive":
              return (
                <ModalAddConnection
                  type={type}
                  IconHeader={GoogleDrive}
                  IconLogin={GoogleDrive}
                  textLogin={t("signinWithGoogleDrive")}
                  close={() => setShowAddConnection(false)}
                  selectedAgent={selectedAgent}
                />
              );
            case "Dropbox":
              return (
                <ModalAddConnection
                  type={type}
                  IconHeader={DropBox}
                  textLogin={t("signinWithDropbox")}
                  close={() => setShowAddConnection(false)}
                  selectedAgent={selectedAgent}
                />
              );
            default:
              return (
                <ModalAddConnection
                  type={type}
                  IconHeader={IconHeaderModAddConnection}
                  textLogin={t("signinWithDropbox")}
                  close={() => setShowAddConnection(false)}
                  selectedAgent={selectedAgent}
                />
              );
          }
        })()}

      {showGmailModalAddConnection && (
        <ModalAddConnection
          type={"Gmail"}
          IconHeader={Gmail}
          IconLogin={GmailEnG}
          textLogin={t("signinWithGoogle")}
          close={() => setShowGmailModalAddConnection(false)}
          selectedAgent={selectedAgent}
        />
      )}
      {showOutlookModalAddConnection && (
        <ModalAddConnection
          type={"Outlook"}
          IconHeader={CircleOutlook}
          IconLogin={MicrosoftLogo}
          textLogin={t("signinWithMicrosoft")}
          IconLogin2={EmailGray}
          TextLogin2={t("emailConnectionImapSmtp")}
          close={() => setShowOutlookModalAddConnection(false)}
          addType={t("imapSmtp")}
          selectedAgent={selectedAgent}
        />
      )}
    </div>
  );
};

export default AutomateCreateIn;
