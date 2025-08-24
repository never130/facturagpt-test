import React, { useEffect, useRef, useState } from 'react'
import SearchIconWithIcon from '../../../SearchIconWithIcon/SearchIconWithIcon'
import Button from '../../../Button/Button'
import FiltersDropdownContainer from '../../../FiltersDropdownContainer/FiltersDropdownContainer'
import PaginationTables from '../../../PaginationTables/PaginationTables'
import styles from './headerThirdPart.module.css'
import { getTableDataFiltered } from '../../../../../../actions/user'
import { useDispatch } from 'react-redux'

export default function HeaderThirdPart({options, table,
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
    readOnly = false
}) {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState({});
    const [limit, setLimit] = useState(20);
    const [page, setPage] = useState(0);
    const searchInputRef = useRef(null);
    const [totalData, setTotalData] = useState(0);

    const getTableWithFilter = async (tableId) => {
     const response = await dispatch(
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

        setTotalData(response?.payload?.total || 0)
      };

    useEffect(() => {
        const fn = async () => {
        getTableWithFilter(table.tableId);
        };
        fn(table);
      }, [limit, page, searchTerm, selectedOption]);

      

    
  return (
    <div className={styles.headerThirdPartContainer}>
         <SearchIconWithIcon 
          ref={searchInputRef}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm} 
          father={"tables"}
          readOnly={readOnly}
          >
<>
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
          options={options}
          father={"tables"}
          />
      </>
        </SearchIconWithIcon>

       {(totalData > 20 || tableDataMap[table._id]?.length > 20 ) && <PaginationTables
        totalData={totalData || tableDataMap[table._id]?.length ||  0}
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        father={"tables"} />
        }
        </div>
  )
}