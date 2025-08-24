import React from 'react';
import styles from './MessageDoc.module.css';

const MessageDoc = ({ message }) => {
    return (
        <div className={styles.isDoc}>
            <div className={styles.isDocContainer}>
                <div className={styles.docMessage}>
                    <div className={styles.docMessageHeader}>
                        <p>📄 Documento generado</p>
                        <button
                            className={styles.viewDocButton}
                            onClick={() => {
                                dispatch(setMessageDocsShow(true));
                                dispatch(setMessageDocsData(message.text.html));
                                dispatch(setMessageDocsDocId(message.docId));
                            }}
                        >
                            Ver documento
                        </button>
                    </div>
                    <div
                        className={`${styles.docMessageContent} ${expandedMessages.has(message.timestamp) ? styles.docMessageContentShowMore : ''}`}
                        dangerouslySetInnerHTML={{
                            __html: message.text.html
                        }}
                    />
                </div>
                <div
                    onClick={() => {
                        setExpandedMessages(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(message.timestamp)) {
                                newSet.delete(message.timestamp);
                            } else {
                                newSet.add(message.timestamp);
                            }
                            return newSet;
                        });
                    }}
                    className={`${styles.docMessageShowMore} ${expandedMessages.has(message.timestamp) ? styles.docMessageShowMoreShowMore : ''}`}
                >
                    <div>
                        {expandedMessages.has(message.timestamp) ? 'Show less' : 'Show more'}
                        <IconArrowDown />
                    </div>
                </div>
            </div>
            <div className={styles.isDocLogs}>
                <ul>
                    <li>
                        <b>Cambios.. el texto del usuario</b>
                        <p>
                            Hace 10 minutos
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    )
}


export default MessageDoc;