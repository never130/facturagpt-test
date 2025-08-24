import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import SetupCheckoutForm from "./SetupCheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";
import styles from "./Payment.module.css";
import { createSetupIntent } from "../../../../../actions/stripe";

const publicKey =
  "pk_test_51RN35zQ4aaP8AJy7HHcwnhM2EqrDNRyPWIohL4cTCQTV7xdeDcKjkYNrcY1yXZeDdcRaUIyupOujuQCgigStxkXZ001iU32eOG";

function SetupPayment({ setPaymentId, onClose, clientId }) {
  const dispatch = useDispatch();
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    setStripePromise(loadStripe(publicKey));
  }, []);

  useEffect(() => {
    const getSetupIntent = async () => {
      const response = await dispatch(createSetupIntent());
      const { clientSecret } = response.payload;
      setClientSecret(clientSecret);
    };
    getSetupIntent();
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.setPaymentModalBg}>
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SetupCheckoutForm
              setPaymentId={setPaymentId}
              onClose={onClose}
              clientId={clientId}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default SetupPayment;
