import React from 'react';

import Input from '../components/input';
import Select from '../components/select';
import Upload from '../components/upload';
import ActionHeader from '../components/actionHeader';
import Checklist from '../components/checklist';


  const WebHook = () => {
  return (
    <div>

      <ActionHeader
        title={"Enviar Webhook"}
        description={"Enviar datos a URL externa"}
      />

<Input
        label={"Nombre de la acción"}
        name={"webhook_name"}
        placeholder={"Enviar Webhook"}
      />

      <Input
        label={"URL"}
        name={"webhook_url"}
        placeholder={"https://api.example.com/webhook"}
      />

      <Input
        label={"Método HTTP"}
        name={"webhook_method"}
        placeholder={"POST"}
      />
      <Input
        label={"Datos a enviar"}
        name={"webhook_data"}
        placeholder={"{}"}
      />

      <Select
        label={"Autenticación"}
        name={"webhook_auth"}
        options={["Sin autenticación", "Bearer Token", "API Key", "Basic Auth", "Credenciales"]}
      />
      <Input
        name={"webhook_auth_value"}
        placeholder={"Token/API Key/Usuario:Contraseña"}
      />

      <Input
        label={"Timeout (ms)"}
        name={"webhook_timeout"}
        placeholder={"10000"}
        />

    </div>
  );
};

export default WebHook;