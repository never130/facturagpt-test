import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../CalendarsStyles.module.css'
import EventOptionsPopUp from '../../EventOptionsPopUp'
import { daysOfWeek } from './../../../utils'

const CustomMonthCalendar = ({
	selectedCalendarEvents,
	selectedDate,
	currentMonth,
	currentYear,
	formattedMonth,
}) => {
	const selectedHourContentRef = useRef(null)

	const { showEventOptionsPopUp, setShowEventOptionsPopUp, generateMonthDays } =
		useContext(CalendarContext)
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

	const actualDate = new Date(currentYear, currentMonth).toLocaleString(
		'default',
		{
			month: 'long',
			year: 'numeric',
		}
	)
	const actualDateUpper =
		actualDate.charAt(0).toUpperCase() + actualDate.slice(1)

	const [showPopUp, setShowPopUp] = useState()

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
		<div className={styles.calendarMonthWrapper}>
			<table className={styles.calendarMonth} border='1'>
				<thead>
					<tr>
						{daysOfWeek.map((day, index) => (
							<th key={index}>{day.slice(0, 3).toUpperCase()}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{weeks.map((week, weekIndex) => (
						<tr className={styles.monthTr} key={weekIndex}>
							{week.map((day, dayIndex) => {
								const currentDate = `${day.toString().padStart(2, '0')}/${monthsInSpanish[formattedMonth.split(' ')[0]]}/${formattedMonth.split(' ')[2]}`
								const hasEvent = selectedCalendarEvents.filter((event) => {
									if (currentDate === event.date) {
										return true
									}
									return false
								})
								return (
									<td
										className={styles.monthTd}
										key={dayIndex}
									>
										<div className={styles.day}>
											{showPopUp === currentDate && (
												<MonthPopUp
													day={day}
													onClose={() => setShowPopUp(false)}
													date={currentDate}
													events={hasEvent}
												/>
											)}
											<b
												className={
													day === selectedDate.day
														? styles.selectedMonthDayContainer
														: styles.monthDayContainer
												}
											>
												{day}
											</b>
											{hasEvent.length > 0 && (
												<ul className={styles.eventListContainer}>
													{hasEvent.slice(0, 4).map((e, index) => (
														<li
															ref={selectedHourContentRef}
															className={styles.monthDayLi}
															key={index}
															onClick={() => {
																hasEvent.length > 0 &&
																	setShowEventOptionsPopUp(e.id)
															}}
														>
															<div className={styles.date}>
																<div className={styles.dot} />
																<span>{`${e.hour} ${e.title}`}</span>
															</div>
															{showEventOptionsPopUp &&
																showEventOptionsPopUp === e.id && (
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
																		<EventOptionsPopUp event={e} />
																	</div>
																)}
														</li>
													))}
												</ul>
											)}
											{hasEvent.length > 4 && (
												<div
													onClick={() => setShowPopUp(currentDate)}
													className={styles.showMoreButton}
												>
													Ver mas...
												</div>
											)}
											{}
										</div>
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default CustomMonthCalendar
