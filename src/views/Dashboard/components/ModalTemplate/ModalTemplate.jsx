import React, { useEffect, useRef,useState } from "react";
import styles from "./ModalTemplate.module.css";
import Button from "../Button/Button";
import { ReactComponent as ArrowDown } from "../../assets/ArrowLeftWhite.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setFatherNewContact, sliceSetShowNewBill } from "../../../../slices/contactsSlices";
import { ReactComponent as HorizontalDots } from "../../assets/S3/horizontalDots.svg";
import OptionsPopup from "../../components/OptionsPopup/OptionsPopup";
import { setFatherNewAsset } from "../../../../slices/assetsSlices";
import { deleteAssets } from "../../../../actions/assets";
import {deleteContacts} from "@src/actions/contacts";
import { deleteRowTable, getTableData } from "../../../../actions/user";

const ModalTemplate = ({
  children,
  onClick,
  actionSave,
  text,
  isAnimating,
  newContact,
  selectedContact,
  reverseMobile,
  setShowNewBill,
  assets,
  profileImageCenter,
  bill,
  saveDocument,
  type,
  customStyleModalTemplateHeader,
  customStyleContentContainer,
  customStyleButtonHeader,
  customStyleModalTemplate,
  father,
  assetId,
  fn,
  contactId,
  fnContact,
  setShowPopupNewContact,
  setShowPopupNewAsset,
  saveDraft,
  setSeeBill, tableId, docId
}) => {
  const [t] = useTranslation("Contacts");
  const navigate = useNavigate();
  const location = useLocation()
  const dispatch = useDispatch()
  const {sliceNewContactProp} = useSelector(state => state.contacts)
  const [currentScroll, setCurrentScroll] = useState()
  const [showOptionsPopup, setShowOptionsPopup] = useState(false)
  const popupButtonRef = useRef(null)



   const scrollRef = useRef();
  
  useEffect(() => {
    const div = scrollRef.current;
  
    const handleScroll = () => {
      setCurrentScroll(div.scrollTop)
    };
  
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCloseNewClient = (e) => {
    // if(type !== "popup") setShowPopupNewAsset(false)
      onClick()
      e.stopPropagation()
    

  };

  const handleActionSave = (e) => {
    actionSave(e)

  };

    const handleDelete = async (clientSelected) => {
      try {
        if(tableId){

          await dispatch(deleteRowTable({tableId,rowId:clientSelected} ))
          dispatch(getTableData(tableId))
        } else if(father == "contact"){
            await dispatch(
            deleteContacts({contactsSelected: clientSelected })
          ).unwrap(); 
         fnContact(); 
        }else{

          await dispatch(
            deleteAssets({ clientSelected })
          ).unwrap(); 
          fn(); 
        }
      } catch (error) {
        console.error("Error eliminando assets:", error);
      }
    }
  

  return (
    <>
      <div className={ type !== "popup" && styles.bg} onClick={() => onClick()}></div>
      <div style={customStyleModalTemplate}
        className={`${ type !== "popup" && styles.modalTemplate}  ${ type !== "popup" && isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        <div className={styles.modalTemplateHeader} style={{...customStyleModalTemplateHeader, position: type === "popup" && currentScroll >= 160 ? "sticky" : "static", }} >
          <div className={styles.modalTemplateInfo}>
            <Button
              action={(e) => {

              handleCloseNewClient(e)
              }}
              headerStyle={{ padding: type === "popup" ?"4px 6px" : "8px 12px" }}
            >
              <ArrowDown />
            </Button>
            {type !== "popup" && 
            <h3>
            {newContact ? t('new') : t('update')} {text}
            </h3>}
          </div>
          <div className={styles.buttonContainer} >
            {(!newContact && assets) && (
             type !== "popup" &&  <>
                <Button
                  type={"white"}
                  action={() =>{
                    navigate(`/admin/contacts/${selectedContact._id}`)
                  }}
                >
                  {t('seeTransactions')}
                </Button>

              </>
            )}
{type !== "popup" && bill ? (
<>
<Button type="white" action={saveDraft}>
  {t('saveDraft')}
</Button>
<Button action={() => setSeeBill(true)}>
  {t('previewData')}
</Button>
<Button action={() => saveDocument('pending')}>
  {t('saveAndSend')}
</Button>
</>
) : (
type !== "popup" && 
  <Button action={() => handleCloseNewClient()} type="white">
              {t('cancel')}
            </Button>
            )}
            {(!newContact && assets) && (
            type !== "popup" &&   <>
            
                <Button action={() =>  dispatch(sliceSetShowNewBill())}>{t('newInvoice')}</Button>
              </>
            )}
         {!bill && (
         
           type !== "popup" &&  <Button headerStyle={customStyleButtonHeader} action={(e) => handleActionSave(e)}>
             { newContact ? t('save') : t('update')}
           </Button>
         )}
 
           {type === "popup" &&
           <div ref={popupButtonRef} className={styles.dotsContainer} onClick={() => setShowOptionsPopup(!showOptionsPopup)}>
             <HorizontalDots  />
           </div>
           }

           {showOptionsPopup && type === "popup" &&
           
           <OptionsPopup
                         style={{position: "fixed",width: "fit-content"}}
                         close={() => setShowOptionsPopup(false) }
                         father={type}
                         options={[    
                           {
                             label: t("edit"),
                             onClick: (e) => {
                               e.stopPropagation();
                               if(father == "contact"){
                                dispatch(setFatherNewContact("tables"));
                                    navigate(`/admin/contacts/${contactId}`,{ state: { backgroundLocation: location } });
                                    setShowPopupNewContact(false)
                               }
                               else if (father == "asset"){
                                 dispatch(setFatherNewAsset('tables'))
                                 navigate(`/admin/assets/${assetId}`, { state: { backgroundLocation: location } });
                                 setShowPopupNewAsset(false)
                               } else if (father == "transaction"){
                                setShowNewBill(false)
                              navigate(`/admin/docs/${undefined}/${docId}`);
                               }
                               setShowOptionsPopup(false)
                             },
                           },
                           {
                             label: t("delete"),
                             onClick: (e) => {
                               e.stopPropagation();
                               if(father == "contact"){
                                handleDelete(contactId)
                                 setShowOptionsPopup(false)
                                 setShowPopupNewContact(false)
                               }else if(father == "asset") {
                                 handleDelete(assetId)
                                 setShowOptionsPopup(false)
                                  setShowPopupNewAsset(false)
                               } else if(father == "transaction"){
                                 handleDelete(docId)
                                 setShowOptionsPopup(false)
                                  setShowNewBill(false)
                               }
                             },
                           },
                         ]}
                       />
           }


          </div>
        </div>
        <div>
        </div>
        <div ref={scrollRef} style={customStyleContentContainer}
          className={`${styles.contentContainer} ${reverseMobile && styles.reverseMobile} ${profileImageCenter && styles.profileImageCenter} ${type === "popup" && styles.popupContentContainer}`}
          >
          {children}
          </div>
      </div>
    </>
  );
};

export default ModalTemplate;
