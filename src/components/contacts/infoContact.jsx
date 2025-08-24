import React from 'react';
import styles from './contactIdentification.module.css';
import EditableInput from "../../views/Dashboard/screens/Contacts/EditableInput/EditableInput";
import {useTranslation} from "react-i18next";

const ContactIdentification = (
    {
        contactData,
        handleContactData,
        setInputsEditing,
        inputsEditing
    }
) => {
    const { t } = useTranslation(["Contacts","InfoContact"]);
    return (
        <div className={styles.contactIdentification}>
            <h1 className={styles.header}>Identificación del Contacto</h1>

            <div class={styles.containerForm}>
                <div className={styles.section}>
                    <EditableInput
                        label={t("email")}
                        nameInput={"email"}
                        placeholderInput={
                            contactData.companyEmail || t("enterAMail")
                        }
                        isEditing={inputsEditing.email}
                        value={contactData.companyEmail}
                        onChange={(e) => {
                            handleContactData("companyEmail", e.target.value);
                        }}
                        onClick={() =>
                            setInputsEditing((prev) => ({
                                ...prev,
                                email: !prev.email,
                            }))
                        }
                        newFormat={true}
                    />
                </div>

                <div className={styles.section}>
                    <EditableInput
                        label={t("corporativeWebsite")}
                        nameInput={"web"}
                        placeholderInput={
                            contactData.webSite || t("enterACorporativeWebsite")
                        }
                        isEditing={inputsEditing.web}
                        value={contactData.webSite}
                        onChange={(e) => {
                            handleContactData("webSite", e.target.value);
                        }}
                        onClick={() =>
                            setInputsEditing((prev) => ({
                                ...prev,
                                web: !prev.web,
                            }))
                        }
                        newFormat={true}
                    />
                </div>

                <div className={styles.section}>
                    <EditableInput
                        label={t("identityDocument")}
                        nameInput={"DNI"}
                        placeholderInput={
                            contactData.dni || t("enterAIdentityDocument")
                        }
                        isEditing={inputsEditing.dni}
                        value={contactData.dni}
                        onChange={(e) => {
                            handleContactData("dni", e.target.value);
                        }}
                        onClick={() =>
                            setInputsEditing((prev) => ({
                                ...prev,
                                dni: !prev.dni,
                            }))
                        }
                        newFormat={true}
                    />
                </div>

                <div className={styles.section}>
                    <EditableInput
                        label={t("taxNumber")}
                        nameInput={"taxNumber"}
                        placeholderInput={contactData.taxNumber || t("enterACif")}
                        isEditing={inputsEditing.taxNumber}
                        value={contactData.taxNumber}
                        onChange={(e) => {
                            handleContactData("taxNumber", e.target.value);
                        }}
                        onClick={() =>
                            setInputsEditing((prev) => ({
                                ...prev,
                                taxNumber: !prev.taxNumber,
                            }))
                        }
                        newFormat={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default ContactIdentification;
