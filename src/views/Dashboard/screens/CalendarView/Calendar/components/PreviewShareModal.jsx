import React, { useContext, useRef, useState } from 'react'
import styles from './PreviewShareModal.module.css'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import CalendarUsersPopUp from './CalendarUsersPopUp'
import { MdOutlinePeopleAlt } from 'react-icons/md'
import { CalendarContext } from '../../CalendarContext'
import { IoClose } from 'react-icons/io5'

const PreviewShareModal = ({ onClose }) => {
	const [usersToInvite, setUsersToInvite] = useState([])
	const searchPeopleRef = useRef(null)
	const [showPeoplePopUp, setShowPeoplePopUp] = useState(false)
	const [searchPeople, setSearchPeople] = useState('')
	const [userColors, setUserColors] = useState({})
	const dispatch = useDispatch()
	const { selectedCalendarData } = useSelector((state) => state.calendar)
	const { user } = useSelector((state) => state.user)

	const { selectedHour, selectedDate, getRandomColor } =
		useContext(CalendarContext)

	const handleUserInvite = (user) => {
		setUsersToInvite((prevUsersAdded) => {
			const userExists = prevUsersAdded.some((u) => u.id === user.id)

			if (userExists) {
				setUserColors((prevColors) => {
					const newColors = { ...prevColors }
					delete newColors[user.id]
					return newColors
				})
				return prevUsersAdded.filter((u) => u.id !== user.id)
			} else {
				setUserColors((prevColors) => ({
					...prevColors,
					[user.id]: prevColors[user.id] || getRandomColor(),
				}))
				return [
					...prevUsersAdded,
					{ id: user.id, user: user.user, status: 'pending' },
				]
			}
		})
	}
	const handleSendInvitation = () => {
		onClose()
	}
	return (
		<div className={styles.previewShareModalContainer}>
			<h2 className={styles.title}>Compartir</h2>
			<span>Comparte tu calendario con cualquier usuario</span>
			<div
				ref={searchPeopleRef}
				onClick={() => !showPeoplePopUp && setShowPeoplePopUp(true)}
				className={styles.addGuestsContainer}
			>
				<MdOutlinePeopleAlt size={20} className={styles.normalIcon} />
				<div className={styles.addGuestsInputWrapper}>
					<input
						value={searchPeople}
						className={styles.addGuestsInput}
						type='text'
						onChange={(e) => setSearchPeople(e.target.value)}
						spellCheck='false'
						placeholder={'Añade invitados'}
					/>
					{showPeoplePopUp && (
						<CalendarUsersPopUp
							fromEventCreation={true}
							setShowPeoplePopUp={setShowPeoplePopUp}
							setSearchPeople={setSearchPeople}
							searchPeople={searchPeople}
							searchPeopleRef={searchPeopleRef}
							addedUsers={usersToInvite}
							handleAddUser={handleUserInvite}
						/>
					)}
				</div>
			</div>
			{usersToInvite.length > 0 && (
				<div className={styles.invitedUsersContainer}>
					{usersToInvite.map((user, i) => (
						<div className={styles.invitedUserCard} key={i}>
							<div
								style={{
									border: `2px solid ${userColors[user.id] || getRandomColor()}`,
								}}
								className={styles.initial}
							>
								{user.user[0]}
							</div>
							<span>{user.user}</span>
							<div className={styles.closeButtonContainer}>
								<IoClose
									className={styles.closeButton}
									onClick={() => {
										setShowPeoplePopUp(false)
										handleUserInvite(user)
									}}
								/>
								<div className={styles.tooltip}>Eliminar</div>
							</div>
						</div>
					))}
				</div>
			)}
			<div className={styles.fullWR}>
				<button
					onClick={() => handleSendInvitation()}
					className={
						usersToInvite.length === 0
							? styles.disabledInviteButton
							: styles.inviteButton
					}
				>
					Enviar invitacion
				</button>
			</div>
		</div>
	)
}

export default PreviewShareModal
