import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


const Table = () => {
  return (
    <div>
      <ActionHeader
        title={"Extraer Tabla"}
        description={"Extraer datos de una tabla"}
      />

      <Input
        label={"Nombre de la acción"}
        name={"table_name"}
        placeholder={"Extraer Tabla"}
      />

      <Input
        label={"Selector CSS"}
        name={"table_selector"}
        placeholder={"table"}
      />

      <Select
        label={"Variable destino"}
        name={"table_variable"}
        options={["Si", "No"]}
      />

      <Select
        label={"Formato de datos"}
        name={"table_format"}
        options={["Tabla", "CSV", "JSON"]}
      />


      <div>
        <Input
          label={"Columnas"}
          name={"table_columns"}
          placeholder={"0"}
        />

        <Input
          label={"Filas"}
          name={"table_rows"}
          placeholder={"0"}
        />

      </div>

      <Checklist
        label={"Omitir filas o columnas vacías"}
        name={"table_empty"}
        options={["Si", "No"]}
      />

      <Input
        label={"Límite de filas a extraer"}
        name={"table_limit"}
        placeholder={"0"}
      />

    </div>
  );
};

export default Table;