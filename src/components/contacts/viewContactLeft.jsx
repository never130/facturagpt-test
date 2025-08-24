import React, {useEffect, useRef, useState} from 'react';
import styles from "../../views/Dashboard/screens/Contacts/Contacts.module.css";
import stylesView from "../../views/Dashboard/components/NewContact/NewContact.module.css";
import NavigationPopups from "../../views/Dashboard/components/NavigationPopups/NavigationPopups";
import {useTranslation} from "react-i18next";
import ProfileModalTemplate from "../../views/Dashboard/components/ProfileModalTemplate/ProfileModalTemplate";
import Button, {ButtonDiferentContentScreen} from "../../views/Dashboard/components/Button/Button";
import DeleteButton from "../../views/Dashboard/components/DeleteButton/DeleteButton";
import EditableInput from "../../views/Dashboard/screens/Contacts/EditableInput/EditableInput";
import FlagPhoneDropdown from "../../views/Dashboard/components/FlagPhoneDropdown/FlagPhoneDropdown";
import DetailsBillInputs from "../../views/Dashboard/components/InfoContact/DetailsBillInputs/DetailsBillInputs";
import PayMethod from "../../views/Dashboard/components/PayMethod/PayMethod";
import {ParametersLabel} from "../../views/Dashboard/components/ParametersLabel/ParametersLabel";
import { ReactComponent as FileIcon } from "../../views/Dashboard/assets/fileIcon.svg"
import { ReactComponent as AddBlack } from "../../views/Dashboard/assets/addBlack.svg";
import { ReactComponent as BlackCheckboxIcon} from "../../views/Dashboard/assets/blackCheckboxIcon.svg";
import {useDispatch, useSelector} from "react-redux";
import {createContact, deleteContacts, getContactImage, getOneContact, updateContact} from "../../actions/contacts";
import {clearContact, setContact, setFatherNewContact} from "../../slices/contactsSlices";
import {CameraIcon} from "lucide-react";
import emptyImage from "../../views/Dashboard/assets/ImageEmpty.svg";
import EditableLabel from "./comboBoxLabelStatic";
import SymbolDesign from "./SymbolDesign";
import LabelActions from "./LabelActions";
import ContactIdentification from "./infoContact";
import BillingDetails from "./billingDetails";
import useFocusShortcut from "../../utils/useFocusShortcut";
import useCloseOnEsc from "../../utils/useClose";
import {createVariable, getVariable} from "../../actions/user";


const optionsType = [
    "company",
    "worker",
    "client",
    "supplier",
    "contact",
    "other"
]

const ViewContactLeft = (
    {
        setContactData,
        contactData,
        newContactProp,
        setShowNewContact,
        showNewContact
    }) => {
    const dispatch = useDispatch()
    const { t } = useTranslation(["Contacts","InfoContact"]);
    const {category,user} = useSelector(state => state.user);
    const { contact, fatherNewContact,fatherIdNewcontact } = useSelector((state) => state.contacts);
    const contactId = contact?._id;
    const searchInputRef = useRef(null);

    const [deleteCategory, setDeleteCategory] = useState(false)
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
    const [selectedBillIndex, setSelectedBillIndex] = useState(null);
    const inputTitleFile = useRef(null);
    const [showInput, setShowInput] = useState(false);
    const [showCreateParameter, setShowCreateParameter] = useState(false);
    const [editingFileTitle,setEditingFileTitle] = useState(false);
    const [copyClipboard,setCopyclipboard] = useState(false);
    const [showAddTags, setShowAddTags] = useState(false);
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
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [widthScreen, setWidthScreen] = useState(window.innerWidth);
    const [localCategory, setLocalCategory] = useState(false)
    const [currentPayMethod, setCurrentPayMethod] = useState({
        bank: "",
        accountNumber: "",
        swift: "",
        routingNumber: "",
        currency: "",
        default: false,
    });
    const [editingIndexPayMethod, setEditingIndexPayMethod] = useState(null);


    const handleContactData = (field, value) => {
        const formattedValue =
            field === "cardNumber" ? formatCardNumber(value) : value;

        setContactData((prev) => ({
            ...prev,
            [field]: formattedValue,
        }));
    };
    const handleSaveBillingDetail = () => {
        if (selectedBillIndex !== null) {
            setContactData((prev) => {
                const updatedInfoBill = [...prev.infoBill];
                updatedInfoBill[selectedBillIndex] = { ...currentBill }; 

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
    const formatCardNumber = (value) => {
        return value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
    };
    const handleCreateContact = (e) => {
        e.preventDefault();

        if (contact || contactId) {
            const id = contact?._id || contactId;

            dispatch(updateContact({ id, contactData }))
                .then((result) => {
                    if (result.meta.requestStatus === "fulfilled") {

                        if (setNewContact) setNewContact(false);

                        if (fatherNewContact === "home") {
                            navigate("/admin/home");
                        } else if (fatherNewContact === "contacts") {
                            navigate("/admin/contacts");
                        } else if (fatherNewContact === "panel") {
                            setNewContact && setNewContact(false);
                        } else if (fatherNewContact === "chat") {
                            navigate("/admin/chat");
                        } else if (fatherNewContact === "chatId") {
                            navigate(`/admin/chat/${fatherIdNewcontact.agentId}/${fatherIdNewcontact.chatId}`);
                        } else if (fatherNewContact === "agentId") {
                            navigate(`/admin/chat/${fatherIdNewcontact}`);
                        } else {
                            setShowNewContact(false);
                        }

                        dispatch(setFatherNewContact(""));
                    } else {
                        console.error("Error actualizando el contacto:", result.error);
                    }
                })
                .catch((error) => {
                    console.error("Error inesperado:", error);
                });
        } else {
            dispatch(
                createContact({
                    data: contactData,
                })
            )
                .then((result) => {
                    if (result.meta.requestStatus === "fulfilled") {
                        setNewContact && setNewContact(false);
                        fatherNewContact === "home"
                            ? navigate("/admin/home")
                            : fatherNewContact === "contacts"
                                ? navigate("/admin/contacts")
                                : fatherNewContact === "panel"
                                    ? setNewContact && setNewContact(false)
                                    : fatherNewContact === "chat"
                                        ? navigate("/admin/chat")
                                        : fatherNewContact === "chatId"
                                            ? navigate(`/admin/chat/${fatherIdNewcontact.agentId}/${fatherIdNewcontact.chatId}`)
                                            : fatherNewContact === "agentId"
                                                ? navigate(`/admin/chat/${fatherIdNewcontact}`)
                                                : setShowNewContact(false);
                        dispatch(setFatherNewContact(""));

                        dispatch(setContact(null));
                    } else {
                        console.error("Error creating contact:", result.error);
                    }
                })
                .catch((error) => {
                    console.error("Unexpected error:", error);
                });
        }
    };
    const handleCloseNewContact = () => {
        setIsAnimating(true);
        setNewContact && setNewContact(false);
        setTimeout(() => {
            dispatch(clearContact());
            setShowNewContact && setShowNewContact(false);
            fatherNewContact === "home"
                ? navigate("/admin/home")
                : fatherNewContact === "contacts"
                    ? navigate("/admin/contacts")
                    : fatherNewContact === "panel"
                        ? setNewContact && setNewContact(false)
                        : fatherNewContact === "chat"
                            ? navigate("/admin/chat")
                            : fatherNewContact === "chatId"
                                ? navigate(`/admin/chat/${fatherIdNewcontact.agentId}/${fatherIdNewcontact.chatId}`)
                                : fatherNewContact === "agentId"
                                    ? navigate(`/admin/chat/${fatherIdNewcontact}`)
                                    :  setShowNewContact && setShowNewContact(false);
            dispatch(setFatherNewContact(""));
            setShowImportContacts(false);
            setIsAnimating(false);
        }, 300);
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
    const handleDelete = async () => {
        await dispatch(deleteContacts({ contactsSelected: contact._id })).unwrap();
        handleCloseNewContact();
    };
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




    useEffect(() => {
        if(!localCategory) {
            fnCategoryFind()
            setLocalCategory(true)
        }
    },[])
    useCloseOnEsc(handleCloseNewContact);
    useFocusShortcut(searchInputRef, "k");
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

    useEffect(() => {
        if (showInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showInput]);
    useEffect(() => {
        if (!showNewContact && contactId) {
            const fn = async () => {
                const response = await dispatch(getOneContact({ clientId: contactId }));
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
                    image: response.payload.image, 
                });

                setTags(response.payload.tags || []);
                setSelectedTags(response.payload.selectedtags || []);
            };
            fn();
        }
    }, []);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && showNewContact) {
                setIsAnimating(true);
                setNewContact && setNewContact(false);
                setTimeout(() => {
                    dispatch(clearContact());
                    fatherNewContact === "home"
                        ? navigate("/admin/home")
                        : fatherNewContact === "contacts"
                            ? navigate("/admin/contacts")
                            : fatherNewContact === "panel"
                                ? setNewContact && setNewContact(false)
                                : fatherNewContact === "chat"
                                    ? navigate("/admin/chat")
                                    : fatherNewContact === "chatId"
                                        ? navigate(`/admin/chat/${fatherIdNewcontact.agentId}/${fatherIdNewcontact.chatId}`)
                                        : fatherNewContact === "agentId"
                                            ? navigate(`/admin/chat/${fatherIdNewcontact}`)
                                            : setShowNewContact(false);
                    dispatch(setFatherNewContact(""));

                    setIsAnimating(false);
                }, 300);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showNewContact]);
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
    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth > 768) setWidthScreen(window.innerWidth - 200);
            else if(window.innerWidth <= 768) setWidthScreen(window.innerWidth)};

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [])
    useEffect(() => {
        if (editingFileTitle && inputTitleFile.current) {
            inputTitleFile.current.focus();
        }
    }, [editingFileTitle]);


    return (
        <main className={[styles.containerView]}>
            <Button
                headerStyle={{
                    width: "100%",
                    padding: "1rem",
                }}
                type="green">
                {t('InfoContact:save')} {t('contact')}
            </Button>
            <ProfileModalTemplate
                image={contactData.image}
                handleContactData={handleContactData}
                id={contactData._id}
                sticky={true}
                customStyle={{
                    width: "120px",
                    height: "120px",
                }}
            />
            <div className={styles.containerInput}>
                <EditableInput
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
                />
            </div>
            <div className={styles.containerInput}>
                <EditableLabel
                    value={contactData.type}
                    options={optionsType}
                    placeholder="Selecciona una opción..."
                />
            </div>
            <SymbolDesign
                contactData={contactData}
                setCopyclipboard={setCopyclipboard}
                setEditingFileTitle={setEditingFileTitle}
                setShowAddTags={setShowAddTags}
            />
            <LabelActions/>


            <ContactIdentification
                contactData={contactData}
                handleContactData={handleContactData}
                inputsEditing={inputsEditing}
                setInputsEditing={setInputsEditing}
                handleChangePhoneNumbers={handleChangePhoneNumbers}
                addPhoneNumber={addPhoneNumber}
                removePhoneNumber={removePhoneNumber}
            />

            <BillingDetails
                handleAddBillingDetail={handleAddBillingDetail}
                contactData={contactData}
                handleSaveBillingDetail={handleSaveBillingDetail}
                selectedBillIndex={selectedBillIndex}
                handleEditBillingDetail={handleEditBillingDetail}
                setCurrentBill={setCurrentBill}
                currentBill={currentBill}
                addPayMethod={addPayMethod}
                handleBillingDetailChange={handleBillingDetailChange}
                setCurrentPayMethod={setCurrentPayMethod}
                editingIndexPayMethod={editingIndexPayMethod}
                setEditingIndexPayMethod={setEditingIndexPayMethod}
                currentPayMethod={currentPayMethod}
                handlePayMethodChange={handlePayMethodChange}
                setContactData={setContactData}
                handleDeleteBillingDetail={handleDeleteBillingDetail}
            />

        </main>
    )
}

export default ViewContactLeft
