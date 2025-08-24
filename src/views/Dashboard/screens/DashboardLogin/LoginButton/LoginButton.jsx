import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import styles from './LoginButton.module.css'
import { ReactComponent as GoogleLogo } from "../../../assets/googleLogo.svg";
import { useTranslation } from 'react-i18next';
const LoginButton = ({ setNombre, nombre, setStoredEmail,setEmail, storedEmail, handleSignup,handleSignin,mode, setStoredPassword,setPassword }) => {
  const [user, setUser] = useState(null);
  const [readyToSignup, setReadyToSignup] = useState(false);
  const { t } = useTranslation("dahsboardLogin");

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();

        const generatedPassword = `google_${userInfo.sub.slice(-6)}`; 

        setNombre(userInfo.name);
        setStoredEmail(userInfo.email);
        setEmail(userInfo.email);

        setStoredPassword(generatedPassword);
        setPassword(generatedPassword);
        setUser({
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture, 
        });

        setReadyToSignup(true);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: (error) => console.error('Login Failed:', error),
  });

  useEffect(() => {
    if (readyToSignup && nombre && storedEmail) {
        mode === "signin" ? handleSignin() : handleSignup()
      setReadyToSignup(false); 
    }
  }, [readyToSignup, nombre, storedEmail, handleSignup]);

  return (
    <div>
      <button onClick={(e) => {
        e.preventDefault();
        login();
      }}
      type='button'
      className={styles.buttonGoogle}>
          <GoogleLogo width="20" />
          <span>{ mode === "signin" ?  t("loginGoogle") : t('registerIAButton')}</span>
      </button>

    </div>
  );
};

export default LoginButton;
