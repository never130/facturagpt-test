import React from 'react';
import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const OnMouse = () => {
  return (
    <div>
      <ActionHeader 
        title={"Pasar Ratón"}
        description={"Pasar el ratón sobre un elemento"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"on_mouse_name"}
        placeholder={"Pasar Ratón"}
      />

      <Input
        label={"Elemento origen"}
        name={"on_mouse_element"}
        placeholder={".menu-item, #dropdown-trigger"}
      />

      <Input
        label={"Duración (ms)"}
        name={"on_mouse_duration"}
        placeholder={"1000"}
      />

      <Checklist
        label={"Movimiento lento"}
        name={"on_mouse_slow"}
        options={["Si", "No"]}
      />

      <Checklist
        label={"Esperar que sea visible"}
        name={"on_mouse_visible"}
        options={["Si", "No"]}
      />

      <Checklist
        label={"Clic después"}
        name={"on_mouse_click"}
        options={["Si", "No"]}
      />

      <Input
        label={"Timeout (ms)"}
        name={"on_mouse_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default OnMouse;