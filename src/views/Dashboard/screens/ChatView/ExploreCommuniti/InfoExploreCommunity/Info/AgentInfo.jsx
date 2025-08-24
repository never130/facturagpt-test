import React from 'react'
import styles from '../InfoExploreCommunity.module.css'

const AgentInfo = () => {
  return (
    <div className={styles.agentInfo}>
        <div className={styles.agentInfoName}>
        <h5>Nombre del bot</h5>
        <span>By Aythen</span>
        </div>
        <p>Descripcion</p>
        <h4>Capabilities</h4>
        <p>Nombre del workspace</p>
        <p>Tablas</p>
        <p>Code Interpreter & Data Analysis</p>
        <p>Web Search</p>
       <div className={styles.automationContainer}>
        <div className={styles.automationInfo}>
            <p>Nombre de la automacion</p>
            <span>Descripcion</span>
        </div>
       </div>
    </div>
  )
}

export default AgentInfo