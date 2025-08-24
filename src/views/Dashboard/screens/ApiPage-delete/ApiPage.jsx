import React, { useState, useEffect } from "react";

import styles from "./ApiPage.module.css";

import { useDispatch } from "react-redux";

import readmeData from './read.js';


import { apiUrl } from "../../../../apiBackend";

import { ReactComponent as IconEdit } from "./assets/icon-edit.svg";
import { ReactComponent as IconInfo } from "./assets/icon-info.svg";
import { ReactComponent as IconPlay } from "./assets/icon-play.svg";
import { ReactComponent as IconRefresh } from "./assets/icon-refresh.svg";
import { ReactComponent as IconSearch } from "./assets/icon-search.svg";
import { ReactComponent as IconVerify } from "./assets/icon-verify.svg";
import { ReactComponent as IconWarningOrange } from "./assets/icon-warning-orange.svg";
import { ReactComponent as IconWarningRed } from "./assets/icon-warning-red.svg";



const ApiPage = ({

}) => {
    const dispatch = useDispatch();

    const [step, setStep] = useState(0)
    const [web, setWeb] = useState("");
    const [scrapingText, setScrapingText] = useState("");
    const [isScrapingActive, setIsScrapingActive] = useState(false);
    const [isWaitingForChunks, setIsWaitingForChunks] = useState(false);

    const [progress, setProgress] = useState(0);

    const scrapingTextRef = React.useRef(null);

    const [params, setParams] = useState({
        url: [],
    });


    let iniShow = {
        scrap: false,
        info: false,
        tabs: false,
        scrapping: false,
        endpoints: false,
        params: false,
        test: false,
        logs: false
    }


    const [show, setShow] = useState(iniShow);



    const [tab, setTab] = useState(null)

    useEffect(() => {
        if (step === 0) {
            setShow({
                ...iniShow,
                scrap: true,
            })
        } else if (step === 1) {
            setShow({
                ...iniShow,
                scrapping: true,
            })


            setProgress(0);
            setTimeout(() => {
                setScrapingText(readmeData || 'hello worldd')
            }, 2000)

            const startTime = Date.now();
            const seconds = 60;
            const duration = seconds * 1000;

            const progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const newProgress = Math.min((elapsed / duration) * 100, 100);
                setProgress(newProgress);

                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 100); 

            return () => clearInterval(progressInterval);
        } else if (step === 2) {
            setShow({
                ...iniShow,
                info: true,
                tabs: true,
                endpoints: true,
                params: true,
                test: true,
                logs: true,
            })
        }
    }, [step])

    useEffect(() => {

        if (tab === "endpoints") {
            setShow({
                ...iniShow,
                info: true,
                tabs: true,
                endpoints: true,
            })
        } else if (tab === "details") {
            setShow({
                ...iniShow,
                info: true,
                tabs: true,
                test: true,
            })
        } else if (tab === "logs") {
            setShow({
                ...iniShow,
                info: true,
                tabs: true,
                logs: true,
            })
        }
    }, [tab])

    useEffect(() => {
        let scrollInterval;

        if (scrapingTextRef.current && scrapingText) {
            const element = scrapingTextRef.current;

            scrollInterval = setInterval(() => {
                element.scrollTop += 500;

                if (element.scrollTop >= element.scrollHeight - element.clientHeight) {
                    element.scrollTop = 0;
                }
            }, 100);
        }

        return () => {
            if (scrollInterval) {
                clearInterval(scrollInterval);
            }
        };
    }, [scrapingText]);


    const handleScrap = async () => {
        setStep(1)

        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;

        try {
            const response = await fetch(`${apiUrl}/api/automate/scrap`, {
                method: "POST",
                body: JSON.stringify({
                    web: web,
                }),
                headers: {
                    "Content-Type": "application/octet-stream",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Error en la respuesta:", response.status, response.statusText);
                setStep(0);
                return;
            }

            const readerMessageRef = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedChunks = "";
            let accumulatedText = "";
            let lastChunkTime = Date.now();
            let hasReceivedChunks = false;
            let scrollCheckInterval;

            const checkScrollEnd = () => {
                if (scrapingTextRef.current) {
                    const element = scrapingTextRef.current;
                    const isAtBottom = element.scrollTop >= element.scrollHeight - element.clientHeight - 10; 

                    if (isAtBottom && hasReceivedChunks) {
                        clearTimeout(generalTimeout);
                        clearInterval(scrollCheckInterval);
                        setIsWaitingForChunks(false);
                        readerMessageRef.cancel();
                        setTimeout(() => {
                            setStep(2)
                        }, 1000);
                    }
                }
            };

            scrollCheckInterval = setInterval(checkScrollEnd, 500);

            const generalTimeout = setTimeout(() => {
                clearInterval(scrollCheckInterval);
                readerMessageRef.cancel();
                setStep(2);
            }, 120000); 

            const processStream = async () => {
                try {
                    while (true) {
                        const { done, value } = await readerMessageRef.read();

                        if (done) {
                            clearTimeout(generalTimeout);
                            clearInterval(scrollCheckInterval);
                            setIsWaitingForChunks(false);
                            setTimeout(() => {
                                setStep(2)
                            }, 2000)
                            break;
                        }

                        lastChunkTime = Date.now();
                        hasReceivedChunks = true;
                        setIsWaitingForChunks(false);

                        const chunk = decoder.decode(value, { stream: true });
                        accumulatedChunks += chunk;

                        const lines = accumulatedChunks.split('\n');

                        accumulatedChunks = lines.pop() || '';

                        for (const line of lines) {
                            if (line.trim()) {
                                try {
                                    const parsedChunk = JSON.parse(line);
                                    const { text, daa } = parsedChunk.data;

                                    setScrapingText(prev => prev + text)

                                } catch (error) {
                                    console.error("Failed to parse JSON:", error);
                                    console.error("Problematic line:", line);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error en processStream:", error);
                    clearTimeout(generalTimeout);
                    clearInterval(scrollCheckInterval);
                    setIsWaitingForChunks(false);
                    readerMessageRef.cancel();
                    setStep(2);
                }
            };

            processStream()
                .then(() => {
                })
                .catch((error) => {
                    console.error("Error en processStream:", error);
                    clearTimeout(generalTimeout);
                    clearInterval(scrollCheckInterval);
                    setIsWaitingForChunks(false);
                    readerMessageRef.cancel();
                    setStep(2);
                });

        } catch (error) {
            console.error("Error en fetch:", error);
            setStep(0);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.chat}>
                {show.scrap && (
                    <div className={styles.scrap}>
                        <h1>API scrapear</h1>
                        <div className={styles.scrap_input}>
                            <input
                                placeholder="https://.."
                                value={web}
                                onChange={(e) => setWeb(e.target.value)}
                            />

                            <button onClick={handleScrap}>
                                <IconPlay />
                            </button>
                        </div>
                    </div>
                )}

                {show.scrapping && (
                    <div className={styles.scrapping}>
                        <p className={styles.scrapping_text}>
                            FacturaGPT ha scrapeado la documentación de la API y
                            está validando automáticamente los endpoints seleccionados para tu workflow.
                        </p>

                        <div className={styles.scrapping_progress}>
                            <div style={{ width: `${progress}%` }} />
                        </div>
                        <div className={styles.scrapping_progress_text}>
                            {Math.round(progress)}% de los endpoints validados
                            {isWaitingForChunks && (
                                <span style={{ color: '#ff6b35', marginLeft: '10px' }}>
                                    ⏳ Esperando que termine el contenido...
                                </span>
                            )}
                        </div>
                        <div className={styles.scrapping_text_content_container}>
                            <p
                                ref={scrapingTextRef}
                                className={styles.scrapping_text_content}
                                style={{
                                    display: scrapingText ? "block" : "none",
                                }}
                            >
                                {scrapingText}
                            </p>
                        </div>
                    </div>
                )}

                {show.info && (
                    <div className={styles.info}>
                        <div className={styles.info_img}>
                        </div>
                        <div className={styles.info_content}>
                            <div className={styles.info_content_title}>
                                <b>
                                    Workflow: Conexión Api
                                </b>
                                <span>
                                    https://..
                                </span>
                            </div>
                            <div className={styles.info_content_item}>
                                <b>
                                    Nombre de la automatización
                                </b>
                                <input
                                    placeholder="Nombre de la automatización"
                                    value={params.name}
                                    onChange={(e) => setParams({ ...params, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.info_content_last_execution}>
                                Última ejecución: hora, resultado, registros
                            </div>
                        </div>
                    </div>
                )}

                {show.tabs && (
                    <div className={styles.tabs}>
                        <div
                            onClick={() => setTab("endpoints")}
                            className={tab === "endpoints" ? styles.active : ""}
                        >
                            Endpoints
                        </div>
                        <div
                            onClick={() => setTab("details")}
                            className={tab === "details" ? styles.active : ""}
                        >
                            Detalles de pruebas
                        </div>
                        <div
                            onClick={() => setTab("logs")}
                            className={tab === "logs" ? styles.active : ""}
                        >
                            Logs
                        </div>
                    </div>
                )}

                {show.endpoints && (
                    <div className={styles.endpoints}>
                        <div className={styles.endpoints_status}>
                            <div className={styles.endpoints_status_item}>
                                <div className={styles.endpoints_status_item_dot} style={{ backgroundColor: "var(--_10a37f-background)" }} />
                                12 correctos
                            </div>
                            <div className={styles.endpoints_status_item}>
                                <div className={styles.endpoints_status_item_dot} style={{ backgroundColor: "#f6851b" }} />
                                3 errores
                            </div>
                            <div className={styles.endpoints_status_item}>
                                <div className={styles.endpoints_status_item_dot} style={{ backgroundColor: "#c5221f" }} />
                                5 pruebas
                            </div>
                        </div>
                        <div className={styles.endpoints_list_container}>
                            <div className={styles.endpoints_list}>
                                <div className={styles.endpoints_list_item}>
                                    /endpoints
                                </div>
                                <div className={styles.endpoints_list_item}>
                                    <button className={styles.ALL}>
                                        Todos
                                    </button>
                                    <button className={styles.POST}>
                                        Post
                                    </button>
                                    <button className={styles.PUT}>
                                        Put
                                    </button>
                                    <button className={styles.DELETE}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className={styles.endpoints_list_item_endpoint}>
                                /auth/login
                                <IconEdit />
                                <div>
                                    <span className={styles.POST}>
                                        POST
                                    </span>
                                    <span className={styles.PUT}>
                                        PUT
                                    </span>
                                    <span className={styles.DELETE}>
                                        DELETE
                                    </span>
                                </div>
                            </div>
                            <div className={styles.endpoints_list_item_add}>
                                Añadir endpoint
                            </div>
                        </div>
                    </div>
                )}

                {show.params && (
                    <div className={styles.params}>
                        <div className={styles.params_title}>
                            Campos detectados en la API
                        </div>
                        <div className={styles.params_search}>
                            <IconSearch />
                            Buscar campos
                        </div>
                        <div className={styles.params_list}>
                            {[1, 2, 3].map((item, index) => (
                                <div className={styles.params_list_item} key={index}>
                                    email
                                    <IconEdit />

                                    <IconVerify />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {show.test && (
                    <div className={styles.test}>
                        <div className={styles.test_buttons}>
                            <div className={styles.test_buttons_item}>
                                <IconRefresh />
                                Reintentar fallidos
                            </div>
                            <div className={`${styles.test_buttons_item} ${styles.green}`}>
                                Pasar a producción
                                <IconPlay />
                            </div>
                            <div className={`${styles.test_buttons_item} ${styles.green}`}>
                                Guardar Workflow
                            </div>
                            <div className={`${styles.test_buttons_item} ${styles.gray}`}>
                                Ver Logs
                                <IconInfo />
                            </div>
                            <div className={styles.test_logs_title}>
                                <IconInfo />
                                Ocultar Logs
                            </div>
                        </div>
                        <div className={styles.test_title}>
                            <b>
                                Test de conexiones API
                            </b>
                            <p className={styles.test_description}>
                                Visualiza el estado de cada endpoint
                                antes de pasar a producción y  monitorizar en tiempo real
                            </p>

                            <b>
                                Seleccionar endpoints
                            </b>
                            <div className={styles.test_select_container}>
                                <div className={styles.test_search}>
                                    <IconSearch />
                                    Buscar endpoints
                                </div>
                                <div className={styles.test_select}>
                                    Selccionar modulo
                                </div>
                            </div>
                            <div className={styles.test_no_endpoints}>
                                ⚠ No se han encontrado endpoints
                            </div>
                        </div>
                        <>
                            {[1, 2, 3].map((item, index) => (
                                <div className={styles.test_endpoints}>
                                    <div className={styles.test_endpoints_item}>
                                        /endpoints
                                        <span className={styles.POST}>
                                            POST
                                        </span>
                                        <span className={styles.PUT}>
                                            PUT
                                        </span>
                                        <span className={styles.DELETE}>
                                            DELETE
                                        </span>
                                    </div>
                                    <div className={`${styles.test_endpoints_item} ${styles.orange}`}>
                                        Hace 1 min.
                                        Probando
                                        <IconWarningOrange />

                                    </div>
                                    <div className={styles.test_endpoints_item}>
                                        <label>
                                            /endpoint
                                        </label>
                                        <label>
                                            id:id
                                        </label>
                                        <label>
                                            total_amount
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </>

                    </div>
                )}

                {show.logs && (
                    <div className={styles.logs}>
                        {[1, 2, 3].map((item, index) => (
                            <div key={index} className={styles.log}>
                                <div className={styles.log_item_time}>
                                    [12:01]
                                    /auth/login
                                </div>
                                {true ? (
                                    <div className={styles.log_item_error}>
                                        <IconWarningRed />
                                        Error
                                    </div>
                                ) : true ? (
                                    <div className={styles.log_item_testing}>
                                        <IconWarningOrange />
                                        Probando
                                    </div>
                                ) : (
                                    <div className={styles.log_item_success}>
                                        <IconVerify />
                                        Funciona
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}


            </div>
        </div>
    );
}


export default ApiPage;