import React, { useState, useEffect } from "react";

import styles from "./ApiPage.module.css";

import { useDispatch } from "react-redux";

import readmeData from './read.js';


import { apiUrl } from "../../../../../../apiBackend";

import { ReactComponent as IconEdit } from "./assets/icon-edit.svg";
import { ReactComponent as IconInfo } from "./assets/icon-info.svg";
import { ReactComponent as IconPlay } from "./assets/icon-play.svg";
import { ReactComponent as IconRefresh } from "./assets/icon-refresh.svg";
import { ReactComponent as IconSearch } from "./assets/icon-search.svg";
import { ReactComponent as IconVerify } from "./assets/icon-verify.svg";
import { ReactComponent as IconWarningOrange } from "./assets/icon-warning-orange.svg";
import { ReactComponent as IconWarningRed } from "./assets/icon-warning-red.svg";
import AddEndpointPopup from "./AddEndpointPopup";



const ApiPage = ({
    web,
    timestamp,
    messageContainerRef
}) => {

    const dispatch = useDispatch();


    const [step, setStep] = useState(() => {
        if (timestamp) {
            const timestampDate = new Date(timestamp);
            const now = new Date();
            const timeDifferenceInSeconds = (now - timestampDate) / 1000
            return timeDifferenceInSeconds > 10 ? 1 : 0;
        }
        return 0;
    })
    const [scrapingText, setScrapingText] = useState("");
    const [isScrapingActive, setIsScrapingActive] = useState(false);
    const [isWaitingForChunks, setIsWaitingForChunks] = useState(false);

    const [progress, setProgress] = useState(0);

    const scrapingTextRef = React.useRef(null);

    const [params, setParams] = useState({
        url: [],
        workflowImage: null, 
    });



    let iniShow = {
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


            handleScrap()

            return () => clearInterval(progressInterval);
        } else if (step === 1) {
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
                            setStep(1)
                        }, 1000);
                    }
                }
            };

            scrollCheckInterval = setInterval(checkScrollEnd, 500);

            const generalTimeout = setTimeout(() => {
                clearInterval(scrollCheckInterval);
                readerMessageRef.cancel();
                setStep(1);
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
                                setStep(1)
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

                        if (messageContainerRef.current) {
                            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
                        }

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
                    setStep(1);
                }
            };

            processStream()
                .then(() => {
                    console.log("ProcessStream completado");
                })
                .catch((error) => {
                    console.error("Error en processStream:", error);
                    clearTimeout(generalTimeout);
                    clearInterval(scrollCheckInterval);
                    setIsWaitingForChunks(false);
                    readerMessageRef.cancel();
                    setStep(1);
                });

        } catch (error) {
            console.error("Error en fetch:", error);
            setStep(0);
        }
    }

    const [isEditingName, setIsEditingName] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [search, setSearch] = useState("");
    const [showAddEndpointPopup, setShowAddEndpointPopup] = useState(false);
    const [endpoints, setEndpoints] = useState([]);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const handleAddEndpoint = (endpointData) => {
        const newEndpoint = {
            id: Date.now(),
            ...endpointData,
            status: 'pending',
            lastTested: null
        };
        setEndpoints(prev => [...prev, newEndpoint]);
    };

    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const maxSize = 500;
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(base64);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            alert('Por favor selecciona una imagen válida (PNG, JPG, SVG)');
            return;
        }

        const maxSize = 5 * 1024 * 1024; 
        if (file.size > maxSize) {
            alert('La imagen es demasiado grande. Máximo 5MB permitido.');
            return;
        }

        setIsImageLoading(true);

        try {
            let base64Image;
            
            if (file.type === 'image/svg+xml') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const svgContent = e.target.result;
                    const base64 = btoa(svgContent);
                    setParams(prev => ({
                        ...prev,
                        workflowImage: `data:image/svg+xml;base64,${base64}`
                    }));
                    setIsImageLoading(false);
                };
                reader.onerror = () => {
                    alert('Error al leer el archivo SVG. Por favor intenta de nuevo.');
                    setIsImageLoading(false);
                };
                reader.readAsText(file);
            } else {
                base64Image = await resizeImage(file);
                setParams(prev => ({
                    ...prev,
                    workflowImage: base64Image
                }));
                setIsImageLoading(false);
            }
        } catch (error) {
            console.error('Error al procesar la imagen:', error);
            alert('Error al procesar la imagen. Por favor intenta de nuevo.');
            setIsImageLoading(false);
        }
    };

    const triggerImageUpload = () => {
        document.getElementById('imageUpload').click();
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.chat} ${step === 0 ? styles.transparent : ""}`}>

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

                {/* 
                Lo que hará scraping es sacar el texto y te mostrara que esta extrayendo 
                entonces aqui faltariia el de processing mientras carga y sale un texto en tiempo real..
                Luego saldran unos botones e ira a info
            */}


                {show.info && (
                    <div className={styles.info}>
                        <div className={styles.info_img} onClick={!isImageLoading ? triggerImageUpload : undefined}>
                            {isImageLoading ? (
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    color: '#666',
                                    fontSize: '12px'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid #f3f3f3',
                                        borderTop: '2px solid var(--_10a37f-background)',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    <span>Procesando...</span>
                                </div>
                            ) : params.workflowImage ? (
                                <img
                                    src={params.workflowImage}
                                    alt="Workflow"
                                />
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    color: '#666',
                                    fontSize: '12px'
                                }}>
                                    <IconInfo />
                                    <span>Click para subir imagen</span>
                                </div>
                            )}
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className={styles.info_content}>
                            <div className={styles.info_content_title}>
                                {editingField === 'workflowTitle' ? (
                                    <input
                                        placeholder="Nombre del workflow"
                                        value={params.workflowTitle || "Workflow: Conexión Api"}
                                        onChange={(e) => setParams({ ...params, workflowTitle: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setEditingField(null);
                                            }
                                        }}
                                        onBlur={() => setEditingField(null)}
                                        ref={(input) => {
                                            if (editingField === 'workflowTitle' && input) {
                                                input.focus();
                                                input.setSelectionRange(input.value.length, input.value.length);
                                            }
                                        }}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            background: 'transparent',
                                            fontSize: 'inherit',
                                            fontFamily: 'inherit',
                                            color: 'inherit',
                                            fontWeight: '600'
                                        }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <b>
                                            {params.workflowTitle || "Workflow: Conexión Api"}
                                        </b>
                                        <button onClick={() => setEditingField('workflowTitle')}>
                                            <IconEdit />
                                        </button>
                                    </div>
                                )}
                                <span>
                                    https://..
                                </span>
                            </div>
                            <div className={styles.info_content_item}>
                                {editingField === 'automationName' ? (
                                    <input
                                        placeholder="Nombre de la automatización"
                                        value={params.name || ""}
                                        onChange={(e) => setParams({ ...params, name: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setEditingField(null);
                                            }
                                        }}
                                        onBlur={() => setEditingField(null)}
                                        ref={(input) => {
                                            if (editingField === 'automationName' && input) {
                                                input.focus();
                                                input.setSelectionRange(input.value.length, input.value.length);
                                            }
                                        }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <b>
                                            {params.name || "Nombre de la automatización"}
                                        </b>
                                        <button onClick={() => setEditingField('automationName')}>
                                            <IconEdit />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className={styles.info_content_last_execution}>
                                Última ejecución: hora, resultado, registros
                            </div>
                            <div>
                                <div className={`${styles.test_buttons_item} ${styles.green}`}>
                                    Pasar a producción
                                    <IconPlay />
                                </div>
                                <div className={`${styles.test_buttons_item} ${styles.green}`}>
                                    Guardar Workflow
                                </div>
                                <div className={styles.test_buttons_item}>
                                <IconRefresh />
                                Reintentar fallidos
                            </div>
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
                            Tests
                        </div>
                        <div
                            onClick={() => setTab("logs")}
                            className={tab === "logs" ? styles.active : ""}
                        >
                            Logs
                            <IconInfo />
                        </div>
                    </div>
                )}


                {/*
                Una vez que se haya scrapeado, se mostrara la info
                y se mostrara el nombre de la automatizacion, el url, y el ultimo resultado
                y el ultimo resultado sera el de la ultima ejecucion
                y el ultimo resultado sera el de la ultima ejecucion
            */}


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
                                {editingField === 'endpoint' ? (
                                    <input
                                        type="text"
                                        value={params.endpoint || "/auth/login"}
                                        onChange={(e) => setParams({ ...params, endpoint: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setEditingField(null);
                                            }
                                        }}
                                        onBlur={() => setEditingField(null)}
                                        ref={(input) => {
                                            if (editingField === 'endpoint' && input) {
                                                input.focus();
                                                input.setSelectionRange(input.value.length, input.value.length);
                                            }
                                        }}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            background: 'transparent',
                                            fontSize: 'inherit',
                                            fontFamily: 'inherit',
                                            color: 'inherit'
                                        }}
                                    />
                                ) : (
                                    <span onClick={() => setEditingField('endpoint')} style={{ cursor: 'pointer' }}>
                                        {params.endpoint || "/auth/login"}
                                    </span>
                                )}
                                {editingField !== 'endpoint' && (
                                    <button onClick={() => setEditingField('endpoint')}>
                                        <IconEdit />
                                    </button>
                                )}
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
                            <div 
                                className={styles.endpoints_list_item_add}
                                onClick={() => setShowAddEndpointPopup(true)}
                                style={{ cursor: 'pointer' }}
                            >
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
                            <input
                                type="text"
                                placeholder="Buscar campos"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className={styles.params_list}>
                            {[1, 2, 3].map((item, index) => {
                                const fieldName = `field${index}`;
                                const isEditing = editingField === fieldName;

                                return (
                                    <div className={styles.params_list_item} key={index}>
                                        <input
                                            type="text"
                                            value={params[fieldName] || "email"}
                                            onChange={(e) => setParams({ ...params, [fieldName]: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setEditingField(null);
                                                }
                                            }}
                                            onBlur={() => setEditingField(null)}
                                            ref={(input) => {
                                                if (isEditing && input) {
                                                    input.focus();
                                                    input.setSelectionRange(input.value.length, input.value.length);
                                                }
                                            }}
                                            readOnly={!isEditing}
                                        />
                                        {!isEditing && (
                                            <button onClick={() => setEditingField(fieldName)}>
                                                <IconEdit />
                                            </button>
                                        )}

                                        <IconVerify />
                                    </div>
                                );
                            })}
                        </div>
                        <div 
                                className={styles.endpoints_list_item_add}
                                onClick={() => setShowAddEndpointPopup(true)}
                                style={{ cursor: 'pointer' }}
                            >
                                Añadir variables
                            </div>
                    </div>
                )}

                {/*
                Aqui se mostrara los endpoints que se han seleccionado
                y se mostrara el estado de cada endpoint
                y se mostrara el estado de cada endpoint
            */}

                {show.test && (
                    <div className={styles.test}>
                        {/* <div className={styles.test_buttons}>

                            
                            <div
                                className={`${styles.test_buttons_item} ${styles.gray}`}
                                onClick={() => setTab("logs")}
                            >
                                Ver Logs
                                <IconInfo />
                            </div>
                            <div className={styles.test_logs_title}>
                                <IconInfo />
                                Ocultar Logs
                            </div>
                        </div> */}
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
                                    <input
                                        type="text"
                                        placeholder="Buscar endpoints"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
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
                                    <div className={styles.test_endpoints_item_container}>
                                        <div className={styles.test_endpoints_item}>
                                            /endpoints
                                            {true ? (
                                                <span className={styles.POST}>
                                                    POST
                                                </span>
                                            ) : false ? (
                                                <span className={styles.PUT}>
                                                    PUT
                                                </span>
                                            ) : (
                                                <span className={styles.DELETE}>
                                                    DELETE
                                                </span>
                                            )}
                                        </div>
                                        <div className={`${styles.test_endpoints_item} ${styles.orange}`}>
                                            Hace 1 min.
                                            Probando
                                            <IconWarningOrange />
                                        </div>
                                        <button>
                                            icon delete
                                        </button>
                                    </div>
                                    <div className={styles.test_endpoints_item_info}>
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

                        {/* <div className={styles.test_logs}>
                        <input type="text" className={styles.test_logs_input} />
                    </div> */}
                    </div>
                )}

                {/*
                Aqui se mostraran los tests 
                y se mostrara el estado de cada test
                y se mostrara el estado de cada test
            */}

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

                {/*
                Aqui se mostraran los logs
                y se mostrara el estado de cada log
                y se mostrara el estado de cada log
            */}

            </div>
            <AddEndpointPopup
                isOpen={showAddEndpointPopup}
                onClose={() => setShowAddEndpointPopup(false)}
                onAddEndpoint={handleAddEndpoint}
            />
        </div>
    );
}


export default ApiPage;