import React, { useState, useEffect } from "react";
import styles from "./NewUserInformation.module.css";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import { ReactComponent as BudgerNewUserIcon } from "../../assets/BudgerNewUserIcon.svg";
import { ReactComponent as ContactNewUserIcon } from "../../assets/ContactNewUserIcon.svg";
import { ReactComponent as PurschaseInvoiceNewUserIcon } from "../../assets/PurschaseInvoiceNewUserIcon.svg";
import { ReactComponent as HelpIcon } from "../../assets/HelpIcon.svg";
import HeaderCard from "../HeaderCard/HeaderCard";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { finishTutorial } from "../../../../actions/user";
import { setTutorialAgain } from "../../../../slices/userSlices";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step2YourWorkspace from "./Step2YourWorkspace";
import Step3 from "./Step3";
const NewUserInformation = () => {
  const { user, tutorialAgain } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation("navbarAdmin");
  const navigate = useNavigate();


  useEffect(()=>{
    tutorialAgain && setIsOpen(true)
    setIsOpen(true)
  },[tutorialAgain])

  

  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const steps = [
    {
 
    },
    {

    },
    {

    },
    {

    },
  ];
  const close = () => setIsOpen(false);

  const finishTutorialFn = async () => {
    const res = await dispatch(finishTutorial());
    dispatch(setTutorialAgain(false))
    close();
  };
  
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
        finishTutorialFn();
    }
  };

  
  const current = steps[step];
  
  if (!isOpen) return null;
  if (user?.finishTutorial === true && !tutorialAgain) return null;

  const stepComponents = [<Step1 />, <Step2 />, <Step3 />];
  const titles = [
    t('personalInfo'),   
    t('workspace'),      
    t('doneFirstname'),  
  ];
  

  return (
    <ModalBlackBgTemplate
      close={finishTutorialFn}
      customStyle={{
        maxHeight: "75vh",
        minHeight: "auto",
        width: "600px",
        height:'100vh',
        textAlign: "center",
        overflow:"hidden"
      }}
    >
      <HeaderCard
        setState={finishTutorialFn}
        title={
          <>
           {titles[step]}
           {step != 2 && (
           <>
           :
            <span>
              {t("step")} {step+1} {t("of")} 3
            </span>
           </>
           )}
          </>
        }
      >
        <div className={styles.helpContainer}>
        <HelpIcon className={styles.helpIcon}/>
        <span>{t('help')}</span>
        </div>
        <Button action={nextStep}>{t("next")}</Button>
      </HeaderCard>
      <div className={styles.contentContainer}>
        <div className={styles.stepIndicator}>
          {steps.map((_, index) => (
            <div
              key={index}
              className={`${styles.stepDot} ${index === step ? styles.stepDotActive : ""}`}
            />
          ))}
        </div>
        {stepComponents[step]}
      </div>
    </ModalBlackBgTemplate>
  );
};

export default NewUserInformation;
