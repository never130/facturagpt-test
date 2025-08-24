import React from 'react';
import styles from './MessageImage.module.css';

import { safeText } from '../utils';

const MessageImage = ({ message }) => {
    return (
        <div className={styles.isImage}>
            <img src={safeText(message.text)} alt="image" />
        </div>
    )
}

export default MessageImage;

