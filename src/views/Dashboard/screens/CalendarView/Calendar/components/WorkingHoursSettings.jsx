import React, { useState, useRef, useEffect } from 'react'

import {
	MdHome,
	MdWork,
	MdOutlineLocationOn,
	MdOutlineNotInterested,
	MdOutlineLocationOff,
	MdContentCopy,
} from 'react-icons/md'
import { GoHomeFill } from 'react-icons/go'
import { TbBriefcase2Filled } from 'react-icons/tb'

import styles from './WorkingHoursSettings.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { updateCalendar } from '@src/actions/calendar'
import CreateNewLocationPopup from './CreateNewLocationPopup'

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
const minutes = Array.from({ length: 60 }, (_, i) =>
	i < 10 ? `0${i}` : i.toString()
)

const WorkingHoursSettings = ({ workingHourEnabled, handleShowToast }) => {
	const dispatch = useDispatch()
	const { selectedCalendar, selectedCalendarData } = useSelector(
		(state) => state.calendar
	)
	const { user } = useSelector((state) => state.user)
	const [showCreateLocationPopup, setShowCreateLocationPopup] = useState(false)
	const [officeOrLocation, setOfficeOrLocation] = useState()
	const [optionToChange, setOptionToChange] = useState()


	const [selectedDays, setSelectedDays] = useState({
		Lunes: Object.keys(selectedCalendarData.workingHoursSettings).includes(
			'Lunes'
		),
		Martes: Object.keys(selectedCalendarData.workingHoursSettings).includes(
			'Martes'
		),
		Miércoles: Object.keys(selectedCalendarData.workingHoursSettings).includes(
			'Miércoles'
		),
		Jueves: Object.keys(selectedCalendarData.workingHoursSettings).includes(
			'Jueves'
		),
		Viernes: Object.keys(selectedCalendarData.workingHoursSettings).includes(
			'Viernes'
		),
		Sábado: Object.keys(selectedCalendarData.workingHoursSettings).includes(
			'Sábado'
		),
		Domingo: Object.keys(selectedCalendarData.workingHoursSettings).includes(
			'Domingo'
		),
	})

	const [workLocationsIcons, setWorkLocationsIcons] = useState({
		Lunes:
			selectedCalendarData.workingHoursSettings['Lunes']?.iconType ||
			'Sin especificar',
		Martes:
			selectedCalendarData.workingHoursSettings['Martes']?.iconType ||
			'Sin especificar',
		Miércoles:
			selectedCalendarData.workingHoursSettings['Miércoles']?.iconType ||
			'Sin especificar',
		Jueves:
			selectedCalendarData.workingHoursSettings['Jueves']?.iconType ||
			'Sin especificar',
		Viernes:
			selectedCalendarData.workingHoursSettings['Viernes']?.iconType ||
			'Sin especificar',
		Sábado:
			selectedCalendarData.workingHoursSettings['Sábado']?.iconType ||
			'Sin especificar',
		Domingo:
			selectedCalendarData.workingHoursSettings['Domingo']?.iconType ||
			'Sin especificar',
	})

	const [workLocations, setWorkLocations] = useState({
		Lunes:
			selectedCalendarData.workingHoursSettings['Lunes']?.location ||
			'Sin especificar',
		Martes:
			selectedCalendarData.workingHoursSettings['Martes']?.location ||
			'Sin especificar',
		Miércoles:
			selectedCalendarData.workingHoursSettings['Miércoles']?.location ||
			'Sin especificar',
		Jueves:
			selectedCalendarData.workingHoursSettings['Jueves']?.location ||
			'Sin especificar',
		Viernes:
			selectedCalendarData.workingHoursSettings['Viernes']?.location ||
			'Sin especificar',
		Sábado:
			selectedCalendarData.workingHoursSettings['Sábado']?.location ||
			'Sin especificar',
		Domingo:
			selectedCalendarData.workingHoursSettings['Domingo']?.location ||
			'Sin especificar',
	})

	const [dropdownVisible, setDropdownVisible] = useState({
		Lunes: false,
		Martes: false,
		Miércoles: false,
		Jueves: false,
		Viernes: false,
		Sábado: false,
		Domingo: false,
	})

	const [activeDropdown, setActiveDropdown] = useState(null)

	const cloneDeep = (obj) => (obj ? JSON.parse(JSON.stringify(obj)) : null)

	const [workingHours, setWorkingHours] = useState(() => {
		const defaultHoursRange = [
			{
				start: { hour: '9', minute: '00', period: 'am' },
				end: { hour: '5', minute: '00', period: 'pm' },
			},
		]

		return {
			Lunes: selectedCalendarData.workingHoursSettings['Lunes']?.hoursRanges
				? cloneDeep(
						selectedCalendarData.workingHoursSettings['Lunes'].hoursRanges
					)
				: defaultHoursRange,
			Martes: selectedCalendarData.workingHoursSettings['Martes']?.hoursRanges
				? cloneDeep(
						selectedCalendarData.workingHoursSettings['Martes'].hoursRanges
					)
				: defaultHoursRange,
			Miércoles: selectedCalendarData.workingHoursSettings['Miércoles']
				?.hoursRanges
				? cloneDeep(
						selectedCalendarData.workingHoursSettings['Miércoles'].hoursRanges
					)
				: defaultHoursRange,
			Jueves: selectedCalendarData.workingHoursSettings['Jueves']?.hoursRanges
				? cloneDeep(
						selectedCalendarData.workingHoursSettings['Jueves'].hoursRanges
					)
				: defaultHoursRange,
			Viernes: selectedCalendarData.workingHoursSettings['Viernes']?.hoursRanges
				? cloneDeep(
						selectedCalendarData.workingHoursSettings['Viernes'].hoursRanges
					)
				: defaultHoursRange,
			Sábado: selectedCalendarData.workingHoursSettings['Sábado']?.hoursRanges
				? cloneDeep(
						selectedCalendarData.workingHoursSettings['Sábado'].hoursRanges
					)
				: defaultHoursRange,
			Domingo: selectedCalendarData.workingHoursSettings['Domingo']?.hoursRanges
				? cloneDeep(
						selectedCalendarData.workingHoursSettings['Domingo'].hoursRanges
					)
				: defaultHoursRange,
		}
	})

	const dropdownRefs = useRef({})

	const firstEnabledDay = Object.keys(selectedDays).find(
		(day) => selectedDays[day]
	)
	const firstEnabledLocation = firstEnabledDay
		? workLocations[firstEnabledDay]
		: null

	const firstEnabledHours = firstEnabledDay
		? workingHours[firstEnabledDay]
		: null

	const [otherOffices, setOtherOffices] = useState([])
	const [otherPlaces, setOtherPlaces] = useState([])
	const [locationOptions, setLocationOptions] = useState([
		{ label: 'Oficina', icon: <TbBriefcase2Filled />, iconType: 'Brief' },
		{ label: 'Casa', icon: <GoHomeFill />, iconType: 'Home' },
		{
			label: 'Sin especificar',
			icon: <MdOutlineLocationOff />,
			iconType: 'PointerOff',
		},
		{ label: 'Otra oficina', icon: <TbBriefcase2Filled />, iconType: 'Brief' },
		{ label: 'Otro lugar', icon: <MdOutlineLocationOn />, iconType: 'Pointer' },
	])

	const toggleDay = (day) => {
		setSelectedDays((prev) => {
			const newState = !prev[day]
			if (!newState) {
				setWorkLocations((prevLoc) => ({
					...prevLoc,
					[day]: 'Sin especificar',
				}))
			}
			if (!newState) {
				setWorkingHours((prevHour) => ({
					...prevHour,
					[day]: [
						{
							start: { hour: '9', minute: '00', period: 'am' },
							end: { hour: '5', minute: '00', period: 'pm' },
						},
					],
				}))
			}
			return { ...prev, [day]: newState }
		})
	}

	const handleLocationChange = (day, location) => {
		setWorkLocations((prev) => ({ ...prev, [day]: location }))
		setDropdownVisible((prev) => ({ ...prev, [day]: false }))
	}

	const toggleDropdown = (day) => {
		setDropdownVisible((prev) => ({
			...prev,
			[day]: !prev[day],
		}))
	}

	const handleWorkingHoursChange = (day, index, field, value, type) => {
		setWorkingHours((prev) => {
			const updatedDay = [...prev[day]]
			updatedDay[index][field][type] = value
			return { ...prev, [day]: updatedDay }
		})
	}

	const toggleActiveDropdown = (day, rangeIndex, type) => {
		setActiveDropdown({ day, rangeIndex, type })
	}

	const copyToAll = () => {
		if (firstEnabledLocation) {
			setWorkLocations((prev) => {
				const updatedLocations = { ...prev }
				Object.keys(selectedDays).forEach((day) => {
					if (selectedDays[day] && day !== firstEnabledDay) {
						updatedLocations[day] = firstEnabledLocation
					}
				})
				return updatedLocations
			})
			if (firstEnabledHours) {
				setWorkingHours((prev) => {
					const updatedHours = { ...prev }
					Object.keys(selectedDays).forEach((day) => {
						if (selectedDays[day] && day !== firstEnabledDay) {
							updatedHours[day] = firstEnabledHours
						}
					})
					return updatedHours
				})
			}
		}
	}

	const handleClickOutside = (event) => {

	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])
	const timeDropdownItemRef = useRef(null)

	useEffect(() => {
		const handleScroll = (e) => {
			const element = timeDropdownItemRef.current
			if (element) {
				const isAtTop = element.scrollTop === 0
				const isAtBottom =
					element.scrollHeight - element.scrollTop === element.clientHeight

				if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
					e.preventDefault()
				}
			}
		}

		const element = timeDropdownItemRef.current
		if (element) {
			element.addEventListener('wheel', handleScroll, { passive: false })
		}

		return () => {
			if (element) {
				element.removeEventListener('wheel', handleScroll)
			}
		}
	}, [])
	const secondTimeDropdownItemRef = useRef(null)

	useEffect(() => {
		const handleScroll = (e) => {
			const element = secondTimeDropdownItemRef.current
			if (element) {
				const isAtTop = element.scrollTop === 0
				const isAtBottom =
					element.scrollHeight - element.scrollTop === element.clientHeight

				if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
					e.preventDefault()
				}
			}
		}

		const element = secondTimeDropdownItemRef.current
		if (element) {
			element.addEventListener('wheel', handleScroll, { passive: false })
		}

		return () => {
			if (element) {
				element.removeEventListener('wheel', handleScroll)
			}
		}
	}, [])

	const handleSavePreferences = () => {
		const data = {
			workingHours,
			workLocations,
			selectedDays,
			workingHourEnabled,
			locationOptions,
		}
		const finalPrefs = {}

		Object.keys(data.selectedDays).forEach((day) => {
			if (data.selectedDays[day]) {
				finalPrefs[day] = {}

				if (data.workingHourEnabled) {
					finalPrefs[day].hoursRanges = data.workingHours[day]
				}

				finalPrefs[day].location = data.workLocations[day]
				finalPrefs[day].iconType = data.locationOptions.find(
					(option) => option.label === data.workLocations[day]
				)?.iconType
			}
		})
		dispatch(
			updateCalendar({
				userId: user.id,
				calendarId: selectedCalendar,
				toUpdate: { workingHoursSettings: finalPrefs },
			})
		).finally(() => handleShowToast('Preferencias actualizadas correctamente!'))
	}
	const handleAddNewLocation = (type, newLocation, day) => {
		if (type === 'office') {
			setLocationOptions((prev) => [
				...prev,
				{ label: newLocation, icon: <TbBriefcase2Filled />, iconType: 'Brief' },
			])
			setOtherOffices((prev) => [
				...prev,
				{ label: newLocation, icon: <TbBriefcase2Filled />, iconType: 'Brief' },
			])
		}
		if (type === 'location') {
			setLocationOptions((prev) => [
				...prev,
				{
					label: newLocation,
					icon: <MdOutlineLocationOn />,
					iconType: 'Pointer',
				},
			])
			setOtherPlaces((prev) => [
				...prev,
				{
					label: 'Otro lugar',
					icon: <MdOutlineLocationOn />,
					iconType: 'Pointer',
				},
			])
		}
		handleLocationChange(day, newLocation)
	}

	const handleAddHour = (day) => {
		const actualHoursCopy = { ...workingHours }
		actualHoursCopy[day] = [
			...actualHoursCopy[day],
			{
				start: { hour: '9', minute: '00', period: 'am' },
				end: { hour: '5', minute: '00', period: 'pm' },
			},
		]
		setWorkingHours(actualHoursCopy)
	}
	const handleRemoveHour = (day, indexToRemove) => {
		const filteredHours = [...workingHours[day]].filter(
			(_, index) => index !== indexToRemove
		)
		const actualHoursCopy = { ...workingHours }
		actualHoursCopy[day] = filteredHours
		setWorkingHours(actualHoursCopy)
	}

	return (
		<div className={styles.workingHoursSettings}>
			{showCreateLocationPopup && (
				<CreateNewLocationPopup
					dayToChange={optionToChange}
					type={officeOrLocation}
					title={
						officeOrLocation && officeOrLocation === 'office'
							? 'Otra oficina'
							: 'Otro lugar de trabajo'
					}
					onSave={handleAddNewLocation}
					onClose={() => setShowCreateLocationPopup(false)}
				/>
			)}
			<div className={styles.dayToggleContainer}>
				{Object.keys(selectedDays).map((day) => (
					<div
						key={day}
						className={`${styles.dayToggle} ${selectedDays[day] ? styles.enabled : styles.disabled}`}
						onClick={() => toggleDay(day)}
					>
						{day === 'Miércoles' ? 'X' : day[0].toUpperCase()}
					</div>
				))}
			</div>

			<div className={styles.settingsContainer}>
				{Object.keys(selectedDays).filter((day) => selectedDays[day]).length >
					0 && (
					<div className={styles.settingsRow}>
						{workingHourEnabled ? (
							<span className={styles.columnTitleHour}>HORARIO LABORAL</span>
						) : (
							<div></div>
						)}
						<span className={styles.columnTitle}>
							LUGAR DE TRABAJO <AiOutlineQuestionCircle />
						</span>
					</div>
				)}
				{Object.keys(selectedDays)
					.filter((day) => selectedDays[day])
					.map((day, index) => {
						const selectedOption = locationOptions.find(
							(option) => option.label === workLocations[day]
						)
						const iconType = workLocationsIcons[day]
						return (
							<div key={day} className={styles.settingsRow}>
								{workingHourEnabled ? (
									<div className={styles.leftWrapper}>
										<span style={{ marginTop: '10px', minWidth: '85px' }}>
											{day}
										</span>

										<div className={styles.hoursWrapper}>
											{workingHours[day].map((hourRange, i) => (
												<div className={styles.hoursContainer} key={i}>
													{i === workingHours[day].length - 1 && (
														<div
															onClick={() => handleAddHour(day)}
															className={styles.plusButton}
														>
														</div>
													)}
													{i !== 0 && (
														<div
															onClick={() => handleRemoveHour(day, i)}
															className={
																i === workingHours[day].length - 1
																	? styles.minusButtonRight
																	: styles.minusButton
															}
														>
														</div>
													)}
													<div
														className={styles.singleHourContainer}
														onClick={() =>
															toggleActiveDropdown(day, i, 'start')
														}
													>
														{`${hourRange.start.hour}:${hourRange.start.minute}${hourRange.start.period}`}
														{activeDropdown?.day === day &&
															activeDropdown?.rangeIndex === i &&
															activeDropdown?.type === 'start' && (
																<div
																	className={styles.timeDropdown}
																	ref={dropdownRefs}
																>
																	<div className={styles.period}>
																		<div
																			onClick={() =>
																				handleWorkingHoursChange(
																					day,
																					i,
																					'start',
																					'am',
																					'period'
																				)
																			}
																		>
																			AM
																		</div>
																		<div
																			onClick={() =>
																				handleWorkingHoursChange(
																					day,
																					i,
																					'start',
																					'pm',
																					'period'
																				)
																			}
																		>
																			PM
																		</div>
																	</div>
																	<div
																		style={{
																			width: '100%',
																			display: 'flex',
																			flexDirection: 'row',
																		}}
																	>
																		<div
																			ref={timeDropdownItemRef}
																			className={styles.timeDropdownItem}
																		>
																			{hours.map((hour) => (
																				<div
																					key={hour}
																					className={styles.hoursDropdownItem}
																					onClick={() =>
																						handleWorkingHoursChange(
																							day,
																							i,
																							'start',
																							hour,
																							'hour'
																						)
																					}
																				>
																					{hour}
																				</div>
																			))}
																		</div>
																		<div
																			ref={secondTimeDropdownItemRef}
																			className={styles.timeDropdownItem}
																		>
																			{minutes.map((minute) => (
																				<div
																					key={minute}
																					className={styles.hoursDropdownItem}
																					onClick={() =>
																						handleWorkingHoursChange(
																							day,
																							i,
																							'start',
																							minute,
																							'minute'
																						)
																					}
																				>
																					{minute}
																				</div>
																			))}
																		</div>
																	</div>
																</div>
															)}
													</div>
													<div>a</div>
													<div
														className={styles.singleHourContainer}
														onClick={() => toggleActiveDropdown(day, i, 'end')}
													>
														{`${hourRange.end.hour}:${hourRange.end.minute}${hourRange.end.period}`}
														{activeDropdown?.day === day &&
															activeDropdown?.rangeIndex === i &&
															activeDropdown?.type === 'end' && (
																<div
																	className={styles.timeDropdownRight}
																	ref={dropdownRefs}
																>
																	<div className={styles.period}>
																		<div
																			onClick={() =>
																				handleWorkingHoursChange(
																					day,
																					i,
																					'end',
																					'am',
																					'period'
																				)
																			}
																		>
																			AM
																		</div>
																		<div
																			onClick={() =>
																				handleWorkingHoursChange(
																					day,
																					i,
																					'end',
																					'pm',
																					'period'
																				)
																			}
																		>
																			PM
																		</div>
																	</div>
																	<div
																		style={{
																			width: '100%',
																			display: 'flex',
																			flexDirection: 'row',
																		}}
																	>
																		<div
																			ref={timeDropdownItemRef}
																			className={styles.timeDropdownItem}
																		>
																			{hours.map((hour) => (
																				<div
																					key={hour}
																					className={styles.hoursDropdownItem}
																					onClick={() =>
																						handleWorkingHoursChange(
																							day,
																							i,
																							'end',
																							hour,
																							'hour'
																						)
																					}
																				>
																					{hour}
																				</div>
																			))}
																		</div>
																		<div
																			ref={secondTimeDropdownItemRef}
																			className={styles.timeDropdownItem}
																		>
																			{minutes.map((minute) => (
																				<div
																					key={minute}
																					className={styles.hoursDropdownItem}
																					onClick={() =>
																						handleWorkingHoursChange(
																							day,
																							i,
																							'end',
																							minute,
																							'minute'
																						)
																					}
																				>
																					{minute}
																				</div>
																			))}
																		</div>
																	</div>
																</div>
															)}
													</div>
												</div>
											))}
										</div>
									</div>
								) : (
									<span>{day}</span>
								)}
								<div
									className={styles.dropdownContainer}
									ref={(el) =>
										dropdownRefs.current && (dropdownRefs.current[day] = el)
									}
								>
									<div
										className={styles.dropdownButton}
										onClick={(e) => {
											e.stopPropagation()
											toggleDropdown(day)
										}}
									>
										{workLocations[day] ? (
											<>
												<div
													className={
														!locationOptions.find(
															(option) => option.label === workLocations[day]
														)?.iconType && workLocationsIcons[day] === 'Pointer'
															? styles.leftContainerMd
															: !locationOptions.find(
																		(option) =>
																			option.label === workLocations[day]
																  )?.iconType &&
																  workLocationsIcons[day] === 'PointerOff'
																? styles.leftContainerMd
																: locationOptions.find(
																			(option) =>
																				option.label === workLocations[day]
																	  )?.iconType === 'Pointer' ||
																	  locationOptions.find(
																			(option) =>
																				option.label === workLocations[day]
																	  )?.iconType === 'PointerOff'
																	? styles.leftContainerMd
																	: styles.leftContainer
													}
												>
													{selectedOption?.icon ? (
														selectedOption.icon
													) : workLocationsIcons[day] === 'Pointer' ? (
														<MdOutlineLocationOn />
													) : workLocationsIcons[day] === 'PointerOff' ? (
														<MdOutlineLocationOff />
													) : workLocationsIcons[day] === 'Brief' ? (
														<TbBriefcase2Filled />
													) : (
														<GoHomeFill />
													)}
													<span>{workLocations[day]}</span>
												</div>
												<div
													style={{
														transform: dropdownVisible[day]
															? 'rotate(180deg)'
															: 'rotate(0deg)',
														transition: 'transform 0.2s ease-in-out',
													}}
													className={styles.arrow}
												/>
											</>
										) : (
											<>
												<div className={styles.leftContainer}>
													<MdOutlineLocationOff />
													<span>Sin especificar</span>
												</div>
												<div
													style={{
														transform: dropdownVisible[day]
															? 'rotate(180deg)'
															: 'rotate(0deg)',
														transition: 'transform 0.2s ease-in-out',
													}}
													className={styles.arrow}
												/>
											</>
										)}
									</div>
									{dropdownVisible[day] && (
										<div className={styles.dropdownMenu}>
											{locationOptions.map((option) => (
												<div
													key={option.label}
													className={styles.dropdownItem}
													onClick={() => {
														if (option.label === 'Otro lugar') {
															setOptionToChange(day)
															setOfficeOrLocation('location')
															setShowCreateLocationPopup(true)
														}
														if (option.label === 'Otra oficina') {
															setOptionToChange(day)
															setOfficeOrLocation('office')
															setShowCreateLocationPopup(true)
														}
														handleLocationChange(day, option.label)
													}}
												>
													{option.icon}
													<span>{option.label}</span>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						)
					})}
				{firstEnabledLocation && (
					<div className={styles.copyButton} onClick={copyToAll}>
						<MdContentCopy size={20} />
						<span>Copiar a todos</span>
					</div>
				)}
			</div>

			<button
				onClick={() => handleSavePreferences()}
				className={styles.saveButton}
			>
				Guardar
			</button>
		</div>
	)
}

export default WorkingHoursSettings
