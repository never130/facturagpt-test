import React, { useState, useEffect } from 'react';
import './TableSkeleton.css';

import fn from './fn';

const TableSkeleton = ({
  skeletonConfig,
  onCellClick,
  onFormulaApply,
  isAnimating = true
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [formulaMode, setFormulaMode] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [loadingState, setLoadingState] = useState('loading');
  const [selectedOperation, setSelectedOperation] = useState('sum');
  const [showOperationPopup, setShowOperationPopup] = useState(false);

  const [columnMapping, setColumnMapping] = useState({
    sourceA: 'A',
    sourceB: 'B',
    target: 'C'
  });
  const [showColumnInputs, setShowColumnInputs] = useState(false);

  const columnLetterToIndex = (letter) => {
    return letter.toUpperCase().charCodeAt(0) - 65;
  };

  const indexToColumnLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  const isValidColumnLetter = (letter) => {
    const index = columnLetterToIndex(letter);
    return index >= 0 && index < 6;
  };

  const getCurrentColumnIndices = () => {
    return {
      sourceA: columnLetterToIndex(columnMapping.sourceA),
      sourceB: columnLetterToIndex(columnMapping.sourceB),
      target: columnLetterToIndex(columnMapping.target)
    };
  };

  const updateColumnMapping = (field, value) => {
    const upperValue = value.toUpperCase();
    if (upperValue === '' || /^[A-F]$/.test(upperValue)) {
      setColumnMapping(prev => ({
        ...prev,
        [field]: upperValue
      }));
    }
  };

  const getOperationSymbol = () => {
    switch (selectedOperation) {
      case 'sum': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'average': return 'avg';
      case 'percentage': return '%';
      case 'difference': return '|diff|';
      case 'min': return 'min';
      case 'max': return 'max';
      case 'median': return 'med';
      case 'mode': return 'mode';
      case 'stddev': return 'σ';
      case 'variance': return 'σ²';
      case 'concat': return '&';
      case 'matching': return '=';
      default: return '+';
    }
  };

  const config = skeletonConfig || {
    rows: 8,
    columns: 6,
    headers: ['Tabla 1', 'Tabla 2', 'Operación', 'Resultado', 'Skeleton 2', 'Skeleton 3'],
    formulas: {
      '0,3': { type: 'sum', source: ['0,0', '0,1'], color: '#ff6b6b', description: 'Suma Tabla 1 + Tabla 2' },
      '1,3': { type: 'sum', source: ['1,0', '1,1'], color: '#ff6b6b', description: 'Suma Tabla 1 + Tabla 2' },
      '2,3': { type: 'sum', source: ['2,0', '2,1'], color: '#ff6b6b', description: 'Suma Tabla 1 + Tabla 2' },
      '3,3': { type: 'sum', source: ['3,0', '3,1'], color: '#ff6b6b', description: 'Suma Tabla 1 + Tabla 2' },
      '4,3': { type: 'sum', source: ['4,0', '4,1'], color: '#ff6b6b', description: 'Suma Tabla 1 + Tabla 2' },
      '5,3': { type: 'sum', source: ['5,0', '5,1'], color: '#ff6b6b', description: 'Suma Tabla 1 + Tabla 2' },
      '6,3': { type: 'sum', source: ['6,0', '6,1'], color: '#ff6b6b', description: 'Suma Tabla 1 + Tabla 2' },
      '7,3': { type: 'sum', source: ['7,0', '7,1'], color: '#ff6b6b', description: 'Suma Tabla 1 + Tabla 2' },
      '7,4': { type: 'average', source: ['0,3', '1,3', '2,3', '3,3', '4,3', '5,3', '6,3', '7,3'], color: '#4ecdc4', description: 'Promedio de Resultados' }
    },
    connections: [
      { from: '0,0', to: '0,3', type: 'sum' },
      { from: '0,1', to: '0,3', type: 'sum' },
      { from: '1,0', to: '1,3', type: 'sum' },
      { from: '1,1', to: '1,3', type: 'sum' },
      { from: '2,0', to: '2,3', type: 'sum' },
      { from: '2,1', to: '2,3', type: 'sum' },
      { from: '3,0', to: '3,3', type: 'sum' },
      { from: '3,1', to: '3,3', type: 'sum' },
      { from: '4,0', to: '4,3', type: 'sum' },
      { from: '4,1', to: '4,3', type: 'sum' },
      { from: '5,0', to: '5,3', type: 'sum' },
      { from: '5,1', to: '5,3', type: 'sum' },
      { from: '6,0', to: '6,3', type: 'sum' },
      { from: '6,1', to: '6,3', type: 'sum' },
      { from: '7,0', to: '7,3', type: 'sum' },
      { from: '7,1', to: '7,3', type: 'sum' },
      { from: '0,3', to: '7,4', type: 'average' },
      { from: '1,3', to: '7,4', type: 'average' },
      { from: '2,3', to: '7,4', type: 'average' },
      { from: '3,3', to: '7,4', type: 'average' },
      { from: '4,3', to: '7,4', type: 'average' },
      { from: '5,3', to: '7,4', type: 'average' },
      { from: '6,3', to: '7,4', type: 'average' },
      { from: '7,3', to: '7,4', type: 'average' }
    ]
  };

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingState('loaded');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCellClick = (rowIndex, colIndex) => {
    const cellKey = `${rowIndex},${colIndex}`;
    setSelectedCell(cellKey);

    if (onCellClick) {
      onCellClick(rowIndex, colIndex, cellKey);
    }
  };

  const handleFormulaClick = (formula) => {
    setFormulaMode(true);
    if (onFormulaApply) {
      onFormulaApply(formula);
    }
  };

  const getCellStyle = (rowIndex, colIndex) => {
    const cellKey = `${rowIndex},${colIndex}`;
    const formula = config.formulas[cellKey];
    const isSelected = selectedCell === cellKey;
    const isHovered = hoveredCell === cellKey;

    let baseStyle = {
      position: 'relative',
      width: '100%',
      minWidth: '100px',
      padding: '0px 12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      height: '34px',
      minHeight: '34px',
      display: 'flex !important',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      overflow: 'hidden'
    };

    const columnIndices = getCurrentColumnIndices();

    if (colIndex === 0) {
      baseStyle = {
        ...baseStyle,
        background: loadingState === 'loading'
          ? `linear-gradient(90deg, #e3f2fd 25%, #bbdefb 50%, #e3f2fd 75%)`
          : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        backgroundSize: loadingState === 'loading' ? '200% 100%' : '100% 100%',
        animation: loadingState === 'loading' ? 'skeletonShimmer 1.5s infinite' : 'none',
        borderLeft: '4px solid #2196f3',
        position: 'relative'
      };

      if (loadingState !== 'loading') {
        baseStyle = {
          ...baseStyle,
          '&::before': {
            content: `"${columnMapping.sourceA}"`,
            position: 'absolute',
            top: '2px',
            right: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#2196f3',
            background: 'white',
            padding: '1px 3px',
            borderRadius: '3px',
            border: '1px solid #2196f3'
          }
        };
      }
    } else if (colIndex === 1) {
      baseStyle = {
        ...baseStyle,
        background: loadingState === 'loading'
          ? `linear-gradient(90deg, #e8f5e8 25%, #c8e6c9 50%, #e8f5e8 75%)`
          : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        backgroundSize: loadingState === 'loading' ? '200% 100%' : '100% 100%',
        animation: loadingState === 'loading' ? 'skeletonShimmer 1.5s infinite' : 'none',
        borderLeft: '4px solid #4caf50',
        position: 'relative'
      };

      if (loadingState !== 'loading') {
        baseStyle = {
          ...baseStyle,
          '&::before': {
            content: `"${columnMapping.sourceB}"`,
            position: 'absolute',
            top: '2px',
            right: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#4caf50',
            background: 'white',
            padding: '1px 3px',
            borderRadius: '3px',
            border: '1px solid #4caf50'
          }
        };
      }
    } else if (colIndex === 2) {
      const getResultColor = () => {
        switch (selectedOperation) {
          case 'sum': return { bg: '#ffe6e6', border: '#ff6b6b' };
          case 'subtract': return { bg: '#e0f2f1', border: '#4ecdc4' };
          case 'multiply': return { bg: '#e3f2fd', border: '#45b7d1' };
          case 'average': return { bg: '#e8f5e8', border: '#96ceb4' };
          case 'percentage': return { bg: '#fff3e0', border: '#feca57' };
          case 'difference': return { bg: '#fce4ec', border: '#ff9ff3' };
          case 'min': return { bg: '#f3e5f5', border: '#ab47bc' };
          case 'max': return { bg: '#e8eaf6', border: '#3f51b5' };
          case 'median': return { bg: '#e0f7fa', border: '#00acc1' };
          case 'mode': return { bg: '#f1f8e9', border: '#8bc34a' };
          case 'stddev': return { bg: '#fff8e1', border: '#ffc107' };
          case 'variance': return { bg: '#fce4ec', border: '#e91e63' };
          case 'concat': return { bg: '#e8f5e8', border: '#4caf50' };
          case 'matching': return { bg: '#e3f2fd', border: '#2196f3' };
          default: return { bg: '#fff3e0', border: '#10a37f' };
        }
      };
      const colors = getResultColor();
      baseStyle = {
        ...baseStyle,
        background: 'linear-gradient(45deg, #10a37f, #2ecda6, #7cdec6, #22c69e42)',
        backgroundSize: loadingState === 'loading' ? '200% 100%' : '100% 100%',
        animation: loadingState === 'loading' ? 'skeletonShimmer 1.5s infinite' : 'none',
        boxShadow: `0 2px 8px ${colors.border}30`
      };
    } else if (colIndex === 3) {
      baseStyle = {
        ...baseStyle,
        background: 'red',
        backgroundSize: loadingState === 'loading' ? '200% 100%' : '100% 100%',
        animation: loadingState === 'loading' ? 'skeletonShimmer 1.5s infinite' : 'none',
      };
    } else {
      baseStyle = {
        ...baseStyle,
        background: loadingState === 'loading'
          ? `linear-gradient(92deg, rgb(232 232 232) 0%, rgb(255 255 255) 100%) 0% 0% / 100% 100%`
          : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        backgroundSize: loadingState === 'loading' ? '200% 100%' : '100% 100%',
        animation: loadingState === 'loading' ? 'skeletonShimmer 1.5s infinite' : 'none',
      };
    }

    if (formula) {
      baseStyle = {
        ...baseStyle,
        boxShadow: `0 4px 20px ${formula.color}30`
      };
    } else if (isSelected) {
      baseStyle = {
        ...baseStyle,
        color: 'white',
        transform: 'scale(1.02)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
        zIndex: 10
      };
    } else if (isHovered) {
      baseStyle = {
        ...baseStyle,
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        zIndex: 5
      };
    }

    return baseStyle;
  };

  const renderConnectionLines = () => {
    if (!config.connections || config.connections.length === 0) return null;

    return (
      <svg
        style={{
          position: 'absolute',
          right: -205,
          width: '540px',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <defs>
          {config.connections.map((connection, index) => (
            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#667eea" stopOpacity="0.6">
                <animate
                  attributeName="stop-opacity"
                  values="0.6;1;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#764ba2" stopOpacity="0.6">
                <animate
                  attributeName="stop-opacity"
                  values="0.6;1;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          ))}
        </defs>
        {config.connections.map((connection, index) => {
          const [fromRow, fromCol] = connection.from.split(',').map(Number);
          const [toRow, toCol] = connection.to.split(',').map(Number);

          const cellWidth = 100 / config.columns;
          const cellHeight = 100 / (config.rows + 1);

          const fromX = (fromCol * cellWidth) + (cellWidth / 2);
          const fromY = ((fromRow + 1) * cellHeight) + (cellHeight / 2);
          const toX = (toCol * cellWidth) + (cellWidth / 2);
          const toY = ((toRow + 1) * cellHeight) + (cellHeight / 2);

          const midX = (fromX + toX) / 2;
          const midY = (fromY + toY) / 2;

          const imageX = toX + (cellWidth / 2) - 2;
          const imageY = toY + (cellHeight / 2) - 2;

          const isAverageCell = connection.to === '7,4';
          const finalImageX = isAverageCell ? toX + (cellWidth / 2) + 5 : imageX;
          const finalImageY = isAverageCell ? toY + (cellHeight / 2) + 5 : imageY;

          const offset = 2;

          return (
            <g key={index}>
              <line
                x1={`${fromX}%`}
                y1={`${fromY}%`}
                x2={`${toX}%`}
                y2={`${toY}%`}
                stroke={`url(#gradient-${index})`}
                strokeWidth="4"
                strokeDasharray="10,6"
                opacity="0.9"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;-16"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>

              <circle
                cx={`${fromX}%`}
                cy={`${fromY}%`}
                r="6"
                fill="#667eea"
                opacity="0.9"
                filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                className="connection-ball"
              >
                <animate
                  attributeName="r"
                  values="6;8;6"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.9;1;0.9"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>



              {connection.type === 'average' && connection.to === '7,4' && (
                <g transform={`translate(${finalImageX}%, ${finalImageY}%)`} className="union-image">
                  <image
                    href="/logoGPTGmail.png"
                    x={`${toX - 6}%`}
                    y={`${toY - 6}%`}
                    width="12"
                    height="12"
                    opacity="0.9"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                    className="connection-ball"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill="white"
                    stroke="#667eea"
                    strokeWidth="2"
                    opacity="0.95"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                  />



                  <animate
                    attributeName="r"
                    values="12;14;12"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.95;1;0.95"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </g>
              )}

              {connection.type === 'average' && (
                <line
                  x1={`${fromX}%`}
                  y1={`${fromY}%`}
                  x2={`${toX}%`}
                  y2={`${toY}%`}
                  stroke="#667eea"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                  opacity="0.6"
                  filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-8"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </line>
              )}
            </g>
          );
        })}
      </svg>
    );
  };



  const getOperationName = () => {
    switch (selectedOperation) {
      case 'sum': return 'Suma';
      case 'subtract': return 'Resta';
      case 'multiply': return 'Multiplicación';
      case 'average': return 'Promedio';
      case 'percentage': return 'Porcentaje';
      case 'difference': return 'Diferencia';


      case 'min': return 'Mínimo';
      case 'max': return 'Máximo';
      case 'median': return 'Mediana';
      case 'mode': return 'Moda';
      case 'stddev': return 'Desviación estándar';
      case 'variance': return 'Varianza';
      case 'concat': return 'Concatenación';
      case 'matching': return 'Coincidencia de datos';

      default: return 'Suma';
    }
  };

  const getOperationDescription = () => {
    switch (selectedOperation) {
      case 'sum':
        return fn.sum
      case 'subtract':
        return fn.subtract
      case 'multiply':
        return fn.multiply
      case 'average':
        return fn.average
      case 'percentage':
        return fn.percentage
      case 'difference':
        return fn.difference
      case 'min':
        return fn.min
      case 'max':
        return fn.max
      case 'median':
        return fn.median
      case 'mode':
        return fn.mode
      case 'stddev':
        return fn.stddev
      case 'variance':
        return fn.variance
      case 'concat':
        return fn.concat
      case 'matching':
        return fn.matching
      default:
        return fn.sum
    }
  };

  const getSimulatedData = (rowIndex, colIndex) => {
    const allColumnData = [
      [150, 230, 180, 320, 190, 280, 210, 350],
      [120, 200, 160, 280, 170, 250, 190, 310],
      [80, 150, 120, 200, 140, 180, 160, 220],
      [200, 300, 250, 400, 280, 350, 320, 450],
      [90, 180, 140, 250, 160, 220, 190, 280],
      [110, 220, 170, 290, 200, 270, 240, 330]
    ];

    const columnIndices = getCurrentColumnIndices();

    const sourceAData = allColumnData[columnIndices.sourceA] || allColumnData[0];
    const sourceBData = allColumnData[columnIndices.sourceB] || allColumnData[1];

    const calculateResult = (val1, val2, operation) => {
      switch (operation) {
        case 'sum':
          return val1 + val2;
        case 'subtract':
          return val1 - val2;
        case 'multiply':
          return val1 * val2;
        case 'average':
          return Math.round((val1 + val2) / 2);
        case 'percentage':
          return Math.round((val2 / val1) * 100);
        case 'difference':
          return Math.abs(val1 - val2);
        case 'min':
          return Math.min(val1, val2);
        case 'max':
          return Math.max(val1, val2);
        case 'median':
          return Math.round((val1 + val2) / 2);
        case 'mode':
          return val1 === val2 ? val1 : 'N/A';
        case 'stddev':
          const mean = (val1 + val2) / 2;
          return Math.round(Math.sqrt(((val1 - mean) ** 2 + (val2 - mean) ** 2) / 2));
        case 'variance':
          const avg = (val1 + val2) / 2;
          return Math.round(((val1 - avg) ** 2 + (val2 - avg) ** 2) / 2);
        case 'concat':
          return `${val1}-${val2}`;
        case 'matching':
          return val1 === val2 ? 1 : 0;
        default:
          return val1 + val2;
      }
    };

    const newDataValues = sourceAData.map((val, idx) =>
      calculateResult(val, sourceBData[idx], selectedOperation)
    );

    const getColumnName = (index) => {
      const names = ['Productos', 'Servicios', 'Gastos', 'Ingresos', 'Costos', 'Utilidades'];
      return names[index] || `Columna ${indexToColumnLetter(index)}`;
    };

    switch (colIndex) {
      case 0:
        return loadingState === 'loading' ? null : (
          <div className="cell-data-container">
            <div className="cell-column-name">
              {getColumnName(columnIndices.sourceA)}
            </div>
            <div className="cell-value sourceA">${sourceAData[rowIndex]}</div>
          </div>
        );
      case 1:
        return loadingState === 'loading' ? null : (
          <div className="cell-data-container">
            <div className="cell-column-name">
              {getColumnName(columnIndices.sourceB)}
            </div>
            <div className="cell-value sourceB">${sourceBData[rowIndex]}</div>
          </div>
        );
      case 2:
        return loadingState === 'loading' ? null : (
          <div className="cell-data-container">
            <div className="cell-operation-formula">
              {columnMapping.sourceA} {getOperationSymbol()} {columnMapping.sourceB}
            </div>
            <div className="cell-operation-expression">
              {sourceAData[rowIndex]} {getOperationSymbol()} {sourceBData[rowIndex]}
            </div>
          </div>
        );
      case 3:
        return loadingState === 'loading' ? null : (
          <div className="cell-data-container">
            <div className="cell-result-target">
              → {columnMapping.target}
            </div>
            <div className="cell-result-value">
              ${newDataValues[rowIndex].toLocaleString()}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSkeletonContent = (rowIndex, colIndex) => {
    if (loadingState === 'loading') {
      const skeletonCount = colIndex >= 3 ? Math.floor(Math.random() * 3) + 2 : 1;
      return (
        <div className="skeleton-content">
          {Array.from({ length: skeletonCount }, (_, i) => (
            <div
              key={i}
              className="skeleton-line"
              style={{
                width: `${Math.random() * 40 + 60}%`,
                height: `${Math.random() * 4 + 8}px`,
                marginBottom: i < skeletonCount - 1 ? '4px' : '0'
              }}
            ></div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCell = (rowIndex, colIndex) => {
    const cellKey = `${rowIndex},${colIndex}`;
    const formula = config.formulas[cellKey];
    const simulatedData = getSimulatedData(rowIndex, colIndex);
    const columnIndices = getCurrentColumnIndices();

    return (
      <td
        key={`${rowIndex}-${colIndex}`}
        style={getCellStyle(rowIndex, colIndex)}
        onClick={() => handleCellClick(rowIndex, colIndex)}
        onMouseEnter={() => setHoveredCell(cellKey)}
        onMouseLeave={() => setHoveredCell(null)}
        data-formula={formula ? "true" : "false"}
        className={`table-cell ${formula ? 'formula-cell' : 'data-cell'}`}
      >
        {loadingState !== 'loading' && (colIndex === 0 || colIndex === 1) && (
          <div className={`column-indicator ${colIndex === 0 ? 'sourceA' : 'sourceB'}`}>
            {colIndex === 0 ? columnMapping.sourceA : columnMapping.sourceB}
          </div>
        )}

        {loadingState === 'loading' ? (
          renderSkeletonContent(rowIndex, colIndex)
        ) : formula ? (
          <div className="formula-content">
            <div className="formula-value">
              {simulatedData}
            </div>
          </div>
        ) : (
          <div className="cell-content">
            {simulatedData}
          </div>
        )}
      </td>
    );
  };

  return (
    <div className="table-skeleton-container">
      <div className="table-skeleton-header">

        <div className="header-controls">
          <div
            style={{
              marginBottom: '10px',
              // display: "none"
            }}
          >
            <button
              onClick={() => setShowColumnInputs(!showColumnInputs)}
              className={`column-config-btn ${showColumnInputs ? 'showing' : ''}`}
            >
              {showColumnInputs ? '✕ Ocultar' : '⚙️ Configurar Columnas'}
            </button>
            {showColumnInputs && (
              <div className="column-mapping-controls-container">
                <div className="column-mapping-controls">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label className="column-mapping-label">
                      Columnas:
                    </label>
                    <div className="column-mapping-inputs">
                      <input
                        type="text"
                        value={columnMapping.sourceA}
                        onChange={(e) => updateColumnMapping('sourceA', e.target.value)}
                        className={`column-mapping-input sourceA ${!isValidColumnLetter(columnMapping.sourceA) ? 'invalid' : ''}`}
                        maxLength={1}
                        placeholder="A"
                      />
                      <span className="column-mapping-separator">:</span>
                      <input
                        type="text"
                        value={columnMapping.sourceB}
                        onChange={(e) => updateColumnMapping('sourceB', e.target.value)}
                        className={`column-mapping-input sourceB ${!isValidColumnLetter(columnMapping.sourceB) ? 'invalid' : ''}`}
                        maxLength={1}
                        placeholder="B"
                      />
                      <span className="column-mapping-target">
                        → {columnMapping.target}
                      </span>
                    </div>
                  </div>

                  <div className="column-mapping-examples">
                    <span className="column-mapping-examples-label">Ejemplos:</span>
                    <button
                      onClick={() => setColumnMapping({ sourceA: 'A', sourceB: 'B', target: 'C' })}
                      className="column-mapping-example-btn blue"
                    >
                      A:B
                    </button>
                    <button
                      onClick={() => setColumnMapping({ sourceA: 'D', sourceB: 'C', target: 'E' })}
                      className="column-mapping-example-btn green"
                    >
                      D:C
                    </button>
                    <button
                      onClick={() => setColumnMapping({ sourceA: 'A', sourceB: 'F', target: 'D' })}
                      className="column-mapping-example-btn orange"
                    >
                      A:F
                    </button>
                  </div>
                </div>
                <div className="column-mapping-info">
                  Columnas disponibles: A (Productos), B (Servicios), C (Gastos), D (Ingresos), E (Costos), F (Utilidades)
                </div>
              </div>
            )}
          </div>


          <div
            // style={{ display: "none" }}
            className="operation-selector">
            <button
              onClick={() => setSelectedOperation('sum')}
              className={`operation-btn ${selectedOperation === 'sum' ? 'active' : ''} operation-sum`}
            >
              Suma
              <div
                onClick={() => setShowOperationPopup(true)}
              >
                i
              </div>
            </button>
            <button
              onClick={() => setSelectedOperation('subtract')}
              className={`operation-btn ${selectedOperation === 'subtract' ? 'active' : ''} operation-subtract`}
            >
              Resta
            </button>
            <button
              onClick={() => setSelectedOperation('multiply')}
              className={`operation-btn ${selectedOperation === 'multiply' ? 'active' : ''} operation-multiply`}
            >
              Multiplicación
            </button>
            <button
              onClick={() => setSelectedOperation('average')}
              className={`operation-btn ${selectedOperation === 'average' ? 'active' : ''} operation-average`}
            >
              Promedio
            </button>
            <button
              onClick={() => setSelectedOperation('percentage')}
              className={`operation-btn ${selectedOperation === 'percentage' ? 'active' : ''} operation-percentage`}
            >
              Porcentaje
            </button>
            <button
              onClick={() => setSelectedOperation('difference')}
              className={`operation-btn ${selectedOperation === 'difference' ? 'active' : ''} operation-difference`}
            >
              Diferencia
            </button>
            <button
              onClick={() => setSelectedOperation('min')}
              className={`operation-btn ${selectedOperation === 'min' ? 'active' : ''} operation-min`}
            >
              Mínimo
            </button>
            <button
              onClick={() => setSelectedOperation('max')}
              className={`operation-btn ${selectedOperation === 'max' ? 'active' : ''} operation-max`}
            >
              Máximo
            </button>
            <button
              onClick={() => setSelectedOperation('median')}
              className={`operation-btn ${selectedOperation === 'median' ? 'active' : ''} operation-median`}
            >
              Mediana
            </button>
            <button
              onClick={() => setSelectedOperation('mode')}
              className={`operation-btn ${selectedOperation === 'mode' ? 'active' : ''} operation-mode`}
            >
              Moda
            </button>
            <button
              onClick={() => setSelectedOperation('stddev')}
              className={`operation-btn ${selectedOperation === 'stddev' ? 'active' : ''} operation-stddev`}
            >
              Desviación estándar
            </button>
            <button
              onClick={() => setSelectedOperation('variance')}
              className={`operation-btn ${selectedOperation === 'variance' ? 'active' : ''} operation-variance`}
            >
              Varianza
            </button>
            <button
              onClick={() => setSelectedOperation('concat')}
              className={`operation-btn ${selectedOperation === 'concat' ? 'active' : ''} operation-concat`}
            >
              Concatenación
            </button>
            <button
              onClick={() => setSelectedOperation('matching')}
              className={`operation-btn ${selectedOperation === 'matching' ? 'active' : ''} operation-matching`}
            >
              Coincidencia de datos
            </button>
          </div>
          <div className="loading-indicator">
            {loadingState === 'loading' && (
              <div className="loading-spinner"></div>
            )}
          </div>
        </div>
      </div>

      <div>
        Crear una nueva columna nueva

        Crar una nueva tabla
      </div>

      <div className="table-wrapper">
        {renderConnectionLines()}
        <div className="table-skeleton-body">
          <table className="table-skeleton">
            <thead>
              <tr>
                {config.headers.map((header, index) => {
                  const columnIndices = getCurrentColumnIndices();
                  const getColumnName = (colIndex) => {
                    const names = ['Productos', 'Servicios', 'Gastos', 'Ingresos', 'Costos', 'Utilidades'];
                    return names[colIndex] || `Columna ${indexToColumnLetter(colIndex)}`;
                  };

                  let headerText = header;
                  let headerClass = '';

                  if (index === 0) {
                    headerText = getColumnName(columnIndices.sourceA);
                    headerClass = 'sourceA';
                  } else if (index === 1) {
                    headerText = getColumnName(columnIndices.sourceB);
                    headerClass = 'sourceB';
                  } else if (index === 2) {
                    headerText = 'Operación';
                    headerClass = 'operation';
                  } else if (index === 3) {
                    headerText = getOperationName();
                    headerClass = 'result';
                  }

                  return (
                    <th key={index} className="skeleton-header">
                      <div className="header-content">
                        {loadingState === 'loading' ? (
                          <div className="skeleton-line" style={{ width: '80%', height: '16px' }}></div>
                        ) : (
                          <div className={`dynamic-header ${headerClass}`}>
                            <div className={`header-column-badge ${headerClass} ${(index === 0 && !isValidColumnLetter(columnMapping.sourceA)) ||
                              (index === 1 && !isValidColumnLetter(columnMapping.sourceB)) ? 'invalid' : ''
                              }`}>
                              {index === 0 ? columnMapping.sourceA :
                                index === 1 ? columnMapping.sourceB :
                                  index === 2 ? 'OP' :
                                    index === 3 ? `→ ${columnMapping.target}` : ''}
                            </div>

                            <div className="header-column-name">
                              {headerText}
                            </div>

                            {index === 2 && (
                              <div className="header-operation-formula">
                                {columnMapping.sourceA} {getOperationSymbol()} {columnMapping.sourceB}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: config.rows }, (_, rowIndex) => (
                <tr key={rowIndex} className={`table-row ${rowIndex % 2 === 0 ? 'even' : 'odd'}`}>
                  {Array.from({ length: config.columns }, (_, colIndex) =>
                    renderCell(rowIndex, colIndex)
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showOperationPopup && (
        <div
          className="operation-popup-overlay"
          onClick={() => setShowOperationPopup(false)}
        >
          <div
            className="operation-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="operation-popup-header">
              <h2>📊 {getOperationName().toUpperCase()} - GUÍA COMPLETA</h2>
              <button
                className="operation-popup-close"
                onClick={() => setShowOperationPopup(false)}
              >
                ✕
              </button>
            </div>
            <div className="operation-popup-body">
              <div className="operation-popup-description">
                {getOperationDescription().long}
              </div>
            </div>
            <div className="operation-popup-footer">
              <button
                className="operation-popup-close-btn"
                onClick={() => setShowOperationPopup(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TableSkeleton; 