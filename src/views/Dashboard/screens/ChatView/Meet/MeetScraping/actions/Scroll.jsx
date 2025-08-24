import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const Scroll = () => {
  return (
    <div>

      <ActionHeader
        title={"Hacer Scroll"}
        description={"Desplazar la página hacia abajo"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"scroll_name"}
        placeholder={"Hacer Scroll"}
      />

      <Input
        label={"Cantidad (px)"}
        name={"scroll_amount"}
        placeholder={"500"}
      />

      <Input
        label={"Hacia elemento (opcional)"}
        name={"scroll_element"}
        placeholder={"#target-element, footer"}
      />

      <Input
        label={"Tiempo máximo (ms)"}
        name={"scroll_timeout"}
        placeholder={"10000"}
      />

      <Checklist
        label={"Desplazamiento suave"}
        name={"scroll_smooth"}
        options={["Si", "No"]}
      />

      <Select
        label={"Velocidad"}
        name={"scroll_speed"}
        options={["Lento", "Medio", "Rápido"]}
      />

      <Input
        label={"Timeout (ms)"}
        name={"scroll_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default Scroll;