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



const OperatorView = ({ onOperatorSelect, onClose }) => {

    const [searchTerm, setSearchTerm] = useState('')

    const operators = [{
        icon: <IconComparacion />,
        name: 'Comparación Númerica y Lógica',
        description: 'Operadores básicos de comparación',
        operators: [{
            icon: <IconIgualA />,
            name: 'Igual a',
            description: 'Igual al valor',
            vars: ['text', 'number', 'date', 'boolean']
        }, {
            icon: <IconExactamenteIgual />,
            name: 'Exactamente igual',
            description: 'Igual al valor',
            vars: ['text', 'number', 'boolean']
        }, {
            icon: <IconDistintoDe />,
            name: 'Distinto de',
            description: 'Valor diferente',
            vars: ['text', 'number', 'date', 'boolean']
        }, {
            icon: <IconMayorQue />,
            name: 'Mayor que',
            description: 'Mayor que el valor',
            vars: ['number', 'date']
        }, {
            icon: <IconMenorQue />,
            name: 'Menor que',
            description: 'Menor que el valor',
            vars: ['number', 'date']
        }, {
            icon: <IconMayorIgual />,
            name: 'Mayor o igual que',
            description: 'Igual o mayor',
            vars: ['number', 'date']
        }, {
            icon: <IconMenorIgual />,
            name: 'Menor o igual que',
            description: 'Igual o menor',
            vars: ['number', 'date']
        }, {
            icon: <IconEsVerdadero />,
            name: 'Valor booleano true',
            description: 'Valor booleano true',
            vars: ['boolean']
        }, {
            icon: <IconEsFalso />,
            name: 'Valor booleano false',
            description: 'Valor booleano false',
            vars: ['boolean']
        }]
    }, {
        icon: <IconRangoYListas />,
        name: 'Rango y Listas',
        description: 'Operadores para rangos y listas',
        operators: [{
            icon: <IconEntre />,
            name: 'Entre',
            description: 'Dentro de un rango (inclusive)',
            vars: ['number', 'date']
        }, {
            icon: <IconDistintoDeRango />,
            name: 'Distinto de rango',
            description: 'Fuera de un rango',
            vars: ['number', 'date']
        }, {
            icon: <IconEnLista />,
            name: 'En lista',
            description: 'Valor dentro de una lista',
            vars: ['text', 'number']
        }, {
            icon: <IconNoEnLista />,
            name: 'No en lista',
            description: 'Valor no está en lista',
            vars: ['text', 'number']
        }, {
            icon: <IconCoincideConAlguna />,
            name: 'Coincide con alguno',
            description: 'Coincide con al menos uno',
            vars: ['text', 'number']
        }, {
            icon: <IconCoincideConTodos />,
            name: 'Coincide con todos',
            description: 'Coincide con todos',
            vars: ['text', 'number']
        }]
    }, {
        icon: <IconTexto />,
        name: 'Texto',
        description: 'Operadores para texto',
        operators: [{
            icon: <IconContiene />,
            name: 'Contiene',
            description: 'Contiene el texto',
            vars: ['text']
        }, {
            icon: <IconNoContiene />,
            name: 'No contiene',
            description: 'No contiene el texto',
            vars: ['text']
        }, {
            icon: <IconEmpiezaCon />,
            name: 'Empieza con',
            description: 'Comienza con el texto',
            vars: ['text']
        }, {
            icon: <IconTerminaCon />,
            name: 'Termina con',
            description: 'Termina con el texto',
            vars: ['text']
        }, {
            icon: <IconExpresionRegular />,
            name: 'Expresión regular',
            description: 'Coincide con la expresión regular',
            vars: ['text']
        }, {
            icon: <IconLongitudIgualA />,
            name: 'Longitud igual a',
            description: 'Exacta longitud',
            vars: ['text']
        }, {
            icon: <IconLongitudMayorQue />,
            name: 'Longitud mayor que',
            description: 'Longitud mínima',
            vars: ['text']
        }, {
            icon: <IconLongitudMenorQue />,
            name: 'Longitud menor que',
            description: 'Longitud máxima',
            vars: ['text']
        }, {
            icon: <IconLongitudDentro />,
            name: 'Longitud dentro de rango',
            description: 'Texto entre mínimo y máximo',
            vars: ['text']
        }, {
            icon: <IconEsMayuscula />,
            name: 'Es mayúscula',
            description: 'Todo en mayúscula',
            vars: ['text']
        }, {
            icon: <IconEsMinuscula />,
            name: 'Es minúscula',
            description: 'Todo en minúscula',
            vars: ['text']
        }]
    }, {
        icon: <IconFechaYTiempo />,
        name: 'Fecha y Tiempo',
        description: 'Operadores para fechas y tiempo',
        operators: [{
            icon: <IconEnFechaEspecifica />,
            name: 'En fecha especifica',
            description: 'Exactamente en la fecha',
            vars: ['date']
        }, {
            icon: <IconAntesDe />,
            name: 'Antes de',
            description: 'Entre dos fechas',
            vars: ['date']
        }, {
            icon: <IconDespuesDe />,
            name: 'Después de',
            description: 'Entre dos fechas',
            vars: ['date']
        }, {
            icon: <IconEntreFechas />,
            name: 'Entre fechas',
            description: 'Es un intervalo',
            vars: ['date']
        }, {
            icon: <IconDiaDeLaSemana />,
            name: 'Día de la semana',
            description: 'Lunes, Martes, etc.',
            vars: ['date']
        }, {
            icon: <IconEsHoy />,
            name: 'Es hoy',
            description: 'Comparación con hoy',
            vars: ['date']
        }, {
            icon: <IconEsAyer />,
            name: 'Es ayer',
            description: 'Comparación con ayer',
            vars: ['date']
        }, {
            icon: <IconEsMañana />,
            name: 'Es mañana',
            description: 'Comparación con mañana',
            vars: ['date']
        }, {
            icon: <IconEstaSemana />,
            name: 'Esta semana',
            description: 'Dentro de la semana actual',
            vars: ['date']
        }, {
            icon: <IconEsteMes />,
            name: 'Este mes',
            description: 'Dentro del mes actual',
            vars: ['date']
        }, {
            icon: <IconEsteAño />,
            name: 'Este año',
            description: 'Dentro del año actual',
            vars: ['date']
        }]
    }, {
        icon: <IconNulosYExistencia />,
        name: 'Nulos y Existencia',
        description: 'Operadores para nulos y existencia',
        operators: [{
            icon: <IconEsNulo />,
            name: 'Es nulo',
            description: 'Campo vacío o sin valor',
            vars: ['text', 'number', 'date', 'boolean']
        }, {
            icon: <IconNoEsNulo />,
            name: 'No es nulo',
            description: 'Campo con valor',
            vars: ['text', 'number', 'date', 'boolean']
        }, {
            icon: <IconEstaVacio />,
            name: 'Está vacio',
            description: 'Longitud 0 o sin contenido',
            vars: ['text', 'number', 'date', 'boolean']
        }, {
            icon: <IconNoEstaVacio />,
            name: 'No está vacio',
            description: 'Tiene contenido',
            vars: ['text', 'number', 'date', 'boolean']
        }]
    }, {
        icon: <IconAvanzados />,
        name: 'Avanzados / Técnicos',
        description: 'Operadores avanzados y técnicos',
        operators: [{
            icon: <IconVerificarExistencia />,
            name: 'Verificar existencia de valores',
            description: 'Campo con valor',
            vars: ['text', 'number', 'date', 'boolean']
        }, {
            icon: <IconComparacionNumerica />,
            name: 'Comparación numérica como texto',
            description: 'Convierte texto a número para comparar',
            vars: ['text']
        }, {
            icon: <IconParsearFecha />,
            name: 'Paresear fecha de texto',
            description: 'Convierte texto a fecha',
            vars: ['text']
        }, {
            icon: <IconRedondeoIgualA />,
            name: 'Redondeo igual a',
            description: 'Igual después de redondear',
            vars: ['number']
        }, {
            icon: <IconTruncadoIgualA />,
            name: 'Truncado igual a',
            description: 'Igual sin decimales',
            vars: ['number']
        }]
    }, {
        icon: <IconIA />,
        name: 'IA',
        description: 'Operadores para IA',
        operators: [{
            icon: <IconPrompt />,
            name: 'Prompt',
            description: 'Formula tu operación con una instrucción',
            vars: ['text']
        }]
    }]

    // Filtrar operadores basado en el término de búsqueda
    const filteredOperators = useMemo(() => {
        if (!searchTerm.trim()) {
            return operators
        }

        const searchLower = searchTerm.toLowerCase()
        
        return operators.filter(category => {
            // Buscar en el nombre de la categoría
            const categoryMatch = category.name.toLowerCase().includes(searchLower) ||
                                category.description.toLowerCase().includes(searchLower)
            
            // Buscar en los operadores individuales
            const operatorsMatch = category.operators.some(operator => 
                operator.name.toLowerCase().includes(searchLower) ||
                operator.description.toLowerCase().includes(searchLower)
            )
            
            return categoryMatch || operatorsMatch
        }).map(category => {
            // Si la categoría coincide, mostrar todos los operadores
            // Si solo los operadores coinciden, filtrar solo esos
            if (category.name.toLowerCase().includes(searchLower) ||
                category.description.toLowerCase().includes(searchLower)) {
                return category
            } else {
                return {
                    ...category,
                    operators: category.operators.filter(operator =>
                        operator.name.toLowerCase().includes(searchLower) ||
                        operator.description.toLowerCase().includes(searchLower)
                    )
                }
            }
        }).filter(category => category.operators.length > 0)
    }, [searchTerm, operators])

    // Función para manejar la selección de un operador
    const handleOperatorSelect = (operator) => {
        if (onOperatorSelect) {
            console.log('operator', operator)
            onOperatorSelect('operator', operator);
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
        <ul className={styles.operators}>
            {filteredOperators.map((operator) => (
                <li key={operator.name}>
                    <div className={styles.item}>
                        <div className={styles.icon}>
                            {operator.icon}
                        </div>
                        <div className={styles.info}>
                            <b>
                                {operator.name}
                            </b>
                            <p>
                                {operator.description}
                            </p>
                        </div>
                    </div>
                    <ul className={styles.list}>
                        {operator?.operators?.map((op) => (
                            <li 
                                key={op.name}
                                onClick={() => handleOperatorSelect(op)}
                                style={{ cursor: 'pointer' }}
                                title="Haz clic para seleccionar este operador"
                            >
                                <div className={styles.icon}>
                                    {op.icon}
                                </div>
                                <div className={styles.info}>
                                    <b>
                                        {op.name}
                                    </b>
                                    <p>
                                        {op.description}
                                    </p>
                                    <div className={styles.vars}>
                                        {op?.vars?.map((variable) => (
                                            <div key={variable}>
                                                {variable}
                                            </div>
                                        ))}
                                    </div>
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

export default OperatorView