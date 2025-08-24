import i18n from "i18next";

  
const getLanguageResources = (id) => {
  const defaultResources = {

  };

  const customVariants = {
  
  };

  if (id && customVariants[id]) {
    return {
      Español: {
        ...Español,
        ...customVariants[id],
      },
    };
  }

  return defaultResources;
};

export const reinitI18n = () => {
  const language = localStorage.getItem("language") ;
  const specificId = localStorage.getItem("translationId");
  i18n.init({
    interpolation: { escapeValue: false },
    lng: language,
    fallbackLng: "Español", 
    resources: getLanguageResources(specificId),
    pluralSeparator: "_",
    pluralRules: {
        Español: function(count) {
          return count === 1 ? "one" : "other";
        }
      }
      
  });
};

reinitI18n();

export default i18n;
