import React, { useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import styles from '../index.module.css'
import EventOptionsPopUp from '../components/EventOptionsPopUp'
import MonthPopUp from '../components/MonthPopUp'
import EventCreationPopUp from '../components/EventCreationPopUp'
import { setModal } from '@src/slices/calendarSlices'
import { updateEvent } from '@src/actions/calendar'
import DraggableEventItem from './DraggableEventItem'
import { formatDate } from '../utils'
import { MdOutlineTaskAlt } from 'react-icons/md'
import FixedContextMenu from '../components/FixedContextMenu.jsx'

const DroppableCell = ({
	date,
	hasEvent,
	fromPreview,
	previewSettings,
	selectedDate,
	setSelectedDate,
	setSelectedHour,
	addMinutesToTime,
	dispatch,
	showPopUp,
	setShowPopUp,
	hourFormat,
	convertTimeRangeTo24Hour,
	setShowEventOptionsPopUp,
	showEventOptionsPopUp,
	hasTasks,
	handleEvent
}) => {
	const [{}, dropRef] = useDrop({
		accept: 'event',
		drop: (item) => {
			const updatedEventData = {
				...item.event,
				date,
			}
			dispatch(
				updateEvent({ eventId: item.event.id, eventData: updatedEventData })
			)
		},
	})

	const [showDayOptions, setShowDayOptions] = useState(false)
	const dayCardRef = useRef(null)

	const handleRightClick = (e) => {
		e.preventDefault()
		setShowDayOptions(true)
	}

	return (
		<td
			ref={dropRef}
			style={{
				border: !fromPreview
					? `1px solid var(--border-color)`
					: fromPreview && previewSettings.border
						? `1px solid var(--border-color)`
						: fromPreview && !previewSettings.border
							? 'none'
							: '',
			}}
			className={styles.monthTd}
			onClick={() => {
				const day = parseInt(date.split('/')[0])
				const month = parseInt(date.split('/')[1])
				const year = parseInt(date.split('/')[2])
				setSelectedDate({
					day,
					month,
					year,
				})
				setSelectedHour({
					start: '7:00 AM',
					end: addMinutesToTime('7:00 AM', 30),
				})
				setTimeout(() => {
			handleEvent()
		}, 200)
		
			}}
		>
			<div
				ref={dayCardRef}
				onContextMenu={handleRightClick}
				className={styles.day}
			>
				{showDayOptions && (
					<FixedContextMenu
						onClose={() => setShowDayOptions(false)}
						parentRef={dayCardRef}
						onDay={true}
						eventsOnDate={hasEvent}
						handleAddNewEvent={() => {
							const day = parseInt(date.split('/')[0])
							const month = parseInt(date.split('/')[1])
							const year = parseInt(date.split('/')[2])
							setSelectedDate({
								day,
								month,
								year,
							})
							setSelectedHour({
								start: '7:00 AM',
								end: addMinutesToTime('7:00 AM', 30),
							})
							dispatch(setModal(<EventCreationPopUp fromMonth={true} />))
						}}
					/>
				)}
				{showPopUp === date && (
					<MonthPopUp
						day={date}
						onClose={() => setShowPopUp(false)}
						date={date}
						events={hasEvent}
					/>
				)}
				<b
					className={
						date ===
						`${selectedDate.day}/${selectedDate.month + 1}/${selectedDate.year}`
							? styles.selectedMonthDayContainer
							: styles.monthDayContainer
					}
				>
					{parseInt(date.split('/')[0])}
				</b>
				{hasTasks?.length > 0 && (
					<ul className={styles.eventListContainer}>
						{hasTasks.map((task, i) => {
							const taskTitle =
								task.title.length > 0
									? task.title
									: `Tarea-${formatDate(task.date)}`
							const taskDescription = task.description || ''

							return (
								<li
									key={i}
									className={styles.monthDayLi}
									onClick={(ev) => {
										ev.stopPropagation()
										setShowEventOptionsPopUp(task.id)
									}}
								>
									<div className={styles.date}>
										<MdOutlineTaskAlt
											style={{ marginLeft: '-2px', marginRight: '-2px' }}
											size={14}
											color={`var(--color-primary-1)`}
										/>
										<span>{taskTitle}</span>
									</div>
									{showEventOptionsPopUp &&
										showEventOptionsPopUp === task.id && (
											<div className={styles.eventPopup}>
												<EventOptionsPopUp
													task={task}
													taskTitle={taskTitle}
													isTask={true}
												/>
											</div>
										)}
								</li>
							)
						})}
					</ul>
				)}
				{hasEvent?.length > 0 && (
					<ul className={styles.eventListContainer}>
						{hasEvent.slice(0, 4).map((e, index) => (
							<DraggableEventItem
								key={index}
								event={e}
								setShowEventOptionsPopUp={setShowEventOptionsPopUp}
								showEventOptionsPopUp={showEventOptionsPopUp}
								hourFormat={hourFormat}
								convertTimeRangeTo24Hour={convertTimeRangeTo24Hour}
							/>
						))}
					</ul>
				)}
				{hasEvent?.length > 4 && (
					<div
						onClick={(e) => {
							e.stopPropagation()
							setShowPopUp(date)
						}}
						className={styles.showMoreButton}
					>
						Ver mas...
					</div>
				)}
			</div>
		</td>
	)
}

export default DroppableCell
