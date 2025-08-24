import React, { memo, useEffect, useMemo } from 'react';
import PanelTemplate from './PanelTemplate';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const arrayRoutes = [
    "home",
    "contacts",
    "assets",
    "notification",
    "accounts",
    "users",
    "docs",
    "chat",
    "agent",
    "articlestransactions",
    "panel",
]


const PanelTemplateWrapper = (({ children, ...props }) => {
    const location = useLocation();
    const { t } = useTranslation(["dashboard", "ChatView"]);
    const { countNotificationNoViewed } = useSelector((state) => state.notifications);

    const useMatchedBaseRoute = (pathname) => {

        const matched = arrayRoutes.find((route) =>
            pathname.includes(`${route}`)
        );

        return matched || 'home';
    };

    useEffect(() => {
        const translationId = localStorage.getItem("translationId");
        const titlePage = useMatchedBaseRoute(location?.pathname);
        document.title = `${translationId || t("ChatView:facturaGPT")} - ${t(titlePage)?.toUpperCase()} (${countNotificationNoViewed > 99 ? "+99" : countNotificationNoViewed})`;
    }, [countNotificationNoViewed, location?.pathname]);

    return (
        <PanelTemplate {...props}>
            {children}
        </PanelTemplate>
    );
});


export default PanelTemplateWrapper;
