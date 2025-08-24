import React, { useState } from 'react'
import styles from './AdditionalCalendarInfoBlock.module.css'
import { IoMdCalendar } from 'react-icons/io'
import { GoDotFill } from 'react-icons/go'
import CustomColorPalette from './CustomColorPalette'
import { useSelector } from 'react-redux'
import { TbBriefcase2 } from 'react-icons/tb'
import CustomDropDown from '../components/CustomDropDown'
import { MdLockOutline, MdLockOpen } from 'react-icons/md'
import { RiQuestionLine } from 'react-icons/ri'
import { BiBell } from 'react-icons/bi'

const AdditionalCalendarInfoBlock = ({
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
}) => {
	const { selectedCalendarData } = useSelector((state) => state.calendar)
	const [colorPaletteOpened, setColorPaletteOpened] = useState(false)
	if (expandedAdditionalInfo) {
		return (
			<div className={styles.expandedInfoWrapper}>
				<div className={styles.calendarColorContainer}>
					<IoMdCalendar size={20} className={styles.normalIcon} />
					<span className={styles.calendarTitle}>
						{selectedCalendarData.calendarName}
					</span>
					<CustomColorPalette
						eventColor={eventColor}
						setEventColor={setEventColor}
					/>
				</div>
				<div className={styles.availabilityContainer}>
					<TbBriefcase2 size={20} color={`var(--text-color)`} />
					<CustomDropDown
						options={['No disponible', 'Disponible']}
						selectedOption={availability}
						setSelectedOption={setAvailability}
					/>
				</div>
				<div className={styles.availabilityContainer}>
					{visibility === 'Público' ? (
						<MdLockOpen size={20} color={`var(--text-color)`} />
					) : (
						<MdLockOutline size={20} color={`var(--text-color)`} />
					)}
					<CustomDropDown
						options={['Visibilidad predeterminada', 'Público', 'Privado']}
						selectedOption={visibility}
						setSelectedOption={setVisibility}
					/>
					<RiQuestionLine size={20} color={`var(--text-color-secondary)`} />
				</div>
				<div className={styles.notifWrapper}>
					<BiBell
						style={{ marginTop: '7px' }}
						size={20}
						color={`var(--text-color)`}
					/>
					<div className={styles.notificationsContainer}>
						{notification?.map((not, i) => (
							<CustomDropDown
								key={i}
								options={[
									'5 minutos antes',
									'10 minutos antes',
									'15 minutos antes',
									'30 minutos antes',
									'1 hora antes',
									'1 día antes',
								]}
								selectedOption={not}
								setSelectedOption={setNotification}
								index={i}
							/>
						))}
					</div>
				</div>
				<span
					className={styles.addNotifButton}
					onClick={() =>
						setNotification((prev) => [...prev, '10 minutos antes'])
					}
				>
					Agregar notificación
				</span>
			</div>
		)
	}
	return (
		<div
			onClick={() => setExpandedAdditionalInfo(true)}
			className={styles.calendarInfoWrapper}
		>
			<IoMdCalendar size={20} className={styles.normalIcon} />
			<div className={styles.calendarInfoInner}>
				<div className={styles.topContent}>
					<b className={styles.calendarTitle}>
						{selectedCalendarData.calendarName}
					</b>
					<GoDotFill size={30} color={eventColor} />
				</div>
				<span className={styles.infoTexts}>
					{`${availability} · ${visibility} · Notificar ${notification[0]}`}
				</span>
			</div>
		</div>
	)
}

export default AdditionalCalendarInfoBlock
