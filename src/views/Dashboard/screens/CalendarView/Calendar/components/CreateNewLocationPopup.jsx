import React, { useState } from 'react'
import styles from './CreateNewLocationPopup.module.css'

const CreateNewLocationPopup = ({
	title,
	onClose,
	onSave,
	dayToChange,
	type,
}) => {
	const [location, setLocation] = useState('')
	const [charCount, setCharCount] = useState(0)
	const maxCharCount = 512

	const handleChange = (e) => {
		const newLocation = e.target.value
		setLocation(newLocation)
		setCharCount(newLocation.length)
	}

	const handleSave = () => {
		if (location.trim()) {
			onSave(type, location, dayToChange)
			onClose()
		}
	}

	return (
		<div className={styles.overlay}>
			<div className={styles.popupContainer}>
				<div className={styles.header}>
					<h3>{title}</h3>
				</div>
				<div className={styles.content}>
					<textarea
						placeholder='Añade una ubicación'
						value={location}
						onChange={handleChange}
						maxLength={maxCharCount}
						className={styles.textArea}
					/>
					<div className={styles.charCounter}>
						{charCount} / {maxCharCount}
					</div>
				</div>
				<div className={styles.actions}>
					<button onClick={onClose} className={styles.cancelButton}>
						Cancelar
					</button>
					<button
						onClick={handleSave}
						className={styles.saveButton}
						disabled={!location.trim()}
					>
						Añadir
					</button>
				</div>
			</div>
		</div>
	)
}

export default CreateNewLocationPopup
