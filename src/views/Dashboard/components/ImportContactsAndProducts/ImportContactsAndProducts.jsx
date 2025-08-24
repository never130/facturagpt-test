import React, { useRef, useState } from "react";
import styles from "./ImportContactsAndProducts.module.css";
import { ReactComponent as DownloadIcon } from "../../assets/uploadIconGreen.svg";
import { ReactComponent as FileIcon } from "../../assets/xlsxIcon.svg";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import * as XLSX from "xlsx";
import DeleteButton from "../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";

const formatFileSize = (size) => {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`; 
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`; 
  }
};

const ImportContactsAndProducts = ({
  state,
  text, 
  isAnimating,
  quantity,
  data,
  selectedOption,
  selectedData,
}) => {
  const [t] = useTranslation("Contacts");
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dataFile, setDataFile] = useState([]);
  const [messageInput, setMessageInput] = useState(t("selectOrDragYourFile"));
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDataRow, setSelectedDataRow] = useState([]);
  const [fileInfo, setFileInfo] = useState("");



  const handleButtonClick = () => {
    if (uploadedFile) {
      setUploadedFile(null);
      setFileInfo(null);
      setMessageInput(t("selectOrDragYourFile")); 
      setDataFile([]);
      setSelectedRows([]);
    } else {
      fileInputRef.current.click(); 
    }
  };
  const validateFirstRow = (firstRow, text) => {
    if (text === t("contacts")) {
      const requiredContactFields = [
        t("ID"),
        t("contactName"),
        t("compayPhoneNumber"),
      ];
      const hasRequiredFields = requiredContactFields.every((field) => {
        return firstRow.includes(field);
      });

      if (!hasRequiredFields) {
        alert(t("fileMustContainColumnsContacts"));
        return false;
      }
    } else if (text === t("assets")) {
      const requiredAssetFields = [
        t("code"),
        t("nameOrDescription"),
        t("quantity"),
      ];
      const hasRequiredFields = requiredAssetFields.every((field) => {
        return firstRow.includes(field);
      });
      if (!hasRequiredFields) {
        alert(t("fileMustContainColumnsAssets"));
        return false;
      }
    } else if (text === t("transactions")) {
      const requiredTransactionFields = [t("ID"), t("date")];
      const hasRequiredFields = requiredTransactionFields.every((field) => {
        return firstRow.includes(field);
      });
      if (!hasRequiredFields) {
        alert(t("fileMustContainColumnsTransactions"));
        return false;
      }
    }
    return true;
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validExtension =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (file.type !== validExtension) {
        alert(t("pleaseSelectXlsxEstension"));
        event.target.value = ""; 
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; 
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const firstRow = jsonData[0];
        if (!validateFirstRow(firstRow, text)) {
          event.target.value = ""; 
          return;
        }

        const nonEmptyRows = jsonData.filter((row) =>
          row.some((cell) => cell !== null && cell !== undefined && cell !== "")
        );
        setDataFile(nonEmptyRows);
        if (nonEmptyRows.length === 0) {
          setFileInfo(t("fileContainsNoInformation"));
          event.target.value = ""; 
          return;
        }
        setDataFile(nonEmptyRows);

        setUploadedFile({ name: file.name, size: file.size });
        setFileInfo(
          `${file.name}, ${t("haveBeenFound")} ${nonEmptyRows.length - 1} ${text}`
        );
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      const validExtension =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (file.type !== validExtension) {
        alert(t("pleaseDragAndDropXlsxExtension"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; 
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const firstRow = jsonData[0];
        if (!validateFirstRow(firstRow, text)) {
          return;
        }

        const nonEmptyRows = jsonData.filter((row) =>
          row.some((cell) => cell !== null && cell !== undefined && cell !== "")
        );

        if (nonEmptyRows.length === 0) {
          setFileInfo(t("fileContainsNoInformation"));
          return;
        }
        setDataFile(nonEmptyRows);
        setUploadedFile({ name: file.name, size: file.size });
        setFileInfo(
          `${file.name}, ${t("haveBeenFound")} ${nonEmptyRows.length - 1} ${text}`
        );
      };

      reader.readAsArrayBuffer(file);
    }
  };
  const getFilePath = (text) => {
    switch (text) {
      case t("assets"):
        return require("../../assets/Plantillas/TemplateProductos.xlsx");
      case t("contacts"):
        return require("../../assets/Plantillas/TemplateContactos.xlsx");
      default:
        return null;
    }
  };

  const filePath = getFilePath(text);

  const handleDownload = () => {
    if (filePath) {
      const link = document.createElement("a");
      link.href = filePath;
      link.download = `muestra-${text}.xlsx`;
      link.click();
    } else {
      alert(t("noSampleFile"));
    }
  };

  const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
      let aValue, bValue;

      
      if (a.clientName) {
        aValue = a.clientName;
        bValue = b.clientName;
      }
      
      else if (a.productDescription) {
        aValue = a.productDescription[0];
        bValue = b.productDescription[0];
      }
      
      else if (a.doc && a.doc.totalData && a.doc.totalData.description) {
        aValue = a.doc.totalData.description[0];
        bValue = b.doc.totalData.description[0];
      }

      
      if (selectedOption["Orden Alfabético"] === "A-Z") {
        return aValue?.localeCompare(bValue);
      } else if (selectedOption["Orden Alfabético"] === "Z-A") {
        return bValue?.localeCompare(aValue);
      }

      return 0; 
    });

    return sortedData;
  };

  const handleDownloadExcel = () => {
    const dataNew = selectedData?.length >= 1 ? selectedData : data;
    let filteredData = dataNew;

    filteredData = sortData(filteredData);
    const formattedData = filteredData.map((item) => {
      if (text === t("contacts")) {
        
        return {
          [t("ID")]: item._id,
          [t("contactName")]: item.contactName,
          [t("email")]: Array.isArray(item.email)
            ? item.email.join(", ")
            : item.email,
          [t("compayPhoneNumber")]: item.companyPhoneNumber,
          [t("companyAddres")]: item.companyAddress,
          [t("taxNumber")]: item.contactCif,
          [t("cardNumber")]: item.cardNumber,
          [t("preferredCurrency")]: item.preferredCurrency,
          [t("state")]: item.state,
        };
      } else if (text === t("assets")) {
        
        return {
          [t("ID")]: item._id,
          [t("nameOrDescription")]: item.name,
          [t("productDescription")]: item.description,
          [t("supplier")]: item?.supplier_name,
          [t("code")]: item?.code,
          [t("category")]: item?.category,
          [t("quantity")]: item.quantity,
          [t("generated")]: item.generated,
          [t("maxPrice")]: item.maxPrice,
          [t("minPrice")]: item.minPrice,
          [t("averagePrice")]: item.averagePrice,
        };
      } else if (text === t("transactions")) {
        
        return {
          [t("ID")]: item._id,
          [t("date")]: item.date,
          [t("year")]: item.year,
          [t("month")]: item.month,
          [t("day")]: item.day,
          [t("number")]: item.number,
          [t("total")]: item.total,
          [t("discount")]: item.discount,
          [t("partial")]: item.partial,
          [t("tax")]: item.tax,
        };
      }
      return {}; 
    });

    
    const ws = XLSX.utils.json_to_sheet(formattedData);

    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, text); 

    
    XLSX.writeFile(wb, `${text}_data.xlsx`);
  };

  const handleRowSelect = (rowIndex) => {
    setSelectedRows((prevSelected) => {
      const newSelected = prevSelected.includes(rowIndex)
        ? prevSelected.filter((index) => index !== rowIndex)
        : [...prevSelected, rowIndex];

      const newData = newSelected.map((index) => dataFile[index + 1]); 
      setSelectedDataRow(newData);
      return newSelected;
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allSelected = dataFile.slice(1).map((_, index) => index);
      setSelectedRows(allSelected);
      setSelectedDataRow(dataFile.slice(1)); 
    } else {
      setSelectedRows([]);
      setSelectedDataRow([]); 
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.bg} onClick={() => state(false)}></div>

      <div
        className={`${styles.importContainer}  ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        <HeaderCard title={`${t('import')} ${text}`} setState={state}>
          <Button type="white" action={() => setShowDiscardChange(true)}>
            {t("cancel")}
          </Button>
          {uploadedFile ? (
            <Button>{t("import")}</Button>
          ) : (
            <Button action={handleDownloadExcel}>
              {t("export")} (
              {selectedData?.length >= 1 ? selectedData?.length : quantity})
            </Button>
          )}
        </HeaderCard>
        <div className={styles.importContent}>
          <div className={styles.dropZoneContainer}>
            <div
              className={`${styles.dropZone} ${dragging ? styles.dragging : ""}`}
              onClick={handleButtonClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <DownloadIcon />
              <button type="button" className={styles.uploadButton}>
                {uploadedFile ? t("cancel") : t("uploadFile")}
              </button>
              <p>{messageInput}</p>
              <input
                type="file"
                ref={fileInputRef}
                className={styles.hiddenInput}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
              />
            </div>
            <div className={styles.infoFile}>
              {fileInfo && <span>{fileInfo}</span>}
              {uploadedFile && (
                <div className={styles.fileInfoName}>
                  <p><FileIcon/>{uploadedFile.name} </p>
                  <div>
                    {formatFileSize(uploadedFile.size)}
                    <DeleteButton
                      action={(e) => {
                        e.stopPropagation();
                        handleButtonClick();
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={styles.tableDataFiles}>
              {dataFile && dataFile?.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            selectedRows?.length === dataFile.slice(1)?.length
                          }
                        />
                      </th>
                      {dataFile[0].map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataFile.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(rowIndex)}
                            onChange={() => handleRowSelect(rowIndex)}
                          />
                        </td>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <p className={styles.descText} onClick={handleDownload}>
            <strong>{t("downlaodSimpleXlsxFile")}</strong> <span>{t('toSeeFormatImportation')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportContactsAndProducts;
