import React, { createContext, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
	checkForCalendarDB,
	deleteEvent,
	getAcceptedInvitationsEvents,
	getUserCalendars,
	getUserSharedEvents,
	sendInvitationEmail,
	updateCalendar,
} from '@src/actions/calendar'
import { 
	setModal,
	setSelectedCalendar 
} from '@src/slices/calendarSlices'
import {
	getNextMonth,
	getPreviousMonth,
} from './Calendar/utils/timeline'
import { Event } from './Calendar/event'
import { fetchsKanban } from '@src/actions/kanban'




export const CalendarContext = createContext()

export const CalendarContextProvider = ({ children }) => {
	const { tag } = useParams()
	const { user } = useSelector((state) => state.user)
	const {
		userCalendars,
		selectedCalendar,
		allUserEvents,
		selectedCalendarEvents,
		selectedCalendarData,
		userSharedEvents,
	} = useSelector((state) => state.calendar)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [eventToEdit, setEventToEdit] = useState()
	const searchPeopleRef = useRef(null)
	const [showPeoplePopUp, setShowPeoplePopUp] = useState(false)
	const [searchPeople, setSearchPeople] = useState('')
	const [showEventCreationPopUp, setShowEventCreationPopUp] = useState(false)
	const [showEventOptionsPopUp, setShowEventOptionsPopUp] = useState(false)
	const [calendar, setCalendar] = useState('month')
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
	const [currentAppointmentsYear, setCurrentAppointmentsYear] = useState(
		new Date().getFullYear()
	)
	const [currentDesktopYear, setCurrentDesktopYear] = useState(
		new Date().getFullYear()
	)
	const [currentAppointmentsMonth, setCurrentAppointmentsMonth] = useState(
		new Date().getMonth()
	)
	const [currentDesktopMonth, setCurrentDesktopMonth] = useState(
		new Date().getMonth()
	)
	const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
	const [selectedAppointmentsDate, setSelectedAppointmentsDate] = useState({
		day: new Date().getDate(),
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	})
	const [selectedDate, setSelectedDate] = useState({
		day: new Date().getDate(),
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	})
	const [selectedHour, setSelectedHour] = useState({
		start: null,
		end: null,
	})

	useEffect(() => {
		const initializeCalendars = async () => {
			if (userCalendars.length === 0 && user) {
				await dispatch(
					checkForCalendarDB({ userId: user.id, userEmail: user.user })
				)
				await dispatch(getUserCalendars({ userId: user.id }))
				await dispatch(getUserSharedEvents({ userId: user.id }))
				await dispatch(getAcceptedInvitationsEvents({ userId: user.id }))
				await dispatch(
					fetchsKanban({
						workspaceId: user?.id,
					})
				)
			}
		}

		initializeCalendars()
	}, [user])
	const [currentMonthEventsTimes, setCurrentMonthEventsTimes] = useState()

	useEffect(() => {
		if (userCalendars.length > 0 && allUserEvents.length > 0) {
			const { passedTime, remainingTime } = calculateEventTimes(allUserEvents)
			setCurrentMonthEventsTimes({ passedTime, remainingTime })
		}
		if (userCalendars.length > 0 && !selectedCalendar) {
			const defaultExists = userCalendars.filter(
				(calendar) => calendar.id === `calendar_${user.id}_default`
			)
			if (defaultExists.length > 0) {
				dispatch(setSelectedCalendar(defaultExists[0]))
			} else {
				dispatch(setSelectedCalendar(userCalendars[0]))
			}
		}
	}, [userCalendars])

	const convertTo24Hour = (time) => {
		const [hourMinute, period] = time.split(' ')
		let [hours, minutes] = hourMinute.split(':').map(Number)

		if (period === 'PM' && hours !== 12) {
			hours += 12
		} else if (period === 'AM' && hours === 12) {
			hours = 0
		}

		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
	}

	const convertTimeRangeTo24Hour = (timeRange) => {
		const convertTo24Hour = (time) => {
			const [hourMinute, period] = time.match(/(\d+:\d+)(am|pm)/i).slice(1)
			let [hours, minutes] = hourMinute.split(':').map(Number)

			if (period.toLowerCase() === 'pm' && hours !== 12) {
				hours += 12
			} else if (period.toLowerCase() === 'am' && hours === 12) {
				hours = 0
			}

			return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
		}

		const [startTime, endTime] = timeRange.split(' - ')

		return `${convertTo24Hour(startTime)} - ${convertTo24Hour(endTime)}`
	}

	const [hourFormat, setHourFormat] = useState(
		selectedCalendarData?.hourFormat || '1:00am'
	)

	useEffect(() => {
		setHourFormat(selectedCalendarData.hourFormat)
	}, [selectedCalendar])

	const [selectedInterval, setSelectedInterval] = useState(30)

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
	const handlePreviousAppointmentsMonth = () => {
		if (currentAppointmentsMonth === 0) {
			setCurrentAppointmentsYear(currentAppointmentsYear - 1)
			setCurrentAppointmentsMonth(11)
		} else {
			setCurrentAppointmentsMonth(currentAppointmentsMonth - 1)
		}
	}

	const handleNextAppointmentsMonth = () => {
		if (currentAppointmentsMonth === 11) {
			setCurrentAppointmentsYear(currentAppointmentsYear + 1)
			setCurrentAppointmentsMonth(0)
		} else {
			setCurrentAppointmentsMonth(currentAppointmentsMonth + 1)
		}
	}

	const handlePreviousDesktopMonth = () => {
		if (currentDesktopMonth === 0) {
			setCurrentDesktopYear(currentDesktopYear - 1)
			setCurrentDesktopMonth(11)
		} else {
			setCurrentDesktopMonth(currentDesktopMonth - 1)
		}
	}

	const handleNextDesktopMonth = () => {
		if (currentDesktopMonth === 11) {
			setCurrentDesktopYear(currentDesktopYear + 1)
			setCurrentDesktopMonth(0)
		} else {
			setCurrentDesktopMonth(currentDesktopMonth + 1)
		}
	}

	const formattedMonth = new Date(currentYear, currentMonth)
		.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
		.replace(/^\w/, (c) => c.toUpperCase())

	const formattedDesktopMonth = new Date(
		currentDesktopYear,
		currentDesktopMonth
	)
		.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
		.replace(/^\w/, (c) => c.toUpperCase())

	const getWeekRange = (date) => {
		const selectedDate = new Date(date)

		const startOfWeek = new Date(selectedDate)
		const endOfWeek = new Date(selectedDate)

		endOfWeek.setDate(startOfWeek.getDate() + 6)

		const monthNames = [
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

		const formattedWeek = `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getFullYear()}`

		return formattedWeek
	}

	const isTodayInWeekRange = (weekRange) => {
		const today = new Date()
		const [start, end, month, year] = weekRange.split(' ')

		const startDay = parseInt(start, 10)
		const endDay = parseInt(end, 10)
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
		].indexOf(month)

		const currentYear = today.getFullYear()
		const currentMonth = today.getMonth()
		const currentDay = today.getDate()

		return (
			currentYear === parseInt(year, 10) &&
			currentMonth === monthIndex &&
			currentDay >= startDay &&
			currentDay <= endDay
		)
	}

	const actualWeek = getWeekRange(currentWeekStart)

	const formattedAppointmentsMonth = new Date(
		currentAppointmentsYear,
		currentAppointmentsMonth
	)
		.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
		.replace(/^\w/, (c) => c.toUpperCase())

	const generateMonthDays = (year, month) => {
		const firstDayOfMonth = new Date(year, month, 1)
		const lastDayOfMonth = new Date(year, month + 1, 0)
		const daysInMonth = lastDayOfMonth.getDate()
		const firstDayIndex = firstDayOfMonth.getDay()
		const lastDayIndex = lastDayOfMonth.getDay()
		const daysInPreviousMonth = new Date(year, month, 0).getDate()

		const daysArray = []

		for (let i = firstDayIndex; i > 0; i--) {
			daysArray.push({ day: daysInPreviousMonth - i + 1, month: 'previous' })
		}

		for (let i = 1; i <= daysInMonth; i++) {
			daysArray.push({ day: i, month: 'current' })
		}

		for (let i = 1; i < 7 - lastDayIndex; i++) {
			daysArray.push({ day: i, month: 'next' })
		}

		const weeks = []
		while (daysArray.length) {
			weeks.push(daysArray.splice(0, 7))
		}

		return weeks
	}

	const handleCalendar = (value) => {
		setCalendar(value)
		if (value === 'day' || value === 'week' || value === 'month') {
			localStorage.setItem('lastCalendarSection', value)
		}
		navigate(`/admin/calendar/${value}`)
	}

	const getDateData = (dateString) => {
		const monthsInSpanish = [
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
		const daysInSpanish = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

		const [dayNumber, monthNumber, year] = dateString.split('/')

		const date = new Date(`${year}-${monthNumber}-${dayNumber}`)

		const month = monthsInSpanish[date.getMonth()]

		const day = daysInSpanish[date.getDay()]

		const completeDate = `${day} ${month} ${dayNumber}, ${year}`

		return {
			month,
			dayNumber: dayNumber.padStart(2, '0'),
			day,
			completeDate,
		}
	}

	const getRandomColor = () => {
		const letters = '0123456789ABCDEF'
		let color = '#'
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)]
		}
		return color
	}

	const generateGradient = (colors) => {
		const colorStop = 100 / colors.length
		const gradientStops = colors
			.map((color, index) => {
				const start = index * colorStop
				const end = (index + 1) * colorStop
				return `${color} ${start}% ${end}%`
			})
			.join(', ')

		return `conic-gradient(${gradientStops})`
	}

	const handleDeleteEvent = (eventId) => {
		dispatch(
			deleteEvent({ userId: user.id, calendarId: selectedCalendar, eventId })
		)
		setShowEventOptionsPopUp()
	}

	const formatSelectedDate = (type, fromMonth) => {
		if (
			!selectedDate.day ||
			selectedDate.month === null ||
			selectedDate.year === null
		)
			return ''
		const day = String(selectedDate.day).padStart(2, '0')
		const month = String(
			fromMonth ? selectedDate.month : selectedDate.month + 1
		).padStart(2, '0')
		const year = selectedDate.year
		if (!type) {
			return `${day}/${month}/${year}`
		} else if (type === '12/31/2024') {
			return `${month}/${day}/${year}`
		} else if (type === '2024-12-31') {
			return `${year}-${month}-${day}`
		}
		return `${day}/${month}/${year}`
	}

	const setTodayAsSelectedDate = () => {
		const today = new Date()
		setSelectedDate({
			day: today.getDate(),
			month: today.getMonth(),
			year: today.getFullYear(),
		})
	}

	const setNextDayAsSelectedDate = () => {
		const { day, month, year } = selectedDate
		const currentDate = new Date(year, month, day)
		currentDate.setDate(currentDate.getDate() + 1)
		setSelectedDate({
			day: currentDate.getDate(),
			month: currentDate.getMonth(),
			year: currentDate.getFullYear(),
		})
	}

	const setPreviousDayAsSelectedDate = () => {
		const { day, month, year } = selectedDate
		const currentDate = new Date(year, month, day)
		currentDate.setDate(currentDate.getDate() - 1)
		setSelectedDate({
			day: currentDate.getDate(),
			month: currentDate.getMonth(),
			year: currentDate.getFullYear(),
		})
	}

	const getEventFinishHour = (startTime) => {
		const [time, modifier] = startTime.split(' ')
		let [hours, minutes] = time.split(':').map(Number)

		if (modifier === 'PM' && hours !== 12) {
			hours += 12
		} else if (modifier === 'AM' && hours === 12) {
			hours = 0
		}

		const startDate = new Date()
		startDate.setHours(hours)
		startDate.setMinutes(minutes)

		const finishDate = new Date(startDate.getTime() + selectedInterval * 60000)

		let finishHours = finishDate.getHours()
		let finishMinutes = finishDate.getMinutes()
		const finishModifier = finishHours >= 12 ? 'PM' : 'AM'

		finishHours = finishHours % 12 || 12
		finishMinutes = finishMinutes.toString().padStart(2, '0')

		return `${finishHours}:${finishMinutes} ${finishModifier}`
	}

	const getDayName = (dateString) => {
		const [day, month, year] = dateString.split('/').map(Number)
		const date = new Date(Date.UTC(year, month, day))

		const daysOfWeek = [
			'Domingo',
			'Lunes',
			'Martes',
			'Miércoles',
			'Jueves',
			'Viernes',
			'Sábado',
		]

		return daysOfWeek[date.getUTCDay()]
	}

	const getMonthName = (monthNumber) => {
		const months = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		]

		return months[monthNumber]
	}

	const getWeekFromToday = (startDate) => {
		const weekDates = []
		const current = startDate ? new Date(startDate) : new Date()

		for (let i = 0; i < 7; i++) {
			const day = String(current.getDate()).padStart(2, '0')
			const month = String(current.getMonth() + 1).padStart(2, '0')
			const year = current.getFullYear()

			weekDates.push(`${day}/${month}/${year}`)

			current.setDate(current.getDate() + 1)
		}

		return weekDates
	}

	const formatDateEs = (dateStr) => {
		const monthsEs = [
			'ENE',
			'FEB',
			'MAR',
			'ABR',
			'MAY',
			'JUN',
			'JUL',
			'AGO',
			'SEP',
			'OCT',
			'NOV',
			'DIC',
		]
		const daysEs = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

		const [dayStr, monthStr, yearStr] = dateStr.split('/')
		const day = parseInt(dayStr, 10)
		const month = parseInt(monthStr, 10) - 1
		const year = parseInt(yearStr, 10)

		const date = new Date(year, month, day)

		const monthAbbr = monthsEs[month]

		const dayOfWeekAbbr = daysEs[date.getDay()]

		return { day, month: monthAbbr, dayName: dayOfWeekAbbr }
	}

	const groupEventsByDate = (events) => {
		return events.reduce((acc, event) => {
			const { date } = event
			if (!acc[date]) {
				acc[date] = []
			}
			acc[date].push(event)
			return acc
		}, {})
	}

	const generateInvitationId = () => {
		const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
		const segmentLength = [3, 4, 3]

		const getRandomSegment = (length) => {
			let segment = ''
			for (let i = 0; i < length; i++) {
				segment += characters.charAt(
					Math.floor(Math.random() * characters.length)
				)
			}
			return segment
		}

		const id = segmentLength.map(getRandomSegment).join('-')
		return id
	}

	const getReminderHour = (startHour, reminderMinutes, plus) => {
		let [time, modifier] = startHour.split(/(am|pm)/i)
		let [hours, minutes] = time.split(':').map(Number)

		if (modifier.toLowerCase() === 'pm' && hours !== 12) {
			hours += 12
		} else if (modifier.toLowerCase() === 'am' && hours === 12) {
			hours = 0
		}

		const eventDate = new Date()
		eventDate.setHours(hours)
		eventDate.setMinutes(minutes)
		if (plus) {
			eventDate.setMinutes(eventDate.getMinutes() + reminderMinutes)
		} else {
			eventDate.setMinutes(eventDate.getMinutes() - reminderMinutes)
		}

		let reminderHours = eventDate.getHours()
		let reminderMinutesFormatted = eventDate
			.getMinutes()
			.toString()
			.padStart(2, '0')
		const newModifier = reminderHours >= 12 ? 'pm' : 'am'
		reminderHours = reminderHours % 12 || 12

		return `${reminderHours}:${reminderMinutesFormatted}${newModifier}`
	}

	const isTimeInRange = (startRange, endRange, hourToCheck) => {
	
		const parseTime = (timeStr) => {
			const [time, modifier] = timeStr.toLowerCase().split(/(am|pm)/)
			let [hours, minutes] = time.split(':').map(Number)

			if (modifier === 'pm' && hours !== 12) {
				hours += 12
			} else if (modifier === 'am' && hours === 12) {
				hours = 0
			}
			return new Date(0, 0, 0, hours, minutes)
		}

		const startTime = parseTime(startRange)
		const endTime = parseTime(endRange)
		const checkTime = parseTime(hourToCheck)



		return checkTime >= startTime && checkTime <= endTime
	}

	function convertTimeToTimezone(timeStr, fromTimezoneStr, toTimezoneStr) {

		function timeStrToMinutes(timeStr) {
			const timeRegex = /(\d{1,2}):(\d{2})(am|pm)/i
			const match = timeStr.match(timeRegex)

			if (!match) {
				throw new Error(
					'Invalid time format. Expected format is h:mmam or h:mmpm'
				)
			}

			let hours = parseInt(match[1], 10)
			const minutes = parseInt(match[2], 10)
			const ampm = match[3].toLowerCase()

			if (ampm === 'pm' && hours !== 12) {
				hours += 12
			} else if (ampm === 'am' && hours === 12) {
				hours = 0
			}

			return hours * 60 + minutes
		}

		function minutesToTimeStr(totalMinutes) {
			totalMinutes = ((totalMinutes % 1440) + 1440) % 1440

			let hours = Math.floor(totalMinutes / 60)
			const minutes = totalMinutes % 60
			const ampm = hours >= 12 ? 'pm' : 'am'

			hours = hours % 12
			if (hours === 0) hours = 12

			return `${hours}:${minutes.toString().padStart(2, '0')}${ampm}`
		}

		function extractGmtOffset(timezoneStr) {
			const gmtRegex = /\(GMT([+-]\d{2}):(\d{2})\)/
			const match = timezoneStr.match(gmtRegex)

			if (!match) {
				throw new Error(
					'Invalid timezone format. Expected format is (GMT+HH:mm) Region - City'
				)
			}

			const sign = match[1][0] === '+' ? 1 : -1
			const hours = parseInt(match[1].substring(1), 10)
			const minutes = parseInt(match[2], 10)

			return sign * (hours * 60 + minutes)
		}

		const timeInMinutes = timeStrToMinutes(timeStr)

		const fromOffset = extractGmtOffset(fromTimezoneStr)
		const toOffset = extractGmtOffset(toTimezoneStr)

		const timeDifference = toOffset - fromOffset

		const convertedTimeInMinutes = timeInMinutes + timeDifference

		return minutesToTimeStr(convertedTimeInMinutes)
	}

	const handleCellClick = (day, monthIndicator, fromAppointments) => {

		if (monthIndicator === 'current') {
		
			setSelectedHour({
				start: null,
				end: null,
			});
		
			if (!fromAppointments) {
				setSelectedDate({ day, month: currentMonth, year: currentYear });
			} else {
				setSelectedAppointmentsDate({
					day,
					month: currentAppointmentsMonth,
					year: currentAppointmentsYear,
				});
			}
		}
		
		if (calendar === 'week') {
			const newDate = new Date(currentYear, currentMonth, day)
			setCurrentWeekStart(newDate)
		}
		if (calendar === 'settings') {

			const lastVisited = localStorage.getItem('lastCalendarSection') || 'month'
			if (lastVisited === 'week') {
				const newDate = new Date(currentYear, currentMonth, day)
				setCurrentWeekStart(newDate)
			}
			handleCalendar(lastVisited)
		}
		if (calendar === 'calendaly' && !fromAppointments) {

			const lastVisited = localStorage.getItem('lastCalendarSection') || 'month'
			if (lastVisited === 'week') {
				const newDate = new Date(currentYear, currentMonth, day)
				setCurrentWeekStart(newDate)

			}
			handleCalendar(lastVisited)
		}
	}
	const [showToast, setShowToast] = useState(false)
	const [toastMessage, setToastMessage] = useState('Configuración guardada!')

	const handleShowToast = (newToastMessage) => {
		if (newToastMessage) {
			setToastMessage(newToastMessage)
		}
		setShowToast(true)
	}

	const convertTo24HourFormat = (hourString) => {
		const [time, period] = hourString.split(' ')
		let [hours, minutes] = time.split(':').map(Number)
		if (period === 'PM' && hours !== 12) hours += 12
		if (period === 'AM' && hours === 12) hours = 0
		return { hours, minutes }
	}

	const isHourInRange = (hourString, ranges, duration) => {
		const { hours, minutes } = convertTo24HourFormat(hourString)
		const appointmentStartInMinutes = hours * 60 + minutes
		const appointmentEndInMinutes = appointmentStartInMinutes + duration

		return ranges.some(({ start, end }) => {
			const startTime = convertTo24HourFormat(
				`${start.hour}:${start.minute} ${start.period.toUpperCase()}`
			)
			const endTime = convertTo24HourFormat(
				`${end.hour}:${end.minute} ${end.period.toUpperCase()}`
			)

			const startTimeInMinutes = startTime.hours * 60 + startTime.minutes
			const endTimeInMinutes = endTime.hours * 60 + endTime.minutes

			return (
				appointmentStartInMinutes >= startTimeInMinutes &&
				appointmentEndInMinutes <= endTimeInMinutes
			)
		})
	}

	const goToPreviousMonth = () => {
		const { month, year } = getPreviousMonth(currentMonth, currentYear)
		setCurrentMonth(month)
		setCurrentYear(year)
	}

	const goToNextMonth = () => {
		const { month, year } = getNextMonth(currentMonth, currentYear)
		setCurrentMonth(month)
		setCurrentYear(year)
	}

	const goToActualMonth = () => {
		const { month, year } = getNextMonth(
			new Date().getMonth() - 1,
			new Date().getFullYear()
		)
		setCurrentMonth(month)
		setCurrentYear(year)
	}

	const goToPreviousWeek = () => {
		const previousWeek = new Date(currentWeekStart)
		previousWeek.setDate(previousWeek.getDate() - 7)
		setCurrentWeekStart(previousWeek)
	}

	const goToNextWeek = () => {
		const nextWeek = new Date(currentWeekStart)
		nextWeek.setDate(nextWeek.getDate() + 7)
		setCurrentWeekStart(nextWeek)
	}

	const goToActualWeek = () => {
		setCurrentWeekStart(new Date())
	}

	const getCurrentTimeInTimezone = (timezone) => {
		const timezonesMap = {
			'(GMT+00:00) Reino Unido - Londres': 'Europe/London',
			'(GMT+01:00) España - Madrid': 'Europe/Madrid',
			'(GMT+01:00) Francia - París': 'Europe/Paris',
			'(GMT+01:00) Alemania - Berlín': 'Europe/Berlin',
			'(GMT+01:00) Italia - Roma': 'Europe/Rome',
			'(GMT+01:00) Bélgica - Bruselas': 'Europe/Brussels',
			'(GMT+01:00) Suiza - Ginebra': 'Europe/Zurich',
			'(GMT+02:00) Grecia - Atenas': 'Europe/Athens',
			'(GMT+02:00) Sudáfrica - Ciudad del Cabo': 'Africa/Johannesburg',
			'(GMT+02:00) Egipto - El Cairo': 'Africa/Cairo',
			'(GMT+02:00) Turquía - Estambul': 'Europe/Istanbul',
			'(GMT+03:00) Rusia - Moscú': 'Europe/Moscow',
			'(GMT+03:00) Arabia Saudita - Riad': 'Asia/Riyadh',
			'(GMT+03:00) Kenia - Nairobi': 'Africa/Nairobi',
			'(GMT+04:00) Emiratos Árabes Unidos - Dubái': 'Asia/Dubai',
			'(GMT+04:00) Azerbaiyán - Bakú': 'Asia/Baku',
			'(GMT+05:30) India - Nueva Delhi': 'Asia/Kolkata',
			'(GMT+06:00) Bangladesh - Daca': 'Asia/Dhaka',
			'(GMT+07:00) Tailandia - Bangkok': 'Asia/Bangkok',
			'(GMT+07:00) Vietnam - Hanói': 'Asia/Ho_Chi_Minh',
			'(GMT+08:00) China - Pekín': 'Asia/Shanghai',
			'(GMT+08:00) Singapur': 'Asia/Singapore',
			'(GMT+09:00) Japón - Tokio': 'Asia/Tokyo',
			'(GMT+09:30) Australia - Darwin': 'Australia/Darwin',
			'(GMT+10:00) Australia - Sídney': 'Australia/Sydney',
			'(GMT+11:00) Islas Salomón - Honiara': 'Pacific/Guadalcanal',
			'(GMT+12:00) Nueva Zelanda - Auckland': 'Pacific/Auckland',
			'(GMT-01:00) Cabo Verde - Praia': 'Atlantic/Cape_Verde',
			'(GMT-02:00) Brasil - Islas del Atlántico': 'America/Noronha',
			'(GMT-03:00) Argentina - Buenos Aires': 'America/Argentina/Buenos_Aires',
			'(GMT-03:00) Brasil - São Paulo': 'America/Sao_Paulo',
			'(GMT-03:00) Uruguay - Montevideo': 'America/Montevideo',
			'(GMT-03:00) Chile - Santiago': 'America/Santiago',
			'(GMT-04:00) Venezuela - Caracas': 'America/Caracas',
			'(GMT-04:00) Paraguay - Asunción': 'America/Asuncion',
			'(GMT-04:00) Bolivia - La Paz': 'America/La_Paz',
			'(GMT-04:00) República Dominicana - Santo Domingo':
				'America/Santo_Domingo',
			'(GMT-05:00) Perú - Lima': 'America/Lima',
			'(GMT-05:00) Colombia - Bogotá': 'America/Bogota',
			'(GMT-05:00) Ecuador - Quito': 'America/Guayaquil',
			'(GMT-05:00) México - Ciudad de México': 'America/Mexico_City',
			'(GMT-05:00) Estados Unidos - Nueva York (EST)': 'America/New_York',
			'(GMT-06:00) México - Cancún': 'America/Cancun',
			'(GMT-06:00) Costa Rica - San José': 'America/Costa_Rica',
			'(GMT-06:00) El Salvador - San Salvador': 'America/El_Salvador',
			'(GMT-07:00) Estados Unidos - Denver (MST)': 'America/Denver',
			'(GMT-08:00) Estados Unidos - Los Ángeles (PST)': 'America/Los_Angeles',
			'(GMT-09:00) Estados Unidos - Alaska (AKST)': 'America/Anchorage',
			'(GMT-10:00) Hawái - Honolulu': 'Pacific/Honolulu',
			'(GMT-12:00) Islas Baker y Howland - Pacífico': 'Pacific/Midway',
		}

		const tz = timezonesMap[timezone]
		if (!tz) {
			return 'Invalid timezone'
		}

		const now = new Date()
		const options = {
			timeZone: tz,
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		}

		const formatter = new Intl.DateTimeFormat('en-US', options)

		const formattedTime = formatter.format(now)
		const [time, period] = formattedTime.split(' ')

		return `${time} ${period.toUpperCase()}`
	}

	const calculateEventTimes = (events) => {
		const currentDate = new Date()
		const currentDay = currentDate.getDate()
		const currentMonth = currentDate.getMonth() + 1 
		const currentYear = currentDate.getFullYear()
		const currentTime = currentDate.getTime()

		let passedTime = 0
		let remainingTime = 0

		const calculateEventDuration = (hour) => {
			const [startTime, endTime] = hour.split(' - ')
			const start = new Date(`1970-01-01T${convertTo24Hour(startTime)}:00`)
			const end = new Date(`1970-01-01T${convertTo24Hour(endTime)}:00`)
			return (end - start) / (1000 * 60)
		}

		const convertTo24Hour = (time12h) => {
			const [time, modifier] = time12h.split(/(AM|PM)/i)
			let [hours, minutes] = time.trim().split(':')

			if (hours === '12') {
				hours = '00'
			}
			if (modifier.toUpperCase() === 'PM' && hours !== '12') {
				hours = (parseInt(hours, 10) + 12).toString()
			}
			return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
		}

		events.forEach((event) => {
			const [day, month, year] = event?.date?.split('/').map(Number)

			if (month === currentMonth && year === currentYear) {
				const eventDay = day
				const eventDuration = calculateEventDuration(event.hour)

				if (eventDay < currentDay) {
					passedTime += eventDuration
				} else if (eventDay === currentDay) {
					const [startTime] = event.hour.split(' - ')
					const eventStart = new Date(
						`1970-01-01T${convertTo24Hour(startTime)}:00`
					).getTime()

					if (eventStart < currentTime) {
						passedTime += eventDuration
					} else {
						remainingTime += eventDuration
					}
				} else {
					remainingTime += eventDuration
				}
			}
		})

		return { passedTime, remainingTime }
	}

	const handleEvent = () => {
		dispatch(
			setModal({
				component: <Event />,
				option: { close: false },
			})
		)
	}

	const [selectedOption, setSelectedOption] = useState('Evento')

	const handleSendInvitationEmail = ({
		month,
		dayNumber,
		day,
		senderName,
		reminderHour,
		receiverName,
		receiverEmail,
		eventName,
		location,
		completeDate,
		joinId,
		timezone,
		shareId,
		hour,
		description,
		senderEmail,
		participants,
	}) => {
		const emailData = {
			month,
			dayNumber,
			day,
			senderName,
			subject: `Invitation to ${eventName}`,
			from: senderName,
			receiverName,
			location,
			completeDate,
			cancelEventLink: `http://localhost:3000/admin/calendar/cancelEvent/${joinId}`,
			rescheduleEventLink: `http://localhost:3000/admin/calendar/rescheduleEvent/${joinId}`,
			acceptEventLink: `http://localhost:3000/admin/calendar/acceptEvent/${joinId}`,
			watchCalendarLink: `http://localhost:3000/admin/calendar/watchCalendar/${shareId}`,
			hour,
			hourMinus30: reminderHour,
			participants,
			timezone,
			description,
			eventName,
			senderEmail,
			receiverEmail,
		}
		dispatch(
			sendInvitationEmail({ email: emailData.receiverEmail, data: emailData })
		)
	}
	const [currentTimelineDate, setCurrentTimelineDate] = useState(new Date())
	const goToNextTimelineMonth = () => {
		const nextMonth = new Date(
			currentTimelineDate.setMonth(currentTimelineDate.getMonth() + 1)
		)
		setCurrentTimelineDate(new Date(nextMonth))
	}

	const goToPreviousTimelineMonth = () => {
		const prevMonth = new Date(
			currentTimelineDate.setMonth(currentTimelineDate.getMonth() - 1)
		)
		setCurrentTimelineDate(new Date(prevMonth))
	}

	const addMinutesToTime = (timeString, minutesToAdd) => {
		const [time, period] = timeString.split(' ')
		let [hour, minute] = time.split(':').map(Number)

		if (period.toLowerCase() === 'pm' && hour !== 12) {
			hour += 12
		}
		if (period.toLowerCase() === 'am' && hour === 12) {
			hour = 0
		}

		const date = new Date(2023, 1, 1, hour, minute)
		date.setMinutes(date.getMinutes() + minutesToAdd)

		const newHour = date.getHours()
		const newMinute = date.getMinutes().toString().padStart(2, '0')
		const newPeriod = newHour >= 12 ? 'PM' : 'AM'
		const displayHour = newHour % 12 === 0 ? 12 : newHour % 12

		return `${displayHour}:${newMinute} ${newPeriod}`
	}

	const [dayRangeStart, setDayRangeStart] = useState(
		currentTimelineDate.getDate()
	)

	const goToNextDayRange = () => {
		const newStart = dayRangeStart + daysPerPage
		if (newStart <= daysInMonth) {
			setDayRangeStart(newStart)
		} else {
			goToNextTimelineMonth()
			setDayRangeStart(1)
		}
	}

	const goToPreviousDayRange = () => {
		const newStart = dayRangeStart - daysPerPage
		if (newStart > 0) {
			setDayRangeStart(newStart)
		} else {
			goToPreviousTimelineMonth()
			setDayRangeStart(daysInMonth - daysPerPage + 1)
		}
	}

	const daysPerPage = 6
	const daysInMonth = new Date(
		currentTimelineDate.getFullYear(),
		currentTimelineDate.getMonth() + 1,
		0
	).getDate()

	const handleAddParticipantToCalendar = (userData) => {
		const { id, user } = userData
		let finalUserData = { id, user, permissions: 'read' }
		if (selectedCalendar) {
			const actualParticipants = [...selectedCalendarData.participants]
			if (actualParticipants.some((p) => p.id === finalUserData.id)) {
				dispatch(
					updateCalendar({
						userId: user.id,
						calendarId: selectedCalendar,
						toUpdate: {
							participants: actualParticipants.filter(
								(par) => par.id !== finalUserData.id
							),
						},
					})
				)
			} else {
				dispatch(
					updateCalendar({
						userId: user.id,
						calendarId: selectedCalendar,
						toUpdate: {
							participants: [...actualParticipants, finalUserData],
						},
					})
				)
			}
		}
	}

	return (
		<CalendarContext.Provider
			value={{
				handleAddParticipantToCalendar,
				daysInMonth,
				daysPerPage,
				goToPreviousDayRange,
				goToNextDayRange,
				dayRangeStart,
				setDayRangeStart,
				addMinutesToTime,
				handleSendInvitationEmail,
				handleEvent,
				selectedOption,
				currentTimelineDate,
				setCurrentTimelineDate,
				setSelectedOption,
				currentMonthEventsTimes,
				setCurrentMonthEventsTimes,
				calculateEventTimes,
				currentWeekStart,
				getCurrentTimeInTimezone,
				setCurrentWeekStart,
				goToPreviousWeek,
				handlePreviousAppointmentsMonth,
				handleNextAppointmentsMonth,
				goToNextWeek,
				goToPreviousTimelineMonth,
				goToNextTimelineMonth,
				goToPreviousMonth,
				goToNextMonth,
				calendar,
				showToast,
				convertTo24HourFormat,
				isHourInRange,
				setShowToast,
				toastMessage,
				setToastMessage,
				setCalendar,
				handleCalendar,
				handleShowToast,
				isTodayInWeekRange,
				currentMonth,
				currentAppointmentsYear,
				generateGradient,
				setCurrentAppointmentsYear,
				currentAppointmentsMonth,
				setCurrentAppointmentsMonth,
				goToActualWeek,
				currentYear,
				convertTimeRangeTo24Hour,
				getReminderHour,
				getDateData,
				actualWeek,
				eventToEdit,
				setEventToEdit,
				handleCellClick,
				generateInvitationId,
				getWeekFromToday,
				searchPeopleRef,
				setCurrentMonth,
				setCurrentYear,
				selectedDate,
				setSelectedDate,
				handlePreviousMonth,
				handleNextMonth,
				formatDateEs,
				formattedMonth,
				generateMonthDays,
				setTodayAsSelectedDate,
				setNextDayAsSelectedDate,
				setPreviousDayAsSelectedDate,
				formattedDesktopMonth,
				getWeekRange,
				formattedAppointmentsMonth,
				showEventCreationPopUp,
				goToActualMonth,
				setShowEventCreationPopUp,
				groupEventsByDate,
				convertTo24Hour,
				formatSelectedDate,
				selectedHour,
				setSelectedHour,
				getRandomColor,
				selectedInterval,
				handleDeleteEvent,
				hourFormat,
				setHourFormat,
				setSelectedInterval,
				showEventOptionsPopUp,
				currentDesktopMonth,
				setCurrentDesktopMonth,
				handlePreviousDesktopMonth,
				handleNextDesktopMonth,
				currentDesktopYear,
				setCurrentDesktopYear,
				setShowEventOptionsPopUp,
				getEventFinishHour,
				getDayName,
				getMonthName,
				selectedAppointmentsDate,
				setSelectedAppointmentsDate,
				showPeoplePopUp,
				setShowPeoplePopUp,
				searchPeople,
				setSearchPeople,
				isTimeInRange,
				convertTimeToTimezone,
			}}
		>
			{children}
		</CalendarContext.Provider>
	)
}
