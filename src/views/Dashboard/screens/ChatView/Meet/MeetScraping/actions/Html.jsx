import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const Html = () => {
  return (
    <div>
      <ActionHeader 
        title={"Captura HTML"}
        description={"Capturar el HTML de la página"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"html_name"}
        placeholder={"Captura HTML"}
      />

      <Input
        label={"Selector CSS (opcional)"}
        name={"html_selector"}
        placeholder={".content, #main, article (vacío para página completa)"}
      />

      <Select
        label={"Variable destino"}
        name={"html_variable"}
        options={["Si", "No"]}
      />

      <Checklist
        label={"Página completa"}
        name={"html_full"}
        options={["Si", "No"]}
      />

      <Checklist
        label={"Minificar HTML"}
        name={"html_minify"}
        options={["Si", "No"]}
      />

      <Checklist
        label={"Remover estilos CSS"}
        name={"html_css"}
        options={["Si", "No"]}
      />

      <Checklist
        label={"HTML externo"}
        name={"html_external"}
        options={["Si", "No"]}
      />

      <Checklist
        label={"Remover scripts"}
        name={"html_scripts"}
        options={["Si", "No"]}
      />

    </div>
  );
};

export default Html;