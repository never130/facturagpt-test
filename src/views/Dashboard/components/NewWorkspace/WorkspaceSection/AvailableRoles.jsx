import React, { useState } from "react";
import styles from "./WorkspaceSection.module.css";
import { useTranslation } from "react-i18next";
import Button from "../../Button/Button";
import InputWithTitle from "../../InputWithTitle/InputWithTitle";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";
import { ReactComponent as SearchSVG } from "../../../assets/searchGray.svg";
import { ReactComponent as CloseXIcon } from "../../../assets/CloseXIcon.svg";
import InputComponent from "../../InputComponent/InputComponent";

const ROLE_PRESETS = {
  admin: {
    generalAccess: 3, 
    dataManagement: 3,
    restrictions: 0, 
  },
  editor: {
    generalAccess: 1, 
    dataManagement: 0, 
    restrictions: 0,
  },
  colaborator: {
    generalAccess: 0,
    dataManagement: 1, 
    restrictions: 0,
  },
};

const AvailableRoles = ({
  workspaceData,
  setWorkspaceData,
  InviteToWorkspace,
  userToInvite,
  setUserToInvite,
}) => {
  const [t] = useTranslation("accountSetting");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showNewRole, setShowNewRole] = useState(false);
  const [role, setRole] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const encodeGroup = (perm1, perm2) => (perm1 ? 1 : 0) + (perm2 ? 2 : 0);
  const decodeGroup = (value = 0) => ({
    first: Boolean(value & 1),
    second: Boolean(value & 2),
  });

  const general = decodeGroup(role?.generalAccess);
  const dataManagement = decodeGroup(role?.dataManagement);
  const restrictions = decodeGroup(role?.restrictions);

  const clearTypeIfPreset = () => {
    setRole((prev) => {
      if (!prev) return prev;
      if (prev.type && prev.type !== "custom") {
        return { ...prev, type: "custom" }; 
      }
      return prev;
    });
  };

  const handleSelectType = (type) => {
    const preset = ROLE_PRESETS[type];
    setRole({
      type,
      title: role?.title || "",
      ...preset,
    });
  };

  return (
    <div className={`${styles.workspaceSectionLabel} ${styles.availableRoles}`}>
      <div className={styles.availableRolesHeader}>
      
        <div className={styles.availableRolesHeaderInfo}>
          <p>{t("availableRoles")}</p>
          <div className={styles.buttonsContainer}>
            {InviteToWorkspace && (
              <CustomDropdown
                placeholder={t("category")}
                options={(workspaceData?.roles ?? []).map((role) => role.title)}
                selectedOption={userToInvite?.role?.title || ""}
                height="31px"
                textStyles={{
                  display: "flex",
                  fontWeight: 300,

                  userSelect: "none",
                }}
                setSelectedOption={(selectedTitle) => {
                  const fullRole = (workspaceData?.roles || []).find(
                    (r) => r.title === selectedTitle
                  );
                  if (!fullRole) return; 
                  setUserToInvite((prev) => ({
                    ...prev,
                    role: fullRole,
                  }));
                }}
              />
            )}
            <Button
              type="white"
              headerStyle={{ borderRadius: "999px" }}
              action={() => setShowNewRole((prev) => !prev)}
            >
              {t("newRole")}
            </Button>
            <Button
              headerStyle={{
                margin: "10px 0 10px auto",
                borderRadius: "999px",
                marginLeft: "auto",
              }}
              action={() => {
                if (!role?.title) {
                  setErrorMessage({
                    message: t("roleNeedName"),
                    type: "title",
                  });
                  return;
                }else {
                  setErrorMessage(null);
                }

                const permissionCode = `${role.generalAccess || 0}${role.dataManagement || 0}${role.restrictions || 0}`;

                const updatedRole = {
                  ...role,
                  permissions: permissionCode,
                };
                delete updatedRole.generalAccess;
                delete updatedRole.dataManagement;
                delete updatedRole.restrictions;

                setWorkspaceData((prev) => ({
                  ...prev,
                  roles: [...(prev.roles || []), updatedRole],
                }));

                setRole(null);
                setShowAdvancedOptions(false);
              }}
            >
              {t("save")}
            </Button>
          </div>
        </div>
      </div>
      {errorMessage?.type == "title" && (
        <div className={styles.errorMessage}>{errorMessage.message}</div>
      )}
      {workspaceData?.roles?.length > 0 && (
        <div className={styles.tagsRole}>
          {workspaceData?.roles.map((role, idx) => (
            <div className={styles.role}>
              {role?.title}{" "}
              <CloseXIcon
                onClick={() =>
                  setWorkspaceData((prev) => ({
                    ...prev,
                    roles: (prev.roles || []).filter((_, i) => i !== idx),
                  }))
                }
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      )}
      {showNewRole && (
        <>
          <div className={styles.createRoleContainer}>
            <div className={styles.RoleSelector}>
              {["admin", "editor", "colaborator"].map((rt) => (
                <div key={rt} className={styles.role}>
                  <input
                    type="radio"
                    name="roleType"
                    checked={role?.type === rt}
                    onChange={() => handleSelectType(rt)}
                    id={`role-${rt}`}
                  />
                  <div className={styles.roleInfo}>
                    <label htmlFor={`role-${rt}`}>
                      <p>{t(rt)}</p>
                      <span>{t(`${rt}Info`)}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.advancedOptions}>
              <InputWithTitle
                bgColor="var(--f4-background)"
                titleColor="var(--_18181b-color)"
                placeholder={t("rolName")}
                textStyles={{
                  display: "flex",
                  gap: "5px",
                  fontWeight: 500,
                  color: "var(--black-color)",
                  userSelect: "none",
                }}
                inputHeight="31px"
                title=""
                onChange={(e) =>
                  setRole((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                value={role?.title || ""}
              />

              <Button
                headerStyle={{ borderRadius: "999px" }}
                type="white"
                action={() => setShowAdvancedOptions((prev) => !prev)}
              >
                {t("advancedOptions")}
              </Button>
            </div>

            {showAdvancedOptions && (
              <div className={styles.advancedOptionsContent}>
                <div className={styles.accessSection}>
                  <div className={styles.accessSectionTitle}>
                    <p>{t("generalAccess")}</p>
                    <span>{t("admin")}</span>
                  </div>
                  <div className={styles.option}>
                    <p>{t("approveOrCancelDocument")}</p>
                    <OptionsSwitchComponent
                      border="none"
                      marginLeft="auto"
                      blackBg={true}
                      isChecked={general.first}
                      setIsChecked={(isChecked) => {
                        clearTypeIfPreset();
                        const updated = encodeGroup(isChecked, general.second);
                        setRole((prev) => ({
                          ...prev,
                          generalAccess: updated,
                        }));
                      }}
                    />
                  </div>
                  <div className={styles.option}>
                    <p>{t("modifyDocumentStatuses")}</p>
                    <OptionsSwitchComponent
                      border="none"
                      marginLeft="auto"
                      blackBg={true}
                      isChecked={general.second}
                      setIsChecked={(isChecked) => {
                        clearTypeIfPreset();
                        const updated = encodeGroup(general.first, isChecked);
                        setRole((prev) => ({
                          ...prev,
                          generalAccess: updated,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className={styles.accessSection}>
                  <div className={styles.accessSectionTitle}>
                    <p>{t("synchronizedDataManagement")}</p>
                    <span>{t("editor")}</span>
                  </div>
                  <div className={styles.option}>
                    <p>{t("creandAndModify")}</p>
                    <OptionsSwitchComponent
                      border="none"
                      marginLeft="auto"
                      blackBg={true}
                      isChecked={dataManagement.first}
                      setIsChecked={(isChecked) => {
                        clearTypeIfPreset();
                        const updated = encodeGroup(
                          isChecked,
                          dataManagement.second
                        );
                        setRole((prev) => ({
                          ...prev,
                          dataManagement: updated,
                        }));
                      }}
                    />
                  </div>
                  <div className={styles.option}>
                    <p>{t("delete")}</p>
                    <OptionsSwitchComponent
                      border="none"
                      marginLeft="auto"
                      blackBg={true}
                      isChecked={dataManagement.second}
                      setIsChecked={(isChecked) => {
                        clearTypeIfPreset();
                        const updated = encodeGroup(
                          dataManagement.first,
                          isChecked
                        );
                        setRole((prev) => ({
                          ...prev,
                          dataManagement: updated,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className={styles.accessSection}>
                  <div className={styles.accessSectionTitle}>
                    <p>{t("restrictions")}</p>
                  </div>
                  <div className={styles.option}>
                    <div className={styles.blockGlobalSettings}>
                      <p>{t("blockGlobalSettings")}</p>
                      <span>{t("blockAllBasicContacts")}</span>
                    </div>
                    <OptionsSwitchComponent
                      border="none"
                      marginLeft="auto"
                      blackBg={true}
                      isChecked={restrictions.first}
                      setIsChecked={(isChecked) => {
                        clearTypeIfPreset();
                        const updated = encodeGroup(
                          isChecked,
                          restrictions.second
                        );
                        setRole((prev) => ({
                          ...prev,
                          restrictions: updated,
                        }));
                      }}
                    />
                  </div>
                  <div
                    className={`${styles.option} ${styles.optionsLimitedAccesToFolder}`}
                  >
                    <div className={styles.limitedAccesToFolder}>
                      <p>{t("limitedAccesToFolder")}</p>
                      <OptionsSwitchComponent
                        border="none"
                        marginLeft="auto"
                        blackBg={true}
                        isChecked={restrictions.second}
                        setIsChecked={(isChecked) => {
                          clearTypeIfPreset();
                          const updated = encodeGroup(
                            restrictions.first,
                            isChecked
                          );
                          setRole((prev) => ({
                            ...prev,
                            restrictions: updated,
                          }));
                        }}
                      />
                    </div>
                    <div className={styles.InputComponentContainer}>
                      <InputComponent
                        readOnly={true}
                        value={role?.workspaceLocation || ""}
                        setValue={(value) => {
                          clearTypeIfPreset();
                          setRole((prev) => ({
                            ...prev,
                            workspaceLocation: value,
                          }));
                        }}
                        textButton={t("selectLocation")}
                        placeholder={t("home")}
                        icon={<SearchSVG />}
                        fromImport={"fromImport"}
                        whiteSelectLocationBtn={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AvailableRoles;
