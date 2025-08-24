import React from 'react';
import styles from './MessageAutomate.module.css';

const MessageAutomate = ({ message }) => {
    return (
        <div className={styles.isAutomate}>

            {message.text.status === 500 ? (
                <div className={styles.automateCancelled}>
                    <p>Api scraping cancelled</p>
                </div>
            ) : (
                <>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: formatWhatsAppText(message?.text?.text),
                        }}
                    />
                    <ul>
                        {message?.text?.variable?.map((item, index) => {
                            const isEditing = editingVariableIndices.includes(index);
                            const editingValue = editingVariableValues[index] || item.value;

                            return (
                                <li key={index} className={styles.automateVariable}>
                                    <div>
                                        <b>{item.key || 'not found'}</b>
                                        {!isEditing ? (
                                            <p>
                                                {item.value}
                                            </p>
                                        ) : (
                                            <input
                                                value={editingValue}
                                                onChange={(e) => handleVariableChange(index, e.target.value)}
                                                data-variable-index={index}
                                                onKeyDown={(e) => handleVariableKeyDown(e, index)}
                                                onBlur={() => handleVariableSave(index)}
                                                autoFocus
                                            />
                                        )}

                                        {!isEditing && (
                                            <button
                                                className={styles.buttonIcon}
                                                onClick={() => toggleVariableEditing(index, item.value)}
                                            >
                                                <IconEdit />
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <button className={styles.buttonIcon} >
                                            <IconVerify />
                                        </button>
                                        {isEditing && (
                                            <button
                                                className={styles.saveButton}
                                                onClick={() => handleVariableSave(index)}
                                            >
                                                Guardar
                                            </button>
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <ul style={{ marginLeft: '20px' }}>
                        {message?.text?.action?.map((item, index) => (
                            <li
                                key={index}
                                className={styles.automateItem}
                                onClick={() => {
                                    const fn = `fn-${item.fn}`

                                    handleSendMessage({
                                        text: fn,
                                        type: 'fn',
                                        timestamp: message?.timestamp,
                                        agentName: selectedAgent?.name,
                                        agentId: selectedAgent?._id,
                                    })
                                }}
                            >
                                <div className={styles.automateItemIcon} >
                                    {item.icon}
                                </div>
                                <div className={styles.automateItemContent} >
                                    <b>
                                        {item.title}
                                    </b>
                                    <p>
                                        {item.description}
                                    </p>
                                </div>
                                {/* {item.prompt} */}
                            </li>
                        ))}
                    </ul>
                </>
            )}

        </div>
    )
}

export default MessageAutomate