import React, { useEffect, useState } from 'react';
import styles from './Landing.module.css';
import Navbar from '../../components/Navbar/Navbar';
import NavHeader from '../../components/NavHeader/NavHeader';
import CookiePopup from '../../components/CookiePopup/CookiePopup';
import Packs from '../Packs/Packs';
import FooterLanding from '../../components/FooterLanding/FooterLanding';
import { useParams } from 'react-router-dom';
import { reinitI18n } from '../../../../i18';
import { useTranslation } from 'react-i18next';


const Landing = () => {
  const params = useParams();
  const [idVariant, setIdVariant] = useState('Factura');
  const { t } = useTranslation('Landing');
  const customVariants = [
    "AutoGpt",
    "ClinicGpt",
    "ContaGpt",
    "DeliverGpt",
    "DocGpt",
    "EduGpt",
    "IndustryGpt",
    "LegalGpt",
    "ObraGpt",
    "RepoGpt",
    "StateGpt",
    "TalkGpt",
    "TicketGpt",
    "VitaeGpt",
  ]
  useEffect(() => {
    
    const capitalizedId = params.id
    ? params.id.charAt(0).toUpperCase() + params.id.slice(1).toLowerCase()
    : null;

  if (params.id && params.id !== 'null' && params.id !== null) {
    if (capitalizedId && customVariants.includes(capitalizedId)) {
      localStorage.setItem('translationId', capitalizedId);
      setIdVariant(capitalizedId);
    } else {
      localStorage.setItem('translationId', 'Factura');
      setIdVariant('Factura');
    }
  }



    if (params.referralCode) {
      localStorage.setItem('referralCode', params.referralCode);
    }

    const translationId = localStorage.getItem("translationId");
    document.title = `${translationId?.replace(translationId?.slice(translationId?.length - 3, translationId?.length),'GPT')?.toUpperCase() || t("facturaGPT")}`;
    reinitI18n();
  }, [params.id, params.referralCode]); 

  return (
    <div className={styles.landingContainer}>
      <Navbar />
      <NavHeader />

      <Packs />
      <CookiePopup />
      <FooterLanding />
    </div>
  );
};

export default Landing;
