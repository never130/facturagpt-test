import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

  const Drag = () => {
  return (
    <div>
      <ActionHeader   
        title={"Arrastrar y Soltar"}
        description={"Arrastrar y soltar un elemento"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"drag_name"}
        placeholder={"Arrastrar y Soltar"}
      />

      <Input
        label={"Elemento origen"}
        name={"drag_source"}
        placeholder={"draggable-item, #source-element"}
      />

      <Input
        label={"Selector del elemento a arrastrar"}
        name={"drag_source_selector"}
        placeholder={"draggable-item, #source-element"}
      />

      <Input
        label={"Elemento destino"}
        name={"drag_target"}
        placeholder={"draggable-item, #target-element"}
      />

      <Input
        label={"Selector del elemento donde soltar"}
        name={"drag_target_selector"}
        placeholder={"draggable-item, #target-element"}
      />

      <Input
        label={"Movimiento suave"}
        name={"drag_smooth"}
        options={["Si", "No"]}
      />

      <Input
        label={"Esperar a soltar"}
        name={"drag_wait"}
        options={["Si", "No"]}
      />

      <Input
        label={"Offset X (px)"}
        name={"drag_offset_x"}
        placeholder={"0"}
      />

      <Input
        label={"Offset Y (px)"}
        name={"drag_offset_y"}
        placeholder={"0"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"drag_timeout"}
        placeholder={"10000"}
      />
    </div>
  );
};

export default Drag;











