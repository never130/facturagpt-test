import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const Reload = () => {
  return (
    <div>
      <ActionHeader
        title={"Recargar"}
        description={"Recargar la página"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"reload_name"}
        placeholder={"Recargar"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"reload_timeout"}
        placeholder={"10000"}
      />
    </div>
  );
};

export default Reload;