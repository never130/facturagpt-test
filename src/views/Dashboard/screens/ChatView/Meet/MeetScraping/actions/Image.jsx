import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';



const Image = () => {
  return (
    <div>
      <ActionHeader
        title={"Extraer Imágenes"}
        description={"Extraer imágenes de la página"}
      />

      <Input
        label={"Selector CSS"}
        name={"image_selector"}
        placeholder={"img"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"image_name"}
        placeholder={"Extraer Imágenes"}
      />

      <Input
        label={"Ancho (px)"}
        name={"image_width"}
        placeholder={"0"}
      />

      <Input
        label={"Alto (px)"}
        name={"image_height"}
        placeholder={"0"}
      />

      <Input
        label={"Incluir texto alt"}
        name={"image_alt"}
        placeholder={"Si"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"image_timeout"}
        placeholder={"10000"}
      />

    </div>
  );  

};

export default Image;