import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import styles from './EventOptionsPopUp.module.css'
import { CalendarContext } from '../../CalendarContext'
import { IoMdCalendar } from 'react-icons/io'
import { HiOutlineTrash } from 'react-icons/hi2'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { HiOutlineDuplicate } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { setModal } from '@src/slices/calendarSlices'
import EventEditPopup from './EventEditPopup'
import { transformEventHourToSelectedFormat } from '../utils'
import { createEvent } from '@src/actions/calendar'
import { useNavigate } from 'react-router-dom'
import { FaRegClock } from 'react-icons/fa6'

const EventOptionsPopUp = ({
	event,
	fromTimeline,
	isTask,
	task,
	taskTitle,
	position,
}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { selectedCalendar, selectedCalendarData } = useSelector(
		(state) => state.calendar
	)
	const { user } = useSelector((state) => state.user)
	const {
		setShowEventOptionsPopUp,
		setEventToEdit,
		handleDeleteEvent,
		addMinutesToTime,
		handleShowToast,
		convertTimeRangeTo24Hour,
		hourFormat,
		getDateData,
		setSelectedHour,
		getReminderHour,
		setSelectedDate,
		handleSendInvitationEmail,
	} = useContext(CalendarContext)
	const popupRef = useRef(null)
	const eventDuration = selectedCalendarData.eventsDuration

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				setShowEventOptionsPopUp(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [setShowEventOptionsPopUp])

	const handleDelete = (e) => {
		e.stopPropagation()
		if (event.organizer === user.user) {
			handleDeleteEvent(event.id)
			setShowEventOptionsPopUp(false)
			handleShowToast('Evento eliminado exitosamente!')
		} else {
			setShowEventOptionsPopUp(false)
			handleShowToast('Debes ser el creador del evento para poder eliminarlo!')
		}
	}
	const [hovered, setHovered] = useState('')

	const dataPriority = [
		{
			text: 'Crítico',
			value: 100,
		},
		{
			text: 'Alto',
			value: 101,
		},
		{
			text: 'Medio',
			value: 102,
		},
		{
			text: 'Bajo',
			value: 103,
		},
	]

	const dataStatus = [
		{
			text: 'Pendiente',
			value: 200,
		},
		{
			text: 'En proceso',
			value: 201,
		},
		{
			text: 'En pausa',
			value: 202,
		},
		{
			text: 'Revisar',
			value: 203,
		},
		{
			text: 'Terminado',
			value: 204,
		},
	]

	const handleEventDuplicate = (event) => {
		const eventHour = transformEventHourToSelectedFormat(event.hour)
		const startHourForNextEvent = addMinutesToTime(
			eventHour.start,
			eventDuration
		)
		const endHourForNextEvent = addMinutesToTime(
			startHourForNextEvent,
			eventDuration
		)
		const joinId = event.joinId
		const dateData = getDateData(event.date)
		const reminderHour = getReminderHour(
			eventHour.start.split(' ').join('').toLowerCase(),
			10
		)
		const eventData = {
			type: event.type,
			date: event.date,
			title: `${event.title} (1)`,
			description: event.description,
			hour: `${startHourForNextEvent.split(' ').join('').toLowerCase()} - ${endHourForNextEvent.split(' ').join('').toLowerCase()}`,
			organizer: event.organizer,
			timeZone: event.timeZone,
			participants: event.participants,
			invitedUsers: event.invitedUsers,
			joinId,
			reminder: '30 minutes before',
			attachment: event.attachment || 0,
			eventColor: event.eventColor,
			location: event.location,
			allDay: event.allDay,
			repeat: event.repeat,
			notification: event.notification,
			availability: event.availability,
			visibility: event.visibility,
			meetId: event.meetId,
			addMeet: event.addMeet,
		}

		
		dispatch(
			createEvent({
				userId: user.id,
				calendarId: selectedCalendar,
				eventData,
			})
		).then((res) => {
			event.invitedUsers.forEach((invitedUser) => {
				const dataToEmailWith = {
					month: dateData.month,
					dayNumber: dateData.dayNumber,
					day: dateData.day,
					senderName: user.user.split('@')[0],
					reminderHour,
					receiverName: invitedUser.user.split('@')[0],
					timezone: event.timeZone,
					receiverEmail: invitedUser.user,
					eventName: `${event.title} (1)`,
					location: event.location,
					completeDate: dateData.completeDate,
					joinId,
					shareId: selectedCalendarData.shareId,
					senderEmail: user.user,
					description: event.description,
					participants: event.invitedUsers.map(
						(user) => user.user.split('@')[0]
					),
					hour: `${startHourForNextEvent.split(' ').join('').toLowerCase()} - ${endHourForNextEvent.split(' ').join('').toLowerCase()}`,
				}
				handleSendInvitationEmail(dataToEmailWith)
			})
		})
	}

	return (
		<div
			style={{
				position: 'fixed',
				top: position.top,
				left: position.left - 150,
				zIndex: 900000,
			}}
			className={styles.popupContainer}
			ref={popupRef}
		>
			<div className={styles.header}>
				<div className={styles.eventTitle}>
					<span className={styles.eventColor}></span>
					{(isTask ? taskTitle : event.title).length > 20
						? (isTask ? taskTitle : event.title).slice(0, 20) + '...'
						: isTask
							? taskTitle
							: event.title}
				</div>
				<div
					onClick={() => {
						if (isTask) {
							navigate(`/admin/calendar/kanban/${task?._id}`)
							return
						}
						setEventToEdit(event)
						const [start, end] = event.hour.split(' - ')

						const hourStart =
							start.slice(0, -2) + ' ' + start.slice(-2).toUpperCase()
						const hourEnd = end.slice(0, -2) + ' ' + end.slice(-2).toUpperCase()
						setSelectedHour({ start: hourStart, end: hourEnd })
						setSelectedDate({
							day: parseInt(event.date.split('/')[0]),
							month: parseInt(event.date.split('/')[1] - 1),
							year: parseInt(event.date.split('/')[2]),
						})
						dispatch(setModal(<EventEditPopup />))
					}}
					onMouseEnter={() => setHovered('edit')}
					onMouseLeave={() => setHovered('')}
					className={styles.icon}
				>
					<MdOutlineModeEditOutline size={20} />
					{hovered === 'edit' && (
						<div className={styles.toolTip}>
							Editar {isTask ? 'tarea' : 'evento'}
						</div>
					)}
				</div>
				{!isTask && (
					<div
						onMouseEnter={() => setHovered('delete')}
						onMouseLeave={() => setHovered('')}
						onClick={(e) => handleDelete(e)}
						className={styles.icon}
					>
						<HiOutlineTrash size={20} />
						{hovered === 'delete' && (
							<div className={styles.toolTip}>Eliminar evento</div>
						)}
					</div>
				)}
				{!isTask && (
					<div
						onMouseEnter={() => setHovered('duplicate')}
						onMouseLeave={() => setHovered('')}
						className={styles.icon}
						onClick={() => handleEventDuplicate(event)}
					>
						<HiOutlineDuplicate size={20} />
						{hovered === 'duplicate' && (
							<div className={styles.toolTip}>Duplicar</div>
						)}
					</div>
				)}
				<div
					onMouseEnter={() => setHovered('close')}
					onMouseLeave={() => setHovered('')}
					className={styles.icon}
					onClick={(e) => {
						e.stopPropagation()
						setShowEventOptionsPopUp(false)
					}}
				>
					<IoMdClose size={18} />
					{hovered === 'close' && <div className={styles.toolTip}>Cerrar</div>}
				</div>
			</div>
			<div className={styles.content}>
				{isTask && <div className={styles.eventTime}>{task.description}</div>}
				{isTask && (
					<div
						style={{ marginBottom: '3px' }}
						className={styles.labelsContainer}
					>
						<div className={`${styles.dot} ${styles['_' + task.priority]}`} />
						<div className={styles.labelsText}>
							{dataPriority.filter((d) => d.value === task.priority)[0].text}
						</div>
					</div>
				)}
				{isTask && (
					<div className={styles.labelsContainer}>
						<div className={`${styles.dot} ${styles['_' + task.status]}`} />
						<div className={styles.labelsText}>
							{dataStatus.filter((d) => d.value === task.status)[0].text}
						</div>
					</div>
				)}
				{!isTask && (
					<div className={styles.eventTime}>
						<FaRegClock size={17} />
						{event.date} ·{' '}
						{hourFormat === '1:00pm'
							? event.hour
							: convertTimeRangeTo24Hour(event.hour)}
					</div>
				)}
				{!isTask && (
					<div className={styles.reminder}>
						<FaBell size={17} />
						{event.notification
							? event.notification.map((r, i) => <span>{r}</span>)
							: '10 minutos antes'}
					</div>
				)}
				{!isTask && (
					<div className={styles.organizer}>
						<IoMdCalendar size={17} /> {event.organizer}
					</div>
				)}
			</div>
		</div>
	)
}

export default EventOptionsPopUp
