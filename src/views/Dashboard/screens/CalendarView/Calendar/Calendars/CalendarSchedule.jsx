import { updateEvent } from '@src/actions/calendar'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDispatch, useSelector } from 'react-redux'
import { CalendarContext } from '../../CalendarContext'
import SingleEventCard from '../components/SingleEventCard'
import styles from '../index.module.css'
import { getAdjacentDay } from '../utils'
import { useTranslation } from "react-i18next";

import useFocusShortcut from "../../../../../../utils/useFocusShortcut";

import { deleteNotification, getAllNotifications } from '@src/actions/notifications'
// import { updateNotificationDB } from '../../../../../../utils/notification'
// import { deleteNotification } from '../../../../../../actions/user'


import Button from "../../../../components/Button/Button"
import ClientsHeader from "../../../../components/ClientsHeader/ClientsHeader"
import FiltersDropdownContainer from "../../../../components/FiltersDropdownContainer/FiltersDropdownContainer"
import NotificationComponent from "../../../../components/NotificationComponent/NotificationComponent"
import PaginationTables from "../../../../components/PaginationTables/PaginationTables"
import SkeletonScreen from "../../../../components/SkeletonScreen/SkeletonScreen"





const CalendarSchedule = () => {
	const dispatch = useDispatch()
	const { groupEventsByDate } = useContext(CalendarContext)
	const { selectedCalendarEvents, selectedSecondaryCalendarEvents } =
		useSelector((state) => state.calendar)

	const formatDate = (dateString) => {
		let [day, month, year] = dateString.split('/')

		day = day.length === 1 ? `0${day}` : day
		month = month.length === 1 ? `0${month}` : month

		return `${day}/${month}/${year}`
	}

	const handleTopDrop = (event) => {
		const updatedEventData = {
			...event,
			date: getAdjacentDay(event.date, 'prev'),
		}
		dispatch(
			updateEvent({
				eventId: event.id,
				eventData: updatedEventData,
			})
		)
	}

	const handleBottomDrop = (event) => {
		const updatedEventData = {
			...event,
			date: getAdjacentDay(event.date, 'next'),
		}
		dispatch(
			updateEvent({
				eventId: event.id,
				eventData: updatedEventData,
			})
		)
	}

	const [, topDropRef] = useDrop({
		accept: 'event',
		drop: (item) => {
			handleTopDrop(item.event)
		},
	})

	const [, bottomDropRef] = useDrop({
		accept: 'event',
		drop: (item) => {
			handleBottomDrop(item.event)
		},
	})

	const groupedEvents = groupEventsByDate([
		...selectedCalendarEvents,
		...selectedSecondaryCalendarEvents,
	])

	const EventCard = ({ date, events }) => {
		const dispatch = useDispatch()
		const formattedDate = formatDate(date)

		const [, dropRef] = useDrop({
			accept: 'event',
			drop: (item) => {
				const updatedEventData = {
					...item.event,
					date: formattedDate,
				}
				dispatch(
					updateEvent({
						eventId: item.event.id,
						eventData: updatedEventData,
					})
				)
			},
		})

		return (
			<div style={{ width: '100%' }} ref={dropRef}>
				<SingleEventCard date={date} events={events} />
			</div>
		)
	}




















	const { t } = useTranslation("ArticlesTransactions");

	const searchInputRef = useRef(null);
	useFocusShortcut(searchInputRef, "k");

	const { notifications: notificationsState, totalNotifications } = useSelector((state) => state.notifications)
	const { countNotificationNoViewed } = useSelector((state) => state.notifications);


	const [expandedNotifications, setExpandedNotifications] = useState({});
	const [limit, setLimit] = useState(20);
	const [page, setPage] = useState(0);
	const [total, setTotal] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");

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


	const toggleNotification = async (id, notification) => {
		setExpandedNotifications((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
		// await updateNotificationDB(notification?._id);


	};


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
		setPage(0);
	}, [limit, searchTerm]);


	useEffect(() => {
		getAllNotificationsFn();
	}, [limit, page, selectedOption, searchTerm]);


	useEffect(() => {
		document.title = `${t("facturaGPT")} - ${t("notifiation")?.toUpperCase()} (${countNotificationNoViewed > 99 ? "+99" : countNotificationNoViewed})`;
	}, [countNotificationNoViewed]);




	

	return (
		<DndProvider backend={HTML5Backend}>


			<div className={styles.calendarSchedule} >
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

									await dispatch(deleteNotification({}));
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
		</DndProvider>
	)
}

export default CalendarSchedule
