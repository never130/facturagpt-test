import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Dashboard.module.css";
import PanelTemplate from "./components/PanelTemplate/PanelTemplate";
import { ReactComponent as Dots } from "./assets/optionDots.svg";
import { ReactComponent as ChatGPTWhiteOutline } from "./assets/ChatGPTWhiteOutline.svg";
import { ReactComponent as GrayClock } from "./assets/GrayClock.svg";
import { ReactComponent as ChatIcon } from "./assets/chatIconGray.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewAsset from "./components/NewAsset/NewAsset";

import {
  getResumeAccount,

  // addNotification,
  // deleteResume,
  addRandom,
  deleteRandom
} from "@src/actions/user";

import {
  addNotification,
  deleteResume
} from "@src/actions/notifications"

import {
  getAllContacts
} from "@src/actions/contacts"

import {
  getAllAssets
} from "@src/actions/assets"

import DatePicker from "./components/DashboardComponents/DatePicker/DatePicker";
import TeamListSimple from "./components/DashboardComponents/TeamListSimple/TeamListSimple";
import NewDashboard from "./components/DashboardComponents/Main";

const Dashboard = () => {
  const { t } = useTranslation("dashboard");

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { user } = useSelector((state) => state.user);
  const { contacts } = useSelector((state) => state.contacts);
  const { assets } = useSelector((state) => state.assets);
  const [firstDatePicker, setFirstDatePicker] = useState(new Date().toISOString().split("T")[0])
  const [secondDatePicker, setSecondDatePicker] = useState()
  const { tab } = useSelector(state => state.dashboard)

  const getAssets = async () => {
    const response = await dispatch(getAllAssets({

    }));

    if (response.payload) {
    }
  };

  const [statistics, setStatistics] = useState([]);


  const [showNewAsset, setShowNewAsset] = useState(false)
  const [salesSummaries, setSalesSummaries] = useState([
    {
      title: t('salesSyummary'),
      total: "0,00€",
      month: "abril 2024",
      options: [],
      value: []
    },
    {
      title: t('expenseSummary'),
      total: "0,00€",
      month: "abril 2024",
      options: [],
      value: [],
    },
  ]);

  let spentData = [
    {
      title: t('exceptionalExpenses'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "expense",
      type: "pay",
      category: "expense"
    },
    {
      title: t('otherLosses'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "other_management_losses",
      type: "pay",
      category: "expense"
    },
    {
      title: t('socialSecurity'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "company_social_security",
      type: "pay",
      category: "expense"
    },
    {
      title: t('compensations'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "compensations",
      type: "pay",
      category: "expense"
    },
    {
      title: t('salareisAndWages'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "wages_and_salaries",
      type: "pay",
      category: "expense"
    },
    {
      title: t('otherServices'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "other_services",
      type: "pay",
      category: "expense"
    },
    {
      title: t('supplies'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "utilities",
      type: "pay",
      category: "expense"
    },
    {
      title: t('publicRelations'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "advertising_and_pr",
      type: "pay",
      category: "expense"
    },
    {
      title: t('bankingAndSimilarServices'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "banking_services",
      type: "pay",
      category: "expense"
    },
    {
      title: t('productSales'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "product_sales",
      type: "pay",
      category: "expense"
    },
    {
      title: t('incomeFromServices'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "service_income",
      type: "pay",
      category: "expense"
    },
    {
      title: t('bankInterest'),
      amount: "0,00€",
      percentage: "0%",
      subCategory: "bank_interest",
      type: "pay",
      category: "expense"
    },
  ];



  const [selectedType, setSelectedType] = useState(t('expense'));


  const [filteredData, setFilteredData] = useState(spentData)

  const [swiped, setSwiped] = useState(false);
  const [selectedFileS3, setSelectedFileS3] = useState(null);
  useEffect(() => {
    const fn = async () => {
      const response = await dispatch(getResumeAccount({ userId: user?.id }));

      if (response.payload && response.payload.success) {


        const updatedStatistics = [
          {
            title: t('tokens'),
            key: 'tokens',
          },
          {
            title: t('sales'),
            key: 'sales',
          },
          {
            title: t('bills'),
            key: 'bills',
          },
          {
            title: t('benefits'),
            key: 'benefits',
          },
          {
            title: t('gbPlatform'),
            key: 's3_usage_gb',
          },
        ].map((item) => ({
          title: item.title,
          year: t('currentMonth'),
          total: response.payload.resume[item.key] ? response.payload.resume[item.key] : "0.00",
          key: item.key,
        }));

        setStatistics(updatedStatistics);
        const keys = Object.keys(response.payload.resume)

        keys.map((key, _) => {
          const index = spentData.findIndex(x => x.type == key)

          if (index > -1 && response.payload.resume[key]) {
            const amount = parseFloat(response.payload.resume[key]);
            spentData[index].amount = `${amount.toFixed(2)}€`;
          }
        })


        setFilteredData(spentData)

        let previeousMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        if (response.payload.resume.previous_month) {
          const keys = Object.keys(response.payload.resume.previous_month)

          for (let i = 0; i < keys.length; i++) {
            const ini = parseInt(keys[i].split('-')[0])

            previeousMonth[ini] = response.payload.resume.previous_month[keys[i]].value
          }
        }

        setSalesSummaries([{
          ...salesSummaries[0],
          value: previeousMonth
        }, {
          ...salesSummaries[1],
          value: previeousMonth
        }])


      }
    };

    if (user) {
      fn();
    }
  }, [user]);

  const handleAddNotification = async () => {
    const type = spentData[Math.floor(Math.random() * spentData.length)].type;

    const response = await dispatch(
      addNotification({
        title: 'hello world',
        icon: 'https://facturagpt.com/assets/icon/logo.svg',
        data: [{
          title: "Titulo de la factura",
          email: "johndoe@email.com",
          icon: "https://facturagpt.com/assets/icon/logo.svg",
          location: "Q1>Facturas",
        }],
        category: ["supplies"],
        options: ["Compartir"],
        value: 100,
        type: "pay",
        subcategory: type || "product_sales"
      })
    );

  };


  const handleDeleteResume = async () => {
    const response = await dispatch(
      deleteResume()
    )


  }


  const handleAddRandom = async () => {
    const response = await dispatch(
      addRandom({
        count: 10000
      })
    )

  }

  const handleDeleteRandom = async () => {
    const response = await dispatch(
      deleteRandom()
    )

  }

  const [selectedTab, setSelectedTab] = useState(t('incomeAndExpenses'));



  useEffect(() => {
    tab && setSelectedTab(tab)
  }, [tab]);



  useEffect(() => {
    dispatch(getAllContacts({ userId: user?.id }));
    dispatch(getAllAssets({}));

  }, [user]);



  const renderContent = () => {
    switch (selectedTab) {
      case t('incomeAndExpenses'):
        return (
          <>

            <div className={styles.expenseAccountsOptions}>

              <span
                className={
                  selectedType == t('expense') && styles.selectedTypeExpense
                }
                onClick={() => setSelectedType(t('expense'))}
              >
                {t('expense')}
              </span>
              <span
                className={
                  selectedType == t('income') && styles.selectedTypeExpense
                }
                onClick={() => setSelectedType(t('income'))}
              >
                {t('income')}
              </span>
            </div>

            {filteredData.map((item, index) => (
              <div key={index} className={styles.spent}>
                <div className={styles.row}>
                  <p>{item.title}</p>
                  <span>
                    {item.amount} - {item.amount} ({item.percentage})
                  </span>
                </div>
                <div className={styles.divider}></div>
              </div>
            ))}
          </>
        );
      case t('contacts'):
        return <TeamListSimple teams={contacts} type="contact" />;

      case t('assets'):

        return <TeamListSimple teams={assets} type="asset" setShowNewAsset={setShowNewAsset} />


      default:
        return null;
    }
  };



  const calculateRelativePercent = (value) => {
    const percent = parseInt(value, 10) / 10;
    return Math.min(Math.max(percent, 0), 100);
  };

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  const [fileNameS3, setFileNameS3] = useState(null);



  const OldDashboard = () => {
    return (
      <>
        <div>
          <button onClick={() => handleDeleteResume()} >
            {t('deleteResume')}
          </button>
          <button onClick={() => handleAddNotification()}>
            {t('addBenefit')}
          </button>
          <div>
            <input type="text" />
            <button onClick={() => handleAddRandom()}>
              {t('addRandom')}
            </button>
          </div>
          <button onClick={() => handleDeleteRandom()}>
            {t('deleteRandom')}
          </button>
        </div>

        <div className={styles.analitycsHeader}>
          <span className={styles.data}>
            <ChatIcon />
            {t('moreDataAndAnalytics')}
          </span>
          <div className={styles.analitycsHeaderRight}>
            <div
              className={styles.talkWithFacturaGPT}
              onClick={() => navigate("/admin/chat")}
            >
              <ChatGPTWhiteOutline /> {t('talkToFacturaGpt')}
            </div>
            <div className={styles.timerContainer}>
              <GrayClock />
              <DatePicker order={'first'} setDatePicker={setFirstDatePicker} firstDatePicker={firstDatePicker} secondDatePicker={secondDatePicker} />-
              <DatePicker order={'second'} firstDatePicker={firstDatePicker}
                secondDatePicker={secondDatePicker} setDatePicker={setSecondDatePicker} />

            </div>
          </div>
        </div>

        <div className={styles.statisticsHeader}>
          <div>
            <div className={styles.staticsContainer}>
              {statistics.map((statistic) => (
                <div className={styles.statisticCard}>
                  <div className={styles.title}>
                    <p>{statistic.title}</p>
                  </div>
                  <span>{statistic.year}</span>
                  <p className={styles.statisticTotal}>{statistic.total}{statistic.title !== t('gbPlatform') ? '€' : 'GB'}</p>
                </div>
              ))}

            </div>
          </div>

          <div className={styles.homeContent}>
            <div className={styles.salesSummaryContainer}>
              {salesSummaries.map((summary, index) => (
                <div key={index} className={styles.salesSummary}>
                  <div className={styles.salesSummaryHeader}>

                    <p>{summary.title}</p>
                    {summary.options.length > 0 && (
                      <div className={styles.salesSummaryOptions}>
                        {summary.options.map((option, optionIndex) => (
                          <span key={optionIndex}>{option}</span>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>

            <div className={styles.expenseAccountsContent}>
              {renderContent()}
              {showNewAsset && <NewAsset setShowNewAsset={setShowNewAsset} fn={getAssets}

                showNewContact={false}
              />}

            </div>
          </div>
        </div>

        <div className={styles.expenseAccounts}>
          <div className={styles.expenseAccountsHeader}>
            {[t('incomeAndExpenses'), t('contacts'), t('assets')].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={selectedTab == tab && styles.selectedTabBtn}
                >
                  {tab}
                </button>
              )
            )}
          </div>
          <div className={styles.expenseAccountsContent}>
            {renderContent()}
            {showNewAsset && <NewAsset setShowNewAsset={setShowNewAsset} fn={getAssets}

              showNewContact={false}

            />}
          </div>
        </div>
      </>
    );
  }



 const contenedorRef = useRef(null);
  const incomeRef = useRef(null);
  const documentsRef = useRef(null);
  const contactsRef = useRef(null);
  const assetsRef = useRef(null);
  const teamRef = useRef(null);



  return (

    <div className={styles.homeContainer} ref={contenedorRef} >
      <NewDashboard
      contenedorRef={contenedorRef}
      incomeRef={incomeRef}
      documentsRef={documentsRef}
      contactsRef={contactsRef}
      assetsRef={assetsRef}
      teamRef={teamRef}
        statistics={statistics}
        salesSummaries={salesSummaries}
      />
    </div>
  )


};

export default Dashboard;
