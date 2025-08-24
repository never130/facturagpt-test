import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as AddPlus } from "../../assets/addPlus.svg";
import { ReactComponent as FacturaGPTSVG } from "../../assets/facturaGPTBlackIcon.svg";
import { ReactComponent as Star } from "../../assets/starPlus.svg";
import styles from "./NavbarAdmin.module.css";
import { ReactComponent as ChatIcon } from "../../assets/chatIcon.svg";
import { ReactComponent as DashboardBlackIcon } from "../../assets/DashboardBlackIcon.svg";
import { ReactComponent as DotsNotification } from "../../assets/dotsNotification.svg";
import { ReactComponent as GptsBlackIcon } from "../../assets/GptsBlackIcon.svg";
import { ReactComponent as LogoutBlackIcon } from "../../assets/LogoutBlackIcon.svg";
import { ReactComponent as SettingBlackIcon } from "../../assets/SettingBlackIcon.svg";
import { ReactComponent as StarPlus } from "../../assets/starPlus.svg";
import { ReactComponent as LunaDarkMode } from "../../assets/lunaDarkMode.svg";
import { ReactComponent as MenuMobileIcon } from "../../assets/menuIconBlack.svg";
import { ReactComponent as IconStar } from "../../assets/icon-star.svg";
import  IconWorkspace from "../../assets/icon-workspace.svg";
import { ReactComponent as IconNews } from "../../assets/icon-news.svg";

import { ReactComponent as IconClose } from "../../assets/icon-close.svg";

import { ReactComponent as IconSearch } from '../../assets/icon-search.svg';

import { menuOptions } from "./menuOptions.js";
import UserProfileMenuV2 from "./UserProfileMenuV2";

import { setNotification } from "@src/slices/notificationsSlices";
import { MdLightMode } from "react-icons/md";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as BlackCircleChecked } from "../../assets/blackCircleChecked.svg";
import UpgradePlanWrapper from "../../screens/UpgradePlan/UpgradePlan";
import Automate from "../Automate/Automate";
import PanelAutomate from "../Automate/panelAutomate/PanelAutomate";
import ColorPicker from "../ColorPicker/ColorPicker";
import CorporativeModalText from "../CorporativeModalText/CorporativeModalText";
import CreateFolderModal from "../CreateFolderModal/CreateFolderModal";
import FloatingMenu from "../FloatingMenu/FloatingMenu";
import GeneralSettings from "../GeneralSettings/GeneralSettings";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import NewAsset from "../NewAsset/NewAsset";
import NewBIll from "../NewBIll/NewBIll";
import NewContact from "../NewContact/NewContact";
import NewTag from "../NewTag/NewTag";
import Notification from "../Notification/Notification";
import SeeBill from "../Preview/SeeBill/SeeBill";
import SeeHistory from "../SeeHistory/SeeHistory";
import SelectCurrencyPopup from "../SelectCurrencyPopup/SelectCurrencyPopup";
import SelectLocation from "../SelectLocation/SelectLocation";
import MobileAsidebarNavigation from "./MobileAsidebarNavigation/MobileAsidebarNavigation";

import { deleteAutomation } from "../../../../actions/automate";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";
import DeleteChatAgents from "../DeleteChatAgents/DeleteChatAgents";
import SelectAgentModal from "../../screens/ChatView/SelectAgentModal/SelectAgentModal";
import NewUserInformation from "../NewUserInformation/NewUserInformation";
import VariableModal from "../VariableModal/VariableModal";


import NavbarNews from "./NavbarNews";

import AddPaymethodPopup from "../AddPaymethodPopup/AddPaymethodPopup";
import TokenModal from "../GeneralSettings/components/ConnectedApps/tokenModal/tokenModal";
import ConfirmationWithPasswordPopup from "../ConfirmationWithPasswordPopup/ConfirmationWithPasswordPopup";
import InviteToWorkspace from "../NewWorkspace/InviteToWorkspace/InviteToWorkspace";
import NewWorkspace from "../NewWorkspace/NewWorkspace";
import { getAssetsStatusViewed } from "../../../../actions/assets";
import { getAgentById } from "../../../../actions/chat";
import { getContactsStatusViewed } from "../../../../actions/contacts";
import { 
  createVariable, 
  getTableDataFiltered, 
  getTables, 
  getVariable, 
  selectedWorkspaceUserId, 
  updateAccount,
  createTable, 
  saveSearchHistory, 
  getSearchHistory, 
  SearchHistoryInput, 
  getTablesWithCounts 
} from "../../../../actions/user";

import {
  getAllNotifications, 
} from "../../../../actions/notifications";

import AudioWaves from "../AudioWaves/AudioWaves";

import { setFatherNewBill, setGlobalSearch, setShowModal } from "../../../../slices/userSlices";
import ExploreCommuniti from "../../screens/ChatView/ExploreCommuniti/ExploreCommuniti.jsx";

import HelpPopup from "../../../../components/HelpPopup/HelpPopup";
import MessageDoc from "../MessageDoc/MessageDoc";
import ProfileModalTemplate from "../ProfileModalTemplate/ProfileModalTemplate.jsx";
import { setSelectedWorkspaceId } from "../../../../slices/workspaces.js";
import { createWorkspacesAction, getSelectedWorkspace, getWorkspacesByIdAction, updateWorkspaceAction } from "../../../../actions/workspaces.js";
import useColors from "../../../../hooks/NavbarAdmin/useColors.js";


import { setTheme, setThemeColor } from "../../../../slices/themeSlices";


import TableSkeleton from "../TablesComponents/TypedTable/TableSkeleton2";
import NewTable from "../NewTable/NewTable.jsx";
import { setAsset, setFatherNewAsset } from "../../../../slices/assetsSlices.js";
import { setFatherNewContact } from "../../../../slices/contactsSlices.js";
import InfoExploreCommunity from "../../screens/ChatView/ExploreCommuniti/InfoExploreCommunity/InfoExploreCommunity.jsx";
import NewDocument from "../NewDocument/NewDocument.jsx";




const NavbarAdmin = ({ fromPath,  setFromPath = () => { }, setIsOpenSidebar, setActiveFileExplore, } ) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { unseenCount } = useSelector((state) => state.notifications)

  const { workspaceSelected } = useSelector((state) => state.workspace)

  const [themeStyles, setThemeStyles] = useState(
    document.documentElement?.getAttribute("data-theme")
  );
const [isMenuOpen2, setIsMenuOpen2] = useState(false);
  
  const {
    selectedAgent, searchTerm: searchTermState
  } = useSelector((state) => state.chat);

  // const [selectedAgent, setSelectedAgent] = useState({});
  const [showSelectAgent, setShowSelectAgent] = useState(false);
  const [searchAutomate, setSearchAutomate] = useState();
  const [editingCurrency, setEditingCurrency] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [workspaceData, setWorkspaceData] = useState({
    type: "private",
    typePay: "free",
  });
  const [showInviteToWorkspace, setShowInviteToWorkspace] = useState(false);
  const [userToInvite, setUserToInvite] = useState({
    mergePlanChecked: false,
  });
  const [showMergePlan, setShowMergePlan] = useState(false);
  const globalSearchRef = useRef(null)
  const [hideAutomate, setHideAutomate] = useState(false);
  const [variant, setVariant] = useState('')
  const [roleAutomate, setRoleAutomate] = useState('input')
  const settingsOptions = [
    "general",
    "account",
    "devices",
    "speech",
    "team",
    "getPlus",
    "workspace",
    "team",
    "dataControls",
    "connectedApps",
    "security",
    'newWorkspace'
  ];

  const { unseenCount: unseenCountContact } = useSelector((state) => state.contacts);
  const { unseenCount: unseenCountAsset } = useSelector((state) => state.assets);


  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { workspaces, selectedWorkspaceId } = useSelector(
    (state) => ({
      workspaces: state.workspace.workspaces,
      selectedWorkspaceId: state.workspace.selectedWorkspaceId,
    }),
    shallowEqual
  );



  const getAllNotificationsFn = async () => {
    const response = await dispatch(
      getAllNotifications({
        search: '',
        limit: 100,
        skip: 0,

      })
    );

    await dispatch(getContactsStatusViewed({}))
    await dispatch(getAssetsStatusViewed({}))
  };
  useEffect(() => {
    getAllNotificationsFn();
  }, [location?.pathname]);


  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')}m`;
    } else if (minutes > 0) {
      return `${minutes}m${secs.toString().padStart(2, '0')}s`;
    } else {
      return `${secs}s`;
    }
  };

  useEffect(() => {
    const updateTimer = () => {
      const startTime = localStorage.getItem('startTime');
      const baseTime = parseInt(localStorage.getItem('baseTime') || '0');
      const isStopped = localStorage.getItem('isStopped') === 'true';

      if (isStopped) {
        setElapsedTime(0);
        setIsPlaying(false);
        return;
      }

      if (!startTime && baseTime > 0) {
        setElapsedTime(baseTime);
        setIsPlaying(false);
      } else if (startTime) {
        const now = Date.now();
        const currentSessionTime = Math.floor((now - parseInt(startTime)) / 1000);
        setElapsedTime(baseTime + currentSessionTime);
        setIsPlaying(true);
      }
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const checkMergedPlan = () => {
    setUserToInvite((prev) => ({
      ...prev,
      mergePlanChecked: true,
    }));
  };

  useEffect(() => {
    const translation = localStorage.getItem("translationId");
    setVariant(translation ? translation : 'Factura')

    setThemeStyles(document.documentElement?.getAttribute("data-theme"));



  }, []);

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.includes("settings")) {
      const lastSegment = currentPath.split("/").filter(Boolean).pop();
      const matchedOption = settingsOptions.find(
        (option) => option === lastSegment
      );

      setCurrentSetting(matchedOption || null);
    } else if (location.pathname.includes('news')) {
    } else {
      setCurrentSetting(null);
    }


  }, [location]);







  const addFilterPath = (nuevoFiltro) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("automation", nuevoFiltro);

    navigate(
      {
        pathname: location.pathname,
        search: `?${searchParams.toString()}`,
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (location.search) {
      if (location.search.includes("automation")) {
        const searchParams = new URLSearchParams(location.search);
        const valorOriginal = decodeURIComponent(
          searchParams.get("automation") || ""
        );

        setSearchAutomate(valorOriginal);
        setTimeout(() => {
          dispatch(setShowModal('automate'))
        }, 0);
      }
    }
  }, [location.search]);

  useEffect(() => {
    let path = location.pathname.split("/");
    if (path[3] == 'settings' || (path[3] == 'accept-invite' && path[5] == 'settings')) {
      dispatch(setShowModal('settings'))

    }



  }, [location.pathname]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const automationId = searchParams.get("automation");

    if (automationId) {
      setIsModalAutomate(true);
      setSelectedAutomationData({
        id: automationId,
      });
    }
  }, []);

  const [seeHistory, setSeeHistory] = useState(false);


  const showModal = useSelector((state) => state.user.showModal);

  const { 
    paramModal, 
    user, 
    // showNotification, 
    showAutomation, 
    isWorkBackend,
    typeContentAutomateSlice, 
    selectedAutomationDataSlice, 
    roleAutomateSlice, 
    selectedAutomateToDeleteSlice,
    globalSearch, 
    tables, 
    tableDataMap, 
    assetsTable, 
    contactsTable, 
    docsTable,
    tablesFiltered 
  } = useSelector((state) => state.user, shallowEqual);


  const  {
    showNotification,
  } = useSelector((state) => state.notifications, shallowEqual);

    // console.log('tableDataMap NavbarAdmin', tableDataMap)

  useEffect(() => {
    dispatch(getTables({search: globalSearch}))
  }, [globalSearch])

  const [isHoverMixedTable, setIsHoverMixedTable] = useState(false);

  useEffect(() => {
    if (showModal?.name == "add") {
      setIsHoverMixedTable(showModal)
    } else {
      setIsHoverMixedTable(false)
    }

  }, [showModal])

  //   useEffect(() => {

  //     dispatch(setSelectedWorkspaceId(user?.selectedWorkspace));
  //   }, [user])


  const { theme } = useSelector((state) => state.theme);
  const { t } = useTranslation("navbarAdmin");

  // useEffect(() => {
  //   const getWorkspaces = async () => {
  //     await dispatch(getWorkspacesByIdAction({ userId: user?.id, }));


  // const { theme } = useSelector((state) => state.theme);
  // const { t } = useTranslation("navbarAdmin");
  // console.log('viendo los datos del user', user)
  useEffect(() => {
    const getWorkspaces = async () => {
      await dispatch(getWorkspacesByIdAction({ userId: user?.id, }));
      await dispatch(setSelectedWorkspaceId(user?.selectedWorkspace));
      // dispatch(selectedWorkspaceUserId({ workspaceId: user?.selectedworkspace }));
      await dispatch(getSelectedWorkspace())

    };

    getWorkspaces();
  }, [user?.id, dispatch]);


  const [isModalAutomate, setIsModalAutomate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [typeVariableModal, setTypeVariableModal] = useState("category");
  const [showVariableListModal, setShowVariableListModal] = useState(false);
  const [showVariableModal, setShowVariableModal] = useState(false);

  const [showNewTagModal, setShowNewTagModal] = useState(false);
  const [showNewContact, setShowNewContact] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showNewBill, setShowNewBill] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState(null);
  const [seeBill, setSeeBill] = useState(false);

  const [showPlusModal, setShowPlusModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [numNotification, setNumNotification] = useState(0);
  const [showChangeCurrencyPopup, setShowChangeCurrencyPopup] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    user?.selectedCurrency || "EUR"
  );

  const [typeDelete, setTypeDelete] = useState("");
  const [fatherLocationModal, setFatherLocationModal] = useState()
  const [deleteChats, setDeleteChats] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);

  const [typeContentAutomate, setTypeContentAutomate] = useState("");

  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });



  useEffect(() => {
    if (showAutomation) {
      openModalAutomate(true)
    }
  }, [showAutomation])

  useEffect(() => {
    typeContentAutomateSlice && setTypeContentAutomate(typeContentAutomateSlice)
    selectedAutomationDataSlice && setSelectedAutomationData(selectedAutomationDataSlice)
  }, [typeContentAutomateSlice, selectedAutomationDataSlice,])

  useEffect(() => {
    console.log('roleAutomateSlice', roleAutomateSlice)
    roleAutomateSlice && setRoleAutomate(roleAutomateSlice)
  }, [roleAutomateSlice])

  useEffect(() => {
    selectedAutomateToDeleteSlice && setSelectedAutomateToDelete(selectedAutomateToDeleteSlice)
  }, [selectedAutomateToDeleteSlice])

  useLayoutEffect(() => {
    if (showModal == 'floatingMenu' && buttonRef.current) {

      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left, width: rect.width, right: rect.right });
    }
  }, [showModal, isOpen]);

  const handleCloseNewClient = () => {
    setHideAutomate(false);
    window.history.pushState({}, "", `${window.location.pathname}`);

    setTimeout(() => {
      setTypeContentAutomate(false);
      setIsAnimating(false);
    }, 300);
    navigate({
      pathname: location.pathname,
      search: '',
    }, { replace: true });
  };
  const handleCloseSetting = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);

  const handleProfileClick = () => {
    setClickCount((prev) => prev + 1);

    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const timer = setTimeout(() => {
      if (clickCount === 0) {
        // Single click - open profile settings
        if (showModal !== 'profileSetting') {
          dispatch(setShowModal('profileSetting'));
        } else {
          dispatch(setShowModal(false));
        }
      } else {
        // Double click - navigate to /admin/home
        navigate("/admin/home");
      }
      setClickCount(0);
    }, 300);

    setClickTimer(timer);
  };
  const [GlobalSearchValidate,setGlobalSearchValidate] = useState(false);
  const handleClickRole = (e) => {
    console.log('esto es handleClickRole', handleClickRole)
    e.stopPropagation();

    if (user.role == "superadmin" || user.role == "admin") {
      navigate("/admin/accounts");
    } else {
      navigate("/admin/home");
    }
  };


  const openModalAutomate = () => {
    navigate('/admin/workflow')
    dispatch(setShowModal('automate'))
  };

  const closeModalAutomate = () => {
    setTypeContentAutomate("");
    setIsModalAutomate(false);
  };
  const [configuration, setConfiguration] = useState({
    type: "Gmail",
    folderLocation: "/Inicio/",
    includeAllRemitents: true,
    subjectExactMatch: true,
    bodyExactMatch: true,
    attachmentExactMatch: true,
    selectedTypes: [],
    addedRemitents: [],
    subjectKeyWords: [],
    bodyKeyWords: [],
    emailConnectionData: [],
    selectedEmailConnection: "",
    fileName: "",
    tags: "",
    notificateAfterExport: false,
    notificateGmail: false,
    notificateWhatsApp: false,
    gmailTo: "",
    gmailSubject: "",
    gmailBody: "",
    whatsAppToNotificate: "",
    whatsAppMessage: "",
    totalAmount: {
      currency: "USD",
      min: 0,
      max: 0,
    },
    labels: {
      name: "",
      conditions: [
        {
          title: "",
          description: "",
        },
      ],
      newCondition: {
        title: "",
        description: "",
      },
      filters: [
        {
          id: Date.now(),
          conditionCurrency: {
            title: "",
            description: "",
          },
          conditionOperator: "CONTAINS",
          conditionValue: "",
          type: "Condition",
        },
      ],
    },
    inputType: true,

    labels: null,
    filesExactMatch: false,
    phoneListNotificate: [],
    showContentSelectInfoToProcess: null,
    showContentImport: null,
    showContentExport: null,
    shotContentNotification: null,
    emailListColab: [],
    showContent: {
      info1: false,
      info2: false,
      info3: false,
      info4: false,
      info5: false,
      info6: false,
      info7: false,
      info8: false,
      info9: true,
    },
    actionFrequency: null,

  })
  useEffect(() => {
    setConfiguration((prev) => ({
      ...prev,
      type: typeContentAutomate,
    }));


  }, [typeContentAutomate])

  const handleShowContentAutomate = (
    type,
    automationData,
    fromSelectedAutomation
  ) => {
    if (fromSelectedAutomation) {
      setTypeContentAutomate("");
      setTimeout(() => {
        setTypeContentAutomate(type);
        setSelectedAutomationData(automationData);
      }, 300);
    } else {
      setTypeContentAutomate(type);
      setSelectedAutomationData(automationData);
    }
  };


  const [selectedLocationNew, setSelectedLocationNew] = useState(
    user?.selectedWorkspace + "/"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);


  const {
    presetColors,
    updatePresetColors: setPresetColors,
    secondaryColor,
  } = useColors();


  // const [showCorporativeModal, setShowCorporativeModal] = useState(false);
  const [corporativeTitle, setCorporativeTitle] = useState("");
  const [corporativeMessage, setCorporativeMessage] = useState("");
  const [logout, setLogout] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddPayMethodPopup, setShowAddPayMethodPopup] = useState(false);
  useEffect(() => {
    if (logout) {
      localStorage.clear();
      navigate("/login");
    }
  }, [logout]);

  const handleLogOut = () => {
    dispatch(setShowModal('logout'))
    setCorporativeTitle(t("logout"));
    setCorporativeMessage(t("areYouSureLogout"));
  };


  useEffect(() => {

    if (showNotification.id) {
      setTimeout(function () {
        dispatch(setNotification({}));
      }, 5000);
    }
  }, [showNotification]);


  const [existCreateFolder, setExistCreateFolder] = useState(false);


  const [selectedAutomateToDelete, setSelectedAutomateToDelete] =
    useState(null);




  const [voiceChat, setVoiceChat] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [countdownNumber, setCountdownNumber] = useState(null);
  const finalTranscriptRef = useRef("");
  const countdownNumberRef = useRef(5);

  const { agentId, chatId } = useParams();


  useEffect(() => {
    dispatch(
      getAgentById({
        idSelectedAgent: agentId,
      })
    );


  }, [agentId]);


  const recognitionRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      // alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          console.log('event.results[i][0].transcript', event.results[i][0].transcript)
          final += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      if (final) {
        console.log('final', final)
        setFinalTranscript((prev) => {
          const updated = prev + final;
          finalTranscriptRef.current = updated;
          return updated;
        });

      }

    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      sendTranscriptIfReady();
    };

    recognitionRef.current = recognition;

    if (selectedAgent?._id) {
      sendTranscriptIfReady()
    }

    return () => {
      recognition.stop();

    };

  }, [selectedAgent]);

  const sendTranscriptIfReady = () => {
   
    const transcript = finalTranscriptRef.current.trim();
   
    if (!transcript) {
      return
    }

    if (selectedAgent&&selectedAgent?._id) {
      console.log('si hay agenteeee')
      const navigationState = {
        rowId: transcript,
        selectedAgentState: selectedAgent,
      };
      
      
      navigate(`/admin/chat/${selectedAgent._id}`, {
        state: navigationState,
      });
      setFinalTranscript("");
      finalTranscriptRef.current = "";
    } else {
      console.log('no hay agenteeee')
      // setShowSelectAgent(true);
      dispatch(setShowModal('selectAgent'))
    }
  };


  const startCountdown = () => {
    if (countdownRef.current) return;
    setCountdownNumber(5);

    countdownRef.current = setInterval(() => {
      setCountdownNumber((prev) => {
        if (prev === 1) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          setCountdownNumber(null);
          stopRecordingAndSend();
          return null;
        }


        return prev - 1;
      });
    }, 1000);

  };



  const stopRecordingAndSend = () => {
    if (voiceChat) {
      recognitionRef.current?.stop();
      setVoiceChat(false);
    }
  };



  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdownNumber(null);
  };
  const handleClick = (e) => {
    e.preventDefault();

    cancelCountdown();

    if (!voiceChat) {
      setFinalTranscript("");
      setVoiceChat(true);
      recognitionRef.current?.start();
    } else {
      stopRecordingAndSend();
    }
  };

  const handleDelete = async () => {
    const res = await dispatch(
      deleteAutomation({
        automationId: selectedAutomateToDelete._id,
        userId: selectedAutomateToDelete.userId,
      })
    );
    return res;
  };

  const [userData, setUserData] = useState();
  const [initialUserData, setInitialUserData] = useState(null);

  const onToggleTheme = async (theme) => {
    try {
      dispatch(setTheme(theme));
      localStorage.setItem('theme', theme);
      const data = await dispatch(createVariable({ variableData: { type: "theme", title: "theme", description: theme } }));
    } catch (e) {
      console.error("Error setting theme:", e);
    }
  }


  useEffect(() => {
    if (user) {
      const newUserData = {
        nombre: user?.nombre || "",
        email: user?.email || "",
        profileImage: user?.profileImage || "",
        password: user?.password || "",
        phone: user?.phone || "",
        profileImage: user?.profileImage || "",
        countryCode: user?.countryCode || "+34",
        areaCode: user?.areaCode || "+34",
        country: user?.country || "",
        payMethod: user?.payMethod || [],
        plan: user?.plan || "Free",
        userDomain: user?.userDomain || "",
        corporativeLogos: user?.corporativeLogos || [],
        signatureImages: user?.signatureImages || [],
        selectedSignatureImage: user?.selectedSignatureImage || "",
        selectedCorporativeLogo: user?.selectedCorporativeLogo || "",
        fiscalNumber: user?.fiscalNumber || "",
        currency: user?.currency || "EUR",
        maxAccount: user?.maxAccount || 0,
        typePlan: user?.typePlan || 0,
        lastPayment: user?.lastPayment || 0,
        language: user?.language || "Español",
        selectedCurrency: user?.selectedCurrency || "Español",
        tokenGPT: user?.tokenGPT || "",
        billingDetails: user?.billingDetails || "",
        speechVoice: user?.speechVoice || "",
        speechLenguage: user?.speechLenguage || ""
      };
      setUserData(newUserData);
      setInitialUserData(newUserData);
    }
  }, [user]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const categoryRef = useRef(null);
  const profileIconRef = useRef(null);
  const stored = localStorage.getItem('messageChatView');
  const [lastSentMessage, setLastSentMessage] = useState([]);

 const handleSendMessage = async (message) => {
  // Validar que el mensaje no esté vacío
  const messageObject = {
    text: message.trim(),
  };
  dispatch(saveSearchHistory(message))

  if (selectedAgent?._id) {
    const navigationState = {
      rowId: messageObject.text,
      selectedAgentState: selectedAgent,
    };

    navigate(`/admin/chat/${selectedAgent._id}`, {
      state: navigationState,
    });

    setFinalTranscript("");
    finalTranscriptRef.current = "";
    dispatch(setGlobalSearch(""));
    setIsFocus(false);

    setIsMenuOpen2(false)
  } else {
    setIsMenuOpen2(false)
    setIsFocus(false);
    dispatch(setShowModal('selectAgent'));
  }
};
  useEffect(() => {
    if (showModal === 'profileSetting') {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }


  }, [showModal]);


  const menuItems = [
    {
      icon: <DashboardBlackIcon />,
      text: t("dashboard"),
      action: () => {
        navigate("/admin/home");
      },
      shortCut: "Alt + H",

    },
    {
      icon: <SettingBlackIcon />,
      text: t("setting"),
      action: () => {
        dispatch(setShowModal('settings'))

        let basePath = location.pathname;
        basePath = basePath.replace(/\/settings\/[^\/]+/, "");
        basePath = basePath.replace(/\/$/, "");
        const newPath = `${basePath}/settings/general`;
        navigate(newPath);
      },
      shortCut: "Alt + S",
    },

    {
      icon: <GptsBlackIcon />,
      text: 'Modo Avión',
      action: () => {
        navigate(`/admin/s`, {
          state: { backgroundLocation: location },
        })
      },
      shortCut: "Alt + B",
    },
    {
      icon: <StarPlus />,
      text: t("upgradePlan"),
      action: () => {
        dispatch(setShowModal('plus'))
      },
      className: styles.upgradePlan,
    },
    theme === "dark"
      ? {
        icon: <MdLightMode size={18} />,
        text: t("lightMode"),
        action: () => onToggleTheme("light"),
        shortCut: "Alt + J",
      }
      : {
        icon: <LunaDarkMode size={18} />,
        text: t("darkMode"),
        action: () => onToggleTheme("dark"),
        shortCut: "Alt + J",
      },
    {
      icon: <LogoutBlackIcon style={{ marginLeft: "4px" }} />,
      text: t("LogOut"),
      action: () => {
        handleLogOut()
      },
    },
  ];


  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Alt') {

        e.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
        dispatch(setShowModal('profileSetting'));

        return;
      }

      if (e.shiftKey) {
        if (e.key.toLowerCase() == "/") {
          e.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
          e.stopPropagation(); // Detener la propagación del evento
          globalSearchRef.current.focus()
          setIsFocus(true)

        }
      }

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            menuItems.find(item => item.shortCut === "Alt + S")?.action();
            dispatch(setShowModal(false))

            break;
          case 'h':
            e.preventDefault();
            menuItems.find(item => item.shortCut === "Alt + H")?.action();
            dispatch(setShowModal(false))

            break;
          case 'o':
            e.preventDefault();
            menuItems.find(item => item.shortCut === "Alt + B")?.action();
            dispatch(setShowModal(false))

            break;
          case 'j':
            e.preventDefault();
            menuItems.find(item => item.shortCut === "Alt + J")?.action();
            // setIsMenuOpen(false);
            // dispatch(setShowModal(false))


            break;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Alt') {

        // setIsMenuOpen(false);
        if (showModal == "profileSetting") dispatch(setShowModal(false))


      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [showModal, dispatch]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Control') {
        console.log('Control')
        // setIsOpen(true);
        dispatch(setShowModal('floatingMenu'))
        // dispatch(setShowModal('marketplace'))
        return;
      }

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'a':
            e.preventDefault();
            console.log('entra aca al control + c')
            setModalOpen(true)

            break;
          case 'c':
            e.preventDefault();
            console.log('entra aca al control + c')
            setModalOpen(true)

            break;
          case 'd':
            e.preventDefault();
            console.log('entra aca al control + c')
            setModalOpen(true)

            break;
        }

      }
    };


    const handleKeyUp = (e) => {

      if (e.key === 'Control') {
        if (showModal == "floatingMenu") {
          // setIsOpen(false);
          dispatch(setShowModal(false))
        }
      }

    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [modalOpen, showModal, dispatch]);


  const [isOpenNews, setIsOpenNews] = useState(() => {
    const stored = localStorage.getItem('isOpenNews');
    if (stored === 'true') return true;
    if (stored === 'false') return false;
    return window.location.pathname.includes('/news');
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const  handleSearchHistorial = async () => {
    const resp = await dispatch(SearchHistoryInput())
    setLastSentMessage(resp?.payload);
  }

useEffect(() => {
  function handleClickOutside(event) {
    if (
      globalSearchRef.current &&
      menuRef.current &&
      categoryRef.current &&
      !globalSearchRef.current.contains(event.target) &&
      !menuRef.current.contains(event.target) &&
      !categoryRef.current.contains(event.target)
    ) {
      
      setIsFocus(false);
      setIsMenuOpen2(false);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  const filteredMenuOptions = menuOptions.filter((item) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    if (selectedCurrency != user?.selectedCurrency) {
      setUserData((prev) => ({
        ...prev,
        selectedCurrency: selectedCurrency,
      }));

      dispatch(updateAccount({
        data: {
          ...userData,
          selectedCurrency: selectedCurrency,
        },
      }));
    }
  }, [selectedCurrency])


  useEffect(() => {
    if (isOpenNews) {
      localStorage.setItem('isOpenNews', 'true');
      if (!location.pathname.includes('/news')) {
        navigate('/news');
      }
    } else {
      localStorage.setItem('isOpenNews', 'false');
    }
  }, [isOpenNews]);

  useEffect(() => {
    if (location.pathname.includes('/news')) {
      if (!isOpenNews) setIsOpenNews(true);
    }
  }, [location.pathname]);


  const [selected, setSelected] = useState(1)

  useEffect(() => {

    if (tables.length == 0) {
      let res;
      let tables = [];
      const fn = async () => {
        res = await dispatch(getTables())

        if (res.payload?.tables) {
          tables = res.payload.tables;
        }
        if (tables.length > 0) {
          for (let table of tables) {
         const res = await dispatch(getTableDataFiltered({ tableId: table._id }));
        //  console.log('res getTableDataFiltered NavbarAdmin', res)
          }
        }
      }
      fn()
    }
  }, [])

  useEffect(() => {
    let res;
    let tables = [];

    const fn = async () => {
      res = await dispatch(getTables())

      if (res.payload?.tables) {
        tables = res.payload.tables;
      }
      if (tables.length > 0) {
        for (let table of tables) {
          const res = await dispatch(getTableDataFiltered({ tableId: table._id, search: globalSearch, }));
          // console.log('res getTableDataFiltered NavbarAdmin', res)
        }
      }
    }

    fn()

  }, [globalSearch, workspaceSelected])
  const clickTimeout = useRef(null);

  // Función para extraer el nombre después de /admin/ en la URL
  const getCurrentSection = () => {
    const pathSegments = location.pathname.split('/');
    const adminIndex = pathSegments.findIndex(segment => segment === 'admin');
    
    if (adminIndex !== -1 && adminIndex + 1 < pathSegments.length) {
      return pathSegments[adminIndex + 1];
    }
    
    return null; // Retorna null si no hay nada después de /admin/
  };

  useEffect(() => {
    setSelectedLocationNew(workspaceSelected?._id + "/")
    console.log('workspaceSelected',workspaceSelected)
  }, [workspaceSelected])


  return (
    <>
      {isOpenNews && (
        <div className={styles.NavbarNews}>
          <NavbarNews />
          <div
            className={styles.close}
            onClick={() => setIsOpenNews(false)}
          >
            <IconClose />
          </div>
        </div>
      )}

      {(isHoverMixedTable && isHoverMixedTable?.name == "add") && (
        <div
          className={`${styles.mixedTable} ${!document.querySelector('[class*="activeTab"]') ? styles.expanded : ""}`}
          style={{
            display: isHoverMixedTable?.name == "add" ? "flex" : "none",
            top: isHoverMixedTable?.y || 100,
            left: isHoverMixedTable?.x || 100,
          }}
        >
          <div className={styles.mixedTableSkeleton}>
            <TableSkeleton
              skeletonConfig={''}
              onCellClick={() => { }}
              onFormulaApply={() => { }}
              isAnimating={true}
            />
          </div>
          <div className={styles.mixedTableContent}>
            <div className={styles.mixedTableContentButtons}>
              <button onClick={async () => {
                                  await dispatch(
                                    createTable({ headers:   [
                                        {
                                          "title": "parameter 1",
                                          "key": "parameter 1",
                                          "label": "parameter 1",
                                          "type": "",
                                          "selected": false,
                                          "editing": false
                                        }
                                      ],
                                       name: "newTable",
                                        type: "blank", 
                                        color: "black", 
                                        selectedTags: [],
                                         userEmail: user.email, 
                                         activateAlerts: false,
                                         accessPermitType: "public",
                                         selectedColumnOption: "none",
                                         tags: [] })
                                  );
                                  let tables = [];
                            
                                  const res = await dispatch(getTables());
                                  if (res.payload?.tables) {
                                    console.log("res.payload.tables", res.payload.tables)
                                    tables = res.payload.tables;
                                  }
                                  console.log("tables", tables);
                            
                                if (tables.length > 0) {
                                  for (let table of tables) {
                                    await dispatch(
                                      getTableDataFiltered({
                                        tableId: table._id,
                                      })
                                    );
                                  }
                                }
                                await dispatch(getTablesWithCounts())
                        }}>
                Button Ai
              </button>
              <button className={styles.mixedTableContentButtonAi}>
                Cancelar
              </button>
            </div>
            <p>
              lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <small>
              Creado el 22 de julio de 2025
            </small>
          </div>
        </div>
      )}

      <div className={`${styles.navbarAdmin}`}>
        <div
          className={`${styles.loading} ${isLoading ? styles.active : ""}`}
        />
        <div className={styles.navbarAdminIcons}>
          <a className={styles.noTooltip} href={user ? "/admin/chat" : "/"}>

            {user?.methodPlan ? (
              <div className={styles.name}>
                <FacturaGPTSVG />
                {variant == 'Factura' ? variant : variant?.slice(0, -3) || 'Factura'}
                <span><strong>Gpt</strong></span>
              </div>
            ) : (
              <div className={styles.workspaceContainer}>
                <div className={styles.workspaceImage}>
                  <img src={workspaceSelected?.image || IconWorkspace} alt="" />
                  {/* <IconWorkspace /> */}
                </div>
                <b>
                  {workspaceSelected?.title || 'FacturaGPT'}
                </b>
                <IconStar />
              </div>
            )}

          </a>
          {selectedLocationNew}
          <div
            onClick={() => setMenuOpen(true)}
            className={styles.MenuMobileIcon}
          >
            <MenuMobileIcon />
          </div>
        </div>

        <div ref={menuRef} className={styles.NavarSearchExpand}>
          <HelpPopup helpId="1-4">
            <div className={`${styles.NavarSearchExpandInput} ${isFocus ? styles.isFocus : ''}`}>
              <IconSearch />
              <input ref={globalSearchRef}
                type="text"
                value={globalSearch}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  dispatch(setGlobalSearch(e.target.value))
                  handleSearchHistorial()
                }}
                placeholder={`Buscar documentos, contactos, activos y otras tablas`}
                onFocus={() => setIsFocus(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setGlobalSearchValidate(true)
                    e.preventDefault();
                    const query = globalSearch.trim();
                    if (query) {
                      handleSendMessage(e.target.value);
                    }
                  }
                }}
                onClick={() => setIsMenuOpen2(true)}
                autoComplete="off"
              />
              <div>
                /
              </div>
            </div>
          </HelpPopup>
          {(lastSentMessage || globalSearch.length > 0) && (isFocus || isMenuOpen2) && (
            <div className={styles.NavarSearchExpandList}>
              <div ref={categoryRef} className={styles.headerPopup}>
                <div id="typeContact" className={`${styles.typeContact}`}
                  style={{
                    padding: 0,
                    width: 'auto'
                  }}>

                  <React.Fragment >
                    <button
                      className={`${styles.categoryButton} ${selected == 1 && styles.selected}`}
                      onClick={() => {
                        setSelected(1)
                      }}
                      type="button"
                    >
                      {t('allSingular')}
                      {selected == 1 && <span>{(assetsTable.length + contactsTable.length + docsTable.length + filteredMenuOptions.length + tablesFiltered.length) || 0}</span>}
                    </button>
                  </React.Fragment>
                  <React.Fragment >
                    <button
                      className={`${styles.categoryButton} ${selected == 2 && styles.selected}`}
                      onClick={() => {
                        setSelected(2)
                      }}
                      type="button"
                    >
                      {t('assets')}
                      {selected == 2 && <span>{assetsTable.length || 0}</span>}
                    </button>
                  </React.Fragment>
                  <React.Fragment >
                    <button
                      className={`${styles.categoryButton} ${selected == 3 && styles.selected}`}
                      onClick={() => {
                        setSelected(3)
                      }}
                      type="button"
                    >
                      {t('contacts')}
                      {selected == 3 && <span>{contactsTable.length || 0}</span>}
                    </button>
                  </React.Fragment>
                  <React.Fragment >
                    <button
                      className={`${styles.categoryButton} ${selected == 4 && styles.selected}`}
                      onClick={() => {
                        setSelected(4)
                      }}
                      type="button"
                    >
                      {t('otherTables')}
                      {selected == 4 && <span>{tablesFiltered.length || 0}</span>}
                    </button>
                  </React.Fragment>
                </div>
              </div>
            
            {globalSearch.length > 0 || lastSentMessage && lastSentMessage.length > 0 && (
              <ul key="suggested-messages">
                <h4>{t('suggested')}</h4>
                
                          {lastSentMessage.length > 0 ? (
                            lastSentMessage.toReversed().map((msg, index) => (
                              <li className={styles.NavarSearchExpandItem} key="last-sent-message">
                              <div
                                className={styles.NavarSearchExpandItemContent}
                                onClick={(e) => {
                                  
                                  setGlobalSearchValidate(true)
                                  e.preventDefault();
                                    handleSendMessage(msg.data);
                                }}
                                style={{ cursor: 'pointer', height: '14px', justifyContent: 'left', paddingLeft: '5px' }} // Hace claro que es clickeable
                                role="button"
                                tabIndex={0}
                              >
                                <div className={styles.NavarSearchExpandItemIcon}>
                                  <IconSearch />
                                </div>
                                <div className={styles.NavarSearchExpandItemContentText} style={{alignItems: 'baseline'}}>
                                  
                                  <p className={styles.NavarSearchExpandItemContentTextDescription}>
                                    {msg.data}
                                  </p>
                                </div>
                              </div>
                            </li>

                            ))
                          ) : (
                            <p>No hay mensajes.</p>
                          )}
              </ul>
            )}
              {assetsTable.length > 0 && (selected == 1 || selected == 2) && (
                <ul>
                  <h4>{t('assets')}</h4>
                  {assetsTable.map((item, index) => (
                    <li
                      key={index}
                      className={styles.NavarSearchExpandItem}
                    >
                      <div className={styles.NavarSearchExpandItemContent} onClick={() => {
                            // dispatch(setAsset(item));
                            console.log('getCurrentSection', getCurrentSection())
                            dispatch(setFatherNewAsset(getCurrentSection()))
                            navigate(`/admin/assets/${item._id}`, { state: { backgroundLocation: location } });
                            dispatch(setGlobalSearch(""))
                      }}>
                        <div className={`${styles.NavarSearchExpandItemIcon}`} >
                          <ProfileModalTemplate
                            type={'navbarAdmin'}
                            image={item.image}
                            handleContactData={console.log("")}
                            id={item._id}
                            sticky={true}
                            customStyle={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "8px"
                            }}
                          />
                        </div>
                        <div className={styles.NavarSearchExpandItemContentText}>
                          <b className={styles.NavarSearchExpandItemContentTextTitle}>
                            {item.name || t('asset')}
                          </b>
                          <p className={styles.NavarSearchExpandItemContentTextDescription}>
                            {item.description || t('description')}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {contactsTable.length > 0 && (selected == 1 || selected == 3) && (
                <ul>
                  <h4>{t('contacts')}</h4>
                  {contactsTable.map((item, index) => (
                    <li
                      key={index}
                      className={styles.NavarSearchExpandItem}
                    >
                      <div className={styles.NavarSearchExpandItemContent} onClick={() => {
                            // dispatch(setContact(item));
                            dispatch(setFatherNewContact(getCurrentSection()))
                            navigate(`/admin/contacts/${item._id}`, { state: { backgroundLocation: location } });
                            dispatch(setGlobalSearch(""))
                      }}>
                        <div className={`${styles.NavarSearchExpandItemIcon} ${styles.darkColor}`}>
                          <ProfileModalTemplate
                            type={'navbarAdmin'}
                            image={item.image}
                            handleContactData={console.log("")}
                            id={item._id}
                            sticky={true}
                            customStyle={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "100%"
                            }}
                          />
                          {item.image}
                        </div>
                        <div className={styles.NavarSearchExpandItemContentText}>
                          <b className={styles.NavarSearchExpandItemContentTextTitle}>
                            {item.contactName}
                          </b>
                          <p className={styles.NavarSearchExpandItemContentTextDescription}>
                            {item.typeContact || t('typeContact')}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {docsTable.length > 0 && (selected == 1) && (
                <ul>
                  <h4>{t('documents')}</h4>
                  {docsTable.map((item, index) => (
                    <li
                      key={index}
                      className={styles.NavarSearchExpandItem}
                    >
                      <div className={styles.NavarSearchExpandItemContent} onClick={() => {
                            dispatch(setFatherNewBill(getCurrentSection()))
                            navigate(`/admin/docs/${undefined}/${item._id}`);
                            dispatch(setGlobalSearch(""))
                      }}>
                        <div className={styles.NavarSearchExpandItemIcon}>
                          {item.icon}
                        </div>
                        <div className={styles.NavarSearchExpandItemContentText}>
                          <b className={styles.NavarSearchExpandItemContentTextTitle}>
                            {item.documentTitle}
                          </b>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
               {tablesFiltered.length > 0 && (selected == 1 || selected == 4) && (
                <ul>
                  <h4>{t('otherTables')}</h4>
                  {tablesFiltered.map((item, index) => (
                    <li
                      key={index}
                      className={styles.NavarSearchExpandItem}
                    >
                      <div className={styles.NavarSearchExpandItemContent} onClick={() => {
                        navigate(`/admin/tables/${item._id}`);
                        dispatch(setGlobalSearch(""))
                      }}>
                        <div className={styles.NavarSearchExpandItemIcon}>
                          {item.icon}
                        </div>
                        <div className={styles.NavarSearchExpandItemContentText}>
                          <b className={styles.NavarSearchExpandItemContentTextTitle}>
                            {item.name}
                          </b>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {filteredMenuOptions.length > 0 && selected == 1 && (
                <ul>
                  <h4>{t('quickAccess')}</h4>
                  {filteredMenuOptions.map((item, index) => (
                    <li
                      key={index}
                      className={styles.NavarSearchExpandItem}
                    >
                      <div className={styles.NavarSearchExpandItemContent}>
                        <div className={styles.NavarSearchExpandItemIcon}>
                          {item.icon}
                        </div>
                        <div className={styles.NavarSearchExpandItemContentText}>
                          <b className={styles.NavarSearchExpandItemContentTextTitle}>
                            {item.title}
                          </b>
                          <p className={styles.NavarSearchExpandItemContentTextDescription}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {((selected == 1 && (assetsTable.length == 0 && contactsTable.length == 0 && docsTable.length == 0 && filteredMenuOptions.length == 0)) ||
                (selected == 2 && assetsTable.length == 0) || (selected == 3 && contactsTable.length == 0) || (selected == 4 && docsTable.length == 0))
                &&
                <ul>
                  <li className={styles.NavarSearchExpandItem}>
                    <div className={styles.NavarSearchExpandItemContent}>
                      <div className={styles.NavarSearchExpandItemContentText}>
                        <p className={styles.NavarSearchExpandItemContentTextDescription}>
                          No se han encontrado coincidencias
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>}
            </div>
          )}
        </div>

        {user?.payMethod?.length == 0 ? (
          <div className={styles.hiddenTablet}>
            <button
              onClick={() => setShowPlusModal(true)}
              className={styles.plus}
            >
              {t("buttonGetPlus")} <Star />
            </button>
          </div>
        ) : (
          <></>
        )}

        <div className={styles.hiddenMobile}>
          <div className={styles.profile}>

            <HelpPopup helpId="1-5">
              <a
                ref={buttonRef}
                data-tooltip={t("deployOptions")}
                onClick={() => dispatch(setShowModal('floatingMenu'))}
                className={`${styles.addIcon} ${isOpen ? styles.active : ""}`}
                style={{ marginBottom: "3px" }}
              >
                <AddPlus />
              </a>
            </HelpPopup>

         
            <HelpPopup helpId="1-1">
              <a
                onClick={() => {
                  setFromPath("chat");
                  navigate({
                    pathname: location.pathname,
                    search: "?open=true"
                  });
                }}
                className={fromPath.includes("chat") ? styles.active : ""}
                data-tooltip={t("chat")}
              >
                <ChatIcon />
              </a>
            </HelpPopup>
            {("webkitSpeechRecognition" in window || "SpeechRecognition" in window) && (
              <HelpPopup helpId="1-7">
              <a
                href="#!"
                onClick={handleClick}

                onMouseLeave={() => {
                  if (voiceChat) startCountdown();
                }}
                onMouseEnter={cancelCountdown}
                className={voiceChat ? "active" : ""}
                data-tooltip="Voice Chat"
                style={{ cursor: "pointer" }}
                >
                  <AudioWaves isRecording={voiceChat} setIsRecording={setVoiceChat} />
                  {countdownNumber && <span className={styles.notificationTotal}>{countdownNumber}</span>}
                </a>
              </HelpPopup>
            )}
            <HelpPopup helpId="1-6">
              <a
                onClick={() => {
                  setFromPath("news");
                  setIsOpenNews(true);
                }}
                className={fromPath.includes("news") ? styles.active : ""}
                data-tooltip={t("news")}
              >
                <IconNews />
              </a>
            </HelpPopup>

            <HelpPopup helpId="1-2">
              <a
                data-tooltip={t("notifications")}
                className={`${styles.number} 
                  ${fromPath == "notification" ? styles.active : ""}`}
                onClick={() => {
                  navigate({
                    pathname: location.pathname,
                    search: "",
                  }, { replace: true });
                  setFromPath("calendar/schedule");
                }}

              >
                <DotsNotification />
                {numNotification !== 0 && <span>{numNotification}</span>}
                {unseenCount > 0 && <span className={styles.notificationTotal}>{unseenCount >= 100 ? '+99' : unseenCount}</span>}
              </a>
            </HelpPopup>

            <HelpPopup helpId="1-8">
              <div
                ref={profileIconRef}
                onClick={handleProfileClick}
                className={styles.profileContainer}
              >
              <div className={styles.profileText}>
                {user?.nombre?.length >= 23 && (
                  <a style={{ width: "auto", fontSize: "15px" }} 
                className={styles.pWithTooltip} 
                data-tooltip={user?.nombre} 
                onClick={(e) => e.preventDefault()}>{`${user?.nombre.slice(0, 22)}..`}
                </a>)}
                {user?.nombre?.length <= 22 && (
                  <a 
                  className={styles.pWithTooltip} 
                  data-tooltip={user?.nombre} 
                  onClick={(e) => e.preventDefault()}>{user?.nombre || t("noFound")}
                  </a>
                  )}
                <div onClick={(e) => {
                  console.log('Span clicked');
                  e.preventDefault();
                  e.stopPropagation()
                  handleClickRole(e)
                }}
                  style={{ marginTop: "-8px", marginBottom: "8px", fontSize: "12px" }}
                >
                  {(user?.role === "superadmin" && isWorkBackend) && (
                    <>
                      👑
                    </>
                  )}

                  {user?.role || t("noFound")}
                </div>
              </div>

              <div className={`${styles.profileImageOff} ${true ? styles.active : ''}`}>
                {user?.profileImage && !imageError ? (
                  <img
                    className={styles.profileImage}
                    src={user.profileImage}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={styles.initials}>
                    {user?.nombre?.split(" ").map((word) => word[0] || "U").slice(0, 2)}

                    {elapsedTime > 0 && location.pathname !== '/admin/home' && (
                      <span className={`${styles.timeHour} ${isPlaying ? styles.playing : styles.paused}`}>
                        {formatTime(elapsedTime)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            </HelpPopup>
          </div>


          <UserProfileMenuV2
            isOpen={showModal === 'profileSetting'}
            onClose={() => dispatch(setShowModal(false))}
            triggerRef={profileIconRef}
          />
        </div>
      </div>

      {showModal == 'settings' && (
        <ModalBlackBgTemplate
          close={() => {
            dispatch(setShowModal(false))
            const path = location.pathname;

            const cleanedPath = path.replace(/\/settings\/[^\/]+$/, "");

            navigate(cleanedPath);
          }}
          customStyle={{
            maxWidth: "700px",
            width: "100vw",
            height: "80vh",
            minHeight: "80vh",
          }}
        >
          <div className={`${styles.sidebar}`}>
            <GeneralSettings
              setShowSidebar={() => dispatch(setShowModal(false))}
              setDeleteChats={setDeleteChats}
              secondaryColor={secondaryColor}
              // openModalAutomate={openModalAutomate}
              setSeeBill={setSeeBill}
              setTypeDelete={setTypeDelete}
              setShowTokenModal={setShowTokenModal}
              setShowAddPayMethodPopup={setShowAddPayMethodPopup}
              currentSetting={currentSetting}
              setEditingCurrency={setEditingCurrency}
              editingCurrency={editingCurrency}
              selectedCurrency={userData?.selectedCurrency || "EUR"}
              setSelectedCurrency={setSelectedCurrency}
              initialUserData={initialUserData}
              setInitialUserData={setInitialUserData}
              setUserData={setUserData}
              userData={userData}
              maxAccount={userData?.maxAccount}
              setShowWorkspace={setShowWorkspace}
              setShowInviteToWorkspace={setShowInviteToWorkspace}
              showWorkspace={showWorkspace}
              configuration={configuration}
              setConfiguration={setConfiguration}
              setNewWorkspace={setNewWorkspace}
              workspaceData={workspaceData}
              setWorkspaceData={setWorkspaceData}
              newWorkspace={newWorkspace}
            />
          </div>
        </ModalBlackBgTemplate>
      )}

      {/* {showWorkspace && (
        <NewWorkspace
          setShowWorkspace={setShowWorkspace}
          setShowInviteToWorkspace={setShowInviteToWorkspace}
          setNewWorkspace={setNewWorkspace}
          newWorkspace={newWorkspace}
          setWorkspaceData={setWorkspaceData}
          workspaceData={workspaceData}
        />
      )} */}

      {showInviteToWorkspace && (
        <InviteToWorkspace
          setShowInviteToWorkspace={setShowInviteToWorkspace}
          setUserToInvite={setUserToInvite}
          userToInvite={userToInvite}
          setShowMergePlan={setShowMergePlan}
          setWorkspaceData={setWorkspaceData}
          workspaceData={workspaceData}
        />
      )}

      {showMergePlan && (
        <ConfirmationWithPasswordPopup
          setState={setShowMergePlan}
          confirmatedPassword={checkMergedPlan}
          titlePopup={t("mergePlan")}
          descPopup={t("mergePlanDesc")}
          acceptBtn={
            <>
              {t('mergePlan')}
            </>}
        />
      )}

      {showAddPayMethodPopup && (
        <AddPaymethodPopup
          setShowAddPayMethodPopup={setShowAddPayMethodPopup}
        />
      )}

      {showTokenModal && (
        <ModalBlackBgTemplate
          close={() => setShowTokenModal(false)}
          customStyle={{
            maxWidth: "50%",
            minHeight: "60%",
          }}
        >
          <TokenModal setShowTokenModal={setShowTokenModal} />
        </ModalBlackBgTemplate>
      )}



      <MobileAsidebarNavigation
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        fromPath={fromPath}
        setFromPath={setFromPath}
        setShowPlusModal={setShowPlusModal}
        setIsOpen={setIsOpen}
        setShowOptions={setShowOptions}
        setShowSidebar={setShowSidebar}
      />

      {showModal == 'plus' && (
        <UpgradePlanWrapper
          onClose={() => dispatch(setShowModal(false))}
          setShowSelectCurrencyPopup={setEditingCurrency}
          setSelectedCurrency={setSelectedCurrency}
          selectedCurrency={selectedCurrency}
          setSeeHistory={setSeeHistory}
          seeHistory={seeHistory}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
        />
      )}

      {showModal == 'newTable' && (
        <NewTable />
      )}

      <NewUserInformation />

      {showModal == 'logout' && (
        <CorporativeModalText
          title={corporativeTitle}
          message={corporativeMessage}
          setState={() => dispatch(setShowModal(false))}
          action={true}
          setAction={setLogout}
          father={"logout"}
        />
      )}
      {showModal == 'infoExploreCommunity' && (
        <InfoExploreCommunity
          close={() => dispatch(setShowModal(false))}
        />
      )}

      {showModal == 'deleteChats' && (
        <DeleteChatAgents
          user={user}
          variant={paramModal.variant}
          type={paramModal.type}
          paramModal={paramModal}
          currentChat={paramModal.currentChat}
          agent={paramModal.agent}
          selectedOption={paramModal.selectedOption}
          idWorkspace={paramModal.idWorkspace}
          action={paramModal.action}
        />
      )}

      {showModal == 'colorPicker' && (
        <ColorPicker
          color={presetColors[presetColors.length - 1]}
          setColor={
            (tempColor) => {
              console.log("jjj Color selected:", tempColor);
              dispatch(setThemeColor(tempColor))
              if (!presetColors.includes(tempColor)) {
                setPresetColors([...presetColors, tempColor]);
                dispatch(setShowModal('settings'))
                setShowColorPicker(null);
              }
            }
          }
          presetColors={presetColors}
          setPresetColors={setPresetColors}
          setShowColorPicker={() => {
            dispatch(setShowModal(false))
            dispatch(setShowModal('settings'))
          }}
        />
      )}

      {showModal == 'seeHistory' && (
        <div className={styles.seeHistoryContainer}>
          <SeeHistory
            setSeeHistory={setSeeHistory}
            seeHistory={seeHistory}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
          />
        </div>
      )}

      {showModal == 'changeCurrency' && (
        <SelectCurrencyPopup
          setShowSelectCurrencyPopup={() => dispatch(setShowModal(false))}
          setSelectedCurrency={setSelectedCurrency}
          selectedCurrency={selectedCurrency}
        />
      )}

      {showModal == 'changeCurrency' && (
        <>
          <div
            className={styles.bgCurrency}
            onClick={() => dispatch(setShowModal(false))}
          />
          <div className={styles.newCurrencyPopup}>
            {currenciesOptions.map((currency, subIndex) => {
              const subOption = `${currency.name} (${currency.code}) - ${currency.symbol}`;
              return (
                <div
                  key={subIndex}
                  className={styles.dropdownOption}
                  onClick={async () => {
                    const newCurrency = currency.code;

                    setUserData((prev) => ({
                      ...prev,
                      selectedCurrency: newCurrency,
                    }));

                    await dispatch(updateAccount({
                      data: {
                        ...userData,
                        selectedCurrency: newCurrency,
                      },
                    }));
                  }}

                >
                  {subOption}
                  {userData.selectedCurrency === currency.code && (
                    <BlackCircleChecked />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {(showModal == 'floatingMenu') && (
        <FloatingMenu
          customStyle={{
            positioin: "absolute",
            top: "0px",
            right: `-${coords.right + coords.width}px`,
            transform: 'translateX(-50%)'
          }}
          ref={popupRef}
          setIsOpen={() => {
            setIsOpen(false)
            dispatch(setShowModal(false))
          }}
          openModalAutomate={openModalAutomate}
          showCreateFolder={showCreateFolder}
          setShowCreateFolder={setShowCreateFolder}
          showNewTagModal={showNewTagModal}
          setShowNewTagModal={setShowNewTagModal}
          showNewContact={showNewContact}
          setShowNewContact={setShowNewContact}
          showNewProduct={showNewProduct}
          setShowNewProduct={setShowNewProduct}
          setShowNewBill={setShowNewBill}
          setShowLocationModal={setShowLocationModal}
          setExistCreateFolder={setExistCreateFolder}
        />
      )}


      {showModal == 'deleteAutomate' && (
        <ConfirmationPopup
          onClose={() => setShowDeletePopup(false)}
          message={t("wantToDeleteAutomation")}
          titleMessage={t("deleteAutomation")}
          handleAccept={handleDelete}
          customStyles={{
            minHeight: "200px",
          }}
          customStylesMessage={{
            textAlign: "center",
          }}
          handleCloseNewClient={handleCloseNewClient}
          openModalAutomate={openModalAutomate}
        />
      )}

      {showModal == 'newTag' && (
        <NewTag setShowNewTagModal={setShowNewTagModal} />
      )}

      {showModal == 'createFolder' && (
        <CreateFolderModal
          onClose={() => dispatch(setShowModal(false))}
          location={selectedLocationNew}
          setShowLocationModal={setShowLocationModal}
          setSelectedLocationNew={setSelectedLocationNew}
          existCreateFolder={existCreateFolder}
          setFatherLocationModal={setFatherLocationModal}
        />
      )}

      {showModal == 'location' && (
        <SelectLocation
          onClose={() => dispatch(setShowModal(false))}
          setSelectedLocationNew={setSelectedLocationNew}
          selectedLocationNew={selectedLocationNew}
          showNewFolder={false}
          setIsLoading={setIsLoading}
          existCreateFolder={existCreateFolder}
          setFatherLocationModal={setFatherLocationModal}
          fatherLocationModal={fatherLocationModal}
        />
      )}


 
      {typeContentAutomate && (
        <PanelAutomate
          automationData={selectedAutomationData}
          typeContent={handleShowContentAutomate}
          setIsModalAutomate={setIsModalAutomate}
          close={handleCloseNewClient}
          type={typeContentAutomate}
          isAnimating={isAnimating}
          selectedAgent={selectedAgent}
          // setSelectedAgent={setSelectedAgent}
          showSelectAgent={showSelectAgent}
          setShowSelectAgent={setShowSelectAgent}
          typeVariableModal={typeVariableModal}
          setTypeVariableModal={setTypeVariableModal}
          showVariableListModal={showVariableListModal}
          setShowVariableListModal={setShowVariableListModal}
          showVariableModal={showVariableModal}
          setShowVariableModal={setShowVariableModal}
          setHideAutomate={setHideAutomate}
          setShowModal={setShowModal}
          configuration={configuration}
          setConfiguration={setConfiguration}
          setRoleAutomate={setRoleAutomate}
          roleAutomate={roleAutomate}

          setTypeContentAutomate={setTypeContentAutomate}
          setIsAnimating={setIsAnimating}
        />
      )}

      {showModal == 'seeBill' && (
        <SeeBill
          setSeeBill={() => dispatch(setShowModal(false))}
        />
      )}

      {showModal == 'newContact' && (
        <NewContact
          setShowNewContact={() => dispatch(setShowModal(false))}
          newContactProp={showNewContact}
        />
      )}

      {showModal == 'newAsset' && (
        <NewAsset
          setShowNewAsset={() => dispatch(setShowModal(false))}
          showNewProduct={showNewProduct}
          setShowNewContact={setShowNewContact}
          showNewContact={showNewContact}
        />
      )}

      {showModal == 'newBill' && (
        <NewBIll
          setShowNewBill={() => dispatch(setShowModal(false))}
        />
      )}
       {showModal == 'newDocument' && (
        <NewDocument
          setIsOpenSidebar={setIsOpenSidebar}
          setActiveFileExplore={setActiveFileExplore}
          setShowModal={setShowModal}
        />
      )}
      {showModal == 'selectAgent' && (
        <SelectAgentModal
          close={() => dispatch(setShowModal(false))}
          setState={() => dispatch(setShowModal(false))}
          finalTranscript={finalTranscript}
          globalSearch={globalSearch}
          globalSearchValidate={GlobalSearchValidate}
        />
      )}

      {showVariableModal && (
        <VariableModal
          setShowVariableModal={setShowVariableModal}
          VariableModal={showVariableModal}
          type={typeVariableModal}
          fromAutomateOut={"SelectCategoryAndConcept"}
        />
      )}


      {true && (
        <MessageDoc />
      )}



      {showNotification.id && (
        <Notification />
      )}

      {showModal == 'exploreCommunity' && (
        <ExploreCommuniti
          close={() => dispatch(setShowModal(false))}
        />
      )}
    </>
  );
};


export default NavbarAdmin;


