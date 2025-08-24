import React from 'react'
import { useDrag } from 'react-dnd'
import styles from './SingleEventCard.module.css'
import EventOptionsPopUp from './EventOptionsPopUp'

const DraggableEvent = ({
	event,
	hourFormat,
	convertTimeRangeTo24Hour,
	setShowEventOptionsPopUp,
	showEventOptionsPopUp,
	onDropOutside, 
}) => {
	const [{ isDragging }, dragRef] = useDrag({
		type: 'event',
		item: { event },
		end: (item, monitor) => {
			const didDrop = monitor.didDrop()
			if (!didDrop) {
				onDropOutside && onDropOutside(item.event)
			}
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	})

	return (
		<div
			ref={dragRef}
			onClick={(e) => {
				e.stopPropagation()
				setShowEventOptionsPopUp(event.id)
			}}
			className={styles.itemContainer}
			style={{
				opacity: isDragging ? 0.5 : 1,
				cursor: 'move',
			}}
		>
			<div className={styles.timeContainer}>
				<div className={styles.dot} />
				<div className={styles.hour}>
					{hourFormat === '1:00pm'
						? event.hour
						: convertTimeRangeTo24Hour(event.hour)}
				</div>
			</div>

			<div className={styles.eventDetails}>
				<div className={styles.title}>{event.title}</div>
				<div className={styles.description}>{event.description}</div>
			</div>
			{showEventOptionsPopUp && showEventOptionsPopUp === event.id && (
				<div className={styles.eventPopup}>
					<EventOptionsPopUp event={event} />
				</div>
			)}
		</div>
	)
}

export default DraggableEvent
