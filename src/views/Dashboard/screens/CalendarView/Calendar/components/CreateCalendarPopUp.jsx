import React, { useContext, useState } from 'react'
import styles from './CreateCalendarPopUp.module.css'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { createCalendar, getUserCalendars } from '@src/actions/calendar'
import { setModal } from '@src/slices/calendarSlices'
import CustomDropDown from './CustomDropDown'
import { CalendarContext } from '../../CalendarContext'
import { timezones } from '../utils/constants'
const CreateCalendarPopUp = () => {
	const dispatch = useDispatch()
	const { generateInvitationId, getRandomColor } = useContext(CalendarContext)
	const { user } = useSelector((state) => state.user)
	const [calendarName, setCalendarName] = useState('')
	const [description, setDescription] = useState('')
	const [selectedTimeZone, setSelectedTimeZone] = useState(
		'(GMT+01:00) España - Madrid'
	)

	const handleCreateCalendar = () => {
		if (calendarName.trim() === '') {
			alert('Please enter a calendar name.')
			return
		}

		const newCalendar = {
			userId: user.id,
			calendarData: {
				owner: user.user,
				calendarName,
				description,
				timezone: selectedTimeZone,
				language: 'Español',
				country: 'España',
				dateFormat: '31/12/2024',
				hourFormat: '1:00am',
				showSecondayTimezone: false,
				askToChangeTimezone: false,
				eventsDuration: 30,
				fastMeetings: false,
				shareId: generateInvitationId(),
				importedEvents: [],
				workingHoursSettings: {},
				guestPermissions: 'Ver lista de invitados',
				showWeekends: true,
				showDeniedEvents: false,
				showFinishedTasks: true,
				showWeekNumber: true,
				showShorterEventsAs30: false,
				lowerPastEventsBrightness: true,
				weekStartsAt: 'Lunes',
				defaultView: '2 días',
				showEventsCreatedByAythen: true,
				emailEventsPrivacy: 'Calendario por defecto',
				enableWorkSchedule: false,
				createAppointmentsCalendarInsteadOfAvailableHours: false,
				publicCalendar: false,
				publicSharing: false,
				shareWithAythen: true,
				showCalendarInfoOnOtherAythenApps: true,
				enableSideBySide: false,
				events: [],
				attachedTasks: [],
				calendarColor: getRandomColor(),
				calendarEventsReminder: 10,
				calendarNotifications: {
					newEvents: false,
					modifiedEvents: false,
					canceledEvents: false,
					invitationsAnswers: false,
					dailySchedule: false, 
				},
				previewSettings: {
					showTitle: true,
					showNavButtons: true,
					showDate: true,
					showPrint: true,
					showTabs: true,
					showCalendarsList: true,
					showTimezone: true,
					backgroundColor: 'default',
					border: true,
					defaultCalendar: 'Mes',
					weekStarts: 'Lunes',
					timezone: 'default',
					language: 'default',
				},
			},
		}

		dispatch(createCalendar(newCalendar)).then(() =>
			dispatch(getUserCalendars({ userId: user.id }))
		)
		dispatch(setModal(null))
	}

	return (
		<div className={styles.popupContainer}>
			<h2 className={styles.popupTitle}>Crear nuevo calendario</h2>
			<div className={styles.inputContainer}>
				<input
					type='text'
					placeholder='Nombre'
					value={calendarName}
					onChange={(e) => setCalendarName(e.target.value)}
					className={styles.inputField}
				/>
			</div>
			<div className={styles.inputContainer}>
				<textarea
					placeholder='Descripción'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className={styles.textArea}
				/>
			</div>
			<CustomDropDown
				fullWidth={true}
				title='Zona horaria'
				placeholder='Selecciona una zona horaria'
				options={timezones}
				selectedOption={selectedTimeZone}
				setSelectedOption={setSelectedTimeZone}
			/>
			<div className={styles.ownerInfo}>
				<label>Organizador</label>
				<div className={styles.ownerName}>{user.user}</div>
			</div>
			<button onClick={handleCreateCalendar} className={styles.createButton}>
				Crear calendario
			</button>
		</div>
	)
}

export default CreateCalendarPopUp
