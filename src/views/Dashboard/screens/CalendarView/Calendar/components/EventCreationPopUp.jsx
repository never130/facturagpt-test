import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './EventCreationPopUp.module.css'
import { CalendarContext } from '../../CalendarContext'
import EventType from './EventType'
import ConcentrationType from './ConcentrationType'
import OffOfficeType from './OffOfficeType'
import LocationType from './LocationType'
import TasksType from './TasksType'
import AppointmentType from './AppointmentType'
import {
	createEvent,
	createSharedEvent,
	getUserSharedEvents,
} from '@src/actions/calendar'
import { setModal } from '@src/slices/calendarSlices'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { generateRandomId } from '../utils'
import PostType from './PostType'
import HeaderCard from "../../../../components/HeaderCard/HeaderCard";
import Button from "../../../../components/Button/Button"

const EventCreationPopUp = ({ fromMeet, fromMonth }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { user } = useSelector((state) => state.user)
	const {
		selectedCalendar,
		selectedCalendarData,
		selectedSecondaryCalendars,
		selectedSecondaryCalendarsData,
	} = useSelector((state) => state.calendar)
	const {
		selectedDate,
		selectedHour,
		setSelectedHour,
		generateInvitationId,
		getReminderHour,
		formatSelectedDate,
		handleSendInvitationEmail,
		getDateData,
		selectedOption,
		setSelectedOption,
		setShowToast,
		setToastMessage,
		addMinutesToTime,
		generateGradient,
	} = useContext(CalendarContext)
	const [usersToInvite, setUsersToInvite] = useState([])
	const [eventTitle, setEventTitle] = useState('')
	const [location, setLocation] = useState('')
	const [description, setDescription] = useState('')
	const [attachment, setAttachment] = useState()
	const [addMeet, setAddMeet] = useState(false)
	const [meetId, setMeetId] = useState()
	const [visibility, setVisibility] = useState('Público')
	const [availability, setAvailability] = useState('No disponible')
	const [notification, setNotification] = useState([
		`${selectedCalendarData.calendarEventsReminder} minutos antes`,
	])
	const [rejectMeetings, setRejectMeetings] = useState(false)
	const [rejectMessage, setRejectMessage] = useState(
		'Rechazado porque estoy fuera de la oficina'
	)
	const [rejectOption, setRejectOption] = useState('newAndCurrent')
	const [expandedAdditionalInfo, setExpandedAdditionalInfo] = useState(false)
	const [timezone, setTimezone] = useState(selectedCalendarData.timezone)
	const [repeat, setRepeat] = useState('No se repite')
	const [allDay, setAllDay] = useState(false)
	const [hourDataExpanded, setHourDataExpanded] = useState(false)
	const [eventColor, setEventColor] = useState(
		selectedCalendarData.calendarColor
	)
	const eventDuration = selectedCalendarData?.eventsDuration || 30
	useEffect(() => {
		if (!selectedHour.start || !selectedHour.end) {
			setSelectedHour({
				start: '7:00 AM',
				end: addMinutesToTime('7:00 AM', eventDuration),
			})
		}
	}, [])

	useEffect(() => {
		if (addMeet === true) {
			setMeetId(generateRandomId())
		} else {
			setMeetId()
		}
	}, [addMeet])

	const [isFocused, setIsFocused] = useState(false)

	const getDates = (dateStr, type) => {
		const dates = []
		const [day, month, year] = dateStr.split('/').map(Number)
		const baseDate = new Date(year, month - 1, day)

		if (type === 'Cada día del mes') {
			const totalDays = new Date(year, month, 0).getDate()
			for (let d = day + 1; d <= totalDays; d++) {
				const date = new Date(year, month - 1, d)
				dates.push(formatDate(date))
			}
		} else if (type === 'Cada semana del mes') {
			let date = new Date(baseDate)
			date.setDate(date.getDate() + 1)

			while (date.getDay() !== 1) {
				date.setDate(date.getDate() + 1)
			}

			while (date.getMonth() === month - 1) {
				dates.push(formatDate(date))
				date.setDate(date.getDate() + 7)
			}
		} else if (type === 'Cada mes del año') {
			for (let m = month; m <= 12; m++) {
				const date = new Date(year, m, 1)
				dates.push(formatDate(date))
			}
		} else {
			throw new Error('Unrecognized type')
		}

		return dates
	}

	const formatDate = (date) => {
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${day}/${month}/${year}`
	}

	const handleCreateEvent = () => {
		if (
			selectedCalendar &&
			eventTitle.length > 0 &&
			selectedOption &&
			selectedDate.day &&
			selectedDate.month &&
			selectedDate.year &&
			selectedHour.start &&
			selectedHour.end
		) {
			const joinId = generateInvitationId()
			const dateData = getDateData(formatSelectedDate(null, fromMonth))
			const reminderHour = getReminderHour(
				selectedHour.start.split(' ').join('').toLowerCase(),
				30
			)
			const eventData = {
				type: selectedOption,
				date: formatSelectedDate(null, fromMonth),
				title: eventTitle,
				description,
				hour: `${selectedHour.start.split(' ').join('').toLowerCase()} - ${selectedHour.end.split(' ').join('').toLowerCase()}`,
				organizer: user.user,
				timeZone: timezone,
				participants: [],
				invitedUsers: usersToInvite,
				joinId,
				reminder: '30 minutes before',
				attachment: attachment ? attachment.length : 0,
				eventColor,
				location,
				allDay,
				repeat,
				notification,
				availability,
				visibility,
				meetId,
				addMeet,
				rejectMeetings,
			}
			if (rejectMeetings) {
				eventData.rejectMessage = rejectMessage
				eventData.rejectOption = rejectOption
			}
			if (addMeet) {
				const invitedUsersId = usersToInvite.map((u) => u.id)
				
				alert('add meet create event creation popiup')
			}
			if (selectedSecondaryCalendars.length === 0) {
				if (repeat !== 'No se repite') {
					getDates(eventData.date, repeat).forEach((newDate) => {
						let newEventData = { ...eventData }
						newEventData.date = newDate
						dispatch(
							createEvent({
								userId: user.id,
								calendarId: selectedCalendar,
								eventData: newEventData,
							})
						)
					})
				}
				dispatch(
					createEvent({
						userId: user.id,
						calendarId: selectedCalendar,
						eventData,
					})
				).then((res) => {
					usersToInvite.forEach((invitedUser) => {
						const dataToEmailWith = {
							month: dateData.month,
							dayNumber: dateData.dayNumber,
							day: dateData.day,
							senderName: user.user.split('@')[0],
							reminderHour,
							receiverName: invitedUser.user.split('@')[0],
							timezone: selectedCalendarData.timezone,
							receiverEmail: invitedUser.user,
							eventName: eventTitle,
							location,
							completeDate: dateData.completeDate,
							joinId: joinId,
							shareId: selectedCalendarData.shareId,
							senderEmail: user.user,
							description: `${eventTitle} event description`,
							participants: usersToInvite.map(
								(user) => user.user.split('@')[0]
							),
							hour: `${selectedHour.start.split(' ').join('').toLowerCase()} - ${selectedHour.end.split(' ').join('').toLowerCase()}`,
						}
						handleSendInvitationEmail(dataToEmailWith)
					})
				})
			} else {
				eventData.sharedWith = [selectedCalendar, ...selectedSecondaryCalendars]
				eventData.dotColor = generateGradient([
					selectedCalendarData.calendarColor,
					...Object.values(selectedSecondaryCalendarsData).map(
						(cal) => cal[0].calendarColor
					),
				])
				dispatch(
					createSharedEvent({
						userId: user.id,
						calendarsIds: [selectedCalendar, ...selectedSecondaryCalendars],
						eventData,
					})
				)
					.then(() => dispatch(getUserSharedEvents({ userId: user.id })))
					.then((res) => {
						usersToInvite.forEach((invitedUser) => {
							const dataToEmailWith = {
								month: dateData.month,
								dayNumber: dateData.dayNumber,
								day: dateData.day,
								senderName: user.user.split('@')[0],
								reminderHour,
								receiverName: invitedUser.user.split('@')[0],
								timezone: selectedCalendarData.timezone,
								receiverEmail: invitedUser.user,
								eventName: eventTitle,
								location: 'FacturaGPT Office',
								completeDate: dateData.completeDate,
								joinId: joinId,
								shareId: selectedCalendarData.shareId,
								senderEmail: user.user,
								description: `${eventTitle} event description`,
								participants: usersToInvite.map(
									(user) => user.user.split('@')[0]
								),
								hour: `${selectedHour.start.split(' ').join('').toLowerCase()} - ${selectedHour.end.split(' ').join('').toLowerCase()}`,
							}
							handleSendInvitationEmail(dataToEmailWith)
						})
					})
			}
			dispatch(setModal(null))
		} else {
			setToastMessage('Complete los datos faltantes!')
			setShowToast(true)
		}
	}

	const handleOptionClick = (option) => {
		setSelectedOption(option)
	}

	const handleFocus = () => {
		setIsFocused(true)
	}

	const handleBlur = () => {
		setIsFocused(false)
	}

	const inputRef = useRef()

	useEffect(() => {
		inputRef.current.focus()
	}, [])

	if (!selectedHour.start || !selectedHour.end) {
		return null
	}
	return (
		<div className={styles.modalContainer}>
			<div className={styles.headerCardContaier}>
<HeaderCard
          title={"Agregar Evento"}
          setState={() => dispatch(setModal(null)) }
          titleStyle={{
            color: "var(--black-color)",
            textAlign: "center",
            fontFamily: "Inter",
            fontSize: "19px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "130%",
          }}
          headerStyle={{
            zIndex: "1",
			width:"100%"
          }}
        >

            <>
              <Button
                headerStyle={{ all: "unset" }}
                action={() => navigate('/admin/calendar/options')}
              >
                <div className={styles.automationIconContainer}>
					<span className={styles.greenAndBold}> Más Opciones</span>
                 
                </div>
              </Button>
              <Button
                action={() => handleCreateEvent()}
              >
                {" "}
               {selectedOption === 'Agenda de citas'
							? 'Configurar agenda'
							: 'Guardar'}
              </Button>
            </>
          
        </HeaderCard>
			</div>
			<div className={styles.modalScrollableContainer}>
				<div className={styles.inputContainer}>
					<input
						ref={inputRef}
						type='text'
						value={eventTitle}
						placeholder='Agrega un título'
						className={`${styles.input} ${isFocused ? styles.focused : ''}`}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onChange={(e) => setEventTitle(e.target.value)}
					/>
					<div
						className={`${styles.underline} ${isFocused ? styles.active : ''}`}
					/>
				</div>
				<div className={styles.toggleOptions}>
					{[
						'Evento',
						'Post',
						'Tiempo de concentración',
						'Fuera de oficina',
						'Ubicación del trabajo',
						'Tarea',
						'Agenda de citas',
					].map((option) => (
						<div
							key={option}
							className={`${styles.option} ${
								selectedOption === option ? styles.selected : ''
							}`}
							onClick={() => handleOptionClick(option)}
						>
							{option}
						</div>
					))}
				</div>
				{selectedOption === 'Evento' && (
					<EventType
						description={description}
						setDescription={setDescription}
						location={location}
						setLocation={setLocation}
						usersToInvite={usersToInvite}
						setUsersToInvite={setUsersToInvite}
						attachment={attachment}
						setAttachment={setAttachment}
						meetId={meetId}
						addMeet={addMeet}
						setAddMeet={setAddMeet}
						notification={notification}
						setNotification={setNotification}
						availability={availability}
						setAvailability={setAvailability}
						visibility={visibility}
						setVisibility={setVisibility}
						eventColor={eventColor}
						setEventColor={setEventColor}
						expandedAdditionalInfo={expandedAdditionalInfo}
						setExpandedAdditionalInfo={setExpandedAdditionalInfo}
						timezone={timezone}
						repeat={repeat}
						setTimezone={setTimezone}
						setRepeat={setRepeat}
						hourDataExpanded={hourDataExpanded}
						setHourDataExpanded={setHourDataExpanded}
						allDay={allDay}
						setAllDay={setAllDay}
					/>
				)}
				{selectedOption === 'Post' && (
					<PostType
						description={description}
						setDescription={setDescription}
						location={location}
						setLocation={setLocation}
						usersToInvite={usersToInvite}
						setUsersToInvite={setUsersToInvite}
						attachment={attachment}
						setAttachment={setAttachment}
						meetId={meetId}
						addMeet={addMeet}
						setAddMeet={setAddMeet}
						notification={notification}
						setNotification={setNotification}
						availability={availability}
						setAvailability={setAvailability}
						visibility={visibility}
						setVisibility={setVisibility}
						eventColor={eventColor}
						setEventColor={setEventColor}
						expandedAdditionalInfo={expandedAdditionalInfo}
						setExpandedAdditionalInfo={setExpandedAdditionalInfo}
						timezone={timezone}
						repeat={repeat}
						setTimezone={setTimezone}
						setRepeat={setRepeat}
						hourDataExpanded={hourDataExpanded}
						setHourDataExpanded={setHourDataExpanded}
						allDay={allDay}
						setAllDay={setAllDay}
					/>
				)}
				{selectedOption === 'Tiempo de concentración' && (
					<ConcentrationType
						description={description}
						setDescription={setDescription}
						location={location}
						setLocation={setLocation}
						usersToInvite={usersToInvite}
						setUsersToInvite={setUsersToInvite}
						attachment={attachment}
						setAttachment={setAttachment}
						meetId={meetId}
						addMeet={addMeet}
						setAddMeet={setAddMeet}
						notification={notification}
						setNotification={setNotification}
						availability={availability}
						setAvailability={setAvailability}
						visibility={visibility}
						setVisibility={setVisibility}
						eventColor={eventColor}
						setEventColor={setEventColor}
						expandedAdditionalInfo={expandedAdditionalInfo}
						setExpandedAdditionalInfo={setExpandedAdditionalInfo}
						timezone={timezone}
						repeat={repeat}
						setTimezone={setTimezone}
						setRepeat={setRepeat}
						hourDataExpanded={hourDataExpanded}
						setHourDataExpanded={setHourDataExpanded}
						allDay={allDay}
						setAllDay={setAllDay}
					/>
				)}
				{selectedOption === 'Fuera de oficina' && (
					<OffOfficeType
						timezone={timezone}
						repeat={repeat}
						setTimezone={setTimezone}
						setRepeat={setRepeat}
						hourDataExpanded={hourDataExpanded}
						setHourDataExpanded={setHourDataExpanded}
						allDay={allDay}
						setAllDay={setAllDay}
						visibility={visibility}
						setVisibility={setVisibility}
						rejectMessage={rejectMessage}
						setRejectMessage={setRejectMessage}
						rejectOption={rejectOption}
						setRejectOption={setRejectOption}
						rejectMeetings={rejectMeetings}
						setRejectMeetings={setRejectMeetings}
					/>
				)}
				{selectedOption === 'Ubicación del trabajo' && (
					<LocationType
						notification={notification}
						setNotification={setNotification}
						availability={availability}
						setAvailability={setAvailability}
						visibility={visibility}
						setVisibility={setVisibility}
						eventColor={eventColor}
						setEventColor={setEventColor}
						expandedAdditionalInfo={expandedAdditionalInfo}
						setExpandedAdditionalInfo={setExpandedAdditionalInfo}
						timezone={timezone}
						repeat={repeat}
						setTimezone={setTimezone}
						setRepeat={setRepeat}
						hourDataExpanded={hourDataExpanded}
						setHourDataExpanded={setHourDataExpanded}
						allDay={allDay}
						setAllDay={setAllDay}
					/>
				)}
				{selectedOption === 'Tarea' && (
					<TasksType
						timezone={timezone}
						repeat={repeat}
						setTimezone={setTimezone}
						setRepeat={setRepeat}
						hourDataExpanded={hourDataExpanded}
						setHourDataExpanded={setHourDataExpanded}
						allDay={allDay}
						setAllDay={setAllDay}
						attachment={attachment}
						setAttachment={setAttachment}
						description={description}
						setDescription={setDescription}
					/>
				)}
				{selectedOption === 'Agenda de citas' && (
					<AppointmentType
						notification={notification}
						setNotification={setNotification}
						availability={availability}
						setAvailability={setAvailability}
						visibility={visibility}
						setVisibility={setVisibility}
						eventColor={eventColor}
						setEventColor={setEventColor}
						expandedAdditionalInfo={expandedAdditionalInfo}
						setExpandedAdditionalInfo={setExpandedAdditionalInfo}
						timezone={timezone}
						repeat={repeat}
						setTimezone={setTimezone}
						setRepeat={setRepeat}
						hourDataExpanded={hourDataExpanded}
						setHourDataExpanded={setHourDataExpanded}
						allDay={allDay}
						setAllDay={setAllDay}
					/>
				)}

		
			</div>
		</div>
	)
}

export default EventCreationPopUp
