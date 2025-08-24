import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import { ReactComponent as Phone } from "../../assets/phoneIcon.svg";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import DeleteButton from "../DeleteButton/DeleteButton";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import { ParametersLabel } from "../ParametersLabel/ParametersLabel";
import styles from "./NewContact.module.css";
import { useTranslation } from "react-i18next";
import {
  createContact,
  deleteContacts,
  getContactImage,
  getOneContact,
  updateContact,
} from "../../../../actions/contacts";
import { createTable, createTableData, createVariable, getTableDataById, getTableDataFiltered, getTables, getVariable, refreshTableInfo } from "../../../../actions/user";
import {
  clearContact,
  setContact,
  setFatherNewContact,
} from "../../../../slices/contactsSlices";
import useCloseOnEsc from "../../../../utils/useClose";
import { ReactComponent as AddBlack } from "../../assets/addBlack.svg";
import { ReactComponent as BlackCheckboxIcon } from "../../assets/blackCheckboxIcon.svg";
import { ReactComponent as CheckCircleBlack } from "../../assets/checkCircleBlack.svg";
import { ReactComponent as Pencil } from "../../assets/pencilEdit.svg";
import EditableInput from "../../screens/Contacts/EditableInput/EditableInput";
import Button, { ButtonDiferentContentScreen } from "../Button/Button";
import CreateParameterPopup from "../CreateParameterPopup/CreateParameterPopup";
import DeleteChatAgents from "../DeleteChatAgents/DeleteChatAgents";
import FlagPhoneDropdown from "../FlagPhoneDropdown/FlagPhoneDropdown";
import DetailsBillInputs from "../InfoContact/DetailsBillInputs/DetailsBillInputs";
import NavigationPopups from "../NavigationPopups/NavigationPopups";
import NewTag from "../NewTag/NewTag";
import PayMethod from "../PayMethod/PayMethod";

const NewContact = ({
  setShowNewContact,
  showNewContact,
  newContactProp,
  setShowNewBill,
  setNewContact,
  columnsOrdered,
  type,
  customStyleOverlay,
  customStyleNewContactContainer,
  customStylePopupNewContaier,
  customStyleContactinfo,
  customStyleColumnRightContactInfo,
  customStyleModalTemplateHeader,
  customStyleLeftSide,
  customStyleContentContainer,
  customStyleButtonContainer,
  customStyleButtonHeader,
  customStyleColumnDirection,
  customStyleModalTemplate,
  customStyleNavigationPopupsContainer,
  customStyleSectionContact,
  isGlobalTables,
  createData, tableId, headers,
  setShowCreateParameterFromPopup,
  fnContact,
  setShowPopupNewContact,
  tableType
}) => {
  const [t] = useTranslation("Contacts");
  const [showCreateParameter, setShowCreateParameter] = useState(false)
  const [selectTypeContact, setSelectTypeContact] = useState(t("contacts"));
  const [isAnimating, setIsAnimating] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { contactId } = useParams();
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("")
  const {tableView} = useSelector(state => state.user)
  const parametersRef = useRef(null)
  const billingRef = useRef(null)
  const contactRef = useRef(null)

  


  const options = [
    "España, (+34)",
    "Estados Unidos, (+1)",
    "México, (+52)",
    "Argentina, (+54)",
    "Brasil, (+55)",
    "Reino Unido, (+44)",
    "Francia, (+33)",
    "Alemania, (+49)",
  ]






  const saveParameter = async(parameter) => {
    if(contactTableId || tableId){
      let id 
      contactTableId ? id = contactTableId : tableId ? id = tableId :""
if(tableView?.parametersTables?.[id]?.length > 0 )  await dispatch(createVariable({variableData:{category: "tableView", title:"tableView", type:"tableView", parametersTables:{...tableView.parametersTables, [id]:[parameter,...tableView.parametersTables[id] ]}}}))
        else await dispatch(createVariable({variableData:{category: "tableView", title:"tableView", type:"tableView", parametersTables:{...tableView.parametersTables,[id]:[parameter ]}}}))
      await dispatch(getVariable({type:'tableView'}))
    }else{
if(tableView?.parametersContacts?.length > 0 )  await dispatch(createVariable({variableData:{category: "tableView", title:"tableView", type:"tableView", parametersContacts:[parameter,...tableView.parametersContacts ]}}))
        else await dispatch(createVariable({variableData:{category: "tableView", title:"tableView", type:"tableView", parametersContacts:[parameter ]}}))
      await dispatch(getVariable({type:'tableView'}))
    }
      
    }





  useEffect(() => {
  if (showInput && inputRef.current) {
    inputRef.current.focus();
  }
}, [showInput]);
const { contact, fatherNewContact,fatherIdNewcontact, contactTableId } = useSelector((state) => state.contacts);


  // console.log('contactId', contactId)
  // console.log('contact', contact)
  // console.log('showNewContact', showNewContact)
  useEffect(() => {
    if (!showNewContact && contactId && !contact) {
      const fn = async () => {
        let response
         response = await dispatch(getOneContact({ clientId: contactId}));
        let row
              if(!response.payload){
                const res = await dispatch(getTables())
                  const tables = res?.payload?.tables
        
                   if (tables.length > 0) {
              for (let table of tables) {
                row =  await dispatch(getTableDataById({tableId:table._id, rowId:contactId}))
                 if (row.payload?.data?.length > 0) {
                  response = {payload:{...row.payload?.data[0]}}
                   break;
                   }
                 }
                }
              }

        console.log('response', response)
        setContactData({
          contactName: response.payload.contactName,
          companyEmail: response.payload.companyEmail,
          companyPhoneNumber: response.payload.companyPhoneNumber,
          codeCountry: response.payload.codeCountry,
          type: response.payload.type || "company",
          webSite: response.payload.webSite,
          selectedtags: response.payload.selectedtags,
          tags: response.payload.tags,
          billingEmail: response.payload.billingEmail,
          contactZip: response.payload.contactZip,
          country: response.payload.country,
          contactCif: response.payload.contactCif,
          preferredCurrency: response.payload.preferredCurrency,
          cardNumber: response.payload.cardNumber,
          dni: response.payload.dni,
          taxNumber: response.payload.taxNumber,
          companyAddress: response.payload.companyAddress,
          companyCity: response.payload.companyCity,
          companyProvince: response.payload.companyProvince,
          fileTitle: response.payload.fileTitle,
          companyCountry: response.payload.companyCountry,
          infoBill: response.payload.infoBill,
          paymethod: response.payload.paymethod,
          parameters: response.payload.parameters || [],
          totalDocs: response.totalDocs || 0,
          image: response.payload.image, 
          tableId: response.payload.tableId,
        });
        setTags(response.payload.tags || []);
        setSelectedTags(response.payload.selectedtags || []);
      };
      fn();
    }
  }, []);

  const goTo =
  fatherNewContact === "home"
    ? `/admin/home`
    : fatherNewContact === "contacts"
    ? `/admin/contacts`
    : fatherNewContact === "panel"
    ? null
    : fatherNewContact === "chat"
    ? `/admin/chat`
    : fatherNewContact === "chatId"
    ? `/admin/chat/${fatherIdNewcontact.agentId}/${fatherIdNewcontact.chatId}`
    : fatherNewContact === "agentId"
    ? `/admin/chat/${fatherIdNewcontact}`
    : fatherNewContact === "tables"
    ? `/admin/tables`
    : fatherNewContact !== null
    ? `/admin/${fatherNewContact}`
    : `/admin/tables`;

  useEffect(() => {

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showNewContact) {


        setIsAnimating(true);

        setTimeout(() => {
      navigate(goTo);
    }, 100);
    setTimeout(() => {
      setShowImportContacts(false);
      
        setShowNewContact && setShowNewContact(false);
        setNewContact && setNewContact(false);
        setShowNewContact && setShowNewContact(false);

      dispatch(setFatherNewContact(""));
      dispatch(clearContact());
      setIsAnimating(false);
    }, 300);




      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNewContact]);

  const {category,user} = useSelector(state => state.user)
  const [deleteCategory, setDeleteCategory] = useState(false)


  const [contactData, setContactData] = useState({
    contactName: "",
    companyEmail: "",
    companyPhoneNumber: [],
    codeCountry: "",
    webSite: "",
    billingEmail: "",
    contactZ: "",
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
    parameters: [],
    selectedtags: [],
    image: "",
  });
  const handleContactData = (field, value) => {
    const formattedValue =
      field === "cardNumber" ? formatCardNumber(value) : value;

    setContactData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  useEffect(() => {
    if (contact && contact._id) {
      const fetchImage = async () => {
        try {
          const response = await dispatch(
            getContactImage({ contactId: contact._id })
          );
          const image = response.payload.image;
          setContactData((prev) => ({
            ...prev,
            image: image,
          }));
        } catch (err) {
          console.error(
            `Error al cargar imagen del contacto ${contact._id}:`,
            err
          );
        }
      };

      fetchImage();
    }
  }, [contact]);
  useEffect(() => {
    if (contact) {
      setContactData({
        contactName: contact.contactName || "",
        companyEmail: contact.companyEmail || "",
        companyPhoneNumber: contact.companyPhoneNumber || "",
        codeCountry: contact.codeCountry || "",
        type: contact.type || "company",
        webSite: contact.webSite || "",
        billingEmail: contact.billingEmail || "",
        contactZip: contact.contactZip || "",
        country: contact.country || "",
        contactCif: contact.contactCif || "",
        preferredCurrency: contact.preferredCurrency || "",
        cardNumber: contact.cardNumber || "",
        dni: contact.dni || "",
        selectedtags: contact.selectedtags || [],
        tags: contact.tags || [],
        taxNumber: contact.taxNumber || "",
        companyAddress: contact.companyAddress || "",
        companyCity: contact.companyCity || "",
        companyProvince: contact.companyProvince || "",
        fileTitle: contact.fileTitle || "",
        companyCountry: contact.companyCountry || "",
        infoBill: contact.infoBill || [],
        paymethod: contact.paymethod || [],
        parameters: contact.parameters || [],
        totalDocs: contact.totalDocs || 0,
        image: "", 
      });
      setTags(contact.tags || []);
      setSelectedTags(contact.selectedtags || []);
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
        selectedtags: [],
        parameters: [],
        image: "", 
      });
    }
  }, [contact]); 

  const headerTable = [
    {
      label: "Nombre",
      key: "contactName",
       type:"contact"
    },
    {
      label: "Correo",
      key: "companyEmail",
       type:"email"
    },
    {
      label: "Teléfono",
      key: "companyPhoneNumber",
       type:"phone"
    },
    {
      label: "Dirección Física",
      key: "companyAddress",
       type:"location"
    },
    {
      label: "Número Fiscal",
      key: "taxNumber",
       type:"number"
    },
    {
      label: "Métodos de Pago",
      key: "cardNumber",
       type:"number"
    },
    {
      label: "Moneda Preferida",
      key: "preferredCurrency",
       type:"textBox"
    },
    {
      label: "Desde",
      key: "createdAt",
       type:"date"
    },
    {
      label: "transacciones",
      key: "transactions",
       type:"number"
    },
  ]


  const formatCardNumber = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleCreateContact = (e) => {
    e.preventDefault();
    if(isGlobalTables) {
      createData(tableId, headers,contactData,'contacts');
      setShowNewContact(false);
    }else{

      if (contact || contactId) {
        const id = contact?._id || contactId;
  
        dispatch(updateContact({ id, contactData }))
          .then((result) => {
            if (result.meta.requestStatus === "fulfilled") {


              setIsAnimating(true);

        setTimeout(() => {
      navigate(goTo);
    }, 100);
    setTimeout(() => {
      setShowImportContacts(false);
        setShowNewContact && setShowNewContact(false);
        setNewContact && setNewContact(false);
        setShowNewContact && setShowNewContact(false);

      dispatch(setFatherNewContact(""));
      dispatch(clearContact());
      setIsAnimating(false);
    }, 300);


  
            } else {
              console.error("Error actualizando el contacto:", result.error);
            }
          })
          .catch((error) => {
            console.error("Error inesperado:", error);
          });
      } else {
        const fn = async () => {
          let filteredTable
          const res = await dispatch(getTables())
          let tables = res?.payload?.tables
  
          let oldestContactTable = null;
          
          if(tables.length === 0){
            await dispatch(createTable({ headers: headerTable, name: "", type: "contacts" })); 
            const res = await dispatch(getTables())
             tables = res?.payload?.tables
          }
            
            for (let table of tables) {
              if (table.type === "contacts") {
                if (
                  !oldestContactTable ||
                  new Date(table.createdAt) < new Date(oldestContactTable.createdAt)
                ) {
                  oldestContactTable = table;
                  filteredTable = table
                }
              }
            }


            if(!filteredTable){
              await dispatch(createTable({ headers: headerTable, name: "", type: "contacts" })); 
            const res = await dispatch(getTables())
             tables = res?.payload?.tables

             for (let table of tables) {
              if (table.type === "contacts") {
                if (
                  !oldestContactTable ||
                  new Date(table.createdAt) < new Date(oldestContactTable.createdAt)
                ) {
                  oldestContactTable = table;
                  filteredTable = table
                }
              }
            }
            }



            await dispatch(  createTableData({ tableId: filteredTable._id, headers: filteredTable.headers, data: contactData, type:'contacts' })); 
            await dispatch(refreshTableInfo({ tableId: filteredTable._id }))
            await dispatch(getTableDataFiltered({tableId:filteredTable._id,}));

          
        }
        fn()


        setIsAnimating(true);

        setTimeout(() => {
      navigate(goTo);
    }, 100);
    setTimeout(() => {
      setShowImportContacts(false);
        setShowNewContact && setShowNewContact(false);
        setNewContact && setNewContact(false);
        setShowNewContact && setShowNewContact(false);
      dispatch(setFatherNewContact(""));
      dispatch(clearContact());
      setIsAnimating(false);
    }, 300);


      }
    }

  };

  const handleCloseNewContact = () => {


    setIsAnimating(true);

        setTimeout(() => {
      navigate(goTo);
    }, 100);
    setTimeout(() => {
      setShowImportContacts(false);
      
        setShowNewContact && setShowNewContact(false);
        setNewContact && setNewContact(false);
        setShowNewContact && setShowNewContact(false);

      dispatch(setFatherNewContact(""));
      dispatch(clearContact());
      setIsAnimating(false);
    }, 300);





  };


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {




        setIsAnimating(true);

        setTimeout(() => {
      navigate(goTo);
    }, 100);
    setTimeout(() => {
      setShowImportContacts(false);
        setShowNewContact && setShowNewContact(false);
        setNewContact && setNewContact(false);
        setShowNewContact && setShowNewContact(false);

      dispatch(setFatherNewContact(""));
      dispatch(clearContact());
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
    dni: false,
    taxNumber: false,
    billingDetails: [],
  });

  const [editingIndices, setEditingIndices] = useState([]);
  const handleAddBillingDetail = () => {
    setContactData((prevData) => ({
      ...prevData,
      infoBill: [
        ...prevData.infoBill,
        {
          address: "",
          population: "",
          province: "",
          zipCode: "",
          country: "",
          default: false,
          dni: "",
          taxNumber: "",
          id: Date.now(),
        },
      ],
    }));
  };
  const [selectedBillIndex, setSelectedBillIndex] = useState(null); 
  const [currentBill, setCurrentBill] = useState({
    address: "",
    population: "",
    province: "",
    zipCode: "",
    country: "",
    default: false,
    dni: "",
    taxNumber: "",
  });

  const handleDeleteBillingDetail = (id) => {
    setContactData((prev) => {
      const updatedInfoBill = prev.infoBill.filter((bill) => bill.id !== id); 
      return { ...prev, infoBill: updatedInfoBill };
    });

    if (selectedBillIndex === id) {
      setSelectedBillIndex(null);
      setInputsEditing((prev) => ({ ...prev, info: false }));
    }
  };

  const handleEditBillingDetail = (id) => {
    const selectedBill = contactData.infoBill.find((bill) => bill.id === id);

    if (selectedBill) {
      setSelectedBillIndex(id); 
      setCurrentBill({ ...selectedBill }); 
      setInputsEditing((prev) => ({ ...prev, info: true })); 
    } else {
      console.warn(`No se encontró infoBill con id: ${id}`);
    }
  };

  const handleBillingDetailChange = (field, value, index, id) => {
    setCurrentBill((prev) => {
      const updatedBill = { ...prev, [field]: value };

      if (field === "default" && value) {
        setContactData((prevData) => ({
          ...prevData,
          infoBill: prevData.infoBill.map((bill) =>
            bill.id === id
              ? { ...bill, default: true }
              : { ...bill, default: false }
          ),
        }));
      }

      return updatedBill;
    });
  };

  const handleSaveBillingDetail = () => {
  
    if (selectedBillIndex !== null) {
      setContactData((prev) => {
        const updatedInfoBill = prev.infoBill.map((bill) =>
          bill.id === selectedBillIndex ? { ...currentBill } : bill
        );
        return { ...prev, infoBill: updatedInfoBill };
      });
  
      setInputsEditing((prev) => ({ ...prev, info: false }));
      setSelectedBillIndex(null);
    }
  };
  
  
  const handleChangePhoneNumbers = (id, field, value) => {
    const updatedNumbers = [...contactData.companyPhoneNumber];

    if (field === "default") {
      if (value === true) {
        updatedNumbers.forEach((phone) => {
          phone.default = phone.id === id;
        });
      } else {
        const target = updatedNumbers.find((phone) => phone.id === id);
        if (target) target.default = false;
      }
    } else {
      const target = updatedNumbers.find((phone) => phone.id === id);
      if (target) target[field] = value;
    }

    handleContactData("companyPhoneNumber", updatedNumbers);
  };



  const addPhoneNumber = (e) => {
    e.stopPropagation()
    handleContactData("companyPhoneNumber", [
      ...contactData.companyPhoneNumber,
      { number: "" ,id: Date.now()}, 
    ]);
  };

  const removePhoneNumber = (index) => {
    const updatedNumbers = contactData.companyPhoneNumber.filter(
      (_, i) => i !== index
    );
    handleContactData("companyPhoneNumber", updatedNumbers);
  };
  const [currentPayMethod, setCurrentPayMethod] = useState({
    bank: "",
    accountNumber: "",
    swift: "",
    routingNumber: "",
    currency: "",
    default: false,
  });
  const [editingIndexPayMethod, setEditingIndexPayMethod] = useState(null);

  const addPayMethod = () => {
    setContactData((prevData) => ({
      ...prevData,
      paymethod: [...prevData.paymethod, { ...currentPayMethod }],
    }));
    setCurrentPayMethod({
      bank: "",
      accountNumber: "",
      swift: "",
      routingNumber: "",
      currency: "",
      default: false,
    });
  };
  const handlePayMethodChange = (field, value) => {
    setCurrentPayMethod((prev) => {
      const updatedPayMethod = { ...prev, [field]: value };

      if (field === "default" && value) {
        setContactData((prevData) => ({
          ...prevData,
          paymethod: prevData.paymethod.map((method) =>
            method === updatedPayMethod
              ? { ...method, default: true }
              : { ...method, default: false }
          ),
        }));
      }

      return updatedPayMethod;
    });
  };

  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "k");

  useCloseOnEsc(handleCloseNewContact);
  const handleDelete = async () => {
    await dispatch(deleteContacts({ contactsSelected: contact._id })).unwrap();
    handleCloseNewContact();
  };

  useEffect(() => {
    setContactData((prev) => ({
      ...prev,
      selectedtags: selectedTags,
      tags: tags,
    }));
  }, [selectedTags, tags]);

  useEffect(() => {
    if (!inputsEditing.phone) {
      const orderedPhones = [...contactData.companyPhoneNumber].sort(
        (a, b) => (b.default === true ? 1 : 0) - (a.default === true ? 1 : 0)
      );
      handleContactData("companyPhoneNumber", orderedPhones);
    }
  }, [inputsEditing.phone]);


    const [widthScreen, setWidthScreen] = useState(window.innerWidth - 200);

  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth > 768) setWidthScreen(window.innerWidth - 200);
     else if(window.innerWidth <= 768) setWidthScreen(window.innerWidth)};

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [copyClipboard,setCopyclipboard] = useState(false)
  const [editingFileTitle,setEditingFileTitle] = useState(false)
  const inputTitleFile = useRef(null)

  useEffect(() => {
    if (editingFileTitle && inputTitleFile.current) {
      inputTitleFile.current.focus();
    }
  }, [editingFileTitle]);


  const handleBtnsActions = (type) => {
    if (!contactData) return;

    const { companyPhoneNumber, webSite, companyEmail } = contactData;

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




      const [localCategory, setLocalCategory] = useState(false)

  const fnCategoryFind = async () => {
    const {payload} = await dispatch(getVariable({type:'category'}))
    if(payload?.data[0]?.contacts?.length > 0){}
    else{
      dispatch(
        createVariable({
          variableData: {
            title: "category",
            type: "category",
            contacts: [
              "other",
              "contact",
              "company",
              "worker",
              "client",
              "supplier",
            ],
          },
        })
      );
    }
  }
useEffect(() => {
  if(!localCategory) {
    fnCategoryFind()
   setLocalCategory(true)
  }
},[])


const handleCategory = () => {
  const fn = async () => {
    if(inputValue?.trim()){
   let {payload} = await dispatch(getVariable({type:'category'}))
   if(payload?.data[0]?.contacts?.length > 0){
    if(payload?.data[0]?.contacts?.find(cat => cat == inputValue)){
    let newCategory = payload?.data[0]?.contacts?.filter(cat => cat != inputValue)
    await dispatch(createVariable({variableData:{title:"category", type:"category", contacts:newCategory}}))
    } else{
    await dispatch(createVariable({variableData:{title:"category", type:"category", contacts:[...category.contacts, inputValue ]}}))
  }
  await dispatch(getVariable({type:'category'}))
   setContactData((prev) => ({...prev,type: inputValue,}));

  const scrollToEnd =(el) => {
    el.scrollLeft = el.scrollWidth; 
}

const contenedor = document.getElementById('typeContact');
scrollToEnd(contenedor);
    }
  }
   }


  fn()
  setInputValue(null)
  setShowInput(false);
  }


  const handleDeleteCategory = (category) => {
  const fn = async () => {
   let {payload} = await dispatch(getVariable({type:'category'}))
    if(payload?.data[0]?.contacts?.length > 0){
    let newCategory = payload?.data[0]?.contacts?.filter(cat => cat != category)
    await dispatch(createVariable({variableData:{title:"category", type:"category", contacts:newCategory}}))
    }
  await dispatch(getVariable({type:'category'}))
   }
  fn()
  }

  return (
    <div className={type !== "popup" && styles.overlay} style={customStyleOverlay}>
      <div className={type !== "popup" && styles.bg} onClick={() => {type !== "popup" && handleCloseNewContact()}}></div>
      <div className={ type !== "popup" && styles.newContactContainer} style={ customStyleNewContactContainer}>
        <ModalTemplate
          actionSave={handleCreateContact}
          onClick={handleCloseNewContact}
          typeTextHeader={t("new")}
          text={t("contact")}
          isAnimating={isAnimating}
          className={`${styles.newContactContainer} `}
          newContact={newContactProp}
          selectedContact={contact}
          reverseMobile={true}
          handleDelete={handleDelete}
          setShowNewBill={setShowNewBill}
          contact={true}
          setShowNewContact={setShowNewContact}
          type={type}
          customStyleModalTemplateHeader={customStyleModalTemplateHeader}
          customStyleContentContainer={customStyleContentContainer}
          customStyleButtonContainer={customStyleButtonContainer}
          customStyleButtonHeader={customStyleButtonHeader}
          customStyleModalTemplate={customStyleModalTemplate}
          contactId={contactId ? contactId: contact?._id}
          fnContact={fnContact}
          father={'contact'}
          setShowPopupNewContact={setShowPopupNewContact}
          tableId={tableId}
        >
          <div className={styles.popupNewContaier} style={customStylePopupNewContaier}>
            <div className={styles.leftSide} style={customStyleLeftSide}>
              <NavigationPopups
                type={"contact"}
                setParameters={setContactData}
                parameters={contactData.parameters}
                newContact={newContactProp}
                handleDelete={handleDelete}
                text={t("contact")}
                showCreateParameter={showCreateParameter}
                setShowCreateParameter={setShowCreateParameter}
                data={contactData}
                setData={setContactData}
                setImage={handleContactData}
                handleBtnsActions={handleBtnsActions}
                setShowAddTags={setShowAddTags}
                showAddTags={showAddTags}
                copyClipboard={copyClipboard}
                setSelectedTags={setSelectedTags}
                typeContainer={type}
                father={'contact'}
                customStyleNavigationPopupsContainer={customStyleNavigationPopupsContainer}
                parametersRef={parametersRef}
                billingRef={billingRef}
                contactRef={contactRef}
                contactId={contactId ? contactId: contact?._id}
                setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
                tableType={tableType}
                contactTableId={contactTableId ? contactTableId : contactData.tableId ? contactData.tableId : tableId}
                saveParameter={saveParameter}

              />
            </div>
            {/* {type !== "popup" &&  */}
            <div className={styles.containerNewContactForm} style={{width:type !== "popup" && `${widthScreen}px`,pointerEvents: "auto"}}>
              <form
                className={styles.newContactForm}
                id="scrollContainer"
              >

                {type !== "popup" &&
                <div className={styles.contactinfo} style={customStyleContactinfo}>
                 

                    
                  <div className={styles.columnRightContactInfo} style={customStyleColumnRightContactInfo}>
                    {/* <div className={styles.btnContactInfoContainer}>
                      <div className={styles.fileInfo}>
                        <input
                          type="text"
                          placeholder={t("fileTitle")}
                          value={contactData.fileTitle}
                          disabled={!editingFileTitle}
                          ref={inputTitleFile}
                          onBlur={() => handleBtnsActions("inputFileTitle")}
                          onChange={(e) => {
                            setContactData((prev) => ({
                              ...prev,
                              fileTitle: e.target.value,
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); 
                              handleBtnsActions("inputFileTitle");
                             
                            }
                          }}
                        />
                      </div>
                    
                    </div> */}
                 

                    <div id="typeContact" className={`${styles.typeContact}`}>
                      {category ? (
                        category?.contacts?.map((cat, index) => (
                          <React.Fragment key={cat}>
                            <button
                              className={`${styles.categoryButton} ${contactData.type == cat && styles.selected}`}
                              onClick={() => {
                                setContactData((prev) => ({
                                  ...prev,
                                  type: cat,
                                }));
                                if (cat === "other") {
                                  setShowInput(true); 
                                } else {
                                  setShowInput(false); 
                                }
                              }}
                              type="button"
                            >
                              {t(cat)}
                              {cat !== "other" && cat !== "contact" && cat !== "company" &&
                              cat !== "worker" && cat !== "client" && cat !== "supplier" &&
                              <div className={styles.deleteButtonContainer} >
                              <DeleteButton action={(e) => {
                                e.stopPropagation();
                                setDeleteCategory(cat)
                                }}/>
                              </div>}

                            </button>

                            {index === 0 && showInput && (
                              <input
                                value={inputValue}
                                ref={inputRef}
                                type="text"
                                onChange={(event) =>
                                  setInputValue(event.target.value)
                                }
                                placeholder="Nueva categoria"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleCategory();
                                  }
                                }}
                                onBlur={(e) => {
                                  handleCategory();
                                }}
                                style={{
                                  marginLeft: "8px",
                                  background: "white",
                                  width: "fit-content",
                                }}
                              />
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <>
                          <button
                            className={
                              contactData.type == "other" && styles.selected
                            }
                            type="button"
                          >
                            {t("other")}
                          </button>
                          <button
                            className={
                              contactData.type == "contact" && styles.selected
                            }
                            onClick={() =>
                              setContactData((prev) => ({
                                ...prev,
                                type: "contact",
                              }))
                            }
                            type="button"
                          >
                            {t("contact")}
                          </button>

                          <button
                            className={
                              contactData.type == "company" && styles.selected
                            }
                            onClick={() =>
                              setContactData((prev) => ({
                                ...prev,
                                type: "company",
                              }))
                            }
                            type="button"
                          >
                            {t("company")}
                          </button>
                          <button
                            className={
                              contactData.type == "worker" && styles.selected
                            }
                            onClick={() =>
                              setContactData((prev) => ({
                                ...prev,
                                type: "worker",
                              }))
                            }
                            type="button"
                          >
                            {t("worker")}
                          </button>
                          <button
                            className={
                              contactData.type == "client" && styles.selected
                            }
                            onClick={() =>
                              setContactData((prev) => ({
                                ...prev,
                                type: "client",
                              }))
                            }
                            type="button"
                          >
                            {t("client")}
                          </button>
                          <button
                            className={
                              contactData.type == "supplier" && styles.selected
                            }
                            onClick={() =>
                              setContactData((prev) => ({
                                ...prev,
                                type: "supplier",
                              }))
                            }
                            type="button"
                          >
                            {t("supplier")}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
                    }

                <div ref={contactRef} style={customStyleSectionContact} className={styles.sectionContact}>
                  {type === "popup" ? 
                  
                  <h5 id="contactIdentification">
                    {t("contactIdentification")}
                  </h5>
                  
                  :
                  
                  <h3 id="contactIdentification">
                    {t("contactIdentification")}
                  </h3>
                  }
                  
                  <div className={styles.infoLabelIdentification}>

                    {type !== "popup" &&
                    <EditableInput
                      label={t("fullName")}
                      nameInput={"nombre"}
                      placeholderInput={
                        contactData.contactName || t("enterAName")
                      }
                      isEditing={inputsEditing.name}
                      value={contactData.contactName}
                      onChange={(e) => {
                        handleContactData("contactName", e.target.value);
                      }}
                      onClick={() =>
                        setInputsEditing((prev) => ({
                          ...prev,
                          name: !prev.name,
                        }))
                      }
                      newFormat={true}
                    ></EditableInput>
                    }

                    <EditableInput
                      label={t("email")}
                      nameInput={"email"}
                      placeholderInput={
                        contactData.companyEmail || t("enterAMail")
                      }
                      isEditing={inputsEditing.email}
                      value={contactData.companyEmail}
                      onChange={(e) => {
                        handleContactData("companyEmail", e.target.value);
                      }}
                      onClick={() =>
                        setInputsEditing((prev) => ({
                          ...prev,
                          email: !prev.email,
                        }))
                      }
                      newFormat={true}
                      containerType={type}
                    />


                    {/* <label className={styles.phoneNumber}>
                <div className={styles.headerPhoneNumer}>
                  {" "}
                  <p>
                    <strong>{t('phone')}</strong>
                  </p>
                  <div className={styles.buttonPhoneContainer}>
                    <div
                      className={styles.button}
                      onClick={() =>
                        setInputsEditing((prev) => ({
                          ...prev,
                          phone: !prev.phone,
                        }))
                      }
                    >
                      {inputsEditing.phone ? t('save') : t('edit')}
                    </div>
                    <div className={styles.button} onClick={addPhoneNumber}>
                      {t('addPhoneNumber')}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    contactData.companyPhoneNumber.length >= 1
                      ? styles.phoneContainer
                      : styles.phoneContainerUnknown
                  }
                >
                  {contactData.companyPhoneNumber.length >= 1 ? (
                    contactData.companyPhoneNumber.map((phone, index) => (
                      <div key={index} className={styles.phoneRow}>
                        <FlagPhoneDropdown
                          options={
                            contactData?.companyPhoneNumber[index]
                              ?.companyPhoneNumber
                          }
                          setSelectedOptionProp={(option) => {
                            handleChangePhoneNumbers(
                              index,
                              "companyPhoneNumber",
                              option
                            );
                          }}
                          editing={inputsEditing.phone}
                        />

                        <input
                          type="text"
                          disabled={!inputsEditing.phone}
                          placeholder={t("phoneNumber")}
                          className={styles.inputEdit}
                          value={phone}
                          onChange={(e) =>
                            handleChangePhoneNumbers(
                              index,
                              "number",
                              e.target.value
                            )
                          }
                        />
                        <DeleteButton action={() => removePhoneNumber(index)} />
                      </div>
                    ))
                  ) : (
                    <div className={styles.unknown}>{t('unknow')}</div>
                  )}
                </div>
              </label> */}
                 {type === 'popup' ? 
                 <div
                      className={styles.phoneNumber}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <div className={styles.headerPhoneNumerPopup}>
                        {" "}
                        <div className={styles.headerPhoneNumerPopupLeft}>
                          <div className={styles.headerPhoneNumerPopupLeftFirstLine}>
                        <p>
                          <strong>{t("phone")}</strong>
                        </p>
                          </div>

                        <div className={styles.headerPhoneNumerPopupLeftSecondLine}>

                        <div className={styles.unknown}><p>{t("unknow")}</p></div>
                         <Pencil width={14} height={14} onClick={() =>
                              setInputsEditing((prev) => ({
                                ...prev,
                                phone: !prev.phone,
                              }))} />
                        </div>
                        </div>
                        <div className={styles.buttonPhoneContainer} >
                          <ButtonDiferentContentScreen
                            threshold={768}
                            smallContent={<AddBlack />}
                            largeContent={
                              <>
                               <p>
                          {t("addNumberPhone")}
                        </p>
                                
                              </>
                            }
                            buttonProps={{
                              type: "white",
                              action: (e) => addPhoneNumber(e),
                              headerStyle: { borderRadius: "999px", padding: "10px, 4px"},
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          contactData?.companyPhoneNumber?.length >= 1
                            ? styles.phoneContainer
                            : styles.phoneContainerUnknown
                        }
                      >
                        {contactData?.companyPhoneNumber?.length >= 1 ? (
                          contactData.companyPhoneNumber.map((phone, index) => (
                            <>
                              <div key={index} className={styles.phoneRow}>

                                <CustomDropdown
                                typeContent={type}
                                generalStyleFilterSort={{padding: "3px 0px 3px 0px",
                                  margin:"0px",height:"max-content",minWidth: "115px", color:"#717171", gap:"3px"}}   
                                      editable={inputsEditing.phone}
                                      setSelectedOption={(option) => {
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "code",
                                      option
                                    );
                                  }}
                                      customStyles={styles.FlagsDropdown}
                                      editing={inputsEditing.phone}
                                      options={options}
                                      selectedOption={contactData?.companyPhoneNumber[index]?.code || t("selectCountry")}
                                    />
                                  
                                <input
                                  type="number"
                                  disabled={!inputsEditing.phone}
                                  placeholder={"000 000 000"}
                                  className={styles.inputPhonePopup}
                                  style={{padding:"3px 1px", margin:"0px",}}
                                  value={phone.number || ""}
                                  onChange={(e) =>
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "number",
                                      e.target.value
                                    )
                                  }
                                />
                                <DeleteButton type={"grey"}
                                  action={() => removePhoneNumber(index)}
                                />
                              </div>
                              <div
                                className={styles.defaultPhoneNumber}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <input
                                  type="checkbox"
                                  disabled={!inputsEditing.phone}
                                  checked={phone.default || false}
                                  onChange={(e) =>
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "default",
                                      e.target.checked
                                    )
                                  }
                                />
                                <span style={{ fontSize:"12px"}}>
                               {t("defaultPhoneNumber")}
                               </span>
                              </div>
                            </>
                          ))
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                 
                 : 
                 <div

                      className={styles.phoneNumber}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <div className={styles.headerPhoneNumer} style={customStyleColumnDirection}>
                        {" "}
                        <p>
                          <strong>{t("phone")}</strong>
                        </p>
                        <div className={styles.buttonPhoneContainer} style={customStyleColumnDirection}>
                          <ButtonDiferentContentScreen
                            threshold={768}
                            smallContent={<AddBlack />}
                            largeContent={
                              <>
                                <AddBlack />
                                {t("addNumberPhone")}
                              </>
                            }
                            buttonProps={{
                              type: "white",
                              action: (e) => addPhoneNumber(e),
                              headerStyle: { borderRadius: "999px" },
                            }}
                          />

                         
                          <Button
                            className={styles.button}
                            action={() =>
                              setInputsEditing((prev) => ({
                                ...prev,
                                phone: !prev.phone,
                              }))
                            }
                          >
                            {inputsEditing.phone ? t("save") : t("edit")}
                          </Button>
                        </div>
                      </div>
                      <div
                        className={
                          contactData?.companyPhoneNumber?.length >= 1
                            ? styles.phoneContainer
                            : styles.phoneContainerUnknown
                        }
                      >
                        {contactData?.companyPhoneNumber?.length >= 1 ? (
                          contactData.companyPhoneNumber.map((phone, index) => (
                            <>
                              <div key={index} className={styles.phoneRow}>
                                <FlagPhoneDropdown
                                  options={phone.code} 
                                  setSelectedOptionProp={(option) => {
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "code",
                                      option
                                    );
                                  }}
                                  editing={inputsEditing.phone}
                                />
                                <a
                                  href={`tel:${phone.code || ""}${phone.number || ""}`}
                                  style={{ cursor: "pointer" }}
                                >
                                  <Phone />
                                </a>
                                <input
                                  type="number"
                                  disabled={!inputsEditing.phone}
                                  placeholder={t("phoneNumber")}
                                  className={styles.inputEdit}
                                  value={phone.number || ""} 
                                  onChange={(e) =>
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "number",
                                      e.target.value
                                    )
                                  }
                                />
                                <DeleteButton
                                  action={() => removePhoneNumber(index)}
                                />
                              </div>
                              <div
                                className={styles.defaultPhoneNumber}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <input
                                  type="checkbox"
                                  disabled={!inputsEditing.phone}
                                  checked={phone.default || false}
                                  onChange={(e) =>
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "default",
                                      e.target.checked
                                    )
                                  }
                                />
                                {t("defaultPhoneNumber")}
                              </div>
                            </>
                          ))
                        ) : (
                          <div className={styles.unknown}>{t("unknow")}</div>
                        )}
                      </div>
                    </div>}  
                  {/* <div
                      className={styles.phoneNumber}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <div className={styles.headerPhoneNumer} style={customStyleColumnDirection}>
                        {" "}
                        <p>
                          <strong>{t("phone")}</strong>
                        </p>
                        <div className={styles.buttonPhoneContainer} style={customStyleColumnDirection}>
                          <ButtonDiferentContentScreen
                            threshold={768}
                            smallContent={<AddBlack />}
                            largeContent={
                              <>
                                <AddBlack />
                                {t("addNumberPhone")}
                              </>
                            }
                            buttonProps={{
                              type: "white",
                              action: (e) => addPhoneNumber(e),
                              headerStyle: { borderRadius: "999px" },
                            }}
                          />

                          <Button
                            className={styles.button}
                            action={() =>
                              setInputsEditing((prev) => ({
                                ...prev,
                                phone: !prev.phone,
                              }))
                            }
                          >
                            {inputsEditing.phone ? t("save") : t("edit")}
                          
                          </Button>
                        </div>
                      </div>
                      <div
                        className={
                          contactData?.companyPhoneNumber?.length >= 1
                            ? styles.phoneContainer
                            : styles.phoneContainerUnknown
                        }
                      >
                        {contactData?.companyPhoneNumber?.length >= 1 ? (
                          contactData.companyPhoneNumber.map((phone, index) => (
                            <>
                              <div key={index} className={styles.phoneRow}>
                                <FlagPhoneDropdown
                                  options={phone.code} 
                                  setSelectedOptionProp={(option) => {
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "code",
                                      option
                                    );
                                  }}
                                  editing={inputsEditing.phone}
                                />
                                <a
                                  href={`tel:${phone.code || ""}${phone.number || ""}`}
                                  style={{ cursor: "pointer" }}
                                >
                                  <Phone />
                                </a>
                                <input
                                  type="number"
                                  disabled={!inputsEditing.phone}
                                  placeholder={t("phoneNumber")}
                                  className={styles.inputEdit}
                                  value={phone.number || ""} 
                                  onChange={(e) =>
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "number",
                                      e.target.value
                                    )
                                  }
                                />
                                <DeleteButton
                                  action={() => removePhoneNumber(index)}
                                />
                              </div>
                              <div
                                className={styles.defaultPhoneNumber}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <input
                                  type="checkbox"
                                  disabled={!inputsEditing.phone}
                                  checked={phone.default || false}
                                  onChange={(e) =>
                                    handleChangePhoneNumbers(
                                      phone.id,
                                      "default",
                                      e.target.checked
                                    )
                                  }
                                />
                                {t("defaultPhoneNumber")}
                              </div>
                            </>
                          ))
                        ) : (
                          <div className={styles.unknown}>{t("unknow")}</div>
                        )}
                      </div>
                    </div> */}

                    <EditableInput
                      label={t("corporativeWebsite")}
                      nameInput={"web"}
                      placeholderInput={
                        contactData.webSite || t("enterACorporativeWebsite")
                      }
                      isEditing={inputsEditing.web}
                      value={contactData.webSite}
                      onChange={(e) => {
                        handleContactData("webSite", e.target.value);
                      }}
                      onClick={() =>
                        setInputsEditing((prev) => ({
                          ...prev,
                          web: !prev.web,
                        }))
                      }
                      newFormat={true}
                      containerType={type}
                    />

                    <EditableInput
                      label={t("identityDocument")}
                      nameInput={"DNI"}
                      placeholderInput={
                        contactData.dni || t("enterAIdentityDocument")
                      }
                      isEditing={inputsEditing.dni}
                      value={contactData.dni}
                      onChange={(e) => {
                        handleContactData("dni", e.target.value);
                      }}
                      onClick={() =>
                        setInputsEditing((prev) => ({
                          ...prev,
                          dni: !prev.dni,
                        }))
                      }
                      newFormat={true}
                      containerType={type}
                    />

                    <EditableInput
                      label={t("taxNumber")}
                      nameInput={"taxNumber"}
                      placeholderInput={contactData.taxNumber || t("enterACif")}
                      isEditing={inputsEditing.taxNumber}
                      value={contactData.taxNumber}
                      onChange={(e) => {
                        handleContactData("taxNumber", e.target.value);
                      }}
                      onClick={() =>
                        setInputsEditing((prev) => ({
                          ...prev,
                          taxNumber: !prev.taxNumber,
                        }))
                      }
                      newFormat={true}
                      containerType={type}
                    />
                  </div>
                </div>
                  {type === 'popup' ? 
                  
                   <div ref={billingRef} style={customStyleSectionContact} className={styles.sectionContactPopup}>
                  <h5 id="billingDetails">{t("billingDetails")}</h5>
                  <div className={styles.infoLabel}>
                    <div>
                      <div className={styles.detailsBill} style={{marginBottom:"5px"}} >
                        <p>
                          <strong>{t("address")}</strong>
                        </p>
                        <div className={styles.optionsDetailsBill} style={customStyleColumnDirection}>
                          <ButtonDiferentContentScreen
                            threshold={768}
                            smallContent={<AddBlack />}
                            largeContent={
                              <>
                                <AddBlack />
                                {t("addAddress")}
                              </>
                            }
                            buttonProps={{
                              type: "white",
                              action: (e) => handleAddBillingDetail(e),
                              headerStyle: { borderRadius: "999px", fontSize: "12px", padding: "0px, 0px" },
                            }}
                          />

                        </div>
                      </div>
                         
                      <div className={styles.infoBill}>
                        {contactData?.infoBill?.length > 0 ? (
                          [...contactData.infoBill]
                            .sort(
                              (a, b) =>
                                (b.default === true) - (a.default === true)
                            )
                            .map((bill, index) => (
                              <div className={styles.billingDetailsContainer}>
                                {" "}
                                <div
                                  key={index}
                                  className={styles.infoBillContainer}
                                  style={{ flexDirection: "row" }}
                                >
                                  <div className={styles.info}>
                                    <p>
                                      <CheckCircleBlack/>
                                      {" "}
                                      {bill.default && <BlackCheckboxIcon />}
                                       {/* {bill.default && <CheckCircleBlack />} */}
                                      <span>
                                        {" "}
                                        {bill.address || t("address")},
                                      </span>
                                      <span>
                                        {" "}
                                        {bill.population || t("population")},
                                      </span>
                                      <span>
                                        {" "}
                                        {bill.zipCode || t("initialsZipCode")}
                                      </span>
                                    </p>

                                  </div>
                                  <div
                                    onClick={() => {
                                      selectedBillIndex === bill.id
                                        ? handleSaveBillingDetail()
                                        : handleEditBillingDetail(bill.id);
                                    }}
                                    className={styles.editPencilContainer}
                                  >
                                    <Pencil />
                                  </div>
                                  <DeleteButton type="grey"
                                    action={() =>
                                      handleDeleteBillingDetail(currentBill.id)
                                    }
                                  />
                                </div>
                                <div style={{ display: "flex", justifyContent: "end" }}>
                                 <Button headerStyle={{fontSize:"12px"}} type="green" action={handleSaveBillingDetail}>
                            {t("save")}
                          </Button>
                                </div>
                                {selectedBillIndex === bill.id && (
                                  <>
                                    <DetailsBillInputs
                                    compressed={true}
                                    typeContainer={type}
                                      address={currentBill.address || ""}
                                      population={currentBill.population || ""}
                                      province={currentBill.province || ""}
                                      zipCode={currentBill.zipCode || ""}
                                      country={currentBill.country || ""}
                                      defaultInput={currentBill.default}
                                      selectedBillIndex={index}
                                      selectedBillId={currentBill.id}
                                      handleChange={(key, value) =>
                                        handleBillingDetailChange(
                                          key,
                                          value,
                                          index,
                                          currentBill.id
                                        )
                                      }
                                      showCheckbox={true}
                                    />
                                <div style={{ display: "flex", justifyContent: "end"}}
                                className={styles.defaultPhoneNumber}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <input
                                  type="checkbox"
                                  onChange={(e) =>
                                    console.log("Checkbox clicked")
                                  }
                                />
                                <p style={{margin:"0px"}}>

                                {t("defaultAddress")}
                                </p>
                              </div>
                                  </>
                                )}
                              </div>

                            ))
                        ) : (
                          <span>{t("noBillingDetails")}</span>
                        )}
                      </div>
                           <div style={{ display: "flex", justifyContent: "end", marginTop:"15px"}}>
                                 <Button headerStyle={{fontSize:"12px"}} type="green" action={handleSaveBillingDetail}>
                            {t("save")}
                          </Button>
                                </div>
                    </div>

                    <div>
                      <div className={styles.payMethodInfoBill}>
                        <div className={styles.detailsBill} >
                          <p>{t("payMethod")}</p>
                          <div className={styles.optionsDetailsBill}>
                            <ButtonDiferentContentScreen
                              threshold={768}
                              smallContent={<AddBlack />}
                              largeContent={
                                <>
                                  <AddBlack />
                                  {t("addPayMethod")}
                                </>
                              }
                              buttonProps={{
                                type: "white",
                                action: (e) => addPayMethod(e),
                                 headerStyle: { borderRadius: "999px", fontSize: "12px", padding: "0px, 0px" },
                              }}
                            />
                            {/* <Button
                              action={() => {
                                setContactData((prev) => {
                                  const updatedPayMethods = [...prev.paymethod];
                                  if (editingIndexPayMethod !== null) {
                                    updatedPayMethods[editingIndexPayMethod] =
                                      currentPayMethod;
                                  }
                                  return {
                                    ...prev,
                                    paymethod: updatedPayMethods,
                                  };
                                });
                                setEditingIndexPayMethod(null); 
                                setCurrentPayMethod({
                                  bank: "",
                                  accountNumber: "",
                                  swift: "",
                                  routingNumber: "",
                                  currency: "",
                                  default: false,
                                });
                              }}
                            >
                              {t("save")}
                            </Button> */}
                          </div>
                        </div>

                        {Array.isArray(contactData.paymethod) &&
                          [...contactData.paymethod]
                            .sort(
                              (a, b) =>
                                (b.default === true) - (a.default === true)
                            )
                            .map((method, index) => (
                              <div
                                key={index}
                                className={styles.infoBillContainer}
                              >
                                <div className={styles.info}>
                                  <p className={styles.infoPayMethod} style={{width:"150px",overflow:"hidden", textOverflow:"ellipsis"}}>
                                    {method.default && <div> <BlackCheckboxIcon /></div>}
                                     <div>
                                    {index == 0 &&  <BlackCheckboxIcon />}
                                     </div>
                                    <span>{method.bank || t("bank")}, </span>
                                    <span style={{ whiteSpace: "nowrap"}}>
                                      {method.accountNumber ||
                                        t("accountNumber")}
                                      ,{" "}
                                    </span>
                                    <span>
                                      {" "}
                                      {method.swift || t("swiftBic")},{" "}
                                    </span>
                                    <span>
                                      {method.routingNumber ||
                                        t("routingNumber")}
                                      ,{" "}
                                    </span>
                                    <span>
                                      {" "}
                                      {method.currency || t("currency")}
                                    </span>
                                  </p>
                                  <div
                                    onClick={() => {
                                      if (editingIndexPayMethod === index) {
                                        setContactData((prev) => {
                                          const updatedPayMethods = [
                                            ...prev.paymethod,
                                          ];
                                          updatedPayMethods[
                                            editingIndexPayMethod
                                          ] = currentPayMethod;
                                          return {
                                            ...prev,
                                            paymethod: updatedPayMethods,
                                          };
                                        });

                                        setEditingIndexPayMethod(null); 
                                        setCurrentPayMethod({
                                          bank: "",
                                          accountNumber: "",
                                          swift: "",
                                          routingNumber: "",
                                          currency: "",
                                          default: false,
                                        });
                                      } else {
                                        setCurrentPayMethod(method);
                                        setEditingIndexPayMethod(index);
                                      }
                                    }}
                                    className={styles.editPencilContainer}
                                  >
                                    <Pencil />
                                  </div>
                                  <DeleteButton />
                                </div>
                               
                                {editingIndexPayMethod == index && (
                                  <PayMethod
                                    containerType={type}
                                    method={currentPayMethod}
                                    onChange={handlePayMethodChange}
                                  />
                                )}
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
                  
                  
                  :
                  
                    <div ref={billingRef} style={customStyleSectionContact} className={styles.sectionContact}>
                  <h3 id="billingDetails">{t("billingDetails")}</h3>
                  <div className={styles.infoLabel}>
                    <div>
                      <div className={styles.detailsBill} style={customStyleColumnDirection}>
                        <p>
                          <strong>{t("address")}</strong>
                        </p>
                        <div className={styles.optionsDetailsBill} style={customStyleColumnDirection}>
                          <ButtonDiferentContentScreen
                            threshold={768}
                            smallContent={<AddBlack />}
                            largeContent={
                              <>
                                <AddBlack />
                                {t("addAddress")}
                              </>
                            }
                            buttonProps={{
                              type: "white",
                              action: (e) => handleAddBillingDetail(e),
                              headerStyle: { borderRadius: "999px" },
                            }}
                          />

                          <Button type="green" action={handleSaveBillingDetail}>
                            {t("save")}
                          </Button>
                        </div>
                      </div>
                      <div className={styles.infoBill}>
                        {contactData?.infoBill?.length > 0 ? (
                          [...contactData.infoBill]
                            .sort(
                              (a, b) =>
                                (b.default === true) - (a.default === true)
                            )
                            .map((bill, index) => (
                              <div className={styles.billingDetailsContainer}>
                                {" "}
                                <div
                                  key={index}
                                  className={styles.infoBillContainer}
                                  style={{ flexDirection: "row" }}
                                >
                                  <div className={styles.info}>
                                    <p>
                                      {" "}
                                      {bill.default && <BlackCheckboxIcon />}
                                      <span>
                                        {" "}
                                        {bill.address || t("address")},
                                      </span>
                                      <span>
                                        {" "}
                                        {bill.population || t("population")},
                                      </span>
                                      <span>
                                        {" "}
                                        {bill.province || t("province")},
                                      </span>
                                      <span>
                                        {" "}
                                        {bill.zipCode || t("zipCode")},
                                      </span>
                                      <span>
                                        {" "}
                                        {bill.country || t("country")}
                                      </span>
                                    </p>

                                   
                                  </div>
                                  <div
                                    onClick={() => {
                                      selectedBillIndex === bill.id
                                        ? handleSaveBillingDetail()
                                        : handleEditBillingDetail(bill.id);
                                    }}
                                    className={styles.editPencilContainer}
                                  >
                                    <Pencil />
                                  </div>
                                  <DeleteButton
                                    action={() =>
                                      handleDeleteBillingDetail(currentBill.id)
                                    }
                                  />
                                </div>
                                {selectedBillIndex === bill.id && (
                                  <>
                                    <DetailsBillInputs
                                    type="bill"
                                      address={currentBill.address || ""}
                                      population={currentBill.population || ""}
                                      province={currentBill.province || ""}
                                      zipCode={currentBill.zipCode || ""}
                                      country={currentBill.country || ""}
                                      defaultInput={currentBill.default}
                                      selectedBillIndex={index}
                                      selectedBillId={currentBill.id}
                                      handleChange={(key, value) =>
                                        handleBillingDetailChange(
                                          key,
                                          value,
                                          index,
                                          currentBill.id
                                        )
                                      }
                                      showCheckbox={true}
                                    />
                                  </>
                                )}
                              </div>
                            ))
                        ) : (
                          <span>{t("noBillingDetails")}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className={styles.payMethodInfoBill}>
                        <div className={styles.detailsBill} style={customStyleColumnDirection}>
                          <p>{t("payMethod")}</p>
                          <div className={styles.optionsDetailsBill} style={customStyleColumnDirection}>
                            <ButtonDiferentContentScreen
                              threshold={768}
                              smallContent={<AddBlack />}
                              largeContent={
                                <>
                                  <AddBlack />
                                  {t("addPayMethod")}
                                </>
                              }
                              buttonProps={{
                                type: "white",
                                action: (e) => addPayMethod(e),
                                headerStyle: { borderRadius: "999px" },
                              }}
                            />
                            <Button
                              action={() => {
                                setContactData((prev) => {
                                  const updatedPayMethods = [...prev.paymethod];
                                  if (editingIndexPayMethod !== null) {
                                    updatedPayMethods[editingIndexPayMethod] =
                                      currentPayMethod;
                                  }
                                  return {
                                    ...prev,
                                    paymethod: updatedPayMethods,
                                  };
                                });
                                setEditingIndexPayMethod(null); 
                                setCurrentPayMethod({
                                  bank: "",
                                  accountNumber: "",
                                  swift: "",
                                  routingNumber: "",
                                  currency: "",
                                  default: false,
                                });
                              }}
                            >
                              {t("save")}
                            </Button>
                          </div>
                        </div>

                        {Array.isArray(contactData.paymethod) &&
                          [...contactData.paymethod]
                            .sort(
                              (a, b) =>
                                (b.default === true) - (a.default === true)
                            )
                            .map((method, index) => (
                              <div
                                key={index}
                                className={styles.infoBillContainer}
                              >
                                <div className={styles.info}>
                                  <p className={styles.infoPayMethod}>
                                    {method.default && <BlackCheckboxIcon />}

                                    <span>{method.bank || t("bank")}, </span>
                                    <span>
                                      {method.accountNumber ||
                                        t("accountNumber")}
                                      ,{" "}
                                    </span>
                                    <span>
                                      {" "}
                                      {method.swift || t("swiftBic")},{" "}
                                    </span>
                                    <span>
                                      {method.routingNumber ||
                                        t("routingNumber")}
                                      ,{" "}
                                    </span>
                                    <span>
                                      {" "}
                                      {method.currency || t("currency")}
                                    </span>
                                  </p>
                                  <div
                                    onClick={() => {
                                      if (editingIndexPayMethod === index) {
                                        setContactData((prev) => {
                                          const updatedPayMethods = [
                                            ...prev.paymethod,
                                          ];
                                          updatedPayMethods[
                                            editingIndexPayMethod
                                          ] = currentPayMethod;
                                          return {
                                            ...prev,
                                            paymethod: updatedPayMethods,
                                          };
                                        });

                                        setEditingIndexPayMethod(null); 
                                        setCurrentPayMethod({
                                          bank: "",
                                          accountNumber: "",
                                          swift: "",
                                          routingNumber: "",
                                          currency: "",
                                          default: false,
                                        });
                                      } else {
                                        setCurrentPayMethod(method);
                                        setEditingIndexPayMethod(index);
                                      }
                                    }}
                                    className={styles.editPencilContainer}
                                  >
                                    <Pencil />
                                  </div>
                                  <DeleteButton />
                                </div>
                               
                                {editingIndexPayMethod == index && (
                                  <PayMethod
                                    method={currentPayMethod}
                                    onChange={handlePayMethodChange}
                                  />
                                )}
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
                  
                  }
              
                  <div ref={parametersRef}>
                <ParametersLabel
                  parameters={contactData.parameters}
                  setContactDataInputs={setContactData}
                  editingIndices={editingIndices}
                  setEditingIndices={setEditingIndices}
                  showCreateParameter={showCreateParameter}
                  setShowCreateParameter={setShowCreateParameter}
                  customStyleColumnDirection={customStyleColumnDirection}
                />
                </div>
              </form>
            </div>
            {/* } */}
          </div>
        </ModalTemplate>

        {deleteCategory &&
         <DeleteChatAgents
          user={user}
          setDeleteChats={setDeleteCategory}
          handleDeleteCategory={handleDeleteCategory}
          deleteCategory={deleteCategory}
          type={'newContact'}
           /> }

        {showAddTags && (
          <NewTag
            setShowNewTagModal={setShowAddTags}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            setTags={setTags}
            tags={tags}
          />
        )}

        {showCreateParameter && (
          <CreateParameterPopup
          saveParameter={saveParameter}
            setShowCreateParameter={setShowCreateParameter}
            setState={setContactData}
          />
        )}
      </div>
     </div>
  );
};

export default NewContact;
