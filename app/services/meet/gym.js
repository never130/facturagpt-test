const axios = require("axios");
const { sendTextData } = require("../processChat.js");


const meetGym = async ({
    res,
    text,
    type,
    conf
}) => {
    try {       

        await assistantAgent({
          res,
          token,
          agent,
          action: [{
            id: "gym",
            icon: "🏋️",
            title: "Gimnasio",
            description: "Gimnasio",
            prompt: "Gimnasio",
            fn: 'gym'
          }, {
            id: "cancel-gym",
            icon: "❌",
            title: "Cancelar",
            description: "Cancelar el gimnasio",
            prompt: "Cancelar el gimnasio",
            fn: 'cancelGym'
          }],
          data: {
            "gym": {
              "description": "Gimnasio",
              "type": "string",
              "required": true
            },
            "peso_actual": {
              "description": "Peso actual en kg",
              "type": "number",
              "required": true
            },
            "peso_objetivo": {
              "description": "Peso objetivo en kg",
              "type": "number",
              "required": true
            },
            "altura": {
              "description": "Altura en cm",
              "type": "number",
              "required": true
            },
            "edad": {
              "description": "Edad en años",
              "type": "number",
              "required": true
            },
            "nivel_experiencia": {
              "description": "Nivel de experiencia (principiante, intermedio, avanzado)",
              "type": "string",
              "required": true
            },
            "objetivo_principal": {
              "description": "Objetivo principal (ganar masa muscular, perder grasa, fuerza, definición)",
              "type": "string",
              "required": true
            },
            "dias_entrenamiento": {
              "description": "Días disponibles para entrenar por semana",
              "type": "number",
              "required": true
            },
            "tiempo_disponible": {
              "description": "Tiempo disponible por sesión en minutos",
              "type": "number",
              "required": true
            },
            "medidas_actuales": {
              "description": "Medidas actuales (pecho, brazos, piernas, cintura)",
              "type": "object",
              "required": false
            },
            "medidas_objetivo": {
              "description": "Medidas objetivo (pecho, brazos, piernas, cintura)",
              "type": "object",
              "required": false
            },
            "porcentaje_grasa": {
              "description": "Porcentaje de grasa corporal actual",
              "type": "number",
              "required": false
            },
            "lesiones_previas": {
              "description": "Lesiones previas o limitaciones físicas",
              "type": "string",
              "required": false
            },
            "equipamiento_disponible": {
              "description": "Equipamiento disponible (gimnasio completo, pesas en casa, solo peso corporal)",
              "type": "string",
              "required": true
            },
            "preferencias_alimentacion": {
              "description": "Preferencias alimentarias (vegetariano, vegano, sin restricciones)",
              "type": "string",
              "required": false
            }
          }

        })

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetGym
}