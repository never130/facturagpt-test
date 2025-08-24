import React, { useEffect, useRef, useState } from "react";
import styles from "./panelAutomate.module.css";
import CardAutomate from "../Components/CardAutomate/CardAutomate";
import { AutomateDataComponent } from "../utils/automatesJson";
import { useDispatch, useSelector } from "react-redux";
import { setIsEditingAutomation } from "../../../../../slices/userSlices";
import ModalBlackBgTemplate from "../../ModalBlackBgTemplate/ModalBlackBgTemplate";
import { ReactComponent as MoreInfoIcon } from "../../../assets/moreInfoIcon.svg";
import CustomSearchbar from "../../CustomSearchbar/CustomSearchbar";
import SelectCurrencyPopup from "../../SelectCurrencyPopup/SelectCurrencyPopup";
import HeaderCard from "../../HeaderCard/HeaderCard";
import Button from "../../Button/Button";
import { ReactComponent as IconLock } from "../panelAutomate/assets/icon_lock.svg";
import AutomatesComponentOut from "../Components/AutomatesComponentOut/AutomatesComponentOut";
import AutomatesComponentIn from "../Components/AutomatesComponentIn/AutomatesComponentIn";
import {
  driveFiles,
  driveIsAuthenticated,
  getAutomatesByIds,
  getMessagesWhatsappAction,
  oneDriveFiles,
  oneDriveIsAuthenticated,
  outlookEmails,
  outlookIsAuthenticated,
  telematelFiles,
  tryConnectionAutomate,
  whatsappFiles,
} from "../../../../../actions/automate";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import FiltersDropdownContainer from "../../FiltersDropdownContainer/FiltersDropdownContainer";
import WorkflowComponent from "../Components/WorkflowComponent/WorkflowComponent";
import { set } from "date-fns";
import { createAgent } from "../../../../../actions/chat";
import { getAgents, getDefaultAutomateAgent } from "../../../../../actions/agents";
import { v4 as uuidv4 } from 'uuid';


const PanelAutomate = ({
  type,
  typeContent,
  isAnimating,
  automationData,
  setIsModalAutomate,
  typeVariableModal, 
  setTypeVariableModal,
  showVariableListModal, 
  setShowVariableListModal,
  showVariableModal, 
  setShowVariableModal,
  setShowSelectAgent,
  selectedAgent,
  setHideAutomate,
  setShowModal,
  configuration,
  setConfiguration,
  roleAutomate,
  setRoleAutomate,
  setIsAnimating,
  setTypeContentAutomate
}) => {
  const {
    selectedEmailConnection,
    automateSelected,
    automateNameTitleIn,
    automateNameTitleOut,
    filteredAutomateSelected,
  } = useSelector((state) => state.automate);
  const { isEditingAutomation,user } = useSelector((state) => state.user);
  const { userAutomations } = useSelector((state) => state.automate);
  const automate = useSelector((state) => state.automate);

  const location = useLocation();

  const data = AutomateDataComponent();

  const [t] = useTranslation("Panelautomate");
  
  const [dataFilter, setDataFilter] = useState(data);
  const [filterType, setfilterType] = useState(t("all"));
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [searchTerm, setSearchTerm] = useState("");
  const [renderKey, setRenderKey] = useState(0);
  const [showSelectCurrencyPopup, setShowSelectCurrencyPopup] = useState(false);
  const [saveConfiguration, setSaveConfiguration] = useState(false);
  const [filterCategory, setfilterCategory] = useState(null);
  const formAutomateContainerRef = useRef(null);
  const [categoryInput, setCategoryInput] = useState(null)
  const [categoryOutput, setCategoryOutput] = useState(null)
  const [filterUserAutomations, setFilterUserAutomations] = useState([]);
  // Estado global para saber si se está editando

  const [selectedOption, setSelectedOption] = useState({
    [t("orderByType")]: t('all'),

  });

  const options = [
    {
      name: "Orden Alfabético",
      label: t("alphabeticOrder"),
      subOptions: [
        { display: "A-Z", value: "A-Z" },
        { display: "Z-A", value: "Z-A" },
      ],
    },
    {
      name: t("orderByType"),
      label: t("orderByType"),
      subOptions: [
        { display: t('all'), value: t('all') },
        { display: t('input'), value: t('input') },
        { display: t('output'), value: t('output') },
      ],
    },
      {
      name: t("orderByCategory"),
      label: t("orderByCategory"),
      subOptions: [
        { display: t('Import'), value: t('Import') },
        { display: t('ERP'), value: t('ERP') },
        { display: t('CRM'), value: t('CRM') },
        { display: t('PublicAdministration'), value: t('PublicAdministration') },
        { display: t('Files'), value: t('Files') },
        { display: t('Communications'), value: t('Communications') },
        { display: t('Meetings'), value: t('Meetings') },
        { display: t('AI'), value: t('AI') },
        { display: t('HR'), value: t('HR') },
        { display: t('Logistics'), value: t('Logistics') },
        { display: t('Fintech'), value: t('Fintech') },
        { display: t('Ecommerce'), value: t('Ecommerce') },

      ],
    },




  ];

  const [activeCard, setActiveCard] = useState(null);
  const [cardSelected, setCardSelected] = useState(dataFilter.find((card) => card.id === 1));
  


  
  let title;
  if (roleAutomate === 'workflow') {
    title = t('updateWorkflow');
  } else if (type === "Gmail") {
    title = automateNameTitleIn;
  } else if (type === "Outlook") {
    title = automateNameTitleIn;
  } else if (type === "Google Drive") {
    title = automateNameTitleIn;
  } else if (type === "Dropbox") {
    title = automateNameTitleIn;
  } else if (type === "WhatsApp") {
    title = automateNameTitleIn;
  } else if (type === "One Drive") {
    title = automateNameTitleIn;
  } else if (type === "Sharepoint") {
    title = automateNameTitleIn;
  } else if (type === "SMTP") {
    title = automateNameTitleIn;
  } else if (type === "facturagpt") {
    title = automateNameTitleIn;
  } else {
    title = automateNameTitleOut;
  }


  const navigate = useNavigate()
  const dispatch = useDispatch();

  const close = () => {
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

 

  
  const handleDataFilter = (searchTerm) => {
    const filteredData = data.filter((card) =>
      card.automateName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDataFilter(filteredData);
  };



 const handleCardClick = (cardId) => {
    setActiveCard(cardId);
    const {id,...rest}  = dataFilter.find((card) => card.id === cardId)
   
        setCardSelected(rest)
  };

  const handleAddAutomation = async () => {

    setSaveConfiguration(true);
    setTimeout(() => setSaveConfiguration(false), 500);
  };


  const handleTestConnection = async () => {
    if (type === "Gmail") {
      if (automationData.selectedEmailConnection.email) {
        dispatch(tryConnectionAutomate({ id: automationData.id }));
      }
    } else if (type === "Outlook") {
      dispatch(outlookEmails({ automationId: automationData.id }));
    } else if (type === "Google Drive") {
      dispatch(driveFiles({ id: automationData.id }));
    } else if (type === "WhatsApp") {
      dispatch(whatsappFiles({ id: automationData.id }));
    } else if (type === "One Drive") {
      dispatch(oneDriveFiles({ id: automationData.id }));
    } else if (type === "Telematel") {
      const automateListId = filteredAutomateSelected.map((ele) => ele.id);
      dispatch(telematelFiles({ ids: automateListId }));
    }
  };



  const handleTestConnectionOut = (automateType) => {
    if (
      automateType === "Gmail" ||
      automateType === "Outlook" ||
      automateType === "Google Drive" ||
      automateType === "WhatsApp" ||
      automateType === "One Drive" ||
      automateType === "Sharepoint" ||
      automateType === "Dropbox"
    ) {
      return {
        height: "38px",
        minWidth: "160px",
        border: "1px solid gray",
        backgroundColor: "white",
        color: "gray",
      };
    } else if (filteredAutomateSelected.length === 0) {

      return {
        height: "38px",
        minWidth: "160px",
        border: "1px solid #ced1e4",
        backgroundColor: "white",
        color: "#ced1e4",
        cursor: "default",
      };
    } else {
      return {
        height: "38px",
        minWidth: "160px",
        border: "1px solid gray",
        backgroundColor: "white",
        color: "gray",
      };
    }
  };


  const handleShowTestConnection = () => {
    if (type === "Gmail") {
      return true;
    } else if (type === "Outlook") {
      return true;
    } else if (type === "Google Drive") {
      return true;
    } else if (type === "WhatsApp") {
      return true;
    } else if (type === "One Drive") {
      return true;
    } else if (type === "Dropbox") {
      return true;
    } else if (type === "Sharepoint") {
      return true;
    }
  }

  const orderedData = () => {
    dataFilter.sort((a, b) => {
      const order = selectedOption['Orden Alfabético'];
      const nameA = (
        a.type ||
        ""
      ).toLowerCase();
      const nameB = (
        b.type ||
        ""
      ).toLowerCase();
      if (order == "A-Z") return nameA.localeCompare(nameB);
      if (order == "Z-A") return nameB.localeCompare(nameA);
      return 0;
    })
  }


  


  useEffect(() => {
    const getAutomate = async () => {
      const searchParams = new URLSearchParams(location.search);
      const automationId = searchParams.get("automation");
  
      const response = await dispatch(getAutomatesByIds({ ids: [automationId] }));
  
      if (response?.payload?.success) {
        const automation = response.payload.automations[0];
        const automationType = automation?.type;
  
        const matched = data.find(item => item.type === automationType);
  
        if (matched) {
          setRoleAutomate(matched.role);
          
        }
  
        if(automation){
          typeContent(automationType, automation);
        }
      }
  
    };
  
    getAutomate();
  }, [location.search]); 
  
  useEffect(() => {
    setfilterType(selectedOption[t("orderByType")]);
  }, [selectedOption[t("orderByType")]]);

  useEffect(() => {
    setfilterCategory(selectedOption[t("orderByCategory")]);
  }, [selectedOption[t("orderByCategory")]]);

  useEffect(() => {
    orderedData();
  }, [selectedOption['Orden Alfabético']]);



  useEffect(() => {
     setCategoryInput(dataFilter.filter((card) => {
                     if(card.role === "input")  {
                      if(filterCategory)  return card.category == filterCategory
                     else  return card.role === "input"}} ).length)

                      setCategoryOutput(dataFilter.filter((card) => {
                     if(card.role === "output")  {
                      if(filterCategory)  return card.category == filterCategory
                     else  return card.role === "output"}} ).length)
  }, [filterCategory]);



  useEffect(() => {
    if (searchTerm === "") {
      setDataFilter(data);
    } else {
      handleDataFilter(searchTerm);
    }
  }, [searchTerm]);


  useEffect(() => {
    if (filterType === t('all')) {
      setRenderKey((prev) => prev + 1);
    } else if (filterType === t('input')) {
      setRenderKey((prev) => prev + 1);
    }
  }, [filterType]);

  useEffect(() => {
    const newData = [...data];
    setDataFilter(newData);
  }, [filterType]);


  useEffect(() => {
    if (userAutomations.length > 0) {
      const filterUserAutomations = userAutomations?.filter((automate) => {
        const foundAutomate = data?.find((ele) => {
          return ele.type === automate.type && ele.role === "input";
        });

        if (foundAutomate) {
          return foundAutomate;
        }

        return null;
      });
      setFilterUserAutomations(filterUserAutomations);
    }
  }, [userAutomations]);





  return (
    <ModalBlackBgTemplate
      close={close}
      isAnimating={isAnimating}
      cssToPanelAutomate="cssToPanelAutomate"
      setIsModalAutomate={setIsModalAutomate}
    >
      <div className={styles.container} style={{
        maxWidth:isEditingAutomation == 'setting'  ? '800px' : '80vw',
        maxHeight:isEditingAutomation == 'setting'  ? '80vh' : '95vh'
      }}>
        <div className={styles.content}>
          <HeaderCard
            title={title || t("addAutomation")}
            setState={() => {close()
              setTimeout(() => {
                  setIsModalAutomate(true);
                  setHideAutomate(false)
                }, 300);
            }}
            setIsModalAutomate={setIsModalAutomate}
            setHideAutomate={setHideAutomate}
            childrenLeft={<Button headerStyle={{ all: "unset" }}
              action={async () => {
                const responseDefaultAgent = await dispatch(getDefaultAutomateAgent());
                if(responseDefaultAgent?.payload?.count == 0){
                  const updatedUserData = {
                    name: 'agentDefault',
                    description: '',
                    category: '',
                    createdBy:user._id,
                    tone: 50,
                    answer: 50,
                    type: "public",
                    isGlobal: false,
                    isGlobalCopy: true,
                    isAutomateDefault: true,
                    Capabilities: [
                      {
                        webSearch: false,
                        dallEImageGeneration: false,
                        facturaGPTCodeInterpretor: false
                      }
                    ],
                  }
                  const responseCreateAgent = await dispatch(
                    createAgent({ userData: updatedUserData })
                  );
                  console.log('responseCreateAgent',responseCreateAgent?.payload?.agent._id)
                  if(responseCreateAgent?.payload?.agent._id){
                    navigate(`/admin/chat/${responseCreateAgent?.payload?.agent._id}/${uuidv4()}`, {
                      state: {
                        rowId: `${t('automationQuestion', { type })}`,
                        selectedAgentState: responseCreateAgent?.payload?.agent
                      },
                    });
                    // Cerrar después de un pequeño delay para asegurar que el navigate se complete
                    await dispatch(getAgents({}))
                    setTimeout(() => {
                      close();
                    }, 100);
                  }
                }else{
                  navigate(`/admin/chat/${responseDefaultAgent?.payload?.agents[0]._id}/${uuidv4()}`, {
                    state: {
                      rowId: `${t('automationQuestion', { type })}`,
                      selectedAgentState: responseDefaultAgent?.payload?.agents[0]
                    },
                  });
                  await dispatch(getAgents({}))
                  // Cerrar después de un pequeño delay para asegurar que el navigate se complete
                  setTimeout(() => {
                    close();
                  }, 100);
                }
          
                // if (selectedAgent._id) {
                //   navigate(`/admin/chat/${selectedAgent._id}`, {
                //     state: {
                //       rowId: `${t('automationQuestion', { type })}`,
                //       selectedAgentState: selectedAgent
                //     },
                //   });
                //   dispatch(setShowModal(false))
                // }else{
                //   dispatch(setShowModal('selectAgent'))
                // }

              }}>
                
              <MoreInfoIcon className={styles.moreInfoContainer} />
            </Button>}
          >
            <Button
              action={() => {
                setConfiguration({})
                setRoleAutomate('workflow')
              }}
            >
              icon 
              newWorkflow
            </Button>
            {selectedEmailConnection.email && handleShowTestConnection() ? (
              <Button
                action={() => {
                  filterUserAutomations.length > 0
                    ? handleTestConnection()
                    : null;
                }}
                headerStyle={handleTestConnectionOut(type)}
                filteredUserAutomationSelected={filteredAutomateSelected.length === 0}
              >
                {automate.loadingTryConnectionAutomate ? (
                  <span className={styles.loaderTestConnection}></span>
                ) : (
                  t("testConnection")
                )}
              </Button>
            ) : selectedEmailConnection && filteredAutomateSelected.length > 0 && (
              <Button
                action={() => {
                  filterUserAutomations.length > 0
                    ? handleTestConnection()
                    : null;
                }}
                headerStyle={handleTestConnectionOut(type)}
                filteredUserAutomationSelected={filteredAutomateSelected.length === 0}
              >
                {automate.loadingTryConnectionAutomate ? (
                  <span className={styles.loaderTestConnection}></span>
                ) : (
                  t("testConnection")
                )}
              </Button>
            )}
            <Button
              action={async () => {
                await handleAddAutomation();
                close();
                setTimeout(() => {
                  setIsModalAutomate(true);
                  setHideAutomate(false)
                }, 300);
              }}
            >
              {" "}
              {t("save")}
            </Button>
          </HeaderCard>

          <div className={styles.body}>
            <div className={styles.leftContainer}>
              <CustomSearchbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                father={"panelAutomate"}
                customStyle={{
                  justifyContent: "center"
                }}
              />
              <FiltersDropdownContainer
                setSelectedFilters={setSelectedOption}
                selectedFilters={selectedOption}
                options={options}
                father={"panelAutomate"}
              />

              {filterType === t("all") ? (
                <React.Fragment key={renderKey}>
                  <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                     {`(${categoryInput})`}
                     {" "}
                    {t("inputAutomations")}
                  </p>
                  <div className={styles.cardsContainer}>
                    {dataFilter.filter((card) => card.role === "input")
                      .length === 0
                      ? t("thereAreNoAutomationsAvailableInput")
                      : filterCategory ?  categoryInput == 0 ? t("thereAreNoAutomationsAvailableInput"):
                         dataFilter
                        .filter((card) => card.role === "input" && card.category == filterCategory)
                        .map((card, index) => (
                          <React.Fragment key={card.id}>
                            <CardAutomate
                              loadingTime={100}
                              fromPanel={true}
                              key={card.id}
                              type={card.type}
                              name={card.automateName}
                              image={card.image}
                              available={card.available}
                              contactType={card.contactType}
                              typeContent={typeContent}
                              isActive={activeCard === card.id}
                              onCardClick={() => handleCardClick()}
                              id={index}
                              automationData={automateSelected}
                              searchTerm={searchTerm}
                              description={card.description}
                              rol={card.role}
                              setRoleAutomate={setRoleAutomate}
                            />
                          </React.Fragment>
                        )) : dataFilter
                        .filter((card) => card.role === "input")
                        .map((card, index) => (
                          <React.Fragment key={card.id}>
                            <CardAutomate
                              fromPanel={true}
                              key={card.id}
                              type={card.type}
                              name={card.automateName}
                              image={card.image}
                              available={card.available}
                              contactType={card.contactType}
                              typeContent={typeContent}
                              isActive={activeCard === card.id}
                              onCardClick={() => handleCardClick(card.id)}
                              id={index}
                              automationData={automateSelected}
                              searchTerm={searchTerm}
                              description={card.description}
                              rol={card.role}
                              setRoleAutomate={setRoleAutomate}
                            />
                          </React.Fragment>
                        ))
                        }
                  </div>

                  <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {`(${categoryOutput})`}
                    {" "}
                    {t("outputAutomations")}
                  </p>
                  <div className={styles.cardsContainer}>
                    {dataFilter.filter((card) => card.role === "output")
                      .length == 0
                      ? t("thereAreNoAutomationsAvailableOutput")
                      : filterCategory ? categoryOutput == 0 ? t("thereAreNoAutomationsAvailableOutput") :
                       dataFilter
                        .filter((card) => card.role === "output" && card.category == filterCategory)
                        .map((card, index) => (
                          <React.Fragment key={card.id}>
                            <CardAutomate
                              key={card.id}
                              fromPanel={true}
                              type={card.type}
                              name={card.automateName}
                              image={card.image}
                              available={card.available}
                              contactType={card.contactType}
                              typeContent={typeContent}
                              isActive={activeCard === card.id}
                              onCardClick={() => handleCardClick(card.id)}
                              id={index}
                              automationData={automateSelected}
                              searchTerm={searchTerm}
                              description={card.description}
                              rol={card.role}
                              setRoleAutomate={setRoleAutomate}
                            />
                          </React.Fragment>
                        )) : dataFilter
                        .filter((card) => card.role === "output")
                        .map((card, index) => (
                          <React.Fragment key={card.id}>
                            <CardAutomate
                              key={card.id}
                              fromPanel={true}
                              type={card.type}
                              name={card.automateName}
                              image={card.image}
                              available={card.available}
                              contactType={card.contactType}
                              typeContent={typeContent}
                              isActive={activeCard === card.id}
                              onCardClick={() => handleCardClick(card.id)}
                              id={index}
                              automationData={automateSelected}
                              searchTerm={searchTerm}
                              description={card.description}
                              rol={card.role}
                              setRoleAutomate={setRoleAutomate}
                            />
                          </React.Fragment>
                        ))
                        }
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment key={renderKey}>
                  <p style={{ fontWeight: "bold" }}>
                    {filterType === t("input") ? (
                      <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {`(${categoryInput})`}
                        {" "}
                        {t("inputAutomations")}
                      </p>
                    ) : (
                      <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {`(${categoryOutput})`}
                        {" "}
                        {t("outputAutomations")}
                      </p>
                    )}
                  </p>
                  <div className={styles.cardsContainer}>
                    {filterCategory && filterType == t("output") && categoryOutput == 0 &&  <p>{`${t("thereNoAutomationsAvailableType")} ${filterType}`}</p>}
                    {filterCategory && filterType == t("input")  && categoryInput == 0 &&  <p>{`${t("thereNoAutomationsAvailableType")} ${filterType}`}</p>}
                    {filterCategory && filterType == t("output") && categoryOutput > 0 && dataFilter.filter(
                          (cardFilter) =>
                            cardFilter.role ===
                            (filterType === t("input") ? "input" : "output") && cardFilter.category == filterCategory
                          )
                         .map((card, index) => {
                          return (
                            <React.Fragment key={card.id}>
                              <CardAutomate
                                key={card.id}
                                fromPanel={true}
                                type={card.type}
                                name={card.automateName}
                                image={card.image}
                                available={card.available}
                                contactType={card.contactType}
                                typeContent={typeContent}
                                isActive={activeCard === card.id}
                                onCardClick={() => handleCardClick(card.id)}
                                id={index}
                                automationData={automateSelected}
                                searchTerm={searchTerm}
                                description={card.description}
                                rol={card.role}
                              setRoleAutomate={setRoleAutomate}
                              />
                            </React.Fragment>
                          );
                         })}

                          {filterCategory && filterType == t("input") && categoryInput > 0 && dataFilter.filter(
                          (cardFilter) =>
                            cardFilter.role ===
                            (filterType === t("input") ? "input" : "output") && cardFilter.category == filterCategory
                          )
                         .map((card, index) => {
                          return (
                            <React.Fragment key={card.id}>
                              <CardAutomate
                                key={card.id}
                                fromPanel={true}
                                type={card.type}
                                name={card.automateName}
                                image={card.image}
                                available={card.available}
                                contactType={card.contactType}
                                typeContent={typeContent}
                                isActive={activeCard === card.id}
                                onCardClick={() => handleCardClick(card.id)}
                                id={index}
                                automationData={automateSelected}
                                searchTerm={searchTerm}
                                description={card.description}
                                rol={card.role}
                              setRoleAutomate={setRoleAutomate}
                              />
                            </React.Fragment>
                          );
                         })}

                         {!filterCategory && dataFilter.length > 0 && dataFilter.filter(
                          (cardFilter) =>
                            cardFilter.role ===
                            (filterType === t("input") ? "input" : "output")
                          )
                         .map((card, index) => {
                          return (
                            <React.Fragment key={card.id}>
                              <CardAutomate
                                key={card.id}
                                fromPanel={true}
                                type={card.type}
                                name={card.automateName}
                                image={card.image}
                                available={card.available}
                                contactType={card.contactType}
                                typeContent={typeContent}
                                isActive={activeCard === card.id}
                                onCardClick={() => handleCardClick(card.id)}
                                id={index}
                                automationData={automateSelected}
                                searchTerm={searchTerm}
                                description={card.description}
                                rol={card.role}
                              setRoleAutomate={setRoleAutomate}
                              />
                            </React.Fragment>
                          );
                         })}

                         {!filterCategory && dataFilter.length <= 0 && `${t("thereNoAutomationsAvailableType")} ${filterType}`}
                  </div>
                </React.Fragment>
              )}
            </div>
            <div
              className={styles.formAutomateContainer}
              ref={formAutomateContainerRef}
            >
              {roleAutomate == 'input' ? (
                <AutomatesComponentIn
                  type={type}
                  cardSelected={cardSelected}
                  typeContent={typeContent}
                  isAnimating={isAnimating}
                  automationData={automationData}
                  formAutomateContainerRef={formAutomateContainerRef}
                  saveConfiguration={saveConfiguration}
                  setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
                  setSelectedCurrency={setSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  typeVariableModal={typeVariableModal}
                  setTypeVariableModal={setTypeVariableModal}
                  showVariableListModal={showVariableListModal}
                  setShowVariableListModal={setShowVariableListModal}
                  showVariableModalIn={showVariableModal}
                  configuration={configuration} 
                  setConfiguration={setConfiguration}
                  selectedAgent={selectedAgent}
                  setShowVariableModalIn={setShowVariableModal}
                  toggleChatSettings={isEditingAutomation}
                  setToggleChatSettings={(value) => dispatch(setIsEditingAutomation(value))}
                />
              ) : roleAutomate == 'output' ? (
                <AutomatesComponentOut
                  type={type}
                  typeContent={typeContent}
                  isAnimating={isAnimating}
                  automationData={automationData}
                  formAutomateContainerRef={formAutomateContainerRef}
                  saveConfiguration={saveConfiguration}
                  setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
                  setSelectedCurrency={setSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  close={close}
                  setIsModalAutomate={setIsModalAutomate}
                  setHideAutomate={setHideAutomate}
                  cardSelected={cardSelected}
                  selectedAgent={selectedAgent}
                  typeVariableModal={typeVariableModal}
                  setTypeVariableModal={setTypeVariableModal}
                  showVariableListModal={showVariableListModal}
                  setShowVariableListModal={setShowVariableListModal}
                  showVariableModal={showVariableModal}
                  setShowVariableModal={setShowVariableModal}
                  configuration={configuration} 
                  setConfiguration={setConfiguration}
                  toggleChatSettings={isEditingAutomation}
                  setToggleChatSettings={(value) => dispatch(setIsEditingAutomation(value))}
                  setRoleAutomate={setRoleAutomate}
                />
              ): roleAutomate == 'workflow' ? (
                <WorkflowComponent   
                type={type}
                typeContent={typeContent}
                isAnimating={isAnimating}
                automationData={automationData}
                formAutomateContainerRef={formAutomateContainerRef}
                saveConfiguration={saveConfiguration}
                setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
                setSelectedCurrency={setSelectedCurrency}
                selectedCurrency={selectedCurrency}
                close={close}
                setIsModalAutomate={setIsModalAutomate}
                setHideAutomate={setHideAutomate}
                cardSelected={cardSelected}
                selectedAgent={selectedAgent}
                typeVariableModal={typeVariableModal}
                setTypeVariableModal={setTypeVariableModal}
                showVariableListModal={showVariableListModal}
                setShowVariableListModal={setShowVariableListModal}
                showVariableModal={showVariableModal}
                setShowVariableModal={setShowVariableModal}
                                  configuration={configuration} 
                  setConfiguration={setConfiguration}
                  toggleChatSettings={isEditingAutomation}
                  setToggleChatSettings={(value) => dispatch(setIsEditingAutomation(value))}
                  roleAutomate={roleAutomate}
                  setRoleAutomate={setRoleAutomate}/>
              ): null}

              <div className={styles.footer}>
                <IconLock />
                <span>{t("facturaWillAnalyzeData")}</span>
              </div>
            </div>
          </div>

          {showSelectCurrencyPopup && (
            <SelectCurrencyPopup
              setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
              setSelectedCurrency={setSelectedCurrency}
              selectedCurrency={selectedCurrency}
            />
          )}
        </div>

      </div>
    </ModalBlackBgTemplate>
  );
};

export default PanelAutomate;
