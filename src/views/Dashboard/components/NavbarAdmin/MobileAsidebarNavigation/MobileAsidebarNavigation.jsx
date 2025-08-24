import React, { useEffect, useRef, useState } from "react";
import styles from "./MobileAsidebarNavigation.module.css";

import { ReactComponent as ChatIcon } from "../../../assets/chatBlack.svg";
import { ReactComponent as PanelMobileIcon } from "../../../assets/panelBlack.svg";
import { ReactComponent as BoxIcon } from "../../../assets/assetsBlack.svg";
import { ReactComponent as DotsNotification } from "../../../assets/dotsNotificationBlack.svg";
import { ReactComponent as ClientIcon } from "../../../assets/contactsBlack.svg";
import { ReactComponent as SettingBlackIcon } from "../../../assets/SettingBlackIcon.svg";
import { ReactComponent as DashboardBlackIcon } from "../../../assets/DashboardBlackIcon.svg";
import { ReactComponent as StarPlus } from "../../../assets/starPlus.svg";
import { ReactComponent as LogoutBlackIcon } from "../../../assets/LogoutBlackIcon.svg";
import { ReactComponent as GptsBlackIcon } from "../../../assets/GptsBlackIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import GetPlusButton from "../../GetPlusButton/GetPlusButton.jsx";
import { ReactComponent as Plusgreen } from "../../../assets/plusIconGreen2.svg";
import { useTranslation } from "react-i18next";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { setTheme } from "../../../../../slices/themeSlices.js";
import { createVariable } from "../../../../../actions/user";
import { ReactComponent as IconStar } from "../../../assets/icon-star.svg";
import { ReactComponent as IconWorkspace } from "../../../assets/icon-workspace.svg";
import { ReactComponent as IconNews } from "../../../assets/icon-news.svg";
import { ReactComponent as WorkflowIcon } from "../../../assets/automatizaIconNew.svg";
import { ReactComponent as Calendar } from "../../../assets/calendarNewIcon.svg";
import { ReactComponent as PaperClipWhite } from "../../../assets/paperClipWhite.svg";
import { ReactComponent as Camera } from "../../../assets/camIconBW.svg";
import { ReactComponent as More } from "../../../assets/plus.svg";
import { ReactComponent as NewDocumentIcon } from "../../../assets/NewDocumentIcon.svg";
import { ReactComponent as NewTableIcon } from "../../../assets/NewTableIcon.svg";
import { ReactComponent as NewFolderIcon } from "../../../assets/NewFolderIcon.svg";
import { ReactComponent as NewContactIcon } from "../../../assets/NewContactIcon.svg";
import { ReactComponent as NewAssetIcon } from "../../../assets/NewAssetIcon.svg";
import { ReactComponent as NewBotIcon } from "../../../assets/NewBotIcon.svg";
import { ReactComponent as NewChatIcon } from "../../../assets/NewChatIconWhite.svg";
import { ReactComponent as NewWorkflowIcon } from "../../../assets/NewWorkflowIcon.svg";
import { ReactComponent as NewEventIcon } from "../../../assets/NewEventIcon.svg";
import { ReactComponent as ExploreCommunitiIcon } from "../../../assets/WorldIcon.svg";
import { ReactComponent as SettingNewIcon } from "../../../assets/SettingsWhite.svg";
import { ReactComponent as SendSuggestionIcon } from "../../../assets/SendSuggestionIcon.svg";
import { ReactComponent as HelpCenter } from "../../../assets/HelpcenterCircleIcon.svg";
import { ReactComponent as ContactIconColor } from "../../../assets/CorporationPeopleIcon.svg";
import { ReactComponent as AssetIconColor } from "../../../assets/assetIconColor.svg";
import { ReactComponent as DocIconColor } from "../../../assets/docIconColor.svg";
import { ReactComponent as TableIconColor } from "../../../assets/tableIconColor.svg";
import TruncatedText from "../../FileExplorer/TruncatedText/TruncatedText.jsx";
import { ReactComponent as IconContact } from "../../HomeExplorer/assets/icon-contact.svg";
import { ReactComponent as IconDocument } from "../../HomeExplorer/assets/icon-document.svg";
import { ReactComponent as IconAsset } from "../../HomeExplorer/assets/icon-asset.svg";
import { ReactComponent as IconTables } from "../../HomeExplorer/assets/icon-tables.svg";
import { setShowModal } from "../../../../../slices/userSlices.js";

const MobileAsidebarNavigation = ({
  menuOpen,
  setMenuOpen,
  menuOpenChat,
  setMenuOpenChat,
  fromPath,
  setShowPlusModal,
  setIsOpen,
  setShowOptions,
  setShowSidebar,
}) => {
  const { t } = useTranslation("navbarAdmin");
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [numNotification, setNumNotification] = useState(0);

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showTables, setShowTables] = useState(false);
  const { user, tablesSidebar } = useSelector((state) => state.user);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const handleProfileClick = () => {
    setShowSetting((prev) => !prev);
  };
  const [showCorporativeModal, setShowCorporativeModal] = useState(false);
  const [corporativeTitle, setCorporativeTitle] = useState("");
  const [corporativeMessage, setCorporativeMessage] = useState("");
  const [logout, setLogout] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
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

  const onToggleTheme = async (theme) => {
    try {
      dispatch(setTheme(theme));
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.error("Error setting theme:", e);
    }
  };
  const typeIcons = {
    contacts: <IconContact />,
    docs: <IconDocument />,
    assets: <IconAsset />,
    blank: <IconTables />,
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error("❌ Acceso a la cámara denegado o error:", error);
      alert("No se pudo acceder a la cámara. Por favor, revisa los permisos.");
    }
  };

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const imageData = canvasRef.current.toDataURL("image/png");
    }
  };
  return (
    <>
      <div
        className={`${styles.mobileMenuOverlay} ${(menuOpen && styles.activeMenuOverlay) || (menuOpenChat && styles.activeMenuOverlay)} `}
        onClick={() => {
          setMenuOpenChat !== undefined && setMenuOpenChat(false);
          setMenuOpen(false);
        }}
      ></div>
      <div
        className={`${styles.mobileMenu} ${(menuOpen && styles.activeMobileMenu) || (menuOpenChat && styles.activeMobileMenu)}`}
      >
        <div className={styles.workspaceContainer}>
          <div>
            <IconWorkspace />
          </div>
          <b>Workspace 1</b>
          <IconStar />
        </div>

        {user?.payMethod?.length == 0 ? (
          <div className={styles.fileExplorerGetPlusContainer}>
            <GetPlusButton
              action={() => {
                setMenuOpen(false);
                setShowPlusModal(true);
              }}
            />
          </div>
        ) : (
          <></>
        )}

        <ul>
          <li>
            {" "}
            <div
              onClick={handleProfileClick}
              className={styles.profileContainer}
            >
              {user?.profileImage && !imageError ? (
                <img
                  className={styles.profileImage}
                  src={user.profileImage}
                  alt={t("userProfilePicture")}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={styles.initials}>
                  {user?.nombre?.split(" ").map((word) => word[0] || "U")}
                </div>
              )}
              <div className={styles.profileText}>
                {user?.nombre?.length >= 20 && (
                  <p
                    className={styles.pWithTooltip}
                    data-tooltip={user?.nombre}
                  >{`${user?.nombre.slice(0, 19)}..`}</p>
                )}
                {user?.nombre?.length <= 19 && (
                  <p>{user?.nombre || t("noFound")}</p>
                )}
                <span>{user?.role || t("noFound")}</span>
              </div>
            </div>
          </li>
          <li>
            <a
              href="/admin/news"
              className={`${fromPath == "news" ? styles.active : ""} ${styles.bigger}`}
            >
              <div className={styles.svgContainer}>
                <IconNews />
              </div>
              {t("newsAndStock")}
            </a>
          </li>
          <li>
            <a
              href="/admin/chat"
              className={`${fromPath == "chat" ? styles.active : ""} ${styles.bigger}`}
            >
              <div className={styles.svgContainer}>
                <ChatIcon />
              </div>
              {t("chat")}
            </a>
          </li>
          <li>
            <a
              href="/admin/workflow"
              className={`${fromPath == "workflow" ? styles.active : ""} ${styles.bigger}`}
            >
              <div className={styles.svgContainer}>
                <WorkflowIcon />
              </div>
              {t("workflows")}
            </a>
          </li>
          <li>
            <a
              href="/admin/panel"
              className={fromPath == "panel" ? styles.active : ""}
            >
              <div className={styles.svgContainer}>
                <PanelMobileIcon />
              </div>
              {t("panel")}
            </a>
          </li>
          <li>
            <a
              href="/admin/calendar"
              className={fromPath == "calendar" ? styles.active : ""}
            >
              <div className={styles.svgContainer}>
                <Calendar />
              </div>
              {t("calendar")}
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                dispatch(setShowModal('location'))

              }}
            >
              <div className={styles.svgContainer}>
                <PaperClipWhite />
              </div>
              {t("uploadFiles")}
            </a>
          </li>
          <li>
            <a
              onClick={handleCameraAccess}
            >
              <div className={styles.svgContainer}>
                <Camera />
              </div>
              {t("takePhoto")}
            </a>
          </li>
          <li>
            <a
              onClick={() => setShowMoreOptions((prev) => !prev)}
            >
              <div className={styles.svgContainer}>
                <More />
              </div>
              {t("more")}
            </a>
          </li>
          {showMoreOptions && (
            <div className={styles.moreOptionsContainer}>
              <li>
                <a
                  onClick={() => {
                    dispatch(setShowModal('newBill'))
                    setMenuOpen(false)
                  }}
                >
                  <div className={styles.svgContainer}>
                    <NewDocumentIcon />
                  </div>
                  {t("newDocument")}
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate('/admin/tables')
                    setMenuOpen(false)
                  }}
                >
                  <div className={styles.svgContainer}>
                    <NewTableIcon />
                  </div>
                  {t("newTable")}
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    dispatch(setShowModal('createFolder'))
                    setMenuOpen(false)
                  }}
                >
                  <div className={styles.svgContainer}>
                    <NewFolderIcon />
                  </div>
                  {t("newFolder")}
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    dispatch(setShowModal('newContact'))
                    setMenuOpen(false)
                  }}
                >
                  <div className={styles.svgContainer}>
                    <NewContactIcon />
                  </div>
                  {t("newContact")}
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    dispatch(setShowModal('newAsset'))
                    setMenuOpen(false)
                  }}
                >
                  <div className={styles.svgContainer}>
                    <NewAssetIcon />
                  </div>
                  {t("newAsset")}
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate('/admin/bot')
                    setMenuOpen(false)
                  }}
                >
                  <div className={styles.svgContainer}>
                    <NewBotIcon />
                  </div>
                  {t("newBot")}
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate('/admin/chat')
                    setMenuOpen(false)
                  }}
                >
                  <div className={styles.svgContainer}>
                    <NewChatIcon />
                  </div>
                  {t("newChat")}
                </a>
              </li>
              <li>
                <a

                  onClick={() => {
                    navigate('/admin/workflow')
                    setMenuOpen(false)
                  }}
                >
                  <div className={styles.svgContainer}>
                    <NewWorkflowIcon />
                  </div>
                  {t("newWorkflow")}
                </a>
              </li>
              <li>
                <a
                >
                  <div className={styles.svgContainer}>
                    <NewEventIcon />
                  </div>
                  {t("newEvent")}
                </a>
              </li>
            </div>
          )}
          <li>
            <a
              onClick={() => setShowTables((prev) => !prev)}
            >
              <div className={styles.svgContainer}>
                <PanelMobileIcon />
              </div>
              {t("tables")}
            </a>
          </li>
          {showTables && (
            <div className={styles.moreOptionsContainer}>
               {tablesSidebar.map((item) => (
                        <li
                            key={item._id}
                            className={styles.menuItem}
                            onClick={() => {navigate(`/admin/tables/${item._id}`)
                        }}
                            // style={{
                            //     display: item.disabled ? "none" : "flex"
                            // }}
                        >
                            <div className={`${styles.menuItemIcon} ${styles.iconTable}`} style={{color:item.color}}>
                                {/* {console.log('esto es item', item)} */}
                                <div className={`${styles.svgContainer} ${styles[item.type] || ''}`}>
  {typeIcons[item.type] || typeIcons['contacts']}
</div>


                  </div>
                  {<TruncatedText style={{ width: "100%" }} text={item.name || t(item.type)} />}

                </li>
              ))}

            </div>
          )}
          <li>
            <a
              href="/admin/marketplace"
              className={fromPath == "marketplace" ? styles.active : ""}
            >
              <div className={styles.svgContainer}>
                <ExploreCommunitiIcon />
              </div>
              {t("exploreCommunity")}
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                dispatch(setShowModal('settings'))
                let basePath = location.pathname;
                basePath = basePath.replace(/\/settings\/[^\/]+/, "");
                basePath = basePath.replace(/\/$/, "");
                const newPath = `${basePath}/settings/general`;
                navigate(newPath);
                setMenuOpen(false)
              }}
            >
              <div className={styles.svgContainer}>
                <SettingNewIcon />
              </div>
              {t("setting")}
            </a>
          </li>
          <li>
            <a
              href="/help"
            >
              <div className={styles.svgContainer}>
                <HelpCenter />
              </div>
              {t("helpCenter")}
            </a>
          </li>
          <li>
            <a
            >
              <div className={styles.svgContainer}>
                <SendSuggestionIcon />
              </div>
              {t("sendSuggestions")}
            </a>
          </li>



        </ul>
        {showSetting && (
          <div className={styles.options}>
            <ul>
              <li
                onClick={() => {
                  setMenuOpen(false);
                  setShowSidebar(true);
                }}
              >
                <SettingBlackIcon /> {t("setting")}
              </li>
              <li onClick={() => navigate("/admin/home")}>
                <DashboardBlackIcon /> {t("dashboard")}
              </li>
              <li
                onClick={() => {
                  navigate(`/admin/bot`);
                }}
              >
                <GptsBlackIcon /> {t("gpts")}
              </li>
              <li
                className={styles.upgradePlan}
                onClick={() => {
                  setMenuOpen(false);
                  setShowPlusModal(true);
                }}
              >
                <StarPlus /> {t("upgradePlan")}
              </li>
              {theme === "dark" ? (
                <li onClick={() => onToggleTheme("light")}>
                  <MdLightMode size={18} /> {t("lightMode")}
                </li>
              ) : (
                <li onClick={() => onToggleTheme("dark")}>
                  <MdDarkMode size={18} />
                  {t("darkMode")}
                </li>
              )}
              <li onClick={handleLogOut}>
                <LogoutBlackIcon /> {t("LogOut")}
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileAsidebarNavigation;
