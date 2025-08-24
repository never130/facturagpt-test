import React, { useEffect, useState } from "react";
import styles from "./SeeHistory.module.css";
import arrow from "../../assets/arrow.svg";
import pdfIcon from "../../assets/pdfmask.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvoices } from "../../../../actions/user";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

const historyData = [
  {
    planType: "Plus",
    invoice: {
      number: "20-2.000",
      paymentDate: "1 ene 2025",
      paymentMethod: "Google Pay, Visa terminada en 2069",
    },
    breakdown: {
      basePlan: "320,10",
      discount: {
        percentage: "10",
        amount: "32,01",
      },
      subtotal: "288,09",
      vat: {
        percentage: "21",
        amount: "60,4989",
      },
      total: "348,5089",
    },
  },
  {
    planType: "Pro",
    invoice: {
      number: "2.000-20.000",
      paymentDate: "1 ene 2025",
      paymentMethod: "Apple Pay, Visa terminada en 2069",
    },
    breakdown: {
      basePlan: "2.400,20",
      discount: {
        percentage: "10",
        amount: "240,02",
      },
      subtotal: "2.160,18",
      vat: {
        percentage: "21",
        amount: "453,6378",
      },
      total: "2.613,8178",
    },
  },
  {
    planType: "Enterprise",
    invoice: {
      number: "20.000-50.000",
      paymentDate: "1 ene 2025",
      paymentMethod: "Mastercard, Visa terminada en 2069",
    },
    breakdown: {
      basePlan: "2.400,20",
      discount: {
        percentage: "10",
        amount: "240,02",
      },
      subtotal: "2.160,18",
      vat: {
        percentage: "21",
        amount: "453,6378",
      },
      total: "2.613,8178",
    },
  },
];

const SeeHistory = ({
  setSeeHistory,
  seeHistory,
  isAnimating,
  setIsAnimating,
  setSeeBill,
}) => {
  const { t,i18n  } = useTranslation("navbarAdmin");
  const dispatch = useDispatch()
   const { user} = useSelector((state) => state.user);
   const navigate = useNavigate()
  const [invoices,setInvoices] = useState([])
  useEffect(() => {
    const fetchInvoices = async () => {
      const res = await dispatch(getAllInvoices());
      setInvoices(res?.payload?.invoices)
    };
  
    fetchInvoices();
  }, []); 
  
  



  const handleCloseNewClient = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSeeHistory(false);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && seeHistory) {
        setIsAnimating(true);

        setTimeout(() => {
          setSeeHistory(false);
          setIsAnimating(false);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [seeHistory]);
  const languageMap = {
    Español: "es",
    English: "en",
    日本語: "ja",
    普通话: "zh",
    Deutsch: "de",
    Français: "fr",
    Italiano: "it",
    Português: "pt",
  };
  
  const langCode = languageMap[i18n.language] || "es"; 

  const getDocumentsRange = (tokenMonth) => {
    if (tokenMonth > 100 && tokenMonth < 500) return "20-50";
    if (tokenMonth >= 1000 && tokenMonth < 2000) return "100-300";
    if (tokenMonth >= 2000 && tokenMonth < 4000) return "500-2000";
    return "0"; 
  };
  

  return (
    <>

      <div
        className={`${styles.historyContainer} `}
      >
        <header className={styles.headerHistory}>
          <img src={arrow} onClick={handleCloseNewClient} />
          <p>
            {t('historySavedIn')} /<strong>{user.nombre}</strong>
          </p>
        </header>
        <div className={styles.contentHistory}>
          {invoices.map((item, index) =>{
                const dateToFormat = item?.date;
                const formattedDate = dateToFormat
                  ? new Intl.DateTimeFormat(langCode, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(dateToFormat))
                  : "";
            return(
              <div key={index} className={styles.content}>
              <div className={styles.plan}>
                <p className={styles.planType}>
                  {t('plan')} <strong>{t('Plus')}</strong>
                </p>
                <div className={styles.btns}>
                  <button onClick={() => navigate(`/admin/invoice/${item._id}`)}>
                    <img src={pdfIcon} alt="" />
                    {t('seePdf')}
                  </button>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.row}>
                  <p className={styles.docs}>
                  {getDocumentsRange(item.tokenMonth)}  {t('documents')}
                  </p>
                  <p className={styles.payAt}>
                  {t('paidOn')} {formattedDate}
                  </p>
                </div>
                <div className={`${styles.row} ${styles.title}`}>
                  {t('payMethod')}
                </div>
                <div className={styles.row}>{t('endedIn')} {item?.paymentMethod.last4}</div>
              </div>

              <div className={styles.section}>
                <div className={styles.row}>
                  <p className={styles.title}>
                  {t('plan')} {t('plus')} {t('vatExcluded')}
                  </p>
                  <p className={styles.price}>{item.tokenMonth} $</p>
                </div>
                <div className={styles.row}>
                  <p>
                    {t('discount')}{" "}
                    <span className={styles.txtTransparent}>
                      {item.discount} %
                    </span>
                  </p>
                  <p className={styles.txtTransparent}>
                    -{item.discountAmount}$
                  </p>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.row}>
                  <p className={styles.title}>{t('subtotal')}</p>
                  <p className={styles.price}>{item.subtotal}$</p>
                </div>
                <div className={styles.row}>
                  <p>
                    {t('vat')}<sup>*</sup>
                    <span className={styles.txtTransparent}>
                      21 %
                    </span>
                  </p>
                  <p>{item.vat}$</p>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.row}>
                  <p className={styles.totalIVA}>{t('total')} {t('vatExcluded')}</p>
                  <p className={styles.priceTotal}>{item.total}$</p>
                </div>
              </div>
           
            </div>
            )
          })}
        </div>
      </div>
    </>
  );
};

export default SeeHistory;
