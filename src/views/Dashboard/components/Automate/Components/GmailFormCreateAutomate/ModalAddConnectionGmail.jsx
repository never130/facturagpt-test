import React, { useEffect, useState } from "react";
import LabelInputComponent from "../../../LabelInputComponent/LabelInputComponent";
import AddConnectionModal from "../AddConenctionModal/AddConnectionModal";
import { ReactComponent as GmailIcon } from "../../../../assets/gmail.svg";
import { ReactComponent as OutlookIcon } from "../../../../assets/outlook.svg";
import { ReactComponent as EmailIcon } from "../../../../assets/email-icon-connection.svg";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import styles from "./ModalAddConnectionGmail.module.css";
import { ReactComponent as Gmail } from "../../../../assets/gmail-icon.svg";
import Button from "../../../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as EyePassword } from "../../../../assets/eyePassword.svg";
import { ReactComponent as EyePasswordSlash } from "../../../../assets/eyePasswordSlash.svg";

import { addAuth } from "@src/actions/automate";
import { addConnectionAutomationsByGmail } from "../../../../../../actions/automate";
import Advertency from "../Advertency/Advertency";
import { setAddConnectionAutomationsByGmail } from "../../../../../../slices/automateSlices";
import { useTranslation } from "react-i18next";

const ModalAddConnectionGmail = ({ close }) => {
  const [t] = useTranslation("Preview");
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");
  const globalState = useSelector((state) => state.automate);
  const [connectionSuccefull, setConnectionSuccefull] = useState(false);


  useEffect(() => {
    if (globalState.loading) {
      setConnectionSuccefull(true);
    } else if (!globalState.loading && connectionSuccefull) {
      setTimeout(() => {
        if (globalState.addConnectionAutomationsByGmail.email) {
          close();
        }
      }, 1000);
    }
  }, [globalState.loading]);

  useEffect(() => {
    return () => {
      dispatch(setAddConnectionAutomationsByGmail());
    };
  }, []);

  const handleAddConnection = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmail = (email) => emailRegex.test(email);

    const isEmailValid = testEmail(email);
    const isAppPasswordProvided = appPassword.trim() !== "";

    if (!isEmailValid) {
      setErrorPopup(t('emailAddressNotValid'));
      dispatch(setAddConnectionAutomationsByGmail());
      return;
    }

    if (!isAppPasswordProvided) {
      setErrorPopup(t('appPasswordRequired'));
      dispatch(setAddConnectionAutomationsByGmail());
      return;
    }

    const connection = {
      type: "gmail",
      email,
      appPassword,
    };

    const resp = await dispatch(addAuth(connection));
  };

  return (
    <AddConnectionModal
      close={close}
      type="Gmail"
      icon={<EmailIcon />}
      iconHeader={Gmail}
    >
      <div className={styles.gridContainer}>
        <div className={styles.signInOption}>
          <Gmail width={28} height={28} />
          <p>{t('signInGmail')}</p>
        </div>
        <div style={{ position: "relative" }} onClick={() => setErrorPopup("")}>
          <LabelInputComponent
            value={email}
            setValue={setEmail}
            label={t('user')}
            placeholder={t('yourEmailAddress')}
            inputType="email"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddConnection();
              }
            }}
          />
        </div>


        <div style={{ position: "relative" }} onClick={() => setErrorPopup("")}>
          <LabelInputComponent
            value={appPassword}
            setValue={setAppPassword}
            label={t('password')}
            placeholder={t('yourAccountPassword')}
            inputType={showPassword ? "text" : "password"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddConnection();
              }
            }}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          {errorPopup && (
            <Advertency
              text={errorPopup}
            />
          )}
          {globalState.addConnectionAutomationsByGmail ===
          "Error on addAuthController" ? (
            <Advertency
              text={t('incorrectDataVerifyPassword')}
              addConnection="https://myaccount.google.com/apppasswords"
            />
          ) : globalState.addConnectionAutomationsByGmail ===
            "Auth with this email already exists" ? (
            <Advertency
              text={t('alreadyConnectionThisEmail')}
            />
          ) : (
            ""
          )}
        </div>

        <Button action={handleAddConnection}>
         
          {!globalState.loading &&
          !globalState.addConnectionAutomationsByGmail?.email ? (
            <div>{t('addConnection')}</div>
          ) : globalState.addConnectionAutomationsByGmail?.email ? (
            <span className={styles.checkOk}>✓</span>
          ) : (
            <span className={styles.loader}></span>
          )}
        </Button>

      </div>
    </AddConnectionModal>
  );
};

export default ModalAddConnectionGmail;
