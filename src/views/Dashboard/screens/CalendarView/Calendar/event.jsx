import React, { useContext, useEffect, useRef, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { GoTriangleDown } from 'react-icons/go'
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md'
import { IoMdAdd, IoMdCalendar } from 'react-icons/io'

import styles from './event.module.css'

import MenuWorkspace from './MenuWorkspace.jsx'

import { daysOfWeek } from './utils.jsx'
import { CalendarContext } from '../CalendarContext.jsx'
import EventCreationPopUp from './components/EventCreationPopUp.jsx'
import CalendarUsersPopUp from './components/CalendarUsersPopUp.jsx'
import CreateCalendarPopUp from './components/CreateCalendarPopUp.jsx'
import {
	setModal,

	setSecondaryCalendars,
	setSelectedSecondaryCalendars,
	swapMainCalendar,
} from '@src/slices/calendarSlices.js'
import ProgressBar from './components/ProgressBar.jsx'
import EventOptionsDropdown from './components/EventOptionsDropdown.jsx'

export const Menu = ({ handleCalendarCreation }) => {
	const dispatch = useDispatch()
	const [hideNotSelectedCalendars, setHideNotSelectedCalendars] =
		useState(false)
	const { user } = useSelector((state) => state.user)
	const {
		userCalendars,
		selectedCalendar,
		allUserEvents,
		selectedCalendarData,
		selectedSecondaryCalendars,
		selectedCalendarEvents,
	} = useSelector((state) => state.calendar)

	const searchPeopleRef = useRef(null)
	const buttonRef = useRef(null)

	const [showPeoplePopUp, setShowPeoplePopUp] = useState(false)
	const [searchPeople, setSearchPeople] = useState('')
	const {
		handlePreviousMonth,
		handleNextMonth,
		currentMonth,
		currentYear,
		showEventCreationPopUp,
		setShowEventCreationPopUp,
		handleCalendar,
		currentMonthEventsTimes,
		formattedMonth,
		getCurrentTimeInTimezone,
		generateGradient,
	} = useContext(CalendarContext)

	const getTotalEventHours = (currentMonthEventsTimes) => {
		const { passedTime, remainingTime } = currentMonthEventsTimes

		const formatTime = (timeInMinutes) => {
			const hours = timeInMinutes / 60
			return hours % 1 === 0 ? `${hours}hs` : `${hours.toFixed(1)}hs`
		}

		const totalTime = passedTime + remainingTime

		return {
			totalHours: formatTime(totalTime),
			passedHours: formatTime(passedTime),
			remainingHours: formatTime(remainingTime),
		}
	}
	

	return (
		<div className={styles.panelMenu}>
			{/* <div
				ref={searchPeopleRef}
				onClick={() => {
					if (!showPeoplePopUp) {
						setShowEventCreationPopUp(false)
						setShowPeoplePopUp(true)
					}
				}}
				className={styles.meeting}
			>
				<b>Reunirse con ..</b>
				<div className={styles.input}>
					<svg fill='none' viewBox='0 0 24 24'>
						<path
							stroke='currentColor'
							strokeLinecap='round'
							strokeWidth='2'
							d='M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z'
						/>
					</svg>
					<input
						value={searchPeople}
						className={styles.searchPeopleInput}
						type='text'
						onChange={(e) => setSearchPeople(e.target.value)}
						spellCheck='false'
						placeholder={'Buscar a gente'}
					/>
				</div>
				{showPeoplePopUp && (
					<CalendarUsersPopUp
						setShowPeoplePopUp={setShowPeoplePopUp}
						setSearchPeople={setSearchPeople}
						searchPeople={searchPeople}
						searchPeopleRef={searchPeopleRef}
					/>
				)}
				<div className={styles.buttonWrapper}>
					<div
						onClick={(e) => {
							e.stopPropagation()
							setShowPeoplePopUp(false)
							setShowEventCreationPopUp(!showEventCreationPopUp)
						}}
						ref={buttonRef}
						className={styles.button}
					>
						{showEventCreationPopUp && (
							<EventOptionsDropdown
								parentRef={buttonRef}
								onClose={() => setShowEventCreationPopUp(false)}
							/>
						)}
						<IoMdCalendar size={20} className={styles.locationIconDropdown} />
						<div
							style={{
								transform: showEventCreationPopUp
									? 'rotate(180deg)'
									: 'rotate(0deg)',
								transition: 'transform 0.2s ease-in-out',
							}}
							className={styles.arrowIcon}
						/>
					</div>
				</div>
			</div> */}

			<div className={styles.date}>
				<b>{formattedMonth}</b>
				<div>
					<button onClick={handlePreviousMonth}>
						<FaChevronLeft />
					</button>
					<button onClick={handleNextMonth}>
						<FaChevronRight />
					</button>
				</div>
			</div>
			<div className={styles.miniMap}>
				<MiniCalendar year={currentYear} month={currentMonth} />
			</div>
			<div className={styles.hour}>
				<div>{`${selectedCalendarData.timezone ? selectedCalendarData.timezone.split(') ')[1] : ''}`}</div>
				<div>
					<span>
						{selectedCalendarData?.timezone
							? getCurrentTimeInTimezone(selectedCalendarData?.timezone)
							: ''}
					</span>
					<div className={styles.sun} />
				</div>
			</div>
			<div className={styles.stats}>
				{selectedCalendarEvents.length > 0 && <label>{formattedMonth}</label>}
				{selectedCalendarEvents.length > 0 && (
					<label>
						Tiempo de reuniones:{' '}
						{currentMonthEventsTimes &&
							getTotalEventHours(currentMonthEventsTimes).totalHours}
					</label>
				)}

				{selectedCalendarEvents.length > 0 && currentMonthEventsTimes && (
					<ProgressBar
						passedHours={currentMonthEventsTimes.passedTime}
						remainingHours={currentMonthEventsTimes.remainingTime}
						passedConverted={
							getTotalEventHours(currentMonthEventsTimes).passedHours
						}
						remainingConverted={
							getTotalEventHours(currentMonthEventsTimes).remainingHours
						}
					/>
				)}
			</div>


			<MenuWorkspace />

			
		</div>
	)
}

export const Event = () => {
	const dispatch = useDispatch()

	const handleClose = () => {
		dispatch(setModal(null))
	}
	return <EventCreationPopUp />
}

export const CalendarCreation = () => {
	const dispatch = useDispatch()

	const handleClose = () => {
		dispatch(setModal(null))
	}
	return <CreateCalendarPopUp />
}

export const MiniCalendar = ({
	year,
	month,
	selectedDay,
	setSelectedDay,
	fromPopup,
	fromKanban,
	handleDateTask,
}) => {
	const navigate = useNavigate()
	const {
		selectedCalendarEvents,
		selectedSecondaryCalendars,
		selectedCalendar,
		selectedSecondaryCalendarEvents,
		userSharedEvents,
		userInvitations,
		selectedCalendarData,
	} = useSelector((state) => state.calendar)
	const {
		generateMonthDays,
		selectedDate,
		getRandomColor,
		currentYear,
		currentMonth,
		groupEventsByDate,
		formattedMonth,
		handleCellClick,
	} = useContext(CalendarContext)
	const weeks = generateMonthDays(year, month)

	const [eventColors, setEventColors] = useState({})

	const today = new Date()
	const isCurrentMonth =
		today.getFullYear() === year && today.getMonth() === month
	const currentDay = today.getDate()


	useEffect(() => {
		if (selectedCalendarEvents && selectedCalendarEvents.length > 0) {
			const newEventColors = {}
			Object.keys(groupEventsByDate(selectedCalendarEvents)).forEach((date) => {
				const eventsOnDate = groupEventsByDate(selectedCalendarEvents)[date]
				if (!newEventColors[date]) {
					newEventColors[date] = eventsOnDate.map(() => getRandomColor())
				}
			})
			setEventColors(newEventColors)
		}
	}, [selectedCalendarEvents])
console.log('weeks',weeks)
	return (
		<table className={styles.miniCalendarTable}>
			<thead>
				<tr>
					{daysOfWeek.map((day, index) => (
						<th
							className={fromPopup && styles.dayInitial}
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
							const isToday =
								isCurrentMonth &&
								dayObj.month === 'current' &&
								dayObj.day === currentDay
							const isSelected =
								selectedDate.day === dayObj.day &&
								selectedDate.month === month &&
								selectedDate.year === year &&
								dayObj.month === 'current'

							const isSelectedFromPopUp =
								selectedDay &&
								selectedDay.day === dayObj.day &&
								selectedDay &&
								selectedDay.month === month &&
								selectedDay &&
								selectedDay.year === year &&
								selectedDay &&
								dayObj.month === 'current'

							const date = `${dayObj.day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${formattedMonth.split(' ')[2]}`
							const selectedCalendars = [
								selectedCalendar,
								...selectedSecondaryCalendars,
							]
							const currentSharedEvents =
								userSharedEvents?.filter((e) =>
									e.sharedWith.some((id) => selectedCalendars.includes(id))
								) || []
							const filteredUserInvitations = [...userInvitations].filter(
								(inv) => {
									if (selectedCalendarData.showDeniedEvents === true) {
										return true
									} else {
										if (inv.response === 'denied') {
											return false
										} else if (inv.response === 'pending') {
											return false
										} else {
											return true
										}
									}
								}
							)
							const eventsOnDate = groupEventsByDate([
								...selectedCalendarEvents,
								...selectedSecondaryCalendarEvents,
								...currentSharedEvents,
								...filteredUserInvitations,
							])[date]

							return (
								<td
									className={styles.miniCalendarTd}
									key={dayIndex}
									onClick={() => {
										if (fromKanban) {
											const newDate = new Date(
												currentYear,
												currentMonth,
												dayObj.day
											)
											handleDateTask(newDate)
										}
										if (fromPopup) {
											console.log('dayObj',dayObj)
											setSelectedDay({
												day: dayObj.day,
												month: dayObj.month,
												year,
											})
										} else {
											handleCellClick(dayObj.day, dayObj.month)
										}
									}}
								>
									<div
										className={`${styles.dayCell} ${
											isToday ? styles.currentDayCell : ''
										} ${isSelected || isSelectedFromPopUp ? styles.selectedDayCell : ''} ${dayObj.month === 'previous' || dayObj.month === 'next' ? styles.previousNextMonth : ''}`}
									>
										{dayObj.day}
									</div>
									{eventsOnDate && eventsOnDate.length > 0 && (
										<div className={styles.eventDotsContainer}>
											{eventsOnDate.slice(0, 2).map((ev, i) => (
												<div
													key={i}
													className={styles.eventDot}
													style={{
														background:
															ev.invited && ev.response !== 'denied'
																? 'linear-gradient(90deg, #ff7e5f, #feb47b, #ffcc33, #6a82fb, #fc5c7d)'
																: ev.invited && ev.response === 'denied'
																	? '#000'
																	: ev.eventColor ||
																		ev.calendarColor ||
																		ev.dotColor ||
																		'#0ff',
													}}
												></div>
											))}
											{eventsOnDate.length > 2 && (
												<div
													className={styles.eventDot}
													style={{
														background:
															eventsOnDate[eventsOnDate.length - 1]
																.eventColor ||
															eventsOnDate[eventsOnDate.length - 1]
																.calendarColor ||
															eventsOnDate[eventsOnDate.length - 1].dotColor ||
															'#0ff',
													}}
												>
													+{eventsOnDate.length - 2}
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
