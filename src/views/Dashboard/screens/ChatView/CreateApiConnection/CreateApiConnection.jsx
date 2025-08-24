import React, { useRef, useState } from "react";
import styles from "./CreateApiConnection.module.css";
import { ReactComponent as IconFacturaGPT } from "../../../assets/FacturaLogoIconGreen.svg";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button/Button";
import SearchIconWithIcon from "../../../components/SearchIconWithIcon/SearchIconWithIcon";
import KIcon from "../../../assets/KIcon.svg";
import { ReactComponent as Outlook } from "../../../assets/outlook-icon.svg";
import { ReactComponent as GoogleDrive } from "../../../assets/drive-icon.svg";
import { ReactComponent as Gmail } from "../../../assets/gmail-icon.svg";
import { ReactComponent as Stripe } from "../../../assets/stripePurple.svg";
import { ReactComponent as GoogleMeet } from "../../../assets/googleMeet-icon.svg";
import { ReactComponent as OneDrive } from "../../../assets/onedrive-icon.svg";
import { ReactComponent as Dropbox } from "../../../assets/dropbox-icon.svg";
import { ReactComponent as Whatsapp } from "../../../assets/whatsappIcon.svg";
import { ReactComponent as GoogleCalendar } from "../../../assets/GoogleCalenar-icon.svg";
import { ReactComponent as Teams } from "../../../assets/MicrosoftTeams-icon.svg";
import { ReactComponent as SearchIcon } from "../../../assets/searchGray.svg";
import { ReactComponent as WarningBlackIcon } from "../../../assets/WarningBlackIcon.svg";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import { ReactComponent as TestingEndpointIcon } from "../../../assets/TestingEndpointIcon.svg";


import { ReactComponent as GmailIcon } from "../../../assets/gmailwithoutbg.svg";
import { ReactComponent as OutlookIcon } from "../../../assets/outlook.svg";
import { ReactComponent as EmailIcon } from "../../../assets/email.svg";
import { ReactComponent as DriveIcon } from "../../../assets/driveCircle.svg";
import { ReactComponent as DropboxIcon } from "../../../assets/dropbox-icon.svg";
import { ReactComponent as SharepointIcon } from "../../../assets/sharePointCircle.svg";
import { ReactComponent as OneDriveIcon } from "../../../assets/oneDriveCircle.svg";
import { ReactComponent as TelematelIcon } from "../../../assets/telematel.svg";
import { ReactComponent as GoogleSheetsIcon } from "../../../assets/excelCircle.svg";
import { ReactComponent as XMLIcon } from "../../../assets/XMLBig.svg";

import { ReactComponent as OdooIcon } from "../../../assets/OdooCircleNew.svg";
import { ReactComponent as WoltersIcon } from "../../../assets/wolters-icon.svg";
import { ReactComponent as AgencyIcon } from "../../../assets/agenciaTributariaCircle.svg";
import { ReactComponent as WhatsAppIcon } from "../../../assets/whatsappIcon.svg";
import { ReactComponent as FTPIcon } from "../../../assets/WhiteFTPCircle.svg";
import { ReactComponent as HoldedIcon } from "../../../assets/WhiteHoldedCircle.svg";
import { ReactComponent as EsPublico } from "../../../assets/gestionaEsPubliconNewLogoCircle.svg";
import { ReactComponent as StarsIcon } from "../../../assets/StarsIcon.svg";
import { ReactComponent as PlayIcon } from "../../../assets/PlayIcon.svg";
const CreateApiConnection = ({selectedAutomate}) => {
  const [step, setStep] = useState(1);
  const [t] = useTranslation();
  const [describeTaskValue, setDescribeTaskValue] = useState("");
  const [searchEndpoint, setSearchEndpoint] = useState("");
  const searchInputRef = useRef(null);
  const [selectedService, setSelectedService] = useState("");

  const services = [
    {
      name: "Outlook",
      icon: <Outlook />,
    },
    {
      name: "googleDrive",
      icon: <GoogleDrive />,
    },
    {
      name: "gmaiil",
      icon: <Gmail />,
    },
    {
      name: "stripe",
      icon: <Stripe />,
    },
    {
      name: "googleMeet",
      icon: <GoogleMeet />,
    },
    {
      name: "oneDrive",
      icon: <OneDrive />,
    },
    {
      name: "dropbox",
      icon: <Dropbox />,
    },
    {
      name: "whatsapp",
      icon: <Whatsapp />,
    },
    {
      name: "googleCalendar",
      icon: <GoogleCalendar />,
    },
    {
      name: "googleTeam",
      icon: <Teams />,
    },
  ];

  const iconComponents = {
    "Telematel": <TelematelIcon/>,
    "Google Sheets": <GoogleSheetsIcon/>,
    "XML": <XMLIcon/>,
    "Odoo": <OdooIcon/>,
    "Wolters": <WoltersIcon/>,
    "Notificaciones Whatsapp": <WhatsAppIcon/>,
    "Agencia Tributaria": <AgencyIcon/>,
    "FTP": <FTPIcon/>,
    "Holded": <HoldedIcon/>,
    "esPúblico Gestiona": <EsPublico/>,
    "Gmail": <GmailIcon/>,
    "Outlook": <OutlookIcon/>,
    "SMTP": <EmailIcon/>,
    "Google Drive": <DriveIcon/>,
    "Dropbox": <DropboxIcon/>,
    "WhatsApp": <WhatsAppIcon/>,
    "Sharepoint": <SharepointIcon/>,
    "One Drive": <OneDriveIcon/>,
  };

  return (
    <div className={styles.CreateApiConnectionContainer}>
      {step == 1 && (
        <div className={styles.step1Container}>
          <div className={styles.nameIconFactura}>
            <IconFacturaGPT className={styles.IconFacturaGPT} />
            <p>
              {t("createWith")} <strong>FacturaGPT</strong>
            </p>
          </div>
          <div className={styles.automateStep1Container}>
           <div className={styles.iconContainer}>
           {iconComponents[selectedAutomate.type]}
           </div>
<p>Explain result</p>
<span>senders</span>
          </div>
       <div className={styles.describeContainer}>
       <textarea
            onChange={(e) => setDescribeTaskValue(e.target.value)}
            value={describeTaskValue}
            placeholder={t("describeAutomate")}
          />
          <Button action={() => setStep(2)} headerStyle={{marginLeft:"auto"}}><StarsIcon/> {t("generateWorkflow")}</Button>
       </div>
        </div>
      )}
      {step == 2 && (
        <div style={{ height: "100%" }}>
          <div className={`${styles.describeContainer} ${styles.describeContainerStep2}`}>
       
          <textarea placeholder={t("whatAutomationWantCreate")}></textarea>
          <Button action={() => setStep(2)} type="white" headerStyle={{marginLeft:"auto",color:"var(--_10a37f-background)",fontWeight:"400",border:"transparent"}}> 2 {t("matchs")}<StarsIcon/></Button>
       </div>
          <SearchIconWithIcon
            searchTerm={searchEndpoint}
            setSearchTerm={setSearchEndpoint}
            ref={searchInputRef}
            placeholder={t("searchApi")}
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
          <span className={styles.noConnection}>
            {t("noDetectedConnection")}
          </span>


          <Button action={() => setStep(3)}>{t("goToProducction")} <PlayIcon height={15} width={15}/></Button>
        </div>
      )}
      {step == 3 && (
        <div className={styles.step3}>
          <div className={styles.apiInfo}>
            <textarea placeholder={t("whatAutomationWantCreate")}></textarea>
            <p className={styles.testApiConnection}>Test de Conexión de API</p>
            <span className={styles.visualizesEndpointStatus}>
              Visualiza el estado de cada endpoint antes de pasar a producción y
              monitoriza en tiempo real.
            </span>
          </div>
          <div className={styles.selectEndpoint}>
            <label htmlFor="endpoints" className={styles.labelInput}>
              {t("selectEndpoint")}
            </label>
            <div className={styles.inputContainer}>
              <SearchIcon height={24} width={24} />
              <input type="text" placeholder={t("searchEndpoint")} />
              <button className={styles.buttonInputSearchEndPoints}>
                {t("selectModule")}
              </button>
            </div>
            <div className={styles.noEndpointsFound}>
              <WarningBlackIcon /> {t("noEndpointsFound")}
            </div>
          </div>

          <div className={styles.endpoint}>
            <div className={styles.endpointInfo}>
              <p className={styles.endpointName}>/endpointname</p>
              <span
                className={`${styles.typeEndpoint} ${styles.typeEndpointPost}`}
              >
                POST
              </span>
            </div>
            <div className={styles.rightSection}>
              <span>Hace 1 min</span>
              <div className={styles.statusEndpoint}><TestingEndpointIcon/> Probando</div>
            <Button type="border">
              <PencilEdit />
            </Button>
            </div>
          </div>

          <div className={styles.endpointScrapperd}>
            <div className={styles.headerEndpoint}>
              <p>field</p>
              <span>nullable object</span>
            </div>

            <p className={styles.responseEndpointScrapper}>
              FacturaGPT ha scrapeado la documentación de la API y está
              validando automáticamente los endpoints seleccionados para tu
              workflow.
            </p>

            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBarFill}></div>
            </div>

            <span className={styles.percentageResponse}>45% de respuesta</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateApiConnection;
