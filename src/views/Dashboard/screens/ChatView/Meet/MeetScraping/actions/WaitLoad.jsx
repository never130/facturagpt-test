import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


  const WaitLoad = () => {
  return (
    <div>
      <ActionHeader
        title={"Esperar Carga"}
        description={"Esperar que cargue completamente la página"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"wait_time_name"}
        placeholder={"Esperar a cargar"}
        />
    </div>
  );
};

export default WaitLoad;