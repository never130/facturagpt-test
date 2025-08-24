import React, { useState } from "react";
import styles from "./SelectCategoryAndConcept.module.css";
import { ReactComponent as AddnoteGray } from "../../../../assets/addNoteGray.svg";
import AiIcon2 from "../../../../assets/AIcon.svg";
import { FaChevronDown } from "react-icons/fa";
import imageIcon from "../../../../assets/imageIcon.svg";
import { useTranslation } from "react-i18next";
import VariableListModal from "../../../VariableListModal/VariableListModal";
import VariableModal from "../../../VariableModal/VariableModal";
import CurrencyDropdownBtn from "../../../CurrencyDropdownBtn/CurrencyDropdownBtn";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserFiles,
  updateNameFileS3,
} from "../../../../../../actions/scaleway";

const SelectCategoryAndConcept = ({  typeVariableModal, setTypeVariableModal,
  showVariableListModal, setShowVariableListModal,
  showVariableModal, setShowVariableModal}) => {
  const { t } = useTranslation('InvoiceForm');
  const dispatch = useDispatch();
  const [styleFixed, setStyleFixed] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showSelectCurrencyPopup, setShowSelectCurrencyPopup] = useState(false);

  const { user } = useSelector((state) => state.user);

  const [fileNameS3, setFileNameS3] = useState("");
  const [selectedFileS3, setSelectedFileS3] = useState({});

  return (
    <header className={styles.header}>
      <div className={styles.dropdownContainer}>
        <div className={styles.dropdownsLeft}>
          <div
            className={styles.dropdown}
            onClick={() => {
              setTypeVariableModal("category");
              setShowVariableListModal(true);
            }}
          >
            <p>
            {t("selectCategory")}{" "}
            <img src={AiIcon2} alt="Icono" height={"15px"} />{" "}
            </p>
            <FaChevronDown className={styles.chevronIcon} />
          </div>
          <div
            className={styles.dropdown}
            onClick={() => {
              setTypeVariableModal("concept");
              setShowVariableListModal(true);
            }}
          >
            {t("concept")}
            <FaChevronDown className={styles.chevronIcon} />
          </div>
        </div>
      </div>
      {showVariableListModal && (
        <VariableListModal
          type={typeVariableModal}
          setShowVariableListModal={setShowVariableListModal}
          setShowVariableModal={setShowVariableModal}
          fromAutomateOut={"SelectCategoryAndConcept"}
        />
      )}
    </header>
  );
};

export default SelectCategoryAndConcept;
