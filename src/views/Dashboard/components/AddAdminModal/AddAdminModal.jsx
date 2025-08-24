import React, { useEffect, useState } from "react";
import styles from "./AddAdminModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";

import { 
  updateAccount,
  createAccount 
} from "../../../../actions/user";

import CustomDropdown from "../CustomDropdown/CustomDropdown";


const AddAdminModal = ({
  onClose,
  account
}) => {

  const dispatch = useDispatch();
  const { t } = useTranslation("dahsboardLogin");

  const [isNew, setIsNew] = useState(true);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [PIN, setPIN] = useState("");
  const [discount, setDiscount] = useState("");
  const [role, setRole] = useState("admin");



  useEffect(() => {
    if (account) {
      setIsNew(false)
      setNombre(account.nombre)
      setEmail(account.email)
      setPassword(account.password)
      setPIN(account.PIN)
      setDiscount(account.discount)
      setRole(account.role)
    }
  }, [account])


  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handlePINChange = (e) => {
    const newPIN = e.target.value;
    setPIN(newPIN);
  };

  const handleAddAdmin = async () => {
    setIsLoading(true);
    if (email.length === 0 || password.length === 0 || nombre.length === 0) {
      setIsLoading(false);
      return;
    }
    try {

      if(isNew) {
        await dispatch(createAccount({
          nombre,
          email,
          password,
          PIN,
          discount,
          role: "admin"
        }));
      } else{
        await dispatch(updateAccount({
          data:{
            nombre,
            email,
            password,
            PIN,
            discount,
            role: role
          }
        }));
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      onClick={handleClose}
      className={`${styles.modalContainer} ${isClosing ? styles.fadeOut : ""}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${styles.upgradePlanContainer} ${isClosing ? styles.scaleDown : ""}`}
      >
        <HeaderCard
          title={t('admin')}
          setState={handleClose}
        >
          <Button type="white" action={handleClose}>
            {t('cancel')}
          </Button>
        </HeaderCard>
   
        <div className={styles.upgradeContainer}>
          <label className={styles.label}>
            {t('fullName')}
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type="text"
              placeholder={t('placeholder3')}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            {t("label1")}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t("placeholder1")}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            {t("label2")}
            <input
              value={password}
              onChange={handlePasswordChange}
              type="password"
              placeholder={t("placeholder2")}
              className={styles.input}
            />
            <span className={styles.passwordRequirements}>
              {t("conditionPassword")}
            </span>
          </label>
          <label className={styles.label}>
            {t('role')}
          <CustomDropdown
              options={['user','admin','superadmin']}
              selectedOption={role}
              height="31px"
              textStyles={{
                display: "flex",

                gap: "5px",
                fontWeight: 500,
                color: "#3d3c42",
                marginLeft: "6px",
                userSelect: "none",
              }}
              setSelectedOption={(selected) =>
                setRole(selected)
              }
            />
          </label>
          <label className={styles.label}>
            {t('pin')}
    
            <input
              value={PIN}
              onChange={handlePINChange}
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder={t('enterPin')}
              className={`${styles.input} ${PIN?.length === 4 ? styles.valid : ''}`}
              style={{
                borderColor: PIN?.length === 4 ? '#4CAF50' : PIN?.length > 0 ? '#ff9800' : ''
              }}
            />
            <span className={styles.passwordRequirements}>
              {t('4Characters')}
            </span>
          </label>
          <label className={styles.label}>
            {t('discount')}
    
            <input
              value={discount}
              type="number"
              onChange={(e) => {
                setDiscount(e.target.value)
              }}
              placeholder={t('enterDiscount')}
              className={`${styles.input} `}
            />
         
          </label>
     
          <div
            onClick={handleAddAdmin}
            className={`${styles.signInButton} ${isLoading ? styles.loading : ""}`}
          >
            {isLoading ? t("saving") : isNew ? t('createAdmin') : t('save')}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
