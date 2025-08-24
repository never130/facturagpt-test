import React from 'react'

import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import { ReactComponent as CloseMenu } from "../../assets/closeMenu.svg";
import { ReactComponent as PdfIcon2 } from "../../assets/pdfIcon2.svg";

import styles from './Notification.module.css'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';


const Notification = ({notification}) => {
    const { t } = useTranslation("navbarAdmin");

    const { showNotification } = useSelector((state) => state.user);

    const handleClose = () => {

    }


    return (
        <div className={styles.popUpNotifications}>

            <HeaderCard title={`Subiendo 1 documento`} setState={handleClose} titleStyle={{fontSize:"15px"}}>
                <Button type="white" action={handleClose}>
                    <CloseMenu
                    />
                </Button>
             
            </HeaderCard>


         
            <div className={styles.content}>
                <div className={styles.leftContent}>
                <PdfIcon2 />
                <p>{showNotification?.fileName?.name ? showNotification?.fileName?.name : "Cargando documento" }</p>
         
                </div>
                <div class={styles.spinner}></div>
            </div>
        </div>
    )
}


export default Notification