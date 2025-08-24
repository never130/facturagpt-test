import React, { useState } from "react";
import styles from "./DataControls.module.css";
import Button from "../../../Button/Button";
import ModalBlackBgTemplate from "../../../ModalBlackBgTemplate/ModalBlackBgTemplate";
import { ReactComponent as WhiteLock } from "../../../../assets/WhiteLock.svg";

import HeaderCard from "../../../HeaderCard/HeaderCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setShowModal } from "../../../../../../slices/userSlices";
const DataControls = ({ setShowImportContacts, setDeleteChats,setTypeDelete,setShowSidebar }) => {
  const [t] = useTranslation('accountSetting')
  const dispatch = useDispatch()



  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.labelGeneral}>
        <p>{t('exportData')}</p>{" "}
        <Button
          type="white"
          action={() => {
            navigate("/admin/contacts", { state: { showImport: true } });
          }}
        >
          {t('export')}
        </Button>
      </div>
      <div className={styles.labelGeneral}>
        <p>{t('exportContacts')}</p>{" "}
        <Button
          type="white"
          action={() => {
            navigate("/admin/contacts", { state: { showImport: true } });
            setShowSidebar(false)
          }}
        >
           {t('export')}
        </Button>
      </div>
      <div className={styles.labelGeneral}>
        <p>{t('exportAssets')}</p>{" "}
        <Button
          type="white"
          action={() => {
            navigate("/admin/assets", { state: { showImport: true } });
            setShowSidebar(false)
          }}
        >
           {t('export')}
        </Button>
      </div>
      <div className={styles.labelGeneral}>
        <p>{t('deleteAccount')}</p>{" "}
        <Button
          type="discard"
          headerStyle={{ background: "#DC3545", borderRadius: "999px" }}
          action={() => {
            dispatch(setShowModal({
              modal: 'deleteChats',
              type: 'account',
              variant: 'confirm',
            }))
          }}
        >
          {t('delete')}
        </Button>
      </div>
      <div className={styles.labelGeneral}>
          <p>{t('deleteAllContacts')}</p>
          <Button
            action={() => {
              dispatch(setShowModal({
                modal: 'deleteChats',
                type: 'contacts',
                variant: 'confirm',
              }))
            }}
            type="discard"
            headerStyle={{
              background: "#DC3545",
              borderRadius: " 9999px",
            }}
          >
            {t('deleteAll')}
          </Button>
      </div>

      <div className={styles.labelGeneral}>
          <p>{t('deleteAllAssets')}</p>
          <Button
              action={() => {
                dispatch(setShowModal({
                  modal: 'deleteChats',
                  type: 'assets',
                  variant: 'confirm',
                }))
              }}
            type="discard"
            headerStyle={{
              background: "#DC3545",
              borderRadius: " 9999px",
            }}
          >
            {t('deleteAll')}
          </Button>
      </div>


      <div className={styles.labelGeneral}>
          <p>{t('deleteAllNotifications')}</p>
          <Button
             action={() => {
              dispatch(setShowModal({
                modal: 'deleteChats',
                type: 'notifications',
                variant: 'confirm',
              }))
            }}
            type="discard"
            headerStyle={{
              background: "#DC3545",
              borderRadius: " 9999px",
            }}
          >
            {t('deleteAll')}
          </Button>
      </div>


      <div className={styles.labelGeneral}>
          <p>{t('deleteAll')}</p>
          <Button
             action={() => {
              dispatch(setShowModal({
                modal: 'deleteChats',
                type: 'allUserInformation',
                variant: 'confirm',
              }))
            }}
            type="discard"
            headerStyle={{
              background: "#DC3545",
              borderRadius: " 9999px",
            }}
          >
            {t('deleteAll')}
          </Button>
      </div>



    </div>
  );
};

export default DataControls;
