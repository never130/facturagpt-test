import React, { useEffect, useRef } from 'react'
import styles from './CalendarPopup.module.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { MiniCalendar } from '../event'

const CalendarPopup = ({
	selectedDay,
	setSelectedDay,
	currentYear,
	setCurrentYear,
	currentMonth,
	setCurrentMonth,
	onClose,
}) => {
	const calendarRef = useRef(null)
	const formattedMonth = new Date(currentYear, currentMonth)
		.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
		.replace(/^\w/, (c) => c.toUpperCase())

	const handleClickOutside = (event) => {
		if (calendarRef.current && !calendarRef.current.contains(event.target)) {
			onClose()
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handlePreviousMonth = () => {
		if (currentMonth === 0) {
			setCurrentYear(currentYear - 1)
			setCurrentMonth(11)
		} else {
			setCurrentMonth(currentMonth - 1)
		}
	}

	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentYear(currentYear + 1)
			setCurrentMonth(0)
		} else {
			setCurrentMonth(currentMonth + 1)
		}
	}

	return (
		<div className={styles.calendarPopup} ref={calendarRef}>
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
			{currentMonth}
			<div className={styles.miniCalendarWrapper}>
				<MiniCalendar
					fromPopup={true}
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
					year={currentYear}
					month={currentMonth}
				/>
			</div>
		</div>
	)
}

export default CalendarPopup
