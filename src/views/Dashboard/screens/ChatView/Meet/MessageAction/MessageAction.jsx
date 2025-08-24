import React, { useState } from 'react';
import styles from './MessageAction.module.css';

import { ReactComponent as IconWaves } from './assets/icon-waves.svg';

const MessageAction = ({ message }) => {
    return (
        <div className={`${styles.isAction} ${message?.text?.length >= 4 ? styles.big : ""}`} >
            {message?.text?.map((item, index) => {
                const [isOpenWaves, setIsOpenWaves] = useState(false);
                return (
                <div
                    key={index}
                    onMouseEnter={() => {
                        const isMuted =
                            localStorage.getItem(
                                "mutedSound"
                            ) === "true";

                        if (!isMuted) {
                            setIsOpenWaves(true);
                            window.speechSynthesis.cancel();

                            const utterance =
                                new SpeechSynthesisUtterance(
                                    item.text
                                );
                            utterance.lang = "es-ES";
                            window.speechSynthesis.speak(
                                utterance
                            );
                        }else{
                            setIsOpenWaves(false);
                        }
                    }}
                    onMouseLeave={() => {
                        setIsOpenWaves(false);
                        window.speechSynthesis.cancel();
                    }}
                >
                    <div className={styles.iconContainer}>{item.icon}</div>
                    <div className={styles.titleContainer}>
                        <span>{item.title}</span>
                        <span>{item.subtitle}</span>
                    </div>
                    {isOpenWaves && (
                        <div className={styles.iconWaves}>
                            <IconWaves />
                        </div>
                    )}
                    <p>{item.text}</p>
                </div>
            )})}
        </div>
    )
}

export default MessageAction;