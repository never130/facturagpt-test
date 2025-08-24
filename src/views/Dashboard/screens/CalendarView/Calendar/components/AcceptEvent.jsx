import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './AcceptEvent.module.css'
import meetingImage from './meetingClipart.png'
import { useDispatch } from 'react-redux'
import {
	acceptInvitation,
	cancelInvitation,
	getAcceptedInvitationsEvents,
	getEventDataByJoinId,
} from '@src/actions/calendar'
import { useSelector } from 'react-redux'
import { CalendarContext } from '../../CalendarContext'

const AcceptEvent = ({ cancel, reschedule }) => {
	const { handleCalendar } = useContext(CalendarContext)
	const { user } = useSelector((state) => state.user)
	const dispatch = useDispatch()
	const [eventData, setEventData] = useState()
	const { taskId } = useParams()

	useEffect(() => {
		const getEventData = async (eventId) => {
			const data = await dispatch(getEventDataByJoinId({ joinId: eventId }))
			setEventData(data.payload)
			if (Object.keys(data.payload).length > 0) {
				if (
					data.payload.invitedUsers.some(
						(invitedUser) => invitedUser.id === user.id
					)
				) {
					if (cancel) {
						dispatch(
							cancelInvitation({ eventId: data.payload.id, userId: user.id })
						).then(() =>
							dispatch(getAcceptedInvitationsEvents({ userId: user.id }))
						)
					} else if (reschedule) {
						dispatch(
							cancelInvitation({ eventId: data.payload.id, userId: user.id })
						).then(() =>
							dispatch(getAcceptedInvitationsEvents({ userId: user.id }))
						)
					} else {
						dispatch(
							acceptInvitation({ eventId: data.payload.id, userId: user.id })
						).then(() =>
							dispatch(getAcceptedInvitationsEvents({ userId: user.id }))
						)
					}
				}
			}
			return data
		}
		taskId && getEventData(taskId)
	}, [])

	if (!eventData) return null
	return (
		<div className={styles.container}>
			<img src={meetingImage} alt='Meeting' className={styles.meetingImage} />
			<h2
				className={styles.heading}
			>{`Has ${cancel ? 'rechazado' : 'aceptado'} al invitacion de ${eventData.organizer.split('@')[0]} a el evento: ${eventData.title}`}</h2>
			<div className={styles.buttonContainer}>
				<button
					onClick={() => handleCalendar('day')}
					className={styles.acceptButton}
				>
					Ver evento
				</button>
			</div>
		</div>
	)
}

export default AcceptEvent
