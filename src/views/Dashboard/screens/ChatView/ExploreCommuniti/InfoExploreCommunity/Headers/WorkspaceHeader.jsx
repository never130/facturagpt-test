import React from 'react'
import styles from '../InfoExploreCommunity.module.css'

const WorkspaceHeader = ({data}) => {
  return (
    <div className={styles.workspaceHeader}>
    <div className={styles.workspaceHeaderImage}>
      {data?.image ? (
        <img src={data?.image} alt="AgentImage" />
      ) : (
        <div className={styles.imageAgentDefault}></div>
      )}
    </div>
    <div className={styles.workspaceHeaderContent}>
      <div className={styles.workspaceInfoHeader}>
        <h4>4.5</h4>
        <span>Ratings (50K+)</span>
      </div>
      <div className={styles.workspaceInfoHeader}>
        <h4>#16</h4>
        <span>Categoria</span>
      </div>
      <div className={styles.workspaceInfoHeader}>
        <h4>35M+</h4>
        <span>Conversations</span>
      </div>
    </div>
  </div>
  )
}

export default WorkspaceHeader