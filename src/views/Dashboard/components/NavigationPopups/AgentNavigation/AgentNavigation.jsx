import React, { useRef, useState } from 'react'
import styles from './AgentNavigation.module.css'
import Button from "../../Button/Button";
import { useTranslation } from "react-i18next";
import SearchIconWithIcon from "../../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../../utils/useFocusShortcut";
import lIcon from "../../../assets/lIcon.svg";
import { ReactComponent as PlayIcon } from "../../../assets/PlayIcon.svg";
import { ReactComponent as ArrowDown } from "../../../assets/arrowDownGray.svg";
import { ReactComponent as AddBlack } from "../../../assets/addBlack.svg";
import ItemNavigation from "../ItemNavigation/ItemNavigation";

import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { createVariable,getVariable } from "../../../../../actions/user";
import { ReactComponent as ContactIdentification } from "../../../assets/contactIdentificationIcon.svg";
import { ReactComponent as InstructionsIcon } from "../../../assets/instructionsIcon.svg";
import { ReactComponent as TemperatureIcon } from "../../../assets/temperatureIcon.svg";
import { ReactComponent as ProgrammedResponsesIcon } from "../../../assets/ProgrammedResponsesIcon.svg";
import { ReactComponent as CapabilitiesIcon } from "../../../assets/CapabilitiesIcon.svg";
import ProfileModalTemplate from '../../ProfileModalTemplate/ProfileModalTemplate';

const AgentNavigation = ({  type,
    setParameters,
    parameters,
    setShowCreateParameter,
    showCreateParameter,
    data,
    setShowTestAgent,
    handleAddScheduledResponse,
    setImage
}) => {

    const [t] = useTranslation("ChatView");
    const [isParametersVisible, setIsParameterVisible] = useState(true);
    const [activeId, setActiveId] = useState(null);

  const location = useLocation()

    const [showButtonAdd,setShowButtonAdd] = useState(false)
    const {tableView} = useSelector(state => state.user)

    const dispatch = useDispatch()

    const addParameterColumn = async(parameter) => {

     if(location.pathname.split("/").find(path => path == "assets")) {
     if(!(tableView?.assets.find(param => param.key == parameter))){
      await dispatch(createVariable({variableData:{title:"tableView", type:"tableView", assets:[{label:parameter, key:parameter },...tableView.assets ]}}))}}
    else if(location.pathname.split("/").find(path => path == "contacts")){
          if(!(tableView?.contacts.find(param => param.key == parameter))){
      await dispatch(createVariable({variableData:{title:"tableView", type:"tableView", contacts:[{label:parameter, key:parameter },...tableView.contacts ]}}))}}
      await dispatch(getVariable({type:'tableView'}))
    }


    const handleClick = (id) => {
      setActiveId(id);
    };

    const renderLinks = (items) =>
      items.map(({ id, label }) => (
        <li
          key={id}
          onClick={() => handleClick(id)}
          className={activeId === id ? styles.active : ""}
        >
          <a href={`#${id}`}>{label}</a>
        </li>
      ));


    const agentItems = [
      { id: "generalInformation", label: t('generalInformation'),Icon:ContactIdentification },
      { id: "instructions", label: t('instructions'),Icon:InstructionsIcon },
      { id: "temperature", label: t('temperature'),Icon:TemperatureIcon },
      { id: "programmedResponses", label: t('programmedResponses'),Icon:ProgrammedResponsesIcon },
      { id: "knowledgeAndSkills", label: t('capabilities'),Icon:CapabilitiesIcon },
    ];

    const addParameter = () => {
      if (typeof showCreateParameter !== "undefined") {
        setShowCreateParameter(true);
      } else {
        setParameters((prev) => ({
          ...prev,
          parameters: [
            ...prev.parameters,
            { name: "", value: "", title: "", id: Date.now() }, 
          ],
        }));
      }
    };

    const [searchTerm, setSearchTerm] = useState("");

    const searchInputRef = useRef(null);
    useFocusShortcut(searchInputRef, "/");


  return (
    <div className={styles.ContactAssetNavigation}>
          <ProfileModalTemplate
              image={data.image}
              handleContactData={setImage}
              id={data._id}
              sticky={true}
              customStyle={{
                width: "150px",
                height: "150px",
              }}
            />
                  <div className={styles.dataInfo}>
                  <p>
                    {data.name || t("agentName")}
                     
                  </p>

                  <span>
                    { data.type || t("contactType") }
                  </span>

                  </div>

            <Button
            action={() => {
              if(data._id) {
                setShowTestAgent(true)
              }
            }}
            type="green"
            headerStyle={{ width: "70%",opacity: !data._id && '0.4',cursor:!data._id&& "not-allowed",borderRadius:"999px",margin:"0 auto" }}
          >
            <PlayIcon width={18} height={18} style={{ color: "white" }} />
            {t('test')}
          </Button>
    <ItemNavigation items={agentItems} />
    <Button
      action={handleAddScheduledResponse}
      type="white"
      headerStyle={{
        borderRadius: "999px",
        width: "fit-content",
        textWrap:"nowrap"
      }}
    >
     <AddBlack/> {t("addScheduledResponses")}
    </Button>

    <div
      className={styles.parameters}
      onClick={() => {
        setIsParameterVisible((prev) => !prev);
      }}
    >
      <ArrowDown
        style={{
          transform: isParametersVisible && "rotate(180deg)",
          transition: "all 300ms",
          
        }}
      />
      {t("scheduledResponse")}{" "}
      <span>
        {parameters?.length > 1 &&
          `(${
            parameters?.filter((item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase())
            ).length
          })`}
      </span>
    </div>

    <SearchIconWithIcon
      ref={searchInputRef}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      classNameIconRight={styles.searchContainerL}
      onClickIconRight={() => setIsFilterOpen(true)}
      placeholder={t("searchScheduledResponse")}
      stylesComponent={{ padding: "0" }}
    >
      <>
        <div
          style={{ marginLeft: "5px" }}
          className={styles.searchIconsWrappers}
        >
          <img src={lIcon} alt="kIcon" />
        </div>
      </>
    </SearchIconWithIcon>
    <div
      className={styles.parametersContainer}
      style={{
        height: isParametersVisible ? "auto" : "0px",
        overflow: "hidden",
      }}
    >
      <ul>
        {parameters
          ?.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((parameter) => (
            <li  onMouseEnter={() =>setShowButtonAdd(true)}
                  onMouseLeave={() => setShowButtonAdd(false)}>{parameter.title || t("scheduledResponseName")}
                </li>
          ))}
      </ul>
    </div>


  </div>
  )
}

export default AgentNavigation
