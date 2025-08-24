import React from "react";
import styles from "./NewUserInformation.module.css";
import ProfileModalTemplate from "../ProfileModalTemplate/ProfileModalTemplate";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import {ReactComponent as WorkspaceIcon} from '../../assets/WorkspaceIcon.svg'
const Step2YourWorkspace = () => {
  const { t } = useTranslation("navbarAdmin");
  return (
    <div className={styles.Step2YourWorkspaceContainer}>
      <ProfileModalTemplate
        type="popup"
        sticky={true}
        customStyle={{
          height: "auto",
          width: "40%",
          aspectRatio: "1/1",
          borderRadius: "10px",
        }}
        camStyles={{
          padding: "0",
        }}
      />
      <h3>{t("whatsTheNameTeamCompany")}</h3>
      <p>{t("giveYourWorkspacesAName")}</p>

      <div className={styles.step1Form}>
        <div>
          <p>{t("workspaceName")}</p>
          <input type="text" placeholder={"Workspace 1"} />
        </div>

        <div>
          <p>{t("rol")}</p>
          <input type="text" placeholder={"Product Manager"} />
        <span className={styles.howLikeIdentifyYou}>{t("howLikeIdentifyYou")}</span>
        </div>
      </div>
      <Button type="white" headerStyle={{ borderRadius: "999px" }}>
        {t("manageWorkspace")} <WorkspaceIcon/>
      </Button>
    </div>
  );
};

export default Step2YourWorkspace;
