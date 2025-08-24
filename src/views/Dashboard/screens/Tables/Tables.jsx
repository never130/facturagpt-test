import {  useEffect, useState } from "react";
import styles from "./Tables.module.css";


import Button from "../../components/Button/Button";
import NewContact from "../../components/NewContact/NewContact";
import NewAsset from "../../components/NewAsset/NewAsset";
import NewBIll from "../../components/NewBIll/NewBIll";
import CreateParameterPopup from "../../components/CreateParameterPopup/CreateParameterPopup";
import ClientsHeader from "../../components/ClientsHeader/ClientsHeader";
import PaginationTables from "../../components/PaginationTables/PaginationTables";
import FiltersDropdownContainer from "../../components/FiltersDropdownContainer/FiltersDropdownContainer";



import SelectAgentModal from "../ChatView/SelectAgentModal/SelectAgentModal";
import { useParams } from "react-router-dom";

import {
  setCurrentTableNew,
} from "../../../../slices/userSlices";



import { TableStatsComponent } from "../../components/TablesComponents/TableStatsComponent/TableStatsComponent";
import useTables from "../../../../hooks/useTables";
import TablesContainer from "../../components/TablesComponents/TablesContainer/TablesContainer";
import { useSelector } from "react-redux";
import DeleteChatAgents from "../../components/DeleteChatAgents/DeleteChatAgents";





const Tables = () => {  
  const { id } = useParams();

  const {
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
  } = useTables({ id, styles });

  const { workspaceSelected } = useSelector((state) => state.workspace);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if(tableView?.title === "tableView" && (tableView?.assetVariablesDefault?.length == 0 || !(tableView?.assetVariablesDefault ))){
         createAssetVariables()
}
  }, [tableView])


  useEffect(() => {
    getAllTables();
  }, [id,workspaceSelected]);

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setActiveSelectIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!selectedRowIndex) return;

    const onWheel = (e) => {
      setSelectedRowIndex(null);

      if (dynamicTableRef.current) {
        dynamicTableRef.current.scrollBy({
          top: e.deltaY,
          behavior: "auto",
        });
      }
    };

    document.addEventListener("wheel", onWheel, {
      passive: true,
      capture: true,
    });
    return () =>
      document.removeEventListener("wheel", onWheel, {
        capture: true,
      });
  }, [selectedRowIndex]);

  useEffect(() => {
    if (selectedAgent?._id) {
      navigate(`/admin/chat/${selectedAgent._id}`, {
        state: {
          rowId:
            "Necesito más información sobre el asset @" + talkToAIAssetInfo._id,
          selectedAgentState: selectedAgent,
        },
      });
    }
  }, [selectedAgent._id]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentTableNew([]));
    };
  }, []);

  useEffect(() => {
    if (!tableView || tableView.length === 0) fnTableView();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

 


  const clientsHeaderObjectProps = {
    customClientsHeaderStyles: {
      flexDirection: "row-reverse",
      alignItems: "center",
      gap: "20px",
    },
    conditionalPaginationComponent: totalPaginationTables > 20 && (
      <PaginationTables
        totalData={totalPaginationTables}
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        father={"contact"} />
    ),
    localSearchParameters : {
      ref: searchInputRef,
      searchTerm: searchTerm,
      setSearchTerm: setSearchTerm,
    },
     filterButtonAndDropdown : (<>
        <Button
          headerStyle={{
            all: "unset",
            background: "var(--f0-border)",
            color: "var(--_6-color)",
            padding: "1.5px 4.5px",
            borderRadius: "4px",
            fontWeight: 300,
            cursor: "pointer",
            fontSize: "12px",
            marginRight: "4px",
          }}
          type="white"
          action={() => searchInputRef.current.focus()}
        >
          K
        </Button>

        <FiltersDropdownContainer
          setSelectedFilters={setSelectedOption}
          selectedFilters={selectedOption}
          options={options} />
      </>)

  };

  const [tablesFiltered, setTablesFiltered] = useState(tables);
  const [initialParameterType, setInitialParameterType] = useState(null);

  // console.log('tablesFiltered', tablesFiltered)

  useEffect(() => {
    setTablesFiltered(tables);
  }, [tables]);

  return (
    <div
      className={`${styles.mainContainer} ${showPopupNewTransaction ? styles.sectionTableMoreBill : showPopup ? styles.sectionTableMore : ""}`}
    >
      <div className={`${styles.tablesContainer}`}>
        {!id && (
          <div className={styles.headerInfoAccount}>
            <TableStatsComponent stats={stats} styles={styles} typeIcons={typeIcons} tables={tables} 
              setTablesFiltered={setTablesFiltered}
             
             />
          </div>
        )}

        {/* <div className={styles.headerFilter}>
          <ClientsHeader
            father={"contacts"}
            customClientsHeader={clientsHeaderObjectProps.customClientsHeaderStyles}
            customSearchContainer={{ width: "100%" }}
            ref={searchInputRef}
            additionalInfo={ clientsHeaderObjectProps.conditionalPaginationComponent }
            searchProps={clientsHeaderObjectProps.localSearchParameters}
            searchChildren={ clientsHeaderObjectProps.filterButtonAndDropdown }
          />
        </div> */}


        <div className={styles.tablesContent}>
          {/*#676767*/}
        { tables.length == 0 &&   <div className={styles.defaultMessage}> <span style={{fontWeight:"500"}}>{t("NoItemsAssociatedWithThisTableWereFound")}</span>
          <span>{t("AllYouritemsRelatedToThisTableWillBeListedHere")}</span>
           </div>}
          <TablesContainer
            tablesFiltered={tablesFiltered}
            tables={tables}
            styles={styles}
            dispatch={dispatch}
            optionsDropdown={optionsDropdown}
            optionSelected={colorSelectedOptions}
            handleChangeColor={handleChangeColor}
            tableSelectedColor={tableSelectedColor}
            setTableSelectedColor={setTableSelectedColor}
            inputRefs={inputRefs}
            handleTableAccessPermitTypeUpdate={handleTableAccessPermitTypeUpdate}
            handleUpdateTable={handleUpdateTable}
            toggleEditTable={toggleEditTable}
            id={id}
            toggleEditTableProps={{
                editingTableId,
                setEditingTableId,
                handleSaveName,
                setEditedTableName,
                inputRefs
            }}


            
            handleTableTypedUpdate={handleTableTypedUpdate}
            handleTableTypedUpdateProps={{
              headersByType,
              headersTable,
              getAllTables
            }}

            processTableSelection={processTableSelection}
            processTableSelectionProps={{
              setShowPopupNewContact,
              setShowPopup,
              setActiveTable,
              setShowNewContact,
              setShowNewAsset,
              setShowNewBill,
              createData
            }}


            deleteTableAndUpdateView={deleteTableAndUpdateView}
            deleteTableAndUpdateViewProps={{
              tableView,
              setActiveSelectIndex,
              id,
              navigate
            }}


            isChecked2={isChecked2}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            setIsChecked2={setIsChecked2}
            activeSelectIndex={activeSelectIndex}
            setActiveSelectIndex={setActiveSelectIndex}
            setActiveTable={setActiveTable}
            typeIcons={typeIcons}
            handleSaveName={handleSaveName}
            editedTableName={editedTableName}
            setEditedTableName={setEditedTableName}
            setWidthColumn={setWidthColumn}
            setOrderedTable={setOrderedTable}
            selectRef={selectRef}
            t={t}

            typedTableProps={{
              tableDataMap,
              contactSelected,
              dynamicTableRef,
              contactRenderRow,
              assetRenderRow,
              documentRenderRow,
              selectAllContacts,
              toggleSelection,
              setOrderedTable,
              setWidthColumn,
              recient,
            }}
            options={options}
             getTableWithFilter={getTableWithFilter}
             setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
             setCurrentTableId={setCurrentTableId}
             setInitialParameterType={setInitialParameterType}
            tableDataMap={tableDataMap}
          />


        </div>


        {showNewContact && (
          <>
            <NewContact
              setShowNewContact={setShowNewContact}
              newContactProp={true}
              isGlobalTables={true}
              createData={createData}
              tableType={activeTable.type}
              tableId={activeTable.tableId}
              headers={activeTable.headers}
            />
          </>
        )}
        {newAsset && (
          <NewAsset
            setShowNewClient={setShowNewAsset}
            setShowAddTags={setShowAddTags}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            setTags={setTags}
            tags={tags}
            creatingBill={false}
            setShowNewAsset={setShowNewAsset}
            setShowNewContact={setShowNewContact}
            showNewContact={showNewContact}
            showAddTags={showAddTags}
            isGlobalTables={true}
            createData={createData}
            tableType={activeTable.type}
            tableId={activeTable.tableId}
            headers={activeTable.headers}
            fn={() => {}}
          />
        )}
        {showNewBill && (
          <NewBIll
            setShowNewBill={setShowNewBill}
            getDocuments={() => {}}
            isGlobalTables={true}
            createData={createData}
            tableType={activeTable.type}
            tableId={activeTable.tableId}
            headers={activeTable.headers}
          />
        )}

      </div>

      <div style={{ position: "relative", }}>
        <div
          className={`${styles.popupContainer} ${showPopupNewContact ? styles.popupContainerVisible : ""}`}
          style={{ height: "93vh" }}
        >
          <NewContact
            type="popup"
            customStyleOverlay={{ width: "100%", height: "100%" }}
            customStyleNewContactContainer={{
              position: "relative",
              height: "100%",
            }}
            customStylePopupNewContaier={{
              flexDirection: "column",
              alignItems: "center",
            }}
            customStyleContactinfo={{
              flexDirection: "column",
              alignItems: "center",
            }}
            customStyleColumnRightContactInfo={{ alignItems: "center" }}
            customStyleModalTemplate={{ height: "100%" }}
            customStyleModalTemplateHeader={{ padding: "2px 5px 0px" }}
            customStyleLeftSide={{
              maxWidth: "96%",
              height: "min-content",
              width: "96%",
              padding: "0px 20px",
            }}
            customStyleContentContainer={{
              padding: "0px",
              height: "99%",
              marginTop: "-15px",
              pointerEvents: "none",
            }}
            customStyleButtonContainer={{ width: "100%" }}
            customStyleButtonHeader={{ width: "100%", margin: "10px" }}
            customStyleColumnDirection={{ flexDirection: "column" }}
            customStyleNavigationPopupsContainer={{
              overflow: "visible",
              height: "100%",
            }}
            customStyleSectionContact={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
            }}
            fnContact={contactFn}
            setShowNewContact={(boolean) => {
              setShowPopup(boolean);
              setShowPopupNewContact(boolean);
            }}
            setShowPopupNewContact={(boolean) => {
              setShowPopup(boolean);
              setShowPopupNewContact(boolean);
            }}
            setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
            tableId={currentTableId}
            tableType={currentTableType}
          />
        </div>

        <div
          className={`${styles.popupContainer} ${showPopupNewAsset ? styles.popupContainerVisible : ""}`}
          style={{ height: "93vh" }}
        >
          <NewAsset
            typeContainer="popup"
            customStyleOverlay={{ width: "100%", height: "100%" }}
            customStyleNewContactContainer={{
              position: "relative",
              height: "100%",
              width: "100%",
            }}
            customStylePopupNewContaier={{
              flexDirection: "column",
              alignItems: "center",
            }}
            customStyleContactinfo={{
              flexDirection: "column",
              alignItems: "center",
            }}
            customStyleColumnRightContactInfo={{ alignItems: "center" }}
            customStyleModalTemplate={{ height: "100%" }}
            customStyleModalTemplateHeader={{ padding: "2px 5px 0px" }}
            customStyleLeftSide={{ maxWidth: "96%", height: "min-content" }}
            customStyleContentContainer={{
              padding: "0px",
              height: "99%",
              marginTop: "-15px",
              pointerEvents: "none",
            }}
            customStyleButtonContainer={{ width: "100%" }}
            customStyleButtonHeader={{ width: "100%", margin: "10px" }}
            customStyleColumnDirection={{ flexDirection: "column" }}
            customStyleNavigationPopupsContainer={{
              overflow: "visible",
              height: "100%",
            }}
            customStyleFormNewProduct={{ overflow: "unset" }}
            customStyleSectionContact={{ padding: "10px" }}
            setShowNewClient={(boolean) => {
              setShowPopup(boolean);
              setShowPopupNewAsset(boolean);
            }}
            setShowPopupNewAsset={(boolean) => {
              setShowPopup(boolean);
              setShowPopupNewAsset(boolean);
            }}
            setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
            setShowDeleteTableModalParameterPopup={setShowDeleteTableModalParameter}
            tableId={currentTableId}
            tableType={currentTableType}
            showPopupNewAsset={showPopupNewAsset}
            setCurrentParameter={setCurrentParameter}
            reloadVariable={reloadVariable}
            setReloadVariable={setReloadVariable}
          />
        </div>
        <div
          className={`${styles.popupContainer} ${showPopupNewTransaction ? styles.popupContainerVisible : ""}`}
          style={{ height: "93vh" }}
        >
          <NewBIll
            typeContainer="popup"
            customStyleOverlay={{ width: "100%", height: "100%" }}
            customStyleNewContactContainer={{
              position: "relative",
              height: "100%",
            }}
            customStylePopupNewContaier={{
              flexDirection: "column",
              alignItems: "center",
            }}
            customStyleContactinfo={{
              flexDirection: "column",
              alignItems: "center",
            }}
            customStyleModalTemplate={{ height: "100%" }}
            customStyleModalTemplateHeader={{ padding: "15px 38px 15px 25px" }}
            customStyleLeftSide={{
              width: "100%",
              height: "auto",
              display: "flex",
              justifyContent: "center",
              maxWidth: "86%",
            }}
            customStyleContentContainer={{ padding: "0px", height: "90%" }}
            customStyleColumnRightContactInfo={{ padding: "0px" }}
            customStyleButtonContainer={{ width: "100%" }}
            customStyleButtonHeader={{ width: "100%", margin: "10px" }}
            customStyleColumnDirection={{ flexDirection: "column" }}
            customStyleNavigationPopupsContainer={{
              overflow: "visible",
              height: "100%",
            }}
            fatherDoc={docSelected}
            setShowNewBill={(boolean) => {
              setShowPopup(boolean);
              setShowPopupNewTransaction(boolean);
            }}
            tableId={currentTableId}
            tableType={currentTableType}
          />
        </div>
      </div> 
      

      {showCreateParameterFromPopup && (
        <CreateParameterPopup
          saveParameter={saveParameter}
          updateParameter={updateParameter}
          setShowCreateParameter={() => {
            setShowCreateParameterFromPopup(false)
            setInitialParameterType(null)
          }}
          setState={setState}
          tableId={currentTableId}
          initialParameterType={initialParameterType}
          setInitialParameterType={setInitialParameterType}
          currentParameter={currentParameter}
          setCurrentParameter={setCurrentParameter}
        />
      )}

{showDeleteTableModalParameter && (
      <DeleteChatAgents
          user={user}
          variant={'confirm'}
          type={'parameterGlobal'}
          parametersGlobals={tableView?.variables || []}
          deleteParameterDB={deleteParameterDB}
          showDeleteTableModal={showDeleteTableModalParameter}
          setShowDeleteTableModal={setShowDeleteTableModalParameter}
        />
      )}

      {showSelectAgent && (
        <SelectAgentModal
          setState={setShowSelectAgent}
          setSelectedAgent={setSelectedAgent}
        />
      )}
    </div>
  );
};

export default Tables;




