import React from 'react';
import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


  const ValidateText = () => {
  return (
    <div>
      <ActionHeader
        title={"Validar Texto"}
        description={"Validar que un texto esté presente en el elemento"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"validate_text_name"}
        placeholder={"Validar Texto"}
      />

      <Input
        label={"Selector CSS"}
        name={"validate_text_selector"}
        placeholder={".success-message, #status, h1"}
      />

      <Input
        label={"Texto esperado"}
        name={"validate_text_expected"}
        placeholder={"El texto que debe estar presente en el elemento"}
      />

      <Checklist
        label={"Operación completada con éxito"}
        name={"validate_text_success"}
        options={["Si", "No"]}
      />

      <Input
        label={"Formato Regex"}
        name={"validate_text_regex"}
        placeholder={"/[0-9]+/g, A$[\d,]+/"}
      />

      <Checklist  
        label={"Sensible a mayúsculas"}
        name={"validate_text_case"}
        options={["Si", "No"]}
      />

      <Input
        label={"Timeout (ms)"}
        name={"validate_text_timeout"}
        placeholder={"5000"}
      />

    </div>
  );
};


export default ValidateText;