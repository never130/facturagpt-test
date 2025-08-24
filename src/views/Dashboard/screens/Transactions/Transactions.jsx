import React, { useEffect, useRef, useState } from "react";
import styles from "./Transactions.module.css";
import optionDots from "../../assets/optionDots.svg";
import plusIcon from "../../assets/Plus Icon.svg";
import pdf from "../../assets/fileIcon.svg";
import KIcon from "../../assets/KIcon.svg";
import emptyimage from "../../assets/ImageEmpty.svg";
import { useDispatch, useSelector } from "react-redux";
import { deleteDocs, getAllDocsByContact } from "../../../../actions/docs";
import { ReactComponent as Dots } from "../../assets/S3/horizontalDots.svg";
import { ReactComponent as PencilEdit } from "../../assets/pencilEdit.svg";
import { useNavigate, useParams } from "react-router-dom";
import { clearContact } from "../../../../slices/contactsSlices";
import NewBIll from "../../components/NewBIll/NewBIll";
import SkeletonScreen from "../../components/SkeletonScreen/SkeletonScreen";
import { ReactComponent as Arrow } from "../../assets/ArrowLeftWhite.svg";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import ClientsHeader from "../../components/ClientsHeader/ClientsHeader";
import NewContact from "../../components/NewContact/NewContact";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import { ReactComponent as GreenMailIcon } from "../../assets/greenMailIcon.svg";
import { ReactComponent as GreenWebIcon } from "../../assets/greenWebIcon.svg";
import { ReactComponent as GreenPhoneIcon } from "../../assets/greenPhoneIcon.svg";
import { ReactComponent as GrayTagIcon } from "../../assets/tagNewIcon.svg";
import { ReactComponent as GreenCopyIcon } from "../../assets/greenCopyIcon.svg";
import { ReactComponent as LocationParamIcon } from "../../assets/LocationParamIcon.svg";
import FiltersDropdownContainer from "../../components/FiltersDropdownContainer/FiltersDropdownContainer";
import OptionsPopup from "../../components/OptionsPopup/OptionsPopup";
import ImportContactsAndProducts from "../../components/ImportContactsAndProducts/ImportContactsAndProducts";
import PaginationTables from "../../components/PaginationTables/PaginationTables";
import { useTranslation } from "react-i18next";
import { setPaginationSlice } from "../../../../slices/paginationSlices";
import {
  selectDocument,
  setDocsTableLength,
  setFirstTimeDocs,
} from "../../../../slices/userSlices";
import {
  createVariable,
  getVariable,
  updateAccount,
} from "../../../../actions/user";
import { formatAgoDate } from "../../../../utils/agoDateUtil";
import { getOneContact } from "../../../../actions/contacts";
import Button from "../../components/Button/Button";
import NewTag from "../../components/NewTag/NewTag";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import SearchIconWithIcon from "../../components/SearchIconWithIcon/SearchIconWithIcon";
import { ReactComponent as EyePassword } from "../../assets/eyePassword.svg";
import { ReactComponent as GrabIcon } from "../../assets/grabIcon.svg";
import { ReactComponent as Icon1OfText } from "../../assets/icon1OfText.svg";
import { ReactComponent as Icon2OfText } from "../../assets/icon2OfText.svg";
import { ReactComponent as Icon3OfText } from "../../assets/icon3OfText.svg";
import { ReactComponent as Icon4OfText } from "../../assets/icon4OfText.svg";
import { ReactComponent as EyePasswordSlash } from "../../assets/eyePasswordSlash.svg";
import { ReactComponent as ContactIdentification } from "../../assets/contactIdentificationIcon.svg";
import { ReactComponent as TextBoxIcon } from "../../assets/TextBoxIcon.svg";
import { ReactComponent as NumberIcon } from "../../assets/NumberIcon.svg";
import { ReactComponent as UnitOfMeasurementIcon } from "../../assets/UnitOfMeasurementIcon.svg";
import { ReactComponent as AmountIcon } from "../../assets/AmountIcon.svg";
import { ReactComponent as DiscountIcon } from "../../assets/DiscountIcon.svg";
import { ReactComponent as PercentageIcon } from "../../assets/PercentageIcon.svg";
import { ReactComponent as DateIcon } from "../../assets/DateIcon.svg";
import { ReactComponent as DateRangesIcon } from "../../assets/DateRangesIcon.svg";
import { ReactComponent as LocationIcon } from "../../assets/LocationIcon.svg";
import { ReactComponent as FilesMediaIcon } from "../../assets/FilesMediaIcon.svg";
import { ReactComponent as listIcon } from "../../assets/ListIconNew.svg";
import { ReactComponent as CategoryIcon } from "../../assets/CategoryIcon.svg";
import { ReactComponent as TagIcon } from "../../assets/TagIconNew.svg";
import { ReactComponent as StatusIcon } from "../../assets/StatusIcon.svg";
import { ReactComponent as ChecklistIcon } from "../../assets/ChecklistIcon.svg";
import { ReactComponent as EmailIcon } from "../../assets/EmailIconNew.svg";
import { ReactComponent as PhoneIcon } from "../../assets/phoneIcon.svg";
import { ReactComponent as ContactIcon } from "../../assets/ContactIcon.svg";
import { ReactComponent as AssetIcon } from "../../assets/AssetIcon.svg";
import { ReactComponent as UrlIcon } from "../../assets/UrlIcon.svg";
import { ReactComponent as ChronometerIcon } from "../../assets/ChronometerIcon.svg";
import { ReactComponent as VoiceRecorderIcon } from "../../assets/VoiceRecorderIcon.svg";
import { ReactComponent as LanguageIcon } from "../../assets/LanguageIcon.svg";
import { ReactComponent as FormulaIcon } from "../../assets/FormulaIcon.svg";
import { ReactComponent as AssessmentIcon } from "../../assets/AssessmentIcon.svg";
const Docs = () => {
  const [t] = useTranslation(["Transctions","Preview"]);
  const [transactionSelected, setTransactionSelected] = useState([]);
  const [showNewContact, setShowNewContact] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const { id } = useParams();
  const { user, tableView, docsTableLength, firstTimeDocs } = useSelector(
    (state) => state.user
  );
  const { contact: ConctactSlice } = useSelector((state) => state.contacts);
  const [contact, setContact] = useState(ConctactSlice)
  useEffect(() => {

    setContact(ConctactSlice)

  }, [id, ConctactSlice])

  const dispatch = useDispatch();
  const { docsByContact, loading } = useSelector((state) => state.docs);
  const navigate = useNavigate();

  const selectContact = (rowIndex) => {
    setTransactionSelected((prevItem) => {
      if (prevItem.includes(rowIndex)) {
        return prevItem.filter((i) => i !== rowIndex);
      } else {
        return [...prevItem, rowIndex];
      }
    });
  };

  const [allTransactionsInfo, setAllTransactionsInfo] = useState([]);
  const selectAllContacts = () => {
    if (transactionSelected.length === mockDocs.length) {
      setTransactionSelected([]);
      setSelectedIds(false);
      setAllTransactionsInfo([]);
    } else {
      setSelectedIds(true);
      const allContactIndexes = mockDocs.map((transaction) => transaction._id);
      setAllTransactionsInfo(mockDocs);

      setTransactionSelected(allContactIndexes);
    }
  };

  const getStateClass = (state) => {
    switch (state.toLowerCase()) {
      case t("paid"):
        return styles.pagada;
      case t("pending"):
        return styles.pendiente;
      case t("unfulfilled"):
        return styles.incumplida;
      case t("defeated"):
        return styles.vencida;
      case t("annulled"):
        return styles.anulada;
      default:
        return "";
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showNewContact) {
        setIsAnimating(true);
        setTimeout(() => {
          setShowNewContact(false);
          setIsAnimating(false);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNewContact]);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleActions = (rowIndex, row) => {
    setSelectedRowIndex(selectedRowIndex === row._id ? null : row._id);
  };

  const handleDeleteDocs = async (e) => {
    e.preventDefault();
    await dispatch(
      deleteDocs({ docsIds: selectedRowIndex || transactionSelected })
    )
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setSelectedTransactionIds([]);
        } else {
          console.error("Error deleting transaction:", result.error);
        }
        getDocuments();
      })
      .catch((error) => {
        console.error("Unexpected error:", error);
      });
  };

  const toggleTransactionSelection = (transactionId) => {
    setSelectedTransactionIds((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const [mockDocs, setMockDocs] = useState([]);
  const { pageSlice, limitSlice } = useSelector((state) => state.pagination);
  const [limit, setLimit] = useState((limitSlice && limitSlice) || 20);
  const [page, setPage] = useState((pageSlice && pageSlice) || 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalTransactions, setTotalTransactions] = useState(null);

  const [selectedOption, setSelectedOption] = useState({
    Categoria: "Gastos Operativos",
    "Moneda Preferida": "USD",
    Estado: "Todos",
    Fecha: "Todos",
    "Fecha de Vencimiento": "Todos",
    Activos: "Todos",
  });

  const fnTableView = async () => {
    await dispatch(getVariable({ type: "tableView" }));
  };

  const setOrderedTable = async (orderedColumns) => {
    if (tableView) {
      await dispatch(
        createVariable({
          variableData: {
            title: "tableView",
            type: "tableView",
            docs: orderedColumns,
          },
        })
      );
      fnTableView();
    }
  };

  const setWidthColumn = async (columnWidths) => {
    await dispatch(
      createVariable({
        variableData: {
          title: "tableView",
          type: "tableView",
          docsWidth: columnWidths,
        },
      })
    );
    fnTableView();
  };

  useEffect(() => {
    if (
      tableView?.docs?.length > 0 &&
      tableView?.docs?.length != docsTableLength
    ) {
      if (docsTableLength !== 0) {
        if (tableView?.docs?.length > docsTableLength)
          dispatch(setFirstTimeDocs(true));
      } else dispatch(setFirstTimeDocs(false));
      dispatch(setDocsTableLength(tableView?.docs?.length));
    }
  }, [tableView]);

  useEffect(() => {
    if (!tableView || tableView.length === 0) fnTableView();
  }, []);

  useEffect(() => {
    const getOneContactFn = async () => {
      const response = await dispatch(getOneContact({ clientId: id }));
    };
    getOneContactFn();
  }, [id]);

  const getDocuments = async () => {
    const response = await dispatch(
      getAllDocsByContact({
        contactId: id || "allDocs",
        search: searchTerm,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"],
        statusFilter: selectedOption.Estado,
        sortQuantity: selectedOption.Generado,
        sortDate: selectedOption.dateFilter,
        dateOrder: selectedOption.dateOrder,
      })
    );

    if (response.payload) {
      setMockDocs(response.payload.docs);
      setTotalTransactions(response.payload.total);
    }
  };
  useEffect(() => {
    getDocuments();
  }, [loading, searchTerm, page, limit, selectedOption]);

  useEffect(() => {
    setPage(0);
  }, [limit, searchTerm, selectedOption]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const [showPopupNewTransaction, setShowPopupNewTransaction] = useState(false);
  const longPressTriggeredRef = useRef(false);
  const timerRef = useRef(null);
  const [docSelected, setDocSelected] = useState(false);

  const handleClick = (row) => {
    if (!longPressTriggeredRef.current) {
      setShowPopupNewTransaction(true);
      dispatch(setPaginationSlice({ limitSlice: limit, pageSlice: page }));
      setDocSelected(row);
    }
  };
  const popupButtonRef = useRef([]);

  const inputRef = useRef(null);

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDoubleClick = (row) => {
    setShowPopupNewTransaction(false);
    setShowNewContact(true);
    dispatch(setPaginationSlice({ limitSlice: limit, pageSlice: page }));
    navigate(`/admin/docs/${id}/${row._id}`);
  };

  const handleMouseDown = (row) => {
    longPressTriggeredRef.current = false;
    timerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      inputRef.current?.click();
      toggleTransactionSelection(row._id);
      selectContact(row._id);
      setAllTransactionsInfo((prevState) => {
        const exists = prevState.some((asset) => asset._id === row._id);

        if (exists) {
          return prevState.filter((asset) => asset._id !== row._id);
        } else {
          return [...prevState, row];
        }
      });
      handleDivClick();
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
      onMouseDown={() => handleMouseDown(row)}
      onMouseUp={handleMouseUp}
    >
      <td>
        <div className={styles.optionsTd}>
          <div className={styles.inputWrapperHover}>
            <input
              ref={inputRef}
              type="checkbox"
              name="transactionSelected"
              onChange={() => { }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              checked={transactionSelected.includes(row._id)}
            />
            <div
              className={styles.inputContainer}
              onClick={(e) => {
                e.stopPropagation();
                toggleTransactionSelection(row._id);
                selectContact(row._id);
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
                handleDivClick();
              }}
            ></div>
          </div>

          <div className={styles.edit}>
            <div
              ref={(el) => (popupButtonRef.current[index] = el)}
              onClick={() => {
                toggleTransactionSelection(row.id);
                handleActions(index, row);
              }}
              className={styles.dotsOptions}
            >
              <img src={optionDots} />
            </div>
            {selectedRowIndex === row._id && (
              <div className={styles.optionsPopupContainer}>
                <OptionsPopup
                  style={{
                    position: "fixed",
                    top:
                      popupButtonRef.current[index].getBoundingClientRect()
                        .top + popupButtonRef.current[index].offsetHeight,
                    left: popupButtonRef.current[index].getBoundingClientRect()
                      .left,
                  }}
                  close={() => setSelectedRowIndex(null)}
                  options={[
                    {
                      label: t("edit"),
                      onClick: () => {
                        setShowNewContact(true);
                        setSelectedRowIndex(null);
                      },
                    },
                    {
                      label: t("delete"),
                      onClick: (e) => {
                        handleDeleteDocs(e);
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

      {orderedColumns.map(({ key }, index) => {
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
              <span className={getStateClass(row.state?.[0] || "default")}>
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
                      className={getStateClass(row.state[0])}
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
                firstTimeDocs && index === 0
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
  const tableHeaders = [
    { label: t("idTransactions"), key: "id" },
    { label: t("descriptionAndCategory"), key: "description" },
    { label: t("notes"), key: "tag" },
    { label: t("total"), key: "total" },
    { label: t("from"), key: "createdAt" },
    { label: t("maturity"), key: "expirationDate" },
    { label: t("payMethod"), key: "payMethod" },
    { label: t("state"), key: "state" },
    { label: t("articles"), key: "items" },
  ];

  const [showImportContacts, setShowImportContacts] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "k");

  const [swiped, setSwiped] = useState(false);

  const options = [
    {
      name: "Categoría",
      label: t("category"),
      subOptions: [
        { display: "A-Z", value: "A-Z" },
        { display: "Z-A", value: "Z-A" },
      ],
    },
    {
      name: "Moneda Preferida",
      label: t("preferredCurrency"),
      subOptions: "currencies",
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
      name: "Fecha",
      label: t("date"),
      subOptions: [
        { value: "Hoy", display: t("today") },
        { value: "Ayer", display: t("yesterday") },
        { value: "Antes de ayer", display: t("dayBeforeYesterday") },
        { value: "Última semana", display: t("lastWeek") },
        { value: "Último mes", display: t("lastMonth") },
        { value: "Últimos 6 meses", display: t("last6Months") },
        { value: "Último año", display: t("lastYear") },
        { value: "Custom", display: t("Custom") },
      ],
    },
    {
      name: "Vencimiento",
      label: t("expirationDate"),
      subOptions: [
        { value: "Hoy", display: t("today") },
        { value: "Ayer", display: t("yesterday") },
        { value: "Antes de ayer", display: t("dayBeforeYesterday") },
        { value: "Última semana", display: t("lastWeek") },
        { value: "Último mes", display: t("lastMonth") },
        { value: "Últimos 6 meses", display: t("last6Months") },
        { value: "Último año", display: t("lastYear") },
        { value: "Custom", display: t("Custom") },
      ],
    },
    {
      name: "# Activos",
      label: t("assets"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menos" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
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
  const handleCloseNewContact = () => {
    setIsAnimating(true);
    setTimeout(() => {
      dispatch(clearContact());
      setShowNewContact(false);
      setShowImportContacts(false);
      setIsAnimating(false);
    }, 300);
  };

  const [fileNameS3, setFileNameS3] = useState(null);

  const defaultPhone =
    contact?.companyPhoneNumber?.find((p) => p.default) ||
    contact?.companyPhoneNumber?.[0];

  const defaultBill =
    contact?.infoBill?.find((bill) => bill.default) || contact?.infoBill?.[0];


  const [copyClipboard, setCopyclipboard] = useState(false)
  const [editingFileTitle, setEditingFileTitle] = useState(false)
  const inputTitleFile = useRef(null)

  useEffect(() => {
    if (editingFileTitle && inputTitleFile.current) {
      inputTitleFile.current.focus();
    }
  }, [editingFileTitle]);

  useEffect(() => {
    setContact((prev) => {
      const prevSelectedTags = Array.isArray(prev?.selectedtags) ? prev.selectedtags : [];
      const prevTags = Array.isArray(prev?.tags) ? prev.tags : [];

      const mergedSelectedTags = [
        ...prevSelectedTags.filter(
          (existing) => !selectedTags.some((tag) => tag.id === existing.id)
        ),
        ...selectedTags,
      ];

      const mergedTags = [
        ...prevTags.filter(
          (existing) => !tags.some((tag) => tag.id === existing.id)
        ),
        ...tags,
      ];

      return {
        ...prev,
        selectedtags: mergedSelectedTags,
        tags: mergedTags,
      };
    });
  }, [selectedTags, tags]);



  const handleBtnsActions = (type) => {
    if (!contact) return;

    const { companyPhoneNumber, webSite, companyEmail } = contact;

    switch (type) {
      case 'clipboard':
        navigator.clipboard.writeText(window.location.href)
          .then(() => console.log('URL copiada al portapapeles'))
          .catch((err) => console.error('Error al copiar al portapapeles:', err));
        setCopyclipboard(true)
        setTimeout(() => {
          setCopyclipboard(false)
        }, 5000);
        break;

      case 'callPhoneNumber':
        if (companyPhoneNumber?.length > 0) {
          const { code, number } = companyPhoneNumber[0];
          window.location.href = `tel:${code}${number}`;
        }
        break;

      case 'website':
        if (webSite) {
          const formattedWebsite = webSite.startsWith('http://') || webSite.startsWith('https://')
            ? webSite
            : `https://${webSite}`;
          window.open(formattedWebsite, '_blank');
        }
        break;

      case 'email':
        if (companyEmail) {
          window.location.href = `mailto:${companyEmail}`;
        }
        break;

      case "inputFileTitle":
        setEditingFileTitle((prev) => !prev)
        break;
      default:
        console.warn('Tipo de acción no reconocido:', type);
    }

  };


  const agentItems = [
    { id: "textBox", label: t('textBox'), Icon: TextBoxIcon },
    { id: "number", label: t('number'), Icon: NumberIcon },
    { id: "unitOfMeasurement", label: t('unitOfMeasurement'), Icon: UnitOfMeasurementIcon },
    { id: "amount", label: t('amount'), Icon: AmountIcon },
    { id: "discount", label: t('discount'), Icon: DiscountIcon },
    { id: "percentage", label: t('percentage'), Icon: PercentageIcon },
    { id: "date", label: t('date'), Icon: DateIcon },
    { id: "dateRanges", label: t('dateRanges'), Icon: DateRangesIcon },
    { id: "location", label: t('location'), Icon: LocationIcon },
    { id: "filesMedia", label: t('filesMedia'), Icon: FilesMediaIcon },
    { id: "list", label: t('list'), Icon: listIcon },
    { id: "category", label: t('category'), Icon: CategoryIcon },
    { id: "colorList", label: t('colorList'), Icon: ContactIdentification },
    { id: "tag", label: t('tag'), Icon: TagIcon },
    { id: "status", label: t('status'), Icon: StatusIcon },
    { id: "checklist", label: t('checklist'), Icon: ChecklistIcon },
    { id: "email", label: t('email'), Icon: EmailIcon },
    { id: "phone", label: t('phone'), Icon: PhoneIcon },
    { id: "contact", label: t('contact'), Icon: ContactIcon },
    { id: "asset", label: t('asset'), Icon: AssetIcon },
    { id: "url", label: t('Url'), Icon: UrlIcon },
    { id: "chronometer", label: t('chronometer'), Icon: ChronometerIcon },
    { id: "voiceRecorder", label: t('voiceRecorder'), Icon: VoiceRecorderIcon },
    { id: "language", label: t('language'), Icon: LanguageIcon },
    { id: "formula", label: t('formula'), Icon: FormulaIcon },
    { id: "assessment", label: t('assessment'), Icon: AssessmentIcon },
  ];
  const parameterTypes = [...new Set(contact?.parameters?.map(p => p.type))];
  const iconsToRender = agentItems.filter(item => parameterTypes.includes(item.id));


  return (
    <>
      <div
        className={`${styles.mainContainer} ${showPopupNewTransaction ? styles.sectionTableMore : ""}`}
      >
        <div className={styles.container}>
          <div className={styles.infoContact}>
            <div className={styles.leftSideTransactions}>
              <div className={styles.arrowContainer}>
                <div
                  className={styles.iconContainer}
                  onClick={() => navigate("/admin/tables")}
                >
                  <Arrow />
                </div>
              </div>
              <img src={contact?.image || emptyimage} alt="" />
              <div className={styles.contactInfo}>
                <div>
                  <h3>{contact?.contactName || t('contactName')}</h3>
                </div>
                <div className={styles.info}>
                  <span>{contact?.type || t('typeContact')}</span>
                  <span>{contact?.taxNumber || t('taxNumber')}</span>
                </div>
                <div className={styles.info}>
                  <span>{contact?.companyEmail || t('emailAddress')}</span>
                  <span>
                    {defaultPhone?.code || t('phone')}{" "}
                    {defaultPhone?.number || t('number')}
                  </span>
                  <span>
                    {defaultBill?.zipCode || t('zipCode')},{" "}
                    {defaultBill?.country || t('countryOfResidence')}
                  </span>
                </div>
                <div className={styles.info}>
                  <div className={styles.iconsContainer}>
                    {iconsToRender.map(({ id, label, Icon }) => (
                      <div key={id} className={styles.iconWrapper} title={label}>
                        <Icon />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
            <div className={styles.rightSideTransactions}>
              <div className={styles.btnsContainer}>
                <Button
                  action={() => {
                    dispatch(selectDocument({ item: null }));
                    setShowNewContact(true);
                  }}
                  headerStyle={{ padding: "12px 16px" }}
                >
                  {t("newTransaction")}
                </Button>

                <Button
                  action={() => {
                    setShowEditContact(true);
                  }}
                  type="lightGray"
                  headerStyle={{ borderRadius: "999px", padding: "12px 16px" }}
                >
                  <PencilEdit height={15} width={15} />
                  {t("edit")}
                </Button>
                <Button
                  action={() => {
                  }}
                  type="lightGray"
                  headerStyle={{ borderRadius: "12px", padding: "16px 4px" }}
                >
                  <Dots style={{ transform: 'rotate(90deg)' }} />
                </Button>
              </div>
              <div className={styles.btnContactInfoContainer}>
                <Button
                  type="border"
                  action={() => handleBtnsActions("clipboard")}
                >
                  <GreenCopyIcon
                    className={copyClipboard && styles.activeBtn}
                  />
                </Button>
                {contact?.companyPhoneNumber?.length > 0 && (
                  <Button
                    type="border"
                    action={() => handleBtnsActions("callPhoneNumber")}
                  >
                    <GreenPhoneIcon />
                  </Button>
                )}
                {contact?.companyEmail && (
                  <Button
                    type="border"
                    action={() => handleBtnsActions("email")}
                  >
                    <GreenMailIcon />
                  </Button>
                )}
                {contact?.webSite && (
                  <Button
                    type="border"
                    action={() => handleBtnsActions("website")}
                  >
                    <GreenWebIcon />
                  </Button>
                )}
                <Button
                  type="border"
                  action={() => {
                    setShowAddTags(true);
                  }}
                >
                  <GrayTagIcon
                    className={showAddTags && styles.activeBtn}
                  />
                </Button>
              </div>
              <div className={styles.selectedTagsContainer}>
                {contact?.selectedtags?.map((tag, i) => (
                  <div key={tag.id || i} style={{ background: tag.color }} className={styles.selectedTags}>
                    {tag.name}
                    <DeleteButton action={() => {
                      setContactData((prev) => ({
                        ...prev,
                        selectedtags: prev.selectedtags.filter((tag) => tag.id !== tag.id),
                      }));
                    }} />
                  </div>
                ))}
              </div>

            </div>

          </div>
          <div className={styles.searchPaginationContainer}><SearchIconWithIcon searchTerm={searchTerm} setSearchTerm={setSearchTerm} ref={searchInputRef}>
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
          </SearchIconWithIcon>
            {totalTransactions > 20 && (
              <PaginationTables
                totalData={totalTransactions}
                limit={limit}
                page={page}
                setPage={setPage}
                setLimit={setLimit}
              />
            )}</div>
          {/* <ClientsHeader
          ref={searchInputRef}
          additionalInfoStyles={{
            maxWidth: "100%",
          }}
          additionalInfo={
            <>
              <div className={styles.infoContact}>
                <div className={styles.leftSideTransactions}>
                  <div className={styles.arrowContainer}>
                    <div
                      className={styles.iconContainer}
                      onClick={() => navigate("/admin/contacts")}
                    >
                      <Arrow />
                    </div>
                  </div>
                  <img src={contact?.image || emptyimage} alt="" />
                  <div className={styles.contactInfo}>
                    <div>
                      <h3>{contact?.contactName || "Aythen"}</h3>
                      <span>{contact?.email || "info@aythen.com"}</span>
                      <span>
                        {contact?.codeCountry || "+34"}{" "}
                        {contact?.numberPhone || "600 798 012"}
                      </span>
                    </div>
                    <div className={styles.info}>
                      <p>{t("taxNumber")}</p>
                      <span>
                        {contact?.taxNumber || "Desconocido"}
                      </span>
                    </div>
                    <div className={styles.info}>
                      <p>{t("#Transactions")}</p>
                      <span>{totalTransactions ? ` (${totalTransactions})` : ''}</span>
                      <p>{t("total")}</p>
                      <span>
                        0,0 EUR {t("inThe")} 30 {t("days")}
                      </span>
                    </div>
                  </div>
                </div>
                {totalTransactions > 20 && (

                  <PaginationTables
                    totalData={totalTransactions}
                    limit={limit}
                    page={page}
                    setPage={setPage}
                    setLimit={setLimit}
                  />
                )}
              </div>
            </>
          }
          buttons={[
            {
              label: <>{t("editContact")}</>,
              type: "button",
              onClick: () => setShowEditContact(true),
            },
            {
              label: (
                <>
                  <img src={plusIcon} alt="" />
                  {t("newTransaction")}
                </>
              ),
              onClick: () => {
                dispatch(selectDocument({ item: null }));
                setShowNewContact(true)
              },
            },

            ...(transactionSelected.length >= 1
              ? [
                {
                  label: <>{t("delete")}</>,
                  headerStyle: { padding: "6px 10px" },
                  type: "white",
                  onClick: (e) => {
                    handleDeleteDocs(e);
                  },
                },
                {
                  label: <DownloadIcon />,
                  headerStyle: { padding: "6px 10px" },
                  type: "white",
                  onClick: () => {
                    setShowImportContacts(true);
                  },
                },
              ]
              : []),
          ]}
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
          searchProps={{
            ref: searchInputRef,
            searchTerm: searchTerm,
            setSearchTerm: setSearchTerm,
          }}
        /> */}

          {mockDocs.length == 0 ? (
            <SkeletonScreen
              labelText={t("noDocumentsFound")}
              helperText={t("allTransactionsListedHere")}
              showInput={true}
              enableLabelClick={false}
            />
          ) : (
            <DynamicTable
              columns={tableHeaders}
              data={mockDocs}
              renderRow={renderRow}
              selectedIds={transactionSelected}
              onSelectAll={selectAllContacts}
              onSelect={toggleSelection}
              path="doc.totalData."
              setOrderedTable={setOrderedTable}
              fatherOrder={"docs"}
              orderedColumnsInitial={tableView?.docs}
              setWidthColumn={setWidthColumn}
              fatherWidth={"docsWidth"}
            />
          )}
        </div>

        <div
          className={`${styles.popupContainer} ${showPopupNewTransaction ? styles.popupContainerVisible : ""}`}
          style={{ height: "91vh" }}
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
            setShowNewBill={setShowPopupNewTransaction}
            getDocuments={getDocuments}
          />
        </div>

        {showImportContacts && (
          <ImportContactsAndProducts
            text={t("transactions")}
            state={handleCloseNewContact}
            isAnimating={isAnimating}
            quantity={
              allTransactionsInfo.length >= 1
                ? allTransactionsInfo.length
                : mockDocs.length
            }
            data={
              allTransactionsInfo.length >= 1 ? allTransactionsInfo : mockDocs
            }
            selectedOption={selectedOption}
          />
        )}
        {showEditContact && (
          <NewContact
            setShowNewContact={setShowEditContact}
            typeTextHeader={t("edit")}
            selectedContact={contact}

          />
        )}
        {showNewContact && (
          <NewBIll
            setShowNewBill={setShowNewContact}
            getDocuments={getDocuments}
          />
        )}

        {showAddTags && (
          <NewTag
            setShowNewTagModal={setShowAddTags}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            setTags={setTags}
            tags={tags}
          />
        )}

      </div>
    </>
  );
};

export default Docs;
