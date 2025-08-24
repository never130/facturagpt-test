import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ContactForm.module.css";
import Navbar from "../Navbar/Navbar";
import wsIcon from "../../assets/whatsappIcon.svg";
import { useTranslation } from "react-i18next";
import CookiePopup from "../CookiePopup/CookiePopup";
import FreeTrialButton from "../FreeTrialButton/FreeTrialButton";
import SubtitleTemplate from "../SubtitleTemplate/SubtitleTemplate";

import apiBackend from "@src/apiBackend.js";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";

import { sendEmail } from "@src/actions/user";
import FooterLanding from "../FooterLanding/FooterLanding";

const ContactForm = () => {
  const { t } = useTranslation("contactForm");

  const { id } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    work: "",
    phone: "",
    keepInformed: true,
    lenguage: "es",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const handleCheckboxChange = () => {
    setFormData((prevFormData) => ({
      ...prevFormData, 
      keepInformed: !prevFormData.keepInformed,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setIsMessageVisible(false);

    try {
      const language = await localStorage.getItem("language");

      const requestData = {
        ...formData,
        language, 
      };

      const response = await apiBackend.post("/user/newsletter", requestData);

      if (response.status === 200) {
        setFormData({
          name: "",
          email: "",
          message: "",
          work: "",
          phone: "",
          keepInformed: false,
        });
        showMessage(t('sendMessage'), true);
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      showMessage(
        t('errorMessage'),
        false
      );
    }
  };

  const showMessage = (message, success) => {
    setStatusMessage(message);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
    }, 3000); 
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "34684720900"; 
    const message = `${t('helloMyNameIs')} ${formData.name}. ${formData.message}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  React.useEffect(
    () => {
      const translationId = localStorage.getItem("translationId");
      document.title = `${translationId?.replace(translationId?.slice(translationId?.length - 3, translationId?.length),'GPT')?.toUpperCase() || t("facturaGPT")} - ${t('contact')}`;

    },[]
  )
  useEffect(() => {
    if(id) {
      dispatch(sendEmail({
        email: "info@FacturaGPT.com",
        template: "share-form",
        data: {
          pin: id
        }
      }))

      localStorage.setItem('reffer', id)

      navigate('/contact')
    }
  }, [id])

  return (
    <div className={styles.container} >
      <Navbar />
      <div className={styles.containerInner}  id="contact">
        <div className={styles.header}>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{t("title")}</h2>
            <SubtitleTemplate text={t("subTitle")} />
            <button
              type="button"
              className={`${styles.button} ${styles.wsBtn}`}
              onClick={handleWhatsAppClick}
            >
              <img src={wsIcon} alt="" />
              <span> {t("buttonWhatsApp")}</span>
            </button>
          </div>
        </div>
        <div className={styles.separator}>
          <span className={styles.line}></span>
          <div className={styles.circle}>O</div>
          <span className={styles.line}></span>
        </div>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroupContainer}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder={t("placeholder1")}
                    className={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="work"
                    placeholder={t("placeholder2")}
                    className={styles.input}
                    value={formData.work}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputGroupContainer}>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder={t("placeholder3")}
                    className={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="phone"
                    placeholder={t("placeholder4")}
                    className={styles.input}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputGroupContainer}>
                <div className={styles.inputGroup}>
                  <textarea
                    name="message"
                    placeholder={t("placeholder5")}
                    className={styles.textarea}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles.buttonForm}`}
                  >
                    {t("buttonSend")}
                  </button>
                </div>
              </div>
              <div className={styles.infoContact}>
                <div className={styles.keepInformed}>
                  <input
                    type="checkbox"
                    name="keepInformed"
                    checked={formData.keepInformed}
                    onChange={handleCheckboxChange}
                  />{" "}
                  <p>
                  {t("keepInformed")}
                  </p>
                </div>
                <p className={styles.infoText}>
                {t("infoTextPart1")} <a href=""> info@facturagpt.com</a> {t("infoTextPart2")} <a href="/terms">{t("privacyPolicy")}</a>.
                </p>
              </div>
            </form>
          </div>
        </div>

        {isMessageVisible &&
          (statusMessage.includes("exitosamente") ? (
            <div className={`${styles.statusMessage} ${styles.success}`}>
              <HeaderCard title={t('thankForContact')}>
              <Button>{t("accept")}</Button>
              </HeaderCard>
              <div>
              <p>{t("weWillContactYou")}</p>
              </div>
            </div>
          ) : (
            <div className={`${styles.statusMessage} ${styles.error}`}>
              {statusMessage}
            </div>
          ))}

        <section className={`${styles.startNowSection} section`}>
          <h2 className={styles.reviewsTitle}>{t("joinUsToday")}</h2>
          <SubtitleTemplate
            text={t("oneStepCloser")}
          />
          <span className={styles.reviewsDescriptionLast}></span>
          <FreeTrialButton />
        </section>
      </div>
      <CookiePopup />
      <FooterLanding/>
    </div>
  );
};

export default ContactForm;
