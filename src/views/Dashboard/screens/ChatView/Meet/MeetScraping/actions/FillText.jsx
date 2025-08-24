import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const FillText = () => {
  return (
    <div>
      <ActionHeader 
        title={"Rellenar Texto"}
        description={"Rellenar un campo de texto"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"fill_text_name"}
        placeholder={"Rellenar Texto"}
      />

      <Input
        label={"Selector CSS"}
        name={"fill_text_selector"}
        placeholder={"#input-id, input [name='search'], .form-input"}
      />

      <Input
        label={"Texto a escribir"}
        name={"fill_text_value"}
        placeholder={"Texto que escribirá el agente..."}
      />

      <Checklist
        label={"Limpiar campo"}
        name={"fill_text_clear"}
        options={["Si", "No"]}
      />

      <Input
        label={"Velocidad de escritura (ms)"}
        name={"fill_text_speed"}
        placeholder={"1000"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"fill_text_timeout"}
        placeholder={"10000"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"fill_text_timeout"}
        placeholder={"10000"}
      />
    </div>
  );
};

export default FillText;