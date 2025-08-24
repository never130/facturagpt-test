import React from "react";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import styles from "./CancelDocument.module.css";
import { ReactComponent as WhiteLock } from "../../assets/WhiteLock.svg";
import { useTranslation } from "react-i18next";
const WantCancelDocument = ({ setWantCancelDocument }) => {
  const [t] = useTranslation('Preview')
  const close = () => {
    setWantCancelDocument(false);
  };
  return (
    <div>
      <div>
        {" "}
        <div>
          <ModalBlackBgTemplate close={close} customStyle={{ width: "700px" }}>
            <HeaderCard
              title={t('wantCancelDocument')}
              setState={setWantCancelDocument}
            >
              <Button type="white">{t('discard')}</Button>
              <Button type="discard">
                {t('annular')} <WhiteLock />{" "}
              </Button>
            </HeaderCard>
            <div className={styles.wantCancellDocument}>
              {t('deletedWithin30Days')}
            </div>
          </ModalBlackBgTemplate>
        </div>
      </div>
    </div>
  );
};

export default WantCancelDocument;
