import React, { useState, useEffect } from 'react';
import styles from './TableSkeleton2.module.css';

const TableSkeleton = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showTable, setShowTable] = useState(false);
    const [radialExpanded, setRadialExpanded] = useState(false);

    // Datos de ejemplo para la tabla
    const tableData = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', status: 'Activo' },
        { id: 2, name: 'María García', email: 'maria@example.com', status: 'Inactivo' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', status: 'Activo' },
        { id: 4, name: 'Ana Martínez', email: 'ana@example.com', status: 'Pendiente' },
        { id: 5, name: 'Luis Rodríguez', email: 'luis@example.com', status: 'Activo' },
    ];

    useEffect(() => {
        // Simular carga de datos
        const timer1 = setTimeout(() => {
            setRadialExpanded(true);
        }, 500);

        const timer2 = setTimeout(() => {
            setShowTable(true);
        }, 1500);

        const timer3 = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div className={styles.container}>
            {/* Efecto de difusión desde arriba */}
            <div className={styles.diffusionOverlay}></div>
            
            {/* Efecto de ondas de difusión */}
            <div className={styles.waveEffect}></div>
            
            {/* Fondo radial que se expande */}
            <div className={`${styles.radialBackground} ${radialExpanded ? styles.expanded : ''}`}></div>
            
            {/* Contenido principal */}
            <div className={styles.content}>
                
                {isLoading ? (
                    // Skeletons de carga
                    <div className={styles.skeletonContainer}>
                        {/* Header skeleton */}
                        <div className={styles.skeletonHeader}>
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className={styles.skeletonHeaderCell}></div>
                            ))}
                        </div>
                        
                        {/* Rows skeleton */}
                        {[...Array(5)].map((_, rowIndex) => (
                            <div key={rowIndex} className={styles.skeletonRow}>
                                {[...Array(4)].map((_, colIndex) => (
                                    <div 
                                        key={colIndex} 
                                        className={styles.skeletonCell}
                                        style={{ animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s` }}
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Tabla real
                    <div className={`${styles.tableContainer} ${showTable ? styles.tableVisible : ''}`}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr 
                                        key={row.id} 
                                        className={styles.tableRow}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.email}</td>
                                        <td>
                                            <span className={`${styles.status} ${styles[`status${row.status}`]}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableSkeleton;