import React from 'react';
import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const Radio = () => {
  return (
    <div>
      <ActionHeader 
        title={"Seleccionar Radio"}
        description={"Seleccionar un radio button"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"radio_name"}
        placeholder={"Seleccionar Radio"}
      />

      <Input
        label={"Selector CSS"}
        name={"radio_selector"}
        placeholder={"input[type='radio'] [name='payment']"}
      />

      <Input
        label={"Valor a seleccionar"}
        name={"radio_value"}
        placeholder={"credit_card, paypal, cash"}
      />

      <Checklist
        label={"Seleccionar por etiqueta"}
        name={"radio_label"}
        placeholder={"credit_card, paypal, cash"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"radio_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default Radio;
