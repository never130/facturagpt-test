import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


const Screen = () => {
  return (
    <div>
      <ActionHeader
        title={"Captura de pantalla"}
        description={"Capturar una imagen de la página"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"screen_name"}
        placeholder={"Captura de pantalla"}
      />

      <Input
        label={"Nombre del archivo"}
        name={"screen_file"}
        placeholder={"Nombre del archivo de imagen (sin extensión)"}
      />

      <Input
        label={"Selector CSS (opcional)"}
        name={"screen_selector"}
        placeholder={".content, #main (vacío para página completa)"}
      />

      <Checklist
        label={"Página completa"}
        name={"screen_full"}
        options={["Si", "No"]}
      />

      <Input
        label={"Ocultar elementos"}
        name={"screen_hide"}
        placeholder={".ad, .popup, .cookie-banner"}
      />
      

      <Select
        label={"Formato"}
        name={"screen_format"}
        options={["PNG", "JPG", "PDF"]}
      />
      

      <Select
        label={"Seleccionar ubicación"}
        name={"screen_location"}
        options={["Añadir como variable", "Ubicación de cuenta"]}
      />

      <Input
        label={"Ubicación de cuenta"}
        name={"screen_location"}
        placeholder={"/NombredelaCuenta"}
      />

      <Input
        label={"Retraso (ms)"}
        name={"screen_delay"}
        placeholder={"10000"}
      />

      <Input
        label={"Timeout (ms)"}  
        name={"screen_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default Screen;