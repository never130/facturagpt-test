import React from 'react'
import styles from './SaaS.module.css'


import { ReactComponent as Automation } from "../../../assets/AutomationProductSectionIcon.svg";
import { ReactComponent as YourLibrary } from "../../../assets/YourLibraryProductSectionIcon.svg";
import { ReactComponent as DynamicTables } from "../../../assets/DynamicTableProductSectionIcon.svg";
import { ReactComponent as YourData } from "../../../assets/YourDataProductSectionIcon.svg";
import { ReactComponent as PrivateEnviroment } from "../../../assets/PrivateEnviromentProductSectionIcon.svg";
import { ReactComponent as Variables } from "../../../assets/VariablesProductSectionIcon.svg";
import { ReactComponent as Synchronization } from "../../../assets/DynamicTablesProductSectionIcon.svg";
import { ReactComponent as GenerativeAnalysis } from "../../../assets/GenerativeAnalysisProductSectionIcon.svg";
import { ReactComponent as HumanInteraction } from "../../../assets/HumanInteractionProductSectionIcon.svg";
import { ReactComponent as GreenFolderIcon } from "../../../assets/DocumentManagementIcon.svg";
import { ReactComponent as MultiAgent } from "../../../assets/MultiAgentProductSectionIcon.svg";
import { ReactComponent as Documents } from "../../../assets/DocumentsProductSectionIcon.svg";
import { ReactComponent as Scraping } from "../../../assets/ScrapingProductSectionIcon.svg";
import { ReactComponent as Apps } from "../../../assets/AppsProductSectionIcon.svg";
import { ReactComponent as Connection } from "../../../assets/ConnectionProductSectionIcon.svg";
import { ReactComponent as Activity } from "../../../assets/ActiviryProductSectionIcon.svg";
import { ReactComponent as InternalRegistration } from "../../../assets/InternalRegistrationProductSectionIcon.svg";
import { ReactComponent as Calendar } from "../../../assets/CalendarProductSectionIcon.svg";
import { ReactComponent as Task } from "../../../assets/TasksProductSectionIcon.svg";
import { ReactComponent as Notifications } from "../../../assets/NotificationsProductSectionIcon.svg";
import { ReactComponent as DataSecurity } from "../../../assets/DataSecurityProductSectionIcon.svg";
import { ReactComponent as HelpcenterCircleIcon } from "../../../assets/HelpcenterCircleIcon.svg";
import { ReactComponent as HelpCenter } from "../../../assets/HelpCenter.svg";
import { useTranslation } from 'react-i18next';
import HeaderCard from '../../HeaderCard/HeaderCard';
import { useNavigate } from 'react-router-dom';
const SaaS = ({showSaas,setShowSaas,isMobile}) => {
    const [t] = useTranslation("Landing");
    const navigate = useNavigate(); 
    const solutionsPlatform1 = [
        {
          name: t("automateTitle"),
          desc: t("connectYourSystems"),
          icon: <Automation />,
        },
        {
          name: t("yourLibrary"),
          desc: t("yourLibraryDesc"),
          icon: <YourLibrary />,
        },
        {
          name: t("generativeAnalysis2"),
          desc: t("generativeAnalysisDesc2"),
          icon: <GenerativeAnalysis />,
        },
        {
          name: t("humanInteraction"),
          desc: t("humanInteractionDesc"),
          icon: <HumanInteraction />,
        },
     
      ];
    // Corrección: la estructura del array estaba incorrecta, se debe usar un array de objetos.
    const solutionsPlatform2 = [
      {
        name: t("dynamicTables"),
        desc: t("dynamicTablesDesc"),
        icon: <DynamicTables />,
        subOptions: [
          {
            name: t("yourData"),
            desc: t("yourDataDesc"),
            icon: <Variables />,
          },
          {
            name: t("privateEnvironment"),
            desc: t("privateEnvironmentDesc"),
            icon: <PrivateEnviroment />,
          },
          {
            name: t("variables"),
            desc: t("variablesDesc"),
            icon: <YourData />,
          },
          {
            name: t("synchronization"),
            desc: t("synchronizationDesc"),
            icon: <Synchronization />,
          }
        ],
      },
      {
        name: t("multiAgentSystem"),
        desc: t("multiAgentSystemDesc"),
        icon: <MultiAgent />,
        subOptions: [
          {
            name: t("documents"),
            desc: t("documentsDesc"),
            icon: <Documents />,
          },
          {
            name: t("scraping"),
            desc: t("scrapingDesc"),
            icon: <Scraping />,
          },
          {
            name: t("apps"),
            desc: t("appsDesc"),
            icon: <Apps />,
          },
          
          {
            name: t("connection"),
            desc: t("connectionDesc"),
            icon: <Connection />,
          },
          
        ],
      },
      {
        name: t("activity"),
        desc: t("activityDesc"),
        icon: <Activity />,
        subOptions: [
          {
            name: t("internalRegistrarion"),
            desc: t("internalRegistrarionDesc"),
            icon: <InternalRegistration />,
          },
          {
            name: t("calendar"),
            desc: t("calendarDesc"),
            icon: <Calendar />,
          },
          {
            name: t("task"),
            desc: t("taskDesc"),
            icon: <Task />,
          },
          
          {
            name: t("notifications"),
            desc: t("notificationsDesc"),
            icon: <Notifications />,
          },
          
        ],
      }
    ];
    const solutionsPlatform3 = [
        {
          name: t("configuration"),
          desc: t("configurationDesc"),
          icon: <YourData />,
        },
        {
          name: t("technicalSupport"),
          desc: t("technicalSupportDesc4"),
          icon: <HelpCenter />,
        },
        {
          name: t("dataSecurity"),
          desc: t("dataSecurityDesc"),
          icon: <DataSecurity />,
        },
        {
          name: t("helpCenter"),
          desc: t("helpCenterDesc2"),
          icon: <HelpcenterCircleIcon />,
        }
   
      ];
    

  return (
    <div className={styles.solutionsContainer} style={{
        display:showSaas && 'flex'
      }}>
      
  
      <div className={styles.container}>
      <div className={styles.content}>
        {isMobile && (
  
          <HeaderCard
          setState={setShowSaas}
          title={t('SaaS')}
          headerStyle={{
            width: "100%",
            padding: "0",
               position:"initial"
          }}
          ></HeaderCard>
        )}
    
        </div>
  


  
        <div className={styles.content}>
       
        <div className={styles.headerSolution}>
           <p>{t("ourSolutionsOffers")}</p>
          <span>{t("ourSolutionsOffersDesc")}</span>
        </div>
       
          <div 
          className={`${styles.solutionsList} ${styles.bottom}`}
          onClick={() => {
            setShowSaas(false)
            navigate('/help')
          }}
          >
            {solutionsPlatform1.map((solution, index) => (
              <div key={index} className={styles.solutionCard} >
                   <div className={styles.infoSolution}>
                  <div className={styles.icon}>{solution.icon}</div>
                  <h3>{solution.name}</h3>
                </div>
                <p>{solution.desc}</p>
              </div>
            ))}
          </div>
        </div>






        <div className={styles.content}>
       
        <div className={styles.headerSolution}>
           <p>{t("dailyOperation")}</p>
          <span>{t("organizesTeamsAndAutomateProcesses")}</span>
        </div>
       
          <div 
          className={`${styles.dailyOperationContainer}`}
          onClick={() => {
            setShowSolutions(false)
            navigate('/help')
          }}
          >
            {solutionsPlatform2.map((solution, index) => (
              <div key={index} className={styles.solutionCard} >
                   <div className={styles.infoSolution}>
                  <div className={styles.icon}>{solution.icon}</div>
                  <h3>{solution.name}</h3>
                </div>
                <p>{solution.desc}</p>
                <div className={styles.subOptionsContainer}>
                {solution?.subOptions?.map((subOption, index) => (
                    <div key={index} className={styles.subOption}>
                      <div className={styles.subOptionHeader}>
                      <div className={styles.icon}>{subOption.icon}</div>
                      <h3>{subOption.name} {subOption.name == 'task' && <span className={styles.soon}>({t("soon")})</span>}</h3>
                      </div>
                      <p>{subOption.desc}</p>
                
                    </div>
                  ))}
                </div>
               
              </div>
            ))}
          </div>
        </div>






        <div className={styles.content}>
       
        <div className={styles.headerSolution}>
           <p>{t("infrastructureAndSupport")}</p>
          <span>{t("scalableSecureAndSupported")}</span>
        </div>
       
          <div 
          className={`${styles.solutionsList} ${styles.bottom}`}
          onClick={() => {
            setShowSaas(false)
            navigate('/help')
          }}
          >
            {solutionsPlatform3.map((solution, index) => (
              <div key={index} className={styles.solutionCard} >
                   <div className={styles.infoSolution}>
                  <div className={styles.icon}>{solution.icon}</div>
                  <h3>{solution.name}</h3>
                </div>
                <p>{solution.desc}</p>
              </div>
            ))}
          </div>
        </div>





      </div>
      </div>
  )
}

export default SaaS