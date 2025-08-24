import React from 'react';
import styles from './Tags.module.css';

const Tags = ({ onTagClick, direction }) => {
  const tagList = [
    { bgColor: '#222222', label: '1', text: 'Etiqueta' },
    { bgColor: '#0B06FF', label: '2', text: 'Etiqueta' },
    { bgColor: '#FF0000', label: '3', text: 'Etiqueta' },
    { bgColor: '#12A27F', label: '4', text: 'Etiqueta' },
    { bgColor: '#7329A5', label: '5', text: 'Etiqueta' },
    { bgColor: '#7086FD', label: '6', text: 'Etiqueta' },
    { bgColor: '#FF8C00', label: '7', text: 'Etiqueta' },
    { bgColor: '#16C098', label: '8', text: 'Etiqueta' },
    { bgColor: '#C075EE', label: '9', text: 'Etiqueta' },
    { bgColor: '#EEFF00', label: '10', text: 'Etiqueta', color: '#222' },
  ];

  return (
    <div className={styles.tags} style={{}}>
      {tagList.map((tag, index) => (
        <span
          key={index}
          className={styles.tag}
          style={{
            backgroundColor: tag.bgColor,
            color: tag.color,
          }}
          onClick={() => onTagClick(tag.label)}
        >
          {tag.text}
        </span>
      ))}
    </div>
  );
};

export default Tags;
