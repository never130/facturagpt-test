import { useEffect, useRef, useState } from "react";
import styles from "./InvoiceForm.module.css";
import imageIcon from "../../assets/imageIcon.svg";
import { ReactComponent as Pencil } from "../../assets/pencilEdit.svg";
import InfoBill from "../InfoBill/InfoBill";
import InfoActivity from "../InfoActivity/InfoActivity";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { FaChevronDown } from "react-icons/fa";
import { getOneDocsById } from "@src/actions/docs";
import { ReactComponent as AddnoteGray } from "../../assets/addNoteGray.svg";
import AiIcon2 from "../../assets/AIcon.svg";
import VariableModal from "../VariableModal/VariableModal";
import VariableListModal from "../VariableListModal/VariableListModal";
import SelectCurrencyPopup from "../SelectCurrencyPopup/SelectCurrencyPopup";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { duplicateFiles, getUserFiles, updateNameFileS3 } from "../../../../actions/scaleway";
import TalkWithAi from "./TalkWithAi/TalkWithAi";
import { formatAgoDate } from "../../../../utils/agoDateUtil";
import { ReactComponent as LockIcon } from "../../assets/WhiteLock.svg";
import ApproveDocument from "../ApproveDocument/ApproveDocument";
import BeforeApprovingPopup from "../BeforeApprovingPopup/BeforeApprovingPopup";
import { ReactComponent as LittleIconStateStripePending } from "../../assets/littleIconStateStripePending.svg";
import { ReactComponent as LittleIconStateStripeDue } from "../../assets/littleIconStateStripeDue.svg";
import { ReactComponent as LittleIconStateStripePaid2 } from "../../assets/littleIconStateStripePaid2.svg";
import { ReactComponent as LittleIconStateStripeDefaulted2 } from "../../assets/littleIconStateStripeDefaulted2.svg";
import { ReactComponent as LittleIconStateStripeVoided2 } from "../../assets/littleIconStateStripeVoided2.svg";
import { ReactComponent as NewChatWithAgent } from "../../assets/WindMagic.svg";
import { ReactComponent as StateIcon } from "../../assets/StateIcon.svg";
import Button from "../Button/Button";
import { updateDoc } from "../../../../actions/docs";
import QRCodeGenerator from "../QRCodeGenerator/QRCodeGenerator";
import WantCancelDocument from "../WantCancelDocument/WantCancelDocument";
import ModalStatesDoc from "../modalStatesDoc/ModalStatesDoc";
import DynamicTable from "../DynamicTable/DynamicTable";
import { createVariable, getVariable } from "../../../../actions/user";
import SelectLocation from "../SelectLocation/SelectLocation";
import NewBIll from "../NewBIll/NewBIll";
export default function InvoiceForm({
  handleAddNote,
  customStyles = {},
  noteColor,
  setEditingNote,
  showInfoMobileBill,
  createdNote,
  editorContentFinal,
  stateContact,
  setStateContact,
  stateAsset,
  setStateAsset,
  stateDoc,
  setStateDoc,
  setSelectedCurrency,
  selectedCurrency,
  setShowSelectCurrencyPopup,
  showSelectCurrencyPopup,
  setSymbolSelected,
  isNewBill,
  selectedFile,
  setSelectedFile
}) {
  const [sectionSelected, setSectionSelected] = useState(0);
  const [t] = useTranslation(["InvoiceForm","Preview"]);
  const dispatch = useDispatch();
  const { id, docsId } = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSelectLocation,setShowSelectLocation] = useState(false)
  const [selectedLocation,setSelectedLocation] = useState('')
  const [beforeApproveDocument, setBeforeApproveDocument] = useState(false);
  const [approveDocument, setApproveDocument] = useState(false);
  const [wantCancelDocument, setWantCancelDocument] = useState(false);
  const [cancelDocument, setCancelDocument] = useState(false);
  const [stateStripe, setStateStripe] = useState("Pagado");

  const scrollContainerRef = useRef();
  const [showButtonFixed, setShowButtonFixed] = useState(false)
  const [showThead, setShowThead] = useState(false)
  const [showPaddingTop, setShowPaddingTop] = useState(false)
  const [showEditingBill,setShowEditingBill] = useState(false)

  useEffect(() => {
    const container = scrollContainerRef.current;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      if (scrollTop > 260) {
        setShowButtonFixed(true)
      } else setShowButtonFixed(false)
      if (scrollTop > 125 && scrollTop < 240) {
        setShowThead(true)
      } else setShowThead(false)
      if (scrollTop > 100) {
        setShowPaddingTop(true)
      } else setShowPaddingTop(false)
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const icons = [
    <LittleIconStateStripePaid2 />,
    <LittleIconStateStripePending />,
    <LittleIconStateStripeDefaulted2 />,
    <LittleIconStateStripeDue />,
    <LittleIconStateStripeVoided2 />,
  ];
  const colorMap = {
    [t("Paid")]: "#009F7A",
    [t("pending")]: "#FF9D00",
    [t("defaulted")]: "#FF5500",
    [t("due")]: "#C5221F",
    [t("voided")]: "#8A0300",
  };

  const optionsName = [
    t("Paid"),
    t("pending"),
    t("defaulted"),
    t("due"),
    t("voided"),
  ];

  const [selectedColor, setSelectedColor] = useState(colorMap[optionsName[0]]);


  const [localIcon, setIcon] = useState(0);

  useEffect(() => {
    const fn = async () => {
      const response = await dispatch(
        getOneDocsById(id ? { docId: id } : { docId: docsId })
      );

    };
    if (id || docsId) {
      fn();
    }
  }, [id, docsId]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  const [showVariableModal, setShowVariableModal] = useState(false);
  const [typeVariableModal, setTypeVariableModal] = useState("category");
  const [showVariableListModal, setShowVariableListModal] = useState(false);
  const [styleFixed, setStyleFixed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [statesStripe, setStatesStripe] = useState([]);
  const handleConfigurationChange = (key, value) => {
    setStateDoc((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const { user, selectedDocument, tableView } = useSelector((state) => state.user);



  const inputRef = useRef(null);

  useEffect(() => {
    if (editingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingName]);

  const fnUpDateDoc = async (index) => {
    const response = await dispatch(getOneDocsById({ docId: id }));
    const state = response?.payload?.doc?.statesDoc || [];
    setStatesStripe([
      {
        logo: index,
        state: index,
        createdAt: new Date().toISOString(),
      },
      ...state,
    ]);

    await dispatch(
      updateDoc({
        docId: id,
        updates: {
          statesDoc: [
            {
              logo: index,
              state: index,
              createdAt: new Date().toISOString(),
            },
            ...state,
          ],
        },
      })
    );
  };


  const [showStatesStripes, setShowStatesStripes] = useState(false)
  const [currentIdDoc, setCurrentIdDoc] = useState()
  const tableHeaders = [
    { label: t("Logo"), key: "Logo" },
    { label: t("state"), key: "state" },
    { label: t("date"), key: "date" },
  ];

  const iconMap = {
    [t('Paid')]: 0,
    [t('pending')]: 1,
    [t('defaulted')]: 2,
    [t('due')]: 3,
    [t('voided')]: 4,
  };
  

  useEffect(() => {
    const fn = async () => {
      if (!isNewBill) {
        const response = await dispatch(getOneDocsById({ docId: id }));
        const state = response?.payload?.doc?.stateStripe
          if (state?.length > 0) {
            setStatesStripe(state)
            setStateStripe(t(state))
            setSelectedColor(colorMap[t(state)])
            const iconIndex = iconMap[t(state)];
            if (iconIndex !== undefined) {
              setIcon(iconIndex);
            }
            setCurrentIdDoc(response?.payload?.doc?._id)
          } else {
            setCurrentIdDoc(response?.payload?.doc?._id)
            setStatesStripe([])
            setSelectedColor(colorMap[optionsName[0]])
            setStateStripe(optionsName[0])
            setIcon(0)
          }
      }
    }
    fn()
  }, [id])

  const colorsIndex = ["#009F7A", "#FF9D00", "#FF5500", "#C5221F", "#8A0300",]
  const renderRow = (row, index) => (
    <tr
      key={index}
    >
      <td>{icons[row.logo]}</td>
      <td style={{ color: `${colorsIndex[row.state]}` }}>{optionsName[row.state]}</td>
      <td>{row.createdAt ? formatAgoDate({ dateString: row.createdAt, t }) : ""}
      </td>
    </tr>
  );

  const setOrderedTable = () => {

  }

  const fnTableView = async () => { await dispatch(getVariable({ type: 'tableView' })) }

  const setWidthColumn = async (columnWidths) => {
    await dispatch(createVariable({ variableData: { title: "tableView", type: "tableView", panelWidth: columnWidths } }))
    fnTableView()
  }
  useEffect(() => {
    if (!tableView || tableView.length === 0) fnTableView();
  }, []);



  const saveDoc = async () => {
    await dispatch(
      updateDoc({
        docId: stateDoc._id,
        updates: stateDoc,
      })
    );
  }
  return (
    <div ref={scrollContainerRef}
      className={`${styles.container} ${showInfoMobileBill && styles.showInfoMobileBill}`}
      style={{ ...customStyles, padding: "10px" }}
    >
      <div className={styles.secondContainer}>

        {showButtonFixed &&
          <div className={styles.rowApprove}>
            <Button action={() => setBeforeApproveDocument(true)} headerStyle={{ width: "100%", height: "40px" }}>
              <LockIcon /> {t("approveDocument")}
            </Button>
            <Button type="white" headerStyle={{ minWidth: "40px", height: "40px", padding: '0' }} action={() => setShowEditingBill(true)}>
              <Pencil />
            </Button>
          </div>
        }
        <header className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleContent}>
              <img src={imageIcon} alt="icon" />
              <input
                type="text"
                ref={inputRef}
                disabled={!editingName}
                placeholder={selectedFile?.title || t("titleDocument")}
                className={styles.title}
                onBlur={async () => {
                  const fullKey = selectedFile?.Key;

                  if (fullKey) {
                    const lastSlashIndex = fullKey.lastIndexOf("/");

                    const basePath = fullKey.substring(0, lastSlashIndex + 1);
                    const path = selectedFile?.Key;

                    let prefix;

                    const matchWithFile = path?.match(/^(.*?\/FILE-[^_]+_)/);
                    if (matchWithFile) {
                      prefix = matchWithFile[1];
                    } else {
                      prefix = path.substring(0, path.lastIndexOf("/"));
                    }




                    const userLocalStorage = localStorage.getItem("user");
                    const parsedUser = userLocalStorage
                      ? JSON.parse(userLocalStorage)
                      : null;
                    await dispatch(
                      updateNameFileS3({
                        newName: selectedFile?.title,
                        path: prefix,
                        oldKey: selectedFile?.Key,
                      })
                    );

                    await dispatch(
                      getUserFiles({
                        userId: user.id,
                        token: parsedUser.accessToken,
                      })
                    ).unwrap();
                  }
                  setEditingName(false);
                }}
                value={`${selectedFile?.title}`}
                onChange={(e) => {
                  setSelectedFile((prev) => ({
                    ...prev,
                    title: e.target.value
                  }))
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    const fullKey = selectedFile?.Key;

                    if (fullKey) {
                      const lastSlashIndex = fullKey.lastIndexOf("/");

                      const basePath = fullKey.substring(0, lastSlashIndex + 1);
                      const path = selectedFile?.Key;

                      let prefix;

                      const matchWithFile = path?.match(/^(.*?\/FILE-[^_]+_)/);
                      if (matchWithFile) {
                        prefix = matchWithFile[1];
                      } else {
                        prefix = path.substring(0, path.lastIndexOf("/"));
                      }


                      const userLocalStorage = localStorage.getItem("user");
                      const parsedUser = userLocalStorage
                        ? JSON.parse(userLocalStorage)
                        : null;
                      await dispatch(
                        updateNameFileS3({
                          newName: selectedFile.title,
                          path: prefix,
                          oldKey: selectedFile?.Key,
                        })
                      );
                      await dispatch(
                        getUserFiles({
                          userId: user.id,
                          token: parsedUser.accessToken,
                        })
                      ).unwrap();
                    }
                    setEditingName(false);
                  }
                }}
              />
            </div>
            <div className={styles.headerBillMobile}>
              <div className={styles.notesHeaderBillMobile}>
                <button onClick={() => setEditingName((prev) => !prev)}>
                  {" "}
                  <AddnoteGray />
                </button>
                <button
                  onClick={() => {
                    handleAddNote();
                    setEditingNote(false);
                  }}
                >
                  {t("addNote")}
                </button>
              </div>
            </div>
          </div>
          <div className={styles.dropdownContainer}>
            <div className={styles.dropdownsLeft}>
              <div
                className={styles.dropdown}
                onClick={() => {
                  setTypeVariableModal("category");
                  setShowVariableListModal(true);
                }}
              >
                {stateDoc?.category?.title || t("selectCategory")}{" "}
                
                <img src={AiIcon2} alt="Icono" height={"15px"} />{" "}
                <FaChevronDown className={styles.chevronIcon} />
              </div>
              <div
                className={styles.dropdown}
                onClick={() => {
                  setTypeVariableModal("concept");
                  setShowVariableListModal(true);
                }}
              >
                {stateDoc?.concept?.title  || t("concept")}
                <FaChevronDown className={styles.chevronIcon} />
              </div>
            </div>
            <div>
              <span>{formatAgoDate({ dateString: selectedDocument?.item?.Key, t })}</span>
            </div>
          </div>
          {showVariableListModal && (
            <VariableListModal
              type={typeVariableModal}
              setShowVariableListModal={setShowVariableListModal}
              setShowVariableModal={setShowVariableModal}
              setSelectedVariable={setStateDoc}
            />
          )}
          {showVariableModal && (
            <VariableModal
              setShowVariableModal={setShowVariableModal}
              VariableModal={showVariableModal}
              type={typeVariableModal}
            />
          )}
          <div className={styles.addNote}>
            {createdNote && (
              <div className={`${styles.note} ${styles[noteColor]}`}>
                <div className={styles.text}>
                  <span
                    dangerouslySetInnerHTML={{ __html: editorContentFinal }}
                  ></span>
                </div>
                <div
                  className={styles.button}
                  onClick={() => {
                    handleAddNote();
                    setEditingNote(true);
                  }}
                >
                  {t("editNote")}
                </div>
              </div>
            )}
          </div>

          {!showButtonFixed &&
            <div className={styles.rowApprove}>
              <Button action={() => setBeforeApproveDocument(true)} headerStyle={{ width: "100%", height: "40px" }}>
                <LockIcon /> {t("approveDocument")}
              </Button>
              <Button type="white" headerStyle={{ minWidth: "40px", height: "40px", padding: '0' }} action={() => setShowEditingBill(true)}>
                <Pencil />
              </Button>
            </div>}


          <div className={styles.state}>


            <div>
              <Button type="border">
                <StateIcon />
              </Button>{" "}
              <p>{t("state")}</p>
            </div>
            <div className={styles.stateStripeContainer}>
              {icons[localIcon]}

              <CustomDropdown
                editable={true}
                editing={true}
                options={optionsName}
                icons={icons}
                stateStripe={true}
                selectedOption={stateStripe}
                setSelectedOption={setStateStripe}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                setIcon={setIcon}
                iconSelected={localIcon}
                fnUpDateDoc={fnUpDateDoc}
              />
            </div>
          </div>
          {statesStripe.length > 0 &&
            <DynamicTable
              columns={tableHeaders}
              data={statesStripe}
              renderRow={renderRow}
              hideCheckbox={true}
              limit={2}
              icons={icons}
              setShowStatesStripes={setShowStatesStripes}
              states={optionsName}
              setOrderedTable={setOrderedTable}
              showThead={showThead}
              setWidthColumn={setWidthColumn}
              fatherWidth={'panelWidth'}
            />}

          {showStatesStripes && <ModalStatesDoc
            tableHeaders={tableHeaders}
            statesStripe={statesStripe}
            renderRow={renderRow}
            icons={icons}
            setShowStatesStripes={setShowStatesStripes}
            optionsName={optionsName} />}

          <Button
            type="white"
            headerStyle={{ color: "#8E8E93", width: "100%", height: "40px" }}
            action={() => setSectionSelected(3)}
          >
            <NewChatWithAgent className={styles.WindMagic} /> {t('talkWithAi')}
          </Button>
          <Button
            type="white"
            action={saveDoc}
            headerStyle={{ color: "#8E8E93", width: "100%", height: "40px" }}
          >
            {t("saveDoc")}
          </Button>
        </header>
        <div className={styles.btnSectionsSelector}>
          <button
            className={`${sectionSelected == 0 ? styles.sectionSelect : ""}`}
            onClick={() => setSectionSelected(0)}
          >
            {t("infoBill")}
          </button>
          <button
            className={`${sectionSelected == 1 ? styles.sectionSelect : ""}`}
            onClick={() => setSectionSelected(1)}
          >
            {t("infoActivity")}
          </button>
          <button
            className={`${sectionSelected == 2 ? styles.sectionSelect : ""}`}
            onClick={() => setSectionSelected(2)}
          >
            {t('actions')}
          </button>
        </div>
        {showSelectCurrencyPopup && (
          <SelectCurrencyPopup
            setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
            setSelectedCurrency={setSelectedCurrency}
            selectedCurrency={selectedCurrency}
            setSymbolSelected={setSymbolSelected}
            configuration={stateDoc}
            handleConfigurationChange={handleConfigurationChange}
            setStyleFixed={setStyleFixed}
            styleFixed={styleFixed}
          />
        )}
        {sectionSelected == 0 ? (
          <InfoBill
            stateAsset={stateAsset}
            setStateAsset={setStateAsset}
            stateContact={stateContact}
            setStateContact={setStateContact}
            stateDoc={stateDoc}
            isNewBill={isNewBill}
            setStateDoc={setStateDoc}
          />
        ) : sectionSelected == 1 ? (
          <InfoActivity />
        ) : sectionSelected == 2 ? (
          <ActionsPanel selectedFile={selectedFile} setShowSelectLocation={setShowSelectLocation}/>
        ) : (
          <TalkWithAi stateDoc={stateDoc} />
        )}
      </div>
      {beforeApproveDocument && (
        <BeforeApprovingPopup
          setBeforeApproveDocument={setBeforeApproveDocument}
          setApproveDocument={setShowStatesStripes}
          icons={icons}
          selectedOption={stateStripe}
          setSelectedOption={(option) => {
            setStateStripe(option);
          }}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          setIcon={setIcon}
          fnUpDateDoc={fnUpDateDoc}
        />
      )}

      {approveDocument && (
        <ApproveDocument
          approveDocument={approveDocument}
          setApproveDocument={setApproveDocument}
          setWantCancelDocument={setWantCancelDocument}
        />
      )}
      {wantCancelDocument && (
        <WantCancelDocument
          setWantCancelDocument={setWantCancelDocument}
        />
      )}
      {cancelDocument && (
        <CancelDocument setCancelDocument={setCancelDocument} />
      )}

{showEditingBill && (
  <NewBIll
  setShowNewBill={() => setShowEditingBill(false)}
  idDOcument={id}
/>
)}

{showSelectLocation && (
        <SelectLocation
          onClose={() => setShowSelectLocation(false)}
          uploadFile={false}
          pickLocation={async(location) => {
            setSelectedLocation(location)

            const userLocalStorage = localStorage.getItem("user");
            const parsedUser = userLocalStorage
              ? JSON.parse(userLocalStorage)
              : null;
            const res = await dispatch(duplicateFiles({sourceKey:selectedFile?.Key,location:location,docId:id}))
        await dispatch(getUserFiles({ userId: user.id,token: parsedUser.accessToken, })).unwrap();
          }}
     
        />
      )}
    </div>
  );
}
