import React, { useState, useEffect } from 'react';
import styles from './Device.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { updateSubscription, deleteSubscription, addSubscription } from '../../../../../../actions/notifications';


import { ReactComponent as IconArrowDown } from './assets/icon-arrow-down.svg';
import { ReactComponent as IconDesktop } from './assets/icon-desktop.svg';
import { ReactComponent as IconLaptop } from './assets/icon-laptop.svg';
import { ReactComponent as IconTablet } from './assets/icon-tablet.svg';
import { ReactComponent as IconMobile } from './assets/icon-mobile.svg';
import { ReactComponent as IconVerify } from './assets/icon-verify.svg';




const Device = ({

}) => {

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.user);

    const [permission, setPermission] = useState(Notification.permission);
    const [loading, setLoading] = useState(false);
    const [subscription, setSubscription] = useState(null);

    const [devices, setDevices] = useState([]);


    useEffect(() => {
        setDevices(user?.subscription || []);
    }, []);


    const demoNotifications = [
        {
            title: "Nueva Factura",
            body: "Se ha generado una nueva factura #F-2024-001",
            icon: "https://cdn-icons-png.flaticon.com/512/1024/1024914.png"
        },
        {
            title: "Recordatorio de Pago",
            body: "Tienes un pago pendiente que vence mañana",
            icon: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png"
        },
        {
            title: "Documento Procesado",
            body: "Tu documento ha sido procesado exitosamente",
            icon: "https://cdn-icons-png.flaticon.com/512/3767/3767084.png"
        }
    ];


    const [swRegistration, setSwRegistration] = useState(null);



    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }


    const handleAddSubscription = async () => {
        try {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/worker.js');
                setSwRegistration(registration);

                navigator.serviceWorker.ready.then(registration => {
                    registration.active.postMessage({
                        type: 'GET_LOGS'
                    });
                });


                const res = await fetch('/api/notifications/vapidPublicKey');
                const vapidPublicKey = await res.text();
                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);


                const subscription = await registration.pushManager.getSubscription();
                const isVapidKeyMatch = (sub, currentKey) => {
                    if (!sub?.options?.applicationServerKey) return false;
                    const existingKey = new Uint8Array(sub.options.applicationServerKey);
                    return existingKey.toString() === currentKey.toString();
                };




                if (!subscription || !isVapidKeyMatch(subscription, convertedVapidKey)) {
                    if (subscription) await subscription.unsubscribe(); // Cancelar vieja
                    subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                    });
                }


                const userAgent = navigator.userAgent;
                const deviceInfo = {
                    type: /Mobi|Android|iPhone|iPad/i.test(userAgent) ? 'Mobile' : 'Desktop',
                    brand: (() => {
                        if (/iPhone|iPad/i.test(userAgent)) return 'Apple';
                        if (/Android/i.test(userAgent)) return 'Android';
                        if (/Windows/i.test(userAgent)) return 'Windows';
                        if (/Macintosh/i.test(userAgent)) return 'Mac';
                        return 'Unknown';
                    })(),
                    browser: (() => {
                        if (/Chrome/i.test(userAgent)) return 'Chrome';
                        if (/Firefox/i.test(userAgent)) return 'Firefox';
                        if (/Safari/i.test(userAgent)) return 'Safari';
                        if (/Edge/i.test(userAgent)) return 'Edge';
                        if (/Opera|OPR/i.test(userAgent)) return 'Opera';
                        return 'Unknown';
                    })()
                };

                // 5. Enviar al backend
                const response = await dispatch(updateSubscription({
                    subscription,
                    deviceInfo
                }));

                if (response.payload?.success) {
                    setDevices([...devices, { keys: subscription, deviceInfo }]);
                }

            }
        } catch (error) {
            console.error('Error registrando SW:', error);
        }
    };



    const showNotification = async (notification) => {
        try {
            const testData = {
                title: 'Test Notification',
                body: 'Esta es una notificación de prueba',
                timestamp: Date.now(),
                id: Math.random().toString(36).substr(2, 9)
            };


            const response = await dispatch(addSubscription(testData))
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    navigator.serviceWorker.getRegistration().then(reg => {
        console.log('Service Worker registrado:', reg);
    });



    const handleDeleteSubscription = async (endpoint) => {
        const response = await dispatch(deleteSubscription(endpoint))

        if (response.payload.success) {
            setDevices(devices.filter(device => device.keys.endpoint !== endpoint))
        }
    }

    return (
        <div className={styles.container}>

            <div className={styles.panel}>
                <div className={styles.lastSignIn}>
                    <b>
                        Last sign in
                    </b>
                    <p>
                        today at 18:34, Safary 198.123.23.23
                    </p>
                </div>
                <div className={styles.totalActiveSessions}>
                    <div className={styles.totalActiveSessionsTitle}>
                        Total active sessions
                        <div className={styles.totalActiveSessionsCount}>
                            (2)
                            <IconArrowDown />
                        </div>
                    </div>
                    <ul className={styles.totalActiveSessionsList}>
                        <li className={styles.totalActiveSessionsItem}>
                            <div className={styles.totalActiveSessionsItemIcon}>
                                {true ? (
                                    <IconDesktop />

                                ) : false ? (
                                    <IconLaptop />

                                ) : false ? (

                                    <IconTablet />
                                ) : false ? (
                                    <IconMobile />
                                ) : 'null'}
                            </div>
                            <div className={styles.totalActiveSessionsItemInfo}>
                                <div className={styles.totalActiveSessionsItemInfoTitle}>
                                    <b>
                                        Desktop-6ITIC5G
                                    </b>
                                    <label />
                                    <p className={styles.totalActiveSessionsItemInfoLocation}>
                                        kyvi, Ukranie
                                    </p>
                                </div>
                                <div className={styles.totalActiveSessionsItemInfoBrowser}>
                                    <b>
                                        Chrome
                                    </b>
                                    <label />
                                    <p>
                                        04/19/2022
                                    </p>
                                </div>
                            </div>
                            <div className={styles.totalActiveSessionsItemVerify}>
                                <IconVerify />
                            </div>
                        </li>
                    </ul>
                </div>
                <div className={styles.totalActiveSessionsButtons}>
                    <div className={styles.totalActiveSessionsButtonsCloseAll}>
                        <button className={styles.totalActiveSessionsButtonsClose}>
                            Close all active sessiones
                        </button>
                        <button >
                            Close session
                        </button>
                    </div>
                </div>
            </div>



            <button onClick={() => handleAddSubscription()}>
                Add suscription
            </button>

            &&&&&&&&&&&&&&&&&&
            {devices.map((device, index) => (
                <div key={index}>
                    <h2>{device?.deviceInfo?.type}</h2>
                    <p>{device?.deviceInfo?.brand}</p>
                    <p>{device?.deviceInfo?.browser}</p>
                    <div>
                        <p>Endpoint: {device?.keys?.endpoint}</p>
                        <p>P256DH: {device?.keys?.p256dh}</p>
                        <p>Auth: {device?.keys?.auth}</p>
                    </div>
                    <button onClick={() =>
                        handleDeleteSubscription(device?.keys?.endpoint)
                    }>
                        Eliminar
                    </button>
                </div>
            ))}


            <h2>Demo de Notificaciones</h2>
            {permission} ||| permission?·?$
            

            {true && (
                <div className={styles.demoSection}>
                    <p>!!Haz clic en cualquier ejemplo para ver la notificación:</p>
                    <div className={styles.notificationGrid}>
                        {demoNotifications.map((notification, index) => (
                            <button
                                key={index}
                                onClick={() => showNotification(notification)}
                                disabled={loading}
                                className={styles.demoButton}
                            >
                                <img src={notification.icon} alt="" className={styles.demoIcon} />
                                <h3>{notification.title}</h3>
                                <p>{notification.body}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}


export default Device;