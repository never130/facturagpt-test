import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


const Source = () => {
  return (
    <div>
      <ActionHeader
        title={"Fuente"}
        description={"Navegar a una página web específica"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"source_name"}
        placeholder={"Abrir URL o PDF"}
      />

      <Input
        label={"URL"}
        name={"source_url"}
        placeholder={"https://www.google.com"}
      />

      <Upload
        label={"PDF"}
        name={"source_pdf"}
        placeholder={"PDF"}
      />

      <Checklist
        label={"Tipo de fuente"}
        name={"source_type"}
        options={["Abrir en una nueva pestaña", "Esperar carga"]}
      />

      <Select
        label={"Abrir una nueva pestaña"}
        name={"source_new_tab"}
        options={["Desktop", "Tablet", "Mobile"]}
      />
      
      <Input
        label={"User Agent (opcional)"}
        name={"source_user_agent"}
        placeholder={"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
      />
      
      <Input
        label={"Timeout (ms)"}
        name={"source_timeout"}
        placeholder={"10000"}
      />
      
      

    </div>
  );
};

export default Source;