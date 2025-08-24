import styles from "./HomeExplorer.module.css";
import { useEffect, useState, useRef } from "react";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as IconExpand } from "./assets/icon-expand.svg";
import { ReactComponent as IconCollapse } from "./assets/icon-expand.svg";
import SortableItem from '../NavigationPopups/ContactAssetNavigation/SortableItem'
import { ReactComponent as IconAddAsset } from "./assets/icon-add-asset.svg";
import { ReactComponent as IconAddBot } from "./assets/icon-add-bot.svg";
import { ReactComponent as IconAddContact } from "./assets/icon-add-contact.svg";
import { ReactComponent as IconContracted } from "./assets/iconContracted.svg";
import { ReactComponent as IconAddEvent } from "./assets/icon-add-event.svg";
import { ReactComponent as IconAddFolder } from "./assets/icon-add-folder.svg";
import { ReactComponent as IconAddTable } from "./assets/icon-add-table.svg";
import { ReactComponent as IconAddWorkflow } from "./assets/icon-add-workflow.svg";
import { ReactComponent as IconBots } from "./assets/icon-bots.svg";
import { ReactComponent as IconCalendar } from "./assets/icon-calendar.svg";
import { ReactComponent as IconChats } from "./assets/icon-chats.svg";
import { ReactComponent as IconConf } from "./assets/icon-conf.svg";
import { ReactComponent as IconContact } from "./assets/icon-contact.svg";
import { ReactComponent as IconDocument } from "./assets/icon-document.svg";
import { ReactComponent as IconExploreCommunity } from "./assets/icon-explore-community.svg";
import { ReactComponent as IconAsset } from "./assets/icon-asset.svg";
import { ReactComponent as IconHelp } from "./assets/icon-help.svg";
import { ReactComponent as IconMore } from "./assets/icon-more.svg";
// import { ReactComponent as IconPanel } from "./assets/icon-panel.svg";
import { ReactComponent as IconStar } from "./assets/icon-star.svg";
import { ReactComponent as IconSuggestion } from "./assets/icon-suggestion.svg";
import { ReactComponent as IconTable } from "./assets/icon-table.svg";
import { ReactComponent as IconTables } from "./assets/icon-tables.svg";
import { ReactComponent as IconTransaction } from "./assets/icon-transaction.svg";
import { ReactComponent as IconUpload } from "./assets/icon-upload.svg";
import { ReactComponent as IconWorkflows } from "./assets/icon-workflows.svg";
import { ReactComponent as IconAddTransaction } from "./assets/icon-add-transaction.svg";
import { ReactComponent as IconWorkspace } from "./assets/icon-workspace.svg";
import { ReactComponent as IconDoc } from "./assets/icon-doc.svg";
import { ReactComponent as IconAddChat } from "./assets/icon-add-chat.svg";
import { ReactComponent as ContactIconColor } from "../../assets/contactIconColor.svg";
import { ReactComponent as AssetIconColor } from "../../assets/assetIconColor.svg";
import { ReactComponent as DocIconColor } from "../../assets/docIconColor.svg";
import { ReactComponent as TableIconColor } from "../../assets/tableIconColor.svg";
import { ReactComponent as TableIconDefault } from "../../assets/tableIconDefault.svg";
import { ReactComponent as TableIconAdd } from "../../assets/tableIconAddDefault.svg";
import { ReactComponent as FolderIconColor } from "../../assets/folderIconColor.svg";
import TruncatedText from "../FileExplorer/TruncatedText/TruncatedText";
import { setGlobalSearch, setShowModal } from "../../../../slices/userSlices";
import { createTable, getTablesWithCounts, reorderedTable, getTables, getTableDataFiltered} from "../../../../actions/user";
import { useTranslation } from "react-i18next";
import { setCurrentPath } from "../../../../slices/scalewaySlices";




const HomeExplorer = ({
    isOpen,
    setIsOpen,
    isTransparent,
    setActiveFileExplore,
    activeFileExplore,
    zIndex,
    expanded,
    handleSidebarClose
}) => {
    const { t } = useTranslation(["Contacts", "Assets"]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { workspaceSelected } = useSelector((state) => state.workspace);

    const {
        user,
        tablesSidebar,
        tableDataMap
    } = useSelector((state) => state.user);

    // console.log('tableDataMap HomeExplorer', tableDataMap)

    const sortByOrder = (arr) => {
        if (!arr || !Array.isArray(arr)) return [];
        return [...arr].sort((a, b) => a.order - b.order);
    }
    const ordered = sortByOrder(tablesSidebar)
    const [tables, setTables] = useState(ordered)

    useEffect(() => {
        setTables(ordered)
    }, [tablesSidebar])


    let isExpanded = isOpen;

    const [menuSections, setMenuSections] = useState([{
        name: t('expand'),
        icon: <IconExpand />,
        iconContracted: <IconContracted style={{ width: "30px", height: "30px" }} />,
        action: () => {
            if (isExpanded) {
                setIsOpen(false);
                isExpanded = false;
            } else {
                setIsOpen(true);
                isExpanded = true;
            }
        }
    }, {
        name: t('conversations'),
        label: "Conversations",
        icon: <IconChats />,
        label: 200,
        action: () => {
            setIsOpen(true);
            setActiveFileExplore(false);
            navigate("/admin/chats");
        }
    }
    // , {
    //     name: t('Panel'),
    //     icon: <IconPanel />,
    //     action: () => {
    //         navigate("/admin/home");
    //     }
    // }
    , {
        name: t('Workflows'),
        icon: <IconWorkflows />,
        label: 200,
        action: () => {
            // dispatch(setShowModal('automate'));
            navigate("/admin/workflow");
        }
    }, {
        name: t('bots'),
        icon: <IconBots />,
        action: () => {
            dispatch(setShowModal('selectAgent'));
        }
    }, {
        name: t('docs'),
        label: "Documentos",
        icon: <IconDoc />,
        label: 10,
        // Implementamos manejo de click y doble click
        action: (() => {
            let clickTimeout = null;
            return () => {
                if (clickTimeout !== null) {
                    // Doble click detectado
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                    // Buscamos en el localStorage la clave "lastPath" y la vaciamos
                    navigate("/admin/panel/");
                    dispatch(setCurrentPath(user.id + "/"));
                    dispatch(setGlobalSearch(""))
                } else {
                    // Click simple detectado, esperamos por si hay doble click
                    clickTimeout = setTimeout(() => {
                        setIsOpen(true);
                        setActiveFileExplore(prev => !prev);
                        clickTimeout = null;
                    }, 250); // 250ms es un tiempo estándar para distinguir doble click
                }
            };
        })()
    }
    // , {
    //     name: t('calendar'),
    //     label: "Calendar",
    //     icon: <IconCalendar />,
    //     label: 2,
    //     action: () => {
    //         navigate("/admin/calendar");
    //     }
    // }
])

    const [menuPoints, setMenuPoints] = useState([{
        name: t('newDocument'),
        icon: <IconAddTransaction />,
        action: () => {
            dispatch(setShowModal('newDocument'));
        }
    }, {
        name: t('uploadFile'),
        icon: <IconUpload />,
        action: () => {
            dispatch(setShowModal('location'));

        }
    }, {
        name: t('more'),
        icon: <IconMore />,
        action: () => {

            setMenuPoints(prevMenuPoints => {
                const arr = prevMenuPoints.filter(item => item.disabled == false);

                if (arr.length == 0) {
                    return [
                        prevMenuPoints[0],
                        prevMenuPoints[1],
                        prevMenuPoints[2],
                        ...prevMenuPoints.slice(3).map(item => ({
                            ...item,
                            disabled: false
                        }))
                    ];
                } else {
                    return [
                        prevMenuPoints[0],
                        prevMenuPoints[1],
                        prevMenuPoints[2],
                        ...prevMenuPoints.slice(3).map(item => ({
                            ...item,
                            disabled: true
                        }))
                    ];
                }
            });
        }
    }, {
        name: t('newTable'),
        icon: <IconAddTable />,
        disabled: true,
        action: () => {
            navigate("/admin/tables");
        }
    }, {
        name: t('newFolder'),
        icon: <IconAddFolder />,
        disabled: true,
        action: () => {
            dispatch(setShowModal('createFolder'));
        }
    }, {
        name: t('newContact'),
        icon: <IconAddContact />,
        disabled: true,
        action: () => {
            dispatch(setShowModal('newContact'));
        }
    }, {
        name: t('newAsset'),
        icon: <IconAddAsset />,
        disabled: true,
        action: () => {
            dispatch(setShowModal('newAsset'));
        }
    }, {
        name: t('newChat'),
        icon: <IconAddChat />,
        disabled: true,
        action: () => {
            navigate("/admin/chats");
        }
    }, {
        name: t('newWorkflow'),
        icon: <IconAddWorkflow className={styles.noFill} />,
        disabled: true,
        action: () => {
            dispatch(setShowModal('automate'));
        }
    }
    // , {
    //     name: t('newEvent'),
    //     icon: <IconAddEvent />,
    //     disabled: true,
    //     action: () => {
    //         navigate("/admin/calendar/week");
    //     }
    // }
])
    const tablePagination = 5
    const [menuTable, setMenuTable] = useState(0)
    const [less, setLess] = useState([{
        name: t('less'),
        icon: <IconMore />,
        action: () => {
            setMenuTable((prev) => prev - 1)
        }
    }])
    const [more, setMore] = useState([
        {
            name: t('more'),
            icon: <IconMore />,
            action: () => {
                setMenuTable((prev) => prev + 1)
            }
        }])

    const [menuTables, setMenuTables] = useState([{
        name: t('tables'),
        icon: <TableIconDefault className={styles.iconTable} />,
        // icon: <IconTables />,
        action: () => {
            navigate("/admin/tables");
        }
    },

    ])

    const [menuMore, setMenuMore] = useState([{
        name: t('explorerCommunity'),
        icon: <IconExploreCommunity />,
        action: () => {
            navigate('/admin/marketplace')
        }
    }, {
        name: t('getPlus'),
        icon: <IconStar />,
        action: () => {
            dispatch(setShowModal('plus'));
        }
    }, {
        name: t('setting'),
        icon: <IconConf />,
        action: () => {
            let path = location.pathname.split("/");

            if (path[2]) {
                path = '/' + path[2]
            }

            navigate(`/admin${path}/settings/general`);
            dispatch(setShowModal('settings'));
        }
    }, {
        name: t('helpCenter'),
        icon: <IconHelp />,
        action: () => {
            window.open('/help', '_blank');
        }
    }, {
        name: t('sendSuggestion'),
        icon: <IconSuggestion />,
        action: () => {
            window.open('/contacts', '_blank');
        }
    }
    ]);


    const timeoutRef = useRef(null)


    const [isHoverPoint, setIsHoverPoint] = useState(null);



    const isHover = (e, name) => {
        if (!e) return setIsHoverPoint(null);

        const x = e.target.getBoundingClientRect().x;
        const y = e.target.getBoundingClientRect().y;
        setIsHoverPoint({ x, y, name });
    }

    const typeIcons = {
        contacts: <ContactIconColor />,
        docs: <DocIconColor />,
        assets: <AssetIconColor />,
        blank: <TableIconColor />,
    };

    useEffect(() => {
        const getTables = async () => {
            const res = await dispatch(getTablesWithCounts())
        }
        getTables()
    }, [workspaceSelected])


    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = tables.findIndex((p) => p._id === active.id);
            const newIndex = tables.findIndex((p) => p._id === over.id);

            const reordered = arrayMove(tables, oldIndex, newIndex);


            setTables(reordered);

            const fn = async () => {
                
               await dispatch(reorderedTable(reordered))
    
                let res;
                let tables = [];
                  res = await dispatch(getTables());
                  if (res.payload?.tables) {
                    tables = res.payload.tables;
                  }
                
            
                if (tables.length > 0) {
                  for (let table of tables) {
                    await dispatch(getTableDataFiltered({tableId: table._id}));
                  }
                }
            }
            fn()


        }
    };


    return (
        <>
            <div className={`${styles.container} ${isOpen ? styles.activeTab : ""} ${isTransparent ? styles.isTransparent : ""}`} style={zIndex} >

                {user?.payMethod?.length == 0 && (
                    <div className={styles.workspaceContainer}>
                        <div>
                            <IconWorkspace />
                        </div>
                        <b>
                            Workspace 1
                        </b>
                        <IconStar />
                    </div>
                )}

                <div className={styles.menuSections}>
                    {menuSections.map((item) => (
                        <div
                            key={item.name}
                            className={styles.menuItem}
                            onClick={(e) => {
                                e.stopPropagation()
                                item.action()
                                handleSidebarClose && handleSidebarClose()
                            }}
                            style={{
                                display: item.disabled ? "none" : "flex"
                            }}
                            onMouseEnter={(e) => isHover(e, item.name)}
                            onMouseLeave={(e) => isHover(null)}
                        >
                            <div className={styles.menuItemIcon}>
                                {item.name == t('expand') && isOpen ? item.iconContracted : item.icon}
                                {item.label && isOpen && (
                                    <label>{item.label}</label>
                                )}
                            </div>
                            <span>{item.name}</span>
                            {item.label && (
                                <label>{item.label}</label>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.menuSections}>
                    {menuPoints.map((item) => (
                        <div
                            key={item.name}
                            className={styles.menuItem}
                            onClick={() => {
                                item.action()
                                handleSidebarClose && handleSidebarClose()
                            }}
                            style={{
                                display: item.disabled ? "none" : "flex"
                            }}
                            onMouseEnter={(e) => isHover(e, item.name)}
                            onMouseLeave={(e) => isHover(null)}
                        >
                            <div className={styles.menuItemIcon}>
                                {item.icon}
                            </div>
                            <span>{item.name}</span>
                            {item.label && (
                                <label>{item.label}</label>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.menuSections}>
                    {menuTables.map((item) => (
                        <div
                            key={item.name}
                            className={styles.menuItem}
                            onClick={() => {
                                item.action()
                                handleSidebarClose && handleSidebarClose()
                            }}
                            style={{
                                display: item.disabled ? "none" : "flex"
                            }}
                            onMouseEnter={(e) => isHover(e, item.name)}
                            onMouseLeave={(e) => isHover(null)}
                        >
                            <div className={styles.menuItemIcon} style={{ color: item.color }} >
                                {item.icon}
                            </div>
                            <span>{item.name}</span>
                            {item.label && (
                                <label>{item.label}</label>
                            )}
                        </div>
                    ))}

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={tables?.length > 0 ? tables?.slice(0, (menuTable + 1) * tablePagination).map(p => p._id) : []} strategy={verticalListSortingStrategy}>
                            <ul>

                                {tables?.slice(0, (menuTable + 1) * tablePagination).map((table, index) => (
                                    <SortableItem
                                        key={table._id}
                                        parameter={table}
                                        tableData={tableDataMap[table._id]?.filter(tab=> tab.main == true)[0] || {}}
                                        index={index}
                                        action={() => {
                                            navigate(`/admin/tables/${table._id}`)
                                            handleSidebarClose && handleSidebarClose()
                                        }}
                                        father={'homeExplorerTable'}
                                        TruncatedText={TruncatedText}
                                        typeIcons={typeIcons}
                                        isOpen={isOpen}
                                        isHover={isHover}
                                    />
                                ))}
                            </ul>
                        </SortableContext>
                    </DndContext>



                    {menuTable > 0 &&
                        (less.map((item) => (
                            <div
                                key={item.name}
                                className={styles.menuItem}
                                onClick={() => {
                                    item.action()
                                    handleSidebarClose && handleSidebarClose()
                                }}
                                style={{
                                    display: item.disabled ? "none" : "flex"
                                }}
                                onMouseEnter={(e) => isHover(e, item.name)}
                                onMouseLeave={(e) => isHover(null)}
                            >
                                <div className={styles.menuItemIcon}>
                                    <p style={{ fontSize: "40px" }}>-</p>
                                </div>
                                <span>{item.name}</span>
                                {item.label && (
                                    <label>{item.label}</label>
                                )}
                            </div>
                        )))}
                    {(tables.length > 4 && (menuTable + 1) * tablePagination < tables.length) &&
                        (more.map((item) => (
                            <div
                                key={item.name}
                                className={styles.menuItem}
                                onClick={() => {
                                    item.action()
                                    handleSidebarClose && handleSidebarClose()
                                }}
                                style={{
                                    display: item.disabled ? "none" : "flex"
                                }}
                                onMouseEnter={(e) => isHover(e, item.name)}
                                onMouseLeave={(e) => isHover(null)}
                            >
                                <div className={styles.menuItemIcon}>
                                    {item.icon}
                                </div>
                                <span>{item.name}</span>
                                {item.label && (
                                    <label>{item.label}</label>
                                )}
                            </div>
                        )))}
                    <div
                    className={styles.menuItem}
                        onMouseEnter={(e) => {
                            clearTimeout(timeoutRef.current)
                            dispatch(setShowModal({
                                name: "add",
                                // x: 40 + e.target.getBoundingClientRect().x,
                                x: 52,
                                y: e.target.getBoundingClientRect().y - 360
                            }))
                            // setIsHoverMixedTable()
                        }}
                        onMouseLeave={() => {
                            // setIsHoverMixedTable(null)
                            timeoutRef.current = setTimeout(() => {
                                dispatch(setShowModal(null))
                            }, 3000)
                            // dispatch(setShowModal(null))
                        }}
                        onClick={async () => {
                                  await dispatch(
                                    createTable({ headers:   [
                                        {
                                          "title": "parameter 1",
                                          "key": "parameter 1",
                                          "label": "parameter 1",
                                          "type": "",
                                          "selected": false,
                                          "editing": false
                                        }
                                      ],
                                       name: "newTable",
                                        type: "blank", 
                                        color: "#black", 
                                        selectedTags: [],
                                         userEmail: user.email, 
                                         activateAlerts: false,
                                         accessPermitType: "public",
                                         selectedColumnOption: "none",
                                         tags: [] })
                                  );
                                  let tables = [];
                            
                                  const res = await dispatch(getTables());
                                  if (res.payload?.tables) {
                                    // console.log("res.payload.tables", res.payload.tables)
                                    tables = res.payload.tables;
                                  }
                                //   console.log("tables", tables);
                            
                                if (tables.length > 0) {
                                  for (let table of tables) {
                                    console.log('table', table._id)
                                    await dispatch(
                                      getTableDataFiltered({
                                        tableId: table._id,
                                      })
                                    );
                                  }
                                }
                                await dispatch(getTablesWithCounts())
                        }}
                    >
                        <div className={styles.menuItemIcon}>
                            <TableIconAdd />
                        </div>
                        <span>
                            Nueva tabla
                        </span>
                        <label>
                            AI ASK
                        </label>
                    </div>
                </div>

                
                <div className={styles.menuSections}>
                    {menuMore.map((item) => (
                        <div
                            key={item.name}
                            className={styles.menuItem}
                            onClick={() => {
                                item.action()
                                handleSidebarClose && handleSidebarClose()
                            }}
                            style={{
                                display: item.disabled ? "none" : "flex"
                            }}
                            onMouseEnter={(e) => isHover(e, item.name)}
                            onMouseLeave={(e) => isHover(null)}
                        >
                            <div className={styles.menuItemIcon}>
                                {item.icon}
                            </div>
                            <span>{item.name}</span>
                            {item.label && (
                                <label>{item.label}</label>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {isHoverPoint && (
                <div
                    className={`${styles.tooltip} ${isOpen ? styles.active : ""}`}
                    style={{
                        position: "absolute",
                        top: isHoverPoint?.y || 100,
                        left: 64,
                        zIndex: 1000
                    }}>
                    {isHoverPoint?.name || "test"}
                </div>
            )}


        </>
    );
};

export default HomeExplorer;