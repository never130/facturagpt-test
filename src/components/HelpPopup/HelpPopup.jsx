import React, { useState, useEffect, useRef } from 'react';
import './HelpPopup.css';
import useHelpData from '../../hooks/useHelpData';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccount } from '../../actions/user';

const HelpPopup = ({ children, helpId, title, description }) => {
  const helpData = useHelpData(helpId);
  const finalTitle = title || helpData.title;
  const finalDescription = description || helpData.description;
  const [showPopup, setShowPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFlying, setIsFlying] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [arrowDirection, setArrowDirection] = useState('top');
  const elementRef = useRef(null);
  const popupRef = useRef(null);
  const instanceIdRef = useRef(Math.random().toString(36).slice(2));
  const hideTimeoutRef = useRef(null);
  const isOverTriggerRef = useRef(false);
  const isOverPopupRef = useRef(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const isDismissed = Boolean(user?.helpers?.[helpId]);

  const clearHideTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const startHideTimer = () => {
    clearHideTimer();
    hideTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
      setIsFlying(false);
      setIsVisible(true);
    }, 2000);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isDismissed) return;

    const handleMouseEnter = () => {
      isOverTriggerRef.current = true;
      clearHideTimer();
      // Avisar globalmente para cerrar otros help popups
      window.dispatchEvent(
        new CustomEvent('help-popup-open', {
          detail: { instanceId: instanceIdRef.current },
        })
      );
      setIsFlying(true);
      setTimeout(() => {
        setIsVisible(false);
        setShowPopup(true);
        
        // Calcular posición del popup
        const rect = element.getBoundingClientRect();
        const popupWidth = 300; // Ancho estimado del popup
        const popupHeight = 120; // Alto estimado del popup
        
        let x = rect.left + rect.width / 2 - popupWidth / 2;
        let y = rect.top - popupHeight - 10;
        let direction = 'top';
        
        // Ajustar si se sale de la pantalla
        if (x < 20) x = 20;
        if (x + popupWidth > window.innerWidth - 20) x = window.innerWidth - popupWidth - 20 - 25;
        if (y < 20) {
          y = rect.bottom + 10; // Mostrar abajo si no cabe arriba
          direction = 'bottom';
        }
        
        setPopupPosition({ x, y });
        setArrowDirection(direction);
      }, 300);
    };

    const handleMouseLeave = () => {
      isOverTriggerRef.current = false;
      if (!isOverPopupRef.current) {
        startHideTimer();
      }
    };

    const handleClick = () => {
      setIsFlying(true);
      setTimeout(() => {
        setIsVisible(false);
        setShowPopup(false);
        setIsFlying(false);
      }, 300);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('click', handleClick);
    };
  }, [isDismissed]);

  // Escuchar cuando otro HelpPopup se abra para cerrar este
  useEffect(() => {
    if (isDismissed) return;

    const handleAnyHelpOpen = (ev) => {
      const openedId = ev?.detail?.instanceId;
      if (openedId && openedId !== instanceIdRef.current) {
        setShowPopup(false);
        setIsFlying(false);
        setIsVisible(true);
      }
    };

    window.addEventListener('help-popup-open', handleAnyHelpOpen);
    return () => window.removeEventListener('help-popup-open', handleAnyHelpOpen);
  }, [isDismissed]);

  const handlePopupMouseEnter = () => {
    isOverPopupRef.current = true;
    clearHideTimer();
  };

  const handlePopupMouseLeave = () => {
    isOverPopupRef.current = false;
    if (!isOverTriggerRef.current) {
      startHideTimer();
    }
  };

  const handleCloseButton = async () => {
    setShowPopup(false);
    // Persistir el helper como cerrado SOLO al pulsar el botón de cerrar
    try {
      if (!user?.id) return;
      const newHelpers = { ...(user.helpers || {}), [helpId]: true };
      await dispatch(updateAccount({ data: { id: user.id, helpers: newHelpers } }));
    } catch (e) {
      // Silenciar errores para no romper la UX del popup
    }
  };

  if (isDismissed) return <>{children}</>;

  return (
    <>
      <div 
        ref={elementRef}
        className={`help-indicator ${isVisible ? 'visible' : ''} ${isFlying ? 'flying' : ''}`}
        data-help={helpId}
      >
        {children}
      </div>
      
      {showPopup && (
        <div 
          ref={popupRef}
          className={`help-popup arrow-${arrowDirection}`}
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`
          }}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        >
          <div className="help-popup-content">
            <div className="help-popup-header">
              <h3>{finalTitle}</h3>
              <button 
                className="help-popup-close"
                onClick={handleCloseButton}
              >
                ×
              </button>
            </div>
            <div className="help-popup-body">
              <p>{finalDescription}</p>
            </div>
          </div>
          <div className="help-popup-arrow"></div>
        </div>
      )}
    </>
  );
};

export default HelpPopup; 