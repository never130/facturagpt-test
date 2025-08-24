import React from 'react';
import styles from './MessageBluetooth.module.css';

const MessageBluetooth = ({ message }) => {
    return (
        <div>
            <div>
                Configurar de Conexión
                icon bluetooth
                Bluetooth
                Conexión principal
            </div>
            <div>
                Activo
            </div>
            <div>
                icon wifi
                Wifi Sync
                Sincronización automática
                Disponible
            </div>
            <div>
                icon mobile
                Notificaciones
                Alertas del teléfono
            </div>
            <div>
                Activado
            </div>
            <div>
                Hola! primero debes conectar tu dispositivo
            </div>
            <div>
                Dispositivos encontrados
            </div>
            <div>
                icon mobile
                iPhone de Juan
                Teléfono
            </div>
            <div>
                icono battery
                85%
                icon verify
            </div>
            <div>
                --------------------------------
            </div>
            <div>
                icon laptop
                iPhone de Juan
                Teléfono
            </div>
            <div>
                icono battery
                85%
                icon verify
            </div>
        </div>
    );
};

export default MessageBluetooth;