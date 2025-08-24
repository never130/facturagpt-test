import React, { Suspense, lazy, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { createRoot } from "react-dom/client";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18.js";

import "./index.css";
import tinycolor from 'tinycolor2';

import { loginToManager } from "./actions/user";
// import { getAllNotificationsNotViewed } from "./actions/notifications";

import { AuthProvider, useAuth } from "./hooks/useAuth";

import store from "./utils/store";

import LandingPage from "./views/Dashboard/screens/Landing/Landing.jsx";
import DashboardLogin from "./views/Dashboard/screens/DashboardLogin/DashboardLogin.jsx";
import Loading from "./views/Dashboard/components/Loading/Loading.jsx";

import { setIsAppleOS } from "./slices/userSlices.js";


const Layout = () => {

  const ComponentPrivate = () => {
    const navigate = useNavigate();

    const { user, loading } = useAuth();
    const { theme, themeColor } = useSelector(state => state.theme);
    const [init, setInit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const backgroundLocation = location.state?.backgroundLocation;
    const {userFiles} =    useSelector((state) => state.scaleway);
    const { workspaceSelected } = useSelector((state) => state.workspace);
    const dispatch = useDispatch();

    function generateColorsFromBase(baseHex) {
      const base = tinycolor(baseHex);

      const color2 = base.clone().lighten(10).toHexString();
      // create variants with .8 .6 .5 alpha
      const color2_8 = base.clone().lighten(10).setAlpha(0.8).toHex8String();
      const color2_6 = base.clone().lighten(10).setAlpha(0.6).toHex8String();
      const color2_5 = base.clone().lighten(10).setAlpha(0.5).toHex8String();
      const color2_4 = base.clone().lighten(10).setAlpha(0.4).toHex8String();

      const color3 = tinycolor.mix('#ffffff', base, 90).toHexString();
      const color4 = base.clone().lighten(10).setAlpha(0.13).toHex8String();
      const color5 = color2;
      const color6 = base.clone().lighten(10).setAlpha(0.18).toHex8String();

      const baseDarken = base.clone().darken(10).toHexString();
      return {
        '--_10a37f-background': base.toHexString(), //used in almost everything!

        '--10b981-background': base.toHexString(), //used in stats bars
        '--_0b745a-background': baseDarken, //used in hover of btns

        '--_10a37f-background-2': color2, //used in the bg of btns with alpha 0.2
        '--_10a37f-background-4': color2_4, //used in the bg of btns with alpha 0.4
        '--_10a37f-background-5': color2_5, //used in the bg of btns with alpha 0.5
        '--_10a37f-background-6': color2_6, //used in the bg of btns with alpha 0.6
        '--_10a37f-background-8': color2_8, //used in the bg of btns with alpha 0.8

        '--_16c098-background': color2,
        '--e6fff9-background': color3,
        '--_16c09821-background': color4,

        '--_16c098-color': color5,

        '--_16c0982e-background': color6,

        '--16C097-fill': color2, //used in the fill of icons
        
      };
    }

    let component = <Loading />;


    useEffect(() => {
      const checkUser = async () => {
        let user = await localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);

          if (userData?.accessToken) {
            dispatch(
              loginToManager({
                accessToken: userData?.accessToken,
              })
            );


          }
        }
      };
      checkUser();
    }, []);


    const getNotificationsFnPending = async () => {
      try {
        // const response = await dispatch(
        //   getAllNotificationsNotViewed()
        // );
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };


    useEffect(() => {
      setInit(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
        if (user && user.success == false) {
          navigate(`/login`);
        } else {
          component = <Loading />;
        }

      }, 666);

     

      return () => clearTimeout(timer);
    }, [user]);

    useEffect(() => {
      if (user) {
        const userLocalStorage = localStorage.getItem("user");
        const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;
        // dispatch(
        //   getAllUserAutomations({
        //     userId: user.id,
        //     token: parsedUser.accessToken,
        //   })
        // );
        // if(userFiles?.length == 0){
        // dispatch(
        //   getUserFiles({
        //     userId: user.id,
        //     token: parsedUser.accessToken
        //   })
        // );
      // }

        getNotificationsFnPending().then()
      }
    }, [user, localStorage.getItem("user"),workspaceSelected]);

    useEffect(() => {
      if (user?.language) {
        localStorage.setItem('language', user.language);
      }
    }, [user?.language]);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
        dispatch(setIsAppleOS(isApple))
      }
    }, []);

    useEffect(() => {
     // if (theme === "custom" && colorCustom) {
     //   const colors = generarColoresDesdeBase(colorCustom);
     //   Object.entries(colors).forEach(([key, value]) => { document.documentElement.style.setProperty(key, value); });
     // }

      // get theme color and update it
      const colors = generateColorsFromBase(themeColor);
      Object.entries(colors).forEach(([key, value]) => { document.documentElement.style.setProperty(key, value); });


      // set theme in html tag
      document.documentElement.setAttribute("data-theme", theme);
      
    }, [theme, themeColor]);

    if (!init || isLoading || loading) {
      return component;
 
    }


    return (
      <>
        <Routes location={backgroundLocation || location}>


          <Route path="*" element={<div>
            {JSON.stringify(user)}
          </div>} />
        </Routes>
       
      </>
    );
  };

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <DndProvider backend={HTML5Backend}>
          <Provider store={store}>
            <AuthProvider>
              <BrowserRouter>
                <Routes >
                  <Route path="/home" element={<LandingPage />} />


                  <Route path="/login" element={<DashboardLogin />} />
                  <Route path="/register" element={<DashboardLogin />} />
                  <Route path="/recover" element={<DashboardLogin />} />
                  <Route path="/otp" element={<DashboardLogin />} />

                  <Route path="/admin/*" element={<ComponentPrivate />} />

                  <Route path="*" element={<ComponentPrivate />} />
                  <Route path="/:referralCode" element={<LandingPage />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </Provider>
        </DndProvider>
      </I18nextProvider>
    </>
  );
};

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(<Layout />);
} else {
  console.error("Error No se encontró el contenedor con id 'root'.");
}
