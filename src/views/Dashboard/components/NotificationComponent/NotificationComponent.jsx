import React, { useState } from "react";
import styles from "./NotificationComponent.module.css";
import SendEmailModal from "../SendEmailModal/SendEmailModal";
import { useTranslation } from "react-i18next";
import { deleteNotification, seenNotification } from "../../../../actions/notifications";
// import { deleteNotification, seenNotification } from "../../../../actions/user";
import { useDispatch } from "react-redux";
import triangleAlert from "../../assets/triangleAlert.svg";
import oooops from "../../assets/oooops.svg";




const DocumentHeader = ({ title, date, time, icon, customStyleImg, customStyleDocumentHeader, seen }) => (
  <div className={styles.documentHeader} style={customStyleDocumentHeader}>
    <div className={styles.headerLeft} >
      <img style={customStyleImg} src={icon} alt="" /> <p  >{title}</p>
    </div>
    {!seen && <div className={styles.circleUnseen}></div>}
  </div>
);

const NotificationItem = ({ email, title, location, value, icon }) => {
  const [t] = useTranslation("InfoContact");

  return (
    <div className={styles.notificationItem}>
      <img src={icon} alt="" />
      <p>
        <strong>{email}</strong> {t('hasCreated')} <strong>{title}</strong> {t('in')}{" "}
        <strong>{location}</strong>
      </p>
      <span>
        {value || "0,00"}
        {"EUR"}
      </span>
    </div>
  );
};

const NotificationComponent = ({ data, handleHeaderClick, isActive, type, getAllNotificationsFn }) => {
  const [t] = useTranslation("InfoContact");

  const [showSendEmailPopup, setShowSendEmailPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch()
  const handleShare = (item) => {
    const fileUrl = item.Location;

    if (navigator.share) {
      navigator
        .share({
          title: t('checkoutThisFile'),
          text: t('haveLookThisFile'),
          url: fileUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(fileUrl).then(
        () => {
          alert(t('linkCopiedToClipboad'));
        },
        (err) => {
          console.error("Failed to copy link:", err);
        }
      );
    }
  };

  const handleReply = (item) => {
    const destinatario = "ejemplo@correo.com";
    const subject = encodeURIComponent("Respuesta");
    const body = encodeURIComponent(JSON.stringify(item, null, 2));

    window.location.href = `mailto:${destinatario}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {!data.title ? (
        <div className={styles.activityDefault} onClick={handleHeaderClick} onMouseEnter={() => dispatch(seenNotification({ idNotification: data._id }))}>
          <DocumentHeader
            customStyleImg={{ width: "100%" }}
            customStyleDocumentHeader={{ display: "flex", justifyContent: "start" }}
            icon={oooops}
          />
          <div
            className={`${styles.activityHeader} ${styles.activityHeaderDocument}`}
          >
            <p>
              {t('theNotificationCouldNotBe')}
            </p>
          </div>
          <div className={styles.documentDate} >
            <p className={styles.p} >{data.date}</p>
            <p className={styles.p} >{data.time}</p>
            {data.value ? <p className={styles.p} >{data.value} {"EUR"}</p> : <p className={styles.p} >{data.value}</p>}
          </div>
        </div>
      ) : (data.title && type === "document") ? (
        <div className={styles.activity} onClick={handleHeaderClick} onMouseEnter={() => dispatch(seenNotification({ idNotification: data._id }))}>
          <div className={styles.activityTime}>
            <div className={styles.activityTimeLeft}>
      
              <span>
                {data.date}
              </span>
            </div>
            <div className={styles.activityTimeRight}>
              <div className={styles.dot} />
              <p>
                {data.time}
              </p>
            </div>
          </div>
          <div className={styles.activityContainer}>
            <DocumentHeader
              title={data.title}
              icon={data.icon}
              seen={data?.seen}
            />
            <div
              className={`${styles.activityHeader} ${styles.activityHeaderDocument}`}
              style={{
                height: isActive ? "auto" : "0px",
                overflow: "hidden",
                transition: "height 0.3s ease-out",
              }}
            >

              {data.notifications && data.notifications.map((notification, index) => (
                <NotificationItem
                  key={index}
                  email={notification.email}
                  title={notification.text}
                  location={notification.location}
                  value={notification.value}
                  icon={notification.icon}
                />
              ))}
            </div>
            <div className={styles.options}>
              {data.options && data.options.map((option, index) => (
                <p
                  key={index}
                  onClick={(event) => {
                    event.stopPropagation();
                    alert(`Opción seleccionada: ${option}`);
                  }}
                  style={{
                    textDecoration: option === "Ver Email" && "underline",
                  }}
                  className={`${option === "Reenviar" ? styles.gray : styles.green}`}
                >
                  {option}
                </p>
              ))}
            </div>
   
          </div>
        </div>
      ) : data.title && (
        <div className={styles.activity}>
          <div
            className={styles.activityHeader}
            style={{
              height: isActive ? "auto" : "0px",
              overflow: "hidden",
              transition: "height 0.3s ease-out",
            }}
          >
            <span
              className={styles.gray}
              onClick={(e) => {
                setShowSendEmailPopup(true);
              }}
            >
              {t('forward')}
            </span>

            <p
              className={styles.gray}
              onClick={(e) => {
                handleReply(data);
              }}
            >
              {t('reply')}
            </p>
            <p
              className={styles.gray}
              onClick={(e) => {
                handleShare(data);
              }}
            >
              {t('share')}
            </p>
            <p
              className={styles.gray}
              style={{
                textDecoration: "underline"
              }}
              onClick={(e) => {
              }}
            >
              {t('seeEmail')}
            </p>


          </div>
          <div className={styles.info}>
            <img src={data.icon} alt="Icon" />
            <p>
              <strong>{data.email}</strong> {t('hasCreated')}{" "}
              <strong>{data.title}</strong> {t('in')} <strong>{data.folder}</strong>
            </p>
          </div>
        </div>
      )}

    </>
  );
};

export default NotificationComponent;
