import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CalendarContext } from '../../CalendarContext'
import { generateDayHours, getCurrentDay } from '../utils'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './CalendarDay.module.css'
import { updateEvent } from '@src/actions/calendar'

const ITEM_TYPE = 'EVENT'

const CalendarDay = ({scrollX}) => {
	const dispatch = useDispatch()
	const selectedHourContentRef = useRef(null)
	const {
		selectedCalendarEvents,
		selectedCalendarData,
		selectedSecondaryCalendarEvents,
		selectedSecondaryCalendars,
		userSharedEvents,
		userInvitations,
		selectedCalendar,
		userWorkShifts,
	} = useSelector((state) => state.calendar)
	const {
		selectedDate,
		getMonthName,
		selectedHour,
		setSelectedHour,
		setEventToEdit,
		getEventFinishHour,
		formatSelectedDate,
		setSelectedDate,
		showEventOptionsPopUp,
		setShowEventOptionsPopUp,
		hourFormat,
		convertTo24Hour,
		getReminderHour,
		isTimeInRange,
		convertTimeToTimezone,
		handleEvent,
	} = useContext(CalendarContext)

	const [popupHour, setPopupHour] = useState()
	const hours = generateDayHours(
		6,
		'fullDay',
		selectedCalendarData?.eventsDuration
	)


	const [workIntervals, setWorkIntervals] = useState([])
	const [workEvents, setWorkEvents] = useState([])

	const parseHourString = (hourStr, date) => {
		const [time, period] = hourStr.split(' ')
		let [hours, minutes] = time.split(':')?.map(Number)
		if (period === 'PM' && hours !== 12) {
			hours += 12
		}
		if (period === 'AM' && hours === 12) {
			hours = 0
		}
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			hours,
			minutes
		)
	}

	const processWorkShifts = (workShift) => {
		const intervals = []

		if (!workShift || !workShift.shifts || workShift.shifts.length === 0) {
			return intervals
		}

		let shifts = workShift.shifts
			.slice()
			.sort((a, b) => new Date(a.hour) - new Date(b.hour))
		const tasks = workShift.tasks || []

		for (let i = 0; i < shifts.length; i++) {
			const currentShift = shifts[i]
			const nextShift = shifts[i + 1]

			const interval = {
				start: new Date(currentShift.hour),
				end: nextShift ? new Date(nextShift.hour) : null,
				type: currentShift.type === 'going' ? 'working' : 'paused',
				tasks: [],
			}

			if (!nextShift) {
				if (workShift.date === new Date().toISOString().split('T')[0]) {
					interval.end = interval.start
				} else {
					interval.end = new Date(`${workShift.date}T23:59:59.999Z`)
				}
			}

			interval.tasks = tasks
				.filter((task) => {
					const taskTime = new Date(task.hour)
					return taskTime >= interval.start && taskTime < interval.end
				})
				?.map((task) => {
					const taskTime = new Date(task.hour)
					const options = { hour: 'numeric', minute: '2-digit', hour12: true }
					const formattedTime = taskTime
						.toLocaleTimeString('en-US', options)
						.toLowerCase()
					return {
						...task,
						hour: formattedTime,
					}
				})

			intervals.push(interval)
		}

		return intervals
	}

	useEffect(() => {
		const currentDate = `${selectedDate.year}-${(selectedDate.month + 1)
			.toString()
			.padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`
		const todayWorkShift = userWorkShifts.find((ws) => ws.date === currentDate)

		if (todayWorkShift) {
			const intervals = processWorkShifts(todayWorkShift)
			setWorkIntervals(intervals)
		} else {
			setWorkIntervals([])
		}
	}, [userWorkShifts, selectedDate, selectedCalendarData])

	useEffect(() => {
		const workEvents = workIntervals?.map((interval, index) => {
			const startHour = interval.start
			const endHour = interval.end

			const hourFormatOptions = {
				hour: 'numeric',
				minute: 'numeric',
				hour12: true,
			}
			const startHourStr = startHour.toLocaleTimeString(
				'en-US',
				hourFormatOptions
			)
			const endHourStr = endHour.toLocaleTimeString('en-US', hourFormatOptions)

			return {
				id: `workEvent-${index}`,
				title: interval.type === 'working' ? 'Working' : 'Paused',
				hour: `${startHourStr} - ${endHourStr}`,
				date: `${selectedDate.day.toString().padStart(2, '0')}/${(
					selectedDate.month + 1
				)
					.toString()
					.padStart(2, '0')}/${selectedDate.year}`,
				eventColor: interval.type === 'working' ? '#00FF00' : '#FF0000',
				type: interval.type,
				isWorkEvent: true,
				tasks: interval.tasks || [],
			}
		})
		setWorkEvents(workEvents)
	}, [workIntervals])

	const calculateHeight = (interval, intervalMinutes = 30) => {
		const heightPerInterval = 40

		const [startTime, endTime] = interval.split(' - ')

		function timeToMinutes(time) {
			const [hourMinute, period] = time.split(/(am|pm)/i)
			let [hours, minutes] = hourMinute.split(':')?.map(Number)

			if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12
			if (period.toLowerCase() === 'am' && hours === 12) hours = 0

			return hours * 60 + minutes
		}

		const startMinutes = timeToMinutes(startTime.trim())
		const endMinutes = timeToMinutes(endTime.trim())

		let totalMinutes = endMinutes - startMinutes
		if (totalMinutes < 0) totalMinutes += 24 * 60

		return (totalMinutes / intervalMinutes) * heightPerInterval
	}

	const calculateTopPosition = (
		intervalStart,
		eventStart,
		intervalMinutes = 30,
		minus
	) => {
		const heightPerInterval = 40

		function timeToMinutes(time) {
			const [hourMinute, period] = time.split(/(am|pm)/i)
			let [hours, minutes] = hourMinute.split(':')?.map(Number)

			if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12
			if (period.toLowerCase() === 'am' && hours === 12) hours = 0

			return hours * 60 + minutes
		}

		const intervalStartMinutes = timeToMinutes(intervalStart.trim())
		const eventStartMinutes = timeToMinutes(eventStart.trim())

		const offsetMinutes = eventStartMinutes - intervalStartMinutes

		const fractionOfInterval = offsetMinutes / intervalMinutes
		const topPosition = fractionOfInterval * heightPerInterval

		if (minus) {
			return topPosition - minus
		}
		return topPosition
	}


	
	const handleCellClick = (day, hour) => {
		setSelectedHour({ start: hour, end: getEventFinishHour(hour) })
		setTimeout(() => {
			handleEvent()
		}, 200)
	}

	const EventItem = ({ event, hour, floating, isWorkEvent }) => {
		
		const [{ isDragging }, drag] = useDrag({
			type: ITEM_TYPE,
			item: { event },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		})

		const opacity = isDragging ? 0.4 : 1

		return (
			<div
				ref={drag}
				className={
					floating ? styles.floatingHourContent : styles.selectedHourContent
				}
				style={{
					background: event.eventColor
						? event.eventColor
						: `var(--color-primary-5)`,
					opacity,
					height:
						isWorkEvent &&
						calculateHeight(
							event.hour,
							selectedCalendarData.eventsDuration || 30
						),
					minHeight: '40px',
					top: calculateTopPosition(
						hour,
						event.hour.split(' - ')[0],
						selectedCalendarData.eventsDuration || 30
					),
				}}
				onClick={(e) => {
					e.stopPropagation()
					setPopupHour(hour)
					setShowEventOptionsPopUp(event.id)
				}}
			>
				<div>{`${event.title} (${event.type})`}</div>
				<div>{event.hour}</div>
				{event?.tasks &&
					event?.tasks?.map((task) => (
						<div
							style={{
								minHeight: '18px',
								top: calculateTopPosition(
									hour,
									task.hour.split(' ').join(''),
									selectedCalendarData.eventsDuration || 30,
									calculateTopPosition(
										hour,
										event.hour.split(' - ')[0],
										selectedCalendarData.eventsDuration || 30
									)
								),
							}}
							className={`${styles.singleTask} ${styles[`task-${task.status}`]}`}
						>{`${task.hour} ${task.text}`}</div>
					))}
			</div>
		)
	}
	
	const HourContainer = ({ hour, children,scrollX }) => {
		const [, drop] = useDrop({
			accept: ITEM_TYPE,
			drop: (item) => {
				const eventData = {
					...item.event,
					hour: `${hour.split(' ').join('').toLowerCase()} - ${getEventFinishHour(hour).split(' ').join('').toLowerCase()}`, 
				}
				dispatch(updateEvent({ eventId: item.event.id, eventData }))
			},
		})

		return (
			<td
				ref={drop}
				className={ scrollX == 0 ? styles.hourContent : styles.hourContentOutPosition }
				onClick={() => handleCellClick(getCurrentDay(), hour)}
			>
				{children}
			</td>
		)
	}

	const calendarDayRef = useRef(null)
	const [timezonePosition, setTimezonePosition] = useState({ top: 0, left: 0 })

	useEffect(() => {
		const calendarDay = calendarDayRef.current

		if (calendarDay) {
			const rect = calendarDay.getBoundingClientRect()
			setTimezonePosition({
				top: rect.top,
				left: rect.left,
			})
		}
	}, [])

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
			...workEvents,
		]?.map((ev) => {
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
			} else if (ev.isWorkEvent) {
				const [startStr, endStr] = ev.hour.split(' - ')
				const eventStartHour = startStr.split(' ').join('').toLowerCase()
				const eventEndHour = endStr.split(' ').join('').toLowerCase()
				return { ...ev, hour: `${eventStartHour} - ${eventEndHour}` }
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
		workEvents,
	])

	if (!selectedCalendar || Object.keys(selectedCalendarData).length === 0)
		return null

	return (
		<DndProvider backend={HTML5Backend}>
	
			<table ref={calendarDayRef} className={styles.calendarDay} border='1'>
				<thead className={styles.calendarDayHeader}>
					<tr>
						<th className={styles.firstTh}></th>
						<th className={styles.dayMonthContainer}>
							<div className={styles.dayMonthInnerContainerWrapper}>
								<div className={styles.dayMonthInnerContainer}>
									<div className={styles.dayText}>
										{getMonthName(selectedDate.month).slice(0, 3).toUpperCase()}
									</div>
									<div
										className={styles.selectedDayCircle}
									>{`${selectedDate.day}`}</div>
								</div>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{hours?.map((hour, hourIndex) => {
						const hasEvent = events.filter((event) => {
							const actualSelectedDate = formatSelectedDate()
							const actualHour = hour.split(' ').join('').toLowerCase()
							const followingHour = getReminderHour(
								actualHour,
								selectedCalendarData.eventsDuration || 30,
								true
							)
							const eventHour = event.hour.split(' - ')[0]

							const fallsInRange = isTimeInRange(
								actualHour,
								followingHour,
								eventHour
							)

							const isOnRange = fallsInRange && eventHour !== followingHour
							
							if (
								actualSelectedDate === event.date &&
								fallsInRange &&
								actualHour !== eventHour &&
								eventHour !== followingHour
							) {
								return true
							}
							return (
								actualSelectedDate === event.date && actualHour === eventHour
							)
						})

						const isFloating = events.filter((event) => {
							const actualSelectedDate = formatSelectedDate()
							const actualHour = hour.split(' ').join('').toLowerCase()
							const followingHour = getReminderHour(
								actualHour,
								selectedCalendarData.eventsDuration || 30,
								true
							)
							
							const eventHour = event.hour.split(' - ')[0]

							const fallsInRange = isTimeInRange(
								actualHour,
								followingHour,
								eventHour
							)

							const isOnRange = fallsInRange && eventHour !== followingHour
							
							if (
								actualSelectedDate === event.date &&
								fallsInRange &&
								actualHour !== eventHour &&
								eventHour !== followingHour
							) {
								return true
							} else {
								return false
							}
						})

						return (
							<tr
								style={{ marginTop: hourIndex === 0 && '5px' }}
								key={hourIndex}
							>
								<td style={{position: "sticky",
								left: "0",background: "#f4f4f4"
							}}>
									<div className={styles.hourContainer}>
										{hourFormat === '1:00pm' ? hour : convertTo24Hour(hour)}
									</div>
								</td>
								<HourContainer hour={hour} scrollX={scrollX}>
									{hasEvent.length > 0 &&
										hasEvent?.map((event, index) => {
											if (event.invited) {
												return (
													<div
														key={index}
														className={styles.selectedHourContent}
														style={{
															background:
																event.response === 'denied'
																	? `var(--text-color)`
																	: 'linear-gradient(90deg, #ff7e5f, #feb47b, #ffcc33, #6a82fb, #fc5c7d)',
															opacity:"1",
															position: scrollX !== 0 && "unset"
															

															
														}}
														onClick={(e) => {
															e.stopPropagation()
															setPopupHour(hour)
															setShowEventOptionsPopUp(event.id)
														}}
													>
														<div>{`${event.title} (${event.type}) (INVITACION ${event.response === 'denied' ? 'RECHAZADA' : 'ACEPTADA'}) `}</div>
														<div>{event.hour}</div>
													</div>
												)
											} else if (isFloating.some((f) => f.id === event.id)) {
												return (
													<EventItem
														key={index}
														event={event}
														hour={hour}
														floating={true}
														isWorkEvent={event.isWorkEvent || false}
													/>
												)
											} else {
												return (
													<EventItem key={index} event={event} hour={hour} />
												)
											}
										})}
									{hasEvent.length === 0 && selectedHour.start === hour && (
										<div
											className={styles.selectedHourContent}
											style={{ background: `var(--color-primary-5)`,opacity: scrollX !== 0 && "1",
												position: scrollX !== 0 && "unset" }}
										>
											<div>{`(No Title)`}</div>
											<div>{`${selectedHour.start.split(' ').join('').toLowerCase()} - ${selectedHour.end
												.split(' ')
												.join('')
												.toLowerCase()}`}</div>
										</div>
									)}
								</HourContainer>
							</tr>
						)
					})}
				</tbody>
			</table>
		</DndProvider>
	)
}

export default CalendarDay
