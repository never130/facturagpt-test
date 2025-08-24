import { useMemo } from 'react';

// Datos de ayuda predefinidos
const helpData = {
  "1-1": {
    title: "Chat con IA",
    description: "Inicia una conversación con nuestro asistente de inteligencia artificial. Puedes hacer preguntas sobre facturación, gestión de contactos, y mucho más."
  },
  "1-2": {
    title: "Notificaciones",
    description: "Mantente al día con todas las notificaciones importantes de tu cuenta y actividades recientes."
  },
  "1-3": {
    title: "Configuración",
    description: "Personaliza tu experiencia ajustando la configuración de tu cuenta, tema, idioma y preferencias."
  },
  "1-4": {
    title: "Búsqueda Global",
    description: "Busca rápidamente entre todos tus documentos, contactos, activos y otras tablas de datos."
  },
  "1-5": {
    title: "Crear Nuevo",
    description: "Accede rápidamente a todas las opciones de creación: facturas, contactos, activos, carpetas y más."
  },
  "1-6": {
    title: "Modo Avión",
    description: "Activa el modo offline para trabajar sin conexión a internet. Los cambios se sincronizarán cuando vuelvas a conectarte."
  },
  "1-7": {
    title: "Chat de Voz",
    description: "Utiliza comandos de voz para navegar y realizar acciones en la aplicación de forma más rápida."
  },
  "1-8": {
    title: "Perfil de Usuario",
    description: "Gestiona tu información personal, cambia tu foto de perfil y ajusta las configuraciones de tu cuenta."
  }
};

export const useHelpData = (helpId) => {
  const data = useMemo(() => {
    return helpData[helpId] || {
      title: "Ayuda",
      description: "Información de ayuda no disponible."
    };
  }, [helpId]);

  return data;
};

export default useHelpData; 