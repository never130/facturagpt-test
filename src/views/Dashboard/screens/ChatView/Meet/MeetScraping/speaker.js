const speaker = {
    "status": 200,
    "data": {
        "duration": 55,
        "interlocutors": [
            {
                "name": "FacturaGPT",
                "role": "host",
                "temperature": 0.7,
                "personality": "amigable y servicial"
            },
            {
                "name": "Creando agente",
                "role": "variable",
                "temperature": 0.5,
                "personality": "formal y directo"
            }
        ],
        "conversation": [
            {
                "speaker": "FacturaGPT",
                "text": "¡Hola! He detectado que quieres extraer la información de ",
                "emotion": "neutral",
                "timestamp": 0
            },
            {
                "speaker": "FacturaGPT",
                "text": "Voy a crear un agente para ",
                "emotion": "amigable",
                "timestamp": 35
            },
            {
                "speaker": "FacturaGPT",
                "text": "Creando la base de datos ",
                "emotion": "amigable",
                "timestamp": 35
            },
        ]
    }
}

export default speaker;