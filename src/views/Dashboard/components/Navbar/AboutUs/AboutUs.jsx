import React from 'react'
import styles from '../SaaS/SaaS.module.css'
import HeaderCard from '../../HeaderCard/HeaderCard'
import { useTranslation } from 'react-i18next'
import { ReactComponent as DynamicTables } from "../../../assets/DynamicTablesProductSectionIcon.svg";
import { ReactComponent as MultiAgent } from "../../../assets/MultiAgentProductSectionIcon.svg";
import { ReactComponent as Documents } from "../../../assets/DocumentsProductSectionIcon.svg";
import { ReactComponent as Scraping } from "../../../assets/ScrapingProductSectionIcon.svg";
import { ReactComponent as Apps } from "../../../assets/AppsProductSectionIcon.svg";
import { ReactComponent as Connection } from "../../../assets/ConnectionProductSectionIcon.svg";
import { ReactComponent as Activity } from "../../../assets/ActiviryProductSectionIcon.svg";
import { ReactComponent as Variables } from "../../../assets/VariablesProductSectionIcon.svg";
import { ReactComponent as PrivateEnviroment } from "../../../assets/PrivateEnviromentProductSectionIcon.svg";
import { ReactComponent as Synchronization } from "../../../assets/SynchronizationProductSectionIcon.svg";
import { ReactComponent as InternalRegistration } from "../../../assets/InternalRegistrationProductSectionIcon.svg";
import { ReactComponent as Calendar } from "../../../assets/CalendarProductSectionIcon.svg";
import { ReactComponent as Task } from "../../../assets/TasksProductSectionIcon.svg";
import { ReactComponent as Notifications } from "../../../assets/NotificationsProductSectionIcon.svg";
import { ReactComponent as YourData } from "../../../assets/YourDataProductSectionIcon.svg";
const AboutUs = ({setShowAboutUs, showAboutUs, isMobile}) => {
    const [t] = useTranslation("Landing");
    const solutionsPlatform2 = [
        {
          name: t("mission"),
          desc: t("missionDesc"),
          icon: <DynamicTables />,
          subOptions: [
         
            {
              name: t("unleashThePotential"),
              desc: t("unleashThePotentialDesc"),
              icon: <DynamicTables />,
            },
            {
              name: t("timeSaving"),
              desc: t("timeSavingDesc"),
              icon: <DynamicTables />,
            },
            {
              name: t("frictionLessIntegration"),
              desc: t("frictionLessIntegrationDesc"),
              icon: <DynamicTables />,
            },
            {
                name: t("accessibleAutomation"),
                desc: t("accessibleAutomationDesc"),
                icon: <DynamicTables />,
              },
          ],
        },
        {
          name: t("vision"),
          desc: t("visionDesc"),
          icon: <DynamicTables />,
          subOptions: [
            {
              name: t("multiSectorImpact"),
              desc: t("multiSectorImpactDesc"),
              icon: <DynamicTables />,
            },
            {
              name: t("reinventYourData"),
              desc: t("reinventYourDataDesc"),
              icon: <DynamicTables />,
            },
            {
              name: t("digitalCulture"),
              desc: t("digitalCultureDesc"),
              icon: <DynamicTables />,
            },
            
            {
              name: t("universalAccess"),
              desc: t("universalAccessDesc"),
              icon: <DynamicTables />,
            },
            
          ],
        },
        {
          name: t("values"),
          desc: t("valuesDesc"),
          icon: <DynamicTables />,
          subOptions: [
            {
              name: t("scalabilityConscious"),
              desc: t("scalabilityConsciousDesc"),
              icon: <DynamicTables />,
            },
            {
              name: t("innovateWithPurpose"),
              desc: t("innovateWithPurposeDesc"),
              icon: <DynamicTables />,
            },
            {
              name: t("humanTechnology"),
              desc: t("humanTechnologyDesc"),
              icon: <DynamicTables />,
            },
            
            {
              name: t("constantSecurity"),
              desc: t("constantSecurityDesc"),
              icon: <DynamicTables />,
            },
            
          ],
        }
      ];

  return (
    <div className={styles.solutionsContainer} style={{
        display:showAboutUs && 'flex'
      }}>
    {isMobile && (

<HeaderCard
setState={setShowAboutUs}
title={t('aboutUs')}
headerStyle={{
  width: "100%",
  padding: "0",
  position:"initial"
}}
></HeaderCard>
)}        
        
        <div className={styles.content}>
       
        <div className={styles.headerSolution}>
           <p>{t("aboutUs")}</p>
          <span>{t("aboutUsDesc")}</span>
        </div>
       
          <div 
          className={`${styles.dailyOperationContainer}`}
          onClick={() => {
            setShowSolutions(false)
            // navigate('/help')
          }}
          >
            {solutionsPlatform2.map((solution, index) => (
              <div key={index} className={styles.solutionCard} >
                   <div className={styles.infoSolution}>
                  <div className={styles.icon}>{solution.icon}</div>
                  <h3>{solution.name}</h3>
                </div>
                {/* <p>{solution.desc}</p> */}
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

        </div>
  )
}

export default AboutUs