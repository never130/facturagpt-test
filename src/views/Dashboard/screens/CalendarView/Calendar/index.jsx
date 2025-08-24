import React, { useState, useEffect, useContext, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { t } from 'i18next'
import { IoClose } from 'react-icons/io5'
import { PlusIcon } from 'lucide-react'
import { v4 } from 'uuid'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

import styles from './index.module.css'

import { Menu, CalendarCreation, MiniCalendar } from './event'

// import CalendarSettings from './settings'
// import CalendarEmail from './email'
// import CalendarPreview from './preview'
// import CalendarCalendaly from './calendaly'

import { CalendarContext } from '../CalendarContext'
import { InputCalendar } from './components/InputCalendar.jsx'
import CalendarEventJoin from './components/CalendarEventJoin.jsx'
import CustomToast from './components/CustomToast.jsx'
import WatchCalendar from './components/WatchCalendar/WatchCalendar.jsx'
import AcceptEvent from './components/AcceptEvent.jsx'
import NavArrowButtons from './components/NavArrowButtons.jsx'
import CalendarWeek from './Calendars/CalendarWeek.jsx'
import CalendarMonth from './Calendars/CalendarMonth.jsx'
import CalendarDay from './Calendars/CalendarDay.jsx'
import CalendarSchedule from './Calendars/CalendarSchedule.jsx'
import CalendarTimeline from './Calendars/CalendarTimeline.jsx'
import { setModal } from '@src/slices/calendarSlices'


import { setNotification } from "@src/slices/notificationsSlices";

const Calendar = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { tag } = useParams()

	const inputRef = useRef(null)
	const calendarRef = useRef(null)
	const tableCalendarRef = useRef(null)
	const kanbanInputRef = useRef()


	const { user } = useSelector((state) => state.user)
	const { modal, selectedCalendar, selectedCalendarData } = useSelector((state) => state.calendar)

	const { kanbans, kanban } = useSelector((state) => state.kanban)
	const [showMiniCalendar, setShowMiniCalendar] = useState(false)
	const [createNewKanban, setCreateNewKanban] = useState(false)
	const [kanbanTitle, setKanbanTitle] = useState('')

	const {
		selectedDate,
		setTodayAsSelectedDate,
		calendar,
		setCalendar,
		handleCalendar,
		handleCellClick,
		goToActualWeek,
		currentTimelineDate,
		goToActualMonth,
		actualWeek,
		formattedMonth,
		handlePreviousMonth,
		handleNextMonth,
		currentYear,
		currentMonth,
	} = useContext(CalendarContext)


	const [isShowExpand, setIsShowExpand] = useState(false)

	const monthIndex = [
		'Ene',
		'Feb',
		'Mar',
		'Abr',
		'May',
		'Jun',
		'Jul',
		'Ago',
		'Sep',
		'Oct',
		'Nov',
		'Dic',
	]

	const weekSplitted = actualWeek.split(' ')
	const date = new Date()

	const [stateNewKanban, setStateNewKanban] = useState({
		title: '',
		tickets: [],
		collaborators: [],
	})

	const [isFocused, setIsFocused] = useState(false)






	const handleClickOutside = (event) => {
		if (
			calendarRef.current &&
			!calendarRef.current.contains(event.target) &&
			inputRef.current &&
			!inputRef.current.contains(event.target)
		) {
			setShowMiniCalendar(false)
		}
	}

	const handleModalClickOutside = (event) => {
		if (event.target === event.currentTarget) {
			dispatch(setModal(null))
		}
	}


	const handleCalendarCreation = () => {
		dispatch(
			setModal({
				component: <CalendarCreation />,
				option: { close: true },
			})
		)
	}



	const handleExpand = () => {
		setIsShowExpand(!isShowExpand)
	}

	const handleKanban = () => {
		navigate(`/admin/calendar/kanban`)
	}

	const transformDateString = (dateString) => {
		const [month, , year] = dateString.split(' ')

		const shortMonth = month.slice(0, 3)

		return `${shortMonth} de ${year}`
	}



	const transformDateFormat = (dateStr) => {
		const monthMapping = {
			enero: 'Ene',
			febrero: 'Feb',
			marzo: 'Mar',
			abril: 'Abr',
			mayo: 'May',
			junio: 'Jun',
			julio: 'Jul',
			agosto: 'Ago',
			septiembre: 'Sep',
			octubre: 'Oct',
			noviembre: 'Nov',
			diciembre: 'Dic',
		}

		const [month, year] = dateStr.split(' ')

		return `${monthMapping[month]} de ${year}`
	}



	const handleFocus = () => {
		setIsFocused(true)
	}

	const handleBlur = () => {
		setStateNewKanban((prev) => ({ ...prev, title: '' }))
		setIsFocused(false)
	}



	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		const element = document.getElementById('main-grid')
		if (element) {
			element.classList.add('main-grid-mini')
		}
		return () => {
			if (element) {
				element.classList.remove('main-grid-mini')
			}
		}
	}, [])

	useEffect(() => {
		if (tag && calendar !== tag) {
			setCalendar(tag)
		}
	}, [tag])

	useEffect(() => {
		if (tag === 'kanban' || calendar === 'kanban') {
			setIsShowExpand(true)
		}
	}, [tag, calendar])


	const [scrollX, setScrollX] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollX(tableCalendarRef.current.scrollLeft);
		};

		const contenedor = tableCalendarRef.current;
		if (contenedor) {
			contenedor.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (contenedor) {
				contenedor.removeEventListener("scroll", handleScroll);
			}
		};
	}, [tableCalendarRef.current]);



	const [timezonePosition, setTimezonePosition] = useState({ top: 0, left: 0 })


	const handleNotification = (type) => {
		console.log('type', type)
		if (type === 'push') {
	
			dispatch(sendNotification())
		} else if (type === 'pay5') {
			dispatch(sendNotification())
		} else if (type === 'pay10') {
			dispatch(sendNotification())
		} else if (type === 'normal') {
			dispatch(sendNotification())
		}


		dispatch(setNotification({
			id: 'is-loading',
			type: 'folder',
			text: 'notification #1'
		  }));
	}

	if (
		!calendar ||
		!selectedCalendar ||
		Object.keys(selectedCalendarData).length === 0
	) {
		return null
	}
	return (
		<div className={styles.container}>
			{modal && (
				<div className={styles.modal} onClick={handleModalClickOutside}>
					<div className={styles.modalContent}>
						{typeof modal === "object" ? modal.component : modal}
					</div>
				</div>
			)}

			<div>
				<button onClick={() => handleNotification('push')}>
					Push Not.
				</button>
				<button onClick={() => handleNotification('pay5')}>
					Not. 5$
				</button>
				<button onClick={() => handleNotification('pay10')}>
					Not. 10$
				</button>
				<button onClick={() => handleNotification('normal')}>
					Not. Normal
				</button>
			</div>
			<div className={styles.app}>
				<CustomToast />
				<div className={styles.calendarContainer}>
					{(tag === 'day' || tag === 'week') && <div
						className={styles.leftTimezone}
						style={{
							top: "0", left: "0",
							position: 'absolute',
						}}
					>
						{selectedCalendarData.timezone
							? selectedCalendarData.timezone.match(/\(([^)]+)\)/)[1]
							: 'GMT+01:00'}
					</div>}

					<div
						style={{
							background:
								calendar === 'timeline'
									? `var(--fa-background)`
									: calendar === 'kanban'
										? `var(--fa-background)`
										: calendar === 'week'
											? `var(--fa-background)`
											: selectedCalendarData?.previewSettings?.backgroundColor ===
												'default'
												? `var(--fa-background)`
												: selectedCalendarData?.previewSettings?.backgroundColor,
							borderRadius: tag === 'month' ? '0px' : '5px',
						}}
						className={`${styles.tableCalendar} ${tag === 'calendaly' ? styles.notScrollableTableCalendar : ''}`}
						ref={tableCalendarRef}
					>




						{tag === 'day' ? (
							<CalendarDay scrollX={scrollX} />
						) : tag === 'week' ? (
							<CalendarWeek scrollX={scrollX} />
						) : tag === 'month' ? (
							<CalendarMonth scrollX={scrollX} />
						) : tag === 'schedule' ? (
							<CalendarSchedule />
						) : tag === 'timeline' ? (
							<CalendarTimeline scrollX={scrollX} />
						) : tag === 'watchCalendar' ? (
							<WatchCalendar />
						) : tag === 'acceptEvent' ? (
							<AcceptEvent />
						) : tag === 'cancelEvent' ? (
							<AcceptEvent cancel={true} />
						) : tag === 'rescheduleEvent' ? (
							<AcceptEvent reschedule={true} />
						) : (
							<CalendarMonth />
						)}
					</div>

					<div className={styles.buttonsCalendars}>
						{/* {selectedCalendarData.publicCalendar && (
							<button
								className={`${tag === 'preview' ? styles.active : ''}`}
								onClick={() => handleCalendar('preview')}
							>
								Previsualización
							</button>
						)}

						{selectedCalendarData.createAppointmentsCalendarInsteadOfAvailableHours && (
							<button
								className={`${tag === 'calendaly' ? styles.active : ''}`}
								onClick={() => handleCalendar('calendaly')}
							>
								Citas
							</button>
						)} */}
						<button
							className={`${tag === 'options' ? styles.active : ''}`}
							onClick={() => handleCalendar('options')}
						>
							<svg fill='none' viewBox='0 0 24 24'>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='m11.5 11.5 2.071 1.994M4 10h5m11 0h-1.5M12 7V4M7 7V4m10 3V4m-7 13H8v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L10 17Zm-5 3h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z'
								/>
							</svg>
						</button>
						<button className={styles.expand} onClick={() => handleExpand()}>
							<svg fill='none' viewBox='0 0 24 24'>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeWidth='2'
									d='M5 7h14M5 12h14M5 17h14'
								/>
							</svg>
						</button>

						<button
							className={`${tag === 'timeline' ? styles.active : ''}`}
							onClick={() => handleCalendar('timeline')}
							style={{
								marginLeft: 'auto',
							}}
						>
							Gantt
						</button>
						<button
							className={`${tag === 'day' ? styles.active : ''}`}
							onClick={() => handleCalendar('day')}
						>
							Día
						</button>
						<button
							className={`${tag === 'week' ? styles.active : ''}`}
							onClick={() => handleCalendar('week')}
						>
							Semana
						</button>
						<button
							className={`${tag === 'month' ? styles.active : ''}`}
							onClick={() => handleCalendar('month')}
						>
							Mes
						</button>

						<button
							className={`${tag === 'schedule' ? styles.active : ''}`}
							onClick={() => handleCalendar('schedule')}
						>
							Agenda
						</button>



					</div>
				</div>
				<div className={`${styles.menu} ${isShowExpand ? styles.expand : ''}`}>

					<div className={styles.header}>
						<div className={styles.top}>

							{tag === 'week' && (
								<button
									onClick={goToActualWeek}
									className={`${styles.toDay} ${tag === 'week' &&
										date.getDate() >= parseInt(weekSplitted[0]) &&
										date.getDate() <= parseInt(weekSplitted[2]) &&
										monthIndex[date.getMonth()] === weekSplitted[3] &&
										date.getFullYear() === parseInt(weekSplitted[4]) &&
										styles.actualToday
										}`}
								>
									Hoy
								</button>
							)}
							{tag === 'month' && (
								<button
									onClick={goToActualMonth}
									className={`${styles.toDay} ${tag === 'month' &&
										parseInt(formattedMonth.split(' ')[2]) ===
										new Date().getFullYear() &&
										formattedMonth.split(' ')[0].slice(0, 3) ===
										monthIndex[new Date().getMonth()] &&
										styles.actualToday
										}`}
								>
									Hoy
								</button>
							)}


							{/* {tag === 'month' && <NavArrowButtons tag={tag} />} */}
							<div style={{ position: 'relative' }}>
								<button
									ref={inputRef}
									onClick={() => {
										if (calendar === 'week' || calendar === 'month') {
											setShowMiniCalendar((prev) => !prev)
											return
										}
										setTodayAsSelectedDate()
										if (calendar === 'calendaly') {
											handleCellClick(selectedDate.day, selectedDate.month)
										}
										if (calendar === 'kanban') {
											handleCalendar('month')
										}
									}}
									className={`${styles.toDay} ${tag === 'day' &&
										selectedDate.day === new Date().getDate() &&
										selectedDate.month === new Date().getMonth() &&
										selectedDate.year === new Date().getFullYear()
										? styles.actualToday
										: tag === 'week' &&
											date.getDate() >= parseInt(weekSplitted[0]) &&
											date.getDate() <= parseInt(weekSplitted[2]) &&
											monthIndex[date.getMonth()] === weekSplitted[3] &&
											date.getFullYear() === parseInt(weekSplitted[4])
											? styles.actualToday
											: tag === 'month' &&
												parseInt(formattedMonth.split(' ')[2]) ===
												new Date().getFullYear() &&
												formattedMonth.split(' ')[0].slice(0, 3) ===
												monthIndex[new Date().getMonth()]
												? styles.actualToday
												: tag === 'timeline' &&
													`${currentTimelineDate.toLocaleString('es-ES', { month: 'long' })} ${currentTimelineDate.getFullYear()}` ===
													`${new Date().toLocaleString('es-ES', { month: 'long' })} ${new Date().getFullYear()}`
													? styles.actualToday
													: ''
										}`}
								>
									{tag === 'day'
										? 'Hoy'
										: tag === 'week'
											? actualWeek
											: tag === 'month'
												? transformDateString(formattedMonth)
												: tag === 'timeline'
													? transformDateFormat(
														`${currentTimelineDate.toLocaleString('es-ES', { month: 'long' })} ${currentTimelineDate.getFullYear()}`
													)
													: 'Hoy'}
								</button>
								{showMiniCalendar && (
									<div className={styles.calendarPopup} ref={calendarRef}>
										<div className={styles.date}>
											<b>{formattedMonth}</b>
											<div>
												<button onClick={handlePreviousMonth}>
													<FaChevronLeft />
												</button>
												<button onClick={handleNextMonth}>
													<FaChevronRight />
												</button>
											</div>
										</div>
										<div className={styles.miniCalendarWrapper}>
											<MiniCalendar year={currentYear} month={currentMonth} />
										</div>
									</div>
								)}
							</div>
							{/* {tag === 'week' && <NavArrowButtons tag={tag} />} */}
							{/* {tag !== 'week' && tag !== 'month' && <NavArrowButtons tag={tag} />} */}
							{/* {tag !== 'week' && tag !== 'month' && <InputCalendar />} */}

							{true && <NavArrowButtons tag={tag} />}
						</div>


					</div>

					<Menu
						handleCalendarCreation={handleCalendarCreation}
						setCalendar={setCalendar}
					/>
				</div>
			</div>




		</div>
	)
}

export default Calendar
