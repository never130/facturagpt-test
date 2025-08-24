import React, { useState } from "react";
import styles from "./InviteToWorkspace.module.css";
import ModalBlackBgTemplate from "../../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../../HeaderCard/HeaderCard";
import Button from "../../Button/Button";
import { ReactComponent as TwoPeopleGreen } from "../../../assets/TwoPeopleGreen.svg";
import { ReactComponent as StarIcon } from "../../../assets/RoundedStar.svg";
import { useTranslation } from "react-i18next";
import EditableInput from "../../AccountSettings/EditableInput/EditableInput";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import AvailableRoles from "../WorkspaceSection/AvailableRoles";
import { useDispatch } from "react-redux";
import { inviteMembersToWorkspaceAction } from "../../../../../actions/workspaces";
const InviteToWorkspace = ({
  setShowInviteToWorkspace,
  userToInvite,
  setUserToInvite,
  setShowMergePlan,
  workspaceData,
  setWorkspaceData,
}) => {
  const [t] = useTranslation("accountSetting");
  const [errorMessage,setErrorMessage] = useState(null)
  const dispatch = useDispatch()
  const close = () => {
    setShowInviteToWorkspace(false);
    setUserToInvite(null)
  };

  const handleChange = ({ name, newValue }) => {
    const updatedData = { ...userToInvite, [name]: newValue };
    setUserToInvite(updatedData);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const inviteMembersToWorkspace = async () => {
    if (!userToInvite?.userEmail) {
      setErrorMessage({
        message: t("enterAnEmail"),
        type: "email",
      });
      return;
    } else if (!userToInvite?.role?.title) {
      setErrorMessage({
        message: t("userNeedRole"),
        type: "role",
      });
      return;
    } else {
      setErrorMessage(null);
    }
  
    const raw = userToInvite.userEmail;
    const emails = raw
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);
  
    const invalid = emails.filter((e) => !isValidEmail(e));
    if (invalid.length > 0) {
      setErrorMessage({
        message: t("invalidEmails", { emails: invalid.join(", ") }), 
        type: "email",
      });
      return;
    }
  
    const res = await dispatch(
      inviteMembersToWorkspaceAction({
        emails: emails, 
        workspaceId: workspaceData._id,
        role: userToInvite.role,
      })
    );
    if(res?.payload?.notFoundEmails?.length > 0 || res?.payload?.code == 'NO_ACCOUNTS_FOUND') {
      setErrorMessage({
        message: t("someEmailsNotFound", { emails: res?.payload?.notFoundEmails.join(", ") }),
        type: "emailsNotFound",
      });
    }else{
      close()
      setErrorMessage(null)
    }
  };
  
  return (
    <ModalBlackBgTemplate
      close={close}
      customStyle={{
        maxWidth: "700px",
        width: "100vw",
        height: "80vh",
        minHeight: "80vh",
      }}
    >
      <HeaderCard
        title={`${t("inviteTo")} `}
        setState={close}
        titleStyle={{ fontSize: " clamp(9px, 1.5vw, 18px)" }}
      >
        <Button type="white">{t("cancel")}</Button>
        <Button type="green" action={inviteMembersToWorkspace}>
          {t("invite")}
        </Button>
      </HeaderCard>
      <div className={styles.InviteToWorkspaceContent}>
        <div className={styles.workspaceSectionLabel}>
          <div className={styles.mergPlanContainer}>
            <div>
              <div className={styles.emailContainer}>
                <p>{t("email")}</p>
                <span>{t("emailsSeparatedByComma")}</span>
              </div>
            <div>
            <div className={styles.inputContainer}>
                <TwoPeopleGreen />
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  value={userToInvite?.userEmail}
                  onChange={(e) =>
                    handleChange({
                      name: "userEmail",
                      newValue: e.target.value,
                    })
                  }
                />
              </div>
              {(errorMessage?.type == 'email'  || errorMessage?.type ==  "emailsNotFound")&& (
            <div className={styles.errorMessage}>{errorMessage.message}</div>
          )}
            </div>
            </div>
          </div>
        </div>

        <div className={styles.workspaceSectionLabel}>
          <p>{t("invitationEmail")}</p>

          <Button headerStyle={{ borderRadius: "999px" }} type="white">
            {t("see")}
          </Button>
        </div>
        {errorMessage?.type == "role" && (
          <div className={styles.errorMessage}>{errorMessage.message}</div>
        )}
        <AvailableRoles
          workspaceData={workspaceData}
          setWorkspaceData={setWorkspaceData}
          setUserToInvite={setUserToInvite}
          userToInvite={userToInvite}
          InviteToWorkspace={true}
        />
      </div>
    </ModalBlackBgTemplate>
  );
};

export default InviteToWorkspace;
