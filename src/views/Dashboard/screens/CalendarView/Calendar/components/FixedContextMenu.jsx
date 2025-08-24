import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './FixedContextMenu.module.css'
import { MdDelete, MdEdit } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteEvent } from '@src/actions/calendar'
import { setModal } from '@src/slices/calendarSlices'
import { FaPlus } from 'react-icons/fa'

const FixedContextMenu = ({
	onClose,
	parentRef,
	onEvent,
	onDay,
	eventData,
	eventsOnDate,
	handleAddNewEvent,
	handleEdit,
}) => {
	const { selectedCalendar } = useSelector((state) => state.calendar)
	const { user } = useSelector((state) => state.user)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const menuRef = useRef(null)

	const [menuPosition, setMenuPosition] = useState({ top: '0px', left: '0px' })

	useEffect(() => {
		const handleContextMenu = (event) => {
			event.preventDefault()
			setMenuPosition({ top: `${event.clientY}px`, left: `${event.clientX}px` })
		}

		document.addEventListener('contextmenu', handleContextMenu)
		return () => {
			document.removeEventListener('contextmenu', handleContextMenu)
		}
	}, [])

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				!parentRef.current.contains(event.target)
			) {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div
			style={{
				top: onDay && menuPosition.top,
				left: onDay && menuPosition.left,
			}}
			className={onDay ? styles.chatMenuFixed : styles.chatMenu}
			ref={menuRef}
		>
			<div className={styles.chatMenuUl}>
				{onDay && (
					<div
						className={styles.chatMenuLi}
						onClick={(e) => {
							e.stopPropagation()
							handleAddNewEvent()
							onClose()
						}}
					>
						<FaPlus /> Nuevo evento
					</div>
				)}
				{onEvent && (
					<div
						className={styles.chatMenuLi}
						onClick={(e) => {
							e.stopPropagation()
							handleEdit()
							onClose()
						}}
					>
						<MdEdit /> Editar
					</div>
				)}
				{onEvent && (
					<div
						className={styles.chatMenuLi}
						onClick={(e) => {
							e.stopPropagation()
							dispatch(
								setModal(
									<CustomAlertPopup
										title='Eliminar evento'
										message='Seguro que desea eliminar este evento?'
										onAccept={() => {
											dispatch(
												deleteEvent({
													userId: user.id,
													calendarId: selectedCalendar,
													eventId: eventData.id,
												})
											)
											dispatch(setModal())
										}}
										onCancel={() => dispatch(setModal())}
									/>
								)
							)
							onClose()
						}}
					>
						<MdDelete /> Eliminar
					</div>
				)}
				{onDay && eventsOnDate.length > 0 && (
					<div
						className={styles.chatMenuLi}
						onClick={(e) => {
							e.stopPropagation()
							dispatch(
								setModal(
									<CustomAlertPopup
										title='Eliminar eventos'
										message='Seguro que desea eliminar todos los eventos de esta fecha?'
										onAccept={() => {
											eventsOnDate.forEach((ev) => {
												dispatch(
													deleteEvent({
														userId: user.id,
														calendarId: selectedCalendar,
														eventId: ev.id,
													})
												)
											})
											dispatch(setModal())
										}}
										onCancel={() => dispatch(setModal())}
									/>
								)
							)
							onClose()
						}}
					>
						<MdDelete /> Eliminar todos
					</div>
				)}
			</div>
		</div>
	)
}

export default FixedContextMenu
