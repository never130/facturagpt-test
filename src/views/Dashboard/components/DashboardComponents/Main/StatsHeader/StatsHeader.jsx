import { useState } from 'react';
import styles from './StatsHeader.module.css';

import { ReactComponent as IconArrowUp } from '../assets/icon-arrow-up.svg';
import { ReactComponent as IconArrowDown } from '../assets/icon-arrow-down.svg';
import { ReactComponent as IconInfo } from '../assets/icon-info.svg';

import ModalContent from './ModalContent';

const StatCard = ({ id, title, value, subtitle, color, border, container, end, miniFont, grey }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className={`${styles.statCard} ${color} ${border && styles.border} ${container && styles.container}`}>
                <h3 className={styles.title} style={miniFont && miniFont}>{title}</h3>
                <div className={`${styles.statValue} ${border && styles.border}`} style={end && end}>
                    {id === 'total-facturado' && <IconArrowUp />}
                    {id === 'total-gastos' && <IconArrowDown />}
                    {id === 'balance-total' && <IconInfo
                        onMouseEnter={() => setShowModal(true)}
                        // onMouseLeave={() => setShowModal(false)}
                    />}
                    {value}
                </div>
                {subtitle && <div className={styles.statSubtitle} >
                    {subtitle.value && <span className={`${styles.statSubtitleValue} ${grey && styles.grey}`}>{subtitle.value}</span>}
                    {subtitle.text && <span className={styles.statSubtitleText}>{subtitle.text}</span>}
                </div>}
            </div>
            {showModal && (<ModalContent />)}
        </>
    );
};


const StatsHeader = ({ statistics }) => {
    const stats = [
        {
            id: 'storage',
            title: 'Almacenamiento',
            value: ((statistics.find(stat => stat.key === 's3_usage_gb')?.total) || "0,00") + 'GB' || '0,00GB',
            subtitle: { value: '100GB', text: 'libres' },
            color: 'default',
            border: true,
            container: false,
            grey: true
        },
        {
            id: 'total-facturado',
            title: 'Total Facturado',
            value: ((statistics.find(stat => stat.key === 'sales')?.total) || "0,00") + "€" || '0,00€',
            subtitle: { value: '0,0€', text: 'cobrado' },
            color: 'green',
            border: true,
            container: false
        },
        {
            id: 'total-gastos',
            title: 'Total Gastos',
            value: ((statistics.find(stat => stat.key === 'bills')?.total) || "0,00") + "€" || '0,00€',
            subtitle: '.',
            color: 'default',
            border: true,
            container: false
        },
        {
            id: 'balance-total',
            title: 'Balance total',
            value: ((statistics.find(stat => stat.key === 'benefits')?.total) || "0,00") + "€" || '0,00€',
            subtitle: '',
            color: 'green-bg',
            border: false,
            container: true,
            end: {
                justifyContent: "end",
                gap: "5px"
            }
        },
        {
            id: 'estimacion-iva',
            title: 'Estimación IVA a liquidar',
            value: ((statistics.find(stat => stat.key === 'benefits')?.total) || "0,00") + "€" || '0,00€',
            subtitle: '',
            color: 'default',
            border: false,
            container: true,
            end: { justifyContent: "end" },
            miniFont: { fontSize: "12px", whiteSpace: "normal" }
        },
    ];

    return (
        <div className={styles.statsHeader}>
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};


export default StatsHeader;