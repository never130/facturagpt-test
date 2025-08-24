import React, { useEffect, useRef, useState } from "react";
import Advertency from "../../../Automate/Components/Advertency/Advertency";
import Button from "../../../Button/Button";
import styles from "./Security.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOTP,
  sendRecoveryCode,
  updateAccountPassword,
  updateSecondFactorAuth,
  verifyOTP,
  verifyRecoveryCode,
} from "../../../../../../actions/user";
import i18n from "../../../../../../i18";
import { useTranslation } from "react-i18next";
import CorporativeModalText from "../../../CorporativeModalText/CorporativeModalText";
import { useNavigate } from "react-router-dom";
import { ReactComponent as EyePassword } from "../../../../assets/eyePassword.svg";
import { ReactComponent as EyePasswordSlash } from "../../../../assets/eyePasswordSlash.svg";

const Security = () => {
  const { t } = useTranslation("accountSetting");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedPassword, setVerifiedPassword] = useState(false);
  const [showCorporativeModal, setShowCorporativeModal] = useState(false);
  const [corporativeTitle, setCorporativeTitle] = useState("");
  const [corporativeMessage, setCorporativeMessage] = useState("");
  const [logout, setLogout] = useState(false);
  const [otp, setOtp] = useState(null);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState('')
  const dispatch = useDispatch();
  const [newUser, setNewUser] = useState({ ...user });
  const [codeSent, setCodeSent] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [enabledInputs, setEnabledInputs] = useState({});
  const [showNewPasswordRepited, setShowNewPasswordRepited] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [secondFactorAuth, setSecondFactorAuth] = useState(null)
  const toggleInput = (key) => {
    setEnabledInputs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleForgotPassword = async () => {
    if (newUser.email.length > 1) {
      setIsLoading(true);
      try {
        const response = dispatch(
          sendRecoveryCode({
            email: newUser.email,
            language: i18n.language,
            name,
          })
        )

          .unwrap();

        setOtp(response?.otp);
        if (response.success) {
          setForgotPasswordStep(2);
        } else {
          setShowAlert('password')
          setMessage(response.message || t("errorSendingRecoveryCode"));
        }
      } catch (error) {
        console.error("Error al enviar el OTP:", error);
        setShowAlert('password')
        setMessage(error.message || t("errorSendingRecoveryCode"));
      } finally {
        setMessage("");
        setIsLoading(false);
      }
    }
  };

  const handleVerifyRecoveryCode = async (receivedCode) => {

    if (!receivedCode) {
      setShowAlert('password')
      setMessage(t("codeRequired"));
      return;
    }

    if (typeof receivedCode !== "string") {
      setShowAlert('password')
      setMessage(t("codeMustBeString"));
      return;
    }

    if (receivedCode.length !== 6) {
      setShowAlert('password')
      setMessage(t("codeMustHave6Numbers"));
      return;
    }

    if (!/^\d{6}$/.test(receivedCode)) {
      setShowAlert('password')
      setMessage(t("codeMustContainOnlyNumbers"));
      return;
    }

    if (receivedCode?.length === 6) {
      setIsLoading(true);
      try {


        const respOTP = await dispatch(
          verifyRecoveryCode({
            email: newUser.email,
            recoveryCode: receivedCode,
          })
        )

          .unwrap();


        if (!respOTP.success) {
          setShowAlert('password')
          setMessage(respOTP.message || t("errorVerifyingCode"));
          return;
        }

        setVerifiedPassword(true);
        setForgotPasswordStep(3);
      } catch (error) {
        console.error("Error verificando OTP:", error);
        setShowAlert('password')
        setMessage(error.message || t("errorVerifyingCode"));
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
      setMessage();
    } else {
      setShowAlert('password')
      setMessage(t("codeMustHave6Numbers"));
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    const { email, newPassword, newPasswordRepited } = newUser;

    if (
      !email ||
      email.length < 5 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setMessage(t("invalidEmail"));
      setShowAlert('password')
      setIsLoading(false);
      return;
    }

    if (!newPassword || !newPasswordRepited) {
      setMessage(t("passwordRequired"));
      setShowAlert('password')
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6 || newPasswordRepited.length < 6) {
      setMessage(t("passwordMustHave6letters"));
      setShowAlert('password')
      setIsLoading(false);
      return;
    }

    if (newPassword !== newPasswordRepited) {
      setMessage(t("passwordsDoNotMatch"));
      setShowAlert('password')
      setIsLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setMessage(t("passwordWeak"));
      setShowAlert('password')
      setIsLoading(false);
      return;
    }

    if (newUser.email.length > 1) {
      if (
        newUser.newPassword.length > 1 &&
        newUser.newPasswordRepited.length > 1
      ) {
        if (newUser.newPasswordRepited === newUser.newPassword) {
          const resp = await dispatch(
            updateAccountPassword({
              email: newUser.email,
              newPassword: newUser.newPasswordRepited,
            })
          );
          setIsLoading(false);
          if (resp.payload.success) {
            setMessage(t("succesfullyPasswordChanged"));
            setShowAlert('password')
          }

        }
        setIsLoading(false);
      } else {
        setMessage(t("passwordMustHave6letters"));
        setShowAlert('password')
      }
    }
  };

  useEffect(() => {
    if (logout) {
      localStorage.clear();
      navigate("/login");
    }
  }, [logout]);

  const handleLogOut = () => {
    setShowCorporativeModal(true);
    setCorporativeTitle(t("logout"));
    setCorporativeMessage(t("areYouSureLogout"));
  };

  const inputCodeRef = useRef(null);

  useEffect(() => {
    if (codeSent && inputCodeRef.current) {
      inputCodeRef.current.focus();
    }
  }, [codeSent]);


  useEffect(() => {
    if (message || passwordChanged || codeSent) {
      const timer = setTimeout(() => {
        setShowAlert('')

      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [message, passwordChanged, codeSent]);

  const updateSecondFactorAuthStatus = async () => {
    const res = await dispatch(updateSecondFactorAuth({ id: user.id, secondFactorAuth: secondFactorAuth }));
  };
  useEffect(() => {
    if (secondFactorAuth === null) {
      setSecondFactorAuth(user?.secondFactorAuth || false)
    } else {
      updateSecondFactorAuthStatus()
    }
  }, [secondFactorAuth])

  return (
    <div className={styles.SecurityContainer}>
      {showAlert == 'password' && (
        <Advertency text={message} type={message == t("succesfullyPasswordChanged") ? "succesfully" : 'error'} customStyle={{ padding: "10px", gap: "10px" }} />
      )}
      {showAlert == 'codesent' && !message && <Advertency text={t("emailWithCodeBeenSent")} customStyle={{ padding: "10px", gap: "10px" }} />}
      <div className={styles.securityLabel}>
        <p>{t("email")}</p>
        <div className={styles.rightSide}>
          <div
            className={`${styles.inputWrapper} ${!enabledInputs.email ? styles.disabled : ""}`}
          >
            <input
              type="email"
              name="email"
              placeholder="john.doe@gmail.com"
              value={newUser.email}
              onChange={handleChange}
              disabled={!enabledInputs.email}
            />
          </div>
        </div>
      </div>
      {!verifiedPassword && (
        <div className={styles.securityLabel}>
          <p>{t("password")}</p>
          <div className={styles.rightSide}>
            {!codeSent && (
              <div style={{ paddingRight: "1px" }}
                className={`${styles.inputWrapper} ${forgotPasswordStep !== 3 ? styles.disabled : ""}`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("password")}
                  value={'*'.repeat(newUser.password.length)}

                  onChange={handleChange}
                  disabled={forgotPasswordStep !== 3}
                />
                <Button
                  type="white"
                  headerStyle={{ borderRadius: "50px" }}
                  action={() => {
                    forgotPasswordStep == 3
                      ? !isLoading && handleResetPassword()
                      : !isLoading && handleForgotPassword();
                    setCodeSent(true);
                    setShowAlert('codesent')
                  }}
                >
                  {forgotPasswordStep == 3 ? t("saveNewPassword") : t("change")}
                </Button>
              </div>
            )}

            {codeSent && !verifiedPassword && (
              <div style={{ paddingRight: "1px" }} className={`${styles.inputWrapper} `}>
                <input
                  type="text"
                  name="passwordCode"
                  placeholder={t("code")}
                  onChange={handleChange}
                  ref={inputCodeRef}
                />

                <Button
                  type="white"
                  headerStyle={{ borderRadius: "50px" }}
                  action={() => {
                    toggleInput("passwordCode");
                    !isLoading &&
                      handleVerifyRecoveryCode(newUser.passwordCode);
                  }}
                >
                  {t("verify")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {verifiedPassword && (
        <>
          <div className={styles.securityLabel}>
            <p>{t("newPassword")}</p>

            <div className={styles.rightSide}>
              <div
                className={`${styles.inputWrapper} ${forgotPasswordStep !== 3 ? styles.disabled : ""}`}
              >
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder={t("newPassword")}
                  value={newUser.newPassword}
                  onChange={handleChange}
                  disabled={forgotPasswordStep !== 3}
                />
                <div onClick={() => setShowNewPassword((prev) => !prev)}>
                  {showNewPassword ? <EyePasswordSlash /> : <EyePassword />}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.securityLabel}>
            <p>{t("repeatNewPassword")}</p>

            <div className={styles.rightSide}>
              <div
                className={`${styles.inputWrapper} ${forgotPasswordStep !== 3 ? styles.disabled : ""}`}
              >
                <input
                  type={showNewPasswordRepited ? "text" : "password"}
                  name="newPasswordRepited"
                  placeholder={t("repeatNewPassword")}
                  value={newUser.newPasswordRepited}
                  onChange={handleChange}
                  disabled={forgotPasswordStep !== 3}
                />
                <div onClick={() => setShowNewPasswordRepited((prev) => !prev)}>
                  {showNewPasswordRepited ? <EyePasswordSlash /> : <EyePassword />}
                </div>
              </div>
            </div>
          </div>
          <Button
            headerStyle={{
              fontSize: "13px",
              width: "100%",
              margin: "10px 0",
              padding: "10px 0",
            }}
            action={() => {
              handleResetPassword();

              setCodeSent(true);
              setShowAlert('password')
            }}
          >
            {forgotPasswordStep == 3 ? t("saveNewPassword") : t("change")}
          </Button>
        </>
      )}
      <div className={`${styles.securityLabel} ${styles.infolabel}`}>
        <div className={styles.title}>
          <p>{t("multiFactorAuthentication")}</p>
          <Button
            action={() => setSecondFactorAuth(!secondFactorAuth)}
            type="white"
            headerStyle={{ borderRadius: "50px" }}
          >{secondFactorAuth ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
        <div className={styles.info}>
          <span>{t("additionalSecurity")}</span>
        </div>
      </div>
      <div className={`${styles.securityLabel} ${styles.infolabel}`}>
        <div className={styles.title}>
          <p>{t("help")}</p>
          <Button
            action={() => window.open(`/help`, '_blank', 'noopener,noreferrer')
            }
            type="white"
            headerStyle={{ borderRadius: "50px" }}
          >
            {t('seeMore')}
          </Button>
        </div>
        <div className={styles.info}>
          <span>{'¿Necesitás ayuda para completar la verificación? Acá te explicamos todo paso a paso para que puedas continuar sin problemas'}</span>
        </div>
      </div>
      <div className={`${styles.securityLabel} ${styles.infolabel}`}>
        <div className={styles.title}>
          <p>{t("termsAndConditions")}</p>
          <Button
            action={() => window.open(`/terms`, '_blank', 'noopener,noreferrer')
            }
            type="white"
            headerStyle={{ borderRadius: "50px" }}
          >
            {t('seeMore')}
          </Button>
        </div>
        <div className={styles.info}>
          <span>{'Política de verificación de seguridad y procedimiento para recuperación de acceso en caso de falla'}</span>
        </div>
      </div>

      <div className={`${styles.securityLabel} ${styles.infolabel}`}>
        <div className={styles.title}>
          <p>{t("logoutAllDevices")}</p>
        </div>
        <div className={styles.info}>
          <span>{t("logoutMayTake30Minutes")}</span>
          <Button
            headerStyle={{ borderRadius: "50px" }}
            type="white"
            action={handleLogOut}
          >
            {t("logout")}
          </Button>
        </div>
      </div>

      {showCorporativeModal && (
        <CorporativeModalText
          title={corporativeTitle}
          message={corporativeMessage}
          setState={setShowCorporativeModal}
          action={true}
          setAction={setLogout}
        />
      )}
    </div>
  );
};

export default Security;
