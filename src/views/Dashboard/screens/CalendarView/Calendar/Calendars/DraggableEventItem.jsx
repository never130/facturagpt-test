import React, { useContext, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import styles from '../index.module.css'
import EventOptionsPopUp from '../components/EventOptionsPopUp'
import FixedContextMenu from '../components/FixedContextMenu'
import { CalendarContext } from '../../CalendarContext'
import { setModal } from '@src/slices/calendarSlices'
import EventEditPopup from '../components/EventEditPopup'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

const DraggableEventItem = ({
	fromSchedule,
	event,
	setShowEventOptionsPopUp,
	showEventOptionsPopUp,
	hourFormat,
	convertTimeRangeTo24Hour,
}) => {
	const dispatch = useDispatch()
	const { setEventToEdit, setSelectedHour, setSelectedDate } =
		useContext(CalendarContext)

	const [{ isDragging }, dragRef] = useDrag({
		type: 'event',
		item: { event },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const [showEventOptions, setShowEventOptions] = useState(false)
	const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
	const eventCardRef = useRef(null)
	const handleEventRightClick = (e) => {
		e.stopPropagation()
		e.preventDefault()
		setShowEventOptions(true)
	}
	useEffect(() => {
		if (showEventOptionsPopUp === event.id && eventCardRef.current) {
			const rect = eventCardRef.current.getBoundingClientRect()
			setPopupPosition({
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX,
			})
		}
	}, [showEventOptionsPopUp, event.id])

	return (
		<li
			onContextMenu={handleEventRightClick}
			ref={dragRef}
			className={styles.monthDayLi}
			style={{
				opacity: isDragging ? 0.5 : 1,
				cursor: 'move',
			}}
			onClick={(ev) => {
				ev.stopPropagation()
				setShowEventOptionsPopUp(event.id)
			}}
		>
			<div style={{ position: 'relative' }} ref={eventCardRef}>
				{showEventOptions && (
					<FixedContextMenu
						onClose={() => setShowEventOptions(false)}
						parentRef={eventCardRef}
						handleEdit={() => {
							setEventToEdit(event)
							const [start, end] = event.hour.split(' - ')

							const hourStart =
								start.slice(0, -2) + ' ' + start.slice(-2).toUpperCase()
							const hourEnd =
								end.slice(0, -2) + ' ' + end.slice(-2).toUpperCase()
							setSelectedHour({ start: hourStart, end: hourEnd })
							setSelectedDate({
								day: parseInt(event.date.split('/')[0]),
								month: parseInt(event.date.split('/')[1] - 1),
								year: parseInt(event.date.split('/')[2]),
							})
							dispatch(setModal(<EventEditPopup />))
						}}
						onEvent={true}
						eventData={event}
					/>
				)}
			</div>

			<div className={styles.date}>
				<div
					className={styles.dot}
					style={{
						background:
							event.invited && event.response !== 'denied'
								? 'linear-gradient(90deg, #ff7e5f, #feb47b, #ffcc33, #6a82fb, #fc5c7d)'
								: event.invited && event.response === 'denied'
									? '#000'
									: event.eventColor ||
										event.calendarColor ||
										event.dotColor ||
										'#0ff',
					}}
				/>
				<span>{`${
					hourFormat === '1:00pm'
						? event.hour
						: convertTimeRangeTo24Hour(event.hour)
				} ${event.title}`}</span>
			</div>
			{showEventOptionsPopUp && showEventOptionsPopUp === event.id && (
				<EventOptionsPopUp
					event={event}
					parentRef={eventCardRef}
					position={popupPosition}
				/>
			)}
		</li>
	)
}

export default DraggableEventItem
