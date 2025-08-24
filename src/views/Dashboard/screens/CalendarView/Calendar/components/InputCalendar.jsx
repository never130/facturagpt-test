import { useState, useRef, useEffect, useContext } from 'react'
import styles from './InputCalendar.module.css'
import { CalendarContext } from '../../CalendarContext'
import { MiniCalendar } from '../event'
import { ReactComponent as HomeClock } from '../../../../assets/homeClock.svg';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useSelector } from 'react-redux'

export const InputCalendar = ({ fromKanban, handleDateTask, taskDate,father,customInput,customInputWrapper}) => {
	const { selectedCalendarData } = useSelector((state) => state.calendar)
	const {
		selectedDate,
		formattedMonth,
		handlePreviousMonth,
		handleNextMonth,
		currentYear,
		currentMonth,
		formatSelectedDate,
	} = useContext(CalendarContext)
	const calendarRef = useRef(null)
	const [showCalendar, setShowCalendar] = useState(false)
	const inputRef = useRef(null)
	const [edit, setEdit] = useState(true)

	const handleInputClick = () => {
		setShowCalendar(!showCalendar)
		setEdit(false)
	}

	const handleClickOutside = (event) => {
		if (
			calendarRef.current &&
			!calendarRef.current.contains(event.target) &&
			inputRef.current &&
			!inputRef.current.contains(event.target)
		) {
			setShowCalendar(false)
		}
	}

	function formatDate(dateString) {
		const date = new Date(dateString)

		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()

		return `${day}/${month}/${year}`
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className={styles.inputCalendarContainer}>
			<div style={customInputWrapper} className={fromKanban ? styles.kbWrapper : styles.inputWrapper}>
			<HomeClock/>
				<input 
					type='text'
					readOnly
					value={
						fromKanban && taskDate
							? formatDate(taskDate)
							: fromKanban && !taskDate
								? 'Selecciona fecha'
								: father == "rightPanel" && edit ? "Año completo" : formatSelectedDate(selectedCalendarData.dateFormat)
					}
					onClick={handleInputClick}
					className={fromKanban ? styles.kbInput : styles.dateInput}
					ref={inputRef} style={customInput}
				/>

			</div>
			{showCalendar && (
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
					<div className={styles.miniCalendarWrapper}>
						<MiniCalendar
							handleDateTask={handleDateTask}
							fromKanban={fromKanban}
							year={currentYear}
							month={currentMonth}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
