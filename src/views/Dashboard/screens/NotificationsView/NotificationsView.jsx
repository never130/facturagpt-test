
// import { updateNotificationDB } from "../../../../utils/notification";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import Button from "../../components/Button/Button";
import ClientsHeader from "../../components/ClientsHeader/ClientsHeader";
import FiltersDropdownContainer from "../../components/FiltersDropdownContainer/FiltersDropdownContainer";
import NotificationComponent from "../../components/NotificationComponent/NotificationComponent";
import PaginationTables from "../../components/PaginationTables/PaginationTables";
import SkeletonScreen from "../../components/SkeletonScreen/SkeletonScreen";
import styles from "./NotificationsView.module.css";

import { getAllNotifications, deleteNotification } from "@src/actions/notifications";

const ButtonsOptions = ({ option, index }) => {
  const { t } = useTranslation("ArticlesTransactions");

  const shareOption = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: t("shareDocument"),
          text: t("lookThisDocument"),
          url: window.location.href,
        });
      } else {
        alert(t("notAvailableThisDevice"));
      }
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  const handleClick = (value) => {
    switch (value) {
      case "Reenviar":
        alert(1);
        break;
      case "Responder":
        alert(1);
        break;
      case "Compartir":
        shareOption();
        break;
      case "Ver Email":
        alert(1);
        break;
    }
  };
  return (
    <button
      onClick={() => handleClick(option)}
      key={index}
      style={{
        color: option === "Reenviar" ? "#7B7575" : "#04614b",
        textDecoration: option === "Ver Email" && "underline",
      }}
    >
      {option}
    </button>
  );
};

const NotificationsView = () => {
  const { t } = useTranslation("ArticlesTransactions");

  const dispatch = useDispatch();
  const { notifications: notificationsState, totalNotifications, unseenCount } = useSelector((state) => state.notifications)
  const { totalNotification, user, countNotificationNoViewed } = useSelector((state) => state.user);

  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    setPage(0);
  }, [limit, searchTerm]);

  const toggleNotification = async (id, notification) => {
    setExpandedNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    // await updateNotificationDB(notification?._id);

  };

  const [notifications, setNotifications] = useState([]);


  const [selectedOption, setSelectedOption] = useState({
    "Orden Alfabético": "A-Z",
    "date": t('1month'),
    "type": t('pay'),

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
    {
      name: "date",
      label: t("date"),
      subOptions: [
        { display: t('1month'), value: "1month" },
        { display: t('3month'), value: "3month" },
        { display: t('6month'), value: "6month" },
        { display: t('1year'), value: "1year" },

      ],
    },
    {
      name: "type",
      label: t("type"),
      subOptions: [
        { display: t('all'), value: "Todos" },
        { display: t('pay'), value: "pay" },
        { display: t('resume'), value: "resume" },

      ],
    },

  ];

  const [swiped, setSwiped] = useState(false);

  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "k");


  const getAllNotificationsFn = async () => {
    const response = await dispatch(
      getAllNotifications({
        search: searchTerm,
        limit,
        skip: page * limit,
        sortAlpha: selectedOption["Orden Alfabético"],
        sortDate: selectedOption.date,
        sortType: selectedOption.type,
      })
    );
    if (response.payload.success) {
      setNotifications(response.payload.notification);
      setTotal(response.payload.total);
    }
  };
  useEffect(() => {
    getAllNotificationsFn();
  }, [limit, page, selectedOption, searchTerm]);

  const [selectedFileS3, setSelectedFileS3] = useState(null);
  const [fileNameS3, setFileNameS3] = useState(null);


  useEffect(() => {
    document.title = `${t("facturaGPT")} - ${t("notifiation")?.toUpperCase()} (${countNotificationNoViewed > 99 ? "+99" : countNotificationNoViewed})`;
  }, [countNotificationNoViewed]);

  return (

    <div
      className={styles.container}

    >
      <ClientsHeader father={'notifications'}
        title={`${t("notificationManagement")}${totalNotifications && totalNotifications > 0 ? ` (${totalNotifications})` : ""}`}
        ref={searchInputRef}
        additionalInfo={
          <>
            {totalNotifications > 20 && (

              <PaginationTables
                totalData={totalNotifications}
                limit={limit}
                page={page}
                setPage={setPage}
                setLimit={setLimit}
                father={'notification'}
              />
            )}
          </>
        }
        buttons={
          [

          ]}
        searchProps={{
          searchTerm: searchTerm,
          setSearchTerm: setSearchTerm,
        }}
        searchChildren={
          <>
            <Button
              headerStyle={{
                background: "var(--ececf1-background);",
                color: "#666",
                padding: "1.5px 4.5px",
                borderRadius: "4px", fontWeight: 300, cursor: "pointer", fontSize: "12px", marginRight: "4px"
              }}
              type="white"
              action={async (e) => {
                e.stopPropagation();

                await dispatch(deleteNotification({ }));

              }}

            >
              D
            </Button>
            <Button
              headerStyle={{
                all: "unset",
                background: "var(--ececf1-background);",
                color: "var(--_6-color)",
                padding: "1.5px 4.5px",
                borderRadius: "4px", fontWeight: 300, cursor: "pointer", fontSize: "12px", marginRight: "4px"
              }}
              type="white"
              action={() => searchInputRef.current.focus()}

            >
              K
            </Button>
            <FiltersDropdownContainer
              setSelectedFilters={setSelectedOption}
              selectedFilters={selectedOption}
              options={options}
            />
          </>
        }
      />
      {notificationsState?.length > 0 && (
        <div className={styles.notificationCoontainer}>
          {notificationsState.map((notification) => (
            <NotificationComponent
              key={notification._id}
              handleHeaderClick={() => toggleNotification(notification._id, notification)}
              isActive={expandedNotifications[notification._id]}
              data={notification}
              type="document"
              getAllNotificationsFn={getAllNotificationsFn}
            />
          ))}
        </div>
      )}

      {notificationsState?.length === 0 && (
        <SkeletonScreen
          labelText={t("noNotification")}
          helperText={t("configureYourNotification")}
          showInput={true}
          enableLabelClick={false}
        />
      )}
    </div>

  );
};

export default NotificationsView;
