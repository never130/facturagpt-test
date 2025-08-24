import React, { useState } from "react";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import styles from "./DeleteAccountModal.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import { ReactComponent as WhiteLock } from "../../assets/WhiteLock.svg";
import { useDispatch } from "react-redux";

import {
    deleteAccount,

  } from "../../../../actions/user";
const DeleteAccountModal = ({
  setAccountSelected,
  setAccountsInfoSelecteds,
  user, 
  setShowDeleteAccounts, 
  accountSelected 
}) => {
  const { t } = useTranslation("navbarAdmin");
  const dispatch = useDispatch();
  const [deleteChatsPassword, setDeleteChatsPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const verifyPassword = async () => {
    if (btoa(deleteChatsPassword) === user?.password) {
      setPasswordError(false);

      accountSelected.forEach((account) => {
        dispatch(deleteAccount({ id: account }));
      });
      setAccountSelected([]);
      setAccountsInfoSelecteds([]);

      setShowDeleteAccounts(false);
    } else {
      setPasswordError(true);
    }
  };
  const close = () => {
    setShowDeleteAccounts(false);
  };

  return (
    <ModalBlackBgTemplate
      close={close}
      customStyle={{
        minHeight: "10vh",
        width: "50vw",
        maxHeight: "700px",
        maxWidth: "600px",
      }}
    >
      <HeaderCard
        title={t("deleteAccount")}
        setState={setShowDeleteAccounts}
        titleStyle={{ fontSize: " clamp(9px, 1.5vw, 18px)" }}
      >
        <Button type="white" action={() => setShowDeleteAccounts(false)}>
          {t("cancel")}
        </Button>
        <Button type="discard" action={verifyPassword}>
          {t("delete")} <WhiteLock />
        </Button>
      </HeaderCard>
      <div className={styles.deleteChatContent}>
        <div className={styles.deleteChatsContainer}>
          <b>{t("wantDeleteYourChats")}</b>
          <p>{t("ifYouDeleteYourChats")}</p>
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
                  {t("incorrectPassword")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalBlackBgTemplate>
  );
};

export default DeleteAccountModal;
