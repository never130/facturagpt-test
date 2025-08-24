import React, { useContext, useEffect } from 'react'
import styles from './CustomToast.module.css'
import { CalendarContext } from '../../CalendarContext'

const CustomToast = ({ message }) => {
	const { toastMessage, showToast, setShowToast } = useContext(CalendarContext)
	useEffect(() => {
		if (showToast) {
			const timer = setTimeout(() => {
				setShowToast(false)
			}, 2300)

			return () => clearTimeout(timer)
		}
	}, [showToast, setShowToast])

	return (
		<div className={`${styles.toast} ${showToast ? styles.show : styles.hide}`}>
			{message || toastMessage}
		</div>
	)
}

export default CustomToast
