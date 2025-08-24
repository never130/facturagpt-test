import React, { useEffect, useState,useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAgents } from "../../../../../actions/agents";
import { getImagesAgents } from "../../../../../actions/chat";
import { formatAgoDate } from "../../../../../utils/agoDateUtil";
import ImageEmpty from "../../../assets/ImageEmpty.svg";
import Button from "../../../components/Button/Button";
import HeaderCard from "../../../components/HeaderCard/HeaderCard";
import ModalBlackBgTemplate from "../../../components/ModalBlackBgTemplate/ModalBlackBgTemplate";
import styles from "./SelectAgentModal.module.css";
import PaginationTables from "../../../components/PaginationTables/PaginationTables";
import SearchIconWithIcon from "../../../components/SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../../utils/useFocusShortcut";
import { setSelectedAgent } from "../../../../../slices/chatSlices";
import FiltersDropdownContainer from "../../../components/FiltersDropdownContainer/FiltersDropdownContainer";
import {  setGlobalSearch } from "../../../../../slices/userSlices";

import KIcon from "../../../assets/KIcon.svg";

import { v4 as uuidv4 } from 'uuid';

const SelectAgentModal = ({ close, setState, finalTranscript,globalSearch, globalSearchValidate }) => {
  const {
    agents,
    loading: loadingAgent,
    error,
  } = useSelector((state) => state.agents);

  const [filteredAgents, setFilteredAgents] = useState([]);
  const [t] = useTranslation(["ChatView","Preview"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('filteredAgents',filteredAgents)
  const [limit, setLimit] = useState(20);
    const [page, setPage] = useState( 0);
     const [searchTerm, setSearchTerm] = useState("");
     const [selectedOption, setSelectedOption] = useState({});


  const fetchImages = async (agentIds) => {
    try {
      const response = await dispatch(getImagesAgents({ agentIds }));
      const images = response.payload.images;

      const updatedAgents = agents.agents.map((agent) => {
        const image = images.find((img) => img._id === agent._id)?.image;
        return {
          ...agent,
          image,
        };
      });

      setFilteredAgents(updatedAgents);
    } catch (error) {
      console.error("Error al obtener las imágenes de los agentes:", error);
    }
  };

  useEffect(() => {
    dispatch(getAgents({}));
  }, []);

  useEffect(() => {
    console.log('esto es selectedOption',selectedOption)
    dispatch(getAgents({search:searchTerm,
      sortAlpha: selectedOption["Orden Alfabético"],
      sortDate: selectedOption[t("dateFilter")],
      dateOrder: selectedOption[t("dateOrder")],
      orderByType: selectedOption[t("orderByType")]
    }));
  }, [searchTerm,selectedOption]);

  

  useEffect(() => {
    if (agents?.agents?.length) {
      const agentIds = agents.agents.map((agent) => agent._id);
      fetchImages(agentIds);
    }
  }, [agents]);


  

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
        { display: t('all'), value: 'all' },
        { display: t('private'), value: 'private' },
        { display: t('public'), value: 'public' },
      ],
    },
    {
      name: t("dateFilter"),
      label: t("dateFilter"),
      subOptions: [
        { display: t('1month'), value: "1month" },
        { display: t('3month'), value: "3month" },
        { display: t('6month'), value: "6month" },
        { display: t('1year'), value: "1year" },

      ],
    },
    {
      name: t("dateOrder"),
      label: t("dateOrder"),
      subOptions: [
        { display: t('ascendant'), value: "ascendant" },
        { display: t('falling'), value: "falling" },
      ],
    },
  ];


   const searchInputRef = useRef(null);
  
    useFocusShortcut(searchInputRef, "k")
  return (
    <ModalBlackBgTemplate
      close={close}
      customStyle={{
        maxHeight: "fit-content",
        minHeight: "fit-content",
        width: "400px",
      }}
    >
      <HeaderCard title={t("itIsNecessarySelectAgent")} setState={setState}>
        <Button action={() => navigate(`/admin/bot`)}>{t("new")}</Button>
      </HeaderCard>
      <div className={styles.headerFilter}>
        <SearchIconWithIcon  searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}   ref={searchInputRef} father={'selectAgentModal'}>
                 <Button
                               headerStyle={{
                                 all: "unset",
                                 background: "var(--f0-border)",
                                 color: "var(--_6-color)",
                                 padding: "1.5px 4.5px",
                                 borderRadius: "4px", fontWeight: 300, cursor: "pointer", fontSize: "12px", marginRight: "4px"
                               }}
                               type="white"
                               action={() => searchInputRef.current.focus()}
                 
                             >
                               K
                             </Button>
                </SearchIconWithIcon>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                <FiltersDropdownContainer
                setSelectedFilters={setSelectedOption}
                selectedFilters={selectedOption}
                options={options}
                father={"selectAgent"}
              />

         <PaginationTables
                            totalData={filteredAgents.length}
                            limit={limit}
                            page={page}
                            setPage={setPage}
                            setLimit={setLimit}
                            father={"selectAgentModal"}
                          /></div>
      </div>
      <div className={styles.selectAgentContainer}>
        <p>{t("selectAgentToEnableMessage")}</p>
        <div className={styles.selectAgent}>
          {filteredAgents.slice(page*limit,(page*limit)+limit).map((agent) => (
            <div
              className={styles.agentInfo}
              onClick={() => {
                console.log('finalTranscript', finalTranscript)
                dispatch(setSelectedAgent({
                  _id: agent._id,
                  ImageEmpty: agent.image,
                  name: agent.name,
                  pinned: agent.pinned,
                  instructions: agent.instructions,
                }));
                 if (globalSearchValidate) { 
                   finalTranscript = globalSearch;
                } 
                navigate(`/admin/chat/${agent._id}/${uuidv4()}`, {
                  state: {
                    typeAutomate: true,
                    rowId: finalTranscript,
                  },
                });
                setState(false);
                dispatch(setGlobalSearch(""));

              }}
            >
              <div className={styles.leftSideSelectAgent}>
                <img src={agent.image || ImageEmpty} alt="" />
                <p>
                  {agent.name || t("newAgent")}
                  <span>{agent.description}</span>
                </p>
              </div>
              {formatAgoDate({dateString: agent.lastMessageTimestamp,t})}
            </div>
          ))}
        </div>
      </div>
    </ModalBlackBgTemplate>
  );
};

export default SelectAgentModal;
