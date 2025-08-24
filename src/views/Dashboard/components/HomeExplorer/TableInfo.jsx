import React, { useState, useEffect } from 'react'
import styles from './TableInfo.module.css'

const TableInfo = () => {

    const [info, setInfo] = useState({
        title: 'Nombre de la tabla',
        description: 'Descripción de la tabla',
        prompt: 'Este es el prompt que analiza la tabla y genera el prompt para la tabla.',
        advantages: 'Estas son las ventajas de la tabla.',
        tableDynamics: 'Tabla dinámica',
        tableDynamicsList: ['Tabla dinámica 1', 'Tabla dinámica 2', 'Tabla dinámica 3'],
 
    })


    return (
        <div className={styles.tableInfoContainer}>
            <div className={styles.tableInfoContainerTitle}>
                <div>
                    icono tabla
                </div>
                <b>
                   {info.title}
                </b>
            </div>
            <div className={styles.tableInfoContainerDescription}>
                <p>
                   {info.description}
                </p>
                <div>
                    by
                    <b>
                        FacturaGPT
                    </b>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>
                                Columna 1
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Columna 1
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={styles.promptContainer}>
                <b>
                    Prompt:
                </b>
                <p>
                    {info.prompt}
                </p>
            </div>
            <div className={styles.advantagesContainer}>
                <b>
                Ventajas:
                </b>
                <p>
                    {info.advantages}
                </p>
            </div>
            <div className={styles.tableDynamicsContainer}>
                <b>
                    Pro vs Free
                </b>
                <ul>
                    {info.tableDynamicsList.map((item, index) => (
                        <li key={index}>
                            <p>
                                {item}
                            1</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.buttonsContainer}>
                <button
                    className={styles.activateButton}
                    onClick={() => {
                        console.log("activate")
                    }}
                >
                    Activar
                </button>
                <button
                    className={styles.likeButton}
                    onClick={() => {
                        console.log("like")
                    }}
                >
                    Me gusta
                </button>
                <button
                    className={styles.noLikeButton}
                    onClick={() => {
                        console.log("noLike")
                    }}
                >
                    No me gusta
                </button>
            </div>
        </div>
    )
}

export default TableInfo