import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


  const ValidateElement = () => {
  return (
    <div>
      <ActionHeader
        title={"Validar Elemento"}
        description={"Validar que un elemento esté presente en la página"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"validate_element_name"}
        placeholder={"Validar Elemento"}
      />

      <Input
        label={"Selector CSS"}
        name={"validate_element_selector"}
        placeholder={"success-icon, #confirmation, button[disabled]"}
      />

      <Input
        label={"Cantidad exacta"}
        name={"validate_element_exact"}
        placeholder={"5"}
      />

      <Input
        label={"Número mínimo de elementos esperados"}
        name={"validate_element_min"}
        placeholder={"5"}
      />

      <Checklist
        label={"Debe ser visible"}
        name={"validate_element_visible"}
        options={["Si", "No"]}
      />
      

      <Input
        label={"Timeout (ms)"}
        name={"validate_element_timeout"}
        placeholder={"5000"}
      />

    
    </div>
  );
};

export default ValidateElement;