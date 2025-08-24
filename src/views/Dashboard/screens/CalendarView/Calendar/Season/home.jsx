import React from 'react'
import styles from './home.module.css'

const Home = () => {
    return (
        <div className={styles.project}>
            <div>
                <div className={styles.search}>
                    <svg  fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                    <input
                        type={'text'}
                        placeholder={"hello world"}
                    />
                </div>
                <div>
                    <b>

                        Aqui ira una plantilla individual
                    </b>

                    <p>
                        La idea es definir eso como un kanban donde habrán
                        objetivos definidos y tareas y eventos
                    </p>
                </div>
                <div>
                    <b>
                        Estos eventos van a ser programables y condicionales
                    </b>
                </div>
                <div>
                    <b>
                        Con estos condicionales podemos tener diferentes casos
                    </b>
                </div>
                <div>
                    <b>
                        Ideas:
                    </b>
                    <p>
                        Un formulario para obtener todas las ideas
                        Nombre, descripcion fecha
                    </p>
                </div>
                <div>
                    <b>
                        Backlog:
                    </b>
                    <p>
                        Nuevas ideas del brainstroming
                        Nombre, descripcion fecha
                    </p>
                </div>
                <div>

                    Ejecutadas
                    Resumen de como ha ido
                    Exit, total, benefit, date
                </div>
                <div>
                    <p>
                        Estas condiciones generan variables, donde hay una probabilidad
                    </p>
                    <p>
                        Esta probabilidad puede ir creada con un tipo de make
                    </p>
                    <p>
                        Pero el objetivo va a ser generar un vector con los tickets por si generas
                        algunas entradas
                    </p>
                    <p>
                        Estas entradas con los agentes desde las carpetas inteligentes
                        se va a programar para leer y crear excels automaticamente, es descir
                        vendra con Y carpetas inteligentes, X son los vectores.
                    </p>
                    <p>
                        Incluso que cuando se añada un excel con el de date que se cree siempre un
                        evento en el calendario*. Desde el agente crear un X-calendar para mantener cualquier
                        aviso en tu agenda.
                    </p>
                    <p>
                        Además quedará ligado unos papeles o clausulas para que se firmen cuando sea el momento
                        y se tenga todo esto gestionado con contratos.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home