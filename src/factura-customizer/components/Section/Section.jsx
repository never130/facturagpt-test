import React from 'react';
import styles from './Section.module.css';

const Section = ({ id, title, children, className = '' }) => {
  const isActive = className.includes('activeSection');

  return (
    <section
      id={id}
      className={`section ${className} ${
        isActive ? styles.active : ''
      }`}
    >
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>{children}</div>
    </section>
  );
};

export default Section;
