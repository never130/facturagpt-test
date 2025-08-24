import styles from './MessageMap.module.css'

const MessageMap = ({ message }) => {
    return (
        <div className={styles.messageMap}>
            <p>{message.text}</p>

            <div>
            Restaurantes

            Cafeterias

            Parking

            Gasolineras

            Transporte público

            Estaciones tren

            Hospitales


            Nuevo trayecto
            Modo de Transporte


            icon pasar


            icono moto

            icono coche

            Modo de transporte

            Punto A
            Dirección de origen


            Punto B
            Dirección de origen

            icono play
            Iniciar trayecto
            </div>


            --
            <div>
            Medir distancia

            Origen
            Dirección de origen

            Destino
            Dirección de origen


            Medir distancia
            </div>



            --

            <div>

            Indicaciones y rutas

            Origen
            Dirección de origen


            Destino
            Dirección de destino

            Medio de transporte
            En coche


            icon car
            icon moto
            icon transporte
            icon walk


            Calcular ruta

            icon play
            Iniciar trayecto
            </div>



            --------------

            <div>
                <div>
                    icono walk
                    Caminando
                    <div>
                        <div />
                        Finalizado
                    </div>
                    <div>
                        <span>
                            19:23:00
                        </span>
                        <span>
                            00:00
                        </span>
                    </div>
                </div>
                <div>
                    <div>
                        <b>
                            0m
                        </b>
                        <span>

                            Distancia
                        </span>
                    </div>
                    <div>
                        <b>
                            0.0
                        </b>
                        <span>
                            km/h actual

                        </span>
                    </div>
                    <div>
                        <b>
                            655m
                        </b>
                        <span>
                            Elevación

                        </span>
                    </div>
                    <div>
                        <b>
                            0.0%
                        </b>
                        <span>

                            Pendiente
                        </span>
                    </div>
                </div>
                <div>
                    <button>

                        icon save
                        Guardar variables
                    </button>
                </div>

            </div>

            --

            <div>
                icon gps
                Datos GPS
            </div>

            <div>
                <span>
                    Coordenadas
                </span>
                <p>
                    20.000 N
                </p>
                <p>
                    3.344 W
                </p>
            </div>

            <div>
                <span>

                    Precisión
                </span>
                <p>
                    +-3.2m
                </p>
            </div>

            <div>
                <span>

                    Satelites
                </span>
                <p>
                    12

                </p>
            </div>


            <div>
                <span>

                    Señal
                </span>
                <p>
                    icono Señal
                    95%
                </p>

            </div>

            <div>
                <span>

                    Rumbo
                </span>
                <p>
                    icono radar
                    128

                </p>
            </div>

            <div>
                <span>

                    Altitud GPS
                </span>
                <p>
                    655.4m

                </p>
            </div>

        </div>
    )
}

export default MessageMap