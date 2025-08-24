import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import styles from "./NewTable.module.css";
import { useTranslation } from "react-i18next";
import OptionsSwitchComponent from "../OptionsSwichComponent/OptionsSwitchComponent";
import { ReactComponent as GreenCopyIcon } from "../../assets/greenCopyIcon.svg";
import { ReactComponent as Copy } from "../../assets/icon-copy.svg";
import { FaChevronDown } from "react-icons/fa";

const AccessPermit = ({ tableData, setTableData }) => {
  const { t } = useTranslation();
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { workspaces, selectedWorkspaceId } = useSelector(
    (state) => ({
      workspaces: state.workspace.workspaces,
      selectedWorkspaceId: state.workspace.selectedWorkspaceId,
    }),
    shallowEqual
  );

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowWorkspaceDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleWorkspaceSelect = (workspace) => {
    setTableData((prev) => ({
      ...prev,
      selectedWorkspace: {
        title: workspace.title,
        _id: workspace._id
      }
    }));
    setShowWorkspaceDropdown(false);
  };

  const getDisplayText = () => {
    if (tableData?.selectedWorkspace?.title) {
      return tableData.selectedWorkspace.title;
    }
    // return t('AnyoneWithAccessTo');
  };

  return (
    <div className={`${styles.fieldContainer} ${styles.AccessPermitContainer}`}>
      <div className={styles.accessPermitHeader}>
        <div>
          <p className={styles.fieldLabel}>{t("tableName")}</p>
          <div className={styles.AccessPermitType}>
            {tableData?.AccessPermitType == "private" ? (
              <>{t("private")}</>
            ) : (
              <>{t("public")}</>
            )}
            <OptionsSwitchComponent
              border="none"
              marginLeft="auto"
              isChecked={tableData.AccessPermitType === "public"}
              blackBg={true}
              setIsChecked={(isChecked) =>
                setTableData((prev) => ({
                  ...prev,
                  AccessPermitType: isChecked ? "public" : "private",
                }))
              }
            />
          </div>
        </div>

      </div>
        <div className={styles.projectLinkContainer}>
          <div className={styles.projectLinkLeft}>
            <div className={styles.projectLinkIconContainer}>
              <GreenCopyIcon />
            </div>
            <div className={styles.projectLinkText}>
                <p>{t("projectLink")}</p>
                <div className={styles.workspaceSelector} ref={dropdownRef}>
                  <span 
                    className={`${styles.workspaceSelectorTrigger} ${showWorkspaceDropdown ? styles.active : ''}`}
                    onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                  >
                    {t('AnyoneWithAccessTo')} {' '}
                    {getDisplayText()}
                   <FaChevronDown/>
                  </span>
                  {showWorkspaceDropdown && (
                    <div className={styles.workspaceDropdown}>
                      {workspaces && workspaces.length > 0 ? (
                        workspaces.map((workspace) => (
                          <div
                            key={workspace._id}
                            className={styles.workspaceOption}
                            onClick={() => handleWorkspaceSelect(workspace)}
                          >
                            {workspace.title || t('workspaceName')}
                          </div>
                        ))
                      ) : (
                        <div className={styles.noWorkspaces}>
                          {t('noWorkspacesAvailable')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
            </div>
          </div>
          <div className={styles.copyButton}>
           <Copy/> <p>{t("copy")}</p>
          </div>
        </div>
    </div>
  );
};

export default AccessPermit;
