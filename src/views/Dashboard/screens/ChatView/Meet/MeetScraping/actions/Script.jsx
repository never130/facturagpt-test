import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';
import { CharCodes } from 'pdf-lib';


const Script = () => {
  return (
    <div>
      <ActionHeader
        title={"Ejecutar JavaScript"}
        description={"Ejecutar JavaScript en la página"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"script_name"}
        placeholder={"Ejecutar JavaScript"}
      />

      <Input
        label={"Código JavaScript"}
        name={"script_code"}
        placeholder={"document.title; window.scrollTo(0, 0); return 'Hola mundo';"}
      />

      <p>
        Use 'return' para devolver un valor que se guardará en una variable
      </p>

      <Input
        label={"Variable para resultado (opcional)"}
        name={"script_variable"}
        options={["Si", "No"]}
      />

      <Checklist
        label={"Ejecutar de forma asincrona"}
        name={"script_async"}
        options={["Esperar resultado", "No"]}
      />

      <Input
        label={"Timeout (ms)"}
        name={"script_timeout"}
        placeholder={"10000"}
      />


    </div>
  );
};

export default Script;