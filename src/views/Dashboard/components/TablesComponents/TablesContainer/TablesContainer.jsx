import { updateTableType } from "../../../../../actions/user";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import { ReactComponent as HorizontalDots } from "../../../assets/S3/horizontalDots.svg";

import { ReactComponent as TableLockClose } from "../../../assets/tableLockClose.svg";
import { ReactComponent as TableLockOpen } from "../../../assets/tableLockOpen.svg";
import Button from "../../Button/Button";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";
import TypedTable from "../TypedTable/TypedTable";
import App from "./firstPartHeader/App";
import HeaderSecondPart from "./secondPartHeader/headerSecondPart";
import SearchIconWithIcon from "../../SearchIconWithIcon/SearchIconWithIcon";
import PaginationTables from "../../PaginationTables/PaginationTables";
import HeaderThirdPart from "./headerThirdPart/headerThirdPart";
import { useEffect, useState } from "react";
import DeleteChatAgents from "../../DeleteChatAgents/DeleteChatAgents";
import { useSelector } from "react-redux";
import NewTag from "../../NewTag/NewTag";

export default function TablesContainer ({
  tables,
  styles,
  dispatch,
  optionsDropdown,
  optionSelected,
  handleChangeColor,
  tableSelectedColor,
  setTableSelectedColor,
  inputRefs,

  toggleEditTable,
  toggleEditTableProps,
  
  handleTableTypedUpdate,
  handleTableTypedUpdateProps,

  processTableSelection,
  processTableSelectionProps,
  
  deleteTableAndUpdateView,
  deleteTableAndUpdateViewProps,

  isChecked2,
  isChecked,
  setIsChecked,
  setIsChecked2,
  
  activeSelectIndex,
  setActiveSelectIndex,
  typeIcons,
  handleSaveName,
  editedTableName,
  setEditedTableName,
  typedTableProps,
  selectRef,
  t,
  handleTableAccessPermitTypeUpdate,
  options,
  getTableWithFilter,
  tablesFiltered,
  handleUpdateTable,
  setShowCreateParameterFromPopup,
  setCurrentTableId,
  setInitialParameterType,
  tableDataMap,
  id
}) {
  if (!tables || tables.length === 0) return null;
  const dropdownOptions = [
    { value: "", label: "Seleccione categoría" },
    { value: "contacts", label: "contacts" },
    { value: "assets", label: "assets" },
    { value: "docs", label: "docs" },
    { value: "blank", label: "undefined" },
  ]

  const {user} = useSelector((state) => state.user);
  const {editingTableId,setEditingTableId} = toggleEditTableProps;
  const [showDeleteTableModal, setShowDeleteTableModal] = useState(null);
  const [editTable, setEditTable] = useState(null);
  const [showAddRelationModal, setShowAddRelationModal] = useState(null);
  const [showAddTags, setShowAddTags] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);


  
  //tableDataMap es un objeto con los datos de las tablas pasalo a un array 
  // console.log('tableDataMap', tableDataMap)
  let tableDataMapArray = Object.values(tableDataMap);
  // console.log('tableDataMapArray sin filtrado', tableDataMapArray)
  tableDataMapArray = tableDataMapArray.map(table => {
    return (table?.filter(tab => (tab?.hasOwnProperty("main"))))[0]}  ).filter(table => table?.main === true);
    // console.log('tableDataMapArray', tableDataMapArray)

    if(id){
      tableDataMapArray = tableDataMapArray.filter(table => table?.tableId === id)
    }
    
    useEffect(() => {
      if(editTable !== null){
        setSelectedTags(tableDataMapArray[editTable]?.selectedTags?.length > 0 ? tableDataMapArray[editTable].selectedTags : []);
        setTags(tableDataMapArray[editTable]?.tags?.length > 0 ? tableDataMapArray[editTable].tags : []);
      }
    }, [editTable])



  return tableDataMapArray.map((table, index) => (
    <div key={index} className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        {editTable != index && 
        <div className={styles.fadeInUp} style={{width: '100%'}}>
        <App table={table}
        processTableSelection={processTableSelection}
        processTableSelectionProps={processTableSelectionProps}
        dispatch={dispatch}
        activeSelectIndex={activeSelectIndex}
        setActiveSelectIndex={setActiveSelectIndex}
        index={index}
        deleteTableAndUpdateView={deleteTableAndUpdateView}
        deleteTableAndUpdateViewProps={deleteTableAndUpdateViewProps}
        selectRef={selectRef}
        t={t}
        setShowDeleteTableModal={setShowDeleteTableModal}
        setEditTable={setEditTable}
        setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
        setCurrentTableId={setCurrentTableId}
        setInitialParameterType={setInitialParameterType}
        />
        </div>}
        {editTable == index && 
        // <div className={styles.fadeInUp} style={{width: '100%'}}>
          <HeaderSecondPart table={table} 
        handleTableAccessPermitTypeUpdate={handleTableAccessPermitTypeUpdate} 
        handleChangeColor={handleChangeColor}
        tableSelectedColor={tableSelectedColor}
        setTableSelectedColor={setTableSelectedColor}
        handleTableTypedUpdate={handleTableTypedUpdate}
        handleTableTypedUpdateProps={handleTableTypedUpdateProps}
        optionsDropdown={optionsDropdown}
        optionSelected={optionSelected}
        dropdownOptions={dropdownOptions}
        typeIcons={typeIcons}
        editedTableName={editedTableName}
        setEditedTableName={setEditedTableName}
        handleSaveName={handleSaveName}
        inputRefs={inputRefs}
        editingTableId={editingTableId}
        toggleEditTable={toggleEditTable}
        toggleEditTableProps={toggleEditTableProps}
        setEditingTableId={setEditingTableId}
        handleUpdateTable={handleUpdateTable}
        setShowDeleteTableModal={setShowDeleteTableModal}
        index={index}
        setEditTable={setEditTable}
        editTable={editTable}
        setShowAddRelationModal={setShowAddRelationModal}
        setShowAddTags={setShowAddTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tags={tags}
        setTags={setTags}
        />
        // </div>
        }
        <HeaderThirdPart options={options} getTableWithFilter={getTableWithFilter} table={table}
        readOnly={showDeleteTableModal !== null}
          {...typedTableProps}/>
        {/* <div>
          <CustomDropdown
            height="25px"
            options={optionsDropdown}
            selectedOption={optionSelected?.find((option) => option.id == table._id) ?.color}
            setSelectedOption={(options) => handleChangeColor(options, table)}
            father={"docHome"}
            placeholder={"Seleccione color"}
            generalStyleFilterSort={{
              background: "transparent",
              minWidth: "10px",
              color: "var(--black)",
            }}
            arrowSizeCustom={12}
            stateStripe={false}
            tableSelectedColor={tableSelectedColor}
            setTableSelectedColor={setTableSelectedColor} />
        </div> */}
        {/* <div className={styles.tableNameEditContainer}>
          <div
            className={table.color
              ? styles.iconsTypeTableWhite
              : styles.iconsTypeTable}
            style={{ background: table.color }}
          >
            {typeIcons[table.type] || null}
          </div>
          <input
            ref={(el) => (inputRefs.current[table._id] = el)}
            className={styles.editInput}
            value={editingTableId === table._id
              ? editedTableName
              : table.name || ""}
            disabled={editingTableId !== table._id}
            onChange={(e) => setEditedTableName(e.target.value)}
            onBlur={() => handleSaveName(table)}
            placeholder={t(table.type)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveName(table);
              }
            } } />

          <PencilEdit
            onClick={()=>toggleEditTable(
              editingTableId, 
              setEditingTableId, 
              table, 
              toggleEditTableProps.handleSaveName, 
              toggleEditTableProps.setEditedTableName, 
              toggleEditTableProps.inputRefs)
            }
            className={styles.editButton} />
        </div> */}
{/* 
        <div className={styles.editContainer}>
          <select
            value={table.type}
            onChange={(e)=>handleTableTypedUpdate(
              e,
              handleTableTypedUpdateProps.headersByType,
              handleTableTypedUpdateProps.headersTable,
              dispatch,
              table,
              handleTableTypedUpdateProps.getAllTables
            )}
          >
          { dropdownOptions.map(option => 
            <option key={option.value} value={option.value}>{t(option.label)}</option> 
          )}
          </select>

          
          <Button
            action={()=>processTableSelection(
              table,
              dispatch, 
              processTableSelectionProps.setShowPopupNewContact, 
              processTableSelectionProps.setShowPopup, 
              processTableSelectionProps.setActiveTable, 
              processTableSelectionProps.setShowNewContact, 
              processTableSelectionProps.setShowNewAsset, 
              processTableSelectionProps.setShowNewBill, 
              processTableSelectionProps.createData)
            }
          >
            {`${t("new")} ${table.type !== "blank" ? t(table.type) : t("element")} `}
          </Button>
          <Button
            type="white"
            action={() => { setActiveSelectIndex( index === activeSelectIndex ? null : index) } }
            headerStyle={{
            padding: "12px 0px",
            background: "var(--f0-border)",
            borderRadius: "12px",
            }}
            >
              <HorizontalDots className={styles.dotsEdit} />
            </Button>

            {activeSelectIndex === index && (
              <div className={styles.selectContainer} ref={selectRef}>
                <div onClick={() => deleteTableAndUpdateView(
                  dispatch, 
                  table, 
                  deleteTableAndUpdateViewProps.tableView, 
                  deleteTableAndUpdateViewProps.setActiveSelectIndex, 
                  deleteTableAndUpdateViewProps.id, 
                  deleteTableAndUpdateViewProps.navigate)}>
                  {t("delete")}
                </div>
              </div>
            )}
            </div> */}
          </div>

          
          <TypedTable table={table} {...typedTableProps} styles={styles} tablesFiltered={tablesFiltered} index={index} />

          {showDeleteTableModal == index && (
      <DeleteChatAgents
          user={user}
          variant={'confirm'}
          type={'table'}
          table={table}
          deleteTableAndUpdateViewProps={deleteTableAndUpdateViewProps}
          deleteTableAndUpdateView={deleteTableAndUpdateView}
          setShowDeleteTableModal={setShowDeleteTableModal}

        />
      )}

{showAddTags === index && (
        <NewTag
          setShowNewTagModal={() => setShowAddTags(null)}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          setTags={setTags}
          tags={tags}
        />
      )}

    </div>
  ))
};