import React, { useContext, useEffect, useRef } from 'react'
import styles from './MonthPopUp.module.css'
import { CalendarContext } from '../../CalendarContext'
import { useSelector } from 'react-redux'
import { IoMdClose } from 'react-icons/io'

const MonthPopUp = ({ day, date, events, onClose }) => {
	const popupRef = useRef()
	function getDayAbbreviation(dateString) {
		const [day, month, year] = dateString.split('/').map(Number)

		const date = new Date(year, month - 1, day)

		const daysAbbreviation = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']

		const dayOfWeek = date.getDay()

		return daysAbbreviation[dayOfWeek]
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])
	return (
		<div ref={popupRef} className={styles.monthPopUpContainer}>
			<button
				onClick={(e) => {
					e.stopPropagation()
					onClose()
				}}
				className={styles.closeButton}
			>
				<IoMdClose />
			</button>
			<div className={styles.topContainer}>
				<div className={styles.dayText}>{getDayAbbreviation(date)}</div>
				<div className={styles.dayNumber}>{day}</div>
			</div>
			<div className={styles.eventsContainer}>
				{events.map((e, i) => {
					return (
						<div className={styles.eventCard} key={i}>
							<div className={styles.dot} />
							<span className={styles.eventText}>{`${e.hour} ${e.title}`}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default MonthPopUp
