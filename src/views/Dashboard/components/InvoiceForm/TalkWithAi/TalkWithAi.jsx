import React, { useEffect, useRef, useState } from "react";
import ChatView, { ChatBody } from "../../../screens/ChatView/ChatView";
import CorporativeModalText from "../../CorporativeModalText/CorporativeModalText";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchByChat, getAgentById, getChatAgents } from "../../../../../actions/chat";
import { apiUrl } from "../../../../../apiBackend.js";
import { getAgents } from "../../../../../actions/agents.js";
import { v4 as uuidv4 } from "uuid";


const TalkWithAi = ({ stateDoc }) => {
  const [t] = useTranslation("ChatView");
  // const [tempInstruction, setTempInstruction] = useState("");
  // const [language, setlanguage] = useState("");
  // const [filePayload, setFilePayload] = useState(null);
  // const [tokenInput, setTokenInput] = useState(0)
  // const { user } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  // const [isLoadBot, setIsLoadBot] = useState(false);
  // const { id } = useParams();
  // const [finishedResponseBot, setFinishedResponseBot] = useState(false)
  // const [localAgentId, setLocalAgentId] = useState(stateDoc._id);
  // const [autoClear, setAutoClear] = useState(false)
  // const [localAgent, setLocalAgent] = useState(
  //   {
  //     Capabilities: [],
  //     pinned: false,
  //     tone: 50,
  //     answer: 50,
  //     workspaces: [],
  //     type: "private",
  //     typePay: "singlePayment"
  //   }
  // );
  // const { agents, fatherNewAgent, idFatherNewAgent } = useSelector(
  //   (state) => state.agents
  // );


  // useEffect(() => {
  //   stateDoc._id ? setLocalAgentId(stateDoc._id) : setLocalAgentId(id);
  //   if (!agents.length > 0) {
  //     const fn = async () => {
  //       let agents = await dispatch(getAgents({}));
  //       agents.payload;

  //       if (
  //         agents.payload &&
  //         agents.payload.agents &&
  //         Array.isArray(agents.payload.agents)
  //       ) {
  //         if (stateDoc._id || id) {
  //           const selectedAgent = stateDoc._id
  //             ? agents.payload.agents.find(
  //               (agent) => agent._id === stateDoc._id
  //             )
  //             : agents.payload.agents.find((agent) => agent._id === id);

  //           if (selectedAgent) {
  //             setLocalAgent(selectedAgent);
  //           }
  //         }
  //       }
  //     };
  //     fn();
  //   }

  //   if (agents && agents.agents && Array.isArray(agents.agents)) {
  //     if (stateDoc._id || id) {
  //       const selectedAgent = stateDoc._id
  //         ? agents.agents.find((agent) => agent._id === stateDoc._id)
  //         : agents.agents.find((agent) => agent._id === id);

  //       if (selectedAgent) {
  //         setLocalAgent(selectedAgent);
  //       }
  //     }
  //   }
  // }, []);


  // useEffect(() => {
  //   if (stateDoc._id) {
  //     dispatch(fetchByChat({ chatId: stateDoc._id }));
  //   }
  // }, [dispatch, stateDoc._id]);







  // const [tokenOutput, setTokenOutput] = useState(0)
  // const [timeToFinishResponse, setTimeToFinishResponse] = useState(0)
  // const [showInfoMessage, setShowInfoMessage] = useState(false)
  // const [messages, setMessages] = useState([]);

  // const [isPaused, setIsPaused] = useState(false);

  // const isPausedRef = useRef(false);

  // useEffect(() => {
  //   isPausedRef.current = isPaused;
  // }, [isPaused]);


  // const waitWhilePaused = async () => {
  //   while (isPausedRef.current) {
  //     await new Promise(resolve => setTimeout(resolve, 200));
  //   }
  // };



  // const handleSendMessage = async (
  //   text = false,
  //   agentInfo,
  //   agentName,
  //   agentId,
  //   file,
  //   newChat
  // ) => {

  //   try {
  //     setIsLoadBot(true);
  //     if (text) {
  //       setMessages((prevMessages) => {
  //         const newMessages = [
  //           ...prevMessages,
  //           {
  //             text: text,
  //             type: "me",
  //             agent: agentName,
  //             fileName: file?.name,
  //             fileType: file?.type,
  //           },
  //         ];

  //         const groupedMessages = newMessages.reduce((acc, message) => {
  //           let date = new Date(message.timestamp);
  //           if (isNaN(date.getTime())) {
  //             date = new Date();
  //           }
  //           const dayKey = date.toDateString();

  //           if (!acc[dayKey]) {
  //             acc[dayKey] = [];
  //           }
  //           acc[dayKey].push(message);
  //           return acc;
  //         }, {});


  //         return newMessages;
  //       });

  //       setInputValue("");
  //     }

  //     const userStorage = localStorage.getItem("user");

  //     const userJson = JSON.parse(userStorage);
  //     const token = userJson.accessToken;
  //     const new_id = uuidv4();
  //     let selectedChat;
  //     selectedChat = new_id;

  //     if (newChat) {
  //       setIsLoadBot(false);
  //       // setMessages("");
  //     } else {
  //       const startTime = Date.now();
  //       const frontendTime = Date.now();
  //       await fetch(`${apiUrl}/api/chat/${agentName}/${selectedChat}/messages`, {
  //         method: "POST",
  //         body: JSON.stringify({
  //           text: text,
  //           agent: agentName,
  //           tone: agentInfo.tone,
  //           answer: agentInfo.answer,
  //           description: agentInfo.description,
  //           contactId: agentInfo.contactId,
  //           docId: agentInfo._id,
  //           file: file,
  //           language: user?.language,
  //           typeChat: 'docConfiguration'

  //         }),
  //         headers: {
  //           "Content-Type": "application/octet-stream",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }).then((response) => {

  //         if (response.ok) {
  //           const reader = response.body.getReader();
  //           const decoder = new TextDecoder();
  //           let accumulatedChunks = "";
  //           let accumulatedText = "";

  //           const insertMessageBot = ({
  //             text,
  //             isGraph = false,
  //             isApi = false,
  //             isAction = false,
  //             isTable = false,
  //             isAutomate = false,
  //           }) => {
  //             setMessages((prevMessages) => {
  //               const newMessages = [...prevMessages];

  //               if (isAction) {
  //                 accumulatedText = JSON.parse(text);
  //               } else {
  //                 accumulatedText += text;
  //               }

  //               if (
  //                 newMessages.length > 0 &&
  //                 newMessages[newMessages.length - 1].type === "bot"
  //               ) {
  //                 newMessages[newMessages.length - 1].text = accumulatedText;
  //                 newMessages[newMessages.length - 1].isGraph = isGraph;
  //                 newMessages[newMessages.length - 1].isApi = isApi;
  //                 newMessages[newMessages.length - 1].isAction = isAction;
  //                 newMessages[newMessages.length - 1].isTable = isTable;
  //                 newMessages[newMessages.length - 1].isAutomate = isAutomate;
  //               } else {
  //                 newMessages.push({
  //                   text: accumulatedText,
  //                   type: "bot",
  //                   isGraph: isGraph,
  //                   isApi: isApi,
  //                   isAction: isAction,
  //                   isTable: isTable,
  //                   isAutomate: isAutomate,
  //                 });
  //               }
  //               return newMessages;
  //             });
  //           };

  //           const processStream = async () => {

  //             while (true) {
  //               await waitWhilePaused();

  //               const { done, value } = await reader.read();
  //               if (done) {
  //                 setFinishedResponseBot(true)
  //                 setIsLoadBot(false);
  //                 break;
  //               }

  //               const chunk = decoder.decode(value, { stream: true });

  //               accumulatedChunks += chunk;

  //               let lines = accumulatedChunks.split("\n");
  //               accumulatedChunks = lines.pop();

  //               for (const line of lines) {
  //                 if (line.trim()) {
  //                   try {
  //                     const chunk = JSON.parse(line);
  //                     const { text, type } = chunk.data;
  //                     setTokenOutput(chunk?.data?.output.token)
  //                     setShowInfoMessage(true)

  //                     const firstBackendResponseTime = Date.now();
  //                     const timeDiffMs = firstBackendResponseTime - startTime;

  //                     setTimeToFinishResponse(timeDiffMs);



  //                     if (type === "graph") {
  //                       let mermaidCode = '';

  //                       const corporateColors = {
  //                         primary: 'green',
  //                         secondary: 'teal',
  //                         accent: 'darkgreen',
  //                         light: 'lightgreen',
  //                         dark: 'darkgreen',
  //                         neutral: 'grey'
  //                       };

  //                       switch (text.style) {
  //                         case 'pie':
  //                           mermaidCode = `pie
  //                           title "${text.data.title || "Distribución"}"
  //                           ${text.data.slices
  //                               .map(slice => `"${slice.label}" : ${slice.value}`)
  //                               .join("\n")}`;
  //                           break;

  //                         case 'bar':
  //                           mermaidCode = `xychart-beta
  //                           title "${text.data.title || "Valores"}"
  //                           x-axis [${text.data.bars.map(bar => `"${bar.label}"`).join(", ")}]
  //                           y-axis "Valores" 0 --> ${Math.max(...text.data.bars.map(bar => bar.value))}
  //                           bar [${text.data.bars.map(bar => bar.value).join(", ")}]`;
  //                           break;

  //                         case 'flow':
  //                           mermaidCode = `flowchart TD
  //                           ${text.data.nodes
  //                               .map(node => `${node.id}["${node.label}"]`)
  //                               .join("\n")}
  //                           ${text.data.edges
  //                               .map(edge => `${edge.from} --> ${edge.to}`)
  //                               .join("\n")}`;
  //                           break;

  //                         case 'sequence':
  //                           mermaidCode = `sequenceDiagram
  //                           participant A as "${text.data.participants[0]}"
  //                           participant B as "${text.data.participants[1]}"
  //                           ${text.data.messages
  //                               .map(msg => `${msg.from}->>+${msg.to}: ${msg.text}`)
  //                               .join("\n")}`;
  //                           break;

  //                         default:
  //                           mermaidCode = `pie
  //                           title "Sin datos"
  //                           "Sin datos" : 100`;
  //                       }


  //                       const graphId = `mermaid-${Date.now()}`;

  //                       try {

  //                         const { svg } = await mermaid.render(
  //                           graphId,
  //                           mermaidCode
  //                         );

  //                         insertMessageBot({
  //                           text: `<div class="${styles.mermaidGraph}">${svg}</div>`,
  //                           isGraph: true,
  //                         });
  //                       } catch (mermaidError) {
  //                         console.error(
  //                           "Error renderizando gráfico:",
  //                           mermaidError
  //                         );
  //                         insertMessageBot({
  //                           text: `Error en el gráfico`,
  //                         });
  //                       }
  //                     } else if (type == "table") {
  //                       accumulatedText = ""
  //                       insertMessageBot({ text, isTable: true });
  //                     } else if (type === "automate") {
  //                       insertMessageBot({ text, isAutomate: true });
  //                     } else if (type === "api") {
  //                       insertMessageBot({ text, isApi: true });
  //                     } else if (type == "voice") {
  //                       accumulatedText = ""
  //                       insertMessageBot({ text, isVoice: true });
  //                       const texto = new SpeechSynthesisUtterance(text);
  //                       texto.lang = "es-ES";
  //                       window.speechSynthesis.speak(texto);
  //                     } else if (type == "action") {
  //                       accumulatedText = ""
  //                       insertMessageBot({ text, isAction: true });
  //                     } else if (type == "pause") {
  //                       accumulatedText = ""
  //                       setMessages((prevMessages) => {
  //                         const newMessages = [...prevMessages];
  //                         newMessages.push({ text: "parar el mensaje", type: "pause" });
  //                         return newMessages;
  //                       });

  //                     } else {


  //                       insertMessageBot({ text });
  //                     }
  //                   } catch (error) {
  //                     console.error("Failed to parse JSON:", error);
  //                   }
  //                 }
  //               }
  //             }
  //           };

  //           processStream()
  //             .then(() => { })
  //             .catch(console.error);
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.error("error handleSendMessage", error);
  //   }
  // };


  // const handleChat = (action) => {

  //   handleSendMessage(action.text, stateDoc, stateDoc.filename, action.file);
  // };

  // const navigate = useNavigate();

  // const [inputValue, setInputValue] = useState("");

  // const [isTokenValid, setIsTokenValid] = useState(false);


  // const [showCorporativeModal, setShowCorporativeModal] = useState(false);
  // const [corporativeTitle, setCorporativeTitle] = useState("");
  // const [corporativeMessage, setCorporativeMessage] = useState("");



  // const { userAutomations } = useSelector((state) => state.automate);

  // const filteredData = userAutomations.filter((item) => {
  //   return true;
  // });


  // useEffect(
  //   () => {
  //     const search = async () => {
  //       const res = await dispatch(
  //         getChatAgents({ agentName: stateDoc.filename, type: 'docConfiguration' })
  //       );
  //       setMessages(res.payload.messages || []);
  //       setAutoClear(res.payload.autoClear)
  //     };
  //     search();
  //   },
  //   [stateDoc]
  // );

  // const [containsArroba, setContainsArroba] = useState(null)
  // const [arrobaCount, setArrobaCount] = useState(0)
  // const [selectItemCount, setSelectItemCount] = useState(0)
  // const [showMiniProfileModal, setShowMiniProfileModal] = useState()
  // const [itemsSelected, setItemsSelected] = useState([])

  // const { rowId, selectedAgentState } = location.state || {};

  // useEffect(() => {
  //   if (inputValue.includes("@")) {
  //     const countArroba = (text) => text.split('@').length - 1;
  //     const currentCount = countArroba(inputValue)
  //     if (currentCount < arrobaCount) {
  //       setSelectItemCount(selectItemCount - 1)
  //       setArrobaCount(arrobaCount)
  //       let newItemsSelected = [...itemsSelected]
  //       newItemsSelected = newItemsSelected.slice(0, -1)
  //       setItemsSelected([...newItemsSelected])
  //     }
  //     setArrobaCount(currentCount)
  //     if (currentCount > selectItemCount) {
  //       setContainsArroba(true)
  //     } else setContainsArroba(false)
  //   } else {
  //     setSelectItemCount(0)
  //     setItemsSelected([])
  //     setContainsArroba(false)
  //   }
  // }, [inputValue])



  // const parseText = (text) => {
  //   const regex = /(@\w+)/g;
  //   const parts = text.split(regex);
  //   return parts.map((part, index) => {
  //     if (part.startsWith('@')) {
  //       return (
  //         <span onMouseEnter={() => { if (part != "@not" && !containsArroba) setShowMiniProfileModal(((index + 1) / 2) - 1) }}
  //           onMouseLeave={() => setShowMiniProfileModal(false)} key={index} className={styles.mentionWrapper}>

  //           <span
  //             key={index}
  //             className={styles.arrobaText}
  //             onClick={() => {
  //               if (part != "@not" && !containsArroba) {
  //                 if ("name" in itemsSelected[((index + 1) / 2) - 1]) {
  //                   dispatch(setAsset(itemsSelected[((index + 1) / 2) - 1]));
  //                   navigate(`/admin/assets/${itemsSelected[((index + 1) / 2) - 1]._id}`, { state: { backgroundLocation: location } });
  //                 } else if ("contactName" in itemsSelected[((index + 1) / 2) - 1]) {
  //                   dispatch(setContact(itemsSelected[((index + 1) / 2) - 1]));
  //                   navigate(`/admin/contacts/${itemsSelected[((index + 1) / 2) - 1]._id}`, { state: { backgroundLocation: location } });
  //                 }
  //               }
  //             }}
  //           >
  //             {part}
  //           </span>
  //           {showMiniProfileModal === ((index + 1) / 2) - 1 &&
  //             <MiniProfileModal item={itemsSelected[((index + 1) / 2) - 1]} showMiniProfileModal={showMiniProfileModal} index={((index + 1) / 2) - 1} name={itemsSelected[((index + 1) / 2) - 1]?.name ? itemsSelected[((index + 1) / 2) - 1].name : itemsSelected[((index + 1) / 2) - 1]?.contactName ? itemsSelected[((index + 1) / 2) - 1].contactName : ""}
  //               email={itemsSelected[((index + 1) / 2) - 1]?.companyEmail ? itemsSelected[((index + 1) / 2) - 1].companyEmail : itemsSelected[((index + 1) / 2) - 1]?.description ? itemsSelected[((index + 1) / 2) - 1].description : ""}
  //               imageUrl={itemsSelected[((index + 1) / 2) - 1]?.image ? itemsSelected[((index + 1) / 2) - 1].image : ImageEmpty} />}
  //         </span>
  //       );
  //     }
  //     return part;
  //   });
  // };





  return (
    <div>



<ChatView typeChat={'docConfiguration'}/>

    </div>
  );
};

export default TalkWithAi;
