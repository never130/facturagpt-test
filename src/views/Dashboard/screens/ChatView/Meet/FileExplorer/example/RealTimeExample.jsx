import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const RealTimeExample = () => {
  const appFiles = useSelector(state => state.docs.app.files);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    setLastUpdate(new Date());
  }, [appFiles]);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
        ⚡ Actualización en Tiempo Real
      </h1>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '16px', 
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
          📁 Archivos en el Proyecto
        </h3>
        <div style={{ fontSize: '14px' }}>
          {Object.keys(appFiles).length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {Object.keys(appFiles).map((filePath, index) => (
                <li key={index} style={{ marginBottom: '4px' }}>
                  <code style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {filePath}
                  </code>
                  <span style={{ fontSize: '12px', opacity: 0.8 }}>
                    {' '}({appFiles[filePath].length} caracteres)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, opacity: 0.8 }}>
              No hay archivos cargados aún
            </p>
          )}
        </div>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '16px', 
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
          🔄 Estado de Sincronización
        </h3>
        <div style={{ fontSize: '14px' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Última actualización:</strong> {lastUpdate.toLocaleTimeString()}
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Archivos sincronizados:</strong> {Object.keys(appFiles).length}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Estado:</strong> 
            <span style={{ 
              color: '#4ade80', 
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>
              ✅ Conectado y sincronizando
            </span>
          </p>
        </div>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '16px', 
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
          💡 Cómo Funciona
        </h3>
        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            1. <strong>Edita cualquier archivo</strong> en el Monaco Editor
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            2. <strong>Los cambios se reflejan inmediatamente</strong> en Redux
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            3. <strong>El preview se actualiza automáticamente</strong> con los cambios
          </p>
          <p style={{ margin: 0 }}>
            4. <strong>Los cambios se sincronizan con el backend</strong> después de 1 segundo
          </p>
        </div>
      </div>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '8px',
        fontSize: '12px',
        opacity: 0.8
      }}>
        <p style={{ margin: 0 }}>
          <strong>🔄 Auto-update habilitado</strong> - Los cambios se propagan en tiempo real a todos los componentes conectados
        </p>
      </div>
    </div>
  );
};

export default RealTimeExample; 