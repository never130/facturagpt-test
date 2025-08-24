import React, { useState } from 'react'
import styles from './CustomInput.module.css'

const CustomInput = ({
	title,
	placeholder,
	setState,
	state,
	fullWidth,
	readOnly,
	textArea,
}) => {
	return (
		<div
			style={{ width: fullWidth ? '100%' : '320px' }}
			className={styles.customInputContainer}
		>
			<div
				style={{ height: textArea ? '75px' : '45px' }}
				className={styles.inputWrapper}
			>
				<div className={styles.title}>{title}</div>
				{textArea ? (
					<textarea
						style={{ userSelect: readOnly && 'none' }}
						placeholder={placeholder}
						readOnly={readOnly}
						value={state || placeholder}
						onChange={(e) => setState(e.target.value)}
						className={styles.customTextArea}
					/>
				) : (
					<input
						style={{ userSelect: readOnly && 'none' }}
						type='text'
						placeholder={placeholder}
						readOnly={readOnly}
						value={state || placeholder}
						onChange={(e) => setState(e.target.value)}
						className={styles.customInput}
					/>
				)}
			</div>
		</div>
	)
}

export default CustomInput
