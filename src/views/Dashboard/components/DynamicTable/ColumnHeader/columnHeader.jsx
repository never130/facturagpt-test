import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../DynamicTable.module.css"; 
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { ReactComponent as GrabIcon } from "../../../assets/grabIcon.svg";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFirstTimeContacts, setFirstTimeAssets, setFirstTimeDocs } from "../../../../../slices/userSlices";
import { createVariable } from "../../../../../actions/user";
import { ReactComponent as ContactIdentification } from "../../../assets/contactIdentificationIcon.svg";
import { ReactComponent as TextBoxIcon } from "../../../assets/TextBoxIcon.svg";
import { ReactComponent as NumberIcon } from "../../../assets/NumberIcon.svg";
import { ReactComponent as UnitOfMeasurementIcon } from "../../../assets/UnitOfMeasurementIcon.svg";
import { ReactComponent as AmountIcon } from "../../../assets/AmountIcon.svg";
import { ReactComponent as DiscountIcon } from "../../../assets/DiscountIcon.svg";
import { ReactComponent as PercentageIcon } from "../../../assets/PercentageIcon.svg";
import { ReactComponent as DateIcon } from "../../../assets/DateIcon.svg";
import { ReactComponent as DateRangesIcon } from "../../../assets/DateRangesIcon.svg";
import { ReactComponent as LocationIcon } from "../../../assets/LocationIcon.svg";
import { ReactComponent as FilesMediaIcon } from "../../../assets/FilesMediaIcon.svg";
import { ReactComponent as listIcon } from "../../../assets/ListIconNew.svg";
import { ReactComponent as CategoryIcon } from "../../../assets/CategoryIcon.svg";
import { ReactComponent as TagIcon } from "../../../assets/TagIconNew.svg";
import { ReactComponent as StatusIcon } from "../../../assets/StatusIcon.svg";
import { ReactComponent as ChecklistIcon } from "../../../assets/ChecklistIcon.svg";
import { ReactComponent as EmailIcon } from "../../../assets/EmailIconNew.svg";
import { ReactComponent as PhoneIcon } from "../../../assets/phoneIcon.svg";
import { ReactComponent as ContactIcon } from "../../../assets/ContactIcon.svg";
import { ReactComponent as AssetIcon } from "../../../assets/AssetIcon.svg";
import { ReactComponent as UrlIcon } from "../../../assets/UrlIcon.svg";
import { ReactComponent as ChronometerIcon } from "../../../assets/ChronometerIcon.svg";
import { ReactComponent as VoiceRecorderIcon } from "../../../assets/VoiceRecorderIcon.svg";
import { ReactComponent as LanguageIcon } from "../../../assets/LanguageIcon.svg";
import { ReactComponent as FormulaIcon } from "../../../assets/FormulaIcon.svg";
import { ReactComponent as AssessmentIcon } from "../../../assets/AssessmentIcon.svg";
import { drawButton } from "pdf-lib";

const ColumnHeader = ({ column,
  index,
  onClick,
  isSorted,
  sortDirection,
  label,
  path,
  sortConfig,
  fatherOrder,
  orderedColumns,
  setColumnWidths,
  columnWidths,
  setOrderedTable,
  tableId,
  setWidthColumn,

  tableType,
  recient }) => {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.key });
  const [wait, setWait] = useState(false)
  const dispatch = useDispatch()
  const { tableView, firstTimeContact, firstTimeAssets, currentTableNew } = useSelector((state) => state.user);
  const [t] = useTranslation('Contacts')

  const sortKey =
    column.key === "id" || column.key === "state"
      ? column.key
      : `${path || ""}${column.key}`;
      

  const hasLogged = useRef(false); 

  useEffect(() => {
    if (transform?.y < -40 && transform?.y > -50 && !hasLogged.current && !wait && column.key != "transactions" && column.key != "items") {
      const newOrderedColumns = orderedColumns.filter(col => {
        if (col.key != column.key) {
          if (index == 0) {
            fatherOrder == "contacts" && dispatch(setFirstTimeContacts(false))
            fatherOrder == "assets" && dispatch(setFirstTimeAssets(false))
            fatherOrder == "docs" && dispatch(setFirstTimeDocs(false))
          }
          return true
        }
      })
      setOrderedTable && setOrderedTable(newOrderedColumns, column.key,tableId,column.id);
      hasLogged.current = true;

      setWait(true)
      setTimeout(() => {
        setWait(false)
      }, 500)
    }
    if (transform?.y >= -50 && hasLogged.current) {
      hasLogged.current = false;
    }
  }, [transform, column.key]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [db, setDb] = useState(null);

  useEffect(() => {
    if (db === null) return;

    const timeout = setTimeout(() => {
      setWidthColumn(db, tableId);
    }, 300);

    return () => clearTimeout(timeout); 
  }, [db]);

  useEffect(() => {
  if (Object.keys(columnWidths).length > 0) {
    setDb(columnWidths);
  }
}, [columnWidths]);

  const handleMouseDown = (e, key) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = e.target.parentElement.offsetWidth;

    

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);

      const currentWidth = tableView

       setColumnWidths((prev) => {
    const current = prev[key];

    const newValue = `${newWidth}px`;
    if (current === newValue) return prev;

    return {
      ...prev,
      [key]: newValue,
    };
  });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const agentItems = [
                { id: "textBox", label: t('textBox'),Icon:TextBoxIcon },
                { id: "number", label: t('number'),Icon:NumberIcon },
                { id: "unitOfMeasurement", label: t('unitOfMeasurement'),Icon:UnitOfMeasurementIcon },
                { id: "amount", label: t('amount'),Icon:AmountIcon },
                { id: "discount", label: t('discount'),Icon:DiscountIcon },
                { id: "percentage", label: t('percentage'),Icon:PercentageIcon },
                { id: "date", label: t('date'),Icon:DateIcon },
                { id: "dateRanges", label: t('dateRanges'),Icon:DateRangesIcon },
                { id: "location", label: t('location'),Icon:LocationIcon },
                { id: "filesMedia", label: t('filesMedia'),Icon:FilesMediaIcon },
                { id: "list", label: t('list'),Icon:listIcon },
                { id: "category", label: t('category'),Icon:CategoryIcon },
                { id: "colorList", label: t('colorList'),Icon:ContactIdentification },
                { id: "tag", label: t('tag'),Icon:TagIcon },
                { id: "status", label: t('status'),Icon:StatusIcon },
                { id: "checklist", label: t('checklist'),Icon:ChecklistIcon },
                { id: "email", label: t('email'),Icon:EmailIcon },
                { id: "phone", label: t('phone'),Icon:PhoneIcon },
                { id: "contact", label: t('contact'),Icon:ContactIcon },
                { id: "asset", label: t('asset'),Icon:AssetIcon },
                { id: "url", label: t('Url'),Icon:UrlIcon },
                { id: "chronometer", label: t('chronometer'),Icon:ChronometerIcon },
                { id: "voiceRecorder", label: t('voiceRecorder'),Icon:VoiceRecorderIcon },
                { id: "language", label: t('language'),Icon:LanguageIcon },
                { id: "formula", label: t('formula'),Icon:FormulaIcon },
                { id: "assessment", label: t('assessment'),Icon:AssessmentIcon },
              ];

              const itemSelected = agentItems.find(item => item.id === column.type);


  return (
    <th className={label !== t('articles') &&
      label !== t('transactions') &&
      column.key != undefined &&
      label == "" ? styles.thWithInitial : label !== t('articles') &&
        label !== t('transactions') &&
        column.key != undefined ?
      styles.thPointer : styles.thInitial}
      key={index}

      ref={setNodeRef}
      style={{
        ...style,
        width: columnWidths[column.key] || "100px",
        position: "relative", 
        background: tableType &&  recient(column.createdAt) && currentTableNew.find(id => id == tableId ) ? "#e4fff9" :  "transparent"
        // orderedColumns.length == 2 || orderedColumns.length == 1 ? "rgb(245, 245, 245)" : "transparent",
        // flex: orderedColumns.length == 2 || orderedColumns.length == 1 ? "1 1 0%" : "0%",
        // display: (orderedColumns.length == 2 || orderedColumns.length) == 1 && "flex",
        // borderTopRightRadius: orderedColumns.length == 1 ? "8px" : orderedColumns.length == 2 && index == 1 ? "8px" : "0px"
      }}

      onClick={() => onClick(column.key)}
    >
      <div className={styles.columnTitle}>
        <span >
          {(fatherOrder === "contacts" || fatherOrder === "assets" || fatherOrder === "docs" ||  tableId ) &&
            <button style={{ padding: "0px" }} {...attributes} {...listeners}>
              <GrabIcon width={8} height={12} className={styles.icon} {...attributes} {...listeners} />
            </button>}
          {column.type && <itemSelected.Icon fill={'black'} color={'black'} className={styles.iconParameter}/>}{label}{" "}
        </span>

        {label !== t('articles') &&
          label !== t('transactions') &&
          column.key != undefined && sortConfig.key === sortKey && sortConfig.count === 2 ?
          <FaChevronDown size={12} className={styles.chevronIcon} style={{ opacity: 0 }} /> :
          label !== t('articles') &&
          label !== t('transactions') &&
          column.key != undefined &&
          (sortConfig.key === sortKey ?
            (
              sortConfig.isAscending ? (
                <FaChevronUp size={12} className={styles.chevronIcon} style={{ opacity: 1 }} />
              ) : (
                <FaChevronDown size={12} className={styles.chevronIcon} style={{ opacity: 1 }} />
              )
            ) : (
              <FaChevronDown size={12} className={styles.chevronIcon} />
            ))}
      </div>

      <div
        className={styles.resizer}
        onMouseDown={(e) => handleMouseDown(e, column.key)}
      />
    </th>
  );
};

export default ColumnHeader;
