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
import { getAllNotificationsNotViewed } from "./actions/notifications";
import { getAllUserAutomations } from "./actions/automate";
import { getUserFiles } from "./actions/scaleway";

import { AuthProvider, useAuth } from "./hooks/useAuth";

import store from "./utils/store";

import LandingPage from "./views/Dashboard/screens/Landing/Landing.jsx";
import Pricing from "./views/Dashboard/screens/Pricing/Pricing.jsx";
import Terms from "./views/Dashboard/screens/Terms/TermsAndConditions.jsx";
import ContactForm from "./views/Dashboard/components/ContactForm/ContactForm.jsx";
import FreeTrial from "./views/Dashboard/screens/FreeTrial/FreeTrial.jsx";
import DashboardLogin from "./views/Dashboard/screens/DashboardLogin/DashboardLogin.jsx";
import Instructions from "./views/Dashboard/screens/Instructions/Instructions.jsx";

import Transactions from "./views/Dashboard/screens/Transactions/Transactions.jsx";
import ArticlesTransactions from "./views/Dashboard/screens/ArticlesTransactions/ArticlesTransactions.jsx";
import Assets from "./views/Dashboard/screens/Assets/Assets.jsx";
import NewAsset from "./views/Dashboard/components/NewAsset/NewAsset.jsx"
import Dashboard from "./views/Dashboard/Dashboard.jsx";
import InvoicePanel from "./views/Dashboard/screens/InvoicePanel/InvoicePanel.jsx";
import Contacts from "./views/Dashboard/screens/Contacts/Contacts.jsx";
import NewContact from "./views/Dashboard/components/NewContact/NewContact.jsx";
import UsersDashboard from "./views/Dashboard/UsersDashboard.jsx";
import ChatView from "./views/Dashboard/screens/ChatView/ChatView.jsx";
import AccountsDashboard from "./views/Dashboard/AccountsDashboard.jsx";
import NotificationsView from "./views/Dashboard/screens/NotificationsView/NotificationsView.jsx";
import Loading from "./views/Dashboard/components/Loading/Loading.jsx";
import ErrorPage from "./views/Dashboard/screens/ErrorPage/ErrorPage.jsx";

import Automate from "./views/Dashboard/components/Automate/Automate.jsx";

import HelpPage from "./views/Dashboard/screens/HelpPage/HelpPage.jsx";
import UpgradePage from "./views/Dashboard/screens/UpgradePage/UpgradePage.jsx";
import SharePDF from "./views/Dashboard/screens/SharePDF/SharePDF.jsx";
import NewBIll from "./views/Dashboard/components/NewBIll/NewBIll.jsx";
import NewAgentComponent from "./views/Dashboard/components/NewAgentComponent/NewAgentComponent.jsx";
import Tables from "./views/Dashboard/screens/Tables/Tables.jsx";

import CalendarView from "./views/Dashboard/screens/CalendarView/CalendarView.jsx";

import NewsViewer from "./views/Dashboard/screens/News/NewsViewer.jsx";
// import HelpView from "./views/Dashboard/screens/Help/Help.jsx";
// import ScrapView from "./views/Dashboard/screens/ScrapView/ScrapView.jsx";

import PanelTemplateWrapper from "./views/Dashboard/components/PanelTemplate/PanelTemplateWrapper.jsx";

import ExploreCommuniti from "./views/Dashboard/screens/ChatView/ExploreCommuniti/ExploreCommuniti.jsx";


// import DemoTable from "./views/Dashboard/screens/DemoTable/DemoTable.jsx";

import InvoicePDF from "./views/Dashboard/screens/InvoicePDF/InvoicePDF.jsx";
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
        const response = await dispatch(
          getAllNotificationsNotViewed()
        );
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
        dispatch(
          getAllUserAutomations({
            userId: user.id,
            token: parsedUser.accessToken,
          })
        );
        // if(userFiles?.length == 0){
        dispatch(
          getUserFiles({
            userId: user.id,
            token: parsedUser.accessToken
          })
        );
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
          <Route path="/tables/settings/*" element={<PanelTemplateWrapper><Tables /></PanelTemplateWrapper>}></Route>
          <Route path="/tables" element={<PanelTemplateWrapper><Tables /></PanelTemplateWrapper>}></Route>
          <Route path="/tables/:id/settings/*" element={<PanelTemplateWrapper><Tables /></PanelTemplateWrapper>}></Route>
          <Route path="/tables/:id" element={<PanelTemplateWrapper><Tables /></PanelTemplateWrapper>}></Route>

          <Route path="/instructions" element={<PanelTemplateWrapper isOpenChat={true}><Instructions /></PanelTemplateWrapper>} />
          {/* <Route path="/demo" element={<PanelTemplateWrapper isOpenChat={true}><TableSkeleton2 /></PanelTemplateWrapper>} /> */}
          {/* <Route path="/scrap" element={<PanelTemplateWrapper><ScrapView /></PanelTemplateWrapper>}></Route> */}

          <Route path="/help" element={<PanelTemplateWrapper><HelpPage /></PanelTemplateWrapper>}></Route>
          <Route path="/help/:categoryId" element={<PanelTemplateWrapper><HelpPage /></PanelTemplateWrapper>}></Route>
          <Route path="/news" element={<PanelTemplateWrapper><NewsViewer /></PanelTemplateWrapper>}></Route>
          <Route path="/news/*" element={<PanelTemplateWrapper><NewsViewer /></PanelTemplateWrapper>}></Route>
          <Route path="/home/*" element={<PanelTemplateWrapper><Dashboard /></PanelTemplateWrapper>}></Route>
          <Route path="/home/accept-invite/:workspaceId/settings/workspace" element={<PanelTemplateWrapper><Dashboard /></PanelTemplateWrapper>}></Route>
          <Route path="/contacts/*" element={<PanelTemplateWrapper><Contacts /></PanelTemplateWrapper>}></Route>
          <Route path="/contacts/:contactId" element={<PanelTemplateWrapper><NewContact /></PanelTemplateWrapper>}></Route>
          <Route path="/assets/*" element={<PanelTemplateWrapper><Assets /></PanelTemplateWrapper>}></Route>
          <Route path="/assets/:assetId" element={<PanelTemplateWrapper><NewAsset /></PanelTemplateWrapper>}></Route>
          <Route path="/notification/*" element={<PanelTemplateWrapper><NotificationsView /></PanelTemplateWrapper>}></Route>
          <Route path="/accounts" element={<PanelTemplateWrapper><AccountsDashboard /></PanelTemplateWrapper>} />
          <Route path="/accounts/settings/*" element={<PanelTemplateWrapper><AccountsDashboard /></PanelTemplateWrapper>} />
          <Route path="/marketplace" element={<PanelTemplateWrapper><ExploreCommuniti /></PanelTemplateWrapper>} />
          <Route path="/marketplace/settings/*" element={<PanelTemplateWrapper><ExploreCommuniti /></PanelTemplateWrapper>} />
          <Route path="/users/*" element={<PanelTemplateWrapper><UsersDashboard /></PanelTemplateWrapper>} />
          <Route path="/invoice/:id" element={<PanelTemplateWrapper><InvoicePDF /></PanelTemplateWrapper>} />
          <Route path="/invoice/:id/*" element={<PanelTemplateWrapper><InvoicePDF /></PanelTemplateWrapper>} />
          <Route path="/docs" element={<PanelTemplateWrapper><Transactions /></PanelTemplateWrapper>} />
          <Route path="/docs/:id/settings/*" element={<PanelTemplateWrapper><Transactions /></PanelTemplateWrapper>} />
          <Route path="/docs/:id" element={<PanelTemplateWrapper><Transactions /></PanelTemplateWrapper>} />
          <Route path="/docs/:contactId/:docsId/*" element={<PanelTemplateWrapper><NewBIll /></PanelTemplateWrapper>} />
          <Route path="/calendar" element={<PanelTemplateWrapper ><CalendarView /></PanelTemplateWrapper>} />
          <Route path="/calendar/:tag" element={<PanelTemplateWrapper ><CalendarView /></PanelTemplateWrapper>} />
          <Route path="/calendar/:tag/:kanbanId" element={<PanelTemplateWrapper ><CalendarView /></PanelTemplateWrapper>} />
          <Route path="/calendar/:tag/:kanbanId/:taskId" element={<PanelTemplateWrapper ><CalendarView /></PanelTemplateWrapper>} />
          <Route path="/chat" element={<PanelTemplateWrapper isOpenChat={true}><ChatView /></PanelTemplateWrapper>} />
          <Route path="/chat/:agentId" element={<PanelTemplateWrapper isOpenChat={true}><ChatView /></PanelTemplateWrapper>} />
          <Route path="/chat/:agentId/:chatId/*" element={<PanelTemplateWrapper isOpenChat={true}><ChatView /></PanelTemplateWrapper>} />
          <Route path="/bot" element={<PanelTemplateWrapper isOpenChat={true}><NewAgentComponent /></PanelTemplateWrapper>} />
          <Route path="/bot/:id" element={<PanelTemplateWrapper isOpenChat={true}><NewAgentComponent /></PanelTemplateWrapper>} />
          <Route path="/articlestransactions" element={<PanelTemplateWrapper><ArticlesTransactions /></PanelTemplateWrapper>} />
          <Route path="/panel/path/:path/settings/*" element={<PanelTemplateWrapper><InvoicePanel /></PanelTemplateWrapper>} />
          <Route path="/panel/path/:path" element={<PanelTemplateWrapper><InvoicePanel /></PanelTemplateWrapper>} />
          <Route path="/panel/:id/settings/*" element={<PanelTemplateWrapper><InvoicePanel /></PanelTemplateWrapper>} />
          <Route path="/panel/:id" element={<PanelTemplateWrapper><InvoicePanel /></PanelTemplateWrapper>} />
          <Route path="/panel" element={<PanelTemplateWrapper><InvoicePanel /></PanelTemplateWrapper>} />
          <Route path="/error" element={<PanelTemplateWrapper><ErrorPage /></PanelTemplateWrapper>} />
          <Route path="/workflow" element={<PanelTemplateWrapper><Automate /></PanelTemplateWrapper>} />
          <Route path="/workflow/settings/*" element={<PanelTemplateWrapper><Automate /></PanelTemplateWrapper>} />
          <Route path="*" element={<PanelTemplateWrapper isOpenChat={true}><ChatView /></PanelTemplateWrapper>} />
        </Routes>
        {backgroundLocation && (
          <Routes >
            <Route path="/contacts/:contactId" element={<PanelTemplateWrapper><NewContact /></PanelTemplateWrapper>}></Route>
            <Route path="/assets/:assetId" element={<PanelTemplateWrapper><NewAsset /></PanelTemplateWrapper>}></Route>
            <Route path="/bot" element={<NewAgentComponent />} />
            <Route path="/bot/:id" element={<NewAgentComponent />} />
            <Route path="/panel/:id" element={<InvoicePanel />} />
          </Routes>
        )}
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

                  <Route path="/go/:id" element={<LandingPage />} />
                  <Route path="/contact" element={<ContactForm />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/upgrade/:categoryId" element={<UpgradePage />} />
                  <Route path="/upgrade" element={<UpgradePage />} />
                  <Route path="/help/:categoryId" element={<HelpPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/terms" element={<Terms />} />

                  <Route path="/freetrial" element={<FreeTrial />} />
                  <Route path="/login" element={<DashboardLogin />} />
                  <Route path="/register" element={<DashboardLogin />} />
                  <Route path="/recover" element={<DashboardLogin />} />
                  <Route path="/otp" element={<DashboardLogin />} />

                  <Route path="/share/:id" element={<ContactForm />} />
                  <Route path="/view/:id" element={<SharePDF />} />

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
