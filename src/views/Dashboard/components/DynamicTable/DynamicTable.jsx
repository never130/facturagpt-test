import React, { useState,useEffect, useRef,forwardRef } from "react";
import styles from "./DynamicTable.module.css"; 
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import ColumnHeader from "./ColumnHeader/columnHeader";
import { useDispatch, useSelector } from "react-redux";
import { createTable, createTableData, createTableWithInitialData, getTableData, getTables, getTablesWithCounts, getVariable, refreshTableInfo, updateAccount } from "../../../../actions/user";
import Button from "../Button/Button";
import { useParams } from "react-router-dom";

  const DynamicTable = forwardRef(({
  columns,
  data,
  renderRow,
  selectedIds,
  onSelectAll,
  onSelect,
  hideCheckbox = false,
  path = "",
  limit,
  setShowStatesStripes,
  setOrderedTable,
  fatherOrder,
  orderedColumnsInitial,
  showThead,
  fatherWidth,
  setWidthColumn,
  recient,
  tableId,
  tables,
  tableType,
  saveTable,
  typeTable,
  father
}, forwardedRef) => {
  const [t] = useTranslation('Contacts')
  const [sortConfig, setSortConfig] = useState({
    key: null,
    isAscending: true,
    count:2
  });
  const [localLimit, setLocalLimit] = useState(limit)
  const {user, tableView, tableDataMap} = useSelector(state => state.user)
  const [columnSave, setColumnSave] = useState(false)
  const [columnWidths, setColumnWidths] = useState( (tableView?.[fatherWidth] && typeof tableView?.[fatherWidth] === "object" && Object.keys(tableView?.[fatherWidth]).length > 0 )? tableView?.[fatherWidth] :
  ( tableView?.widthTables?.[fatherWidth] && typeof tableView?.widthTables?.[fatherWidth] === "object" &&  Object.keys(tableView?.widthTables?.[fatherWidth]).length > 0) ?  tableView?.widthTables?.[fatherWidth] : {});
  
  const dispatch = useDispatch()
  // console.log('tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers?.length', tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers?.length)
  // console.log('tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers', tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers)

    const initialOrder = tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers?.length
  ? tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers.map((col) => col.key):
     orderedColumnsInitial?.length
  ? orderedColumnsInitial.map((col) => col.key)
  : columns?.map((c) => c.key);


const [columnOrder, setColumnOrder] = useState(initialOrder);

// console.log('initialOrder', initialOrder)
// console.log('columnOrder', columnOrder)



const sensors = useSensors(useSensor(PointerSensor));

const { id } = useParams(); 

useEffect(() => {
 setColumnOrder(initialOrder)
}, [id]);

const [activeId, setActiveId] = useState(null)
const [overId, setOverId] = useState(null)

const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log('active', active)
    console.log('over', over)

  if (!active || !over) return;
  console.log('active', active.id)
  console.log('over', over.id)

  const activeIndex = columnOrder.indexOf(active.id);
  const overIndex = columnOrder.indexOf(over.id);




  if (activeIndex === -1 || overIndex === -1) return;

  if (active.id !== over.id) {
    setActiveId(active.id)
    setOverId(over.id)
    setColumnOrder((items) => arrayMove(items, activeIndex, overIndex));
  }
};





let orderedColumns = columnOrder.map((key) => {
  const found = columns.find((col) => col.key === key);
  let newColumn
 if (tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers?.length){
  newColumn = tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers.find(col => col.key == key)
   return newColumn || { key, label: key };
 } else  return found || { key, label: key };
});

// console.log('orderedColumns', orderedColumns)


  useEffect(() =>{
    setLocalLimit(limit)
  },[])

  useEffect(() => {
    if(tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers?.length){
      setColumnOrder(tableDataMap?.[fatherOrder]?.filter(tab=> tab.main == true)[0]?.headers.map((col) => col.key))
    }
  },[tableDataMap])

// useEffect(() => {
//   const docs = tableView?.[fatherOrder];
//   if (docs?.length) {
//     const newOrder = docs.map((col) => col.key);


//     if (JSON.stringify(newOrder) !== JSON.stringify(columnOrder)) {
//       setColumnOrder(newOrder);
//     }
//   } else {
//     const docs = tableView?.tables?.[fatherOrder];
//     if (docs?.length) {
//     const newOrder = docs.map((col) => col.key);


//     if (JSON.stringify(newOrder) !== JSON.stringify(columnOrder)) {
//       setColumnOrder(newOrder);
//     }
//   }
//   }

//   if(Object.keys(columnWidths).length === 0){
//     const candidate1 = tableView?.[fatherWidth];


//   const candidate2 = tableView?.widthTables?.[fatherWidth];

//   if (candidate1 && typeof candidate1 === "object" && Object.keys(candidate1).length > 0) {
//     setColumnWidths(candidate1);
//   } else if (candidate2 && typeof candidate2 === "object" && Object.keys(candidate2).length > 0) {
//     setColumnWidths(candidate2);
//   }
// }




// }, [tableView]);

  useEffect(()=> {
    // console.log('orderedColumns', orderedColumns)
    // if(tableView){
    //   setOrderedTable && setOrderedTable(orderedColumns,"",tableId,activeId,overId )
    // }
  },[columnOrder])




  const getValue = (item, key) => {
    if (!key) return "";

    if (key === "id") return item.id; 
    if (key === "state") return item.state?.[0] || ""; 


    return key.split(".").reduce((acc, part) => acc?.[part], item) || "";
  };





  const toggleSortOrder = (key) => {
      setSortConfig((prev) => ({
        key,
        isAscending: prev.key === key ? !prev.isAscending : prev.count === 2 ? true: true , 
        count: prev.key === key ? prev.count === 2 ? -1 : prev.count +1 :0
      }));
    }


  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0; 

    let valueA = getValue(a, sortConfig.key);
    let valueB = getValue(b, sortConfig.key);


    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.isAscending ? valueA - valueB : valueB - valueA;
    }

    valueA = valueA ?? "";
    valueB = valueB ?? "";

    return sortConfig.isAscending
      ? valueA.toString().localeCompare(valueB.toString())
      : valueB.toString().localeCompare(valueA.toString());
  });
  
  const inputRef = useRef(null);

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

 const internalRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const combinedRef = (node) => {
    internalRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  useEffect(() => {
    if (!internalRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(internalRef.current);
    return () => observer.disconnect();
  }, []);


  const headersByType = {
    contacts: [
      {
        label: "Nombre",
        key: "contactName",
      },
      {
        label: "Correo",
        key: "companyEmail",
      },
      {
        label: "Teléfono",
        key: "companyPhoneNumber",
      },
      {
        label: "Dirección Física",
        key: "companyAddress",
      },
      {
        label: "Número Fiscal",
        key: "taxNumber",
      },
      {
        label: "Métodos de Pago",
        key: "cardNumber",
      },
      {
        label: "Moneda Preferida",
        key: "preferredCurrency",
      },
      {
        label: "Desde",
        key: "createdAt",
      },
      {
        label: "transacciones",
        key: "transactions",
      },
    ],
    assets: [
      {
        label: "Código",
        key: "code",
      },
      {
        label: "Nombre o Descripción",
        key: "name",
      },
      {
        label: "Proveedor",
        key: "supplier_name",
      },
      {
        label: "Categoría",
        key: "category",
      },
      {
        label: ["Cantidad", "(Último mes)"],
        key: "quantity",
      },
      {
        label: "Generado",
        key: "generated",
      },
      {
        label: "Precio máximo",
        key: "maxPrice",
      },
      {
        label: "Precio mínimo",
        key: "minPrice",
      },
      {
        label: "Precio medio",
        key: "averagePrice",
      },
      {
        label: "Desde",
        key: "createdAt",
      },
    ],
    docs: [
      {
        label: "ID Transacción",
        key: "documentTitle",
      },
      {
        label: "Descripción y Categoria",
        key: "description",
      },
      {
        label: "Notas",
        key: "tag",
      },
      {
        label: "Total",
        key: "total",
      },
      {
        label: "Fecha",
        key: "date",
      },
      {
        label: "Vencimiento",
        key: "expirationDate",
      },
      {
        label: "Método de Pago",
        key: "payMethod",
      },
      {
        label: "Estado",
        key: "state",
      },
      {
        label: "Artículos",
        key: "items",
      },
    ],
  };

  const fetchTableData = async (tableId) => {
    const res = await dispatch(getTableData(tableId));

  };


  const getAllTables = async () => {
    let res;
    let tables = [];

  
      res = await dispatch(getTables());
      if (res.payload?.tables) {
        tables = res.payload.tables;
      }

    if (tables.length > 0) {
      for (let table of tables) {
        await fetchTableData(table._id);
      }
    }
  };

  const createData = async (tableId, headers, data, type) => {

    await fetchTableData(tableId);
    const response = await dispatch(refreshTableInfo({ tableId: tableId }))
  };


  const createTableByData = async () => {
    const response = await dispatch(createTableWithInitialData({headers:columns, name:'', type:typeTable, initialData:data}))

    getAllTables();
    if(response?.meta?.requestStatus == "fulfilled"){
      const res = await dispatch(getTablesWithCounts())
    }
  } 

  // console.log('orderedColumns', orderedColumns)

  return (
    <div ref={combinedRef} className={styles.clientsTable}
    style={{
            maxWidth: containerWidth,
            width: 'max-content',
            minWidth: '100%',
            maxHeight:father == 'pricing' ? 'fit-content': father == 'tables' ? 'fit-content' : '',
            overflow: 'hidden'

          }}>
        <div className={styles.scrollWrapper} style={{overflow: 'auto'}}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
      <table className={styles.table} style={{minWidth: fatherWidth == "panelWidth" && 0, tableLayout: father == "pricing" && "auto"
           
          }}>
        <thead className={showThead ? styles.theadShowThead : styles.theadHideThead}>
          <tr style={{
            // width: orderedColumns.length == 2 ?  "300%" : orderedColumns.length == 1 ? "200%" : "1px",
            // display: (orderedColumns.length == 2 || orderedColumns.length == 1 ) && "flex"
            }}>
            {!hideCheckbox && (
              <th style={{ 
                minWidth: orderedColumns.length <= 2 ? "30px" : "1px", 
                minWidth: "40px",
                padding: "4px 0px 4px 18px", 
                width: orderedColumns.length <= 2 ? "30px" : "1px", 
                width: "40px"
              }}>
                <div className={styles.inputWrapperHover}>
                  <input
                    ref={inputRef}
                    type="checkbox"
                    checked={selectedIds && selectedIds.length === data.length}
                    onChange={tables ? () => onSelectAll(data, tableId) : onSelectAll}
                  />
              <div className={styles.inputContainer} onClick={(e) => {
              e.stopPropagation();
              handleDivClick()
            }}></div>
                </div>
              </th>
            )}
        {orderedColumns.filter(col => !col.hidden).map((col, index) => (
          <ColumnHeader
          recient={recient}
          columnWidths={columnWidths}
          setColumnWidths={setColumnWidths}
          setWidthColumn={setWidthColumn}
          setOrderedTable={setOrderedTable}
          orderedColumns={orderedColumns}
            sortConfig={sortConfig}
            column={col}
            label={col.label}
            index={index}
            path={path}
            fatherOrder={fatherOrder}
            tableId={tableId}
            tableType={tableType}
            onClick={() => {
              const sortKey =
                col.key === "id" || col.key === "state"
                  ? col.key
                  : `${path || ""}${col.key}`;
                   col.label !== t('articles') &&
                      col.label !== t('transactions') &&
                      col.key != undefined && toggleSortOrder(sortKey);
            }}
            isSorted={sortConfig.key === col.key}
            sortDirection={sortConfig.isAscending ? "asc" : "desc"}
          />
        ))}
          </tr>
        </thead>
        <tbody>
          {localLimit ? sortedData.slice(0,localLimit).map((item, index) => renderRow(item, index, onSelect,orderedColumns, tableId,tableType,columns)) :
          sortedData.map((item, index) => renderRow(item, index, onSelect,orderedColumns,tableId,tableType,columns))}
        </tbody>
      </table>
          </SortableContext>
                  </DndContext>
      </div>
          {localLimit === 2 && <div className={styles.seeMoreContainer}>
            <span onClick={() => setLocalLimit(5)}>{t('seeMore')}</span>
            </div>}
            {localLimit === 5 && <div className={styles.seeMoreContainer}>
            <span onClick={() => setLocalLimit(2)}>{t('seeLess')}</span>
            </div>}
             {localLimit === 5 && <div className={styles.seeMoreContainer}>
            <span onClick={() => setShowStatesStripes(true)}>{t('seeMore')}</span>
            </div>}
            {saveTable && (
              <Button action={createTableByData}>{t('saveTable')}</Button>
            )}
    </div>
  );
});

export default DynamicTable;
