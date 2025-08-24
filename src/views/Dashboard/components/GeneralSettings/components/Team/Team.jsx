import React, { useEffect, useRef, useState } from "react";
import Button from "../../../Button/Button";
import styles from "./Team.module.css";
import SearchIconWithIcon from "../../../SearchIconWithIcon/SearchIconWithIcon";
import KIcon from "../../../../assets/KIcon.svg";
import useFocusShortcut from "../../../../../../utils/useFocusShortcut";
import { ReactComponent as RedTrash } from "../../../../assets/redTrash.svg";
import { ReactComponent as PencilEdit } from "../../../../assets/pencilEdit.svg";
import ModalBlackBgTemplate from "../../../ModalBlackBgTemplate/ModalBlackBgTemplate";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import HeaderCard from "../../../HeaderCard/HeaderCard";
import { ReactComponent as GreenStarIcon } from "../../../../assets/GreenStarIcon.svg";
import { ReactComponent as SearchGray } from "../../../../assets/searchGray.svg";
import { ReactComponent as AddGrayIcon } from "../../../../assets/AddGrayIcon.svg";
import { ReactComponent as OptionsDots } from "../../../../assets/S3/horizontalDots.svg";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";
import {
  getMembersSelectedWorkspacesAction,
  getWorkspacesByIdAction,
  removeMemberWorkspace,
  updateMemberRole,
} from "../../../../../../actions/workspaces";
import { useDispatch, useSelector } from "react-redux";
import { formatAgoDate } from "../../../../../../utils/agoDateUtil";
import SkeletonScreen from "../../../SkeletonScreen/SkeletonScreen";
const Team = () => {
  const [t] = useTranslation(["accountSetting", "Preview"]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMember, setEditingMember] = useState(null); // Guarda el miembro que se está editando
  const [newRole, setNewRole] = useState(""); // Nuevo rol seleccionado
  useEffect(() => {
    const getWorkspaces = async () => {
      await dispatch(getMembersSelectedWorkspacesAction({ searchTerm }));
    };

    getWorkspaces();
  }, [searchTerm]);

  const { membersWorkspaceSelected, accountInfoInSelectedWorkspace } =
    useSelector((state) => state.workspace);

  const searchInputRef = useRef();
  useFocusShortcut(searchInputRef, "k");


  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditMember = (member) => {
    setEditingMember(member);
    setNewRole(member.role?.type); // Inicializa con el rol actual
  };
  const handleSaveRole = async (memberId) => {
    // Aquí llamarías a una acción de Redux o API
    // Ejemplo:
    const res = await dispatch(
      updateMemberRole({
        workspaceId: workspaceSelected._id,
        memberId,
        role: newRole,
      })
    );
    await dispatch(getMembersSelectedWorkspacesAction({ searchTerm }));

    // Cierra el modo edición
    setEditingMember(null);
    setActiveMenuId(null); // Cierra el dropdown
  };

  const { workspaceSelected } = useSelector((state) => state.workspace);

  console.log("membersWorkspaceSelected", membersWorkspaceSelected);
  return (
    <div className={styles.teamContainer}>
      {membersWorkspaceSelected.length == 0 ? (
        <div className={styles.SkeletonScreenContainer}>
          <SkeletonScreen
            labelText={t("membersNotFound")}
            helperText={t("membersListedHere")}
            showInput={true}
            enableLabelClick={false}
          />
        </div>
      ) : (
        <>
          {accountInfoInSelectedWorkspace && (
            <div className={styles.yourAccountInfo}>
              {accountInfoInSelectedWorkspace?.profileImage ? (
                <img src={accountInfoInSelectedWorkspace.profileImage} alt="" />
              ) : (
                <div className={styles.initial}>
                  {accountInfoInSelectedWorkspace?.name?.slice(0, 1)}
                </div>
              )}
              <div className={styles.info}>
                <div className={styles.row}>
                  <strong>{t("you")}</strong>
                </div>
                <div className={styles.row}>
                  <p>{accountInfoInSelectedWorkspace?.role?.type}</p>
                </div>
              </div>
              <span>
                {t("member")}{" "}
                {formatAgoDate({
                  dateString: accountInfoInSelectedWorkspace?.memberSince,
                  t,
                })}
              </span>
            </div>
          )}

          <SearchIconWithIcon
            ref={searchInputRef}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            stylesComponent={{ padding: "0" }}
            classNameIconRight={styles.searchContainerL}
          >
            <img
              src={KIcon}
              alt="filterIcon"
              className={styles.searchContainerIcon}
            />
          </SearchIconWithIcon>

          <div className={styles.accounts}>
            {membersWorkspaceSelected.map((account) => (
              <div key={account.id} className={styles.account}>
                <div className={styles.accountHeader}>
                  <div className={styles.container}>
                    <div className={styles.profileImage}>
                      {account?.profileImage ? (
                        <img src={account.profileImage} alt="" />
                      ) : (
                        <div className={styles.initial}>
                          {account.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className={styles.infoAccount}>
                      <div className={styles.row}>
                        <p>
                          {account?.name} <GreenStarIcon />
                        </p>{" "}
                        {account.status && (
                          <span className={styles.state}>
                            {account?.status}
                          </span>
                        )}
                      </div>
                      <div className={styles.row}>
                        <p>{account.email}</p>
                        <span className={styles.dotName}>.</span>
                        <p className={`${styles.access}`}>
                          {account?.role?.title || account?.role?.type}
                        </p>
                      </div>
                    </div>
                  </div>
                  {account?.memberSince && (
                    <span className={styles.agoDate}>
                      {t("member")}{" "}
                      {formatAgoDate({ dateString: account?.memberSince, t })}
                    </span>
                  )}
                  {account?._id !== user?.id && (
                    <OptionsDots
                      style={{
                        transform: "rotate(90deg)",
                        cursor: "pointer",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveMenuId((prev) =>
                          prev === account._id ? null : account._id
                        );
                      }}
                      className={styles.OptionsDots}
                    />
                  )}
                  {activeMenuId === account._id && (
                    <div ref={menuRef} className={styles.dropdownMenu}>
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditMember(account);
                          setActiveMenuId(null);
                        }}
                      >
                        {t("editMember")}
                      </div>
                      {account?._id !== user?.id && (
                        <div
                          onClick={async (e) => {
                            e.stopPropagation();
                            // handleDeleteWorkspace(account._id);
                            await dispatch(
                              removeMemberWorkspace({
                                workspaceId: workspaceSelected._id,
                                memberId: account._id,
                              })
                            );
                            await dispatch(
                              getMembersSelectedWorkspacesAction({ searchTerm })
                            );
                          }}
                        >
                          {t("removeWorkspace")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {editingMember && editingMember._id === account._id && (
                  <div className={styles.editMemberInline}>
                    <label>
                      {t("role")}
                      <CustomDropdown
                        placeholder={t("category")}
                        options={(workspaceSelected?.roles ?? []).map(
                          (role) => role.title
                        )}
                        selectedOption={newRole?.title || ""}
                        height="31px"
                        textStyles={{
                          display: "flex",
                          fontWeight: 300,

                          userSelect: "none",
                        }}
                        setSelectedOption={(selectedTitle) => {
                          const fullRole = (
                            workspaceSelected?.roles || []
                          ).find((r) => r.title === selectedTitle);
                          console.log("fullRole", fullRole);
                          if (!fullRole) return; // título inválido, no hacer nada
                          setNewRole(fullRole);
                        }}
                      />
                    </label>
                    <div className={styles.editActions}>
                      <Button
                        action={(e) => {
                          e.stopPropagation();
                          setEditingMember(null);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        action={(e) => {
                          e.stopPropagation();
                          handleSaveRole(account._id);
                        }}
                      >
                        {t("save")}
                      </Button>
                    </div>
                  </div>
                )}
                {/* <PencilEdit /> */}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Team;
