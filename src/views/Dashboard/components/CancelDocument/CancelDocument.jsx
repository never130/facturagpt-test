import React from "react";
import styles from "./CancelDocument.module.css";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import wolters from "../../assets/wolters-icon.svg";
import useCloseOnEsc from "../../../../utils/useClose";

const CancelDocument = ({ setCancelDocument }) => {
  const [t] = useTranslation('Preview')

  const close = () => {
    setCancelDocument(false);
  };
  const documents = [
    { img: wolters, state: t('voided') },
    { img: wolters, state: t('voided') },
  ];
  useCloseOnEsc(setCancelDocument)

  return (
    <div>
      {" "}
      <div>
        <ModalBlackBgTemplate close={close} customStyle={{maxHeight:"fit-content",minHeight:"fit-content",width:"70vw"}}>
          <HeaderCard title={t('canceledDocument')} setState={setCancelDocument}>
            <Button action={() => setCancelDocument(false)}>{t('acept')}</Button>
          </HeaderCard>
          <div className={styles.cancelledDocuments}>
            <div className={styles.documents}>
              {documents.map((document) => (
                <div className={styles.document}>
                  <img src={document.img} alt="" />
                  {document.state}
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

export default CancelDocument;
