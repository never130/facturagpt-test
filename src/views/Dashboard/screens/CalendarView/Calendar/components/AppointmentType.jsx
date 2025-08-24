import React from 'react'
import styles from './EventTypes.module.css'
import { FiInfo } from 'react-icons/fi'
import AdditionalCalendarInfoBlock from './AdditionalCalendarInfoBlock'
import DateHourInfo from './DateHourInfo'

const AppointmentType = ({
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
			<div className={styles.infoWrapper}>
				<FiInfo size={18} className={styles.infoIconTop} />
				<div className={styles.infoRight}>
					<div className={styles.infoText}>
						Crea una página de reserva y compártela con otros para que puedan
						reservar citas contigo
					</div>
					<div className={styles.infoIconsContainer}>
						<button className={styles.howItWorksButton}>
							Consulta cómo funciona
						</button>
						<button className={styles.moreinfoButton}>Mas información</button>
					</div>
				</div>
			</div>
			<div className={styles.divisionLine} />

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

export default AppointmentType
