import React, { useState, useCallback, useMemo, useEffect } from "react";
import HeaderCard from "../HeaderCard/HeaderCard";
import styles from "./GeneralSettings.module.css";
import { ReactComponent as GeneralIcon } from "../../assets/GeneralSettingIcon.svg";
import { ReactComponent as AccountSettingIcon } from "../../assets/AccountSettingIcon.svg";
import { ReactComponent as TeamSettingIcon } from "../../assets/TeamSettingIcon.svg";
import { ReactComponent as DataControlsSettingIcon } from "../../assets/DataControlsSettingIcon.svg";
import { ReactComponent as ConnectedAppsSettingIcon } from "../../assets/ConnectedAppsSettingIcon.svg";
import { ReactComponent as WorkspaceIcon } from "../../assets/WorkspaceIcon.svg";
import { ReactComponent as SecuritySettingIcon } from "../../assets/SecuritySettingIcon.svg";
import { ReactComponent as SubscriptionIcon } from "../../assets/subscriptionIcon.svg";
import { ReactComponent as SpeechIcon } from "../../assets/speechIcon.svg";
import General from "./components/General";
import Team from "./components/Team/Team";
import AccountSettings from "../AccountSettings/AccountSettings";
import DataControls from "./components/DataControls/DataControls";
import ConnectedApps from "./components/ConnectedApps/ConnectedApps";
import Security from "./components/Security/Security";
import Speech from "./components/Speech/Speech"
import Button from "../Button/Button";
import { updateAccount, getTokens } from "../../../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../../../i18";
import { useTranslation } from "react-i18next";
import GetPlus from "./components/GetPlus/GetPlus";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultPaymentIntent, deletePaymentIntent } from "../../../../actions/stripe";
import Workspace from "./components/Workspace/Workspace";
import Device from "./components/Device/Device.jsx";

import WorkspaceSection from "../NewWorkspace/WorkspaceSection/WorkspaceSection.jsx";
import { createWorkspacesAction, getSelectedWorkspace, getWorkspacesByIdAction, updateWorkspaceAction } from "../../../../actions/workspaces.js";



const GeneralSettings = ({
  showSidebar,
  setShowSidebar,
  setDeleteChats,
  setShowColorPicker,
  openModalAutomate,
  setSeeBill,
  setTypeDelete,
  setShowTokenModal,
  setShowAddPayMethodPopup,
  currentSetting,
  setEditingCurrency,
  editingCurrency,
  selectedCurrency, 
  setSelectedCurrency,
  userData, 
  setUserData,
  initialUserData, 
  setInitialUserData,
  maxAccount,
  setShowWorkspace,
  showWorkspace,
  setShowInviteToWorkspace,
  configuration,
  setConfiguration,
  setNewWorkspace,
  newWorkspace,
  workspaceData, 
  setWorkspaceData,
  secondaryColor,
}) => {
  const [t] = useTranslation("accountSetting");
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("general");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [defaultPayMethod, setDefaultPayMethod] = useState(null)
  const [deletePayMethods, setDeletePayMethods] = useState([])
  const [errorMessage,setErrorMessage] = useState(null)

  const [selectedLanguage, setSelectedLanguage] = useState(
    user?.language || "Español"
  );

  const [hasChanges, setHasChanges] = useState(false);


  const handleClick = useCallback((id) => {
    let basePath = location.pathname;

    basePath = basePath.replace(/\/settings\/[^\/]+/, '');

    basePath = basePath.replace(/\/$/, '');

    const newPath = `${basePath}/settings/${id}`;

    navigate(newPath);
  }, [location, navigate]);

  useEffect(()=> {
    dispatch(getTokens({id: user?.id?.split("_").pop()}))
  },[])


  useEffect(() => {
    setSelectedOption(currentSetting)
  }, [currentSetting])

  useEffect(() => {
    if (userData && initialUserData) {
      const hasDataChanged = JSON.stringify(userData) !== JSON.stringify(initialUserData);
      setHasChanges(hasDataChanged);
    }
  }, [userData, initialUserData]);

  const settingsOptions = [
    { id: "general", icon: <GeneralIcon />, label: t("general") },
    { id: "account", icon: <AccountSettingIcon />, label: t("account") },
    { id: "devices", icon: <AccountSettingIcon />, label: 'Devices' },
     {
     id: "speech",
     icon: <SpeechIcon />,
     label: t("speech"),
   },
    // { id: "team", icon: <TeamSettingIcon />, label: t("team") },
    { id: "getPlus", icon: <SubscriptionIcon className={styles.themed} />, label: t("getPlus") },
    {
      id: "workspace",
      icon: <WorkspaceIcon className={styles.noFill} />,
      label: t("Workspace"),
    },
    {
      id: "team",
      icon: <WorkspaceIcon />,
      label: t("team"),
    },
   
    {
      id: "dataControls",
      icon: <DataControlsSettingIcon />,
      label: t("dataControls"),
    },
    {
      id: "connectedApps",
      icon: <ConnectedAppsSettingIcon />,
      label: t("connectedApps"),
    },
    { id: "security", icon: <SecuritySettingIcon />, label: t("security") },
  ];

  

  const settingsComponents = {
    general: () => (
      <General
        setDeleteChats={setDeleteChats}
        userData={userData}
        setUserData={setUserData}
        setSelectedCurrency={setSelectedCurrency}
        selectedCurrency={selectedCurrency}
        setSeeBill={setSeeBill}
        setSelectedLanguage={setSelectedLanguage}
        setTypeDelete={setTypeDelete}
        setEditingCurrency={setEditingCurrency}
        editingCurrency={editingCurrency}
        maxAccount={maxAccount}
        configuration={configuration}
        setConfiguration={setConfiguration}
        secondaryColor={secondaryColor}
      />
    ),
    account: () => (
      <AccountSettings
        setUserData={setUserData}
        userData={userData}
        initialUserData={initialUserData}
        setShowAddPayMethodPopup={setShowAddPayMethodPopup}
        setDeletePayMethods={setDeletePayMethods}
        setDefaultPayMethod={setDefaultPayMethod}
      />
    ),
    devices: () => (<Device />),
    speech:() => (<Speech userData={userData} setUserData={setUserData}/>),
    // team: () => (<Team />),
    getPlus: () => (<GetPlus />),
    // workspace: () => (<Workspace showWorkspace={showWorkspace} setShowWorkspace={setShowWorkspace} setNewWorkspace={setNewWorkspace} setShowInviteToWorkspace={setShowInviteToWorkspace} setWorkspaceData={setWorkspaceData}/>),
    dataControls: () => (<DataControls setDeleteChats={setDeleteChats} setTypeDelete={setTypeDelete} setShowSidebar={setShowSidebar} />),
    connectedApps: () => ( <ConnectedApps openModalAutomate={openModalAutomate} setShowTokenModal={setShowTokenModal} /> ),
    security: () => (<Security />),
    // newWorkspace: () => (    <WorkspaceSection
    //   setSelectedOption={setSelectedOption}
    //   newWorkspace={newWorkspace}
    //   setWorkspaceData={setWorkspaceData}
    //   workspaceData={workspaceData}
    //   setShowInviteToWorkspace={setShowInviteToWorkspace}
    //   errorMessage={errorMessage}
    // />),
  };
console.log('testtt111534')
  const renderedOptions = useMemo(
    () =>
      settingsOptions.map(({ id, icon, label }) => (
        <li
          key={id}
          onClick={() =>handleClick(id)}
          className={`${selectedOption === id ? styles.selected : ""}  ${id == 'getPlus' && styles.getPlusOption}`}
        >
          {icon} {label}
        </li>
      )),
    [selectedOption, handleClick, t]
  );


  const SelectedComponent = selectedOption
    ? settingsComponents[selectedOption]
    : null;


  const handleSave = async () => {
    const userDataToSave = {
      ...userData,

      currency: selectedCurrency,
    };
    i18n.changeLanguage(userData?.language);
    localStorage.setItem("language", userData?.language);
    dispatch(updateAccount({ data: userDataToSave }));
    setInitialUserData(userData); 
    setHasChanges(false);

    for (const paymentId of deletePayMethods) {
      await dispatch(deletePaymentIntent({ paymentMethodId: paymentId }));
    }

    if (defaultPayMethod) {
      await dispatch(defaultPaymentIntent({ paymentMethodId: defaultPayMethod }));
    }
  };
  const close = () => {
    handleClick('workspace');
    setWorkspaceData({
      type: "private",
      typePay: "free",
    })
  };


  const createWorkspaces = async () => {
    const res = await dispatch(
      createWorkspacesAction({ workspace: workspaceData, createdBy: user.id,owner:user })
    );
    console.log("respuesta de crear workspace", res);
    if (res?.meta?.requestStatus == "fulfilled") {
      close();
      dispatch(getWorkspacesByIdAction({ userId: user.id }));
    }
  };
  const updateWorkspaces = async () => {
    const { currentMember, ...workspaceToSend } = workspaceData;
    const res = await dispatch(
      updateWorkspaceAction({ workspace: workspaceToSend, workspaceId: workspaceData._id })
    );
    console.log("respuesta de actualizar workspace", res);
    if (res?.meta?.requestStatus == "fulfilled") {
      close();
      dispatch(getWorkspacesByIdAction({ userId: user.id }));
      dispatch(getSelectedWorkspace())
    }
  };

  const handleCreateUpdateWorkspaces = () => {
    if(!workspaceData.title) {
      setErrorMessage({
        message:t('workspaceNeedName'),
        type:"title"
      })
      return
    }
 
    if (newWorkspace) {
      createWorkspaces()
    } else {
      updateWorkspaces()
    }
  };


  return (
    <div className={styles.GeneralSettings}>
      <HeaderCard title={t("setting")} setState={(value) => {
        setShowSidebar(value)
        const path = location.pathname;

        const cleanedPath = path.replace(/\/settings\/[^\/]+$/, '');

        navigate(cleanedPath);
      }}>
        {currentSetting === 'workspace' ? (
          <Button type="white" headerStyle={{ borderRadius: "999px" }} action={() => {
            // setShowWorkspace(true)
            setNewWorkspace(true)
            handleClick('newWorkspace')
          }}><WorkspaceIcon /> {t('newWorkspace')}</Button>
        ) : currentSetting == 'newWorkspace' ? (
            <Button type="green" action={handleCreateUpdateWorkspaces}>
              {newWorkspace ? t("save") : t('update')}
            </Button>
            // <Button type="green" action={() => setShowInviteToWorkspace(true)}>
            //   {t("invite")}
            // </Button>
          
        ):

          hasChanges && <Button action={handleSave}>{t("save")}</Button>
        }

      </HeaderCard>
      <div className={styles.GeneralSettingsContent}>
        <div className={styles.leftGeneralSetting}>
          <div className={styles.optionsSetting}>
            <ul>{renderedOptions}</ul>

          </div>
        </div>
        <div className={styles.rightGeneralSetting}>
  {selectedOption === "newWorkspace" ? (
    <WorkspaceSection
      newWorkspace={newWorkspace}
      setWorkspaceData={setWorkspaceData}
      workspaceData={workspaceData}
      setShowInviteToWorkspace={setShowInviteToWorkspace}
      errorMessage={errorMessage}
      setSelectedOption={setSelectedOption} // para volver atrás desde dentro
    />
  ) :selectedOption === "workspace" ?(
    <Workspace showWorkspace={showWorkspace} setShowWorkspace={setShowWorkspace} setNewWorkspace={setNewWorkspace} setShowInviteToWorkspace={setShowInviteToWorkspace} setWorkspaceData={setWorkspaceData}/>

  ) :selectedOption === "team" ?(
    <Team/>
  ): SelectedComponent ? (
    <SelectedComponent />
  ) : (
    t("selectAnOption")
  )}
</div>

      </div>
    </div>
  );
};

export default GeneralSettings;
