import React from 'react';
import styles from './MessageExitAgent.module.css';

import { ReactComponent as IconAlert } from './assets/icon-alert.svg';
import { ReactComponent as IconClose } from './assets/icon-close.svg';
import { ReactComponent as IconSave } from './assets/icon-save.svg';
import { ReactComponent as IconVerify } from './assets/icon-verify.svg';

const MessageExitAgent = ({ message }) => {
    if (true) {
        return (
            <div className={styles.container}>
            <div className={styles.messageExitAgent}>
                <p>
                    ¿Deseas finalizar con la configuración de [docname] [agentname] [appname] [assetname] [tablename]?
                </p>
                <div className={styles.buttons}>
                    <button>
                        <IconVerify />
                        Salir sin guardar
                    </button>
                    <button>
                        <IconSave />
                        Sí, guardar
                    </button>
                    <button>
                        <IconClose />
                        No, seguir editando
                    </button>
                </div>
            </div>

            <div className={styles.messageExitAgentAlert}>
                <IconAlert />
                <p>
                    Has finalizado tu configuración de [docname] [agentname] [appname] [assetname] [tablename] sastificatoriamente!
                </p>
            </div>
            </div>
        );
    } else {
        return (
            <div className={styles.messageExitAgent}>
                <IconAlert />
                <p>
                    Has finalizado tu configuración de [docname] [agentname] [appname] [assetname] [tablename] sastificatoriamente!
                </p>
            </div>
        )
    }

};

export default MessageExitAgent;