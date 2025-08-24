import styles from "./CustomCheckboxWithLabel.module.css";

const CustomCheckboxWithLabel = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className={styles.checkboxContainer}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label && <label>{label}</label>}
    </div>
  );
};

export default CustomCheckboxWithLabel;
