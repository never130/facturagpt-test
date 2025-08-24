import styles from './index.module.css'
import { useState, useMemo } from 'react'



import { ReactComponent as IconSearch } from './assets/icon-search.svg'
import { ReactComponent as IconAntesDe } from './assets/icon-antes-de.svg'
import { ReactComponent as IconArrastrar } from './assets/icon-arrastrar.svg'
import { ReactComponent as IconAutomatizacion } from './assets/icon-automatizacion.svg'
import { ReactComponent as IconAvanzados } from './assets/icon-avanzados.svg'
import { ReactComponent as IconBotonRadio } from './assets/icon-boton-radio.svg'
import { ReactComponent as IconCapturaHtml } from './assets/icon-captura-html.svg'
import { ReactComponent as IconCapturaDePantalla } from './assets/icon-capture-de-pantalla.svg'
import { ReactComponent as IconCoincideConAlguna } from './assets/icon-coincide-con-alguna.svg'
import { ReactComponent as IconCoincideConTodos } from './assets/icon-coincide-con-todos.svg'
import { ReactComponent as IconComparacionNumerica } from './assets/icon-comparacion-numerica.svg'
import { ReactComponent as IconContiene } from './assets/icon-contiene.svg'
import { ReactComponent as IconDespuesDe } from './assets/icon-despues-de.svg'
import { ReactComponent as IconDiaDeLaSemana } from './assets/icon-dia-de-la-semana.svg'
import { ReactComponent as IconDistintoDeRango } from './assets/icon-distinto-de-rango.svg'
import { ReactComponent as IconDistintoDe } from './assets/icon-distinto-de.svg'
import { ReactComponent as IconEjecutarJavascript } from './assets/icon-ejecutar-javascript.svg'
import { ReactComponent as IconEmpiezaCon } from './assets/icon-empieza-con.svg'
import { ReactComponent as IconEnFechaEspecifica } from './assets/icon-en-fecha-especifica.svg'
import { ReactComponent as IconEnLista } from './assets/icon-en-lista.svg'
import { ReactComponent as IconEntreFechas } from './assets/icon-entre-fechas.svg'
import { ReactComponent as IconEntre } from './assets/icon-entre.svg'
import { ReactComponent as IconEnviarWebhook } from './assets/icon-enviar-webhook.svg'
import { ReactComponent as IconEsAyer } from './assets/icon-es-ayer.svg'
import { ReactComponent as IconEsFalso } from './assets/icon-es-falso.svg'
import { ReactComponent as IconEsHoy } from './assets/icon-es-hoy.svg'
import { ReactComponent as IconEsIgualIgnorando } from './assets/icon-es-igual-ignorando.svg'
import { ReactComponent as IconEsMañana } from './assets/icon-es-mañana.svg'
import { ReactComponent as IconEsMayuscula } from './assets/icon-es-mayuscula.svg'
import { ReactComponent as IconEsMinuscula } from './assets/icon-es-minuscula.svg'
import { ReactComponent as IconEsNulo } from './assets/icon-es-nulo.svg'
import { ReactComponent as IconEsVerdadero } from './assets/icon-es-verdadero.svg'
import { ReactComponent as IconEsperarCarga } from './assets/icon-esperar-carga.svg'
import { ReactComponent as IconEsperarTiempo } from './assets/icon-esperar-tiempo.svg'
import { ReactComponent as IconEsperarElemento } from './assets/icon-esperar-elemento.svg'

import { ReactComponent as IconEsperasYValidaciones } from './assets/icon-esperas-y-validaciones.svg'
import { ReactComponent as IconEstaSemana } from './assets/icon-esta-semana.svg'
import { ReactComponent as IconEstaVacio } from './assets/icon-esta-vacio.svg'
import { ReactComponent as IconEsteAño } from './assets/icon-este-año.svg'
import { ReactComponent as IconEsteMes } from './assets/icon-este-mes.svg'
import { ReactComponent as IconExactamenteIgual } from './assets/icon-exactamente-igual.svg'
import { ReactComponent as IconExpresionRegular } from './assets/icon-expresion-regular.svg'
import { ReactComponent as IconExtraerTabla } from './assets/icon-extraer-tabla.svg'
import { ReactComponent as IconExtraerTexto } from './assets/icon-extraer-texto.svg'
import { ReactComponent as IconExtraerEnlaces } from './assets/icon-extraer-enlaces.svg'
import { ReactComponent as IconExtraerImagenes } from './assets/icon-extraer-imagenes.svg'
import { ReactComponent as IconExtraerYProcesar } from './assets/icon-extraer-y-procesar.svg'
import { ReactComponent as IconFechaYTiempo } from './assets/icon-fecha-y-tiempo.svg'
import { ReactComponent as IconFuente } from './assets/icon-fuente.svg'
import { ReactComponent as IconGuardarDatos } from './assets/icon-guardar-datos.svg'
import { ReactComponent as IconHacerClic } from './assets/icon-hacer-clic.svg'
import { ReactComponent as IconHacerScroll } from './assets/icon-hacer-scroll.svg'
import { ReactComponent as IconIA } from './assets/icon-ia.svg'
import { ReactComponent as IconIgualA } from './assets/icon-igual-a.svg'
import { ReactComponent as IconInteraccion } from './assets/icon-interaccion.svg'
import { ReactComponent as IconLongitudDentro } from './assets/icon-longitud-dentro.svg'
import { ReactComponent as IconLongitudIgualA } from './assets/icon-longitud-igual-a.svg'
import { ReactComponent as IconLongitudMayorQue } from './assets/icon-longitud-mayor-que.svg'
import { ReactComponent as IconLongitudMenorQue } from './assets/icon-longitud-menor-que.svg'
import { ReactComponent as IconMarcarCasilla } from './assets/icon-marcar-casilla.svg'
import { ReactComponent as IconMayorIgual } from './assets/icon-mayor-igual.svg'
import { ReactComponent as IconMenorIgual } from './assets/icon-menor-igual.svg'
import { ReactComponent as IconMenorQue } from './assets/icon-menor-que.svg'
import { ReactComponent as IconMayorQue } from './assets/icon-mayor-que.svg'
import { ReactComponent as IconNavegacion } from './assets/icon-navegacion.svg'
import { ReactComponent as IconNoContiene } from './assets/icon-no-contiene.svg'
import { ReactComponent as IconNoEnLista } from './assets/icon-no-en-lista.svg'
import { ReactComponent as IconNoEsNulo } from './assets/icon-no-es-nulo.svg'
import { ReactComponent as IconNoEstaVacio } from './assets/icon-no-esta-vacio.svg'
import { ReactComponent as IconNulosYExistencia } from './assets/icon-nulos-y-existencia.svg'
import { ReactComponent as IconParsearRaton } from './assets/icon-parsear-raton.svg'
import { ReactComponent as IconParsearFecha } from './assets/icon-parsear-fecha.svg'
import { ReactComponent as IconPrompt } from './assets/icon-prompt.svg'
import { ReactComponent as IconRangoYListas } from './assets/icon-rango-y-listas.svg'
import { ReactComponent as IconRecargar } from './assets/icon-recargar.svg'
import { ReactComponent as IconRedondeoIgualA } from './assets/icon-redondeo-igual-a.svg'
import { ReactComponent as IconRellenarTexto } from './assets/icon-rellenar-texto.svg'
import { ReactComponent as IconRetroceder } from './assets/icon-retroceder.svg'
import { ReactComponent as IconSeleccionarMenu } from './assets/icon-seleccionar-menu.svg'
import { ReactComponent as IconSubirArchivo } from './assets/icon-subir-archivo.svg'
import { ReactComponent as IconTerminaCon } from './assets/icon-termina-con.svg'
import { ReactComponent as IconTexto } from './assets/icon-text.svg'
import { ReactComponent as IconTruncadoIgualA } from './assets/icon-truncado-igual-a.svg'
import { ReactComponent as IconValidarElemento } from './assets/icon-validar-elemento.svg'
import { ReactComponent as IconValidarTexto } from './assets/icon-validar-texto.svg'
import { ReactComponent as IconVerificarExistencia } from './assets/icon-verificar-existencia.svg'
import { ReactComponent as IconZoom } from './assets/icon-zoom.svg'
import { ReactComponent as IconComparacion } from './assets/icon-comparacion.svg'


import { ReactComponent as IconPlus } from './assets/icon-plus.svg'
import { ReactComponent as IconVariable } from './assets/icon-var.svg'
import { ReactComponent as IconOperator } from './assets/icon-operator.svg'
import { ReactComponent as IconValue } from './assets/icon-value.svg'
import { ReactComponent as IconBrackets } from './assets/icon-brackets.svg'
import { ReactComponent as IconAutomate } from './assets/icon-automate.svg'


const ActionsView = ({ onActionSelect, onClose }) => {

    const [searchTerm, setSearchTerm] = useState('')

    const actions = [{
        icon: <IconNavegacion />,
        name: 'Navegación y Movimiento',
        description: 'Acciones para moverse, abrir, recargar y manipular la vista del contenido.',
        actions: [{
            icon: <IconFuente />,
            name: 'Fuente',
            description: 'Navegar a una página web específica',
        }, {
            icon: <IconRetroceder />,
            name: 'Retroceder',
            description: 'Volver a la página anterior',
        }, {
            icon: <IconRecargar />,
            name: 'Recargar',
            description: 'Recargar la página actual',
        }, {
            icon: <IconHacerScroll />,
            name: 'Hacer scroll',
            description: 'Desplazarse vertical u horizontalmente',
        }, {
            icon: <IconZoom />,
            name: 'Zoom',
            description: 'Ampliar o reducir zoom de página',
        }, {
            icon: <IconParsearRaton />,
            name: 'Pasar ratón',
            description: 'Mover ratón sobre elemento para mostrar menús',
        }, {
            icon: <IconArrastrar />,
            name: 'Arrastrar y soltar',
            description: 'Arrastrar elemento a otra posición',
        }],
    }, {
        icon: <IconInteraccion />,
        name: 'Interacción con Elementos',
        description: 'Acciones para interactuar con elementos de la página.',
        actions: [{
            icon: <IconHacerClic />,
            name: 'Hacer clic',
            description: 'Hacer clic en un elemento (botón, enlace, etc.)',
        }, {
            icon: <IconBotonRadio />,
            name: 'Botón radio',
            description: 'Seleccionar opción de radio button',
        }, {
            icon: <IconMarcarCasilla />,
            name: 'Marcar casilla',
            description: 'Marcar o desmarcar checkbox',
        }, {
            icon: <IconSeleccionarMenu />,
            name: 'Seleccionar en menú',
            description: 'Seleccionar opción en menú desplegable',
        }, {
            icon: <IconRellenarTexto />,
            name: 'Rellenar texto',
            description: 'Escribir texto en campos de entrada',
        }, {
            icon: <IconSubirArchivo />,
            name: 'Subir archivo',
            description: 'Subir archivo desde el sistema',
        }],
    }, {
        icon: <IconEsperasYValidaciones />,
        name: 'Esperas y Validaciones',
        description: 'Acciones para pausar hasta que algo ocurra y comprobar que está correcto.',
        actions: [{
            icon: <IconGuardarDatos />,
            name: 'Esperar Elemento',
            description: 'Esperar a que aparezca un elemento',
        }, {
            icon: <IconEsperarTiempo />,
            name: 'Esperar Tiempo',
            description: 'Pausa fija en milisegundos',
        }, {
            icon: <IconEsperarCarga />,
            name: 'Esperar Carga',
            description: 'Esperar que cargue completamente la página',
        }, {
            icon: <IconValidarTexto />,
            name: 'Validar Texto',
            description: 'Verificar que existe texto específico',
        }, {
            icon: <IconValidarElemento />,
            name: 'Validar Elemento',
            description: 'Verificar que existe un elemento',
        }]
    }, {
        icon: <IconExtraerYProcesar />,
        name: 'Extraer y Procesar Información',
        description: 'Acciones para obtener, guardar, enviar o transformar datos del contenido.',
        actions: [{
            icon: <IconExtraerTexto />,
            name: 'Extraer Texto',
            description: 'Extraer texto de elementos específicos',
        }, {
            icon: <IconCapturaHtml />,
            name: 'Captura HTML',
            description: 'Obtener HTML completo o de elemento',
        }, {
            icon: <IconExtraerEnlaces />,
            name: 'Extraer Enlaces',
            description: 'Obtener URLs de enlaces en la página',
        }, {
            icon: <IconExtraerImagenes />,
            name: 'Extraer Imágenes',
            description: 'Obtener URLs de imágenes en la página',
        }, {
            icon: <IconExtraerTabla />,
            name: 'Extraer Tabla',
            description: 'Obtener datos estructurados de tablas',
        }, {
            icon: <IconCapturaDePantalla />,
            name: 'Captura de Pantalla',
            description: 'Tomar screenshot de página o elemento',
        }, {
            icon: <IconGuardarDatos />,
            name: 'Guardar Datos',
            description: 'Guardar datos en variables',
        }, {
            icon: <IconEnviarWebhook />,
            name: 'Enviar Webhook',
            description: 'Enviar datos a URL externa',
        }, {
            icon: <IconAutomate />,
            name: 'Automatización',
            description: 'Enviar datos a Automatización de tu espacio de trabajo',
        }, {
            icon: <IconEjecutarJavascript />,
            name: 'Ejecutar JavaScript',
            description: 'Ejecutar código JavaScript en la página',
        }]
    }]

    // Filtrar acciones basado en el término de búsqueda
    const filteredActions = useMemo(() => {
        if (!searchTerm.trim()) {
            return actions
        }

        const searchLower = searchTerm.toLowerCase()
        
        return actions.filter(category => {
            // Buscar en el nombre de la categoría
            const categoryMatch = category.name.toLowerCase().includes(searchLower) ||
                                category.description.toLowerCase().includes(searchLower)
            
            // Buscar en las acciones individuales
            const actionsMatch = category.actions.some(action => 
                action.name.toLowerCase().includes(searchLower) ||
                action.description.toLowerCase().includes(searchLower)
            )
            
            return categoryMatch || actionsMatch
        }).map(category => {
            // Si la categoría coincide, mostrar todas las acciones
            // Si solo las acciones coinciden, filtrar solo esas
            if (category.name.toLowerCase().includes(searchLower) ||
                category.description.toLowerCase().includes(searchLower)) {
                return category
            } else {
                return {
                    ...category,
                    actions: category.actions.filter(action =>
                        action.name.toLowerCase().includes(searchLower) ||
                        action.description.toLowerCase().includes(searchLower)
                    )
                }
            }
        }).filter(category => category.actions.length > 0)
    }, [searchTerm, actions])

    // Función para manejar la selección de una acción
    const handleActionSelect = (action) => {
        if (onActionSelect) {
            console.log('action', action)
            onActionSelect('action', action);
        }
    };

    // Función para manejar el cambio en el input de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <div className={styles.container}>
        <div className={styles.search}>
            <div className={styles.icon}>
                <IconSearch />
            </div>
            <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className={styles.button}>
                /
            </div>
        </div>
        <ul className={styles.actions}>
            {filteredActions.map((action) => (
                <li 
                key={action.name}
               
                >
                    <div className={styles.item}>
                        <div className={styles.icon}>
                            {action.icon}
                        </div>
                        <div className={styles.info}>
                            <b>
                                {action.name}
                            </b>
                            <p>
                                {action.description}
                            </p>
                        </div>
                    </div>
                    <ul className={styles.actions}>
                        {action?.actions?.map((ac) => (
                            <li 
                            key={ac.name}  
                            onClick={() => handleActionSelect(ac)}
                            style={{ cursor: 'pointer' }}
                            title="Haz clic para seleccionar esta acción"
                            >
                                <div className={styles.icon}>
                                    {ac.icon}
                                </div>
                                <div className={styles.info}>
                                    <b>
                                        {ac.name}
                                    </b>
                                    <p>
                                        {ac.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    </div>
    )
}

export default ActionsView