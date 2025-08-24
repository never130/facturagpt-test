import React from 'react'
import styles from './ProgressBar.module.css'

const ProgressBar = ({
	passedHours,
	remainingHours,
	passedConverted,
	remainingConverted,
}) => {
	const totalHours = passedHours + remainingHours

	const passedPercentage = (passedHours / totalHours) * 100
	const remainingPercentage = (remainingHours / totalHours) * 100

	return (
		<div className={styles.timeBarContainer}>
			<div
				className={styles.passedBar}
				style={{
					width: `${passedPercentage}%`,
					borderRadius: remainingPercentage === 0 ? '2px' : '2px 0 0 2px',
				}}
			>
				<div className={styles.tooltip}>Realizadas: {passedConverted}</div>
			</div>
			<div
				className={styles.remainingBar}
				style={{
					width: `${remainingPercentage}%`,
					borderRadius: passedPercentage === 0 ? '2px' : '0 2px 2px 0',
				}}
			>
				<div className={styles.tooltip}>Restantes: {remainingConverted}</div>
			</div>
		</div>
	)
}

export default ProgressBar
