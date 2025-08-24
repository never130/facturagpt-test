import React, { useState } from "react";
import LabelInputComponent from "../../../LabelInputComponent/LabelInputComponent";
import AddConnectionModal from "../AddConenctionModal/AddConnectionModal";
import { ReactComponent as EmailIcon } from "../../../../assets/email-icon-connection.svg";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import styles from "./SMTPModalAddConnection.module.css";
import { ReactComponent as Outlook } from "../../../../assets/outlook-icon.svg";
import Button from "../../../Button/Button";
import { useTranslation } from "react-i18next";

const OutlookModalAddConnection = ({ addConnection }) => {
  const [t] = useTranslation('AutomatesComponent')
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [imapServer, setImapServer] = useState("");
  const [smtpServer, setSmtpServer] = useState("");
  const [imapPort, setImapPort] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [selectedImapEncryption, setSelectedImapEncryption] =
    useState(t('tlsSslOrNone'));
  const [selectedSmtpEncryption, setSelectedSmtpEncryption] =
    useState(t('tlsSslOrNone'));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const testEmail = (email) => emailRegex.test(email);

  const handleAddConnection = () => {
    const connection = {
      email,
      appPassword,
      imapServer,
      smtpServer,
      imapPort,
      smtpPort,
      selectedImapEncryption,
      selectedSmtpEncryption,
    };

    const isEmailValid = testEmail(email);
    const isAppPasswordProvided = appPassword.trim() !== "";
    const isImapServerValid = imapServer.trim() !== "";
    const isSmtpServerValid = smtpServer.trim() !== "";
    const isImapPortValid = imapPort.trim() !== "" && !isNaN(imapPort);
    const isSmtpPortValid = smtpPort.trim() !== "" && !isNaN(smtpPort);

    if (!isEmailValid) {
      console.error("Invalid email address.");
      return;
    }

    if (!isAppPasswordProvided) {
      console.error("App password is required.");
      return;
    }

    if (!isImapServerValid && !isSmtpServerValid) {
      console.error("At least one of IMAP or SMTP servers must be provided.");
      return;
    }

    if (!isImapPortValid && !isSmtpPortValid) {
      console.error(
        "At least one of IMAP or SMTP ports must be provided and valid."
      );
      return;
    }

  };

  return (
    <div className={styles.gridContainer}>

    <div className={styles.serverConfigContainer}>
      <LabelInputComponent
        value={imapServer}
        setValue={setImapServer}
        label={t('imapServer')}
        placeholder="imap.domain.com"
        inputType="text"
      />

      <LabelInputComponent
        value={smtpServer}
        setValue={setSmtpServer}
        label={t('smtpServer')}
        placeholder="smtp.domain.com"
        inputType="text"
      />

      <LabelInputComponent
        value={imapPort}
        setValue={setImapPort}
        label={t('imapServer')}
        placeholder="993"
        inputType="number"
        maxLength="3"
      />

      <LabelInputComponent
        value={smtpPort}
        setValue={setSmtpPort}
        label={t('smtpServer')}
        placeholder="587"
        inputType="number"
        maxLength="3"
      />

      <div className={styles.dropdownContainer}>
        <label>{t('imapEncryptionMethod')}</label>
        <CustomDropdown
          borderRadius="8px"
          height="31px"
          selectedOption={selectedImapEncryption}
          setSelectedOption={setSelectedImapEncryption}
          label={t('imapEncryptionMethod')}
          options={[t('tlsSslOrNone'), t('other')]}
        />
      </div>

      <div className={styles.dropdownContainer}>
        <label>{t('smtpEncryptionMethod')}</label>
        <CustomDropdown
          borderRadius="8px"
          height="31px"
          selectedOption={selectedSmtpEncryption}
          setSelectedOption={setSelectedSmtpEncryption}
          label={t('smtpEncryptionMethod')}
          options={[t('tlsSslOrNone'), t('other')]}
        />
      </div>
    </div>
    <Button action={handleAddConnection}>
      <span>{t('addConnection')}</span>
    </Button>
  </div>
  )

  return (
    <AddConnectionModal
      type="Outlook"
      icon={<EmailIcon />}
      iconHeader={Outlook}
    >
      <div className={styles.gridContainer}>
        <div className={styles.serverConfigContainer}>
          <LabelInputComponent
            value={imapServer}
            setValue={setImapServer}
            label={t('imapServer')}
            placeholder="imap.domain.com"
            inputType="text"
          />

          <LabelInputComponent
            value={smtpServer}
            setValue={setSmtpServer}
            label={t('smtpServer')}
            placeholder="smtp.domain.com"
            inputType="text"
          />

          <LabelInputComponent
            value={imapPort}
            setValue={setImapPort}
            label={t('imapServer')}
            placeholder="993"
            inputType="number"
            maxLength="3"
          />

          <LabelInputComponent
            value={smtpPort}
            setValue={setSmtpPort}
            label={t('smtpServer')}
            placeholder="587"
            inputType="number"
            maxLength="3"
          />

          <div className={styles.dropdownContainer}>
            <label>{t('imapEncryptionMethod')}</label>
            <CustomDropdown
              borderRadius="8px"
              height="31px"
              selectedOption={selectedImapEncryption}
              setSelectedOption={setSelectedImapEncryption}
              label={t('imapEncryptionMethod')}
              options={[t('tlsSslOrNone'), t('other')]}
            />
          </div>

          <div className={styles.dropdownContainer}>
            <label>{t('smtpEncryptionMethod')}</label>
            <CustomDropdown
              borderRadius="8px"
              height="31px"
              selectedOption={selectedSmtpEncryption}
              setSelectedOption={setSelectedSmtpEncryption}
              label={t('smtpEncryptionMethod')}
              options={[t('tlsSslOrNone'), t('other')]}
            />
          </div>
        </div>
        <Button action={handleAddConnection}>
          <span>{t('addConnection')}</span>
        </Button>
      </div>
    </AddConnectionModal>
  );
};

export default OutlookModalAddConnection;
