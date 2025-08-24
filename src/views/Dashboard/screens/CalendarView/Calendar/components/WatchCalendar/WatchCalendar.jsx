import React, { useEffect, useState } from 'react'
import styles from './WatchCalendar.module.css'
import CustomAppointmentCalendar from './CustomAppointmentCalendar/CustomAppointmentCalendar'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import CustomCalendar from './CustomCalendar/CustomCalendar'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import CustomCalendarPreview from './CustomPreviewCalendar/CustomPreviewCalendar'
import { getCalendarByShareId } from '@src/actions/calendar'
import { colors } from '../../utils'

const WatchCalendar = () => {
	const dispatch = useDispatch()
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [selectedDate, setSelectedDate] = useState({
		day: new Date().getDate(),
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	})
	const [selectedHour, setSelectedHour] = useState({
		start: null,
		end: null,
	})
	const formattedMonth = new Date(currentYear, currentMonth)
		.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
		.replace(/^\w/, (c) => c.toUpperCase())

	const handlePreviousMonth = () => {
		if (currentMonth === 0) {
			setCurrentYear(currentYear - 1)
			setCurrentMonth(11)
		} else {
			setCurrentMonth(currentMonth - 1)
		}
	}

	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentYear(currentYear + 1)
			setCurrentMonth(0)
		} else {
			setCurrentMonth(currentMonth + 1)
		}
	}

	const handleCellClick = (day, monthIndicator) => {
		if (monthIndicator === 'current') {
			setSelectedHour({
				start: null,
				end: null,
			})
			setSelectedDate({ day, month: currentMonth, year: currentYear })
		}
	}

	const [selectedCalendarData, setSelectedCalendarData] = useState({})
	const [selectedCalendarEvents, setSelectedCalendarEvents] = useState([])
	const { shareId } = useParams()

	useEffect(() => {
		const getCalendarData = async (shareId) => {
			const data = await dispatch(getCalendarByShareId({ shareId }))
			setSelectedCalendarData(data.payload)
			setSelectedCalendarEvents(data.payload.events)
			return data
		}

		shareId && getCalendarData(shareId)
	}, [])


	if (Object.keys(selectedCalendarData).length === 0) return null
	if (
		selectedCalendarData &&
		!selectedCalendarData.createAppointmentsCalendarInsteadOfAvailableHours
	)
		return (
			<div className={styles.tableCalendar}>
				<div className={styles.preview}>
					<div className={styles.left}>
						<div className={styles.title}>
							<input type='text' placeholder='Titulo del calendario' />
							<span>0/200</span>
						</div>
						<div className={styles.options}>
							<b>Mostrar</b>
							<ul>
								<li>
									<input type='check' />
									Título
								</li>
								<li>
									<input type='check' />
									Botones de navegación
								</li>
								<li>
									<input type='check' />
									Fecha
								</li>
								<li>
									<input type='check' />
									Icono de imprimir
								</li>
								<li>
									<input type='check' />
									Pestañas
								</li>
								<li>
									<input type='check' />
									Lista de calendarios
								</li>
								<li>
									<input type='check' />
									Zona horaria
								</li>
							</ul>
						</div>
						<div className={styles.color}>
							<b>Color de fondo</b>
							<ul>
								{colors.map((item, index) => (
									<li key={index}>
										<div
											className={styles.color}
											style={{ background: item.value }}
										>
											<span>{item.name}</span>
										</div>
									</li>
								))}
							</ul>
						</div>
						<div className={styles.border}>
							<input type='check' />
							Borde
						</div>
						<div className={styles.form}>
							<ul>
								<li>
									<label>Vista predeterminada</label>
									<span>Mes</span>
									<svg fill='none' viewBox='0 0 24 24'>
										<path
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='m8 10 4 4 4-4'
										/>
									</svg>

									<ul>
										<li>Semana</li>
										<li>Mes</li>
										<li>Agenda</li>
									</ul>
								</li>
								<li>
									<label>La semana empieza el</label>
									<span>Domingo</span>
									<svg fill='none' viewBox='0 0 24 24'>
										<path
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='m8 10 4 4 4-4'
										/>
									</svg>

									<ul>
										<li>Sábado</li>
										<li>Domingo</li>
										<li>Lunes</li>
									</ul>
								</li>
								<li>
									<label>Idioma</label>
									<span>Español</span>
									<svg fill='none' viewBox='0 0 24 24'>
										<path
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='m8 10 4 4 4-4'
										/>
									</svg>

									<ul>
										<li>Español</li>
										<li>Ingles</li>
									</ul>
								</li>
								<li>
									<label>Zona horaria</label>
									<span>GTM +2:00 UTC - Berlin</span>
									<svg fill='none' viewBox='0 0 24 24'>
										<path
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='m8 10 4 4 4-4'
										/>
									</svg>

									<ul>
										<li>Sábado</li>
										<li>Domingo</li>
										<li>Lunes</li>
									</ul>
								</li>
							</ul>
						</div>
						<div className={styles.shows}>
							<b>Calendarios mostrados</b>
							<ul>
								<li>
									<input type='check' />
									info@FacturaGPT.com
								</li>
								<li>
									<input type='check' />
									Resellers
								</li>
							</ul>
						</div>
					</div>
					<div className={styles.right}>
						<div className={styles.input}>
							<label>Insertar código</label>
							<input
								placeholder={`<iframe src="https://https://aythen.com/es/app/calendar/watchCalendar/${selectedCalendarData.shareId}"></iframe>`}
							/>
						</div>
						<small>
							Copia y pega el código HTML anterior para incluir este calendario
							en tu página web.
						</small>
						<div>
							<CustomCalendarPreview
								selectedCalendarData={selectedCalendarData}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.title}>
					<p>Viewen as FacturaGPT Company</p>
					<a>See what others see</a>
				</div>
				<div className={styles.share}>
					<svg fill='none' viewBox='0 0 24 24'>
						<path
							stroke='currentColor'
							strokeLinecap='round'
							strokeWidth='2'
							d='M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z'
						/>
					</svg>
					Share
				</div>
			</div>
			<div className={styles.subHeader}>
				<div className={styles.left}>
					<div>{selectedCalendarData.owner[0].toUpperCase()}</div>
					<p>{selectedCalendarData.calendarName}</p>
				</div>
				<div className={styles.right}>
					<b>Horarios para cita</b>
					<ul>
						<li className={styles.liText}>
							<svg fill='none' viewBox='0 0 24 24'>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
								/>
							</svg>
							Citas de {selectedCalendarData.eventsDuration} minutoss
						</li>
						<li className={styles.liText}>
							<svg fill='none' viewBox='0 0 24 24'>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z'
								/>
							</svg>
							Informacion sobre video conferencia en FacturaGPT Meet luego de
							agendar una reunión
						</li>
					</ul>
				</div>
			</div>
			<div className={styles.calendar}>
				<div className={styles.left}>
					<b className={styles.title}>Selecciona una reunión</b>
					<div className={styles.date}>
						<b>{formattedMonth}</b>
						<div>
							<button onClick={handlePreviousMonth}>
								<FaChevronLeft size={12} />
							</button>
							<button onClick={handleNextMonth}>
								<FaChevronRight size={12} />
							</button>
						</div>
					</div>
					<div className={styles.miniCalendar}>
						<CustomAppointmentCalendar
							year={currentYear}
							month={currentMonth}
							formattedMonth={formattedMonth}
							selectedDate={selectedDate}
							handleCellClick={handleCellClick}
							selectedCalendarEvents={selectedCalendarEvents}
						/>
					</div>
				</div>
				<div className={styles.right}>
					<CustomCalendar
						selectedDate={selectedDate}
						selectedCalendarData={selectedCalendarData}
						selectedCalendarEvents={selectedCalendarEvents}
					/>
				</div>
			</div>
		</div>
	)
}

export default WatchCalendar
