import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './Chat.module.css';

const Chat = ({ selectedNode, updateNodeData, deleteNode, nodes = [], edges = [] }) => {
  const [t] = useTranslation("ChatView");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '¡Hola! Soy tu asistente de testing para flujos de automatización. Puedo ayudarte a probar tus flujos paso a paso. ¿Qué quieres probar hoy?',
      timestamp: new Date(),
      nodeId: null,
      result: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      nodeId: null,
      result: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Entiendo que quieres probar: "${inputValue}". El sistema de testing está funcionando correctamente.`,
        timestamp: new Date(),
        nodeId: null,
        result: null
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.chatTitle}>
          <Bot size={20} />
          <span>Flow Testing Assistant</span>
        </div>
        {selectedNode && (
          <div className={styles.selectedNodeInfo}>
            <span>Selected: {selectedNode.data?.title}</span>
            <button 
              className={styles.deleteNodeBtn}
              onClick={() => deleteNode(selectedNode.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`${styles.message} ${styles[message.type]}`}
          >
            <div className={styles.messageIcon}>
              {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={styles.messageContent}>
              <div className={styles.messageText}>
                {message.content}
              </div>
              <div className={styles.messageTime}>
                {formatTime(message.timestamp)}
                {message.nodeId && (
                  <span className={styles.nodeId}> | Node: {message.nodeId}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.messageIcon}>
              <Bot size={16} />
            </div>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Proporciona los datos de entrada..."
          className={styles.messageInput}
          rows={1}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          className={styles.sendButton}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default Chat; 