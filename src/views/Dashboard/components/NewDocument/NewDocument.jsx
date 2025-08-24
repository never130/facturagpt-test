import React, { useEffect, useRef, useState } from 'react';
import styles from "./NewDocument.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowDown } from "../../assets/ArrowLeftWhite.svg";
import { ReactComponent as Camera } from "../../assets/cameraSolidDoc.svg";
import { ReactComponent as ClipIcon } from "../../assets/clipSolid.svg";
import { ReactComponent as GenerateIcon } from "../../assets/generateDoc.svg";
import { ReactComponent as GenerateIconFacturable } from "../../assets/documentFacturable.svg";
import { useNavigate } from 'react-router-dom';
import {
    getUserFiles,
    uploadFiles,
} from "../../../../actions/scaleway";
import { setCurrentPath, setFromHome } from "../../../../slices/scalewaySlices";
import { setGlobalSearch } from '../../../../slices/userSlices';

export default function NewDocument({ setShowModal, setActiveFileExplore, setIsOpenSidebar }) {
    const { t } = useTranslation("navbarAdmin");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const handleSidebarClose = () => { setSidebarOpen(false) };

    // ✅ Obtener user y currentPath del estado global (como en FileExplorer)
    const { user } = useSelector((state) => state.user);
    const { currentPath } = useSelector((state) => state.scaleway);

    // ✅ Si no hay currentPath, usar la raíz del workspace
    const effectivePath = currentPath || `${user?.selectedWorkspace}/`;

    const draggedItem = null;
    const dropRef = useRef(null);

    const handleFileUpload = async (file, ETag, a, b, c, d, path) => {
        console.log("Procesando archivo:", file.name, "en", path);
        // Aquí iría tu lógica de procesamiento (guardar en DB, extraer texto, etc.)
    };
    const [loader, setLoader] = useState();
    const handleDropFiles = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (draggedItem) return;

        const files = Array.from(event.dataTransfer.files);
        if (files.length === 0) return;

        try {
            setLoader(true);
            // ✅ Usar effectivePath (no uno fijo)
            const uploadResponse = await dispatch(
                uploadFiles({ files, currentPath: effectivePath })
            ).unwrap();

            const ETag = uploadResponse?.[0]?.ETag;
            if (!ETag) {
                console.warn("No se obtuvo ETag después de subir el archivo");
                return;
            }

            const pdfFiles = files.filter((file) => file.type === "application/pdf");

            if (pdfFiles.length > 0) {
                
                for (const file of pdfFiles) {
                    await handleFileUpload(file, ETag, "", "", "", "", effectivePath);
                }

                const userLocalStorage = localStorage.getItem("user");
                const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;

                dispatch(setFromHome(true));
                await dispatch(
                    getUserFiles({
                        userId: user.id,
                        token: parsedUser.accessToken,
                    })
                ).unwrap();
                dispatch(setShowModal(false))
                setIsOpenSidebar(true);
                setActiveFileExplore(true);
                setLoader(false);
            } else {
                console.warn("No se soltó ningún archivo PDF válido.");
            }
        } catch (error) {
            console.error("Error al procesar los archivos:", error);
        }
    };

    const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
    const checkDevice = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
    };

    // Verificar al cargar
    checkDevice();

    // Escuchar cambios (redimensionar ventana, rotación)
    window.addEventListener('resize', checkDevice);
    if (isMobile) {
        const validateMobile = "isMobile"
    }
    // Limpiar evento
    return () => window.removeEventListener('resize', checkDevice);
}, []); // Dependencias vacías: solo se ejecuta al montar
    
    const options = [
        {
            icon: <GenerateIcon />,
            title: t("generateDoc"),
            desc: t("generateDesc"),
            action: () => {
                navigate("/admin/chat")
                dispatch(setShowModal(false))
            },
            type: "button"
        },
        {
            icon: <GenerateIconFacturable />,
            title: t("factDocu"),
            desc: t("factDesc"),
            action: () => {
                dispatch(setShowModal('newBill'))
            },
            type: "button"
        },
        {
            icon: <Camera />,
            title: t("TakePicture"),
            desc: t("pictureDesc"),
            action: () => {
                console.log("Abrir cámara no implementado aún");
            },
            type: "button",
            hideOnDesktop: true,
        },
        {
            icon: <ClipIcon />,
            title: t("uploadDocument"),
            desc: t("upDocDesc"),
            type: "dropzone",
            onDrop: handleDropFiles
        }
    ];

    return (
        <div className={styles.containerNewDoc} onClick={() => dispatch(setShowModal(false))}>
            <div className={styles.containerModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.headerModal}>
                    <div className={styles.buttonText}>
                        <button
                            style={{ background: '#10A37F' }}
                            onClick={() => dispatch(setShowModal(false))}
                        >
                            <ArrowDown />
                        </button>
                        <p>{t('newInvoice')}</p>
                    </div>
                    <button
                        style={{ background: '#9C9E9D', color: 'white' }}
                        onClick={() => dispatch(setShowModal(false))}
                    >
                        X
                    </button>
                </div>

                <div className={styles.containerContent}>
                    {options.filter((item) => {
                        return isMobile ? true : !item.hideOnDesktop;
                    })
                    .map((item, index) => {
                        const isDropZone = item.type === "dropzone";

                        return (
                            <div
                                key={index}
                                className={`${styles.contentCard} ${loader && item.type === "dropzone" ? styles.loaderBorder : ''}`}
                                onClick={!isDropZone ? item.action : undefined}
                                onDrop={isDropZone ? (e) => item.onDrop(e) : undefined}
                                onDragOver={isDropZone ? (e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.opacity = "0.7";
                                    e.currentTarget.style.transform = "scale(1.02)";
                                } : undefined}
                                onDragLeave={isDropZone ? (e) => {
                                    e.currentTarget.style.opacity = "1";
                                    e.currentTarget.style.transform = "scale(1)";
                                } : undefined}
                                style={{
                                    cursor: isDropZone ? "copy" : "pointer",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <span>{item.icon}</span>
                                <p>{item.title}</p>
                                <span>{item.desc}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}