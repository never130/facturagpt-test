import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./UpgradePlan.module.css";
import greenStar from "../../assets/greenStar.svg";
import grayCard from "../../assets/grayCard.svg";
import InputWithTitle from "../../components/InputWithTitle/InputWithTitle";
import CheckboxWithText from "../../components/CheckboxWithText/CheckboxWithText";
import greenTagIcon from "../../assets/greenTagIcon.svg";
import { ReactComponent as MoreInfoIcon } from "../../assets/moreInfoIcon.svg";
import PaymentSingleOption from "../../components/PaymentSingleOption/PaymentSingleOption";
import PlanUpdatedModal from "../../components/PlanUpdatedModal/PlanUpdatedModal";
import HeaderCard from "../../components/HeaderCard/HeaderCard";
import useCloseOnEsc from "../../../../utils/useClose";

import { paymentMethods, plansPricing } from "./consts";

import visaIcon from "../../assets/visaIcon.svg";

import DetailsBillLabel from "../../components/InfoContact/DetailsBillLabel/DetailsBillLabel";

import { updateAccount } from "@src/actions/user";
import { attachCustomPaymentMethod } from "@src/actions/stripe";

import Button from "../../components/Button/Button";
import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UpgradePlanModal = ({
  user,
  isClosing,
  handleClose,
  selectedPaymentOption,
  setSelectedPaymentOption,
  afiliatedCode,
  setAfiliatedCode,
  handleSaveData,
  selectedPlan,
  setCardNumber,
  isProcessing,
  expirationDate,
  selectedCurrentPaymentMethond,
  cardNumber,
  securityCode,
  handleExpirationChange,
  savePaymentInfo,
  setSavePaymentInfo,
  setSecurityCode,
  setExpirationDate,
  setShowSelectCurrencyPopup
}) => {
  const { t } = useTranslation("navbarAdmin");
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [billingDetails, setBillingDetails] = useState([]);

  useEffect(() => {
    if (user?.billingDetails) {
      setBillingDetails([...user.billingDetails]);
    }
  }, [user]);
  const [message, setMessage] = useState("");

  const handleSaveUpgrade = async () => {
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: {
        email: billingDetails.email,
        address: {
          country: billingDetails.country,
          postal_code: billingDetails.zipCode
        }
      }
    });


    if (paymentMethod) {

      const userDataToSave = {
        payMethod: [
          ...(user.payMethod || []),
          {
            id: paymentMethod?.id,
            brand: paymentMethod?.card?.brand,
            last4: paymentMethod?.card?.last4,
            exp_month: paymentMethod?.card?.exp_month,
            exp_year: paymentMethod?.card?.exp_year,
            country: paymentMethod?.card?.country,
            funding: paymentMethod?.card?.funding,
            type: "creditCard",
            createdAt: Date.now()
          }],
        billingDetails: billingDetails,
      };
      ("saving1 user data 2", userDataToSave);
      dispatch(updateAccount({ data: userDataToSave }));

      const response = await dispatch(attachCustomPaymentMethod({
        id: paymentMethod.id,
        type: paymentMethod.type,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
        country: paymentMethod.card.country,
      }));




      if (response.payload.success) {
        setMessage("Se valido el metodo de pago correctamente");
      } else {
        setMessage(result?.error?.message);
      }
    }

  };

  const handleCardNumberChange = (event) => {
    setCardNumber(event.complete);
  };

  const handleExpiryChange = (event) => {
    setExpirationDate(event.complete);
  };

  const handleCvcChange = (event) => {
    setSecurityCode(event.complete);
  };
  const [inputsEditing, setInputsEditing] = useState({
    email: false,
    zipCode: false,
    country: false,
  });

  const handleContactData = (field, value) => {
    const formattedValue = value;

    setBillingDetails((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`${styles.upgradePlanContainer} ${isClosing ? styles.scaleDown : ""}`}
    >
      <HeaderCard
        title={
          <div className={styles.titleWithIcon}>
            <h3>{t("improvePlan")}</h3>
            <img src={greenStar} alt="greenStar" />
          </div>
        }
        setState={handleClose}
      >
        <Button
          headerStyle={{ all: "unset" }}
          action={() => navigate("/contact")}
        >
          <MoreInfoIcon className={styles.moreInfoContainer} />
        </Button>
      </HeaderCard>
      <div className={styles.content}>
        <div className={styles.rightContainer}>
          <span className={styles.lightText}>{t("billingFirstDay")}</span>
          <h2 className={styles.upgradePlanTitle}>{t("payMethod")}</h2>
          <div
            className={`${styles.paymentMethodsContainer} ${styles.paymentMethodsContainerGrid}`}
          >
            {paymentMethods?.map((method, index) => (
              <PaymentSingleOption
                key={index}
                {...method}
                paymentMethod={selectedPaymentOption}
                setPaymentMethod={setSelectedPaymentOption}
                showDate={false}
              />
            ))}
          </div>

          <div className={styles.separator} />
          <span className={styles.lightTextRight}>
            {t("localTaxesNotIncluded")}
          </span>
          <div className={styles.greenTag}>
            <img src={greenTagIcon} alt="greenTagIcon" />
            <span className={styles.greenText}>{t("addAffiliateCode")}</span>
          </div>
          <div className={styles.validateContainer}>
            <input
              className={styles.validateInput}
              type="text"
              value={afiliatedCode}
              placeholder="0000"
              onChange={(e) => {
                const value = e.target.value;
                setAfiliatedCode(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "+" || e.key === "-") {
                  e.preventDefault();
                }
              }}
            />
            <span className={styles.validateButton}>{t("validate")}</span>
          </div>
          <div className={styles.spacedBetween}>
            <span>{t("discount")}</span>
            <span style={{ color: "#929598" }}>10 %</span>
          </div>
          <div className={styles.separator} />
          <button
            onClick={() => {
              handleSaveData();
            }}
            className={styles.upgradePlanButton}
          >
            {isProcessing ? (
              <span>{t("processing")}</span>
            ) : (
              <span>
                {t("improvePlan")}
                <strong> {selectedPlan}</strong>
              </span>
            )}
          </button>
          <div className={styles.currencyContainer}>
            {t("pricesIn")}
            <span onClick={() => setShowSelectCurrencyPopup(true)}>
              {t("changeCurrency")}
            </span>
          </div>
          <p className={styles.bottomText}>
            * {t("obtain")}{" "}
            <a href="/help/yourAccount" className={styles.link}>
              {t("moreInformation")}
            </a>{" "}
            {t("aboutTaxesDuties")}
          </p>
        </div>
        <div className={styles.leftContainer}>
          <h2 className={styles.upgradePlanTitle}>{t("pay")}</h2>
          <div className={styles.stripeContainerFlex}>
            <div>
              <span>{t('cardNumber')}</span>
              <CardNumberElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      backgroundColor: "#f0f0f0",
                      padding: "12px",
                      borderRadius: "4px",
                      lineHeight: "24px",
                      iconColor: "#666EE8",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                      iconColor: "#9e2146",
                    },
                  },
                  hideIcon: false,
                  disableLink: true,
                }}
                onChange={handleCardNumberChange}
              />
            </div>
          </div>

          <div className={styles.stripeContainerFlex}>
            <div>
              <span>{t('expiryDate')}</span>
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      backgroundColor: "#f0f0f0",
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                  disableLink: true,
                }}
                onChange={handleExpiryChange}
              />
            </div>
            <div>
              <span>{t('securityCode')}</span>
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      backgroundColor: "#f0f0f0",
                      width: "100%",
                      borderRadius: "4px",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                  disableLink: true,
                }}
                onChange={handleCvcChange}
              />
            </div>
          </div>
          <span
            style={{
              color:
                message == "Se valido el metodo de pago correctamente"
                  ? "green"
                  : "red",
            }}
          >
            {message}
          </span>
          <CheckboxWithText
            state={savePaymentInfo}
            setState={setSavePaymentInfo}
            text={t("savePaymentInformation")}
          />
          jdjj
          <h3>{t('billingDetails')}</h3>
          <DetailsBillLabel
            user={user}
            billingDetails={billingDetails}
            setBillingDetails={setBillingDetails}
            handleSave={handleSaveUpgrade}
          />
        </div>
      </div>
    </div>
  );
};

const ShowPaymentMethodsModal = ({
  user,
  isClosing,
  handleClose,
  selectedCurrentPaymentMethond,
  currentPaymentMethods,
  setSelectedCurrentPaymentMethod,
  handleSave,
  billingDetails,
  setBillingDetails,
}) => {
  const { t } = useTranslation("navbarAdmin");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [payMethods, setPaymethods] = useState([])
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setUserData(user)
    setPaymethods(Array.isArray(user?.payMethod) ? user.payMethod : [])
    setIsLoading(false)
  }, [user])

  const handleSaveUser = (data) => {
    if (data) {

      const userDataToSave = {
        ...user,
        payMethod: data,
      };

      dispatch(updateAccount({ data: userDataToSave }));
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`${styles.upgradePlanContainer} ${isClosing ? styles.scaleDown : ""}`}
    >
      <HeaderCard
        title={
          <div className={styles.titleWithIcon}>
            <h3>{t("improvePlan")}</h3>
            <img src={greenStar} alt="greenStar" />
          </div>
        }
        setState={handleClose}
      ></HeaderCard>
      <div className={styles.content}>
        <div
          className={styles.leftContainer}
          style={{
            borderRight: "1px solid #E3E3E3",
            paddingBottom: "24px",
            width: "100%",
          }}
        >
          <h2 className={styles.upgradePlanTitle}>{t("payMethod")}</h2>
          <div

            className={styles.spacedBetween}
          >
            <span>
              {
                Array.isArray(userData?.payMethod) ?
                  userData.payMethod.find((method) => method.default)?.type || "" : ""
              }{" "}
              {t("endingIn")}{" "}
              {
                Array.isArray(userData?.payMethod) ?
                  userData.payMethod.find((method) => method.default)?.last4 || "" : ""
              }
            </span>


          </div>
          <div className={styles.paymentMethodsContainer}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <span>{t("loading")}</span>
              </div>
            ) : Array.isArray(userData?.payMethod) && userData.payMethod.length > 0 ? (
              [...userData.payMethod]
                .sort((a, b) => (b.default === true) - (a.default === true))
                .map((method, index) => (
                  <PaymentSingleOption
                    key={index}
                    {...method}
                    isDefault={method.default}
                    setPaymethods={setUserData}
                    payMethods={userData.payMethod}
                    onSaveUser={handleSaveUser}
                  />
                ))
            ) : (
              <div className={styles.noPaymentMethods}>
                <span>{t("noPaymentMethods")}</span>
              </div>
            )}
          </div>
          <strong
            onClick={() => {
              const currentPath = location.pathname;

              const cleanedPath = currentPath.replace(/\/settings\/[^/]+$/, '');

              navigate(`${cleanedPath}/settings/account`);
              handleClose()
            }}
            className={styles.addPaymentMethod}
          >
            {t("addPayMethod")}
          </strong>
          <DetailsBillLabel
            user={user}
            billingDetails={billingDetails}
            setBillingDetails={setBillingDetails}
            handleSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

const UpgradePlan = ({
  onClose,
  setShowSelectCurrencyPopup,
  setSeeHistory,
  seeHistory,
  isAnimating,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("navbarAdmin");
  const { user } = useSelector((state) => state.user);
  const [selectedModal, setSelectedModal] = useState("upgradePlan");
  const [billingDetails, setBillingDetails] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(user?.userPlan || "Plus");

  useEffect(() => {
    if (user?.billingDetails) {
      setBillingDetails([...user.billingDetails]);
    }
  }, [user]);

  const [cardNumber, setCardNumber] = useState(
    user?.payMethod?.cardNumber || ""
  );
  const [expirationDate, setExpirationDate] = useState(
    user?.payMethod?.expirationDate || ""
  );
  const [securityCode, setSecurityCode] = useState(
    user?.payMethod?.securityCode || ""
  );
  const [email, setEmail] = useState(
    user?.facturationEmail || user?.email || ""
  );
  const [areaCode, setAreaCode] = useState(user?.areaCode || "");
  const [country, setCountry] = useState(user?.country || "");
  const [savePaymentInfo, setSavePaymentInfo] = useState(true);
  const [afiliatedCode, setAfiliatedCode] = useState(
    user?.referralCode || localStorage.getItem("referralCode")
  );
  const [showUpdatedSuccessfully, setShowUpdatedSuccessfully] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    user?.payMethod?.paymentMethod || "creditCard"
  );
  const [selectedCurrentPaymentMethond, setSelectedCurrentPaymentMethod] =
    useState(user?.payMethod?.paymentMethod || "gPay");
  const [isClosing, setIsClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setAfiliatedCode(localStorage.getItem("referralCode"));
  }, [localStorage.getItem("referralCode")]);

  useCloseOnEsc(onClose);
  const rates = {
    EUR: 1,
    AED: 3.95,
    AFN: 76.69,
    ALL: 98.73,
    AMD: 422.76,
    ANG: 1.93,
    AOA: 1011.31,
    ARS: 1153.79,
    AUD: 1.71,
    AWG: 1.93,
    AZN: 1.83,
    BAM: 1.96,
    BBD: 2.15,
    BDT: 130.74,
    BGN: 1.96,
    BHD: 0.405,
    BIF: 3199.06,
    BMD: 1.08,
    BND: 1.44,
    BOB: 7.47,
    BRL: 6.16,
    BSD: 1.08,
    BTN: 92.33,
    BWP: 14.83,
    BYN: 3.47,
    BZD: 2.15,
    CAD: 1.54,
    CDF: 3080.57,
    CHF: 0.952,
    CLP: 993.61,
    CNY: 7.83,
    COP: 4434.23,
    CRC: 538.72,
    CUP: 25.83,
    CVE: 110.27,
    CZK: 24.91,
    DJF: 191.27,
    DKK: 7.46,
    DOP: 68.22,
    DZD: 144.7,
    EGP: 54.54,
    ERN: 16.14,
    ETB: 141.76,
    FJD: 2.48,
    FKP: 0.835,
    FOK: 7.46,
    GBP: 0.835,
    GEL: 2.99,
    GGP: 0.835,
    GHS: 16.76,
    GIP: 0.835,
    GMD: 78.29,
    GNF: 9283.79,
    GTQ: 8.32,
    GYD: 225.71,
    HKD: 8.37,
    HNL: 27.63,
    HRK: 7.53,
    HTG: 141.52,
    HUF: 400.43,
    IDR: 17870.14,
    ILS: 3.97,
    IMP: 0.835,
    INR: 92.33,
    IQD: 1415.75,
    IRR: 45935.61,
    ISK: 143.67,
    JEP: 0.835,
    JMD: 168.74,
    JOD: 0.763,
    JPY: 161.87,
    KES: 139.54,
    KGS: 93.64,
    KHR: 4320.81,
    KID: 1.71,
    KMF: 491.97,
    KRW: 1580.75,
    KWD: 0.333,
    KYD: 0.897,
    KZT: 539.72,
    LAK: 23614.81,
    LBP: 96321.32,
    LKR: 319.32,
    LRD: 215.88,
    LSL: 19.66,
    LYD: 5.21,
    MAD: 10.36,
    MDL: 19.43,
    MGA: 4919.23,
    MKD: 61.7,
    MMK: 3051.35,
    MNT: 3761.41,
    MOP: 8.62,
    MRU: 43.05,
    MUR: 49.25,
    MVR: 16.68,
    MWK: 1879,
    MXN: 21.71,
    MYR: 4.77,
    MZN: 68.9,
    NAD: 19.66,
    NGN: 1658.3,
    NIO: 39.72,
    NOK: 11.35,
    NPR: 147.72,
    NZD: 1.88,
    OMR: 0.414,
    PAB: 1.08,
    PEN: 3.92,
    PGK: 4.44,
    PHP: 62.23,
    PKR: 301.57,
    PLN: 4.18,
    PYG: 8693.17,
    QAR: 3.92,
    RON: 4.98,
    RSD: 117.21,
    RUB: 90.62,
    RWF: 1549.54,
    SAR: 4.04,
    SBD: 8.85,
    SCR: 15.78,
    SDG: 482.18,
    SEK: 10.82,
    SGD: 1.44,
    SHP: 0.835,
    SLE: 24.54,
    SLL: 24541.79,
    SOS: 616.11,
    SRD: 39.76,
    SSP: 4904.86,
    STN: 24.5,
    SYP: 13945.16,
    SZL: 19.66,
    THB: 36.59,
    TJS: 11.78,
    TMT: 3.78,
    TND: 3.35,
    TOP: 2.57,
    TRY: 41,
    TTD: 7.89,
    TVD: 1.71,
    TWD: 35.69,
    TZS: 2856,
    UAH: 44.88,
    UGX: 3957.26,
    USD: 1.08,
    UYU: 45.48,
    UZS: 13910.2,
    VES: 74.45,
    VND: 27669.65,
    VUV: 131.27,
    WST: 3,
    XAF: 655.96,
    XCD: 2.91,
    XCG: 1.93,
    XDR: 0.814,
    XOF: 655.96,
    XPF: 119.33,
    YER: 265.61,
    ZAR: 19.65,
    ZMW: 31.19,
    ZWL: 28.82,
  };
  useEffect(() => {
    if (user.paymentMethodId) {
      setSelectedModal("methodPlan");
    }
  }, [user]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSaveData = async () => {
    try {
      setIsProcessing(true);


      const dataAccount = {
        email,
        areaCode,
        country,
        userPlan: selectedPlan,
        facturationEmail: email,
        referralCode: afiliatedCode,
        paymentMethod: {
          method: selectedPaymentOption,
          details: {
          },
        },
      };

      const response = await dispatch(
        attachCustomPaymentMethod({
          cardNumber,
          expirationDate,
          securityCode,
        })
      );

      const _response = await dispatch(
        updateAccount({
          data: afiliatedCode,
        })
      );






      setShowUpdatedSuccessfully(true);
    } catch (error) {
      console.error("Error during update or payment intent creation:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleExpirationChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val.length >= 3) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }

    if (val.length > 5) {
      val = val.slice(0, 5);
    }

    setExpirationDate(val);
  };


  const handleSave = async () => {
    const userDataToSave = {
      billingDetails: billingDetails,
    };
    dispatch(updateAccount({ data: userDataToSave }));
  };

  const publicKey =
    // "pk_test_51RN35zQ4aaP8AJy7HHcwnhM2EqrDNRyPWIohL4cTCQTV7xdeDcKjkYNrcY1yXZeDdcRaUIyupOujuQCgigStxkXZ001iU32eOG";
    "pk_live_51RU836ArbxvCEfvZCcefKJ0VvOkw9ZxQa5XsZiltbdqoA21LcGKLJU6WkKZUJuUge4g34NEoURvF41n9KcFGe79y00vmB4eBWo";
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(loadStripe(publicKey));
  }, []);

  return (
    <div
      onClick={handleClose}
      className={`${styles.modalContainer} ${isClosing ? styles.fadeOut : ""}`}
    >
      {user?.payMethod?.length == 0 || !user?.payMethod ? (
        <Elements stripe={stripePromise}>
          <UpgradePlanModal
            user={user}
            isClosing={isClosing}
            handleClose={handleClose}
            selectedPaymentOption={selectedPaymentOption}
            setSelectedPaymentOption={setSelectedPaymentOption}
            afiliatedCode={afiliatedCode}
            setAfiliatedCode={setAfiliatedCode}
            handleSaveData={handleSaveData}
            selectedPlan={selectedPlan}
            setCardNumber={setCardNumber}
            setExpirationDate={setExpirationDate}
            isProcessing={isProcessing}
            expirationDate={expirationDate}
            selectedCurrentPaymentMethond={selectedCurrentPaymentMethond}
            cardNumber={cardNumber}
            securityCode={securityCode}
            handleExpirationChange={handleExpirationChange}
            savePaymentInfo={savePaymentInfo}
            setSavePaymentInfo={setSavePaymentInfo}
            setSecurityCode={setSecurityCode}
            setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
          />
        </Elements>
      ) : (
        <ShowPaymentMethodsModal
          user={user}
          isClosing={isClosing}
          handleClose={handleClose}
          selectedCurrentPaymentMethond={selectedCurrentPaymentMethond}
          setSelectedCurrentPaymentMethod={setSelectedCurrentPaymentMethod}
          handleSave={handleSave}
          billingDetails={billingDetails}
          setBillingDetails={setBillingDetails}
        />
      )}

      {showUpdatedSuccessfully && (
        <PlanUpdatedModal
          setSeeHistory={setSeeHistory}
          onClose={async () => {
            setShowUpdatedSuccessfully(false);
            setTimeout(() => {
              handleClose();
            }, 80);
          }}
        />
      )}
    </div>
  );
};

export default UpgradePlan;
