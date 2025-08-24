import React, { useState } from "react";
import RelationshipsFormulas from "./RelationshipsFormulas";

// Componente de prueba para verificar la funcionalidad
const TestComponent = () => {
  const [testData, setTestData] = useState({
    oneToOneSelectedOption: "length",
    relationships: {
      level: 1,
      selectedOption: "length",
      children: []
    }
  });

  const handleTestChange = (change) => {
    console.log("Test - Cambio detectado:", change);
    
    if (change.name === "relationships") {
      setTestData(prev => ({
        ...prev,
        relationships: change.newValue
      }));
    } else {
      setTestData(prev => ({
        ...prev,
        [change.name]: change.newValue
      }));
    }
  };

  const resetData = () => {
    setTestData({
      oneToOneSelectedOption: "length",
      relationships: {
        level: 1,
        selectedOption: "length",
        children: []
      }
    });
  };

  const addSampleData = () => {
    setTestData({
      oneToOneSelectedOption: "length",
      relationships: {
        level: 1,
        selectedOption: "length",
        children: [
          {
            level: 2,
            selectedOption: "weight",
            children: [
              {
                level: 3,
                selectedOption: "time",
                children: []
              }
            ]
          }
        ]
      }
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Prueba del Sistema de Relaciones Anidadas</h1>
      
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button 
          onClick={resetData}
          style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Resetear Datos
        </button>
        <button 
          onClick={addSampleData}
          style={{ padding: "8px 16px", backgroundColor: "#10A37F", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Agregar Datos de Ejemplo
        </button>
      </div>
      
      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f0f9ff", borderRadius: "8px", border: "1px solid #0ea5e9" }}>
        <h3>Instrucciones de Uso:</h3>
        <ul>
          <li>Haz clic en el botón <strong>+</strong> de cualquier relación para crear una relación del siguiente nivel</li>
          <li>Haz clic en el botón <strong>×</strong> para eliminar relaciones (excepto las de primer nivel)</li>
          <li>Haz clic en "Agregar relación" al final para crear más relaciones de primer nivel</li>
          <li>Observa cómo cambian los estilos visuales según el nivel de anidación</li>
        </ul>
      </div>
      
      <RelationshipsFormulas 
        parameterData={testData}
        handleChange={handleTestChange}
      />
      
      <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <h3>Estado Actual de las Relaciones:</h3>
        <pre style={{ fontSize: "12px", overflow: "auto", backgroundColor: "#f1f5f9", padding: "15px", borderRadius: "4px" }}>
          {JSON.stringify(testData.relationships, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fef3c7", borderRadius: "8px", border: "1px solid #f59e0b" }}>
        <h4>Notas de la Prueba:</h4>
        <ul>
          <li>El componente mantiene la compatibilidad con el sistema existente</li>
          <li>Los datos se sincronizan automáticamente con el estado padre</li>
          <li>Cada nivel tiene estilos visuales distintivos</li>
          <li>El sistema es completamente recursivo y puede manejar múltiples niveles</li>
        </ul>
      </div>
    </div>
  );
};

export default TestComponent;
