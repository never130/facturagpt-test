import Xml from "../../../../assets/XmlsCircle.svg";

export const json = [
  {
    endpoint: "https://graph.microsoft.com/v1.0/me/drive/items/{id}/workbook/",
    method: "POST",
    name: "Actualiza un xml",
    description: "Este método permite actualizar un xml. Proporciona acceso directo al archivo solicitado mediante una conexión xml segura.",
    type: "XML",
    image: Xml,
    data: [
      {
        type: "character",
        required: true,
        title: "Nombre del documento",
        description: "Inserte el nombre del documento que desea actualizar",
      }, {
        type: "uuid",
        required: true,
        title: "Identificador del documento",
        description: "Inserte el identificador del documento que desea actualizar",
      },
    ],
  },
];