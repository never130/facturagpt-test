import React, { useState, useEffect } from 'react';
// import styles from './MessageGraph.module.css';
import styles from './MessageGraph.module.css';
import { apiUrl } from '../../../../../../apiBackend';
import { ReactComponent as IconAsset } from './assets/icon-asset.svg'
import { ReactComponent as IconContact } from './assets/icon-contact.svg'
import { ReactComponent as IconDoc } from './assets/icon-doc.svg'
import { ReactComponent as IconGraphArea } from './assets/icon-graph-area.svg'
import { ReactComponent as IconGraphCircular } from './assets/icon-graph-circular.svg'
import { ReactComponent as IconGraphDispersion } from './assets/icon-graph-dispersion.svg'
import { ReactComponent as IconGraphDona } from './assets/icon-graph-dona.svg'
import { ReactComponent as IconGraphLineal } from './assets/icon-graph-lineal.svg'
import { ReactComponent as IconGraphRadar } from './assets/icon-graph-radar.svg'
import { ReactComponent as IconParam } from './assets/icon-param.svg'
import { ReactComponent as IconTable } from './assets/icon-table.svg'
import { ReactComponent as IconSearch } from './assets/icon-search.svg'
import mermaid from "mermaid";
mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose",
});

const MessageGraph = ({ message, insertMessage, conf }) => {

    let mermaidCode = '';

    const { agentId, chatId } = conf;


    // const corporateColors = {
    //     primary: 'green',
    //     secondary: 'teal',
    //     accent: 'darkgreen',
    //     light: 'lightgreen',
    //     dark: 'darkgreen',
    //     neutral: 'grey'
    // };


    const graphId = `mermaid-${Date.now()}`;

    const [svg, setSvg] = useState('');

    const fn = async () => {

        console.log('message111111111', message)


        switch (message.text.style) {
            case 'pie':
                mermaidCode = `pie
                                      title "${message.text.data.title || "Distribución"}"
                                      ${message.text.data.slices
                        .map(slice => `"${slice.label}" : ${slice.value}`)
                        .join("\n")}`;
                break;

            case 'bar':
                mermaidCode = `xychart-beta
                                      title "${message.text.data.title || "Valores"}"
                                      x-axis [${message.text.data.bars.map(bar => `"${bar.label}"`).join(", ")}]
                                      y-axis "Valores" 0 --> ${Math.max(...message.text.data.bars.map(bar => bar.value))}
                                      bar [${message.text.data.bars.map(bar => bar.value).join(", ")}]`;
                break;

            case 'flow':
                mermaidCode = `flowchart TD
                                      ${message.text.data.nodes
                        .map(node => `${node.id}["${node.label}"]`)
                        .join("\n")}
                                      ${message.text.data.edges
                        .map(edge => `${edge.from} --> ${edge.to}`)
                        .join("\n")}`;
                break;

            case 'sequence':
                mermaidCode = `sequenceDiagram
                                      participant A as "${message.text.data.participants[0]}"
                                      participant B as "${message.text.data.participants[1]}"
                                      ${message.text.data.messages
                        .map(msg => `${msg.from}->>+${msg.to}: ${msg.text}`)
                        .join("\n")}`;
                break;

            default:
                mermaidCode = `pie
                                      title "Sin datos"
                                      "Sin datos" : 100`;
        }

        try {
            console.log('efrrfr')
            const { svg: svg1 } = await mermaid.render(
                graphId,
                mermaidCode
            );

            console.log('svg1', svg1)
            setSvg(svg1);

        } catch (error) {
            console.error('Error al renderizar el gráfico:', error);
            return <div>Error al renderizar el gráfico</div>;
        }
    }


    useEffect(() => {
        fn()
        // console.log('efrrfr')
        // const { svg } = mermaid.render(
        //     graphId,
        //     mermaidCode
        // );
        // setSvg(svg);
    }, []);

    const graphTypes = [
        {
            name: 'Gráfico Circular',
            value: 'pie',
            icon: <IconGraphCircular />
        }, {
            name: 'Gráfico de Área',
            value: 'area',
            icon: <IconGraphArea />
        }, {
            name: 'Gráfico Lineal',
            value: 'line',
            icon: <IconGraphLineal />
        }, {
            name: 'Gráfico de Dispersión',
            value: 'scatter',
            icon: <IconGraphDispersion />
        }, {
            name: 'Gráfico de Dona',
            value: 'doughnut',
            icon: <IconGraphDona />
        }
    ]

    const tables = [
        {
            icon: <IconTable />,
            label: 'Fecha',
            value: 'fecha'
        },

    ]

    const params = [
        {
            icon: <IconParam />,
            label: 'Fecha',
            value: 'fecha'
        },
    ]

    const params2 = [
        {
            icon: <IconParam />,
            label: 'Salario',
            value: 'salario'
        }, {
            icon: <IconParam />,
            label: 'Edad',
            value: 'edad'
        }, {
            icon: <IconParam />,
            label: 'Cantidad',
            value: 'cantidad'
        }, {
            icon: <IconParam />,
            label: 'Coste unitario',
            value: 'coste_unitario'
        },
    ]


    const [graphState, setGraphState] = useState(200);


    const fnMessage = async ({status, value}) => {
        try {

            const user = localStorage.getItem('user');
            const userJson = JSON.parse(user || '{}');
            const token = userJson?.accessToken;

            console.log('graphState', agentId, chatId)

            await fetch(`${apiUrl}/api/chat/graph/${agentId}/${chatId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/octet-stream",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    // scrapId: scrapId,
                    type: 'graph',
                    value: value,
                    status: status,
                }),
            }).then(response => {
                console.log('res', response)

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
                                        const { text, type, graphId } = chunk.data;

                                        console.log('chunk automate indexx', text, type, graphId)
                                        if (type === "graph") {
                                            console.log('1111111')
                                            insertMessage({ text: text, isGraph: true, graphId, timestamp: Date.now() })
                                            // if (text?.type === 'data-error') {
                                            break
                                            // }
                                        }
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
            })
        } catch (error) {
            console.error('Error ejecutando scraping:', error);
        }
    }


    let status = message.text.status || 200;

    return (
        <div className={styles.isGraph}>
            {status == 200 ? (
                <div className={styles.graph}>
                    <p>
                        ¡Hola! Soy tu asistente de análisis de datos. Puedo ayudarte a crear gráficas personalizadas. ¿Qué tipo de visualización necesitas?
                    </p>
                    <ul>
                        {graphTypes.map((item, index) => (
                            <li key={index} onClick={() => fnMessage({ status: 200, value: item.value })}>
                                <div className={styles.icon}>
                                    {item.icon}
                                </div>
                                <span className={styles.name}>
                                    {item.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : status == 201 ? (
                <div className={styles.table}>
                    <p>
                        Perfecto! Vamos a trabajar con Datos Personalizados. Primero selecciona la tabla que quieres analizar:
                    </p>
                    <div className={styles.search}>
                        <div>
                            <IconSearch />
                            <input type="text" placeholder="Buscar tabla" />
                        </div>
                    </div>
                    <ul>
                        {tables.map((item, index) => (
                            <li key={index} onClick={() => fnMessage({ status: 201, value: item.value })}>
                                <div className={styles.icon}>
                                    {item.icon}
                                </div>
                                <div className={styles.info}>
                                    <span>{item.label}</span>
                                    <span>00 registros</span>
                                    <span>00 GB</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => fnMessage({ status: 201, value: 'fecha' })}>
                        Siguiente
                    </button>
                </div>
            ) : status == 202 ? (
                <div className={styles.param}>
                    <p>
                        Excelente! Has seleccionado la tabla "Contactos". Ahora elige el campo para el eje X:
                    </p>
                    <ul>
                        {params.map((item, index) => (
                            <li key={index} onClick={() => fnMessage({ status: 202, value: item.value })}>
                                <div>
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : status == 203 ? (
                <div className={styles.param}>
                    <p>
                        Perfecto! Has elegido "Fecha " para el eje X. Ahora selecciona el campo para el eje Y (valores):
                    </p>
                    <ul>
                        {params2.map((item, index) => (
                            <li key={index} onClick={() => fnMessage({ status: 203, value: item.value })}>
                                <div>
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : status == 204 ? (
                <div className={styles.svg}>
                    <p>
                        ¡Genial! He creado tu gráfico de bar mostrando [Y] por [X] de la tabla "Empleados". Aquí tienes el resultado:
                    </p>
                    <div
                        dangerouslySetInnerHTML={{
                            // __html: message.text,
                            __html: svg,
                        }}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default MessageGraph;    