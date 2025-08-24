import React, { useState } from "react";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import styles from "./ApproveDocument.module.css";
import wolters from "../../assets/wolters-icon.svg";
import { ReactComponent as BlackLock } from "../../assets/LockIcon.svg";
import { ReactComponent as OptionDots } from "../../assets/optionDots.svg";
import OptionsPopup from "../OptionsPopup/OptionsPopup";
import DeleteButton from "../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";

const ApproveDocument = ({ setApproveDocument, setWantCancelDocument }) => {
  const [t] = useTranslation("Preview");
  const [openPopupIndex, setOpenPopupIndex] = useState(null); 

  const close = () => {
    setApproveDocument(false);
  };


  const [documents, setDocuments] = useState([
    { img: wolters, state: t("voided"), typeBill: "" },
    { img: wolters, state: t("voided"), typeBill: "" },
  ]);

  const handleOptionDotsClick = (index) => {

    setOpenPopupIndex(index);
  };

  const handleTypeBillChange = (index, option) => {

    const updatedDocuments = [...documents];
    updatedDocuments[index].typeBill = option;
    setDocuments(updatedDocuments);
  };

  return (
    <div>
      <div>
        <ModalBlackBgTemplate
          close={close}
          customStyle={{
            maxHeight: "fit-content",
            minHeight: "fit-content",
            width: "600px",
          }}
        >
          <HeaderCard
            title={t('approvedDocument')}
            setState={setApproveDocument}
          >
            <Button action={() => setWantCancelDocument(true)} type="white">
              <BlackLock /> {t('cancelDocument')}
            </Button>
            <Button action={() => setApproveDocument(true)}>{t('approve')}</Button>
          </HeaderCard>
          <div className={styles.cancelledDocuments}>
            <div className={styles.documents}>
              {documents.map((document, index) => (
                <div key={index} className={styles.document}>
                  <img src={document.img} alt="" />
                  {document.state}
           

                  <OptionDots
                    onClick={() => handleOptionDotsClick(index)}
                    className={styles.OptionDots}
                  />

                  {openPopupIndex === index && (
                    <div className={styles.optionsPopupContainer}>
                      <OptionsPopup
                        close={() => setOpenPopupIndex(null)}
                        options={[
                          {
                            label: (
                              <div className={styles.optionsPopupOption}>
                                {t('invalidate')}
                                <DeleteButton />
                              </div>
                            ),
                            onClick: () => {},
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.errors}>
              <p>{t('errors')}</p>
              <span>{t('noErrors')}</span>
            </div>
          </div>
        </ModalBlackBgTemplate>
      </div>
    </div>
  );
};

export default ApproveDocument;
