import React, { useEffect, useMemo, useState } from "react";
import styles from "../NewAgentComponent.module.css";
import ImageEmpty from "../../../assets/ImageEmpty.svg";
import Button from "../../Button/Button";
import { ReactComponent as SearchGray } from "../../../assets/searchGray.svg";
import { ReactComponent as ArrowDown } from "../../../assets/arrowDownBold.svg";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";
import DeleteButton from "../../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";
import AutomateDataComponent from "../../Automate/utils/automatesJson";
import { useDispatch, useSelector } from "react-redux";
import { getTotalContactsAssetsDocuments } from "../../../../../actions/user";


const initialSwitchStates = {
  documents: false,
  contacts: false,
  assets: false,
};
const initialSwitchStates2 = {
  webSearch: false,
  imageGeneration: false,
};

const KnowledgeAndSkills = ({ localAgent, setLocalAgent }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation("ChatView");
  const [totalContacts,setTotalContacts] = useState(0)
  const [totalDocuments,setTotalDocuments] = useState(0)
  const [totalAssets,setTotalAssets] = useState(0)
  const data = AutomateDataComponent();
  const [dataFilter, setDataFilter] = useState(data);
  const { userAutomations } = useSelector((state) => state.automate);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermAutomate, setSearchTermAutomate] = useState("");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [searchAutomation, setSearchAutomation] = useState("");
  const [showAutomationDropdown, setShowAutomationDropdown] = useState(false);


  const handleDataFilter = (searchTerm) => {
    const filteredData = data.filter((card) =>
      card.automateName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDataFilter(filteredData);
  };

  useEffect(() => {
    if (searchTermAutomate === "") {
      setDataFilter(data);
    } else {
      handleDataFilter(searchTermAutomate);
    }
  }, [searchTermAutomate]);

  const handleAddWorkspace = () => {
    const newWorkspace = {
      id: Date.now(),
      name: `Workspace ${localAgent?.workspaces?.length + 1}`,
      switches: { ...initialSwitchStates },
      accesses: 0,
      contacts: 0,
      assets: 0,
      automations: [],
    };

    const updated = {
      ...localAgent,
      workspaces: [...(localAgent.workspaces || []), newWorkspace],
    };

    setLocalAgent(updated);
    setSelectedWorkspaceId(newWorkspace.id); 
    setSearchTerm(""); 
  };

  const handleSelectWorkspace = (id) => {
    setSelectedWorkspaceId(id);
    setShowDropdown(false);
    setSearchTerm("");
  };

  const selectedWorkspace = useMemo(() => {
    return localAgent?.workspaces?.find((ws) => ws.id === selectedWorkspaceId);
  }, [localAgent.workspaces, selectedWorkspaceId]);

  const agentLevelSwitchKeys = Object.keys(initialSwitchStates2);

  const handleToggleSwitch = (key, value) => {
    if (agentLevelSwitchKeys.includes(key)) {
      setLocalAgent({
        ...localAgent,
        [key]: value,
      });
    } else {
      const updatedWorkspaces = localAgent.workspaces.map((ws) =>
        ws.id === selectedWorkspaceId
          ? {
              ...ws,
              switches: {
                ...ws.switches,
                [key]: value,
              },
            }
          : ws
      );

      setLocalAgent({ ...localAgent, workspaces: updatedWorkspaces });
    }
  };

  const filteredWorkspaces = (localAgent?.workspaces || []).filter((ws) =>
    ws.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteWorkspace = () => {
    const updatedWorkspaces = localAgent.workspaces.filter(
      (ws) => ws.id !== selectedWorkspaceId
    );

    setLocalAgent({ ...localAgent, workspaces: updatedWorkspaces });

    if (updatedWorkspaces.length > 0) {
      setSelectedWorkspaceId(updatedWorkspaces[0].id); 
    } else {
      setSelectedWorkspaceId(null); 
      }
  };

  const handleAddAutomationToWorkspace = (automation) => {
    const filteredAutomation = data.find((a) => a?.type === automation?.type);

    const updatedWorkspaces = localAgent.workspaces.map((ws) =>
      ws.id === selectedWorkspaceId
        ? {
            ...ws,
            automations: [
              ...(ws.automations || []),
              {
                id: automation.id,
                type: automation.type,
                inputValue: automation.inputValue || null,
                image: filteredAutomation?.image || null,
              },
            ],
          }
        : ws
    );

    setLocalAgent({ ...localAgent, workspaces: updatedWorkspaces });
    setSearchAutomation("");
    setShowAutomationDropdown(false);
  };
  const handleRemoveAutomationFromWorkspace = (automationId) => {
    const updatedWorkspaces = localAgent.workspaces.map((ws) =>
      ws.id === selectedWorkspaceId
        ? {
            ...ws,
            automations: ws.automations.filter((a) => a.id !== automationId),
          }
        : ws
    );

    setLocalAgent({ ...localAgent, workspaces: updatedWorkspaces });
  };

  useEffect(() => {
const getTotalContactsAssetsDocumentsFn =async() => {
  const res =await dispatch(getTotalContactsAssetsDocuments({type:'all'}))
  if(res && res.payload) {
    setTotalAssets(res.payload?.counts?.assets)
    setTotalContacts(res.payload?.counts?.contacts)
    setTotalDocuments(res.payload?.counts?.docs)
  }

}
getTotalContactsAssetsDocumentsFn()
  }, [])
  

  return (
    <div className={styles.newAgentSection}>
 
      {Object.keys(initialSwitchStates2).map((key) => (
        <div key={key} className={styles.agentWorkspaceSection}>
          <p>{t(key)}</p>
          <OptionsSwitchComponent
            border="none"
            marginLeft="auto"
            isChecked={
              agentLevelSwitchKeys.includes(key)
                ? localAgent[key]
                : selectedWorkspace.switches[key]
            }
            blackBg={true}
            setIsChecked={(val) => handleToggleSwitch(key, val)}
          />
        </div>
      ))}
           <div className={styles.workspaceHeader}>
        <p>Workspaces</p>

        <div className={styles.addContainer}>
          <img src={ImageEmpty} alt="" />
          <Button
            type="white"
            headerStyle={{ borderRadius: "999px" }}
            action={handleAddWorkspace}
          >
            {t("add")}
          </Button>
        </div>
      </div>
      {(localAgent.workspaces || []).length > 0 && (
        <>
          <div className={styles.workspacesSearch}>
            <SearchGray />
            <input
              type="text"
              placeholder={selectedWorkspace?.name || t("selectWorkspace")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setShowDropdown(false)}
            />
            <ArrowDown />
            {showDropdown && (
              <div className={styles.dropdown}>
                {filteredWorkspaces.length > 0 ? (
                  filteredWorkspaces.map((ws) => (
                    <div
                      key={ws.id}
                      className={styles.dropdownItem}
                      onMouseDown={() => handleSelectWorkspace(ws.id)}
                    >
                      {ws.name}
                    </div>
                  ))
                ) : (
                  <div className={styles.dropdownItem}>{t("noResults")}</div>
                )}
              </div>
            )}
          </div>

          {selectedWorkspace && (
            <>
              <div className={styles.agentWorkspaceSection}>
                <div>
                  <img src={ImageEmpty} alt="" />
                  <div className={styles.infoWorkspace}>
                    <div>
                      <p>{selectedWorkspace.name}</p>
                      <div className={styles.quantityContactsAssets}>
                          {selectedWorkspace.switches.contacts && typeof totalContacts !== "undefined" && (
                            <span>{totalContacts} contactos</span>
                          )}
                          {selectedWorkspace.switches.assets && typeof totalAssets !== "undefined" && (
                            <span>{totalAssets} activos</span>
                          )}
                          {selectedWorkspace.switches.documents && typeof totalDocuments !== "undefined" && (
                            <span>{totalDocuments} accesos</span>
                          )}
                      </div>

                    </div>
                    <div className={styles.optionsSwitchInfoWorkspace}>
                      {Object.keys(initialSwitchStates).map((key) => (
                        <div
                          key={key}
                        >
                          <span className={styles.labelOptionsSwitch}>{t(key)}</span>
                          <OptionsSwitchComponent
                            border="none"
                            marginLeft="auto"
                            isChecked={selectedWorkspace.switches[key]}
                            blackBg={true}
                            setIsChecked={(val) => handleToggleSwitch(key, val)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DeleteButton action={handleDeleteWorkspace} />
              </div>

              <div
                className={`${styles.agentWorkspaceSection} ${styles.workspaceColumn}`}
              >
                <div>
                  <p>{t("automates")}</p>
                  <div className={styles.workspacesSearch}>
                    <SearchGray />
                    <input
                      type="text"
                      placeholder={t("selectAutomation")}
                      value={searchAutomation}
                      onChange={(e) => setSearchAutomation(e.target.value)}
                      onFocus={() => setShowAutomationDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowAutomationDropdown(false), 100)
                      } 
                    />
                    <ArrowDown />

                    {showAutomationDropdown && (
                      <div
                        className={`${styles.dropdown} ${styles.dropdownAutomate}`}
                      >
                        {userAutomations
                          .filter((automation) =>
                            (automation?.inputValue || automation?.type || "")
                              .toLowerCase()
                              .includes(searchAutomation.toLowerCase())
                          )
                          .map((automation) => {
                            const filteredAutomation = data.find(
                              (a) => a?.type === automation?.type
                            );

                            return (
                              <div
                                key={automation.id}
                                className={styles.dropdownItem}
                                onMouseDown={() =>
                                  handleAddAutomationToWorkspace(automation)
                                }
                              >
                                <img
                                  src={filteredAutomation?.image}
                                  alt=""
                                  className={styles.automationImage}
                                />
                                <span>
                                  {automation?.inputValue ||
                                    `${t("withoutNameIn")} ${filteredAutomation?.type}`}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
                <Button type="white">{t("add")}</Button>
              </div>

              {(selectedWorkspace.automations || []).map((automation) => {
                const filteredAutomation = data.find(
                  (a) => a?.type === automation?.type
                );

                return (
                  <div
                    key={automation.id}
                    className={`${styles.agentWorkspaceSection} `}
                  >
                    <div className={styles.automatesContent}>
                      <img
                        src={filteredAutomation.image}
                        alt=""
                        className={styles.automationImage}
                      />
                      <div>
                        <p>
                          {automation.inputValue ||
                            `${t("withoutNameIn")} ${automation.type}`}
                        </p>
                        <span>
                          {filteredAutomation?.automateName || t("noName")}
                        </span>
                      </div>
                    </div>
                    <DeleteButton
                      action={() =>
                        handleRemoveAutomationFromWorkspace(automation.id)
                      }
                    />
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default KnowledgeAndSkills;
