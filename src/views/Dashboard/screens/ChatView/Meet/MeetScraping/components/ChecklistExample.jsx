import React from 'react';
import Checklist from './checklist';

const ChecklistExample = () => {
  // Datos que coinciden con tu imagen
  const estadoDeseadoItems = [
    { id: 'marcado', text: 'Marcado' },
    { id: 'desmarcado', text: 'Desmarcado' },
    { id: 'forzar_cambio', text: 'Forzar cambio' },
    { id: 'verificar_estado', text: 'Verificar estado' }
  ];

  const handleChecklistChange = (selectedItems) => {
    console.log('Items seleccionados:', selectedItems);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      {/* Ejemplo como en tu imagen - permite múltiples selecciones (checkbox) */}
      <Checklist
        title="Estado deseado"
        items={estadoDeseadoItems}
        allowMultiple={true}
        onChange={handleChecklistChange}
      />

      <div style={{ marginTop: '30px' }}>
        {/* Ejemplo con radio buttons (solo una selección) */}
        <Checklist
          title="Selecciona una opción"
          items={[
            { id: 'opcion1', text: 'Opción 1' },
            { id: 'opcion2', text: 'Opción 2' },
            { id: 'opcion3', text: 'Opción 3' }
          ]}
          allowMultiple={false}
          onChange={handleChecklistChange}
        />
      </div>
    </div>
  );
};

export default ChecklistExample;
