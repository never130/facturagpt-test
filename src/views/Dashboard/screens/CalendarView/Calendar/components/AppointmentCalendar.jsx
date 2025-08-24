import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarContext } from '../../CalendarContext'
import styles from './AppointmentCalendar.module.css'
import { daysOfWeek } from '../utils'
import { useSelector } from 'react-redux'

const AppointmentCalendar = ({ year, month }) => {
	const {
		generateMonthDays,
		selectedAppointmentsDate,
		groupEventsByDate,
		formattedAppointmentsMonth,
		getRandomColor,
		handleCellClick,
	} = useContext(CalendarContext)
	const { selectedCalendarEvents, selectedCalendarData } = useSelector(
		(state) => state.calendar
	)

	const weeks = generateMonthDays(year, month)
	const today = new Date()
	const isCurrentMonth =
		today.getFullYear() === year && today.getMonth() === month
	const currentDay = today.getDate()

	const [eventColors, setEventColors] = useState({})

	useEffect(() => {
		const newEventColors = {}
		Object.keys(groupEventsByDate(selectedCalendarEvents)).forEach((date) => {
			const eventsOnDate = groupEventsByDate(selectedCalendarEvents)[date]
			newEventColors[date] = eventsOnDate.map(() => getRandomColor())
		})
		setEventColors(newEventColors)
	}, [])

	return (
		<table className={styles.miniCalendarTable} border={2}>
			<thead>
				<tr>
					{daysOfWeek.map((day, index) => (
						<th
							className={styles.miniCalendarTh}
							style={{ fontSize: 15 }}
							key={index}
						>
							{index === 0 && <div className={styles.tdLine}></div>}
							{index === daysOfWeek.length - 1 && (
								<div className={styles.tdLineEnd}></div>
							)}
							{index !== daysOfWeek.length - 1 && (
								<div className={styles.topLine}></div>
							)}
							{day[0]}
						</th>
					))}
				</tr>
			</thead>
			<tbody className={styles.miniCalendarTbody}>
				{weeks.map((week, weekIndex) => (
					<tr className={styles.miniCalendarTr} key={weekIndex}>
						{week.map((dayObj, dayIndex) => {
							const weeksLength = weeks.length - 1
							const lastTr = weekIndex === weeksLength
							const isToday =
								isCurrentMonth &&
								dayObj.month === 'current' &&
								dayObj.day === currentDay
							const isSelected =
								selectedAppointmentsDate.day === dayObj.day &&
								selectedAppointmentsDate.month === month &&
								selectedAppointmentsDate.year === year &&
								dayObj.month === 'current'
							const date = `${dayObj.day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${formattedAppointmentsMonth.split(' ')[2]}`
							const eventsOnDate = groupEventsByDate(selectedCalendarEvents)[
								date
							]

							return (
								<td
									className={
										lastTr ? styles.bottomMiniCalendarTd : styles.miniCalendarTd
									}
									key={dayIndex}
									onClick={() =>
										handleCellClick(dayObj.day, dayObj.month, true)
									}
								>
									{dayIndex !== week.length - 1 &&
										weekIndex === weeks.length - 1 && (
											<div className={styles.bottomLine}></div>
										)}
									{dayIndex === 0 && weekIndex !== weeks.length - 1 && (
										<div className={styles.tdLine}></div>
									)}
									{dayIndex === week.length - 1 &&
										weekIndex !== weeks.length - 1 && (
											<div className={styles.tdLineEnd}></div>
										)}
									<div
										className={`${styles.dayCell} ${isToday ? styles.currentDayCell : ''} ${isSelected ? styles.selectedDayCell : ''}`}
									>
										{dayObj.day}
									</div>
									{eventsOnDate && eventsOnDate.length > 0 && (
										<div className={styles.eventDotsContainer}>
											{eventsOnDate.slice(0, 3).map((ev, i) => (
												<div
													key={i}
													className={styles.eventDot}
													style={{
														background:
															ev.eventColor ||
															selectedCalendarData.calendarColor,
													}}
												></div>
											))}
											{eventsOnDate.length > 3 && (
												<div
													className={styles.eventDot}
													style={{
														background:
															eventsOnDate[3].eventColor ||
															selectedCalendarData.calendarColor,
													}}
												>
													+{eventsOnDate.length - 3}
												</div>
											)}
										</div>
									)}
								</td>
							)
						})}
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default AppointmentCalendar
