import WhatApp from "../../../../assets/whatsappCircle.svg";

export const json = [
  {
    endpoint: "url1/url2",
    method: "POST",
    name: "Enviar un mensaje por WhatsApp",
    description: "Este método permite enviar un mensaje por WhatsApp. Proporciona acceso directo al archivo solicitado mediante una conexión WhatsApp segura.",
    type: "Whatsapp",
    image: WhatApp,
    data: [
      {
        type: "character",
        required: true,
        title: "Nombre del contacto",
        description: "Nombre del contacto",
      },
      {
        type: "character",
        required: true,
        title: "Número de teléfono del contacto",
        description: "Número de teléfono del contacto",
      },{
        type: "character",
        required: true,
        title: "Mensaje a enviar",
        description: "Mensaje a enviar",
      },
    ],
  },
];
