import React, { useState } from "react";
import styles from "./ConfirmationWithPasswordPopup.module.css";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const ConfirmationWithPasswordPopup = ({ setState, confirmatedPassword,titlePopup,descPopup,acceptBtn }) => {
  const [t] = useTranslation("navbarAdmin");
  const { user } = useSelector((state) => state.user);
  const [deleteChatsPassword, setDeleteChatsPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const verifyPassword = async () => {
    if (btoa(deleteChatsPassword) === user?.password) {
      confirmatedPassword();
      setPasswordError(false);

      setState(false);
    } else {
      setPasswordError(true);
    }
  };

  const close = () => {
    setState();
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
        title={titlePopup}
        setState={setState}
        titleStyle={{ fontSize: " clamp(9px, 1.5vw, 18px)" }}
      >
        <Button type="white" action={() => setState(false)}>
          {t("cancel")}
        </Button>
        <Button type="discard" action={verifyPassword}>
          {acceptBtn}
        </Button>
      </HeaderCard>
      <div className={styles.deleteChatContent}>
        <div className={styles.deleteChatsContainer}>
          <p>{descPopup}</p>
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
        </div>
      </div>
    </ModalBlackBgTemplate>
  );
};

export default ConfirmationWithPasswordPopup;
