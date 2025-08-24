import i18n from "i18next";
import Español from "./languages/Español";
import English from "./languages/English";
import 日本語 from "./languages/日本語";
import 普通话 from "./languages/普通话";
import Deutsch from "./languages/Deutsch";
import Français from "./languages/Français";
import Italiano from "./languages/Italiano";
import Português from "./languages/Português";

import AutoGpt from "./languages/CustomPages/AutoGpt/Español/index";
import ClinicGpt from "./languages/CustomPages/ClinicGpt/Español/index";
import ContaGpt from "./languages/CustomPages/ContaGpt/Español/index";
import DeliverGpt from "./languages/CustomPages/DeliverGpt/Español/index";
import DocGpt from "./languages/CustomPages/DocGpt/Español/index";
import EduGpt from "./languages/CustomPages/EduGptIndex/Español/index";
import IndustryGpt from "./languages/CustomPages/IndustryGpt/Español/index";
import LegalGpt from "./languages/CustomPages/LegalGpt/Español/index";
import ObraGpt from "./languages/CustomPages/ObraGpt/Español/index";
import RepoGpt from "./languages/CustomPages/RepoGpt/Español/index";
import StateGpt from "./languages/CustomPages/StateGpt/Español/index";
import TalkGpt from "./languages/CustomPages/TalkGpt/Español/index";
import TicketGpt from "./languages/CustomPages/TicketGpt/Español/index";
import VitaeGpt from "./languages/CustomPages/VitaeGpt/Español/index";

  
const getLanguageResources = (id) => {
  const defaultResources = {
    Español,
    English,
    日本語,
    普通话,
    Deutsch,
    Français,
    Italiano,
    Português,
  };

  const customVariants = {
    autogpt: AutoGpt,
    clinicgpt: ClinicGpt,
    contagpt: ContaGpt,
    delivergpt: DeliverGpt,
    docgpt: DocGpt,
    edugpt: EduGpt,
    industrygpt: IndustryGpt,
    legalgpt: LegalGpt,
    obragpt: ObraGpt,
    repogpt: RepoGpt,
    stategpt: StateGpt,
    talkgpt: TalkGpt,
    ticketgpt: TicketGpt,
    vitaegpt: VitaeGpt,
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
