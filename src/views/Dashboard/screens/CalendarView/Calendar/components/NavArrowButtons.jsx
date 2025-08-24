import React, { useContext } from 'react'
import styles from './NavArrowButtons.module.css'
import { CalendarContext } from '../../CalendarContext'

const NavArrowButtons = ({ tag }) => {
	const {
		setNextDayAsSelectedDate,
		setPreviousDayAsSelectedDate,
		goToPreviousWeek,
		goToNextWeek,
		goToPreviousMonth,
		goToNextMonth,
		goToPreviousDayRange,
		goToNextDayRange,
	} = useContext(CalendarContext)
	return (
		<div className={styles.buttonsNavs}>
			<button
				onClick={() => {
					if (tag === 'day') {
						setPreviousDayAsSelectedDate()
					} else if (tag === 'week') {
						goToPreviousWeek()
					} else if (tag === 'month') {
						goToPreviousMonth()
					} else if (tag === 'timeline') {
						goToPreviousDayRange()
					}
				}}
			>
				<svg viewBox='0 0 24 24'>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='m14 8-4 4 4 4'
					/>
				</svg>
			</button>
			<button
				onClick={() => {
					if (tag === 'day') {
						setNextDayAsSelectedDate()
					} else if (tag === 'week') {
						goToNextWeek()
					} else if (tag === 'month') {
						goToNextMonth()
					} else if (tag === 'timeline') {
						goToNextDayRange()
					}
				}}
			>
				<svg viewBox='0 0 24 24'>
					<path
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='m10 16 4-4-4-4'
					/>
				</svg>
			</button>
		</div>
	)
}

export default NavArrowButtons
