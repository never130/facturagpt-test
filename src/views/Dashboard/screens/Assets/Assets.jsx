import React, { useEffect, useRef, useState } from "react";
import styles from "./Assets.module.css";
import plusIcon from "../../assets/Plus Icon.svg";
import optionDots from "../../assets/optionDots.svg";
import { useTranslation } from "react-i18next";
import KIcon from "../../assets/KIcon.svg";
import imageEmpty from "../../assets/ImageEmpty.svg";
import ModalTemplate from "../../components/ModalTemplate/ModalTemplate";
import EditableInput from "../Contacts/EditableInput/EditableInput";
import ProfileModalTemplate from "../../components/ProfileModalTemplate/ProfileModalTemplate";
import { ReactComponent as DownloadIcon } from "../../assets/downloadIconGray.svg";

import { ParametersLabel } from "../../components/ParametersLabel/ParametersLabel";
import Tags from "../../components/Tags/Tags";
import { useDispatch, useSelector } from "react-redux";

import { deleteAssetFromDocs, getOneDocsById } from "@src/actions/docs";

import { getAllAssets } from "@src/actions/assets";

import PanelTemplate from "../../components/PanelTemplate/PanelTemplate";
import ImportContactsAndAssets from "../../components/ImportContactsAndProducts/ImportContactsAndProducts";
import NewAsset from "../../components/NewAsset/NewAsset";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import SkeletonScreen from "../../components/SkeletonScreen/SkeletonScreen";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import ClientsHeader from "../../components/ClientsHeader/ClientsHeader";
import OptionsPopup from "../../components/OptionsPopup/OptionsPopup";
import CreateParameterPopup from "../../components/CreateParameterPopup/CreateParameterPopup";
import FiltersDropdownContainer from "../../components/FiltersDropdownContainer/FiltersDropdownContainer";
import NewContact from "../../components/NewContact/NewContact";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PaginationTables from "../../components/PaginationTables/PaginationTables";
import { setAsset } from "@src/slices/assetsSlices";
import { createAsset, deleteAssets, markAssetAsSeen } from "../../../../actions/assets";
import { setPaginationSlice } from "../../../../slices/paginationSlices";
import { setFatherNewAsset } from "../../../../slices/assetsSlices";
import { formatAgoDate } from "../../../../utils/agoDateUtil"
import { createVariable, getVariable, updateAccount } from "../../../../actions/user";
import { setAssetsTableLength, setFirstTimeAssets } from "../../../../slices/userSlices";
import SelectAgentModal from "../ChatView/SelectAgentModal/SelectAgentModal";

const Assets = () => {
  const { t } = useTranslation(["Assets","Preview"]);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams()
  const [clientSelected, setClientSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showImportAssets, setShowImportAssets] = useState(
    location.state?.showImport || false
  );
  const [newClient, setShowNewClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const { docByClient, loading } = useSelector((state) => state.docs);
  const { asset, assets: assetsSlice, totalAssets: totalAssetsSlice } = useSelector((state) => state.assets);
  const { user, tableView, assetsTableLength, firstTimeAssets } = useSelector((state) => state.user);
  const [newAssetModal, setNewAssetModal] = useState(false);
  const [selectTypeClient, setSelectTypeClient] = useState(0);
  const [showCreateParameterFromPopup, setShowCreateParameterFromPopup] = useState(false)
  const [state, setState] = useState({})
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z", 
    Estado: "Todos", 
    Generado: "A-Z", 
    Contacto: "Contacto 1", 
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
      name: "Generado",
      label: t("generated"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menos" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },
    {
      name: "Contacto",
      label: t("contact"),
      subOptions: [
        {
          display: "Contacto 1",
          value: "Contacto 1",
        },
        {
          display: "Contacto 2",
          value: "Contacto 2",
        },

      ],
    },
    {
      name: "dateFilter",
      label: t("dateFilter"),
      subOptions: [
        { display: t('1month'), value: "1month" },
        { display: t('3month'), value: "3month" },
        { display: t('6month'), value: "6month" },
        { display: t('1year'), value: "1year" },

      ],
    },
    {
      name: "dateOrder",
      label: t("dateOrder"),
      subOptions: [
        { display: t('ascendant'), value: "ascendant" },
        { display: t('falling'), value: "falling" },
      ],
    },
  ];
  const [assets, setAssets] = useState([]);
  const { pageSlice, limitSlice } = useSelector((state) => state.pagination);
  const [limit, setLimit] = useState((limitSlice && limitSlice) || 20);
  const [page, setPage] = useState((pageSlice && pageSlice) || 0);
  const [totalAssets, setTotalAssets] = useState(null);



  const fnTableView = async () => { await dispatch(getVariable({ type: 'tableView' })) }

  const setOrderedTable = async (orderedColumns, key) => {


     if(key){
          await dispatch(createVariable({
                      variableData: {
                        title: "tableView", type: "tableView",assets: orderedColumns,
                        parametersAssets: tableView.parametersAssets.map((item, i) =>
                       item.name === key
                  ? (() => {
                      const { hidden, ...rest } = item;
                      return { ...rest, delete: false };
                    })()
                  : item
              )
            
                      }
                    }))
                     fnTableView()
        } else    {

          await dispatch(createVariable({ variableData: { title: "tableView", type: "tableView", assets: orderedColumns } }))
          fnTableView()
        }
  }

  const setWidthColumn = async (columnWidths) => {
    await dispatch(createVariable({ variableData: { title: "tableView", type: "tableView", assetsWidth: columnWidths } }))
    fnTableView()
  }

  useEffect(() => {
    if (tableView?.assets?.length > 0 && tableView?.assets?.length != assetsTableLength) {
      if (assetsTableLength !== 0) {
        if (tableView?.assets?.length > assetsTableLength) dispatch(setFirstTimeAssets(true))
      } else dispatch(setFirstTimeAssets(false))
      dispatch(setAssetsTableLength(tableView?.assets?.length))
    }
  }, [tableView])


  useEffect(() => {
    if (!tableView || tableView.length === 0) fnTableView();
  }, []);

  const recient = (fecha) => {
    const fechaObj =
      fecha instanceof Date
        ? fecha
        : typeof fecha === 'number'
          ? new Date(fecha)
          : new Date(fecha); 

    if (isNaN(fechaObj.getTime())) {
      return false;
    }

    const diffMs = Date.now() - fechaObj.getTime();
    return diffMs >= 0 && diffMs < 5 * 60 * 1000;
  }



  const fn = async () => {
    const response = await dispatch(
      getAllAssets({
        search: searchTerm,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"], 
        statusFilter: selectedOption.Estado,
        sortDate: selectedOption.dateFilter,
        sortQuantity: selectedOption.Generado,
        dateOrder: selectedOption.dateOrder
      })
    );
    if (response.payload) {

    }
  };
  useEffect(() => {
    fn();
  }, [user, limit, page, searchTerm, selectedOption]);

  useEffect(() => {
    setPage(0)
  }, [limit, searchTerm, selectedOption])

  const selectClient = (rowIndex) => {
    setClientSelected((prevItem) => {
      if (prevItem.includes(rowIndex)) {
        return prevItem.filter((i) => i !== rowIndex);
      } else {
        return [...prevItem, rowIndex];
      }
    });
  };
  const [allAssetsInfo, setAllAssetsInfo] = useState([]);

  const selectAllClients = () => {
    if (clientSelected.length === assetsSlice.length) {
      setClientSelected([]);
      setSelectedIds(false);
      setAllAssetsInfo([]);

    } else {
      setSelectedIds(true);
      const allClientIndexes = assetsSlice.map((asset) => asset._id);
      setAllAssetsInfo(assetsSlice);
      setClientSelected(allClientIndexes);
    }
  };

  const handleDelete = async (assetRef) => {
    await dispatch(
      deleteAssetFromDocs({
        docId: docByClient?.id,
        assetRef,
      })
    );
    await dispatch(
      getOneDocsById({
        docId: docByClient?.id || docByClient?.doc?._id,
      })
    );
  };

  const handleDeleteAssets = async (clientSelected) => {
    try {
      await dispatch(
        deleteAssets({ clientSelected })
      ).unwrap(); 
      fn(); 
      setClientSelected([]);
    } catch (error) {
      console.error("Error eliminando assets:", error);
    }
  }

  const handleDoubleAsset = async (assetData) => {
    let newasset = { ...assetData }
    delete newasset._id
    delete newasset.userId
    delete newasset._rev
    delete newasset.createdAt
    delete newasset.updatedAt
    try {
      await dispatch(
        createAsset({ assetData: newasset })
      ).unwrap(); 
      fn(); 
    } catch (error) {
      console.error("Error creando assets:", error);
    }
  }

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const handleActions = (rowIndex, transaction) => {
    setSelectedRowIndex(selectedRowIndex === rowIndex ? null : rowIndex);
  };



  useEffect(() => {
    if (!selectedRowIndex) return;

    const onWheel = (e) => {
      setSelectedRowIndex(null);

      if (dynamicTableRef.current) {
        dynamicTableRef.current.scrollBy({
          top: e.deltaY,
          behavior: 'auto',
        });
      }
    };

    document.addEventListener('wheel', onWheel, {
      passive: true,
      capture: true,
    });
    return () =>
      document.removeEventListener('wheel', onWheel, {
        capture: true,
      });
  }, [selectedRowIndex]);


  const [creatingBill, setCreatingBill] = useState(true);

  const searchInputRef = useRef(null);
  const dynamicTableRef = useRef(null);

  useFocusShortcut(searchInputRef, "k");

  const handleCloseNewClient = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCreatingBill(false);
      setShowNewClient(false);
      setShowImportAssets(false);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && newClient) {
        setIsAnimating(true);
        setTimeout(() => {
          setCreatingBill(false);
          setShowNewClient(false);
          setShowImportAssets(false);
          setIsAnimating(false);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [newClient]);

  const toggleClientSelection = async (clientId) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );

  };
  const [showSelectAgent, setShowSelectAgent] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(false)
  const [talkToAIAssetInfo, setTalkToAIAssetInfo] = useState(null)
  const talkToAi = () => {
    setShowSelectAgent(true)
  }

  useEffect(() => {
    if (selectedAgent?._id) {
      navigate(`/admin/chat/${selectedAgent._id}`, {
        state: {
          rowId: 'Necesito más información sobre el asset @' + talkToAIAssetInfo._id,
          selectedAgentState: selectedAgent,
        },
      });
    }
  }, [selectedAgent._id])


  const tableHeaders = [
    { label: t("code"), key: "code" },
    { label: t("nameOrDescription"), key: "name" },
    { label: t("supplier"), key: "supplier_name" },
    { label: t("category"), key: "category" },
    { label: [t("quantity"), t("lastMonth")], key: "quantity" },
    { label: t("generated"), key: "generated" },
    { label: t("maxPrice"), key: "maxPrice" },
    { label: t("minPrice"), key: "minPrice" },
    { label: t("averagePrice"), key: "averagePrice" },
    { label: t("from"), key: "createdAt" },
  ];

  const popupButtonRef = useRef([]);

  const inputRef = useRef(null);

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const [showPopupNewAsset, setShowPopupNewAsset] = useState(false)
  const longPressTriggeredRef = useRef(false);
  const timerRef = useRef(null);

  const handleDoubleClick = (row) => {
    setShowPopupNewAsset(false)
    setCreatingBill(false);
    setNewContact(true);
    dispatch(setAsset(row));
    dispatch(setPaginationSlice({ limitSlice: limit, pageSlice: page }));
    dispatch(setFatherNewAsset('assets'))
    navigate(`/admin/assets/${row._id}`, { state: { backgroundLocation: location } });
  }

  const handleClick = (row) => {
    if (!(longPressTriggeredRef.current)) {
      setShowPopupNewAsset(true)
      setCreatingBill(false);
      setNewContact(true);
      dispatch(setAsset(row));
      dispatch(setPaginationSlice({ limitSlice: limit, pageSlice: page }));
      dispatch(setFatherNewAsset('assets'))
      dispatch(markAssetAsSeen({id:row._id}))
    }

  }

  const handleMouseDown = (rowId) => {
    longPressTriggeredRef.current = false;
    timerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      inputRef.current?.click()
      selectClient(rowId);


    }, 600);
  };

  const handleMouseUp = () => {
    clearTimeout(timerRef.current);
  };




  const renderRow = (row, index, onSelect, orderedColumns) => (
    <tr
      key={index}
      className={styles.optionsTr}
      onClick={() => handleClick(row)}
      onDoubleClick={() => handleDoubleClick(row)}
      onMouseDown={() => handleMouseDown(row._id)}
      onMouseUp={handleMouseUp}
    >
      <td style={{
        position: selectedRowIndex === index && 'static'
      }}>
        <div className={styles.optionsTd}>
          <div className={styles.inputWrapperHover}>
            <input
              ref={inputRef}
              type="checkbox"
              name="clientSelected"
              onChange={() => { }}
              onClick={(e) => {
                e.stopPropagation();

              }}
              checked={clientSelected.includes(row._id)}
            />
            <div className={styles.inputContainer} onClick={(e) => {
              e.stopPropagation();
              toggleClientSelection(row?._id)
              selectClient(row._id);
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
              handleDivClick()
            }}></div>
          </div>

          <div className={styles.edit}>
            <div
              ref={(el) => (popupButtonRef.current[index] = el)}
              onClick={(e) => {
                e.stopPropagation();
                handleActions(index, row);
              }}
              className={styles.dotsOptions}
            >
              <img src={optionDots} alt="options" />
            </div>
          </div>
        </div>
        {selectedRowIndex === index && (
          <div className={styles.optionsPopupContainer}>
            <OptionsPopup
              style={
                {
                  position: "fixed",
                  top:
                    (popupButtonRef.current[index].getBoundingClientRect().top +
                      (popupButtonRef.current[index].offsetHeight)),
                  left: popupButtonRef.current[index].getBoundingClientRect().left,
                }
              }
              close={setSelectedRowIndex}
              options={[
                
                {
                  label: t("edit"),
                  onClick: (e) => {
                    e.stopPropagation();
                    setCreatingBill(false);
                    setNewContact(false);
                    setSelectedRowIndex(null);
                    dispatch(setFatherNewAsset('assets'))
                    navigate(`/admin/assets/${row._id}`, { state: { backgroundLocation: location } });
                  },
                },
                {
                  label: t("delete"),
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDelete(row.assetRef);
                    handleDeleteAssets(row._id)
                    setSelectedRowIndex(null);
                  },
                },
                {
                  label: `${t("share")}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.href}/${row._id}`);
                    setSelectedRowIndex(null);
                  },
                },
                {
                  label: `${t("talkToAI")}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    talkToAi()
                    setSelectedRowIndex(null);
                    setTalkToAIAssetInfo(row)
                  },
                },
                {
                  label: `${t("double")}`,
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDoubleAsset(row)
                    setSelectedRowIndex(null);
                  },
                },
              ]}
            />
          </div>
        )}
      </td>

      {orderedColumns.filter(col => !col.hidden).map(({ key, createdAt }, index) => {
        const value = key === "name"
          ? <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {" "}
            <img onError={(e) => {
              e.target.onerror = null;
              e.target.src = imageEmpty;
            }}
              src={row.image || imageEmpty}
              alt="Asset"
              width="30"
              height="30"
            />
            <div>
              {row.name}
              {false && (
                <>
                  {row.description?.map((desc, index) => (
                    <div key={index} className={index == 0 && styles.titleInfoTd}>
                      {desc}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          : key === "createdAt"
            ? row.createdAt ? formatAgoDate({ dateString: row.createdAt, t }) : ""
            : key === "category"
              ? row.category ? (
                <>
                  cc
                 
                </>
              ) : null
              : key === "supplier_name"
                ? <>{row.supplier_name} {row.supplier_supplier_address}</>
                : key === "generated"
                  ? <>{row.generated} {""} {user?.currency}</>
                  : key === "maxPrice"
                    ? <>{row.maxPrice} {""} {user?.currency || "EUR"}</>
                    : key === "minPrice"
                      ? <>{row.minPrice} {""} {user?.currency || "EUR"}</>
                      : key === "averagePrice"
                        ? <>{row.averagePrice} {""} {user?.currency || "EUR"}</>
                        : key.split(".").reduce((acc, part) => acc?.[part], row) || "";
        return <td key={key} style={{ background: recient(createdAt) && firstTimeAssets ? "var(--e4fff9-background)" : "transparent" }}>{value}</td>;
      })}

    </tr>
  );

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const [newContactProp, setNewContact] = useState(false);

  const [swiped, setSwiped] = useState(false);
  const { sliceSetShowNewContact } = useSelector((state) => state.assets);

  useEffect(() => {

    if (sliceSetShowNewContact) setShowNewContact(true);
  }, [sliceSetShowNewContact]);
  const [showNewContact, setShowNewContact] = useState(false);

  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [fileNameS3, setFileNameS3] = useState(null);



  const saveParameter = async(parameter) => {
          if(tableView?.parametersAssets?.length > 0 )  await dispatch(createVariable({variableData:{title:"tableView", type:"tableView", parametersAssets:[parameter,...tableView.parametersAssets ]}}))
            else await dispatch(createVariable({variableData:{title:"tableView", type:"tableView", parametersAssets:[parameter ]}}))
          await dispatch(getVariable({type:'tableView'}))
        }


  return (
    <div className={`${styles.mainContainer} ${showPopupNewAsset ? styles.sectionTableMore : ""}`}
    >
      <div className={styles.container}>
        <ClientsHeader father={'assets'}
          title={`${t("assetManagement")}${totalAssetsSlice ? ` (${totalAssetsSlice})` : ''}`}
          ref={searchInputRef}
          additionalInfo={
            <>
              {" "}
              {totalAssetsSlice > 20 && (

                <PaginationTables
                  totalData={totalAssetsSlice}
                  limit={limit}
                  page={page}
                  setPage={setPage}
                  setLimit={setLimit}
                  father={'assets'}
                />
              )}
            </>
          }
      
          buttons={[
            {
              label: (
                <>
                  <img src={plusIcon} alt={t("newAsset")} />
                  {t("newAsset")}
                </>
              ),
              onClick: () => {
                setCreatingBill(false);
                setShowNewClient(true);
                setNewContact(true);
                dispatch(setAsset(null));
              },
            },
            {
              label: <DownloadIcon />,
              headerStyle: { padding: "6px 10px" },
              type: "white",
              onClick: () => setShowImportAssets(true),
            },
            ...(clientSelected.length >= 1
              ? [
                {
                  label: <>{t("delete")}</>,
                  headerStyle: { padding: "6px 10px" },
                  type: "white",
                  onClick: async () => {
                    try {
                      await dispatch(
                        deleteAssets({ clientSelected })
                      ).unwrap(); 
                      fn(); 
                      setClientSelected([]);
                    } catch (error) {
                      console.error("Error eliminando assets:", error);
                    }
                  },
                },
                {
                  label: <>{t("export")}</>,
                  headerStyle: { padding: "6px 10px" },
                  type: "white",
                  onClick: () => {
                    setShowImportAssets(true);
                  },
                },
              ]
              : []),

          ]}
          searchProps={{
            ref: searchInputRef,
            searchTerm: searchTerm,
            setSearchTerm: setSearchTerm,
          }}
          searchChildren={
            <>
              <div
                style={{ marginLeft: "5px" }}
                className={styles.searchIconsWrappers}
              >
                <img src={KIcon} alt="kIcon" />
              </div>
              <FiltersDropdownContainer
                setSelectedFilters={setSelectedOption}
                selectedFilters={selectedOption}
                options={options}
              />
            </>
          }
        />

        {assetsSlice?.length == 0 ? (
          <SkeletonScreen
            labelText={t("noAssetFound")}
            helperText={t("yourAssetsListedHere")}
            showInput={true}
            enableLabelClick={false}
          />
        ) : (
          <DynamicTable
            recient={recient}
            columns={tableHeaders}
            ref={dynamicTableRef}
            data={assetsSlice}
            renderRow={renderRow}
            selectedIds={clientSelected}
            onSelectAll={selectAllClients}
            onSelect={toggleSelection}
            setOrderedTable={setOrderedTable}
            fatherOrder={'assets'}
            orderedColumnsInitial={tableView?.assets}
            setWidthColumn={setWidthColumn}
            fatherWidth={'assetsWidth'}
          />
        )}

      </div>

      {showImportAssets && (
        <ImportContactsAndAssets
          state={handleCloseNewClient}
          isAnimating={isAnimating}
          text={t("asset")}
          data={clientSelected.length >= 1 ? allAssetsInfo : assetsSlice}
          quantity={
            clientSelected.length >= 1 ? allAssetsInfo.length : assetsSlice.length
          }
          selectedOption={selectedOption}
        />
      )}





      {newClient && (
        <NewAsset
          setShowNewClient={setShowNewClient}
          setShowAddTags={setShowAddTags}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          setTags={setTags}
          tags={tags}
          creatingBill={creatingBill}
          setShowNewAsset={setShowNewClient}
          setShowNewContact={setShowNewContact}
          showNewContact={showNewContact}
          showAddTags={showAddTags}
          limit={limit}
          page={page}
          searchTerm={searchTerm}
          fn={fn}
        />
      )}

 
        <div className={`${styles.popupContainer} ${showPopupNewAsset ? styles.popupContainerVisible : ""}`} style={{ height: "91vh" }}>
          <NewAsset
            typeContainer='popup'
            customStyleOverlay={{ width: "100%", height: "100%" }}
            customStyleNewContactContainer={{ position: "relative", height: "100%", width: "100%" }}
            customStylePopupNewContaier={{ flexDirection: "column", alignItems: "center" }}
            customStyleContactinfo={{ flexDirection: "column", alignItems: "center" }}
            customStyleColumnRightContactInfo={{ alignItems: "center" }}
            customStyleModalTemplate={{ height: "100%" }}
            customStyleModalTemplateHeader={{ padding: "2px 5px 0px"}}
            customStyleLeftSide={{ maxWidth: "96%",height:"min-content",}}
            customStyleContentContainer={{ padding:"0px", height:"99%",marginTop: "-15px",pointerEvents: "none" }}
            customStyleButtonContainer={{ width: "100%" }}
            customStyleButtonHeader={{ width: "100%", margin: "10px" }}
            customStyleColumnDirection={{ flexDirection: "column" }}
            customStyleNavigationPopupsContainer={{overflow: "visible", height:"100%"}}
            customStyleFormNewProduct={{overflow:"unset"}}
             customStyleSectionContact={{padding:"10px"}}

            setShowNewClient={setShowPopupNewAsset}
            setShowPopupNewAsset={setShowPopupNewAsset}
            setShowAddTags={setShowAddTags}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            setTags={setTags}
            tags={tags}
            creatingBill={creatingBill}
            setShowNewAsset={setShowNewClient}
            setShowNewContact={setShowNewContact}
            showNewContact={showNewContact}
            showAddTags={showAddTags}
            limit={limit}
            page={page}
            searchTerm={searchTerm}
            fn={fn}
            setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
          />
        </div>
      

      
      {showSelectAgent && (
        <SelectAgentModal
          setState={setShowSelectAgent}
        />
      )}
      {showNewContact && (
        <NewContact
          setShowNewContact={setShowNewContact}
          showNewContact={showNewContact}
        />
      )}

      {showCreateParameterFromPopup && (
                        <CreateParameterPopup
                        saveParameter={saveParameter}
                          setShowCreateParameter={setShowCreateParameterFromPopup}
                          setState={setState}
                        />
                      )}
    </div>
  );
};

export default Assets;
