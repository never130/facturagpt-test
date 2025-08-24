import React from "react";
import styles from "../InfoExploreCommunity.module.css";

const DocumentInfo = () => {
  return (
    <div className={styles.documentInfo}>
      <div className={styles.documentInfoName}>
        <h5>Nombre del bot</h5>
        <span>By Aythen</span>
      </div>
      <h6 className={styles.documentInfoPages}>nº de páginas</h6>
      <div className={styles.agentHeaderContent}>
        <div className={styles.agentInfoHeader}>
          <h4>4.5</h4>
          <span>Ratings (50K+)</span>
        </div>
        <div className={styles.agentInfoHeader}>
          <h4>#16</h4>
          <span>Categoria</span>
        </div>
        <div className={styles.agentInfoHeader}>
          <h4>35M+</h4>
          <span>Conversations</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;
