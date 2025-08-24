import React, { useEffect, useState } from "react";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import styles from "./DeleteChatAgents.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import { ReactComponent as WhiteLock } from "../../assets/WhiteLock.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAgent,
  deleteAllChatsAgent,
  deleteChat,
  emptyChat,
} from "../../../../actions/chat";
import { getAgents } from "../../../../actions/agents";
import {
  deleteAllContacts,
  getAllContacts,
} from "../../../../actions/contacts";
import { deleteAllAssets, getAllAssets } from "../../../../actions/assets";
import {
  deleteAllTables,
  // deleteNotification,
  logicalDeletedAccount,
} from "../../../../actions/user";
import { deleteNotification } from "../../../../actions/notifications";

import { useNavigate } from "react-router-dom";

import { setChatList, setEmptyChat } from "../../../../slices/chatSlices";
import { setShowModal } from "../../../../slices/userSlices";
import { deleteWorkspace, getWorkspacesByIdAction } from "../../../../actions/workspaces";

const DeleteChatAgents = ({
  type,
  user,
  setDeleteChats,
  selectedOption,
  deleteCategory,
  handleDeleteCategory,
  variant = "confirm",
  setVariant,
  deleteFolder,
  deleteFileS3,
  agent,
  currentChat,
  idWorkspace,
  table,
  deleteTableAndUpdateViewProps,
  deleteTableAndUpdateView,
  setShowDeleteTableModal,
  parametersGlobals,
  deleteParameterDB,
  showDeleteTableModal,
  action
}) => {
  const { t } = useTranslation("navbarAdmin");
  const dispatch = useDispatch();
  const [deleteChatsPassword, setDeleteChatsPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const { chatList, searchTerm: searchTermState } = useSelector(
    (state) => state.chat
  );

  const verifyPassword = async () => {
    if (variant === "simple" || btoa(deleteChatsPassword) === user?.password) {
      setPasswordError(false);

      if (type == "agents") {
        try {
          await dispatch(
            deleteAgent({
              agentId: selectedOption?._id,
              agentName: selectedOption?.name,
            })
          ).unwrap();
          dispatch(getAgents({}));
        } catch (error) {
          console.error("Error eliminando el agente:", error);
          return;
        }
      } else if (type == "chats") {
        await dispatch(setEmptyChat(selectedOption.id));
        const res = await dispatch(deleteChat({ chatId: selectedOption.id }));
        if (res?.payload?.success) {
          dispatch(
            setChatList(
              chatList.filter((chat) => chat.id !== selectedOption.id)
            )
          );

          if (user?.token) {
            dispatch(getAgents({ token: user?.token }));
          }
        }
      } else if (type == "contacts") {
        const res = await dispatch(deleteAllContacts({}));
        await dispatch(
          getAllContacts({
            search: "",
            limit: 20,
            skip: 0 * 20,
          })
        );
      } else if (type == "assets") {
        const res = await dispatch(deleteAllAssets({}));
        const response = await dispatch(
          getAllAssets({
            search: "",
            limit: 20,
            skip: 0 * 20,
          })
        );
      } else if (type == "account") {
        const res = await dispatch(logicalDeletedAccount({ id: user.id }));
        localStorage.clear();
        navigate("/login");
      } else if (type == "notifications") {
        await dispatch(deleteNotification({ type: "all" }));
      } else if (type == "allUserInformation") {
        await dispatch(deleteAllChatsAgent({ type: "all" }));
        await dispatch(getAgents({}));
        dispatch(deleteAllTables({}));
      } else if (type == "newContact") {
        handleDeleteCategory(deleteCategory);
      } else if (type == "newAsset") {
        handleDeleteCategory(deleteCategory);
      } else if (type == "accounts") {
        handleDeleteCategory();
      } else if (type == "folder") {
        deleteFolder();
      } else if (type == "fileS3") {
        deleteFileS3();
      } else if (type == "emptyAgent") {
        chatList.forEach((chat) => {
          if (chat.agent == agent._id)
            dispatch(deleteChat({ chatId: chat.id }));
        });
        if (user?.token) {
          dispatch(getAgents({ token: user?.token }));
        }
      } else if (type == "emptyChat") {
               await dispatch(emptyChat({chatId: currentChat.id}))
                 await dispatch(setEmptyChat(currentChat.id))
      } else if(type == 'deleteWorkspace') {
        await dispatch(deleteWorkspace({ workspaceId: idWorkspace }));
        await dispatch(getWorkspacesByIdAction({ userId: user?.id }));
      } else if(type == "table") {
        deleteTableAndUpdateView(
          dispatch, 
          table, 
          deleteTableAndUpdateViewProps.tableView, 
          deleteTableAndUpdateViewProps.setActiveSelectIndex, 
          deleteTableAndUpdateViewProps.id, 
          deleteTableAndUpdateViewProps.navigate)
          setShowDeleteTableModal(null)
      } else if(type == "automation") {
        action()
        // dispatch(deleteAuth(option._id || option.id));
        //                     type === "Gmail" &&
        //                       dispatch(setDeleteAuthData(option._id));
        //                     type === "Google Drive" &&
        //                       dispatch(setDeleteAuthDrive(option.id));
        //                     dispatch(setSelectedEmailConnection(""));
        //                     handleConfigurationChange(deleteSelectedEmail || "selectedEmailConnection", null);
        //                     setIsOpen(false);
      }
      else if(type == "parameterGlobal"){
        deleteParameterDB(parametersGlobals.find(param => param.id == showDeleteTableModal))
        setShowDeleteTableModal(null)
      }
      else {
        dispatch(getAgents({}));
        await dispatch(deleteAllChatsAgent({ type: "all" }));
      }

      dispatch(setShowModal(false));
      if(type == "folder" || type == "fileS3")  setDeleteChats(false);
    } else {
      setPasswordError(true);
    }
  };
  const close = () => {
    dispatch(setShowModal(false));
    if(type == "folder" || type == "fileS3")  setDeleteChats(false);
   
  };

  const textsByType = {
    agents: {
      title: t("deleteAgentTitle"),
      description: t("deleteAgentDescription"),
    },
    chatsAgents: {
      title: t("deleteChatTitle"),
      description: t("deleteChatDescription"),
    },
    chats: {
      title: t("deleteChatTitle"),
      description: t("deleteChatDescription"),
    },
    contacts: {
      title: t("deleteAllContactsTitle"),
      description: t("deleteContactDescription"),
    },
    assets: {
      title: t("deleteAllAssetsTitle"),
      description: t("deleteAssetDescription"),
    },
    account: {
      title: t("deleteAccountTitle"),
      description: t("deleteAccountDescription"),
    },
    notifications: {
      title: t("deleteNotificationsTitle"),
      description: t("deleteNotificationsDescription"),
    },
    allUserInformation: {
      title: t("deleteAllInfoTitle"),
      description: t("deleteUserDataDescription"),
    },
    newContact: {
      title: t("deleteCategoryTile"),
      description: t("deleteCategoryDescription"),
    },
    newAsset: {
      title: t("deleteCategoryTile"),
      description: t("deleteCategoryDescription"),
    },
    accounts: {
      title: t("paymentTitle"),
      description: t("paymentDescription"),
    },
    folder: {
      title: t("folderTitle"),
      description: t("folderDescription"),
    },
    fileS3: {
      title: t("fileS3Title"),
      description: t("fileS3Description"),
    },
    emptyAgent: {
      title: t("emptyAgentTitle"),
      description: t("emptyAgentDescription"),
    },
    emptyChat: {
      title: t("emptyChatTitle"),
      description: t("emptyChatDescription"),
    },
    deleteWorkspace: {
      title: t("deleteWorkspaceTitle"),
      description: t("deleteWorkspaceDescription"),
    },
    table: {
      title: t("deleteTableTitle"),
      description: t("deleteTableDescription"),
    },

    parameterGlobal: {
      title: t("deleteParameterGlobalTitle"),
      description: t("deleteParameterGlobalDescription"),
    },
    automation: {
      title: t("deleteAutomationTitle"),
      description: t("deleteAutomationDescription"),

    },
  };
  const texts = textsByType[type];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if(variant !== "confirm"){
      if (e?.key?.toLowerCase() === "y") {
        verifyPassword();
      }
      if (e?.key?.toLowerCase() === "n") {
        close();
      }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [verifyPassword, close]);

  return (
    <ModalBlackBgTemplate
      close={close}
      father={type}
      customStyle={{
        minHeight: "10vh",
        width: "50vw",
        maxHeight: "700px",
        maxWidth: "400px",
      }}
customZIndex={99}
    >
      <HeaderCard
        title={texts.title}
        setState={() => {
          dispatch(setShowModal(false))
          if(type == "table" || type == "parameterGlobal") setShowDeleteTableModal(null)
        }}
        titleStyle={{ fontSize: " clamp(9px, 1.5vw, 18px)" }}
      >
        {variant == "confirm" && (
          <Button type="discard" action={verifyPassword}>
            <WhiteLock />

            {type === "accounts" ? t("charge") : t("delete")}
          </Button>
        )}
      </HeaderCard>
      <div className={styles.deleteChatContent}>
        <div className={styles.deleteChatsContainer}>
          <p>{texts.description}</p>
          {variant === "confirm" ? (
            <div className={styles.password}>
              <span>{t("enterYourPassword")}</span>
              <div>
                <input
                  type="password"
                  placeholder="****"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      verifyPassword();
                    }
                  }}
                  value={deleteChatsPassword}
                  onChange={(e) => setDeleteChatsPassword(e.target.value)}
                />
                {passwordError && (
                  <p className={styles.errorText}>
                    {t("incorrectPassword") || "La contraseña no es correcta"}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.passwordSimple}>
              <Button type="cancel" action={close}>
                {t("cancel")} (N)
              </Button>
              <Button type="discard" action={verifyPassword}>
                {type === "accounts" ? t("charge") : t("delete")} <WhiteLock />{" "}
                (Y)
              </Button>
            </div>
          )}
        </div>
      </div>
    </ModalBlackBgTemplate>
  );
};

export default DeleteChatAgents;
