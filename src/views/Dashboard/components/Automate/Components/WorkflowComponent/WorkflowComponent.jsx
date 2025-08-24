import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import styles from './WorkflowComponent.module.css';

import CustomAgent from '../SectionsAutomate/CustomAgent/CustomAgent'


import FileInputNotification from '../FileInput/Notification'
import SaveProcessDocument from '../../../SaveProcessDocument/SaveProcessDocument';
import { ReactComponent as GrayChevron } from "../../../../assets/grayChevron.svg";
import { ReactComponent as SearchWhite } from "../../../../assets/searchWhite.svg";
import { ReactComponent as SearchGreen } from "../../../../assets/SearchIconGreen.svg";
import CustomAutomationsWrapper from '../../../CustomAutomationsWrapper/CustomAutomationsWrapper';
import FilterInfoDateKey from '../FilterInfoDateKey/FilterInfoDateKey';
import SelectInfoToProcessWorkflow from '../SelectInfoToProcessWorkflow/SelectInfoToProcessWorkflow';

import ConfigDataKey from '../SectionsAutomate/selectInfoToProcces/ConfigDataKey';


import HeaderFormsComponent from '../../../HeadersFormsComponent/HeaderFormsComponent';
import ChatAutomate from '../AutomateCreateIn/ChatAutomate/ChatAutomate';

import { ReactComponent as TelematelIcon } from "../../../../assets/telematel.svg";
import { ReactComponent as GoogleSheetsIcon } from "../../../../assets/excelCircle.svg";
import { ReactComponent as XMLIcon } from "../../../../assets/XMLBig.svg";

import { ReactComponent as OdooIcon } from "../../../../assets/OdooCircleNew.svg";
import { ReactComponent as WoltersIcon } from "../../../../assets/wolters-icon.svg";
import { ReactComponent as AgencyIcon } from "../../../../assets/agenciaTributariaCircle.svg";
import { ReactComponent as WhatsAppIcon } from "../../../../assets/whatsappIcon.svg";
import { ReactComponent as FTPIcon } from "../../../../assets/WhiteFTPCircle.svg";
import { ReactComponent as HoldedIcon } from "../../../../assets/WhiteHoldedCircle.svg";
import { ReactComponent as EsPublico } from "../../../../assets/gestionaEsPubliconNewLogoCircle.svg";

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
import { ReactComponent as SharepointIcon } from "../../../../assets/sharePointCircle.svg";
import { ReactComponent as OneDriveIcon } from "../../../../assets/oneDriveCircle.svg";
import { useDispatch, useSelector } from 'react-redux';
import { createAutomation, updateAutomation } from '../../../../../../actions/automate';
import DataToSync from '../DataToSync/DataToSync';
import CustomNotify from '../SectionsAutomate/CustomNotify/CustomNotify';
const WorkflowComponent = ({
  type,
  typeContent,
  isAnimating,
  automationData,
  formAutomateContainerRef,
  configuration,
  setConfiguration,
  setShowCategory,
  handleModalAddConnection,
  typeVariableModal,
  setTypeVariableModal,
  showVariableListModal,
  setShowVariableListModal,
  showVariableModal,
  setShowVariableModal,
  setIsModalAutomate,
  setHideAutomate,
  setRoleAutomate,
  close,
  toggleChatSettings,
  setToggleChatSettings,
  saveConfiguration,
  cardSelected,
  roleAutomate
}) => {
  const { t } = useTranslation();
  const [showContent, setShowContent] = useState({
    info1: false,
  });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [showSelectOutputLocation, setShowSelectOutputLocation] =
    useState(false);
  const [selectedAutomates, setSelectedAutomates] = useState([])


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
    "Gmail": <GmailIcon />,
    "Outlook": <OutlookIcon />,
    "SMTP": <EmailIcon />,
    "Google Drive": <DriveIcon />,
    "Dropbox": <DropboxIcon />,
    "WhatsApp": <WhatsAppIcon />,
    "Sharepoint": <SharepointIcon />,
    "One Drive": <OneDriveIcon />,
  };

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
  console.log('saveConfiguration', saveConfiguration)
  console.log('type', type)
  useEffect(() => {
    if (saveConfiguration) {
      const handleAddAutomation = async () => {

        let selectedAutomationData;
        selectedAutomationData = {
          ...configuration,
          type: type,
          role: 'workflow'
        }


        console.log('guardando workflow', selectedAutomationData)
        if (user && selectedAutomationData?.id) {
          dispatch(
            updateAutomation({
              automationId: selectedAutomationData?._id,
              toUpdate: { ...cardSelected, ...selectedAutomationData },
              userId: user?.id,
            })
          );
        } else if (user) {
          dispatch(
            createAutomation({
              userId: user?.id,
              email: user?.email,
              automationData: { ...cardSelected, ...selectedAutomationData },
            })
          );
        }
      };
      handleAddAutomation();
    }
  }, [saveConfiguration]);

  return (
    <div>
      <HeaderFormsComponent
        selectedEmailConnection={configuration?.selectedEmailConnection}
        setSelectedEmailConnection={(value) =>
          handleConfigurationChange("selectedEmailConnection", value)
        }
        emailConnections={(
          configuration?.emailConnectionData ||
          // authDataTelametel ||
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
        roleAutomate={roleAutomate}
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
            // onlyShowConfigDataKey={true}
          />

{/* <DataToSync
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
            formAutomateContainerRef={formAutomateContainerRef}
            typeContent={typeContent}
            type={type}
            setShowVariableModal={setShowVariableModal}
            setTypeVariableModal={setTypeVariableModal}
          />   */}


<CustomAgent
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
            formAutomateContainerRef={formAutomateContainerRef}
            setShowCategory={setShowCategory}
            setShowGmailModalAddConnection={handleModalAddConnection}
          />

          
<SaveProcessDocument
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
          {/* <FileInputNotification
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
            formAutomateContainerRef={formAutomateContainerRef}
            setShowCategory={setShowCategory}
            setShowGmailModalAddConnection={handleModalAddConnection}
          /> */}
        </>
      ) :
        (
          <ChatAutomate type={type} configuration={configuration} />
        )
      }
    </div>
  )
}

export default WorkflowComponent