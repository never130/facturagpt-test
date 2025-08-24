import { useContext, useEffect, useState } from 'react'
import styles from './CustomAppointmentCalendar.module.css'
import { useSelector } from 'react-redux'
import { daysOfWeek } from '../../../utils'
import { CalendarContext } from '../../../../CalendarContext'

const CustomAppointmentCalendar = ({
	year,
	month,
	formattedMonth,
	selectedDate,
	handleCellClick,
	selectedCalendarEvents,
}) => {
	const { selectedCalendarData } = useSelector((state) => state.calendar)
	const { generateMonthDays, groupEventsByDate, getRandomColor } =
		useContext(CalendarContext)

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
								selectedDate.day === dayObj.day &&
								selectedDate.month === month &&
								selectedDate.year === year &&
								dayObj.month === 'current'
							const date = `${dayObj.day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${formattedMonth.split(' ')[2]}`
							const eventsOnDate = groupEventsByDate(selectedCalendarEvents)[
								date
							]

							return (
								<td
									className={
										lastTr ? styles.bottomMiniCalendarTd : styles.miniCalendarTd
									}
									key={dayIndex}
									onClick={() => handleCellClick(dayObj.day, dayObj.month)}
								>
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
															ev?.eventColor ||
															selectedCalendarData.calendarColor,
													}}
												></div>
											))}
											{eventsOnDate.length > 3 && (
												<div
													className={styles.eventDot}
													style={{
														background:
															eventsOnDate[3]?.eventColor ||
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

export default CustomAppointmentCalendar
