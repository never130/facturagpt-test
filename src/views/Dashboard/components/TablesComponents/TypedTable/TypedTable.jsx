import { useTranslation } from "react-i18next";
import emptyImage from "../../../assets/ImageEmpty.svg"; 
import DynamicTable from "../../DynamicTable/DynamicTable";
// import TableSkeleton from "./TableSkeleton";
import TableSkeleton from "./TableSkeleton2";
import { basicSkeletonConfig, advancedSkeletonConfig, financialSkeletonConfig, modernSkeletonConfig, mixedTablesSkeletonConfig } from "./skeletonConfigs";
export default function TypedTable ({ 
  table, 
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
  skeletonConfig = null,
  onSkeletonCellClick = null,
  onSkeletonFormulaApply = null,
  styles,
  tablesFiltered,
  index
}) {
  const { t } = useTranslation(["Contacts", "Assets"]);


  // console.log('table', table)
  // console.log('tableDataMap', tableDataMap)
  let newData = tableDataMap[table.tableId]
  newData = newData.filter(tab => !(tab?.hasOwnProperty("main")) );

  // console.log('newData', newData)
  
  const commonProps = {
    columns: table.headers,
    ref: dynamicTableRef,
    data: [...newData] || [],
    selectedIds: contactSelected?.[table?.tableId],
    onSelectAll: selectAllContacts,
    onSelect: toggleSelection,
    setOrderedTable: setOrderedTable,
    fatherOrder: `${table.tableId}`,
    orderedColumnsInitial: table.headers,
    setWidthColumn: setWidthColumn,
    fatherWidth: `${table.tableId}`,
    tables: true,
    recient: recient,
    tableId: table.tableId,
    tableType: table.type
  };

  const renderRowMap = {
    contacts: contactRenderRow,
    assets: assetRenderRow,
    docs: documentRenderRow,
    blank: assetRenderRow,
    skeleton: true
  };

  const renderRow = renderRowMap[table.type];

  // console.log('renderRow', renderRow)

  const config = skeletonConfig || mixedTablesSkeletonConfig;
  if (!renderRow) {
    return (
      <>
      <TableSkeleton
        skeletonConfig={config}
        onCellClick={onSkeletonCellClick}
        onFormulaApply={onSkeletonFormulaApply}
        isAnimating={true}
      />

      <div className={styles.defaultMessage}> <span style={{fontWeight:"500"}}>{t("NoItemsAssociatedWithThisTableWereFound")}</span>
      <span>{t("AllYouritemsRelatedToThisTableWillBeListedHere")}</span>
       </div>
       </>
    );
  }

  return renderRow && tableDataMap[table.tableId] && newData.length > 0 ? (
    <DynamicTable father={"tables"}
      {...commonProps}
      renderRow={renderRow}
    />
  ) : (

    <>
    <TableSkeleton
        skeletonConfig={config}
        onCellClick={onSkeletonCellClick}
        onFormulaApply={onSkeletonFormulaApply}
        isAnimating={true}
      />
  <div className={styles.defaultMessage}> <span style={{fontWeight:"500"}}>{t("NoItemsAssociatedWithThisTableWereFound")}</span>
    <span>{t("AllYouritemsRelatedToThisTableWillBeListedHere")}</span>
     </div>
    </>
  );
};