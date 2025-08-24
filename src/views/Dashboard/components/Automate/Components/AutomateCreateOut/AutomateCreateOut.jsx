import React, { useEffect, useRef, useState } from "react";
import styles from "./AutomateCreateOut.module.css";
import { ReactComponent as GmailEnG } from "../../../../assets/GmailEnG.svg";
import { ReactComponent as Gmail } from "../../../../assets/gmailCircle.svg";
import { ReactComponent as MicrosoftLogo } from "../../../../assets/MicrosoftLogo.svg";
import { ReactComponent as CircleOutlook } from "../../../../assets/outlookCircle.svg";
import { ReactComponent as EmailGray } from "../../../../assets/EmailGray.svg";
import EditableInput from "../FileInput/Input";
import HeaderFormsComponent from "../../../HeadersFormsComponent/HeaderFormsComponent";

import ConfigDataKey from "../SectionsAutomate/selectInfoToProcces/ConfigDataKey";
import DataToSync from "../DataToSync/DataToSync";
import SaveProcessDocument from "../../../SaveProcessDocument/SaveProcessDocument";
import CustomNotify from "../SectionsAutomate/CustomNotify/CustomNotify";
import CustomAgent from "../SectionsAutomate/CustomAgent/CustomAgent";

import SelectLocation from "../../../SelectLocation/SelectLocation";
import OutDefaultModalAddConnection from "../ModalsAddConnection/OutDefaultModalAddConnection";
import {
  cleanTryConnectionAutomate,
  setAutomateNameTitleOut,
  setSelectedEmailConnection,
  setShowEndPointVariables,
  setVariableSelectedToEnpoint,
} from "../../../../../../slices/automateSlices";
import { useDispatch, useSelector } from "react-redux";
import ModalAddConnection from "../ModalsAddConnection/ModalAddConnection";
import AddConnectionModal from "../AddConenctionModal/AddConnectionModal";
import FTPModalAddConnection from "../ModalsAddConnection/FTPModalAddConnection";
import { useTranslation } from "react-i18next";
import LeyAntifraudeModalAddConnection from "../ModalsAddConnection/LeyAntifraudeModalAddConnection";
import AttachmentNotificationOut from "../AttachmentNotificationOut/AttachmentNotificationOut";

import { ReactComponent as TelematelIcon } from "../../../../assets/telematel.svg";
import { ReactComponent as GoogleSheetsIcon } from "../../../../assets/excelCircle.svg";
import { ReactComponent as XMLIcon } from "../../../../assets/XMLBig.svg";

import { ReactComponent as OdooIcon } from "../../../../assets/OdooCircleNew.svg";
import { ReactComponent as WoltersIcon } from "../../../../assets/wolters-icon.svg";
import { ReactComponent as AgencyIcon } from "../../../../assets/agenciaTributariaCircle.svg";
import { ReactComponent as WhatsAppIcon } from "../../../../assets/whatsappIcon.svg";
import { ReactComponent as FTPIcon } from "../../../../assets/WhiteFTPCircle.svg";
import KIcon from "../../../../assets/KIcon.svg";
import { ReactComponent as HoldedIcon } from "../../../../assets/WhiteHoldedCircle.svg";
import { ReactComponent as EsPublico } from "../../../../assets/gestionaEsPubliconNewLogoCircle.svg";
import VariableModal from "../../../VariableModal/VariableModal";
import ChatAutomate from "../AutomateCreateIn/ChatAutomate/ChatAutomate";
import SearchIconWithIcon from "../../../SearchIconWithIcon/SearchIconWithIcon";
import FiltersDropdownContainer from "../../../FiltersDropdownContainer/FiltersDropdownContainer";


const AutomateCreateOut = ({
  type,
  configuration,
  setConfiguration,
  typeContent,
  setShowCategory,
  formAutomateContainerRef,
  iconType,
  IconHeaderModAddConnection,
  close,
  setIsModalAutomate,
  setHideAutomate,
  setQuestion,
  selectedAgent,
  toggleChatSettings,
  setToggleChatSettings,
  showVariableModal,
  setShowVariableModal,
  setTypeVariableModal,
  typeVariableModal,
  setRoleAutomate,
  showSections
}) => {
  const [t] = useTranslation("AutomatesComponent");

  const {
    showEndPointVariables,
    allVariablesFromEnPointUse,
    authTelematel,
    testConnectionFilesOut,
  } = useSelector((state) => state.automate);


  const [showAddConnection, setShowAddConnection] = useState(false);
  const [showVariableListModal, setShowVariableListModal] = useState(false);
  const [showSelectOutputLocation, setShowSelectOutputLocation] =
    useState(false);
  const [dataAddConnection, setDataAddConnection] = useState(null);
  const [authDataTelametel, setAuthDataTelametel] = useState([]);
  const [searchEndpoint, setSearchEndpoint] = useState('')

  const [allVariablesFromEnPoint, setAllVariablesFromEnPoint] = useState([]);
  const [showGmailModalAddConnection, setShowGmailModalAddConnection] =
    useState(false);
  const [showOutlookModalAddConnection, setShowOutlookModalAddConnection] =
    useState(false);

  const [showContent, setShowContent] = useState({
    info1: false,
    info2: false,
    info3: false,
    info4: false,
    info5: false,
    info6: false,
    info7: false,
    info8: false,
    info9: false,
  });

  const iconComponents = {
    "Telematel": <TelematelIcon />,
    "Google Sheets": <GoogleSheetsIcon />,
    "XML": <XMLIcon />,
    "Odoo": <OdooIcon />,
    "Wolters": <WoltersIcon />,
    "Notificaciones Whatsapp": <WhatsAppIcon />,
    "Agencia Tributaria": <AgencyIcon />,
    "FTP": <FTPIcon />,
    "Holded": <HoldedIcon />,
    "esPúblico Gestiona": <EsPublico />,
  };

  const filteredVariables = allVariablesFromEnPoint.filter((variable) =>
    variable.title.toLowerCase().includes(searchEndpoint.toLowerCase())
  );

  const handleConfigurationChange = (field, value, index = null, filterIndex = null) => {
    setConfiguration(prev => {
      const updatedLabels = Array.isArray(prev.labels) ? [...prev.labels] : [];

      if (index !== null && updatedLabels[index]) {
        const label = { ...updatedLabels[index] };

        if (filterIndex !== null && Array.isArray(label.filters)) {
          const updatedFilters = [...label.filters];
          const filter = { ...updatedFilters[filterIndex] };

          // ✅ Soporte toggle para 'variables' en filtros
          if (field === "variables") {
            const currentArray = Array.isArray(filter.variables) ? [...filter.variables] : [];
            const exists = currentArray.some(v => v._id === value._id);

            filter.variables = exists
              ? currentArray.filter(v => v._id !== value._id)
              : [...currentArray, value];
          } else {
            // Resto de campos normales en filtros
            filter[field] = value;
          }

          updatedFilters[filterIndex] = filter;
          label.filters = updatedFilters;
        }
        // ✅ Soporte original para campos directos en label
        else if (["plainTextLabels", "labels", "variables"].includes(field)) {
          label[field] = value;
        }

        updatedLabels[index] = label;

        return {
          ...prev,
          labels: updatedLabels
        };
      }

      // ✅ Fallback global
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const addConnection = (connection) => {
    handleConfigurationChange(`connectionData${type}`, connection);
    setDataAddConnection(connection);
  };


  const handleModalAddConnection = (modalType) => {
    if (modalType === "Gmail") {
      setShowGmailModalAddConnection(true);
    } else if (modalType === "Outlook") {
      setShowOutlookModalAddConnection(true);
    }
  };


  const searchInputRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z",
    statusLastInvoice: "all",
    tokenPaid: 'Mayor a menor'

  });

  const [lastSelectedOption, setLastSelectedOption] = useState(null)

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
      name: "statusLastInvoice",
      label: t("statusLastInvoice"),
      subOptions: [
        { display: t("all"), value: "all" },
        { display: t("succeeded"), value: "succeeded" },
        { display: t("failed"), value: "failed" },
      ],
    },

    {
      name: "tokenPaid",
      label: t("tokenPaid"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menor" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },


  ];

  const [selectedAutomates, setSelectedAutomates] = useState([])


  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(cleanTryConnectionAutomate());
    };
  }, [type]);

  useEffect(() => {
    if (type === "Telematel") {
      if (authTelematel?.success) {
        const constructorEqualAuthDataTelametel = authTelematel?.data?.map(
          (ele) => {
            return {
              email: ele.host,
              userId: ele.userId,
              type: type,
              id: ele._id,
            };
          }
        );
        setAuthDataTelametel(constructorEqualAuthDataTelametel);
      }
    }
  }, [authTelematel]);

  useEffect(() => {
    if (
      configuration?.showContentCustomNotify &&
      JSON.stringify(configuration?.showContentCustomNotify) !==
      JSON.stringify(showContent)
    ) {
      setShowContent(configuration?.showContentCustomNotify);
    } else if (
      configuration?.showContentCustomNotify === null ||
      configuration?.showContentCustomNotify === "" ||
      configuration?.showContentCustomNotify === undefined
    ) {
      setShowContent({
        info1: false,
        info2: false,
        info3: false,
        info4: false,
        info5: false,
        info6: false,
        info7: false,
        info8: false,
        info9: false,
      });
    }
  }, [configuration]);

  useEffect(() => {
    if (configuration.id) {
      dispatch(setAutomateNameTitleOut(`${t("modifyYour")} ${type}`));
    } else {
      dispatch(setAutomateNameTitleOut(`${t("addYour")} ${type}`));
    }
  }, [type, configuration.id]);

  useEffect(() => {
    setAllVariablesFromEnPoint(allVariablesFromEnPointUse);
  }, [allVariablesFromEnPointUse]);

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




  return (
    <div style={{
      height: toggleChatSettings == 'chat' && '90%',
    }}>
      {testConnectionFilesOut.success && (
        <AttachmentNotificationOut
          attachments={testConnectionFilesOut.data}
          type={type}
          automationId={configuration.id}
        />
      )}
      <HeaderFormsComponent
        selectedEmailConnection={configuration?.selectedEmailConnection}
        setSelectedEmailConnection={(value) =>
          handleConfigurationChange("selectedEmailConnection", value)
        }
        emailConnections={(
          configuration?.emailConnectionData ||
          authDataTelametel ||
          []
        ).map((connection) => connection.email)}
        action={() => setShowAddConnection(true)}
        icon={iconComponents[type]}
        type={type}
        handleConfigurationChange={handleConfigurationChange}
        CustomDropdownOptionStyles={{
          maxWidth: "250px",
          width: "unset",
        }}
        toggleChatSettings={toggleChatSettings}
        setToggleChatSettings={setToggleChatSettings}
      />

      {toggleChatSettings == 'setting' ? (
        <>
        
          <ConfigDataKey
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
            setShowSelectOutputLocation={setShowSelectOutputLocation}
            typeContent={typeContent}
            type={type}
            formAutomateContainerRef={formAutomateContainerRef}
            close={close}
            setIsModalAutomate={setIsModalAutomate}
            setHideAutomate={setHideAutomate}
            typeVariableModal={typeVariableModal}
            setTypeVariableModal={setTypeVariableModal}
            showVariableListModal={showVariableListModal}
            setShowVariableListModal={setShowVariableListModal}
            showVariableModal={showVariableModal}
            setShowVariableModal={setShowVariableModal}
            setRoleAutomate={setRoleAutomate}
            setSelectedAutomates={setSelectedAutomates}
            selectedAutomates={selectedAutomates}
            onlyShowConfigDataKey={true}
          />
          <DataToSync
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
            formAutomateContainerRef={formAutomateContainerRef}
            typeContent={typeContent}
            type={type}
            setShowVariableModal={setShowVariableModal}
            setTypeVariableModal={setTypeVariableModal}
          />
          {/* <SaveProcessDocument
        configuration={configuration}
        handleConfigurationChange={handleConfigurationChange}
        setShowCategory={setShowCategory}
        formAutomateContainerRef={formAutomateContainerRef}
        typeVariableModal={typeVariableModal}
        setTypeVariableModal={setTypeVariableModal}
        showVariableListModal={showVariableListModal}
        setShowVariableListModal={setShowVariableListModal}
        showVariableModal={showVariableModal}
        setShowVariableModal={setShowVariableModal}
      />

      <CustomNotify
        showContent={showContent.info7}
        handleConfigurationChange={handleConfigurationChange}
        configuration={configuration}
        formAutomateContainerRef={formAutomateContainerRef}
        setShowCategory={setShowCategory}
        setShowGmailModalAddConnection={handleModalAddConnection}
      />
      
      <CustomAgent 
        configuration={configuration}
        handleConfigurationChange={handleConfigurationChange}
        formAutomateContainerRef={formAutomateContainerRef}
        setShowCategory={setShowCategory}
        setShowGmailModalAddConnection={handleModalAddConnection}
      /> */}

        </>
      ) : (
        <ChatAutomate type={type} configuration={configuration} />
      )}



      {showSelectOutputLocation && (
        <SelectLocation
          onClose={() => setShowSelectOutputLocation(false)}
          pickLocation={(location) => {
            handleConfigurationChange("folderLocation", location);
          }}
        />
      )}
      
      {showAddConnection && (() => {
        const sharedProps = {
          close: () => setShowAddConnection(false),
          addConnection,
          type,
          iconType,
          setQuestion,
          selectedAgent,
        };

        const componentsMap = {
          "esPúblico Gestiona": OutDefaultModalAddConnection,
          "XML": OutDefaultModalAddConnection,
          "Odoo": OutDefaultModalAddConnection,
          "Wolters": OutDefaultModalAddConnection,
          "Notificaciones Whatsapp": OutDefaultModalAddConnection,
          "Holded": OutDefaultModalAddConnection,
          "Google Sheets": ModalAddConnection,
          "Agencia Tributaria": LeyAntifraudeModalAddConnection,
          "FTP": FTPModalAddConnection,
          "Telematel": ModalAddConnection,
        };

        const Component = componentsMap[type];

        if (!Component) return null;

        // Configuración adicional por tipo
        const extraProps = {};
        if (type === "Google Sheets") {
          extraProps.IconLogin = GmailEnG;
          extraProps.textLogin = t("signinWithGoogle");
          extraProps.IconHeader = IconHeaderModAddConnection;
        } else if (type === "Agencia Tributaria" || type === "Telematel") {
          extraProps.IconHeader = IconHeaderModAddConnection;
        } else if (type === "FTP") {
          extraProps.IconType = iconType;
        }

        return <Component {...sharedProps} {...extraProps} />;
      })()}


      {showEndPointVariables && (
        <AddConnectionModal
          close={() => dispatch(setShowEndPointVariables(false))}
          type="Endpoint"
          custonHeight="auto"
          customCss={"customCss"}
          showTitle={false}
          customCssChildernContent={{ padding: "0px 12px", maxHeight: "60vh", overflow: 'scroll' }}
          setQuestion={setQuestion}
          selectedAgent={selectedAgent}
          showHelpButton={false}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
              height: "100%",
              // overflowY: "auto",
            }}
          >

            <SearchIconWithIcon
              searchTerm={searchEndpoint}
              setSearchTerm={setSearchEndpoint}
              ref={searchInputRef}
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


            {filteredVariables.length === 0 ? (
              <div className={styles.variableContainer}>
                {t("noVariablesAvailable")}
              </div>
            ) : (
              filteredVariables.map((variable) => (
                <div
                  key={variable.id}
                  className={styles.variableContainer}
                  onClick={() => {
                    dispatch(setVariableSelectedToEnpoint(variable.title));
                    dispatch(setShowEndPointVariables(false));
                  }}
                >
                  <div>{variable.title}</div>
                  <input
                    type="checkbox"
                    checked={variable.selected}
                    onChange={() => { }}
                  />
                </div>
              ))
            )}
          </div>
        </AddConnectionModal>
      )}


      {showGmailModalAddConnection && (
        <ModalAddConnection
          type={"Gmail"}
          IconHeader={Gmail}
          IconLogin={GmailEnG}
          textLogin={t("signinWithGoogle")}
          close={() => setShowGmailModalAddConnection(false)}
          setQuestion={setQuestion}
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
          setQuestion={setQuestion}
          selectedAgent={selectedAgent}
        />
      )}
    </div>
  );
};

export default AutomateCreateOut;
