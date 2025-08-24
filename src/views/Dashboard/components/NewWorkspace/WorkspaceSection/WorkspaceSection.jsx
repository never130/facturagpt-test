import React, { useEffect, useState } from "react";
import styles from "./WorkspaceSection.module.css";
import ProfileModalTemplate from "../../ProfileModalTemplate/ProfileModalTemplate";
import EditableInput from "../../AccountSettings/EditableInput/EditableInput";
import ImageEmpty from "../../../assets/ImageEmpty.svg";
import { ReactComponent as TwoPeopleWhite } from "../../../assets/twoPeopleWhite.svg";
import { useTranslation } from "react-i18next";
import Button from "../../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";
import { ReactComponent as WorldIcon } from "../../../assets/WorldIcon.svg";
import { ReactComponent as Padlock } from "../../../assets/PadlockOutlineIcon.svg";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import InputWithTitle from "../../InputWithTitle/InputWithTitle";
import Tab from "../../NewAgentComponent/Tab";
import { Pencil } from "lucide-react";
import AvailableRoles from "./AvailableRoles";
import { getVariable } from "../../../../../actions/user";
const WorkspaceSection = ({
  setSelectedOption,
  newWorkspace,
  workspaceData,
  setWorkspaceData,
  setShowInviteToWorkspace,
  errorMessage
}) => {
  const [t,i18n] = useTranslation("accountSetting");
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [togglePasswordInput, setTogglePasswordInput] = useState(false);

  const { user } = useSelector((state) => state.user);
  const variables = useSelector((state) => state.variables.variables);
const dispatch = useDispatch()
  const handleChangeImage = (key, value) => {
    setWorkspaceData((prev) => ({ ...prev, [key]: value }));
  };

 
  
  useEffect(() => {
    dispatch(getVariable({ type: 'category' }));
  }, [dispatch]);


  console.log('workspaceData',workspaceData)
  const languageMap = {
    Español: "es-ES",
    English: "en-US",
    Français: "fr-FR",
    Italiano: "it-IT",
    Deutsch: "de-DE",
    Português: "pt-PT",
    普通话: "zh-CN",
    日本語: "ja-JP",
  };

  const currentLanguageDisplayName = i18n.language; // Suponiendo que devuelve "Español", "Inglés", etc.

// Mapea al código real
const locale = languageMap[currentLanguageDisplayName] || "es-ES";
  return (
    <div>
      <div
        className={`${styles.workspaceSectionLabel} ${styles.workspaceSectionLabelName}`}
      >
        <ProfileModalTemplate
          image={workspaceData?.image}
          handleContactData={handleChangeImage}
          id={workspaceData?._id}
          sticky={true}
          customStyle={{
            width: "80px",
            height: "80px",
            borderRadius: "10px",
          }}
          camStyles={{
            padding: "2px",
          }}
        />

        <div className={styles.workspaceDataInfo}>
          <div className={styles.workspaceNameContainer}>
            {!editingName ? (
              <span>{workspaceData?.title || t("workspaceName")}</span>
            ) : (
              <input
                type="text"
                value={workspaceData?.title}
                placeholder={"workspaceName"}
                onChange={(e) =>
                  setWorkspaceData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            )}{" "}
            <Pencil onClick={() => setEditingName((prev) => !prev)} />
          </div>
          <div>
          {errorMessage?.type == 'title' && (
            <div className={styles.errorMessage}>{errorMessage.message}</div>
          )}
          <span>50 {t("access")}</span>
          </div>
        </div>

      </div>

      <div className={styles.workspaceSectionLabel}>
        <p>{t("access")}</p>
        <div className={styles.accessInfo}>
          <div>
            <p>{user.nombre}</p>

            <div>
              <div className={styles.access}>
                <span className={styles.accessType}>{t("fullAccess")}</span>
                <span className={styles.rol}>Admin</span>
              </div>
            </div>
          </div>

          <img src={user?.profileImage || ImageEmpty} alt="" />
        </div>
      </div>

     

<div className={styles.workspaceSectionLabel}>
  <p>{t("creationDate")}</p>
  <span className={styles.descSection}>
    {workspaceData?.createdAt
      ? new Date(workspaceData.createdAt).toLocaleString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: false, // Usa 24h por defecto; si quieres 12h en EN/ES, puedes condicionar
        })
      : new Date().toLocaleString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })
    }
  </span>
</div>

{(workspaceData?.currentMember?.role?.type !== 'owner' && workspaceData?.currentMember?.role?.type) && (
  <div className={styles.workspaceSectionLabel}>
    <p>{t("incorporationDate")}</p>
    <span className={styles.descSection}>
      {workspaceData?.currentMember?.memberSince
        ? new Date(workspaceData.currentMember.memberSince).toLocaleString(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
          })
        : "-"
      }
    </span>
  </div>
)}
      <div className={styles.communitySection}>
        <div className={styles.headerCommunity}>
          <p className={styles.subTitle}>{t("community")}</p>

          <div className={styles.notificationSoundSelect}>
            {workspaceData?.type == "private" ? (
              <>
                <Padlock
                  className={`${styles.typeIcon} ${workspaceData.type == "private" && styles.selectedTypeicon}`}
                />{" "}
                {t("private")}
              </>
            ) : (
              <>
                <WorldIcon
                  className={`${styles.typeIcon} ${workspaceData.type == "public" && styles.selectedTypeicon}`}
                />
                {t("public")}
              </>
            )}
            <OptionsSwitchComponent
              border="none"
              marginLeft="auto"
              isChecked={workspaceData.type === "public"}
              blackBg={true}
              setIsChecked={(isChecked) =>
                setWorkspaceData((prev) => ({
                  ...prev,
                  type: isChecked ? "public" : "private", 
                }))
              }
            />
          </div>
        </div>

        {(workspaceData.type === "private" ||
          workspaceData.type === "public") && (
          <>
            <CustomDropdown
              placeholder={t("category")}
              options={(variables?.data ?? []).map(
                (variable) => variable.title
              )}
              selectedOption={workspaceData?.category}
              height="31px"
              textStyles={{
                display: "flex",
                fontWeight: 300,

                userSelect: "none",
              }}
              setSelectedOption={(selected) =>
                setWorkspaceData((prev) => ({
                  ...prev,
                  category: selected,
                }))
              }
            />
            {false && (
              <div>
                <div className={styles.activateKeyContainer}>
                  <OptionsSwitchComponent
                    border="none"
                    marginLeft="0"
                    isChecked={workspaceData.activateKey}
                    blackBg={true}
                    setIsChecked={(val) =>
                      setWorkspaceData((prev) => ({
                        ...prev,
                        activateKey: val,
                      }))
                    }
                  />
                  <p>{t("key")}</p>
                  <span>{t("peopleKnowKey")}</span>
                </div>
                {true && (
                  <InputWithTitle
                    bgColor="var(--f4-background)"
                    titleColor="var(--_18181b-color)"
                    placeholder={t("key")}
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
                      setWorkspaceData((prev) => ({
                        ...prev,
                        key: e.target.value,
                      }))
                    }
                    value={workspaceData.key}
                  />
                )}
              </div>
            )}
          </>
        )}
        {workspaceData.type == "public" && (
          <>
            <div className={`${styles.typeContact}`}>
              <Tab
                className={workspaceData.typePay == "free" && styles.selected}
                setLocalAgent={() =>
                  setWorkspaceData((prev) => ({
                    ...prev,
                    typePay: "free",
                  }))
                }
                title={t("free")}
              />

              <Tab
                className={
                  workspaceData.typePay == "singlePayment" && styles.selected
                }
                setLocalAgent={() =>
                  setWorkspaceData((prev) => ({
                    ...prev,
                    typePay: "singlePayment",
                  }))
                }
                title={t("singlePayment")}
              />

              <Tab
                className={
                  workspaceData.typePay == "monthlyPayment" && styles.selected
                }
                setLocalAgent={() =>
                  setWorkspaceData((prev) => ({
                    ...prev,
                    typePay: "monthlyPayment",
                  }))
                }
                title={t("monthlyPayment")}
              />
            </div>
            {workspaceData.typePay != "free" && (
              <div className={styles.customLabel}>
           
                <div className={styles.infoCustomLabel}>
                  <InputWithTitle
                    bgColor="var(--f4-background)"
                    titleColor="var(--_18181b-color)"
                    placeholder={t("price")}
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
                      setWorkspaceData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    value={workspaceData.price}
                  />
           
                </div>
              </div>
            )}
          </>
        )}
        <p className={styles.subTitle}>{t("publicRoleAvailable")}</p>
        <span className={styles.selectWhichRoleUserCanChoose}>
          {t("selectWhichRoleUserCanChoose")}
        </span>
        <CustomDropdown
          placeholder={t("category")}
          options={["admin", "admin"]}
          selectedOption={workspaceData?.publicRole}
          height="31px"
          textStyles={{
            display: "flex",
            fontWeight: 300,

            userSelect: "none",
          }}
          setSelectedOption={(selected) =>
            setWorkspaceData((prev) => ({
              ...prev,
              publicRole: selected,
            }))
          }
        />
      </div>

      <div className={styles.workspaceSectionLabel}>
        <div className={styles.password}>
          <p>{t("password")}</p>
          <span>{t("necessaryForModifications")}</span>
        </div>
        <div className={styles.passwordInputContainer}>
          <div>
            <Pencil onClick={() => setEditingPassword((prev) => !prev)} />

            {!editingPassword ? (
              <span>
                {togglePasswordInput
                  ? workspaceData?.password ||
                    "*".repeat(workspaceData?.password?.length || 7)
                  : "*".repeat(workspaceData?.password?.length || 7)}
              </span>
            ) : (
              <input
                type={togglePasswordInput ? "text" : "password"}
                placeholder="*******"
                value={workspaceData?.password}
                onChange={(e) =>
                  setWorkspaceData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            )}

            <p
              className={styles.see}
              onClick={() => setTogglePasswordInput((prev) => !prev)}
            >
              {t("see")}
            </p>
          </div>
        </div>
      </div>
      {!newWorkspace && (
        <div className={styles.workspaceSectionLabel}>
          <p>{t("invite")}</p>
          <Button
            headerStyle={{ borderRadius: "999px" }}
            action={() => setShowInviteToWorkspace(true)}
          >
            {t("invite")} <TwoPeopleWhite />
          </Button>
        </div>
      )}
      <AvailableRoles
        workspaceData={workspaceData}
        setWorkspaceData={setWorkspaceData}
      />
      <div className={styles.accessSection}>
        <div
          className={`${styles.option} ${styles.restrictThirdPartyBotsOption}`}
        >
          <div>
            <p>{t("restrictThirdPartyBots")}</p>
            <span>{t("restrictThirdPartyBotsInfo")}</span>
          </div>
          <OptionsSwitchComponent
            border="none"
            marginLeft="auto"
            blackBg={true}
            isChecked={workspaceData?.restrictThirdPartyBots} 
            setIsChecked={(isChecked) => {
              setWorkspaceData((prev) => ({
                ...prev,
                restrictThirdPartyBots: isChecked,
              }));
            }}
          />
        </div>
      </div>
      <div
        className={`${styles.accessSection} ${styles.leaveTheWorkspaceSection}`}
      >
        <p>{t("leaveTheWorkspace")}</p>
        <Button headerStyle={{ borderRadius: "999px" }} type="gray">
          {t("transferProperty")}
        </Button>
        <Button headerStyle={{ borderRadius: "999px" }} type="discard">
          {t("leave")}
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceSection;
