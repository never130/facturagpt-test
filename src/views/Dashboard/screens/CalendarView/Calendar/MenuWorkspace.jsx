// Actions y Controllers del backend deben manejar la lógica de datos y peticiones.
// Este componente solo gestiona la UI y el consumo de datos.

import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import svgPaths from './svg-7qwzytdqz1.ts';
import styles from './MenuWorkspace.module.css';

const ItemType = 'MENU_ITEM';

const DraggableMenuItem = ({ item, index, moveItem, handleCheckboxChange, isExpanded, toggleExpanded, renderCheckbox, renderDropdownIcon, renderDotsIcon }) => {
    const ref = useRef(null);

    const [{ handlerId }, drop] = useDrop({
        accept: ItemType,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(draggedItem, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = draggedItem.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveItem(dragIndex, hoverIndex);
            draggedItem.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: () => {
            return { id: item.id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ opacity }}
            data-handler-id={handlerId}
            className={styles.menuItem}
        >
            <div className={styles.itemContent}>
                <div onClick={() => handleCheckboxChange(item.id)}>
                    {renderCheckbox(item.checked)}
                </div>

                {item.showDots && (
                    <div className={styles.itemDetails}>
                        {renderDotsIcon()}
                        <div
                            className={styles.colorIndicator}
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <span className={styles.itemLabel}>{item.label}</span>
                    </div>
                )}

                {!item.showDots && (
                    <>
                        <span className={styles.firstItemLabel}>{item.label}</span>
                        {/* {isExpanded && (
              <div className={styles.expandedContent}>
                <div className={styles.subItem}>• Notificaciones de sistema</div>
                <div className={styles.subItem}>• Alertas importantes</div>
                <div className={styles.subItem}>• Recordatorios</div>
              </div>
            )} */}
                    </>
                )}
            </div>

            {item.hasDropdown && (
                <div onClick={toggleExpanded} className={styles.dropdownContainer}>
                    {renderDropdownIcon(isExpanded)}
                </div>
            )}
        </div>
    );
};

const PanelMenu = () => {
    const [menuItems, setMenuItems] = useState([
        { id: 1, label: 'Todas las notificaciones', checked: false, hasDropdown: true, showDots: false, color: null },
        { id: 2, label: 'Cuenta y Workspace', checked: false, hasDropdown: false, showDots: true, color: '#10a37f' },
        { id: 3, label: 'Agentes y Chats', checked: false, hasDropdown: false, showDots: true, color: '#0000ff' },
        { id: 4, label: 'Workflows', checked: false, hasDropdown: false, showDots: true, color: '#0000ff' },
        { id: 5, label: 'Documentos', checked: false, hasDropdown: false, showDots: true, color: '#0000ff' },
        { id: 6, label: 'Tablas', checked: false, hasDropdown: false, showDots: true, color: '#0000ff' },
        { id: 7, label: 'Tareas', checked: false, hasDropdown: false, showDots: true, color: '#0000ff' }
    ]);

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Inicialización del componente
    }, []);

    const handleCheckboxChange = (id) => {
        setMenuItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleMoreInfoClick = () => {
        alert('Aquí encontrarás más información sobre las configuraciones de notificaciones disponibles en tu workspace.');
    };

    const moveItem = (dragIndex, hoverIndex) => {
        setMenuItems(prevItems => {
            const draggedItem = prevItems[dragIndex];
            const newItems = [...prevItems];
            newItems.splice(dragIndex, 1);
            newItems.splice(hoverIndex, 0, draggedItem);
            return newItems;
        });
    };

    const renderCheckbox = (checked) => (
        <div className={styles.checkboxContainer}>
            <div className={styles.checkboxWrapper}>
                <div className={styles.checkbox}>
                    <div className={`${styles.checkboxBorder} ${checked ? styles.checked : ''}`}>
                        {checked && <div className={styles.checkmark}>✓</div>}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDropdownIcon = (expanded) => (
        <div className={`${styles.dropdownIcon} ${expanded ? styles.expanded : ''}`}>
            <svg className={styles.dropdownSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
                <path d={svgPaths.p9977ad0} fill="#757575" />
            </svg>
        </div>
    );

    const renderDotsIcon = () => (
        <div className={styles.dotsIcon}>
            <svg className={styles.dotsSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 9 16">
                <path clipRule="evenodd" d={svgPaths.p9569d00} fill="#979797" fillRule="evenodd" />
            </svg>
        </div>
    );

    const renderInfoIcon = () => (
        <div className={styles.infoIcon}>
            <svg className={styles.infoSvg} fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                <circle cx="7" cy="7" fill="#11A380" r="7" />
                <path d={svgPaths.p25df9700} fill="white" />
            </svg>
        </div>
    );

    return (
        <div className={styles.menuWorkspace}>
            <DndProvider backend={HTML5Backend}>
                <div className={styles.panelMenu}>
                    {menuItems.map((item, index) => (
                        <DraggableMenuItem
                            key={item.id}
                            index={index}
                            item={item}
                            moveItem={moveItem}
                            handleCheckboxChange={handleCheckboxChange}
                            isExpanded={isExpanded && item.id === 1}
                            toggleExpanded={toggleExpanded}
                            renderCheckbox={renderCheckbox}
                            renderDropdownIcon={renderDropdownIcon}
                            renderDotsIcon={renderDotsIcon}
                        />
                    ))}

                </div>
            </DndProvider>
            <div className={styles.moreInfo} onClick={handleMoreInfoClick}>
                {renderInfoIcon()}
                <span className={styles.moreInfoText}>Más información</span>
            </div>
        </div>
    );
};

export default PanelMenu;