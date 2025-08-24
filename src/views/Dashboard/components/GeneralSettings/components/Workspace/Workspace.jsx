import React, { useRef, useState, useEffect } from "react";
import styles from "./Workspace.module.css";
import SearchIconWithIcon from "../../../SearchIconWithIcon/SearchIconWithIcon";
import FiltersDropdownContainer from "../../../FiltersDropdownContainer/FiltersDropdownContainer";
import KIcon from "../../../../assets/KIcon.svg";
import { ReactComponent as FilterIconBars } from "../../../../assets/S3/filterIconBars.svg";
import { ReactComponent as BlackCircleChecked } from "../../../../assets/blackCircleChecked.svg";
import { ReactComponent as GreenStarIcon } from "../../../../assets/GreenStarIcon.svg";
import { ReactComponent as Star } from "../../../../assets/StarYellowIcon.svg";
import { ReactComponent as OptionsDots } from "../../../../assets/S3/horizontalDots.svg";
import ImageEmpty from "../../../../assets/ImageEmpty.svg";
import { useDispatch, useSelector,shallowEqual } from "react-redux";

import { useTranslation } from "react-i18next";
import Button from "../../../Button/Button";
import NewWorkspace from "../../../NewWorkspace/NewWorkspace";
import {
  deleteWorkspace,
  getSelectedWorkspace,
  getWorkspacesByIdAction,
  updateMemberStatusAction,
} from "../../../../../../actions/workspaces";
import { formatAgoDate } from "../../../../../../utils/agoDateUtil";
import {
  selectedWorkspaceUserId,
  updateAccount,
} from "../../../../../../actions/user";
import { setSelectedWorkspaceId, setSelectWorkspace } from "../../../../../../slices/workspaces";
import { useMatch, useNavigate } from "react-router-dom";
import SkeletonScreen from "../../../SkeletonScreen/SkeletonScreen";
import { setShowModal } from "../../../../../../slices/userSlices";

const Workspace = ({
  newWorkspace,
  setShowWorkspace,
  setNewWorkspace,
  setWorkspaceData,
  setShowInviteToWorkspace
}) => {
  const [t] = useTranslation(["accountSetting", "Preview"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const searchInputRef = useRef(null);
  const { user } = useSelector((state) => state.user, shallowEqual);
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z",
    documents: "Mayor a menor",
    contacts: "Mayor a menor",
    assets: "Mayor a menor",
    monthly: "Mayor a menor",
    total: "Mayor a menor",
  });

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
      name: "documents",
      label: t("documents"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menor" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },
    {
      name: "contacts",
      label: t("contacts"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menor" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },
    {
      name: "assets",
      label: t("assets"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menor" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },
  ];
  const { workspaces, selectedWorkspaceId } = useSelector(
    (state) => ({
      workspaces: state.workspace.workspaces,
      selectedWorkspaceId: state.workspace.selectedWorkspaceId,
    }),
    shallowEqual
  );

  useEffect(() => {
    console.log("🚀 useEffect ejecutado");
    const getWorkspaces = async () => {
      console.log("📤 Dispatcheando getWorkspacesByIdAction");
      await dispatch(getWorkspacesByIdAction({ userId: user?.id, searchTerm }));
    };
  
    getWorkspaces();
  }, [user?.id, searchTerm, dispatch]);

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
const navigate= useNavigate()
  const handleEdit = (workspace) => {
    setWorkspaceData(workspace);
    setNewWorkspace(false);

    let basePath = location.pathname;

    basePath = basePath.replace(/\/settings\/[^\/]+/, '');

    basePath = basePath.replace(/\/$/, '');

    const newPath = `${basePath}/settings/${'newWorkspace'}`;

    navigate(newPath);

  };

  const handleSaveUpgrade = async (workspace,workspaceId) => {
    await dispatch(selectedWorkspaceUserId({ workspaceId: workspaceId }));
    await dispatch(setSelectedWorkspaceId(workspaceId));
    //await dispatch(setSelectWorkspace(workspace));
    await dispatch(getSelectedWorkspace())
  };

  const acceptDenieWorkspaceInvitation = async (type, workspaceId) => {
    await dispatch(
      updateMemberStatusAction({ userId: user.id, workspaceId, type })
    );
    await dispatch(getWorkspacesByIdAction({ userId: user?.id }));
  };

  const handleDeleteWorkspace = async (id) => {
    await dispatch(deleteWorkspace({ workspaceId: id }));
    await dispatch(getWorkspacesByIdAction({ userId: user?.id, searchTerm }));
  };

  const match = useMatch(
    "/admin/home/accept-invite/:workspaceId/settings/workspace"
  );
  const lastCalledWorkspaceId = useRef(null);

  useEffect(() => {
    if (!match) return;
    const workspaceId = match.params.workspaceId;
    if (!workspaceId) return;

    if (lastCalledWorkspaceId.current === workspaceId) return;

    lastCalledWorkspaceId.current = workspaceId;
    acceptDenieWorkspaceInvitation("accepted", workspaceId);
  }, [match?.params.workspaceId]);
  console.log('workspaces',workspaces)
  return (
    <div className={styles.workspacesContainer}>
      {workspaces.length == 0 ? (
    <div className={styles.SkeletonScreenContainer}>
          <SkeletonScreen
          labelText={t("workspacesNotFound")}
          helperText={t("workspacesListedHere")}
          showInput={true}
          enableLabelClick={false}
        />
    </div>
      ) : (
        <>
          <div>
            <div className={styles.searchFiltersWorkspace}>
              <SearchIconWithIcon
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                ref={searchInputRef}
              >
                <>
                  <div
                    style={{ marginLeft: "5px" }}
                    className={styles.searchIconsWrappers}
                  >
                    <img src={KIcon} alt="kIcon" />
                  </div>
                </>
              </SearchIconWithIcon>

              <div
                className={styles.filterIconsWrappers}
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <FilterIconBars />
              </div>
            </div>
            {showFilters && (
              <FiltersDropdownContainer
                setSelectedFilters={setSelectedOption}
                selectedFilters={selectedOption}
                options={options}
              />
            )}
          </div>

          <div className={styles.labelContainer}>
            {[...workspaces]
              .sort((a, b) =>
                a._id === selectedWorkspaceId
                  ? -1
                  : b._id === selectedWorkspaceId
                    ? 1
                    : 0
              )
              .map((workspace) => (
                <div
                  className={styles.workspaceContainer}
                  onClick={() => {
                    workspace?.currentMember?.status !== "pending" &&
                      handleSaveUpgrade(workspace,workspace._id);

                      
                  }}
                >
                  <div className={styles.headerWorkspace}>
                    <div className={styles.headerWorkspaceLeft}>
                      <img src={workspace?.image || ImageEmpty} alt="" />
                      <div>
                        <div className={styles.workspaceTitle}>
                          <h3>{workspace.title || t("workspaceName")}</h3>
                          <GreenStarIcon />
                          {workspace?.currentMember?.status !== "pending" && (
                            <span className={styles.workspacesDate}>
                              {formatAgoDate({
                                dateString:
                                  workspace.updatedAt || workspace.createdAt,
                                t,
                              })}
                            </span>
                          )}
                        </div>
                        <div className={styles.infoUser}>
                          <span className={styles.name}>
                            {user.nombre} {workspace?.currentMember?.role?.type}{" "}
                            ·
                          </span>
                          <p className={styles.evaluation}>
                            <Star />
                            4.5
                          </p>
                          <span>
                            {(() => {
                              const status = workspace?.currentMember?.status;
                              const isCreator =
                                workspace?.createdBy === user?.id;

                              if (status === "pending") {
                                return null;
                              }

                              if (isCreator) {
                                return t("usedByUsers", {
                                  count: workspace.countMembers || 0,
                                });
                              }

                              return (
                                <>
                                  {t("memberSince")}{" "}
                                  {formatAgoDate({
                                    dateString:
                                      workspace?.currentMember?.memberSince,
                                    t,
                                  })}
                                </>
                              );
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.headerWorkspaceRight}>
                      {workspace._id == selectedWorkspaceId && (
                        <BlackCircleChecked />
                      )}
                      {workspace?.currentMember?.status !== "pending" && (
                        <OptionsDots
                          style={{
                            transform: "rotate(90deg)",
                            cursor: "pointer",
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveMenuId((prev) =>
                              prev === workspace._id ? null : workspace._id
                            );
                          }}
                        />
                      )}
                      {activeMenuId === workspace._id && (
                        <div ref={menuRef} className={styles.dropdownMenu}>
                          <div onClick={(event) =>{
                            event.stopPropagation();
                             handleEdit(workspace)
                          }}>
                            {t("editWorkspace")}
                          </div>
                          {workspace?.createdBy == user?.id && workspaces.length > 1 && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(setShowModal({
                                  modal: 'deleteChats',
                                  type: 'deleteWorkspace',
                                  variant: 'confirm',
                                  idWorkspace: workspace._id
                                }))
                                // handleDeleteWorkspace(workspace._id);
                              }}
                            >
                              {t("deleteWorkspace")}
                            </div>
                          )}
                          <div onClick={(e) => {
                            e.stopPropagation()
                            setWorkspaceData(workspace);
                            setShowInviteToWorkspace(true)
                          }}>{t("inviteToTeam")}</div>
                          <div>{t("editRating")}</div>
                          <div>{t("leaveWorkspace")}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.workspaceFooter}>
                    {workspace?.currentMember?.status == "pending" && (
                      <>
                        <Button
                          type="gray"
                          headerStyle={{
                            borderRadius: "999px",
                            background: "#ECECF1",
                            color: "#6E6E80",
                            border: "none",
                          }}
                          action={() =>
                            acceptDenieWorkspaceInvitation(
                              "denied",
                              workspace?._id
                            )
                          }
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          headerStyle={{ borderRadius: "999px" }}
                          action={() =>
                            acceptDenieWorkspaceInvitation(
                              "accepted",
                              workspace?._id
                            )
                          }
                        >
                          {t("aceptInvitation")}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Workspace;
