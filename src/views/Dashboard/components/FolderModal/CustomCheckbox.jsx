import styles from "./CustomCheckbox.module.css";

export function CustomCheckbox({ label, checked, onChange, id }) {
  return (
    <div className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.checkbox}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
}
