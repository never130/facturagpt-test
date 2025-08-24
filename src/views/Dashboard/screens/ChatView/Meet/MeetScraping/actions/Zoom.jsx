import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


const Zoom = () => {
  return (
    <div>
      <ActionHeader
        title={"Zoom"}
        subtitle={"Ampliar o reducir zoom de página"}
      />
      <Input
        label={"Nombre de la acción"}
        name={"zoom_name"}
        placeholder={"Zoom"}
      />
      <Select
        label={"Acción del zoom"}
        name={"zoom_action"}
        options={["Establecer nivel", "Ampliar zoom", "Reducir zoom", "Resetear (100%)"]}
      />
      <Input
      label={"Nivel de Zoom"}
      name={"zoom_level"}
      placeholder={"100%"}
      />
      <Checklist
      label={"Esperar después"}
      name={"zoom_wait"}
      options={["500", "1000", "2000", "5000", "10000"]}
      />
      <Input
        label={"Esperar después (ms)"}
        name={"zoom_wait_ms"}
        placeholder={"500"}
      />
      <Input
        label={"Timeout (ms)"}
        name={"zoom_timeout"}
        placeholder={"10000"}
      />
    
    </div>
  );
};

export default Zoom;