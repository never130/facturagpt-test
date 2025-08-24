import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


  const Text = () => {
  return (
    <div>
      <ActionHeader
        title={"Extraer Texto"}
        description={"Extraer texto de un elemento"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"text_name"}
        placeholder={"Extraer Texto"}
      />

      <Input
        label={"Selector CSS"}
        name={"text_selector"}
        placeholder={"Iprice, h1.title, .product-name"}
      />

      <Select
        label={"Variable destino"}
        name={"text_variable"}
        options={["Si", "No"]}
      />

      <Select
        label={"Atributo a extraer"}
        name={"text_attribute"}
        options={["Texto del elemento", "HTML interno", "Enlace (href)", "Imagen (src)", "Título", "Texto alternativo"]}
      />

      <Checklist
        label={"Múltiples elementos"}
        name={"text_multiple"}
        options={["Si", "No"]}
      />

      <Input
        label={"Expresión regular (opcional)"}
        name={"text_regex"}
        placeholder={"/[0-9]+/g, A$[\d,]+/"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"text_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default Text;
  