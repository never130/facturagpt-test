const axios = require("axios");
const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const { sendTextData } = require("../processChat.js");
const { assistantAgent, assistantPrompt } = require("../automate/utils.js");
const { connectDB } = require("../../controllers/utils");
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');


const meetScraping = async ({
    res,
    token,
    prompt: _prompt,
    type,
    value,
    conf
}) => {
    try {
        const {
            userId,
            agentId,
            chatId,
            scrapId: _scrapId
        } = conf;

        // console.log('prompt scraping', prompt.data.scrapVariables);


        let scrapId = _scrapId
        if (!scrapId) {
            scrapId = uuidv4()
            conf.scrapId = scrapId
        }

        console.log('conf scraping', conf);

        const dbChat = await connectDB(`db_${userId}_chat`);
        // let chat = await dbChat.get(chatId);

        let chat = await dbChat.find({
            selector: {
                _id: chatId
            }
        });


        if (chat.docs.length > 0) {
            chat = chat.docs[0];
        } else {
            chat = {}
        }


        console.log('value', value, _prompt)

        if (!value && _prompt.data) {
            const response0 = await sendTextData({
                res,
                data: {
                    scrapId,
                    status: 200,
                    name: _prompt.data.scrapItem.name,
                    description: _prompt.data.scrapItem.description,
                    db_name: _prompt.data.scrapItem.db_name,
                    variables: _prompt.data.scrapVariables,
                },
                type: 'scraping',
            })
        }

        let prompt = {}

        if (value == 200) {
            // guardar tabla
            prompt = {
                num: Math.floor(Math.random() * (6 - 2 + 1)) + 2,
                interlocutors: [
                    'FacturaGPT: Experto en gestión y almacenamiento de datos tabulares',
                    'TablaManager: Especialista en estructuras de datos y bases de datos',
                    'DataValidator: Encargado de verificar la integridad de los datos'
                ],
                kpis: [
                    'Explicar el proceso de guardado de tablas en la base de datos',
                    'Validar la estructura y formato de los datos antes de guardar',
                    'Confirmar el éxito del almacenamiento de la información',
                    'Proporcionar recomendaciones para la organización óptima de los datos'
                ]
            }
        } else if (value == 201) {
            // subir documento
            prompt = {
                num: Math.floor(Math.random() * (6 - 2 + 1)) + 2,
                interlocutors: [
                    'FacturaGPT: Experto en procesamiento de documentos',
                    'DocumentReader: Especialista en extracción de datos de archivos',
                    'FormatAnalyzer: Analista de formatos y estructura documental'
                ],
                kpis: [
                    'Guiar en el proceso de carga y procesamiento de documentos',
                    'Verificar la compatibilidad del formato del documento',
                    'Extraer y estructurar la información relevante',
                    'Asegurar la calidad de los datos extraídos'
                ]
            }
        } else if (value == 202) {
            // subir link
            prompt = {
                num: Math.floor(Math.random() * (6 - 2 + 1)) + 2,
                interlocutors: [
                    'FacturaGPT: Experto en análisis de enlaces web',
                    'URLValidator: Especialista en validación de URLs',
                    'WebScraper: Profesional en extracción de datos web'
                ],
                kpis: [
                    'Validar la accesibilidad y seguridad del enlace proporcionado',
                    'Analizar la estructura de la página web',
                    'Identificar los elementos relevantes para la extracción',
                    'Establecer estrategias de scraping efectivas'
                ]
            }
        } else if (value == 203) {
            // nueva regla
            prompt = {
                num: Math.floor(Math.random() * (6 - 2 + 1)) + 2,
                interlocutors: [
                    'FacturaGPT: Experto en configuración de reglas de negocio',
                    'RuleEngine: Especialista en lógica de reglas',
                    'ValidationExpert: Analista de criterios y condiciones'
                ],
                kpis: [
                    'Definir claramente los parámetros de la nueva regla',
                    'Establecer condiciones y criterios de validación',
                    'Asegurar la compatibilidad con reglas existentes',
                    'Verificar la efectividad de la implementación'
                ]
            }
        } else if (value == 204) {
            // nueva variable
            prompt = {
                num: Math.floor(Math.random() * (6 - 2 + 1)) + 2,
                interlocutors: [
                    'FacturaGPT: Experto en gestión de variables',
                    'DataArchitect: Especialista en estructura de datos',
                    'TypeValidator: Analista de tipos de datos'
                ],
                kpis: [
                    'Definir el propósito y alcance de la nueva variable',
                    'Establecer el tipo y formato de datos apropiado',
                    'Validar la unicidad y relevancia de la variable',
                    'Asegurar la integración con el sistema existente'
                ]
            }
        } else if (value == 205) {
            // eliminar variable
            prompt = {
                num: Math.floor(Math.random() * (6 - 2 + 1)) + 2,
                interlocutors: [
                    'FacturaGPT: Experto en gestión de datos',
                    'DataCleaner: Especialista en limpieza de datos',
                    'ImpactAnalyst: Analista de impacto de cambios'
                ],
                kpis: [
                    'Evaluar el impacto de la eliminación de la variable',
                    'Verificar dependencias y relaciones',
                    'Asegurar la integridad de los datos restantes',
                    'Confirmar la eliminación segura de la variable'
                ]
            }
        } else if (value == 206) {
            // salir de la conversación
            prompt = {
                num: Math.floor(Math.random() * (6 - 2 + 1)) + 2,
                interlocutors: [
                    'FacturaGPT: Coordinador de cierre de sesión',
                    'SessionManager: Especialista en gestión de sesiones',
                    'DataSaver: Experto en respaldo de información'
                ],
                kpis: [
                    'Verificar que todos los cambios estén guardados',
                    'Asegurar el cierre correcto de la sesión',
                    'Confirmar la finalización de procesos pendientes',
                    'Proporcionar resumen de la actividad realizada'
                ]
            }
        } else {
            // nuevo
            prompt = {
                num: Math.floor(Math.random() * (6 - 2 + 1)) + 2,
                interlocutors: [
                    'FacturaGPT: host y lider de la conversación',
                    ..._prompt.data.scrapVariables.map(item => `${item.name}: ${item.description}`),
                ],
                kpis: [
                    'FacturaGPT va a ayudar a extraer información usando los interlocutores que son variables del scrap',
                    'Cada interlocutar es una variable habla sobre ella',
                    'Simula que FacturaGPT esta hablando a las variables para definir como seran',
                    _prompt.data.scrapItem.description
                ]
            }
        }


        const response = await assistantPrompt({
            res,
            token,
            prompt: prompt,
            conf
        })

        console.log('response scraping', response);


        // const response = await assistantAgent({
        //     res,
        //     token,
        //     prompt,
        //     agent: {
        //         tone: 70,
        //         answer: 60,
        //         formality: 60,
        //         presicion: 80
        //     },
        //     userId,
        //     agentId,
        //     chatId,
        //     scrapId,
        //     action: 'fnMeetScraping',
        //     data: {
        //         websiteUrl: {
        //             description: "¿Cuál es la URL de la página web que quieres analizar?",
        //             type: "url",
        //             required: true
        //         }
        //     }
        // });


    } catch (error) {
        console.error('Error in meetScraping:', error);
        await sendTextData({
            res,
            data: {
                text: "Lo siento, hubo un error durante el proceso de scraping. Por favor, intenta de nuevo.",
                error: error.message
            },
            type: 'scraping',
            conf: {
                userId: conf.userId,
                agentId: conf.agentId,
                chatId: conf.chatId
            }
        });
    }
};

module.exports = {
    meetScraping,
};