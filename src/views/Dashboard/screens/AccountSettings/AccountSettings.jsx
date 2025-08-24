import React, { useEffect, useRef, useState } from "react";
import styles from "./AccountSettings.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactComponent as ArrowGray } from "../../assets/arrowDownGray.svg";
import { ReactComponent as ArrowLeft } from "../../assets/ArrowLeftWhite.svg";
import lock from "../../assets/greenLock.svg";
import SetupPayment from "./StripeComponents/SetupPayment";
import { getNextPaymentDate } from "../../utils/constants";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button/Button";
import EditableInput from "../../components/AccountSettings/EditableInput/EditableInput";
import PayMethod from "../../components/AccountSettings/PayMethod/PayMethod";

const stripePromise = loadStripe(
  "pk_test_51RN35zQ4aaP8AJy7HHcwnhM2EqrDNRyPWIohL4cTCQTV7xdeDcKjkYNrcY1yXZeDdcRaUIyupOujuQCgigStxkXZ001iU32eOG"
);
import { ReactComponent as IconGmail } from "../../assets/gmailwithoutbg.svg";
import { updateAccount, deleteAccount } from "@src/actions/user";
import { getAllUserAutomations } from "@src/actions/automate";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
import { getAllInvoices, getAllInvoicesById } from "../../../../actions/user";

const AccountSettings = ({
  showAccountSettings,
  setShowAccountSettings,
}) => {
  const { t } = useTranslation("userSetting");
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("0,20€ / 20.000");
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [invoices,setInvoices] = useState([])
  useEffect(() => {
    const fetchInvoices = async () => {
      const res = await dispatch(getAllInvoicesById({id:showAccountSettings._id}));
      setInvoices(res?.payload?.invoices)
    };
  
    fetchInvoices();
  }, []); // opcional incluir 'dispatch' en dependencias
  
  

  const [editFields, setEditFields] = useState({
    companyName: false,
    email: false,
    phoneNumber: false,
    cif: false,
    address: false,
    emergencyContact: false,
    tokenGPT: false,
  });

  const [fieldValues, setFieldValues] = useState({
    email: "",
    phoneNumber: "",
    companyName: "",
    VatId: "",
    address: "",
    emergencyContact: "",
    tokenGPT: "",
  });

  const categoriesTitles = {
    companyName: t("name"),
    email: t("email"),
    phoneNumber: t("phone"),
    VatId: t("vatId"),
    address: t("address"),
    emergencyContact: t("emergencyContact"),
    tokenGPT: t("tokenGpt"),
  };

  const placeholdersValues = {
    companyName: t("placeholderName"),
    email: t("placeholderEmail"),
    phoneNumber: t("placeholderPhone"),
    VatId: t("placeholderVatId"),
    address: t("placeholderAddress"),
    emergencyContact: t("placeholderEmergencyNumer"),
    tokenGPT: t("tokenGpt"),
  };

  const { user } = useSelector((state) => state.user);

  const [tokenEmail, setTokenEmail] = useState(""); 
  const [tokenPassword, setTokenPassword] = useState(""); 
  const [tokenGPT, setTokenGPT] = useState(""); 
  const [host, setHost] = useState(""); 
  const [port, setPort] = useState(""); 
  const [tokenUser, setTokenUser] = useState(""); 
  const [tokenUserPassword, setTokenUserPassword] = useState(""); 
  const [firstTag, setFirstTag] = useState(""); 
  const [secondTag, setSecondTag] = useState(""); 
  const [thirdTag, setThirdTag] = useState(""); 
  const [fourthTag, setFourthTag] = useState(""); 
  const [isPaymentConfigured, setIsPaymentConfigured] = useState(false); 

  const formattIdAccount = user?.id.split("_")[2];

  const inputRefs = useRef({});

  const toggleEdit = (field) => {
    setEditFields((prev) => {
      const newState = { ...prev, [field]: !prev[field] };

      if (!prev[field]) {
        setTimeout(() => {
          inputRefs.current[field]?.focus();
        }, 0);
      }

      return newState;
    });
  };
  const handleChange = ({ name, newValue }) => {
    setFieldValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAddAccount = () => {
    const isEmpty = (value) => !value || value.trim() === "";

    const requiredFields = {
      ...fieldValues,
      tokenEmail,
      tokenPassword,
      tokenGPT,
      host,
      port,
      tokenUser,
      tokenUserPassword,
      firstTag,
      selectedOption,
      accountId: formattIdAccount,
      ...(showAccountSettings?.id && { id: showAccountSettings.id }),
    };

    const emailQueries = [firstTag, secondTag, thirdTag, fourthTag].filter(
      (item) => item && item.length > 0
    );

    let finalData = {
      ...requiredFields,
      isPaymentConfigured,
      emailQueries,
    };

    if (paymentId && isPaymentConfigured) {
      finalData.paymentMethodId = paymentId;
    }

    const nextPaymentDate = getNextPaymentDate();
    finalData.nextPaymentDate = nextPaymentDate;

    dispatch(updateAccount({data:finalData}));


    alert("Cliente agregado satisfactoriamente!");
  };

  const handleDeleteAccount = async () => {
    const res = await dispatch(
      deleteAccount({
        id: showAccountSettings.id,
      })
    );

    setShowAccountSettings(false);
  };

  const handleTogglePayment = (e) => {
    setIsPaymentConfigured(e.target.checked);
    if (e.target.checked) {
      setShowStripeModal(true);
    }
  };

  const [automations, setAutomations] = useState([]);

  const fnAutomations = async () => {
    const resp = await dispatch(
      getAllUserAutomations({ userId: showAccountSettings.id })
    );
    if (resp.payload) {
      setAutomations(resp.payload);
    }
  };

  useEffect(() => {
    if (showAccountSettings) {
      fnAutomations();

      setFieldValues({
        nombre: showAccountSettings.nombre || "",
        email: showAccountSettings.email || "",
        phoneNumber: showAccountSettings.phoneNumber || "",
        VatId: showAccountSettings.VatId || "",
        address: showAccountSettings.address || "",
        emergencyContact: showAccountSettings.emergencyContact || "",
        tokenGPT: showAccountSettings.tokenGPT || "",
        referralCode: showAccountSettings.referralCode || "",
        payMethod: showAccountSettings.payMethod || "",
      });



    }
  }, [showAccountSettings]);


  return (
    <div>
      <Elements stripe={stripePromise}>
        <div className={styles.container}>
          {showStripeModal && (
            <SetupPayment
              onClose={() => setShowStripeModal(false)}
              setPaymentId={setPaymentId}
            />
          )}
          <div className={styles.HeaderUserSetting}>
            <div className={styles.headerLeft}>
              <div
                className={styles.arrowGreen}
                onClick={() => setShowAccountSettings(false)}
              >
                <ArrowLeft className={styles.arrowGreenIcon} />
              </div>
              {t("admin")} <ArrowGray className={styles.arrowHeaderGray} />{" "}
              {t("newRegistration")}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                type={"white"}
                action={() => setShowAccountSettings(false)}
              >
                {t("cancel")}
              </Button>
              <Button action={handleAddAccount}>
                {showAccountSettings?.id ? t("update") : t("buttonActive")}
              </Button>
              {showAccountSettings?.id && (
                <Button action={handleDeleteAccount}>{t("delete")}</Button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "40px", height: "100%" }}>
            <div className={styles.leftSection}>
              <div className={styles.c}>
                <div className={styles.faqItem}>
                  <DynamicTable
                      columns={[
                        {
                          label: 'Estado',
                          key: 'label'
                        }
                      ]}
                    data={invoices}
                    renderRow={(invoice) => {
                      return (
                        <tr>
<td></td>
                        <td>
                          <span>{invoice.status}</span>
                        </td>
                        </tr>
                      )
                    }}
                  />
                
                  {paymentId && <span>{paymentId}</span>}
                  <p>{t("titleRight1")}</p>
                  <span>{t("subTitle1")}</span>
                </div>
                <div className={styles.faqItem}>
                  <img src={lock} alt="Lock" />
                  <p>{t("titleRight2")}</p>
                  <span>{t("subTitle2")}</span>
                </div>
              </div>
            </div>

            <div className={styles.rightSection}>
              <div className={styles.detailsContainer}>
        
                <div className={styles.detailItem}>
                  <EditableInput
                    label={t("name")}
                    value={fieldValues?.nombre}
                    name="nombre"
                    onSave={handleChange}
                    placeholder={t("placeholderName")}  
                    customStyles={styles.noPadding}
                  />
                </div>
                <div className={styles.detailItem}>
                  <EditableInput
                    label={t("email")}
                    value={fieldValues?.email}
                    name="email"
                    onSave={handleChange}
                    placeholder={t("placeholderEmail")}
                    customStyles={styles.noPadding}
                  />
                </div>
                <PayMethod userData={fieldValues} setUserData={setFieldValues}/>
                <div className={styles.detailItem}>
                  <EditableInput
                    label={t("referralCode")}
                    value={fieldValues?.referralCode}
                    name="referralCode"
                    onSave={handleChange}
                    placeholder={t("placeholderReferralCode")}
                    customStyles={styles.noPadding}
                  />
                </div>

                <div className={styles.detailItem}>
                  <EditableInput
                    label={t("phone")}
                    value={fieldValues?.phoneNumber}
                    name="phoneNumber"
                    onSave={handleChange}
                    placeholder={t("placeholderPhone")}
                    customStyles={styles.noPadding}
                  />
                </div>

                <div className={styles.detailItem}>
                  <EditableInput
                    label={t("vatId")}
                    value={fieldValues?.VatId}
                    name="VatId"
                    onSave={handleChange}
                    placeholder={t("placeholderVatId")}
                    customStyles={styles.noPadding}
                  />
                </div>

                <div className={styles.detailItem}>
                  <EditableInput
                    label={t("address")}
                    value={fieldValues?.address}
                    name="address"
                    onSave={handleChange}
                    placeholder={t("placeholderAddress")}
                    customStyles={styles.noPadding}
                  />
                </div>

                <div className={styles.detailItem}>
                  <EditableInput
                    label={t("emergencyContact")}
                    value={fieldValues?.emergencyContact}
                    name="emergencyContact"
                    onSave={handleChange}
                    placeholder={t("placeholderEmergencyNumer")}
                    customStyles={styles.noPadding}
                  />
                </div>

                <div className={styles.detailItem}>
                  <EditableInput
                    label={t("tokenGPT")}
                    value={fieldValues?.tokenGPT}
                    name="tokenGPT"
                    onSave={handleChange}
                    placeholder={t("tokenGpt")}
                    customStyles={styles.noPadding}
                  />
                </div>
               
              </div>
              {automations.length > 0 && (
                <div className={styles.automationsContainer}>
                  <h2 className={styles.title}>{t("automations")}</h2>
                  <div className={styles.automationsWrapper}>
                    {automations.map((automation, index) => (
                      <div className={styles.automationItem} key={index}>
                        <div>
                          {automation.type === "Gmail" && <IconGmail />}
                        </div>
                        <div>
                          <b>{automation.inputValue}</b>
                          <p>{automation.type}</p>
                        </div>
                        <button>{t("delete")}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Elements>
      <div
        className={styles.bgModal}
        onClick={() => setShowAccountSettings(false)}
      ></div>
    </div>
  );
};

export default AccountSettings;
