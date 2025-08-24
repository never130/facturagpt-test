import React, { useState } from 'react'
import styles from './NormalDropdown.module.css'
import { GoTriangleDown } from 'react-icons/go'

const NormalDropdown = ({ selectedOption, setSelectedOption, options }) => {
	const [isOpen, setIsOpen] = useState(false)
	const toggleDropdown = () => {
		setIsOpen((prev) => !prev)
	}
	return (
		<div className={styles.dropdownContainer}>
			<div
				className={styles.dropdownButton}
				onClick={(e) => {
					e.stopPropagation()
					toggleDropdown()
				}}
			>
				<div className={styles.leftContainer}>
					<span>{selectedOption}</span>
				</div>
				<GoTriangleDown
					color='#666'
					size={14}
					style={{
						transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'transform 0.2s ease-in-out',
					}}
				/>
				{isOpen && (
					<div className={styles.dropdownMenu}>
						{options.map((option) => (
							<div
								style={{
									background:
										option === selectedOption && `var(--color-primary-5)`,
								}}
								key={option}
								className={styles.dropdownItem}
								onClick={() => {
									setSelectedOption(option)
								}}
							>
								<span>{option}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default NormalDropdown
