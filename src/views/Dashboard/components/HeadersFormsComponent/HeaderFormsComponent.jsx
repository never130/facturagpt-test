import React from "react";
import styles from "./HeaderFormsComponent.module.css";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

const HeaderFormsComponent = ({
  icon,
  action,
  emailConnections = [],
  selectedEmailConnection,
  setSelectedEmailConnection = () => {},
  placeholder ,
  headerStyle = {},
  emailConnectionsId = [],
  handleConfigurationChange,
  CustomDropdownOptionStyles,
  type,
  setIsOpenAutomate,
  isOpenAutomate,
  setToggleChatSettings,
  toggleChatSettings,
  roleAutomate
}) => {
  const {t} = useTranslation('Preview')
  const { workspaces, selectedWorkspaceId } = useSelector(
    (state) => ({
      workspaces: state.workspace.workspaces,
      selectedWorkspaceId: state.workspace.selectedWorkspaceId,
    }),
    shallowEqual
  );
console.log('workspaces',workspaces)
console.log('emailConnections',emailConnections)
  return (
    <div className={styles.header} style={headerStyle}>
      {roleAutomate !== 'workflow' && (
      <div className={styles.headerMail}>
        <div className={styles.iconContainer}>{icon}</div>
        <CustomDropdown
          options={emailConnections}
          isEmail={true}
          height="27px"
          borderRadius="0px 8px 8px 0px"
          placeholder={placeholder ||  t('addAnEmailAccount')}
          selectedOption={selectedEmailConnection}
          setSelectedOption={setSelectedEmailConnection}
          emailsDropdown={true}
          emailConnectionsId={emailConnectionsId}
          fromHeader={true}
          handleConfigurationChange={handleConfigurationChange}
          customStylesOptions={CustomDropdownOptionStyles}
          type={type}
        />
      </div>
      )}
      <div className={styles.addConnection} >
      <p onClick={() => setToggleChatSettings(toggleChatSettings === 'setting' ? 'chat' : 'setting')}>
        {toggleChatSettings === 'setting' ? 'setting' : 'chat'}
      </p>
      {(type !== 'facturagpt' && roleAutomate !== 'workflow') && (
        <p className={styles.active} onClick={() => type !== "XML" && action()}>
          {type !== "XML" ? t('addConnection') : ""}
        </p>
      )}
      </div>
        
    </div>
  );
};

export default HeaderFormsComponent;
