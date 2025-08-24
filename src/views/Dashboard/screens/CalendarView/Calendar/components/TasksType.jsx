import React from 'react'
import styles from './EventTypes.module.css'
import { IoListOutline } from 'react-icons/io5'
import { IoMdArrowDropdown } from 'react-icons/io'
import CustomDescriptionInput from './CustomDescriptionInput'
import DateHourInfo from './DateHourInfo'

const TasksType = ({
	attachment,
	setAttachment,
	description,
	setDescription,
	timezone,
	repeat,
	setTimezone,
	setRepeat,
	hourDataExpanded,
	setHourDataExpanded,
	allDay,
	setAllDay,
}) => {
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
			<CustomDescriptionInput
				attachment={attachment}
				setAttachment={setAttachment}
				description={description}
				setDescription={setDescription}
			/>
			<div className={styles.myTasks}>
				<IoListOutline size={20} className={styles.normalIcon} />
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 4,
						alignItems: 'center',
						cursor: 'pointer',
						userSelect: 'none',
					}}
				>
					<b>Mis tareas</b>
					<IoMdArrowDropdown
						style={{ marginTop: 5, marginLeft: 8 }}
						size={14}
						className={styles.normalIcon}
					/>
				</div>
			</div>
		</div>
	)
}

export default TasksType
