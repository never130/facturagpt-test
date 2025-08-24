import styles from "./ErrorPage.module.css";
import { FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContent}>
        <FiAlertCircle className={styles.errorIcon} />
        <h1 className={styles.errorTitle}>¡Ups! Algo salió mal</h1>
        <p className={styles.errorText}>
          Lo sentimos, ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.
        </p>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.primaryButton}
            onClick={() => navigate(-1)}
          >
            Volver atrás
          </button>
          <button 
            className={styles.secondaryButton}
            onClick={() => navigate("/")}
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;