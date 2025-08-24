import { useContext, useState } from 'react'
import styles from '../WatchCalendar.module.css'
import CustomMonthCalendar from './../CustomMonthCalendar/CustomMonthCalendar'
import CustomWeekCalendar from '../CustomWeekCalendar/CustomWeekCalendar'
import CustomScheduleCalendar from './../CustomScheduleCalendar/CustomScheduleCalendar'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { CalendarContext } from '../../../../CalendarContext'

const CustomCalendarPreview = ({ selectedCalendarData }) => {
	const [selectedOption, setSelectedOption] = useState('Mes')
	const { getWeekRange } = useContext(CalendarContext)

	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
	const [selectedDate, setSelectedDate] = useState({
		day: new Date().getDate(),
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	})
	const [selectedHour, setSelectedHour] = useState({
		start: null,
		end: null,
	})
	const actualWeek = getWeekRange(currentWeekStart)

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

	const setTodayAsSelectedDate = () => {
		const today = new Date()
		setSelectedDate({
			day: today.getDate(),
			month: today.getMonth(),
			year: today.getFullYear(),
		})
	}

	return (
		<div className={styles.preview}>
			<div className={styles.header}>
				<div className={styles.title}>{selectedCalendarData.calendarName}</div>
				<div>
					<div>
						<button
							onClick={setTodayAsSelectedDate}
							className={`${styles.toDay} ${
								selectedDate.day === new Date().getDate() &&
								selectedDate.month === new Date().getMonth() &&
								selectedDate.year === new Date().getFullYear()
									? styles.actualToday
									: ''
							}`}
						>
							Hoy
						</button>
						<div className={styles.date}>
							<div>
								<button onClick={handlePreviousMonth}>
									<FaChevronLeft />
								</button>
								<button onClick={handleNextMonth}>
									<FaChevronRight />
								</button>
							</div>
						</div>
						{formattedMonth}
					</div>
					<div className={styles.buttons}>
						<button>Imprimir</button>
						<button onClick={() => setSelectedOption('Semana')}>Semana</button>
						<button onClick={() => setSelectedOption('Mes')}>Mes</button>
						<button onClick={() => setSelectedOption('Agenda')}>Agenda</button>
					</div>
				</div>
			</div>
			<div className={styles.calendar}>
				{selectedOption === 'Mes' ? (
					<CustomMonthCalendar
						selectedCalendarEvents={selectedCalendarData.events}
						selectedDate={selectedDate}
						currentMonth={currentMonth}
						currentYear={currentYear}
						formattedMonth={formattedMonth}
					/>
				) : selectedOption === 'Semana' ? (
					<CustomWeekCalendar
						selectedCalendarEvents={selectedCalendarData.events}
						selectedCalendarData={selectedCalendarData}
						selectedDate={selectedDate}
						selectedHour={selectedHour}
						setSelectedHour={setSelectedHour}
						setSelectedDate={setSelectedDate}
						currentWeekStart={currentWeekStart}
						actualWeek={actualWeek}
						formattedMonth={formattedMonth}
					/>
				) : (
					<CustomScheduleCalendar
						selectedCalendarEvents={selectedCalendarData.events}
					/>
				)}
			</div>
			<div className={styles.footer}>
				<p>
					Los eventos se muestran en la zona horaria: Hora de Europa central -
					Madrid
				</p>
				<div>FacturaGPT Calendar</div>
			</div>
		</div>
	)
}

export default CustomCalendarPreview
