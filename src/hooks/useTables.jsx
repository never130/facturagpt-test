import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  createTable,
  createTableData,
  createVariable,
  deleteRowTable,
  deleteTable,
  getTableById,
  getTableData,
  getTableDataFiltered,
  getTables,
  getTablesWithCounts,
  getVariable,
  refreshTableInfo,
  updateTableData,
  updateTableName,
  updateTableType,
  createVariableTableData,
  updateVariableTableData
} from "../actions/user";
import optionDots from "../views/Dashboard/assets/optionDots.svg";
import emptyImage from "../views/Dashboard/assets/ImageEmpty.svg";
import { useRef, useState, useEffect } from "react";
import AmountTransaction from "../views/Dashboard/components/AmountTransaction/AmountTransaction";
import {
  setContact,
  setContactTableId,
  setFatherNewContact,
} from "../slices/contactsSlices";
import { setPaginationSlice } from "../slices/paginationSlices";
import { setAsset, setFatherNewAsset } from "../slices/assetsSlices";
import { setFatherNewBill, setShowModal } from "../slices/userSlices";
import { useLocation, useNavigate } from "react-router-dom";
import OptionsPopup from "../views/Dashboard/components/OptionsPopup/OptionsPopup";
import { ReactComponent as IconContact } from "../views/Dashboard/components/HomeExplorer/assets/icon-contact.svg";
import { ReactComponent as IconDocument } from "../views/Dashboard/components/HomeExplorer/assets/icon-document.svg";
import { ReactComponent as IconTables } from "../views/Dashboard/components/HomeExplorer/assets/icon-tables.svg";
import { ReactComponent as IconAsset } from "../views/Dashboard/components/HomeExplorer/assets/icon-asset.svg";
import { ReactComponent as StarPlus } from "../views/Dashboard/assets/starPlus.svg";
import { ReactComponent as IconFolder } from "../views/Dashboard/assets/folderClosed.svg";
import { getAllContacts } from "../actions/contacts";
import { formatAgoDate } from "../utils/agoDateUtil";
import e from "cors";

export default function useTables({ id, styles }) {
  const dispatch = useDispatch();
  const { user, tableView } = useSelector((state) => state.user);
  const { t } = useTranslation(["Contacts", "Assets"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z",
    Estado: "Todos",
    "Moneda Preferida": "USD",
    "# Transacciones": "Mayor a menos",
    "Ingresos/Costes": "Ingresos de mayor a menor",
  });
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [contactSelected, setContactSelected] = useState([]);
  const inputRef = useRef(null);
  const popupButtonRef = useRef([]);
  const [colorSelectedOptions, setColorSelectedOptions] = useState([]);
  const [editedTableName, setEditedTableName] = useState("");
  const [editingTableId, setEditingTableId] = useState(null);

  const [activeTable, setActiveTable] = useState(null);
  const dynamicTableRef = useRef(null);
  const [activeSelectIndex, setActiveSelectIndex] = useState(null);
  const [showNewContact, setShowNewContact] = useState(false);

  const [newAsset, setShowNewAsset] = useState(false);
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [showNewBill, setShowNewBill] = useState(false);

  const [currentTableId, setCurrentTableId] = useState(null);
  const [currentTableType, setCurrentTableType] = useState(null);
  const [showPopupNewContact, setShowPopupNewContact] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupNewAsset, setShowPopupNewAsset] = useState(false);
  const [showPopupNewTransaction, setShowPopupNewTransaction] = useState(false);
  const [docSelected, setDocSelected] = useState(false);
  const [reloadVariable, setReloadVariable] = useState(false);
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(true);
  const [state, setState] = useState({
    parameters: [],
  })

  const createNewTable = async () => {
    // await dispatch(
    //   createTable({ headers: headersTable, name: "", type: "blank" })
    // );
    dispatch(setShowModal('newTable'))
    // getAllTables();
    const res = await dispatch(getTablesWithCounts());
    if (id) {
      navigate("/admin/tables");
    }
  };
  const [stats, setStats] = useState([
    { title: "docs", total: 0 },
    { title: "contacts", total: 0 },
    { title: "assets", total: 0 },
    { title: "new Table", total: 0 },
    { title: "newTable", action: createNewTable },
  ]);

  const [selectedAgent, setSelectedAgent] = useState(false);
  const [showCreateParameterFromPopup, setShowCreateParameterFromPopup] =
    useState(false);
  const [currentParameter, setCurrentParameter] = useState(null)
  const [showSelectAgent, setShowSelectAgent] = useState(false);
  // const optionsDropdown = [
  //   t("#0000ff"),
  //   t("var(--_10a37f-background)"),
  //   t("#F6851b"),
  //   t("#000000"),
  //   t("#d4af37"),
  // ];

  const optionsDropdown = [
     "docs",
     "assets",
     "contacts",
     "blank",
     "folder",
  ]

  // const typeIcons = {
  //   docs: <IconDocument />,
  //   assets: <IconAsset />,
  //   contacts: <IconContact />,
  //   blank: <IconTables />,
  //   folder:<IconFolder />,
  // };

  const [tableSelectedColor, setTableSelectedColor] = useState(true);
  const [allTransactionsInfo, setAllTransactionsInfo] = useState([]);
  const [allAssetsInfo, setAllAssetsInfo] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [talkToAIAssetInfo, setTalkToAIAssetInfo] = useState(null);

  const selectRef = useRef(null);

  const longPressTriggeredRef = useRef(false);
  const timerRef = useRef(null);

  const inputRefs = useRef({});
  const [showDeleteTableModalParameter, setShowDeleteTableModalParameter] = useState(null)  

  const { tables, tableDataMap, totalPaginationTables, currentTableNew } =
    useSelector((state) => state.user);
  const navigate = useNavigate();

  const [selectedElements, setSelectedElements] = useState({
 
  });

  const deleteParameterDB = async (parameter) => {

    if(tableView?.variables?.length > 0 && tableView?.variables?.find(param => param.id == parameter.id)){
    let newTable = tableView.variables.filter(param => param.id !== parameter.id)

    await dispatch(createVariable({
              variableData: {
                category: "tableView", title: "tableView", type: "tableView", variables: newTable,
              }
            }))
            await dispatch(getVariable({ type: 'tableView' }))
          }
  

  }


  useEffect(() => {
    setSelectedElements((prevSelectedAssets) => {
      const newSelectedAssets = { ...prevSelectedAssets };
      Object.entries(contactSelected).forEach(([tableId, selectedIds]) => {
        if (!newSelectedAssets[tableId]) {
          newSelectedAssets[tableId] = {};
        }
        Object.keys(newSelectedAssets[tableId]).forEach((rowId) => {
          if (!selectedIds.includes(rowId)) {
            delete newSelectedAssets[tableId][rowId];
          }
        });
        selectedIds.forEach((rowId) => {
          const rowData = tableDataMap?.[tableId]?.find(
            (row) => row._id === rowId
          );
          if (rowData) {
            newSelectedAssets[tableId][rowId] = rowData;
          }
        });
      });
      return newSelectedAssets;
    });
  }, [contactSelected]);


  const onShareAssetLink = (e, assetId) => {
      e.stopPropagation();
      const url = `${window.location.href.replace("tables", "assets")}/${assetId}`;
      if (navigator.share) {
        navigator
          .share({
            title: t("share"),
            text: t("shareThisAsset"),
            url: url,
          })
          .catch((error) => {
            navigator.clipboard.writeText(url);
          });
      } else {
        navigator.clipboard.writeText(url);
      }
      setSelectedRowIndex(null);
  };

  const checkIfDuplicatingOnlyOne = (tableId) => {
    if (
      !Object.keys(selectedElements).includes(tableId) ||
      selectedElements[tableId].length === 1
    ) {
      return true;
    }
    return false;
  };

  /**
   * Fetches filtered data for a specific table from backend.
   * Applies current search, pagination, and filter options.
   */
  const fetchTableData = async (tableId) => {
  const res =  await dispatch(
      getTableDataFiltered({
        tableId,
        search: searchTerm,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"],
        statusFilter: selectedOption.Estado,
        sortDate: selectedOption.dateFilter,
        sortQuantity: selectedOption.Generado,
        dateOrder: selectedOption.dateOrder,
      })
    );
  };

  /**
   * Loads all tables (or a single table by id) and fetches their data.
   * Used on initial load and when tables are updated.
   */
  const getAllTables = async () => {
    let res;
    let tables = [];

    if (id) {
      res = await dispatch(getTableById({ tableId: id }));
      if (res.payload?.table) {
        tables = [res.payload.table]; 
      }
    } else {
      res = await dispatch(getTables());
      if (res.payload?.tables) {
        tables = res.payload.tables;
      }
    }

    if (tables.length > 0) {
      for (let table of tables) {
        await fetchTableData(table._id);
      }
    }
  };

  /**
   * Creates a function to toggle edit mode for a table.
   *
   * @param {string} editingTableId - The ID of the table currently being edited, if any.
   * @param {Object} table - The table object to toggle edit mode for.
   * @param {Function} setEditingTableId - Function to update the currently editing table ID state.
   * @param {Function} handleSaveName - Function to save the updated table name.
   * @param {Function} setEditedTableName - Function to update the edited table name state.
   * @param {React.RefObject} inputRefs - Ref object containing references to input elements.
   * @returns {Function} A function that toggles the edit mode for the specified table.
   */
  const toggleEditTable = (
    editingTableId,
    setEditingTableId,
    table,
    handleSaveName,
    setEditedTableName,
    inputRefs
  ) => {
    if (editingTableId === table._id) {
      setEditingTableId(null);
      handleSaveName(table);
    } else {
      setEditingTableId(table._id);
      setEditedTableName(table.name || "");
    }
    setTimeout(() => {
      inputRefs.current[table._id]?.focus();
    }, 0);
  };

  /**
   * Creates an event handler for updating a table's type and associated headers.
   *
   * @param {Object} headersByType - An object mapping table types to their respective headers.
   * @param {Array} headersTable - The default headers for the table.
   * @param {Function} dispatch - Redux dispatch function to trigger the update action.
   * @param {Object} table - The table object to be updated, must contain an _id property.
   * @param {Function} getAllTables - Function to refresh all tables after update.
   * @returns {Function} An async event handler function that processes the table type change.
   */


  const handleTableAccessPermitTypeUpdate = async (
   table, accessPermitType
  ) => {
    const resUpdate = await dispatch(updateTableType({
      tableId: table._id,
      accessPermitType: accessPermitType
    }))

    if (resUpdate?.payload?.success) {
      await getAllTables();
    }
  }
  const handleTableTypedUpdate = async (
    e,
    headersByType,
    headersTable,
    dispatch,
    table,
    getAllTables
  ) => {
    const newType = e.target.value;
    if (!newType) return;

    const resUpdate = await dispatch(
      updateTableType({
        tableId: table._id,
        newType,
      })
    );

    if (resUpdate?.payload?.success) {
      await getAllTables();
    }
  };

  const hide = (table) => {
    setShowPopup(false);
    setActiveTable(table);
  };

  /**
   * Creates a function that processes a table selection based on the table type.
   *
   * @param {Object} table - The selected table object.
   * @param {Function} dispatch - Redux dispatch function for state updates.
   * @param {Function} setShowPopupNewContact - State setter for showing/hiding new contact popup.
   * @param {Function} setShowPopup - State setter for showing/hiding the main popup.
   * @param {Function} setActiveTable - State setter to store the current active table.
   * @param {Function} setShowNewContact - State setter for showing/hiding new contact form.
   * @param {Function} setShowNewAsset - State setter for showing/hiding new asset form.
   * @param {Function} setShowNewBill - State setter for showing/hiding new bill form.
   * @param {Function} createData - Function to create data for the table.
   * @returns {Function} An async function that handles the table selection logic based on table type.
   */
  const processTableSelection = async (
    table,
    dispatch,
    setShowPopupNewContact,
    setShowPopup,
    setActiveTable,
    setShowNewContact,
    setShowNewAsset,
    setShowNewBill,
    createData
  ) => {
    if (table.type === "contacts") {
      dispatch(setContact(null));
      setShowPopupNewContact(false);
      setShowNewContact(true);
      hide(table);

    } else if (table.type === "assets") {
      console.log('table', table)
      dispatch(setAsset(null));
      setShowNewAsset(true);
      hide(table);

    } else if (table.type === "docs") {
      setShowNewBill(true);
      hide(table);
    } else {
      createData(table._id, table.headers);
    }
  };

 
  const deleteTableAndUpdateView = async (
    dispatch,
    table,
    tableView,
    setActiveSelectIndex,
    id,
    navigate
  ) => {
    await dispatch(deleteTable({ tableId: table.tableId }));
    await dispatch(getTablesWithCounts())
    // await dispatch(
    //   createVariable({
    //     variableData: {
    //       category: "tableView",
    //       title: "tableView",
    //       type: "tableView",
    //       tables: Object.entries(tableView.tables)
    //         .filter(([id, _]) => id !== table.tableId)
    //         .reduce((acc, [id, data]) => {
    //           acc[id] = data;
    //           return acc;
    //         }, {}),
    //       parametersTables: Object.entries(tableView.parametersTables)
    //         .filter(([id, _]) => id !== table.tableId)
    //         .reduce((acc, [id, data]) => {
    //           acc[id] = data;
    //           return acc;
    //         }, {}),
    //       widthTables:  tableView.widthTables &&  Object.entries(
    //         tableView.widthTables
    //       )
    //         .filter(([id, _]) => id !== table.tableId)
    //         .reduce((acc, [id, data]) => {
    //           acc[id] = data;
    //           return acc;
    //         }, {}),
    //     },
    //   })
    // );
    setActiveSelectIndex(null);
    if (id) {
      navigate("/admin/tables");
    }
  };

  /**
   * Creates a new row in a table and refreshes its data.
   * Used for adding contacts, assets, or docs.
   */
  const createData = async (tableId, headers, data, type) => {
    await dispatch(createTableData({ tableId, headers, data, type }));
    await fetchTableData(tableId);
    const response = await dispatch(refreshTableInfo({ tableId: tableId }));
  };

  /**
   * Checks if a date is recent (within last 5 minutes).
   * Used to highlight new rows.
   */
  const recient = (fecha) => {
    const fechaObj =
      fecha instanceof Date
        ? fecha
        : typeof fecha === "number"
          ? new Date(fecha)
          : new Date(fecha);

    if (isNaN(fechaObj.getTime())) {
      return false;
    }

    const diffMs = Date.now() - fechaObj.getTime();
    return diffMs >= 0 && diffMs < 5 * 60 * 1000;
  };

  /**
   * Saves the edited table name to backend and refreshes table info.
   */
  const handleSaveName = async (table) => {
    dispatch(updateTableName({ tableId: table._id, newName: editedTableName }));
    getAllTables();
    setEditingTableId(null);
    dispatch(refreshTableInfo({ tableId: table._id }));
  };

  const selectAllContacts = (data, tableId) => {
    if (contactSelected?.[tableId]?.length === data?.length) {
      setContactSelected((prevItem) => {
        return { ...prevItem, [tableId]: [] };
      });
      setSelectedIds(false);
      setAllAssetsInfo([]);
      setAllTransactionsInfo([]);
    } else {
      setSelectedIds(true);
      const allContactIndexes = data.map((contact) => contact._id);
      setAllAssetsInfo(data);
      setContactSelected((prevItem) => {
        return { ...prevItem, [tableId]: allContactIndexes };
      });
    }
  };

  const selectContact = (rowIndex, contact, tableId) => {
    setContactSelected((prevItem) => {
      if (prevItem?.[tableId]?.length > 0) {
        if (prevItem[tableId].includes(contact._id)) {
          return {
            ...prevItem,
            [tableId]: prevItem[tableId].filter((i) => i !== contact._id),
          };
        } else {
          return {
            ...prevItem,
            [tableId]: [...prevItem[tableId], contact._id],
          };
        }
      } else {
        return { ...prevItem, [tableId]: [contact._id] };
      }
    });
  };

  /**
   * Handles mouse down for long-press selection of a row.
   */
  const handleMouseDown = (index, row, tableId) => {
    longPressTriggeredRef.current = false;
    timerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      inputRef.current?.click();
      selectContact(index, row, tableId);
    }, 600);
  };

  /**
   * Clears long-press timer on mouse up.
   */
  const handleMouseUp = () => {
    clearTimeout(timerRef.current);
  };

  /**
   * Handles actions popup for a row (edit, delete, share, etc).
   */
  const handleActions = (rowIndex, transaction, tableId) => {
    setShowPopup(false);
    setShowPopupNewContact(false);
    setShowPopupNewAsset(false);
    setShowPopupNewTransaction(false);
    setSelectedRowIndex(selectedRowIndex === rowIndex ? null : rowIndex);
    setCurrentTableId(tableId);
  };

  /**
   * Deletes a row from a table and refreshes its data.
   */
  const handleDelete = async (tableId, rowId) => {
    await dispatch(deleteRowTable({ tableId, rowId }));
    dispatch(getTableData(tableId));
  };


  const talkToAi = () => {
    setShowSelectAgent(true);
  };


  const handleDoubleAsset = async (tableId, columns, assetData, type) => {
    const cleanAsset = (data) => {
      const newAsset = { ...data };
      delete newAsset._id;
      delete newAsset.userId;
      delete newAsset._rev;
      delete newAsset.createdAt;
      delete newAsset.updatedAt;
      return newAsset;
    };

    const selectedRows = Object.values(selectedElements[tableId] || {});
    if (checkIfDuplicatingOnlyOne(tableId)) {
      try {
        await createData(tableId, columns, cleanAsset(assetData), type);
      } catch (error) {
        console.error("Error duplicando row:", error);
      }
    } else if (selectedRows.length > 0) {
      try {
        await Promise.all(
          selectedRows.map((row) =>
            createData(tableId, columns, cleanAsset(row), type)
          )
        );
      } catch (error) {
        console.error("Error duplicando filas:", error);
      }
    } else {
      console.warn("No rows selected for duplication");
    }

    setContactSelected((prevItem) => ({ ...prevItem, [tableId]: [] }));
  };


  const contactRenderRow = (
    row,
    index,
    onSelect,
    orderedColumns,
    tableId,
    tableType,
    columns
  ) => (
    <tr
      key={index}
      className={styles.optionsTr}
      onClick={() => handleClick(row, tableId, tableType)}
      onDoubleClick={() => handleDoubleClick(row, tableId, tableType)}
      onMouseDown={() => handleMouseDown(index, row, tableId)}
      onMouseUp={handleMouseUp}
    >
      <td
        style={{
          position:
            selectedRowIndex === index &&
            currentTableId === tableId &&
            "static",
        }}
      >
        <div className={styles.optionsTd}>
          <div className={styles.inputWrapperHover}>
            <input
              ref={inputRef}
              type="checkbox"
              name="contactSelected"
              onChange={() => {}}
              onClick={(e) => {
                e.stopPropagation();
                updateSelectedAsset(
                  tableId,
                  row,
                  e.target.checked ? "add" : "delete"
                );
              }}
              checked={
                contactSelected?.[tableId]?.includes(row._id) ? true : false
              }
            />
            <div
              className={styles.inputContainer}
              onClick={(e) => {
                e.stopPropagation();
                selectContact(index, row, tableId);
 
              }}
            ></div>
          </div>
          <div className={styles.edit}>
            <div
              ref={(el) => {
                if (!popupButtonRef.current[tableId]) {
                  popupButtonRef.current[tableId] = {};
                }
                return (popupButtonRef.current[tableId][index] = el);
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleActions(index, row, tableId);
              }}
              className={styles.dotsOptions}
            >
              <img src={optionDots} />
            </div>
          </div>
        </div>
        {selectedRowIndex === index && currentTableId === tableId && (
          <div className={styles.optionsPopupContainer}>
            <OptionsPopup
              style={{
                position: "fixed",
                top:
                  popupButtonRef.current[tableId]?.[
                    index
                  ]?.getBoundingClientRect().bottom +
                    200 >
                  window.innerHeight
                    ? popupButtonRef.current[tableId]?.[
                        index
                      ]?.getBoundingClientRect().top -
                      180 -
                      popupButtonRef.current[tableId]?.[index]?.offsetHeight
                    : popupButtonRef.current[tableId]?.[
                        index
                      ]?.getBoundingClientRect().top +
                      popupButtonRef.current[tableId]?.[index]?.offsetHeight,
                left: popupButtonRef.current[tableId]?.[
                  index
                ]?.getBoundingClientRect().left,
              }}
              close={setSelectedRowIndex}
              options={[
                {
                  label: t("edit"),
                  onClick: (e) => {
                    e.stopPropagation();
                    dispatch(setContact(row));
                    dispatch(
                      setPaginationSlice({
                        contactLimitSlice: limit,
                        contactPageSlice: page,
                      })
                    );
                    setShowPopupNewContact(false);

                    setSelectedRowIndex(null);
                    dispatch(setContactTableId(tableId));
                    dispatch(setFatherNewContact("tables"));
                    navigate(`/admin/contacts/${row._id}`, {
                      state: { backgroundLocation: location },
                    });
                  },
                },
                {
                  label: t("delete"),
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDelete(tableId, row._id);
                    setSelectedRowIndex(null);
                  },
                },
                {
                  label: `${t("share")}`,
                  onClick: (e) => onShareAssetLink(e, row._id),
                },
                {
                  label: <div className={styles.highlighted} > <StarPlus />{`${t("talkToAI")}`} </div>,
                  onClick: (e) => {
                    e.stopPropagation();
                    talkToAi();
                    setSelectedRowIndex(null);
                    setTalkToAIAssetInfo(row);
                  },
                  key:"highlighted"
                },
                {
                  label: `${t("double")}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDoubleAsset(tableId, columns, row, "contacts");
                    setSelectedRowIndex(null);
                  },
                },
              ]}
            />
          </div>
        )}
      </td>
      {orderedColumns
        .filter((col) => !col.hidden)
        .map(({ key, createdAt }, index) => {
          const value =
            key === "paymethod" ? (
              row.paymethod?.map((method, i) => (
                <span key={i}>
                  {method.bank} - {method.accountNumber} ({method.currency})
                </span>
              ))
            ) : key === "createdAt" ? (
              row.createdAt ? (
                formatAgoDate({ dateString: row.createdAt, t })
              ) : (
                ""
              )
            ) : key === "companyPhoneNumber" ? (
              `${row?.companyPhoneNumber?.[0]?.code || ""}${row?.companyPhoneNumber?.[0]?.number || ""}`
            ) : key === "contactName" ? (
              <div className={styles.name}>
                <img src={row.image || emptyImage} alt="" />
                <div>
                  <span>{row?.contactName}</span>
                  <span>{row?.type}</span>
                </div>
              </div>
            ) : key === "transactions" ? (
              <div className={styles.transacciones}>
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(clearDoc());
                    dispatch(
                      setPaginationSlice({
                        contactLimitSlice: limit,
                        contactPageSlice: page,
                      })
                    );
                    handleGetOneContact(row);
                  }}
                >
                  {t("see")}
                </a>
                <AmountTransaction row={row} />
              </div>
            ) : (
              key.split(".").reduce((acc, part) => acc?.[part], row) || ""
            );
          return (
            <td
              key={key}
              style={{
                background:
                  recient(createdAt) &&
                  currentTableNew.find((id) => id == tableId)
                    ? "#e4fff9"
                    : "transparent",
              }}
            >
              {value}
            </td>
          );
        })}
    </tr>
  );

  /**
   * Renders a row for assets table, with actions and selection.
   */
  const assetRenderRow = (
    row,
    index,
    onSelect,
    orderedColumns,
    tableId,
    tableType,
    columns
  ) => (
    <tr
      key={index}
      className={styles.optionsTr}
      onClick={() => handleClick(row, tableId, tableType)}
      onDoubleClick={() => handleDoubleClick(row, tableId, tableType)}
      onMouseDown={() => handleMouseDown(index, row, tableId)}
      onMouseUp={handleMouseUp}
    >
      <td
        style={{
          position:
            selectedRowIndex === index &&
            currentTableId === tableId &&
            "static",
        }}
      >
        <div className={styles.optionsTd}>
          <div className={styles.inputWrapperHover}>
            <input
              ref={inputRef}
              type="checkbox"
              name="contactSelected"
              onChange={() => {}}
              onClick={(e) => {
                e.stopPropagation();
              }}
              checked={contactSelected?.[tableId]?.includes(row._id)}
            />
            <div
              className={styles.inputContainer}
              onClick={(e) => {
                e.stopPropagation();
                selectContact(index, row, tableId);
                setAllAssetsInfo((prevState) => {
                  const exists = prevState.some(
                    (asset) => asset._id === row._id
                  );

                  if (exists) {
                    return prevState.filter((asset) => asset._id !== row._id);
                  } else {
                    return [...prevState, row];
                  }
                });
              }}
            ></div>
          </div>

          <div className={styles.edit}>
            <div
              ref={(el) => {
                if (!popupButtonRef.current[tableId]) {
                  popupButtonRef.current[tableId] = {};
                }
                return (popupButtonRef.current[tableId][index] = el);
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleActions(index, row, tableId);
              }}
              className={styles.dotsOptions}
            >
              <img src={optionDots} alt="options" />
            </div>
          </div>
        </div>
        {selectedRowIndex === index && currentTableId === tableId && (
          <div className={styles.optionsPopupContainer}>
            <OptionsPopup
              style={{
                position: "fixed",
                top:
                  popupButtonRef.current[tableId]?.[
                    index
                  ]?.getBoundingClientRect().bottom +
                    200 >
                  window.innerHeight
                    ? popupButtonRef.current[tableId]?.[
                        index
                      ]?.getBoundingClientRect().top -
                      180 -
                      popupButtonRef.current[tableId]?.[index]?.offsetHeight
                    : popupButtonRef.current[tableId]?.[
                        index
                      ]?.getBoundingClientRect().top +
                      popupButtonRef.current[tableId]?.[index]?.offsetHeight,
                left: popupButtonRef.current[tableId]?.[
                  index
                ]?.getBoundingClientRect().left,
              }}
              close={setSelectedRowIndex}
              options={[
                {
                  label: t("edit"),
                  onClick: (e) => {
                    e.stopPropagation();
                    setSelectedRowIndex(null);
                    dispatch(setAsset(row));
                    dispatch(
                      setPaginationSlice({ limitSlice: limit, pageSlice: page })
                    );
                    dispatch(setContactTableId(tableId));
                    dispatch(setFatherNewAsset("tables"));
                    navigate(`/admin/assets/${row._id}`, {
                      state: { backgroundLocation: location },
                    });
                  },
                },
                {
                  label: t("delete"),
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDelete(tableId, row._id);
                    setSelectedRowIndex(null);
                  },
                },
                {
                  label: `${t("share")}`,
                  onClick: (e) => onShareAssetLink(e, row._id),
                },
                {
                  label: `${t("talkToAI")}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    talkToAi();
                    setSelectedRowIndex(null);
                    setTalkToAIAssetInfo(row);
                  },
                },
                {
                  label: `${t("double")}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDoubleAsset(tableId, columns, row, "assets");
                    setSelectedRowIndex(null);
                  },
                },
              ]}
            />
          </div>
        )}
      </td>

      {orderedColumns
        .filter((col) => !col.hidden)
        .map(({ key, createdAt }, index) => {
          const imageEmpty = "https://facturagpt.com/images/empty.png";
          const value =
            key === "name" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {" "}
                <img
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = emptyImage; 
                  }}
                  src={row.image || emptyImage}
                  alt="Asset"
                  width="30"
                  height="30"
                />
                <div>
                  {row.name}
                  {false && (
                    <>
                      {row.description?.map((desc, index) => (
                        <div
                          key={index}
                          className={index == 0 && styles.titleInfoTd}
                        >
                          {desc}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ) : key === "createdAt" ? (
              row.createdAt ? (
                formatAgoDate({ dateString: row.createdAt, t })
              ) : (
                ""
              )
            ) : key === "category" ? (
              row.category ? (
                <>cc</>
              ) : null
            ) : key === "supplier_name" ? (
              <>
                {row.supplier_name} {row.supplier_supplier_address}
              </>
            ) : key === "generated" ? (
              <>
                {row.generated} {""} {user?.currency}
              </>
            ) : key === "maxPrice" ? (
              <>
                {row.maxPrice} {""} {user?.currency || "EUR"}
              </>
            ) : key === "minPrice" ? (
              <>
                {row.minPrice} {""} {user?.currency || "EUR"}
              </>
            ) : key === "averagePrice" ? (
              <>
                {row.averagePrice} {""} {user?.currency || "EUR"}
              </>
            ) : (
              key?.split(".")?.reduce((acc, part) => acc?.[part], row) || ""
            );
          return (
            <td
              key={key}
              style={{
                background:
                  recient(createdAt) &&
                  currentTableNew.find((id) => id == tableId)
                    ? "var(--e4fff9-background)"
                    : "transparent",
              }}
            >
              {typeof value === "string" ? value : "ver variable"}
            </td>
          );
        })}
    </tr>
  );

  /**
   * Renders a row for documents table, with actions and selection.
   */
  const documentRenderRow = (
    row,
    index,
    onSelect,
    orderedColumns,
    tableId,
    tableType,
    columns
  ) => (
    <tr
      key={index}
      className={styles.optionsTr}
      onClick={() => handleClick(row, tableId, tableType)}
      onDoubleClick={() => handleDoubleClick(row, tableId, tableType)}
      onMouseDown={() => handleMouseDown(index, row, tableId)}
      onMouseUp={handleMouseUp}
    >
      <td
        style={{
          position:
            selectedRowIndex === index &&
            currentTableId === tableId &&
            "static",
        }}
      >
        <div className={styles.optionsTd}>
          <div className={styles.inputWrapperHover}>
            <input
              ref={inputRef}
              type="checkbox"
              name="contactSelected"
              onChange={() => {}}
              onClick={(e) => {
                e.stopPropagation();
              }}
              checked={contactSelected?.[tableId]?.includes(row._id)}
            />
            <div
              className={styles.inputContainer}
              onClick={(e) => {
                e.stopPropagation();
                selectContact(index, row, tableId);
                setAllTransactionsInfo((prevState) => {
                  const exists = prevState.some(
                    (asset) => asset._id === row._id
                  );

                  if (exists) {
                    return prevState.filter((asset) => asset._id !== row._id);
                  } else {
                    return [...prevState, row];
                  }
                });
              }}
            ></div>
          </div>

          <div className={styles.edit}>
            <div
              ref={(el) => {
                if (!popupButtonRef.current[tableId]) {
                  popupButtonRef.current[tableId] = {};
                }
                return (popupButtonRef.current[tableId][index] = el);
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleActions(index, row, tableId);
              }}
              className={styles.dotsOptions}
            >
              <img src={optionDots} />
            </div>
            {selectedRowIndex === index && currentTableId === tableId && (
              <div className={styles.optionsPopupContainer}>
                <OptionsPopup
                  style={{
                    position: "fixed",
                    top:
                      popupButtonRef.current[tableId]?.[
                        index
                      ]?.getBoundingClientRect().bottom +
                        200 >
                      window.innerHeight
                        ? popupButtonRef.current[tableId]?.[
                            index
                          ]?.getBoundingClientRect().top -
                          180 -
                          popupButtonRef.current[tableId]?.[index]?.offsetHeight
                        : popupButtonRef.current[tableId]?.[
                            index
                          ]?.getBoundingClientRect().top +
                          popupButtonRef.current[tableId]?.[index]
                            ?.offsetHeight,
                    left: popupButtonRef.current[tableId]?.[
                      index
                    ]?.getBoundingClientRect().left,
                  }}
                  close={setSelectedRowIndex}
                  options={[
                    {
                      label: t("edit"),
                      onClick: (e) => {
                        e.stopPropagation();
                        setShowPopupNewTransaction(false);
                        dispatch(setFatherNewBill("tables"));
                        dispatch(
                          setPaginationSlice({
                            limitSlice: limit,
                            pageSlice: page,
                          })
                        );
                        navigate(`/admin/docs/${id}/${row._id}`);
                        setSelectedRowIndex(null);
                        dispatch(setContactTableId(tableId));
                      },
                    },
                    {
                      label: t("delete"),
                      onClick: (e) => {
                        e.stopPropagation();
                        handleDelete(tableId, row._id);
                        setSelectedRowIndex(null);
                      },
                    },
                    {
                      label: `${t("share")}`,
                      onClick: (e) => onShareAssetLink(e, row._id),
                    },
                    {
                      label: `${t("talkToAI")}`,
                      onClick: (e) => {
                        e.stopPropagation();
                        talkToAi();
                        setSelectedRowIndex(null);
                        setTalkToAIAssetInfo(row);
                      },
                    },
                    {
                      label: `${t("double")}`,
                      onClick: (e) => {
                        e.stopPropagation();
                        handleDoubleAsset(tableId, columns, row, "docs");
                        setSelectedRowIndex(null);
                      },
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </td>

      {orderedColumns.map(({ key, createdAt }, index) => {
        const value =
          key === "id" ? (
            <div className={styles.idContainer}>
              <img src={pdf} className={styles.pdfIcon} />
              <p> {row._id}</p>
            </div>
          ) : key === "createdAt" ? (
            row.createdAt ? (
              formatAgoDate({ dateString: row.createdAt, t })
            ) : (
              ""
            )
          ) : key === "description" ? (
            <p
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              {row?.description
                ? row?.description.map((item, index) => (
                    <span key={index}>{item}</span>
                  ))
                : t("noDescription")}
            </p>
          ) : key === "tag" ? (
            <div className={styles.tags}>
              <span className={`${styles.tag} ${styles[row?.tag]}`}></span>
            </div>
          ) : key === "total" ? (
            <>
              {row?.total} {""} {user?.currency || "EUR"}
            </>
          ) : key === "payMethod" ? (
            <>{row?.payMethod ? row?.payMethod : t("unspecified")}</>
          ) : key === "state" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >

              <span 
              // className={getStateClass(row.state?.[0] || "default")}
              >

                &bull;
              </span> 

              <div
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                {Array.isArray(row.state) ? (
                  row.state.map((item, itemIndex) => (
                    <p
                      key={itemIndex}
                      style={{
                        color: itemIndex === 1 ? "blue" : "",
                        fontWeight: itemIndex === 1 ? "600" : "inherit",
                        margin: "0",
                      }}
                      // className={getStateClass(row.state[0])}
                    >
                      {item}
                    </p>
                  ))
                ) : (
                  <p>{row.state}</p>
                )}
              </div>
            </div>
          ) : key === "items" ? (
            <div className={styles.actions}>
              {" "}
              <div className={styles.transacciones}>
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/panel/${row._id}`);
                  }}
                  href="#"
                >
                  {t("seeArticles")}
                </a>
                <span>(2.345)</span>
              </div>{" "}
            </div>
          ) : (
            key.split(".").reduce((acc, part) => acc?.[part], row) || ""
          );

        return (
          <td
            key={key}
            style={{
              background:
                recient(createdAt) &&
                currentTableNew.find((id) => id == tableId)
                  ? "var(--e4fff9-background)"
                  : "transparent",
            }}
          >
            {value}
          </td>
        );
      })}
    </tr>
  );

  /**
   * Toggles selection for a row by id.
   */
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };


  const fnTableView = async () => {
    await dispatch(getVariable({ type: "tableView" }));
  };

  const reorderParametersFromTableView = (newParameters, tableViewTables, activeId, overId) => {
    if (!newParameters || !tableViewTables) return newParameters;
    
    // console.log('🔄 Reordenando parámetros...');
    // console.log('�� activeId (name):', activeId);
    // console.log('🎯 overId (name):', overId);
    // console.log('newParameters', newParameters)
    
    // Crear un Map de tableViewTables por label para acceso rápido
    const tableViewMap = new Map();
    tableViewTables.forEach((col, index) => {
      if (col.label) {
        tableViewMap.set(col.label, { ...col, tableIndex: index });
      }
    });
    
    // Crear un Map de newParameters por name para acceso rápido
    const parametersMap = new Map();
    newParameters.forEach((param, index) => {
      parametersMap.set(param.name, { ...param, paramIndex: index });
    });
    
    // Encontrar el objeto activo y el objeto destino
    const activeObject = parametersMap.get(activeId);
    const overObject = parametersMap.get(overId);
    
    if (!activeObject || !overObject) {
      // console.log('❌ No se encontraron los objetos');
      return newParameters;
    }
    
    // console.log('📋 activeObject:', activeObject);
    // console.log('�� overObject:', overObject);
    
    // Solo cambiar categoría si active tiene category (no si tiene code)
    let updatedActiveObject = { ...activeObject };
    if (activeObject.category && !activeObject.code) {
      let newCategory = null;
      
      if (overObject.code) {
        newCategory = overObject.code; // Si over es un subtítulo, usar su code
      } else if (overObject.category) {
        newCategory = overObject.category; // Si over es un parámetro, usar su category
      }
      
      if (newCategory) {
        updatedActiveObject = { ...activeObject, category: newCategory };
        // console.log('🔄 Nueva categoría para active:', newCategory);
      }
    }
    
    // Crear una copia del array para no mutar el original
    const reorderedParameters = [...newParameters];
    
    // Encontrar las posiciones en tableViewTables
    const activeTableIndex = tableViewMap.get(activeId)?.tableIndex;
    const overTableIndex = tableViewMap.get(overId)?.tableIndex;
    
    if (activeTableIndex !== undefined && overTableIndex !== undefined) {
      console.log('📊 Posiciones en tableViewTables - active:', activeTableIndex, 'over:', overTableIndex);
      
      // Determinar si active estaba delante o detrás de over
      const wasActiveBeforeOver = activeTableIndex < overTableIndex;
      
      // Remover active de su posición actual
      const currentActiveIndex = reorderedParameters.findIndex(p => p.name === activeId);
      if (currentActiveIndex !== -1) {
        reorderedParameters.splice(currentActiveIndex, 1);
      }
      
      // Encontrar la nueva posición para active
      const overParamIndex = reorderedParameters.findIndex(p => p.name === overId);
      
      if (overParamIndex !== -1) {
        let newActiveIndex;
        
        if (wasActiveBeforeOver) {
          // Si active estaba delante, ponerlo delante de over
          newActiveIndex = overParamIndex;
        } else {
          // Si active estaba detrás, ponerlo detrás de over
          newActiveIndex = overParamIndex + 1;
        }
        
        // Insertar active en la nueva posición
        reorderedParameters.splice(newActiveIndex, 0, updatedActiveObject);
        
        console.log('✅ active movido a posición:', newActiveIndex);
      }
    }
    
    // console.log('�� Parámetros reordenados:', reorderedParameters.map(p => ({ name: p.name, category: p.category })));
    // console.log('reorderedParameters', reorderedParameters)
    
    return reorderedParameters;
  };

 
  const setOrderedTable = async (orderedColumns, key, id, activeId, overId) => {
    // console.log('orderedColumns', orderedColumns)
    // console.log('id', id)
    // console.log('activeId', activeId)
    // console.log('overId', overId)
    if (key) {
 
      await dispatch(
        createVariable({
          variableData: {
            category: "tableView",
            title: "tableView",
            type: "tableView",
            tables: { ...tableView.tables, [id]: orderedColumns },
            parametersTables: {
              ...tableView.parametersTables,
              [id]: tableView?.parametersTables?.[id]?.map((item, i) =>
                item.name === key
                  ? (() => {
                      const { hidden, ...rest } = item;
                      return { ...rest, delete: false };
                    })()
                  : item
              ),
            },
          },
        })
      );
      fnTableView();
    } else {


      const reorderedColumns = reorderParametersFromTableView(tableView?.parametersTables?.[id], orderedColumns, activeId, overId );
      // console.log('reorderedColumns', reorderedColumns)
    
      await dispatch(
        createVariable({
          variableData: {
            category: "tableView",
            title: "tableView",
            type: "tableView",
            tables: { ...tableView.tables, [id]: orderedColumns },
            parametersTables: {
              ...tableView.parametersTables,
              [id]: reorderedColumns,
            },
          },
        })
      );
      fnTableView();
    }
  };

  const setWidthColumn = async (columnWidths, id) => {
    await dispatch(
      createVariable({
        variableData: {
          category: "tableView",
          title: "tableView",
          type: "tableView",
          widthTables: { ...tableView?.widthTables, [id]: columnWidths },
        },
      })
    );
    fnTableView();
  };

  /**
   * Handles click on a row to open popup for editing/viewing.
   */
  const handleClick = (row, tableId, tableType) => {
    if (!longPressTriggeredRef.current) {
      if (tableType == "contacts") {
        dispatch(setContact(row));
        dispatch(
          setPaginationSlice({
            contactLimitSlice: limit,
            contactPageSlice: page,
          })
        );
        setCurrentTableId(tableId);
        setCurrentTableType(tableType);
        dispatch(setContactTableId(tableId));
        setShowPopupNewContact(true);
        setShowPopupNewAsset(false);
        setShowPopupNewTransaction(false);
        setShowPopup(true);
        dispatch(setFatherNewContact("tables"));
      } else if (tableType == "assets") {
        setCurrentTableId(tableId);
        setCurrentTableType(tableType);
        dispatch(setContactTableId(tableId));
        setShowPopup(true);
        setShowPopupNewTransaction(false);
        setShowPopupNewContact(false);
        setShowPopupNewAsset(true);
        dispatch(setAsset(row));
        dispatch(setPaginationSlice({ limitSlice: limit, pageSlice: page }));
        dispatch(setFatherNewAsset("tables"));
      } else if (tableType == "docs") {
        setCurrentTableId(tableId);
        setCurrentTableType(tableType);
        dispatch(setContactTableId(tableId));
        setShowPopup(true);
        setShowPopupNewAsset(false);
        setShowPopupNewContact(false);
        setShowPopupNewTransaction(true);
        dispatch(setFatherNewBill("tables"));
        dispatch(setPaginationSlice({ limitSlice: limit, pageSlice: page }));
        setDocSelected(row);
      }
    }
  };
  /**
   * Handles double click on a row to navigate to detail page.
   */
  const handleDoubleClick = (row, tableId, tableType) => {
    setShowPopup(false);
    if (tableType == "contacts") {
      dispatch(setContact(row));
      dispatch(
        setPaginationSlice({ contactLimitSlice: limit, contactPageSlice: page })
      );
      setShowPopupNewContact(false);

      dispatch(setContactTableId(tableId));
      dispatch(setFatherNewContact("tables"));
      navigate(`/admin/contacts/${row._id}`, {
        state: { backgroundLocation: location },
      });
    } else if (tableType === "assets") {
      setShowPopupNewAsset(false);
      dispatch(setAsset(row));
      dispatch(setPaginationSlice({ limitSlice: limit, pageSlice: page }));
      dispatch(setFatherNewAsset("tables"));
      dispatch(setContactTableId(tableId));
      navigate(`/admin/assets/${row._id}`, {
        state: { backgroundLocation: location },
      });
    } else if (tableType === "docs") {
      setShowPopupNewTransaction(false);
      dispatch(setFatherNewBill("tables"));
      dispatch(setPaginationSlice({ limitSlice: limit, pageSlice: page }));
      navigate(`/admin/docs/${id}/${row._id}`);
    }
  };

  /**
   * Saves a new parameter for a table.
   */
  const saveParameter = async (parameter, tableId) => {

    let table = tableDataMap[tableId].filter(table => table?.hasOwnProperty("main"))[0]
      
  
      if(parameter.hasOwnProperty("code")){
        if(table?.variables?.length > 0 ) {
           await dispatch(createVariable(
          {variableData:{category: "tableView", title:"tableView", 
            type:"tableView",
            variables:[parameter,...tableView.variables ],}}))
          }
            else {
              await dispatch(createVariable({variableData:{category: "tableView", title:"tableView", type:"tableView", variables:[parameter ]}}))
            }
          }else{
            const newParameter = {
              ...parameter,
              category: tableView?.variables?.length > 0 ? tableView?.variables[0]?.code : "",
            }
    if(tableView?.variables?.length > 0 ) {
      await dispatch(createVariable(
      {variableData:{category: "tableView", title:"tableView", 
        type:"tableView",
        variables:[tableView.variables[0], newParameter, ...tableView.variables.slice(1)]}}))
      }
            else{ await dispatch(createVariable
              ({variableData:{category: "tableView", title:"tableView", 
                type:"tableView", variables:[newParameter ]}})) 
              }
          }

          await dispatch(createVariableTableData({tableId, mainId: table._id, parameter: parameter}))
          await dispatch(getVariable({type:'tableView'}))
          await dispatch(getTableDataFiltered({tableId}))



        //   let id = tableId
        //   if(parameter.hasOwnProperty("code")){
        //     if(tableView?.parametersTables?.[id]?.length > 0 ) 
        //        await dispatch(createVariable(
        //       {variableData:{category: "tableView", title:"tableView", 
        //         type:"tableView",
        //         parametersTables:{...tableView.parametersTables, [id]:[parameter,...tableView.parametersTables[id] ]}}}))
        //         else await dispatch(createVariable({variableData:{category: "tableView", title:"tableView", type:"tableView", parametersTables:{...tableView.parametersTables,[id]:[parameter ]}}}))
        //       }else{
        //         const newParameter = {
        //           ...parameter,
        //           category: tableView?.parametersTables?.[id]?.length > 0 ? tableView?.parametersTables?.[id][0]?.code : "",
        //         }
        // if(tableView?.parametersTables?.[id]?.length > 0 )  await dispatch(createVariable(
        //   {variableData:{category: "tableView", title:"tableView", 
        //     type:"tableView",
        //     parametersTables:{...tableView.parametersTables, [id]:[tableView.parametersTables[id][0], newParameter, ...tableView.parametersTables[id].slice(1)]}}}))
        //         else await dispatch(createVariable
        //           ({variableData:{category: "tableView", title:"tableView", 
        //             type:"tableView", parametersTables:{...tableView.parametersTables,[id]:[newParameter ]}}}))
        //       }
        //       await dispatch(getVariable({type:'tableView'}))
        
  };

  const updateParameter = async (parameter, tableId) => {
    console.log('parameter', parameter)

    await dispatch(updateVariableTableData({tableId: tableId,
      mainId: tableDataMap[tableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
       data: {editParameter: {name: parameter.name, id: parameter.id, parameter: parameter}}}))
     await dispatch(getTableDataFiltered({tableId: tableId}))
     setReloadVariable(true)
  }

  /**
   * Fetches table data with current filters.
   */
  const getTableWithFilter = (tableId) => {
    // console.log('entra en la funcion getTableWithFilter', tableId)
    dispatch(
      getTableDataFiltered({
        tableId,
        search: searchTerm,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"],
        statusFilter: selectedOption.Estado,
        sortDate: selectedOption.dateFilter,
        sortQuantity: selectedOption.Generado,
        dateOrder: selectedOption.dateOrder,
      })
    );
  };


  const createAssetVariables = async () => {
    await dispatch( 
      createVariable({
        variableData: {
          category: "tableView",
          title: "tableView",
          type: "tableView",
        variables:
                [
                  { name: "Identificación del activo", code: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36)},

                  { name: "AssetName",subName:"Nombre", category: "assetIdentificate", hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Category",subName:"Categoría", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Lorem Ipsum...",subName:"Descripción", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
                  { name: "5f4sa95df1ae9f1a9d1sf",subName:"#Código de referencia", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "textBox" },
                  { name: "ContactName",subName:"Provedor", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "location",subName:"Ubicación", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Contactos",subName:"Tabla", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },


                  { name: "Información financiera", code: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },

                  { name: "Compra", subName: "Tipo", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Tipo de gasto", subName: "Categoría", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "00,00 EUR", subName: "Base de importe", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Impuesto", subName: "Impuesto", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
                  { name: "Retención", subName: "Retención", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
                  { name: "00,00 EUR", subName: "Costo de producción/adquisición", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "00,00 EUR", subName: "Recomended retail price (RRP)", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "00,00 EUR", subName: "Suplemento", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },


                  { name: "Insumo", code: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), },
                  { name: "Texto", subName: "Valor", category: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
                  { name: "Texto", subName: "valor", category: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },


                  { name: "Suplentes y sustitutos", code: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36)},
                  { name: "Texto", subName: "Valor", category: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
                  { name: "Texto", subName: "valor", category: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },

                  { name: "Variantes", code: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
                  { name: "Texto", subName: "Valor", category: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
                  { name: "Texto", subName: "valor", category: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },

                  { name: "Nueva categoría", code: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
                  { name: "Texto", subName: "Valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "phone" },
                  { name: "Texto", subName: "valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "url" },
                  { name: "Texto", subName: "Valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "chronometer" },
                  { name: "Texto", subName: "valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "location" },
                ],
                assetVariablesDefault:
                [
                  { name: "Identificación del activo", code: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36)},

                  { name: "AssetName",subName:"Nombre", category: "assetIdentificate", hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Category",subName:"Categoría", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Lorem Ipsum...",subName:"Descripción", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
                  { name: "5f4sa95df1ae9f1a9d1sf",subName:"#Código de referencia", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "textBox" },
                  { name: "ContactName",subName:"Provedor", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "location",subName:"Ubicación", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Contactos",subName:"Tabla", category: "assetIdentificate",hidden: false, delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },


                  { name: "Información financiera", code: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },

                  { name: "Compra", subName: "Tipo", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Tipo de gasto", subName: "Categoría", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "00,00 EUR", subName: "Base de importe", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "Impuesto", subName: "Impuesto", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
                  { name: "Retención", subName: "Retención", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
                  { name: "00,00 EUR", subName: "Costo de producción/adquisición", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "00,00 EUR", subName: "Recomended retail price (RRP)", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
                  { name: "00,00 EUR", subName: "Suplemento", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },


                  { name: "Insumo", code: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), },
                  { name: "Texto", subName: "Valor", category: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
                  { name: "Texto", subName: "valor", category: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },


                  { name: "Suplentes y sustitutos", code: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36)},
                  { name: "Texto", subName: "Valor", category: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
                  { name: "Texto", subName: "valor", category: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },

                  { name: "Variantes", code: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
                  { name: "Texto", subName: "Valor", category: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
                  { name: "Texto", subName: "valor", category: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },

                  { name: "Nueva categoría", code: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
                  { name: "Texto", subName: "Valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "phone" },
                  { name: "Texto", subName: "valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "url" },
                  { name: "Texto", subName: "Valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "chronometer" },
                  { name: "Texto", subName: "valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "location" },
                ]
              
            
        },
      })
    );
    }

  /**
   * Handles color change for a table.
   */
  const handleChangeColor = async (options, table) => {
    if(typeof options == "string"){
      setColorSelectedOptions([
        ...colorSelectedOptions?.filter((option) => option.id !== table._id),
        { id: table._id, color: options },
      ]);
      const resUpdate = await dispatch(
        updateTableType({
          tableId: table._id,
          newType: table.type,
          newHeaders: "",
          color: options,
        })
      );
  
      if (resUpdate?.payload?.success) {
        await getAllTables();
      }
    } else if(typeof options == "object") {
    const {color, type} = options


    setColorSelectedOptions([
      ...colorSelectedOptions?.filter((option) => option.id !== table._id),
      { id: table._id, color: color },
    ]);
    const resUpdate = await dispatch(
      updateTableType({
        tableId: table._id,
        newType: type || table.type,
        newHeaders: "",
        color: color || table.color,
      })
    );

    if (resUpdate?.payload?.success) {
        await getAllTables();
      }
    }
  };

const handleUpdateTable = async (tableId, tags,selectedTags, colorAndType, name, accessPermitType, category) => {
  // console.log('colorAndType', colorAndType)
  const resUpdate = await dispatch(
    updateTableType({
      tableId: tableId,
      tags: tags,
      selectedTags: selectedTags,
      color: colorAndType.color,
      type: colorAndType.type,
      name: name,
      accessPermitType: accessPermitType,
      category: category,
    })
  );

  if (resUpdate?.payload?.success) {
      await getAllTables();
    }
}

  const contactFn = async () => {
    await dispatch(
      getAllContacts({
        search: searchTerm,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"],
        statusFilter: selectedOption.Estado,
        sortDate: selectedOption.dateFilter,
        sortQuantity: selectedOption.Generado,
        dateOrder: selectedOption.dateOrder,
      })
    );
  };

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
      name: "Estado",
      label: t("status"),
      subOptions: [
        { display: t("all"), value: "Todos" },
        { display: t("approved"), value: "Aprobados" },
        { display: t("notApproved"), value: "No aprobados" },
        { display: t("paid"), value: "Pagados" },
        { display: t("pending"), value: "Pendiente" },
        { display: t("defaulted"), value: "Incumplidos" },
        { display: t("expired"), value: "Vencido" },
        { display: t("cancelled"), value: "Anulados" },
      ],
    },
    {
      name: "Moneda Preferida",
      label: t("preferredCurrency"),
      subOptions: "currencies",
    },
    {
      name: "# Transacciones",
      label: t("transactions"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menos" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },
    {
      name: "Ingresos/Costes",
      label: t("incomeCosts"),
      subOptions: [
        {
          display: t("incomeHigherToLower"),
          value: "Ingresos de mayor a menor",
        },
        {
          display: t("incomeLowerToHigher"),
          value: "Ingresos de menor a mayor",
        },
        { display: t("costsHigherToLower"), value: "Costes de mayor a menor" },
        { display: t("costsLowerToHigher"), value: "Costes de menor a mayor" },
      ],
    },
    {
      name: "dateFilter",
      label: t("dateFilter"),
      subOptions: [
        { display: t("1month"), value: "1month" },
        { display: t("3month"), value: "3month" },
        { display: t("6month"), value: "6month" },
        { display: t("1year"), value: "1year" },
      ],
    },
    {
      name: "dateOrder",
      label: t("dateOrder"),
      subOptions: [
        { display: t("ascendant"), value: "ascendant" },
        { display: t("falling"), value: "falling" },
      ],
    },
  ];

  const headersTable = [
    {
      label: "Nombre",
      key: "contactName",
      type: "textBox",
    },
    {
      label: "Correo",
      key: "companyEmail",
      type: "email",
    },
    {
      label: "Teléfono",
      key: "companyPhoneNumber",
      type: "number",
    },
    {
      label: "Dirección Física",
      key: "companyAddress",
      type: "textBox",
    },
    {
      label: "Número Fiscal",
      key: "taxNumber",
      type: "number",
    },
    {
      label: "Métodos de Pago",
      key: "cardNumber",
      type: "number",
    },
    {
      label: "Moneda Preferida",
      key: "preferredCurrency",
      type: "textBox",
    },
    {
      label: "Desde",
      key: "createdAt",
      type: "date",
    },
    {
      label: "transacciones",
      key: "transactions",
      type: "number",
    },
  ];

  const headersByType = {
    contacts: [
      {
        label: "Nombre",
        key: "contactName",
        type: "contact",
      },
      {
        label: "Correo",
        key: "companyEmail",
        type: "email",
      },
      {
        label: "Teléfono",
        key: "companyPhoneNumber",
        type: "phone",
      },
      {
        label: "Dirección Física",
        key: "companyAddress",
        type: "location",
      },
      {
        label: "Número Fiscal",
        key: "taxNumber",
        type: "number",
      },
      {
        label: "Métodos de Pago",
        key: "cardNumber",
        type: "number",
      },
      {
        label: "Moneda Preferida",
        key: "preferredCurrency",
        type: "textBox",
      },
      {
        label: "Desde",
        key: "createdAt",
        type: "date",
      },
      {
        label: "transacciones",
        key: "transactions",
        type: "number",
      },
    ],
    assets: [
      {
        label: "Código",
        key: "code",
        type: "number",
      },
      {
        label: "Nombre o Descripción",
        key: "name",
        type: "textBox",
      },
      {
        label: "Proveedor",
        key: "supplier_name",
        type: "textBox",
      },
      {
        label: "Categoría",
        key: "category",
        type: "textBox",
      },
      {
        label: ["Cantidad", "(Último mes)"],
        key: "quantity",
        type: "number",
      },
      {
        label: "Generado",
        key: "generated",
        type: "number",
      },
      {
        label: "Precio máximo",
        key: "maxPrice",
        type: "number",
      },
      {
        label: "Precio mínimo",
        key: "minPrice",
        type: "number",
      },
      {
        label: "Precio medio",
        key: "averagePrice",
        type: "number",
      },
      {
        label: "Desde",
        key: "createdAt",
        type: "date",
      },
    ],
    docs: [
      {
        label: "ID Transacción",
        key: "documentTitle",
        type: "number",
      },
      {
        label: "Descripción y Categoria",
        key: "description",
        type: "textBox",
      },
      {
        label: "Notas",
        key: "tag",
        type: "textBox",
      },
      {
        label: "Total",
        key: "total",
        type: "number",
      },
      {
        label: "Fecha",
        key: "date",
        type: "date",
      },
      {
        label: "Vencimiento",
        key: "expirationDate",
        type: "number",
      },
      {
        label: "Método de Pago",
        key: "payMethod",
        type: "number",
      },
      {
        label: "Estado",
        key: "state",
        type: "textBox",
      },
      {
        label: "Artículos",
        key: "items",
        type: "textBox",
      },
    ],
  };

  const typeIcons = {
    docs: <IconDocument />,
    assets: <IconAsset />,
    contacts: <IconContact />,
    blank: <IconTables />,
    folder:<IconFolder />,
  };

  return {
    options,
    headersTable,
    headersByType,
    typeIcons,

    fetchTableData,
    getAllTables,
    toggleEditTable,
    handleTableTypedUpdate,
    processTableSelection,
    deleteTableAndUpdateView,
    createData,
    recient,
    handleSaveName,
    selectAllContacts,
    selectContact,
    handleActions,
    contactRenderRow,
    assetRenderRow,
    documentRenderRow,
    toggleSelection,
    setOrderedTable,
    setWidthColumn,
    handleClick,
    handleDoubleClick,
    saveParameter,
    getTableWithFilter,
    handleChangeColor,
    fnTableView,
    searchTerm,
    setSearchTerm,
    limit,
    setLimit,
    page,
    setPage,
    selectedOption,
    setSelectedOption,

    selectedRowIndex,
    setSelectedRowIndex,
    contactSelected,
    colorSelectedOptions,
    setColorSelectedOptions,
    editedTableName,
    setEditedTableName,
    editingTableId,
    setEditingTableId,
    activeTable,
    setActiveTable,
    dynamicTableRef,
    activeSelectIndex,
    setActiveSelectIndex,
    showNewContact,
    setShowNewContact,
    newAsset,
    setShowNewAsset,
    showAddTags,
    setShowAddTags,
    selectedTags,
    setSelectedTags,
    tags,
    setTags,
    showNewBill,
    setShowNewBill,
    currentTableId,
    setCurrentTableId,
    currentTableType,
    setCurrentTableType,
    showPopupNewContact,
    setShowPopupNewContact,
    showPopup,
    setShowPopup,
    showPopupNewAsset,
    setShowPopupNewAsset,
    showPopupNewTransaction,
    setShowPopupNewTransaction,
    docSelected,
    setDocSelected,
    location,
    searchInputRef,
    isChecked,
    setIsChecked,
    isChecked2,
    setIsChecked2,
    createNewTable,
    stats,
    setStats,
    selectedAgent,
    setSelectedAgent,
    showCreateParameterFromPopup,
    setShowCreateParameterFromPopup,
    showSelectAgent,
    setShowSelectAgent,
    optionsDropdown,
    tableSelectedColor,
    setTableSelectedColor,
    selectRef,
    longPressTriggeredRef,
    timerRef,
    inputRefs,
    tables,
    tableDataMap,
    totalPaginationTables,
    currentTableNew,
    navigate,
    t,
    dispatch,
    tableView,
    allTransactionsInfo,
    setAllTransactionsInfo,
    allAssetsInfo,
    setAllAssetsInfo,
    selectedIds,
    setSelectedIds,
    contactFn,
    talkToAIAssetInfo,
    setTalkToAIAssetInfo,
    talkToAi,
    setState,
    handleTableAccessPermitTypeUpdate,
    handleUpdateTable,
    createAssetVariables,
    deleteParameterDB,
    showDeleteTableModalParameter,
    setShowDeleteTableModalParameter,
    currentParameter,
    setCurrentParameter,
    updateParameter,
    reloadVariable,
    setReloadVariable
  };
}
