import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import styles from '../index.module.css'
import { daysOfWeek, formatDate } from '../utils'
import { CalendarContext } from '../../CalendarContext'
import DroppableCell from './DroppableCell'

const CalendarMonth = ({ fromPreview, previewSettings }) => {
	const dispatch = useDispatch()
	const { kanban } = useSelector((state) => state.kanban)
	const {
		selectedCalendarEvents,
		selectedSecondaryCalendarEvents,
		userInvitations,
		selectedCalendarData,
	} = useSelector((state) => state.calendar)
	const {
		selectedDate,
		setSelectedHour,
		showEventOptionsPopUp,
		currentMonth,
		formattedMonth,
		setShowEventOptionsPopUp,
		generateMonthDays,
		currentYear,
		setSelectedDate,
		addMinutesToTime,
		handleEvent,
		hourFormat,
		convertTimeRangeTo24Hour,
		convertTimeToTimezone,
	} = useContext(CalendarContext)

	const [attachments, setAttachments] = useState(
		selectedCalendarData.attachedTasksData || []
	)



	const weeks = generateMonthDays(currentYear, currentMonth).map((week) =>
		week.map((dayObj) => dayObj.day)
	)
	const monthsInSpanish = {
		Enero: '01',
		Febrero: '02',
		Marzo: '03',
		Abril: '04',
		Mayo: '05',
		Junio: '06',
		Julio: '07',
		Agosto: '08',
		Septiembre: '09',
		Octubre: '10',
		Noviembre: '11',
		Diciembre: '12',
	}

	const [showPopUp, setShowPopUp] = useState()

	const formatCurrentDate = (day) => {
		return `${day.toString().padStart(2, '0')}/${monthsInSpanish[formattedMonth.split(' ')[0]]}/${formattedMonth.split(' ')[2]}`
	}

	const [events, setEvents] = useState([])

	const filteredUserInvitations = useMemo(() => {
		return userInvitations.filter((inv) => {
			if (selectedCalendarData.showDeniedEvents) {
				return true
			} else {
				return inv.response !== 'denied' && inv.response !== 'pending'
			}
		})
	}, [userInvitations])

	const secondaryCalendarsEvents = useMemo(() => {
		return selectedSecondaryCalendarEvents?.length > 0
			? [...selectedSecondaryCalendarEvents]
			: []
	}, [selectedSecondaryCalendarEvents])

	useEffect(() => {
		const combinedEvents = [
			...filteredUserInvitations,
			...selectedCalendarEvents,
			...secondaryCalendarsEvents,
		].map((ev) => {
			const evTimezone =
				ev.timeZone === '(GMT+01:00)'
					? '(GMT+01:00) España - Madrid'
					: ev.timeZone
			const calTimezone =
				selectedCalendarData.timezone === '(GMT+01:00)'
					? '(GMT+01:00) España - Madrid'
					: selectedCalendarData.timezone

			if (evTimezone === calTimezone) {
				return ev
			} else {
				const [start, end] = ev.hour.split(' - ')
				const newStartHour = convertTimeToTimezone(
					start,
					evTimezone,
					calTimezone
				)
				const newEndHour = convertTimeToTimezone(end, evTimezone, calTimezone)
				return { ...ev, hour: `${newStartHour} - ${newEndHour}` }
			}
		})
		setEvents(combinedEvents)
	}, [
		filteredUserInvitations,
		selectedCalendarEvents,
		secondaryCalendarsEvents,
	])

	return (
		<div className={styles.calendarMonthWrapper}>
			<table className={styles.calendarMonth} border='1'>
				<thead>
					<tr>
						{daysOfWeek.map((day, index) => (
							<th
								className={styles.monthDayHeader}
								style={{
									border: !fromPreview
										? `1px solid var(--border-color)`
										: fromPreview && previewSettings.border
											? `1px solid var(--border-color)`
											: fromPreview && !previewSettings.border
												? 'none'
												: '',
									background: fromPreview
										? `var(--fa-background)`
										: `var(--fa-background)`,
								}}
								key={index}
							>
								{day.slice(0, 3).toUpperCase()}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{weeks.map((week, weekIndex) => (
						<tr className={styles.monthTr} key={weekIndex}>
							{week.map((day, dayIndex) => {
								const currentDate = formatCurrentDate(day)

								const hasEvent = events.filter(
									(event) => currentDate === event.date
								)
								const hasTasks = attachments?.filter(
									(attachment) => formatDate(attachment.date) === currentDate
								)


								return (
									<DroppableCell
										key={dayIndex}
										date={currentDate}
										hasEvent={hasEvent}
										hasTasks={hasTasks}
										fromPreview={fromPreview}
										previewSettings={previewSettings}
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
										setSelectedHour={setSelectedHour}
										addMinutesToTime={addMinutesToTime}
										dispatch={dispatch}
										showPopUp={showPopUp}
										setShowPopUp={setShowPopUp}
										hourFormat={hourFormat}
										convertTimeRangeTo24Hour={convertTimeRangeTo24Hour}
										setShowEventOptionsPopUp={setShowEventOptionsPopUp}
										showEventOptionsPopUp={showEventOptionsPopUp}
										handleEvent={handleEvent}
									/>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default CalendarMonth
