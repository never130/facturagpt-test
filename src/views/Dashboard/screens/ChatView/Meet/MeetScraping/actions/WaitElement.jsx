import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const WaitElement = () => {
  return (
    <div>
      <ActionHeader
        title={"Esperar Elemento"}
        description={"Esperar a que aparezca un elemento"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"wait_element_name"}
        placeholder={"Esperar Elemento"}
      />

      <Input
        label={"Selector CSS"}
        name={"wait_element_selector"}
        placeholder={"#loading, modal, button [disabled]"}
      />

      <Checklist
        label={"Esperar que aparezca"}
        name={"wait_element_appear"}
        options={["Si", "No"]}
      />

      <Input
        label={"Tiempo máximo (ms)"}
        name={"wait_element_timeout"}
        placeholder={"10000"}
      />

      <Input
        label={"Texto esperado (opcional)"}
        name={"wait_element_text"}
        placeholder={"Texto específico a esperar..."}
      />

      <Input
        label={"Timeout (ms)"}
        name={"wait_element_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default WaitElement;