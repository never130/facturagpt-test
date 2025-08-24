import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


const UploadFile = () => {
  return (
    <div>

      <ActionHeader
        title={"Subir Archivo"}
        description={"Subir un archivo a la página"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"upload_file_name"}
        placeholder={"Subir Archivo"}
      />

      <Input
        label={"Selector CSS"}
        name={"upload_file_selector"}
        placeholder={"input[type='file'], #file-upload"}
      />

      <Input
        label={"Ruta del documento"}
        name={"upload_file_path"}
        placeholder={"/NombredelaCuenta"}
      />

      <Checklist
        label={"Tipo de archivo"}
        name={"upload_file_location"}
        options={["PDF", "JPG", "PNG", "DOC", "DOCX"]}
      />

      <Input
        label={"Tamaño máximo (MB)"}
        name={"upload_file_size"}
        placeholder={"10"}
      />

      <Checklist
        label={"Múltiples archivos"}
        name={"upload_file_multiple"}
        options={["Si", "No"]}
      />

      <Input
        label={"Timeout (ms)"}
        name={"upload_file_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default UploadFile;