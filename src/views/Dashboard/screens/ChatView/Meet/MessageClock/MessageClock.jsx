import React from 'react';
import styles from './MessageClock.module.css';

const MessageClock = ({ message }) => {
    return (
        <div className={styles.messageClock}>
            Tu smartwatch ha sido conectado, controla tus datos de salud
            a través del chat.

            G-SHOCK CBD-H200
            icon bluetooth
            BluetoothWifi Sync

            conectado


            icon walk

            Caminar Ejericio a pie

            Pasos
            Calorías 
            Ritmo Cardiaco

            icon ciclismo 
            Ciclismo 
            Bicicleta +

            Cadencia 
            Potencia 
            Desnivel

            Hoy

            Añadir una tabla existente
        </div>
    );
};

export default MessageClock;