import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './DocSection.module.css'
import LogoSelector from '../../LogoSelector/LogoSelector'
import { uploadFiles } from '@src/actions/scaleway';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import QRCodeGenerator from '../../QRCodeGenerator/QRCodeGenerator';
import { useParams } from 'react-router-dom';
import EditableInput from '../../AccountSettings/EditableInput/EditableInput';
import DateInput from '../../Calendar/Calendar';
import { saveQRConfig, selectQRConfig } from '@src/slices/qrCodeSlice';
import { saveQRConfigToDb, saveSelectedQRConfigToDoc } from '@src/actions/docs';
import { updateDoc } from '../../../../../actions/docs';
import { InputCalendar } from '../../../screens/CalendarView/Calendar/components/InputCalendar';
import { CalendarContext, CalendarContextProvider } from '../../../screens/CalendarView/CalendarContext';

const DocSection = ({ stateDoc, setStateDoc }) => {
  const [t] = useTranslation("InfoBill");
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [test, setTest] = useState(false);
  const dispatch = useDispatch();
  const { selectedConfig } = useSelector((state) => state.qrCode);
  useEffect(() => {
    if (!user) return;
    if (test) return;
    const shouldUpdateCorporative =
      user?.corporativeLogos?.length > 0 && (!stateDoc?.corporativeLogos || stateDoc?.corporativeLogos.length === 0);

    const shouldUpdateSignature =
      user?.signatureImages?.length > 0 && (!stateDoc?.signatureImages || stateDoc?.signatureImages.length === 0);

    if (shouldUpdateCorporative || shouldUpdateSignature) {
      setStateDoc((prev) => ({
        ...prev,
        corporativeLogos: shouldUpdateCorporative ? user?.corporativeLogos : prev?.corporativeLogos,
        signatureImages: shouldUpdateSignature ? user?.signatureImages : prev?.signatureImages,
      }));
    }
  }, [user, stateDoc]);

  const handleDeleteLogo = async (urlToRemove, key) => {
    const currentArray = stateDoc?.[key] || [];
    const updatedArray = currentArray.filter((item) => item !== urlToRemove);

    const updatedDoc = {
      ...stateDoc,
      [key]: updatedArray,
    };

    setStateDoc(updatedDoc);

    await dispatch(updateDoc({
      docId: updatedDoc._id,
      updates: {
        [key]: updatedArray,
      },
    }));
  };


  const corporativeFileInputRef = useRef(null);
  const signatureFileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);

  const handleAddImageClick = (type) => {
    if (type === "corporativeLogos" && corporativeFileInputRef.current) {
      corporativeFileInputRef.current.click();
    }
    if (type === "signatureImages" && signatureFileInputRef.current) {
      signatureFileInputRef.current.click();
    }
    if (type === "profileImage" && profileFileInputRef.current) {
      profileFileInputRef.current.click();
    }
  };
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const currentPath =
      type === "corporativeLogos"
        ? "corporativeLogos/"
        : type === "signatureImages"
          ? "signatureImages/"
          : "profileImages/";

    dispatch(uploadFiles({ files: [file], currentPath }))
      .unwrap()
      .then(async (uploadResponse) => {
        const uploadedItem = uploadResponse[0];
        const newLocation = uploadedItem?.Location;

        if (type === "profileImage") {
          const updatedDoc = {
            ...stateDoc,
            profileImage: newLocation,
          };
          setStateDoc(updatedDoc);
          await dispatch(updateDoc({
            docId: updatedDoc._id,
            updates: { profileImage: newLocation },
          }));
        } else {
          const updatedArray = [...(stateDoc?.[type] || []), newLocation];

          const updatedDoc = {
            ...stateDoc,
            [type]: updatedArray,
          };

          setStateDoc(updatedDoc);

          await dispatch(updateDoc({
            docId: updatedDoc._id,
            updates: {
              [type]: updatedArray,
            },
          }));
        }
      })
      .catch((error) => {
        console.error(`Error uploading new ${type.slice(0, -1)}:`, error);
      });
  };
  const handleChange = ({ name, newValue }) => {
    setStateDoc({ ...stateDoc, [name]: newValue });
  };



  const [statusMessage, setStatusMessage] = useState('');

  const handleSaveQRConfig = async (config) => {

    const configWithName = {
      ...config,
      name: config.name || `Style ${new Date().toLocaleDateString()}`,
    };


    dispatch(saveQRConfig(configWithName));


    try {
      await dispatch(saveQRConfigToDb({ config: configWithName }));
      setStatusMessage('QR style saved successfully');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error saving QR config to database:', error);
      setStatusMessage('Error saving QR style');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  }; const handleSelectQRConfig = async (config) => {

    dispatch(selectQRConfig(config));

    if (id) {
      try {
        await dispatch(saveSelectedQRConfigToDoc({
          docId: id,
          config
        }));
        setStatusMessage('QR style applied to document');
        setTimeout(() => setStatusMessage(''), 3000);
      } catch (error) {
        console.error('Error saving selected QR config to document:', error);
        setStatusMessage('Error applying QR style to document');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    }
  };

  const qrCodeUrl = id ? `https://facturagpt.com/admin/panel/${id}` : null;

  const handleAddLogoAndUpdate = async (key) => {
    handleAddImageClick(key);

  };

  const handleDeleteLogoAndUpdate = async (url, key) => {
    handleDeleteLogo(url, key);


  };
  const handleDateTask = () => {

  }

  const {
    selectedDate,
  } = useContext(CalendarContext)
  useEffect(() => {

    setStateDoc((prev) => ({
      ...prev,
      expirationDate: selectedDate,
    }));

  }, [selectedDate])

  return (
    <div className={styles.DocSection}>
      <div className={styles.qrContainer}>
        <QRCodeGenerator
          url={qrCodeUrl}
          onSave={handleSaveQRConfig}
          onSelect={handleSelectQRConfig}
          selectedConfig={selectedConfig}
        />
        {statusMessage && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              backgroundColor: statusMessage.includes('Error') ? '#f8d7da' : '#d1e7dd',
              color: statusMessage.includes('Error') ? '#721c24' : '#155724',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
          >
            {statusMessage}
          </div>
        )}
      </div>


      <div className={styles.expirationDateContainer}>
        <p className={styles.expirationDateContent}><span>{t("expirationDate")}</span> </p>

        <InputCalendar
          handleDateTask={handleDateTask}
          fromKanban={false}

        />


      </div>
      <br />

      <EditableInput
        label={t("termsAndMethodsPayment")}
        placeholder={t("exampleTermsAndMethod")}
        isTextarea={true}
        value={stateDoc?.termsAndMethodsPayment || ''}
        name={'termsAndMethodsPayment'}
        onSave={(value) => {
          setStateDoc((prev) => ({
            ...prev,
            termsAndMethodsPayment: value.newValue,
          }));
        }}
        limit={500}
        showLimit={true}
        labelClassName={styles.labelName}
      />

      <LogoSelector
        text={t("corporateLogo")}
        logos={stateDoc?.corporativeLogos}
        selectedLogo={stateDoc?.selectedCorporativeLogo}
        onAddLogo={() => handleAddLogoAndUpdate("corporativeLogos")}
        onDeleteLogo={(url) => handleDeleteLogoAndUpdate(url, "corporativeLogos")}
        onSelectLogo={(logo) =>
          handleChange({ name: "selectedCorporativeLogo", newValue: logo })
        }
        fileInputRef={corporativeFileInputRef}
        onFileChange={(e) => handleFileChange(e, "corporativeLogos")}
        buttonDown={true}
        userLogos={true}
      />

      <LogoSelector
        text={t("signature")}
        logos={stateDoc?.signatureImages}
        selectedLogo={stateDoc?.selectedSignatureImage}
        onAddLogo={() => handleAddLogoAndUpdate("signatureImages")}
        onDeleteLogo={(url) => handleDeleteLogoAndUpdate(url, "signatureImages")}
        onSelectLogo={(logo) =>
          handleChange({ name: "selectedSignatureImage", newValue: logo })
        }
        fileInputRef={signatureFileInputRef}
        onFileChange={(e) => handleFileChange(e, "signatureImages")}
        buttonDown={true}
        userLogos={true}
      />


    </div>
  )
}

export default DocSection