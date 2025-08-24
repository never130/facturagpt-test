import React, { useRef, useEffect } from 'react'
import { LuText } from 'react-icons/lu'
import { MdAddToDrive } from 'react-icons/md'
import styles from './CustomDescriptionInput.module.css'

const CustomDescriptionInput = ({
	attachment,
	setAttachment,
	description,
	setDescription,
	fromMeet,
}) => {
	const fileInputRef = useRef(null)
	const textareaRef = useRef(null)

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0]
		if (selectedFile) {
			setAttachment(selectedFile)
		}
	}

	const handleAttachClick = () => {
		fileInputRef.current.click()
	}

	const handleRemoveAttachment = () => {
		setAttachment(null)
	}

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current
		textarea.style.height = 'auto' 
		textarea.style.height = `${Math.min(textarea.scrollHeight, 250) - 13.82}px`
	}

	useEffect(() => {
		adjustTextareaHeight()
	}, [description]) 

	return (
		<div
			style={{ gap: fromMeet ? '15px' : '4px' }}
			className={styles.descriptionContainer}
		>
			<div className={fromMeet ? styles.meetDescWrapper : styles.descWraper}>
				<LuText
					style={{
						marginTop: fromMeet && '10px',
						marginLeft: fromMeet && '5px',
					}}
					size={fromMeet ? 24 : 20}
					className={styles.normalIcon}
				/>
				<div
					style={{
						marginLeft: fromMeet && '-8px',
						background: !fromMeet && `var(--f5-background)`,
					}}
					className={
						fromMeet
							? styles.meetDescriptionMultiLineInputContainer
							: styles.descriptionMultiLineInputContainer
					}
				>
					<textarea
						ref={textareaRef}
						value={description}
						className={
							fromMeet
								? styles.meetDescriptionTextarea
								: styles.descriptionTextarea
						}
						placeholder='Añade una descripción'
						onChange={(e) => setDescription(e.target.value)}
						onInput={adjustTextareaHeight}
					/>
				</div>
			</div>

			<div
				className={
					fromMeet && !attachment
						? styles.meetAttachButtonWrapper
						: fromMeet && attachment
							? styles.meetAttachButtonWrapperActive
							: styles.attachButtonWrapper
				}
			>
				<MdAddToDrive
					style={{
						marginLeft: fromMeet ? '12px' : '0px',
						marginRight: fromMeet ? '-3px' : '0px',
					}}
					size={fromMeet ? 24 : 20}
					color={`var(--text-color)`}
				/>
				<div
					className={
						fromMeet && attachment
							? styles.meetAttachButtonActive
							: fromMeet && !attachment
								? styles.meetAttachButton
								: styles.attachButton
					}
					onClick={handleAttachClick}
				>
					Añadir un archivo adjunto
				</div>
				<input
					type='file'
					ref={fileInputRef}
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
			</div>

			{attachment && (
				<div
					style={{
						marginLeft: fromMeet ? '0px' : '34px',
						marginBottom: fromMeet ? '3px' : '0px',
					}}
					className={styles.attachmentInfo}
				>
					<p>{attachment.name}</p>
					<button onClick={handleRemoveAttachment}>
						Eliminar archivo adjunto
					</button>
				</div>
			)}
		</div>
	)
}

export default CustomDescriptionInput
