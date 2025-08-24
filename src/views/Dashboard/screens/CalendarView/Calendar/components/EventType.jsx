import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './EventTypes.module.css'
import { MdOutlinePeopleAlt } from 'react-icons/md'
import { CalendarContext } from '../../CalendarContext'
import CalendarUsersPopUp from './CalendarUsersPopUp'
import { IoClose } from 'react-icons/io5'
import CustomDescriptionInput from './CustomDescriptionInput'
import AdditionalCalendarInfoBlock from './AdditionalCalendarInfoBlock'
import { ReactComponent as IconFacturaGPT } from "../../../../assets/FacturaLogoIconGreen.svg";
import DateHourInfo from './DateHourInfo'

const EventType = ({
	usersToInvite,
	setUsersToInvite,
	location,
	setLocation,
	description,
	setDescription,
	attachment,
	setAttachment,
	addMeet,
	setAddMeet,
	meetId,
	visibility,
	setVisibility,
	availability,
	setAvailability,
	notification,
	setNotification,
	eventColor,
	setEventColor,
	expandedAdditionalInfo,
	setExpandedAdditionalInfo,
	timezone,
	repeat,
	setTimezone,
	setRepeat,
	hourDataExpanded,
	setHourDataExpanded,
	allDay,
	setAllDay,
}) => {
	const searchPeopleRef = useRef(null)
	const [showPeoplePopUp, setShowPeoplePopUp] = useState(false)
	const [searchPeople, setSearchPeople] = useState('')
	const [userColors, setUserColors] = useState({})

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

	return (
    <div className={styles.eventTypeContentContainer}>
      <DateHourInfo
        timezone={timezone}
        repeat={repeat}
        setTimezone={setTimezone}
        setRepeat={setRepeat}
        hourDataExpanded={hourDataExpanded}
        setHourDataExpanded={setHourDataExpanded}
        allDay={allDay}
        setAllDay={setAllDay}
      />
      <div className={styles.formCalendar}>
        <button>Encontrar un hueco</button>
      </div>

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
            type="text"
            onChange={(e) => setSearchPeople(e.target.value)}
            spellCheck="false"
            placeholder={"Añade invitados"}
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
                    setShowPeoplePopUp(false);
                    handleUserInvite(user);
                  }}
                />
                <div className={styles.tooltip}>Eliminar</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        style={{ marginBottom: addMeet && "12px" }}
        className={styles.formMeet}
      >
        <div>
          <IconFacturaGPT
            className={styles.iconFacturaGPT}
            style={{ height: "20px", width: "20px", marginRight: 0 }}
          />

        </div>
        <div className={styles.columnContainer}>
          <button
            onClick={() => setAddMeet((prev) => !prev)}
            className={addMeet ? styles.meetButtonActive : styles.meetButton}
          >
            Añadir videollamada de FacturaGPT Meet
          </button>
          {addMeet && (
            <div
              className={styles.meetLink}
            >{`facturagpt.com/admin/meet/${meetId}`}</div>
          )}
        </div>
      </div>
      <div className={styles.formLocation}>
        <svg fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"
          />
        </svg>
        <div style={{ width: "400px", height: "35px" }}>
          <div className={styles.addGuestsInputWrapper}>
            <input
              value={location}
              className={styles.addGuestsInput}
              type="text"
              onChange={(e) => setLocation(e.target.value)}
              spellCheck="false"
              placeholder={"Añadir ubicación"}
            />
          </div>
        </div>
      </div>
      <CustomDescriptionInput
        attachment={attachment}
        setAttachment={setAttachment}
        description={description}
        setDescription={setDescription}
      />
      <AdditionalCalendarInfoBlock
        notification={notification}
        setNotification={setNotification}
        availability={availability}
        setAvailability={setAvailability}
        visibility={visibility}
        setVisibility={setVisibility}
        eventColor={eventColor}
        setEventColor={setEventColor}
        expandedAdditionalInfo={expandedAdditionalInfo}
        setExpandedAdditionalInfo={setExpandedAdditionalInfo}
      />
    </div>
  );
}

export default EventType
