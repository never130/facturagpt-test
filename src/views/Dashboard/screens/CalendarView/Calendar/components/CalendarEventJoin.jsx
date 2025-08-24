import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './CalendarEventJoin.module.css'
import meetingImage from './meetingClipart.png'
import { useDispatch } from 'react-redux'
import {
	acceptInvitation,
	cancelInvitation,
	getEventDataByJoinId,
} from '@src/actions/calendar'
import { useSelector } from 'react-redux'

const CalendarEventJoin = () => {
	const { user } = useSelector((state) => state.user)
	const dispatch = useDispatch()
	const [eventData, setEventData] = useState()
	const { joinId } = useParams()

	useEffect(() => {
		const getEventData = async (joinId) => {
			const data = await dispatch(getEventDataByJoinId({ joinId }))
			setEventData(data.payload)
			return data
		}

		joinId && getEventData(joinId)
	}, [])

	if (!eventData) return null
	return (
		<div className={styles.container}>
			<img src={meetingImage} alt='Meeting' className={styles.meetingImage} />
			<h2
				className={styles.heading}
			>{`${eventData.organizer.split('@')[0]} te ha invitado a el evento: ${eventData.title}`}</h2>
			<div className={styles.buttonContainer}>
				<button
					onClick={() =>
						eventData.invitedUsers.some(
							(invitedUser) => invitedUser.id === user.id
						) &&
						dispatch(
							acceptInvitation({ eventId: eventData.id, userId: user.id })
						)
					}
					className={styles.acceptButton}
				>
					Aceptar invitación
				</button>
				<button
					onClick={() =>
						eventData.invitedUsers.some(
							(invitedUser) => invitedUser.id === user.id
						) &&
						dispatch(
							cancelInvitation({ eventId: eventData.id, userId: user.id })
						)
					}
					className={styles.cancelButton}
				>
					Cancelar invitación
				</button>
			</div>
		</div>
	)
}

export default CalendarEventJoin
