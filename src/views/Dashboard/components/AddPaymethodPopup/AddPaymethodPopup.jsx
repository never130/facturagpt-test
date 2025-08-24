import React, { useEffect, useState } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styles from "./AddPaymethodPopup.module.css";
import Button from "../Button/Button";

import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import { Elements } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import HeaderCard from "../HeaderCard/HeaderCard";
import { updateAccount } from "../../../../actions/user";
import { attachCustomPaymentMethod, defaultPaymentIntent } from "../../../../actions/stripe";
import { useDispatch, useSelector } from "react-redux";

const StripeCardForm = ({ setMessage, message, onClose }) => {
  const { t } = useTranslation("navbarAdmin");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [cardNumber, setCardNumber] = useState();
  const [expirationDate, setExpirationDate] = useState();
  const [securityCode, setSecurityCode] = useState();
  const [billingDetails, setBillingDetails] = useState([]);

  useEffect(() => {
    if (user?.billingDetails) {
      setBillingDetails([...user.billingDetails]);
    }
  }, [user]);

  const stripe = useStripe();
  const elements = useElements();



  const handleSaveUpgrade = async () => {
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
      billing_details: {
        email: billingDetails.email,
        address: {
          country: billingDetails.country,
          postal_code: billingDetails.zipCode,
        },
      },
    });
  
    if (paymentMethod) {
      const isFirstPaymentMethod = !user.payMethod || user.payMethod.length === 0;
  
      const newPayMethod = {
        id: paymentMethod.id,
        brand: paymentMethod.card?.brand,
        last4: paymentMethod.card?.last4,
        exp_month: paymentMethod.card?.exp_month,
        exp_year: paymentMethod.card?.exp_year,
        country: paymentMethod.card?.country,
        funding: paymentMethod.card?.funding,
        type: "visa",
        createdAt: Date.now(),
        ...(isFirstPaymentMethod && { default: true }), 
      };
  
      const userDataToSave = {
        payMethod: [...(user.payMethod || []), newPayMethod],
        billingDetails,
      };
  
      dispatch(updateAccount({ data: userDataToSave }));
  
      const response = await dispatch(
        attachCustomPaymentMethod(paymentMethod.id)
      );
  
      if (isFirstPaymentMethod) {
        await dispatch(defaultPaymentIntent({ paymentMethodId: paymentMethod.id }));
      }
  
      if (response.payload.success) {
        setMessage("Se validó el método de pago correctamente");
      } else {
        setMessage(response.payload?.error?.message || "Error al guardar método");
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
  return (
    <div className={styles.contentContainer}>
    <HeaderCard
        title={
          <div className={styles.titleWithIcon}>
            <h3>{t("createPayMethod")}</h3>
          </div>
        }
        setState={onClose}
      >
        <Button action={handleSaveUpgrade}>{t("create")}</Button>
      </HeaderCard>
    <div className={styles.content}>
    <div className={styles.stripeContainerFlex}>
        <div>
          <span>{t("cardNumber")}</span>
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
          <span>{t("expiryDate")}</span>
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
          <span>{t("securityCode")}</span>
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

    </div>
    </div>
  );
};

const AddPaymethodPopup = ({ setShowAddPayMethodPopup }) => {
  const { t } = useTranslation("navbarAdmin");
  const [message, setMessage] = useState("");
  const [stripePromise, setStripePromise] = useState(null);

  const publicKey =
    "pk_live_51RU836ArbxvCEfvZCcefKJ0VvOkw9ZxQa5XsZiltbdqoA21LcGKLJU6WkKZUJuUge4g34NEoURvF41n9KcFGe79y00vmB4eBWo";

  useEffect(() => {
    setStripePromise(loadStripe(publicKey));
  }, []);

  const handleClose = () => {
    setShowAddPayMethodPopup(false);
  };

  return (
    <ModalBlackBgTemplate
      close={handleClose}
      customStyle={{ maxWidth: "400px", minHeight: "fit-content" }}
    >
   

      {stripePromise && (
        <Elements stripe={stripePromise}>
          <StripeCardForm
            setMessage={setMessage}
            message={message}
            onClose={handleClose}
          />
        </Elements>
      )}
    </ModalBlackBgTemplate>
  );
};

export default AddPaymethodPopup;
