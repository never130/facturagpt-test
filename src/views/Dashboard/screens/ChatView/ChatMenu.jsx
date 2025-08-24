import React, { useEffect, useRef, useState } from "react";

import styles from "./ChatMenu.module.css";

import { ReactComponent as IconAddApp } from "./assets/menu/icon-add-app.svg";
import { ReactComponent as IconAddAsset } from "./assets/menu/icon-add-asset.svg";
import { ReactComponent as IconAddAutomate } from "./assets/menu/icon-add-automate.svg";
import { ReactComponent as IconAddContact } from "./assets/menu/icon-add-contact.svg";
import { ReactComponent as IconAddDoc } from "./assets/menu/icon-add-doc.svg";
import { ReactComponent as IconAddFolder } from "./assets/menu/icon-add-folder.svg";
import { ReactComponent as IconAddGraph } from "./assets/menu/icon-add-graph.svg";
import { ReactComponent as IconApp } from "./assets/menu/icon-app.svg";
import { ReactComponent as IconAsset } from "./assets/menu/icon-asset.svg";
import { ReactComponent as IconAutomate } from "./assets/menu/icon-automate.svg";
import { ReactComponent as IconBluetooth } from "./assets/menu/icon-bluetooth.svg";
import { ReactComponent as IconContact } from "./assets/menu/icon-contact.svg";
import { ReactComponent as IconData } from "./assets/menu/icon-data.svg";
import { ReactComponent as IconDocument } from "./assets/menu/icon-document.svg";
import { ReactComponent as IconMore } from "./assets/menu/icon-more.svg";
import { ReactComponent as IconGraph } from "./assets/menu/icon-graph.svg";
import { ReactComponent as IconImage } from "./assets/menu/icon-image.svg";
import { ReactComponent as IconPeriodico } from "./assets/menu/icon-periodico.svg";
import { ReactComponent as IconScrap } from "./assets/menu/icon-scrap.svg";
import { ReactComponent as IconSearch } from "./assets/menu/icon-search.svg";
import { ReactComponent as IconTable } from "./assets/menu/icon-table.svg";
import { ReactComponent as IconWeb } from "./assets/menu/icon-web.svg";
import { ReactComponent as ImageDefault } from "./assets/menu/image-default.svg";
import { ReactComponent as IconGraphArea } from "./assets/menu/icon-graph-area.svg";
import { ReactComponent as IconGraphCircle } from "./assets/menu/icon-graph-circle.svg";
import { ReactComponent as IconGraphDispersion } from "./assets/menu/icon-graph-dispersion.svg";
import { ReactComponent as IconGraphDona } from "./assets/menu/icon-graph-dona.svg";
import { ReactComponent as IconGraphLineal } from "./assets/menu/icon-graph-lineal.svg";
import { ReactComponent as IconGraphRadar } from "./assets/menu/icon-graph-radar.svg";
import { ReactComponent as IconAdd } from "./assets/menu/icon-add.svg";
import { ReactComponent as IconAddTable } from "./assets/menu/icon-add-table.svg";

import { ReactComponent as IconAgent } from "./assets/menu/icon-agent.svg";
import { ReactComponent as IconOrchestrator } from "./assets/menu/icon-orchestrator.svg";
// import { ReactComponent as IconImage } from "./assets/menu/icon-image.svg";
// import { ReactComponent as IconWeb } from "./assets/menu/icon-web-navigator.svg";
// import { ReactComponent as IconBluetoothConnection } from "./assets/menu/icon-bluetooth-connection.svg";
import { ReactComponent as IconEditAgent } from "./assets/menu/icon-edit-agent.svg";


const ChatMenu = ({ setOpen, setIsOpen }) => {

    const [state, setState] = useState('create');
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                const closeSetter = setOpen || setIsOpen;
                if (typeof closeSetter === 'function') {
                    closeSetter(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, [setOpen, setIsOpen]);

    return (
        <div ref={menuRef} style={{ position: 'relative' }}>
            <ChatMenuHome setState={setState} />
            {state == 'create' && <ChatMenuCreate setState={setState} />}
            {state == 'agent' && <ChatMenuAgent setState={setState} />}
            {state == 'contact' && <ChatMenuContact setState={setState} />}
            {state == 'asset' && <ChatMenuAsset setState={setState} />}
            {state == 'table' && <ChatMenuTable setState={setState} />}
            {state == 'graph' && <ChatMenuGraph setState={setState} />}
            {state == 'automate' && <ChatMenuAutomate setState={setState} />}
            {state == 'document' && <ChatMenuDocument setState={setState} />}
            {state == 'app' && <ChatMenuApp setState={setState} />}
            {state == 'image' && <ChatMenuImage setState={setState} />}
            {state == 'scrap' && <ChatMenuScrap setState={setState} />}
        </div>
    )
}

export default ChatMenu;

const ChatMenuHome = ({ setState }) => {
    return (
        <ul className={styles.menu}>
            <li onClick={() => setState('create')}>
                <div className={styles.icon}>
                    <IconAdd />
                </div>
                Crear
            </li>
            <li onClick={() => setState('table')}>
                <div className={styles.icon}>
                    <IconTable />
                </div>
                Tablas
            </li>
            <li onClick={() => setState('automate')}>
                <div className={styles.icon}>
                    <IconAutomate />
                </div>
                Automatizaciones
                {true && (
                    <label className={styles.label}>
                        3
                    </label>
                )}
            </li>
            <li onClick={() => setState('graph')}>
                <div className={styles.icon}>
                    <IconImage />
                </div>
                Galeria
            </li>
            <li onClick={() => setState('graph')}>
                <div className={styles.icon}>
                    <IconGraph />
                </div>
                Gráficas
            </li>
            <li onClick={() => setState('scrap')}>
                <div className={styles.icon}>
                    <IconWeb />
                </div>
                Extracción Web
            </li>
            <li onClick={() => setState('app')}>
                <div className={styles.icon}>
                    <IconApp />
                </div>
                Apps
            </li>
            <li onClick={() => setState('agent')}>
                <div className={styles.icon}>
                    <IconAgent />
                </div>
                Agente
            </li>
        </ul>
    )
}


const ChatMenuCreate = ({ setState }) => {
    return (
        <ul className={`${styles.menu} ${styles.create}`}>
            <li onClick={() => setState('contact')}>
                <IconAddContact />
                Nuevo Contacto
            </li>
            <li onClick={() => setState('document')}>
                <IconAddDoc />
                Nuevo Documento
            </li>
            <li onClick={() => setState('asset')}>
                <IconAddAsset />
                Nuevo Activo
            </li>
            <li onClick={() => setState('graph')}>
                <IconAddGraph />
                Nueva Gráfica
            </li>
            <li onClick={() => setState('automate')}>
                <IconAddAutomate />
                Nueva Automatización
            </li>
            <li onClick={() => setState('app')}>
                <IconAddApp />
                Nueva App
            </li>
        </ul>
    )
}


const ChatMenuAgent = ({ setState }) => {
    return (
        <ul className={`${styles.menu} ${styles.agent}`}>

            <li>
                <div className={styles.icon}>
                    <IconOrchestrator />
                </div>
                Orquestador
                <label className={styles.switch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                </label>
            </li>
            <li>
                <div className={styles.icon}>
                    <IconImage />
                </div>
                Generacion de imagenes
                <label className={styles.switch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                </label>
            </li>
            <li>
                <div className={styles.icon}>
                    <IconWeb />
                </div>
                Navegacion Web
                <label className={styles.switch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                </label>
            </li>
            <li>
                <div className={styles.icon}>
                    <IconBluetooth />
                </div>
                Conexión Bluetooth
                <label className={styles.switch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                </label>
            </li>
            <li>
                <div className={styles.icon}>
                    <IconEditAgent />
                </div>
                Editar agente
            </li>
        </ul>
    )
}


const ChatMenuContact = ({ setState }) => {
    return (
        <div className={styles.list}>
            <div className={styles.search}>
                <div className={styles.icon}>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div className={styles.label}>
                    /
                </div>
                <ul>
                    <li>
                        <div className={styles.image}>
                            <ImageDefault />
                        </div>
                        <div className={styles.info}>
                            <b>
                                Nombre de la Cuenta
                            </b>
                            <span>
                                Email adress, Dirección, Población, Provincia, Código Postal, País
                            </span>
                        </div>
                    </li>
                </ul>
                <button>
                    <IconAddContact />
                    Nuevo Contacto
                </button>
            </div>
        </div>

    )
}


const ChatMenuAsset = ({ setState }) => {
    return (
        <div className={styles.list}>
            <div className={styles.search}>
                <div className={styles.icon}>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div className={styles.label}>
                    /
                </div>
            </div>
            <ul>
                <li>
                    <div className={styles.image}>
                        <ImageDefault />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre del Activo
                        </b>
                        <span>
                            Descripción
                        </span>
                    </div>
                </li>
            </ul>
            <button>
                <IconAddAsset />
                Nuevo Activo
            </button>
        </div>
    )
}





const ChatMenuTable = ({ setState }) => {
    return (
        <div className={styles.list}>
            <div className={styles.search}>
                <div className={styles.icon}>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div className={styles.label}>
                    /
                </div>
            </div>
            <ul>
                <li>
                    <div className={styles.image}>
                        <ImageDefault />
                    </div>
                    <div className={styles.info}>
                        <b>
                            TableName
                        </b>
                        <span>
                            Privada
                        </span>
                    </div>
                </li>
            </ul>
            <button>
                <IconAddTable />
                Nueva Tabla
            </button>
        </div>

    )
}


const ChatMenuGraph = ({ setState }) => {
    return (
        <div className={styles.list}>
            <div className={styles.search}>
                <div className={styles.icon}>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div className={styles.label}>
                    /
                </div>
            </div>
            < ul >
                <li>
                    <div className={styles.image}>
                        <IconGraphCircle />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre del Gráfico
                        </b>
                        <span>
                            Gráfico Circular
                        </span>
                    </div>
                </li>
                <li>
                    <div className={styles.image}>
                        <IconGraphArea />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre del Gráfico
                        </b>
                        <span>
                            Gráfico de Área
                        </span>
                    </div>
                </li>
                <li>
                    <div className={styles.image}>
                        <IconGraphRadar />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre del Gráfico
                        </b>
                        <span>
                            Gráfico de Radar
                        </span>
                    </div>
                </li>
                <li>
                    <div className={styles.image}>
                        <IconGraphLineal />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre del Gráfico
                        </b>
                        <span>
                            Gráfico Lineal
                        </span>
                    </div>
                </li>
                <li>
                    <div className={styles.image}>
                        <IconGraphDona />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre del Gráfico
                        </b>
                        <span>
                            Gráfico de Dispersión
                        </span>
                    </div>
                </li>
                <li>
                    <div className={styles.image}>
                        <IconGraphRadar />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre del Gráfico
                        </b>
                        <span>
                            Gráfico de Dona
                        </span>
                    </div>
                </li>
            </ul >
            <button>
                <IconAddGraph />
                Nueva Gráfica
            </button>
        </div>
    )
}





const ChatMenuDocument = ({ setState }) => {
    return (
        <div className={styles.list}>
            <div className={styles.search}>
                <div className={styles.icon}>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div className={styles.label}>
                    /
                </div>
            </div>
            <ul>
                <li>
                    <div className={styles.image}>
                        <ImageDefault />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre de la automatización
                        </b>
                        <div>
                            <label>
                                /ubicacion
                            </label>
                            <span>
                                15 páginas
                            </span>
                            <span>
                                Hace 2 horas
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
            <button>
                <IconAddAutomate />
                Nueva Automatización
            </button>
        </div>
    )
}


const ChatMenuAutomate = ({ setState }) => {
    return (
        <div className={styles.list}>
            <div className={styles.search}>
                <div className={styles.icon}>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div className={styles.label}>
                    /
                </div>
            </div>
            <ul>
                <li>
                    <div className={styles.image}>
                        <ImageDefault />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre de la automatización
                        </b>
                        <span>
                            Descripción
                        </span>
                    </div>
                </li>
            </ul>
            <button>
                <IconAddAutomate />
                Nueva Automatización
            </button>
        </div>
    )
}






const ChatMenuApp = ({ setState }) => {
    return (
        <div className={styles.list}>
            <div className={styles.search}>
                <div className={styles.icon}>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div className={styles.label}>
                    /
                </div>
            </div>
            <ul>
                <li>
                    <div className={styles.image}>
                        <ImageDefault />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre de la app
                        </b>
                        <div>
                            <label>
                                Categoría
                            </label>
                            <span>
                                15 páginas
                            </span>
                            ·
                            <span>
                                Hace 2 horas
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
            <button>
                <IconAddApp />
                Nueva App
            </button>
        </div>
    )
}




const ChatMenuScrap = ({ setState }) => {
    return (
        <div className={styles.list}>
            <div className={styles.search}>
                <div className={styles.icon}>
                    <IconSearch />
                </div>
                <input type="text" placeholder="Buscar..." />
                <div className={styles.label}>
                    /
                </div>
            </div>
            < ul >
                <li>
                    <div className={styles.image}>
                        <ImageDefault />
                    </div>
                    <div className={styles.info}>
                        <b>
                            Nombre de la automatización
                        </b>
                        <div>
                            <label>
                                elperiodico.es
                            </label>
                            <span>
                                Hace 2 horas
                            </span>
                        </div>
                    </div>
                </li>
            </ul >
            <button>
                <IconAddDoc />
                Nuevo Documento
            </button>
        </div>
    )
}
