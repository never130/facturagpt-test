import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { FileText, Globe, GripVertical, Trash2 } from 'lucide-react';
// import { Button } from './ui/button';
// import { ScrapingLayer } from '../App';
import styles from './Sidebar.module.css';

import { ReactComponent as IconGrip } from './assets/icon-grip.svg';
import { ReactComponent as IconLayer } from './assets/icon-layer.svg';
import { ReactComponent as IconTrash } from './assets/icon-trash.svg';
import { ReactComponent as IconPDF } from './assets/icon-pdf.svg';



const DraggableLayer = ({ layer, index, isActive, onSelect, onDelete, moveLayer }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'layer',
    item: { id: layer.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'layer',
    hover: (item) => {
      if (item.index !== index) {
        moveLayer(item.index, index);
        item.index = index;
      }
    },
  });

//   const LayerIcon = layer.type === 'pdf' ? FileText : Globe;
//   const LayerIcon = layer.type === 'pdf' ? 'icon file' : 'icon globe';
  const LayerIcon = layer.type === 'pdf' ? IconPDF : IconLayer;

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`${styles.layer} ${isActive ? styles.layerActive : ''} ${isDragging ? styles.layerDragging : ''}`}
      onClick={onSelect}
    >
      <div ref={drag} className={styles.layerDragHandle}>
        {/* <GripVertical size={16} /> */}
        <IconGrip />
      </div>
      
      {/* icon layer */}
      {/* <IconLayer /> */}
      <LayerIcon size={16} className={styles.layerIcon} />
      
      <div className={styles.layerContent}>
        <div className={styles.layerName}>{layer.name}</div>
        <div className={styles.layerUrl}>{layer.url}</div>
        <div className={styles.layerStats}>
          {layer.selectors.length} selectores | {layer.variables.length} variables
        </div>
      </div>
      
      <button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={styles.deleteButton}
      >
        <IconTrash />
        {/* <Trash2 size={14} /> */}
      </button>
    </div>
  );
};

export const Sidebar = ({
  layers,
  activeLayer,
  onLayerSelect,
  onLayerDelete,
  onLayersReorder
}) => {
  const moveLayer = (dragIndex, hoverIndex) => {
    const reorderedLayers = [...layers];
    const [draggedLayer] = reorderedLayers.splice(dragIndex, 1);
    reorderedLayers.splice(hoverIndex, 0, draggedLayer);
    onLayersReorder(reorderedLayers);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Capas de Scraping</h3>
          <div className={styles.layerCount}>{layers.length} capas</div>
        </div>
        
        <div className={styles.layerList}>
          {layers.map((layer, index) => (
            <DraggableLayer
              key={layer.id}
              layer={layer}
              index={index}
              isActive={activeLayer === layer.id}
              onSelect={() => onLayerSelect(layer.id)}
              onDelete={() => onLayerDelete(layer.id)}
              moveLayer={moveLayer}
            />
          ))}
          
          {layers.length === 0 && (
            <div className={styles.emptyState}>
              <p>No hay capas aún</p>
              <p>Usa el chat para agregar URLs o PDFs</p>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};