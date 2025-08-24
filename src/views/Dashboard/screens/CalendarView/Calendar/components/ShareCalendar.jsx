import React, { useState, useRef, useEffect } from 'react'
import { AiOutlineCaretDown } from 'react-icons/ai'
import styles from './ShareCalendar.module.css'
import { useSelector } from 'react-redux'
import { IoMdCheckmark } from 'react-icons/io'
import CalendarUsersPopUp from './CalendarUsersPopUp'
import { useDispatch } from 'react-redux'
import { updateCalendar } from '@src/actions/calendar'

const Dropdown = ({ currentRole, onSelectRole }) => {
	const roles = ['Lector' , 'Editor']

	return (
		<div className={styles.permissionsDropdown}>
			{roles.map((role, index) => (
				<div
					key={index}
					className={`${styles.dropdownItem}`}
					onClick={() => onSelectRole(role)}
				>
					{currentRole === role && (
						<div className={styles.checkIcon}>
							<IoMdCheckmark size={20} />
						</div>
					)}
					<span className={styles.roleText}>{role}</span>
				</div>
			))}
		</div>
	)
}

const ShareCalendar = ({
	setShowPeoplePopUp,
	setSearchPeople,
	searchPeople,
	showPeoplePopUp,
}) => {
	const dispatch = useDispatch()
	const { user } = useSelector((state) => state.user)
	const { selectedCalendar, selectedCalendarData } = useSelector(
		(state) => state.calendar
	)
	const searchPeopleRef = useRef(null)
	const dropdownRef = useRef(null) 
	const [filteredUsers, setFilteredUsers] = useState([]) 
	const [dropdownVisible, setDropdownVisible] = useState(null) 
	const [userRoles, setUserRoles] = useState({}) 

	useEffect(() => {
		setUserRoles(
			selectedCalendarData?.participants?.map((user) => {
				const finalRole = user.permissions === 'read' ? 'Lector' : 'Editor'
				return { [user.id]: finalRole }
			})
		)
	}, [])
	const toggleDropdown = (userId, event) => {
		event.stopPropagation() 
		setDropdownVisible(dropdownVisible === userId ? null : userId)
	}

	const updateRole = (userId, newRole) => {
		const finalRole = newRole === 'Lector' ? 'read' : 'write'
		setUserRoles((prevRoles) => ({ ...prevRoles, [userId]: newRole }))
		let actualParticipants = [...selectedCalendarData.participants]
		const userIndex = actualParticipants.findIndex(
			(participant) => participant.id === userId
		)

		if (userIndex !== -1) {
			actualParticipants[userIndex] = {
				user: actualParticipants[userIndex].user,
				id: actualParticipants[userIndex].id,
				permissions: finalRole,
			}
		}
		dispatch(
			updateCalendar({
				userId: user.id,
				calendarId: selectedCalendar,
				toUpdate: {
					participants: actualParticipants,
				},
			})
		)
		setDropdownVisible(null)
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				!event.target.closest(`.${styles.categoryDropdownButton}`)
			) {
				setDropdownVisible(null)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [dropdownRef])

	return (
		<div className={styles.shareCalendarWrapper}>
			<div
				ref={searchPeopleRef}
				onClick={() => !showPeoplePopUp && setShowPeoplePopUp(true)}
				className={styles.meeting}
			>
				<div className={styles.input}>
					<input
						value={searchPeople}
						className={styles.searchPeopleInput}
						type='text'
						onChange={(e) => setSearchPeople(e.target.value)}
						spellCheck='false'
						placeholder={'Agregar personas, grupos y eventos de calendario'}
					/>
				</div>
				{showPeoplePopUp && (
					<CalendarUsersPopUp
						fromSettings={true}
						setShowPeoplePopUp={setShowPeoplePopUp}
						setSearchPeople={setSearchPeople}
						searchPeople={searchPeople}
						searchPeopleRef={searchPeopleRef}
					/>
				)}
			</div>
			<span className={styles.subtitle}>Personas que tienen acceso</span>
			<div className={styles.userCard}>
				<div className={styles.leftContainer}>
					<div className={styles.avatar}>
						<div className={styles.initial}>
							yh
							</div>
					</div>
					<div className={styles.userInfo}>
						<div className={styles.userName}>{user.user?.split('@')[0]}</div>
						<div className={styles.userEmail}>{user.user}</div>
					</div>
				</div>
				<div className={styles.rightContainer}>
					<div className={styles.ownerText}>Propietario</div>
				</div>
			</div>
			{selectedCalendarData?.participants?.map((user) => (
				<div key={user.id} className={styles.userCard}>
					<div className={styles.leftContainer}>
						<div className={styles.avatar}>
							<div className={styles.initial}>
								123
								</div>
						</div>
						<div className={styles.userInfo}>
							<div className={styles.userName}>{user.user.split('@')[0]}</div>
							<div className={styles.userEmail}>{user.user}</div>
						</div>
					</div>
					<div className={styles.rightContainer}>
						<div
							className={styles.categoryDropdownButton}
							onClick={(event) => toggleDropdown(user.id, event)}
						>
							<span>{userRoles[user.id] || 'Lector'}</span>
							<AiOutlineCaretDown size={12} />
						</div>
						{dropdownVisible === user.id && (
							<div ref={dropdownRef}>
								<Dropdown
									currentRole={
										user.permissions === 'read'
											? 'Lector'
											: user.permissions === 'write'
												? 'Editor'
												: 'Lector'
									}
									onSelectRole={(role) => updateRole(user.id, role)}
								/>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	)
}

export default ShareCalendar
