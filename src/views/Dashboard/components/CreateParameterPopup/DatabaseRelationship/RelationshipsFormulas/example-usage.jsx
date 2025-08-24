import React, { useState } from "react";
import RelationshipsFormulas from "./RelationshipsFormulas";

// Ejemplo de uso del componente RelationshipsFormulas
const ExampleUsage = () => {
  // Estado inicial con relaciones anidadas de ejemplo
  const [parameterData, setParameterData] = useState({
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
              children: [
                {
                  level: 4,
                  selectedOption: "speed",
                  children: []
                }
              ]
            },
            {
              level: 3,
              selectedOption: "volumen",
              children: []
            }
          ]
        },
        {
          level: 2,
          selectedOption: "temperature",
          children: [
            {
              level: 3,
              selectedOption: "pressure",
              children: []
            }
          ]
        }
      ]
    }
  });

  const handleChange = (change) => {
    console.log("Cambio detectado:", change);
    
    setParameterData(prev => ({
      ...prev,
      [change.name]: change.newValue
    }));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2>Ejemplo de Relaciones Anidadas</h2>
      <p>
        Este es un ejemplo de cómo se ve el componente con relaciones anidadas predefinidas.
        Puedes hacer clic en los botones + para agregar más niveles de relaciones.
      </p>
      
      <RelationshipsFormulas 
        parameterData={parameterData}
        handleChange={handleChange}
      />
      
      <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <h3>Estado Actual de las Relaciones:</h3>
        <pre style={{ fontSize: "12px", overflow: "auto" }}>
          {JSON.stringify(parameterData.relationships, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ExampleUsage;
