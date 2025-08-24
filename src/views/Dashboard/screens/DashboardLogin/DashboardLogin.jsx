import React, { useEffect, useState } from "react";
import styles from "./DashboardLogin.module.css";
import Navbar from "../../components/Navbar/Navbar";
import CookiePopup from "../../components/CookiePopup/CookiePopup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";
import facturaLogo from "../../assets/newFacturaGPTGreenIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { OTPInput } from "../../components/OtpInput/OtpInput";
import { ReactComponent as OpenAiLogo } from "../../assets/openai.svg";
import { ReactComponent as GoogleLogo } from "../../assets/googleLogo.svg";
import { ReactComponent as KeyIcon } from "../../assets/key-icon.svg";
import { ReactComponent as EyePassword } from "../../assets/eyePassword.svg";
import { ReactComponent as EyePasswordSlash } from "../../assets/eyePasswordSlash.svg";
import {
  createAccount,
  loginToManager,
  verifyOTP,
  sendOTP,
  updateUser,
  updateAccountPassword,
  send2FACode,
  validateSecondFactorAuth,
  logicalDeletedAccount,

} from "../../../../actions/user";
import { useTranslation } from "react-i18next";
import sentEmail from "../../assets/sentEmail.svg";
import i18n from "../../../../i18";
import { FaLock } from "react-icons/fa";
import { sendRecoveryCode, verifyRecoveryCode } from "../../../../actions/user";
import LoginButton from "./LoginButton/LoginButton";
import FooterLanding from "../../components/FooterLanding/FooterLanding";
import { TokenInput } from "../../components/TokenInput/TokenInput";

const DashboardLogin = () => {
  const { t } = useTranslation(["dahsboardLogin","ChatView"]);

  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [secondFactorAuthToken,setSecondFactorAuthToken] = useState(null)
  const [secondFactorInputValue,setSecondFactorInputValue] = useState(null)

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [validateToken,setValidateToken]=useState(null)
  const [userValidateRoute,setUserValidateRoute]=useState(null)
  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /[0-9]/;
    if (!minLength.test(password)) {
      setError(t('passwordMustHave8Characters'));
      return false;
    }
    if (!hasUpperCase.test(password)) {
      setError(t('passwordMustHaveCapital'));
      return false;
    }
    if (!hasLowerCase.test(password)) {
      setError(t('passwordMustHaveLowerCase'));
      return false;
    }
    if (!hasNumber.test(password)) {
      setError(t('passwordMustHave1Number'));
      return false;
    }

    setError("");
    return true;
  };
  

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    if(error) {
      setIsLoading(false)
      return
    }
    if (email.length > 1) {

      if (confirmPassword.length > 1 && password.length > 1) {
        if (password === confirmPassword) {
          const resp = await dispatch(
            updateAccountPassword({ email, newPassword: password })
          );
          navigate("/login");
          clearStates();
          setIsLoading(false);

  
        }
        setIsLoading(false);
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newPassword = e.target.value;
    setConfirmPassword(newPassword);
    validatePassword(newPassword);
  };


  const clearStates = () => {
    setNombre("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setOtp("");
    setError("");
    setStoredEmail("");
    setStoredPassword("");
  };

  const send2FACodeFn= async() => {
  const token = String(Math.floor(100000 + Math.random() * 900000));
  setIsLoading(false)
  setSecondFactorAuthToken(token)
  setMode("token")
  setResendTimer(45);


           const resp = await dispatch(send2FACode({
      nombre,
      email: email,
      language: i18n.language,
      code:token
    })).unwrap();
}

  const handleSignin = async () => {

  setError('')

    if (email.length > 1 && password.length > 1) {
      setIsLoading(true);

      try {
        const response = await dispatch(validateSecondFactorAuth({ email, password }));

      if(response.payload.logicalDeletedAccount){
        setError(t('deletedAccount'));
      }else{

        if(response?.payload?.secondFactorAuth){
          send2FACodeFn()
        }else{

          const response = await dispatch(loginToManager({ email, password }));


          if(response.payload && response.payload.success === false){
            setError(response.payload.message || "Failed to sign in");
            setIsLoading(false);
            return;
          }

          if (response.payload && response.payload.token) {
            clearStates();

            const accountData = {
              accessToken: response.payload.token,
            };
            localStorage.setItem("user", JSON.stringify(accountData));

            if (response.payload.role === "user") {
              navigate("/admin/chat");
            } else if (
              response.payload.role === "superadmin" ||
              response.payload.role === "admin" ||
              response.payload.role === "reseller"
            ) {
              navigate("/admin/accounts");
            } else {
              navigate("/admin/chat");
            }
          } else {
            setError(response.payload || "Failed to sign in");
          }
      }
      }

        setIsLoading(false);
      } catch (err) {
        console.error("Error durante inicio de sesión:", err);
        setError(err.message || "Unexpected error");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const verifySecondFactorToken = async (token) => {
    if(secondFactorAuthToken == token) {
      const response = await dispatch(loginToManager({ email, password }));


      if(response.payload && response.payload.success === false){
        setError(response.payload.message || "Failed to sign in");
        setIsLoading(false);
        return;
      }


      if (response.payload && response.payload.token) {
        clearStates();

        const accountData = {
          accessToken: response.payload.token,
        };
        localStorage.setItem("user", JSON.stringify(accountData));

        if (response.payload.role === "user") {
          navigate("/admin/chat");
        } else if (
          response.payload.role === "superadmin" ||
          response.payload.role === "admin"
        ) {
          navigate("/admin/accounts");
        } else {
          navigate("/admin/chat");
        }
      } else {
        setError(response.payload || "Failed to sign in");
      }
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      mode === "signin" ? handleSignin() : handleSignup();
    }
  };
  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasUppercase = /[A-Z]/.test(storedPassword);
    const hasNumber = /[0-9]/.test(storedPassword);

    if (!emailRegex.test(storedEmail)) {
      setError(t("invalidEmailFormat")); 
      return;
    }

    if (storedPassword.length < 6) {
      setError(t("passwordTooShort")); 
      return;
    }

    if (!hasUppercase) {
      setError(t("passwordMustHaveUppercase")); 
      return;
    }

    if (!hasNumber) {
      setError(t("passwordMustHaveNumber")); 
      return;
    }

    try {
      setIsLoading(true);
      setError('')
      const language = await localStorage.getItem("language");


      const resp = await dispatch(sendOTP({ nombre, email: storedEmail, language, })).unwrap();

      if(resp && resp.success){
        setMode("otp");
        navigate("/otp");
        setResendTimer(45);
      }


    } catch (error) {
      console.error("Error sending OTP:", error);
      setError(error.message || t("errorSendingVerificationCode"));
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleVerifyRecoveryCode = (receivedCode) => {
    if (receivedCode.length === 6) {
      setIsLoading(true);
      dispatch(verifyRecoveryCode({ email, recoveryCode: receivedCode }))
        .unwrap()
        .then((res) => {
          if (!res.success) {
            setError(res.message || t('errorVerifyingCode'));
            return;
          }
          setIsLoading(false);
          setForgotPasswordStep(3);
        })
        .catch((error) => {
          setError(error.message || t('errorVerifyingCode'));
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        });
    }
  };

  const handleVerifyOTP = async (receivedOtp) => {
    if (receivedOtp.length === 6) {
      setIsLoading(true);
      const respOTP = await dispatch(
        verifyOTP({
          nombre,
          email: storedEmail,
          otp: receivedOtp,
        })
      );

      const respAccount = await dispatch(
        createAccount({
          nombre,
          email: storedEmail,
          password: storedPassword,
          PIN: localStorage.getItem('PIN') || undefined,
          referralCode:localStorage.getItem('referralCode') || undefined,
          language: i18n.language
        })
      );


      if (respAccount.payload && respAccount.payload.success) {
        navigate("/login");
      }
    }
    setIsLoading(false);
  };

  const handleResendOTP = () => {
    setIsLoading(true);
    dispatch(sendOTP({ nombre, email: storedEmail }))
      .unwrap()
      .then(() => {
        setResendTimer(45);
      })
      .catch((error) => {
        setError(error.message || t('errorSendingVerificationCode'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleForgotPassword = () => {
    if (email.length > 1) {
      setIsLoading(true);
      dispatch(sendRecoveryCode({ email, language: i18n.language, name:t('facturaGptuser') }))
        .unwrap()
        .then((res) => {
          if (res.success) {
            setForgotPasswordStep(2);
          } else {
            setError(res.message || t('errorSendingRecoveryCode'));
          }
        })
        .catch((error) => {
          setError(error.message || t('errorSendingRecoveryCode'));
        })
        .finally(() => {
          setError("");
          setIsLoading(false);
        });
    }
  };

  const renderTitle = () => {
    switch (mode) {
      case "signup":
        return t("title1");
      case "otp":
        return t("title2");
   case "token":
        return t("title2");
      case "forgot-password":
        return t("title3");

      default:
        return t("title4");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const [variant, setVariant] = useState('Factura')
  const [themeStyles, setThemeStyles] = useState('')

  useEffect(() => {
      const translation = localStorage.getItem("translationId");
      setVariant(translation ? translation : 'Factura')


    }, []);

  const renderLogo = () => (
    <div className={styles.logoContainer}>
      <img
        onClick={() => navigate("/landing")}
        src={facturaLogo}
        alt="FacturaGPT"
        className={styles.logo}
      />
      <p className={styles.logoText}>
        {variant == 'Factura' ? variant : variant?.slice(0, -3) || 'Factura'}
        <strong>
        Gpt
        </strong>
      </p>
    </div>
  );

  const renderForm = () => (
    <div className={styles.form}>
      {mode === "signup" && (
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
      )}
      <label className={styles.label}>
        {t("label1")}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder={t("placeholder1")}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
      </label>
      <label className={styles.label}>
        {t("label2")}
        <div className={styles.inputWrapper}>
          <input
            value={password}
            onChange={handlePasswordChange}
            type={showPassword ? "text" : "password"}
            placeholder={t("placeholder2")}
            onKeyDown={handleKeyDown}
            className={styles.input}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <span
            className={`${styles.icon} ${
              password.length > 0 && isFocused ? styles.visible : ""
            }`}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyePassword className={styles.eye} />
            ) : (
              <EyePasswordSlash className={styles.eye} />
            )}
          </span>
        </div>
        <span className={styles.passwordRequirements}>
          {t("conditionPassword")}
        </span>
      </label>

      {mode === "signin" && (
        <div className={styles.forgotPasswordContainer}>
          <div className={styles.rememberMe}>
            <input type="checkbox" />
            <span>{t("remember")}</span>
          </div>
          <a
            href="#"
            className={styles.forgotPassword}
            onClick={(e) => {
              e.preventDefault();
              setMode("forgot-password");
              navigate("/recover");
            }}
          >
            {t("forgot")}
          </a>
        </div>
      )}
      <div
        onClick={() => {
          !isLoading &&
          (mode === "signin" ? handleSignin() : handleSignup())
        }}
        className={`${styles.signInButton} ${isLoading ? styles.loading : ""}`}
      >
        {isLoading
          ? mode === "signin"
            ? "Signing in..."
            : "Signing up..."
          : mode === "signin"
            ? t("buttonRegister1")
            : t("buttonRegister2")}
      </div>
      <GoogleOAuthProvider clientId="670878577763-49c9jt57nidq06ik86k7kaso7u217gpd.apps.googleusercontent.com">
        <LoginButton
          setNombre={setNombre}
          nombre={nombre}
          setStoredEmail={setStoredEmail}
          storedEmail={storedEmail}
          setEmail={setEmail}
          handleSignup={handleSignup}
          mode={mode}
          handleSignin={handleSignin}
          setStoredPassword={setStoredPassword}
          setPassword={setPassword}
        />
      </GoogleOAuthProvider>
    </div>
  );


  const renderForgotPasswordForm = () => (
    <div className={styles.rightContainer}>
      <div className={styles.forgotPasswordIcon}>
        <KeyIcon />
      </div>
      <h1 className={styles.forgotPasswordTitle}>
        {forgotPasswordStep === 3
          ? t('setYourNewPassword')
          : t("title3")}
      </h1>
      <p className={styles.forgotPasswordSubtitle}>
        {forgotPasswordStep === 2
          ? t('enterRecoveryCode')
          : forgotPasswordStep === 3
            ? email
            : t("solution")}
      </p>
      <div className={styles.form}>
        {forgotPasswordStep === 1 && (
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
        )}
        {forgotPasswordStep === 2 && (
          <OTPInput
            onChange={setRecoveryCode}
            handleVerifyOTP={handleVerifyRecoveryCode}
          />
        )}
        {forgotPasswordStep === 1 && (
          <button
            type="button"
            onClick={() => {
              !isLoading && handleForgotPassword()
            }}
            className={styles.continueButton}
          >
            {isLoading ? t("buttonContinue2") : t("buttonContinue1")}
          </button>
        )}
        {forgotPasswordStep === 2 && (
          <button
            type="button"
            onClick={() => !isLoading && handleVerifyRecoveryCode(recoveryCode)}
            className={styles.continueButton}
          >
            {isLoading ? t('verifying') : t('verifyCode')}
          </button>
        )}
        {forgotPasswordStep === 3 && (
          <label className={styles.label}>
            <input
              value={password}
              onChange={handlePasswordChange}
              type="password"
              placeholder={t('newPassword')}
              onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                      handleResetPassword();
                    }
              }}
              className={styles.input}
            />
            <span className={styles.passwordRequirements}>
              {t("conditionPassword")}
            </span>
          </label>
        )}
        {forgotPasswordStep === 3 && (
          <label className={styles.label}>
            <input
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              type="password"
              placeholder={t('confirmPassword')}
              onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                      handleResetPassword();
                    }
              }}
              className={styles.input}
            />
          </label>
        )}
        {forgotPasswordStep === 3 && (
          <button
            type="button"
            onClick={() => !isLoading && handleResetPassword()}
            className={styles.continueButton}
          >
            {isLoading ? t('processing') : t('continue')}
          </button>
        )}
        {error && <p className={styles.error}>{error}</p>}

      </div>
      <p className={styles.securityNote}>
        <span className={styles.lockIcon}>
          <FaLock color="#000000" />
        </span>
        {t("security")}
      </p>
    </div>
  );






  useEffect(() => {
    if (user) {
      if (user.success) {
        navigate("/admin/chat");
      } else {
        localStorage.clear();
      }
    }

    if (location?.pathname === "/login" && mode !== "signin") {
      setMode("signin");
    }
    if (location?.pathname === "/register" && mode !== "signup")
      setMode("signup");
    if (location?.pathname === "/recover" && mode !== "forgot-password")
      setMode("forgot-password");
    if (location?.pathname === "/otp" && mode !== "otp") {
      setMode("otp");
    }
  }, [location, user]);
  useEffect(() => {
    let timer;
    if (mode === "otp" || mode === 'token' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, resendTimer]);
  useEffect(() => {
    if (mode !== "otp") {
      setStoredEmail(email);
      setStoredPassword(password);
    }
  }, [email, password, mode]);
  React.useEffect(
      () => {

        let modeLogin = 'login';


        switch (mode) {
          case 'forgot-password':
              modeLogin = 'forgot';
            break;
          case 'signup':
            modeLogin = 'register';
            break;
          case 'signin':
          default:
            modeLogin = 'login';
            break;
        }

        const translationId = localStorage.getItem("translationId");
        document.title = `${translationId?.replace(translationId
            ?.slice(translationId?.length - 3, translationId?.length),'GPT')
            ?.toUpperCase() || t("ChatView:facturaGPT")} - ${t(modeLogin)}`;
      },[mode]
  )

  if (mode === "otp") {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <div className={styles.rightContainer}>
            <div className={styles.mailIconContainer}>
              <img src={sentEmail} alt="sentEmail" />
            </div>
            <h1 className={styles.titleOtp}>{renderTitle()}</h1>
            <p className={styles.subtitleOtp}>
              {t('sentCodeYouCanContinue')}
            </p>
            <p className={styles.emailDisplay}>{storedEmail}</p>
            <OTPInput onChange={setOtp} handleVerifyOTP={handleVerifyOTP} />
            <div className={styles.resendContainer}>
              <span>{t('didntGetCode')} </span>
              {resendTimer > 0 ? (
                <span className={styles.timer}>{resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className={styles.resendButton}
                  disabled={isLoading}
                >
                  {t('resend')}
                </button>
              )}
            </div>
            <div
              onClick={() => handleVerifyOTP(otp)}
              className={`${styles.signInButton} ${
                isLoading ? styles.loading : ""
              }`}
            >
              {isLoading ? t('verifying') : t('next')}
            </div>
            <p className={styles.error}>{error}</p>
            <p className={styles.securityNote}>
              <span className={styles.lockIcon}>
                <FaLock color="#000000" />
              </span>{" "}
              {t('yourSafetyMatters')}
            </p>
          </div>
        </div>
        <FooterLanding/>
      </div>
    );
  }
 if (mode === "token") {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <div className={styles.rightContainer}>
            <div className={styles.mailIconContainer}>
              <img src={sentEmail} alt="sentEmail" />
            </div>
            <h1 className={styles.titleOtp}>{renderTitle()}</h1>
            <p className={styles.subtitleOtp}>
              {t('sentCodeYouCanContinue')}
            </p>
            <p className={styles.emailDisplay}>{storedEmail}</p>
            <OTPInput
            onChange={setSecondFactorInputValue}
            handleVerifyOTP={verifySecondFactorToken}
          />
            <div className={styles.resendContainer}>
              <span>{t('didntGetCode')} </span>
              {resendTimer > 0 ? (
                <span className={styles.timer}>{resendTimer}s</span>
              ) : (
                <button
                  onClick={send2FACodeFn}
                  className={styles.resendButton}
                  disabled={isLoading}
                >
                  {t('resend')}
                </button>
              )}
            </div>
            <div
              onClick={() => verifySecondFactorToken(secondFactorInputValue)}
              className={`${styles.signInButton} ${
                isLoading ? styles.loading : ""
              }`}
            >
             {isLoading ? t('verifying') : t('next')}
            </div>
            <p className={styles.error}>{error}</p>
            <p className={styles.securityNote}>
              <span className={styles.lockIcon}>
                <FaLock color="var(--black-color)" />
              </span>{" "}
              {t('yourSafetyMatters')}
            </p>
          </div>
        </div>
        <FooterLanding/>
      </div>
    );
  }
  if (mode === "forgot-password") {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <div className={styles.leftContainer}>{renderLogo()}</div>
          {renderForgotPasswordForm()}
        </div>
        <FooterLanding/>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.leftContainer}>{renderLogo()}</div>
        <div className={styles.rightContainer}>
          <h1 className={styles.title}>{renderTitle()}</h1>
          <p className={styles.subtitle}>{t("subTitle")}</p>
          {renderForm()}
          {error && <p className={styles.error}>{error}

            {error === t('deletedAccount') &&
            <a href="#" onClick={async() => {
             const response = await dispatch(validateSecondFactorAuth({ email, password }));
              const res = await dispatch(logicalDeletedAccount({id:response?.payload?.id}));
              handleSignin()
          }}>
            {t('restoreAccount')}
          </a>}

          </p>}

          <p className={styles.footerText}>
            {mode === "signin" ? t("notAccount1") : t("yesAccount1")}{" "}
            {t("notAccount2")}{" "}
            <a
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                navigate(mode === "signin" ? "/register" : "/login");
              }}
              className={styles.signUp}
            >
              {mode === "signin" ? t("register") : t("login")}
            </a>
          </p>
          <p className={styles.footer}>© {t("copyright")}</p>
        </div>
      </div>
      <CookiePopup />
      <FooterLanding/>
    </div>

  );
};

export default DashboardLogin;
