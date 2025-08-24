import React, { useState } from 'react'
import styles from './SetStartEndDatePopup.module.css'
import { FaRegCircle, FaRegCircleDot } from 'react-icons/fa6'
import CalendarPopup from './CalendarPopup'

const SetStartEndDatePopup = ({
	title,
	onClose,
	onSave,
	start,
	setStart,
	end,
	setEnd,
}) => {
	const [showStartCalendar, setShowStartCalendar] = useState(false)
	const [showEndCalendar, setShowEndCalendar] = useState(false)
	const [selectedStartDate, setSelectedStartDate] = useState(new Date())

	const [startCurrentYear, setStartCurrentYear] = useState(
		new Date().getFullYear()
	)
	const [startCurrentMonth, setStartCurrentMonth] = useState(
		new Date().getMonth()
	)

	const [endCurrentYear, setEndCurrentYear] = useState(new Date().getFullYear())
	const [endCurrentMonth, setEndCurrentMonth] = useState(new Date().getMonth())

	const [selectedEndDate, setSelectedEndDate] = useState(() => {
		const endDate = new Date()
		endDate.setMonth(endDate.getMonth() + 2)
		return endDate
	})

	const formatDateToSpanishLong = (dateProp, from) => {
		let day, month, year
		const date = dateProp
		if (date instanceof Date) {
			day = date.getDate()
			month = date.toLocaleString('es-ES', { month: 'long' })
			year = date.getFullYear()
		} else {
			date.month =
				from === 'start' ? startCurrentMonth + 1 : endCurrentMonth + 1
			day = date.day
			month = new Date(date.year, date.month - 1).toLocaleString('es-ES', {
				month: 'long',
			})
			year = date.year
		}

		return `${day} de ${month} de ${year}`
	}

	return (
		<div className={styles.overlay}>
			<div className={styles.popupContainer}>
				<div className={styles.header}>
					<h3>{title}</h3>
				</div>
				<div className={styles.content}>
					<div>Empieza</div>
					<div className={styles.checkboxContainer}>
						<button
							className={!start ? styles.checkedButton : styles.uncheckedButton}
							style={{ cursor: 'pointer' }}
							onClick={() => setStart(false)}
						>
							{!start ? (
								<FaRegCircleDot size={20} className={styles.checkboxIcon} />
							) : (
								<FaRegCircle size={20} className={styles.checkboxIcon} />
							)}
						</button>
						<span>Ahora</span>
					</div>
					<div
						onClick={() => {
							setStart(true)
							setShowStartCalendar(true)
						}}
						className={styles.checkboxContainer}
					>
						<button
							className={start ? styles.checkedButton : styles.uncheckedButton}
							style={{ cursor: 'pointer' }}
						>
							{start ? (
								<FaRegCircleDot size={20} className={styles.checkboxIcon} />
							) : (
								<FaRegCircle size={20} className={styles.checkboxIcon} />
							)}
						</button>
						<span className={styles.dateContainer}>
							{formatDateToSpanishLong(selectedStartDate, 'start')}
							{showStartCalendar && (
								<CalendarPopup
									selectedDay={selectedStartDate}
									setSelectedDay={setSelectedStartDate}
									onClose={() => setShowStartCalendar(false)}
									currentYear={startCurrentYear}
									setCurrentYear={setStartCurrentYear}
									currentMonth={startCurrentMonth}
									setCurrentMonth={setStartCurrentMonth}
								/>
							)}
						</span>
					</div>

					<div>Termina</div>
					<div className={styles.checkboxContainer}>
						<button
							className={!end ? styles.checkedButton : styles.uncheckedButton}
							style={{ cursor: 'pointer' }}
							onClick={() => setEnd(false)}
						>
							{!end ? (
								<FaRegCircleDot size={20} className={styles.checkboxIcon} />
							) : (
								<FaRegCircle size={20} className={styles.checkboxIcon} />
							)}
						</button>
						<span>Nunca</span>
					</div>
					<div
						onClick={() => {
							setEnd(true)
							setShowEndCalendar(true)
						}}
						className={styles.checkboxContainer}
					>
						<button
							className={end ? styles.checkedButton : styles.uncheckedButton}
							style={{ cursor: 'pointer' }}
						>
							{end ? (
								<FaRegCircleDot size={20} className={styles.checkboxIcon} />
							) : (
								<FaRegCircle size={20} className={styles.checkboxIcon} />
							)}
						</button>
						<span className={styles.dateContainer}>
							{formatDateToSpanishLong(selectedEndDate, 'end')}
							{showEndCalendar && (
								<CalendarPopup
									selectedDay={selectedEndDate}
									setSelectedDay={setSelectedEndDate}
									onClose={() => setShowEndCalendar(false)}
									currentYear={endCurrentYear}
									setCurrentYear={setEndCurrentYear}
									currentMonth={endCurrentMonth}
									setCurrentMonth={setEndCurrentMonth}
								/>
							)}
						</span>
					</div>
				</div>
				<div className={styles.actions}>
					<button onClick={onClose} className={styles.cancelButton}>
						Cancelar
					</button>
					<button
						onClick={() =>
							onSave(start, selectedStartDate, end, selectedEndDate)
						}
						className={styles.saveButton}
					>
						Hecho
					</button>
				</div>
			</div>
		</div>
	)
}

export default SetStartEndDatePopup
