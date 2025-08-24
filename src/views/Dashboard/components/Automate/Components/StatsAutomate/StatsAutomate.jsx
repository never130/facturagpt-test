import React, { useState } from 'react'
import styles from './StatsAutomate.module.css'

import { ReactComponent as IconPendent } from './assets/icon-pendent.svg'
import { ReactComponent as IconSucces } from './assets/icon-pendent.svg'
import { ReactComponent as IconCancel } from './assets/icon-pendent.svg'


const StatsAutomate = () => {

  const [stats, setStats] = useState({
    totalAutomates: 0,
    totalAutomatesActive: 0,
    totalAutomatesInactive: 0,
  })

  return (
    <div className={styles.statsContainer}>
        <div className={styles.statsItem}>
            <div className={styles.statsItemTitle}>
                <p>Automates</p>
            </div>
            <IconPendent />
            <div className={styles.statsItemValue}>
                <p>{stats.totalAutomates}</p>
            </div>
        </div>
        <div className={styles.statsItem}>
            <div className={styles.statsItemTitle}>
                <p>Active</p>
            </div>
            <IconSucces />
            <div className={styles.statsItemValue}>
                <p>{stats.totalAutomatesActive}</p>
            </div>
        </div>
        <div className={styles.statsItem}>
            <div className={styles.statsItemTitle}>
                <p>Inactive</p>
            </div>
            <IconCancel />
            <div className={styles.statsItemValue}>
                <p>{stats.totalAutomatesInactive}</p>
            </div>
        </div>
    </div>
  )
}

export default StatsAutomate