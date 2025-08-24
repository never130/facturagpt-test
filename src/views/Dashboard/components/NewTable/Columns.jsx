import React, { useState } from 'react'
import styles from './NewTable.module.css'
import { useTranslation } from 'react-i18next'
import CustomDropdown from '../CustomDropdown/CustomDropdown'
import Button from '../Button/Button'
import { ReactComponent as PencilEdit } from "../../assets/pencilEdit.svg";
import DeleteButton from '../DeleteButton/DeleteButton'

const Columns = ({tableData,setTableData,columnsOptions}) => {
    const {t} = useTranslation()
    const [showAllColumns, setShowAllColumns] = useState(false)
    
    // Determinar cuántas columnas mostrar
    const columnsToShow = showAllColumns 
      ? tableData.columns 
      : tableData.columns.slice(0, 4)
    
    const hasMoreColumns = tableData.columns.length > 4

  return (
    <div className={styles.fieldContainer}>
    <p className={styles.fieldLabel}>{t("columns")}</p>
    <CustomDropdown
      options={columnsOptions}
      selectedOption={tableData.selectedColumnOption || ""}
      setSelectedOption={(selectedOption) => {
        setTableData({
          ...tableData,
          selectedColumnOption: selectedOption,
        });
      }}
      placeholder={t("searchParameter")}
    />
    <Button
      type="white"
      headerStyle={{ borderRadius: "999px" }}
      action={() => {
        // Creamos un nuevo objeto columna
        const nuevaColumna = {
          title: `${t('parameter')} ${tableData.columns.length + 1}` || "",
          key: `${t('parameter')} ${tableData.columns.length + 1}` || "",
          label: `${t('parameter')} ${tableData.columns.length + 1}` || "",
          type: "", // Puedes cambiar el tipo según lo que necesites
          selected: false,
        };
        // Si columns no es un array, lo inicializamos
        const columnasActuales = Array.isArray(tableData.columns)
          ? tableData.columns
          : [];
        setTableData({
          ...tableData,
          columns: [...columnasActuales, nuevaColumna],
          selectedColumnOption: "", // Limpiamos la selección
        });
      }}
    >
      {t("addColumn")}
    </Button>
    {/* Renderizar las columnas agregadas */}
    {Array.isArray(tableData.columns) && tableData.columns.length > 0 && (
      <div className={styles.columnsContainer}>
        {columnsToShow.map((col, idx) => (
          <div key={idx} className={styles.columnItem}>
          <div>
          <input
              type="checkbox"
              checked={!!col.selected}
              onChange={e => {
                const nuevasColumnas = tableData.columns.map((c, i) =>
                  i === idx ? { ...c, selected: e.target.checked } : c
                );
                setTableData({
                  ...tableData,
                  columns: nuevasColumnas,
                });
              }}
            />
            {/* <span >{col.title}</span> */}
            {col.editing ? (
              <input
                type="text"
                value={col.title}
                autoFocus
                onChange={e => {
                  const nuevasColumnas = tableData.columns.map((c, i) =>
                    i === idx ? { ...c, title: e.target.value, key: e.target.value, label: e.target.value } : c
                  );
                  setTableData({
                    ...tableData,
                    columns: nuevasColumnas,
                  });
                }}
                onBlur={() => {
                  const nuevasColumnas = tableData.columns.map((c, i) =>
                    i === idx ? { ...c, editing: false } : c
                  );
                  setTableData({
                    ...tableData,
                    columns: nuevasColumnas,
                  });
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    const nuevasColumnas = tableData.columns.map((c, i) =>
                      i === idx ? { ...c, editing: false } : c
                    );
                    setTableData({
                      ...tableData,
                      columns: nuevasColumnas,
                    });
                  }
                }}
                className={styles.fieldInput}
              />
            ) : (
              <>
                <span>{col.title}</span>
                <PencilEdit
                  className={styles.pencilEdit}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const nuevasColumnas = tableData.columns.map((c, i) =>
                      i === idx ? { ...c, editing: true } : c
                    );
                    setTableData({
                      ...tableData,
                      columns: nuevasColumnas,
                    });
                  }}
                />
              </>
            )}
          </div>
          <DeleteButton type="grey"
          customStyleAssetLine={{width:"20px",height:"20px"}} action={() => {
              const nuevasColumnas = tableData.columns.filter((_, i) => i !== idx);
              setTableData({
                ...tableData,
                columns: nuevasColumnas,
              });
            }}/>
            {/* <span style={{ color: "#888" }}>{col.type}</span> */}
          </div>
        ))}
        
        {/* Botón para mostrar más/menos columnas */}
        {hasMoreColumns && (
          <div className={styles.showMoreContainer}>
            <p
              onClick={() => setShowAllColumns(!showAllColumns)}
            >
              {showAllColumns ? t("showLess") : t("showMore")}
            </p>
          </div>
        )}
      </div>
    )}
  </div>
  )
}

export default Columns