import googleSheets from "../../../../assets/excelCircle.svg";

export const json = [
  {
    endpoint: "https://graph.microsoft.com/v1.0/me/drive/items/{id}/workbook/",
    method: "POST",
    name: "Actualiza un google sheets",
    description: "Este método permite actualizar un google sheets. Proporciona acceso directo al archivo solicitado mediante una conexión google sheets segura.",
    type: "Google Sheets",
    image: googleSheets,
    editable: true,
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
