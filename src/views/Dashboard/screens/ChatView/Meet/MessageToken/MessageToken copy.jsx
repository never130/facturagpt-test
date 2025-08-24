import React from 'react'

import Alert from '../components/Alert/Alert'


const MessageToken = () => {
    return (
        <div>

            <div>
                <p>
                    Se ha detectado un token de OpenAI
                </p>
                <div>
                    <div>

                        ICON OPENAI
                        OpenaAI
                        GPT-4o (gpt-4o), GPT-4...
                    </div>
                    <div>

                        <button>

                            icon close
                            Error
                        </button>
                        <button>

                            icon verify
                            Validado
                        </button>

                    </div>
                </div>

                <div>
                    <button>
                        edik
                    </button>
                    <button>

                        icon verify
                        Sí, validar token
                    </button>
                </div>
            </div>

            <div>
                <b>
                    ¿Quieres conectar otro Token?
                </b>
                <div>
                    icono gemini
                    Gemini
                </div>
                <div>
                    icon openai
                    OpenAI
                </div>
                <div>
                    icon claude
                    Claude
                </div>
            </div>



           <Alert />
        </div>
    )
}

export default MessageToken