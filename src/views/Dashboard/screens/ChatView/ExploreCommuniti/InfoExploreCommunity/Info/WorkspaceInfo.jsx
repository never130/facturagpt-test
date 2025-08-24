import React from 'react'
import styles from '../InfoExploreCommunity.module.css'

const WorkspaceInfo = () => {
  return (
    <div className={styles.workspaceInfo}>
        <div className={styles.workspaceInfoName}>
        <h5>Nombre del Workspace</h5>
        <span>By Aythen</span>
        </div>
        <h4>Rol</h4>
        <p>rolename</p>
        <h4>Tablas</h4>
        <p>tablename</p>
        <p>tablename</p>
    </div>
  )
}

export default WorkspaceInfo