import styles from './headerSecondPart.module.css';
import Button from '../../../Button/Button';
import DeleteButton from '../../../DeleteButton/DeleteButton';
import {ReactComponent as SaveIcon} from '../../../../assets/saveIcon.svg';
import {ReactComponent as HeaderTableIcon1} from '../firstPartHeader/assets/headerTableIcon1.svg';
import { useState, useEffect } from 'react';
import {ReactComponent as TableLockOpen} from '../../../../assets/tableLockOpen.svg';
import {ReactComponent as TableLockClose} from '../../../../assets/tableLockClose.svg';
import OptionsSwitchComponent from '../../../OptionsSwichComponent/OptionsSwitchComponent';
import CustomDropdown from '../../../CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import {ReactComponent as PencilEdit} from '../../../../assets/pencilEdit.svg';
import NewTag from '../../../NewTag/NewTag';
import { createTableData, refreshTableInfo, getTableDataFiltered, updateTableData } from '../../../../../../actions/user';
import { useDispatch } from 'react-redux';

export default function HeaderSecondPart ({table, 
    handleTableAccessPermitTypeUpdate, 
    handleChangeColor, 
    tableSelectedColor, 
    setTableSelectedColor, 
    handleTableTypedUpdate, 
    handleTableTypedUpdateProps,
    optionsDropdown,
    optionSelected,
    dropdownOptions,
    typeIcons,
    editedTableName,
    setEditedTableName,
    handleSaveName,
    inputRefs,
    editingTableId,
    toggleEditTable,
    toggleEditTableProps,
    setEditingTableId,
    handleUpdateTable,
    setShowDeleteTableModal,
    index,
    setEditTable,
    editTable,
    setShowAddTags,
    selectedTags,
    setSelectedTags,
    tags,
    setTags 
    }) {

    const { t } = useTranslation(["Contacts", "Assets"]);

    const handleRemoveTag = (index) => {
        const newTags = selectedTags.filter((_, i) => i !== index);
        setSelectedTags(newTags);
        // onRemoveTag?.(index);
      };
      const dispatch = useDispatch();
      // const [currentTags, setCurrentTags] = useState(table?.tagsSection?.length > 0 ? table.tagsSection.map(tag => tag.name) : ["Etiqueta 1", "Etiqueta 2"])
      const [currentColor, setCurrentColor] = useState(table.color)
      // const [showAddTags, setShowAddTags] = useState(null);
      // const [selectedTags, setSelectedTags] = useState(table?.selectedTags?.length > 0 ? table.selectedTags : []);
      // const [tags, setTags] = useState(table?.tags?.length > 0 ? table.tags : []);
      const [colorAndType, setColorAndType] = useState({color: table.color, type: table.type});
      const [name, setName] = useState(table.name);
      const [accessPermitType, setAccessPermitType] = useState(table.accessPermitType);
      const [category, setCategory] = useState(table.category || "");
      const [currentType, setCurrentType] = useState(table.type);

      // console.log('editTable', editTable)

      // useEffect(() => {
      //   console.log('entra en la tabla')

      //   if(editTable == index){
      //   setSelectedTags(table?.selectedTags?.length > 0 ? table.selectedTags : []);
      //   setTags(table?.tags?.length > 0 ? table.tags : []);
      //   }
      // }, [editTable])


      const typesArray = [
        "docs",
      "assets",
      "contacts",
      "blank",
      "folder",
    ]

    const typeIndex = typesArray.indexOf(table.type)
    
      const [initialTablesColorMapArray, setInitialTablesColorMapArray] = useState([
    "#0000ff",
    "#10a37f",
    "#F6851b",
    "#000000",
    "#d4af37",
  ].map((color, index) =>{
    if(index == typeIndex){
      return table.color || color
    }
    return color
  }))

  const addContent = async () => {
    await dispatch(
      createTableData({ tableId: table.tableId })
    ); await dispatch(refreshTableInfo({ tableId: table.tableId }))
    
    await dispatch(getTableDataFiltered({tableId:table.tableId,
    }));
  }


  return (
    <div className={`${styles.headerSecondPart} ${styles.fadeInUp}`}>
      <div className={styles.leftContainer}>
        <div className={styles.row}>
        <div>
          <CustomDropdown
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
            typeIcons={typeIcons}
            height="25px"
            options={optionsDropdown}
            selectedOption={currentType || "cargando..."}
            setSelectedOption={(options) => {
              // handleChangeColor(options, table)
              setColorAndType(options)
              setCurrentType(options.type)
            }}
            father={"tablesType"}
            placeholder={"Seleccione color"}
            generalStyleFilterSort={{
              background: "transparent",
              minWidth: "10px",
              color: "var(--black)",
            }}
            arrowSizeCustom={12}
            stateStripe={false}
            tableSelectedColor={tableSelectedColor}
            setTableSelectedColor={setTableSelectedColor}
            initialTablesColorMapArray={initialTablesColorMapArray} />
        </div>

        {/* <select
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
          </select> */}


          <div className={styles.tableNameEditContainer}>
          {/* <div
            className={table.color
              ? styles.iconsTypeTableWhite
              : styles.iconsTypeTable}
            style={{ background: table.color }}
          >
            {typeIcons[table.type] || null}
          </div> */}
          <input style={{border: '1px solid #e6e6e6',}}
            ref={(el) => (inputRefs.current[table._id] = el)}
            className={styles.editInput}
            value={name}
             
            // value={table.name}
            // disabled={editingTableId !== table._id}
            onFocus={()=> toggleEditTable(
              editingTableId, 
              setEditingTableId, 
              table, 
              toggleEditTableProps.handleSaveName, 
              toggleEditTableProps.setEditedTableName, 
              toggleEditTableProps.inputRefs)
            }
            onChange={(e) => setName(e.target.value)}
            // onBlur={(e) => {
            //   e.preventDefault();
            //   e.stopPropagation();
            //   handleSaveName(table);
            //   inputRefs.current[table._id].blur();
            // }}
            placeholder={t(table.type)}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     e.preventDefault();
            //     handleSaveName(table);
            //     inputRefs.current[table._id].blur();
            //   }
            // } } 
            />

          {/* <PencilEdit
            onClick={()=>toggleEditTable(
              editingTableId, 
              setEditingTableId, 
              table, 
              toggleEditTableProps.handleSaveName, 
              toggleEditTableProps.setEditedTableName, 
              toggleEditTableProps.inputRefs)
            }
            className={styles.editButton} /> */}
        </div>


        </div>
        <div className={styles.row}>
            <input style={{width: '100%',border: 'none', background: '#f5f5f5',height: '30px'}} type="text" placeholder='Categoría'
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            />
        </div>
        <div className={styles.row}>
        <div className={styles.privatePublicButton}>
           <div>
              { accessPermitType === "private" ? <TableLockClose /> : <TableLockOpen /> }
            { accessPermitType === "private" ? <span>{t("private")}</span> : <span>{t("public")}</span> }
              <OptionsSwitchComponent
                blackBg={true}
                isChecked={accessPermitType === "public"}
                setIsChecked={ () => {
                  if(accessPermitType === "private"){ 
                    setAccessPermitType("public")
                  } else {
                    setAccessPermitType("private")
                  }
                } } />
            </div> 
          {/* { accessPermitType === "public" && <div>
             <TableLockOpen />
              <span>{t("public")}</span>
              <OptionsSwitchComponent
                blackBg={true}
                isChecked={accessPermitType === "public"}
                setIsChecked={ () => {
                  // handleTableAccessPermitTypeUpdate(table, "public")
                  setAccessPermitType("private")
                } } />
            </div> } */}
          </div>
          <button onClick={()=>addContent()} className={styles.addTagButton} >
          Agregar contenido
          </button>
        </div>
      </div>

      <div className={styles.rightContainer}>
        <div style={{justifyContent: 'end', gap: '10px'}} className={styles.row}> <Button
         action={async()=>{
          // handleUpdateTable(table._id, tags, selectedTags, colorAndType, name, accessPermitType, category)
          const {color, type  } = colorAndType
         await dispatch(updateTableData({tableId: table.tableId, data: {tags: tags.length > 0 ? tags : table.tags, selectedTags: selectedTags.length > 0 ? selectedTags : [], 
            color: color ? color : table.color, type: type ? type : table.type, name: name ? name : table.name, accessPermitType: accessPermitType ? accessPermitType : table.accessPermitType, 
            category: category ? category : table.category, _id: table._id}}))
          await dispatch(getTableDataFiltered({tableId: table.tableId}))
          setEditTable(null)}
         }> 
         <SaveIcon /> Guardar</Button> <DeleteButton action={()=>setShowDeleteTableModal(index)} /> </div>
        <div className={styles.row} style={{justifyContent: 'end', gap: '10px'}}>
        <div className={styles.tagsSection}>
                {selectedTags.map((tag, index) => (
                  <div key={index} className={styles.tag} style={{backgroundColor: tag.color + '50'}}>
                    <div className={styles.tagText}>
                      <p style={{color: tag.color}}>{tag.name}</p>
                    </div>
                    <button style={{backgroundColor: "transparent"}}
                      className={styles.tagCloseButton}
                      onClick={() => handleRemoveTag(index)}
                    >
                      <div className={styles.tagCloseText}>
                        <p style={{color: tag.color}}>×</p>
                      </div>
                    </button>
                  </div>
                ))}
                
                <button onClick={()=>setShowAddTags(index)} className={styles.addTagButton} 
                // onClick={onAddTag}
                >
                   <HeaderTableIcon1 />
                </button>
              </div>
        </div>
      </div>
      {/* {showAddTags && (
        <NewTag
          setShowNewTagModal={setShowAddTags}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          setTags={setTags}
          tags={tags}
        />
      )} */}

      
    </div>
  );
}


