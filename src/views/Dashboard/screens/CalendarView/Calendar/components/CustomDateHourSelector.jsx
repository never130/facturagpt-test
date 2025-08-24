import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './CustomDateHourSelector.module.css'
import { CalendarContext } from '../../CalendarContext'
import { generateDayHours } from '../utils'
import { useSelector } from 'react-redux'
import CalendarPopup from './CalendarPopup'

const CustomDateHourSelector = ({ allDay }) => {
	const {
		selectedDate: currentSelectedDate,
		currentMonth: mainCurrentMonth,
		currentYear: mainCurrentYear,
		selectedHour,
		setSelectedHour,
		convertTo24Hour,
		hourFormat,
		addMinutesToTime,
	} = useContext(CalendarContext)


	const { selectedCalendarData } = useSelector((state) => state.calendar)
	const [currentYear, setCurrentYear] = useState(
		mainCurrentYear || new Date().getFullYear()
	)
	const [currentMonth, setCurrentMonth] = useState(
		mainCurrentMonth || new Date().getMonth()
	)
	const [selectedDate, setSelectedDate] = useState({
		day: currentSelectedDate.day || new Date().getDate(),
		month: currentSelectedDate.month || new Date().getMonth(),
		year: currentSelectedDate.year || new Date().getFullYear(),
	})
	const [isOpenStart, setIsOpenStart] = useState(false)
	const [showCalendar, setShowCalendar] = useState(false)
	const [showCalendarSecond, setShowCalendarSecond] = useState(false)
	const [isOpenEnd, setIsOpenEnd] = useState(false)

	const hoursOptions = generateDayHours(
		6,
		22,
		selectedCalendarData.eventsDuration
	)

	const [hoveredStartIndex, setHoveredStartIndex] = useState(null)
	const [hoveredEndIndex, setHoveredEndIndex] = useState(null)
	const startContainerRef = useRef(null)
	const endContainerRef = useRef(null)

	const handleMouseEnterStart = (index) => setHoveredStartIndex(index)
	const handleMouseLeaveStart = () => setHoveredStartIndex(null)

	const handleMouseEnterEnd = (index) => setHoveredEndIndex(index)
	const handleMouseLeaveEnd = () => setHoveredEndIndex(null)

	const handleClickOutsideStart = (event) => {
		if (
			startContainerRef.current &&
			!startContainerRef.current.contains(event.target)
		) {
			setIsOpenStart(false)
		}
	}

	const handleClickOutsideEnd = (event) => {
		if (
			endContainerRef.current &&
			!endContainerRef.current.contains(event.target)
		) {
			setIsOpenEnd(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutsideStart)
		document.addEventListener('mousedown', handleClickOutsideEnd)

		return () => {
			document.removeEventListener('mousedown', handleClickOutsideStart)
			document.removeEventListener('mousedown', handleClickOutsideEnd)
		}
	}, [])

	const handleOptionClick = (option, type) => {
		const eventDuration = selectedCalendarData.eventsDuration
		if (type === 'start') {
			const newEndHour = addMinutesToTime(option, eventDuration)
			setSelectedHour((prev) => ({
				...prev,
				start: option,
				end: newEndHour,
			}))
			setIsOpenStart(false)
		} else if (type === 'end') {
			const newStartHour = addMinutesToTime(option, -eventDuration)
			setSelectedHour((prev) => ({
				...prev,
				end: option,
				start: newStartHour,
			}))
			setIsOpenEnd(false)
		}
	}

	const formatDateToSpanishLong = (dateProp, from) => {
		let day, month, year
		const date = dateProp
		if (date instanceof Date) {
			day = date.getDate()
			month = date.toLocaleString('es-ES', { month: 'long' })
			year = date.getFullYear()
		} else {
			date.month = currentMonth + 1
			day = date.day
			month = new Date(date.year, date.month - 1).toLocaleString('es-ES', {
				month: 'long',
			})
			year = date.year
		}

		return `${day} de ${month} de ${year}`
	}


	return (
		<div className={styles.customDateHourSelectorWrapper}>
			<div
				onClick={(e) => {
					e.stopPropagation()
					setShowCalendar(true)
				}}
				className={styles.customDateHourSelectorDate}
			>
				{formatDateToSpanishLong(selectedDate, 'start')}
				{showCalendar && (
					<CalendarPopup
						selectedDay={selectedDate}
						setSelectedDay={setSelectedDate}
						onClose={() => setShowCalendar(false)}
						currentYear={currentYear}
						setCurrentYear={setCurrentYear}
						currentMonth={currentMonth}
						setCurrentMonth={setCurrentMonth}
					/>
				)}
			</div>
			{allDay && <span style={{ margin: '0px 4px' }}>{' - '}</span>}
			{allDay && (
				<div
					onClick={(e) => {
						e.stopPropagation()
						setShowCalendarSecond(true)
					}}
					className={styles.customDateHourSelectorDate}
				>
					{formatDateToSpanishLong(selectedDate, 'start')}
					{showCalendarSecond && (
						<CalendarPopup
							selectedDay={selectedDate}
							setSelectedDay={setSelectedDate}
							onClose={() => setShowCalendarSecond(false)}
							currentYear={currentYear}
							setCurrentYear={setCurrentYear}
							currentMonth={currentMonth}
							setCurrentMonth={setCurrentMonth}
						/>
					)}
				</div>
			)}
			{!allDay && (
				<div
					ref={startContainerRef}
					onClick={(e) => {
						e.stopPropagation()
						setIsOpenStart((prev) => !prev)
					}}
					className={styles.customDateHourSelectorHourStart}
				>
					{hourFormat === '1:00pm'
						? `${selectedHour?.start?.split(' ').join('').toLowerCase()}`
						: convertTo24Hour(selectedHour?.start)}

					{isOpenStart && (
						<div className={styles.dropdown}>
							{hoursOptions.map((option, index) => (
								<div
									key={index}
									className={`${styles.option} ${option === selectedHour.start ? styles.selected : ''} ${index === hoveredStartIndex ? styles.hovered : ''}`}
									onClick={(e) => {
										e.stopPropagation()
										handleOptionClick(option, 'start')
									}}
									onMouseEnter={() => handleMouseEnterStart(index)}
									onMouseLeave={handleMouseLeaveStart}
								>
									{hourFormat === '1:00pm'
										? option?.split(' ').join('').toLowerCase()
										: convertTo24Hour(option)}
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{!allDay && <span style={{ margin: '0px 4px' }}>{' - '}</span>}

			{!allDay && (
				<div
					ref={endContainerRef}
					onClick={(e) => {
						e.stopPropagation()
						setIsOpenEnd((prev) => !prev)
					}}
					className={styles.customDateHourSelectorHourEnd}
				>
					{hourFormat === '1:00pm'
						? `${selectedHour.end?.split(' ').join('').toLowerCase()}`
						: convertTo24Hour(selectedHour.end)}
					{isOpenEnd && (
						<div className={styles.dropdown}>
							{hoursOptions.map((option, index) => (
								<div
									key={index}
									className={`${styles.option} ${option === selectedHour.end ? styles.selected : ''} ${index === hoveredEndIndex ? styles.hovered : ''}`}
									onClick={(e) => {
										e.stopPropagation()
										handleOptionClick(option, 'end')
									}}
									onMouseEnter={() => handleMouseEnterEnd(index)}
									onMouseLeave={handleMouseLeaveEnd}
								>
									{option?.split(' ').join('').toLowerCase()}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default CustomDateHourSelector
