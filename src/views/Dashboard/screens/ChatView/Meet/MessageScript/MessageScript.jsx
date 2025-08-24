import React, { useState, useEffect, useRef } from 'react';
import styles from './MessageScript.module.css';

const MessageScript = ({ message, messageContainerRef }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [currentBot, setCurrentBot] = useState('');
    const chatContainerRef = useRef(null);

    // Usar los datos dinámicos del script.js si están disponibles
    // console.log('MessageScript - message received:', message);
    // console.log('MessageScript - message.text:', message?.text);
    // console.log('MessageScript - message.text.data:', message?.text?.data);
    
    // Los datos están en message.text.data según lo detectado
    const scriptData = message?.text?.data || message?.data?.data || message?.data;
    const allMessages = scriptData?.conversation || [];
    const interlocutors = scriptData?.interlocutors || [];
    
    // console.log('MessageScript - scriptData:', scriptData);
    // console.log('MessageScript - allMessages:', allMessages);
    // console.log('MessageScript - interlocutors:', interlocutors);
    
    // Crear un mapa de interlocutores para facilitar el acceso
    const interlocutorsMap = interlocutors.reduce((acc, interlocutor) => {
        acc[interlocutor.name] = {
            name: interlocutor.name,
            role: interlocutor.role,
            temperature: interlocutor.temperature,
            personality: interlocutor.personality,
            color: getBotColor(interlocutor.name),
            avatar: getBotAvatar(interlocutor.name)
        };
        return acc;
    }, {});

    // Función para obtener el color del bot basado en el nombre
    function getBotColor(name) {
        const colorMap = {
            'Whatsapp': '#25D366',
            'WhatsApp': '#25D366',
            'Gmail': '#EA4335',
            'OpenAi': '#412991',
            'OpenAI': '#412991',
            'FacturaGPT': '#007bff'
        };
        return colorMap[name] || '#6c757d';
    }

    // Función para obtener el avatar del bot basado en el nombre
    function getBotAvatar(name) {
        const avatarMap = {
            'Whatsapp': '📱',
            'WhatsApp': '📱',
            'Gmail': '📧',
            'OpenAi': '🤖',
            'OpenAI': '🤖',
            'FacturaGPT': '📊'
        };
        return avatarMap[name] || '🤖';
    }

    const scrollToBottom = () => {
        if (messageContainerRef && messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Debug effect para monitorear cambios en los datos
    // useEffect(() => {
    //     console.log('MessageScript - Data changed, allMessages length:', allMessages.length);
    //     console.log('MessageScript - Current scriptData:', scriptData);
    //     if (allMessages.length > 0) {
    //         console.log('MessageScript - First message:', allMessages[0]);
    //     }
    // }, [scriptData, allMessages.length]);

    useEffect(() => {
        if (currentMessageIndex >= allMessages.length || allMessages.length === 0) {
            return;
        }

        const currentMessage = allMessages[currentMessageIndex];
        const speakerName = currentMessage.speaker;

        setCurrentBot(speakerName);
        setIsTyping(true);

        // Simular tiempo de escritura
        const typingTimer = setTimeout(() => {
            setIsTyping(false);
            
            const newMessage = {
                id: currentMessageIndex,
                bot: speakerName,
                text: currentMessage.text,
                emotion: currentMessage.emotion,
                timestamp: formatTimestamp(currentMessage.timestamp),
                originalTimestamp: currentMessage.timestamp
            };

            setMessages(prev => [...prev, newMessage]);

            // Avanzar al siguiente mensaje después de un delay calculado
            const messageTimer = setTimeout(() => {
                setCurrentMessageIndex(prev => prev + 1);
            }, calculateMessageDelay(currentMessage.text));

            return () => clearTimeout(messageTimer);
        }, 1500);

        return () => clearTimeout(typingTimer);
    }, [currentMessageIndex, allMessages.length]);

    // Función para calcular el delay basado en la longitud del texto
    function calculateMessageDelay(text) {
        const wordsCount = text.split(' ').length;
        return Math.max(1000, wordsCount * 200); // Mínimo 1s, 200ms por palabra
    }

    // Función para formatear timestamp
    function formatTimestamp(timestamp) {
        if (typeof timestamp === 'number') {
            const minutes = Math.floor(timestamp / 60);
            const seconds = timestamp % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    const renderMessage = (message) => {
        const bot = interlocutorsMap[message.bot] || {
            name: message.bot,
            color: '#6c757d',
            avatar: '🤖'
        };
        
        return (
            <div key={message.id} className={`${styles.message} ${styles.visible}`}>
                <div 
                    className={styles.avatar}
                    style={{ backgroundColor: bot.color }}
                >
                    {bot.avatar}
                </div>
                <div className={styles.messageContent}>
                    <div className={`${styles.messageBubble} ${styles[message.emotion] || ''}`}>
                        {message.text}
                    </div>
                    <div className={styles.messageHeader}>
                        <span className={styles.botName}>{bot.name}</span>
                        <span className={styles.messageTime}>{message.timestamp}</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderTypingIndicator = () => {
        if (!isTyping) return null;

        const bot = interlocutorsMap[currentBot] || {
            name: currentBot,
            color: '#6c757d',
            avatar: '🤖'
        };
        
        return (
            <div className={styles.message}>
                <div 
                    className={styles.avatar}
                    style={{ backgroundColor: bot.color }}
                >
                    {bot.avatar}
                </div>
                <div className={styles.typingIndicator}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                </div>
            </div>
        );
    };

    // Calcular progreso dinámicamente
    const progressPercentage = allMessages.length > 0 ? (currentMessageIndex / allMessages.length) * 100 : 0;
    const currentStep = allMessages.length > 0 ? 
        // `Mensaje ${currentMessageIndex} de ${allMessages.length}` : 
        `` : 
        scriptData ? 'Procesando conversación...' : 'Cargando script...';

    return (
        <div className={styles.messageApi}>
            <div className={styles.chatHeader}>
             
                {/* {scriptData && (
                    <p className={styles.headerSubtitle}>
                        Duración estimada: {Math.floor(scriptData.duration / 60)}:{(scriptData.duration % 60).toString().padStart(2, '0')} min
                    </p>
                )} */}
                {/* Debug info - remover después */}
                {!scriptData && (
                    <div style={{padding: '10px', background: '#f8f9fa', margin: '10px 0', fontSize: '12px'}}>
                        <strong>Debug Info:</strong><br/>
                        Message exists: {message ? 'Yes' : 'No'}<br/>
                        Message.text exists: {message?.text ? 'Yes' : 'No'}<br/>
                        Message.text.data exists: {message?.text?.data ? 'Yes' : 'No'}<br/>
                        Message.data exists: {message?.data ? 'Yes' : 'No'}<br/>
                        ScriptData: {scriptData ? 'Found' : 'Not found'}<br/>
                        AllMessages length: {allMessages.length}
                    </div>
                )}
            </div>
            
            <div className={styles.chatContainer} ref={chatContainerRef}>
                {messages.map(renderMessage)}
                {renderTypingIndicator()}
            </div>
            
            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className={styles.currentStep}>
                    {currentStep}
                    {Math.round(progressPercentage)}% completado
                </div>
            </div>
        </div>
    );
};

export default MessageScript;