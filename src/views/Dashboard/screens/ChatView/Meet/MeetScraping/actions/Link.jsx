import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const Link = () => {
  return (
    <div> 
      <ActionHeader
        title={"Extraer Enlaces"}
        description={"Extraer enlaces de la página"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"link_name"}
        placeholder={"Extraer Enlaces"}
      />

      <Input
        label={"Selector CSS"}
        name={"link_selector"}
        placeholder={"a"}
      />

      <Select
        label={"Variable destino"}
        name={"link_variable"}
        options={["Si", "No"]}
      />

      <Select
        label={"Filtrar dominios"}
        name={"link_filter"}
        options={["Si", "No"]}
      />

      <Input
        label={"URL absolutas"}
        name={"link_absolute"}
        placeholder={"example.com, subdomain.example.com"}
      />

      <Checklist
        label={"Excluir enlaces externos"}
        name={"link_external"}
        options={["Si", "No"]}
      />

      <Input
        label={"Incluir texto"}
        name={"link_text"}
        placeholder={"Si"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"link_timeout"}
        placeholder={"10000"}
      />
    </div>
  );
};

export default Link;