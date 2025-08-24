import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";
import styles from "./Payment.module.css";
import PaymentSuccess from "./PaymentSuccess";
const publicKey =
  "pk_test_51RN35zQ4aaP8AJy7HHcwnhM2EqrDNRyPWIohL4cTCQTV7xdeDcKjkYNrcY1yXZeDdcRaUIyupOujuQCgigStxkXZ001iU32eOG";
function Payment({ onClose, clientId, amountToPay }) {
  const dispatch = useDispatch();
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    setStripePromise(loadStripe(publicKey));
  }, []);

  useEffect(() => {
    const getPaymentIntent = async () => {
      const response = await dispatch(
      );
      const { clientSecret } = response.payload;
      if (clientSecret) {
 
      }
      setClientSecret(clientSecret);
    };
    getPaymentIntent();
  }, []);

  if (clientId && clientSecret && stripePromise)
    return (
      <div onClick={onClose} className={styles.overlay}>
        <PaymentSuccess onClose={onClose} />
      </div>
    );


}

export default Payment;
