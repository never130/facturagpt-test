import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../CalendarsStyles.module.css'
import {
	generateDayHours,
	generateWeekDays,
	getCurrentDay,
} from '../../../utils'
import EventOptionsPopUp from '../../EventOptionsPopUp'
import { CalendarContext } from '../../../../CalendarContext'

const CustomWeekCalendar = ({
	selectedCalendarEvents,
	selectedCalendarData,
	selectedDate,
	selectedHour,
	setSelectedHour,
	setSelectedDate,
	currentWeekStart,
	actualWeek,
	formattedMonth,
}) => {
	const {
		getWeekFromToday,
		getEventFinishHour,
		showEventOptionsPopUp,
		setShowEventOptionsPopUp,
	} = useContext(CalendarContext)

	const handleEventClick = (hour, hasEvent, day) => {
		const convertedDay = getCurrentDay(day)
		if (hasEvent.length > 0) {
			setShowEventOptionsPopUp(hasEvent[0].id)
		} else {
			handleCellClick(day, hour)
		}
	}

	const days = generateWeekDays(currentWeekStart)
	const hours = generateDayHours(6, 22, selectedCalendarData.eventsDuration)

	const handleCellClick = (day, hour) => {
		setSelectedDate({
			day: parseInt(day.split('/')[0]),
			month: parseInt(day.split('/')[1] - 1),
			year: parseInt(day.split('/')[2]),
		})
		setSelectedHour({ start: hour, end: getEventFinishHour(hour) })

	}

	const selectedHourContentRef = useRef(null)
	const eventPopupRef = useRef(null)
	const [popupPosition, setPopupPosition] = useState({
		left: '50%',
		transform: 'translate(-50%, -50%)',
	})

	useEffect(() => {
		const updatePopupPosition = () => {
			if (selectedHourContentRef.current && eventPopupRef.current) {
				const parentRect =
					selectedHourContentRef.current.getBoundingClientRect()
				const popupRect = eventPopupRef.current.getBoundingClientRect()
				const viewportHeight = window.innerHeight

				if (parentRect.bottom < popupRect.height + popupRect.y) {
					setPopupPosition((prev) => ({
						...prev,
						top: 'auto',
						bottom: '100%', 
						transform: 'translate(-50%, 0)', 
					}))
				} else {
					setPopupPosition((prev) => ({
						...prev,
						top: '100%', 
						bottom: 'auto',
						transform: 'translate(-50%, 0)', 
					}))
				}

				if (popupRect.x > popupRect.width) {
					setPopupPosition((prev) => ({
						...prev,
						left: 'auto',
						right: '0',
						transform: 'translate(0, 0)', 
					}))
				} else if (popupRect.x < popupRect.width) {
					setPopupPosition((prev) => ({
						...prev,
						left: '0',
						right: 'auto',
						transform: 'translate(0, 0)', 
					}))
				} else {
					setPopupPosition((prev) => ({
						...prev,
						left: '50%',
						right: 'auto',
						transform: 'translate(-50%, 0)', 
					}))
				}
			}
		}

		if (showEventOptionsPopUp) {
			updatePopupPosition() 
		}

		window.addEventListener('resize', updatePopupPosition) 
		return () => {
			window.removeEventListener('resize', updatePopupPosition)
		}
	}, [showEventOptionsPopUp])

	return (
		<table className={styles.calendarWeek} border='1'>
			<thead>
				<tr>
					<th></th>
					{days.map((day, index) => {
						const splitted = actualWeek.split(' ')
						const splittedF = formattedMonth.split(' ')
						const actualMonth = `${splitted[3]} ${splitted[4]}`
						const current = `${splittedF[0].slice(0, 3)} ${splittedF[2]}`
						return (
							<th key={index} className={styles.dayMonthContainer}>
								<div className={styles.dayMonthInnerContainerWrapperWeek}>
									<div className={styles.dayMonthInnerContainer}>
										<div className={styles.dayText}>{day.split(' ')[0]}</div>
										<div
											className={
												parseInt(day.split(' ')[1]) === selectedDate.day &&
												actualMonth === current
													? styles.selectedDayCircle
													: styles.dayCircle
											}
										>
											{day.split(' ')[1]}
										</div>
									</div>
								</div>
							</th>
						)
					})}
				</tr>
			</thead>
			<tbody>
				<tr>
					<td className={styles.hourZoneWrapper}>
						<div className={styles.hourZoneInner}>GMT-03</div>
					</td>
					<td style={{ background: `var(--f5-background)` }}></td>
				</tr>
				<td
					style={{ background: `var(--f5-background)` }}
					className={styles.belowGMTTd}
				></td>
				{days.map((day, i) => (
					<td key={i}></td>
				))}
				{hours.map((hour, hourIndex) => (
					<tr key={hourIndex}>
						<td>
							<div className={styles.hourContainer}>{hour}</div>
						</td>
						{days.map((day, dayIndex) => {
							const actualWeek = getWeekFromToday()
							const actualDate = actualWeek[dayIndex]
							const hasEvent = selectedCalendarEvents.filter((event) => {
								const actualHour = hour.split(' ').join('').toLowerCase()
								if (actualDate === event.date) {
									if (actualHour === event.hour.split(' - ')[0]) {
										return true
									}
								}
								return false
							})
							return (
								<td
									key={dayIndex}
									className={styles.weekHourContent}
									onClick={() => handleEventClick(hour, hasEvent, actualDate)}
								>
									{hasEvent.length > 0 &&
										hasEvent.map((ev, i) => (
											<div
												key={i}
												className={styles.selectedHourContent}
												ref={selectedHourContentRef}
											>
												<div>{`${ev.title} (${ev.type})`}</div>
												<div>{ev.hour}</div>
												{showEventOptionsPopUp &&
													hasEvent.length > 0 &&
													showEventOptionsPopUp === ev.id && (
														<div
															className={styles.eventPopup}
															ref={eventPopupRef}
															style={{
																left: popupPosition.left,
																right: popupPosition.right,
																bottom: popupPosition.bottom,
																top: popupPosition.top,
																transform: popupPosition.transform,
															}}
														>
															<EventOptionsPopUp event={ev} />
														</div>
													)}
											</div>
										))}
									{hasEvent.length === 0 &&
										selectedHour.start === hour &&
										selectedDate.day === parseInt(day.split(' ')[1]) && (
											<div className={styles.selectedHourContent}>
												<div>{`(No Title)`}</div>
												<div>{`${selectedHour.start.split(' ').join('').toLowerCase()} - ${selectedHour.end.split(' ').join('').toLowerCase()}`}</div>
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

export default CustomWeekCalendar
