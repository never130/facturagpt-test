import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./PayMethod.module.css";
import { FaChevronDown } from "react-icons/fa";
import visa from "../../../assets/visaPayment.png";
import mastercard from "../../../assets/mastercardPayment.png";
import americanexpress from "../../../assets/americanExpressPayment.png";
import paypal from "../../../assets/paypalPayment.png";
import gpay from "../../../assets/gPayment.png";
import metamask from "../../../assets/metamaskPayment.png";
import coinbase from "../../../assets/coinbasePayment.png";
import creditCard from "../../../assets/creditCardIcon.png";
import Button from "../../Button/Button";
import DeleteButton from "../../DeleteButton/DeleteButton";


const defaultPaymentMethods = [
  {
    value: "creditCard",
    label: "Credit Card",
    images: [visa, mastercard, americanexpress],
  },
  {
    value: "paypal",
    label: "Paypal",
    images: [paypal],
  },
  {
    value: "gPay",
    label: "Google Pay",
    images: [gpay],
  },
  {
    value: "crypto",
    label: "Crypto",
    images: [metamask, coinbase],
  },
];

const PayMethod = ({
  userData,
  setUserData,
  setShowAddPayMethodPopup,
  setDefaultPayMethod,
  setDeletePayMethods,
}) => {
  const { t } = useTranslation("accountSetting");
  const dispatch = useDispatch();





  const [payMethods, setPayMethods] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState({});


  useEffect(() => {
    if (userData?.payMethod) {
      setPayMethods(
        Array.isArray(userData.payMethod) ? userData.payMethod : []
      );
    }
  }, [userData]);

  const handleAddPayMethod = () => {
    setShowAddPayMethodPopup(true);
  };


  const updatePayMethodAtIndex = (index, updatedData) => {
    setPayMethods((prev) => {
      const newMethods = [...prev];
      newMethods[index] = {
        ...newMethods[index],
        ...updatedData,
      };
      return newMethods;
    });
  };


  const handleSavePayMethods = () => {
    setUserData((prev) => ({
      ...prev,
      payMethod: payMethods,
    }));
  };

  const toggleExpand = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const deletePaymethod = async (id) => {
    setDeletePayMethods((prev) => [...prev, id]);

    const updatedPayMethods = payMethods.filter((method) => method.id !== id);
    setPayMethods(updatedPayMethods);
    setUserData((prev) => ({
      ...prev,
      payMethod: updatedPayMethods,
    }));
  };

  return (
    <div
      className={styles.payMethodContainer}
      onClick={(e) => {
        if (e.target.tagName !== "INPUT") {
          e.preventDefault();
        }
      }}
    >
      <div className={styles.row}>
        <p>{t("payMethods")}</p>
        <div className={styles.btnContainerPayMethod}>
          <Button
            type="white"
            headerStyle={{ borderRadius: "999px" }}
            action={(e) => {
              e.stopPropagation();
              handleAddPayMethod();
            }}
          >
            {t("add")}
          </Button>
          <Button action={handleSavePayMethods}>{t("save")}</Button>
        </div>
      </div>
 
      {payMethods.length === 0 && (
        <span style={{ color: "#71717a", marginTop: "10px" }}>
          {t("unknown")}
        </span>
      )}

      {[...payMethods]
        .sort((a, b) => (b.default === true) - (a.default === true))
        .map((payMethod, index) => (
          <div
            key={index}
            className={styles.payContainer}
            style={{ marginBottom: "20px" }}
          >
            <div
              className={styles.headerPayMethod}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(index);
              }}
            >
              <div>
                <span>**** **** **** {payMethod.last4 || ""}</span>
                <img src={visa} alt="" />
                <img src={mastercard} alt="" />
                <img src={americanexpress} alt="" />
              </div>

              <div>
                <DeleteButton
                  action={(e) => {
                    e.stopPropagation();
                    deletePaymethod(payMethod.id);
                  }}
                />
                <FaChevronDown
                  style={{
                    transform: expandedIndexes[index] && "rotate(180deg)",
                    transition: "all 300ms",
                  }}
                />
              </div>
            </div>

            {expandedIndexes[index] && (
              <div>
                <div className={styles.paymentMethod}>
                  {defaultPaymentMethods.map((method) => (
                    <div key={method.value} className={styles.paymentContainer}>
                      <input
                        type="radio"
                        name={`paymentMethod-${index}`}
                        disabled={method.value !== "creditCard"}
                        checked={method.value == "creditCard"}
                        onChange={() =>
                          updatePayMethodAtIndex(index, {
                            paymentMethod: method.value,
                          })
                        }
                      />
                      <div className={styles.paymentContainer}>
                        {method.images.map((imgSrc, i) => (
                          <div key={i} className={styles.paymentImage}>
                            <img src={imgSrc} alt={`${method.label} logo`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {payMethod.type === "creditCard" && (
                  <>
                    <div style={{ marginTop: "10px" }}>
                      <div className={styles.row}>{t("cardNumber")}</div>
                      <div className={styles.inputContainer}>
                        <span>**** **** **** {payMethod.last4 || ""}</span>
                        <img
                          src={creditCard}
                          alt="Credit Card Icon"
                          className={styles.icon}
                        />
                      </div>
                    </div>

                    <div className={styles.expirationDateSecurityCodeContainer}>
                      <div>
                        <div className={styles.row}>{t("expirationDate")}</div>
                        <div className={styles.inputContainer}>
                          <span>
                            {payMethod.exp_month || ""}/{payMethod?.exp_year}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className={styles.row}>{t("securityCode")}</div>
                        <div className={styles.inputContainer}>
                          <span>***</span>
                        </div>
                      </div>
                    </div>
                    <div
                    className={styles.defaultPaymethod}
                      onClick={() => {
                        setDefaultPayMethod(payMethod.id);

                        const updatedPayMethods = payMethods.map((method) => ({
                          ...method,
                          default: method.id === payMethod.id,
                        }));

                        setPayMethods(updatedPayMethods);
                        setUserData((prev) => ({
                          ...prev,
                          payMethod: updatedPayMethods,
                        }));
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={payMethod.default}
                        readOnly
                      />
                      <span>{t("defaultPayMethod")}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default PayMethod;
