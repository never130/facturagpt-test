import React, { useState, useEffect } from 'react';
import styles from './Device.module.css';

import { useDispatch } from 'react-redux';
import { updateSubscription } from '../../../../../../actions/user';


const Device = ({
  showSidebar,
  setShowSidebar,
  setDeleteChats,
  setShowColorPicker,
  colors,
}) => {

  const dispatch = useDispatch();

  const [permission, setPermission] = useState(Notification.permission);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);

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



  useEffect(() => {
    const registerSW = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/worker.js');
          setSwRegistration(registration);

          navigator.serviceWorker.ready.then(registration => {
            registration.active.postMessage({
              type: 'GET_LOGS'
            });
          });


          const subscription = await registration.pushManager.getSubscription();

          if (subscription) {
            const userAgent = navigator.userAgent;
            const deviceInfo = {
              type: (() => {
                if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
                  return 'Mobile';
                } else if (/Tablet|iPad/i.test(userAgent)) {
                  return 'Tablet';
                } else {
                  return 'Desktop';
                }
              })(),
              brand: (() => {
                if (/iPhone/i.test(userAgent)) return 'Apple';
                if (/iPad/i.test(userAgent)) return 'Apple';
                if (/Android/i.test(userAgent)) {
                  const match = userAgent.match(/\(.*?\)/);
                  return match ? match[0].split(';')[1]?.trim() || 'Unknown Android' : 'Unknown Android';
                }
                if (/Windows/i.test(userAgent)) return 'Windows PC';
                if (/Macintosh/i.test(userAgent)) return 'Mac';
                if (/Linux/i.test(userAgent)) return 'Linux';
                return 'Unknown';
              })(),
              browser: (() => {
                if (/Chrome/i.test(userAgent)) return 'Chrome';
                if (/Firefox/i.test(userAgent)) return 'Firefox';
                if (/Safari/i.test(userAgent)) return 'Safari';
                if (/Edge/i.test(userAgent)) return 'Edge';
                if (/Opera|OPR/i.test(userAgent)) return 'Opera';
                if (/MSIE|Trident/i.test(userAgent)) return 'Internet Explorer';
                return 'Unknown';
              })()
            };


            const response = await dispatch(updateSubscription({
              subscription,
              deviceInfo
            }))
          } else {
            const response = await fetch('/api/notifications/vapidPublicKey');
            const vapidPublicKey = await response.text();

            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey
            });
          }
        }
      } catch (error) {
        console.error('Error registrando SW:', error);
      }
    };


    registerSW();
  }, []);

  const showNotification = async (notification) => {
    alert(1)
    try {
      if (!swRegistration) {
        throw new Error('Service Worker no registrado');
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permiso denegado');
      }


      const testData = {
        title: 'Test Notification',
        body: 'Esta es una notificación de prueba',
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      };


      swRegistration.active.postMessage({
        type: 'NOTIFICATION_SENT',
        data: testData
      });


      await swRegistration.showNotification(testData.title, {
        body: testData.body,
        data: testData,
        requireInteraction: true
      });


    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  navigator.serviceWorker.getRegistration().then(reg => {
  });

  return (
    <div className={styles.container}>
      <h2>Demo de Notificaciones</h2>
      {permission} ||| permission?·?$
      {permission !== 'granted' && (
        <div className={styles.permissionSection}>
          <p>Para ver las demos, necesitamos tu permiso para mostrar notificaciones</p>
          <button
            onClick={() => showNotification({
              title: 'Prueba de Notificación',
              body: 'Esta es una notificación de prueba',
              icon: '/logo192.png'
            })}
            disabled={permission === 'denied'}
            className={styles.permissionButton}
          >
            {permission === 'denied'
              ? 'Notificaciones bloqueadas'
              : 'Permitir Notificaciones'}
          </button>
        </div>
      )}

      {permission === 'granted' && (
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