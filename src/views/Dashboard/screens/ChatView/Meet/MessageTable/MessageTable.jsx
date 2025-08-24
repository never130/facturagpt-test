import React from 'react';
import styles from './MessageTable.module.css';
import { useRef, useEffect, useState } from 'react';

import DynamicTable from '../../../../components/DynamicTable/DynamicTable';

import TableSkeleton from '../../../../components/TablesComponents/TypedTable/TableSkeleton2';

const MessageTable = ({ message }) => {

    const dynamicTableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const rawData = Array.isArray(message?.text?.data) ? message.text.data : [];
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);

    const toCamelCase = (str) => {
        return String(str)
            .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, (_, chr) => chr.toUpperCase())
            .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
    };

    const allKeys = Array.from(
        rawData.reduce((set, row) => {
            if (row && typeof row === 'object' && !Array.isArray(row)) {
                Object.keys(row).forEach((k) => set.add(k));
            }
            return set;
        }, new Set())
    );

    const keyMap = allKeys.reduce((acc, originalKey) => {
        const camel = toCamelCase(originalKey);
        acc[originalKey] = camel;
        return acc;
    }, {});

    const columns = allKeys.map((originalKey) => ({
        label: originalKey,
        key: keyMap[originalKey],
    }));

    const data = rawData.map((row) => {
        const mapped = {};
        allKeys.forEach((originalKey) => {
            mapped[keyMap[originalKey]] = row?.[originalKey];
        });
        return mapped;
    });

    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 2700);
        return () => clearTimeout(timeoutId);
    }, []);


    
    return (
        <div className={styles.isTable}>
            <p>
                {message.text.text}
            </p>
            {isLoading ? (
                <TableSkeleton />
            ) : (
            <DynamicTable
                columns={columns}
                ref={dynamicTableRef}
                data={data}
                renderRow={(item, index, onSelect, orderedColumns) => {
                    if (index < startIndex || index >= endIndex) return null;
                    return (
                        <tr>
                            <td style={{ position: "static", }} >
                                <div className={styles.inputWrapperHover} >
                                    <input
                                        type="checkbox"
                                        name="accountSelected"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    />
                                    <div className={styles.inputContainer} ></div>
                                </div>
                            </td>
                            {orderedColumns.filter(c => !c.hidden).map((col) => (
                                <td key={col.key}>
                                    {(() => {
                                        const value = item?.[col.key];
                                        if (value == null) return '';
                                        if (Array.isArray(value)) return value.join(', ');
                                        if (typeof value === 'object') return JSON.stringify(value);
                                        return String(value);
                                    })()}
                                </td>
                            ))}
                        </tr>
                    );
                }}
                selectedIds={[]}
                onSelectAll={() => { }}
                onSelect={() => { }}
                typeTable={'contacts'}
                saveTable={true}
            />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {totalItems > 0 ? `Mostrando ${startIndex + 1}-${Math.min(endIndex, totalItems)} de ${totalItems}` : 'Sin datos'}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '6px 10px' }}
                    >
                        Anterior
                    </button>
                    <span style={{ fontSize: '12px' }}>{`${currentPage} / ${totalPages}`}</span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '6px 10px' }}
                    >
                        Siguiente
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
                        <span style={{ fontSize: '12px' }}>Por página:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                setPageSize(value);
                                setCurrentPage(1);
                            }}
                            style={{ padding: '4px 8px' }}
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageTable;