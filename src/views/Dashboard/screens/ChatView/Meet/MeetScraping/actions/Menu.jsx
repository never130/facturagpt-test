import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const Menu = () => {
  return      (
    <div>
      <ActionHeader
        title={"Seleccionar en Menú"}
        description={"Seleccionar una opción en un menú"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"menu_name"}
        placeholder={"Seleccionar en Menú"}
        description={"Nombre de la acción"}
      />

      <Input
        label={"Selector CSS"}
        name={"menu_selector"}
        placeholder={"select [name='options'], dropdown-select"}
      />

      <Input
        label={"Valor a seleccionar"}
        name={"menu_value"}
        placeholder={"España, value=ES, index=2"}
      />

      <Select
        label={"Método de selección"}
        name={"menu_method"}
        options={["Por texto visible", "Por valor HTML", "Por índice (posición)"]}
      />

      <Checklist
        label={"Esperar opciones"}
        name={"menu_wait"}
        options={["Si", "No"]}
      />

      <Input
        label={"Timeout (ms)"}
        name={"menu_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default Menu;