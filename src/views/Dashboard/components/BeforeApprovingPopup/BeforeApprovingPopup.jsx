import React, { useState } from "react";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import styles from "./BeforeApprovingPopup.module.css";
import Button from "../Button/Button";
import { ReactComponent as CheckedGreenLockBlackIcon } from "../../assets/checkedGreenLockBlackIcon.svg";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import useCloseOnEsc from "../../../../utils/useClose";
import { useTranslation } from "react-i18next";

const BeforeApprovingPopup = ({
  setBeforeApproveDocument,
  setApproveDocument,
  icons,
  selectedOption,
  setSelectedOption,
  selectedColor,
  setSelectedColor,
  setIcon,
  fnUpDateDoc
}) => {
  const [t] = useTranslation('Preview')
  const close = () => {
    setBeforeApproveDocument(false);
  };

  useCloseOnEsc(setBeforeApproveDocument)

  const [stateStripe, setStateStripe] = useState(selectedOption);
  const [selectedColorPopup, setSelectedColorPopup] = useState(selectedColor)
  const [localIcon, setLocalIcon] = useState(null)
  const [intermediateFunction, setIntermediateFunction] = useState()


  const options=[
    t("Paid"),
    t("pending"),
    t("defaulted"),
    t("due"),
    t("voided"),
  ]

  const iconsSvg = [<CheckedGreenLockBlackIcon />,
    <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none" stroke="#FF9D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock3-icon lucide-clock-3"><circle style={{ stroke: '#FF9D00' }} cx="44" cy="44" r="37"/><polyline points="44 22 44 44 60 44"/></svg>
  ,<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 48 48" fill="none" stroke="#ff5500" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert">
  <path d="m43.46 36-16-28a4 4 0 0 0-6.96 0l-16 28A4 4 0 0 0 8 42h32a4 4 0 0 0 3.46-6"/>
  <path d="M24 18v8"/>
  <path d="M24 34h.01"/>
</svg>,
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none" stroke="#c5221f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x">
  <circle style={{ stroke: '#c5221f' }} cx="44" cy="44" r="37"/>
  <path d="M58 30 L30 58"/>
  <path d="M30 30 L58 58"/>
</svg>,
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 48 48" fill="none" stroke="#8a0300" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2">
  <path d="M6 12h36"/>
  <path d="M38 12v28c0 2-2 4-4 4H14c-2 0-4-2-4-4V12"/>
  <path d="M16 12V8c0-2 2-4 4-4h8c2 0 4 2 4 4v4"/>
  <line x1="20" x2="20" y1="22" y2="34"/>
  <line x1="28" x2="28" y1="22" y2="34"/>
</svg>
  ]

  return (
    <div>
      <ModalBlackBgTemplate
        close={close}
        customStyle={{
          maxHeight: "fit-content",
          minHeight: "fit-content",
          width: "600px",
          overflow:"initial"
        }}>
        <HeaderCard
          title={t('InformationBeforeApprove')}
          setState={setBeforeApproveDocument}
        >
          <Button action={() => {
            setApproveDocument(true)
            setBeforeApproveDocument(false)
            setSelectedOption(stateStripe)
            setSelectedColor(selectedColorPopup)
            fnUpDateDoc(intermediateFunction)
            localIcon !== null && setIcon(localIcon)
          }}>{t('approve')}</Button>
        </HeaderCard>
        <div className={styles.BeforeApproving}>
        {iconsSvg[options.indexOf(stateStripe)]}
          <p>
            {" "}
            {t("yourDocumentIs")} <span className={styles.draft}>{t('draft')}</span>,
            {t('changeTheStatus')} <span className={styles.paid}>{t('Paid')}</span>{" "}
            {t('haveAnImpact')}
          </p>
          <p>{t('wantChangeStatus')}</p>
          <div className={styles.dropdownContainer}>
            <CustomDropdown
              editable={true}
              editing={true}
              scrollDropdown={true}
              heightScroll={"80px"}
              icons = {icons}
              options={options}
              stateStripe={true}
              selectedOption={stateStripe}
              setSelectedOption={(option) => {
                                  setStateStripe(option);
                                }}
              selectedColor={selectedColorPopup}
              setSelectedColor={setSelectedColorPopup}
              father={'BeforeApprovingPopup'}
              setIcon={setLocalIcon}
              fnUpDateDoc={setIntermediateFunction}
            />
          </div>
     
        </div>
      </ModalBlackBgTemplate>
    </div>
  );
};

export default BeforeApprovingPopup;
