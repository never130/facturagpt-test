import React, { useState } from 'react'
import { GoDotFill } from 'react-icons/go'
import { MdCheck } from 'react-icons/md'
import styles from './CustomColorPalette.module.css'
import { colors } from './colors'

const CustomColorPalette = ({ eventColor, setEventColor }) => {
	const [colorPaletteOpened, setColorPaletteOpened] = useState(false)
	const [hoveredColor, setHoveredColor] = useState(null)

	const togglePalette = () => {
		setColorPaletteOpened(!colorPaletteOpened)
	}

	const handleColorSelect = (color) => {
		setEventColor(color)
		setColorPaletteOpened(false)
	}

	return (
		<div className={styles.colorPaletteContainer} onClick={togglePalette}>
			<GoDotFill size={30} color={eventColor} />
			<div
				style={{
					transform: colorPaletteOpened ? 'rotate(180deg)' : 'rotate(0deg)',
					transition: 'transform 0.2s ease-in-out',
				}}
				className={styles.arrow}
			/>
			{colorPaletteOpened && (
				<div className={styles.colorPalettePopup}>
					{colors.map((color) => (
						<div
							key={color.hex}
							className={styles.colorOption}
							onClick={() => handleColorSelect(color.hex)}
							onMouseEnter={() => setHoveredColor(color.hex)}
							onMouseLeave={() => setHoveredColor(null)}
						>
							<div
								className={styles.dot}
								style={{ background: color.hex }}
							></div>
							{eventColor === color.hex && (
								<MdCheck className={styles.checkIcon} />
							)}
							{hoveredColor === color.hex && (
								<div className={styles.tooltip}>{color.label}</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default CustomColorPalette
