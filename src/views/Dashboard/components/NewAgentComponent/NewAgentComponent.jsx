import React, { useState, useEffect, useRef } from "react";
import { apiUrl } from "../../../../apiBackend";
import HeaderCard from "../HeaderCard/HeaderCard";
import dataCodes from "./codes.json";
import Button from "../Button/Button";
import EditableInput from "../AccountSettings/EditableInput/EditableInput";
import DropdownFlags from "../GeneralSettings/components/DropdownFlags/DropdownFlags";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import styles from "./NewAgentComponent.module.css";
import { AutomateDataComponent } from "../Automate/utils/automatesJson";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { ReactComponent as MoreCasualGreenIcon } from "../../assets/MoreCasualGreenIcon.svg";
import { ReactComponent as MoreFormalGreenIcon } from "../../assets/MoreFormalGreenIcon.svg";
import { ReactComponent as NotificationSoundActive } from "../../assets/NotificationSoundActive.svg";
import { ReactComponent as NotificationSoundDisabled } from "../../assets/NotificationSoundDisabled.svg";
import { v4 as uuidv4 } from "uuid";
import ImageEmpty from "../../assets/ImageEmpty.svg";
import { ReactComponent as SearchGray } from "../../assets/searchGray.svg";
import { ReactComponent as LanguageIcon } from "../../assets/LanguageIcon.svg";
import { ReactComponent as ConnectedAppsSettingIcon } from "../../assets/ConnectedAppsSettingIcon.svg";
import { ReactComponent as PlayIcon } from "../../assets/PlayIcon.svg";
import { ReactComponent as Pencil } from "../../assets/pencilEdit.svg";
import { ReactComponent as ClosedEyeIcon } from "../../assets/ClosedEyeIcon.svg";
import { ReactComponent as WorldIcon } from "../../assets/WorldIcon.svg";
import { ReactComponent as Padlock } from "../../assets/PadlockOutlineIcon.svg";
import ScheduledResponses from "./ScheduledResponses/ScheduledResponses";
import { ChatBody } from "../../screens/ChatView/ChatView";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAgents } from "../../../../actions/agents";
import CorporativeModalText from "../CorporativeModalText/CorporativeModalText";
import {
  createAgent,
  deleteAgent,
  deleteChatAgent,
  fetchByChat,
  fetchByMenu,
  getAgentById,
  getChatAgents,
  getImagesAgents,
  updateAgent,
} from "../../../../actions/chat";
import { useTranslation } from "react-i18next";
import { setSelectedAgentSlice } from "../../../../slices/agentSlices";
import CheckboxWithText from "../CheckboxWithText/CheckboxWithText";
import InputWithTitle from "../InputWithTitle/InputWithTitle";
import Title from "./Ttitle";
import Tab from "./Tab";
import SliderRangeControl, {
  SliderRangeControlWithoutButtons,
} from "./SliderRangeControl/SliderRangeControl";
import OptionsSwitchComponent from "../OptionsSwichComponent/OptionsSwitchComponent";
import NavigationPopups from "../NavigationPopups/NavigationPopups";
import KnowledgeAndSkills from "./KnowledgeAndSkills/KnowledgeAndSkills";
import Instructions from "./Instructions/Instructions";
import { languageFlags } from "../../../../utils/flags";
import { getVariable } from "../../../../actions/user";
import AddDiscount from "../AddDiscount/AddDiscount";


const NewAgentComponent = ({
  setShowNewAgent,
  userData,
  setUserData,
  chatAgentId,
  setSelectedAgent,
}) => {
  const data = AutomateDataComponent();
  const [t] = useTranslation("ChatView");
  const [showTestAgent, setShowTestAgent] = useState(false);
  const [tempInstruction, setTempInstruction] = useState("");
  const [language, setlanguage] = useState("");
  const [filePayload, setFilePayload] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [discountState, setDiscountState] = useState(false);
  const [isAnimatingModal, setIsAnimatingModal] = useState(false);
  const [retention, setRetention] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoadBot, setIsLoadBot] = useState(false);
  const { id } = useParams();
  const [localAgentId, setLocalAgentId] = useState(null);
  const [localAgent, setLocalAgent] = useState(
    userData
      ? userData
      : {
          Capabilities: [],
          pinned: false,
          tone: 50,
          answer: 50,
          workspaces: [],
          type: "private",
          typePay: "singlePayment",
        }
  );
  const { agents, fatherNewAgent, idFatherNewAgent } = useSelector(
    (state) => state.agents
  );
  const { selectedAgent, searchTerm: searchTermState } = useSelector(
    (state) => state.chat
  );

  const [idSelectedAgent, setIdSelectedAgent] = useState(null);

  const [allFiles, setAllFiles] = useState(false);

  const [contactData, setContactData] = useState({
    contactName: "",
    companyEmail: "",
    companyPhoneNumber: [],
    codeCountry: "",
    webSite: "",
    billingEmail: "",
    contactZ: "",
    country: "",
    contactCif: "",
    preferredCurrency: "",
    cardNumber: "",
    companyAddress: "",
    companyCity: "",
    companyProvince: "",
    companyCountry: "",
    infoBill: [],
    paymethod: [],
    parameters: [],
    selectedtags: [],
    image: "",
  });
  const [editingIndices, setEditingIndices] = useState([]);
  const [showCreateParameter, setShowCreateParameter] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    idSelectedAgent ? setLocalAgentId(idSelectedAgent) : setLocalAgentId(id);
    if (!agents.length > 0) {
      const fn = async () => {
        let agents = await dispatch(getAgents({}));
        agents.payload;

        if (
          agents.payload &&
          agents.payload.agents &&
          Array.isArray(agents.payload.agents)
        ) {
          if (idSelectedAgent || id) {
            const selectedAgent = idSelectedAgent
              ? agents.payload.agents.find(
                  (agent) => agent._id === idSelectedAgent
                )
              : agents.payload.agents.find((agent) => agent._id === id);

            if (selectedAgent) {
              setLocalAgent(selectedAgent);
            }
          }
        }
      };
      fn();
    }

    if (agents && agents.agents && Array.isArray(agents.agents)) {
      if (idSelectedAgent || id) {
        const selectedAgent = idSelectedAgent
          ? agents.agents.find((agent) => agent._id === idSelectedAgent)
          : agents.agents.find((agent) => agent._id === id);

        if (selectedAgent) {
          setLocalAgent(selectedAgent);
        }
      }
    }
  }, []);

  const [searchStatus, setSearchStatus] = useState(null);

  useEffect(() => {
    if (localAgent._id) {
      dispatch(fetchByChat({ chatId: localAgent._id }));
    }
  }, [dispatch, localAgent._id]);

  const [tempCapabilities, setTempCapabilities] = useState({
    webSearch: false,
    dallEImageGeneration: false,
    facturaGPTCodeInterpretor: false,
  });

  useEffect(() => {
    if (localAgent.Capabilities && localAgent.Capabilities.length > 0) {
      setTempCapabilities({
        webSearch: localAgent.Capabilities[0]?.webSearch || false,
        dallEImageGeneration:
          localAgent.Capabilities[0]?.dallEImageGeneration || false,
        facturaGPTCodeInterpretor:
          localAgent.Capabilities[0]?.facturaGPTCodeInterpretor || false,
      });
    }
  }, [localAgent]);

  const handleChange = ({ name, newValue }) => {
    if (
      name === "webSearch" ||
      name === "dallEImageGeneration" ||
      name === "facturaGPTCodeInterpretor"
    ) {
      const updatedData = {
        ...localAgent,
        Capabilities: [...localAgent.Capabilities, { [name]: newValue }],
        [name]: newValue,
      };
      setLocalAgent(updatedData);
    } else {
      const updatedData = { ...localAgent, [name]: newValue };
      setLocalAgent(updatedData);
    }
  };

  const handleSelectLanguage = (selectedLanguage) => {
    setlanguage(selectedLanguage);
    setLocalAgent((prevUserData) => ({
      ...prevUserData,
      selectedLanguage: selectedLanguage,
    }));
  };

  const handleEnterPress = () => {
    if (tempInstruction.trim() !== "") {
      const instructionExists =
        localAgent.instructions?.includes(tempInstruction);

      if (!instructionExists) {
        setLocalAgent((prev) => ({
          ...prev,
          instructions: [...(prev.instructions || []), tempInstruction],
        }));
      }
      setTempInstruction("");
    }
  };
  const handleModelChange = (selectedModel) => {
    setLocalAgent((prevUserData) => ({
      ...prevUserData,
      aiModel: selectedModel,
    }));
  };
  const { agentId, chatId } = useParams();

  const [isPaused, setIsPaused] = useState(false);

  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const [autoClear, setAutoClear] = useState(false);
  const [searchInWeb, setSearchInWeb] = useState(false);
  const [showReply, setShowReply] = useState({});
  const [tokenInput, setTokenInput] = useState(0);
  const [tokenOutput, setTokenOutput] = useState(0);
  const [timeToFinishResponse, setTimeToFinishResponse] = useState(0);
  const [finishedResponseBot, setFinishedResponseBot] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(false);

  const readerMessageRef = useRef(null);

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
      setShowReply({});
      setIsLoadBot(true);
      setFinishedResponseBot(false);

      if (autoClear && type !== "fn") {
        setMessages([]);
      }


      if (type !== "fn" && (text || showReply?.timestamp || record)) {
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

          return newMessages;
        });

        setInputValue("");
      }

      const userStorage = localStorage.getItem("user");

      const userJson = JSON.parse(userStorage);
      const token = userJson.accessToken;
      const new_id = uuidv4();
      let selectedChat;

      if (!chatId) selectedChat = `agentConfiguration${selectedAgent._id}`;
      else selectedChat = chatId;

      let threadId = null;
      let docId = null;
      let appId = null;
      let scrapId = null;

      if (newChat) {
        // setMessages("");
      } else {
        const lastMessage = messages[messages.length - 1];
        threadId = lastMessage?.threadId || null;
        docId = lastMessage?.docId || null;
        appId = lastMessage?.appId || null;
        scrapId = lastMessage?.scrapId || null;
      }

      const startTime = Date.now();
      await fetch(
        `${apiUrl}/api/chat/${selectedAgent._id}/${selectedChat}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            text: text,
            file: file,
            ...(timestamp && { timestamp: timestamp }),
            ...(type && { type: type }),
            ...(record && { record: record }),
            ...(isRAG && { isRAG: isRAG }),
            ...(showReply.timestamp && { replyId: showReply }),
            typeChat: "agentConfiguration",
          }),
          headers: {
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => {
        if (response.ok) {
          readerMessageRef.current = response.body.getReader();

          const decoder = new TextDecoder();
          let accumulatedChunks = "";
          let accumulatedText = "";

          const insertMessage = ({
            text,
            timestamp,
            threadId,
            docId,
            appId,
            scrapId,
            replyId,
            isRecord,
            isGraph,
            isApi,
            isAction,
            isTable,
            isAutomate,
            isAsset,
            isImage,
            isAudio,
            isOnline,
            isViewer,
          }) => {
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];

              if (
                appId ||
                docId ||
                isRAG ||
                isAction ||
                isTable ||
                isAutomate ||
                isAsset ||
                isImage ||
                isAudio ||
                isOnline ||
                isGraph ||
                isApi ||
                isViewer
              ) {
                accumulatedText = text;
              } else {
                accumulatedText += text;
              }

              if (
                newMessages.length > 0 &&
                newMessages[newMessages.length - 1].type === "bot"
              ) {
                newMessages[newMessages.length - 1].text = accumulatedText;
                isRecord &&
                  (newMessages[newMessages.length - 1].isRecord = isRecord);
                isGraph &&
                  (newMessages[newMessages.length - 1].isGraph = isGraph);
                isApi && (newMessages[newMessages.length - 1].isApi = isApi);
                isAction &&
                  (newMessages[newMessages.length - 1].isAction = isAction);
                isTable &&
                  (newMessages[newMessages.length - 1].isTable = isTable);
                isAutomate &&
                  (newMessages[newMessages.length - 1].isAutomate = isAutomate);
                isAsset &&
                  (newMessages[newMessages.length - 1].isAsset = isAsset);
                isImage &&
                  (newMessages[newMessages.length - 1].isImage = isImage);
                isAudio &&
                  (newMessages[newMessages.length - 1].isAudio = isAudio);
                isOnline &&
                  (newMessages[newMessages.length - 1].isOnline = isOnline);
                isViewer &&
                  (newMessages[newMessages.length - 1].isViewer = isViewer);
                isRAG && (newMessages[newMessages.length - 1].isRAG = isRAG);
                threadId &&
                  (newMessages[newMessages.length - 1].threadId = threadId);
                replyId &&
                  (newMessages[newMessages.length - 1].replyId = replyId);
                docId && (newMessages[newMessages.length - 1].docId = docId);
                appId && (newMessages[newMessages.length - 1].appId = appId);
                scrapId &&
                  (newMessages[newMessages.length - 1].scrapId = scrapId);
              } else {
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
                  ...(docId && { docId: docId }),
                  ...(appId && { appId: appId }),
                  ...(scrapId && { scrapId: scrapId }),
                  ...(replyId && { replyId: replyId }),
                });
              }
              return newMessages;
            });
          };

          const processStream = async () => {
            while (true) {
              if (isPausedRef.current) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                continue;
              }

              const { done, value } = await readerMessageRef.current.read();
              if (done) {
                setFinishedResponseBot(true);
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
                    const {
                      text,
                      type,
                      threadId,
                      docId,
                      appId,
                      streamId,
                      timestamp,
                    } = chunk.data;
                    setTokenOutput(
                      (prev) =>
                        Number(prev || 0) + Number(chunk?.data?.output.token)
                    );

       
                    setShowInfoMessage(true);

                    const firstBackendResponseTime = Date.now();
                    const timeDiffMs = firstBackendResponseTime - startTime;

                    setTimeToFinishResponse(timeDiffMs);

                    if (type === "graph") {
                      let mermaidCode = "";

                      const corporateColors = {
                        primary: "green",
                        secondary: "teal",
                        accent: "darkgreen",
                        light: "lightgreen",
                        dark: "darkgreen",
                        neutral: "grey",
                      };

                      switch (text.style) {
                        case "pie":
                          mermaidCode = `pie
                                  title "${text.data.title || "Distribución"}"
                                  ${text.data.slices
                                    .map(
                                      (slice) =>
                                        `"${slice.label}" : ${slice.value}`
                                    )
                                    .join("\n")}`;
                          break;

                        case "bar":
                          mermaidCode = `xychart-beta
                                  title "${text.data.title || "Valores"}"
                                  x-axis [${text.data.bars.map((bar) => `"${bar.label}"`).join(", ")}]
                                  y-axis "Valores" 0 --> ${Math.max(...text.data.bars.map((bar) => bar.value))}
                                  bar [${text.data.bars.map((bar) => bar.value).join(", ")}]`;
                          break;

                        case "flow":
                          mermaidCode = `flowchart TD
                                  ${text.data.nodes
                                    .map(
                                      (node) => `${node.id}["${node.label}"]`
                                    )
                                    .join("\n")}
                                  ${text.data.edges
                                    .map(
                                      (edge) => `${edge.from} --> ${edge.to}`
                                    )
                                    .join("\n")}`;
                          break;

                        case "sequence":
                          mermaidCode = `sequenceDiagram
                                  participant A as "${text.data.participants[0]}"
                                  participant B as "${text.data.participants[1]}"
                                  ${text.data.messages
                                    .map(
                                      (msg) =>
                                        `${msg.from}->>+${msg.to}: ${msg.text}`
                                    )
                                    .join("\n")}`;
                          break;

                        default:
                          mermaidCode = `pie
                                  title "Sin datos"
                                  "Sin datos" : 100`;
                      }

                      const graphId = `mermaid-${Date.now()}`;

                      try {
                        const { svg } = await mermaid.render(
                          graphId,
                          mermaidCode
                        );

                        insertMessage({
                          text: `<div class="${styles.mermaidGraph}">${svg}</div>`,
                          isGraph: true,
                          threadId,
                          timestamp,
                        });
                      } catch (mermaidError) {
                        console.error(
                          "Error renderizando gráfico:",
                          mermaidError
                        );
                        insertMessage({
                          text: `Error en el gráfico`,
                          threadId,
                          timestamp,
                        });
                      }
                    } else if (type == "table") {
                      insertMessage({
                        text,
                        isTable: true,
                        threadId,
                        timestamp,
                      });
                    } else if (type === "automate") {
                      insertMessage({
                        text,
                        isAutomate: true,
                        threadId,
                        timestamp,
                      });
                    } else if (type === "api") {
                      insertMessage({
                        text,
                        isApi: true,
                        threadId,
                        timestamp,
                        url: text.url,
                      });
                    } else if (type == "voice") {
                      insertMessage({
                        text,
                        isVoice: true,
                        threadId,
                        timestamp,
                      });
                      const texto = new SpeechSynthesisUtterance(text);
                      texto.lang = "es-ES";
                      window.speechSynthesis.speak(texto);
                    } else if (type == "action") {
                      insertMessage({
                        text,
                        isAction: true,
                        threadId,
                        timestamp,
                      });
                    } else if (type == "pause") {
                      setMessages((prevMessages) => {
                        const newMessages = [...prevMessages];
                        newMessages.push({
                          text: "parar el mensaje",
                          type: "pause",
                        });
                        return newMessages;
                      });
                    } else if (type == "image") {
                      insertMessage({
                        text,
                        isImage: true,
                        threadId,
                        timestamp,
                      });
                    } else if (type == "audio") {
                      insertMessage({
                        text,
                        isAudio: true,
                        threadId,
                        timestamp,
                      });
                    } else if (type == "online") {
                      insertMessage({
                        text,
                        isOnline: true,
                        threadId,
                        timestamp,
                      });
                    } else if (type == "asset") {
                      insertMessage({
                        text,
                        isAsset: true,
                        threadId,
                        timestamp,
                      });
                    } else if (type == "viewer") {
                      insertMessage({
                        text,
                        isViewer: true,
                        threadId,
                        timestamp,
                      });
                    } else if (type == "doc") {
                      let html = "";
                      if (text.status == 200) {
                        html = text.html;
                        text.isAutomate = false;
                      } else if (text.status == 201) {
                        const updateMessages = messages
                          .map((message) => {
                            if (message.timestamp !== text.timestamp) {
                              return message;
                            }
                          })
                          .filter(Boolean);
                        setMessages(updateMessages);
                      } else if (text.status == 202) {
                        const updateMessages = messages
                          .map((message) => {
                            if (message.timestamp !== text.timestamp) {
                              return message;
                            }
                          })
                          .filter(Boolean);
                        setMessages(updateMessages);
                      }

                      insertMessage({ text, docId: text.id, timestamp });
                    } else if (type == "app") {
                      insertMessage({ text, appId, timestamp });
                    } else if (type == "fn") {
                      if (text && text.status == 500) {
                        const updateMessages = messages
                          .map((message) => {
                            if (message.timestamp === text.timestamp) {
                              return {
                                ...message,
                                text: {
                                  ...message.text,
                                  status: 500,
                                },
                              };
                            }
                            return message;
                          })
                          .filter(Boolean);
                        setMessages(updateMessages);
                      } else if (text && text.status == 201) {
                        const updateMessages = messages
                          .map((message) => {
                            if (message.timestamp !== text.timestamp) {
                              return message;
                            }
                          })
                          .filter(Boolean);
                        setMessages(updateMessages);
                      } else if (text && text.status == 202) {
                        const updateMessages = messages
                          .map((message) => {
                            if (message.timestamp !== text.timestamp) {
                              return message;
                            }
                          })
                          .filter(Boolean);
                        setMessages(updateMessages);
                      }
                    } else if (type == "scraping") {
                      insertMessage({ text, scrapId, timestamp });
                    } else {
                      insertMessage({
                        text,
                        threadId,
                        docId,
                        appId,
                        timestamp,
                      });
                    }
                  } catch (error) {
                    console.error("Failed to parse JSON:", error);
                  }
                }
              }
            }
          };

          processStream()
            .then(() => {})
            .catch(console.error);
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoadBot(false);
    }
  };

  const handleChat = (action) => {
    handleSendMessage({
      text: action.text,
      agentName: localAgent?.name,
      agentId: localAgent?._id,
      file: action.file,
    });
  };

  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [isTokenValid, setIsTokenValid] = useState(false);

  const handleCheckboxChange = (name, newValue) => {
    setTempCapabilities((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const [showCorporativeModal, setShowCorporativeModal] = useState(false);
  const [corporativeTitle, setCorporativeTitle] = useState("");
  const [corporativeMessage, setCorporativeMessage] = useState("");
  const handleCreateAgent = async () => {
    if (localAgent.name == "" || localAgent.name == undefined) {
      setShowCorporativeModal(true);
      setCorporativeTitle(t("nameIsRequiredForAgent"));
      setCorporativeMessage(t("enterValidName"));

      return;
    }

    const updatedUserData = {
      ...localAgent,
      Capabilities: [tempCapabilities],
      chatId: chatAgentId,
    };

    if (localAgentId) {
      await dispatch(
        updateAgent({ agentId: localAgentId, agentData: updatedUserData })
      );
    } else {
      const responseCreateAgent = await dispatch(
        createAgent({ userData: updatedUserData })
      );

      dispatch(
        setSelectedAgentSlice({
          _id: responseCreateAgent?.payload?.agent._id,
          img: responseCreateAgent?.payload?.agent.img,
          name: responseCreateAgent?.payload?.agent.name,
          pinned: responseCreateAgent?.payload?.agent.pinned,
          instructions: responseCreateAgent?.payload?.agent.instructions,
        })
      );
      await dispatch(getAgents({}));
      navigate(`/admin/chat/${responseCreateAgent.payload.agent._id}`);
    }
   await dispatch(getAgents({}));
  };

  useEffect(() => {
    if (localAgentId) {
      const fetchAgentData = async () => {
        dispatch(getAgentById({ localAgentId, setUserData, setlanguage }));

        const responseImage = await dispatch(
          getImagesAgents({ agentIds: localAgentId })
        );

        const agentImage = responseImage.payload.images[0].image;

        if (agentImage) {
          setLocalAgent((prevData) => ({
            ...prevData,
            image: agentImage,
          }));
        }
      };

      fetchAgentData();
    }
  }, [localAgentId, localAgent._id]);

  const { userAutomations } = useSelector((state) => state.automate);

  const filteredData = userAutomations.filter((item) => {
    return true;
  });

  const handleConnectApp = (app) => {
    setLocalAgent((prevUserData) => ({
      ...prevUserData,
      connectedApps: [...(prevUserData.connectedApps || []), app],
    }));
  };
  const [editLanguage, setEditLanguage] = useState(false);
  const [editCode, setEditCode] = useState(false);
  const [editInstructions, setEditInstructions] = useState(false);
  const [editAIModel, setEditAIModel] = useState(false);
  const { currentChat, loading } = useSelector((state) => state.chat);
  useEffect(() => {
    const search = async () => {
      const res = await dispatch(
        getChatAgents({ agentName: localAgent._id, type: "agentConfiguration" })
      );
      setMessages(res?.payload?.messages || []);
    };
    search();
  }, [localAgent._id]);

  const handleDelete = async () => {
    await dispatch(
      deleteAgent({
        agentId: localAgent._id,
      })
    );

    setShowNewAgent
      ? setShowNewAgent(false)
      : fatherNewAgent === "chat"
        ? navigate(`/admin/chat`)
        : navigate(`/admin/chat/${id}`);
    setSelectedAgent && setSelectedAgent(null);
    dispatch(getAgents({}));
  };

  const handleRestart = async () => {
    await dispatch(
      deleteChatAgent({
        name: localAgent.name,
      })
    );
    setMessages([]);
    dispatch(getAgents({}));
  };

  const handleContactData = (field, value) => {
    const formattedValue =
      field === "cardNumber" ? formatCardNumber(value) : value;

    setLocalAgent((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const verifyCode = () => {
    const foundItem = dataCodes.find((item) => item.code === inputCode);

    if (foundItem) {
      setLocalAgent((prev) => ({
        ...prev,
        inputCode: foundItem,
      }));
      setSearchStatus("success");
    } else {
      setLocalAgent((prev) => ({
        ...prev,
        inputCode: null,
      }));
      setSearchStatus("error");
    }
  };

  const [initialAgent, setInitialAgent] = useState(null);
  const [hasAgentChanged, setHasAgentChanged] = useState(false);

  useEffect(() => {
    if (localAgent?.name && !initialAgent) {
      setInitialAgent(localAgent);
    }
  }, [localAgent, initialAgent]);

  useEffect(() => {
    if (initialAgent && localAgent) {
      const hasChanged =
        JSON.stringify(localAgent) !== JSON.stringify(initialAgent);
      setHasAgentChanged(hasChanged);
    }
  }, [localAgent, initialAgent]);

  const valueToPercentage = (value) => {
    return ((value - 1) / 4) * 100;
  };

  const percentageToValue = (percentage) => {
    return Math.round((percentage / 100) * 4) + 1;
  };

  const handleExit = () => {
    const shouldCloseOnly = !!setShowNewAgent;
    if (shouldCloseOnly) {
      setShowNewAgent(false);
    } else {
      const routes = {
        chat: `/admin/chat`,
        contacts: `/admin/contacts`,
        assets: `/admin/assets`,
        notification: `/admin/notification`,
        panel: `/admin/panel/${idFatherNewAgent}`,
        accounts: `/admin/accounts`,
        home: `/admin/home`,
      };
      console.log('cerrandooo',shouldCloseOnly)
      console.log('cerrandooo fatherNewAgent',fatherNewAgent)
      const route = routes[fatherNewAgent] || `/admin/chat/${id}`;
      navigate(route);
    }

    setInitialAgent(null);
  };

  const handleSaveOrUpdate = () => {
    handleCreateAgent();
    setInitialAgent(null);
  };

  const [containsArroba, setContainsArroba] = useState(null);
  const [arrobaCount, setArrobaCount] = useState(0);
  const [selectItemCount, setSelectItemCount] = useState(0);
  const [showMiniProfileModal, setShowMiniProfileModal] = useState();
  const [itemsSelected, setItemsSelected] = useState([]);

  const { rowId, selectedAgentState } = location.state || {};

  useEffect(() => {
    if (inputValue.includes("@")) {
      const countArroba = (text) => text.split("@").length - 1;
      const currentCount = countArroba(inputValue);
      if (currentCount < arrobaCount) {
        setSelectItemCount(selectItemCount - 1);
        setArrobaCount(arrobaCount);
        let newItemsSelected = [...itemsSelected];
        newItemsSelected = newItemsSelected.slice(0, -1);
        setItemsSelected([...newItemsSelected]);
      }
      setArrobaCount(currentCount);
      if (currentCount > selectItemCount) {
        setContainsArroba(true);
      } else setContainsArroba(false);
    } else {
      setSelectItemCount(0);
      setItemsSelected([]);
      setContainsArroba(false);
    }
  }, [inputValue]);

  const handleSelectItem = (item) => {
    const prev = inputValue.split("@").slice(0, -1).join("@");
    setInputValue(
      `${prev}@${item.name ? item.name : item.contactName ? item.contactName : "not found"}`
    );
    setSelectItemCount(selectItemCount + 1);
    setItemsSelected([...itemsSelected, item]);
  };

  const parseText = (text) => {
    const regex = /(@\w+)/g;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span
            onMouseEnter={() => {
              if (part != "@not" && !containsArroba)
                setShowMiniProfileModal((index + 1) / 2 - 1);
            }}
            onMouseLeave={() => setShowMiniProfileModal(false)}
            key={index}
            className={styles.mentionWrapper}
          >
            <span
              key={index}
              className={styles.arrobaText}
              onClick={() => {
                if (part != "@not" && !containsArroba) {
                  if ("name" in itemsSelected[(index + 1) / 2 - 1]) {
                    dispatch(setAsset(itemsSelected[(index + 1) / 2 - 1]));
                    navigate(
                      `/admin/assets/${itemsSelected[(index + 1) / 2 - 1]._id}`,
                      { state: { backgroundLocation: location } }
                    );
                  } else if (
                    "contactName" in itemsSelected[(index + 1) / 2 - 1]
                  ) {
                    dispatch(setContact(itemsSelected[(index + 1) / 2 - 1]));
                    navigate(
                      `/admin/contacts/${itemsSelected[(index + 1) / 2 - 1]._id}`,
                      { state: { backgroundLocation: location } }
                    );
                  }
                }
              }}
            >
              {part}
            </span>
            {showMiniProfileModal === (index + 1) / 2 - 1 && (
              <MiniProfileModal
                item={itemsSelected[(index + 1) / 2 - 1]}
                showMiniProfileModal={showMiniProfileModal}
                index={(index + 1) / 2 - 1}
                name={
                  itemsSelected[(index + 1) / 2 - 1]?.name
                    ? itemsSelected[(index + 1) / 2 - 1].name
                    : itemsSelected[(index + 1) / 2 - 1]?.contactName
                      ? itemsSelected[(index + 1) / 2 - 1].contactName
                      : ""
                }
                email={
                  itemsSelected[(index + 1) / 2 - 1]?.companyEmail
                    ? itemsSelected[(index + 1) / 2 - 1].companyEmail
                    : itemsSelected[(index + 1) / 2 - 1]?.description
                      ? itemsSelected[(index + 1) / 2 - 1].description
                      : ""
                }
                imageUrl={
                  itemsSelected[(index + 1) / 2 - 1]?.image
                    ? itemsSelected[(index + 1) / 2 - 1].image
                    : ImageEmpty
                }
              />
            )}
          </span>
        );
      }
      return part;
    });
  };

  const [seeResponses, setSeeResponses] = useState(false);
  const handleAddScheduledResponse = () => {
    const newEntry = {
      id: Date.now(),
      title: "",
      entries: [
        {
          question: "",
          responses: [""],
        },
      ],
      frequency: "",
    };
    setLocalAgent((prev) => ({
      ...prev,
      scheduledResponses: [...(prev.scheduledResponses || []), newEntry],
    }));
    setSeeResponses(true);
  };

  const variables = useSelector((state) => state.variables.variables);
  useEffect(() => {
    dispatch(getVariable({ type: "category" }));
  }, []);

  const handleDiscountQuantityChange = (newDiscountQuantity) => {
    setLocalAgent((prev) => ({
      ...prev,
      DiscountQuantity: newDiscountQuantity.quantity,
    }));
  };
  const soundFiles = {
    sound1: "/Ringtones/sound1.mp3", 
    sound2: "/Ringtones/sound2.mp3", 
    sound3: "/Ringtones/sound3.mp3", 
  };

  const audioRef = useRef(null);

  const handleTestSound = () => {
    const selectedSound = localAgent?.selectedSound;

    if (!selectedSound || !soundFiles[selectedSound]) {
      console.warn("Sonido no encontrado:", selectedSound);
      return;
    }

    const src = soundFiles[selectedSound];

    if (audioRef.current) {
      if (audioRef.current.paused) {
        if (audioRef.current.src !== src) {
          audioRef.current.src = src;
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.error("Error al reproducir el sonido:", error);
        });
      } else {
        audioRef.current.pause();
      }
    } else {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.play().catch((error) => {
        console.error("Error al reproducir el sonido:", error);
      });
    }
  };
  return (
    <>
      <ModalBlackBgTemplate close={handleExit}>
        <HeaderCard
          fatherNewAgent={fatherNewAgent}
          father="newAgent"
          setState={handleExit}
          title={t("newAgent")}
        >
          <Button type="white" action={handleExit}>
            {t("cancel")}
          </Button>
          {(!localAgentId || (localAgentId && hasAgentChanged)) && (
            <Button action={handleSaveOrUpdate}>
              {localAgentId ? t("update") : t("save")}
            </Button>
          )}
        </HeaderCard>

        <div className={styles.NewAgentContainer}>
          <div className={styles.leftSide}>
            <NavigationPopups
              type={"agent"}
              setParameters={setLocalAgent}
              parameters={localAgent.scheduledResponses}
              data={localAgent}
              text={t("agent")}
              setShowTestAgent={setShowTestAgent}
              handleAddScheduledResponse={handleAddScheduledResponse}
              setImage={handleContactData}
            />
          </div>

          <div className={styles.infoAgentSection} id="scrollContainer">
            <div className={styles.tabsSection}>
              <div className={styles.content}>
                <Title
                  value={t("generalInformation")}
                  id={"generalInformation"}
                />

                <div className={styles.newAgentSection}>
                 
                  <EditableInput
                    label={t("name")}
                    placeholder={t("nameYourGpt")}
                    value={localAgent?.name || ""}
                    name={"name"}
                    onSave={(value) => {
                      setLocalAgent((prev) => ({
                        ...prev,
                        name: value.newValue,
                      }));
                    }}
                    labelClassName={styles.labelName}
                    textareaInputClassname={styles.textareaEditableInput}
                  />
                  <EditableInput
                    label={t("description")}
                    placeholder={t("addDescription")}
                    isTextarea={true}
                    value={localAgent?.description || ""}
                    name={"description"}
                    onSave={(value) => {
                      setLocalAgent((prev) => ({
                        ...prev,
                        description: value.newValue,
                      }));
                    }}
                    limit={500}
                    showLimit={true}
                    labelClassName={styles.labelName}
                    textareaInputClassname={styles.textareaEditableInput}
                  />

               
                  <InputWithTitle
                    bgColor="var(--f4-background)"
                    titleColor="var(--_18181b-color)"
                    placeholder={t("addShortCode")}
                    textStyles={{
                      display: "flex",
                      gap: "5px",
                      fontWeight: 500,
                      color: "var(--black-color)",

                      userSelect: "none",
                    }}
                    inputHeight="31px"
                    title={`# ${t("uploadDocumentation")}`}
                    onChange={(e) =>
                      setLocalAgent((prev) => ({
                        ...prev,
                        codeDocumentation: e.target.value,
                      }))
                    }
                    value={localAgent.codeDocumentation}
                  />

                  <p className={styles.subTitle}>{t("aiModel")}</p>

                  <CustomDropdown
                    placeholder={
                      <>
                        <LanguageIcon
                          className={styles.detectAutomaticallyIcon}
                        />
                        {t("detectAutomatically")}
                      </>
                    }
                    options={languageFlags.map((item) => item.text)}
                    selectedOption={localAgent?.language}
                    height="31px"
                    textStyles={{
                      display: "flex",
                      fontWeight: 300,

                      userSelect: "none",
                    }}
                    setSelectedOption={(selected) =>
                      setLocalAgent((prev) => ({
                        ...prev,
                        language: selected,
                      }))
                    }
                  />

                  <div className={styles.headerNotificationSound}>
                    <p className={styles.subTitle}>{t("notificationSound")}</p>

                    <div className={styles.notificationSoundSelect}>
                      {localAgent?.notificationSound ? (
                        <NotificationSoundActive />
                      ) : (
                        <NotificationSoundDisabled />
                      )}
                      <OptionsSwitchComponent
                        border="none"
                        marginLeft="auto"
                        isChecked={localAgent.notificationSound}
                        blackBg={true}
                        setIsChecked={(val) =>
                          setLocalAgent((prev) => ({
                            ...prev,
                            notificationSound: val,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.testAudio}>
                    <Button
                      action={handleTestSound}
                      type="white"
                      headerStyle={{ padding: "4px 8px", color: "#808080" }}
                    >
                      <NotificationSoundActive />
                      {t("testSound")}
                    </Button>
                    <CustomDropdown
                      options={["sound1", "sound2", "sound3"]}
                      selectedOption={localAgent?.selectedSound}
                      height="31px"
                      textStyles={{
                        display: "flex",
                        fontWeight: 300,

                        userSelect: "none",
                      }}
                      setSelectedOption={(selected) =>
                        setLocalAgent((prev) => ({
                          ...prev,
                          selectedSound: selected,
                        }))
                      }
                    />
                  </div>
                  <p className={styles.subTitle}>{t("aiModel")}</p>

                  <CheckboxWithText
                    state={localAgent.aiModelChecked}
                    setState={(checked) =>
                      setLocalAgent((prev) => ({
                        ...prev,
                        aiModelChecked: checked,
                      }))
                    }
                    text={t("default")}
                  />
                  {localAgent.aiModelChecked && (
                    <CustomDropdown
                      placeholder={t("selectAModel")}
                      options={[
                        "GPT4O-Mini",
                        "GPT-4",
                        "GPT-4 Turbo",
                        "GPT-3.5",
                        "LLaMA 3",
                        "LLaMA 2",
                        "LLaMA 1",
                        "Claude 3",
                        "Claude 2.1",
                        "Claude Instant",
                        "Gemini 1.5 Pro",
                        "Gemini 1.5 Flash",
                        "Gemini 1 Ultra",
                        "DeepSeek-V2",
                        "StableCode 3B",
                        "StableCode 7B",
                      ]}
                      selectedOption={localAgent?.aiModel}
                      height="31px"
                      textStyles={{
                        display: "flex",
                        fontWeight: 300,

                        userSelect: "none",
                      }}
                      setSelectedOption={(option) => {
                        setLocalAgent((prev) => {
                          const currentModels = Array.isArray(prev.aiModel)
                            ? prev.aiModel
                            : [];

                          if (currentModels.includes(option)) return prev;

                          return {
                            ...prev,
                            aiModel: [...currentModels, option],
                          };
                        });
                      }}
                    />
                  )}

                  <div className={styles.headerNotificationSound}>
                    <p className={styles.subTitle}>{t("comunity")}</p>

                    <div className={styles.notificationSoundSelect}>
                      {localAgent?.type == "private" ? (
                        <>
                          <Padlock
                            className={`${styles.typeIcon} ${localAgent.type == "private" && styles.selectedTypeicon}`}
                          />{" "}
                          {t('private')}
                        </>
                      ) : (
                        <>
                          <WorldIcon
                            className={`${styles.typeIcon} ${localAgent.type == "public" && styles.selectedTypeicon}`}
                          />
                          {t('public')}
                        </>
                      )}
                      <OptionsSwitchComponent
                        border="none"
                        marginLeft="auto"
                        isChecked={localAgent.type === "public"}
                        blackBg={true}
                        setIsChecked={(isChecked) =>
                          setLocalAgent((prev) => ({
                            ...prev,
                            type: isChecked ? "public" : "private",
                          }))
                        }
                      />
                    </div>
                  </div>
                  
                  {(localAgent.type === "private" ||
                    localAgent.type === "public") && (
                    <>
                      <CustomDropdown
                        placeholder={t("category")}
                        options={(variables?.data ?? []).map(
                          (variable) => variable.title
                        )}
                        selectedOption={localAgent?.category}
                        height="31px"
                        textStyles={{
                          display: "flex",
                          fontWeight: 300,

                          userSelect: "none",
                        }}
                        setSelectedOption={(selected) =>
                          setLocalAgent((prev) => ({
                            ...prev,
                            category: selected,
                          }))
                        }
                      />
                      {localAgent.type === "private" && (
                        <div>
  <div className={styles.activateKeyContainer}>
  <OptionsSwitchComponent
                        border="none"
                        marginLeft="0"
                        isChecked={localAgent.activateKey}
                        blackBg={true}
                        setIsChecked={(val) =>
                          setLocalAgent((prev) => ({
                            ...prev,
                            activateKey: val,
                          }))
                        }
                      />
                      <p>{t('key')}</p>
                      <span>{t('peopleKnowKey')}</span>
  </div>
                      {localAgent.activateKey && (
                          <InputWithTitle
                            bgColor="var(--f4-background)"
                            titleColor="var(--_18181b-color)"
                            placeholder={t("key")}
                            textStyles={{
                              display: "flex",
                              gap: "5px",
                              fontWeight: 500,
                              color: "var(--black-color)",
  
                              userSelect: "none",
                            }}
                            inputHeight="31px"
                            title=""
                            onChange={(e) =>
                              setLocalAgent((prev) => ({
                                ...prev,
                                key: e.target.value,
                              }))
                            }
                            value={localAgent.key}
                          />
                      )}
                        </div>
                      )}
                    </>
                  )}
                  {localAgent.type == "public" && (
                    <>
                      <div className={`${styles.typeContact}`}>
                        <Tab
                          className={
                            localAgent.typePay == "free" && styles.selected
                          }
                          setLocalAgent={() =>
                            setLocalAgent((prev) => ({
                              ...prev,
                              typePay: "free",
                            }))
                          }
                          title={t("free")}
                        />

                        <Tab
                          className={
                            localAgent.typePay == "singlePayment" &&
                            styles.selected
                          }
                          setLocalAgent={() =>
                            setLocalAgent((prev) => ({
                              ...prev,
                              typePay: "singlePayment",
                            }))
                          }
                          title={t("singlePayment")}
                        />

                        <Tab
                          className={
                            localAgent.typePay == "monthlyPayment" &&
                            styles.selected
                          }
                          setLocalAgent={() =>
                            setLocalAgent((prev) => ({
                              ...prev,
                              typePay: "monthlyPayment",
                            }))
                          }
                          title={t("monthlyPayment")}
                        />
                      </div>
                      {localAgent.typePay != "free" && (
                        <div className={styles.customLabel}>
                         
                          <div className={styles.infoCustomLabel}>
                          <InputWithTitle
                            bgColor="var(--f4-background)"
                            titleColor="var(--_18181b-color)"
                            placeholder={t("price")}
                            textStyles={{
                              display: "flex",
                              gap: "5px",
                              fontWeight: 500,
                              color: "var(--black-color)",
  
                              userSelect: "none",
                            }}
                            inputHeight="31px"
                            title=""
                            onChange={(e) =>
                              setLocalAgent((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            value={localAgent.price}
                          />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <Title
              value={t("instructions")}
              id={"instructions"}
              rightSide={
                <>
                 
                </>
              }
            />
            <Instructions
              localAgent={localAgent}
              setTempInstruction={setTempInstruction}
              tempInstruction={tempInstruction}
              handleEnterPress={handleEnterPress}
              setLocalAgent={setLocalAgent}
            />
            <Title value={t("temperature")} id={"temperature"} />
            <div className={styles.newAgentSection}>
              <SliderRangeControlWithoutButtons
                subtitle={t("tone")}
                desc={t("toneDesc")}
                fieldName="tone"
                value={localAgent.tone}
                onChange={handleChange}
                leftButtonText={t("moreCasual")}
                rightButtonText={t("moreFormal")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("answer")}
                desc={t("answerDesc")}
                fieldName="answer"
                value={localAgent.answer}
                onChange={handleChange}
                leftButtonText={t("resume")}
                rightButtonText={t("detail")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("ageOfInterlocutor")}
                desc={t("ageOfInterlocutorDesc")}
                fieldName="ageOfInterlocutor"
                value={localAgent.ageOfInterlocutor}
                onChange={handleChange}
                leftButtonText={t("younger")}
                rightButtonText={t("moreAdult")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("availability")}
                desc={t("availabilityDesc")}
                fieldName="availability"
                value={localAgent.availability}
                onChange={handleChange}
                leftButtonText={t("lessAvailable")}
                rightButtonText={t("moreAvailable")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("useOfEmojis")}
                desc={t("useOfEmojisDesc")}
                fieldName="useOfEmojis"
                value={localAgent.useOfEmojis}
                onChange={handleChange}
                leftButtonText={t("noEmojis")}
                rightButtonText={t("withEmojis")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("inclusiveLanguage")}
                desc={t("inclusiveLanguageDesc")}
                fieldName="inclusiveLanguage"
                value={localAgent.inclusiveLanguage}
                onChange={handleChange}
                leftButtonText={t("lessInclusive")}
                rightButtonText={t("moreInclusive")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("formality")}
                desc={t("formalityDesc")}
                fieldName="formality"
                value={localAgent.formality}
                onChange={handleChange}
                leftButtonText={t("informal")}
                rightButtonText={t("formal")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("presicion")}
                desc={t("presicionDesc")}
                fieldName="presicion"
                value={localAgent.presicion}
                onChange={handleChange}
                leftButtonText={t("General")}
                rightButtonText={t("accurate")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("coherence")}
                desc={t("coherenceDesc")}
                fieldName="coherence"
                value={localAgent.coherence}
                onChange={handleChange}
                leftButtonText={t("relaxed")}
                rightButtonText={t("veryCoherent")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
              <SliderRangeControlWithoutButtons
                subtitle={t("emotionalLanguage")}
                desc={t("emotionalLanguageDesc")}
                fieldName="emotionalLanguage"
                value={localAgent.emotionalLanguage}
                onChange={handleChange}
                leftButtonText={t("Neutral")}
                rightButtonText={t("emotional")}
                LeftIcon={MoreCasualGreenIcon}
                RightIcon={MoreFormalGreenIcon}
              />
            </div>

            <ScheduledResponses
              setUserData={setLocalAgent}
              userData={localAgent}
              setSeeResponses={setSeeResponses}
              seeResponses={seeResponses}
              handleAddScheduledResponse={handleAddScheduledResponse}
            />

            <Title value={t("knowledgeAndSkills")} id={"knowledgeAndSkills"} />
            <KnowledgeAndSkills
              setLocalAgent={setLocalAgent}
              localAgent={localAgent}
            />
          </div>
        </div>
      </ModalBlackBgTemplate>

      {discountState && (
        <AddDiscount
          setShowDiscountModal={setDiscountState}
          isAnimating={isAnimatingModal}
          setIsAnimating={setIsAnimatingModal}
          setDiscountQuantity={handleDiscountQuantityChange}
          fatherSelectedDiscount={localAgent.DiscountQuantity}
          typeVariable="pricing"
        />
      )}
      {showTestAgent && (
        <ModalBlackBgTemplate>
          <HeaderCard
            setState={setShowTestAgent}
            title={localAgent.name || t("testingAgent")}
          >
            <Button type="white">{t("update")}</Button>
            <Button type="white">{t("clearChat")}</Button>
          </HeaderCard>

          <div className={styles.chatSection}>
            <ChatBody
              handleChat={handleChat}
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isTokenValid={isTokenValid}
              isAgentPopup={true}
              userData={localAgent}
              isAgentModal={true}
              setShowInfoMessage={() => {}}
              parseText={parseText}
              filePayload={filePayload}
              setFilePayload={setFilePayload}
              agentId={selectedAgent._id}
              chatId={`agentConfiguration${selectedAgent._id}`}
              setIsPaused={setIsPaused}
              setTokenInput={setTokenInput}
              setItemsSelected={setItemsSelected}
            />
          </div>
        </ModalBlackBgTemplate>
      )}
    </>
  );
};

export default NewAgentComponent;
