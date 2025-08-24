import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';

  const Data = () => {
  return (
    <div>

      <ActionHeader
        icon={<Icon />}
        title={'Data'}
        subtitle={'Guardar datos en un archivo'}
      />
      <Input
        title={'Nombre de la acción'}
        placeholder={'Guardar Datos'}
      />
      <Select
        title={'Formato del archivo'}
        placeholder={'JSON'}
      />
      <Input
        title={'Nombre del documento'}
        placeholder={'Documento'}
      />
      <Checklist
        title={'Variables a incluir'}
        placeholder={'variable'}
      />

      <Input
        title={'Timeout (ms)'}
        value={10000}
      />

Nombre de la acción
Guardar Datos
Formato del archivo
JSON
CSV
Excel
XML
Texto plano
Nombre del documento
Título del documento
Variables a incluir
variable
variable
Buscar variables
Incluir todas
Incluir Timestamp
Comprimir archivo
Timeout (ms)
10000

    </div>
  );
};

export default Data;