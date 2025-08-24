import React, { useContext } from 'react'
import styles from '../CalendarsStyles.module.css'
import { CalendarContext } from '../../../../CalendarContext'
import SingleEventCard from '../../SingleEventCard'

const CustomScheduleCalendar = ({ selectedCalendarEvents }) => {
	const { groupEventsByDate } = useContext(CalendarContext)

	return (
		<div className={styles.scheduleWrapper}>
			<div className={styles.scheduleEventsContainer}>
				{Object.keys(groupEventsByDate(selectedCalendarEvents)).map(
					(date, index) => (
						<SingleEventCard
							last={
								index ===
								Object.keys(groupEventsByDate(selectedCalendarEvents)).length -
									1
							}
							key={index}
							date={date}
							events={groupEventsByDate(selectedCalendarEvents)[date]}
						/>
					)
				)}
			</div>
		</div>
	)
}

export default CustomScheduleCalendar
