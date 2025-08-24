import React from 'react';
import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


  const WaitTime = () => {
  return (
    <div>
      <ActionHeader
        title={"Esperar Tiempo"}
        description={"Pausa fija en milisegundos"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"wait_time_name"}
        placeholder={"Esperar Tiempo"}
        />
    </div>
  );
};

export default WaitTime;