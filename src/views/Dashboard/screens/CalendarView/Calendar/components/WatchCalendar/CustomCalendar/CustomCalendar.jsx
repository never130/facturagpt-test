import React, { useContext, useEffect } from 'react'
import styles from './CustomCalendar.module.css'
import { useDispatch } from 'react-redux'
import { CalendarContext } from '../../../../CalendarContext'
import { generateDayHours, generateWeekDays } from '../../../utils'

const CustomCalendar = ({
	selectedDate,
	selectedCalendarData,
	selectedCalendarEvents,
}) => {
	const { isHourInRange } = useContext(CalendarContext)
	const dispatch = useDispatch()
	const { day, month, year } = selectedDate
	const currentDate = new Date(year, month, day)
	const startDate = currentDate
	const daysOfWeek = generateWeekDays(startDate)
	const duration = selectedCalendarData.eventsDuration || 30
	const hoursOfDay = generateDayHours(6, 22, duration)

	const settings = selectedCalendarData.workingHoursSettings



	const isHourOccupied = (day, hour) => {
		const dayDate = new Date(year, month, parseInt(day.split(' ')[1]))
		const formattedDay = `${dayDate.getDate().toString().padStart(2, '0')}/${(dayDate.getMonth() + 1).toString().padStart(2, '0')}/${dayDate.getFullYear()}`

		return selectedCalendarEvents?.some((event) => {
			if (event.date === formattedDay) {
				const [eventStart, eventEnd] = event.hour
					.split(' - ')
					.map((h) => convertTo24Hour(h.trim()))

				const currentHour = convertTo24Hour(hour)
				const eventStartTime = new Date(`1970-01-01T${eventStart}:00`)
				const eventEndTime = new Date(`1970-01-01T${eventEnd}:00`)

				const currentHourTime = new Date(`1970-01-01T${currentHour}:00`)
				return (
					currentHourTime >= eventStartTime && currentHourTime < eventEndTime
				)
			}
			return false
		})
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

	const isHourDisabled = (day, hour, duration, dayNumber) => {
		const dayMapping = {
			DOM: 'Domingo',
			LUN: 'Lunes',
			MAR: 'Martes',
			MIÉ: 'Miércoles',
			JUE: 'Jueves',
			VIE: 'Viernes',
			SAB: 'Sábado',
		}

		const mappedDay = dayMapping[day]
		if (!settings[mappedDay]) {
			return true
		}

		const occupied = isHourOccupied(dayNumber, hour)

		return (
			!isHourInRange(
				hour,
				settings[mappedDay].hoursRanges,
				parseInt(duration)
			) && !occupied
		)
	}



	return (
		<div className={styles.calendarSchedule}>
			<div className={styles.days}>
				{daysOfWeek.map((day, dayIndex) => {
					const dayName = day.split(' ')[0]
					return (
						<div key={day} className={styles.dayColumn}>
							<div className={styles.dayHeader}>{day}</div>
							{hoursOfDay.map((hour, hourIndex) => {
								const occupied = isHourOccupied(day, hour)
								const disabled = isHourDisabled(dayName, hour, duration, day)

								const className = occupied
									? styles.occupiedHour
									: disabled
										? styles.disabledHour
										: styles.hour

								return (
									<div
										key={hour}
										className={className}
										onClick={
											!disabled && !occupied
												? () => handleClickCell(hour, day)
												: null
										}
									>
										{hour}
									</div>
								)
							})}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default CustomCalendar
