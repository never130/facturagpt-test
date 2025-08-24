import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


const DoClick = () => {
  return (
    <div> 
      <ActionHeader
        icon={<Icon />}
        title={'DoClick'}
        subtitle={'Hacer clic en un elemento'}
      />
      <Input
        title={'Nombre de la acción'}
        placeholder={'Hacer clic'}
      />
      <Input
        title={'Selector CSS'}
        placeholder={'input[type="checkbox"][name="accept"]'}
      />
      <div>
        Presiona F12
        en el navegador y usa el inspector para encontrar 
        selectores CSS.
      </div>
      <Checklist  
        title={'Tipo de clic'}
        placeholder={'Hacer clic'}
      />
      <Input
        title={'Timeout (ms)'}
        value={10000}
      />
      <Input
        title={'Reintentos'}
        value={10000}
      />

    </div>
  );
};

export default DoClick;