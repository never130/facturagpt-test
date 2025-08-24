import * as XLSX from "xlsx";
import React, { useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { de, enUS, es, fr, it, ja, pt, zhCN } from "date-fns/locale";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18.js";
import { v4 as uuidv4 } from "uuid";

import ChatMenu from "./ChatMenu.jsx";

import { formatAgoDate } from "../../../../utils/agoDateUtil.js";
import styles from "./ChatView.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ScrapingRightPanel from "./Meet/MeetScraping/ScrapingRightPanel.jsx";
import emptyImage from "../../assets/ImageEmpty.svg";
import { ReactComponent as Arrow } from "../../assets/BlackDiagonalArrow.svg";
import { ReactComponent as InternetIconChat } from "../../assets/InternetIconChat.svg";
import { ReactComponent as BlackClip } from "../../assets/paperClipBlack.svg";
import { ReactComponent as BlackMicrophone } from "../../assets/paperMicrophone.svg";
import { ReactComponent as AddPlus } from "../../assets/Plus Icon Black.svg";
import { ReactComponent as IconClose } from "../../assets/closeGray.svg";
import { ReactComponent as FileIcon } from "../../assets/fileIcon.svg";
import { ReactComponent as GrayDiagonalArrow } from "../../assets/GrayDiagonalArrow.svg";
import { ReactComponent as ImageIcon } from "../../assets/imageIcon.svg";
import { ReactComponent as SoundOffIcon } from "../../assets/SoundOffIcon.svg";
import { ReactComponent as SoundOnIcon } from "../../assets/SoundOnIcon.svg";
import { ReactComponent as TokenOpenAI } from "../../assets/tokenOpenAI.svg";
import { ReactComponent as ClaudeAnthropic } from "../../assets/claudeAnthropic.svg";
import { ReactComponent as IconVerify } from "./assets/icon-verify.svg";
import { ReactComponent as IconCancel } from "./assets/icon-cancel.svg";
import { ReactComponent as ArrowUp } from "../../assets/arrowUp.svg";
import { ReactComponent as PauseIcon } from "../../assets/PauseIcon.svg";
import { ReactComponent as IconAttach } from "./assets/icon-attach.svg";
import { ReactComponent as IconAutomate } from "./assets/icon-automate.svg";
import { ReactComponent as IconStar } from "./assets/icon-star.svg";
import { ReactComponent as IconTag } from "./assets/icon-tag.svg";

import MiniProfileModal from "./MiniProfileModal/MiniProfileModal.jsx";
import AutomateDataComponent from "../../components/Automate/utils/automatesJson.js";
import orangeAgentIcon from "../../assets/orangeAgentIcon.svg";
import ModalConnectionGoogle from "../../components/Automate/Components/GmailFormCreateAutomate/ModalAddConnectionGmail.jsx";
import ChatTags from "./ChatTags/ChatTags.jsx";
import FiltersDropdownContainer from "../../components/FiltersDropdownContainer/FiltersDropdownContainer";
import analizeBill from "../../assets/analizeBill.svg";
import ContactsPopup from "../../components/ContactsPopup/ContactsPopup";
import askAssets from "../../assets/askAssets.svg";
import askClient from "../../assets/askClient.svg";
import askDocument from "../../assets/askDocument.svg";
import askHelp from "../../assets/askHelp.svg";
import facturaGPTBlack from "../../assets/facturaGPTBlackIcon.svg";
import facturaGPTWhite from "../../assets/FacturaGPTW.svg";

import Google from "../../../../translation/AutomatesComponent/ch/google.js";
import DonutTimer from "./DonutTimer/DonutTimer.jsx";
import CreateApiConnection from "./CreateApiConnection/CreateApiConnection.jsx";
import FloatingMenu from "../../components/FloatingMenu/FloatingMenu.jsx";
import NewAgentComponent from "../../components/NewAgentComponent/NewAgentComponent.jsx";
import AudioWaves from "../../components/AudioWaves/AudioWaves.jsx";
import BtnOPtionsMessage from "./BtnOptionsMessage/BtnOPtionsMessage.jsx";
import Scroller from "./ChatTags/Scroller.jsx";
import SelectAgentModal from "./SelectAgentModal/SelectAgentModal.jsx";
import FolderIndicator from "./Meet/FileExplorer/FolderIndicator.jsx";
import AppIndicator from "./Meet/FileExplorer/AppIndicator.jsx";

import Meet from "./Meet/index.jsx";

import { setShowModal } from "../../../../slices/userSlices";


import { getAutomatesByIds, importData } from "../../../../actions/automate.js";

import { VoiceMessageBubble } from "./Meet/MessageAudio/MessageAudio.jsx";

import {
  fetchByChat,
  fetchByMenu,
  restartLastMessage,
  searchInWebAction,
  validateTokenGPT
} from "../../../../actions/chat.js";

import { setAppFiles } from "../../../../slices/docsSlices";


import { getTokens, updateAccount, updateTokens } from "../../../../actions/user";

import { setShowAutomation, } from "@src/slices/userSlices";

import { setAsset, setFatherNewAsset, setIdFatherNewAsset } from "../../../../slices/assetsSlices.js";
import { setContact, setFatherIdNewContact, setFatherNewContact } from "../../../../slices/contactsSlices.js";
import { setMessageDocsShow, setMessageDocsData, setMessageDocsDocId, setMessageDocsSelectedSection, createAppFile } from "../../../../slices/docsSlices";
import { setChatList, setEmptyChat } from "../../../../slices/chatSlices.js";
import { languageFlags } from "../../../../utils/flags.js";
import { apiUrl } from "../../../../apiBackend.js";
import { getAgents } from "../../../../actions/agents.js";




// import DynamicTable from "../../components/DynamicTable/DynamicTable.jsx";

import { setFatherNewBill, setFatherIdNewBill } from "../../../../slices/userSlices.js";


import textSpeakerScraping from "./Meet/MeetScraping/speaker.js";

export const ChatBody = ({
  insertMessage,
  scrap,
  setScrap,
  itemsSelected,
  setItemsSelected,
  handleSendMessage,
  showReply,
  setShowReply,
  isLoadBot,
  handleChat,
  messages,
  setMessages,
  messageContainerRef,
  inputValue,
  setInputValue,
  userData,
  isAgentPopup,
  hiddeCarousel,
  chatId,
  isAgentModal,
  tokenInput,
  tokenOutput,
  timeToFinishResponse,
  proptText,
  autoClear,
  setAutoClear,
  filePayload,
  setFilePayload,
  newChat,
  setNewChat,
  containsArroba,
  handleSelectItem,
  windowWidth,
  setSearchInWeb,
  searchInWeb,
  setTokenInput,
  setTokenOutput,
  setTimeToFinishResponse,
  showInfoMessage,
  setShowInfoMessage,
  agentId,
  user,
  finishedResponseBot,
  setIsPaused,
  isPaused,
  tokens,
  chatAutomate,
  selectedAutomateChat,
  apiUrl,
  chatList,
  scrapingPanelActive,
  typeChat
}) => {
  const [t] = useTranslation(["ChatView", "Preview"]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()

  const {
    selectedAgent, searchTerm: searchTermState
  } = useSelector((state) => state.chat);

  const { selectedSectionId } = useSelector((state) => state.docs.doc);


  const recommendedQuestions = [
    t("recommendedQuestions1"),
    t("recommendedQuestions2"),
    t("recommendedQuestions3"),
    t("recommendedQuestions4"),
    t("recommendedQuestions5"),
    t("recommendedQuestions6"),
    t("recommendedQuestions7"),
    t("recommendedQuestions8"),
    t("recommendedQuestions9"),
    t("recommendedQuestions10"),
    t("recommendedQuestions11"),
    t("recommendedQuestions12"),
    t("recommendedQuestions13"),
    t("recommendedQuestions14"),
    t("recommendedQuestions15"),
  ];

  const imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"];


  const recorderRef = useRef();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const chatTextContainerRef = useRef(null);
  const containerRef = useRef(null);
  const dragTimeoutRef = useRef(null);
  const dragCounterRef = useRef(0);
  const dragContainerRef = useRef(null);
  const attachmentAreaRef = useRef(null);
  const dynamicTableRef = useRef(null)

  const [loadingStates, setLoadingStates] = useState([]);

  const [isDropping, setIsDropping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [fileInfo, setFileInfo] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  // const messageContainerRef = useRef(null);

  const [imageError, setImageError] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [showMiniProfileModal, setShowMiniProfileModal] = useState()
  const [isTokenValid, setIsTokenValid] = useState("loading");
  const [iniVoice, setIniVoice] = useState(false)


  const [processingTime, setProcessingTime] = useState(0)
  const [showImportAttachment, setShowImportAttachment] = useState(false)
  const [endTime, setEndTime] = useState(30)

  const [muted, setMuted] = useState(() => {
    const stored = localStorage.getItem("mutedSound");
    return stored === null ? true : stored === "true";
  });

  const [lastMessageText, setLastMessageText] = useState('')
  const [lastMessageTime, setLastMessageTime] = useState(0)


  const [selectedAutomate, setSelectedAutomate] = useState(null)
  const [automations, setAutomations] = useState([])

  const [shouldRenderActions, setShouldRenderActions] = useState(false);



  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState(null);
  const [editingVariableIndices, setEditingVariableIndices] = useState([]);
  const [editingVariableValues, setEditingVariableValues] = useState({});


  let lastDateLabel = null;

  const currentLang = i18n.language;
  const locales = {
    English: enUS,
    Español: es,
    Français: fr,
    Português: pt,
    Deutsch: de,
    Italiano: it,
    日本語: ja,
    中文: zhCN,
  };


  const [events, setEvents] = useState([{
    default: 'Escaneando el archivo..',
    title: 'Se esta procesando el archivo',
    description: '{size} - {name}',
    type: 'upload',
    data: {
      size: null,
      name: null,
      extension: null,
      time: 0
    }
  }, {
    default: 'Cargando automatización..',
    title: 'Leyendo la automatización de {name}',
    description: '{timestamp} fue creada',
    type: 'automate',
    data: {
      id: null,
      name: null,
      type: null,
      timestamp: null,
      time: 0
    }
  }, {
    default: 'Se extraeran los datos del documento',
    title: 'Extrayendo información de {type}',
    description: '{parameters} parámetros detectados',
    type: 'extract',
    data: {
      parameters: null,
      type: null,
      time: 0
    }
  }, {
    default: 'Se importaran la información recibida',
    title: 'Se han detectado estos datos',
    description: '{contacts} contactos - {actives} activos - {documents} documento',
    type: 'import',
    data: {
      contacts: null,
      actives: null,
      documents: null,
      repeatData: null,
      time: 0
    }
  }, {
    default: 'Esperando a completar la automatización',
    title: 'Generando reporte',
    description: '{percent}% de la información fue procesada',
    type: 'report',
    data: {
      percent: null,
      time: 0
    }
  }])




  const [voiceChat, setVoiceChat] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [countdownNumber, setCountdownNumber] = useState(null);
  const finalTranscriptRef = useRef("");
  const recognitionRefAudio = useRef(null);
  const countdownRef = useRef(null);



  const [messageHistory, setMessageHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isNavigatingHistory, setIsNavigatingHistory] = useState(false);


  const [hasStoppedRecording, setHasStoppedRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);



  const scrollContainerRef = useRef(null);


  const [activeDateLabel, setActiveDateLabel] = useState(null);
  const observerRefs = useRef({});
  const dateLabelRefs = useRef({});



  let options = [
    {
      name: t('tokenOpenAI'),
      label: <> <TokenOpenAI height={20} width={20} /> {t("tokenOpenAI")}</>,
      subOptions: tokens?.tokens?.filter(tok => tok.type === "gpt").map(tok => { return { display: tok.token.slice(0, 23), value: tok.token } })

    },
    {
      name: t('claudeAnthropic'),
      label: <> <ClaudeAnthropic height={20} width={20} /> {t("claudeAnthropic")}</>,
      subOptions: tokens?.tokens?.filter(tok => tok.type === "claudeAnthropic").map(tok => { return { display: tok.token.slice(0, 23), value: tok.token } })


    },
    {
      name: t('tokenDeekSeek'),
      label: t("tokenDeekSeek"),
      subOptions: []

    },
  ];

  let optionsFiltered = options.filter(option => option?.subOptions?.length > 0)


  const currentToken = tokens?.tokens?.find(tok => tok.active)?.token

  const [selectedOption, setSelectedOption] = useState({ [t('tokenOpenAI')]: currentToken });


  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);



  const safeText = (text) => {
    if (typeof text === 'string') {
      return text;
    }
    if (text === null || text === undefined) {
      return '';
    }
    if (typeof text === 'object') {
      return JSON.stringify(text);
    }
    return String(text);
  };

  const formatWhatsAppText = (text) => {
    if (!text || typeof text !== 'string') return '';

    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, replacement: '<b>$1</b>' },
      { regex: /\*(.*?)\*/g, replacement: '<i>$1</i>' },
      { regex: /__(.*?)__/g, replacement: '<u>$1</u>' },
      { regex: /~~(.*?)~~/g, replacement: '<s>$1</s>' },
      { regex: /`(.*?)`/g, replacement: '<code>$1</code>' },
      { regex: /```(.*?)```/gs, replacement: '<pre><code>$1</code></pre>' },
      { regex: /^# (.*?)$/gm, replacement: '<h1>$1</h1>' },
      { regex: /^## (.*?)$/gm, replacement: '<h2>$1</h2>' },
      { regex: /^### (.*?)$/gm, replacement: '<h3>$1</h3>' },
      { regex: /\n/g, replacement: '<br />' }
    ];

    let formattedText = text;

    patterns.forEach(pattern => {
      if (typeof formattedText === 'string' && formattedText) {
        formattedText = formattedText.replace(pattern.regex, pattern.replacement);
      }
    });

    return formattedText || '';
  };

  // Función para calcular la posición del popup
  const calculatePopupPosition = () => {
    const containerWidth = 300; // Ancho del contenedor
    const popupWidth = 200; // Ancho mínimo del popup
    const windowWidth = window.innerWidth;
    const element = contactsRef.current;


    if (element) {
      const rect = element.getBoundingClientRect();
      const spaceToRight = windowWidth - rect.right;
      const spaceToLeft = rect.left;


      // Si hay menos espacio a la derecha que el ancho del popup, posicionar a la derecha
      if (spaceToRight < popupWidth) {
        return {
          left: "auto",
          right: "0",
          transform: "translateX(0%)"
        };
      }

      // Si hay menos espacio a la izquierda que el ancho del popup, posicionar a la izquierda
      if (spaceToLeft < popupWidth) {
        return {
          left: "0",
          right: "auto",
          transform: "none"
        };
      }
    }

    // Por defecto, posicionar a la izquierda
    return {
      left: "0",
      right: "auto",
      transform: "none"
    };
  };

  const parseText = (text) => {
    const regex = /(?:^|\s)(@\w*)/g;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span
            onMouseEnter={() => { if (part != "@not" && !containsArroba) setShowMiniProfileModal(((index + 1) / 2) - 1) }}
            onMouseLeave={() => setShowMiniProfileModal(false)}
            key={index}
            className={styles.mentionWrapper}
          >
            <span
              key={index}
              className={styles.arrobaText}
              onClick={() => {
                if (part != "@not" && !containsArroba) {
                  if ("substitute" in itemsSelected[((index + 1) / 2) - 1]) {
                    dispatch(setAsset(itemsSelected[((index + 1) / 2) - 1]));
                    dispatch(setFatherNewAsset(chatId ? 'chatId' : agentId ? 'agentId' : 'chat'))
                    dispatch(setIdFatherNewAsset(chatId ? { agentId, chatId } : agentId))
                    navigate(`/admin/assets/${itemsSelected[((index + 1) / 2) - 1]._id}`, { state: { backgroundLocation: location } });
                  } else if ("contactName" in itemsSelected[((index + 1) / 2) - 1]) {
                    // dispatch(setContact(itemsSelected[((index + 1) / 2) - 1]));
                    dispatch(setFatherNewContact(chatId ? 'chatId' : agentId ? 'agentId' : 'chat'));
                    dispatch(setFatherIdNewContact(chatId ? { agentId, chatId } : agentId))
                    navigate(`/admin/contacts/${itemsSelected[((index + 1) / 2) - 1]._id}`, { state: { backgroundLocation: location } });
                  } else if ("stateStripe" in itemsSelected[((index + 1) / 2) - 1]) {
                    dispatch(setFatherIdNewBill(chatId ? { agentId, chatId } : agentId))
                    dispatch(setFatherNewBill(chatId ? 'chatId' : agentId ? 'agentId' : 'chat'));
                    navigate(`/admin/docs/${undefined}/${itemsSelected[((index + 1) / 2) - 1]._id}`);
                  } else if ("accessPermitType" in itemsSelected[((index + 1) / 2) - 1]) {
                    navigate(`/admin/tables/${itemsSelected[((index + 1) / 2) - 1]._id}`);
                  }
                }
              }}
            >
              {part}
            </span>
            {showMiniProfileModal === ((index + 1) / 2) - 1 && (

              <MiniProfileModal
                item={itemsSelected[((index + 1) / 2) - 1]}
                showMiniProfileModal={showMiniProfileModal}
                index={((index + 1) / 2) - 1}
                name={itemsSelected[((index + 1) / 2) - 1] &&
                  (itemsSelected[((index + 1) / 2) - 1]?.name ? itemsSelected[((index + 1) / 2) - 1].name :
                    itemsSelected[((index + 1) / 2) - 1]?.contactName ? itemsSelected[((index + 1) / 2) - 1].contactName :
                      itemsSelected[((index + 1) / 2) - 1]?.documentTitle ? itemsSelected[((index + 1) / 2) - 1].documentTitle :
                        "stateStripe" in itemsSelected[((index + 1) / 2) - 1] ? "Nombre del documento" :
                          "accessPermitType" in itemsSelected[((index + 1) / 2) - 1] ? "Elemento" :
                            "hidden" in itemsSelected[((index + 1) / 2) - 1] ? "Nombre de variable" :
                              "substitute" in itemsSelected[((index + 1) / 2) - 1] ? "Nombre del Activo" :
                                "contactName" in itemsSelected[((index + 1) / 2) - 1] ? "Nombre de la Cuenta" :
                                  "")}
                email={itemsSelected[((index + 1) / 2) - 1] &&
                  (itemsSelected[((index + 1) / 2) - 1]?.companyEmail ? itemsSelected[((index + 1) / 2) - 1].companyEmail :
                    itemsSelected[((index + 1) / 2) - 1].description ? itemsSelected[((index + 1) / 2) - 1].description :
                      "substitute" in itemsSelected[((index + 1) / 2) - 1] ? "Descripción" :
                        itemsSelected[((index + 1) / 2) - 1].category ? itemsSelected[((index + 1) / 2) - 1].category :
                          "stateStripe" in itemsSelected[((index + 1) / 2) - 1] ? "Categoria" :
                            itemsSelected[((index + 1) / 2) - 1].headers?.length ? itemsSelected[((index + 1) / 2) - 1].headers?.length :
                              "accessPermitType" in itemsSelected[((index + 1) / 2) - 1] ? "Numero de parámetros" :
                                "hidden" in itemsSelected[((index + 1) / 2) - 1] ? "Descripción" :
                                  "contactName" in itemsSelected[((index + 1) / 2) - 1] ? "Email address" :
                                    "")}
                imageUrl={itemsSelected[((index + 1) / 2) - 1]?.image ? itemsSelected[((index + 1) / 2) - 1].image : emptyImage}
              />
            )
            }

            {containsArroba && index == parts.length - 2 && (
              <ContactsPopup
                ref={contactsRef}
                handleSelectItem={handleSelectItem}
                type={"chat"}
                inputValue={inputValue.split("@").pop()}
                customStyle={{
                  top: "initial",
                  bottom: "100%",
                  width: "auto",
                  padding: "4px",
                  maxWidth: "500px",
                  background: "#fafafa",
                  boxShadow: "0 2px 10px #0000001a",
                  gap: "0px",
                  pointerEvents: 'auto',
                  minWidth: "200px",
                  ...calculatePopupPosition()
                }}
                handleClickFocus={handleClickFocus}
              />
            )}
          </span>
        );
      }
      return part.split('\n').map((line, lineIndex) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {lineIndex > 0 && <br />}
          {line}
        </React.Fragment>
      ));
    });
  };


  const handleClickFocus = () => {
    textareaRef.current?.focus();

  };



  const handleToggleSound = () => {
    setMuted(prevMuted => {
      const newMuted = !prevMuted;

      if (!newMuted) {
        window.speechSynthesis.cancel();
      }

      localStorage.setItem("mutedSound", newMuted.toString());
      return newMuted;
    });
  };


  const renderMessage = () => {
    if (isTokenValid == "loading") {
      return <p className={styles.loading}>{t("verifyingToken")}</p>;
    }

    if (isTokenValid == "not-auth") {
      return (
        <p className={styles.errorAlert}>
          {t("enterA")}{" "}
          <a
            href="https://platform.openai.com/settings/organization/api-keys"
            target="_blank"
          >
            {t("token")}
          </a>{" "}
          {t("validForUsingFactura")}
        </p>
      );
    }

    if (isTokenValid == "auth") {
      return (
        <p className={styles.errorAlert}>{t("facturaGPTCanMakeMistakes")}</p>
      );
    }
  };

  const renderApi = (type) => {
    switch (type) {
      case "google":
        return <ModalConnectionGoogle />;
    }

    return <div>{t("continueTheGameHere")}</div>;
  };



  const restartLastMessageFn = async () => {
    setAutoClear((prev) => !prev)
    const res = await dispatch(restartLastMessage({ chatId }));

  };

  const searchInWebFn = async () => {
    setSearchInWeb((prev) => !prev)

    const res = await dispatch(searchInWebAction({ chatId }));
  }


  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (dragContainerRef.current && !dragContainerRef.current.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = async (e, auto) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    dragCounterRef.current = 0;

    const isAutomateArea = e.target.closest(`.${styles.messageDragAgent}`);
    const isAttachmentArea = attachmentAreaRef.current?.contains(e.target);

    try {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        if (isAutomateArea) {
          const file = files[0];
          const fileType = file.type;
          const fileExtension = file.name.split(".").pop().toLowerCase();
          const fileInfo = {
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            type: fileType,
            extension: fileExtension,
          };


          if (fileExtension === "xlsx") {
            fileInfo.content = await handleExcelFile(file);
          } else if (fileType.startsWith("text/") || fileExtension === "json") {
            fileInfo.content = await readFileAsText(file);
          } else if (fileExtension === "pdf") {
            try {
              const base64 = await readFileAsDataURL(file);

              const base64Content = base64.split(',')[1];
              fileInfo.content = base64Content;
            } catch (error) {
              console.error('Error procesando PDF:', error);
              fileInfo.error = 'Error procesando el archivo PDF';
            }
          } else if (fileType.startsWith("image/")) {
            const base64 = await readFileAsDataURL(file);
            const base64Content = base64.split(',')[1];
            fileInfo.content = base64Content;
          }

          setFilePayload(fileInfo);
          setIsDropping({ success: true, ...auto });


        } else if (isAttachmentArea) {

          const event = {
            target: { files },
            preventDefault: () => { },
            stopPropagation: () => { }
          };
          await handleFileChange(event);
          setIsDropping(false);
          setIsDragging(false);
        }
      }
    } catch (error) {
      console.error('Error handling file drop:', error);
    }
  };


  const fnSendMessage = async (auto) => {
    setProcessingTime(0)

    const fileExtension = filePayload?.extension || '';
    const fileName = filePayload?.name || '';
    const fileSize = filePayload?.size || '';

    let updatedEvents = [...events]

    updatedEvents[0].data = {
      size: fileSize,
      name: fileName,
      extension: fileExtension,
      time: 0
    }

    updatedEvents[1].data = {
      id: auto.id,
      name: auto.inputValue,
      type: auto.type,

      timestamp: new Date().toISOString(),
      time: 0
    }


    const index = automations.findIndex(item => item._id === auto._id)
    if (index !== -1) {
      setSelectedAutomate(auto._id)
      setAutomations(prev => {
        const newAutomations = [...prev];
        newAutomations[index].automate = updatedEvents;
        return newAutomations;
      })
    }


    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    const frontendTime = new Date().getTime();


    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[0] = 'pending';
      return newStates;
    });

    const res = await fetch(`${apiUrl}/api/chat/${selectedAgent._id}/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        text: 'event',
        isAutomate: true,
        automate: updatedEvents,
        file: filePayload
      }),
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: `Bearer ${token}`,
      },

    }).then((response) => {
      if (response.ok) {
        const reader = response.body.getReader();

        const decoder = new TextDecoder();
        let accumulatedChunks = "";
        let accumulatedText = "";
        let loadStates = [false, false, false, false]

        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {

              if (accumulatedText && typeof accumulatedText === 'string' && !isGraph && !isApi && !isAction && !isTable && !isAutomate && !isAsset && !isImage && !isAudio && !isOnline) {
                const utterance = new SpeechSynthesisUtterance(accumulatedText);
                utterance.lang = 'es-ES';
                window.speechSynthesis.speak(utterance);
              }
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            accumulatedChunks += chunk;

            let lines = accumulatedChunks.split("\n");
            accumulatedChunks = lines.pop();


            for (const line of lines) {
              if (line.trim()) {
                try {
                  const chunk = JSON.parse(line);
                  const { text, type, threadId, docId, appId } = chunk.data;
                  setTokenInput(chunk?.data?.input.token)

                  setTokenOutput(chunk?.data?.output.token)
                  setShowInfoMessage(true)

                  const backendTime = chunk?.finishedAt;
                  const diff = frontendTime - backendTime;
                  setTimeToFinishResponse(backendTime)

                  if (type === "automate") {
                    if (text?.type === 'data-error') {
                      setIsDropping(false)
                      setIsDragging(false)
                      reader.cancel();
                      setLoadingStates(prev => Array(6).fill(undefined));

                      break
                    }

                    if (text?.type === 'loaded' && loadStates[0] === false) {
                      loadStates[0] = true

                      setLoadingStates(prev => {
                        const newStates = [...prev];
                        newStates[0] = 'active';
                        newStates[1] = 'pending';
                        return newStates;
                      });

                      setTimeout(() => {
                        setLoadingStates(prev => {
                          const newStates = [...prev];
                          newStates[1] = 'active';
                          newStates[2] = 'pending';
                          return newStates;
                        });
                      }, 2000);
                    } else if (text.type === 'data-processed' && loadStates[1] === false) {
                      loadStates[1] = true

                      updatedEvents = text?.data

                      const index = automations.findIndex(item => item._id === auto._id)
                      setAutomations(prev => {
                        const newAutomations = [...prev];
                        newAutomations[index].automate = updatedEvents;
                        return newAutomations;
                      })


                      setLoadingStates(prev => {
                        const newStates = [...prev];
                        newStates[2] = 'active';
                        newStates[3] = 'pending';
                        return newStates;
                      });



                    } else if (text.type === 'data-finished' && loadStates[2] === false) {
                      loadStates[2] = true
                      setLoadingStates(prev => {
                        const newStates = [...prev];
                        newStates[3] = 'active';
                        newStates[4] = 'pending';
                        return newStates;
                      });


                      setTimeout(() => {
                        setLoadingStates(prev => {
                          const newStates = [...prev];
                          newStates[4] = 'active';
                          return newStates;
                        });
                      }, 2000);



                      const time = Math.abs(frontendTime - new Date().getTime()) / 1000
                      setProcessingTime(time)

                      setEndTime(time)
                      setShowImportAttachment(true)


                      const index = automations.findIndex(item => item._id === auto._id)

                      if (index !== -1) {
                        let message = {
                          type: 'bot',
                          isAutomate: true,
                          text: automations[index]?.automate,
                          timestamp: new Date().toISOString()
                        }

                        if (autoClear) {
                          setMessages([message])
                        } else {
                          setMessages(prev => {
                            return [...prev, message];;
                          })
                        }
                      }


                    }
                  }

                } catch (error) {
                  console.error("Failed to parse JSON:", error);
                }
              }
            }
          }
        };

        processStream()
          .then(() => { })
          .catch(console.error);
      }
    });

  }


  const handleKeyDown = (e) => {
    if (e.key === 'y') {
      setIsDropping(false);
      setShowImportAttachment(false);
    }
  }

  const handleImportData = async () => {
    try {

      const automate = automations.find(item => item._id === selectedAutomate)

      const response = await dispatch(importData({
        data: automate.automate[3].data?.processedData,
      }))


      setIsDragging(false);
      setIsDropping(false);
      setShowImportAttachment(false);
    } catch (error) {
    }
  }

  const sendTranscriptIfReady = () => {
    const transcript = finalTranscriptRef.current.trim();
    if (!transcript) {
      return
    }

    if (selectedAgent?._id) {
      setInputValue("");

      setIsPaused(false);
      setTokenInput(transcript?.length)
      handleChat({
        text: transcript,
        agent: selectedAgent?.name,
        agentId: selectedAgent?._id,
        file: filePayload,
      });
      setFilePayload(null);
      setFileInfo(null);

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
      recognitionRefAudio.current?.stop();
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
      recognitionRefAudio.current?.start();
    } else {
      stopRecordingAndSend();
    }
  };



  const navigateHistoryDown = () => {
    if (messageHistory.length === 0) return;

    if (inputValue === '' || isNavigatingHistory) {
      const newIndex = Math.min(messageHistory.length, historyIndex + 1);
      setHistoryIndex(newIndex);
      setIsNavigatingHistory(true);

      if (newIndex === messageHistory.length) {
        setInputValue('');
      } else {
        setInputValue(messageHistory[newIndex]);
      }
    }
  };



  const navigateHistoryUp = () => {
    if (messageHistory.length === 0) return;

    if (inputValue === '' || isNavigatingHistory) {
      const newIndex = Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setIsNavigatingHistory(true);

      if (newIndex < messageHistory.length) {
        setInputValue(messageHistory[newIndex]);
      }
    }
  };




  const saveMessageToHistory = (message) => {
    if (!message || message.trim() === '') return;

    try {
      const currentHistory = [...messageHistory];

      if (currentHistory[currentHistory.length - 1] !== message.trim()) {
        currentHistory.push(message.trim());

        if (currentHistory.length > 50) {
          currentHistory.shift();
        }

        setMessageHistory(currentHistory);
        localStorage.setItem('chatMessageHistory', JSON.stringify(currentHistory));
      }

      setHistoryIndex(currentHistory.length);
    } catch (error) {
      console.error('Error saving message to history:', error);
    }
  };

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';

    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;

    }

  }, []);



  const loadMessageHistory = () => {
    try {
      const stored = localStorage.getItem('chatMessageHistory');
      if (stored) {
        const history = JSON.parse(stored);
        setMessageHistory(history);
        setHistoryIndex(history.length);
      }
    } catch (error) {
      console.error('Error loading message history:', error);
    }
  };




  const renderTextAutomate = (event, type = 'description') => {
    const { description, title, data } = event;

    let text = type === 'description' ? description : title;

    if (!text) return '';


    if (type == 'time') {
      return (data.time / 1000).toFixed(1) + 's'
    }

    const matches = text.match(/\{([^}]+)\}/g) || [];
    const parameters = matches.map(match => match.slice(1, -1));

    if (parameters.length === 0) {
      return text;
    }

    let result = text;
    let isShow = false

    for (const param of parameters) {
      if (param === 'timestamp' && data[param]) {
        isShow = true
        result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), formatAgoDate({ dateString: data[param], t }))
      } else if (typeof data !== 'object' && data !== null) {
        isShow = true
        result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), data);
      } else if (data && typeof data === 'object' && data[param] !== undefined && data[param] !== null) {
        isShow = true
        result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), data[param]);
      }
    }


    if (!isShow) {
      if (type == 'title') {
        return event.default || 'not found'
      }

      return ""
    }

    return result;
  }



  const toggleVariableEditing = (index, originalValue) => {
    setEditingVariableIndices(prev => {
      const isCurrentlyEditing = prev.includes(index);
      if (isCurrentlyEditing) {
        return prev.filter(i => i !== index);
      } else {
        setEditingVariableValues(prev => ({
          ...prev,
          [index]: originalValue
        }));
        return [...prev, index];
      }
    });
  };

  const handleVariableChange = (index, value) => {
    setEditingVariableValues(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleVariableSave = (index) => {
    setEditingVariableIndices(prev => prev.filter(i => i !== index));
  };

  const handleVariableCancel = (index) => {
    setEditingVariableIndices(prev => prev.filter(i => i !== index));
    setEditingVariableValues(prev => {
      const newValues = { ...prev };
      delete newValues[index];
      return newValues;
    });
  };

  const handleVariableKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVariableSave(index);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleVariableCancel(index);
    }
  };


  const readerMessageRef = useRef(null);



  const handleFileUpdate = async (operation, path, content = null, appId) => {
    console.log('🔄 handleFileUpdate called:', { operation, path, contentLength: content?.length, appId });

    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const payload = {
        type: operation,
        appId: appId,
        text: {
          path,
          content,
          ...(operation === 'renameFile' && content && {
            oldPath: path,
            newPath: content.newPath
          })
        }
      };

      console.log('📤 Sending payload to backend:', payload);
      const startTime = Date.now();

      await fetch(`${apiUrl}/api/chat/${selectedAgent._id}/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {

        if (response.ok) {
          readerMessageRef.current = response.body.getReader();

          const decoder = new TextDecoder();
          let accumulatedChunks = "";


          const processStream = async () => {
            while (true) {


              const { done, value } = await readerMessageRef.current.read();
              if (done) {
                setFinishedResponseBot(true)
                setIsLoadBot(false);
                break;
              }

              const chunk = decoder.decode(value, { stream: true });

              accumulatedChunks += chunk;

              let lines = accumulatedChunks.split("\n");
              accumulatedChunks = lines.pop();

              for (const line of lines) {
                if (line.trim()) {
                  try {
                    const chunk = JSON.parse(line);
                    const { text, type, appId, timestamp } = chunk.data;
                    setTokenOutput((prev) => Number(prev || 0) + Number(chunk?.data?.output.token));


                    setShowInfoMessage(true)

                    const firstBackendResponseTime = Date.now();
                    const timeDiffMs = firstBackendResponseTime - startTime;

                    setTimeToFinishResponse(timeDiffMs);

                    if (type == "pause") {
                      setMessages((prevMessages) => {
                        const newMessages = [...prevMessages];
                        newMessages.push({ text: "parar el mensaje", type: "pause" });
                        return newMessages;
                      });
                    } else if (type == "app") {
                      if (text && typeof text === 'object' && text.buffer) {
                        const fileInfo = text.fileInfo;

                        const fileMessage = `🔄 ${fileInfo.operation} en archivo: ${fileInfo.path}`;

                        setMessages(prevMessages => {
                          return prevMessages.map(message => {
                            if (message.appId === appId) {
                              return {
                                ...message,
                                text: {
                                  ...message.text,
                                  fileOperation: fileMessage,
                                  fileInfo: fileInfo,
                                  buffer: text.buffer
                                }
                              };
                            }
                            return message;
                          });
                        });
                      } else {
                        setMessages(prevMessages => {
                          return prevMessages.map(message => {
                            if (message.appId === appId) {
                              return {
                                ...message,
                                text: text || message.text
                              };
                            }
                            return message;
                          });
                        });
                      }

                    } else {
                      insertMessage({ text, threadId, docId, appId, timestamp });
                    }
                  } catch (error) {
                    console.error("Failed to parse JSON:", error);
                  }
                }
              }
            }
          };

          processStream()
            .then(() => { })
            .catch(console.error);
        }

      })


    } catch (error) {
      console.error('❌ Error updating file:', error);
      console.warn('⚠️ Backend sync failed, but file changes are preserved locally');
    }
  };

  const handleSendVoice = ({ audioBlob, samples }) => {
    setVoiceMessage({ audioBlob, samples });
    setShowVoiceRecorder(false);

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];

      if (!base64String) {
        console.error('Failed to convert audio to base64');
        return;
      }

      handleSendMessage({
        text: "",
        record: {
          audioBlob: base64String,
          samples
        },
        agentName: selectedAgent?.name,
        agentId: selectedAgent?._id,
      })
    };

    reader.onerror = (error) => {
      console.error('Error converting audio to base64:', error);
    };
    reader.readAsDataURL(audioBlob);
  };





  const checkReplyMessage = (message) => {
    const replyMessage = messages.find(msg => msg.timestamp === message.replyId.timestamp)

    if (replyMessage) {
      const element = document.querySelector(`[data-timestamp="${replyMessage.timestamp}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
    }
  }

  const tokenSelected = async (tokenText) => {

    if (tokens?.tokens?.find(tok => tok.token == tokenText)) {

      await dispatch(updateAccount({
        data: {
          ...user,
          tokenGPT: tokenText
        }
      }));


      await dispatch(updateTokens({
        data: {
          ...tokens,
          tokens: [...tokens?.tokens?.map(tok => {
            if (tok.token === tokenText) return { token: tok.token, active: true, type: tok.type }
            else return { token: tok.token, active: false, type: tok.type }
          }).sort((a, b) => {
            if (a.active === b.active) return 0;
            return a.active ? -1 : 1;
          })],
          tokenGPT: tokenText
        },
        id: user?.id?.split("_").pop()
      }));
    }
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleScroll = () => {
      setScrollTop(textarea.scrollTop);
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);



  useEffect(() => {
    const fn = async () => {
      const response = await dispatch(getAutomatesByIds({ ids: selectedAgent?.automations }))

      if (response.payload.success) {
        setAutomations(response.payload.automations)
      }
    }


    if (selectedAgent?._id && selectedAgent?.automations?.length > 0) {
      fn()
    }
  }, [selectedAgent?._id]);





  const contactsRef = useRef(null);

  const handleBlur = (event) => {
    setTimeout(() => {
      if (
        contactsRef.current &&
        !contactsRef.current.contains(event.relatedTarget)
      ) {
        setIsFocused(false);
      }
    }, 100);
  };

  const actions = [
    {
      id: 0,
      img: orangeAgentIcon,
      text: t("createAnAgent"),
      action: () => {
        navigate(`/admin/bot`, { state: { backgroundLocation: location } });
      },
    },
    {
      id: 1,
      img: analizeBill,
      text: t("analyzeYourBilling"),
    },
    {
      id: 2,
      img: analizeBill,
      text: t("createAnInvoice"),
    },
    {
      id: 3,
      img: askDocument,
      text: t("askAboutYourDocuments"),
      message: t("documentMessages"),
    },
    {
      id: 4,
      img: askAssets,
      text: t("askAbourYourAssets"),
      message: t("assetMessages"),
    },
    {
      id: 5,
      img: askClient,
      text: t("askAbourYourClients"),
      message: t("contactMessages"),
    },
    {
      id: 6,
      img: askHelp,
      text: t("askForHelp"),
    },
  ];

  const [isModalAutomate, setIsModalAutomate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [showNewTagModal, setShowNewTagModal] = useState(false);
  const [showNewContact, setShowNewContact] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showNewBill, setShowNewBill] = useState(false);
  const [showUploadFile, setShowUplaodFile] = useState(false);
  const buttonRefs = useRef({});

  const automateData = AutomateDataComponent()





  const openModalAutomate = () => {
    setIsModalAutomate(true);
    setIsOpen(false);
  };
  const closeModalAutomate = () => {
    setTypeContentAutomate("");
    setIsModalAutomate(false);
  };


  const buildChatGptPayload = (info) => {
    return {
      name: info.name,
      type: info.type,
      extension: info.extension,
      content:
        info.content ||
        info.base64 ||
        info.message ||
        "Sin contenido procesado",
    };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    let fileInfo = {
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: fileType,
      extension: fileExtension,
    };

    try {
      if (fileExtension === "xlsx" || fileExtension === "xls" || fileExtension === "csv") {
        fileInfo.content = await handleExcelFile(file);
      } else if (fileType.startsWith("text/") || fileExtension === "json") {
        fileInfo.content = await readFileAsText(file);
      } else if (fileType.startsWith("image/") || fileExtension === "pdf") {
        fileInfo.base64 = await readFileAsDataURL(file);
      } else {
        fileInfo.message = "Tipo de archivo no manejado específicamente";
      }

      setFileInfo(fileInfo);
      setFilePayload(buildChatGptPayload(fileInfo));
    } catch (error) {
      console.error("Error procesando archivo:", error);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleExcelFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    let workbook;
    if (ext === "csv") {
      const text = await file.text();
      workbook = XLSX.read(text, { type: "string" });
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      workbook = XLSX.read(data, { type: "array" });
    }
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };


  const handleButtonMicrophone = async () => {
    try {
      if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
      ) {
        alert("Tu navegador no soporta reconocimiento de voz.");
        return;
      }

      if (!recognitionRef.current) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = "es-ES";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const transcription = event.results[current][0].transcript;
          setTranscript(transcription);

          if (event.results[current].isFinal) {
            setIsListening(false);
            handleChat({
              text: transcription,
              agent: selectedAgent?.name,
              agentId: selectedAgent?._id,
            });
          }
        };

        recognition.onerror = (event) => {
          console.error("Error en reconocimiento:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      const recognition = recognitionRef.current;

      if (!isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    } catch (error) {
      console.error("Error al iniciar el reconocimiento de voz:", error);
      alert("Error al iniciar el reconocimiento de voz");
    }
  };



  useEffect(() => {
    const fn = async () => {
      const response = await dispatch(validateTokenGPT());
      if (response && response.payload && response.payload.success) {
        setIsTokenValid("auth");
      } else {
        setIsTokenValid("not-auth");
      }
    };

    fn();
  }, []);


  useEffect(() => {
    if (!inputValue && proptText) {
      setInputValue(proptText);
    }
  }, [proptText]);


  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.type === 'bot' && lastMessage.text !== lastMessageText) {
        setLastMessageText(lastMessage.text)
        setLastMessageTime(Date.now())
      }

      if (messageContainerRef?.current) {
        setTimeout(() => {
          messageContainerRef.current.scrollTop = messageContainerRef.current?.scrollHeight;
        }, 100);
      }
    }
  }, [messages])



  useEffect(() => {
    if (muted) {
      window.speechSynthesis.cancel();
      return;
    }

    if (lastMessageText && !muted && iniVoice) {
      const timeoutId = setTimeout(() => {
        const currentTime = Date.now()
        if (currentTime - lastMessageTime >= 3000) {
          const currentMessage = lastMessageText?.replaceAll('\n', ' ')
          const utterance = new SpeechSynthesisUtterance(currentMessage)
          utterance.lang = 'es-ES'
          window.speechSynthesis.speak(utterance)
        }
      }, 3000)

      return () => {
        clearTimeout(timeoutId)
      }
    }

    if (!iniVoice) {
      setIniVoice(true)
    }
  }, [lastMessageText, lastMessageTime, muted, iniVoice])



  useEffect(() => {
    if (newChat) {
      setNewChat(false)

    } else {

    }
  }, [messages]);



  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);




  useEffect(() => {
    if (!isDropping.success) return;

    setLoadingStates([false, false, false, false, false, false]);

    fnSendMessage(isDropping);

  }, [isDropping, filePayload]);





  useEffect(() => {
    const selectedChatId = localStorage.getItem('selectedChatId');
    const noMessages = messages?.length === 0;
    const shouldShow = !isAgentPopup && !selectedChatId;
    if (shouldShow) {
      if (windowWidth >= 768) {
        setShouldRenderActions(!inputValue && noMessages);
      } else {
        setShouldRenderActions(true);
      }
    } else {
      setShouldRenderActions(false);
    }


    if (inputValue === '') {
      setIsNavigatingHistory(false)
    }
  }, [isAgentPopup, windowWidth, inputValue, messages]);



  useEffect(() => {
    loadMessageHistory();
  }, []);

  useEffect(() => {
    if (messageHistory.length > 0) {
      setHistoryIndex(messageHistory.length);
    }
  }, [messageHistory]);

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
          final += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      if (final) {
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

    recognitionRefAudio.current = recognition;

    if (selectedAgent?._id) {
      sendTranscriptIfReady()
    }

    return () => {
      recognition.stop();

    };

  }, [selectedAgent]);




  useEffect(() => {
    const interval = setInterval(() => {
      if (!recorderRef.current) return;
      setHasStoppedRecording(!recorderRef.current.isRecording());
      setIsPlaying(recorderRef.current.isPlaying());
      setIsRecording(recorderRef.current.isRecording());
    }, 200);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    const container = messageContainerRef?.current;
    if (!container) return;


    const handleScroll = () => {
      const entries = Object.entries(dateLabelRefs.current);
      if (!entries.length) return;

      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      let closestIndex = -1;
      let smallestDistance = Infinity;

      const threshold = 25;

      for (let i = 0; i < entries.length; i++) {
        const [label, el] = entries[i];
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        const distanceFromTop = rect.top - containerTop;

        if (distanceFromTop <= -threshold) {
          const absDistance = Math.abs(distanceFromTop);

          if (absDistance < smallestDistance) {
            smallestDistance = absDistance;
            closestIndex = i;
          }
        }
      }

      if (closestIndex !== -1) {
        const [newLabel] = entries[closestIndex];

        if (newLabel !== activeDateLabel) {
          setActiveDateLabel(newLabel);
        }
      } else if (entries.length > 0) {
        const [firstLabel] = entries[0];
        if (firstLabel !== activeDateLabel) {
          setActiveDateLabel(firstLabel);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);




  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === 'n') {
        setIsDragging(false);
        setIsDropping(false);
        setShowImportAttachment(false);
      } else if (e.key === 'y') {

        handleImportData()
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropping]);




  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);


  useEffect(() => {
    // if (messages?.length > 0) {
    //   const reversedIndex = messages.slice().reverse().findIndex(message => message.type == "me" && message.text.includes("sk-"));
    //   const realIndex = reversedIndex === -1 ? -1 : messages?.length - 1 - reversedIndex;
    //   if (messages?.length > realIndex + 1) {
    //     const tokenAccepted = messages[realIndex + 1].type == "bot" && messages[realIndex + 1].text.includes('El token ha sido ingresado correctamente. ¡Acceso autorizado!')
    //     if (tokenAccepted) {
    //       const token = messages[realIndex].text
    //       const fined = tokens?.tokens?.find(tok => tok.token == token)
    //       const fn = async () => {
    //         dispatch(getTokens({ id: user?.id?.split("_").pop() }))
    //       }
    //       if (!fined) fn()

    //     }

    //   }
    // }
  }, [messages])




  useEffect(() => {
    tokenSelected(selectedOption[t("tokenOpenAI")]);
  }, [selectedOption[t("tokenOpenAI")]]);



  const [expandedMessages, setExpandedMessages] = useState(new Set())

  const navigateToSection = (direction = 'next') => {
    const messageDocContainer = document.querySelector('[class^="messageDocContainer"]');
    if (messageDocContainer) {
      const editor = messageDocContainer.querySelector('[class^="editor_"]');

      if (editor) {
        const sections = Array.from(editor.querySelectorAll('section'));
        const currentIndex = sections.findIndex(section => section.id === selectedSectionId);

        if (currentIndex !== -1) {
          let newIndex;
          if (direction === 'next') {
            newIndex = (currentIndex + 1) % sections.length;
          } else {
            newIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
          }

          const newSection = sections[newIndex];
          if (newSection && newSection.id) {
            dispatch(setMessageDocsSelectedSection(newSection.id));
            newSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }
  };

  const [showFolderIndicator, setShowFolderIndicator] = useState(false);
  const [selectedFolderPath, setSelectedFolderPath] = useState('');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasBeenManuallyTriggered, setHasBeenManuallyTriggered] = useState(false);

  const [showAppIndicator, setShowAppIndicator] = useState(false);
  const [selectedAppData, setSelectedAppData] = useState(null);

  const { selectedFile, selectedLines, status: statusApp } = useSelector(state => state.docs.app);

  useEffect(() => {
    if (selectedFile && selectedFile !== selectedFolderPath) {
      setSelectedFolderPath(selectedFile);
    }
  }, [selectedFile, selectedFolderPath]);


  useEffect(() => {
    console.log('🔍 statusApp', statusApp);
  }, [statusApp]);


  const isFolderPath = (path) => {
    if (!path) return false;
    return path.endsWith('/') || !path.includes('.') || path.split('/').pop().indexOf('.') === -1;
  };

  useEffect(() => {
    console.log('🔍 FolderIndicator Debug:', {
      isInitialLoad,
      hasBeenManuallyTriggered,
      selectedFile,
      selectedLines,
      showFolderIndicator
    });

    if (selectedLines && !isInitialLoad && !hasBeenManuallyTriggered) {
      const { startLine, endLine, startColumn, endColumn } = selectedLines;
      if (startLine !== endLine || startColumn !== endColumn) {
        console.log('🎯 FolderIndicator: Marcando como activado manualmente por selección real de líneas');
        setHasBeenManuallyTriggered(true);
      }
    }

    if (isInitialLoad) {
      console.log('🚫 FolderIndicator: Bloqueado por carga inicial');
      setShowFolderIndicator(false);
      return;
    }

    const hasRealSelection = selectedLines && (() => {
      const { startLine, endLine, startColumn, endColumn } = selectedLines;
      return startLine !== endLine || startColumn !== endColumn;
    })();

    if (!hasBeenManuallyTriggered && !hasRealSelection) {
      console.log('🚫 FolderIndicator: Bloqueado - no activado manualmente y sin selección real');
      setShowFolderIndicator(false);
      return;
    }

    if (selectedFile) {
      const isFolder = isFolderPath(selectedFile);

      if (isFolder) {
        console.log('📁 FolderIndicator: Mostrando carpeta');
        setShowFolderIndicator(true);
      } else if (selectedLines) {
        const { startLine, endLine, startColumn, endColumn } = selectedLines;
        if (startLine !== endLine || startColumn !== endColumn) {
          console.log('📄 FolderIndicator: Mostrando archivo con líneas seleccionadas');
          setShowFolderIndicator(true);
        } else {
          console.log('📄 FolderIndicator: Mostrando archivo con cursor');
          setShowFolderIndicator(true);
        }
      } else {
        console.log('📄 FolderIndicator: Mostrando archivo sin líneas');
        setShowFolderIndicator(true);
      }
    } else {
      console.log('🚫 FolderIndicator: Ocultando - no hay archivo seleccionado');
      setShowFolderIndicator(false);
    }
  }, [selectedLines, selectedFile, isInitialLoad, hasBeenManuallyTriggered]);

  useEffect(() => {
    console.log('⏰ FolderIndicator: Iniciando timer de 3 segundos');
    const timer = setTimeout(() => {
      console.log('✅ FolderIndicator: Timer completado, permitiendo mostrar');
      setIsInitialLoad(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('🚫 FolderIndicator: Forzando estado inicial a false');
    setShowFolderIndicator(false);
  }, []);

  const handleClickOutside = useCallback((event) => {
    const isChatArea = event.target.closest('[class*="chat"]');
    const isFileExplorer = event.target.closest('[class*="FileExplorer"]');
    const isFolderIndicator = event.target.closest('[class*="folderIndicator"]') ||
      event.target.closest('[class*="FolderIndicator"]') ||
      event.target.closest('[class*="folderIndicatorContainer"]');

    if (!isChatArea && !isFileExplorer && !isFolderIndicator && showFolderIndicator) {
      setShowFolderIndicator(false);
    }

    if (!isChatArea && !isFileExplorer && showAppIndicator) {
      setShowAppIndicator(false);
    }
  }, [showFolderIndicator, showAppIndicator]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleFileUpdateCallback = useCallback(async (operation, path, content, appId, timestamp) => {

    try {
      if (operation === 'createFile') {
        dispatch(setAppFiles(prevFiles => ({ ...prevFiles, [path]: content || '' })));
      } else if (operation === 'editFile') {
        dispatch(setAppFiles(prevFiles => ({ ...prevFiles, [path]: content || '' })));
      } else if (operation === 'deleteFile') {
        dispatch(setAppFiles(prevFiles => {
          const updatedFiles = { ...prevFiles };
          delete updatedFiles[path];
          return updatedFiles;
        }));
      } else if (operation === 'renameFile') {
        const oldPath = path;
        const newPath = content?.newPath;
        if (newPath) {
          dispatch(setAppFiles(prevFiles => {
            const updatedFiles = { ...prevFiles };
            if (updatedFiles[oldPath]) {
              updatedFiles[newPath] = updatedFiles[oldPath];
              delete updatedFiles[oldPath];
            }
            return updatedFiles;
          }));
        }
      }

      if (timestamp) {
        setMessages(prevMessages => {
          return prevMessages.map(message => {
            if (message.timestamp === timestamp && message.appId === appId) {
              return {
                ...message,
                text: message.text || message.text
              };
            }
            return message;
          });
        });
      }

    } catch (error) {
      console.error('❌ Error updating Redux state:', error);
    }
  }, [dispatch]);

  const handleAddDocument = useCallback(async (originalFilePath, customNewFilePath = null) => {

    try {
      const appMessage = messages.find(msg => msg.appId);

      if (!appMessage) {
        console.error('❌ No se encontró mensaje de aplicación');
        return;
      }

      const directory = originalFilePath.substring(0, originalFilePath.lastIndexOf('/'));
      const fileName = originalFilePath.split('/').pop();

      let newFilePath;
      if (customNewFilePath) {
        newFilePath = customNewFilePath;
      } else {
        const timestamp = Date.now();
        const newFileName = `${fileName.replace(/\.[^/.]+$/, '')}_copy_${timestamp}${fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.')) : ''}`;
        newFilePath = `${directory}/${newFileName}`;
      }

      dispatch(createAppFile({ path: newFilePath, content: '' }));


      if (appMessage.appId) {
        try {
          await handleFileUpdate('createFile', newFilePath, '', appMessage.appId);
        } catch (backendError) {
          console.warn('⚠️ Error syncing with backend, but file created locally:', backendError);
        }
      }

      setMessages(prevMessages => {
        return prevMessages.map(message => {
          if (message.appId) {
            const updatedText = message.text || {};
            const updatedFiles = { ...updatedText.files, [newFilePath]: '' };
            return {
              ...message,
              text: {
                ...updatedText,
                files: updatedFiles
              }
            };
          }
          return message;
        });
      });

    } catch (error) {
      console.error('❌ Error creating document:', error);
      throw error;
    }
  }, [messages, dispatch, handleFileUpdate]);


  const getFileExtension = (filePath) => {
    const ext = filePath.split('.').pop().toLowerCase();
    switch (ext) {
      case 'jsx':
      case 'tsx':
        return 'jsx';
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'css':
      case 'scss':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'html':
        return 'html';
      default:
        return 'text';
    }
  };

  const handleOpenChatInChatView = useCallback((selectedPath, selectedLines) => {
    let initialMessage = '';

    if (isFolderPath(selectedPath)) {
      initialMessage = `Necesito ayuda con la carpeta: ${selectedPath}`;
    } else {
      initialMessage = `Necesito ayuda con el archivo: ${selectedPath}`;

      if (selectedLines) {
        const { startLine, endLine } = selectedLines;
        if (startLine === endLine) {
          initialMessage += `\n\nEspecíficamente con la línea ${startLine}`;
        } else {
          initialMessage += `\n\nEspecíficamente con las líneas ${startLine} a ${endLine}`;
        }
      }

      const fileType = getFileExtension(selectedPath);
      initialMessage += `\n\nEs un archivo de tipo: ${fileType}`;
    }

    setInputValue(initialMessage);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    setShowFolderIndicator(false);

    console.log('🚀 ChatView abierto con mensaje inicial:', initialMessage);
  }, [isFolderPath, getFileExtension, setInputValue, setShowFolderIndicator]);


  const [scrapingStatus, setScrapingStatus] = useState('loading');
  const [scrapingData, setScrapingData] = useState({
    url: '',
    screenshot: null,
    selectors: [],
    template: null,
    results: []
  });

  const handleScrapingStatusChange = (newStatus) => {
    setScrapingStatus(newStatus);

    if (newStatus === 'loading') {
      setScrapingData({
        url: '',
        screenshot: null,
        selectors: [],
        template: null,
        results: []
      });
    }
  };

  const handleTemplateSave = async (template) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await fetch(`${apiUrl}/api/scraping/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template: {
            ...template,
            type: 'scraping_template',
            userId: userJson.id
          }
        })
      });

      if (response.ok) {
        const result = await response.json();

        setScrapingData(prev => ({
          ...prev,
          template: result.template
        }));
      } else {
        console.error('Error guardando template');
      }
    } catch (error) {
      console.error('Error guardando template:', error);
    }
  };

  const handleScrapingExecute = async (template) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const scrapingMessage = {
        text: `Ejecutar scraping con template: ${template.name}`,
        type: 'scraping_execute',
        template: template,
        agentId: selectedAgent?._id,
        chatId: chatId
      };

      handleChat(scrapingMessage);

    } catch (error) {
      console.error('Error ejecutando scraping:', error);
    }
  };

  const filtersDropdownRef = useRef(null);
  const [bottomNext, setBottomNext] = useState(false);
  const minimumDistance = 100;

  useEffect(() => {
    function checkPosicion() {
      if (filtersDropdownRef.current) {
        const rect = filtersDropdownRef.current.getBoundingClientRect();
        const distanciaInferior = window.innerHeight - rect.bottom;
        setBottomNext(distanciaInferior < minimumDistance);
      }
    }

    checkPosicion();
    window.addEventListener("scroll", checkPosicion);
    window.addEventListener("resize", checkPosicion);

    return () => {
      window.removeEventListener("scroll", checkPosicion);
      window.removeEventListener("resize", checkPosicion);
    };
  }, []);

  useEffect(() => {
    if ((messages.length > 0 && !bottomNext) || (inputValue.length > 0 && !bottomNext)) setBottomNext(true)
    if (messages.length === 0 && inputValue.length == 0 && bottomNext) setBottomNext(false)
  }, [messages, inputValue])


  return (
    <>
      <div
        ref={dragContainerRef}
        className={`${styles.messageDrag} ${!isDragging && styles.hidden}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <div className={styles.messageDragContainer}>
          {automations.length > 0 && (
            <div className={`${styles.messageDragAgent} ${automations.length <= 4 ? styles.big : ""} ${loadingStates.some((state) => state === "pending") && loadingStates.every((state) => state !== "active") ? styles.loadingMessage : loadingStates.length > 0 && loadingStates.every((state) => state === "active") ? styles.loadedAgent : ""}`} >
              {automations.map((auto, index) => (
                <div
                  key={index}
                  className={styles.messageDragAgentItem}
                  data-automate-type={auto.type}
                  data-automate-name={auto.name}
                  onDrop={(e) => handleDrop(e, auto)}

                >
                  <button
                    className={styles.messageDragAgentItemClose}
                    onClick={() => {
                      setLoadingStates([]);
                      setIsDropping(false);
                      setIsDragging(false);
                    }}
                  >
                    Cancelar
                  </button>
                  <div
                    className={styles.messageDragAgentItemHeader}
                    onClick={() => {
                      dispatch(setShowAutomation(true));
                      navigate(
                        `/admin/chat/${selectedAgent._id}/${chatId}?automation=${auto._id}`,
                        "_blank"
                      );
                    }}
                  >
                    <div className={styles.messageDragAgentItemHeaderIcon}>
                      <img
                        src={
                          automateData?.find((item) => item.type === auto.type)
                            ?.image
                        }
                        alt="icon"
                      />
                    </div>
                    <div className={styles.messageDragAgentItemHeaderContent}>
                      <b>{auto.inputValue}</b>
                      <p>
                        {auto.type}&nbsp;-&nbsp;
                        {
                          automateData?.find((item) => item.type === auto.type)
                            ?.description
                        }
                      </p>
                    </div>
                    <div className={styles.messageDragAgentItemHeaderTags}>
                      <div>
                        <b>
                          {auto?.createdAt &&
                            formatAgoDate({ dateString: auto.createdAt, t })}
                        </b>
                        <IconTag />
                      </div>
                      <div>
                        <IconStar />
                        <div
                          className={styles.messageDragAgentItemHeaderTagsLabel}
                        >
                          <span>{events?.length || "-"}</span>
                          <IconAutomate />
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul
                    className={`${styles.messageDragAgentItemList} ${isDropping ? styles.showList : ""} ${showImportAttachment ? styles.isLoading : ""}`}
                  >
                    {auto.automate?.map((event, index) => (
                      <li
                        key={index}
                        className={`${styles[loadingStates[index]]}`}
                        style={{ "--index": index }}
                      >
                        <label className={styles.loadingBar}></label>
                        <div
                          className={styles.messageDragAgentItemListContainer}
                        >
                          <div
                            className={styles.messageDragAgentItemListNumber}
                          >
                            {index + 1}
                          </div>
                          <div
                            className={styles.messageDragAgentItemListContent}
                          >
                            <p>{renderTextAutomate(event, 'title')}</p>
                            <span>
                              {renderTextAutomate(event)}
                            </span>
                          </div>
                          {event.data?.time > 0 && (
                            <div className={styles.messageDragAgentItemListTags}>
                              {renderTextAutomate(event, 'time')}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>


                  {isDropping && (
                    <DonutTimer
                      endTime={endTime}
                      color="#16c098"
                    />
                  )}

                  {isDropping && showImportAttachment && (
                    <div className={styles.messageDragAgentItemAlert}>
                      <b>¡Se ha detectado datos ya subidos!</b>
                      <div className={styles.messageDragAgentItemAlertTags}>
                        {auto.automate[3].data?.repeatData?.contacts.length > 0 && (
                          <div className={styles.messageDragAgentItemAlertTag}>
                            {auto.automate[3].data?.repeatData?.contacts.map((contact, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  navigate(`/admin/contacts/${contact?._id}`)
                                }}
                              >
                                <span>{contact?.contactName || '--'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {auto.automate[3].data?.repeatData?.actives.length > 0 && (
                          <div className={styles.messageDragAgentItemAlertTag}>
                            {auto.automate[3].data?.repeatData?.actives.map((active, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  navigate(`/admin/contacts/${active?._id}`)
                                }}
                              >
                                <span>{active?.name || '--'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {auto.automate[3].data?.repeatData?.docs.length > 0 && (
                          <div className={styles.messageDragAgentItemAlertTag}>
                            {auto.automate[3].data?.repeatData?.docs.map((doc, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  navigate(`/admin/assets/${doc?._id}`)
                                }}
                              >
                                <span>{doc?._id || '--'}</span>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                      <p>
                        Estás seguro que quieres importar estos datos
                      </p>
                      <div className={styles.messageDragAgentItemAlertButtons}>
                        <button onClick={() => {
                          setIsDragging(false);
                          setIsDropping(false);
                          setShowImportAttachment(false);
                        }}
                        >
                          Cancelar (N)
                        </button>
                        <button onClick={handleImportData}
                          className={styles.importButton}
                        >
                          Importar (Y)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div
            ref={attachmentAreaRef}
            className={styles.messageDragAttachment}
            onDrop={handleDrop}
            style={{
              display: isDropping ? 'none' : 'flex'
            }}
          >
            <IconAttach />
            <p>Adjuntar el archivo</p>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className={`${styles.chatContainerPage} ${isAgentModal && styles.chatContainerAgent} ${chatAutomate && styles.chatAutomate} ${isDragging && styles.hidden} `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
      >
        <div className={`${styles.chatContainer} ${isAgentModal && styles.chatContainerAgent}  ${chatAutomate && styles.chatAutomate} ${statusApp === 'expanded' ? 'expandedApp' : ''}`} >
          <div
            ref={messageContainerRef}
            className={`${styles.messageContainer} ${chatAutomate && styles.messageAutomateContainer}`}
          >
            {activeDateLabel && (
              <div className={styles.stickyDateSeparator}>
                <span>{activeDateLabel}</span>
              </div>
            )}
            {!agentId ? (
              <div className={`${styles.initialMessage}`}>
                {isAgentPopup ? (
                  <div>{t("testYourGpt")}</div>
                ) : inputValue.length >= 1 ? (
                  <div className={styles.initialMessageContainer}>
                    <div>
                      {/* <b>
                        Obtén <strong>respuestas</strong>.
                        Encuentra <strong>inspiración</strong>.
                        Aumente su <strong>productividad</strong>.
                      </b> */}
                      <b>
                        ¿En qué puedo ayudarte?
                      </b>
                    </div>
                    {/* <h2>{t("howCanHelpYou")}</h2> */}
                  </div>
                ) : (
                  <div className={styles.initialMessageContainer}>
                    <div>
                      <b>
                        Obtén <strong>respuestas</strong>.
                        Encuentra <strong>inspiración</strong>.
                        Aumente su <strong>productividad</strong>.
                      </b>
                      <b>
                        ¿En qué puedo ayudarte?
                      </b>
                    </div>
                    {/* <h2>{t("howCanHelpYou")}</h2> */}
                  </div>
                )}
              </div>
            ) : !chatId ? (
              <div className={`${styles.initialMessage}`}>
                <h2>{t("howCanHelpYou")}</h2>

                {/* Añadir botón para iniciar scraping */}
                {/*  */}
              </div>
            ) : (
              messages.length > 0 ? (
                Object.entries(messages).map((messagesForDay) => {

                  let dateObj;
                  try {
                    dateObj = new Date(messagesForDay[1].timestamp);
                    if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
                  } catch (error) {
                    dateObj = new Date();
                  }

                  const messageDate = format(dateObj, "yyyy-MM-dd");

                  let showLabel = false;
                  if (messageDate !== lastDateLabel) {
                    showLabel = true;
                    lastDateLabel = messageDate;
                  }

                  let label = format(dateObj, "MMMM dd, yyyy");
                  if (isToday(dateObj)) label = t("today");
                  else if (isYesterday(dateObj)) label = t("yesterday");

                  return (
                    <div className={styles.dateSeparatorContainer}>
                      {showLabel && (
                        <>
                          <div
                            className={styles.dateSeparatorAnchor}
                            ref={(el) => (observerRefs.current[label] = el)}
                            data-label={label}
                          >
                            <div className={styles.invisibleDateSeparator}>{label}</div>
                          </div>

                          <div
                            className={styles.staticDateLabel}
                            ref={(el) => {
                              if (el) dateLabelRefs.current[label] = el;
                            }}
                          >
                            {label}
                          </div>
                        </>
                      )}

                      {messagesForDay.map((message, index) => (
                        <>
                          {message.type == "me" ? (
                            <div className={styles.messageUserContainer}>
                              <div
                                className={`${styles.message} ${styles.userMessage}`}
                              >
                                <div>
                                  <p className={styles.userMessageContainer}>
                                    {message.replyId && (
                                      <div
                                        className={styles.replyContainer}
                                        onClick={() =>
                                          checkReplyMessage(message)
                                        }
                                      >
                                        <div>
                                          <b>
                                            Bot &nbsp;
                                            {selectedAgent?.name}
                                          </b>
                                          <p>
                                            {message?.replyId?.text ||
                                              "Message not found"}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {message.isRecord && (
                                      <VoiceMessageBubble
                                        audioBlob={message.isRecord.audioBlob}
                                        samples={message.isRecord.samples}
                                      />
                                    )}
                                    {message?.fileName && (
                                      <div
                                        className={styles.fileContainerMessage}
                                      >
                                        <p>{message?.fileName}</p>
                                        <div
                                          className={styles.iconFileContainer}
                                        >
                                          {imageExtensions.includes(
                                            message?.fileName
                                              ?.split(".")
                                              .pop()
                                              .toLowerCase()
                                          ) ? (
                                            <ImageIcon />
                                          ) : (
                                            <FileIcon />
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    <span className={styles.messageText}>
                                      {safeText(message.text)}
                                    </span>
                                    <span className={styles.date}>
                                      {(() => {
                                        try {
                                          const date = new Date(
                                            message.timestamp
                                          );
                                          if (isNaN(date))
                                            throw new Error("Invalid date");
                                          return date.toLocaleTimeString(
                                            "en-US",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            }
                                          );
                                        } catch {
                                          const now = new Date();
                                          return now.toLocaleTimeString(
                                            "en-US",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            }
                                          );
                                        }
                                      })()}
                                    </span>
                                  </p>
                                </div>
                                <div className={styles.avatar}>
                                  {user?.profileImage && !imageError ? (
                                    <img
                                      className={styles.profileImage}
                                      src={user.profileImage}
                                      onError={() => setImageError(true)}
                                    />
                                  ) : (
                                    <div className={styles.initials}>
                                      {user?.nombre
                                        ?.split(" ")
                                        .map((word) => word[0] || "U")
                                        .slice(0, 2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className={styles.optionsBtnMessage}>
                                <BtnOPtionsMessage
                                  isBotMessage={false}
                                  message={message}
                                  chatId={chatId}
                                />
                              </div>
                            </div>
                          ) : message.type == "bot" ? (
                            <div
                              data-timestamp={message.timestamp}
                              className={`${styles.message} ${styles.botMessage}`}
                            >
                              <div className={styles.message}>
                                <img
                                  src={facturaGPTBlack}
                                  className={styles.avatarBot}
                                />
                                {message.docId ? (
                                  <Meet
                                    type="doc"
                                    message={message}
                                  />
                                ) : message.apiId ? (
                                  <Meet
                                    type="api"
                                    message={message}
                                  />
                                ) : message.appId ? (
                                  <Meet
                                    type="app"
                                    message={message}
                                  />
                                ) :
                                  (message.scrapId && !message.isScript) ? (
                                    <Meet
                                      type="scraping"
                                      message={message}
                                    />
                                  ) : message.isGraph ? (
                                    <Meet
                                      type="graph"
                                      message={message}
                                      insertMessage={insertMessage}
                                      conf={{
                                        agentId: selectedAgent?._id,
                                        chatId: chatId,
                                      }}
                                    />
                                  ) : message.isComingSoon ? (
                                    <Meet
                                      type="coming-soon"
                                      message={message}
                                    />
                                  ) : message.isApiDelete ? (
                                    <div className={styles.isApi}>
                                      <div className={styles.message}>
                                        <p>
                                          {t("followTheSteps")} {safeText(message.text)}.
                                        </p>
                                      </div>
                                      {renderApi(message.text)}
                                    </div>
                                  ) : message.isLocation ? (
                                    <Meet
                                      type="location"
                                      message={message}
                                    />
                                  ) : message.isWatch ? (
                                    <Meet
                                      type="watch"
                                      message={message}
                                    />
                                  ) : message.isBluetooth ? (
                                    <Meet
                                      type="bluetooth"
                                      message={message}
                                    />
                                  ) : message.isScript ? (
                                    <>
                                      <Meet
                                        type="script"
                                        message={message}
                                        messageContainerRef={messageContainerRef}
                                      />
                                      {/* <MessageApi
                                    web={message.text.url}
                                    timestamp={message.timestamp}
                                    messageContainerRef={messageContainerRef}
                                  /> */}
                                    </>
                                  ) : message.isAutomate ? (
                                    <Meet
                                      type="automate"
                                      message={message}
                                    />
                                  ) : message.isAutomate1 ? (
                                    <Meet
                                      type="automate1"
                                      message={message}
                                    />
                                  ) : message.isAction ? (
                                    <Meet
                                      type="action"
                                      message={message}
                                    />
                                  ) : message.isToken ? (
                                    <Meet
                                      type="token"
                                      message={message}
                                    />
                                  ) : message.isTable ? (
                                    <Meet
                                      type="table"
                                      message={message}
                                    />
                                  ) : message.isImage ? (
                                    <Meet
                                      type="image"
                                      message={message}
                                    />
                                  ) : message.isAudio ? (
                                    <Meet
                                      type="audio"
                                      message={message}
                                    />
                                  ) : message.isOnline ? (
                                    <>
                                      <Meet
                                        type="online"
                                        message={message}
                                      />
                                      {/* <HighlightedText
  text={message.text?.text}
  annotations={message.text?.annotations}
/> */}
                                    </>
                                  ) : message.isViewer ? (
                                    <>
                                      <Meet
                                        type="viewer"
                                        message={message}
                                      />
                                      {/* <ViewerContainer message={message} /> */}
                                    </>
                                  ) : message.isDeliver ? (
                                    <>
                                      <Meet
                                        type="deliver"
                                        message={message}
                                      />
                                      {/* <ViewerContainer message={message} /> */}
                                    </>
                                  ) : message.isGym ? (
                                    <>
                                      <Meet
                                        type="gym"
                                        message={message}
                                      />
                                      {/* <ViewerContainer message={message} /> */}
                                    </>
                                  ) : message.isTimer ? (
                                    <Meet
                                      type="timer"
                                      message={message}
                                    />
                                  ) : message.isClock ? (
                                    <Meet
                                      type="clock"
                                      message={message}
                                    />
                                  ) : message.isExitAgent ? (
                                    <Meet
                                      type="exit-agent"
                                      message={message}
                                    />
                                  ) : message.isHelper ? (
                                    <Meet
                                      type="helper"
                                      message={message}
                                      setMessages={setMessages}
                                      conf={{
                                        agentId: selectedAgent?._id,
                                        chatId: chatId,
                                      }}
                                    />
                                  ) : (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: formatWhatsAppText(message.text),
                                      }}
                                    />
                                  )}
                              </div>
                              <div className={styles.optionsBtnMessage}>
                                <BtnOPtionsMessage
                                  isBotMessage={true}
                                  message={message}
                                  chatId={chatId}
                                  setShowReply={setShowReply}
                                />
                              </div>
                            </div>
                          ) : null}
                        </>
                      ))}
                    </div>
                  );
                }
                )
              ) : (
                inputValue.length >= 1 ? (
                  <div className={styles.initialMessage}>

                    <div className={styles.initialMessageContainer}>
                      <div>
                        <b>
                          ¿En qué puedo ayudarte?
                        </b>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.initialMessage}>
                    <div className={styles.initialMessageContainer}>
                      <div>
                        <b>
                          Obtén <strong>respuestas</strong>.
                          Encuentra <strong>inspiración</strong>.
                          Aumente su <strong>productividad</strong>.
                        </b>
                        <b>
                          ¿En qué puedo ayudarte?
                        </b>
                      </div>
                    </div>
                  </div>
                ))
            )}
            {chatAutomate && messages.length == 0 && (
              <CreateApiConnection selectedAutomate={selectedAutomateChat} />
            )}
            {messages && messages?.at(-1)?.type === "me" && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.message}>
                  <img src={facturaGPTBlack} className={styles.avatarBot} />
                  <div className={styles.isApi}>
                    <div
                      style={{ marginBottom: "0px" }}
                      className={styles.message}
                    >
                      <p>
                        <div className={styles.dotsContainer}>
                          <span className={styles.dot}>.</span>
                          <span className={styles.dot}>.</span>
                          <span className={styles.dot}>.</span>
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {false && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <img src={facturaGPTWhite} className={styles.avatar} />
                <p>{t("loading")}</p>
              </div>
            )}
          </div>

          {messages?.length === 0 && (
            <div className={styles.buttonContainer}>
              {(selectedAgent?.instructions?.length > 0
                ? selectedAgent.instructions
                : userData?.instructions
              )?.map((instruction, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleChat({
                      text: instruction.title,
                      agent: selectedAgent?.name || null,
                    })
                  }
                >
                  {instruction.title}
                </button>
              ))}
            </div>
          )}

          <div
            ref={chatTextContainerRef}
            className={`${styles.chatTextContainer} ${messages?.length >= 1 && styles.chatTextContainerEnd}`}
          >
            <div className={styles.infoChunck}>
              {showInfoMessage && (
                <div>
                  {!isNaN(timeToFinishResponse) && (
                    <span>{(timeToFinishResponse / 1000).toFixed(3)} s</span>
                  )}
                  <span>
                    {" "}
                    <Arrow className={styles.upArrow} />
                    {tokenInput}{" "}
                  </span>
                  <span>
                    {" "}
                    <Arrow className={styles.downArrow} />
                    {tokenOutput}{" "}
                  </span>
                </div>
              )}
            </div>
            <>
              {showVoiceRecorder && (
                <VoiceRecorderWave
                  onSend={handleSendVoice}
                  onCancel={() => setShowVoiceRecorder(false)}
                  ref={recorderRef}

                />
              )}
              <div
                className={`${styles.chatTextAreaContainer} ${isLoadBot && styles.chatContainerBorderAnimation}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    const file = files[0];

                    const isPDF =
                      file.type === "application/pdf" ||
                      file.name.toLowerCase().endsWith(".pdf");

                    if (!isPDF) {
                      alert("Solo se permiten archivos PDF.");
                      return;
                    }

                    handleFileChange({ target: { files } });
                  }
                }}
              >

                {/* {console.log('containsArroba', containsArroba)} */}
                {/* {containsArroba && (

                  <ContactsPopup
                    ref={contactsRef}
                    handleSelectItem={handleSelectItem}
                    type={"chat"}
                    inputValue={inputValue.split("@").pop()}
                    customStyle={{
                      top: "initial",
                      bottom: "100%",
                      width: "auto",
                      padding: "4px",
                      maxWidth: "500px",
                      background: "#fafafa",
                      boxShadow: "0 2px 10px #0000001a",
                      gap: "0px",
                    }}
                    handleClickFocus={handleClickFocus}
                  />
                )} */}
                {inputValue && (
                  <div
                    style={{
                      transform: `translateY(-${scrollTop - 2}px)`,
                    }}
                    className={`${styles.highlight}`}
                    aria-hidden="true"
                  >
                    {parseText(inputValue)}
                  </div>
                )}

                {showReply?.text && (
                  <div className={styles.replyContainer}>
                    <div>
                      <b>
                        Bot &nbsp;
                        {selectedAgent?.name}
                      </b>
                      <p>{showReply?.text || "Message not found"}</p>
                    </div>
                    <button onClick={() => setShowReply(false)}>
                      <IconClose />
                    </button>
                  </div>
                )}

                {/* Section Indicator */}
                {selectedSectionId && (
                  <div className={styles.sectionIndicator}>
                    <div className={styles.sectionInfo}>
                      <span className={styles.sectionId}>📄 {selectedSectionId.substring(0, 8)}...</span>
                      <div className={styles.sectionActions}>
                        <button
                          className={styles.sectionActionBtn}
                          onClick={() => {
                            navigateToSection('prev');
                          }}
                          title="Previous Section (↑)"
                        >
                          ↑
                        </button>
                        <button
                          className={styles.sectionActionBtn}
                          onClick={() => {
                            navigateToSection('next');
                          }}
                          title="Next Section (↓)"
                        >
                          ↓
                        </button>
                        <button
                          className={styles.sectionActionBtn}
                          onClick={() => dispatch(setMessageDocsSelectedSection(null))}
                          title="Clear Selection (Esc)"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className={styles.sectionLogs}>
                      <ul>
                        <li>
                          {true ? (
                            <IconVerify />
                          ) : (
                            <IconCancel />
                          )}
                          <p>
                            Cambios.. el texto del usuario
                          </p>
                          <b>
                            Hace 10 minutos
                          </b>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}


                {/* Folder Indicator */}
                {showFolderIndicator && (
                  <div className={styles.folderIndicatorContainer}>
                    <FolderIndicator
                      selectedPath={selectedFolderPath}
                      isVisible={showFolderIndicator}
                      onClose={() => setShowFolderIndicator(false)}
                      onAddDocument={handleAddDocument}
                      onOpenChat={handleOpenChatInChatView}
                    />
                  </div>
                )}

                {/* App Indicator */}
                {showAppIndicator && (
                  <div className={styles.appIndicatorContainer}>
                    <AppIndicator
                      appData={selectedAppData}
                      isVisible={showAppIndicator}
                      onClose={() => setShowAppIndicator(false)}
                    />
                  </div>
                )}

                <textarea
                  ref={textareaRef}
                  spellCheck="false"
                  type="text"
                  placeholder={
                    selectedAgent
                      ? t("talkWith") + " " + selectedAgent?.name
                      : t("talkToFacturaGPT")
                  }
                  value={inputValue}
                  onFocus={() => setIsFocused(true)}
                  onBlur={(e) => {
                    setIsFocused(false);
                    handleBlur(e);
                  }}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowInfoMessage(false);

                    if (!isNavigatingHistory) {
                      setHistoryIndex(messageHistory.length);
                    }

                    if (e.target.value === '') {
                      setIsNavigatingHistory(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.ctrlKey || e.altKey) {
                      e.stopPropagation();
                      return;
                    }

                    if (e.shiftKey && e.key === "/") {
                      e.stopPropagation();
                      return;
                    }

                    if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                      e.preventDefault();
                      navigateHistoryUp();
                      return;
                    }

                    if (e.key === "ArrowDown" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                      e.preventDefault();
                      navigateHistoryDown();
                      return;
                    }

                    if (e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Enter") {
                      setIsNavigatingHistory(false);
                    }

                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();

                      if (inputValue && inputValue.trim() !== '') {
                        saveMessageToHistory(inputValue);
                      }

                      setInputValue("");
                      setIsPaused(false);
                      setTokenInput(inputValue?.length);

                      if (itemsSelected?.length > 0) {
                        const items = itemsSelected.map(item => {
                          if (item.contactName) {
                            return {
                              id: item._id,
                              type: 'contact',
                            }
                          } else {
                            return {
                              id: item._id,
                              type: 'asset',
                            }
                          }
                        })

                        handleSendMessage({
                          text: inputValue,
                          agentName: selectedAgent?.name,
                          agentId: selectedAgent?._id,
                          isRAG: items,

                        });
                      } else {
                        handleChat({
                          text: inputValue,
                          agent: selectedAgent?.name,
                          agentId: selectedAgent?._id,
                          file: filePayload,
                        });
                      }

                      setFilePayload(null);
                      setFileInfo(null);
                      setItemsSelected([])

                    }
                  }}
                />

                {fileInfo && (
                  <div className={styles.fileContainer}>
                    <div
                      className={styles.deleteFileButton}
                      onClick={() => {
                        setFilePayload(null);
                        setFileInfo(null);
                      }}
                    >
                      X
                    </div>
                    <div className={styles.iconFileContainer}>
                      {imageExtensions.includes(
                        fileInfo.name.split(".").pop().toLowerCase()
                      ) ? (
                        <ImageIcon />
                      ) : (
                        <FileIcon />
                      )}
                    </div>
                    <div>
                      <p>{fileInfo.name}</p>
                      <span>{fileInfo.name.split(".").pop()}</span>
                    </div>
                  </div>
                )}

                <div className={styles.optionsChat}>
                  <div>
                    <button
                      data-tooltip={t("moreOptionsHere")}
                      onClick={() => setIsOpen((prev) => !prev)}
                    >
                      <AddPlus
                        style={{
                          height: "14px",
                          width: "14px",
                        }}
                      />
                    </button>
                    {isOpen && (
                      <ChatMenu setOpen={setIsOpen} />
                    )}

                    {inputValue && !isAgentPopup && (
                      <>
                        <button
                          data-tooltip={t("searchTheWeb")}
                          onClick={searchInWebFn}
                        >
                          <InternetIconChat
                            className={searchInWeb && styles.activeIcon}
                          />
                        </button>


                        {/* {isOpen && (
                          <FloatingMenu
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            openModalAutomate={openModalAutomate}
                            closeModalAutomate={closeModalAutomate}
                            showCreateFolder={showCreateFolder}
                            setShowCreateFolder={setShowCreateFolder}
                            showNewTagModal={showNewTagModal}
                            setShowNewTagModal={setShowNewTagModal}
                            showNewContact={showNewContact}
                            setShowNewContact={setShowNewContact}
                            showNewProduct={showNewProduct}
                            setShowNewProduct={setShowNewProduct}
                            setShowNewBill={setShowNewBill}
                            setShowUplaodFile={setShowUplaodFile}
                            setShowLocationModal={setShowLocationModal}
                            customPosition={{
                              top: "initial",
                              bottom: "80px",
                              left: "450px",
                              height: "fit-content",
                              width: "fit-content",
                              flexDirection: "column-reverse",
                            }}
                          />
                        )} */}

                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf, .jpg, .jpeg, .xlsx, .xls, .csv, .png, .jpg, j.peg, .gif, .bmp, .svg, .webp"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    <button
                      data-tooltip={t("attachFile")}
                      onClick={handleButtonClick}
                    >
                      <BlackClip />
                    </button>
                    <button
                      data-tooltip={
                        !isListening ? t("speakByVoice") : t("stopVoice")
                      }
                      onClick={handleClick}
                      onMouseLeave={() => {
                        if (voiceChat) startCountdown();
                      }}
                      onMouseEnter={cancelCountdown}
                    >
                      <AudioWaves
                        isRecording={voiceChat}
                        setIsRecording={setVoiceChat}
                      />
                      {countdownNumber && (
                        <span className={styles.notificationTotal}>
                          {countdownNumber}
                        </span>
                      )}
                    </button>
                    <button
                      data-tooltip={muted ? t("muteSound") : t("unMuteSound")}
                      onClick={handleToggleSound}
                    >
                      {!muted ? <SoundOnIcon /> : <SoundOffIcon />}
                    </button>

                    <button
                      onClick={() => {

                        setShowVoiceRecorder((v) => !v)
                      }}
                      data-tooltip={t('voiceWave')}
                    >
                      <BlackMicrophone />
                    </button>

                    {showVoiceRecorder && (
                      <>
                        {!hasStoppedRecording && (
                          <button onClick={() => {
                            recorderRef.current?.stopRecording()
                          }} data-tooltip={t('stop')}>⏹️</button>
                        )}

                        {hasStoppedRecording && (
                          isPlaying ? (
                            <button onClick={() => {
                              recorderRef.current?.handlePause()
                            }} data-tooltip={t('pause')}>⏸️ </button>
                          ) : (
                            <button onClick={() => {
                              recorderRef.current?.handlePlay()
                            }} data-tooltip={t('play')}>▶️ </button>
                          )
                        )}

                        <button onClick={() => {
                          recorderRef.current?.handleCancel()
                        }} data-tooltip={t('delete')}>🗑️ </button>

                        {hasStoppedRecording && (
                          <button
                            onClick={async () => {
                              const recorder = recorderRef.current;
                              if (!recorder) return;

                              if (isRecording) {
                                recorder.stopRecording();
                              }

                              await recorder.sendRecording();
                            }} data-tooltip={t('send')}
                          >
                            📤
                          </button>
                        )}
                      </>
                    )}






                  </div>
                  <div>
                    {messages?.length >= 1 && (
                      <div
                        onClick={restartLastMessageFn}
                        className={styles.restartButton}
                        style={{
                          color: autoClear && "black",
                        }}
                      >
                        Auto-clear
                      </div>
                    )}
                    {(showReply?.text ||
                      inputValue.length >= 1 ||
                      (isLoadBot && !finishedResponseBot)) && (
                        <button
                          data-tooltip={
                            !isLoadBot ? t("sendMessage") : isPaused ? t("resumeChat") : t("pauseChat")
                          }
                          className={`${styles.sendMessageBtn}`}
                          onClick={() => {
                            if (!isLoadBot) {
                              handleChat({
                                text: inputValue,
                                agent: selectedAgent?.name,
                                agentId: selectedAgent?._id,
                                file: filePayload,
                              });
                            } else {
                              setIsPaused((prev) => !prev);
                            }
                          }}
                        >
                          {(!isLoadBot || isPaused) ? (
                            <ArrowUp className={styles.ArrowUp} />
                          ) : (
                            <PauseIcon className={styles.PauseIcon} />
                          )}
                        </button>
                      )}
                  </div>
                </div>
                {messages?.length === 0 &&
                  inputValue &&
                  isFocused &&
                  !isAgentPopup && (
                    <div className={styles.recommendesQuestionsContainer}>
                      <div className={styles.recomendQuestions}>
                        {recommendedQuestions.map((text, index) => {
                          const normalizedText = text
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase();

                          const normalizedInputValue = inputValue
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase();

                          const forwardMatchIndex =
                            normalizedText.indexOf(normalizedInputValue);

                          const backwardMatchIndex =
                            normalizedText.lastIndexOf(normalizedInputValue);

                          if (
                            forwardMatchIndex === -1 &&
                            backwardMatchIndex === -1
                          ) {
                            return null;
                          }

                          const matchIndex =
                            forwardMatchIndex !== -1
                              ? forwardMatchIndex
                              : backwardMatchIndex;
                          const matchLength = inputValue.length;

                          return (
                            <div
                              key={index}
                              onMouseDown={() =>
                                handleChat({
                                  text: text,
                                  agent: selectedAgent?.name,
                                })
                              }
                            >
                              <p className={`${styles.textBlack}`}>
                                <span className={`${styles.textBlack}`}>
                                  {text.slice(0, matchIndex)}
                                </span>

                                <span className={`${styles.textBlack}`}>
                                  {text.slice(
                                    matchIndex,
                                    matchIndex + matchLength
                                  )}
                                </span>

                                {text.slice(matchIndex + matchLength)}
                              </p>
                              <Arrow />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                {tokens?.tokens?.length > 0 &&
                  <div ref={filtersDropdownRef} style={{ position: "relative" }}>
                    <div style={{ position: "absolute", right: "-15px", top: "3px" }}>
                      <FiltersDropdownContainer
                        customDropdownOptions={{ bottom: "100%", marginBottom: " 4px", marginTop: "0px" }}
                        bottomNext={bottomNext}
                        setSelectedFilters={setSelectedOption}
                        selectedFilters={selectedOption}
                        options={optionsFiltered}
                        father={"chatToken"}
                      />
                    </div>
                  </div>}
              </div>
            </>
            {!isAgentPopup && renderMessage()}
          </div>

          {tokens?.tokens?.length > 0 && <div style={{ height: "25px" }}></div>}

          {shouldRenderActions && !hiddeCarousel &&
            (windowWidth >= 768 ? (
              <div className={styles.buttonContainer}>
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleChat({
                        text: action.text,
                        agent: selectedAgent?.name,
                        id: action?.id,
                      })
                    }
                  >
                    <img src={action.img} alt="Icon" />
                    {action.text}
                    <GrayDiagonalArrow />
                  </button>
                ))}
              </div>
            ) : (
              <Scroller
                direction="left"
                speed="slow"
                handleChat={handleChat}
                isArray={true}
                content={actions}
                selectedAgent={selectedAgent}
                alone={true}
              />
            ))}

          {!inputValue && !hiddeCarousel &&
            messages?.length === 0 &&
            !isAgentPopup &&
            shouldRenderActions && <ChatTags handleChat={handleChat} />}

          {!inputValue && !hiddeCarousel &&
            messages?.length === 0 &&
            !isAgentPopup &&
            shouldRenderActions && (
              <div className={styles.footerChat}>
                <div className={styles.languageContainer}>
                  {languageFlags.map((item) => (
                    <span
                      key={item.code || item.value}
                      className={styles.dropdownItem}
                      onClick={() => {
                        i18n.changeLanguage(item.label);
                      }}
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
                <div className={styles.linksContainerFooterChat}>
                  <a href="/terms">{t("cookies")}</a>
                  <a href="/terms">{t("privacy")}</a>
                  <a href="/home">{t("home")}</a>
                  <a href="/contact">{t("more")}</a>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

const ChatView = ({typeChat }) => {
  const [t] = useTranslation(["ChatView", "Preview"]);
  const { agentId, chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedSectionId } = useSelector((state) => state.docs);

  const [menuOpenChat, setMenuOpenChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);
  const [inputValue, setInputValue] = useState(``);
  const { selectedAgent, currentChat, loading, chatList, setChatList, emptyChat } = useSelector((state) => state.chat);

  const [chatAgentId, setChatAgentId] = useState(null);
  const { question, user, totalNotification, showAutomation, tokens } = useSelector((state) => state.user, shallowEqual);
  const location = useLocation();
  const [newChat, setNewChat] = useState()
  const [containsArroba, setContainsArroba] = useState(null)
  const [arrobaCount, setArrobaCount] = useState(0)
  const [selectItemCount, setSelectItemCount] = useState(0)
  const [showMiniProfileModal, setShowMiniProfileModal] = useState()
  const [itemsSelected, setItemsSelected] = useState([])

  const [isLoadBot, setIsLoadBot] = useState(false);
  const [showCorporativeModal, setShowCorporativeModal] = useState(false);
  const [corporativeTitle, setCorporativeTitle] = useState("");
  const [corporativeMessage, setCorporativeMessage] = useState("");
  const [autoClear, setAutoClear] = useState(false)
  const [searchInWeb, setSearchInWeb] = useState(false)
  const [filePayload, setFilePayload] = useState(null);
  const [tokenInput, setTokenInput] = useState(0)
  const [tokenOutput, setTokenOutput] = useState(0)
  const [timeToFinishResponse, setTimeToFinishResponse] = useState(0)
  const [finishedResponseBot, setFinishedResponseBot] = useState(false)
  const [showInfoMessage, setShowInfoMessage] = useState(false)


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Ref para rastrear si ya procesamos el transcript
  const processedTranscriptRef = useRef(false);
  // Ref para controlar la sincronización de mensajes
  const isUpdatingMessagesRef = useRef(false);


  const [leftWidth, setLeftWidth] = useState(200);
  const isResizing = useRef(false);
  const startX = useRef(0);

  const [showNewAgent, setShowNewAgent] = useState(
    location.state?.showAgent || false
  );
  const [idSelectedAgent, setIdSelectedAgent] = useState(null);
  const [selectedItemActive, setSelectedItemActive] = useState(false)
  const [userData, setUserData] = useState({
    Capabilities: [],
    pinned: false,
    tone: 3,
    answer: 3,
  });

  const handleSelectItem = (item) => {
    setSelectedItemActive(true)
    setContainsArroba(false)
    const prev = inputValue.split("@").slice(0, -1).join("@")
    setInputValue(`${prev}@${item.name ? item.name : item.contactName ? item.contactName :
      item.documentTitle ? item.documentTitle : "not found"}`)
    setSelectItemCount(selectItemCount + 1)
    setItemsSelected([...itemsSelected, item])

    // <p>{item.name ? item.name : "category" in item ? "Nombre del Activo": "accessPermitType" in item ? "Elemento" :
    //   item.contactName ? item.contactName : "contactName" in item ? "Nombre de la Cuenta" :
    //   item.documentTitle ? item.documentTitle : "stateStripe" in item ? "Nombre del documento" :
    //   "hidden" in item ? "Nombre de variable" : ""}</p>

    // console.log('item', item)
  }

  const [isPaused, setIsPaused] = useState(false);


  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);


  const [showReply, setShowReply] = useState({});

  const readerMessageRef = useRef(null);

  const {
    searchTerm: searchTermState
  } = useSelector((state) => state.chat);
  const [pendingMessage, setPendingMessage] = useState(null);
  useEffect(() => {
    if (selectedAgent && pendingMessage) {
      handleChat({
        text: pendingMessage.text,
        agent: selectedAgent?.name,
        agentId: selectedAgent?._id,
      })
      setPendingMessage(null);
    }
  }, [selectedAgent, pendingMessage]);



  const insertMessage = ({
    text,
    timestamp,
    threadId,
    apiId,
    docId,
    appId,
    scrapId,
    replyId,
    isRAG,
    isRecord,
    isGraph,
    isApi,
    isScript,
    isAction,
    isTable,
    isAutomate,
    isAsset,
    isImage,
    isAudio,
    isOnline,
    isViewer,
    isDeliver,
    isGym,
    isLocation,
    isTimer,
    isClock,
    isToken,
    isHelper,
    isExitAgent,
    isComingSoon,
    // accumulatedText = ''
  }) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];

      let accumulatedText = "";

      if (scrapId || apiId || appId || docId || isRAG || isAction || isTable || isAutomate || isAsset || isImage || isAudio || isOnline || isGraph || isApi || isViewer || isScript || isHelper || isExitAgent) {
        accumulatedText = text;
      } else {
        accumulatedText += text;
      }

      if (
        newMessages.length > 0 &&
        newMessages[newMessages.length - 1].type === "bot"
      ) {
        // newMessages[newMessages.length - 1].text = accumulatedText;
        // isRecord && (newMessages[newMessages.length - 1].isRecord = isRecord);
        // isGraph && (newMessages[newMessages.length - 1].isGraph = isGraph);
        // isApi && (newMessages[newMessages.length - 1].isApi = isApi);
        // isAction && (newMessages[newMessages.length - 1].isAction = isAction);
        // isTable && (newMessages[newMessages.length - 1].isTable = isTable);
        // isAutomate && (newMessages[newMessages.length - 1].isAutomate = isAutomate);
        // isAsset && (newMessages[newMessages.length - 1].isAsset = isAsset);
        // isImage && (newMessages[newMessages.length - 1].isImage = isImage);
        // isAudio && (newMessages[newMessages.length - 1].isAudio = isAudio);
        // isOnline && (newMessages[newMessages.length - 1].isOnline = isOnline);
        // isViewer && (newMessages[newMessages.length - 1].isViewer = isViewer);
        // isRAG && (newMessages[newMessages.length - 1].isRAG = isRAG);
        // threadId && (newMessages[newMessages.length - 1].threadId = threadId);
        // apiId && (newMessages[newMessages.length - 1].apiId = apiId);
        // replyId && (newMessages[newMessages.length - 1].replyId = replyId);
        // docId && (newMessages[newMessages.length - 1].docId = docId);
        // appId && (newMessages[newMessages.length - 1].appId = appId);
        // scrapId && (newMessages[newMessages.length - 1].scrapId = scrapId);
        // isLocation && (newMessages[newMessages.length - 1].isLocation = isLocation);
        // isTimer && (newMessages[newMessages.length - 1].isTimer = isTimer);
        // isClock && (newMessages[newMessages.length - 1].isClock = isClock);
        // isScript && (newMessages[newMessages.length - 1].isScript = isScript);
        // isToken && (newMessages[newMessages.length - 1].isToken = isToken);
        // isHelper && (newMessages[newMessages.length - 1].isHelper = isHelper);
        // isExitAgent && (newMessages[newMessages.length - 1].isExitAgent = isExitAgent);
        // isComingSoon && (newMessages[newMessages.length - 1].isComingSoon = isComingSoon);
        console.log('7777&&&&')
        newMessages.push({
          text: accumulatedText,
          type: "bot",
          ...(timestamp && { timestamp: timestamp }),
          ...(isRecord && { isAudio: isRecord }),
          ...(isGraph && { isGraph: isGraph }),
          ...(isApi && { isApi: isApi }),
          ...(isAction && { isAction: isAction }),
          ...(isTable && { isTable: isTable }),
          ...(isAutomate && { isAutomate: isAutomate }),
          ...(isAsset && { isAsset: isAsset }),
          ...(isImage && { isImage: isImage }),
          ...(isAudio && { isAudio: isAudio }),
          ...(isOnline && { isOnline: isOnline }),
          ...(isViewer && { isViewer: isViewer }),
          ...(isRAG && { isRAG: isRAG }),
          ...(threadId && { threadId: threadId }),
          ...(apiId && { apiId: apiId }),
          ...(docId && { docId: docId }),
          ...(appId && { appId: appId }),
          ...(scrapId && { scrapId: scrapId }),
          ...(replyId && { replyId: replyId }),
          ...(isLocation && { isLocation: isLocation }),
          ...(isTimer && { isTimer: isTimer }),
          ...(isClock && { isClock: isClock }),
          ...(isScript && { isScript: isScript }),
          ...(isToken && { isToken: isToken }),
          ...(isHelper && { isHelper: isHelper }),
          ...(isExitAgent && { isExitAgent: isExitAgent }),
          ...(isComingSoon && { isComingSoon: isComingSoon }),
        });
      } else {
        console.log('12345')
        newMessages.push({
          text: accumulatedText,
          type: "bot",
          ...(timestamp && { timestamp: timestamp }),
          ...(isRecord && { isAudio: isRecord }),
          ...(isGraph && { isGraph: isGraph }),
          ...(isApi && { isApi: isApi }),
          ...(isAction && { isAction: isAction }),
          ...(isTable && { isTable: isTable }),
          ...(isAutomate && { isAutomate: isAutomate }),
          ...(isAsset && { isAsset: isAsset }),
          ...(isImage && { isImage: isImage }),
          ...(isAudio && { isAudio: isAudio }),
          ...(isOnline && { isOnline: isOnline }),
          ...(isViewer && { isViewer: isViewer }),
          ...(isRAG && { isRAG: isRAG }),
          ...(threadId && { threadId: threadId }),
          ...(apiId && { apiId: apiId }),
          ...(docId && { docId: docId }),
          ...(appId && { appId: appId }),
          ...(scrapId && { scrapId: scrapId }),
          ...(replyId && { replyId: replyId }),
          ...(isLocation && { isLocation: isLocation }),
          ...(isTimer && { isTimer: isTimer }),
          ...(isClock && { isClock: isClock }),
          ...(isScript && { isScript: isScript }),
          ...(isToken && { isToken: isToken }),
          ...(isHelper && { isHelper: isHelper }),
          ...(isExitAgent && { isExitAgent: isExitAgent }),
          ...(isComingSoon && { isComingSoon: isComingSoon }),
        });
      }
      console.log('newMessages222', newMessages)
      return newMessages;
    });
  }



  const handleSendMessage = async ({
    text = false,
    type,
    timestamp,
    agentName,
    agentId,
    record,
    isRAG,
    file,
    newChat,
  }) => {

    if (readerMessageRef.current) {
      readerMessageRef.current.cancel();
      readerMessageRef.current = null;
    }


    if (agentName == "" || agentName == undefined) {
      console.log('🎤 agentName está vacío o undefined, mostrando modal de selección de agente');
      setPendingMessage({
        text,
        type,
        timestamp,
        agentId,
        record,
        isRAG,
        file,
        newChat,
      });
      setShowCorporativeModal(true);
      setCorporativeTitle(t("itIsNecessarySelectAgent"));
      setCorporativeMessage(t("selectAgentToEnableMessage"));
      return;
    }
    try {
      setShowReply({})
      setIsLoadBot(true);
      setFinishedResponseBot(false)
      // console.log('typetypetype', type)
      console.log('autoClear chattt', autoClear, type)
      // if (autoClear && type && type !== 'fn') {
      if (autoClear && type !== 'fn') {
        setMessages([])
      }


      if (type !== 'fn' && (text || showReply?.timestamp || record)) {
        // Marcar que estamos actualizando mensajes para evitar que el useEffect interfiera
        isUpdatingMessagesRef.current = true;

        setMessages((prevMessages) => {
          const newMessages = [
            ...prevMessages,
            {
              text: text || "",
              type: type || "me",
              agent: agentName,
              fileName: file?.name,
              fileType: file?.type,
              ...(timestamp && { timestamp: timestamp }),
              ...(isRAG && { isRAG: isRAG }),
              ...(showReply.timestamp && { replyId: showReply }),
              ...(record && { isRecord: record }),
            },
          ];
          console.log('newMessages', newMessages)
          return newMessages;
        });

        setInputValue("");

        // Resetear la bandera después de un breve delay para permitir que el estado se actualice
        setTimeout(() => {
          isUpdatingMessagesRef.current = false;
        }, 100);
      }


      const userStorage = localStorage.getItem("user");

      const userJson = JSON.parse(userStorage);
      const token = userJson.accessToken;
      const new_id = uuidv4();
      let selectedChat;

      if (!chatId) selectedChat = new_id;
      else selectedChat = chatId;

      navigate(`/admin/chat/${agentId}/${selectedChat}`);

      let threadId = null
      let apiId = null
      let docId = null
      let appId = null
      let scrapId = null

      if (newChat) {
        // setMessages("");
      } else {
        const lastMessage = messages[messages.length - 1]
        threadId = lastMessage?.threadId || null
        apiId = lastMessage?.apiId || null
        docId = lastMessage?.docId || null
        appId = lastMessage?.appId || null
        scrapId = lastMessage?.scrapId || null
      }

      if (selectedSectionId) {
        docId = `docId_${selectedSectionId}`
      }

      const startTime = Date.now();

      await fetch(`${apiUrl}/api/chat/${selectedAgent._id}/${selectedChat}/messages`, {
        // await fetch(`${apiUrl}/api/chat/${agentId}/${selectedChat}/messages`, {
        method: "POST",
        body: JSON.stringify({
          text: text,
          file: file,
          ...(timestamp && { timestamp: timestamp }),
          ...(type && { type: type }),
          ...(record && { record: record }),
          ...(isRAG && { isRAG: isRAG }),
          ...(showReply.timestamp && { replyId: showReply }),
          ...(threadId && { threadId: threadId }),
          ...(apiId && { apiId: apiId }),
          ...(docId && { docId: docId }),
          ...(appId && { appId: appId }),
          ...(scrapId && { scrapId: scrapId }),
        }),
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {

        if (response.ok) {
          readerMessageRef.current = response.body.getReader();

          const decoder = new TextDecoder();
          let accumulatedChunks = "";
          // let accumulatedText = "";

          const processStream = async () => {
            while (true) {
              if (isPausedRef.current) {
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
              }

              const { done, value } = await readerMessageRef.current.read();
              if (done) {
                const userToken = localStorage.getItem("user");
                const userJson = JSON.parse(userToken);
                const token = userJson?.accessToken;
                console.log('donedonedone')
                setFinishedResponseBot(true)
                setIsLoadBot(false);
                dispatch(fetchByMenu({ query: searchTermState }));
                dispatch(getAgents({ token }));
                break;
              }

              const chunk = decoder.decode(value, { stream: true });

              accumulatedChunks += chunk;

              let lines = accumulatedChunks.split("\n");
              accumulatedChunks = lines.pop();

              for (const line of lines) {
                if (line.trim()) {
                  try {
                    const chunk = JSON.parse(line);
                    const { text, type, threadId, docId, appId, scrapId, apiId, timestamp } = chunk.data;
                    setTokenOutput((prev) => Number(prev || 0) + Number(chunk?.data?.output?.token));

                    setShowInfoMessage(true)

                    const firstBackendResponseTime = Date.now();
                    const timeDiffMs = firstBackendResponseTime - startTime;

                    setTimeToFinishResponse(timeDiffMs);

                    // console.log('text prompt:', text, type, threadId, docId, appId, scrapId, timestamp)
                    if (type === "graph") {

                      insertMessage({ text, isGraph: true, timestamp });

                    } else if (type == "table") {
                      insertMessage({ text, isTable: true, threadId, timestamp });
                    } else if (type === "automate") {
                      insertMessage({ text, isAutomate: true, threadId, timestamp });
                    } else if (type === "connect-api") {
                      insertMessage({ text, isConnectApi: true, threadId, timestamp, url: text.url });
                    } else if (type === "api") {
                      // insertMessage({ text, isApi: true, apiId, timestamp, url: text.url });
                      insertMessage({ text, isApi: true, apiId, timestamp });
                    } else if (type === "script") {
                      console.log('text script', text)
                      insertMessage({ text, isScript: true, threadId, scrapId, timestamp });
                    } else if (type == "voice") {
                      insertMessage({ text, isVoice: true, threadId, timestamp });
                      const texto = new SpeechSynthesisUtterance(text);
                      texto.lang = "es-ES";
                      window.speechSynthesis.speak(texto);
                    } else if (type == "action") {
                      insertMessage({ text, isAction: true, timestamp });
                    } else if (type == "token") {
                      console.log('23eju4hgr7u47hu')
                      insertMessage({ text, isToken: true, timestamp });
                    } else if (type == "pause") {
                      setMessages((prevMessages) => {
                        const newMessages = [...prevMessages];
                        newMessages.push({ text: "parar el mensaje", type: "pause" });
                        return newMessages;
                      });
                    } else if (type == "image") {
                      insertMessage({ text, isImage: true, timestamp });
                    } else if (type == "audio") {
                      insertMessage({ text, isAudio: true, timestamp });
                    } else if (type == "online") {
                      insertMessage({ text, isOnline: true, timestamp });
                    } else if (type == "asset") {
                      insertMessage({ text, isAsset: true, timestamp });
                    } else if (type == "viewer") {
                      insertMessage({ text, isViewer: true, timestamp });
                    } else if (type == "doc") {
                      let html = ''
                      if (text.status == 200) {
                        html = text.html
                        text.isAutomate = false

                      } else if (text.status == 201) {
                        const updateMessages = messages.map(message => {
                          if (message.timestamp !== text.timestamp) {
                            return message
                          }
                        }).filter(Boolean)
                        setMessages(updateMessages)
                      } else if (text.status == 202) {
                        const updateMessages = messages.map(message => {
                          if (message.timestamp !== text.timestamp) {
                            return message
                          }
                        }).filter(Boolean)
                        setMessages(updateMessages)
                      }

                      insertMessage({ text, docId: text.id, timestamp });
                    } else if (type == "app") {
                      insertMessage({ text, appId, timestamp });
                    } else if (type == "fn") {
                      if (text && text.status == 500) {
                        const updateMessages = messages.map(message => {
                          if (message.timestamp === text.timestamp) {
                            return {
                              ...message,
                              text: {
                                ...message.text,
                                status: 500
                              }
                            }
                          }
                          return message
                        }).filter(Boolean)
                        setMessages(updateMessages)
                      } else if (text && text.status == 201) {
                        const updateMessages = messages.map(message => {
                          if (message.timestamp !== text.timestamp) {
                            return message
                          }
                        }).filter(Boolean)
                        setMessages(updateMessages)
                      } else if (text && text.status == 202) {
                        const updateMessages = messages.map(message => {
                          if (message.timestamp !== text.timestamp) {
                            return message
                          }
                        }).filter(Boolean)
                        setMessages(updateMessages)
                      }
                    } else if (type == "scraping") {

                      if (text.status == 200) {
                        let arrConversation = []
                        // let updatedConversation = [...textSpeakerScraping.data.conversation]

                        arrConversation[0] = {
                          ...textSpeakerScraping.data.conversation[0],
                          text: textSpeakerScraping.data.conversation[0].text + ' ' + text.name + ' con ' + text.variables.length + ' variables disponibles'
                        }

                        arrConversation[1] = {
                          ...textSpeakerScraping.data.conversation[1],
                          text: textSpeakerScraping.data.conversation[1].text + ' ' + text.description
                        }

                        arrConversation[2] = {
                          ...textSpeakerScraping.data.conversation[2],
                          text: textSpeakerScraping.data.conversation[2].text + ' ' + text.db_name
                        }


                        let updatedText = {
                          status: 200,
                          data: {
                            ...textSpeakerScraping,
                            conversation: arrConversation
                          }
                        }
                        console.log('text scraping', updatedText)


                        insertMessage({ text: updatedText, isScript: true, threadId, scrapId, timestamp });
                        setScrap({
                          name: text.name,
                          description: text.description,
                          db_name: text.db_name,
                          variables: text.variables,
                        })
                        // text = textSpeakerScraping
                        console.log('textSpeakerScraping', textSpeakerScraping)

                      } else {
                        // let text = [{

                        // }]

                      }
                      // insertMessage({ text, scrapId, timestamp });
                    } else if (type == "deliver") {
                      insertMessage({ text, isDeliver: true, timestamp });
                    } else if (type == "gym") {
                      insertMessage({ text, isGym: true, timestamp });
                    } else if (type == "location") {
                      insertMessage({ text, isLocation: true, timestamp });
                    } else if (type == "timer") {
                      insertMessage({ text, isTimer: true, threadId, timestamp });
                    } else if (type == "clock") {
                      insertMessage({ text, isClock: true, threadId, timestamp });
                    } else if (type == "exit-agent") {
                      insertMessage({ text, isExitAgent: true, threadId, timestamp });
                    } else if (type == "coming-soon") {
                      insertMessage({ text, isComingSoon: true, threadId, timestamp });
                    } else if (type == "helper") {
                      insertMessage({ text, isHelper: true, threadId, timestamp });
                    } else {
                      insertMessage({ text, threadId, docId, appId, scrapId, timestamp });
                    }
                  } catch (error) {
                    console.error("Failed to parse JSON:", error);
                  }
                }
              }
            }
          };

          processStream()
            .then(() => { })
            .catch(console.error);

        }

      })
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoadBot(false);
    }
  };


  const handleChat = (action) => {
    console.log('deewsudu', action)
    if (action.id == 0) {
      navigate(`/admin/bot`, { state: { backgroundLocation: location } });
      setUserData({
        Capabilities: [
          {
            webSearch: false,
            dallEImageGeneration: false,
            facturaGPTCodeInterpretor: false,
          },
        ],
        pinned: false,
        tone: 3,
        answer: 3,
      });
      const new_id = uuidv4();
      setChatAgentId(new_id);
      setIdSelectedAgent(null);
    } else if (action.id == 1) {
      navigate(`/admin/home`);
    } else if (action.id == 2) {
      dispatch(setShowModal('newDocument'))
    } else if (action.id == 3 || action.id == 4 || action.id == 5) {
      handleSendMessage({
        text: action.message,
        agentName: selectedAgent?.name
      });
    } else if (action.id == 5) {
    } else if (action.id == 6) {
      navigate(`/admin/help`);
    } else if (action.id !== 0) {

      console.log('action!!', action)
      if (action.file.name) {
        setMessages((prevMessages) => {

          return [
            ...prevMessages, {
              type: "me",
              fileName: action.file.name,
              text: {
              },
            }, {
              type: "bot",
              text: {
                text: `${action.file.name} se ha procesado correctamente`,
                data: action.file.content || []
              },
              isTable: true,
            }]
        });
      } else {
        handleSendMessage({
          text: action.text,
          agentName: selectedAgent?.name,
          agentId: selectedAgent?._id,
          file: action.file
        });
      }
    }

    if (action.type === 'scraping_execute') {
      const messageData = {
        text: action.text,
        agent: action.agent || selectedAgent?.name,
        agentId: action.agentId || selectedAgent?._id,
        file: filePayload,
        scrapingTemplate: action.template
      };
    }
  };

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

  const toggleMenu = () => {
    setMenuOpenChat(!menuOpenChat);
  };



  // Función para restar uno al arrobaCount cuando se borra un @
  const decrementArrobaCount = () => {
    if (arrobaCount > 0) {
      setArrobaCount(arrobaCount - 1)
    }
  }

  // Estado para mantener el backup del inputValue anterior
  const [inputValueBackup, setInputValueBackup] = useState("")

  // useEffect para detectar cuando se borra un @ específicamente
  useEffect(() => {
    // console.log('arrobaCount',arrobaCount)
    // console.log('selectItemCount', selectItemCount)
    // console.log('itemsSelected', itemsSelected)

    // Si el backup tiene más caracteres que el input actual, significa que se borró algo
    if (inputValueBackup.length > inputValue.length) {
      // Encontrar qué caracteres se eliminaron
      const deletedChars = []
      let i = 0
      let j = 0

      while (i < inputValueBackup.length && j < inputValue.length) {
        if (inputValueBackup[i] === inputValue[j]) {
          i++
          j++
        } else {
          // Se encontró un carácter eliminado
          deletedChars.push(inputValueBackup[i])
          i++
        }
      }

      // Agregar los caracteres restantes del backup (si los hay)
      while (i < inputValueBackup.length) {
        deletedChars.push(inputValueBackup[i])
        i++
      }

      // Verificar si entre los caracteres eliminados hay un @
      if (deletedChars.includes('@')) {
        console.log('Se detectó eliminación de @, decrementando arrobaCount')
        // decrementArrobaCount()
      }
    }

    // Actualizar el backup con el valor actual para la próxima comparación
    setInputValueBackup(inputValue)
  }, [inputValue])

  useEffect(() => {
    if (selectedItemActive) {
      setSelectedItemActive(false)
      return
    }
    if (inputValue.includes("@")) {
      // Verificar que empiece con @ Y que tenga espacio antes o sea el primer carácter
      const countArroba = (text) => {
        const parts = text.split(/(@\w*)/);
        let count = 0;
        // console.log("comienza una nueva iteracion")
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          // console.log('part', part)
          // console.log('part.startsWith("@")', part.startsWith('@'))
          // console.log('i === 0', i === 0)
          // console.log('i === 1 && parts[i - 1] === ""', i === 1 && parts[i - 1] === "")
          // console.log('i > 0 && parts[i - 1].endsWith(" ")', i > 0 && parts[i - 1].endsWith(' '))
          // console.log("itemsSelected",itemsSelected)
          if (part.startsWith('@') && (i === 0 || (i === 1 && parts[i - 1] === "") || (i > 0 && parts[i - 1].endsWith(' ')))) {
            count++;
          }
        }
        return count;
      };
      const currentCount = countArroba(inputValue)
      // console.log('selectItemCount', selectItemCount)
      // console.log('itemsSelected', itemsSelected.length)
      if (currentCount < arrobaCount) {
        // Se detectó que se eliminó un @, llamar a la función para decrementar
        // decrementArrobaCount()
        setArrobaCount(arrobaCount)
        //     console.log('currentCount', currentCount)
        //     console.log('arrobaCount', arrobaCount)
        //      console.log('selectItemCount', selectItemCount)
        // console.log('itemsSelected', itemsSelected)
        if (currentCount < selectItemCount) {

          setSelectItemCount(selectItemCount - 1)
          let newItemsSelected = [...itemsSelected]
          newItemsSelected = newItemsSelected.slice(0, -1)
          setItemsSelected([...newItemsSelected])
        }
      }
      setArrobaCount(currentCount)
      if (currentCount > selectItemCount) {
        // console.log('entra en el if')
        setContainsArroba(true)
      } else {
        // console.log('entra en el else')
        setContainsArroba(false)
      }
    } else {
      setSelectItemCount(0)
      setItemsSelected([])
      setContainsArroba(false)
    }


  }, [inputValue])


  useEffect(() => {
    if (emptyChat) {
      if (chatId == emptyChat || emptyChat == "all") setMessages([])
      dispatch(setEmptyChat(false))
    }
  }, [emptyChat])


  useEffect(() => {
    // Solo actualizar mensajes si:
    // 1. No estamos en proceso de actualización manual
    // 2. Es el mismo chat
    // 3. No hay mensajes locales o los mensajes locales están desactualizados
    console.log('si se actualiza desde el useeffect', currentChat.messages)
    if (currentChat?.messages &&

      !isUpdatingMessagesRef.current &&
      // currentChat.id === chatId && en
      (messages.length === 0 || JSON.stringify(messages) !== JSON.stringify(currentChat.messages))) {
      setMessages(currentChat.messages);
    }
  }, [currentChat, chatId]);

  useEffect(() => {
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (chatId) {
      dispatch(fetchByChat({ chatId: chatId }));
    }
  }, [chatId, dispatch]);

  useEffect(() => {

    setAutoClear(currentChat?.autoClear)

  }, [currentChat])

  useEffect(() => {

    setSearchInWeb(currentChat?.searchInWeb)

  }, [currentChat?.searchInWeb])

  useEffect(() => {
    setTokenInput(0)
    setTokenOutput(0)
    setTimeToFinishResponse(0)
  }, [chatId])



  useEffect(() => {

    if (question && location?.state?.typeAutomate) {

      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: Google['help-automate'],
        }
      ])
    }
  }, [location.state, question]);

  useEffect(() => {
    console.log('🚀 Enviando mensaje inicial desde FolderIndicator:', location?.state);
    if (location?.state?.initialMessage && selectedAgent?._id) {

      handleSendMessage({
        text: location.state.initialMessage,
        agentName: selectedAgent?.name,
        agentId: selectedAgent?._id,
        newChat: true
      });

      navigate(location.pathname, { replace: true });
    }
  }, [location?.state?.initialMessage, selectedAgent?._id]);

  // Manejar el transcript enviado desde NavbarAdmin
  useEffect(() => {
    console.log('🎤 Enviando transcript desde NavbarAdmin:', location?.state);
    console.log('🎤 Location state completo:', location);
    console.log('🎤 selectedAgent:', selectedAgent);
    console.log('🎤 agentId de URL:', selectedAgent?._id);
    console.log('🎤 rowId disponible:', location?.state?.rowId);
    console.log('🎤 Ya procesado:', processedTranscriptRef.current);

    if (location?.state?.rowId && selectedAgent?._id && !processedTranscriptRef.current) {
      // Marcar como procesado
      processedTranscriptRef.current = true;

      // Usar el nombre del agente del estado si está disponible, o un valor por defecto
      const agentName = location?.state?.selectedAgentState?.name || selectedAgent?.name || 'Agente';

      console.log('🎤 Ejecutando handleSendMessage con:', {
        text: location.state.rowId,
        agentName: agentName,
        agentId: selectedAgent?._id,
        newChat: true
      });

      handleSendMessage({
        text: location.state.rowId,
        agentName: agentName,
        agentId: selectedAgent?._id,
        newChat: true
      });

      // Limpiar el estado sin navegar
      window.history.replaceState({}, document.title, location.pathname);
    } else {
      console.log('🎤 No se ejecutó handleSendMessage porque:', {
        tieneRowId: !!location?.state?.rowId,
        tieneAgentId: !!selectedAgent?._id,
        yaProcesado: processedTranscriptRef.current,
        rowId: location?.state?.rowId,
        agentId: selectedAgent?._id
      });
    }
  }, [location?.state?.rowId, selectedAgent?._id]);

  // Resetear el ref cuando cambie el agentId
  useEffect(() => {
    processedTranscriptRef.current = false;
  }, [selectedAgent?._id]);


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
    dispatch(getTokens({ id: user?.id?.split("_").pop() }))
  }, [])


  // Determinar si hay scraping activo por el último mensaje con scrapId
  const lastMessageScrapId = messages?.length > 0 ? messages[messages.length - 1]?.scrapId : null;


  const [scrap, setScrap] = useState({
    name: '',
    description: '',
  })

  return (
    <div className={styles.chatSection}>

      <div className={lastMessageScrapId ? styles.chatMainWithRightPanel : styles.chatMainFullWidth}>
        <ChatBody
          insertMessage={insertMessage}
          scrap={scrap}
          setScrap={setScrap}
          itemsSelected={itemsSelected}
          setItemsSelected={setItemsSelected}
          handleSendMessage={handleSendMessage}
          user={user}
          tokens={tokens}
          isLoadBot={isLoadBot}
          windowWidth={windowWidth}
          showReply={showReply}
          setShowReply={setShowReply}
          handleChat={handleChat}
          messages={messages}
          setMessages={setMessages}
          messageContainerRef={messageContainerRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          setIdSelectedAgent={setIdSelectedAgent}
          selectedAgent={selectedAgent}
          userData={userData}
          chatId={chatId}
          autoClear={autoClear}
          setAutoClear={setAutoClear}
          tokenInput={tokenInput}
          tokenOutput={tokenOutput}
          timeToFinishResponse={timeToFinishResponse}
          finishedResponseBot={finishedResponseBot}
          setTokenInput={setTokenInput}
          setTokenOutput={setTokenOutput}
          setTimeToFinishResponse={setTimeToFinishResponse}
          showInfoMessage={showInfoMessage}
          setShowInfoMessage={setShowInfoMessage}
          newChat={newChat}
          searchInWeb={searchInWeb}
          setSearchInWeb={setSearchInWeb}
          setNewChat={setNewChat}
          filePayload={filePayload}
          setFilePayload={setFilePayload}
          setContainsArroba={setContainsArroba}
          containsArroba={containsArroba}
          handleSelectItem={handleSelectItem}
          agentId={agentId}
          currentChat={currentChat}
          setIsPaused={setIsPaused}
          isPaused={isPaused}
          apiUrl={apiUrl}
          chatList={chatList}
          scrapingPanelActive={!!lastMessageScrapId}
          typeChat={typeChat}
        />
      </div>

      {lastMessageScrapId && (
        <ScrapingRightPanel
          agentId={agentId}
          chatId={chatId}
          scrapId={lastMessageScrapId}
          scrap={scrap}
          setScrap={setScrap}
          apiUrl={apiUrl}
          setMessages={setMessages}
          messageContainerRef={messageContainerRef}
          insertMessage={insertMessage}
          onClose={() => {
            // Cerrar: añadimos un mensaje tipo exit-agent para notificar backend y ocultar panel
            handleSendMessage({ text: 'salir', type: 'exit-agent' });
          }}
        />
      )}
      {showNewAgent && (
        <NewAgentComponent
          setShowNewAgent={setShowNewAgent}
          setUserData={setUserData}
          userData={userData}
          chatAgentId={chatAgentId}
        />
      )}

      {showCorporativeModal && (
        <SelectAgentModal
          setState={setShowCorporativeModal}

        />
      )}

    </div>
  );
};

export default ChatView;







const VoiceRecorderWave = forwardRef(({ onSend, onCancel }, ref) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [samples, setSamples] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef([]);
  const animationRef = useRef(null);
  const [visualSamples, setVisualSamples] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hoverBar, setHoverBar] = useState(null);
  const recordingRef = useRef(recording);
  const playingRef = useRef(playing);
  const audioUrlRef = useRef(audioUrl);


  const startRecording = async () => {
    setSamples([]);
    setVisualSamples([]);
    setAudioUrl(null);
    setAudioBlob(null);
    setAudioChunks([]);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
    setRecordingTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      let localChunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) localChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(localChunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setDuration(blob.duration);
      };

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      let lastSampleTime = 0;
      let tempSamples = [];
      let tempMax = 0;
      let startTimestamp = Date.now();

      const capture = () => {
        analyser.getByteTimeDomainData(dataArrayRef.current);

        const max = Math.max(...dataArrayRef.current.map(v => Math.abs(v - 128)));

        const scaled = Math.min(1, max / 64);
        tempMax = Math.max(tempMax, scaled);
        const now = Date.now();
        if (now - lastSampleTime >= 250) {
          tempSamples.push(tempMax);
          setVisualSamples([...tempSamples]);
          tempMax = 0;
          lastSampleTime = now;
        }
        if (mediaRecorder.state === "recording") {
          setRecordingTime(((now - startTimestamp) / 1000));
          animationRef.current = requestAnimationFrame(capture);
        } else {
          setSamples([...tempSamples]);
        }
      };
      mediaRecorder.onstart = () => {
        setRecording(true);
        animationRef.current = requestAnimationFrame(capture);
      };
      mediaRecorder.onstop = () => {
        setRecording(false);
        cancelAnimationFrame(animationRef.current);
        setSamples([...tempSamples]);
        setVisualSamples([...tempSamples]);
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(localChunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
    } catch (err) {
      alert("No se pudo acceder al micrófono");
      setRecording(false);
    }
  };


  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };


  const handleCancel = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setSamples([]);
    setVisualSamples([]);
    setAudioChunks([]);
    setRecording(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (onCancel) onCancel();
  };


  const handlePlay = () => {
    if (!audioUrl) return;
    setPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };
  const handlePause = () => {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {

      if (!isFinite(audio.duration) || audio.duration === 0) {
        const fixDuration = () => {
          if (isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
            audio.removeEventListener('timeupdate', fixDuration);
            audio.currentTime = 0;
          }
        };
        audio.addEventListener('timeupdate', fixDuration);
        audio.currentTime = 1e101;
      } else {
        setDuration(audio.duration);
      }
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [audioUrl]);


  const bars = audioUrl ? samples : visualSamples;

  let currentBar = 0;
  if (audioUrl && duration > 0 && bars.length > 0) {
    currentBar = Math.floor((currentTime / duration) * bars.length);
    if (currentBar < 0) currentBar = 0;
    if (currentBar > bars.length - 1) currentBar = bars.length - 1;
  }


  useEffect(() => {
    let raf;
    if (playing) {
      const update = () => {
        setCurrentTime(audioRef.current.currentTime);
        raf = requestAnimationFrame(update);
      };
      raf = requestAnimationFrame(update);
    }
    return () => raf && cancelAnimationFrame(raf);
  }, [playing]);


  const handleBarClick = (i) => {
    if (!audioRef.current || !duration || !audioUrl) return;
    const newTime = (i / bars.length) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);

    if (!playing) {
      setTimeout(() => setCurrentTime(audioRef.current.currentTime), 10);
    } else {
      setPlaying(true);
      audioRef.current.play();
    }
  };


  const formatTime = (s) => {
    if (!isFinite(s) || isNaN(s) || s < 0) return "00:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    startRecording()
  }, [])
  const audioBlobRef = useRef(null);
  const samplesRef = useRef([]);

  const audioBlobReadyRef = useRef(null);

  useEffect(() => {
    if (audioBlob && audioBlobReadyRef.current) {
      audioBlobReadyRef.current(audioBlob);
      audioBlobReadyRef.current = null;
    }
  }, [audioBlob]);
  useEffect(() => {
    audioBlobRef.current = audioBlob;
    samplesRef.current = samples;
  }, [audioBlob, samples]);


  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);

  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
    handlePlay,
    handlePause,
    handleCancel,
    sendRecording: async () => {

      if (audioBlobRef.current) {
        onSend && onSend({ audioBlob: audioBlobRef.current, samples: samplesRef.current });
        return;
      }


      await new Promise((resolve) => {
        audioBlobReadyRef.current = resolve;
      });

      onSend && onSend({ audioBlob: audioBlobRef.current, samples: samplesRef.current });
    },

    isRecording: () => recordingRef.current,
    isPlaying: () => playingRef.current,
    hasAudio: () => !!audioUrlRef.current,
  }));
  return (
    <div className={styles.chatRecorder}>
      <div className={styles.chatRecorderPlay}>

        <audio ref={audioRef} src={audioUrl || undefined} style={{ display: "none" }} />
      </div>
      <div className={styles.chatRecorderBars}>
        {bars.map((amp, i) => {
          let color = "#bbb";
          if (audioUrl && duration > 0 && i <= currentBar) color = "rgb(16 163 127)";
          if (hoverBar === i) color = "#81c784";
          return (
            <div
              key={i}
              style={{
                width: 6,
                height: Math.max(amp * 40, 4),
                background: color,
                borderRadius: 2,
                transition: "background 0.1s, height 0.1s",
              }}
              onClick={() => handleBarClick(i)}
              onMouseEnter={() => setHoverBar(i)}
              onMouseLeave={() => setHoverBar(null)}
            />
          );
        })}
      </div>
      <div className={styles.chatRecorderBarsBar}>
        {recording && !audioUrl && (
          <span>{formatTime(recordingTime)}</span>
        )}
        {audioUrl && (
          <span style={{ marginLeft: 8 }}>
            {formatTime(currentTime)} / {formatTime(isFinite(duration) && !isNaN(duration) && duration > 0 ? duration : (audioRef.current && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration) && audioRef.current.duration > 0 ? audioRef.current.duration : 0))}
          </span>
        )}
      </div>
    </div>
  );
});




