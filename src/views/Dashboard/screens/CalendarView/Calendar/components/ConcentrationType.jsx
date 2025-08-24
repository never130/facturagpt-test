import React, { useContext, useEffect, useState } from 'react'
import styles from './EventTypes.module.css'
import { FiInfo } from 'react-icons/fi'
import {
	MdOutlineCheckBox,
	MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md'
import { IoMdRemoveCircle } from 'react-icons/io'
import { CalendarContext } from '../../CalendarContext'
import { useSelector } from 'react-redux'
import AdditionalCalendarInfoBlock from './AdditionalCalendarInfoBlock'
import CustomDescriptionInput from './CustomDescriptionInput'
import DateHourInfo from './DateHourInfo'

const ConcentrationType = ({
	usersToInvite,
	setUsersToInvite,
	location,
	setLocation,
	description,
	setDescription,
	attachment,
	setAttachment,
	addMeet,
	setAddMeet,
	meetId,
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
	const [dontBother, setDontBother] = useState(false)
	const { selectedCalendarData } = useSelector((state) => state.calendar)
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
			<div
				onClick={() => setDontBother(!dontBother)}
				className={styles.dontBotherWrapper}
			>
				{dontBother ? (
					<MdOutlineCheckBox
						style={{ cursor: 'pointer' }}
						size={20}
						className={styles.normalIcon}
					/>
				) : (
					<MdOutlineCheckBoxOutlineBlank
						style={{ cursor: 'pointer' }}
						size={20}
						className={styles.normalIcon}
					/>
				)}
				<div>
					<div className={styles.noBotherText}>
						<b>No molestar</b>
						<IoMdRemoveCircle
							size={17}
							style={{ marginTop: 2 }}
							className={styles.normalIcon}
							color='#CB422B'
						/>
					</div>
					<span className={styles.silenceSpan}>
						Silenciar notificaciones de chat
					</span>
				</div>
			</div>
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
				<div style={{ width: '400px', height: '35px' }}>
					<div className={styles.addGuestsInputWrapper}>
						<input
							value={location}
							className={styles.addGuestsInput}
							type='text'
							onChange={(e) => setLocation(e.target.value)}
							spellCheck='false'
							placeholder={'Añadir ubicación'}
						/>
					</div>
				</div>
			</div>
			<CustomDescriptionInput
				attachment={attachment}
				setAttachment={setAttachment}
				description={description}
				setDescription={setDescription}
			/>
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
		</div>
	)
}

export default ConcentrationType
