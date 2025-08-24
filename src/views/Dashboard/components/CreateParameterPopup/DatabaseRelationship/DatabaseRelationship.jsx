import React from "react";
import styles from "../CreateParameterPopup.module.css";
import EditableField from "../components/EditableField";
import { t } from "i18next";
import Button from "../../Button/Button";
import { ReactComponent as IconHelp } from "../../../assets/HelpExclamationIcon.svg";
import { ReactComponent as IconAdvertency } from "../../../assets/GreenExclamationIcon.svg";
import { ReactComponent as IconGmailCircle } from "../../../assets/gmailwithoutbg.svg";
import { ReactComponent as IconOutlookCircle } from "../../../assets/outlook-icon.svg";
import { ReactComponent as IconWhatsappCircle } from "../../../assets/whatsapp-icon-green.svg";
import { ReactComponent as IconRelationFieldToField } from "../../../assets/RelationFieldToFieldIcon.svg";
import { ReactComponent as IconClock } from "../../../assets/ClockTimerIcon.svg";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import ManyToManyRelationship from "./ManyToManyRelationship/ManyToManyRelationship";
import OneToMany from "./OneToMany/OneToMany";

const DatabaseRelationship = ({ parameterData, handleChange }) => {
  const databaseRelationship = [
    {
      type: t("oneToOne"),
      description: t("oneToOneDescription"),
      explanation: t("oneToOneExplanation"),
    },
    {
      type: t("oneToMany"),
      description: t("oneToManyDescription"),
      explanation: t("oneToManyExplanation"),
    },
    {
      type: t("manyToMany"),
      description: t("manyToManyDescription"),
      explanation: t("manyToManyExplanation"),
    },
  ];
  return (
    <div>
      <div className={styles.identifierContainer}>
        <EditableField
          title={t("identifier")}
          type="text"
          name="identifier"
          value={parameterData.identifier}
          onChange={handleChange}
          placeholder={t("tableNameVariableName")}
          toggleEdit={false}
        />
        <Button
          type="white"
          headerStyle={{ background: "transparent", border: "none" }}
        >
          {t("copy")}
        </Button>
      </div>

      <p className={styles.textContent}>{t("relationshipsType")}</p>
      <div className={styles.databaseRelationshipContainer}>
        {databaseRelationship.map((item, index) => (
          <div
            key={index}
            className={`${styles.databaseRelationshipItem} ${parameterData?.databaseRelationship === item.type ? styles.active : ""}`}
            //   onClick={() => handleChange({ name: "databaseRelationship", newValue: item.type })}
          >
            <div className={styles.databaseRelationshipItemHeader}>
              <div className={styles.databaseRelationshipOption}>
                <input
                  type="radio"
                  name="databaseRelationship"
                  value={item.type}
                  checked={parameterData?.databaseRelationship === item.type}
                  onChange={() =>
                    handleChange({
                      name: "databaseRelationship",
                      newValue: item.type,
                    })
                  }
                />
              </div>
              <p>{item.type}</p>
            </div>
            <span>{item.description}</span>
            <span>
              <IconHelp />
              {item.explanation}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.wantCreateWorkspace}>
           <div className={styles.wantCreateWorkspaceHeader}>
           <IconAdvertency />
            <div className={styles.wantCreateWorkspaceContent}>
              <p>{t("wantCreateWorkspace")}</p>
              <span>{t("wantCreateWorkspaceDescription")}</span>
              <div className={styles.wantCreateWorkspaceIcons}>
                <div>
                  <IconGmailCircle />
                </div>
                <IconOutlookCircle />
                <IconWhatsappCircle />
              </div>
            </div>
           </div>
            <Button>{t("yesCreateWorkspace")}</Button>
          </div>
      <BasicAdvancedSelector
        selectedMode={parameterData.modeRelationship || "basic"}
        onModeChange={(mode) =>
          handleChange({ target: { name: "modeRelationship", value: mode } })
        }
      />
      {parameterData.modeRelationship === "basic" ? (
        <div>
          {parameterData.databaseRelationship === t("oneToOne") && (
            <EditableField
              title={t("resultOneToOne")}
              type="text"
              name="result1OneToOne"
              value={parameterData.result1OneToOne}
              onChange={handleChange}
              placeholder={t("tableNameVariableName")}
              toggleEdit={false}
            />
          )}

          {parameterData.databaseRelationship === t("oneToMany") && (
            <EditableField
              title={t("resultOneToMany")}
              type="text"
              name="result1OneToMany"
              value={parameterData.result1OneToMany}
              onChange={handleChange}
              placeholder={`${t("tableNameVariableName")}+${t("tableNameVariableName")}`}
              toggleEdit={false}
            />
          )}

          {parameterData.databaseRelationship === t("manyToMany") && (
            <EditableField
              title={t("resultManyToMany")}
              type="text"
              name="resultManyToMany"
              value={parameterData.resultManyToMany}
              onChange={handleChange}
              placeholder={`(${t("tableNameVariableName")}+${t("tableNameVariableName")}) + ${t("tableNameVariableName")}+${t("tableNameVariableName")}`}
              toggleEdit={false}
            />
          )}

        
        </div>
      ) : (
        <div>
          {parameterData.databaseRelationship === t("oneToOne") && (
          <>
          <p className={styles.textContent}>{t("oneToOne")}</p>
            <div className={styles.relationshipDropdownContainer}>
              <div className={styles.relationshipDropdownIcon}>
                <IconClock />
              </div>
              <CustomDropdown
                editable={true}
                editing={true}
                options={[
                  t("length"),
                  t("weight"),
                  t("volumen"),
                  t("time"),
                  t("speed"),
                ]}
                selectedOption={parameterData?.oneToOneSelectedOption}
                setSelectedOption={(option) =>
                  handleChange({
                    name: "oneToOneSelectedOption",
                    newValue: option,
                  })
                }
                father={"automate"}
                placeholder={t("table/Variable")}
              />
            </div>
          </>
          )}

          {parameterData.databaseRelationship === t("oneToMany") && <OneToMany handleChange={handleChange} parameterData={parameterData}/>}

          {parameterData.databaseRelationship === t("manyToMany") && (
            <ManyToManyRelationship handleChange={handleChange} parameterData={parameterData}/>
          )}

          <div className={styles.relationFieldToField}>
<p>
              <IconRelationFieldToField />
  {t("relationFieldToField")}</p>
<ul>
  <li>{t("relationFieldToField1")}</li>
  <li>{t("relationFieldToField2")}</li>
  <li>{t("relationFieldToField3")}</li>
  <li>{t("relationFieldToField4")}</li>
</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseRelationship;
