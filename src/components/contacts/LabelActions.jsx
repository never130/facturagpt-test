import React, { useState } from 'react';
import './LabelActions.css';

const LabelActions = ({
                          tags = [
                              { id: 1, text: "Etiqueta", color: "var(--dc2626-color)" },
                              { id: 2, text: "Etiqueta", color: "primary" },
                              { id: 3, text: "Etiqueta", color: "primary" }
                          ],
                          documentsCount = 99,
                          transactionsCount = 99,
                          onTagRemove = () => {}
                      }) => {
    const [hoveredTag, setHoveredTag] = useState(null);

    return (
        <div className="label-actions-container">
            <div className="tags-section">
                {tags.map((tag) => (
                    <div
                        key={tag.id}
                        className="tag"
                        onMouseEnter={() => setHoveredTag(tag.id)}
                        onMouseLeave={() => setHoveredTag(null)}
                        style={{
                            background: tag?.color
                        }}
                    >
                        <span>
                            {tag.text}
                        </span>
                        {hoveredTag === tag.id && (
                            <button
                                className="remove-tag-btn"
                                onClick={() => onTagRemove(tag.id)}
                                aria-label={`Eliminar etiqueta ${tag.text}`}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="actions-section">
                <button className="action-btn documents-btn">
                    Ver documentos <span className="count">({documentsCount})</span>
                </button>
                <button className="action-btn documents-btn">
                    Ver transacciones <span className="count">({transactionsCount})</span>
                </button>
            </div>
        </div>
    );
};

export default LabelActions;
