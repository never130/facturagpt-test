import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomAgent.module.css";
import CustomAutomationsWrapper from "../../../../CustomAutomationsWrapper/CustomAutomationsWrapper";
import { ReactComponent as GreenCheck } from "../../../../../assets/GreenCheck.svg";
import { ReactComponent as AutomateBlack } from "../../../../../assets/automateBlack.svg";
import OptionsSwitchComponent from "../../../../OptionsSwichComponent/OptionsSwitchComponent";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAgents, getAgentsByIds } from "../../../../../../../actions/agents";
import { getImagesAgents } from "../../../../../../../actions/chat";


import { ReactComponent as IconOpenAI } from "../../../../../assets/icon-openai.svg";
import { ReactComponent as IconAutomate } from "../../../../../assets/icon-automate.svg";
import { ReactComponent as IconVerify } from "../../../../../assets/icon-verify.svg";
import { ReactComponent as IconStar } from "../../../../../assets/icon-star.svg";
import { ReactComponent as IconAttach } from "../../../../../assets/icon-attach.svg";
import { ReactComponent as IconAgent } from "../../../../../assets/agent.svg";
import { ReactComponent as IconSearch } from "../../../../../assets/searchGray.svg";

import { formatAgoDate } from "../../../../../../../utils/agoDateUtil";


const CustomAgent = ({
  configuration = {  },
  handleConfigurationChange,
  icon,
  action,
  emailConnections = [],
  selectedEmailConnection,
  setSelectedEmailConnection,
  placeholder,
  headerStyle = {},
  setShowCategory,
  setShowGmailModalAddConnection,
}) => {
  const [t] = useTranslation(["AutomatesComponent","Preview"]);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [showContent, setShowContent] = useState({
    info1: false,
    info2: false,
    info3: false,
    info4: false,
    info5: false,
    info6: false,
    info7: false,
    info8: false,
    info9: false,
  });

  const handleSetShowContent = (content) => {
    setShowContent({
      ...showContent,
      [content]: !showContent[content],
    });
  };

  const {
    agents,
    loading: loadingAgent,
    error,
    selectedAgentSlice,
  } = useSelector((state) => state.agents);


  useEffect(() => {
    dispatch(getAgents());
  }, []);
  
  
  useEffect(() => {
    if(configuration?._id && configuration?.agents && configuration.agents.length > 0){
      dispatch(getAgentsByIds(configuration.agents));
    }
  }, [configuration._id])
console.log('agents',agents)
  useEffect(() => {
    if (agents.success) {
      setFilteredAgents(agents.agents);
      if (configuration?.agents && Array.isArray(configuration.agents)) {
        const initialSelectedAgents = agents.agents.filter(agent => 
          configuration.agents.includes(agent._id)
        );
        setSelectedAgents(initialSelectedAgents);
        
        // Aplicar imágenes a selectedAgents también
        fetchImages(initialSelectedAgents).then(updatedAgents => {
          if (updatedAgents) {
            setSelectedAgents(updatedAgents);
          }
        });
      }
      setShowSearchResults(true);
    }
  }, [agents]);

  // Función para obtener las imágenes de los agentes
  const fetchImages = async (agentsList) => {
    console.log('colocando imagenes', agentsList.length);
    try {
      if (!agentsList || agentsList.length === 0) return;
      
      const agentIds = agentsList.map(agent => agent._id);
      console.log('agentIds para obtener imágenes:', agentIds);
      
      const response = await dispatch(getImagesAgents({ agentIds }));
      const images = response.payload.images;
      console.log('imágenes obtenidas:', images);

      const updatedAgents = agentsList.map((agent) => {
        const image = images.find((img) => img._id === agent._id)?.image;
        console.log(`Agente ${agent.name}: imagen encontrada:`, image);
        return {
          ...agent,
          image,
        };
      });

      console.log('agentes actualizados con imágenes:', updatedAgents);
      return updatedAgents;
    } catch (error) {
      console.error("Error al obtener las imágenes de los agentes:", error);
      return agentsList;
    }
  };

  // Aplicar imágenes a filteredAgents solo al cargar
  useEffect(() => {
    console.log('useEffect fetchImages ejecutándose');
    console.log('filteredAgents.length:', filteredAgents.length);
    console.log('agents.success:', agents.success);
    
    if (filteredAgents.length > 0 && agents.success) {
      // Solo ejecutar fetchImages si no se han obtenido las imágenes antes
      const hasImages = filteredAgents.some(agent => agent.image);
      console.log('¿Ya tiene imágenes?', hasImages);
      
      if (!hasImages) {
        console.log('Ejecutando fetchImages...');
        fetchImages(filteredAgents).then(updatedAgents => {
          if (updatedAgents) {
            console.log('Actualizando filteredAgents con imágenes');
            setFilteredAgents(updatedAgents);
          }
        });
      } else {
        console.log('Ya tiene imágenes, no se ejecuta fetchImages');
      }
    }
  }, [agents.success]); // Solo al cargar los agentes

  // Controlar cuándo mostrar resultados de búsqueda
  useEffect(() => {
    if (searchValue || filteredAgents.length > 0) {
      setShowSearchResults(true);
    }
  }, [searchValue, filteredAgents.length]);

  // Función para obtener agentes filtrados al momento de renderizar
  const getFilteredAgentsForRender = () => {
    let filtered = filteredAgents;
    
    // Aplicar filtro de búsqueda
    if (searchValue) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    // Excluir agentes ya seleccionados
    filtered = filtered.filter(agent =>
      !selectedAgents.some(selected => selected._id === agent._id)
    );
    
    return filtered;
  };

  const handleAgentSelect = (agent) => {
    const isSelected = selectedAgents.some(selected => selected._id === agent._id);
    let newSelectedAgents;
    
    if (isSelected) {
      newSelectedAgents = selectedAgents.filter(selected => selected._id !== agent._id);
    } else {
      // Asegurar que el agente tenga su imagen antes de agregarlo
      const agentWithImage = agent.image ? agent : { ...agent, image: null };
      newSelectedAgents = [...selectedAgents, agentWithImage];
    }
    
    setSelectedAgents(newSelectedAgents);
    
    const agentIds = newSelectedAgents.map(agent => agent._id);
    handleConfigurationChange('agents', agentIds);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    // Pequeño delay para permitir que se procesen los clics en los resultados
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  };

  return (
    <CustomAutomationsWrapper
      Icon={<IconAgent />}
      showContent={showContent.info1}
      className={styles.hiddenMobile}
    >
      <div
        className={styles.infoContainerWrapper}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {showContent.info1 && <GreenCheck />}
          <div className={styles.infoContainer}>
            <div>
              Personaliza el orquestador
            </div>
            <span>
              Realiza una acción específica en tus agentes.
            </span>
          </div>
        </div>
        <OptionsSwitchComponent
          border={"none"}
          marginLeft={"auto"}
          isChecked={showContent.info1}
          setIsChecked={(value) => {
            handleSetShowContent("info1");
          }}
        />
      </div>

      {showContent.info1 && (
        <div className={styles.containerAgents}>
          <div className={styles.searchContainer}>
            <IconSearch />
            <input
              type="text"
              placeholder="Buscar agente"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            <div className={styles.searchContainerShortcuts}>
              K
            </div>
          </div>
       {isSearchFocused && (
         <div className={styles.customAgentsContainer}>
           {(showSearchResults && getFilteredAgentsForRender()?.length === 0) && (
              <div className={styles.noResultsContainer}>
                <span>
                  {t("noResults")}
                </span>
                <p>
                  {t("noResultsDescription")}
                </p>
              </div>
            )}
              {showSearchResults && getFilteredAgentsForRender()?.length > 0 && (
              <ul className={styles.searchContainerList}>
                {getFilteredAgentsForRender()?.map((item, index) => (
                  <AgentItem 
                    key={index} 
                    agent={item} 
                    onSelect={handleAgentSelect}
                    isSelected={selectedAgents.some(selected => selected._id === item._id)}
                  />
                ))}
              </ul>
            )}
         </div>
       )}
          <ul className={styles.containerListAgents}>
            {selectedAgents?.map((item, index) => (
              <AgentItem 
                key={index} 
                agent={item} 
                onSelect={handleAgentSelect}
                isSelected={true}
              />
            ))}
          </ul>
        
        </div>
      )}
    </CustomAutomationsWrapper>
  );
};

export default CustomAgent;



const AgentItem = ({ agent, onSelect, isSelected }) => {
  const [t] = useTranslation("AutomatesComponent");
  const navigate = useNavigate();

  const openAgentModal = (agent) => {
    navigate(`/admin/bot/${agent._id}`)
  }

  return (
    <li
      className={styles.agentItem}
      onClick={() => onSelect(agent)}
    >
      {/* <input 
        type="checkbox" 
        checked={isSelected}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect(agent);
        }}
      /> */}
      {agent.image ? (
        <div className={styles.agentItemIcon}>
          <img src={agent.image} alt="agent" />
        </div>
      ) : (

        <div className={styles.agentItemIcon}>
         <IconAgent />
      </div>
      )}
      <div className={styles.agentItemInfo}>
        <p>
          {agent.name}
          {' '}
          <IconStar />

        </p>
        <span>
          {agent.description}

        </span>
      </div>
      <div className={styles.agentItemActions}>
        {/* <div className={styles.agentItemActionsInfo}>
          FacturaGPT
          <IconVerify />
        </div> */}
        <div className={styles.agentItemActionsItem}>
          <span>
            {formatAgoDate({dateString: agent.createdAt,t})}
          </span>
          <div className={styles.agentItemActionsItemLabel}>
            <AutomateBlack />
            5
          </div>
        </div>
      </div>
    </li>
  );
};