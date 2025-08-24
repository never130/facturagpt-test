import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from './CalendarWeek.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { CalendarContext } from '../../CalendarContext'
import { getCurrentDay, generateWeekDays, generateDayHours } from '../utils'
import { setModal } from '@src/slices/calendarSlices'
import EventEditPopup from '../components/EventEditPopup'
import { updateEvent } from '@src/actions/calendar'
import { useDrag, useDrop } from 'react-dnd'

const ITEM_TYPE = 'event'

const CalendarWeek = ( {scrollX}) => {
	const dispatch = useDispatch()
	const {
		selectedCalendarEvents,
		selectedCalendarData,
		userInvitations,
		selectedSecondaryCalendarEvents,
	} = useSelector((state) => state.calendar)
	const {
		selectedDate,
		getWeekFromToday,
		selectedHour,
		setSelectedHour,
		getEventFinishHour,
		showEventOptionsPopUp,
		setEventToEdit,
		hourFormat,
		setSelectedDate,
		setShowEventOptionsPopUp,
		currentWeekStart,
		convertTo24Hour,
		handleEvent,
		convertTimeToTimezone,
	} = useContext(CalendarContext)

	const [popupHour, setPopupHour] = useState()

	const handleEventClick = (hour, hasEvent, day) => {
		const convertedDay = getCurrentDay(day)
		if (hasEvent.length > 0) {
			if (showEventOptionsPopUp !== hasEvent[0].id) {
				setShowEventOptionsPopUp(hasEvent[0].id)
				setPopupHour(hour)
			}
		} else {
			handleCellClick(day, hour)
		}
	}

	const days = generateWeekDays(currentWeekStart)
	const hours = generateDayHours(
		6,
		'fullDay',
		selectedCalendarData.eventsDuration
	)

	const handleCellClick = (day, hour) => {
		setSelectedDate({
			day: parseInt(day.split('/')[0]),
			month: parseInt(day.split('/')[1] - 1),
			year: parseInt(day.split('/')[2]),
		})
		setSelectedHour({ start: hour, end: getEventFinishHour(hour) })
		setTimeout(() => {
			handleEvent()
		}, 200)
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
				const hour = popupHour
				const isAm = hour.includes('AM')
				const parentRect =
					selectedHourContentRef.current.getBoundingClientRect()
				const popupRect = eventPopupRef.current.getBoundingClientRect()

				if (isAm === false) {
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

				setPopupPosition((prev) => ({
					...prev,
					left: '50%',
					right: 'auto',
					transform: 'translate(-50%, 0)',
				}))
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

	const Event = ({ ev }) => {
		const [, dragRef] = useDrag({
			type: ITEM_TYPE,
			item: { id: ev.id, type: 'event' },
		})

		return (
			<div
				ref={dragRef}
				className={styles.selectedHourContent}
				style={{
					background: ev.eventColor ? ev.eventColor : `var(--color-primary-5)`,
				}}
				onContextMenu={(e) => {
					e.preventDefault()
					e.stopPropagation()
					setEventToEdit(ev)
					const [start, end] = ev.hour.split(' - ')
					const hourStart =
						start.slice(0, -2) + ' ' + start.slice(-2).toUpperCase()
					const hourEnd = end.slice(0, -2) + ' ' + end.slice(-2).toUpperCase()
					setSelectedHour({ start: hourStart, end: hourEnd })
					setSelectedDate({
						day: parseInt(ev.date.split('/')[0]),
						month: parseInt(ev.date.split('/')[1] - 1),
						year: parseInt(ev.date.split('/')[2]),
					})
					dispatch(setModal(<EventEditPopup />))
				}}
			>
				{ev.type === 'Post' && (
					<TbSquareDotFilled
						style={{ position: 'absolute', top: '2px', right: '2px' }}
						size={12}
						color={`var(--color-primary-1)`}
					/>
				)}
				<div>{`${ev.title} (${ev.type})`}</div>
				<div>{ev.hour}</div>
			</div>
		)
	}

	const HourContent = ({ day, hour, hasEvent,scrollX}) => {
		const [, dropRef] = useDrop({
			accept: ITEM_TYPE,
			drop: (item) => {
				const draggedEvent = selectedCalendarEvents.find(
					(event) => event.id === item.id
				)
				if (draggedEvent) {
					const updatedEventData = {
						...draggedEvent,
						date: day,
						hour: `${hour.split(' ').join('').toLowerCase()} - ${getEventFinishHour(hour).split(' ').join('').toLowerCase()}`,
					}
					dispatch(
						updateEvent({
							eventId: draggedEvent.id,
							eventData: updatedEventData,
						})
					)
				}
			},
		})

		return (
			<td
				ref={dropRef}
				className={scrollX == 0 && styles.weekHourContent}
				onClick={() => handleEventClick(hour, hasEvent, day)}
			>
				{hasEvent.length > 0 &&
					hasEvent.map((ev, i) => <Event key={i} ev={ev} />)}
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
		<table ref={calendarDayRef} className={styles.calendarWeek} border='1'>

			<thead>
				<tr>
					<th className={styles.firstTh}>
						<div className={styles.ghostDiv}></div>
					</th>
					{days.map((day, index) => (
						<th key={index} className={styles.dayMonthContainer}>
							<div className={styles.dayMonthInnerContainerWrapperWeek}>
								<div className={styles.dayMonthInnerContainer}>
									<div className={styles.dayText}>{day.split(' ')[0]}</div>
									<div
										className={
											parseInt(day.split(' ')[1]) === selectedDate.day
												? styles.selectedDayCircle
												: styles.dayCircle
										}
									>
										{day.split(' ')[1]}
									</div>
								</div>
							</div>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{hours.map((hour, hourIndex) => (
					<tr key={hourIndex}>
						<td style={{position: "sticky",
								left: "0",background: "#f4f4f4"
							}}>
							<div className={styles.hourContainer} >
								{hourFormat === '1:00pm' ? hour : convertTo24Hour(hour)}
							</div>
						</td>
						{days.map((day, dayIndex) => {
							const actualWeek = getWeekFromToday(currentWeekStart)
							const actualDate = actualWeek[dayIndex]
							const hasEvent = events.filter((event) => {
								const actualHour = hour.split(' ').join('').toLowerCase()
								const eventDate = event.date
								const eventHour = event.hour.split(' - ')[0]
								return actualDate === eventDate && actualHour === eventHour
							})

							return (
								<HourContent
								scrollX={scrollX}
									key={dayIndex}
									day={actualDate}
									hour={hour}
									hasEvent={hasEvent}
								/>
							)
						})}
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default CalendarWeek
