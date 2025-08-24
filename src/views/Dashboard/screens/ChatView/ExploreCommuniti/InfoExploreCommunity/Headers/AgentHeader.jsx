import React from "react";
import styles from "../InfoExploreCommunity.module.css";

const AgentHeader = ({ data }) => {
  return (
    <div className={styles.agentHeader}>
      <div className={styles.agentHeaderImage}>
        {data?.image ? (
          <img src={data?.image} alt="AgentImage" />
        ) : (
          <div className={styles.imageAgentDefault}></div>
        )}
      </div>
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

export default AgentHeader;
