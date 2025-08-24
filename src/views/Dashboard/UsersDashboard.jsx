import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

import styles from "./Dashboard.module.css";
import style from "./UsersDashboard.module.css";
import userTick from "./assets/profile-tick.svg";
import userPlus from "./assets/userPlus.svg";
import monitor from "./assets/monitor.svg";
import profilePlus from "./assets/profilePlus.svg";
import circuit from "./assets/circuit.svg";
import magnify from "./assets/magnify.svg";
import openEmail from "./assets/openEmail.svg";
import plus from "./assets/plus.svg";
import listIcon from "./assets/listIcon.svg";
import profiles from "./assets/profiles.svg";
import dbIcon from "./assets/dbIcon.svg";
import analyticsIcon from "./assets/analyticsIcon.svg";
import { ReactComponent as EyePassword } from "./assets/eyePassword.svg";
import { ReactComponent as EyePasswordSlash } from "./assets/eyePasswordSlash.svg";
import monitorIcon from "./assets/monitorIcon.svg";
import greenArrow from "./assets/greenArrow.svg";
import { ReactComponent as DownloadIcon } from "./assets/downloadIconGray.svg";
import redArrow from "./assets/redArrow.svg";
import SearchIconWithIcon from "./components/SearchIconWithIcon/SearchIconWithIcon";
import KIcon from "./assets/KIcon.svg";
import FiltersDropdownContainer from "./components/FiltersDropdownContainer/FiltersDropdownContainer";
import DynamicTable from "./components/DynamicTable/DynamicTable";
import Button from "./components/Button/Button";


import PaginationTables from "./components/PaginationTables/PaginationTables";

import { useNavigate } from "react-router-dom";
import {
  deleteAccount,
  getAllAccounts,
  getImageAccunt,
  updateAccount,
} from "../../actions/user";
import { useDispatch, useSelector } from "react-redux";

import { MdOutlineMarkEmailRead } from "react-icons/md";
import Payment from "./screens/AccountSettings/StripeComponents/Payment";
import { getPreviousPaymentDate, hasDatePassed } from "./utils/constants";
import { Elements } from "@stripe/react-stripe-js";
import SetupPayment from "./screens/AccountSettings/StripeComponents/SetupPayment";
import { loadStripe } from "@stripe/stripe-js";
import AccountSettings from "./screens/AccountSettings/AccountSettings";

import { useTranslation } from "react-i18next";
import AddAdminModal from "./components/AddAdminModal/AddAdminModal";
import DeleteAccountModal from "./components/DeleteAccountModal/DeleteAccountModal";
const UsersDashboard = () => {
  const { t } = useTranslation("dashboard");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const {
    user: userData,
    accounts,
    loading,
    totalAccounts,
  } = useSelector((state) => state.user);
  const { userAutomations } = useSelector((state) => state.automate);
  const [filteredAccounts, setFilteredAccounts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [accountSelected, setAccountSelected] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [accountsInfoSelecteds, setAccountsInfoSelecteds] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z",

  });

  const options = [
    {
      name: "Orden Alfabético",
      label: t("alphabeticOrder"),
      subOptions: [
        { display: "A-Z", value: "A-Z" },
        { display: "Z-A", value: "Z-A" },
      ],
    },


  ];

  const stats = [
    {
      key: "users",
      icon: profiles,
      title: `# ${t("users")}`,
      value: totalAccounts,
      change: "16%",

      isPositive: true,
      toUserPermission: true,
    },
    {
      key: "usersStatistics",
      icon: profilePlus,
      multiple: [
        {
          title: `# ${t("plusUsers")}`,
          value: 0,
          change: "1%",
          isPositive: false,
        },
        {
          title: `# ${t("proUsers")}`,
          value: 0,
          change: "1%",
          isPositive: false,
        },
        {
          title: `# ${t("enterpriseUsers")}`,
          value: 0,
          change: "1%",
          isPositive: false,
        },
      ],
    },
    {
      key: "recognitions",
      icon: monitorIcon,
      title: `# ${t("recognitions")}`,
      value: 0,
      change: "16%",
      isPositive: false,
    },
    {
      key: "income",
      icon: analyticsIcon,
      title: t("eurGenerated"),
      change: "16%",
      isPositive: true,
      value: 0,
      currency: "EUR",
    },
    {
      key: "storage",
      icon: dbIcon,
      title: "# GB",
      change: "16%",
      isPositive: true,
      value: 0,
      currency: "TB",
    },
  ];

  useEffect(() => {
    if (userData) {
      if (userData?.role === "user") {
        navigate("/admin/chat");
      }
    }
  }, [userData]);


  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);

  const fn = async () => {
    const response = await dispatch(
      getAllAccounts({
        search: searchQuery,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"], 
  
      })
    );

    if(response.payload){
      setFilteredAccounts(response.payload.accounts)
    }
  }
  useEffect(() => {
    fn()
  }, [limit, page, searchQuery, selectedOption]);



  const selectAllAccounts = () => {
    if (accountSelected.length === accounts.filter(account => account.role !== "user").length) {
      setAccountSelected([]);
      setAccountsInfoSelecteds([])
    } else {

      const allAccountIndexes = accounts.filter(account => account.role !== "user").map((account) => account._id);
      setAccountsInfoSelecteds(accounts)
      setAccountSelected(allAccountIndexes);
    }
  };

  const toggleSelection = (id) => { };

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

  const [showDeleteAccounts, setShowDeleteAccounts] = useState(false)

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
      PIN: acc.PIN,
      role: acc.role,


    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Cuentas");
    XLSX.writeFile(workbook, "cuentas.xlsx");
  }

  const toggleAccountSelection = async (accountId) => { };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleUserActive = (user) => {
    dispatch(
      updateAccount({
        data: {
          accountId: account.id,
          toUpdate: { active: !account.active },
        }
      })
    );
    
  };

  const [showPaymentModal, setShowPaymentModal] = useState();
  const [showSetPaymentModal, setShowSetPaymentModal] = useState();
  const [clientIdForPaymentSetup, setClientIdForPaymentSetup] = useState();
  const [amountToPay, setAmountToPay] = useState();


  const [showSidebar, setShowSidebar] = useState(false);

  const [userOptions, setUserOptions] = useState({});
  const [openRoleDropdown, setOpenRoleDropdown] = useState(null); 
  const dropdownRoleRef = useRef(null);

  const roleOptions = ["user", "admin", "superadmin"];


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRoleRef.current &&
        !dropdownRoleRef.current.contains(event.target)
      ) {
        setOpenRoleDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleRoleDropdownToggle = (userId) => {
    setOpenRoleDropdown((prev) => (prev === userId ? null : userId));
  };

  const handleRoleOptionClick = (userId, option) => {
    setUserOptions((prevOptions) => ({
      ...prevOptions,
      [userId]: option,
    }));
    setOpenRoleDropdown(false);
    dispatch(updateUser({ userId, toUpdate: { role: option } }));
  };

  if (!userData) return null;

  const [swiped, setSwiped] = useState(false);

  const [account, setAccount] = useState(null);

  useEffect(() => {
    setAccount(account);
    dispatch(
      getAllAccounts({
        search: searchQuery,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"], 

      })
    );
    setFilteredAccounts(accounts);
  }, [userData])



  const handleOpenAccount = (account) => {
    setAccount(account);
    setShowAddAdminModal(true);
  };

  const searchInputRef = useRef(null);
  const tableHeaders = [
    { label: t("companyName"), key: "companyName" },
    { label: t("pin"), key: "pin" },
    { label: t("contact"), key: "contact" },
    { label: t("password"), key: "password" },
    { label: t("email"), key: "email" },
    { label: t("rol"), key: "rol" },
  ];
  const dynamicTableRef = useRef(null);
  const popupButtonRef = useRef([]);
  const PasswordCell = ({ password }) => {
    const [show, setShow] = useState(false);

    if (!password) return <td>-</td>;

    return (
      <td className={style.PasswordCell}>
        {show ? password : "*".repeat(password.length)}
        <button className={style.eyeButton} onClick={(e) => {
          e.stopPropagation()
          setShow(!show)
        }} >
          {show ? (
            <EyePassword className={style.eye} />
          ) : (
            <EyePasswordSlash className={style.eye} />
          )}
        </button>
      </td>
    );
  };


  const [imageError, setImageError] = useState(false);


  const renderRow = (row, index, onSelect) => (
    <tr
      key={index}
      className={styles.optionsTr}
      onClick={() => handleOpenAccount(row)}
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
              onChange={() => toggleAccountSelection(row?.id)}
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

      <td>    <div className={styles.name}>
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
      </div></td>

      <td> {row?.PIN || "-"}</td>
      <td>{row?.email || "-"}</td>
      <PasswordCell password={row?.password} />
      <td className={style.columnContact}>{row.email || "-"}</td>
      <td>{row?.role || "-"}</td>
   
    </tr>
  );
  const [fileNameS3, setFileNameS3] = useState(null);

  return (
    <>
      <div className={styles.container} onClick={() => setShowSidebar(false)}>
  


        <div className={styles.tableSection}>

        <div className={styles.tableTopContainer}>
          <div className={styles.tableHeaderContainer}>
            <h1 className={styles.tableTitle}>{t("usersAndPermissions")} </h1>
            <div className={styles.filters}>
              {userData?.role === "superadmin" && (
                <Button
                  action={() => {
                    setAccount(null);
                    setShowAddAdminModal(true);
                  }}
                  headerStyle={{ padding: "11.5px" }}
                >
                  <img src={plus} alt="Add admin" />
                </Button>
              )}
              <Button
                className={styles.changeTabButton}
                action={() => navigate("/admin/accounts")}
              >
                {t("goToClients")}

              </Button>


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
          <div className={style.filterTableTop}>
            {totalAccounts > 20 && (

              <PaginationTables
                totalData={totalAccounts}
                limit={limit}
                page={page}
                setPage={setPage}
                setLimit={setLimit}
              />
            )}
            <SearchIconWithIcon
              searchTerm={searchQuery}
              setSearchTerm={setSearchQuery}
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
                />
              </>
            </SearchIconWithIcon>
          </div>

        </div>

        <div className={styles.statsContainer}>
          {stats.map((stat) => (
            <div key={stat.key} className={styles.statCard}>
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
                        {`${allClients?.map((client) => client?.processedEmails?.length).reduce((a, b) => a + b, 0)} ${t("processedMails")}`}
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
                      {`${allClients?.map((client) => client?.processedEmails?.length).reduce((a, b) => a + b, 0)} ${t("processedMails")}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={style.contentContainer}>

          <div className={style.tableContainer}>
            <DynamicTable
              columns={tableHeaders}
              ref={dynamicTableRef}
              data={(filteredAccounts || []).filter(account => account.role !== "user")}
              renderRow={renderRow}
              selectedIds={accountSelected}
              onSelectAll={selectAllAccounts}
              onSelect={toggleSelection}
            />
      
          
          </div>
        </div>
        </div>

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
        {showAccountSettings && (
          <AccountSettings
            showUserSettings={showAccountSettings}
            setShowAccountSettings={setShowAccountSettings}
          />
        )}
      </div>

      {showDeleteAccounts && (
        <DeleteAccountModal
          setShowDeleteAccounts={setShowDeleteAccounts}
          accountSelected={accountSelected}
          user={userData}
          setAccountSelected={setAccountSelected}
          setAccountsInfoSelecteds={setAccountsInfoSelecteds}
        />
      )}
      {showAddAdminModal && (
        <AddAdminModal
          onClose={() => setShowAddAdminModal(false)}
          account={account}
        />
      )}
    </>

  );
};

export default UsersDashboard;
