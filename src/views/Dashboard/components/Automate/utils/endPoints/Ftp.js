import Ftp from "../../../../assets/WhiteFTPCircle.svg";

export const json = [
  {
    endpoint: "https://0.0.0.0:/",
    method: "POST",
    name: "Actualiza un servidor FTP",
    description: "Este método permite actualizar un servidor FTP. Proporciona acceso directo al archivo solicitado mediante una conexión FTP segura.",
    type: "FTP",
    image: Ftp,
    data: [
      {
        type: "character",
        required: true,
        title: "IP del servidor",
        description: "Inserte la IP del servidor que desea actualizar",
      }, {
        type: "character",
        required: true,
        title: "Usuario",
        description: "Inserte el usuario del servidor que desea actualizar",
      }, {
        type: "character",
        required: true,
        title: "Contraseña",
        description: "Inserte la contraseña del servidor que desea actualizar",
      },
    ],
  },
];
