import { ReactComponent as IconStar } from "./assets/star.svg";
import { ReactComponent as IconArrowConnect } from "./assets/arrow_connect.svg";
import { ReactComponent as GrayCheck } from "./assets/grayCheck.svg";
import { ReactComponent as IconArrow } from "./assets/arrow.svg";
import { ReactComponent as IconDrive } from "./assets/icon_drive.svg";
import { ReactComponent as IconDropbox } from "./assets/icon_dropbox.svg";
import { ReactComponent as IconGmail } from "./assets/icon_gmail.svg";
import { ReactComponent as IconLock } from "./assets/icon_lock.svg";
import { ReactComponent as IconOneDrive } from "./assets/icon_onedrive.svg";
import { ReactComponent as IconOutlook } from "./assets/icon_outlook.svg";
import { ReactComponent as IconSharePoint } from "./assets/icon_sharepoint.svg";
import { ReactComponent as IconWhatsApp } from "../../../assets/whatsapp-icon-green.svg";

import styles from "./IniAutomate.module.css";
import Button from "../../Button/Button";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  driveIsAuthenticated,
  getAuth,
  getUserDevices,
  oneDriveIsAuthenticated,
  outlookIsAuthenticated,
} from "../../../../../actions/automate";

const PanelIniAutomate = ({ typeContent,handleShowContentAutomate, type,setShowIniAutomate }) => {
  const [t] = useTranslation("Automate");

  const dispatch = useDispatch();


  const [authData, setAuthData] = useState([]);
  const [authOutlook, setAuthOutlook] = useState([]);
  const [authDrive, setAuthDrive] = useState([]);
  const [userDevices, setUserDevices] = useState([]);
  const [authOneDrive, setAuthOneDrive] = useState([]);
  const { automate } = useSelector((state) => state);

  const userId = useSelector((state) => state?.user?.user?.id);


  useEffect(() => {
    if (automate.authData.length > 0) {
      setAuthData(automate.authData);
    }
    if (automate.authOutlook?.success) {
      const constructorEqualAuthData = {
        email: automate.authOutlook?.data?.account?.username,
        userId: automate.authOutlook?.data?.userId,
        type: type,
      };
      setAuthOutlook([constructorEqualAuthData]);
    }
    if (automate.authDrive?.success) {
      const constructorEqualAuthData = automate.authDrive?.data?.map((ele) => {
        return {
          email: ele.email,
          userId: ele.userId,
          type: type,
          id: ele._id,
        };
      });
      setAuthDrive(constructorEqualAuthData);
    }
    if (automate.userDevices?.success) {
      const devices = automate.userDevices?.devices.map((ele) => {
        return {
          email: ele.deviceId,
          userId: ele.userId,
          type: ele.type || type,
          id: ele.id,
        };
      });
      setUserDevices(devices);
    }
    if (automate.authOneDrive?.success) {
      const constructorEqualAuthData = automate.authOneDrive.data?.map(
        (account) => {
          return {
            email: account.account.username,
            userId: account.userId,
            type: account.type || type,
            id: account._id,
          };
        }
      );
      setAuthOneDrive(constructorEqualAuthData);
    }
  }, [
    automate.authData,
    automate.authOutlook?.success,
    automate.authDrive?.data,
    automate.userDevices,
    automate.authOneDrive?.success,
  ]);

  const automates = [
    {
      icon: <IconGmail />,
      name: t("uploadYourGmailDocuments"),
      description: t("connectAndUploadAttachments"),
      available: true,
      button: true,
      key: "Gmail",
    },
    {
      icon: <IconOutlook />,
      name: t("uploadYourOutlookDocuments"),
      description: t("syncYourEmails"),
      available: true,
      button: true,
      key: "Outlook",
    },
    {
      icon: <IconDrive />,
      name: t("uploadYourGoogleDriveDocuments"),
      description: t("accessYourCloud"),
      available: true,
      button: true,
      key: "Google Drive",
    },
    {
      icon: <IconWhatsApp />,
      name: t("uploadYourWhatsappDocuments"),
      description: t("importAndOrganize"),
      available: true,
      button: true,
      key: "WhatsApp",
    },
    {
      icon: <IconOneDrive />,
      name: t("uploadYourOneDriveDocuments"),
      description: t("connectAndManageDocuments"),
      available: false,
      button: true,
      key: "One Drive",
    },
    {
      icon: <IconDropbox />,
      name: t("uploadYourDropboxDocuments"),
      description: t("syncAndFilterInvoices"),
      available: false,
      button: true,
      key: "Dropbox",
    },
  ];

  return (
    <div className={styles.container}>
      <ul className={styles.automates}>
        {automates.map((automate, index) => {
          return (
            <li
              className={
                automate.available ? styles.available : styles.disabled
              }
              key={index}
            >
              <div className={styles.top}>
                <div className={styles.header}>
                  <div className={styles.icon}>{automate.icon}</div>
                  <div className={styles.info}>
                    <b>{automate.name}</b>
                    <p>{automate.description}</p>
                  </div>
                </div>
              </div>
              <div className={styles.bottom}>
                <div className={styles.buttons}>
                  <Button
                    action={() => {
                      typeContent ?typeContent(automate.key) :handleShowContentAutomate(automate.key)
                      setShowIniAutomate(false)
                    }}
                    headerStyle={{ borderRadius: "999px" }}
                  >
                    {t("connect")}
                    <IconArrowConnect />
                  </Button>
        
                  {(automate.key === "Gmail" && authData.length > 0) ||
                  (automate.key === "Outlook" && authOutlook.length > 0) ||
                  (automate.key === "Google Drive" && authDrive.length > 0) ||
                  (automate.key === "WhatsApp" && userDevices.length > 0) ? (
                    <Button
                      type="white"
                      headerStyle={{ borderRadius: "999px" }}
                    >
                      {t("added")} <GrayCheck />
                    </Button>
                  ) : null}
 
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PanelIniAutomate;
