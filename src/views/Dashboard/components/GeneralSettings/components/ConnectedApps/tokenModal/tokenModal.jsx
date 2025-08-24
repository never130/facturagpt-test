import { useState } from "react";
import styles from "./tokenModal.module.css";
import HeaderCard from "../../../../HeaderCard/HeaderCard";
import Button from "../../../../Button/Button";

export default function TokenModal({setShowTokenModal}) {
  const [visible, setVisible] = useState(true);

  const close = () => {
    setShowTokenModal(false);}

  if (!visible) return null;

  return (
      <div className={styles.modal}>
        <HeaderCard headerStyle={{background:"white", padding:"0px 0 10px 0"}}  setState={close} >
               <Button action={() => {
                setShowTokenModal(false);
               }} type="white">
                 Cancel
               </Button>
                   <Button action={() => {
                   }}>
                     Create secret key
                   </Button>
                 
       
             </HeaderCard>
        <h3 className={styles.title}>Create new secret key</h3>
        <p className={styles.parrafo}>
        This API key is tied to your user and can make requests against the selected project. If you are removed from the organization or project, this key will be disabled.
        </p>

        <label className={styles.label}>
            Name <span>Optional</span>
          <input placeHolder='My Test Key' type="text" className={styles.input} style={{width:"95%"}} />
        </label>

        <label className={styles.label}>
          Project:
          <select className={styles.input} value="Select to project">
            <option>Select project...</option>
            <option>Opción 2</option>
          </select>
        </label>

        <label className={styles.label}>
          Permissions
        </label>

        <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${styles.left}`}>All</button>
          <button className={styles.button}>Restricted</button>
          <button className={`${styles.button} ${styles.right}`}>Read only</button>
        </div>
      </div>

  );
}
