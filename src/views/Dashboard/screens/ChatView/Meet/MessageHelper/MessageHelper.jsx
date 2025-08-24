import { useState } from 'react';
import styles from './MessageHelper.module.css';

import { ReactComponent as IconAccount } from './assets/icon-account.svg';
import { ReactComponent as IconActivity } from './assets/icon-activity.svg';
import { ReactComponent as IconAgent } from './assets/icon-agent.svg';
import { ReactComponent as IconCommunity } from './assets/icon-community.svg';
import { ReactComponent as IconDocument } from './assets/icon-document.svg';
import { ReactComponent as IconFirstSteps } from './assets/icon-first-step.svg';
import { ReactComponent as IconSuscription } from './assets/icon-suscription.svg';
import { ReactComponent as IconTables } from './assets/icon-tables.svg';
import { ReactComponent as IconWorkflow } from './assets/icon-workflow.svg';

import { apiUrl } from '../../../../../../apiBackend';


const MessageHelper = ({ message, setMessages, conf }) => {
    const {
        agentId,
        chatId,
    } = conf;

    const [items, setItems] = useState([{
        id: 'first-steps',
        name: 'Primeros pasos',
        icon: <IconFirstSteps />,
    }, {
        id: 'documents',
        name: 'Documentos',
        icon: <IconDocument />,
    }, {
        id: 'account',
        name: 'Tu Cuenta',
        icon: <IconAccount />,
    }, {
        id: 'activity',
        name: 'Actividad',
        icon: <IconActivity />,
    }, {
        id: 'tables',
        name: 'Tablas',
        icon: <IconTables />,
    }, {
        id: 'community',
        name: 'Comunidad',
        icon: <IconCommunity />,
    }, {
        id: 'workflows',
        name: 'Workflows',
        icon: <IconWorkflow />,
    }, {
        id: 'security',
        name: 'Seguridad',
        icon: <IconSuscription />,
    }, {
        id: 'agents',
        name: 'Agentes',
        icon: <IconAgent />,
    }, {
        id: 'suscription',
        name: 'Suscripción',
        icon: <IconSuscription />,
    }]);

    const [selectedItem, setSelectedItem] = useState(null);


    const handleHelper = async (item) => {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;

        console.log('item: ', item)
        console.log('item: ', agentId)
        console.log('item: ', chatId)
        console.log('item: ', token)

        const res = await fetch(`${apiUrl}/api/chat/${agentId}/${chatId}/messages`, {
            method: "POST",
            body: JSON.stringify({
                text: item.id,
                type: 'fn',
                isHelper: true,
            }),
            headers: {
                "Content-Type": "application/octet-stream",
                Authorization: `Bearer ${token}`,
            },

        }).then((response) => {
            if (response.ok) {
                const reader = response.body.getReader();

                const decoder = new TextDecoder();
                let accumulatedChunks = "";

                const processStream = async () => {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            break;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        accumulatedChunks += chunk;

                        let lines = accumulatedChunks.split("\n");
                        accumulatedChunks = lines.pop();



                        for (const line of lines) {
                            if (line.trim()) {
                                try {
                                    const chunk = JSON.parse(line);
                                    const { text, type } = chunk.data;
                                    console.log('chunk: ', chunk)

                                    console.log('chunk !!!!!: ', text, type)
                                   
                                    if(type === 'text') {
                                        setMessages(prev => {
                                            return [...prev, {
                                                text: text,
                                                type: 'bot',
                                                timestamp: new Date().toISOString()
                                            }];
                                        })
                                    }

                                    // if (type === "helper") {
                                    //     if (text?.type === 'data-error') {
                                    //         reader.cancel();
                                    //         break
                                    //     }

                                    //     if(text?.type === 'text') {
                                    //         setMessages(prev => {
                                    //             return [...prev, {
                                    //                 text: text,
                                    //                 type: 'bot',
                                    //                 timestamp: new Date().toISOString()
                                    //             }];
                                    //         })
                                    //     }

                                    //     // if (text?.type === 'loaded') {
                                    //     // } else if (text.type === 'data-processed') {
                                    //     // } else if (text.type === 'data-finished') {
                                    //     //     if (index !== -1) {
                                    //     //         let message = {
                                    //     //             type: 'bot',
                                    //     //             isAutomate: true,
                                    //     //             text: automations[index]?.automate,
                                    //     //             timestamp: new Date().toISOString()
                                    //     //         }

                                    //     //         if (autoClear) {
                                    //     //             setMessages([message])
                                    //     //         } else {
                                    //     //             setMessages(prev => {
                                    //     //                 return [...prev, message];;
                                    //     //             })
                                    //     //         }
                                    //     //     }
                                    //     // }
                                    // }

                                } catch (error) {
                                    console.error("Failed to parse JSON:", error);
                                }
                            }
                        }
                    }
                };

                processStream()
                    .then(() => { })
                    .catch(console.error);
            }
        });

    }

    return (
        <div className={styles.messageHelper}>
            <div className={styles.messageHelperTitle}>
                <h3>Hola, soy el asistente de ayuda de FacturaGPT. ¿En qué puedo ayudarte?</h3>
            </div>
            <div className={styles.messageHelperItems}>
                {items.map((item) => (
                    <div
                        className={styles.messageHelperItem}
                        onClick={() => handleHelper(item)}
                        key={item.id}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageHelper;