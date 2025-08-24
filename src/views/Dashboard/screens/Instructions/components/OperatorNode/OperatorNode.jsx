import React, { useState, useCallback, memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, X, Play, Trash2 } from 'lucide-react';
import styles from './OperatorNode.module.css';

const OperatorNode = memo(({ data, selected, id, executionResult, isActive, onDelete, forceDelete, isConfigOpen, onToggleConfig, onCloseConfig }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [configValue, setConfigValue] = useState(data.configValue || '');
  
  // Use a ref to track if the config should be shown
  const configShouldShow = React.useRef(false);
  
  // Use a more robust approach with a global state
  const [configOpen, setConfigOpen] = useState(false);

  // Debug logging
  console.log('OperatorNode render:', { 
    id, 
    hasOnConfigChange: !!data.onConfigChange, 
    onConfigChangeType: typeof data.onConfigChange,
    hasOnDelete: !!onDelete,
    onDeleteType: typeof onDelete,
    isInput: data.isInput,
    showConfig: showConfig
  });

  // Test function to verify button functionality
  const testButtonClick = useCallback((buttonName) => {
    console.log(`Test: ${buttonName} button clicked for node ${id}`);
    alert(`Test: ${buttonName} button is working for node ${id}`);
  }, [id]);

  const getTypeColor = (type) => {
    const colors = {
      text: '#3b82f6',
      number: '#10b981',
      boolean: '#f59e0b',
      date: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeLabel = (type) => {
    const labels = {
      text: 'T',
      number: 'N',
      boolean: 'B',
      date: 'D'
    };
    return labels[type] || '?';
  };

  const handleConfigChange = useCallback((value) => {
    setConfigValue(value);
    if (data.onConfigChange && typeof data.onConfigChange === 'function') {
      try {
        data.onConfigChange('configValue', value);
      } catch (error) {
        console.error('Error calling onConfigChange:', error);
      }
    }
  }, [data.onConfigChange]);

  const handleInputChange = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value;
    handleConfigChange(value);
  }, [handleConfigChange]);

  const toggleConfig = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Toggle config clicked for node:', id);
    if (onToggleConfig) {
      onToggleConfig(id);
    } else {
      setShowConfig(prev => {
        const newState = !prev;
        configShouldShow.current = newState;
        setConfigOpen(newState);
        console.log('Config panel state changed from', prev, 'to', newState);
        return newState;
      });
    }
  }, [id, onToggleConfig]);

  const closeConfig = useCallback(() => {
    console.log('Closing config panel for node:', id);
    if (onCloseConfig) {
      onCloseConfig(id);
    } else {
      setShowConfig(false);
      configShouldShow.current = false;
      setConfigOpen(false);
    }
  }, [id, onCloseConfig]);

  const toggleInputNode = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Toggle input node clicked for node:', id);
    
    // Try multiple ways to call the config change function
    let success = false;
    
    if (data.onConfigChange && typeof data.onConfigChange === 'function') {
      try {
        const newIsInputValue = !data.isInput;
        data.onConfigChange('isInput', newIsInputValue);
        console.log('Input node toggled to:', newIsInputValue);
        success = true;
      } catch (error) {
        console.error('Error calling onConfigChange for isInput:', error);
      }
    }
    
    if (!success) {
      console.error('onConfigChange not available or not a function');
      // Try to dispatch a custom event as fallback
      const customEvent = new CustomEvent('nodeConfigChange', {
        detail: { nodeId: id, key: 'isInput', value: !data.isInput }
      });
      document.dispatchEvent(customEvent);
    }
  }, [data, id]);

  const handleDelete = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    
    console.log('Delete button clicked for node:', id);
    
    // Try multiple approaches to ensure deletion works
    const deleteNode = () => {
      if (forceDelete && typeof forceDelete === 'function') {
        console.log('Using forceDelete for node:', id);
        forceDelete(id);
      } else if (onDelete && typeof onDelete === 'function') {
        console.log('Using onDelete for node:', id);
        onDelete(id);
      } else if (window.deleteNodeGlobal) {
        console.log('Using global delete for node:', id);
        window.deleteNodeGlobal(id);
      } else {
        console.error('No delete function available');
        alert('No delete function available');
      }
    };
    
    // Execute immediately and also with a small delay as backup
    deleteNode();
    setTimeout(deleteNode, 50);
  }, [onDelete, forceDelete, id]);

  return (
    <div className={`${styles.operatorNode} ${selected ? styles.selected : ''} ${isActive ? styles.active : ''} ${executionResult ? styles.hasResult : ''}`}>

      
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        style={{ background: getTypeColor(data.type) }}
      />
      
      <div className={styles.nodeHeader}>
        <div className={styles.operatorInfo}>
          <div className={styles.typeBadge} style={{ backgroundColor: getTypeColor(data.type) }}>
            {getTypeLabel(data.type)}
          </div>
          <div className={styles.titleSection}>
            <h4 className={styles.operatorTitle}>{data.title}</h4>
            <p className={styles.operatorDescription}>{data.description}</p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '4px',
          position: 'relative',
          zIndex: 9999,
          marginLeft: 'auto',
          flexShrink: 0
        }}>
          <button 
            onClick={toggleInputNode}
            title={data.isInput ? "Quitar como entrada" : "Marcar como entrada"}
            type="button"
            style={{
              background: data.isInput ? '#10b981' : '#f1f5f9',
              color: data.isInput ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '28px',
              minHeight: '28px',
              zIndex: 9999,
              fontSize: '12px'
            }}
          >
            <Play size={14} />
          </button>
          <button 
            onClick={toggleConfig}
            title="Configure operator"
            type="button"
            style={{
              background: '#f1f5f9',
              color: '#64748b',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '28px',
              minHeight: '28px',
              zIndex: 9999,
              fontSize: '12px'
            }}
          >
            <Settings size={14} />
          </button>
          <button 
            onClick={handleDelete}
            title="Eliminar nodo"
            type="button"
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '28px',
              minHeight: '28px',
              zIndex: 9999,
              fontSize: '12px'
            }}
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={() => {
              console.log('Config states:', { 
                showConfig, 
                configOpen, 
                configShouldShow: configShouldShow.current,
                isConfigOpen,
                hasOnToggleConfig: !!onToggleConfig,
                hasOnCloseConfig: !!onCloseConfig
              });
              alert(`Config states:\nshowConfig: ${showConfig}\nconfigOpen: ${configOpen}\nconfigShouldShow: ${configShouldShow.current}\nisConfigOpen: ${isConfigOpen}`);
            }}
            title="Debug Config"
            type="button"
            style={{
              background: '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '28px',
              minHeight: '28px',
              zIndex: 9999,
              fontSize: '10px',
              fontWeight: 'bold'
            }}
          >
            C
          </button>

        </div>
      </div>

      {(isConfigOpen || showConfig || configShouldShow.current || configOpen) && (
        <div 
          className={styles.configPanel}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={styles.configHeader}>
            <span>Configuration</span>
            <button 
              className={styles.closeConfig}
              onClick={closeConfig}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
          
          <div 
            className={styles.configContent}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <label className={styles.configLabel}>
              Value to compare:
              <input
                type={data.type === 'number' ? 'number' : 'text'}
                value={configValue}
                onChange={handleInputChange}
                placeholder={`Enter ${data.type} value...`}
                className={styles.configInput}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onBlur={(e) => e.stopPropagation()}
              />
            </label>
            
            {data.type === 'text' && (
              <div className={styles.textOptions}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  Case insensitive
                </label>
              </div>
            )}
            
            {data.type === 'number' && (
              <div className={styles.numberOptions}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  Allow decimals
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        style={{ background: getTypeColor(data.type) }}
      />

      {/* Resultado de ejecución */}
      {executionResult && (
        <div className={`${styles.executionResult} ${executionResult.result ? styles.true : styles.false}`}>
          <span className={styles.resultLabel}>
            {executionResult.result ? '✓ Verdadero' : '✗ Falso'}
          </span>
          <span className={styles.resultInput}>
            Entrada: {String(executionResult.input)}
          </span>
        </div>
      )}

      {/* Indicador de entrada */}
      {data.isInput && (
        <div className={styles.inputIndicator}>
          <Play size={12} />
          <span>Entrada</span>
        </div>
      )}
    </div>
  );
});

OperatorNode.displayName = 'OperatorNode';

export default OperatorNode; 