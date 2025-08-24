import React from 'react'
import styles from '../InfoExploreCommunity.module.css'

const AppInfo = () => {
  return (
    <div className={styles.workspaceInfo}>
    <div className={styles.workspaceInfoName}>
    <h5>Nombre del App</h5>
    <span>By Aythen</span>
    </div>
    <h4>Ficha tecnica</h4>
    <div className={styles.rowInfo}>
    <p>Tamaño</p>
    <p>100MB</p>
    </div>
    <div className={styles.rowInfo}>
    <p>Categoría</p>
    <p>Documentos</p>
    </div>
    <div className={styles.rowInfo}>
    <p>Derechos de autor</p>
    <p>username</p>
    </div>
    <div className={styles.rowInfo}>
    <p>Sitio web del desarrollador</p>
    <p>ver</p>
    </div>
</div>
  )
}

export default AppInfo