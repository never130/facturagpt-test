import React, { useEffect, useRef, useState } from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import * as XLSX from "xlsx";
import profilePlus from "./assets/profilePlus.svg";
import circuit from "./assets/circuit.svg";
import openEmail from "./assets/openEmail.svg";
import profiles from "./assets/profiles.svg";
import analyticsIcon from "./assets/analyticsIcon.svg";
import greenArrow from "./assets/greenArrow.svg";
import redArrow from "./assets/redArrow.svg";
import { ReactComponent as DownloadIcon } from "./assets/downloadIconGray.svg";
import { ReactComponent as IconDownload } from "./assets/icon-download.svg";
import { ReactComponent as IconUpload } from "./assets/icon-upload.svg";
import KIcon from "./assets/KIcon.svg";
import Button from "./components/Button/Button";

import { createSetupIntent } from "../../actions/stripe";
import { getStatsPolling } from "../../actions/automate";

import IconProcess from "./assets/icon-process.svg";
import IconTask from "./assets/icon-tasks.svg";
import IconPerformance from "./assets/icon-performance.svg";

import visa from "./assets/visaPayment.png";
import mastercard from "./assets/mastercardPayment.png";
import americanexpress from "./assets/americanExpressPayment.png";
import paypal from "./assets/paypalPayment.png";
import gpay from "./assets/gPayment.png";
import metamask from "./assets/metamaskPayment.png";
import coinbase from "./assets/coinbasePayment.png";
import creditCard from "./assets/creditCardIcon.png";
import {
  deleteAccount,
  getAllAccounts,
  getBackup,
  getImageAccunt,
  updateAccount,
  updateAcount,
  uploadBackup,
  processBackupImport,
} from "../../actions/user";

import { useDispatch, useSelector } from "react-redux";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import Payment from "./screens/AccountSettings/StripeComponents/Payment";
import SetupPayment from "./screens/AccountSettings/StripeComponents/SetupPayment";
import AccountSettings from "./screens/AccountSettings/AccountSettings";

import { setPaginationSlice } from "../../slices/paginationSlices";
import PaginationTables from "./components/PaginationTables/PaginationTables";
import SearchIconWithIcon from "./components/SearchIconWithIcon/SearchIconWithIcon";
import FiltersDropdownContainer from "./components/FiltersDropdownContainer/FiltersDropdownContainer";
import DynamicTable from "./components/DynamicTable/DynamicTable";
import OptionsPopup from "./components/OptionsPopup/OptionsPopup";
import DeleteAccountModal from "./components/DeleteAccountModal/DeleteAccountModal";
import DeleteChatAgents from "./components/DeleteChatAgents/DeleteChatAgents";

const AccountsDashboard = () => {
  const { t } = useTranslation("dashboard");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const { accounts, loading, account, totalAccounts, totalValue, user } = useSelector(
    (state) => state.user
  );
  const { user: userRedux } = useSelector((state) => state.user);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { contactLimitSlice, contactPageSlice } = useSelector(
    (state) => state.pagination
  );
  const [limit, setLimit] = useState(
    (contactLimitSlice && contactLimitSlice) || 20
  );
  const [page, setPage] = useState((contactPageSlice && contactPageSlice) || 0);

  const searchInputRef = useRef(null);
  const [localAccounts, setLocalAccounts] = useState([]);
  const [localTotalAccounts, setLocalTotalAccounts] = useState();
  const [showPopupCharge, setShowPopupCharge] = useState(false)

  useEffect(() => {
    setLocalTotalAccounts(totalAccounts);
  }, [totalAccounts]);

  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z",
    statusLastInvoice: "all",
    tokenPaid: 'Mayor a menor'

  });

  const [lastSelectedOption, setLastSelectedOption] = useState(null)

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
      name: "statusLastInvoice",
      label: t("statusLastInvoice"),
      subOptions: [
        { display: t("all"), value: "all" },
        { display: t("succeeded"), value: "succeeded" },
        { display: t("failed"), value: "failed" },
      ],
    },

    {
      name: "tokenPaid",
      label: t("tokenPaid"),
      subOptions: [
        { display: t("higherToLower"), value: "Mayor a menor" },
        { display: t("lowerToHigher"), value: "Menor a mayor" },
      ],
    },


  ];




  const [showPaymentModal, setShowPaymentModal] = useState();
  const [showSetPaymentModal, setShowSetPaymentModal] = useState();
  const [clientIdForPaymentSetup, setClientIdForPaymentSetup] = useState();
  const [amountToPay, setAmountToPay] = useState();
  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [swiped, setSwiped] = useState(false);
  const [allAssetsInfo, setAllAssetsInfo] = useState([]);
  const [accountSelected, setAccountSelected] = useState([]);
  const [accountsInfoSelecteds, setAccountsInfoSelecteds] = useState([])
  const dynamicTableRef = useRef(null);
  const popupButtonRef = useRef([]);


  const [showDeleteAccounts, setShowDeleteAccounts] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [backupStats, setBackupStats] = useState(null)
  const [backupData, setBackupData] = useState(null)
  const [importing, setImporting] = useState(false)



  const fn = async () => {
    const response = await dispatch(
      getAllAccounts({
        search: searchTerm,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"],
        sortStatusLastInvoice: selectedOption.statusLastInvoice,
        sortTokenPaid: selectedOption.tokenPaid,
        lastSelectedOption
      })
    );

    if (response.payload) {
      setLocalAccounts(response.payload.accounts);
      setLocalTotalAccounts(response.payload.total);
      setFilteredAccounts(response.payload.accounts);

    }
  };

  useEffect(() => {
    fn();
  }, [limit, page, searchTerm, selectedOption]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (showImportModal) {
        if (event.key === 'Y' || event.key === 'y') {
          event.preventDefault();
          handleConfirmImport();
        } else if (event.key === 'C' || event.key === 'c') {
          event.preventDefault();
          handleCancelImport();
        }
      }
    };

    if (showImportModal) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showImportModal, backupData]);



  const [stats, setStats] = useState([
    {
      icon: IconProcess,
      title: `# Procesos`,
      value: 0,
    },
    {
      icon: IconTask,
      title: `# Tareas`,
      value: 0,
    },
    {
      icon: IconPerformance,
      title: `# Rendimiento`,
      value: 0,
    },
    {
      icon: profiles,
      title: `# ${t("clients")}`,
      value: 0,
      change: "16%",
      isPositive: true,
      toUserPermission: true,
    },
    {
      icon: profilePlus,
      title: `# ${t("plusClients")}`,
      value: 0,
      change: "16%",
      isPositive: false,
    },
    {
      icon: profilePlus,
      title: `# ${t("proClients")}`,
      value: 0,
      change: "16%",
      isPositive: false,
    },
    {
      icon: profilePlus,
      title: `# ${t("enterpriseClients")}`,
      value: 0,
      change: "16%",
      isPositive: false,
    },
    {
      icon: analyticsIcon,
      title: t("eurGenerated"),
      change: "16%",
      isPositive: true,
      value: 0,
      currency: "EUR",
    },
  ]);

  useEffect(() => {
    if (!localAccounts) return;

    setFilteredAccounts(localAccounts);
  }, [localAccounts, searchQuery, selectedOption]);

  useEffect(() => {
    const renderStats = async () => {
      let clientPlus = 0;
      let clientPro = 0;
      let clientEnterprise = 0;

      for (const account of localAccounts) {

        if (account.tokenMonth > 100) {
          clientEnterprise++;
        } else if (account.tokenMonth > 50) {
          clientPro++;
        } else if (account.tokenMonth > 20) {
          clientPlus++;
        }
      }



      let valueProcessed = 0;
      let valueTasks = 0;
      let valuePerformance = 0;


      const respStatsPolling = await dispatch(getStatsPolling())


      if (respStatsPolling.payload && respStatsPolling.payload.success) {
        valueProcessed = respStatsPolling.payload.metrics.activeProcesses;
        valueTasks = respStatsPolling.payload.metrics.totalTasks;
        valuePerformance = respStatsPolling.payload.metrics.averageLoad;
      }


      const valueMap = {
        0: valueProcessed,
        1: valueTasks,
        2: valuePerformance,
        3: localTotalAccounts,
        4: clientPlus,
        5: clientPro,
        6: clientEnterprise,
        7: totalValue,
      };

      setStats((prevStats) =>
        prevStats.map((stat, index) =>
          valueMap.hasOwnProperty(index)
            ? { ...stat, value: valueMap[index] }
            : stat
        )
      );
    };

    if (localAccounts?.length) {
      renderStats();
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  useEffect(() => {
    if (userRedux) {
      if (userRedux?.role === "user") {
        navigate("/panel");
      }
    }
  }, [userRedux]);

  const handlePay = async () => {
    await dispatch(createSetupIntent())
    fn()
  };

  const tableHeaders = [
    { label: t("tableCol1"), key: "tableCol1" },
    { label: t("pin"), key: "pin" },
    { label: t("paymethod"), key: "paymethod" },
    { label: t("statusLastInvoice"), key: "statusLastInvoice" },
    { label: t("monthly"), key: "monthly" },
    { label: t("total"), key: "total" },
  ];

  const handleActions = (e, rowIndex, contact) => {
    e.stopPropagation();
    setSelectedRowIndex(selectedRowIndex === rowIndex ? null : rowIndex);
  };
  const selectAllAccounts = () => {
    if (accountSelected.length === filteredAccounts.length) {
      setAccountSelected([]);
      setAllAssetsInfo([]);
      setAccountsInfoSelecteds([])
    } else {
      const allAccountIndexes = filteredAccounts.map((account) => account._id);
      setAllAssetsInfo(filteredAccounts);
      setAccountsInfoSelecteds(filteredAccounts)
      setAccountSelected(allAccountIndexes);
    }
  };

  const toggleSelection = (id) => { };

  const handleClick = (row) => {
    dispatch(
      setPaginationSlice({ contactLimitSlice: limit, contactPageSlice: page })
    );
  };
  const selectAccount = (rowIndex, account) => {
    setAccountSelected((prevItem) => {
      if (prevItem.includes(account._id)) {
        return prevItem.filter((i) => i !== account._id);
      } else {
        return [...prevItem, account._id];
      }
    });
    setAccountsInfoSelecteds([...accountsInfoSelecteds, account])
  };

  const toggleAccountSelection = async () => { };


  const handleDeleteAccount = () => {
    accountSelected.forEach(account => {
      dispatch(deleteAccount({ id: account }));
    });
    setAccountSelected([]);
    setAccountsInfoSelecteds([])
  };

  const handleExportAccount = () => {
    if (!accountsInfoSelecteds || !accountsInfoSelecteds.length) return;


    const formattedData = accountsInfoSelecteds.map(acc => ({
      Nombre: acc.email,
      tokenGPT: acc.tokenGPT,
      tokenMonth: acc.tokenMonth,
      tokenTotal: acc.tokenTotal,

    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Cuentas");
    XLSX.writeFile(workbook, "cuentas.xlsx");
  }


  const [imageError, setImageError] = useState(false);


  const paymentMethodIcons = {
    visa: <div className={styles.paymentMethodIconsContainer}>
      <img src={visa} alt="Visa" />
    </div>,
    creditCard: <div className={styles.paymentMethodIconsContainer}>
      <img src={mastercard} alt="Mastercard" />
    </div>,
    paypal: <div className={styles.paymentMethodIconsContainer}><img src={paypal} alt="Paypal" /></div>,
    gPay: <div className={styles.paymentMethodIconsContainer}><img src={gpay} alt="GPay" /></div>,
    crypto: <div className={styles.paymentMethodIconsContainer}>
      <img src={metamask} alt="Metamask" />
      <img src={coinbase} alt="Coinbase" />
    </div>,
  };

  const renderRow = (row, index, onSelect) => (
    <tr
      key={index}
      className={styles.optionsTr}
      onClick={() => handleClick(row)}
    >
      <td
        style={{
          position: selectedRowIndex === index && "static",
        }}
      >
        <div className={styles.optionsTd}>
          <div className={styles.inputWrapperHover}>
            <input
              type="checkbox"
              name="accountSelected"
              onChange={() => toggleAccountSelection()}
              onClick={(e) => {
                e.stopPropagation();
                selectAccount(index, row);
              }}
              checked={accountSelected.includes(row._id) ? true : false}
            />
            <div className={styles.inputContainer}></div>
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
                left: popupButtonRef.current[index].getBoundingClientRect()
                  .left,
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
                    setNewContact(false);
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
              ]}
            />
          </div>
        )}
      </td>
      <td>
        <div className={styles.name}>
          <div className={styles.infoProfilesContainer}>
            <div>
              {row?.profileImage && !imageError ? (
                <img
                  className={styles.profileImage}
                  src={row.profileImage}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={styles.initials}>
                  {row?.nombre?.split(" ").map((word) => word[0] || "U")}
                </div>
              )}
            </div>
            <span onClick={() => setShowAccountSettings(row)}>
              {row?.email}
            </span>
          </div>
        </div>
      </td>
   

      <td >
        {" 1234"}
        {row?.referralCode || ""}
      </td>
      <td className={styles.paymentMethodCell}>
        {(() => {
          const defaultMethod = row?.payMethod?.find(
            (method) => method?.default === true
          );
          const methodToUse = defaultMethod || row.payMethod?.[0];

          if (!methodToUse) return null;

          const Icon =
            paymentMethodIcons[methodToUse.type] || null;

          return (
            <div className={styles.paymentMethodInfo}>
              <div className={styles.iconAndType}>
                <span className={styles.icon}>{Icon}</span>
              </div>

              <div className={styles.cardInfo}>
                <span className={styles.last4}>•••••••• {methodToUse.last4}</span>
                <span className={styles.expiry}>
                  {methodToUse.exp_month}/{methodToUse.exp_year}
                </span>
              </div>
            </div>
          );
        })()}
      </td>

      <td>
        <span className={`${styles[row?.statusLastInvoice]} ${styles.statusLastInvoice}`}>{t(row?.statusLastInvoice)}</span>
      </td>

      <td>{parseFloat(row?.tokenTotal || 0).toFixed(2)}€</td>
      <td>{parseFloat(row?.tokenMonth || 0).toFixed(2)}€</td>

    </tr>
  );

  const onExportAccount = async () => {
    const response = await dispatch(getBackup())
  }



  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const fileContent = e.target.result;
        const response = await dispatch(uploadBackup(fileContent));

        if (response.payload && response.payload.success) {
          setBackupStats(response.payload.stats);
          setBackupData(response.payload.backupData);
          setShowImportModal(true);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error al procesar el archivo');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (!backupData) return;

    setImporting(true);
    try {
      const response = await dispatch(processBackupImport(backupData));

      if (response.payload && response.payload.success) {
        setShowImportModal(false);
        setBackupStats(null);
        setBackupData(null);
        fn();
      }
    } catch (error) {
      console.error('Error importing backup:', error);
      alert('Error durante la importación');
    } finally {
      setImporting(false);
    }
  };

  const handleCancelImport = () => {
    setShowImportModal(false);
    setBackupStats(null);
    setBackupData(null);
  };

  return (
    <div className={styles.container}>
      {showPaymentModal && amountToPay && (
        <Payment
          onClose={() => setShowPaymentModal(false)}
          amountToPay={amountToPay}
          clientId={showPaymentModal}
        />
      )}
      {showSetPaymentModal && clientIdForPaymentSetup && (
        <SetupPayment
          onClose={() => setShowSetPaymentModal(false)}
          clientId={clientIdForPaymentSetup}
        />
      )}



      <div className={styles.tableSection}>
        <div className={styles.tableTopContainer}>
          <div
            className={styles.tableHeaderContainer}
            style={{ alignItems: "normal" }}
          >
            <h1 className={styles.tableTitle}>{t("trackingAndStatuses")} </h1>
            <div className={styles.buttonContainerTableTop}>

              {userRedux?.role !== "user" && (
                <Button
                  className={styles.changeTabButton}
                  action={() => navigate("/admin/users")}
                >
                  {t("goToUsers")}
                </Button>
              )}

              {userRedux?.role === "superadmin" && (
                <Button
                  className={styles.addClientButton}
                  action={() => setShowPopupCharge(true)}
                >
                  Cobrar
                </Button>
              )}

              {true && (
                <div className={styles.buttonContainerTableTop1}>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="backup-file-input"
                  />
                  <label htmlFor="backup-file-input" style={{ cursor: 'pointer' }}>
                    <Button
                      type="white"
                      action={() => {
                        const fileInput = document.getElementById('backup-file-input');
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      headerStyle={{ padding: "6px 10px" }}
                    >
                      <IconDownload />
                    </Button>
                  </label>
                  <Button
                    type="white"
                    action={() => onExportAccount()}
                    headerStyle={{ padding: "6px 10px" }}
                  >
                    <IconUpload />
                  </Button>
                </div>
              )}

              {accountSelected?.length >= 1 && (
                <>
                  <Button
                    type="white"
                    action={() => setShowDeleteAccounts(true)}
                    headerStyle={{ padding: "6px 10px" }}
                  >
                    {t("delete")}
                  </Button>
                  <Button
                    type="white"
                    action={handleExportAccount}
                    headerStyle={{ padding: "6px 10px" }}
                  >
                    <DownloadIcon />
                  </Button></>
              )}
            </div>
          </div>
          <div></div>
          <div className={styles.filtersTableTop}>
            {localTotalAccounts > 20 && (

              <PaginationTables
                totalData={localTotalAccounts}
                limit={limit}
                page={page}
                setPage={setPage}
                setLimit={setLimit}
              />
            )}

            <div>
              <SearchIconWithIcon
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                ref={searchInputRef}
              >
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
                    setLastSelectedOption={setLastSelectedOption}
                  />
                </>
              </SearchIconWithIcon>
            </div>
          </div>
        </div>

        <div
          className={styles.statsContainer}
          onClick={() => setShowSidebar(false)}
        >
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div
                onClick={() =>
                  stat.toUserPermission && navigate("/usersPermissions")
                }
                className={styles.iconWrapper}
              >
                <img src={stat.icon} alt={stat.title} />
              </div>
              {stat.multiple ? (
                stat.multiple.map((item, index) => (
                  <div
                    style={{ paddingRight: "10px" }}
                    className={styles.statContent}
                  >
                    <span className={styles.statTitle}>{item.title}</span>

                    {item.change && (
                      <span
                        className={`${styles.statChange} ${item.isPositive ? styles.positive : styles.negative}`}
                      >
                        {item.isPositive ? (
                          <img src={greenArrow} alt={item.title} />
                        ) : (
                          <img src={redArrow} alt={item.title} />
                        )}
                        {`${item.change}`}
                        <span style={{ color: "#292D32" }}>
                          {t("thisMonth")}
                        </span>
                      </span>
                    )}
                    <h2 className={styles.statValue}>
                      {item.value} {item.currency}
                    </h2>
                    {stat.emails && (
                      <span
                        className={`${styles.statChange} ${styles.positive}`}
                      >
                        <MdOutlineMarkEmailRead size={25} color={"#16c098"} />
                        {`${localAccounts?.map((account) => account?.processedEmails?.length).reduce((a, b) => a + b, 0)} ${t("processedMails")}`}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.statContent}>
                  <span className={styles.statTitle}>{stat.title}</span>

                  {stat.change && (
                    <span
                      className={`${styles.statChange} ${stat.isPositive ? styles.positive : styles.negative}`}
                    >
                      {stat.isPositive ? (
                        <img src={greenArrow} alt={stat.title} />
                      ) : (
                        <img src={redArrow} alt={stat.title} />
                      )}
                      {`${stat.change}`}
                      <span style={{ color: "#292D32" }}>{t("thisMonth")}</span>
                    </span>
                  )}
                  <h2 className={styles.statValue}>
                    {stat.value} {stat.currency}
                  </h2>
                  {stat.emails && (
                    <span className={`${styles.statChange} ${styles.positive}`}>
                      <MdOutlineMarkEmailRead size={25} color={"#16c098"} />
                      {`${localAccounts?.map((account) => account?.processedEmails?.length).reduce((a, b) => a + b, 0)} ${t("processedMails")}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <DynamicTable
          columns={tableHeaders}
          ref={dynamicTableRef}
          data={filteredAccounts || []}
          renderRow={renderRow}
          selectedIds={accountSelected}
          onSelectAll={selectAllAccounts}
          onSelect={toggleSelection}
        />
      </div>
      {showPopupCharge &&
        <DeleteChatAgents
          user={user}
          setDeleteChats={setShowPopupCharge}
          handleDeleteCategory={handlePay}
          deleteCategory={""}
          type={'accounts'}
          setVariant={() => { }}
        />}

      {showDeleteAccounts && (
        <DeleteAccountModal
          setShowDeleteAccounts={setShowDeleteAccounts}
          accountSelected={accountSelected}
          user={userRedux}
          setAccountSelected={setAccountSelected}
          setAccountsInfoSelecteds={setAccountsInfoSelecteds}
        />
      )}
      {showAccountSettings && (
        <AccountSettings
          showAccountSettings={showAccountSettings}
          setShowAccountSettings={setShowAccountSettings}
        />
      )}
      {showImportModal && backupStats && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 style={{ marginBottom: '0px' }}>Confirmar Importación</h2>
            <div className={styles.statsContainerImport}>
              <p><strong>Estadísticas del archivo de backup:</strong></p>
              <ul className={styles.statsContainerImportList}>
                <li>
                  <div>
                    <b> {backupStats.totalUsers} </b>
                    <span>
                      {backupStats.usersWithAutomations}
                    </span>
                  </div>
                  User
                </li>
                <li>
                  <div>

                    <b> {backupStats.totalAutomations} </b>
                    <span>
                      {'-'}
                    </span>
                  </div>
                  Auto
                </li>
                <li>
                  <div>

                    <b> {backupStats.totalAuths} </b>
                    <span>
                      {backupStats.usersWithAuths}
                    </span>
                  </div>
                  Auths
                </li>
              </ul>
            </div>
            <p><strong>¿Desea continuar con la importación?</strong></p>
            <p>Los usuarios existentes no serán modificados, solo se crearán los nuevos.</p>
            <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
              Atajos de teclado: Presiona Y para confirmar, C para cancelar
            </p>
            <div className={styles.modalButtons}>
              <Button
                type="white"
                action={handleCancelImport}
                disabled={importing}
                headerStyle={{ padding: "6px 10px" }}
              >
                Cancelar (C)
              </Button>
              <Button
                action={handleConfirmImport}
                disabled={importing}
                headerStyle={{ padding: "6px 10px" }}
              >
                {importing ? 'Importando...' : 'Confirmar (Y)'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default AccountsDashboard;
