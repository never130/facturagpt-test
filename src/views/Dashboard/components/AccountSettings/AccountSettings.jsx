import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AccountSettings.module.css";

import { useTranslation } from "react-i18next";
import SeeHistory from "../SeeHistory/SeeHistory";
import { useDispatch, useSelector } from "react-redux";
import EditableInput from "./EditableInput/EditableInput";
import { updateAccount } from "../../../../actions/user";
import { uploadFiles } from "../../../../actions/scaleway";
import { useNavigate } from "react-router-dom";
import LogoSelector from "../LogoSelector/LogoSelector";
import { resizeImage } from "../../../../utils/resizeImage";
import DropdownFlags from "../GeneralSettings/components/DropdownFlags/DropdownFlags";
import PayMethod from "./PayMethod/PayMethod";
import ProfileModalTemplate from "../ProfileModalTemplate/ProfileModalTemplate";
import DetailsBillLabel from "../InfoContact/DetailsBillLabel/DetailsBillLabel";

const AccountSettings = ({ userData, setUserData, initialUserData, token,setShowAddPayMethodPopup,setDefaultPayMethod,setDeletePayMethods }) => {
  const { t } = useTranslation("accountSetting");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);

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

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file) setIsSaveButtonVisible(true);
    const currentPath =
      type === "corporativeLogos"
        ? "corporativeLogos/"
        : type === "signatureImages"
          ? "signatureImages/"
          : "profileImages/";
    const resizedImage = await resizeImage(file);

    dispatch(uploadFiles({ files: [resizedImage], currentPath }))
      .unwrap()
      .then((uploadResponse) => {
        (`UPLOAD RESPONSE for ${type}`, uploadResponse);
        const uploadedItem = uploadResponse[0];
        const newLocation = uploadedItem?.Location;

        if (type === "profileImage") {
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

  const [seeHistory, setSeeHistory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [editingPhone, setEditingPhone] = useState(false);
  const [facturacionInputs, setFacturacionInputs] = useState([
    {
      direccion: t("address"),
      poblacion: t("population"),
      provincia: t("province"),
      codigoPostal: t("zipCode"),
      pais: t("country"),
      editable: false,
    },
  ]);
  const [addingPhone, setAddingPhone] = useState(false);


  const handleChange = ({ name, newValue }) => {
    const updatedData = { ...userData, [name]: newValue };
    setUserData(updatedData);

    setIsSaveButtonVisible(
      JSON.stringify(updatedData) !== JSON.stringify(initialUserData)
    );
  };


  const changeCountry = useCallback(
    (country) => {
      setUserData((prevUserData) => ({
        ...prevUserData,
        countryCode: country,
      }));
    },
    [setUserData]
  );

  const [payMethod, setPaymethod] = useState({});

  useEffect(() => {
    setPaymethod(userData.payMethod);
  }, [userData]);

  const [billingDetails, setBillingDetails] = useState([]);
  const [selectedCurrentPaymentMethond, setSelectedCurrentPaymentMethod] =
    useState(user?.payMethod?.paymentMethod || "gPay");

  const [cardNumber, setCardNumber] = useState(
    user?.payMethod?.cardNumber || ""
  );
  const [expirationDate, setExpirationDate] = useState(
    user?.payMethod?.expirationDate || ""
  );
  const [securityCode, setSecurityCode] = useState(
    user?.payMethod?.securityCode || ""
  );

  
  const handleSaveUpgrade = async () => {
    const userDataToSave = {
      payMethod: {
        paymentMethod: selectedCurrentPaymentMethond,
        cardNumber: cardNumber,
        expirationDate: expirationDate,
        securityCode: securityCode,
      },
      billingDetails: billingDetails,
    };


    dispatch(updateAccount({ data: userDataToSave }));

  };

  useEffect(() => {
    if (user?.billingDetails) {
      setBillingDetails([...user.billingDetails]);
    }
  }, [user]);

  
  const handleDeleteLogo = (urlToRemove, type) => {
    setUserData((prevData) => {
      if (type === "corporativeLogos") {
        return {
          ...prevData,
          corporativeLogos: prevData.corporativeLogos?.filter(
            (url) => url !== urlToRemove
          ),
        };
      } else if (type === "signatureImages") {
        return {
          ...prevData,
          signatureImages: prevData.signatureImages?.filter(
            (url) => url !== urlToRemove
          ),
        };
      }
      return prevData;
    });
  };
  
  return (
    <div className={styles.settingsProfile}>
      {seeHistory && user && (
        <div className={styles.seeHistoryContainer}>
          <SeeHistory
            setSeeHistory={setSeeHistory}
            seeHistory={seeHistory}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
          />
        </div>
      )}
      {userData && (
        <div className={styles.profile}>
          <div >
          <ProfileModalTemplate
            image={userData.profileImage}
            handleContactData={handleChange}
            id={userData._id}
            initials={true}
              letters={userData?.nombre.split(" ").map((letter) => letter[0])}
              customStyle={{
                height:"60px",
                width:"60px"
              }}
              camStyles={{
                padding:"0"
              }}
          />
          </div>
          <label style={{
            width:"100%"
          }}>
              <EditableInput
                label={t("fullName")}
                value={userData?.nombre}
                name="nombre"
                onSave={handleChange}
                placeholder={t("name")}
                customStyles={styles.noPadding}
              />
            </label>
        </div>
      )}

      {userData && (
        <div>
          <div className={styles.form}>
       

            <label className={styles.label}>
              <div className={styles.row}>
                <p>{t("phone")}</p>
                <div
                  className={styles.button}
                  onClick={() => {
                    setAddingPhone(true);
                    setEditingPhone((prev) => !prev);
                  }}
                >
                  {!addingPhone
                    ? t("add")
                    : !editingPhone
                      ? t("edit")
                      : t("save")}
                </div>
              </div>

              <div className={styles.phoneContainer}>
                {addingPhone ? (
                  <>
                    
                    <DropdownFlags
                      selectedCountry={userData?.countryCode}
                      setSelectedCountry={changeCountry}
                      editing={editingPhone}
                      type="country"
                    />
                    <input
                      type="text"
                      placeholder="000 000 000"
                      className={styles.numberInput}
                      name="phone"
                      value={userData?.phone || ""}
                      disabled={!editingPhone}
                      onChange={(e) =>
                        handleChange({
                          name: "phone",
                          newValue: e.target.value,
                        })
                      }
                    />
                  </>
                ) : (
                  <span
                    style={{
                      color: "#71717a",
                      marginTop: "10px",
                    }}
                  >
                    {t("unknown")}
                  </span>
                )}
              </div>
            </label>

      <PayMethod userData={userData} setUserData={setUserData} setShowAddPayMethodPopup={setShowAddPayMethodPopup} setDeletePayMethods={setDeletePayMethods} setDefaultPayMethod={setDefaultPayMethod}/>
      <DetailsBillLabel
            user={userData}
            billingDetails={billingDetails}
            setBillingDetails={setBillingDetails}
            handleSave={handleSaveUpgrade}
          />
            <label>
              <EditableInput
                placeholder={t("unknow")}
                label={t("taxNumber")}
                value={userData?.fiscalNumber}
                name="fiscalNumber"
                onSave={handleChange}
                oneRow={true}
                customStyles={styles.noPadding}
              />
            </label>

            <label>
              <EditableInput
                placeholder={t("unknow")}
                label={t("corporativeWebsite")}
                initialValue={user?.userDomain || ""}
                value={userData?.userDomain}
                name="userDomain"
                onSave={handleChange}
                customStyles={styles.noPadding}
              />
            </label>
            <LogoSelector
              buttonDown={false}
              text={t("corporateLogo")}
              logos={userData?.corporativeLogos}
              selectedLogo={userData?.selectedCorporativeLogo}
              onAddLogo={() => handleAddImageClick("corporativeLogos")}
              onDeleteLogo={(url) => handleDeleteLogo(url,'corporativeLogos')}
              onSelectLogo={(logo) =>
                handleChange({
                  name: "selectedCorporativeLogo",
                  newValue: logo,
                })
              }
              fileInputRef={corporativeFileInputRef}
              onFileChange={(e) => handleFileChange(e, "corporativeLogos")}
            />

            <LogoSelector
              buttonDown={false}
              text={t("signature")}
              logos={userData?.signatureImages}
              selectedLogo={userData?.selectedSignatureImage}
              onAddLogo={() => handleAddImageClick("signatureImages")}
              onDeleteLogo={(url) => handleDeleteLogo(url,'signatureImages')}
              onSelectLogo={(logo) =>
                handleChange({ name: "selectedSignatureImage", newValue: logo })
              }
              fileInputRef={signatureFileInputRef}
              onFileChange={(e) => handleFileChange(e, "signatureImages")}
            />

           
           
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
