import styles from './MessageComingSoon.module.css'

import { ReactComponent as AppsIcon } from './assets/icon-apps.svg'
import { ReactComponent as MapIcon } from './assets/icon-map.svg'
import { ReactComponent as BluetoothIcon } from './assets/icon-bluetooth.svg'
import { ReactComponent as TimerIcon } from './assets/icon-timer.svg'
import { ReactComponent as AddDocIcon } from './assets/icon-add-doc.svg'
import { ReactComponent as TaskIcon } from './assets/icon-task.svg'
import { ReactComponent as SportGptIcon } from './assets/icon-sport-gpt.svg'
import { ReactComponent as EduGptIcon } from './assets/icon-edu-gpt.svg'
import { ReactComponent as EventGptIcon } from './assets/icon-event-gpt.svg'
import { ReactComponent as LegalGptIcon } from './assets/icon-legal-gpt.svg'
import { ReactComponent as CalendarIcon } from './assets/icon-calendar.svg'
import { ReactComponent as TalentGptIcon } from './assets/icon-talent-gpt.svg'
import { ReactComponent as TurismGptIcon } from './assets/icon-turism-gpt.svg'
import { ReactComponent as GraphIcon } from './assets/icon-graph.svg'
import { ReactComponent as SettingsIcon } from './assets/icon-settings.svg'
import { ReactComponent as PlusIcon } from './assets/icon-plus.svg'

const items = [
    {
        key: 'apps',
        title: 'Apps',
        description:
            'Editor híbrido código + no-code para crear tus propias aplicaciones, conectar flujos y almacenar información de forma segura.',
        Icon: <AppsIcon />,
        progress: '50%',
    },
    {
        key: 'map',
        title: 'Mapa',
        description: 'Mapa interactivo con indicaciones y resultados en tiempo real.',
        Icon: <MapIcon />,
        progress: '20%',
    },
    {
        key: 'bluetooth',
        title: 'Bluetooth',
        description: 'Conecta FacturaGPT con tus dispositivos y sistemas.',
        Icon: <BluetoothIcon />,
        progress: '50%',
    },
    {
        key: 'timer',
        title: 'Cronómetro y temporizador',
        description: 'Guarda y gestiona variables de tiempo con precisión.',
        Icon: <TimerIcon />,
        progress: '20%',
    },
    {
        key: 'add-doc',
        title: 'Generar documentos desde el Chat',
        description: 'Crea y edita documentos directamente desde la conversación.',
        Icon: <AddDocIcon />,
        progress: '70%',
    },
    {
        key: 'tasks',
        title: 'Tareas',
        description: 'Gestión visual con tarjetas Kanban.',
        Icon: <TaskIcon />,
        progress: '70%',
    },
    {
        key: 'sport-gpt',
        title: 'DeporteGPT',
        description: 'Usa todos tus datos de tu para sacar el máximo potencial',
        Icon: <SportGptIcon />,
        progress: '10%',
    },
    {
        key: 'edu-gpt',
        title: 'EduGPT',
        description: 'Corrección y generación automática de contenidos educativos.',
        Icon: <EduGptIcon />,
        progress: '10%',
    },
    {
        key: 'event-gpt',
        title: 'EventosGPT',
        description: 'Organiza y automatiza eventos de forma inteligente.',
        Icon: <EventGptIcon />,
        progress: '25%',
    },
    {
        key: 'legal-gpt',
        title: 'LegalGPT',
        description: 'Firmas y gestión de documentos legales.',
        Icon: <LegalGptIcon />,
        progress: '30%',
    },
    {
        key: 'calendar',
        title: 'Calendar Chat',
        description: 'Automatización completa de tu calendario desde el chat.',
        Icon: <CalendarIcon />,
        progress: '60%',
    },
    {
        key: 'talent-gpt',
        title: 'TalentoGPT',
        description: 'Conexión directa con LinkedIn y herramientas de RRHH.',
        Icon: <TalentGptIcon /> ,
        progress: '90%',
    },
    {
        key: 'turism-gpt',
        title: 'TurismoGPT',
        description: 'Gestión de reservas y rutas turísticas vía API.',
        Icon: <TurismGptIcon />,
        progress: '60%',
    },
    {
        key: 'graph',
        title: 'Gráficas',
        description: 'Más opciones de visualización y análisis de datos.',
        Icon: <GraphIcon />,
        progress: '50%',
    }
]

const MessageComingSoon = () => {
    return (
        <div className={styles.messageComingSoon}>
            <p className={styles.intro}>
                Estamos trabajando para que pronto puedas disfrutar de estas nuevas funciones
                directamente desde el chat. Aquí te mostramos el progreso:
            </p>

            <div className={styles.grid}>
                {items.map((item, key) => (
                    <div key={key} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.icon}>
                                {item.Icon}
                            </div>
                            <h3 className={styles.title}>{item.title}</h3>
                        </div>
                        <div className={styles.cardContent}>
                            {item.description ? (
                                <p className={styles.description}>{item.description}</p>
                            ) : null}
                        </div>
                        <div className={styles.progress}>
                            <div
                                className={styles.progressBar}
                                style={{ width: item.progress }}
                            >
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.config}>
                <div className={styles.configHeader}>
                    <div className={styles.icon1}>
                        <SettingsIcon />
                    </div>
                    <h3 className={styles.title}>Configuración</h3>
                    <div className={styles.icon}>
                        <PlusIcon />
                    </div>
                </div>
                <p className={styles.configDescription}>
                    Procesos y flujos adaptados a tu operativa con garantía de instalación por personal verificado.
                </p>
                <button className={styles.configButton}>
                    Contacta ahora
                </button>
            </div>
        </div>
    )
}

export default MessageComingSoon