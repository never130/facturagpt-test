import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import styles from "./NewsViewer.module.css";

import ImageExample from "./assets/example-image.png";
import { syncNews } from "../../../../actions/news";


// import { ReactComponent as IconMagic } from "./asset/icon-magic.svg";

import { ReactComponent as IconCategoryEmployee } from "./assets/icon-category-employee.svg";
import { ReactComponent as IconCategoryFintech } from "./assets/icon-category-fintech.svg";
import { ReactComponent as IconCategoryHealth } from "./assets/icon-category-health.svg";
import { ReactComponent as IconCategoryNews } from "./assets/icon-category-newss.svg";
import { ReactComponent as IconCategorySport } from "./assets/icon-category-sport.svg";
import { ReactComponent as IconCategoryTech } from "./assets/icon-category-tech.svg";
import { ReactComponent as IconCategoryTravel } from "./assets/icon-category-travel.svg";
import { ReactComponent as IconCategoryVehicle } from "./assets/icon-category-vehicle.svg";

// import { ReactComponent as IconArrow } from "./assets/icon-arrow.svg";
import { ReactComponent as IconFilter } from "./assets/icon-filter.svg";
import { ReactComponent as IconGrid } from "./assets/icon-grid.svg";
import { ReactComponent as IconLine } from "./assets/icon-line.svg";
import { ReactComponent as IconMagic } from "./assets/icon-magic.svg";


import { ReactComponent as IconNoSound } from "./assets/icon-no-sound.svg";
import { ReactComponent as IconSound } from "./assets/icon-sound.svg";
import { ReactComponent as IconMicro } from "./assets/icon-micro.svg";
import { ReactComponent as IconWaves } from "./assets/icon-waves.svg";
import { ReactComponent as IconArrow } from "./assets/icon-arrow.svg";
import { ReactComponent as IconArrowUp } from "./assets/icon-arrow-up.svg";
import { ReactComponent as IconDelete } from "./assets/icon-delete.svg";


import { ReactComponent as IconCategoryWeb } from "./assets/icon-category-web.svg";
import { ReactComponent as IconCategoryNew } from "./assets/icon-category-news.svg";
import { ReactComponent as IconCategoryImage } from "./assets/icon-category-image.svg";
import { ReactComponent as IconCategoryVideo } from "./assets/icon-category-video.svg";
import { ReactComponent as IconCategoryStock } from "./assets/icon-category-stock.svg";
import { ReactComponent as IconCategoryOpportunity } from "./assets/icon-category-opportunity.svg";


import ImageComponent from "./components/image";
import NewComponent from "./components/new";
import OpportunityComponent from "./components/opportunity";
import StockComponent from "./components/stock";
import VideoComponent from "./components/video";
import WebComponent from "./components/web";



const PopUpNews = ({ }) => {

  const dispatch = useDispatch();

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState([
    "Para ti",
    "Noticias destacadas"
  ]);

  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState({
    name: "Noticias",
    icon: <IconCategoryNews />,
    color: "#FF6B6B"
  });
  const [categoryHistory, setCategoryHistory] = useState([]);

  // Referencias para las animaciones
  const carouselRef = useRef(null);
  const animationRefs = useRef([]);

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

  // Fecha actual formateada en español (ej: "martes, 22 de julio")
  const formattedDate = new Date().toLocaleDateString("es-ES", {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });


  useEffect(() => {
    const getNews = async () => {
      try {
        const res = await dispatch(syncNews());
        if (res.payload && res.payload.data?.length > 0) {
          console.log("🔄 Noticias obtenidas", res.payload.data);
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



  // const [spots, setSpots] = useState([
  //   {
  //     type: "spot",
  //     name: "Spotify",
  //     price: "60,80",
  //     variation: "-0,10%",
  //   }, {
  //     type: "spot",
  //     name: "Google",
  //     price: "100,20",
  //     variation: "+0,20%",
  //   }, {
  //     type: "spot",
  //     name: "Apple",
  //     price: "10,45",
  //     variation: "+10,15%",
  //   }, {
  //     type: "spot",
  //     name: "Microsoft",
  //     price: "40,45",
  //     variation: "-5,10%",
  //   }, {
  //     type: "spot",
  //     name: "Spotify",
  //     price: "60,80",
  //     variation: "-0,10%",
  //   }, {
  //     type: "spot",
  //     name: "Google",
  //     price: "100,20",
  //     variation: "+0,20%",
  //   }
  // ])


  const categories = [
    { name: "Noticias", icon: <IconCategoryNews />, color: "#FF6B6B" },
    { name: "Vehículos", icon: <IconCategoryVehicle />, color: "#4ECDC4" },
    { name: "Tecnología", icon: <IconCategoryTech />, color: "#45B7D1" },
    { name: "Empleo", icon: <IconCategoryEmployee />, color: "#96CEB4" },
    { name: "Finanzas", icon: <IconCategoryFintech />, color: "#FFEEAD" },
    { name: "Salud", icon: <IconCategoryHealth />, color: "#D4A5A5" },
    { name: "Deporte", icon: <IconCategorySport />, color: "#9DE0AD" },
    { name: "Viajes", icon: <IconCategoryTravel />, color: "#FF9999" },
    { name: "Vivienda", icon: null, color: "#45B7D1" },
    { name: "Compras", icon: null, color: "#96CEB4" },
    { name: "Educación", icon: null, color: "#FFEEAD" },
    { name: "Comida", icon: null, color: "#FF9966" },
    { name: "Entretenimiento", icon: null, color: "#66CCFF" },
    { name: "Belleza", icon: null, color: "#FF99CC" },
    { name: "Literatura", icon: null, color: "#99FF99" },
    { name: "Eventos", icon: null, color: "#FFCC66" },
    { name: "Mascotas", icon: null, color: "#CC99FF" },
    { name: "Hogar", icon: null, color: "#99CCFF" },
    { name: "Arte", icon: null, color: "#FF9999" },
    { name: "Moda", icon: null, color: "#99FFCC" },
    { name: "Música", icon: null, color: "#FFFF99" },
    { name: "Servicios", icon: null, color: "#FF99FF" },
    { name: "Seguros", icon: null, color: "#99FF66" },
    { name: "Legal", icon: null, color: "#FF6666" },
    { name: "Consultoría", icon: null, color: "#66FF99" },
    { name: "Reparaciones", icon: null, color: "#FFCC99" },
    { name: "Construcción", icon: null, color: "#9999FF" },
    { name: "Agricultura", icon: null, color: "#66FFCC" },
    { name: "Energía", icon: null, color: "#FF6699" },
    { name: "Transporte", icon: null, color: "#99FFFF" },
    { name: "Comunicación", icon: null, color: "#FFCC33" },
    { name: "Seguridad", icon: null, color: "#CC66FF" },
    { name: "Medio ambiente", icon: null, color: "#66FF66" },
    { name: "Ciencia", icon: null, color: "#FF3366" },
    { name: "Espiritualidad", icon: null, color: "#33CCFF" },
    { name: "Negocios", icon: null, color: "#FF9933" },
    { name: "Inversiones", icon: null, color: "#66CC99" },
    { name: "Inmobiliario", icon: null, color: "#FF6633" },
    { name: "Startups", icon: null, color: "#33FF99" },
    { name: "Fotografía", icon: null, color: "#CC3366" }
  ]

  // Función para generar degradados dinámicos
  const generateGradient = (color1, color2, angle = 45) => {
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  };

  // Función para generar degradado a partir de un color base
  const generateGradientFromColor = (baseColor, intensity = 0.3) => {
    // Convertir color hex a RGB
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Crear color más claro
    const lighterR = Math.min(255, r + (255 - r) * intensity);
    const lighterG = Math.min(255, g + (255 - g) * intensity);
    const lighterB = Math.min(255, b + (255 - b) * intensity);

    const lighterColor = `rgb(${lighterR}, ${lighterG}, ${lighterB})`;

    return generateGradient(baseColor, lighterColor, Math.random() * 360);
  };

  // Función para crear efecto de confeti mejorado
  const createConfetti = (color) => {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;

    // Colores más sutiles
    const colors = [color, '#ffffff', '#f8fafc', '#e2e8f0'];
    const shapes = ['circle', 'square'];

    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = 3 + Math.random() * 4;

      confetti.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${randomColor};
        left: ${Math.random() * 100}%;
        top: -20px;
        animation: confettiFall ${4 + Math.random() * 2}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
        ${randomShape === 'circle' ? 'border-radius: 50%;' : ''}
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        opacity: 0.8;
      `;

      confettiContainer.appendChild(confetti);
    }

    document.body.appendChild(confettiContainer);

    setTimeout(() => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer);
      }
    }, 6000);
  };

  // Función para crear efecto de ondas de sonido
  const createSoundWaves = (color) => {
    const wavesContainer = document.createElement('div');
    wavesContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9998;
    `;

    for (let i = 0; i < 2; i++) {
      const wave = document.createElement('div');
      wave.style.cssText = `
        position: absolute;
        width: 80px;
        height: 80px;
        border: 1px solid ${color}40;
        border-radius: 50%;
        animation: soundWave ${2 + i * 0.5}s ease-out forwards;
        opacity: 0.4;
        background: radial-gradient(circle, ${color}20 0%, transparent 70%);
      `;

      wavesContainer.appendChild(wave);
    }

    document.body.appendChild(wavesContainer);

    setTimeout(() => {
      if (document.body.contains(wavesContainer)) {
        document.body.removeChild(wavesContainer);
      }
    }, 2500);
  };

  // Función para manejar el cambio de categoría
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // Crear efectos visuales
    createConfetti(category.color);
    createSoundWaves(category.color);

    // Actualizar el header con la nueva categoría
    const headerElement = document.querySelector(`.${styles.popUpNewsContainerHeader}`);
    if (headerElement) {
      const gradient = generateGradientFromColor(category.color, 0.4);
      headerElement.style.background = gradient;
    }
    // update history (max 5, unique, latest first)
    setCategoryHistory(prev => {
      const next = [category.name, ...prev.filter(n => n !== category.name)];
      return next.slice(0, 5);
    });
  };

  // Efecto para inicializar las animaciones
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const rows = carousel.querySelectorAll(`.${styles.carouselRow}`);

    rows.forEach((row, index) => {
      const direction = index % 2 === 0 ? 1 : -1; // Direcciones alternadas
      const speed = 0.3 + (index * 0.1); // Velocidades más lentas y suaves

      let animationId;
      let isPaused = false;
      let currentX = index % 2 === 0 ? 0 : -200; // Posiciones iniciales alternadas

      const animate = () => {
        if (!isPaused) {
          currentX += direction * speed;

          // Resetear posición cuando se sale de los límites
          const rowWidth = row.scrollWidth;
          const containerWidth = carousel.offsetWidth;

          if (direction > 0 && currentX > containerWidth) {
            currentX = -rowWidth + containerWidth;
          } else if (direction < 0 && currentX < -rowWidth) {
            currentX = containerWidth;
          }

          row.style.transform = `translateX(${currentX}px)`;
        }
        animationId = requestAnimationFrame(animate);
      };

      // Pausar en hover con transición suave
      row.addEventListener('mouseenter', () => {
        isPaused = true;
        row.style.transition = 'transform 0.5s ease-out';
      });

      row.addEventListener('mouseleave', () => {
        setTimeout(() => {
          isPaused = false;
          row.style.transition = 'none';
        }, 500);
      });

      animate();

      // Guardar referencia para limpiar
      animationRefs.current.push(animationId);
    });

    // Cleanup
    return () => {
      animationRefs.current.forEach(id => {
        if (id) cancelAnimationFrame(id);
      });
    };
  }, []);


  const CategoryContainer = () => {
    // Crear múltiples filas con las categorías - sin espacios vacíos
    const createCarouselRows = () => {
      const rows = [];
      const itemsPerRow = 15; // Más items por fila para evitar espacios

      for (let i = 0; i < 3; i++) {
        const rowItems = [];
        // Crear un loop continuo de categorías
        for (let j = 0; j < itemsPerRow; j++) {
          const categoryIndex = j % categories.length;
          rowItems.push(categories[categoryIndex]);
        }
        // Agregar más items para asegurar continuidad perfecta
        for (let j = 0; j < 8; j++) {
          const categoryIndex = j % categories.length;
          rowItems.push(categories[categoryIndex]);
        }
        rows.push(rowItems);
      }

      return rows;
    };

    const carouselRows = createCarouselRows();

    return (
      <div className={styles.categoryCarouselContainer}>
        <div className={styles.carouselWrapper} ref={carouselRef}>
          {carouselRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={styles.carouselRow}
              style={{
                animationDelay: `${rowIndex * 0.3}s`,
                transform: `translateX(${rowIndex % 2 === 0 ? 0 : -50}%)`
              }}
            >
              {row.map((item, itemIndex) => (
                <div
                  key={`${rowIndex}-${itemIndex}`}
                  className={styles.carouselItem}
                  onClick={() => handleCategoryChange(item)}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))`,
                    border: `1px solid ${item.color}30`,
                    boxShadow: `0 4px 12px ${item.color}20`
                  }}
                >
                  <div
                    className={styles.carouselItemIcon}
                    style={{
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                      boxShadow: `0 4px 12px ${item.color}40`
                    }}
                  >
                    {item.icon || <IconCategoryNews />}
                  </div>
                  <span className={styles.carouselItemName}>
                    {item.name}
                  </span>
                  <div className={styles.carouselItemGlow} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Indicador de categoría seleccionada */}
        <div className={styles.selectedCategoryIndicator}>
          <div
            className={styles.selectedCategoryIcon}
            style={{
              background: `linear-gradient(135deg, ${selectedCategory.color}, ${selectedCategory.color}dd)`,
              boxShadow: `0 6px 16px ${selectedCategory.color}40`
            }}
          >
            {selectedCategory.icon}
          </div>
          <span className={styles.selectedCategoryName}>
            {selectedCategory.name}
          </span>
        </div>
      </div>
    );
  }



  // const SearchContainer = () => {
  //   return (
  //     <div className={styles.searchContainer}>
  //       <div className={styles.searchContainerHeader}>
  //         <div>
  //           1
  //         </div>
  //         <b>
  //           ¿Qué tipo de vehículo buscas?
  //         </b>
  //       </div>
  //       <div className={styles.searchContainerList}>
  //         <ul>
  //           <li>
  //             🚗 Coches
  //           </li>
  //           <li>
  //             🏍️ Motos
  //           </li>
  //           <li>
  //             🚐 Caravanas
  //           </li>
  //           <li>
  //             🚛 Furgonetas
  //           </li>
  //         </ul>
  //         <div className={styles.searchContainerListButton}>
  //           <button>

  //             Otros
  //           </button>
  //         </div>
  //       </div>
  //       <div className={styles.searchContainerTextarea}>
  //         <textarea
  //           placeholder="Escribe tu búsqueda"
  //           value={''}
  //         />
  //         <button>

  //           Generar búsqueda
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  // const OpportunityContainer = () => {
  //   return (
  //     <div className={styles.opportunityContainer}>
  //       <div className={styles.opportunityContainerHeader}>
  //         <div 
  //           style={{ 
  //             background: selectedCategory.color,
  //             boxShadow: `0 0 15px ${selectedCategory.color}60`
  //           }}
  //         >
  //           {selectedCategory.icon}
  //         </div>
  //         <b>
  //           oportunidades encontradas en {selectedCategory.name.toLowerCase()}
  //         </b>
  //       </div>

  //       <div className={styles.opportunityContainerContent}>

  //         <div className={styles.opportunityContainerItem}>

  //           <div className={styles.opportunityContainerImage}>
  //             image not found
  //           </div>

  //           <div className={styles.opportunityContainerActions}>
  //             <button>
  //               <IconDelete />
  //             </button>
  //             <button>
  //               <IconMap /> chat
  //             </button>
  //             <button>
  //               <IconContact />
  //             </button>
  //             <button>
  //               <IconMagic />
  //             </button>
  //             <button>
  //               <IconUpload />
  //             </button>
  //             <button>
  //               <IconNew />
  //             </button>
  //             <button>
  //               <IconAlert />
  //             </button>
  //           </div>
  //           <div className={styles.opportunityContainerTitle}>
  //             <b>
  //               Audi A4 2019 oportunidad única
  //             </b>
  //             <b>
  //               €28.500
  //             </b>
  //           </div>
  //           <p>
  //             Audi A4 con mantenimiento completo, único propietario, 100.000 km, 2019
  //           </p>
  //           <ul>
  //             <li>
  //               bmw,
  //             </li>
  //             <li>
  //               sedán
  //             </li>
  //             <li>
  //               automático, diesel
  //             </li>
  //           </ul>
  //           <div className={styles.opportunityContainerFooter}>
  //             <span>
  //               hace 15 minutos
  //             </span>
  //             <span>
  //               autoocasion.com
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }


  const [_categories, _setCategories] = useState([{
    icon: <IconCategoryOpportunity />,
    type: 'opportunity',
    name: 'Oportunidades',
    data: [1],
    stats: [{
      value: '1.2M',
      label: 'Oportunidades seguidas'
    }, {
      value: '543',
      label: 'resultados'
    }],
    categories: [{
      name: 'Calentadores',
      value: 'calentadores'
    }, {
      name: 'Híbrido',
      value: 'hibrido'
    }, {
      name: 'Eléctrico',
      value: 'electrico'
    }]
  }, {
    icon: <IconCategoryNew />,
    type: 'new',
    name: 'Noticias',
    data: [1, 2],
    stats: [{
      value: '1.2M',
      label: 'Noticias seguidas'
    }, {
      value: '543',
      label: 'resultados'
    }],
    categories: [{
      name: 'Calentadores',
      value: 'calentadores'
    }, {
      name: 'Híbrido',
      value: 'hibrido'
    }, {
      name: 'Eléctrico',
      value: 'electrico'
    }]
  }, {
    icon: <IconCategoryWeb />,
    type: 'web',
    name: 'Página web',
    data: [1, 2],
    stats: [{
      value: '1.2M',
      label: 'Páginas seguidas'
    }, {
      value: '543',
      label: 'resultados'
    }],
    categories: [{
      name: 'Calentadores',
      value: 'calentadores'
    }, {
      name: 'Híbrido',
      value: 'hibrido'
    }, {
      name: 'Eléctrico',
      value: 'electrico'
    }]
  }, {
    icon: <IconCategoryImage />,
    type: 'image',
    name: 'Imágenes',
    data: [1, 2, 3, 4],
    stats: [{
      value: '1.2M',
      label: 'Imágenes seguidas'
    }, {
      value: '543',
      label: 'resultados'
    }],
    categories: [{
      name: 'Calentadores',
      value: 'calentadores'
    }, {
      name: 'Híbrido',
      value: 'hibrido'
    }, {
      name: 'Eléctrico',
      value: 'electrico'
    }]
  }, {
    icon: <IconCategoryVideo />,
    type: 'video',
    name: 'Vídeos',
    data: [1, 2, 3, 4],
    stats: [{
      value: '1.2M',
      label: 'Vídeos seguidos'
    }, {
      value: '543',
      label: 'resultados'
    }],
    categories: [{
      name: 'Calentadores',
      value: 'calentadores'
    }, {
      name: 'Híbrido',
      value: 'hibrido'
    }, {
      name: 'Eléctrico',
      value: 'electrico'
    }]
  }, {
    icon: <IconCategoryStock />,
    type: 'stock',
    name: 'Stock',
    data: [1, 2, 3, 4],
    stats: [{
      value: '1.2M',
      label: 'Stock seguidas'
    }, {
      value: '543',
      label: 'resultados'
    }],
    categories: [{
      name: 'Calentadores',
      value: 'calentadores'
    }, {
      name: 'Híbrido',
      value: 'hibrido'
    }, {
      name: 'Eléctrico',
      value: 'electrico'
    }]
  }])

  // Estado para la pestaña activa y referencia al orden inicial
  const [activeCategory, setActiveCategory] = useState('new');
  const initialCategoriesRef = useRef([]);

  // Guardar el orden inicial solo una vez
  useEffect(() => {
    if (initialCategoriesRef.current.length === 0 && _categories.length > 0) {
      initialCategoriesRef.current = _categories;
    }
  }, [_categories]);

  // Reordenar para que la categoría seleccionada quede primero
  useEffect(() => {
    if (activeCategory === 'all') {
      if (initialCategoriesRef.current.length > 0) {
        _setCategories(initialCategoriesRef.current);
      }
      return;
    }

    _setCategories(prev => {
      const selectedIndex = prev.findIndex(c => c.type === activeCategory);
      if (selectedIndex === -1) return prev;
      const selected = prev[selectedIndex];
      const rest = prev.filter((_, i) => i !== selectedIndex);
      return [selected, ...rest];
    });
  }, [activeCategory]);

  return (
    <div className={styles.popUpNewsContainer}>
      <div className={styles.popUpNewsContainerHeader}>
        <div className={styles.popUpNewsContainerHeaderTop}>
          <div className={styles.popUpNewsContainerHeaderTopFilters}>
            <IconFilter />
            <span>
              Cambiar categoría:
            </span>
            <IconArrow />
          </div>
          <div className={styles.popUpNewsContainerHeaderTopButtons}>
            <button>
              Seguir oportunidad
            </button>
            <button>
              Cobertura completa
              <IconMagic />
            </button>
          </div>
        </div>
        <div className={styles.popUpNewsContainerHeaderBottom}>
          <div className={styles.popUpNewsContainerHeaderBottomLeft}>
            <div className={styles.popUpNewsContainerHeaderBottomTitle}>
              {selectedCategory.icon || <IconCategoryNews />}
              <b>
                {selectedCategory.name}
              </b>
            </div>
            <div className={styles.popUpNewsContainerHeaderBottomDescription}>
              <span>
                {formattedDate}
              </span>
              <span>
                Encuentra las mejores {selectedCategory.name}
              </span>
            </div>
          </div>
          <div className={styles.popUpNewsContainerHeaderBottomRight}>
            <div>
              <button>
                <IconGrid />
              </button>
              <button>
                <IconLine />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CategoryContainer />


      <div className={`${styles.items} ${true ? styles.itemsList : ''}`}>
        <div className={styles.itemsHistory}>
          <span>
            Historial de búsqueda:
          </span>
          <ul>
            {categoryHistory.length === 0 ? (
              <li>{selectedCategory.name}</li>
            ) : (
              categoryHistory.map((name, index) => (
                <li key={`${name}-${index}`}>
                  {name}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className={styles.itemsSearch}>
          <textarea placeholder="Start writing what your are looking for.." />
          <div className={styles.itemsSearchButtons}>
            <button>
              <IconSound />
            </button>
            <button>
              <IconNoSound />
            </button>
            <button>
              <IconMicro />
            </button>
            <button>
              <IconWaves />
            </button>
            <button>
              <IconArrowUp />
            </button>
          </div>
        </div>
        <div className={styles.itemsCategories}>
          <ul>
            <li
              className={activeCategory === 'all' ? styles.active : ''}
              onClick={() => setActiveCategory('all')}
            >
              Todo
              <label>
                0
              </label>
            </li>
            {_categories.map((cat) => (
              <li
                key={cat.type}
                className={activeCategory === cat.type ? styles.active : ''}
                onClick={() => setActiveCategory(cat.type)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.itemsContainer}>
          {_categories.map((item, index) => (
            <div key={index} className={styles.categoryContainer}>
              <div className={styles.info}>
                <div>
                  {item.icon}
                </div>
                <b>
                  {item.name}
                </b>
              </div>
              <div className={styles.stats}>
                {item.stats.map((stat, index) => (
                  <div key={index}>
                    <span>
                      {stat.value}
                    </span>
                    ·
                    <span>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              <span className={styles.results}>
                Aproximadamente 44.444 resultados (0.23s)
              </span>
              <div className={styles.labels}>
                <ul>
                  {item.categories.map((category, index) => (
                    <li key={index}>
                      {category.name}
                      <button>
                        <IconDelete />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.section}>
                {item.data.map((element, index) => (
                  <>
                    {item.type === 'web' && <WebComponent element={element} />}
                    {item.type === 'new' && <NewComponent element={element} />}
                    {item.type === 'image' && <ImageComponent element={element} />}
                    {item.type === 'video' && <VideoComponent element={element} />}
                    {item.type === 'stock' && <StockComponent element={element} />}
                    {item.type === 'opportunity' && <OpportunityComponent element={element} />}
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <SearchContainer /> */}
      {/* <OpportunityContainer /> */}
    </div>

  )


  // return (

  //   <div className={styles.popUpNewsContainer}>
  //     <div className={styles.popUpNewsContainerHeader}>
  //       <div
  //         className={styles.popUpNewsHeaderBanner}
  //         style={{ backgroundImage: `url(${news[0]?.image})` }}
  //       >
  //         <div className={styles.bannerOverlay}></div>

  //         <div className={styles.headerText}>
  //           <b>Tu resumen</b>
  //           <span>{new Date().toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
  //         </div>
  //         <div className={styles.magicIconOverlay}>
  //           <IconMagic className={styles.iconMagicSvg} />
  //         </div>
  //       </div>
  //     </div>
  //     <div className={styles.popUpNewsActionsBar}>
  //       {/* <div className={styles.stockTicker}>
  //         {spots.map((item, index) => (
  //           <div key={index} className={styles.stockItem}>
  //             <div className={styles.stockLeft}>
  //               <span className={styles.stockType}>{item.type.toUpperCase()}</span>
  //               <span className={styles.stockName}>{item.name}</span>
  //             </div>
  //             <div className={styles.stockRight}>
  //               <b className={styles.stockPrice}>{item.price}</b>
  //               <span
  //                 className={`${styles.stockVariation} ${item.variation.includes("-") ? styles.negative : styles.positive
  //                   }`}
  //               >
  //                 {item.variation} {item.variation.includes("-") ? "↓" : "↑"}
  //               </span>
  //             </div>
  //           </div>

  //         ))}
  //       </div> */}

  //       <div className={styles.newsFilters}>
  //         {filters.map((filter, index) => (
  //           <button
  //             key={index}
  //             className={styles.filterButton}
  //             onClick={() => handleRemoveFilter(filter)}
  //             title={filter === "Para ti" || filter === "Noticias destacadas" ? "" : "Haz clic para eliminar"}
  //           >
  //             {filter}
  //           </button>
  //         ))}

  //         {showSearchInput && (
  //           <form onSubmit={handleSearchSubmit} style={{ display: 'inline-block' }}>
  //             <input
  //               type="text"
  //               value={searchValue}
  //               onChange={handleSearchInputChange}
  //               placeholder="Buscar..."
  //               autoFocus
  //               style={{
  //                 padding: '4px 8px',
  //                 border: '1px solid rgb(221, 221, 221)',
  //                 borderRadius: '16px',
  //                 fontSize: '13px',
  //                 width: '90%',
  //                 background: '#fff',
  //               }}
  //             />
  //           </form>
  //         )}

  //         <button className={styles.coverageButton}>
  //           Cobertura completa
  //           <IconMagic />
  //         </button>
  //         <button
  //           className={styles.searchButton}
  //           onClick={handleSearchClick}
  //         >
  //           <IconSearch />
  //         </button>
  //       </div>
  //     </div>


  //     <div className={styles.popUpNewsContainerItems}>
  //       {news.map((item, index) => (
  //         <div key={index} className={styles.popUpNewsContainerItem}>
  //           <div className={styles.image}>
  //             <img src={item.image || ImageExample} alt="imagen noticia" className={styles.newsImage} />
  //             <div
  //               className={styles.iconOverlay}
  //               onClick={() => {
  //                 navigate(`/admin/chat/${selectedAgent?._id || ''}`, {
  //                   state: {
  //                     selectedAgentState: selectedAgent || ''
  //                   },
  //                 });
  //               }}
  //             >
  //               <IconMagic />
  //             </div>
  //           </div>
  //           <div className={styles.content}>
  //             <div className={styles.header}>
  //               <img src={ImageLogoExample} alt="logo" />
  //               <span className={styles.sourceEllipsis}>{item.source}</span>
  //             </div>
  //             <p className={styles.titleEllipsis}>{item.title}</p>
  //             <span>{item.time}</span>
  //           </div>

  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default PopUpNews;
