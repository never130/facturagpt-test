import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import facturaLogo from "../../assets/facturaGPTBlackIcon.svg";
import menuIcon from "../../assets/menuIconBlack.svg"; 
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ReactComponent as ArrowGray } from "../../assets/arrowDownGray.svg";
import { languageFlags } from "../../../../utils/flags";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18";
import { useSelector } from "react-redux";
import HeaderCard from "../HeaderCard/HeaderCard";
import Solutions from "./Solutions/Solutions";
import LanguagesPopup from "../LanguagesPopup/LanguagesPopup";
import SaaS from "./SaaS/SaaS";
import AboutUs from "./AboutUs/AboutUs";
const Navbar = ({variant}) => {
  const [t] = useTranslation("Landing");

  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showSaas,setShowSaas] = useState(false)
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const idTest = localStorage.getItem("translationId");

    if (location.pathname === "/home" && idTest !== 'null' && idTest !== null) {
      navigate(`/go/${idTest}`);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLanguage = (lng) => {
    localStorage.setItem("language", lng);
    i18n.changeLanguage(lng);
  };

  const handleProfileClick = () => {
    navigate("/admin/chat");
  };
const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showlanguageMobile, setShowlanguageMobile] = useState(false);



  const [idVariant, setIdVariant] = useState(() => {
    
    return localStorage.getItem("translationId") || "Factura";
  });

  useEffect(() => {
    const translationId = localStorage.getItem("translationId");
    if (translationId !== idVariant) {
      if(translationId){
        setIdVariant(translationId);
      }
    }
  }, [ localStorage.getItem("translationId")]);

  return (
    <nav className={styles.navbar}>
      {showSolutions && isMobile ? (
        <div
          className={styles.buttonContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <HeaderCard
            title={t('solutions')}
            setState={setShowSolutions}
            headerStyle={{
              width: "100%",
              background: "transparent",
              padding: "0",
            }}
          ></HeaderCard>
        </div>
      ) : (
<div className={styles.name}>
  <img
    onClick={() => navigate("/home")}
    src={facturaLogo}
    alt="FacturaGPT"
    className={styles.logo}
  />
  {idVariant == "Factura" ? idVariant : idVariant?.slice(0, -3) }
  <span><strong>Gpt</strong></span>
</div>


      )}
      <button className={styles.hamburger} onClick={toggleMenu}>
        <img src={menuIcon} alt="Menu Icon" />
      </button>
      {menuOpen && (
        <div className={styles.ScreenOut} onClick={toggleMenu}></div>
      )}
      <div
        className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : styles.navLinksClosed} ${user && styles.profileStart}`}
      >
        <div className={styles.navFlex}>
          <div className={styles.nav}>
            {["home","product","solutions","aboutUs", "demo","rates"  ].map(
              (link, index) => (
                <div
                  key={index}
                  {...(link !== "solutions"
                    ? { 
                      onClick: () => {
                        if (link === 'demo') {
                          navigate('/contact');
                        } else if (link === 'rates') {
                          navigate('/pricing');
                        } else {
                          navigate(`/${link == 'home' ? 'home' : link}`);
                        }
                      }
                    }
                    : {})}
                  className={`${location.pathname.slice(1) !== link
                      ? styles.disabledBtn
                      : ""
                    }`}
                >
                  {link === "solutions" ? (
                    <div
                      className={styles.solucionesWrapper}
                    
                    >
                      <span
                       className={styles.solucionesHover}
                       onClick={(e) => {
                        e.stopPropagation()
                         isMobile && setShowSolutions(true)
                        setMenuOpen(false)
                       }}
                       >
                        {t(`${link}`)}
                        <ArrowGray className={styles.icon} />
                      </span>
                      <Solutions
                        showSolutions={showSolutions}
                        setShowSolutions={setShowSolutions}
                        isMobile={isMobile}
                      />
                    </div>
                  ) :link === "product" ? (
                    <>
                       <div
                      className={styles.solucionesWrapper}
               
                    >
                      <span
                       className={styles.solucionesHover}
                       onClick={(e) => {
                        e.stopPropagation()
                         isMobile && setShowSaas(true)
                        setMenuOpen(false)
                       }}
                       >
                        {t(`${link}`)}
                        <ArrowGray className={styles.icon} />
                      </span>
                    <SaaS setShowSaas={setShowSaas} showSaas={showSaas} isMobile={isMobile}/>
                   
                    </div></>
                  ):link === 'aboutUs' ? (
                    <>
                    <div
                   className={styles.solucionesWrapper}
            
                 >
                   <span
                    className={styles.solucionesHover}
                    onClick={(e) => {
                     e.stopPropagation()
                      isMobile && setShowAboutUs(true)
                     setMenuOpen(false)
                    }}
                    >
                     {t(`${link}`)}
                     <ArrowGray className={styles.icon} />
                   </span>
                 <AboutUs setShowAboutUs={setShowAboutUs} showAboutUs={showAboutUs} isMobile={isMobile}/>
                
                 </div></>
                  ): link === "language" ? (
                    <div
                      className={`${styles.language} ${styles.languagecontainer}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (width >= 768) {

                          setShowLanguageOptions(true); 
                        } else {
                          setShowlanguageMobile(true); 
                        }
                      }}
                    >
                      <span className={styles.languageHover}>
                        {t(`${link}`)}
                        <ArrowGray className={styles.icon} />
                      </span>
                      <div
                        className={`${styles.languageDropdown} ${showLanguageOptions && styles.showLanguageOptions}`}
                      >
                          {languageFlags.map((item) => (
                          <div
                            key={item.code || item.value} 
                            className={styles.dropdownItem}
                            onClick={() => {
                              handleLanguage(item.text)
                            }}
                          >
                            {item.flag}
                            {item.value}
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.test}>{t(`${link}`)}</div>
                  )}
                </div>
              )
            )}
          </div>


        </div>

        {!user ? (
          <div className={styles.btnContainerNavbar}>
            <button
              className={`${styles.button} ${styles.buttonLogIn}`}
              onClick={() => navigate("/login")}
            >
              {t("logIn")}
            </button>
            <button
              className={styles.button}
              onClick={() => navigate("/freetrial")}
            >
              {t("button")}
            </button>
          </div>
        ) : (
          <div onClick={handleProfileClick} className={styles.profileContainer}>
            <div className={styles.profileText}>
{user?.nombre?.length >=23 && <p className={styles.pWithTooltip} data-tooltip={user?.nombre}>{`${user?.nombre.slice(0,22)}..`}</p> }

                {user?.nombre?.length <=22 &&<p>{user?.nombre || t("noFound")}</p>}

              <span>{user?.role}</span>
            </div>
            {user?.profileImage && !imageError ? (
              <img
                className={styles.profileImage}
                src={user.profileImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={styles.initials}>
                {user?.nombre?.split(" ").map((word) => word[0] || "U")}
              </div>
            )}
          </div>
        )}
      </div>
      {showlanguageMobile && <LanguagesPopup setShowlanguageMobile={setShowlanguageMobile}/>}
    </nav>
  );
};

export default Navbar;
