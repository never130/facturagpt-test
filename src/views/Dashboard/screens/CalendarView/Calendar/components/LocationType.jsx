import React, { useContext, useState } from 'react'
import styles from './EventTypes.module.css'
import { FaHome, FaBuilding } from 'react-icons/fa'
import { IoMdArrowDropdown } from 'react-icons/io'
import { CalendarContext } from '../../CalendarContext'
import { useSelector } from 'react-redux'
import DateHourInfo from './DateHourInfo'
import AdditionalCalendarInfoBlock from './AdditionalCalendarInfoBlock'

const LocationType = ({
	visibility,
	setVisibility,
	availability,
	setAvailability,
	notification,
	setNotification,
	eventColor,
	setEventColor,
	expandedAdditionalInfo,
	setExpandedAdditionalInfo,
	timezone,
	repeat,
	setTimezone,
	setRepeat,
	hourDataExpanded,
	setHourDataExpanded,
	allDay,
	setAllDay,
}) => {
	const { selectedCalendarData } = useSelector((state) => state.calendar)
	const [selectedLocation, setSelectedLocation] = useState('Casa')

	const handleLocationSelect = (location) => {
		setSelectedLocation(location)
	}

	const { selectedHour, selectedDate, getDayName, getMonthName } =
		useContext(CalendarContext)
	return (
		<div className={styles.eventTypeContentContainer}>
			<DateHourInfo
				timezone={timezone}
				repeat={repeat}
				setTimezone={setTimezone}
				setRepeat={setRepeat}
				hourDataExpanded={hourDataExpanded}
				setHourDataExpanded={setHourDataExpanded}
				allDay={allDay}
				setAllDay={setAllDay}
			/>
			<div className={styles.formLocation}>
				<svg fill='none' viewBox='0 0 24 24'>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
					/>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z'
					/>
				</svg>
				<b>Elegir ubicación</b>
			</div>
			<div className={styles.locationContainer}>
				<button
					className={`${styles.locationButton} ${
						selectedLocation === 'Casa' ? styles.locationButtonActive : ''
					}`}
					onClick={() => handleLocationSelect('Casa')}
				>
					<FaHome className={styles.locationIcon} />
					<span>Casa</span>
				</button>
				<button
					className={`${styles.locationButton} ${
						selectedLocation === 'Oficina' ? styles.locationButtonActive : ''
					}`}
					onClick={() => handleLocationSelect('Oficina')}
				>
					<FaBuilding className={styles.locationIcon} />
					<span>Oficina</span>
				</button>
				<button className={styles.locationButtonPicker}>
					<span>Otras ubicaciones</span>
					<IoMdArrowDropdown className={styles.locationIconDropdown} />
				</button>
			</div>
			<AdditionalCalendarInfoBlock
				notification={notification}
				setNotification={setNotification}
				availability={availability}
				setAvailability={setAvailability}
				visibility={visibility}
				setVisibility={setVisibility}
				eventColor={eventColor}
				setEventColor={setEventColor}
				expandedAdditionalInfo={expandedAdditionalInfo}
				setExpandedAdditionalInfo={setExpandedAdditionalInfo}
			/>
		</div>
	)
}

export default LocationType
