import React, { useEffect, useRef, useState } from "react";
import styles from "./Contacts.module.css";

import plusIcon from "../../assets/Plus Icon.svg";
import optionDots from "../../assets/optionDots.svg";
import { useTranslation } from "react-i18next";
import emptyImage from "../../assets/ImageEmpty.svg";
import { ReactComponent as StarPlus } from "../../assets/starPlus.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  createContact,
  deleteContacts,
  getAllContacts,
} from "@src/actions/contacts";

import { clearContact, setContact } from "@src/slices/contactsSlices";

import { useLocation, useNavigate } from "react-router-dom";
import { clearDoc } from "@src/slices/docsSlices";
import PanelTemplate from "../../components/PanelTemplate/PanelTemplate";
import { ReactComponent as DownloadIcon } from "../../assets/downloadIconGray.svg";
import KIcon from "../../assets/KIcon.svg";
import ImportContactsAndProducts from "../../components/ImportContactsAndProducts/ImportContactsAndProducts";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import SkeletonScreen from "../../components/SkeletonScreen/SkeletonScreen";
import ContactsHeader from "../../components/ClientsHeader/ClientsHeader";
import NewContact from "../../components/NewContact/NewContact";
import FiltersDropdownContainer from "../../components/FiltersDropdownContainer/FiltersDropdownContainer";
import CreateParameterPopup from "../../components/CreateParameterPopup/CreateParameterPopup";
import OptionsPopup from "../../components/OptionsPopup/OptionsPopup";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import PaginationTables from "../../components/PaginationTables/PaginationTables";
import { getContactImage, markContactAsSeen } from "../../../../actions/contacts";
import NewBIll from "../../components/NewBIll/NewBIll";
import {
  setFatherNewContact,
  sliceSetNewContact,
} from "../../../../slices/contactsSlices";
import { setPaginationSlice } from "../../../../slices/paginationSlices";
import { formatAgoDate } from "../../../../utils/agoDateUtil"
import AmountTransaction from "../../components/AmountTransaction/AmountTransaction";
import { createVariable, getVariable, updateAccount } from "../../../../actions/user";
import { setContactsTableLength, setFirstTimeContacts } from "../../../../slices/userSlices";
import NavigationPopups from "../../components/NavigationPopups/NavigationPopups";
import SelectAgentModal from "../ChatView/SelectAgentModal/SelectAgentModal";
import ViewContactLeft from "../../../../components/contacts/viewContactLeft";


const Contacts = () => {
  const { t } = useTranslation(["Contacts","Preview"]);
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contactSelected, setContactSelected] = useState([]);
  const [showNewContact, setShowNewContact] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(
    location.state?.showImport || false
  );
  const [showNewBill, setShowNewBill] = useState(false);
  const [orderedColumns, setOrderedColumns] = useState([])
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCreateParameterFromPopup, setShowCreateParameterFromPopup] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, tableView, contactsTableLength, firstTimeContact } = useSelector((state) => state.user);
  const { allContacts } = useSelector((state) => state.user);
  const { sliceShowNewBill } = useSelector((state) => state.contacts);


  const { contacts, loading, contact, totalContacts } = useSelector((state) => state.contacts);
 const [showPanel, setShowPanel] = useState(false);
  const [contactData, setContactData] = useState({
    contactName: "",
    companyEmail: "",
    companyPhoneNumber: [],
    codeCountry: "",
    webSite: "",
    billingEmail: "",
    contactZip: "",
    country: "",
    contactCif: "",
    preferredCurrency: "",
    cardNumber: "",
    companyAddress: "",
    companyCity: "",
    companyProvince: "",
    companyCountry: "",
    infoBill: [],
    paymethod: [],
  });
  const { contactLimitSlice, contactPageSlice } = useSelector(
    (state) => state.pagination
  );
  const [limit, setLimit] = useState(
    (contactLimitSlice && contactLimitSlice) || 20
  );
  const [page, setPage] = useState((contactPageSlice && contactPageSlice) || 0);

  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z", 
    Estado: "Todos", 
    "Moneda Preferida": "USD", 
    "# Transacciones": "Mayor a menos", 
    "Ingresos/Costes": "Ingresos de mayor a menor", 
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
      name: "Moneda Preferida",
      label: t("preferredCurrency"),
      subOptions: "currencies",
    },
    {
      name: "# Transacciones",
      label: t("transactions"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menos" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },
    {
      name: "Ingresos/Costes",
      label: t("incomeCosts"),
      subOptions: [
        {
          display: t("incomeHigherToLower"),
          value: "Ingresos de mayor a menor",
        },
        {
          display: t("incomeLowerToHigher"),
          value: "Ingresos de menor a mayor",
        },
        { display: t("costsHigherToLower"), value: "Costes de mayor a menor" },
        { display: t("costsLowerToHigher"), value: "Costes de menor a mayor" },
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

  const fnTableView = async () => { await dispatch(getVariable({ type: 'tableView' })) }

  const setOrderedTable = async (orderedColumns,key) => {
    if(key){
      await dispatch(createVariable({
                  variableData: {
                    title: "tableView", type: "tableView",contacts: orderedColumns,
                    parametersContacts: tableView.parametersContacts.map((item, i) =>
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
      await dispatch(createVariable({ variableData: { title: "tableView", type: "tableView", contacts: orderedColumns } }))
     fnTableView()
    }

   
  }
  const setWidthColumn = async (columnWidths) => {
    await dispatch(createVariable({ variableData: { title: "tableView", type: "tableView", contactsWidth: columnWidths } }))
    fnTableView()
  }

  useEffect(() => {
    if (tableView?.contacts?.length > 0 && tableView?.contacts?.length != contactsTableLength) {
      if (contactsTableLength !== 0) {
        if (tableView?.contacts?.length > contactsTableLength) dispatch(setFirstTimeContacts(true))
      } else dispatch(setFirstTimeContacts(false))
      dispatch(setContactsTableLength(tableView?.contacts?.length))
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
        await dispatch(
        getAllContacts({
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

    };


  useEffect(() => {
    dispatch(
      getAllContacts({
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

  }, [loading, user, limit, page, searchTerm, selectedOption]);


  useEffect(() => {
    setPage(0)
  }, [limit, searchTerm, selectedOption])


  useEffect(() => {
    if (contact?.contactData) {
      setContactData({
        contactName: contact.contactData.contactName || "",
        companyEmail: contact.contactData.companyEmail || "",
        companyPhoneNumber: contact.contactData.companyPhoneNumber || "",
        codeCountry: contact.contactData.codeCountry || "",
        webSite: contact.contactData.webSite || "",
        billingEmail: contact.email || "",
        contactZip: contact.contactData.contactZip || "",
        country: contact.contactData.country || "",
        contactCif: contact.contactData.contactCif || "",
        preferredCurrency: contact.contactData.preferredCurrency || "",
        cardNumber: contact.contactData.cardNumber || "",
        companyAddress: contact.contactData.companyAddress || "",
        tags: contact.contactData.tags || "",
        dni: contact.contactData.dni || "",
        taxNumber: contact.contactData.taxNumber || "",
        companyCity: contact.contactData.companyCity || "",
        companyProvince: contact.contactData.companyProvince || "",
        companyCountry: contact.contactData.companyCountry || "",
        infoBill: contact.contactData.infoBill || [],
        paymethod: contact.contactData.paymethod || [],
      });
    } else {
      setContactData({
        contactName: "",
        companyEmail: "",
        companyPhoneNumber: [],
        codeCountry: "",
        webSite: "",
        billingEmail: "",
        contactZip: "",
        country: "",
        contactCif: "",
        preferredCurrency: "",
        cardNumber: "",
        companyAddress: "",
        companyCity: "",
        companyProvince: "",
        companyCountry: "",
        infoBill: [],
        paymethod: [],
      });
    }
  }, [contact]);

  const selectContact = (rowIndex, contact) => {
    setContactSelected((prevItem) => {
      if (prevItem.includes(contact._id)) {
        return prevItem.filter((i) => i !== contact._id);
      } else {
        return [...prevItem, contact._id];
      }
    });
  };

  const [allAssetsInfo, setAllAssetsInfo] = useState([]);
  const selectAllContacts = () => {
    if (contactSelected.length === contacts.length) {
      setContactSelected([]);
      setSelectedIds(false);
      setAllAssetsInfo([]);
    } else {
      setSelectedIds(true);
      const allContactIndexes = contacts.map((contact) => contact._id); 
      setAllAssetsInfo(contacts);
      setContactSelected(allContactIndexes);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const toggleContactSelection = async (contactId) => {
    setSelectedContactIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleDeleteContact = (e, contactID) => {
    e.preventDefault();
    dispatch(
      deleteContacts({
        contactIds: contactID,
      })
    )
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setSelectedContactIds([]);
        } else {
          console.error("Error deleting contacts:", result.error);
        }
      })
      .catch((error) => {
        console.error("Unexpected error:", error);
      });
  };

  const handleActions = (e, rowIndex, contact) => {
    e.stopPropagation();
    dispatch(setContact(contact));
    setSelectedRowIndex(selectedRowIndex === rowIndex ? null : rowIndex);
  };

  const handleEditContact = () => {
    setShowNewContact(true);
    handleEditAll(false);
  };

  const handleGetOneContact = async (row) => {
    try {
      navigate(`/admin/docs/${row._id}`);
    } catch (error) {
      console.error("Error al obtener el contacte:", error);
    }
  };

  const handleCloseNewContact = () => {
    setIsAnimating(true);
    setTimeout(() => {
      dispatch(clearContact());
      setShowNewContact(false);
      setShowImportContacts(false);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showNewContact) {
        setIsAnimating(true);
        setTimeout(() => {
          dispatch(clearContact());
          setShowNewContact(false);
          setShowImportContacts(false);

          setIsAnimating(false);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNewContact]);

  const [inputsEditing, setInputsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    web: false,
    info: false,
    billingDetails: [],
  });

  const [newContactProp, setNewContact] = useState(false);

  const handleEditAll = (value) => {
    setInputsEditing((prevState) => {
      const updatedState = {};
      Object.keys(prevState).forEach((key) => {
        if (Array.isArray(prevState[key])) {
          updatedState[key] = prevState[key]; 
        } else {
          updatedState[key] = value;
        }
      });
      return updatedState;
    });
  };

  const searchInputRef = useRef(null);
  const dynamicTableRef = useRef(null);

  useFocusShortcut(searchInputRef, "k");

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const tableHeaders = [
    { label: t("name"), key: "contactName" },
    { label: t("mail"), key: "companyEmail" },
    { label: t("phone"), key: "companyPhoneNumber" },
    { label: t("physicalAddress"), key: "companyAddress" },
    { label: t("taxNumber"), key: "taxNumber" },
    { label: t("payMethod"), key: "cardNumber" },
    { label: t("preferredCurrency"), key: "preferredCurrency" },
    { label: t("from"), key: "createdAt" },
    { label: t("transactions"), key: "transactions" },
  ];

  const [showPopupNewContact,setShowPopupNewContact] = useState(false)
   const timerRef = useRef(null);
 const longPressTriggeredRef = useRef(false);

  const handleClick = (row) => {
    if(!(longPressTriggeredRef.current)){
    dispatch(setContact(row));
    dispatch(
      setPaginationSlice({ contactLimitSlice: limit, contactPageSlice: page })
    );
    setNewContact(false);
    setShowPopupNewContact(true)
    dispatch(setFatherNewContact("contacts"));
  }
  dispatch(markContactAsSeen({id:row._id}))
  };
  const handleDoubleClick = (row) => {
    dispatch(setContact(row));
    dispatch(
        setPaginationSlice({ contactLimitSlice: limit, contactPageSlice: page })
    );
    setShowPopupNewContact(false)
    setNewContact(false);
    dispatch(setFatherNewContact("contacts"));
    navigate(`/admin/contacts/${row._id}`,{ state: { backgroundLocation: location } });
  };



  useEffect(() => {
    dispatch(sliceSetNewContact(newContactProp));
  }, [newContactProp]);

  useEffect(() => {
    setShowNewBill(sliceShowNewBill);
  }, [sliceShowNewBill]);
  const popupButtonRef = useRef([]);


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
  const inputRef = useRef(null);

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };


  const [showSelectAgent, setShowSelectAgent] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(false)
  const [talkToAIContactInfo, setTalkToAIContactInfo] = useState(null)
  const talkToAi = () => {
    setShowSelectAgent(true)
  }

  useEffect(() => {
    if (selectedAgent?._id) {
      navigate(`/admin/chat/${selectedAgent._id}`, {
        state: {
          rowId: 'Necesito más información sobre el contacto @' + talkToAIContactInfo._id,
          selectedAgentState: selectedAgent,
        },
      });
    }
  }, [selectedAgent._id])





  const handleMouseDown = (index,row) => {
     longPressTriggeredRef.current = false;
    timerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      inputRef.current?.click()
      selectContact(index, row);
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
      onMouseDown={() => handleMouseDown(index,row)}
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
              name="contactSelected"
              onChange={() => { }}
              onClick={(e) => {
                e.stopPropagation(); 
              }}
              checked={contactSelected.includes(row._id) ? true : false}
            />
            <div className={styles.inputContainer} onClick={(e) => {
              e.stopPropagation();
              toggleContactSelection(row?._id)
              selectContact(index, row);
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
              onClick={(e) => handleActions(e, index, row)}
              className={styles.dotsOptions}
            >
              <img src={optionDots} />
            </div>
          </div>
        </div>
        {selectedRowIndex === index && (
          <div className={styles.optionsPopupContainer}>
            <OptionsPopup
              style={{
                position: "fixed",
                top:
                  popupButtonRef.current[index].getBoundingClientRect().top +
                  popupButtonRef.current[index].offsetHeight,
                left: popupButtonRef.current[index].getBoundingClientRect().left,
              }}
              close={() => {
                setSelectedRowIndex(null);
              }}
              options={[
                {
                  label: t("edit"),
                  onClick: () => {
                    handleEditContact();
                    setSelectedRowIndex(null);
                    setSelectedContact(row?.id);
                    setNewContact(true);

                  },
                },
                {
                  label: t("delete"),
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDeleteContact(e, row?._id);
                    setSelectedRowIndex(null);
                  },
                },
                {
                  label: (
                    <>
                      <StarPlus /> {t("askAi")}
                    </>
                  ),
                  askAi: true,
                  onClick: (e) => {
                    e.stopPropagation();
                    talkToAi()
                    setTalkToAIContactInfo(row)
                    setSelectedRowIndex(null);
                  },
                },
              ]}
            />
          </div>
        )}
      </td>
      {orderedColumns.filter(col => !col.hidden).map(({ key, createdAt }, index) => {
        const value = key === "paymethod"
          ? row.paymethod?.map((method, i) =>
            <span key={i}>{method.bank} - {method.accountNumber} ({method.currency})</span>
          )
          : key === "createdAt"
            ? row.createdAt ? formatAgoDate({ dateString: row.createdAt, t }) : ""
            : key === "companyPhoneNumber"
              ? `${row?.companyPhoneNumber?.[0]?.code || ""}${row?.companyPhoneNumber?.[0]?.number || ""}`
              : key === "contactName"
                ? <div className={styles.name}>
                  <img src={row.image || emptyImage} alt="" />
                  <div>
                    <span>{row?.contactName}</span>
                    <span>{row?.type}</span>
                  </div>
                </div>
                : key === "transactions"
                  ? <div className={styles.transacciones}>
                    <a
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(clearDoc());
                        dispatch(
                          setPaginationSlice({
                            contactLimitSlice: limit,
                            contactPageSlice: page,
                          })
                        );
                        handleGetOneContact(row);
                      }}
                    >
                      {t("see")}
                    </a>
                    <AmountTransaction
                      row={row}
                    />
                  </div>
                  : key.split(".").reduce((acc, part) => acc?.[part], row) || "";
        return <td key={key} style={{ background: recient(createdAt) && firstTimeContact ? "#e4fff9" : "transparent" }}>{value}</td>;
      })}
      
    </tr>
  );

  const [swiped, setSwiped] = useState(false);

  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [fileNameS3, setFileNameS3] = useState(null);



  const saveParameter = async(parameter) => {
        if(tableView?.parametersContacts?.length > 0 )  await dispatch(createVariable({variableData:{title:"tableView", type:"tableView", parametersContacts:[parameter,...tableView.parametersContacts ]}}))
          else await dispatch(createVariable({variableData:{title:"tableView", type:"tableView", parametersContacts:[parameter ]}}))
        await dispatch(getVariable({type:'tableView'}))
      }
  return (
    <>
      <div className={`${styles.containerMain} ${showPopupNewContact ? styles.sectionTableMore : ""}`}
       onClick={() => setShowSidebar(false)}>
        <div className={styles.container}>
          <ContactsHeader father={'contacts'}
            title={`${t("contactManagement")}${totalContacts ? ` (${totalContacts})` : ''}`}
            ref={searchInputRef}
            additionalInfo={
              <>
                {totalContacts > 20 && (

                  <PaginationTables
                    totalData={totalContacts}
                    limit={limit}
                    page={page}
                    setPage={setPage}
                    setLimit={setLimit}
                    father={"contact"}
                  />
                )}
              </>
            }
            buttons={[
              {
                label: (
                  <>
                    <img src={plusIcon} alt={t("buttonNewContact")} />
                    {t("buttonNewContact")}
                  </>
                ),
                onClick: () => {
                  handleEditAll(true);
                  setShowNewContact(true);
                  setNewContact(true);
                  dispatch(setContact(null));
                },
              },
           
              ...(contactSelected.length >= 1
                ? [
                  {
                    label: <>{t("delete")}</>,
                    headerStyle: { padding: "6px 10px" },
                    type: "white",
                    onClick: async () => {
                      try {
                        await dispatch(
                          deleteContacts({ contactsSelected: contactSelected })
                        ).unwrap(); 
                        setContactSelected([]);
                      } catch (error) {
                        console.error("Error eliminando assets:", error);
                      }
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
          {showImportContacts && (
            <ImportContactsAndProducts
              text={t("contacts")}
              state={handleCloseNewContact}
              isAnimating={isAnimating}
              quantity={
                contactSelected.length >= 1
                  ? allAssetsInfo.length
                  : contacts?.length
              }
              data={contactSelected.length >= 1 ? allAssetsInfo : contacts || []}
              selectedOption={selectedOption}
            />
          )}
          <div className={styles.sectionModal}>

            <div className={styles.sectionTable}>
              {contacts?.length == 0 || contacts == undefined ? (
                <SkeletonScreen
                  labelText={t("contactsNotFound")}
                  helperText={t("contactsListedHere")}
                  showInput={true}
                  enableLabelClick={false}
                />
              ) : (
                <DynamicTable
                  columns={tableHeaders}
                  ref={dynamicTableRef}
                  data={contacts || []}
                  renderRow={renderRow}
                  selectedIds={contactSelected}
                  onSelectAll={selectAllContacts}
                  onSelect={toggleSelection}
                  setOrderedTable={setOrderedTable}
                  fatherOrder={'contacts'}
                  orderedColumnsInitial={tableView?.contacts}
                  setWidthColumn={setWidthColumn}
                  fatherWidth={'contactsWidth'}
                  recient={recient}
                />
              )}

            </div>
          </div>

        </div>
    

            <div className={`${styles.popupContainer} ${showPopupNewContact ? styles.popupContainerVisible : ""}`} style={{height:"91vh"}}>
              <NewContact
                type='popup'
                customStyleOverlay={{width:"100%", height:"100%"}}
                customStyleNewContactContainer={{position:"relative", height:"100%"}}
                customStylePopupNewContaier={{  flexDirection: "column",alignItems: "center"}}
                customStyleContactinfo={{flexDirection: "column",alignItems: "center"}}
                customStyleColumnRightContactInfo={{alignItems: "center"}}
                customStyleModalTemplate={{height:"100%"}}
                customStyleModalTemplateHeader={{padding: "2px 5px 0px"}}
                customStyleLeftSide={{maxWidth: "96%", height:"min-content",width: "96%",  padding: "0px 20px"}}
                customStyleContentContainer={{padding:"0px", height:"99%",marginTop: "-15px",pointerEvents: "none"}}
                customStyleButtonContainer={{width:"100%"}}
                customStyleButtonHeader={{width: "100%",  margin: "10px"}}
                customStyleColumnDirection={{flexDirection:"column"}}
                customStyleNavigationPopupsContainer={{overflow: "visible", height:"100%"}}
                customStyleSectionContact={{display:"flex",flexDirection:"column",justifyContent: "start",alignItems: "start"}}

                fnContact={fn}
                setShowNewContact={setShowPopupNewContact}
                newContactProp={newContactProp}
                selectedContact={selectedContact}
                setShowNewBill={setShowNewBill}
                setShowPopupNewContact={setShowPopupNewContact}
                setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
              />
            </div>

        {showNewContact && (
          <>
            <NewContact
              setShowNewContact={setShowNewContact}
              newContactProp={newContactProp}
              selectedContact={selectedContact}
              setShowNewBill={setShowNewBill}
            />
          </>
        )}
        {showSelectAgent && (
          <SelectAgentModal
            setState={setShowSelectAgent}
          />
        )}
        {showNewBill && <NewBIll setShowNewBill={setShowNewBill} />}

        {showCreateParameterFromPopup && (
                  <CreateParameterPopup
                  saveParameter={saveParameter}
                    setShowCreateParameter={setShowCreateParameterFromPopup}
                    setState={setContactData}
                  />
                )}
      </div>
    </>
  );
  
};

export default Contacts;
