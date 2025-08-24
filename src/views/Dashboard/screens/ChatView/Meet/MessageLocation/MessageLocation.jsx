import React from 'react';
import styles from './MessageLocation.module.css';

const MessageLocation = ({ message }) => {

    const LocationCategories = () => {

        // const categories = [{
        //     name: "Restaurantes",
        //     icon: <IconRestaurant />,
        // }, {
        //     name: "Cafeterias",
        //     icon: <IconCafeteria />,
        // }, {
        //     name: "Parking",
        //     icon: <IconParking />,
        // }, {
        //     name: "Gasolineras",
        //     icon: <IconGasolinera />,
        // }, {
        //     name: "Transporte público",
        //     icon: <IconTransportePublico />,
        // }, {
        //     name: "Estaciones de tren",
        //     icon: <IconTren />,
        // }, {
        //     name: "Hospitales",
        //     icon: <IconHospital />,
        // }, {
        //     name: "Farmacias",
        //     icon: <IconFarmacia />,
        // }, {
        //     name: "Centro comerciales",
        //     icon: <IconCentroComercial />,
        // }, {
        //     name: "Bancos",
        //     icon: <IconBanco />,
        // }, {
        //     name: "Tallares",
        //     icon: <IconTallare />,
        // }, {
        //     name: "Escuelas",
        //     icon: <IconEscuela />,
        // }, {
        //     name: "Museos",
        //     icon: <IconMuseo />,
        // }, {
        //     name: "Atracciones turísticas",
        //     icon: <IconAtraccionesTuristicas />,
        // }, {
        //     name: "Parques",
        //     icon: <IconParque />,
        // }, {
        //     name: "Hoteles",
        //     icon: <IconHotel />,
        // }, {
        //     name: "Aeropuertos",
        //     icon: <IconAeropuerto />,
        // }, {
        //     name: "Empresas",
        // }]


        return (
            <div>

                Restaurantes
                Cafeterias
                Parking
                Gasolineras
                Transporte público
                Estaciones de tren
                Hospitales
                Farmacias
                Centro comerciales
                Bancos
                Tallares
                Escuelas
                Museos
                Atracciones turísticas
                Parques
                Hoteles
                Aeropuertos
                Empresas
                Embajadaass
            </div>
        )
    }


    return (
        <div className={styles.isLocation}>
            Categorias

            {true ? (
                <LocationCategories />
            ) : null}

            <div>
                mapa ubi
            </div>

            <div>
                icon ubi
                Indicaciones y rutas
            </div>

            <div>
                Origen
                Dirección de origen (opcional)
                icono ubi
            </div>

            <div>
                Destino
                Direcció  de destino
            </div>

            <div>
                Medio de transporte
                En coche
            </div>

            <div>
                Coche
                Moto
                Tren
                Caminante
            </div>

            <div>

                Calcular ruta
            </div>

            <div>
                icon medir
                Medir distancia
            </div>

            <div>
                Punto A
                Dirección de origen
                icon lugar
            </div>

            <div>
                Punto B
                Dirección de origen
                icono lugar
            </div>

            <div>
                Medir distancia
            </div>

            <div>
                icon gasolinera
                Calcular gasolina
            </div>

            <div>
                Precio de la gasolina (L)
                Precio/litro EUR
            </div>

            <div>
                Medir distancia
            </div>
        </div>
    )
}

export default MessageLocation;