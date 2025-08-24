import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './CalendarUsersPopUp.module.css'
import iconFacturaGPT from "../../../../assets/FacturaLogoIconGreen.svg";
import { useSelector, useDispatch } from 'react-redux'
import { CalendarContext } from '../../CalendarContext'
import { FaCheck } from 'react-icons/fa'

const CalendarUsersPopUp = ({
	fromEventCreation,
	setShowPeoplePopUp,
	setSearchPeople,
	searchPeople,
	searchPeopleRef,
	handleAddUser,
	addedUsers,
	fromSettings,
}) => {
	const { sendEmail, handleAddParticipantToCalendar } =
		useContext(CalendarContext)
	const { user } = useSelector((state) => state.user)
	const { selectedCalendarData } = useSelector((state) => state.calendar)
	const [filteredUsers, setFilteredUsers] = useState(allUsers || [])
	const dispatch = useDispatch()
	const popupRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target) &&
				!searchPeopleRef.current.contains(event.target)
			) {
				setShowPeoplePopUp(false)
				setSearchPeople('')
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [dispatch, setShowPeoplePopUp])


	if (
		fromEventCreation &&
		filteredUsers &&
		filteredUsers?.length > 0 &&
		filteredUsers.filter((singleUser) => {
			if (fromEventCreation) {
				if (addedUsers.some((u) => u.id === singleUser.id)) {
					return false
				} else {
					return true
				}
			} else {
				return true
			}
		}).length === 0
	)
		return null
	if (!filteredUsers || filteredUsers.length === 0) return null
	return (
		<div
			className={
				fromSettings
					? styles.fromSettingsPopupContainer
					: fromEventCreation
						? styles.fromEventPopupContainer
						: styles.popupContainer
			}
			ref={popupRef}
		>
			{filteredUsers
				.filter((singleUser) => {
					if (fromEventCreation) {
						if (addedUsers.some((u) => u.id === singleUser.id)) {
							return false
						} else {
							return true
						}
					} else {
						return true
					}
				})
				.filter((u) => u.id !== user.id)
		
				.map((user, index) => {
					const calendarParticipants = selectedCalendarData
						? selectedCalendarData?.participants
						: []
					const alreadyParticipant = calendarParticipants.some(
						(u) => u.id === user.id
					)
					return (
						<div
							onClick={() => {
								if (fromEventCreation) {
									handleAddUser(user)
								} else if (fromSettings) {
									if (!alreadyParticipant) {
										handleAddParticipantToCalendar(user)
									} else {
										console.error('ALREADY HAVE ACCESS')
									}
								}
							}}
							key={index}
							className={styles.userCard}
						>
							<div className={styles.avatar}>
								{user.profilePic ? (
									<img src={profileImage} alt={`${user.user}'s avatar`} />
								) : (
									<div className={styles.initial}>
										`12345`
										</div>
								)}
							</div>
							<div className={styles.userInfo}>
								<div className={styles.userName}>{user.user.split('@')[0]}</div>
								<div className={styles.userEmail}>{user.user}</div>
							</div>
							{alreadyParticipant && (
								<div className={styles.participantCard}>
									<FaCheck size={7} color={`var(--color-primary-0)`} />
								</div>
							)}
						</div>
					)
				})}
		</div>
	)
}

export default CalendarUsersPopUp
