import React from 'react'
import styles from './CheckboxAndText.module.css'
import {
	MdOutlineCheckBox,
	MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md'

const CheckboxAndText = ({
	state,
	setState,
	text,
	updateCalendarProperty,
	backProp,
	subtitle,
	onlyRead,
}) => {
	return (
		<div className={styles.checkboxAndText}>
			<button
				className={state ? styles.checkedButton : styles.uncheckedButton}
				style={{ cursor: 'pointer' }}
				onClick={() =>
					onlyRead
						? ''
						: updateCalendarProperty
							? updateCalendarProperty(setState, !state, backProp)
							: setState(!state)
				}
			>
				{state ? (
					<MdOutlineCheckBox size={20} className={styles.checkboxIcon} />
				) : (
					<MdOutlineCheckBoxOutlineBlank
						size={20}
						className={styles.checkboxIcon}
					/>
				)}
			</button>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<span
					style={{ marginTop: !subtitle ? '5px' : '-1px' }}
					className={styles.textContainer}
				>
					{text}
				</span>
				{subtitle && (
					<span className={styles.subtextContainer}>{subtitle}</span>
				)}
			</div>
		</div>
	)
}

export default CheckboxAndText
