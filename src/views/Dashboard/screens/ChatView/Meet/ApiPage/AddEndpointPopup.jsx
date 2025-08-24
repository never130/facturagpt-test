import React, { useState } from "react";
import styles from "./AddEndpointPopup.module.css";

const AddEndpointPopup = ({ isOpen, onClose, onAddEndpoint }) => {
    const [endpointData, setEndpointData] = useState({
        url: "",
        method: "POST",
        name: ""
    });
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

    const handleInputChange = (field, value) => {
        setEndpointData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTest = async () => {
        if (!endpointData.url.trim()) {
            setTestResult({ success: false, message: "Por favor ingresa una URL válida" });
            return;
        }

        setIsTesting(true);
        setTestResult(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const isSuccess = Math.random() > 0.3;
            setTestResult({
                success: isSuccess,
                message: isSuccess 
                    ? "Endpoint probado exitosamente" 
                    : "Error al conectar con el endpoint"
            });
        } catch (error) {
            setTestResult({
                success: false,
                message: "Error al probar el endpoint"
            });
        } finally {
            setIsTesting(false);
        }
    };

    const handleAdd = () => {
        if (!endpointData.url.trim() || !endpointData.name.trim()) {
            setTestResult({ success: false, message: "Por favor completa todos los campos" });
            return;
        }

        onAddEndpoint(endpointData);
        onClose();
        setEndpointData({ url: "", method: "POST", name: "" });
        setTestResult(null);
    };

    const handleClose = () => {
        onClose();
        setEndpointData({ url: "", method: "POST", name: "" });
        setTestResult(null);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Añadir Endpoint</h3>
                    <button onClick={handleClose} className={styles.closeButton}>
                        {/* <IconClose /> */}
                        icon close
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.inputGroup}>
                        <label>Nombre del endpoint</label>
                        <input
                            type="text"
                            placeholder="Ej: Login de usuarios"
                            value={endpointData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>URL del endpoint</label>
                        <input
                            type="text"
                            placeholder="https://api.ejemplo.com/auth/login"
                            value={endpointData.url}
                            onChange={(e) => handleInputChange("url", e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Método HTTP</label>
                        <div className={styles.methodSelector}>
                            {httpMethods.map((method) => (
                                <button
                                    key={method}
                                    className={`${styles.methodButton} ${
                                        endpointData.method === method ? styles.active : ""
                                    }`}
                                    onClick={() => handleInputChange("method", method)}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {testResult && (
                        <div className={`${styles.testResult} ${
                            testResult.success ? styles.success : styles.error
                        }`}>
                            {testResult.message}
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <button 
                        onClick={handleTest} 
                        className={styles.testButton}
                        disabled={isTesting || !endpointData.url.trim()}
                    >
                        {/* <IconPlay /> */}
                        icon play 
                        {isTesting ? "Probando..." : "Probar Endpoint"}
                    </button>
                    
                    <div className={styles.actionButtons}>
                        <button onClick={handleClose} className={styles.cancelButton}>
                            Cancelar
                        </button>
                        <button 
                            onClick={handleAdd} 
                            className={styles.addButton}
                            disabled={!endpointData.url.trim() || !endpointData.name.trim()}
                        >
                            Añadir Endpoint
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEndpointPopup; 