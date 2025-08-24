import { useState } from 'react';
import styles from './HighlightedText.module.css';

const HighlightedText = ({ text, annotations }) => {
    const [hoveredAnnotation, setHoveredAnnotation] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (annotation, event) => {
        setHoveredAnnotation(annotation);
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleClick = (annotation) => {
        window.open(annotation.url_citation.url, '_blank');
    };

    if (!text || !annotations || annotations.length === 0) {
        return <div className={styles.highlightedTextContainer}>{text}</div>;
    }


    const sortedAnnotations = [...annotations].sort((a, b) => a.start_index - b.start_index);

    let result = [];
    let lastIndex = 0;

    sortedAnnotations.forEach((annotation, i) => {
        const start = annotation.url_citation.start_index;
        const end = annotation.url_citation.end_index;
        if (start > lastIndex) {
            const fragment = text.substring(lastIndex, start);
            result.push(
                <span
                    key={`highlight-${i}`}
                    className={styles.highlightedCitation}
                    onMouseEnter={(e) => handleMouseEnter(annotation, e)}
                    onMouseLeave={() => setHoveredAnnotation(null)}
                    onClick={() => handleClick(annotation)}
                >
                    {fragment}
                </span>
            );
        }
        lastIndex = end;
    });

    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }

    return (
        <p className={styles.highlightedTextContainer}>
            {result}
            {hoveredAnnotation && (
                <div
                    className={styles.citationPopup}
                    style={{
                        position: 'fixed',
                        left: `${mousePosition.x + 10}px`,
                        top: `${mousePosition.y + 10}px`,
                        zIndex: 1000
                    }}
                >
                    <b>{hoveredAnnotation.url_citation.title}</b>
                    <a href={hoveredAnnotation.url_citation.url} target="_blank" rel="noopener noreferrer">
                        {hoveredAnnotation.url_citation.url}
                    </a>
                </div>
            )}
        </p>
    );
};


export default HighlightedText;