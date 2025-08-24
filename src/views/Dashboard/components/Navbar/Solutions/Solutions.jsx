import React from "react";
import styles from "./Solutions.module.css";
import { useTranslation } from "react-i18next";
import { ReactComponent as LegalGptIcon } from "../../../assets/LegalGPT.svg";
import { ReactComponent as IndustriaGptIcon } from "../../../assets/IndustriaGPT.svg";
import { ReactComponent as AutoGptIcon } from "../../../assets/AutoGPT.svg";
import { ReactComponent as EduGptIcon } from "../../../assets/EduGPT.svg";
import { ReactComponent as ObraGptIcon } from "../../../assets/ObraGPT.svg";
// Importaciones temporales para los nuevos GPTs (usando iconos existentes como placeholders)
import { ReactComponent as AgroGptIcon } from "../../../assets/AgroGPT.svg";
import { ReactComponent as TiendaGptIcon } from "../../../assets/TiendaGPT.svg";
import { ReactComponent as SaludGptIcon } from "../../../assets/SaludGPT.svg";
import { ReactComponent as DeporteGptIcon } from "../../../assets/DeporteGPT.svg";
import { ReactComponent as TalentoGptIcon } from "../../../assets/TalentoGPT.svg";
import { ReactComponent as ImmoGptIcon } from "../../../assets/ImmoGPT.svg";
import { ReactComponent as LogisticaGptIcon } from "../../../assets/LogisticaGPT.svg";
import { ReactComponent as StartupGptIcon } from "../../../assets/StartupGPT.svg";
import { ReactComponent as HorecaGptIcon } from "../../../assets/HorecaGPT.svg";
import { ReactComponent as EventosGptIcon } from "../../../assets/EventosGPT.svg";
import { ReactComponent as TurismoGptIcon } from "../../../assets/TurismoGPT.svg";
import { ReactComponent as ReciboGptIcon } from "../../../assets/ReciboGPT.svg";
import { ReactComponent as HogarGptIcon } from "../../../assets/HogarGPT.svg";
import { ReactComponent as FinanzasGptIcon } from "../../../assets/FinanzasGPT.svg";
import { ReactComponent as ConfigurationIcon } from "../../../assets/ConfigurationSolutionsIcon.svg";
import { ReactComponent as StarPlusIcon } from "../../../assets/starPlus.svg";

import { ReactComponent as SolutionsDevelopmentIcon } from "../../../assets/SolutionsDevelopmentIcon.svg";
import { ReactComponent as TechnicalSupport } from "../../../assets/TechnicalSupport.svg";
import Button from "../../Button/Button";
import { useNavigate } from "react-router-dom";
import HeaderCard from "../../HeaderCard/HeaderCard";

const Solutions = ({ showSolutions, setShowSolutions, isMobile }) => {
  const [t] = useTranslation("Landing");

  const solutions = [
    {
      name: "ObraGPT",
      desc: t("obragptDesc"),
      btnText: t("obragptBtnText"),
      icon: <ObraGptIcon />,
      url: "/go/obragpt",
    },
    {
      name: "TiendaGPT",
      desc: t("tiendagptDesc"),
      btnText: t("tiendagptBtnText"),
      icon: <TiendaGptIcon />,
      url: "/go/tiendagpt",
    },
    {
      name: "HorecaGPT",
      desc: t("horecagptDesc"),
      btnText: t("horecagptBtnText"),
      icon: <HorecaGptIcon />,
      url: "/go/horecagpt",
    },
    {
      name: "SaludGPT",
      desc: t("saludgptDesc"),
      btnText: t("saludgptBtnText"),
      icon: <SaludGptIcon />,
      url: "/go/saludgpt",
    },
    //
    {
      name: "TurismoGPT",
      desc: t("turismogptDesc"),
      btnText: t("turismogptBtnText"),
      icon: <TurismoGptIcon />,
      url: "/go/turismogpt",
    },
    {
      name: "DeporteGPT",
      desc: t("deportegptDesc"),
      btnText: t("deportegptBtnText"),
      icon: <DeporteGptIcon />,
      url: "/go/deportegpt",
    },
    {
      name: "ReciboGPT",
      desc: t("recibogptDesc"),
      btnText: t("recibogptBtnText"),
      icon: <ReciboGptIcon />,
      url: "/go/recibogpt",
    },
    {
      name: "AgroGPT",
      desc: t("agrogptDesc"),
      btnText: t("agrogptBtnText"),
      icon: <AgroGptIcon />,
      url: "/go/agrogpt",
    },

    {
      name: "EventosGPT",
      desc: t("eventosgptDesc"),
      btnText: t("eventosgptBtnText"),
      icon: <EventosGptIcon />,
      url: "/go/eventosgpt",
    },
    {
      name: "EduGPT",
      desc: t("edugptDesc"),
      btnText: t("edugptBtnText"),
      icon: <EduGptIcon />,
      url: "/go/edugpt",
    },
    {
      name: "HogarGPT",
      desc: t("hogargptDesc"),
      btnText: t("hogargptBtnText"),
      icon: <HogarGptIcon />,
      url: "/go/hogargpt",
    },
    {
      name: "LogísticaGPT",
      desc: t("logisticagptDesc"),
      btnText: t("logisticagptBtnText"),
      icon: <LogisticaGptIcon />,
      url: "/go/logisticagpt",
    },
    {
      name: "ImmoGPT",
      desc: t("immogptDesc"),
      btnText: t("immogptBtnText"),
      icon: <ImmoGptIcon />,
      url: "/go/immogpt",
    },
    {
      name: "LegalGPT",
      desc: t("legalgptDesc"),
      btnText: t("legalgptBtnText"),
      icon: <LegalGptIcon />,
      url: "/go/legalgpt",
    },
    {
      name: "TalentoGPT",
      desc: t("talentogptDesc"),
      btnText: t("talentogptBtnText"),
      icon: <TalentoGptIcon />,
      url: "/go/talentogpt",
    },
    {
      name: "FinanzasGPT",
      desc: t("finanzasgptDesc"),
      btnText: t("finanzasgptBtnText"),
      icon: <FinanzasGptIcon />,
      url: "/go/finanzasgpt",
    },
    {
      name: "AutoGPT",
      desc: t("autogptDesc"),
      btnText: t("autogptBtnText"),
      icon: <AutoGptIcon />,
      url: "/go/autogpt",
    },
    {
      name: "IndustriaGPT",
      desc: t("industriagptDesc"),
      btnText: t("industriagptBtnText"),
      icon: <IndustriaGptIcon />,
      url: "/go/industriagpt",
    },

    {
      name: "InnovaGPT",
      desc: t("innovagptDesc"),
      btnText: t("innovagptBtnText"),
      icon: <StartupGptIcon />,
      url: "/go/innovagpt",
    },

    {
      name: t("configuration"),
      desc: t("configurationDesc"),
      btnText: t("configurationBtnText"),
      icon: <ConfigurationIcon />,
      url: "/go/configuration",
    },
  ];
  const navigate = useNavigate();

  return (
    <div
      className={styles.solutionsContainer}
      style={{
        display:showSolutions && 'flex'
        // display: true && "flex",
      }}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          {isMobile && (
            <HeaderCard
              setState={setShowSolutions}
              title={t("solutions")}
              headerStyle={{
                width: "100%",
                padding: "0",
                position: "initial",
              }}
            ></HeaderCard>
          )}
          <div className={styles.headerSolution}>
            <p>{t("successStories")}</p>
            <span>{t("solutionRespondsDayToDay")}</span>
          </div>

          <div className={styles.solutionsList}>
            {solutions.map((solution, index) => (
              <div
                key={index}
                className={`${styles.solutionCard} ${solution.name === t("configuration") && styles.configurationCard}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSolutions(false);
                  navigate(solution.url);
                }}
              >
                <div className={styles.infoSolution}>
                  <div className={styles.icon}>{solution.icon}</div>
                  <h3>
                    {solution.name}{" "}
                    {solution.name === t("configuration") && (
                      <StarPlusIcon className={styles.starPlusIcon} />
                    )}
                  </h3>
                </div>
                <p>{solution.desc}</p>
                {/* {solution.name !== t("configuration") && ( */}
                  <Button
                    headerStyle={{
                      padding: "5px",
                      fontSize: "13px",
                      ...(solution.name === t("configuration") && {
                        backgroundColor:"#71C1AE",
                        color:"#FFFFFF"
                      }),
                    }}
                  >
                    {solution.btnText}
                  </Button>
                {/* )} */}
              </div>
            ))}
          </div>
        </div>

        {/* <div className={styles.content}>
     
      <div className={styles.headerSolution}>
         <p>{t("infrastructureAndSupport")}</p>
        <span>{t("infrastructureAllowsForScaling")}</span>
      </div>
     
        <div 
        className={`${styles.solutionsList} ${styles.bottom}`}
        onClick={() => {
          setShowSolutions(false)
          navigate('/help')
        }}
        >
          {solutionsPlatform.map((solution, index) => (
            <div key={index} className={styles.solutionCard} >
                 <div className={styles.infoSolution}>
                <div className={styles.icon}>{solution.icon}</div>
                <h3 className={styles.textSolutions}>{solution.name}</h3>
              </div>
              <p>{solution.desc}</p>
            </div>
          ))}
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default Solutions;
