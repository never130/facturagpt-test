import React, { useState } from 'react'
import styles from './EventTypes.module.css'
import {
	MdLockOpen,
	MdLockOutline,
	MdOutlineCheckBox,
	MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md'
import { FiInfo } from 'react-icons/fi'
import DateHourInfo from './DateHourInfo'
import { FaRegCircleDot, FaRegCircle } from 'react-icons/fa6'
import CustomDropDown from './CustomDropDown'
import { RiQuestionLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const OffOfficeType = ({
	timezone,
	repeat,
	setTimezone,
	setRepeat,
	hourDataExpanded,
	setHourDataExpanded,
	allDay,
	setAllDay,
	visibility,
	setVisibility,
	rejectMessage,
	setRejectMessage,
	rejectOption,
	setRejectOption,
	rejectMeetings,
	setRejectMeetings,
}) => {
	const navigate = useNavigate()
	const [privacy, setPrivacy] = useState('Público')
	const privacyModes = ['Público', 'Privado', 'Solo amigos']

	const [isFocused, setIsFocused] = useState(false)

	const handleFocus = () => {
		setIsFocused(true)
	}

	const handleBlur = () => {
		setIsFocused(false)
	}

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
			<div>
				<div
					onClick={() => setRejectMeetings((prev) => !prev)}
					className={styles.rejectMeetings}
				>
					{rejectMeetings ? (
						<MdOutlineCheckBox
							style={{ cursor: 'pointer' }}
							size={20}
							color={`var(--color-primary-1)`}
						/>
					) : (
						<MdOutlineCheckBoxOutlineBlank
							style={{ cursor: 'pointer' }}
							size={20}
							color={`var(--text-color)`}
						/>
					)}
					<span>Rechazar reuniones automáticamente</span>
				</div>

				{rejectMeetings && (
					<div className={styles.additionalOptions}>
						<div
							className={styles.option}
							onClick={() => setRejectOption('newInvitations')}
						>
							{rejectOption === 'newInvitations' ? (
								<FaRegCircleDot
									size={18}
									color={`var(--color-primary-1)`}
									className={styles.bulletIcon}
								/>
							) : (
								<FaRegCircle
									size={18}
									color={`var(--text-color)`}
									className={styles.bulletIcon}
								/>
							)}
							<span>Solo invitaciones a reuniones nuevas</span>
						</div>

						<div
							className={styles.option}
							onClick={() => setRejectOption('newAndCurrent')}
						>
							{rejectOption === 'newAndCurrent' ? (
								<FaRegCircleDot
									className={styles.bulletIcon}
									size={18}
									color={`var(--color-primary-1)`}
								/>
							) : (
								<FaRegCircle
									className={styles.bulletIcon}
									size={18}
									color={`var(--text-color)`}
								/>
							)}
							<span>Reuniones nuevas y actuales</span>
						</div>

						<div className={styles.inputContainer}>
							<input
								type='text'
								value={rejectMessage}
								placeholder='Ingresa un mensaje'
								className={`${styles.input} ${isFocused ? styles.focused : ''}`}
								onFocus={handleFocus}
								onBlur={handleBlur}
								onChange={(e) => setRejectMessage(e.target.value)}
							/>
							<div
								className={`${styles.underline} ${isFocused ? styles.active : ''}`}
							/>
						</div>
					</div>
				)}
			</div>
			<div className={styles.availabilityContainer}>
				{visibility === 'Público' ? (
					<MdLockOpen size={20} color={`var(--text-color)`} />
				) : (
					<MdLockOutline size={20} color={`var(--text-color)`} />
				)}
				<CustomDropDown
					options={['Público', 'Privado']}
					selectedOption={visibility}
					setSelectedOption={setVisibility}
				/>
				<RiQuestionLine size={20} color={`var(--text-color-secondary)`} />
			</div>
			<div className={styles.infoWrapper}>
				<FiInfo size={18} className={styles.infoIconTop} />
				<div className={styles.infoRight}>
					<div className={styles.infoText}>
						Crea una página de reserva y compártela con otros para que puedan
						reservar citas contigo
					</div>
					<div className={styles.infoIconsContainer}>
						<button
							onClick={() => navigate('/help')}
							className={styles.howItWorksButton}
						>
							Consulta cómo funciona
						</button>
						<button
							onClick={() => navigate('/help')}
							className={styles.moreinfoButton}
						>
							Mas información
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default OffOfficeType
