import { MoreVertical } from "lucide-react";
import styles from "./Preview.module.css";
import { useEffect, useRef, useState } from "react";
import sendMail from "../../assets/sendMail.svg";
import moveToFolder from "../../assets/moveToFolderIcon.svg";
import printIcon from "../../assets/printIcon.svg";
import addNoteGray from "../../assets/addNoteBlack.svg";
import downloadIconUpdated from "../../assets/downloadIconUpdated.svg";
import doubleIcon from "../../assets/doubleIcon.svg";
import shareDiagonalIcon from "../../assets/shareDiagonalIcon.svg";
import gestionaEsPublico from "../../assets/gestionaEsPublicoIcon.svg";
import stripeIcon from "../../assets/stripeIconText.svg";
import winIcon from "../../assets/winIcon.svg";
import KIcon from "../../assets/KIcon.svg";
import imageIcon from "../../assets/imageIcon.svg";
import AiIcon2 from "../../assets/AIcon.svg";
import whatsapp from "../../assets/WhatsappOutlineWhite.svg";
import SendEmailModal from "../SendEmailModal/SendEmailModal";
import SeeBill from "./SeeBill/SeeBill";
import Button from "../Button/Button";
import EditableRow from "./EditableRow/EditableRow";
import EditableInput from "../AccountSettings/EditableInput/EditableInput";
import { ReactComponent as InfoPanelIcon } from "../../assets/infoPanelIcon.svg";
import { ReactComponent as OptionDots } from "../../assets/optionDots.svg";
import { ReactComponent as EditCode } from "../../assets/editCode.svg";
import { ReactComponent as ArrowLeftTextBlack } from "../../assets/ArrowLeftTextBlack.svg";
import { ReactComponent as LockIcon } from "../../assets/WhiteLock.svg";
import { ReactComponent as CheckedIconGreen } from "../../assets/checkGreenIcon.svg";
import { ReactComponent as EditCodeRays } from "../../assets/editCodeRays.svg";
import { ReactComponent as CheckedGreenLockBlackIcon } from "../../assets/checkedGreenLockBlackIcon.svg";
import { ReactComponent as LittleIconStateStripePending } from "../../assets/littleIconStateStripePending.svg";
import { ReactComponent as LittleIconStateStripeDue } from "../../assets/littleIconStateStripeDue.svg";
import { ReactComponent as LittleIconStateStripePaid2 } from "../../assets/littleIconStateStripePaid2.svg";
import { ReactComponent as LittleIconStateStripeDefaulted2 } from "../../assets/littleIconStateStripeDefaulted2.svg";
import { ReactComponent as LittleIconStateStripeVoided2 } from "../../assets/littleIconStateStripeVoided2.svg";
import wolters from "../../assets/wolters-icon.svg";
import qrCodeExample from "../../assets/qrCodeExample.png";
import agenciaTributaria from "../../assets/agenciaTributariaCircle.svg";
import AddDiscount from "../AddDiscount/AddDiscount";
import AddTax from "../AddTax/AddTax";
import LogoSelector from "../LogoSelector/LogoSelector";
import { useDispatch, useSelector } from "react-redux";
import { changeLocation, getUserFiles, uploadFiles } from "../../../../actions/scaleway";
import SelectLocation from "../SelectLocation/SelectLocation";
import MoveToFolder from "../MoveToFolder/MoveToFolder";
import PanelAutomate from "../Automate/panelAutomate/PanelAutomate";
import SearchIconWithIcon from "../SearchIconWithIcon/SearchIconWithIcon";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { ReactComponent as StripeText } from "../../assets/stripePurple.svg";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import CurrencyDropdownBtn from "../CurrencyDropdownBtn/CurrencyDropdownBtn";
import SelectCurrencyPopup from "../SelectCurrencyPopup/SelectCurrencyPopup";
import { AutomateDataComponent } from "../Automate/utils/automatesJson.js";
import CardAutomate from "../Automate/Components/CardAutomate/CardAutomate";
import OptionsPopup from "../OptionsPopup/OptionsPopup.jsx";
import BeforeApprovingPopup from "../BeforeApprovingPopup/BeforeApprovingPopup.jsx";
import ApproveDocument from "../ApproveDocument/ApproveDocument.jsx";
import WantCancelDocument from "../WantCancelDocument/WantCancelDocument.jsx";
import CancelDocument from "../CancelDocument/CancelDocument.jsx";
import QRCodeGenerator from "../QRCodeGenerator/QRCodeGenerator.jsx";
import { useNavigate, useParams } from "react-router-dom";
import DynamicTable from "../DynamicTable/DynamicTable";
import { formatAgoDate } from "../../../../utils/agoDateUtil"

import {
  fetchFiles,
  fetchMetadataPDF,
  fetchPDF,
  getPdfBase64,
  getUniqueFileWithPDFBase64,
  handleFileUpload,
} from '../../../../utils/pdfUtils.js';
import { getOneDocsById, updateDoc } from '../../../../actions/docs.js';
import { useTranslation } from 'react-i18next';
import { setCurrentPath } from '../../../../slices/scalewaySlices.js';
import ModalStatesDoc from '../modalStatesDoc/ModalStatesDoc.jsx';
import {
  saveQRConfig,
  selectQRConfig,
  saveQRConfigToDb,
  saveSelectedQRConfigToDb
} from '../../../../redux/slices/qrCodeSlice';
let documentoPDF;



import * as pdfjsLib from 'pdfjs-dist/build/pdf';

const workerUrl = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();


try {
  documentoPDF = require('../../assets/pdfs/document.pdf');
} catch (error) {
  console.warn('El archivo document.pdf no existe:', error.message);
  documentoPDF = null;
}

const ButtonActionsWithText = ({
  children,
  classStyle,
  click,
  disabledValue,
}) => {
  return (
    <button className={classStyle} onClick={click} disabled={disabledValue}>
      {children}
    </button>
  );
};
const DocumentPreview = ({
  document,
  handleAddNote,
  setHasNote,
  customStyles,
  setEditingNote,
  setShowInfoMobileBill,
  setMobileSelectedDocument,
  createdNote,
  setCreatedNote,
  noteColor,
  editorContentFinal,
  setEditorContentFinal,
  selectedCurrency,
  setSelectedCurrency,
  setSwiped,
  isNewBill = false,
  stateDoc,
  setStateDoc,
  selectedFileS3,
}) => {
  const [t] = useTranslation('Preview');
  const [options, setOptions] = useState(0);
  const [showMovetoFolder, setShowMovetoFolder] = useState(false);
  const [mailModal, setMailModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [seeBill, setSeeBill] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [statesStripe, setStatesStripe] = useState([]);
  const [stateStripe, setStateStripe] = useState('Pagado');
  const [showStatesStripes, setShowStatesStripes] = useState(false);
  const [currentIdDoc, setCurrentIdDoc] = useState();

  const colorMap = {
    [t('Paid')]: '#009F7A',
    [t('pending')]: '#FF9D00',
    [t('defaulted')]: '#FF5500',
    [t('due')]: '#C5221F',
    [t('voided')]: '#8A0300',
  };

  const optionsName = [
    t('Paid'),
    t('pending'),
    t('defaulted'),
    t('due'),
    t('voided'),
  ];

  const [selectedColor, setSelectedColor] = useState(colorMap[optionsName[0]]);


  const [localIcon, setIcon] = useState(0);

  const [selectedAutomationData, setSelectedAutomationData] = useState(null);
  const dispatch = useDispatch();
  const [isModalAutomate, setIsModalAutomate] = useState(false);
  const [file, setFile] = useState(null);

  const { currentPath, userFiles, getFilesLoading, uploadingFilesLoading } =
    useSelector((state) => state.scaleway);

  const [showSelectLocation, setShowSelectLocation] = useState(false);


  useEffect(() => {
    if (user && !currentPath) {
      dispatch(setCurrentPath(user.id + '/'));
    }
  }, [user, selectedFileS3]);

  const changeFileLocation = async () => {
    const key = selectedFileS3?.Key;
    if (!key) return;

    const parts = key.split('/');
    const fileName = parts[parts.length - 1];

    await dispatch(
      changeLocation({
        oldKey: selectedFileS3?.Key,
        newKey: XMLConfiguration?.filesSource + fileName,
      })
    ).unwrap();
  };

  const [typeContentAutomate, setTypeContentAutomate] = useState('');
  const handleCloseNewClient = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTypeContentAutomate(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleShowContentAutomate = (type, automationData) => {
    setTypeContentAutomate(type);
    setSelectedAutomationData(automationData);
  };

  const { id } = useParams();

  const [XMLConfiguration, setXMLConfiguration] = useState({
    filesSource: currentPath + 'Inicio/',
    folderLocation: '/Inicio/',
  });

  const handleShare = () => {
    const fileUrl = `${window.location.origin}/view/${id}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Check out this file',
          text: 'Have a look at this file',
          url: fileUrl,
        })
        .catch((err) => {
          console.error('Error sharing:', err);
        });
    } else {
      navigator.clipboard.writeText(fileUrl).then(
        () => {
          alert('Link copied to clipboard!');
        },
        (err) => {
          console.error('Failed to copy link:', err);
        }
      );
    }
  };
  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, 'k');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const actions = [
    {
      text: t('share'),
      icon: shareDiagonalIcon,
      click: () => {
        handleShare();
      },
    },
    {
      text: t('duplicate'),
      icon: doubleIcon,
      click: () => {
        setShowSelectLocation(true);
      },
    },
    {
      text: t('sendMail'),
      icon: sendMail,
      click: () => {
        setMailModal(true);
      },
    },
    {
      text: t('download'),
      icon: downloadIconUpdated,
      click: () => {
        const link = document.createElement('a');
        link.href = documentoPDF;
        link.download = 'archivo.pdf';
        link.click();
      },
    },
    {
      text: t('addNote'),
      icon: addNoteGray,
      click: () => {
        handleAddNote();
        setEditingNote(false);
      },
    },
    {
      text: t('moveFolder'),
      icon: moveToFolder,
      type: 'default',
      click: () => {
        setShowMovetoFolder(true);
      },
    },
    {
      text: t('print'),
      action: 'Descargar',
      icon: printIcon,
      type: 'small',
      click: () => {
        const printWindow = window.open(documentoPDF, '_blank');
        printWindow.onload = () => {
          printWindow.print();
        };
      },
    },
  ];

  const Actions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const data = AutomateDataComponent();
    const [dataFilter, setDataFilter] = useState(data || newData);
    const handleDataFilter = (searchTerm) => {
      const filteredData = data.filter((card) =>
        card.automateName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDataFilter(filteredData);
    };

    useEffect(() => {
      if (searchTerm === '') {
        setDataFilter(data || newData);
      } else {
        handleDataFilter(searchTerm);
      }
    }, [searchTerm]);



    return (
      <div className={styles.buttonActionsContainer}>
        {actions.map((action) => {
          if (action.componente) {

            return action.componente;
          } else if (action.action === 'Descargar') {
            return (
              <a
                href={pdfUrl && documentoPDF}
                download='Factura'
                key={action.text}
                className={!pdfUrl && styles.linkDisabled}
              >
                <img src={action.icon} alt='icon' />
                {action.text}
              </a>
            );
          } else {
            return (
              <ButtonActionsWithText
                key={action.text}
                classStyle={`${action.text ? styles.btnWithText : action.classOption} ${styles.btnAutomation}`}
                click={action.click}
                disabledValue={action.text !== t('addNote') && !pdfUrl}
                type={action.type}
              >
                <img
                  src={action.icon}
                  alt='icon'
                  style={{
                    width:
                      action.type === 'small'
                        ? '25px'
                        : action.type !== 'default'
                          ? '15px'
                          : undefined,
                    height:
                      action.type === 'small'
                        ? '25px'
                        : action.type !== 'default'
                          ? '15px'
                          : undefined,
                  }}
                />
                {action.text}
              </ButtonActionsWithText>
            );
          }

        })}
        <SearchIconWithIcon
          ref={searchInputRef}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          classNameIconRight={styles.searchContainerL}
          onClickIconRight={() => setIsFilterOpen(true)}
          placeholder={t('searchAutomations')}
          stylesComponent={{ padding: '0' }}
        >
          <>
            <div
              style={{ marginLeft: '5px' }}
              className={styles.searchIconsWrappers}
            >
              <img src={KIcon} alt='kIcon' />
            </div>
          </>
        </SearchIconWithIcon>

        {dataFilter
          .sort((a, b) => b.available - a.available)
          .filter((card) => card.role === 'output')
          .map((card) => (
            <CardAutomate
              fromPanel={true}
              key={card.id}
              type={card.type}
              name={card.automateName}
              image={card.image}
              available={card.available}
              contactType={card.contactType}
              typeContent={handleShowContentAutomate}
              description={card.description}
              data_contain_styles={{ width: '100%' }}
            />
          ))}
      </div>
    );
  };

  const Details = () => {
    const [t] = useTranslation('Preview');
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const corporativeFileInputRef = useRef(null);
    const signatureFileInputRef = useRef(null);
    const profileFileInputRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const [userData, setUserData] = useState({
      selectedSignatureImage: '',
      selectedCorporativeLogo: '',
    });

    const handleAddImageClick = (type) => {
      if (type === 'corporativeLogos' && corporativeFileInputRef.current) {
        corporativeFileInputRef.current.click();
      }
      if (type === 'signatureImages' && signatureFileInputRef.current) {
        signatureFileInputRef.current.click();
      }
      if (type === 'profileImage' && profileFileInputRef.current) {
        profileFileInputRef.current.click();
      }
    };

    const handleFileChange = (e, type) => {
      const file = e.target.files[0];
      if (!file) return;
      const currentPath =
        type === 'corporativeLogos'
          ? 'corporativeLogos/'
          : type === 'signatureImages'
            ? 'signatureImages/'
            : 'profileImages/';

      dispatch(uploadFiles({ files: [file], currentPath }))
        .unwrap()
        .then((uploadResponse) => {
          const uploadedItem = uploadResponse[0];
          const newLocation = uploadedItem?.Location;

          if (type === 'profileImage') {
            setUserData({
              ...userData,
              profileImage: newLocation,
            });
          } else {
            const updatedArray = [...(userData?.[type] || []), newLocation];
            setUserData({
              ...userData,
              [type]: updatedArray,
            });
          }
        })
        .catch((error) => {
          console.error(`Error uploading new ${type.slice(0, -1)}:`, error);
        });
    };
    const handleChange = ({ name, newValue }) => {
      setUserData({ ...userData, [name]: newValue });
    };

    const [beforeApproveDocument, setBeforeApproveDocument] = useState(false);
    const [approveDocument, setApproveDocument] = useState(false);
    const [wantCancelDocument, setWantCancelDocument] = useState(false);
    const [cancelDocument, setCancelDocument] = useState(false);

    const documents = [
      {
        img: wolters,
        status: 'Aceptado',
        statusClass: styles.acceptedDoc,
        hasOptions: true,
      },
      {
        img: agenciaTributaria,
        status: 'Anulado',
        statusClass: styles.canceledDoc,
        hasOptions: false,
      },
    ];
    const [openPopupIndex, setOpenPopupIndex] = useState(null);

    const togglePopup = (index) => {
      setOpenPopupIndex(openPopupIndex === index ? null : index);
    };

    const handlePercentageChange = async (
      value,
      field,
      isPercentage = false
    ) => {
      setStateDoc((prev) => {
        const subtotal = prev.subtotal || 0;
        const parsedValue = parseFloat(value);

        if (!value || isNaN(parsedValue)) {
          return prev;
        }

        const updatedDoc = { ...prev };

        let computedValue;
        let computedPercentage;

        if (isPercentage) {
          computedValue = Number(((parsedValue / 100) * subtotal).toFixed(2));
          computedPercentage = Number(parsedValue.toFixed(2));
        } else {
          computedValue = Number(parsedValue.toFixed(2));
          computedPercentage = Number(
            ((parsedValue / subtotal) * 100).toFixed(2)
          );
        }
        updatedDoc[field] = computedValue;

        if (field === 'discount') {
          updatedDoc.discountPercentage = computedPercentage;
        } else if (field === 'tax') {
          updatedDoc.taxPercentage = computedPercentage;
        }

        const discount =
          field === 'discount' ? computedValue : prev.discount || 0;
        const tax = field === 'tax' ? computedValue : prev.tax || 0;
        const effectiveSubtotal =
          field === 'subtotal' ? computedValue : subtotal;
        const total = field === 'total' ? computedValue : prev.total || 0;

        if (field === 'total') {
          updatedDoc.subtotal = Number((total + discount - tax).toFixed(2));
        } else if (['discount', 'tax', 'subtotal'].includes(field)) {
          updatedDoc.total = Number(
            (effectiveSubtotal - discount + tax).toFixed(2)
          );
        }

        saveToBackend(updatedDoc);
        return updatedDoc;
      });
    };

    const saveToBackend = async (updatedDoc) => {
      try {
        await dispatch(
          updateDoc({
            docId: updatedDoc._id,
            updates: updatedDoc,
          })
        );

        const response = await dispatch(
          getOneDocsById({ docId: updatedDoc._id })
        );
        if (response.payload) {
          setStateDoc(response.payload.doc);
        }
      } catch (err) {
        console.error('Error actualizando el documento:', err);
      }
    };

    const tableHeaders = [
      { label: t('Logo'), key: 'Logo' },
      { label: t('state'), key: 'state' },
      { label: t('date'), key: 'date' },
    ];

    const icons = [
      <LittleIconStateStripePaid2 />,
      <LittleIconStateStripePending />,
      <LittleIconStateStripeDefaulted2 />,
      <LittleIconStateStripeDue />,
      <LittleIconStateStripeVoided2 />,
    ];

    const colorsIndex = ['#009F7A', '#FF9D00', '#FF5500', '#C5221F', '#8A0300'];


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

    useEffect(() => {
      const fn = async () => {
        if (!isNewBill) {
          const response = await dispatch(getOneDocsById({ docId: id }));
          const state = response?.payload?.doc?.statesDoc;
          if (currentIdDoc !== response?.payload?.doc?._id) {
            if (state?.length > 0) {
              setStatesStripe(state);
              setSelectedColor(colorMap[optionsName[state[0].state]]);
              setStateStripe(optionsName[state[0].state]);
              setIcon(state[0].logo);
              setCurrentIdDoc(response?.payload?.doc?._id);
            } else {
              setCurrentIdDoc(response?.payload?.doc?._id);
              setStatesStripe([]);
              setSelectedColor(colorMap[optionsName[0]]);
              setStateStripe(optionsName[0]);
              setIcon(0);
            }
          }
        }
      };
      fn();
    }, []);









    const renderRow = (row, index) => (
      <tr key={index}>
        <td>{icons[row.logo]}</td>
        <td style={{ color: `${colorsIndex[row.state]}` }}>{optionsName[row.state]}</td>
        <td>{row.createdAt ? formatAgoDate({ dateString: row.createdAt, t }) : ""}
        </td>
        <td>{row.createdAt ? formatAgoDate({ dateString: row.createdAt, t }) : ''}</td>
      </tr>
    );

    return (
      <div className={styles.detailsContainer}>
        <div className={styles.detailsContent}>
          <div className={styles.containerEditableInput}>
            <div className={styles.state}>
              <p>{t('state')}</p>
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
            {statesStripe.length > 0 && (
              <DynamicTable
                columns={tableHeaders}
                data={statesStripe}
                renderRow={renderRow}
                hideCheckbox={true}
                limit={2}
                icons={icons}
                setShowStatesStripes={setShowStatesStripes}
                states={optionsName}
              />
            )}

            <Button action={() => setBeforeApproveDocument(true)}>
              <LockIcon /> {t('approveDocument')}
            </Button>

            <div
              className={styles.documentCanceledTag}
              onClick={() => setCancelDocument(true)}
            >
              {t('canceledDocument')}
            </div>
            <EditableRow
              name={t('subtotal')}
              type='subtotal'
              value={stateDoc?.subtotal}
              onValueChange={handlePercentageChange}
              isReadOnly={true}
            />
            <EditableRow
              name={t('discount')}
              type='discount'
              value={stateDoc?.discount}
              onValueChange={handlePercentageChange}
              isReadOnly={false}
              isPercentage={true}
              percentValue={stateDoc?.discountPercentage}
              action={() => setShowDiscountModal(true)}
            />
            <EditableRow
              name={t('tax')}
              type='tax'
              value={stateDoc?.tax}
              onValueChange={handlePercentageChange}
              isReadOnly={false}
              isPercentage={true}
              percentValue={stateDoc?.taxPercentage}
              action={() => setShowTaxModal(true)}
            />
            <EditableRow
              name={t('total')}
              type='total'
              value={stateDoc?.total}
              onValueChange={handlePercentageChange}
              isReadOnly={true}
            />
          </div>

          <div className={styles.containerEditableInput}>
            <EditableInput label={t('bill')} placeholder='0001' />
            <EditableInput
              label={t('purchaseOrder')}
              placeholder={t('optional')}
            />
            <EditableInput label={t('date')} placeholder='25 Dec 2025' />
            <EditableInput
              label={t('expirationDate')}
              placeholder='25 Dec 2025'
            />
          </div>
          <div className={styles.containerEditableInput}>
            <EditableInput
              label={t('termsAndMethodsPayment')}
              placeholder={t('exampleTermsAndMethod')}
              isTextarea={true}
              value={stateDoc?.termsAndMethodsPayment}
              name={'termsAndMethodsPayment'}
              onSave={(value) => {
                setStateDoc((prev) => ({
                  ...prev,
                  termsAndMethodsPayment: value.newValue,
                }));
              }}
              limit={500}
              showLimit={true}
            />
          </div>
          <div className={styles.logoSelectorContainer}>
            <LogoSelector
              text={t('corporateLogo')}
              logos={userData?.corporativeLogos}
              selectedLogo={userData?.selectedCorporativeLogo}
              onAddLogo={() => handleAddImageClick('corporativeLogos')}
              onSelectLogo={(logo) =>
                handleChange({
                  name: 'selectedCorporativeLogo',
                  newValue: logo,
                })
              }
              fileInputRef={corporativeFileInputRef}
              onFileChange={(e) => handleFileChange(e, 'corporativeLogos')}
              buttonDown={true}
            />

            <LogoSelector
              text={t('signature')}
              logos={userData?.signatureImages}
              selectedLogo={userData?.selectedSignatureImage}
              onAddLogo={() => handleAddImageClick('signatureImages')}
              onSelectLogo={(logo) =>
                handleChange({ name: 'selectedSignatureImage', newValue: logo })
              }
              fileInputRef={signatureFileInputRef}
              onFileChange={(e) => handleFileChange(e, 'signatureImages')}
              buttonDown={true}
            />
          </div>

          <div className={styles.qrContainer}>
            <div className={styles.qrHeader}>
              <p>{t('qrIdentification')}</p>
              <button>{t('copy')}</button>
            </div>
            <QRCodeGenerator
              url={`https://facturagpt.com/admin/panel/${id}`}
              onSave={handleSaveQRConfig}
              onSelect={handleSelectQRConfig}
              selectedConfig={selectedConfig}
            />
          </div>
          <div className={styles.btnTemplateContainer}>
            <Button
              type='white'
              headerStyle={{
                fontWeight: '500',
                width: '100%',
                alignItem: 'center',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                padding: '8px',
              }}
              action={() => navigate('/contact')}
            >
              <EditCode /> {t('editHtml')} <EditCodeRays />
            </Button>
            {showDiscountModal && (
              <AddDiscount
                showDiscountModal={showDiscountModal}
                setShowDiscountModal={setShowDiscountModal}
                isAnimating={isAnimating}
                setIsAnimating={setIsAnimating}
                setDiscountQuantity={setStateDoc}
                handlePercentageChange={handlePercentageChange}
              />
            )}
            {showTaxModal && (
              <AddTax
                setShowTaxModal={setShowTaxModal}
                showTaxModal={showTaxModal}
                isAnimating={isAnimating}
                setIsAnimating={setIsAnimating}
                setTaxQuantity={setStateDoc}
                handlePercentageChange={handlePercentageChange}
              />
            )}

            {beforeApproveDocument && (
              <BeforeApprovingPopup
                setBeforeApproveDocument={setBeforeApproveDocument}
                setApproveDocument={setApproveDocument}
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

            {showStatesStripes && (
              <ModalStatesDoc
                tableHeaders={tableHeaders}
                statesStripe={statesStripe}
                renderRow={renderRow}
                icons={icons}
                setShowStatesStripes={setShowStatesStripes}
                optionsName={optionsName}
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
          </div>
        </div>
      </div>
    );
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;
  const [showSelectCurrencyPopup, setShowSelectCurrencyPopup] = useState(false);
  const [showNotesOptions, setShowNotesOptions] = useState(false);

  const [currentId, setCurrentId] = useState(id?.replace(/^"|"$/g, ''));
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfName, setPdfName] = useState(null);
  const [pdfType, setPdfType] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [errorLoadingPdf, setErrorLoadingPdf] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  useEffect(() => {
    setCurrentId(id);
  }, [id]);

  const fetchPdfAndSetId = async () => {
    setLoadingPdf(false);
    setErrorLoadingPdf(false);
    setPdfUrl(null);
    setPdfName(null);
    setPdfType(null);
    if (currentId) {
      const cleanId = currentId.replace(/^"|"$/g, '');
      const pdf = await getPdfBase64(cleanId);
      const url = await fetchPDF(cleanId);
      const fileWithETag = await getUniqueFileWithPDFBase64(cleanId);
      const metadataFiles = await fetchMetadataPDF(cleanId);

      const originalFilename = metadataFiles?.filename || metadataFiles?.documentTitle;
      const parts = originalFilename?.split('-');
      const realFilename = parts?.slice(1).join('-');

      if (!url) {
        setErrorLoadingPdf(true);
      }

      setLoadingPdf(true);
      setTimeout(() => {
        setPdfUrl(pdf?.data?.pdfBase64 || fileWithETag?.data?.pdfBase64 );
        setPdfName(realFilename);
        setPdfType(metadataFiles?.type);
        setLoadingPdf(false);
      }, 200);
    }
  };
  useEffect(() => {
    fetchPdfAndSetId();
  }, [currentId]);

  const handleDropFiles = async (event, ETag) => {
    event.preventDefault();
    const files = event.dataTransfer
      ? Array.from(event.dataTransfer.files)
      : Array.from(event.target.files);

    const pdfFiles = files.filter((file) => file.type === 'application/pdf');

    if (pdfFiles.length > 0) {
      try {
        for (const file of pdfFiles) {
          await handleFileUpload(file, ETag);
        }
        fetchPdfAndSetId();
      } catch (error) {
        console.error('Error al subir archivo(s):', error);
      }
    } else {
      console.warn('No se ha soltado un archivo PDF');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleDropFiles(event, currentId);
  };

  const { selectedConfig } = useSelector((state) => state.qrCode);

  const handleSaveQRConfig = (config) => {
    dispatch(saveQRConfig(config));
  };

  const handleSelectQRConfig = async (config) => {
    dispatch(selectQRConfig(config));


    if (id) {
      try {
        await dispatch(updateDoc({
          docId: id,
          updates: {
            qrConfig: config
          }
        }));
      } catch (error) {
        console.error('Failed to save selected QR config to document:', error);
      }
    }
  };







  const embedRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!file && !pdfUrl) return;

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    let loadingTask;
    (async () => {
      try {
        const src = file ? URL.createObjectURL(file) : pdfUrl;
        loadingTask = pdfjsLib.getDocument(src);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const vp = page.getViewport({ scale: 1});

        const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = vp.width;
      canvas.height = vp.height;

      await page.render({ canvasContext: context, viewport:vp }).promise;
    
        setDimensions({ width: vp.width, height: vp.height });
      } catch (e) {
        console.error('Error midiendo PDF:', e);
      }
    })();

    return () => {
      if (loadingTask) loadingTask.destroy();
      if (file) URL.revokeObjectURL(pdfUrl);
    };
  }, [file, pdfUrl]);



  return (
    <div className={styles.container} style={customStyles}>
      {isMobile && (
        <>
          <div className={styles.headerBillMobile}>
            {!isNewBill ? (
              <button
                onClick={() => {
                  setMobileSelectedDocument(false);
                  setSwiped(true);
                }}
              >
                <ArrowLeftTextBlack /> {t('back')}
              </button>
            ) : (
              <span></span>
            )}
            <div className={styles.notesHeaderBillMobile}>
              {createdNote && (
                <div className={`${styles.note} ${styles[noteColor]}`}>
                  <div
                    className={styles.text}
                    onClick={() => {
                      handleAddNote();
                      setEditingNote(true);
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: editorContentFinal }}
                    ></span>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  handleAddNote();
                  setEditingNote(false);
                }}
              >
                +{t('addNote')}
              </button>
              <OptionDots
                className={styles.verticalOptionDots}
                onClick={() => setShowNotesOptions((prev) => !prev)}
              />
              {showNotesOptions && (
                <div className={styles.optionsPopupContainer}>
                  <OptionsPopup
                    close={setShowNotesOptions}
                    options={[
                      {
                        label: t('delete'),
                        onClick: () => {
                          setEditorContentFinal('');
                          setHasNote(false);
                          setCreatedNote(false);
                          setShowNotesOptions(false);
                        },
                      },
                      {
                        label: t('duplicate'),
                        onClick: () => {
                          setShowNotesOptions(false);
                        },
                      },
                      {
                        label: t('print'),
                        onClick: () => {
                          if (!createdNote) return;
                          setShowNotesOptions(false);
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>Nota</title>
                                <style>
                                  body { font-family: Arial, sans-serif; padding: 20px; background:${noteColor} }
                                </style>
                              </head>
                              <body>
                                ${editorContentFinal}
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        },
                      },
                      {
                        label: t('quickActions'),
                        onClick: () => {
                          setShowNotesOptions(false);
                        },
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
          <header className={styles.header}>
            <div className={styles.titleWrapper}>
              <div className={styles.titleContent}>
                <img src={imageIcon} alt='icon' />
                <input
                  type='text'
                  placeholder={t('documentTitle')}
                  className={styles.title}
                />
              </div>
            </div>
            <div className={styles.dropdownCurrencyContainer}>
              <div className={styles.dropdownContainer}></div>
              <CurrencyDropdownBtn
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
              />
            </div>
          </header>
          <Button
            action={() => setShowInfoMobileBill(true)}
            headerStyle={{
              background: 'transparent',
              color: '#B4B4B4',
              border: ' 1px solid rgba(0, 0, 0, 0.10)',
              margin: '10px 0',
            }}
          >
            <InfoPanelIcon />
            {t('info')}
          </Button>
        </>
      )}
      <>
        {' '}
        {pdfUrl ? (
          <div ref={containerRef} className={styles.seeBillContainer} style={{
            display: 'flex',
            justifyContent: 'center',     
            alignItems: 'center',         
            height: '93vh',              
            width: '100%',
          }} >
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />;
            <div
              className={styles.seeBillContent}
              onClick={() => {
                setFile(null);
                setSeeBill(true);
              }}
            >
              {t('viewPreview')}
            </div>
          </div>
        ) : loadingPdf ? (
          <div className={styles.centedText}>{t('loading')}</div>
        ) : (
          errorLoadingPdf && (
            <div
              className={styles.centedText}
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                cursor: 'pointer',
                padding: '20px',
                border: '2px dashed #ccc',
              }}
            >
              <span style={{ maxWidth: '280px' }}>
                {t('invoiceDoesntContainFile')}
              </span>
              <input
                type='file'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(event) => handleDropFiles(event, currentId)}
              />
            </div>
          )
        )}
      </>

      {showSelectLocation && (
        <SelectLocation onClose={() => setShowSelectLocation(false)} />
      )}
      {showMovetoFolder && (
        <MoveToFolder
          setShowMovetoFolder={setShowMovetoFolder}
          showMovetoFolder={showMovetoFolder}
          configuration={XMLConfiguration}
          setConfiguration={setXMLConfiguration}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          changeFileLocation={changeFileLocation}
        />
      )}


      {mailModal && (
        <SendEmailModal
          setMailModal={setMailModal}
          mailModal={mailModal}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          currentId={currentId}
          pdfUrl={pdfUrl}
          setSeeBill={setSeeBill}
          file={file}
          setFile={setFile}
          pdfName={pdfName}
          pdfType={pdfType}
        />
      )}
      {seeBill && (
        <SeeBill
          pdfUrl={pdfUrl}
          file={file}
          setSeeBill={setSeeBill}
          setMailModal={setMailModal}
        />
      )}
      {showSelectCurrencyPopup && (
        <SelectCurrencyPopup
          setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
          setSelectedCurrency={setSelectedCurrency}
          selectedCurrency={selectedCurrency}
        />
      )}
    </div>
  );
};

export default DocumentPreview;
