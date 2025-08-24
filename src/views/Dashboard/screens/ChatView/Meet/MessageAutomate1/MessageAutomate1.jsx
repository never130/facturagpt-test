import React from 'react';
import styles from './MessageAutomate1.module.css';

const MessageAutomate1 = ({ message }) => {
    return (
        <div
            className={styles.messageAutomateItem}
            onClick={() => {
                dispatch(setShowAutomation(true));
                navigate(
                    `/admin/chat/${selectedAgent._id}/${chatId}?automation=${message?.text?.find((item) => item.type === "automate")?.data?.id}`,
                    "_blank"
                );
            }}
        >
            <div className={styles.messageAutomateItemHeader} >
                <div className={styles.messageAutomateItemHeaderIcon} >
                    <img src={automateData?.find((item) => item.type === message?.text?.find((item) => item.type === "automate")?.data?.type)?.image} alt="icon" />
                </div>
                <div className={styles.messageAutomateItemHeaderContent} >
                    <b>
                        {message?.text?.find((item) => item.type === "automate")?.data?.name || "-"}
                    </b>
                    <p>
                        {automateData?.find((item) => item.type === message?.text?.find((item) => item.type === "automate")?.data?.type)?.description}
                    </p>
                </div>
                <div className={styles.messageAutomateItemHeaderTags} >
                    <div>
                        <b>
                            {message?.timestamp && formatAgoDate({ dateString: message?.timestamp, t, })}
                        </b>
                        <IconStar />
                    </div>
                    <div>
                        <div className={styles.messageAutomateItemHeaderTagsLabel} >
                            <span>
                                {message?.text?.length || "-"}
                            </span>
                            <IconAutomate />
                        </div>
                    </div>
                </div>
            </div>
            <ul
                className={`${styles.messageAutomateItemList} `}
            >
                {message?.text?.map(
                    (event, index) => (
                        <li
                            key={index}
                            className={`${styles[loadingStates[index]]}`}
                            style={{ "--index": index }}
                        >
                            <label className={styles.loadingBar} ></label>
                            <div className={styles.messageAutomateItemListContainer} >
                                <div className={styles.messageAutomateItemListNumber} >
                                    {index + 1}
                                </div>
                                <div className={styles.messageAutomateItemListContent} >
                                    <p>{renderTextAutomate(event, 'title')}</p>
                                    <span>
                                        {renderTextAutomate(event)}
                                    </span>
                                </div>
                                {event.data?.time > 0 && (
                                    <div className={styles.messageAutomateItemListTags} >
                                        {renderTextAutomate(event, 'time')}
                                    </div>
                                )}
                            </div>
                        </li>
                    )
                )}
            </ul>
        </div>
    )
}

export default MessageAutomate1;    