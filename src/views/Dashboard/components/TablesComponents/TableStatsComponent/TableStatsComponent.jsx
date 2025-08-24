import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import Button from "../../Button/Button";
import { getTables } from "../../../../../actions/user";
import { useDispatch } from "react-redux";
import { ReactComponent as AddTableIcon } from "../../../assets/addTableIcon.svg";
import { ReactComponent as TableDefaultIcon } from "../../../assets/tableDefaultIcon.svg";
export const TableStatsComponent = ({ stats, styles, typeIcons, tables, setTablesFiltered}) => {
  const { t } = useTranslation(["Contacts", "Assets"]);
  if (!stats || stats.length === 0) return null;
  
  return stats.map((stat, index) => {
    const isNewTable = stat.title === "newTable";

    let options = [];
    if(stat.title !== "newTable" && stat.title !== "new Table") {
      options = tables?.filter((table) => table.type === stat.title).map((table) => table.name)
    } else if(stat.title === "new Table") {
      options = tables?.map((table) => table.name)
    }
    
    const [optionSelected, setOptionSelected] = useState("");
    console.log('optionSelected', optionSelected)
    
    return (
      <div
        key={index}
        className={`${styles.infoAccount}`}
        onClick={isNewTable ? stat.action : undefined}
      >
        {stat.title !== "newTable" ? (
          <div className={styles.tableStatsContainer}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <div className={styles.iconContainerWhite} >
            { stat.title == "new Table" ? <TableDefaultIcon /> : typeIcons[stat.title] }
          </div>
          <CustomDropdown
            height="25px"
            width="100px"
            placeholder={t(stat.title)}
            options={options}
            selectedOption={optionSelected}
            setSelectedOption={(option) => {
              console.log('option', option)
              setOptionSelected(option)
              setTablesFiltered(tables?.filter((table) => table.name === option))
            }}
            // setSelectedOption={setOptionSelected}
            father={"tableStats"}
            arrowSizeCustom={12}
            generalStyleFilterSort={{
              background: "transparent",
              minWidth: "10px",
              color: "var(--black)",
              padding: "0px",
              maxWidth: "max-content",
            }}
          />
          </div>

        <div style={{display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center'}}>
        <button style={{borderRadius:"10px", border:"none", backgroundColor:"#ECEEF2"}}>
          {stat.title !== "new Table" ? (
            <span>{tables?.filter((table) => table.type === stat.title)?.length || 0} registros</span>
          ) : (
            <span>{tables?.length || 0} registros</span>
          )}
        </button>
         <button style={{borderRadius:"10px", backgroundColor:"white", border:"1px solid #e5e5e5"}}>
          <span> 0 relaciones</span>
        </button>
        </div>
        </div>
        ) : (
          <div className={styles.addTableContainer} onClick={() => {
            stat.action()
          }}>
            <AddTableIcon />
            <h3>{t(stat.title)}</h3>
          </div>
        )}
      </div>
    );
  });
};