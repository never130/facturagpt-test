import styles from './ChatExplorer.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import newChatWithAgent from "../../assets/newChatWithAgent.svg"
import { ReactComponent as NewAgentIconGreen } from "../../assets/newAgentIconGreen.svg";
import { ReactComponent as NewChatIconGreen } from "../../assets/newChatIconGreen.svg";
import { v4 as uuidv4 } from "uuid";
import apiBackend from "@src/apiBackend.js";


import {
  fetchByMenu,
  deleteChat,
  getImagesAgents,
  getPublicAgents,
  emptyChat,
  fetchByChat,
  deleteAgent
} from '../../../../actions/chat';
import { setMessages, setSelectedAgent, clearCurrentChat, setChatList, setEmptyChat } from '../../../../slices/chatSlices';

import Button from "../../components/Button/Button.jsx";
import { ReactComponent as ArrowLeft } from "../../assets/ArrowLeftWhite.svg";

import useFocusShortcut from "../../../../utils/useFocusShortcut.js";

import SearchIconWithIcon from "../../components/SearchIconWithIcon/SearchIconWithIcon.jsx";

import agentNewIcon from "../../assets/agentNewIcon.svg";

import { ReactComponent as ExploreCommunitiIcon } from "../../assets/exploreCommunitiIcon.svg";

import { duplicateAgent, getAgents } from "../../../../actions/agents.js";
import ImageEmpty from "../../assets/ImageEmpty.svg";

import { ReactComponent as Pinned } from "../../assets/PinnedIcon.svg";

import { ReactComponent as NotPinned } from "../../assets/NotPinned.svg";

import horizontalDots from "../../assets/S3/horizontalDots.svg";



import { setGlobalSearch, setShowModal } from "../../../../slices/userSlices";
import { getAgentById } from "../../../../actions/chat";
import { set } from 'date-fns';


const ChatExplorer = ({
  isOpen,

  leftWidth,

  handleSendMessage,
  setNewChat,

}) => {

  const { agentId: agentIdParam } = useParams();
  const [t] = useTranslation("ChatView");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedAgent, currentChat, chatList, searchTerm: searchTermState, messages } = useSelector(
    (state) => state.chat
  );


  const { workspaceSelected } = useSelector((state) => state.workspace);


  const { user, globalSearch } = useSelector((state) => state.user);

  const [agentId, setAgentId] = useState(null);
  const [chatId, setChatId] = useState(null);




  useEffect(() => {
    setSearchTerm(globalSearch)
  }, [globalSearch])

  useEffect(() => {
    const fn = async () => {
      if (agentIdParam) {
        const response = await dispatch(
          getAgentById({
            idSelectedAgent: agentIdParam,
          })
        );

        if (response.payload && response.payload.success) {
          dispatch(setSelectedAgent(response.payload.agent));
        }
      }
    }
    fn();
  }, [agentIdParam]);
  const [selectedOption, setSelectedOption] = useState(false);

  // Ref para los botones moreButton de cada agente
  const moreButtonRefs = useRef({});

  // Ref para los botones moreButton de cada chat
  const chatMoreButtonRefs = useRef({});

  // Funciones para context menus
  const handleContextMenuContainer = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Simular el comportamiento de crear nuevo agente
    // Usar la misma posición que el click
    setSelectedOption({
      type: 'container',
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Context menu para el contenedor de chats
  const handleContextMenuChatsContainer = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedOption({
      type: 'chatsContainer',
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Context menu para chats individuales
  const handleContextMenuChat = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();

    // Obtener la posición del botón moreButton del chat específico
    const chatMoreButtonRef = chatMoreButtonRefs.current[chat.id];
    let top, left;

    if (chatMoreButtonRef) {
      // Usar la posición del botón moreButton
      const rect = chatMoreButtonRef.getBoundingClientRect();
      const popupHeight = 120;

      // Calcular posición vertical
      if (rect.bottom + popupHeight > window.innerHeight) {
        top = rect.top - popupHeight + 15;
      } else {
        top = rect.bottom;
      }

      // Usar la posición horizontal del botón
      left = rect.left;
    } else {
      // Fallback: usar la posición del mouse si no hay ref
      top = e.clientY;
      left = e.clientX;
    }

    setSelectedOption({
      chat,
      x: left,
      y: top,
    });
  };

  // Utiliza la misma lógica que handleOptionsClick de FileExplorer.jsx para calcular la posición del menú contextual
  const handleContextMenuAgent = (e, agent) => {
    e.preventDefault();
    e.stopPropagation();

    // Obtener la posición del botón moreButton del agente específico
    const moreButtonRef = moreButtonRefs.current[agent._id];
    let top, left;

    if (moreButtonRef) {
      // Usar la posición del botón moreButton
      const rect = moreButtonRef.getBoundingClientRect();
      const popupHeight = 120;

      // Calcular posición vertical
      if (rect.bottom + popupHeight > window.innerHeight) {
        top = rect.top - popupHeight + 15;
      } else {
        top = rect.bottom;
      }

      // Usar la posición horizontal del botón
      left = rect.left;
    } else {
      // Fallback: usar la posición del mouse si no hay ref
      top = e.clientY;
      left = e.clientX;
    }

    setSelectedOption({
      agent,
      x: left,
      y: top,
    });
  };



  // Cerrar selectedOption cuando se hace click fuera o se presiona Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedOption && !event.target.closest(`.${styles.menuOptions}`)) {
        setSelectedOption(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && selectedOption) {
        setSelectedOption(null);
      }
    };

    // Usar mousedown en lugar de click para evitar conflictos
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedOption]);

  useEffect(() => {
    if (selectedAgent) {
      setAgentId(selectedAgent._id);
    }
  }, [selectedAgent]);


  useEffect(() => {
    if (currentChat) {
      setChatId(currentChat.id);
    }
  }, [currentChat]);





  useEffect(() => {
    dispatch(fetchByMenu({ query: searchTermState }));
  }, [searchTermState, dispatch, workspaceSelected]);

  useEffect(() => {

    if (chatList?.length > 0) {
      dispatch(setChatList(chatList));
    }
  }, [chatList]);

  const sortChat =
    chatList?.length === 0
      ? {}
      : chatList?.reduce((acc, chat) => {
        if (chat?.typeChat === "agentConfiguration") return acc;

        const older = chat.older || 0;
        let groupKey;

        // Agrupar por rangos de días en lugar de días individuales
        if (older === 0) groupKey = 0; // Hoy
        else if (older === 1) groupKey = 1; // Ayer
        else if (older > 1 && older < 7) groupKey = "week1"; // Esta semana (2-6 días)
        else if (older >= 7 && older < 14) groupKey = "week2"; // Semana pasada (7-13 días)
        else if (older >= 14 && older < 30) groupKey = "month1"; // Este mes (14-29 días)
        else if (older >= 30 && older < 60) groupKey = "month2"; // Mes pasado (30-59 días)
        else groupKey = "ancient"; // Varios meses atrás (60+ días)

        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(chat);
        return acc;
      }, {});

  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(clearCurrentChat());
  }, []);

  const addMessage = () => {
    dispatch(clearCurrentChat());
    navigate(`/admin/bot`, { state: { backgroundLocation: location } });
  };

  const handleDeleteMessage = async (chatId) => {

    await dispatch(deleteChat({ chatId: chatId.id }));
    setSelectedOption(false);
  };

  const [selectedChat, setSelectedChat] = useState(null);
  const [tempChatNames, setTempChatNames] = useState({});
  const inputRefs = useRef({});

  const handleChangeName = async (chatId) => {
    setSelectedOption(false);
    setSelectedChat(chatId);

    const selectedChat = chatList.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setTempChatNames((prev) => ({ ...prev, [chatId]: selectedChat.name }));
    }
  };

  useEffect(() => {
    if (selectedChat && inputRefs.current[selectedChat]) {
      inputRefs.current[selectedChat].focus();
    }
  }, [selectedChat]);

  useFocusShortcut(searchInputRef, "/");

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

  const [swiped, setSwiped] = useState(false);






  const {
    agents,
    loading: loadingAgent,
    error,
  } = useSelector((state) => state.agents);

  const userToken = localStorage.getItem("user");
  const userJson = JSON.parse(userToken);
  const token = userJson?.accessToken;
  const [privateAgentsFiltered, setPrivateAgentsFiltered] = useState([]);
  const [publicAgentsFiltered, setPublicAgentsFiltered] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const location = useLocation()
  const [optionsSelectedAgent, setOptionsSelectedAgent] = useState(false);


  // Obtener agentes cuando cambie el workspace o el token
  useEffect(() => {
    if (token && workspaceSelected) {
      // Limpiar agentes anteriores antes de obtener los nuevos
      dispatch(getAgents({
        token,
        search: searchTerm,
        workspaceId: workspaceSelected._id || workspaceSelected.id
      }));
    }
  }, [dispatch, token, workspaceSelected, searchTerm]);

  // Limpiar agentes filtrados cuando cambie el workspace
  // useEffect(() => {
  //   setPrivateAgentsFiltered([]);
  //   setPublicAgentsFiltered([]);
  //   setFilteredAgents([]);

  //   // También limpiar el estado de agents del Redux si es necesario
  //   // Esto asegura que no se muestren agentes del workspace anterior
  //   if (workspaceSelected && agents?.agents) {
  //     // Solo limpiar si hay un workspace seleccionado y hay agentes
  //     // Los agentes se volverán a cargar en el siguiente useEffect
  //   }
  // }, [workspaceSelected]);


  // Procesar y filtrar agentes privados cuando cambien los agentes o el workspace
  useEffect(() => {
    // Solo procesar agentes si están disponibles y hay un workspace seleccionado
    if (!agents?.agents || !workspaceSelected) {
      setPrivateAgentsFiltered([]);
      return;
    }

    // Filtrar agentes por workspace actual
    const workspaceId = workspaceSelected._id || workspaceSelected.id;
    console.log('agents.agents', agents.agents)

    // Filtrar agentes que pertenezcan al workspace actual
    const agentsInWorkspace = agents.agents
    // .filter(agent => 
    //   agent.workspaceId === workspaceId || agent.workspace === workspaceId
    // );


    const filtered = agentsInWorkspace
    // searchTerm.trim() === ""
    //   ? agentsInWorkspace
    //   : agentsInWorkspace
    //   .filter((agent) =>
    //     agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    console.log('Agentes filtrados por búsqueda:', filtered?.length);
    // console.log('filtered',filtered)
    const agentIds = filtered?.map((agent) => agent._id);

    if (agentIds?.length > 0) {
      const fetchImages = async () => {
        try {
          const response = await dispatch(getImagesAgents({ agentIds }));
          const images = response.payload.images;

          const updatedAgents = filtered.map((agent) => {
            const image = images.find((img) => img._id === agent._id)?.image;
            return {
              ...agent,
              image,
            };
          });

          setPrivateAgentsFiltered(updatedAgents);
        } catch (error) {
          console.error("Error al obtener las imágenes de los agentes:", error);
        }
      };

      fetchImages();
    } else {
      setPrivateAgentsFiltered(filtered || []);
    }
  }, [searchTerm, agents.agents, dispatch, workspaceSelected]);

  // Obtener agentes públicos cuando cambie el término de búsqueda o el workspace
  useEffect(() => {
    const searchPublicAgent = async () => {
      // Solo buscar agentes públicos si hay un workspace seleccionado
      if (!workspaceSelected) {
        setPublicAgentsFiltered([]);
        return;
      }

      try {
        const response = await dispatch(getPublicAgents({
          searchTerm: searchTerm,
          workspaceId: workspaceSelected._id || workspaceSelected.id
        }));

        console.log('response de agentes publicos', response)

        if (response.payload.success && response.payload.agents.length > 0) {
          setPublicAgentsFiltered(response.payload.agents);
        } else {
          setPublicAgentsFiltered([]);
        }
      } catch (error) {
        console.error("Error al obtener agentes públicos:", error);
        setPublicAgentsFiltered([]);
      }
    };

    searchPublicAgent();
  }, [searchTerm, workspaceSelected, dispatch, agents.agents]);

  // Combinar agentes privados y públicos cuando cambien o cuando cambie el workspace
  useEffect(() => {
    // Solo combinar agentes si hay un workspace seleccionado
    if (!workspaceSelected) {
      setFilteredAgents([]);
      return;
    }

    setFilteredAgents([
      ...(privateAgentsFiltered || []),
      ...(publicAgentsFiltered || [])
    ]);
  }, [privateAgentsFiltered, publicAgentsFiltered, workspaceSelected]);


  useEffect(() => {
    // Solo ejecutar cuando cambie el workspace, no por chatId o agentId
    if (workspaceSelected) {
      dispatch(setSelectedAgent(null));
      localStorage.removeItem("selectedAgentId");
      localStorage.removeItem("selectedChatId");
      navigate('/admin/chat');
    }
  }, [workspaceSelected]);

  const handleTogglePinned = async (agentId, currentPinned = false, agent) => {
    if (!token) {
      console.error("Token no disponible, evitando la petición");
      return;
    }
    console.log('este es el agente a fijar', agent)

    try {
      if (agent.isGlobalCopy) {
        // const res = await dispatch(duplicateAgent({ agent: agent }))
        const res = await dispatch(
          deleteAgent({
            agentId: agent._id,
            agentName: agent.name,
          })
        )
        console.log('res de la eliminacion', res)
        if (res) dispatch(getAgents({ token }));
      }
      // Aquí validamos si ya existe una copia privada del agente público.
      const hasPrivateCopy = privateAgentsFiltered?.some(
        (privateAgent) => privateAgent.idOriginalAgent === agent._id
      );

      if (agent.isGlobal) {
        if (hasPrivateCopy) {
          // Si ya existe una copia privada, la eliminamos
          const privateCopy = privateAgentsFiltered.find(
            (privateAgent) => privateAgent.idOriginalAgent === agent._id
          );
          if (privateCopy) {
            const res = await dispatch(
              deleteAgent({
                agentId: privateCopy._id,
                agentName: privateCopy.name,
              })
            );
            console.log('res de la eliminación de la copia privada', res);
            if (res) dispatch(getAgents({ token }));
          }
        } else {
          // Si no existe copia privada, la creamos (duplicamos)
          const res = await dispatch(duplicateAgent({ agent: agent }));
          console.log('res de la duplicación', res);
          if (res) dispatch(getAgents({ token }));
        }
      } else if (agent.type == 'private' && !agent.isGlobalCopy && !agent.isGlobal) {

        const res = await apiBackend.put(
          `/chat/pin-agents/${agentId}`,
          { pinned: !currentPinned },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(getAgents({ token }));
      }
      // if (agent.type == 'public') {
      // } else 
      // {

      // }
      // {
      // }
    } catch (error) {
      console.error("Error en la petición PUT:", error.response?.data || error);
    }
  };
  const handleTogglePinnedChat = async (chatId, currentPinned = false) => {
    if (!token) {
      console.error("Token no disponible, evitando la petición");
      return;
    }

    try {

      const res = await apiBackend.put(
        `/chat/${chatId}/pin`,
        { pinned: !currentPinned },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchByMenu({ query: searchTermState }));
      setSelectedOption(null);
    } catch (error) {
      console.error("Error en la petición PUT:", error.response?.data || error);
    }
  };


  const handleChageNameChat = async (chatId, name) => {
    if (!token) {
      console.error("Token no disponible, evitando la petición");
      return;
    }

    try {

      const res = await apiBackend.put(
        `/chat/${chatId}/update-name`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchByMenu({ query: searchTermState }));
    } catch (error) {
      console.error("Error en la petición PUT:", error.response?.data || error);
    }
  };

  const hasMatchingChats = Object.values(sortChat)
    .flat()
    .filter((chat) => chat?.agent === selectedAgent?._id)
    .some((chat) =>
      (chat.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchAgentImage = async () => {
      if (!agentId) return;
      try {
        const responseImage = await dispatch(
          getImagesAgents({ agentIds: agentId })
        );
        const agentImage = responseImage.payload?.images?.[0]?.image;
        if (agentImage) {
          setImage(agentImage);
        } else {
          setImage(null);
        }
      } catch (error) {
        console.error("Error fetching agent image:", error);
        setImage(null);
      }
    };
    fetchAgentImage();
  }, [agentId, dispatch]);

  const agent = selectedAgent || selectedOption?.agent;

  const onClicNewChat = (e) => {

    const new_id = uuidv4();
    localStorage.setItem("selectedChatId", "");
    navigate(`/admin/chat/${agentId}/${new_id}`);

  }


  return (
    <div
      className={styles.chatMenu}
      style={{
        maxWidth: `${leftWidth || 0}px`,
        width: isMobile && "0px",
        minWidth: isMobile && "0px",
        display: isOpen ? "block" : "none",
      }}
    >
      <div
        className={`${styles.asideBar} ${isMobile ? styles.mobileMenu : ""} ${swiped ? "" : styles.offAsideBar}`}
      >
        <div className={styles.chatsContainer} onContextMenu={handleContextMenuChatsContainer}>
          {selectedAgent && (
            <>
              <div className={styles.goToAgents}>
                <Button
                  action={() => {
                    navigate("/admin/chat");
                    dispatch(setSelectedAgent(null));
                    dispatch(setMessages([]));
                    dispatch(setGlobalSearch(""))
                    localStorage.removeItem("selectedAgentId");
                    localStorage.removeItem("selectedChatId");
                    dispatch(clearCurrentChat());
                  }}
                  headerStyle={{ padding: "4px 5px" }}
                >
                  <ArrowLeft />
                </Button>
                <div className={styles.selectedAgentContainer}>
                  <img src={image || ImageEmpty} alt="" />
                  {selectedAgent.name}
                  <div className={styles.pinnedIcon}>
                    {selectedAgent.pinned ? <Pinned className={styles.pinnedIconSvg} /> : <NotPinned />}
                  </div>
                  <div className={styles.chatMenuSettings}>
                    <button
                      className={styles.moreButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOptionsSelectedAgent(true);
                        setSelectedOption({
                          selectedAgent,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                    >
                      <div className={styles.dotsWrapperHover}>
                        <img
                          src={horizontalDots}
                          alt="horizontalDots"
                          className={`${styles.verticalDots}`}
                        />
                        <div className={styles.shadowContainer} ></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              {searchTerm !== "" && !hasMatchingChats ? (
                <div className={styles.noFilesContainer}>
                  <h3>{t("noChatsMatchThisSearch")}</h3>
                </div>
              ) : Object.keys(sortChat).length === 0 || !hasMatchingChats ? (
                <div className={styles.noChats}>
                  <p>{t("currentlyHaveNoChats")}</p>
                  <p>{t("sendMessageStartChat")}</p>
                </div>
              ) : (
                Object.entries(sortChat)
                  .sort(([a], [b]) => {
                    // Ordenar los grupos en orden cronológico
                    const order = { 0: 0, "0": 0, 1: 1, "1": 1, "week1": 2, "week2": 3, "month1": 4, "month2": 5, "ancient": 6 };
                    return order[a] - order[b];
                  })
                  .map(([group, chatArray]) => {
                    let groupTitle = t("ancient");
                    if (group === 0 || group === "0") groupTitle = t("today");
                    else if (group === 1 || group === "1") groupTitle = t("yesterday");
                    else if (group === "week1") groupTitle = t("thisWeek");
                    else if (group === "week2") groupTitle = t("lastWeek");
                    else if (group === "month1") groupTitle = t("thisMonth");
                    else if (group === "month2") groupTitle = t("lastMonth");
                    else if (group === "ancient") groupTitle = t("severalMonthAgo");
                    const filteredChats = chatArray.filter(
                      (chat) =>
                        chat.agent === agent._id &&
                        (chat.name || "")
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    );
                    if (filteredChats.length === 0) return null;

                    return (
                      <div key={group}>
                        <div className={styles.groupTitle}    >
                          <strong>{groupTitle}</strong>
                        </div>
                        <ul>
                          {filteredChats

                            .sort((a, b) => b.pinned - a.pinned)
                            .map((chat) => (
                              <li
                                key={chat.id}
                                className={`${chatId === chat.id ? styles.active : ""}`}
                                onClick={() => {
                                  localStorage.setItem("selectedChatId", chat.id);
                                  dispatch(setGlobalSearch(""))
                                  navigate(
                                    `/admin/chat/${agentId || selectedAgent._id}/${chat.id}`
                                  );
                                }}
                                onContextMenu={(e) => handleContextMenuChat(e, chat)}
                              >
                                {selectedChat != chat?.id ? (
                                  <>
                                    <span>
                                      {tempChatNames[chat.id] ||
                                        chat.name ||
                                        t("newChat")}
                                    </span>
                                    <div className={styles.pinnedIcon}>
                                      {chat.pinned ? <Pinned className={styles.pinnedIconSvg} /> : <NotPinned />}
                                    </div>
                                  </>
                                ) : (
                                  <input
                                    ref={(el) => (inputRefs.current[chat.id] = el)}
                                    type="text"
                                    value={tempChatNames[chat.id] || ""}
                                    className={
                                      selectedChat == chat?.id &&
                                      styles.selectedChat
                                    }
                                    onBlur={(e) => {
                                      setSelectedChat(null);
                                      handleChageNameChat(
                                        chat.id,
                                        tempChatNames[chat.id]
                                      );
                                    }}
                                    onChange={(e) =>
                                      setTempChatNames((prev) => ({
                                        ...prev,
                                        [chat.id]: e.target.value,
                                      }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        setSelectedChat(null);
                                        handleChageNameChat(
                                          chat.id,
                                          tempChatNames[chat.id]
                                        );
                                      }
                                    }}
                                  />
                                )}
                                <div className={styles.chatMenuSettings}>
                                  <button
                                    ref={(el) => (chatMoreButtonRefs.current[chat.id] = el)}
                                    className={styles.moreButton}
                                    onClick={(e) => {
                                      setOptionsSelectedAgent(false);
                                      setSelectedOption({
                                        chat,
                                        x: e.clientX,
                                        y: e.clientY,
                                      });
                                    }}
                                  >

                                    <div className={styles.dotsWrapperHoverHorizontal}>
                                      <img src={horizontalDots} alt="horizontalDots" />
                                      <div className={styles.shadowContainerHorizontal} ></div>
                                    </div>

                                    {" "}
                                  </button>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    );
                  })
              )}
            </>
          )}

          {!selectedAgent && (
            <div className={styles.agentsContainer} onContextMenu={handleContextMenuContainer}>
              {filteredAgents?.length > 0 ? (
                <ul>
                  {[...(privateAgentsFiltered || [])]
                    // .filter((agent) => agent.type !== "public")
                    .sort((a, b) => b.pinned - a.pinned)
                    .map((agent) => (
                      <li
                        key={agent?._id}
                        onClick={() => {
                          dispatch(setSelectedAgent(agent));
                          dispatch(setGlobalSearch(""))
                          setImage(agent.image);
                          localStorage.setItem("selectedAgentId", agent._id);
                          localStorage.removeItem("selectedChatId");
                          navigate(`/admin/chat/${agent._id}`);
                        }}
                        onContextMenu={(e) => handleContextMenuAgent(e, agent)}
                      >
                        <div className={styles.agentInfo}>
                          <img src={agent?.image || ImageEmpty} alt="" />
                          <p className={styles.agentNameQuantityConversations}>
                            {agent?.name || t("newAgent")}
                            <span>
                              {t("have")}{" "}
                              {
                                agent?.totalChats || 0
                              }{" "}
                              {t("conversations")}
                            </span>
                          </p>
                        </div>
                        <div className={styles.pinnedIcon}>
                          {agent?.pinned ? <Pinned className={styles.pinnedIconSvg} /> : <NotPinned />}
                        </div>
                        <div className={styles.chatMenuSettings}>
                          <button
                            ref={(el) => (moreButtonRefs.current[agent?._id] = el)}
                            className={styles.moreButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOption({
                                agent,
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }}
                          >
                            <div className={styles.dotsWrapperHoverHorizontal}>
                              <img src={horizontalDots} alt="options" />
                              <div className={styles.shadowContainerHorizontal} ></div>
                            </div>
                          </button>
                        </div>
                      </li>
                    ))}

                  {publicAgentsFiltered?.length > 0 && (
                    <li className={`${styles.liSinHover}`}>
                      <strong>{t("publicBots")}</strong>
                    </li>
                  )}

                  {[...(publicAgentsFiltered || [])]
                    // .filter((agent) => agent.type === "public")
                    .sort((a, b) => b.pinned - a.pinned)
                    .map((agent) => (
                      <li
                        key={agent._id}
                        onClick={() => {
                          dispatch(setSelectedAgent(agent));
                          dispatch(setGlobalSearch(""))
                          setImage(agent.image);
                          localStorage.setItem("selectedAgentId", agent._id);
                          localStorage.removeItem("selectedChatId");
                          navigate(`/admin/chat/${agent._id}`);
                        }}
                        onContextMenu={(e) => handleContextMenuAgent(e, agent)}
                      >
                        <div className={styles.agentInfo}>
                          <img src={agent?.image || ImageEmpty} alt="" />
                          <p className={styles.agentNameQuantityConversations}>
                            {agent?.name || t("newAgent")}
                            <span>
                              {t("have")}{" "}
                              {
                                agent?.totalChats || 0
                              }{" "}
                              {t("conversations")}
                            </span>
                          </p>
                        </div>
                        <div className={styles.pinnedIcon}>
                          {(() => {
                            // Verificar si este agente público tiene una copia en agentes privados
                            const hasPrivateCopy = privateAgentsFiltered.some(
                              privateAgent => privateAgent.idOriginalAgent === agent._id
                            );
                            // Si tiene copia privada, mostrar icono pinned, si no, notpinned
                            return hasPrivateCopy ?
                              <Pinned className={styles.pinnedIconSvg} /> :
                              <NotPinned />;
                          })()}
                        </div>
                        <div className={styles.chatMenuSettings}>
                          <button
                            ref={(el) => (moreButtonRefs.current[agent._id] = el)}
                            className={styles.moreButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOption({
                                agent,
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }}
                          >
                            <div className={styles.dotsWrapperHoverHorizontal}>
                              <img src={horizontalDots} alt="options" />
                              <div className={styles.shadowContainerHorizontal} ></div>
                            </div>
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className={styles.noFilesContainer}>
                  <h3>{t("noAgentsfound")}</h3>
                </div>
              )}
            </div>
          )}
        </div>
        {selectedOption && (
          <ul
            className={styles.menuOptions}
            style={{
              top: selectedOption.y,
              left: selectedOption.x,
            }}
          >
            {selectedOption?.type === 'container' ? (
              <>
                <li
                  onClick={() => {
                    setSelectedOption(null);
                    // Navegar a crear nuevo agente
                    navigate('/admin/bot');
                  }}
                >
                  {t('newAgent')}
                </li>
              </>
            ) : selectedOption?.type === 'chatsContainer' ? (
              <>
                <li
                  onClick={async () => {
                    console.log('chatList', chatList)
                    dispatch(setShowModal({
                      modal: 'deleteChats',
                      type: 'emptyAgent',
                      variant: 'confirm',
                      chatList: chatList,
                      agent: selectedAgent
                    }))
                    dispatch(setGlobalSearch(""))
                    // dispatch(setEmptyChat("all"))
                    // setSelectedOption(null);
                  }}
                >
                  {t('emptyAgent')}
                </li>

              </>
            ) : !selectedAgent || optionsSelectedAgent ? (
              <>
                {
                  (agent?.isGlobal === true
                    ? user?.id?.split("_").pop() === agent?.createdBy
                    : true
                  ) && (

                    <li
                      onClick={() => {
                        if (selectedAgent) {
                          dispatch(setSelectedAgent(selectedAgent));
                          navigate(`/admin/bot/${selectedAgent._id}`);
                        } else {
                          dispatch(setSelectedAgent(selectedOption.agent));
                          navigate(`/admin/bot/${selectedOption.agent._id}`);
                        }
                        setSelectedOption(null);
                      }}
                    >
                      {t("editBot")}
                    </li>
                  )}
                <li
                  onClick={async () => {
                    if (selectedAgent) {
                      // if (user?.id?.split("_").pop() !== agent?.createdBy) {


                      handleTogglePinned(
                        selectedAgent._id,
                        selectedAgent.pinned,
                        agent
                      );
                      dispatch(setSelectedAgent((prev) => ({
                        ...prev,
                        pinned: !prev.pinned,
                      })));
                    } else {
                      // if (user?.id?.split("_").pop() !== agent?.createdBy) {


                      handleTogglePinned(
                        selectedOption.agent._id,
                        selectedOption.agent?.pinned,
                        agent
                      );

                    }
                    setSelectedOption(null);
                  }}
                >

                  {
                    agent?.type === "private"
                      ? (
                        agent?.isGlobalCopy === true
                          ? `${t("unpin")} `
                          : (agent?.pinned ? `${t("unpin")} ` : `${t("pin")} `)
                      )
                      : agent?.type === "public"
                        ? (
                          privateAgentsFiltered?.some(
                            privateAgent => privateAgent.idOriginalAgent === agent._id
                          )
                            ? `${t("unpin")} `
                            : `${t("pin")} `
                        )
                        : (agent?.pinned ? `${t("unpin")} ` : `${t("pin")} `)
                  }
                  {t("bot")}
                </li>
                {/* {user?.id?.split("_").pop() === agent?.createdBy && agent?.type !== "public" && ( */}
                {
                  (
                    // Solo mostrar si NO es copia global
                    !agent?.isGlobalCopy &&
                    // Si es global, solo el creador puede eliminar; si no es global, cualquiera puede eliminar
                    (
                      (agent?.isGlobal === true
                        ? user?.id?.split("_").pop() === agent?.createdBy
                        : true
                      )
                    )
                  ) && (
                    <li
                      onClick={async () => {

                        dispatch(setShowModal({
                          modal: 'deleteChats',
                          type: 'agents',
                          variant: 'confirm',
                          selectedOption: selectedAgent ? selectedAgent : selectedOption?.agent
                        }))
                        dispatch(setSelectedAgent(null));
                        setSelectedOption(null);
                        dispatch(getAgents({}));
                      }}
                    >
                      {t("deleteBot")}
                    </li>
                  )}
                {/* {user?.id?.split("_").pop() === agent?.createdBy && agent?.type !== "public" && ( */}
                <li
                  onClick={async () => {

                    dispatch(setShowModal({
                      modal: 'deleteChats',
                      type: 'emptyAgent',
                      variant: 'confirm',
                      chatList: chatList,
                      agent: agent
                    }))
                    dispatch(setEmptyChat("all"))
                    setSelectedOption(null);
                  }}
                >
                  {t("emptyAgent")}
                </li>
                {/* )} */}
              </>
            ) : (
              <>
                <li onClick={() => {
                  dispatch(setShowModal({
                    modal: 'deleteChats',
                    type: 'chats',
                    variant: 'simple',
                    selectedOption: selectedOption.chat
                  }))


                }}>
                  {t("deleteChat")}
                </li>
                <li
                  onClick={() =>
                    handleTogglePinnedChat(
                      selectedOption.chat.id,
                      selectedOption.chat.pinned
                    )
                  }
                >
                  {selectedOption.chat.pinned ? t("unpin") : t("pin")}{" "}
                  {t("chat")}
                </li>
                <li onClick={() => handleChangeName(selectedOption.chat?.id)}>
                  {t("changeName")}
                </li>
                <li onClick={async () => {
                  dispatch(setShowModal({
                    modal: 'deleteChats',
                    type: 'emptyChat',
                    variant: 'confirm',
                    currentChat: currentChat,
                  }))
                  setSelectedOption(null);
                }}>
                  {t("emptyChat")}
                </li>
              </>
            )}
          </ul>
        )}


        <div
          className={styles.newChatContainer}
          style={{
            // maxWidth: `${leftWidth || 0}px`,
            // maxWidth: "42%",
            width: isMobile ? "0px" : `${leftWidth ? leftWidth - 10 : 0}px`,
          }}
        >

          <button
            className={styles.communiti}
            onClick={(e) => {
              e.stopPropagation()
              selectedAgent ? onClicNewChat(e) : addMessage()
            }}
          >
            {selectedAgent ?
              <NewChatIconGreen />
              : <>
                <NewAgentIconGreen />
              </>
            }
            <div>{selectedAgent ? t('newChat') : t('newAgent')}</div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate('/admin/marketplace')
            }}
            className={styles.communiti}
          >
            <ExploreCommunitiIcon /> {t("exploreCommunity")}
          </button>
        </div>

      </div>
    </div>
  );
};



export default ChatExplorer;