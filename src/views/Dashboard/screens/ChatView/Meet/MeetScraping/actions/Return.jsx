import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

const Return = () => {
  return (
    <div>
      <ActionHeader
        title={"Retroceder"}
        description={"Retroceder a la página anterior"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"return_name"}
        placeholder={"Retroceder"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"return_timeout"}
        placeholder={"10000"}
      />

    </div>
  );
};

export default Return;