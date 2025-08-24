import React, { useContext, useMemo } from 'react'
import styles from './SingleEventCard.module.css'
import { CalendarContext } from '../../CalendarContext'
import { useDispatch, useSelector } from 'react-redux'
import { setModal } from '@src/slices/calendarSlices'
import EventCreationPopUp from './EventCreationPopUp'
import DraggableEvent from './DraggableEvent'

const SingleEventCard = ({ date, events, last, onEventDropOutside }) => {
	const dispatch = useDispatch()
	const { selectedCalendarData } = useSelector((state) => state.calendar)
	const {
		formatDateEs,
		setSelectedDate,
		setSelectedHour,
		addMinutesToTime,
		handleCellClick,
		hourFormat,
		showEventOptionsPopUp,
		setShowEventOptionsPopUp,
		convertTimeRangeTo24Hour,
	} = useContext(CalendarContext)
	const actualDate = useMemo(() => formatDateEs(date), [date])
	const eventDuration = selectedCalendarData.eventsDuration

	return (
		<div
			onClick={() => {
				const day = actualDate.day
				const month = monthsEs.findIndex((m) => m === actualDate.month)
				const year = parseInt(date.split('/')[2])
				setSelectedDate({ day, month, year })
				setSelectedHour({
					start: '7:00 AM',
					end: addMinutesToTime('7:00 AM', eventDuration),
				})
				dispatch(setModal(<EventCreationPopUp />))
			}}
			className={
				last
					? styles.lastSingleEventCardContainer
					: styles.singleEventCardContainer
			}
		>
			<div className={styles.dateContainer}>
				<div
					onClick={(e) => {
						e.stopPropagation()
						handleCellClick(parseInt(actualDate.day), 'current')
					}}
					className={styles.day}
				>
					{actualDate.day}
				</div>
				<div className={styles.monthDayName}>
					{`${actualDate.month}, ${actualDate.dayName}`}
				</div>
			</div>
			<div className={styles.eventsContainer}>
				{events.map((event) => (
					<DraggableEvent
						fromSchedule={true}
						key={event.id}
						event={event}
						hourFormat={hourFormat}
						convertTimeRangeTo24Hour={convertTimeRangeTo24Hour}
						setShowEventOptionsPopUp={setShowEventOptionsPopUp}
						showEventOptionsPopUp={showEventOptionsPopUp}
						onDropOutside={onEventDropOutside} 
					/>
				))}
			</div>
		</div>
	)
}

export default SingleEventCard
