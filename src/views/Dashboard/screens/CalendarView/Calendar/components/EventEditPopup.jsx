import React, { useContext, useEffect, useState } from 'react'
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
	updateEvent,
} from '@src/actions/calendar'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setModal } from '@src/slices/calendarSlices'

const EventEditPopup = () => {
	const dispatch = useDispatch()
	const { user } = useSelector((state) => state.user)
	const {
		selectedCalendar,
		selectedCalendarData,
		selectedSecondaryCalendars,
		selectedSecondaryCalendarsData,
	} = useSelector((state) => state.calendar)
	const {
		eventToEdit,
		selectedDate,
		selectedHour,
		setSelectedHour,
		generateInvitationId,
		getReminderHour,
		formatSelectedDate,
		handleSendInvitationEmail,
		getDateData,
		generateGradient,
	} = useContext(CalendarContext)
	const [selectedOption, setSelectedOption] = useState(eventToEdit.type)

	const [usersToInvite, setUsersToInvite] = useState(eventToEdit.invitedUsers)
	const [eventTitle, setEventTitle] = useState(eventToEdit.title)
	const [joinId, setJoinId] = useState(eventToEdit.joinId)
	const [location, setLocation] = useState(eventToEdit.location)
	const [description, setDescription] = useState(eventToEdit.description)
	const [attachment, setAttachment] = useState(eventToEdit.attachment)
	const [addMeet, setAddMeet] = useState(eventToEdit.addMeet)
	const [meetId, setMeetId] = useState(eventToEdit.meetId)
	const [visibility, setVisibility] = useState(eventToEdit.visibility)
	const [availability, setAvailability] = useState(eventToEdit.availability)
	const [notification, setNotification] = useState(eventToEdit.notification)
	const [expandedAdditionalInfo, setExpandedAdditionalInfo] = useState(true)
	const [timezone, setTimezone] = useState(eventToEdit.timeZone)
	const [repeat, setRepeat] = useState(eventToEdit.repeat)
	const [allDay, setAllDay] = useState(eventToEdit.allDay)
	const [hourDataExpanded, setHourDataExpanded] = useState(true)
	const [eventColor, setEventColor] = useState(eventToEdit.eventColor)
	const [rejectMeetings, setRejectMeetings] = useState(
		eventToEdit.rejectMeetings
	)
	const [rejectMessage, setRejectMessage] = useState(eventToEdit.rejectMessage)
	const [rejectOption, setRejectOption] = useState(eventToEdit.rejectOption)

	function generateRandomId() {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

		function getRandomSegment(length) {
			let segment = ''
			for (let i = 0; i < length; i++) {
				segment += chars[Math.floor(Math.random() * chars.length)]
			}
			return segment
		}

		const segment1 = getRandomSegment(3)
		const segment2 = getRandomSegment(4)
		const segment3 = getRandomSegment(3)

		return `${segment1}-${segment2}-${segment3}`
	}

	useEffect(() => {
		if (addMeet && !meetId) {
			setMeetId(eventToEdit.meetId)
		} else if (addMeet === false) {
			setMeetId()
		}
	}, [addMeet])



	const [isFocused, setIsFocused] = useState(false)

	const handleUpdateEvent = () => {
		const eventData = {
			type: selectedOption,
			date: formatSelectedDate(),
			title: eventTitle,
			description,
			hour: `${selectedHour.start.split(' ').join('').toLowerCase()} - ${selectedHour.end.split(' ').join('').toLowerCase()}`,
			organizer: user.user,
			timeZone: timezone,
			participants: [],
			invitedUsers: usersToInvite,
			joinId,
			reminder: '10 minutos antes',
			attachment,
			eventColor,
			allDay,
			repeat,
			notification,
			availability,
			visibility,
			meetId,
			addMeet,
		}
		dispatch(updateEvent({ eventId: eventToEdit.id, eventData }))
		dispatch(setModal(null))
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
	return (
		<div className={styles.modalContainer}>
	
			<div className={styles.modalScrollableContainer}>
				<div className={styles.inputContainer}>
					<input
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

				<div className={styles.buttons}>
					<button>Más opciones</button>
					<button onClick={() => handleUpdateEvent()} className={styles.save}>
						{selectedOption === 'Agenda de citas'
							? 'Configurar agenda'
							: 'Guardar'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default EventEditPopup
