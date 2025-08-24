import React, { useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({
  isExpanded = true,
  onToggle,
  activeSection = 'QR Code Style',
  onSectionChange,
}) => {
  
  const activeItem = activeSection;

  const menuItems = [
    'QR Code Style',
    'Logo Settings',
    'Color Palette',
    'Advanced Style',
  ];

  const toggleSidebar = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const handleMenuItemClick = (item) => {
    if (onSectionChange) {
      onSectionChange(item);
    }
  };

  return (
    <aside
      className={`${styles.sidebar} ${!isExpanded ? styles.collapsed : ''}`}
    >
      <div className={styles.toggleButton} onClick={toggleSidebar}>
        {isExpanded ? '◀' : '▶'}
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item}
              className={`${styles.menuItem} ${
                item === activeItem ? styles.active : ''
              }`}
              onClick={() => handleMenuItemClick(item)}
              data-initial={item.charAt(0)}
            >
              {isExpanded ? item : ''}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
