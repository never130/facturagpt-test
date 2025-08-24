import React, { useContext, useEffect, useRef } from 'react'
import styles from './EventOptionsDropdown.module.css'
import { CalendarContext } from '../../CalendarContext'

const categories = [
	'Evento',
	'Post',
	'Tiempo de concentración',
	'Fuera de oficina',
	'Ubicación del trabajo',
	'Tarea',
	'Agenda de citas',
]

const EventOptionsDropdown = ({ onClose, parentRef }) => {
	const dropdownRef = useRef(null)
	const {
		setSelectedOption,
		handleEvent,
		getEventFinishHour,
		setSelectedHour,
	} = useContext(CalendarContext)

	const handleOptionClick = (option) => {
		setSelectedOption(option)
		setSelectedHour({ start: '7:00 AM', end: getEventFinishHour('7:00 AM') })
		handleEvent()
		onClose()
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				parentRef.current &&
				!parentRef.current.contains(event.target)
			) {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onClose])

	return (
		<div ref={dropdownRef} className={styles.dropdownContainer}>
			<ul className={styles.dropdownList}>
				{categories.map((category, index) => (
					<li
						key={index}
						onClick={(e) => {
							e.stopPropagation()
							handleOptionClick(category)
						}}
						className={styles.dropdownItem}
					>
						{category}
					</li>
				))}
			</ul>
		</div>
	)
}

export default EventOptionsDropdown
