import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from '../index.module.css'
import { useSelector } from 'react-redux'
import { CalendarContext } from '../../CalendarContext'
import { generateDayHours } from '../utils'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import EventOptionsPopUp from '../components/EventOptionsPopUp'
import { setModal } from '@src/slices/calendarSlices'
import EventCreationPopUp from '../components/EventCreationPopUp'

const CalendarTimeline = ({scrollX}) => {
	const dispatch = useDispatch()
	const { selectedCalendarEvents, selectedCalendarData } = useSelector(
		(state) => state.calendar
	)
	const {
		getRandomColor,
		showEventOptionsPopUp,
		setShowEventOptionsPopUp,
		currentTimelineDate,
		dayRangeStart,
		goToPreviousDayRange,
		goToNextDayRange,
		daysPerPage,
		convertTo24Hour,
		hourFormat,
		setSelectedDate,
		setSelectedHour,
		addMinutesToTime,
		daysInMonth,
		handleEvent,
		
	} = useContext(CalendarContext)
	const [hoveredDay, setHoveredDay] = useState(null)
	const hours = generateDayHours(6, 22, 60)

	const [containerWidth, setContainerWidth] = useState(0)

	const days = [...Array(daysInMonth).keys()].map((i) => i + 1)

	const maxEventsToShow = 3

	const eventsForDayRef = useRef(null)

	useEffect(() => {
		if (eventsForDayRef.current) {
			const width = eventsForDayRef.current.clientWidth
			setContainerWidth(width)
		}
	}, [eventsForDayRef.current])

	const [displayedDays, setDisplayedDays] = useState(
		days.slice(dayRangeStart - 1, dayRangeStart + daysPerPage - 1)
	)

	useEffect(() => {
		setDisplayedDays(
			days.slice(dayRangeStart - 1, dayRangeStart + daysPerPage - 1)
		)
	}, [dayRangeStart, daysPerPage, daysInMonth])

	const events = selectedCalendarEvents.map((ev) => {
		const splittedDate = ev.date.split('/')
		return {
			...ev,
			day: parseInt(splittedDate[0]),
			month: parseInt(splittedDate[1]),
			year: parseInt(splittedDate[2]),
		}
	})

	const groupEventsByDayAndHourRange = (events) => {
		const result = {}

		function getHourRange(hourRange) {
			const [startHour] = hourRange.split(' - ')
			const [time, period] = startHour
				.match(/(\d{1,2}:\d{2})([ap]m)/)
				.slice(1, 3)

			let [hour, minute] = time.split(':').map(Number)
			if (period === 'pm' && hour !== 12) hour += 12
			if (period === 'am' && hour === 12) hour = 0

			return { hour, minute, period }
		}

		function formatHour(hour) {
			const period = hour >= 12 ? 'pm' : 'am'
			const formattedHour = hour % 12 || 12
			return `${formattedHour}:00${period}`
		}

		for (const day in events) {
			if (!result[day]) {
				result[day] = {}
			}

			events[day].forEach((event) => {
				const eventHour = getHourRange(event.hour)
				const startTimeRange = formatHour(eventHour.hour)

				if (!result[day][startTimeRange]) {
					result[day][startTimeRange] = []
				}
				result[day][startTimeRange].push({ ...event, eventStart: eventHour })
			})
		}

		for (const day in result) {
			for (const timeRange in result[day]) {
				result[day][timeRange].sort((a, b) => {
					if (a.eventStart.hour === b.eventStart.hour) {
						return a.eventStart.minute - b.eventStart.minute
					}
					return a.eventStart.hour - b.eventStart.hour
				})

				result[day][timeRange] = result[day][timeRange].map((event) => {
					const { eventStart, ...rest } = event
					return rest
				})
			}
		}

		return result
	}

	const [eventsByDay, setEventsByDay] = useState([])

	useEffect(() => {
		const finalEvents = events.reduce((acc, event) => {
			if (
				event.year === currentTimelineDate.getFullYear() &&
				event.month === currentTimelineDate.getMonth() + 1
			) {
				if (!acc[event.day]) acc[event.day] = []
				const finalEvent = { ...event, color: getRandomColor() }
				acc[event.day].push(finalEvent)
			}
			return acc
		}, {})
		const groupedFinalEvents = groupEventsByDayAndHourRange(finalEvents)
		setEventsByDay(groupedFinalEvents)
	}, [currentTimelineDate])

	const getMaxEventsByHour = (eventsByDay, displayedDays) => {
		const maxEventsByHour = {}
		const hours = [
			'6:00am',
			'7:00am',
			'8:00am',
			'9:00am',
			'10:00am',
			'11:00am',
			'12:00pm',
			'1:00pm',
			'2:00pm',
			'3:00pm',
			'4:00pm',
			'5:00pm',
			'6:00pm',
			'7:00pm',
			'8:00pm',
			'9:00pm',
			'10:00pm',
		]

		hours.forEach((hour) => {
			maxEventsByHour[hour] = 1
		})

		const parseHour = (hourStr) => {
			const [time, period] = hourStr.match(/(\d{1,2}:\d{2})([ap]m)/).slice(1, 3)
			let [hour] = time.split(':').map(Number)

			if (period === 'pm' && hour !== 12) hour += 12
			if (period === 'am' && hour === 12) hour = 0

			return { hour }
		}

		displayedDays.forEach((day) => {
			const dayEvents = eventsByDay[day]
			if (dayEvents) {
				Object.keys(dayEvents).forEach((hour) => {
					const parsedHour = parseHour(hour)
					hours.forEach((hourRange) => {
						const bucketHour = parseHour(hourRange).hour
						if (parsedHour.hour === bucketHour) {
							const eventCount = dayEvents[hour].length
							maxEventsByHour[hourRange] = Math.max(
								maxEventsByHour[hourRange],
								eventCount
							)
						}
					})
				})
			}
		})

		return maxEventsByHour
	}

	const [maxEventsByHour, setMaxEventsByHour] = useState({})
	useEffect(() => {
		if (eventsByDay && displayedDays.length > 0) {
			const maxEvents = getMaxEventsByHour(eventsByDay, displayedDays)
			setMaxEventsByHour(maxEvents)
		}
	}, [displayedDays, eventsByDay])

	const calculateTopPx = (hour, hours, maxEventsByHour) => {
		let topPx = 0

		for (const previousHour of hours) {
			if (previousHour === hour) break

			topPx += 53 * (maxEventsByHour[previousHour] || 1)
		}

		return topPx
	}
	const eventDuration = selectedCalendarData.eventsDuration || 30

	const handleTimelineClick = (event) => {
		if (!event || !event.currentTarget) return

		const timelineRect = event.currentTarget.getBoundingClientRect()

		const clickX = event.clientX - timelineRect.left
		const clickY = event.clientY - timelineRect.top

		const dayWidth = timelineRect.width / daysPerPage
		const clickedDayIndex = Math.floor(clickX / dayWidth)
		const clickedDay = displayedDays[clickedDayIndex]

		let cumulativeHeight = 0
		let clickedHour = null

		for (let i = 0; i < hours.length; i++) {
			const hour = hours[i]
			const hourKey = hour.split(' ').join('').toLocaleLowerCase()
			const hourHeight = 53 * (maxEventsByHour[hourKey] || 1)

			if (
				clickY >= cumulativeHeight &&
				clickY < cumulativeHeight + hourHeight
			) {
				clickedHour = hour
				break
			}

			cumulativeHeight += hourHeight
		}

		if (clickedDay !== undefined && clickedHour !== null) {
			const day = parseInt(clickedDay)
			const month = parseInt(
				currentTimelineDate.getMonth().toString().padStart(2, '0')
			)
			const year = parseInt(currentTimelineDate.getFullYear())
			setSelectedDate({
				day,
				month,
				year,
			})
			setSelectedHour({
				start: clickedHour,
				end: addMinutesToTime(clickedHour, eventDuration),
			})
			dispatch(setModal(<EventCreationPopUp />))
		}
	}

	const handleHourItemClick = (event, clickedHour) => {
		const hourItemRect = event.currentTarget.getBoundingClientRect()

		const clickX = event.clientX - hourItemRect.left

		const dayWidth = hourItemRect.width / daysPerPage
		const clickedDayIndex = Math.floor(clickX / dayWidth)
		const clickedDay = displayedDays[clickedDayIndex]

		if (clickedDay !== undefined && clickedHour !== null) {
			const day = parseInt(clickedDay)
			const month = parseInt(
				currentTimelineDate.getMonth().toString().padStart(2, '0')
			)
			const year = parseInt(currentTimelineDate.getFullYear())
			setSelectedDate({
				day,
				month,
				year,
			})
			setSelectedHour({
				start: clickedHour,
				end: addMinutesToTime(clickedHour, eventDuration),
			})
			setTimeout(() => {
			handleEvent()
		}, 200)
		}
	}

	return (
		<div className={styles.timeline}>
			<div className={styles.dayContainer}>
				<button onClick={goToPreviousDayRange} className={styles.navArrow}>
					<FaChevronLeft />
				</button>
				<div
					style={{ width: 'calc(100% - 60px)' }}
					className={styles.timelineDays}
				>
					{displayedDays.map((day, i) => (
						<div
							key={i}
							style={{ width: `calc(100% / ${daysPerPage})` }}
							className={styles.timelineDay}
						>
							{day}
						</div>
					))}
				</div>
				<button onClick={goToNextDayRange} className={styles.navArrowRight}>
					<FaChevronRight />
				</button>
			</div>

			<div className={styles.eventsContainer}>
				<div className={styles.hoursWrapper}>
					{hours.map((hour, hourIndex) => (
						<div
							onClick={(e) => handleHourItemClick(e, hour)}
							key={hourIndex}
							style={{
								height: `${53 * (maxEventsByHour[hour.split(' ').join('').toLocaleLowerCase()] || 1)}px`,
							}}
							className={styles.hourItem}
						>
							<div className={scrollX < 60 ? styles.hourTextAbsolute : styles.hourText} style={ {left: scrollX < 60  && `${-50 + scrollX }px`}}>
								{hourFormat === '1:00pm' ? hour : convertTo24Hour(hour)}
							</div>
						</div>
					))}
				</div>

				<div
					onClick={(e) => {
						handleTimelineClick(e)
					}}
					className={styles.timelineEvents}
				>
					{displayedDays.map((day, dayIdx) =>
						Object.keys(eventsByDay[day] || {}).map((hour, hourIdx) => {
							const topPx = calculateTopPx(
								hour.split(' ').join('').toLocaleLowerCase(),
								hours.map((h) => h.split(' ').join('').toLocaleLowerCase()), 
								maxEventsByHour
							)
							const firstDay = parseInt(displayedDays[0])
							const currentDay = parseInt(day)
							const leftPercentage =
								(100 / daysPerPage) * (currentDay - firstDay)

							return (
								<div
									key={`${dayIdx}-${hourIdx}`}
									style={{
										position: 'absolute',
										top: `${topPx}px`,
										left: `${leftPercentage}%`,
										width:
											!eventsByDay[day][hour].some(
												(ev) => ev.id === hoveredDay
											) && `calc(100% / ${daysPerPage})`,
										maxWidth:
											!eventsByDay[day][hour].some(
												(ev) => ev.id === hoveredDay
											) && `calc(100% / ${daysPerPage})`,
									}}
									className={styles.eventsForDay}
									ref={eventsForDayRef}
								>
									{eventsByDay[day][hour].map((ev, evIdx) => (
										<div
											key={ev.id}
											onClick={(e) => {
												e.stopPropagation()
												setShowEventOptionsPopUp(ev.id)
											}}
											style={{ zIndex: hoveredDay === ev.id ? 100000 : 50000 }}
											className={styles.timelineEventCard}
											onMouseEnter={() => setHoveredDay(ev.id)}
											onMouseLeave={() => setHoveredDay(null)}
										>
											{showEventOptionsPopUp === ev.id && (
												<div className={styles.eventPopup}>
													<EventOptionsPopUp fromTimeline={true} event={ev} />
												</div>
											)}
											<div
												style={{ background: ev.color }}
												className={styles.eventColorDiv}
											/>
											<div className={styles.eventRightContainer}>
												<div className={styles.eventUserImage}>
													{ev.organizer && ev.organizer[0]}
												</div>
												<div className={styles.eventData}>
													<div
														style={{
															maxWidth:
																hoveredDay === ev.id
																	? 'none'
																	: `${containerWidth - 48}px`, 
														}}
														className={`${styles.eventTitle} ${
															hoveredDay === ev.id
																? styles.hoveredEventTitle
																: ''
														}`}
													>
														{ev.title}
													</div>
													<div
														style={{
															maxWidth:
																hoveredDay === ev.id
																	? 'none'
																	: `${containerWidth - 48}px`, 
														}}
														className={`${styles.eventDesc} ${
															hoveredDay === ev.id
																? styles.hoveredEventDesc
																: ''
														}`}
													>
														{ev.description}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)
						})
					)}
				</div>
			</div>
		</div>
	)
}

export default CalendarTimeline
