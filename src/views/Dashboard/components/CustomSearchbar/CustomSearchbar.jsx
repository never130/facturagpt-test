import React, { useRef, useState } from "react";
import styles from "./CustomSearchbar.module.css";
import FilesFilterModal from "../FilesFilterModal/FilesFilterModal";
import k from "../../assets/k.svg";
import searchMagnify from "../../assets/searchMagnify.svg";
import filterIcon from "../../assets/S3/filterIconBars.svg";
import useFocusShortcut from "../../../../utils/useFocusShortcut";

const CustomSearchbar = ({
  searchTerm,
  setSearchTerm,
  height = "35px",
  padding = "0px 9px",
  filter = false,
  father, 
  children = null,
  customStyle = {},
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "k");

  return (
    <div className={styles.searchContainer}>
      <div style={father == 'panelAutomate'?customStyle :{ height, padding }} className={styles.searchInputWrapper}>
        <div style={{ display: "flex", alignItems: "center" }}>
        <div className={styles.searchIcon}>
          <img src={searchMagnify} alt="searchMagnify" />
        </div>
        <input
          type="text"
          placeholder="Buscar automatización"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          ref={searchInputRef}
        />
        <div
          style={{ marginLeft: "5px" }}
          className={styles.searchIconsWrappers}
        >
          <img src={k} alt="kIcon" />
        </div>
        </div>
          {father == "panelAutomate" && children && (
        <div className={styles.childrenWrapper}>
          {children}
        </div>
      )}
      </div>
      {filter && (
        <img
          style={{ cursor: "pointer" }}
          onClick={() => setIsFilterOpen(true)}
          src={filterIcon}
          alt="filterIcon"
        />
      )}
      {isFilterOpen && (
        <FilesFilterModal
          onClose={() => setIsFilterOpen(false)}
          handleApplyFilters={() => {}}
        />
      )}
    
    </div>
  );
};

export default CustomSearchbar;
