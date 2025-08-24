import React, { useState } from 'react'
import LabelParameters from "../LabelParameters";
import ContactsPopup from "../../ContactsPopup/ContactsPopup";
import { useTranslation } from "react-i18next";
import styles from "../CreateParameterPopup.module.css";
import imageEmpty from '../../../assets/ImageEmpty.svg'
import {ReactComponent as SearchGray} from '../../../assets/searchGray.svg'
import { FaChevronDown } from "react-icons/fa";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import DeleteButton from "../../DeleteButton/DeleteButton";
import CustomDropdown from '../../CustomDropdown/CustomDropdown';
import DropdownFlags from '../../GeneralSettings/components/DropdownFlags/DropdownFlags';
const languageType = ({
    parameterData,
    setParameterData,
    handleChange,
    editingInput,
    setEditingInput,
  }) => {
    const [t] = useTranslation("Contacts");
    const [editing, setEditing] = useState(false);

  return (
    <div>
          {/* <LabelParameters
      value={parameterData.language}
      text={"language"}
      editingInput={editingInput}
      setEditingInput={setEditingInput}
    > */}
        <p className={styles.textContent}>{t("language")}</p>
     <div className={styles.languageContainer}>
     <DropdownFlags
            selectedCountry={parameterData?.language}
            setSelectedCountry={(option) => setParameterData((prev) => ({
                ...prev,
                language:option
            }))}
            editing={editing}
            type="language"
            accountDefault={true}
          />
          <PencilEdit onClick={() => setEditing((prev) => !prev)}/>
     </div>
    {/* </LabelParameters> */}
    </div>
  )
}

export default languageType