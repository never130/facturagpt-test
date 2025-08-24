import React, { useState, forwardRef, useEffect } from "react";
import styles from "./ContactsPopup.module.css";
import emptyImage from "../../assets/ImageEmpty.svg";
import { ReactComponent as PlusIconGray } from "../../assets/plusIconGray.svg";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts, getContactImage } from "../../../../actions/contacts";
import { getAllAssets } from "../../../../actions/assets";
import { useTranslation } from "react-i18next";
import { setAsset } from "@src/slices/assetsSlices";
import { clearContact, setFatherNewContact } from "../../../../slices/contactsSlices";
import { setFatherNewAsset } from "../../../../slices/assetsSlices";
import { getTableDataFiltered, getTables, getVariable } from "../../../../actions/user";


const ContactsPopup = forwardRef(
  ({ handleContactClick,
    handleAssetClick, 
    type, 
    inputValue,
    setNewContact, 
    setNewAsset,
    handleSelectItem,
    customStyle,
    handleClickFocus,
    father
  }, ref) => {
    const dispatch = useDispatch();
    const { contacts } = useSelector((state) => state.contacts);
    const { t } = useTranslation("Assets");
    const { assets } = useSelector((state) => state.assets);
    const [contactImages, setContactImages] = useState({});
    const [contactsAssetsContainer, setContactsAssetsContainer ] = useState([])
    const [falloCarga, setFalloCarga] = useState(false)
    const { tables, contactsTable, assetsTable, docsTable, tablesFiltered} = useSelector((state) => state.user)
    const {tableView} = useSelector(state => state.user)
    const [parametersTables, setParametersTables] = useState([])
    const [parametersTablesBackup, setParametersTablesBackup] = useState([])
    const [tablesFilteredCurrent, setTablesFilteredCurrent] = useState([])
console.log('contacts', contacts)
    // console.log('tables', tables)
    // console.log('contactsTable', contactsTable)
    // console.log('assetsTable', assetsTable)
    // console.log('docsTable', docsTable)
    // console.log('tableView.parametersTables', tableView.parametersTables)

    // useEffect(() => {
    //   if (tablesFilteredCurrent.length === 0 && tables.length > 0){
    //     setTablesFilteredCurrent(tables)}
    // }, [tables])
    useEffect(() => {
      if(inputValue.length > 0){ 
        setTablesFilteredCurrent(tablesFiltered)
      } 
    }, [tablesFiltered])


    useEffect(() => {
      // console.log('entra en el useEffect de parametersTables')
      // console.log('tableView', tableView?.parametersTables)
      const processedData = (() => {
        if (!tableView?.parametersTables) {
          dispatch(getVariable({ type: 'tableView' }))
          return [];}
        
        // Extraer todos los objetos de todas las propiedades del objeto
        const allObjects = Object.values(tableView.parametersTables).flat();
        
        // Filtrar objetos únicos basándose en la propiedad 'name'
        const uniqueObjects = allObjects.filter((obj, index, self) => {
          // Si el objeto no tiene propiedad 'name', lo incluimos
          if (!obj.name) return true;
          
          // Buscar si ya existe un objeto con el mismo 'name' en una posición anterior
          const firstIndex = self.findIndex(item => item.name === obj.name);
          return firstIndex === index;
        });
        
        return uniqueObjects;
      })()
      // console.log('processedData', processedData)
      // Guardar solo el backup, el filtrado se maneja en otro useEffect
      setParametersTablesBackup(processedData)
     
    }, [tableView])

    // console.log('parametersTables',parametersTables)
    // console.log('tablesFilteredCurrent',tablesFilteredCurrent)
    // console.log('tablesFiltered',tablesFiltered)
    // console.log("inputValue", inputValue?.length)


    useEffect(() => {
      let res;
      let tables = [];
  

      // console.log('inputValue', inputValue)
      const fn = async () => {
        res = await dispatch(getTables())
  
        // console.log('res', res)
        if (res.payload?.tables) {
          tables = res.payload.tables;
        }
        if (tables.length > 0) {
          for (let table of tables) {
            await dispatch(getTableDataFiltered({ tableId: table._id, search: inputValue, }));
          }
        }
        if(inputValue.length > 0 ){
          // console.log('entra en el if de inputValue')
        await dispatch(getTables({search: inputValue}))}
      }
  
      fn()
    }, [inputValue, parametersTablesBackup])

    // useEffect separado para el filtrado de parametersTables
    useEffect(() => {
      if (parametersTablesBackup.length > 0) {
        if (inputValue.length > 0) {
          setParametersTables(parametersTablesBackup.filter(item => 
            item.name.toLowerCase().includes(inputValue.toLowerCase())
          ))
        } else {
          setParametersTables(parametersTablesBackup)
        }
      }
    }, [inputValue, parametersTablesBackup])

    useEffect(() => {
      if (inputValue.length === 0){setTablesFilteredCurrent(tables)}
    }, [inputValue])

    function ordenarAlfabeticamente(array) {
  return array.sort((a, b) => {
    const nombreA = (a.contactName || a.name || '').toLowerCase();
    const nombreB = (b.contactName || b.name || '').toLowerCase();
    return nombreA.localeCompare(nombreB);
  });
}



    useEffect(()=> {
      let contactsAndAssetsArray = [...docsTable.slice(0,2),...assetsTable.slice(0,2),
        ...contactsTable.slice(0,2),...tablesFilteredCurrent.slice(0,2), ...parametersTables?.slice(0,2)]

      setContactsAssetsContainer(contactsAndAssetsArray)

    },[docsTable,assetsTable,contactsTable, tablesFilteredCurrent,parametersTables])

    // useEffect(() => {
    //   dispatch(getAllAssets({
    //     search: inputValue,
    //     limit: 3,
    //   }));

    //   dispatch(
    //     getAllContacts({
    //       search: inputValue,
    //       limit: 3,
    //     })
    //   );
    // }, [dispatch, inputValue]);

    // useEffect(() => {
    //   const fetchImages = async () => {
    //     const imageMap = {};
    //     for (const contact of contacts) {
    //       try {
    //         const response = await dispatch(getContactImage({ contactId: contact._id }));
    //         imageMap[contact._id] = response.payload.image; 
    //       } catch (err) {
    //         console.error(`Error al cargar imagen del contacto ${contact._id}:`, err);
    //       }
    //     }
    //     setContactImages(imageMap);
    //   };

    //   if (contacts.length > 0) {
    //     fetchImages();
    //   }
    // }, [contacts]);

    return (
      <div 
        className={styles.contacts} 
        ref={ref} 
        style={customStyle}
      >
        {type === "contact" ? (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className={styles.contact}
              onMouseDown={() => handleContactClick(contact)}
            >
              <img
                src={contactImages[contact._id] || emptyImage}
                width={30}
                height={30}
                alt=""
              />
              <div>
                <p>{contact.contactName}</p>
                <span>
                  {contact.companyEmail}
                </span>
              </div>
            </div>
          ))
        ) : type === "asset" ? (
          // assets.map((asset) => (
            assetsTable.map((asset) => (
              <div
              key={asset._id}
              className={`${styles.asset} ${styles.chatCard}`}
              onMouseDown={() => {
                handleSelectItem(asset)
                setTimeout(() => {
                handleClickFocus();
              }, 0);
              }
              }
            >
              <img style={{borderRadius: falloCarga ? "0px": asset.image ? "999px":"0px"}}
                src={asset.image || emptyImage}
                width={30}
                height={30}
                alt=""
                  onError={(e) => {
                    setFalloCarga(true)
                   e.target.onerror = null;
                  e.target.src = emptyImage;
                  }}
              />
              <div >
                <p>{asset.name ? asset.name : "substitute" in asset ? "Nombre del Activo": "accessPermitType" in asset ? "Elemento" :
                asset.contactName ? asset.contactName : "contactName" in asset ? "Nombre de la Cuenta" : 
                asset.documentTitle ? asset.documentTitle : "stateStripe" in asset ? "Nombre del documento" :
                "hidden" in asset ? "Nombre de variable" : ""}</p>

                <span style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{asset.description ? asset.description : "substitute" in asset ? 'Descripción'  :
                 asset.companyEmail ? asset.companyEmail :  "contactName" in asset ? 'Email adress, Dirección, Población, Provincia, Código Postal, País' : 
                 asset.category ? asset.category : "stateStripe" in asset ? "Categoria" : asset.headers?.length ? asset.headers?.length :
                 "accessPermitType" in asset ? "Numero de parámetros" :""}</span>
              </div>
            </div>
          ))
        ) : type === "chat" ? (
          contactsAssetsContainer.map((item) => (
            <div
              key={item._id}
              className={`${styles.asset} ${styles.chatCard}`}
              onMouseDown={() => {
                handleSelectItem(item)
                setTimeout(() => {
                handleClickFocus();
              }, 0);
              }
              }
            >
              <img style={{borderRadius: falloCarga ? "0px": item.image ? "999px":"0px"}}
                src={item.image || emptyImage}
                width={30}
                height={30}
                alt=""
                  onError={(e) => {
                    setFalloCarga(true)
                   e.target.onerror = null;
                  e.target.src = emptyImage;
                  }}
              />
              <div >
                <p>{item.name ? item.name : "substitute" in item ? "Nombre del Activo": "accessPermitType" in item ? "Elemento" :
                item.contactName ? item.contactName : "contactName" in item ? "Nombre de la Cuenta" : 
                item.documentTitle ? item.documentTitle : "stateStripe" in item ? "Nombre del documento" :
                "hidden" in item ? "Nombre de variable" : ""}</p>

                <span style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{item.description ? item.description : "substitute" in item ? 'Descripción'  :
                 item.companyEmail ? item.companyEmail :  "contactName" in item ? 'Email adress, Dirección, Población, Provincia, Código Postal, País' : 
                 item.category ? item.category : "stateStripe" in item ? "Categoria" : item.headers?.length ? item.headers?.length :
                 "accessPermitType" in item ? "Numero de parámetros" :""}</span>
              </div>
            </div>
          ))
        ) : null}
      {(type === 'asset' && father !== 'newAsset' || type === 'contact') && 
        <div
          className={styles.newContactInfoClient}
          onClick={() => { 
            if(type === 'contact'){
            dispatch(clearContact());
            dispatch(setFatherNewContact('panel'))
            setNewContact(true)
            } else if (type === 'asset'){
            dispatch(setAsset(null))
            dispatch(setFatherNewAsset('panel'))
            setNewAsset(true)
            }
          }}
        >
          {type === 'asset'? <PlusIconGray /> : type === 'contact'? <PlusIconGray /> : ""}
          {type === 'asset'? t('newAsset'): type === 'contact'? t('newContact') : ""}
        </div>}
      </div>
    );
  }
);

export default ContactsPopup;
