import React, { useState } from "react";
import styles from "./NewWorkspace.module.css";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import { ReactComponent as WorkspaceIcon } from "../../assets/WorkspaceIcon.svg";
import { useTranslation } from "react-i18next";
import WorkspaceSection from "./WorkspaceSection/WorkspaceSection";
import TeamWorkspaceSection from "./TeamWorkspaceSection/TeamWorkspaceSection";
import { useDispatch, useSelector } from "react-redux";
import {
  createWorkspacesAction,
  getWorkspacesByIdAction,
  updateWorkspaceAction,
} from "../../../../actions/workspaces";

const NewWorkspace = ({
  setShowWorkspace,
  setShowInviteToWorkspace,
  newWorkspace,
  workspaceData, 
  setWorkspaceData
}) => {
  const [t] = useTranslation("accountSetting");
  const [selectedOption, setSelectedOption] = useState(0);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errorMessage,setErrorMessage] = useState(null)

  const close = () => {
    setShowWorkspace(false);
    setWorkspaceData({
      type: "private",
      typePay: "free",
    })
  };
  const createWorkspaces = async () => {
    const res = await dispatch(
      createWorkspacesAction({ workspace: workspaceData, createdBy: user.id,owner:user })
    );
    if (res?.meta?.requestStatus == "fulfilled") {
      close();
      dispatch(getWorkspacesByIdAction({ userId: user.id }));
    }
  };
  const updateWorkspaces = async () => {
    const { currentMember, ...workspaceToSend } = workspaceData;
    const res = await dispatch(
      updateWorkspaceAction({ workspace: workspaceToSend, workspaceId: workspaceData._id })
    );
    if (res?.meta?.requestStatus == "fulfilled") {
      close();
      dispatch(getWorkspacesByIdAction({ userId: user.id }));
    }
  };

  const handleCreateUpdateWorkspaces = () => {
    if(!workspaceData.title) {
      setErrorMessage({
        message:t('workspaceNeedName'),
        type:"title"
      })
      return
    }
 
    if (newWorkspace) {
      createWorkspaces()
    } else {
      updateWorkspaces()
    }
  };

  return (
    <div>
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
          title={`${t("worskpace")} 1`}
          setState={close}
          titleStyle={{ fontSize: " clamp(9px, 1.5vw, 18px)" }}
        >
          <Button type="white">{t("cancel")}</Button>
          {selectedOption === 0 ? (
            <Button type="green" action={handleCreateUpdateWorkspaces}>
              {newWorkspace ? t("save") : t('update')}
            </Button>
          ) : (
            <Button type="green" action={() => setShowInviteToWorkspace(true)}>
              {t("invite")}
            </Button>
          )}
        </HeaderCard>

        <div className={styles.worskpaceSettings}>
          <div className={styles.leftWorkspaceSetting}>
            <ul>
              <li
                className={`${selectedOption === 0 ? styles.selected : ""}`}
                onClick={() => setSelectedOption(0)}
              >
                <WorkspaceIcon />
                {t("worskpace")}
              </li>
              <li
                className={`${selectedOption === 1 ? styles.selected : ""}`}
                onClick={() => setSelectedOption(1)}
              >
                <WorkspaceIcon />
                {t("team")}
              </li>
            </ul>
          </div>

          <div className={styles.rightWorkspaceSetting}>
            {/* {selectedOption == 0 ? (
              <WorkspaceSection
                setSelectedOption={setSelectedOption}
                newWorkspace={newWorkspace}
                setWorkspaceData={setWorkspaceData}
                workspaceData={workspaceData}
                setShowInviteToWorkspace={setShowInviteToWorkspace}
                errorMessage={errorMessage}
              />
            ) : (
              <TeamWorkspaceSection />
            )} */}
          </div>
        </div>
      </ModalBlackBgTemplate>
    </div>
  );
};

export default NewWorkspace;
