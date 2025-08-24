import React, { useState, useEffect } from 'react';
import styles from "./UnPayment.module.css";

import { languageFlags } from "../../../../utils/flags.js";
import { useTranslation } from "react-i18next";

import facturaGPT from "../../assets/FacturaGPTBlack.svg";

const UnPayment = () => {
    const [t] = useTranslation("ChatView");
    const [currentMonth, setCurrentMonth] = useState(0);

    const [isActivePay, setIsActivePay] = useState(false);
    const months = [
        { label: '0 meses', value: 0 },
        { label: '1 mes', value: 1 },
        { label: '2 meses', value: 2 },
        { label: '3 meses', value: 3 },
        { label: '4 meses', value: 4 },
        { label: '5 meses', value: 5 },
        { label: '6 meses', value: 6 }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMonth(prev => (prev < 6 ? prev + 1 : prev));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <h2>
                ¡Ups, algo salió mal!
            </h2>
            <img className={styles.logo} src={facturaGPT} alt="logo" />
            <div>
                <p>
                    No has pagado tu factura de Factura GPT.
                </p>
                <p>
                    Por favor, paga tu factura para continuar usando el servicio.
                </p>
            </div>

            {!isActivePay && (

                <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                        {months.map((month, index) => (
                            <div 
                                key={index}
                                className={`${styles.progressStep} ${currentMonth >= month.value ? styles.active : ''}`}
                            >
                                <div className={styles.stepIndicator}></div>
                                <div className={styles.stepLabel}>{month.label}</div>
                            </div>
                        ))}
                    </div>
                    <div 
                        className={styles.progressLine}
                        style={{ width: `${(currentMonth / 6) * 100}%` }}
                    ></div>
                </div>
            )}
            
            {!isActivePay ? (
                <button 
                className={styles.button}
                onClick={() => setIsActivePay(true)}
                >
                    Pagar factura
                </button>
            ): (
            <div style={{
                width: "100%",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
            }}>
                <div className={styles.box2}>
                    <div className={styles.inputContainer}>
                        <label>
                            Nombre
                        </label>
                        <input type="text" />
                    </div>
                    <div className={styles.inputContainer}>
                        <label>
                            Apellido
                        </label>
                        <input type="text" />
                    </div>
                </div>
                <div className={styles.box3}>
                    <div className={styles.inputContainer}>
                        <label>
                            Numero de tarjeta
                        </label>
                        <input type="text" />
                    </div>
                    <div className={styles.inputContainer}>
                        <label>
                            Fecha de expiracion
                        </label>
                        <input type="text" />
                    </div>
                    <div className={styles.inputContainer}>
                        <label>
                            CVV
                        </label>
                        <input type="text" />
                    </div>
                </div>
            </div>
            )}
            <div>
                <div className={styles.footerChat}>
                    <div className={styles.languageContainer}>
                        {languageFlags.map((item) => (
                            <span
                                key={item.code || item.value}
                                className={styles.dropdownItem}
                                onClick={() => {
                                    i18n.changeLanguage(item.label);
                                }}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>
                    <div className={styles.linksContainerFooterChat}>
                        <a href="/terms">{t("cookies")}</a>
                        <a href="/terms">{t("privacy")}</a>
                        <a href="/home">{t("home")}</a>
                        <a href="/contact">{t("more")}</a>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UnPayment;