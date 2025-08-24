import React, { useState, useRef, useEffect } from "react";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import styles from "./NewTable.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import EditableInput from "../AccountSettings/EditableInput/EditableInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { useDispatch } from "react-redux";

import { ReactComponent as IconContact } from "../HomeExplorer/assets/icon-contact.svg";
import { ReactComponent as IconAsset } from "../HomeExplorer/assets/icon-asset.svg";
import { ReactComponent as IconDocs } from "../HomeExplorer/assets/icon-doc.svg";
import { setShowModal } from "../../../../slices/userSlices";
import NewTag from "../NewTag/NewTag";
import { ReactComponent as GrayTagIcon } from "../../assets/tagNewIcon.svg";
import { ReactComponent as TwoPeopleGreen } from "../../assets/TwoPeopleGreen.svg";
import { ReactComponent as PencilEdit } from "../../assets/pencilEdit.svg";
import DeleteButton from "../DeleteButton/DeleteButton";
import Columns from "./Columns";
import AccessPermit from "./AccessPermit";
import OptionsSwitchComponent from "../OptionsSwichComponent/OptionsSwitchComponent";
import { createTable, getTableDataFiltered, getTables, getTablesWithCounts } from "../../../../actions/user";


const NewTable = () => {
  const { t } = useTranslation("navbarAdmin");
  const dispatch = useDispatch();
  const colorInputRef = useRef(null);
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [tableData, setTableData] = useState({
    name: "",
    type: "contacts",
    columns: "",
    AccessPermitType: "private",
  });

  // Objeto con todos los iconos
  const iconMap = {
    contacts: <IconContact />,
    assets: <IconAsset />,
    docs: <IconDocs />,
  };


  // Mapeo entre traducciones y valores en inglés
  const typeTranslationMap = {
    [t("contacts")]: "contacts",
    [t("assets")]: "assets",
    [t("docs")]: "docs",
  };

  // Mapeo inverso para mostrar la traducción
  const typeValueMap = {
    "contacts": t("contacts"),
    "assets": t("assets"),
    "docs": t("docs"),
  };

  // Opciones para los dropdowns (traducidas para mostrar al usuario)
  const typeOptions = [t("contacts"), t("assets"), t("docs")];
  const columnsOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const close = () => {
    dispatch(setShowModal(false));
  };

  const handleChange = (e) => {
    setTableData({
      ...tableData,
      [e.target.name]: e.target.value,
    });
  };

  // console.log("tableData", tableData);

  const handleTypeChange = (selectedType) => {
    // Convertir la traducción seleccionada a su valor en inglés
    const englishValue = typeTranslationMap[selectedType];
    setTableData({
      ...tableData,
      type: englishValue,
    });
  };

  const handleColumnsChange = (selectedColumns) => {
    setTableData({
      ...tableData,
      columns: selectedColumns,
    });
  };

  const handleColorClick = () => {
    colorInputRef.current?.click();
  };
  const getSelectedIcon = () => {
    return iconMap[tableData.type];
  };
  console.log("tableData", tableData);

  useEffect(() => {
    setTableData((prev) => ({
      ...prev,
      selectedTags: selectedTags,
      tags: tags,
    }));
  }, [selectedTags, tags]);

  const handleSave = async () => {
    console.log("tableData", tableData);
      await dispatch(
        createTable({ headers: tableData.columns,
           name: tableData.name,
            type: tableData.type, 
            color: tableData.color, 
            selectedTags: tableData.selectedTags,
             userEmail: tableData.userEmail, 
             activateAlerts: tableData.activateAlerts,
             accessPermitType: tableData.AccessPermitType,
             selectedColumnOption: tableData.selectedColumnOption,
             tags: tableData.tags })
      );
      let tables = [];

      const res = await dispatch(getTables());
      if (res.payload?.tables) {
        console.log("res.payload.tables", res.payload.tables)
        tables = res.payload.tables;
      }
      console.log("tables", tables);

    if (tables.length > 0) {
      for (let table of tables) {
        await dispatch(
          getTableDataFiltered({
            tableId: table._id,
          })
        );
      }
    }
    await dispatch(getTablesWithCounts())
      close();
  };


  return (
    <>
      <ModalBlackBgTemplate
        customStyle={{
          maxWidth: "500px",
          width: "90%",
          margin: "40px auto",
          height: "60vh",
          maxHeight: "60vh",
          minHeight: "60vh",
        }}
        close={close}
      >
        <HeaderCard title={t("newTable")} setState={close}>
          <Button action={close} type="white">{t("cancel")}</Button>
          <Button action={handleSave}>{t("save")}</Button>
        </HeaderCard>

        <div className={styles.newTableContainer}>
          <div className={styles.newTableContent}>
            {/* Campo Nombre */}
            <div className={styles.fieldContainer}>
              <p className={styles.fieldLabel}>{t("tableName")}</p>
              <input
                type="text"
                name="name"
                value={tableData.name}
                onChange={handleChange}
                className={styles.fieldInput}
                placeholder="Ingrese el nombre de la tabla"
              />
            </div>

            {/* Campo Tipo */}
            <div className={styles.fieldContainer}>
              <div>
                <p className={styles.fieldLabel}>{t("tableType")}</p>
                <div className={styles.typeContainer}>
                  <div className={styles.dropdownTypeContainer}>
                    {getSelectedIcon()}
                                         <CustomDropdown
                       options={typeOptions}
                       selectedOption={typeValueMap[tableData.type] || t("contacts")}
                       setSelectedOption={handleTypeChange}
                       placeholder="Seleccione el tipo"
                     />
                  </div>
                  <div>
                    <div
                      onClick={handleColorClick}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: tableData.color || "#cccccc",
                        border: "2px solid #e0e0e0",
                        cursor: "pointer",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                      }}
                      title="Seleccionar color"
                    />
                    <span style={{ fontSize: "13px", color: "#555" }}>
                      {tableData.color
                        ? tableData.color.toUpperCase()
                        : "#CCCCCC"}
                    </span>
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={tableData.color || "#cccccc"}
                      onChange={(e) => {
                        setTableData({ ...tableData, color: e.target.value });
                      }}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                        width: "1px",
                        height: "1px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

        
            <div className={styles.fieldContainer}>
              <p className={styles.fieldLabel}>{t("addTags")}</p>
              <div className={styles.addTagsContainer}>
                <Button type="grayp" headerStyle={{borderRadius:"999px"}} action={() => setShowAddTags(true)}>
                  <GrayTagIcon className={styles.tagIcon}/>
                </Button>
                {tableData.selectedTags &&
                  tableData.selectedTags.length > 0 && (
                    <div
                      className={styles.tagsContainer}
                    >
                      {tableData.selectedTags.map((tag, idx) => {
                        // Calcula un color de fondo más claro basado en el color original del tag
                        // Esta función simple mezcla el color con blanco para aclararlo
                        function aclararColor(hex, porcentaje = 0.7) {
                          let r = parseInt(hex.slice(1, 3), 16);
                          let g = parseInt(hex.slice(3, 5), 16);
                          let b = parseInt(hex.slice(5, 7), 16);

                          r = Math.round(r + (255 - r) * porcentaje);
                          g = Math.round(g + (255 - g) * porcentaje);
                          b = Math.round(b + (255 - b) * porcentaje);

                          return `rgb(${r}, ${g}, ${b})`;
                        }

                        const backgroundColorClaro = aclararColor(tag.color || "#cccccc", 0.7);

                        return (
                          <span
                            key={tag.id}
                            className={styles.tagItem}
                            style={{
                              backgroundColor: backgroundColorClaro,
                              color: tag.color,
                            }}
                          >
                            <p
                              style={{ marginRight: "6px", fontWeight: "bold",color: tag.color, }}
                            >
                              {tag.name}
                            </p>
                            <span
                              onClick={() => {
                                const nuevasTags = tableData.selectedTags.filter(
                                  (_, i) => i !== idx
                                );
                                setSelectedTags(nuevasTags);
                                setTableData({
                                  ...tableData,
                                  selectedTags: nuevasTags,
                                });
                              }}
                            >
                              ×
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>

    {/* Campo Columnas */}
<Columns tableData={tableData} setTableData={setTableData} columnsOptions={columnsOptions}/>
<AccessPermit tableData={tableData} setTableData={setTableData}/>

<div className={`${styles.fieldContainer} ${styles.invitationContainer}`}>
<div className={styles.inputContainer}>
                <TwoPeopleGreen />
                <input
                  type="text"
                  name="userEmail"
                  placeholder="example@gmail.com"
                  value={tableData?.userEmail}
                  onChange={handleChange
                    // handleChange({
                    //   name: "userEmail",
                    //   newValue: e.target.value,
                    // })
                  }
                />
              </div>
              <Button headerStyle={{borderRadius:"999px"}}> {t('invite')}</Button>
</div>

<div className={styles.activateAlertsContainer}>
<OptionsSwitchComponent
              border="none"
              marginLeft="0"
              isChecked={tableData.activateAlerts === "public"}
              blackBg={true}
              setIsChecked={(isChecked) =>
                setTableData((prev) => ({
                  ...prev,
                  activateAlerts: isChecked ? "public" : "private",
                }))
              }
            />
            <p>{t("activateAlerts")}</p>
</div>
          </div>
        </div>
      </ModalBlackBgTemplate>
      {showAddTags && (
        <NewTag
          setShowNewTagModal={setShowAddTags}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          setTags={setTags}
          tags={tags}
        />
      )}
    </>
  );
};

export default NewTable;
