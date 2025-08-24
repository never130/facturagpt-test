import React, { useState, useEffect, useRef } from 'react';
import styles from './ItemNavigation.module.css';

const ItemNavigation = ({ items, typeContainer, father,setTypeState, initialParameterType, FunctionsValidation }) => {
  const [activeId, setActiveId] = useState(initialParameterType || "textBox");
    const isProgrammaticScroll = useRef(false); 
  const [checkedItems, setCheckedItems] = useState(false);

  const handleClick = (id,index) => {
    setTypeState && setTypeState(id)
    setActiveId(id);
   setCheckedItems(index)
    isProgrammaticScroll.current = true;

    const container = document.getElementById('scrollContainer');
    const element = document.getElementById(id);

    if (container && element) {
      const yOffset = -100;
      const y = element.offsetTop + yOffset;

      container.scrollTo({
        top: y,
        behavior: 'smooth',
      });

      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500); 
    }
  };

  useEffect(() => {
    const container = document.getElementById('scrollContainer');
    if (!container) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return; 

      const scrollPosition = container.scrollTop;
      const offset = 110;

      let currentId = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop - offset <= scrollPosition) {
          currentId = item.id;
        }
      }

      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [items, activeId]);


  const handleScroll = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
  <ul className={styles.ItemNavigation}>
  {FunctionsValidation ? (
    // Si FunctionsValidation es true: mostramos los items
    items.map(({ id, label, Icon, ref }, index) => (
      <li
        key={id}
        onClick={() => handleClick(id, index)}
        className={activeId === id && father !== "asset" ? styles.active : ""}
      >
        <button type="button" onClick={() => ref && handleScroll(ref)}>
          {Icon && (
            father === "parameter" ? (
              <div className={styles.iconContainer}>
                <Icon
                  className={
                    activeId === id && father !== "asset"
                      ? id === "parameters"
                        ? styles.activeIconStoke
                        : styles.activeIcon
                      : id === "parameters"
                        ? styles.iconStoke
                        : styles.icon
                  }
                />
              </div>
            ) : (
              <Icon
                className={
                  activeId === id && father !== "asset"
                    ? id === "parameters"
                      ? styles.activeIconStoke
                      : styles.activeIcon
                    : id === "parameters"
                      ? styles.iconStoke
                      : styles.icon
                }
              />
            )
          )}
          {label}
        </button>

        {typeContainer === "popup" && father === "asset" && (
          <input
            type="checkbox"
            checked={checkedItems === index}
            style={{ opacity: checkedItems === index ? 1 : 0 }}
          />
        )}
      </li>
    ))
  ) : (
    // Si FunctionsValidation es false: mostramos un mensaje
    <ul className={styles.gridContainer}>
      {items.map(({ id, label, Icon, ref, desc }, index) => (
        <span>
          <button type="button">
            <div className={styles.iconContainer}>
              <Icon/>
            </div>
            <div>
            <span style={{display:"flex", flexDirection:"column",justifyContent:"center",alignItems:"baseline"}}>
              <p>{label}</p>
              <p className={styles.truncate} style={{fontSize:"10px", color:"#8C8C8C"}}>{desc}</p>
            </span>
            </div>
          </button>

          {typeContainer === "popup" && father === "asset" && (
            <input
              type="checkbox"
              checked={checkedItems === index}
              className={styles.checkbox}
              style={{ opacity: checkedItems === index ? 1 : 0 }}
            />
          )}
        </span>
      ))}
    </ul>
      )}
</ul>
  );
};

export default ItemNavigation;
