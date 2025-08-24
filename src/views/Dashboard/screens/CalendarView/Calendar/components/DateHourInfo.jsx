import React from 'react'
import styles from './DateHourInfo.module.css'
import { FiClock } from 'react-icons/fi'
import CustomDateHourSelector from './CustomDateHourSelector'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import CustomDropDown from './CustomDropDown'
import { timezones } from '../utils/constants'

const DateHourInfo = ({
	timezone,
	repeat,
	setTimezone,
	setRepeat,
	hourDataExpanded,
	setHourDataExpanded,
	allDay,
	setAllDay,
}) => {
	const recurrenceOptions = [
		'No se repite',
		'Cada día del mes',
		'Cada semana del mes',
		'Cada mes del año',
	]

	if (hourDataExpanded)
		return (
			<div className={styles.expandedContainer}>
				<FiClock
					style={{ marginTop: '3px' }}
					size={18}
					className={styles.normalIcon}
				/>
				<div className={styles.expandedDateHourWrapper}>
					<CustomDateHourSelector allDay={allDay} />
					<div className={styles.allDayWrapper}>
						<div
							onClick={() => setAllDay((prev) => !prev)}
							className={styles.allDayContainer}
						>
							{allDay ? (
								<MdCheckBox
									style={{ cursor: 'pointer' }}
									size={22}
									color={`var(--color-primary-1)`}
								/>
							) : (
								<MdCheckBoxOutlineBlank
									style={{ cursor: 'pointer' }}
									size={22}
									color={`var(--text-color)`}
								/>
							)}
							<span>Todo el día</span>
						</div>
						<CustomDropDown
							options={timezones}
							selectedOption={timezone}
							fullWidth={true}
							setSelectedOption={setTimezone}
						/>
					</div>
					<CustomDropDown
						options={recurrenceOptions}
						selectedOption={repeat}
						fullWidth={true}
						setSelectedOption={setRepeat}
					/>
				</div>
			</div>
		)
	return (
		<div
			onClick={(e) => {
				setHourDataExpanded(true)
			}}
			className={styles.formTime}
		>
			<FiClock size={18} className={styles.normalIcon} />
			<div className={styles.innerContainer}>
				<CustomDateHourSelector />
				<span>{`${timezone} · ${repeat}`}</span>
			</div>
		</div>
	)
}

export default DateHourInfo
