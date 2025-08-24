import styles from "./PanelTemplate.module.css";
import FileExplorer from "../../components/FileExplorer/FileExplorer.jsx";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin.jsx";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import HomeExplorer from "../HomeExplorer/HomeExplorer.jsx";
import ChatExplorer from "../ChatExplorer/ChatExplorer.jsx";

const PanelTemplate = ({
  isOpenChat,
  setMenuOpenChat,
  children,
  mobileSelectedDocument,
  setMobileSelectedDocument,
  setSwiped,
  swiped,
  setSelectedPdf,
  customContentTemplate = {},
}) => {


  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [fileNameS3, setFileNameS3] = useState(null);

  const location = useLocation();
  const { t } = useTranslation("PanelTemplate");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [numNotification, setNumNotification] = useState(0);
  const params = useParams();

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const contentRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const handleProfileClick = () => {
    setClickCount((prev) => prev + 1);

    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const timer = setTimeout(() => {
      if (clickCount === 0) {
        setShowSidebar(!showSidebar);
      } else {
        navigate("/admin/home");
      }
      setClickCount(0);
    }, 300);

    setClickTimer(timer);
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };






  const [fromPath, setFromPath] = useState(() => {
    const savedPath = localStorage.getItem("lastPath");
    const currentPath = window.location.pathname.split("/admin/")[1];
    return currentPath && currentPath !== savedPath
      ? currentPath
      : savedPath || "chat";
  });

  useEffect(() => {
    const savedPath = localStorage.getItem("lastPath");
    const currentPath = location.pathname.split("/admin/")[1];

    const newPath = currentPath && currentPath !== savedPath
      ? currentPath
      : savedPath || "chat";

    setFromPath(newPath);
  }, [location.pathname]);


  const [pagePath, setPagePath] = useState(() => {
    const path = window.location.pathname.split("/")[2];

    return path;
  });
  const agentId = localStorage.getItem("selectedAgentId");
  const chatId = localStorage.getItem("selectedChatId");

  useEffect(() => {
    const handleBeforeUnload = () => {
      navigate(`/admin/${fromPath}${location?.search}`);

    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  useEffect(() => {
    localStorage.setItem("lastPath", fromPath);

    if (agentId && chatId && fromPath == 'chat') {
      navigate(`/admin/${fromPath}/${agentId}/${chatId}${location?.search}`, { state: location?.state });
    } else if (agentId && fromPath == 'chat') {
      navigate(`/admin/${fromPath}/${agentId}${location?.search}`, { state: location?.state });
    } else {
      navigate(`/admin/${fromPath}${location?.search}`, { state: location?.state });
    }
  }, [fromPath]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path === '/admin/') {
      if (agentId && chatId && fromPath === 'chat') {
        navigate(`/admin/${fromPath}/${agentId}/${chatId}`);
      } else if (agentId && fromPath === 'chat') {
        navigate(`/admin/${fromPath}/${agentId}`);
      } else {
        navigate(`/admin/${fromPath}`);
      }
    }
  }, []);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentElement;
      const currentScrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
      const isTop = scrollTop <= 10;

      setIsAtBottom(isBottom);
      setIsAtTop(isTop);
      setScrollPercentage(Math.round(currentScrollPercentage));

    };

    contentElement.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      contentElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [leftWidth, setLeftWidth] = useState(200);
  const isResizing = useRef(false);
  const startX = useRef(0);

  const handleMouseDown = (e) => {
    isResizing.current = true;
    startX.current = e.clientX;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };


  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const offset = e.clientX - startX.current;
    const newWidth = leftWidth + (offset / window.innerWidth) * 2000;

    if (newWidth > 200 && newWidth < 700) {
      setLeftWidth(newWidth);
    }
  };


  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = "auto";
    document.body.style.userSelect = "auto";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  const [isOpen, setIsOpen] = useState(() => {
    if (window.location.pathname.includes('admin/calendar')) {
      return true;
    }

    const isOpen = localStorage.getItem("isOpen") || "false";
    return isOpen === "true";
  });


  useEffect(() => {
    localStorage.setItem("isOpen", `${isOpen}`);
  }, [isOpen]);


  const [path, setPath] = useState(window.location.pathname.split("/")[2]);

  const activeChatExplorer = ['chat', 'chats', 'marketplace'];
  const activeExpand = ['home', 'docs', 'contacts', 'assets', 'tables', 'calendar']
  const [activeFileExplore, setActiveFileExplore] = useState(false);


  useEffect(() => {
    if (path && path.includes('panel')) {
      setActiveFileExplore(true);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('open')) {
      setActiveFileExplore(false);
      setIsOpen(true);
    }

    setPath(window.location.pathname.split("/")[2]);
  }, [window.location.pathname]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX.current;
      if (diffX > 60 && touchStartX.current < 40) {
        setSidebarOpen(true);
      }
      touchStartX.current = null;
    }
  };

  const handleSidebarClose = () => { setSidebarOpen(false) };


  return (
    <div
      ref={contentRef}
      className={styles.body}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <NavbarAdmin fromPath={fromPath} setFromPath={setFromPath} setIsOpenSidebar={setIsOpen} setActiveFileExplore={setActiveFileExplore} />
      <div className={styles.container}>
        <HomeExplorer
          isOpen={(isMobile && sidebarOpen) ? false : isOpen}
          setIsOpen={(isMobile && sidebarOpen) ? () => handleSidebarClose() : setIsOpen}
          handleSidebarClose={handleSidebarClose}
          isTransparent={!activeFileExplore && (activeExpand.includes(path) || !isOpen && activeChatExplorer.includes(path))}
          activeFileExplore={activeFileExplore}
          setActiveFileExplore={setActiveFileExplore}
          zIndex={(isMobile && sidebarOpen) ? { zIndex: "1001", background: "#F5F5F5", width: "100%" } : undefined}
          expanded={(isMobile && sidebarOpen) && true}
        />
        {isMobile && sidebarOpen && (
          <div
            className={styles.mobileSidebarOverlay}
            onClick={handleSidebarClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
          />
        )}
        {isOpen &&
          <FileExplorer
            isOpen={activeFileExplore}
            toggleMenu={toggleMenu}
            setMobileSelectedDocument={setMobileSelectedDocument}
            mobileSelectedDocument={mobileSelectedDocument}
            pagePath={pagePath}
            setSwiped={setSwiped}
            swiped={swiped}
            setSelectedPdf={setSelectedPdf}
            leftWidth={leftWidth}
            setSelectedFileS3={setSelectedFileS3}
            setFileNameS3={setFileNameS3}
          />
        }


        <ChatExplorer
          isOpen={(isOpen && !activeFileExplore && activeChatExplorer.includes(path))}
          leftWidth={leftWidth}
        />



        <>
          {!isMobile && pagePath !== "accounts" && (
            <div
              style={{
                height: "100%",
                minWidth: "8px",
                cursor: "ew-resize",
                marginLeft: "-8px",
                zIndex: "9",
              }}
              onMouseDown={handleMouseDown}
            />
          )}
          <div
            className={`${styles.mobileMenuOverlay} ${(menuOpen && styles.activeMenuOverlay) || (menuOpen && styles.activeMenuOverlay)} `}
            onClick={() => {
              setMenuOpen(false);
            }}
          />

        </>


        <div

          className={`${styles.contentTemplate}  ${isAtBottom ? styles.isAtBottom : ''}`}
          style={customContentTemplate}

        >

          {children}
        </div>
      </div>
    </div>
  );
};

export default PanelTemplate;

