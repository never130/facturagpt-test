import Button from '../../../Button/Button';
import styles from './GetPlus.module.css';
import { ReactComponent as ArrowRigth } from "../../../../assets/littleArrowRight.svg"

export default function GetPlus() {
  const nextBillingDate = new Date();
  nextBillingDate.setDate(nextBillingDate.getDate() + 1);
  const formattedDate = nextBillingDate.toISOString().split('T')[0];

  return (
    <div className={styles.container}>
      <div className={`${styles.row} ${styles.rowBorderBottom}`} style={{ borderRadius: "0px" }}>
        <span className={styles.labelBold}>Tu crédito</span>
        <span className={styles.labelBold} style={{ fontSize: "30px" }}>0,00€</span>
      </div>

      <div className={styles.row}>
        <div className={styles.displayColumn}>
          <div >
            <span className={styles.greyText} style={{ fontWeight: "bold", marginRight: "5px" }}>0.00€</span>
            <span className={styles.greyText}>gastado</span>
          </div>
          <span className={styles.blackText}>Última facturación</span>
        </div>
        <Button
          action={() => console.log("boton")}
          type="white"
          headerStyle={{ borderRadius: "50px" }}
        >
          Ver historial <ArrowRigth />
        </Button>
      </div>

      <div className={styles.blockGroup}>
        <div className={`${styles.groupRow} ${styles.topRadius}`}>
          <span className={styles.blackText}>Plan actual</span>
          <div>
            <span className={styles.greyText}>Plan</span>
            <span className={styles.greyText} style={{ fontWeight: "bold", marginLeft: "5px" }}>Pro</span>
          </div>
        </div>

        <div className={styles.groupRow}>
          <span className={styles.blackText}>Fecha de facturación</span>
          <span className={styles.greyText}>{formattedDate}</span>
        </div>

        <div className={`${styles.groupRow} ${styles.bottomRadius}`}>
          <span className={styles.blackText}>Límite de gastos</span>
          <div className={styles.limitControls}>
            <Button
              action={() => console.log("boton")}
              type="white"
              headerStyle={{ borderRadius: "8px", padding: "6px 12px" }}
            >
              -
            </Button>
            <input className={`${styles.limitInput} ${styles.greyText}`} style={{ fontWeight: "bold" }} defaultValue="0,00 €" />
            <Button
              action={() => console.log("boton")}
              type="white"
              headerStyle={{ borderRadius: "8px", padding: "6px 12px" }}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
