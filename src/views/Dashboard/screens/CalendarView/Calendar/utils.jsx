export const calculateTimeUntil = () => {

}

export const calculateTimeAgo = () => {
	
}

export const gmts = [
	{
		title: '(GMT-12:00) Línea de cambio de fecha internacional - Oeste',
		value: -12,
	},
	{ title: '(GMT-11:00) Hora de Samoa - Pago Pago', value: -11 },
	{
		title: '(GMT-10:00) Hora estándar de Hawái-Aleutianas - Honolulu',
		value: -10,
	},
	{ title: '(GMT-09:00) Hora estándar de Alaska - Anchorage', value: -9 },
	{ title: '(GMT-08:00) Hora estándar del Pacífico - Los Ángeles', value: -8 },
	{ title: '(GMT-07:00) Hora estándar de la montaña - Denver', value: -7 },
	{
		title: '(GMT-06:00) Hora estándar del centro - Ciudad de México',
		value: -6,
	},
	{ title: '(GMT-05:00) Hora estándar del Este - Nueva York', value: -5 },
	{ title: '(GMT-04:00) Hora estándar del Atlántico - Caracas', value: -4 },
	{ title: "(GMT-03:30) Hora estándar de Terranova - St. John's", value: -3.5 },
	{ title: '(GMT-03:00) Hora de Argentina - Buenos Aires', value: -3 },
	{
		title:
			'(GMT-02:00) Hora de Georgia del Sur y las Islas Sandwich del Sur - Islas Georgias del Sur',
		value: -2,
	},
	{ title: '(GMT-01:00) Hora de Azores - Azores', value: -1 },
	{ title: '(GMT+00:00) Hora del meridiano de Greenwich - Londres', value: 0 },
	{ title: '(GMT+01:00) Hora de Europa Central - Madrid', value: 1 },
	{ title: '(GMT+02:00) Hora de Europa Oriental - Atenas', value: 2 },
	{ title: '(GMT+03:00) Hora de Moscú - Moscú', value: 3 },
	{ title: '(GMT+03:30) Hora estándar de Irán - Teherán', value: 3.5 },
	{ title: '(GMT+04:00) Hora de Azerbaiyán - Bakú', value: 4 },
	{ title: '(GMT+04:30) Hora de Afganistán - Kabul', value: 4.5 },
	{ title: '(GMT+05:00) Hora de Pakistán - Islamabad', value: 5 },
	{ title: '(GMT+05:30) Hora de la India - Nueva Delhi', value: 5.5 },
	{ title: '(GMT+05:45) Hora de Nepal - Katmandú', value: 5.75 },
	{ title: '(GMT+06:00) Hora de Bangladés - Dhaka', value: 6 },
	{ title: '(GMT+06:30) Hora de Birmania - Rangún', value: 6.5 },
	{ title: '(GMT+07:00) Hora de Tailandia - Bangkok', value: 7 },
	{ title: '(GMT+08:00) Hora de China - Pekín', value: 8 },
	{ title: '(GMT+09:00) Hora estándar de Japón - Tokio', value: 9 },
	{
		title: '(GMT+09:30) Hora estándar del centro de Australia - Adelaida',
		value: 9.5,
	},
	{
		title: '(GMT+10:00) Hora estándar del este de Australia - Sídney',
		value: 10,
	},
	{ title: '(GMT+11:00) Hora de Magadán - Magadán', value: 11 },
	{ title: '(GMT+12:00) Hora de Fiyi - Suva', value: 12 },
	{ title: '(GMT+13:00) Hora de Tonga - Nukualofa', value: 13 },
	{
		title: '(GMT+14:00) Hora de las Islas de la Línea - Kiritimati',
		value: 14,
	},
]

export const getCurrentDay = (date) => {
	const splittedDate = date ? date.split('/') : null
	const current = date
		? new Date(`${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`)
		: new Date()
	return current.toDateString().substring(0, 10)
}

export const generateWeekDays = (startDate) => {
	const daysOfWeek = []
	const current = new Date(startDate)

	const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sab']

	for (let i = 0; i < 7; i++) {
		const dayIndex = current.getDay()

		const dayOfMonth = current.getDate()

		daysOfWeek.push(`${dayNames[dayIndex].toUpperCase()} ${dayOfMonth}`)

		current.setDate(current.getDate() + 1)
	}

	return daysOfWeek
}

export const generateNumberOfDaysFromDate = (startDate, numberOfDays) => {
	const daysOfWeek = []
	const current = new Date(startDate)

	const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sab']

	for (let i = 0; i < numberOfDays; i++) {
		const dayIndex = current.getDay()

		const dayOfMonth = current.getDate()

		daysOfWeek.push(`${dayNames[dayIndex].toUpperCase()} ${dayOfMonth}`)

		current.setDate(current.getDate() + 1)
	}

	return daysOfWeek
}


export const generateDayHours = (startHour, endHour, timeIntervals) => {
	const hours = []
	const interval = parseInt(timeIntervals)
	let currentHour = startHour
	let currentMinutes = 0

	const isFullDay = endHour === 'fullDay'

	const totalHours = isFullDay ? 24 : (endHour - startHour + 24) % 24

	let totalMinutes = totalHours * 60

	while (totalMinutes > 0) {
		const period = currentHour < 12 || currentHour === 24 ? 'AM' : 'PM'
		const displayHour = currentHour % 12 === 0 ? 12 : currentHour % 12

		hours.push(
			`${displayHour}:${currentMinutes === 0 ? '00' : currentMinutes.toString().padStart(2, '0')} ${period}`
		)

		currentMinutes += interval
		if (currentMinutes >= 60) {
			currentHour = (currentHour + Math.floor(currentMinutes / 60)) % 24
			currentMinutes %= 60
		}

		totalMinutes -= interval
	}

	return hours
}


export const generateMonthDays = () => {
	const today = new Date()
	const year = today.getFullYear()
	const month = today.getMonth()

	const firstDayOfMonth = new Date(year, month, 1)
	const lastDayOfMonth = new Date(year, month + 1, 0)

	const firstDayIndex = firstDayOfMonth.getDay()
	const lastDayIndex = lastDayOfMonth.getDay()

	const daysInMonth = lastDayOfMonth.getDate()

	const daysInPreviousMonth = new Date(year, month, 0).getDate()

	const daysArray = []

	for (let i = firstDayIndex; i > 0; i--) {
		daysArray.push(daysInPreviousMonth - i + 1)
	}

	for (let i = 1; i <= daysInMonth; i++) {
		daysArray.push(i)
	}

	for (let i = 1; i < 7 - lastDayIndex; i++) {
		daysArray.push(i)
	}

	const weeks = []
	while (daysArray.length) {
		weeks.push(daysArray.splice(0, 7))
	}

	return weeks
}

export const daysOfWeek = [
	'Domingo',
	'Lunes',
	'Martes',
	'Miércoles',
	'Jueves',
	'Viernes',
	'Sábado',
]

export const isEventActiveDuringHour = (event, hour) => {
	if (event.allDayEvent) return true

	const [startHour, startMinutes] = event.startAt.split(/:| /)
	const [endHour, endMinutes] = event.endAt.split(/:| /)

	const startPeriod = event.startAt.includes('AM') ? 'AM' : 'PM'
	const endPeriod = event.endAt.includes('AM') ? 'AM' : 'PM'

	const startHour24 =
		(parseInt(startHour) % 12) + (startPeriod === 'PM' ? 12 : 0)
	const endHour24 = (parseInt(endHour) % 12) + (endPeriod === 'PM' ? 12 : 0)

	const eventStartTime = startHour24 + parseInt(startMinutes) / 60
	const eventEndTime = endHour24 + parseInt(endMinutes) / 60

	const currentHour =
		parseInt(hour.split(':')[0]) +
		(hour.includes('PM') && !hour.startsWith('12') ? 12 : 0)

	return currentHour >= eventStartTime && currentHour < eventEndTime
}

export const events = [
	{
		date: '2024-07-12',
		time: '09:00 AM',
		event: {
			title: 'Meeting with Team',
			startAt: '09:00 AM',
			endAt: '10:00 AM',
			allDayEvent: false,
			repeat: 'weekly',
			description: 'Weekly sync-up meeting with the team.',
		},
	},
	{
		date: '2024-07-12',
		time: '01:00 PM',
		event: {
			title: 'Lunch with Client',
			startAt: '01:00 PM',
			endAt: '02:00 PM',
			allDayEvent: false,
			repeat: 'never',
			description: 'Lunch meeting with the client to discuss the new project.',
		},
	},
	{
		date: '2024-07-13',
		time: 'All Day',
		event: {
			title: 'Company Retreat',
			startAt: 'All Day',
			endAt: 'All Day',
			allDayEvent: true,
			repeat: 'yearly',
			description: 'Annual company retreat.',
		},
	},
]

export const colors = [
	{
		name: 'Azul Petróleo',
		value: '#006064',
	},
	{
		name: 'Marrón Rojizo',
		value: '#8B4513',
	},
	{
		name: 'Oliva Oscuro',
		value: '#556B2F',
	},
	{
		name: 'Beige Crema',
		value: '#EDE6DB',
	},
	{
		name: 'Gris Acero',
		value: '#708090',
	},
	{
		name: 'Rosa suave',
		value: '#D3A3A3',
	},
	{
		name: 'Azul Teal',
		value: '#014F86',
	},
	{
		name: 'Verde Bosque',
		value: '#228B22',
	},
	{
		name: 'Cobre',
		value: '#B87333',
	},
	{
		name: 'Durazno Tenue',
		value: '#E3B8A6',
	},
	{
		name: 'Verde Musgo Claro',
		value: '#6B8E23',
	},
	{
		name: 'Piedra',
		value: '#7D7F7D',
	},
	{
		name: 'Rosa Oscuro',
		value: '#CC8899',
	},
	{
		name: 'Pizarra Claro',
		value: '#8A9A5B',
	},
]

export const monthsEs = [
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

export const transformEventHourToSelectedFormat = (timeRange) => {
	const [start, end] = timeRange.split(' - ')

	const formatTime = (time) => time.replace(/([ap]m)/i, ' $1').toUpperCase()

	return {
		start: formatTime(start),
		end: formatTime(end),
	}
}

export const generateRandomId = () => {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

	function getRandomSegment(length) {
		let segment = ''
		for (let i = 0; i < length; i++) {
			segment += chars[Math.floor(Math.random() * chars.length)]
		}
		return segment
	}

	const segment1 = getRandomSegment(3)
	const segment2 = getRandomSegment(4)
	const segment3 = getRandomSegment(3)

	return `${segment1}-${segment2}-${segment3}`
}

export const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatDate = (dateString) => {
	const date = new Date(dateString)

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	return `${day}/${month}/${year}`
}

export const getAdjacentDay = (dateStr, direction) => {
	const [day, month, year] = dateStr.split('/').map(Number)

	const date = new Date(year, month - 1, day)

	if (direction === 'prev') {
		date.setDate(date.getDate() - 1)
	} else if (direction === 'next') {
		date.setDate(date.getDate() + 1)
	} else {
		throw new Error('Invalid direction. Expected "prev" or "next".')
	}

	const newDay = String(date.getDate()).padStart(2, '0')
	const newMonth = String(date.getMonth() + 1).padStart(2, '0')
	const newYear = date.getFullYear()

	return `${newDay}/${newMonth}/${newYear}`
}
