import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./News.module.css";

import ImageExample from "./asset/example-image.png";
import ImageLogoExample from "./asset/example-logo.png";
import { syncNews } from "../../../../actions/news";


import { ReactComponent as IconMagic } from "./asset/icon-magic.svg";
import { ReactComponent as IconSearch } from "./asset/icon-search.svg";

import { ReactComponent as IconCategoryEmployee } from "./asset/icon-category-employee.svg";
import { ReactComponent as IconCategoryFintech } from "./asset/icon-category-fintech.svg";
import { ReactComponent as IconCategoryHealth } from "./asset/icon-category-health.svg";
import { ReactComponent as IconCategoryNews } from "./asset/icon-category-news.svg";
import { ReactComponent as IconCategorySport } from "./asset/icon-category-sport.svg";
import { ReactComponent as IconCategoryTech } from "./asset/icon-category-tech.svg";
import { ReactComponent as IconCategoryTravel } from "./asset/icon-category-travel.svg";
import { ReactComponent as IconCategoryVehicle } from "./asset/icon-category-vehicle.svg";

import { ReactComponent as IconAlert } from "./asset/icon-alert.svg";
import { ReactComponent as IconArrow } from "./asset/icon-arrow.svg";
import { ReactComponent as IconContact } from "./asset/icon-contact.svg";
import { ReactComponent as IconDelete } from "./asset/icon-delete.svg";
import { ReactComponent as IconFilter } from "./asset/icon-filter.svg";
import { ReactComponent as IconGrid } from "./asset/icon-grid.svg";
import { ReactComponent as IconLine } from "./asset/icon-line.svg";
import { ReactComponent as IconMagic } from "./asset/icon-magic.svg";
import { ReactComponent as IconMaker } from "./asset/icon-maker.svg";
import { ReactComponent as IconMap } from "./asset/icon-map.svg";
import { ReactComponent as IconMessage } from "./asset/icon-message.svg";
import { ReactComponent as IconNew } from "./asset/icon-new.svg";
import { ReactComponent as IconOportunity } from "./asset/icon-oportunity.svg";
import { ReactComponent as IconStars } from "./asset/icon-stars.svg";
import { ReactComponent as IconUpload } from "./asset/icon-upload.svg";
import { ReactComponent as IconVisible } from "./asset/icon-visible.svg";

const PopUpNews = ({ }) => {

  const dispatch = useDispatch();

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState([
    "Para ti",
    "Noticias destacadas"
  ]);

  const handleSearchClick = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      setSearchValue("");
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() && !filters.includes(searchValue.trim())) {
      setFilters([...filters, searchValue.trim()]);
      setSearchValue("");
      setShowSearchInput(false);
    }
  };

  const handleRemoveFilter = (filterToRemove) => {
    if (filterToRemove === "Para ti" || filterToRemove === "Noticias destacadas") {
      return;
    }
    setFilters(filters.filter(filter => filter !== filterToRemove));
  };


  const fallbackNews = [
    {
      href: "/noticias-destacadas",
      title: "Diario de Noticias de Navarra",
      description: "Confirmada la identidad del hombre muerto en San Juan de forma violenta",
      time: "Hace 5 horas",
      image: ImageExample,
    },
    {
      href: "/noticias-destacadas",
      title: "El Comercio",
      description: "Noticias destacadas del día en tu ciudad",
      time: "Hace 3 horas",
      image: ImageExample,
    },
    {
      href: "/noticias-destacadas",
      title: "La República",
      description: "Reportan situación de emergencia en distintas regiones",
      time: "Hace 2 horas",
      image: ImageExample,
    },
    {
      href: "/noticias-destacadas",
      title: "La República",
      description: "Noticias destacadas del día en tu región",
      time: "Hace 4 horas",
      image: ImageExample,
    },
  ];


  const [news, setNews] = useState([]);


  useEffect(() => {
    const getNews = async () => {
      try {
        const res = await dispatch(syncNews());
        if (res.payload && res.payload.data?.length > 0) {
          setNews(res.payload.data.slice(0, 20));
        } else {
          setNews(fallbackNews);
        }
      } catch (error) {
        console.error("Error getting news:", error);
        setNews(fallbackNews);
      }
    };
    getNews();
  }, []);



  const [spots, setSpots] = useState([
    {
      type: "spot",
      name: "Spotify",
      price: "60,80",
      variation: "-0,10%",
    }, {
      type: "spot",
      name: "Google",
      price: "100,20",
      variation: "+0,20%",
    }, {
      type: "spot",
      name: "Apple",
      price: "10,45",
      variation: "+10,15%",
    }, {
      type: "spot",
      name: "Microsoft",
      price: "40,45",
      variation: "-5,10%",
    }, {
      type: "spot",
      name: "Spotify",
      price: "60,80",
      variation: "-0,10%",
    }, {
      type: "spot",
      name: "Google",
      price: "100,20",
      variation: "+0,20%",
    }
  ])


  return (
    <>
      <div>
        <div>
          icon filter
          Cambiar categoría: 
          Noticias
          icono array


          Seguir oportunidad
          Cobertura completa
          icon magic

          martes, 22 de julio
          Encuenta las mejoras noticías 

          icono grid
          icono lines
        </div>

        <div>
          el que ya hay 
        </div>
        <div>
          oportunidades encontradas

          iconos delete| chat | contacta | magic | upload | view | info 

          Audi A4 2019 oportunidad única 

          €28.500

          Audi A4 con mantenimiento completo, único propietario, 100.000 km, 2019
          
          bmw, sedán, automático, diesel

          hace 15 minutos
          autoocasion.com



          ¿Qué tipo de vehículo buscas?
          Coches
          Motos
          Caravanas
          Furgonetas

          Otros 

          Generar búsqueda
        </div>

        <div>
          <IconCategoryNews />
          Noticias
          <IconCategoryVehicle />
          Vehículos
          <IconCategoryTech />
          Tecnología
          <IconCategoryEmployee />
          Empleo
          <IconCategoryHealth />
          Salud
          <IconCategoryFintech />
          Finanzas
          <IconCategorySport />
          Deporte
          <IconCategoryTravel />
          Viajes
          <IconCategoryFintech />
          Finanzas
          Salud
          Deporte
          Viajes
          Vivienda
          Compras
          Educación
          Comida
          Entretenimiento
          Belleza
          Literatura
          Eventos
          Mascotas
          Hogar
          Arte
          Moda
          Música
          Servicios
          Seguros
          Legal
          Consultoría 
          Reparaciones
          Construcción
          Agricultura
          Energía 
          Transporte
          Comunicación
          Seguridad
          Medio ambiente
          Ciencia
          Espiritualidad
          Negocios
          Inversiones
          Inmobiliario
          Startups
          Fotografía
        </div>
      </div>
    
    </>
  )


  return (
    <div className={styles.popUpNewsContainer}>
      <div className={styles.popUpNewsContainerHeader}>
        <div
          className={styles.popUpNewsHeaderBanner}
          style={{ backgroundImage: `url(${news[0]?.image})` }}
        >
          <div className={styles.bannerOverlay}></div>

          <div className={styles.headerText}>
            <b>Tu resumen</b>
            <span>{new Date().toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div className={styles.magicIconOverlay}>
            <IconMagic className={styles.iconMagicSvg} />
          </div>
        </div>
      </div>
      <div className={styles.popUpNewsActionsBar}>
        <div className={styles.stockTicker}>
          {spots.map((item, index) => (
            <div key={index} className={styles.stockItem}>
              <div className={styles.stockLeft}>
                <span className={styles.stockType}>{item.type.toUpperCase()}</span>
                <span className={styles.stockName}>{item.name}</span>
              </div>
              <div className={styles.stockRight}>
                <b className={styles.stockPrice}>{item.price}</b>
                <span
                  className={`${styles.stockVariation} ${item.variation.includes("-") ? styles.negative : styles.positive
                    }`}
                >
                  {item.variation} {item.variation.includes("-") ? "↓" : "↑"}
                </span>
              </div>
            </div>

          ))}
        </div>

        <div className={styles.newsFilters}>
          {filters.map((filter, index) => (
            <button
              key={index}
              className={styles.filterButton}
              onClick={() => handleRemoveFilter(filter)}
              title={filter === "Para ti" || filter === "Noticias destacadas" ? "" : "Haz clic para eliminar"}
            >
              {filter}
            </button>
          ))}

          {showSearchInput && (
            <form onSubmit={handleSearchSubmit} style={{ display: 'inline-block' }}>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchInputChange}
                placeholder="Buscar..."
                autoFocus
                style={{
                  padding: '4px 8px',
                  border: '1px solid rgb(221, 221, 221)',
                  borderRadius: '16px',
                  fontSize: '13px',
                  width: '90%',
                  background: '#fff',
                }}
              />
            </form>
          )}

          <button className={styles.coverageButton}>
            Cobertura completa
            <IconMagic />
          </button>
          <button
            className={styles.searchButton}
            onClick={handleSearchClick}
          >
            <IconSearch />
          </button>
        </div>
      </div>


      <div className={styles.popUpNewsContainerItems}>
        {news.map((item, index) => (
          <div key={index} className={styles.popUpNewsContainerItem}>
            <div className={styles.image}>
              <img src={item.image || ImageExample} alt="imagen noticia" className={styles.newsImage} />
              <div
                className={styles.iconOverlay}
                onClick={() => {
                  navigate(`/admin/chat/${selectedAgent?._id || '' }`, {
                    state: {
                      selectedAgentState: selectedAgent || ''
                    },
                  });
                }}
              >
                <IconMagic />
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <img src={ImageLogoExample} alt="logo" />
                <span className={styles.sourceEllipsis}>{item.source}</span>
              </div>
              <p className={styles.titleEllipsis}>{item.title}</p>
              <span>{item.time}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PopUpNews;
