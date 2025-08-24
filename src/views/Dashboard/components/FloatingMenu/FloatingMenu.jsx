import { useEffect, useRef, useState } from "react";
import styles from "./FloatingMenu.module.css";
import { ReactComponent as FolderIcon } from "../../assets/folderOutline.svg";
import { ReactComponent as CameraIcon } from "../../assets/camIconBW.svg";
import { ReactComponent as NewBill } from "../../assets/penIconOutline.svg";
import { ReactComponent as PlusIcon } from "../../assets/automatizaIconNew.svg";
import { ReactComponent as PaperClipWhite } from "../../assets/paperClipWhite.svg";
import { ReactComponent as NewContact } from "../../assets/bookOutline.svg";
import { ReactComponent as NewActive } from "../../assets/NewAssetWhiteIcon.svg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeaderCard from "../HeaderCard/HeaderCard";
import { useTranslation } from "react-i18next";
import { setShowModal } from "../../../../slices/userSlices";


export default function FloatingMenu({
  openModalAutomate,
  setIsOpen,
  setShowLocationModal,
  setShowCreateFolder,
  setShowNewContact,
  setShowNewProduct,
  setShowNewBill,
  customPosition = {},
  setExistCreateFolder,
  ref,
  customStyle
}) {

  const dispatch = useDispatch();

  const { t } = useTranslation("navbarAdmin");
  const { user } = useSelector(
    (state) => state.user,
    shallowEqual
  );
  const [activeModal, setActiveModal] = useState(null);
  const navigate =useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const closeModal = () => setActiveModal(null);


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
  const baseMenuItems = [
    {
      icon: <PlusIcon />,
      text: t('automate'),
      action: openModalAutomate,
      shortCut: "Ctrl + F",
    },
    {
      icon: <PaperClipWhite />,
      text: t('uploadDocument'),
      action: () => {
        dispatch(setShowModal('location'))
      },
    },
    {
      icon: <FolderIcon />,
      text: t('newFolder'),
      action: () => {
        dispatch(setShowModal('createFolder'))
        setExistCreateFolder(true)
      },
    },
    {
      icon: <NewBill />,
      text: t('newInvoice'),
      action: () => {
        dispatch(setShowModal('newBill'))
      },
      shortCut: "Ctrl + D"
    },
    {
      icon: <NewActive />,
      text: t('newAsset'),
      action: () => {
        dispatch(setShowModal('newAsset'))
      },
      shortCut: "Ctrl + A"
    },
    {
      icon: <NewContact />,
      text: t('newContact'),
      action: () => {
        dispatch(setShowModal('newContact'))
      },
      shortCut: "Ctrl + C",
    },
  ];
  

  const menuItems = [
    ...baseMenuItems,
    ...(user?.payMethod?.length > 0 ? [
      {
        icon: <NewContact />,
        text: t('seeAllTransactions'),
        action: () => {
          navigate('/admin/docs/allDocs')
          setIsOpen(false);
        },
      },
      {
        icon: <NewContact />,
        text: t('createTemplate'),
        action: () => {
          navigate('/admin/docs/allDocs')
          setIsOpen(false);
        },
      }
    ] : [])
  ];
  if (isMobile) {
    menuItems.splice(2, 0, {
      icon: <CameraIcon />,
      text: t('takeAPhoto'),
      action: handleCameraAccess,
    });
  }


  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Control') {
        setIsVisible(true);
        return;
      }

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            menuItems.find(item => item.shortCut === "Ctrl + F")?.action();
            setIsVisible(false);
            break;
          case 'd':
            e.preventDefault();
            menuItems.find(item => item.shortCut === "Ctrl + D")?.action();
            setIsVisible(false);
            break;
          case 'a':
            e.preventDefault();
            menuItems.find(item => item.shortCut === "Ctrl + A")?.action();
            setIsVisible(false);
            break;
          case 'c':
            e.preventDefault();
            menuItems.find(item => item.shortCut === "Ctrl + C")?.action();
            setIsVisible(false);
            break;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);



  return (
    <>
      <div style={customStyle} ref={ref} className={styles.fabContainer}>
          <div className={styles.overlay} onClick={handleClickOutside}>
            <div
              className={`${styles.menuContainer} ${styles.menuOpen}`}
              style={customPosition}
            >
              {isMobile && (
                <HeaderCard
                  setState={handleClickOutside}
                  headerStyle={{ padding: "0 6px,", margin: "10px 0", background: "transparent" }}
                />
              )}
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className={`${styles.menuItem} ${item.text == t('createTemplate') && styles.disabledMenuItem}`}
                  disabled={item.text == t('createTemplate') }
                  onClick={() => {
                    item.action();
                    setIsVisible(false);
                  }}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuText}>{item.text}</span>
                  {item.shortCut && <span className={styles.shortcut}>{item.shortCut}</span>}
                </button>
              ))}
            </div>
          </div>
      </div>
      {isCameraActive && (
        <>
          <video
            ref={videoRef}
            autoPlay
            width="100%"
            height="auto"
            style={{ border: "1px solid #ccc", marginTop: "10px" }}
          ></video>
          <button onClick={handleCapture} style={{ marginTop: "10px" }}>
            {t('capturePhoto')}
          </button>
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            style={{ display: "none" }}
          ></canvas>
        </>
      )}

    </>
  );
}

