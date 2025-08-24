import React, { useState, useRef, useEffect } from 'react'
import styles from './CustomDropDown.module.css'

const CustomDropDown = ({
	title,
	placeholder,
	options,
	selectedOption,
	setSelectedOption,
	index,
	fullWidth,
	backProp,
	updateCalendarProperty,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [hoveredIndex, setHoveredIndex] = useState(null)
	const containerRef = useRef(null)

	const handleToggle = () => setIsOpen(!isOpen)

	const handleOptionClick = (option) => {
		if (updateCalendarProperty && backProp) {
			updateCalendarProperty(setSelectedOption, option, backProp)
			setIsOpen(false)
		}
		if (index !== undefined) {
			setSelectedOption((prev) => {
				const updatedNotifications = [...prev]
				updatedNotifications[index] = option
				return updatedNotifications
			})
		} else {
			setSelectedOption(option)
		}
		setIsOpen(false)
	}

	const handleMouseEnter = (index) => setHoveredIndex(index)
	const handleMouseLeave = () => setHoveredIndex(null)

	const handleClickOutside = (event) => {
		if (containerRef.current && !containerRef.current.contains(event.target)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div
			style={{ width: fullWidth ? '100%' : '320px' }}
			className={styles.customInputContainer}
			ref={containerRef}
		>
			<div
				style={{ height: title ? '45px' : '35px' }}
				className={styles.inputWrapper}
				onClick={handleToggle}
			>
				{title && <div className={styles.title}>{title}</div>}
				<input
					type='text'
					value={selectedOption || placeholder}
					readOnly
					style={{ marginTop: title && '20px' }}
					className={styles.customInput}
				/>
				<div
					style={{
						transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'transform 0.2s ease-in-out',
					}}
					className={styles.arrow}
				/>
			</div>

			{isOpen && (
				<div className={styles.dropdown}>
					{options.map((option, index) => (
						<div
							key={index}
							className={`${styles.option} ${
								option === selectedOption ? styles.selected : ''
							} ${index === hoveredIndex ? styles.hovered : ''}`}
							onClick={() => handleOptionClick(option)}
							onMouseEnter={() => handleMouseEnter(index)}
							onMouseLeave={handleMouseLeave}
						>
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default CustomDropDown
