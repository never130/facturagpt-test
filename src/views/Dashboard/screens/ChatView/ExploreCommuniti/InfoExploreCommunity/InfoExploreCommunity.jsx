import React, { useState, useEffect, useRef } from 'react'
import HeaderCard from '../../../../components/HeaderCard/HeaderCard'
import ModalBlackBgTemplate from '../../../../components/ModalBlackBgTemplate/ModalBlackBgTemplate'
import styles from './InfoExploreCommunity.module.css'
import { useSelector } from 'react-redux'
import { shallowEqual } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Button from '../../../../components/Button/Button'
import AgentHeader from './Headers/AgentHeader'
import AgentInfo from './Info/AgentInfo'
import { ReactComponent as IconStar5 } from '../../../../assets/GreenStar5Icon.svg'
import { ReactComponent as IconStar4 } from '../../../../assets/GreenStar4Icon.svg'
import { ReactComponent as IconStar3 } from '../../../../assets/GreenStar3Icon.svg'
import { ReactComponent as IconStar2 } from '../../../../assets/GreenStar2Icon.svg'
import { ReactComponent as IconStar1 } from '../../../../assets/GreenStar1Icon.svg'
import Document from './Headers/Document'
import DocumentInfo from './Info/DocumentInfo'
import WorkspaceInfo from './Info/WorkspaceInfo'
import WorkspaceHeader from './Headers/WorkspaceHeader'
import AppHeader from './Headers/AppHeader'
import AppInfo from './Info/AppInfo'

// Componentes para las secciones dinámicas
const DynamicHeader = ({ type, data }) => {
  const [t] = useTranslation("ChatView");
  
  // Renderizado condicional del header según el tipo
  const renderHeaderContent = () => {
    switch (type) {
      case 'agent':
        return (
          <AgentHeader/>
        );
      case 'document':
        return (
       <Document data={data}/>
        );
      case 'workspace':
        return (
            <WorkspaceHeader/>

        );
      default:
        return (
       <AppHeader/>
        );
    }
  };

  return (
    <div className={styles.dynamicHeader}>
      {renderHeaderContent()}
    </div>
  );
};

const DynamicInfo = ({ type, data }) => {
  const [t] = useTranslation("ChatView");
  
  // Renderizado condicional de la información según el tipo
  const renderInfoContent = () => {
    switch (type) {
      case 'agent':
        return (
         <AgentInfo/>
        );
      case 'document':
        return (
       <DocumentInfo/>
        );
      case 'workspace':
        return (
          <WorkspaceInfo/>
        );
      default:
        return (
         <AppInfo/>
        );
    }
  };

  return renderInfoContent();
};

// Componentes para las secciones estáticas
const RatingSection = ({  starCounts }) => {
  const [t] = useTranslation("ChatView");
  
  // Calcular el total de reviews
  const totalReviews = Object.values(starCounts || {}).reduce((sum, count) => sum + count, 0);
  
  // Función para calcular el porcentaje de cada estrella
  const getStarPercentage = (starCount) => {
    if (totalReviews === 0) return 0;
    return (starCount / totalReviews) * 100;
  };

  // Array de estrellas con sus íconos y valores
  const stars = [
    { value: 5, icon: IconStar5 },
    { value: 4, icon: IconStar4 },
    { value: 3, icon: IconStar3 },
    { value: 2, icon: IconStar2 },
    { value: 1, icon: IconStar1 }
  ];
  
  return (
    <div className={styles.ratingSection}>
      <h4>Ratings</h4>
      <div className={styles.ratingContent}>
        {stars.map(({ value, icon: IconComponent }) => (
          <div key={value} className={styles.ratingItem}>
            <div className={styles.starIcon}>
              <IconComponent />
            </div>
            <div className={styles.ratingBar}>
              <div className={styles.ratingBarBg}>
                <div 
                  className={styles.ratingBarFill} 
                  style={{ width: `${getStarPercentage(starCounts?.[value] || 0)}%` }}
                ></div>
              </div>
            </div>
          
          </div>
        ))}
      </div>
      
    
    </div>
  );
};

const RecommendationsSection = () => {
  const [t] = useTranslation("ChatView");
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [animationPosition, setAnimationPosition] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  
  // Datos de ejemplo para las recomendaciones
  const recommendations = [
    { id: 1, title: "Doc", pages: "15 páginas", author: "puzzle.today", saved: "+50K" },
    { id: 2, title: "Template", pages: "8 páginas", author: "puzzle.today", saved: "+30K" },
    { id: 3, title: "Guide", pages: "22 páginas", author: "puzzle.today", saved: "+25K" },
    { id: 4, title: "Manual", pages: "12 páginas", author: "puzzle.today", saved: "+40K" },
    { id: 5, title: "Tutorial", pages: "18 páginas", author: "puzzle.today", saved: "+35K" },
    { id: 6, title: "Handbook", pages: "10 páginas", author: "puzzle.today", saved: "+20K" },
  ];
  
  // Duplicar los elementos múltiples veces para crear un efecto infinito más fluido
  const duplicatedRecommendations = [
    ...recommendations,
    ...recommendations,
    ...recommendations,
    ...recommendations,
    ...recommendations,
    ...recommendations,
    ...recommendations,
    ...recommendations,
  ];

  // Calcular el ancho total de los elementos originales
  const itemWidth = 200; // Ancho de cada item
  const gap = 10; // Gap entre items
  const originalWidth = recommendations.length * (itemWidth + gap) - gap;
  
  // Función para manejar el click en un item
  const handleItemClick = (item) => {
    // Solo mostrar el alert si no hubo movimiento (click real, no drag)
    if (!hasMoved) {
      alert(`Has seleccionado: ${item.title}\nPáginas: ${item.pages}\nAutor: ${item.author}\nGuardado por: ${item.saved}`);
    }
  };
  
  // Función para verificar si el drag está en los límites
  const isDragAtLimit = (newPosition) => {
    return newPosition >= 0 || Math.abs(newPosition) >= originalWidth;
  };
  
  // Función para aplicar transformación con transición suave
  const applyTransform = (position, withTransition = true) => {
    if (carouselRef.current) {
      if (withTransition) {
        carouselRef.current.style.transition = 'transform 0.1s ease-out';
      } else {
        carouselRef.current.style.transition = 'none';
      }
      carouselRef.current.style.transform = `translateX(${position}px)`;
    }
  };
  
  // Función para manejar el inicio del drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    setHasMoved(false); // Resetear el flag de movimiento
    
    // Pausar la animación CSS y quitar transiciones durante el drag
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none';
    }
  };

  // Función para manejar el movimiento del drag
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    
    // Si hay movimiento, marcar que se ha movido
    if (Math.abs(deltaX) > 5) { // Umbral de 5px para considerar que es un drag
      setHasMoved(true);
    }
    
    const newPosition = animationPosition + deltaX;
    
    // Verificar si el drag está en los límites
    if (isDragAtLimit(newPosition)) {
      // Si está en los límites, limitar el movimiento
      if (newPosition >= 0) {
        // Límite izquierdo - solo permitir movimiento hacia la derecha
        if (deltaX < 0) {
          setDragOffset(deltaX);
          applyTransform(newPosition, false);
        }
      } else if (Math.abs(newPosition) >= originalWidth) {
        // Límite derecho - solo permitir movimiento hacia la izquierda
        if (deltaX > 0) {
          setDragOffset(deltaX);
          applyTransform(newPosition, false);
        }
      }
    } else {
      // Movimiento normal dentro de los límites
      setDragOffset(deltaX);
      applyTransform(newPosition, false);
    }
  };

  // Función para manejar el fin del drag
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setIsPaused(false);
    
    // Actualizar la posición de la animación
    const finalPosition = animationPosition + dragOffset;
    setAnimationPosition(finalPosition);
    
    // Aplicar la posición final con transición suave
    applyTransform(finalPosition, true);
    
    setDragOffset(0);
    // No resetear hasMoved aquí, se necesita para el onClick
  };

  // Función para manejar el touch en dispositivos móviles
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setIsPaused(true);
    setDragStartX(touch.clientX);
    setDragOffset(0);
    setHasMoved(false); // Resetear el flag de movimiento
    
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX;
    
    // Si hay movimiento, marcar que se ha movido
    if (Math.abs(deltaX) > 5) { // Umbral de 5px para considerar que es un drag
      setHasMoved(true);
    }
    
    const newPosition = animationPosition + deltaX;
    
    // Aplicar la misma lógica de límites para touch
    if (isDragAtLimit(newPosition)) {
      if (newPosition >= 0) {
        if (deltaX < 0) {
          setDragOffset(deltaX);
          applyTransform(newPosition, false);
        }
      } else if (Math.abs(newPosition) >= originalWidth) {
        if (deltaX > 0) {
          setDragOffset(deltaX);
          applyTransform(newPosition, false);
        }
      }
    } else {
      setDragOffset(deltaX);
      applyTransform(newPosition, false);
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Efecto para manejar la animación infinita
  useEffect(() => {
    if (!isDragging && !isPaused) {
      const animate = () => {
        if (carouselRef.current && !isDragging) {
          const currentPosition = animationPosition;
          const newPosition = currentPosition - 0.5; // Velocidad reducida para mayor suavidad
          
          // Resetear la posición cuando llegue al final (solo para animación automática)
          if (Math.abs(newPosition) >= originalWidth) {
            setAnimationPosition(0);
            applyTransform(0, false); // Sin transición para el salto
          } else {
            setAnimationPosition(newPosition);
            applyTransform(newPosition, false); // Sin transición durante la animación automática
          }
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, isPaused, animationPosition, originalWidth]);
  
  return (
    <div className={styles.recommendationsSection}>
      <h4>More by puzzle.today</h4>
      <div className={styles.carouselContainer}>
        <div 
          className={styles.recommendationsContent}
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            willChange: 'transform', // Optimización de rendimiento
          }}
        >
          {duplicatedRecommendations.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className={styles.recommendationItem}
              onClick={() => handleItemClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.imageDefault}></div>
              <div className={styles.info}>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.pages}>{item.pages}</p>
                <div className={styles.authorInfo}>
                  <span className={styles.author}>Por {item.author}</span>
                  <span 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // margin: '0 4px',
                      fontSize: '18px',
                      color: '#8F8F8F',
                      userSelect: 'none'
                    }}
                  >•</span>
                  <span>Guardado por {item.saved}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoExploreCommunity = ({close}) => {
    const [t] = useTranslation("ChatView");
    const { paramModal } = useSelector(
          (state) => state.user,
          shallowEqual
        );
  return (
    <ModalBlackBgTemplate
    close={close}
    father={paramModal.type}
    customStyle={{
      minHeight: "10vh",
      width: "50vw",
      maxHeight: "80vh",
      maxWidth: "80vw",
    }}
  >
    <HeaderCard
      title={paramModal.type }
      setState={close}
      titleStyle={{ fontSize: " clamp(9px, 1.5vw, 18px)" }}
    >
   <Button type="white">{t('cancel')}</Button>  
   <Button >{t('save')}</Button>  
   <Button type="white" headerStyle={{borderRadius:"999px"}}>{t('buy')} {paramModal?.type} <span className={styles.price}>{paramModal.data?.price || t('price')}</span></Button>  
    </HeaderCard>
    
    {/* Contenido principal con las 4 secciones */}
    <div className={styles.contentContainer}>
      {/* Sección 1: Header dinámico */}
      <DynamicHeader type={paramModal?.type} data={paramModal?.data} />
      
      {/* Sección 2: Información dinámica */}
      <DynamicInfo type={paramModal?.type} data={paramModal?.data} />
      
      {/* {
  rating: 4.2,
  starCounts: {
    5: 15,  // 15 reviews de 5 estrellas
    4: 8,   // 8 reviews de 4 estrellas
    3: 3,   // 3 reviews de 3 estrellas
    2: 1,   // 1 review de 2 estrellas
    1: 0    // 0 reviews de 1 estrella
  }
} */}
      <RatingSection  starCounts={paramModal?.data?.starCounts || {
        5: 80,
        4: 28,
        3: 63,
        2: 9,
        1: 14
      }} />
      
      {/* Sección 4: Recomendaciones (siempre igual) */}
      <RecommendationsSection />
    </div>
    </ModalBlackBgTemplate>
  )
}

export default InfoExploreCommunity