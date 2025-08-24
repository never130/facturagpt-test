import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAgents } from "../../../../actions/agents";
import {
  createAgent,
  deleteAgent,
  deleteChatAgent,
  getAgentById,
  getChatAgents,
  getImagesAgents,
  updateAgent,
} from "../../../../actions/chat";
import { apiUrl } from "../../../../apiBackend";
import { setSelectedAgentSlice } from "../../../../slices/agentSlices";
import { ReactComponent as ConnectedAppsSettingIcon } from "../../assets/ConnectedAppsSettingIcon.svg";
import { ReactComponent as DetailGreenIcon } from "../../assets/DetailGreenIcon.svg";
import { ReactComponent as MoreCasualGreenIcon } from "../../assets/MoreCasualGreenIcon.svg";
import { ReactComponent as MoreFormalGreenIcon } from "../../assets/MoreFormalGreenIcon.svg";
import { ReactComponent as RedTrash } from "../../assets/redTrash.svg";
import { ReactComponent as ResumeGreenIcon } from "../../assets/ResumeGreenIcon.svg";
import { ChatBody } from "../../screens/ChatView/ChatView";
import EditableInput from "../AccountSettings/EditableInput/EditableInput";
import { AutomateDataComponent } from "../Automate/utils/automatesJson";
import Button from "../Button/Button";
import CheckboxWithText from "../CheckboxWithText/CheckboxWithText";
import CorporativeModalText from "../CorporativeModalText/CorporativeModalText";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import DeleteButton from "../DeleteButton/DeleteButton";
import DropdownFlags from "../GeneralSettings/components/DropdownFlags/DropdownFlags";
import HeaderCard from "../HeaderCard/HeaderCard";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import ProfileModalTemplate from "../ProfileModalTemplate/ProfileModalTemplate";
import dataCodes from "./codes.json";
import styles from "./NewAgentComponent.module.css";
import ScheduledResponses from "./ScheduledResponses/ScheduledResponses";


const NewAgentComponent = ({
  setShowNewAgent,
  idSelectedAgent,
  userData, 
  setUserData, 
  chatAgentId,
  setSelectedAgent,
}) => {
  const data = AutomateDataComponent();
  const [t] = useTranslation("ChatView");
  const [tempInstruction, setTempInstruction] = useState("");
  const [language, setlanguage] = useState("");
  const [inputCode, setInputCode] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoadBot, setIsLoadBot] = useState(false);
  const { id } = useParams();
  const [localAgentId, setLocalAgentId] = useState(idSelectedAgent)
  const [localAgent, setLocalAgent] = useState(userData ? userData : {
    Capabilities: [],
    pinned: false,
    tone: 3,
    answer: 3,
  })
  const { agents, fatherNewAgent,idFatherNewAgent } = useSelector((state) => state.agents);

  useEffect(() => {
    idSelectedAgent ? setLocalAgentId(idSelectedAgent) : setLocalAgentId(id)
    if(!agents.length > 0) {
    const fn = async () =>{
     let agents = await dispatch(getAgents({}))
       agents.payload

      if (agents.payload && agents.payload.agents && Array.isArray(agents.payload.agents)) {
      if (idSelectedAgent || id) {
        const selectedAgent = idSelectedAgent
          ? agents.payload.agents.find(agent => agent._id === idSelectedAgent)
          : agents.payload.agents.find(agent => agent._id === id);

        if (selectedAgent) {
          setLocalAgent(selectedAgent);
        }
      }
    }
    }
    fn()
  }

    if (agents && agents.agents && Array.isArray(agents.agents)) {
      if (idSelectedAgent || id) {
        const selectedAgent = idSelectedAgent
          ? agents.agents.find(agent => agent._id === idSelectedAgent)
          : agents.agents.find(agent => agent._id === id);

        if (selectedAgent) {
          setLocalAgent(selectedAgent);
        }
      }
    }
  }, [])



  const [searchStatus, setSearchStatus] = useState(null);



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
        Capabilities: [
          ...localAgent.Capabilities,
          { [name]: newValue }, 
        ],
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



  const handleSendMessage = async (text = false, agent, file) => {
    if (agent == "" || agent == undefined) {
      setShowCorporativeModal(true);
      setCorporativeTitle(t("itIsNecessarySelectAgent"));
      setCorporativeMessage(t("selectAgentToEnableMessage"));

      return;
    }
    try {
      setIsLoadBot(true);

      if (text) {
        setMessages([
          ...messages,
          {
            text: text,
            type: "me",
            agent: agent,
            fileName: file?.name,
            fileType: file?.type,
          },
        ]);
        setInputValue("");
      }

      const userStorage = localStorage.getItem("user");
      const userJson = JSON.parse(userStorage);
      const token = userJson.accessToken;

      await fetch(`${apiUrl}/api/chat/${chatAgentId}/messages`, {
        method: "POST",
        body: JSON.stringify({
          text: text, 
          agent: agent.name, 
          typeChat: "agentConfiguration",
          file: file,
          tone: agent.tone,
          answer: agent.answer,
          description: agent.description,
          language: user?.language,

        }),
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setIsLoadBot(false);

        if (response.ok) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulatedChunks = "";
          let accumulatedText = "";

          const insertMessageBot = ({
            text,
            isGraph = false,
            isApi = false,
          }) => {
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];
              accumulatedText += text;

              if (
                newMessages.length > 0 &&
                newMessages[newMessages.length - 1].type === "bot"
              ) {
                newMessages[newMessages.length - 1].text = accumulatedText;
                newMessages[newMessages.length - 1].isGraph = isGraph;
                newMessages[newMessages.length - 1].isApi = isApi;
              } else {
                newMessages.push({
                  text: accumulatedText,
                  type: "bot",
                  isGraph: isGraph,
                  isApi: isApi,
                });
              }
              return newMessages;
            });
          };

          const processStream = async () => {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              accumulatedChunks += chunk;

              let lines = accumulatedChunks.split("\n");
              accumulatedChunks = lines.pop();

              for (const line of lines) {
                if (line.trim()) {
                  try {
                    const chunk = JSON.parse(line);
                    const { text, type } = chunk.data;

                    if (type === "graph") {
                      const mermaidCode = `pie
                      title ${text.title || "Distribución"}
                  ${text.slices
                          .map(
                            (slice) =>
                              `    "${slice.name || slice.label}" : ${slice.value || slice.count}`
                          )
                          .join("\n")}`;


                      const graphId = `mermaid-${Date.now()}`;

                      try {
                        const { svg } = await mermaid.render(
                          graphId,
                          mermaidCode
                        );
                        insertMessageBot({
                          text: `<div class="${styles.mermaidGraph}">${svg}</div>`,
                          isGraph: true,
                        });
                      } catch (mermaidError) {
                        console.error(
                          "Error renderizando gráfico:",
                          mermaidError
                        );
                        insertMessageBot({
                          text: `Error en el gráfico`,
                        });
                      }
                    } else if (type === "api") {
                      insertMessageBot({ text, isApi: true });
                    } else {
                      insertMessageBot({ text });
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
    } catch (error) {
      console.error("error handleSendMessage", error);
    }
  };
  const handleChat = (action) => {
    if (action.id == 0) {
      navigate(`/admin/panel`);
    } else if (action.id == 1) {
      navigate(`/admin/home`);
    } else if (action.id == 5) {
      navigate(`/contact`);
    } else if (!action.id) {
      handleSendMessage(action.text, localAgent, action.file);
    };
  }

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

      const responseCreateAgent = await dispatch(createAgent({ userData: updatedUserData }));
     
      dispatch(setSelectedAgentSlice({
        _id: responseCreateAgent?.payload?.agent._id,
        img: responseCreateAgent?.payload?.agent.img,
        name: responseCreateAgent?.payload?.agent.name,
        pinned: responseCreateAgent?.payload?.agent.pinned,
        instructions: responseCreateAgent?.payload?.agent.instructions,
      }))
      navigate(`/admin/chat/${responseCreateAgent.payload.agent._id}`)
    }
    dispatch(getAgents({}));
  };

  useEffect(() => {
    if (localAgentId) {
      const fetchAgentData = async () => {

        dispatch(getAgentById({ localAgentId, setUserData, setlanguage }));

        const responseImage = await dispatch(getImagesAgents({ agentIds: localAgentId }));

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
  },
    [localAgentId, localAgent._id]
  );

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
      const res = await dispatch(getChatAgents({ agentName: localAgent.name }));
      setMessages(res.payload.messages || []);
    };
    search();
  },
    [localAgent]
  );

  useEffect(() => {
    if (currentChat.messages.length > 0) {
      setMessages(currentChat.messages);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  const handleDelete = async () => {
    await dispatch(
      deleteAgent({
        agentId: localAgent._id,
      })
    );

    setShowNewAgent ? setShowNewAgent(false) : 
    fatherNewAgent === 'chat' ? navigate(`/admin/chat`) : navigate(`/admin/chat/${id}`)
    setSelectedAgent && setSelectedAgent(null)
    dispatch(getAgents({}))
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
      const hasChanged = JSON.stringify(localAgent) !== JSON.stringify(initialAgent);
      setHasAgentChanged(hasChanged);
    }
  }, [localAgent, initialAgent]);



  const close = () => {
    setShowNewAgent ? setShowNewAgent(false) : 
    fatherNewAgent == 'chat' ? navigate(`/admin/chat`) :
    fatherNewAgent == 'contacts' ? navigate(`/admin/contacts`) :
    fatherNewAgent == 'assets' ? navigate(`/admin/assets`) :
    fatherNewAgent == 'notification' ? navigate(`/admin/notification`) :
    fatherNewAgent == 'panel' ? navigate(`/admin/panel/${idFatherNewAgent}`) :
     fatherNewAgent == 'accounts' ? navigate(`/admin/accounts`) :
    fatherNewAgent == 'home' ? navigate(`/admin/home`) : navigate(`/admin/chat/${id}`)
    setInitialAgent(null)
  };



  return (
    <ModalBlackBgTemplate close={close}>
      <HeaderCard fatherNewAgent={fatherNewAgent} father={'newAgent'} setState={close} title={t("newAgent")}>
        <Button action={() => {
          setInitialAgent(null)
          setShowNewAgent ? setShowNewAgent(false) : 
          fatherNewAgent == 'chat' ? navigate(`/admin/chat`) :
          fatherNewAgent == 'contacts' ? navigate(`/admin/contacts`) :
          fatherNewAgent == 'assets' ? navigate(`/admin/assets`) :
          fatherNewAgent == 'notification' ? navigate(`/admin/notification`) :
          fatherNewAgent == 'panel' ? navigate(`/admin/panel/${idFatherNewAgent}`) :
          fatherNewAgent == 'accounts' ? navigate(`/admin/accounts`) :
          fatherNewAgent == 'home' ? navigate(`/admin/home`) : navigate(`/admin/chat/${id}`)
        }} type="white">
          {t("cancel")}
        </Button>
        {(
          !localAgentId ||
          (localAgentId && hasAgentChanged)
        ) && (
            <Button action={() => {
              handleCreateAgent()
              setInitialAgent(null)
            }}>
              {localAgentId ? t("update") : t("save")}
            </Button>
          )}

      </HeaderCard>
      <div className={styles.agentOptions}>
        {messages.length > 0 && localAgentId && (
          <div className={styles.restartContact} onClick={handleRestart}>
            {t("restartChat")}
          </div>
        )}
        {localAgentId && (
          <div className={styles.deleteContact} onClick={handleDelete}>
            <RedTrash className={styles.icon} /> {t("deleteAgent")}
          </div>
        )}
      </div>
      
      <div className={styles.NewAgentContainer}>
        <div className={styles.ProfileImageContainer}>
          <ProfileModalTemplate
            image={localAgent.image}
            handleContactData={handleContactData}
            id={localAgent._id}
          />
        </div>
        <div className={styles.infoAgentSection}>
          <div className={styles.newAgentSection}>
            <div
              className={`
                    ${styles.typeContact}

                      `}
            >
              <button
                className={localAgent.type == "public" && styles.selected}
                onClick={() =>
                  setLocalAgent((prev) => ({ ...prev, type: "public" }))
                }
                type="button"
              >
                {t("public")}
              </button>
              <button
                className={localAgent.type == "private" && styles.selected}
                onClick={() =>
                  setLocalAgent((prev) => ({ ...prev, type: "private" }))
                }
                type="button"
              >
                {t("private")}
              </button>
              <button
                className={localAgent.type == "key" && styles.selected}
                onClick={() =>
                  setLocalAgent((prev) => ({ ...prev, type: "key" }))
                }
                type="button"
              >
                {t("key")}
              </button>


            </div>
            <EditableInput
              label={t("name")}
              value={localAgent.name}
              name="name"
              onSave={handleChange}
              placeholder={t("nameYourGpt")}
            />
            <EditableInput
              label={t("description")}
              value={localAgent.description}
              name="description"
              isTextarea={true}
              onSave={handleChange}
              placeholder={t("addShortDescription")}
            />
            <div className={styles.sectionContainer}>
              <div className={styles.headerSectionOption}>
                <p>{t("language")}</p>
                <Button
                  type="button"
                  action={() => setEditLanguage((prev) => !prev)}
                >
                  {editLanguage ? t("save") : t("edit")}
                </Button>
              </div>
              <DropdownFlags
                selectedCountry={language}
                setSelectedCountry={handleSelectLanguage}
                textMode={true}
                type="language"
                editing={editLanguage}
                customStyles={{
                  minHeight: "21px",
                  padding: "8px 0",
                }}
              />
            </div>

            <div className={styles.sectionContainer}>
              <div className={styles.headerSectionOption}>
                <p>{t("instructions")}</p>
                <Button
                  type="button"
                  action={() => setEditInstructions((prev) => !prev)}
                >
                  {editInstructions ? t("save") : t("edit")}
                </Button>
              </div>
              <div
                className={`${styles.instructionsWrapper} ${!editInstructions && styles.instructionsWrapperDisabled}`}
              >
                <textarea
                  value={tempInstruction}
                  onChange={(e) => setTempInstruction(e.target.value)} 
                  placeholder={t("whatDoesThisGpt")}
                  rows={4}
                  disabled={!editInstructions}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); 
                      handleEnterPress(); 
                    }
                  }}
                />
                <div className={styles.instructionsTagsContainer}>
            
                  {localAgent?.instructions &&
                    localAgent?.instructions.map((instruction, index) => (
                      <div key={index} className={styles.instructionTag}>
                        {instruction}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div>
              <div className={styles.headerSectionOption}>
                <p>{t("aiModel")}</p>

                <Button
                  type="button"
                  action={() => setEditAIModel((prev) => !prev)}
                >
                  {editAIModel ? t("save") : t("edit")}
                </Button>
              </div>


              {localAgent.aiModel === true ? (
                ""
              ) : (
                <>
                  {Array.isArray(localAgent?.aiModel) && localAgent.aiModel.length >= 1 && (
                    <div className={styles.flagsAiModelContainer}>
                      {localAgent?.aiModel && localAgent.aiModel.map((ai) => (
                        <div className={styles.flagsAiModel}>
                          {ai}
                          <DeleteButton
                            disabled={!editAIModel}
                            action={() => {
                              if (!editAIModel) return;
                              setLocalAgent((prev) => {
                                const currentModels = Array.isArray(
                                  prev.aiModel
                                )
                                  ? prev.aiModel
                                  : [];


                                if (!currentModels.includes(ai)) return prev;

                                return {
                                  ...prev,
                                  aiModel: currentModels.filter(
                                    (model) => model !== ai
                                  ), 
                                };
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <CustomDropdown
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
                    textStyles={{
                      color: "#757575",
                      fontSize: "14px",
                      fontWeight: "400",
                      fontFamily: "Inter, sans-serif",
                    }}
                    placeholder={t("selectAModel")}
                    selectedOption={localAgent?.aiModel}
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
                    CustomDropdownOptionStyles={styles.padding}
                    AIModels={true}
                    editable={editAIModel}
                    setSelectedColor={() => console.log("hola")}
                  />
                </>
              )}
              <CheckboxWithText
                state={localAgent.aiModel === true}
                disabled={!editAIModel}
                setState={(checked) =>
                  setLocalAgent((prev) => ({
                    ...prev,
                    aiModel: checked,
                  }))
                }
                text={t("selectAllAimodels")}
              />
            </div>
            <div>
              <p>{t("instructions")}</p>
              {localAgent?.instructions && (
                <div className={styles.instructionsWrapper}>
                  {localAgent?.instructions.map((instruction, index) => (
                    <div key={index}>{instruction}</div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.sectionContainer}>
              <div className={styles.headerSectionOption}>
                <p>{t("editCode")}</p>

                <Button
                  type="button"
                  action={() => {
                    setEditCode((prev) => !prev);

                    if (editCode) {
                      verifyCode();
                    }
                  }}
                >
                  {editCode ? t("verify") : t("edit")}
                </Button>
              </div>

              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editCode) {
                    verifyCode();
                  }
                }}
                disabled={!editCode}
                style={{ marginRight: "8px" }}
              />

              {searchStatus === "success" && (
                <p style={{ color: "green" }}>{t('codeFounded')}</p>
              )}
              {searchStatus === "error" && (
                <p style={{ color: "red" }}>{t('codeNotFounded')}</p>
              )}

              {userData?.inputCode && (
                <div>
                  <p><strong>{t('code')}:</strong> {userData.inputCode.code}</p>
                  <p><strong>{t('title')}:</strong> {userData.inputCode.title}</p>
                  <p><strong>{t('description')}:</strong> {userData.inputCode.description}</p>
                </div>
              )}
            </div>
            <div>
              <div>
                <p>{t("tone")} (1-5)</p>
                <div className={styles.rowQuantity}>
                  <button
                    onClick={(e) => {

                      const toneNumber = Number(localAgent.tone); 

                      if (toneNumber <= 5 && toneNumber > 0) {
                        handleChange({
                          name: "tone",
                          newValue: toneNumber - 1, 
                        });
                      }
                    }}
                  >
                    {" "}
                    <MoreCasualGreenIcon /> {t("moreCasual")}
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={localAgent.tone || 1}
                    onChange={(e) => {
                      if (e.target.value <= 5 && e.target.value >= 0) {
                        handleChange({
                          name: "tone",
                          newValue: e.target.value,
                        });
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {

                      const toneNumber = Number(localAgent.tone); 

                      if (toneNumber < 5 && toneNumber >= 0) {

                        handleChange({
                          name: "tone",
                          newValue: toneNumber + 1, 
                        });
                      }
                    }}
                  >
                    {" "}
                    <MoreFormalGreenIcon /> {t("moreFormal")}
                  </button>
                </div>
              </div>
              <div>
                <p>{t("answer")} (1-5)</p>
                <div className={styles.rowQuantity}>
                  <button
                    onClick={(e) => {

                      const answerNumber = Number(localAgent.answer); 

                      if (answerNumber <= 5 && answerNumber > 0) {

                        handleChange({
                          name: "answer",
                          newValue: answerNumber - 1, 
                        });
                      }
                    }}
                  >
                    {" "}
                    <ResumeGreenIcon /> {t("resume")}
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={localAgent.answer || 1}
                    onChange={(e) => {
                      if (e.target.value <= 5 && e.target.value >= 0) {
                        handleChange({
                          name: "answer",
                          newValue: e.target.value,
                        });
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {

                      const answerNumber = Number(localAgent.answer); 

                      if (answerNumber < 5 && answerNumber >= 0) {

                        handleChange({
                          name: "answer",
                          newValue: answerNumber + 1, 
                        });
                      }
                    }}
                  >
                    <DetailGreenIcon /> {t("detail")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ScheduledResponses setUserData={setLocalAgent} userData={localAgent} />

          <div className={styles.newAgentSection}>
            <div className={styles.rowHeaderCapacities}>
              <p>{t("capabilities")}</p>
              <span>{t("comingSoon")}</span>
            </div>
            <div className={styles.comingSoon}>
              <div className={styles.capacitiesContainer}>
                <div className={styles.row}>
                  <input
                    type="checkbox"
                    checked={tempCapabilities.webSearch}
                    onChange={(e) =>
                      handleCheckboxChange("webSearch", e.target.checked)
                    }
                    disabled
                  />
                  <span>{t("webSearch")}</span>
                </div>
                <div className={styles.row}>
                  <input
                    type="checkbox"
                    checked={tempCapabilities.dallEImageGeneration}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "dallEImageGeneration",
                        e.target.checked
                      )
                    }
                    disabled
                  />
                  <span>{t("dalleImageGeneration")}</span>
                </div>
                <div className={styles.row}>
                  <input
                    type="checkbox"
                    checked={tempCapabilities.facturaGPTCodeInterpretor}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "facturaGPTCodeInterpretor",
                        e.target.checked
                      )
                    }
                    disabled
                  />
                  <span>{t("facturaGptCodeInterpreter")}</span>
                </div>
              </div>

              <Button
                type="white"
                headerStyle={{
                  borderRadius: "999px",
                  width: "fit-content",
                  margin: "10px 0px",
                }}
                disabledOption={true}
              >
                <ConnectedAppsSettingIcon />
                {t("connectedApps")}
              </Button>
             

              <div className={styles.Knowledge}>
                <p>{t("knowledge")}</p>
                <span>{t("ifYouUplaodFiles")}</span>
              </div>
              <Button
                type="white"
                headerStyle={{ borderRadius: "999px", width: "fit-content" }}
                disabledOption={true}
              >
                {t("uploadFiles")}
              </Button>
            </div>
          </div>
        </div>
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
          />
        </div>
      </div>

      {showCorporativeModal && (
        <CorporativeModalText
          title={corporativeTitle}
          message={corporativeMessage}
          setState={setShowCorporativeModal}
        />
      )}
    </ModalBlackBgTemplate>
  );
};

export default NewAgentComponent
