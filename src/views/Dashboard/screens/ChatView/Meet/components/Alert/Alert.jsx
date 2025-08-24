import React from 'react'

import styles from './Alert.module.css'

import { ReactComponent as IconAlertSuccess } from './assets/icon-alert-success.svg'
import { ReactComponent as IconAlertError } from './assets/icon-alert-error.svg'

const Alert = ({ message, status }) => {
    return (
        <div className={`${styles.alert} ${status === 'success' ? styles.success : styles.error}`}>
            {status === 'success' && <IconAlertSuccess />}
            {status === 'error' && <IconAlertError />}
            <p>
                {message || 'Not found message'}
            </p>
        </div>
    )
}

export default Alert