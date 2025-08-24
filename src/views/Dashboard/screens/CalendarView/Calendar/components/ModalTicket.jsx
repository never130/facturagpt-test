import React, { useState, useEffect, useRef, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { v4 as uuidv4 } from 'uuid'

import styles from './ModalTicket.module.css'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import ModalToDoList from './ModalToDoList'

import { SearchList } from './index'

import {
	initialTicket,
	initialTask,
	setKanban,
} from '@src/slices/kanbanSlices'

import { setModal } from '@src/slices/calendarSlices'

import {
	fetchChatKanban,
	addChatKanban,
	updateKanbanTask,
} from '@src/actions/kanban'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarContext } from '../../CalendarContext'
import { InputCalendar } from './InputCalendar'
import CheckboxAndText from './CheckboxAndText'
import { updateCalendar } from '@src/actions/calendar'

const ModalTicket = ({ dataPriority, dataStatus, task, ticket: _ticket }) => {
	const dispatch = useDispatch()
	const { calendar } = useContext(CalendarContext)
	const { selectedCalendar, selectedCalendarData } = useSelector(
		(state) => state.calendar
	)
	const { user } = useSelector((state) => state.user)
	const { kanban } = useSelector((state) => state.kanban)

	const navigate = useNavigate()
	const { tag, taskId } = useParams()

	const [isCalendarEvent, setIsCalendarEvent] = useState(
		task.isCalendarEvent || false
	)

	useEffect(() => {
		const taskAlreadyAttached =
			selectedCalendarData?.attachedTasks &&
			selectedCalendarData?.attachedTasks.includes(task.id)

		const attached = taskAlreadyAttached
			? [...(selectedCalendarData?.attachedTasks || [])]
			: [...(selectedCalendarData?.attachedTasks || []), task.id]
		const notAtached = [...(selectedCalendarData?.attachedTasks || [])].filter(
			(t) => t !== task.id
		)
		const actualTask = { ...task }
		actualTask.isCalendarEvent = isCalendarEvent

		dispatch(
			updateCalendar({
				userId: user.id,
				calendarId: selectedCalendar,
				toUpdate: {
					attachedTasks: isCalendarEvent === true ? attached : notAtached,
				},
			})
		)
		dispatch(
			updateKanbanTask({
				workspaceId: user.id,
				kanbanId: kanban._id,
				ticketId: _ticket.id,
				taskId: task.id,
				updatedTask: actualTask,
			})
		)
	}, [isCalendarEvent])

	useEffect(() => {
		return () => {
			navigate(`/admin/calendar/${calendar}`)
		}
	}, [calendar])


	const [indexTicket, setIndexTicket] = useState(
		kanban.tickets.findIndex((t) => t.id === _ticket.id)
	)
	const [indexTask, setIndexTask] = useState(
		kanban.tickets[
			kanban.tickets.findIndex((t) => t.id === _ticket.id)
		].tasks.findIndex((t) => t.id == task.id)
	)


	useEffect(() => {
		if (task.priority) {
			setSelectedPriority({ value: task.priority, text: '' })
		}

		if (task.status) {
			setSelectedStatus({ value: task.status, text: '' })
		}
	}, [task])

	const handleInputTask = (e) => {
		const { name, value } = e.target

		const updatedTickets = [...kanban.tickets]
		const updatedTasks = [...updatedTickets[indexTicket].tasks]

		updatedTasks[indexTask] = {
			...updatedTasks[indexTask],
			[name]: value,
		}

		updatedTickets[indexTicket] = {
			...updatedTickets[indexTicket],
			tasks: updatedTasks,
		}

		const updatedKanban = {
			...kanban,
			tickets: updatedTickets,
		}

		dispatch(setKanban(updatedKanban))
	}

	const handleDeleteTask = () => {
		const updatedTickets = [...kanban.tickets]
		const tasks = updatedTickets[indexTicket].tasks

		const updatedTasks = tasks.filter((t) => t.id !== task.id)

		updatedTickets[indexTicket] = {
			...updatedTickets[indexTicket],
			tasks: updatedTasks,
		}

		const updatedKanban = {
			...kanban,
			tickets: updatedTickets,
		}

		dispatch(setKanban(updatedKanban))
		dispatch(setModal(null))
	}

	const handleOpenToDo = () => {
		dispatch(
			setModal({
				component: <ModalToDoList ticket={_ticket} task={task} />,
				option: { close: false },
			})
		)
	}

	const [selectedPriority, setSelectedPriority] = useState({})
	const [selectedStatus, setSelectedStatus] = useState({})

	useEffect(() => {
		if (selectedPriority.value && selectedPriority.value !== task.priority) {
			const value = selectedPriority.value

			const updatedTickets = [...kanban.tickets]
			const updatedTasks = [...updatedTickets[indexTicket].tasks]

			updatedTasks[indexTask] = {
				...updatedTasks[indexTask],
				priority: value,
			}

			updatedTickets[indexTicket] = {
				...updatedTickets[indexTicket],
				tasks: updatedTasks,
			}

			const updatedKanban = {
				...kanban,
				tickets: updatedTickets,
			}

			dispatch(setKanban(updatedKanban))
		}
	}, [selectedPriority])

	useEffect(() => {
		if (selectedStatus.value && selectedStatus.value !== task.status) {
			const value = selectedStatus.value

			const updatedTickets = [...kanban.tickets]
			const updatedTasks = [...updatedTickets[indexTicket].tasks]

			updatedTasks[indexTask] = {
				...updatedTasks[indexTask],
				status: value,
			}

			updatedTickets[indexTicket] = {
				...updatedTickets[indexTicket],
				tasks: updatedTasks,
			}

			const updatedKanban = {
				...kanban,
				tickets: updatedTickets,
			}

			dispatch(setKanban(updatedKanban))
		}
	}, [selectedStatus])

	const handleDateTask = (date) => {

		const actualTask = { ...task }
		actualTask.date = date
		dispatch(
			updateKanbanTask({
				workspaceId: user.id,
				kanbanId: kanban._id,
				ticketId: _ticket.id,
				taskId: task.id,
				updatedTask: actualTask,
			})
		)
	}

	const handleCreateChat = () => {
		alert(1)
	}

	const chatRef = useRef(null)
	const [chats, setChats] = useState([])
	const [inputMessage, setInputMessage] = useState('')

	const fetchsChat = async (taskId) => {
		var resp = await dispatch(
			fetchChatKanban({
				kanbanId: kanban._id,
				taskId: taskId,
			})
		)

		setChats(resp.payload)
	}

	useEffect(() => {
		fetchsChat(task.id)
	}, [task])

	const textareaRef = useRef(null)

	const handleInputMessage = (event) => {
		setInputMessage(event.target.value)
		adjustTextareaHeight()
	}

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current
		if (textarea) {
			textarea.style.height = 'auto'
			textarea.style.height = `${textarea.scrollHeight}px`
		}
	}

	const handleSendMessage = () => {
		const newChat = {
			id: uuidv4(),
			owner: user?.id,
			date: new Date().toISOString(),
			text: inputMessage,
		}

		setChats((preChats) => [...preChats, newChat])
		setInputMessage('')
		dispatch(
			addChatKanban({
				kanbanId: kanban._id,
				taskId: task.id,
				chat: newChat,
			})
		)

		setTimeout(function () {
			chatRef.current.scrollTop = chatRef.current.scrollHeight
		}, 0)
	}



	return (
		<div className={styles.modal}>
			<div className={styles.header}>
				<div className={styles.collaborators}>
					<div className={styles.initial}>
						<span>{'A'}</span>
					</div>
				</div>
				<div className={styles.color}>
					<div />
					<div />
					<div />
				</div>
				<div className={styles.buttons}>
					<button className={styles.doList} onClick={() => handleOpenToDo()}>
						{/* prettier-ignore */}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4" /> </svg>
						{`${task?.list?.filter((l) => l.status === 101).length}/ ${task?.list?.length}`}
					</button>
					<button className={styles.delete} onClick={() => handleDeleteTask()}>
						Eliminar
					</button>
					<button
						className={styles.save}
						onClick={() =>
							dispatch(
								updateKanbanTask({
									workspaceId: user.id,
									kanbanId: kanban._id,
									ticketId: _ticket.id,
									taskId: task.id,
									updatedTask: task,
								})
							)
						}
					>
						Guardar
					</button>
				</div>
			</div>
			<div className={styles.input}>
				<label htmlFor='title'>Title</label>
				<input
					type='text'
					name='title'
					value={task?.title}
					spellCheck={false}
					onChange={(e) => handleInputTask(e)}
				/>
			</div>
			<div className={styles.input}>
				<label htmlFor='description'>Description</label>
				<textarea
					type='text'
					name='description'
					value={task?.description}
					onChange={(e) => handleInputTask(e)}
					spellCheck={false}
					rows='2'
				/>
			</div>
			<div className={styles.grid2}>
				<div>
					<div className={styles.select}>
						<SearchList
							selected={selectedPriority}
							setSelected={setSelectedPriority}
							placeholder='Prioridad'
							name='priority'
							data={dataPriority}
							styles={styles}
							indexTicket={indexTicket}
							indexTask={indexTask}
						/>
					</div>
					<div className={styles.select}>
						<SearchList
							selected={selectedStatus}
							setSelected={setSelectedStatus}
							placeholder='Estado'
							name='satus'
							data={dataStatus}
							styles={styles}
							indexTicket={indexTicket}
							indexTask={indexTask}
						/>
					</div>
				</div>
				<div>
					<InputCalendar
						taskDate={task?.date}
						handleDateTask={handleDateTask}
						fromKanban={true}
					/>
				</div>
			</div>
			<CheckboxAndText
				text={'Agregar como evento en mi calendario'}
				state={isCalendarEvent}
				setState={setIsCalendarEvent}
			/>
			<div className={styles.alert}>
				Crea un chat con el que podemos hablar sobre ese ticket con todo tu
				equipo y comentar este ticket.
				<a onClick={() => handleCreateChat()}>Empezar ahora</a>
			</div>

			<div ref={chatRef} className={styles.chats}>
				<div className={styles.chat}>
					{chats.map((chat, index) => (
						<div key={index} className={`${styles.you}`}>
							{chat.text || 'not found'}
						</div>
					))}
				</div>
				<div className={styles.textarea}>
					<textarea
						ref={textareaRef}
						placeholder={`Inserta un ticket`}
						spellCheck={false}
						value={inputMessage}
						onChange={handleInputMessage}
					/>
					<button onClick={handleSendMessage}>
						{/* prettier-ignore */}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 18-7 3 7-18 7 18-7-3Zm0 0v-5" /> </svg>
					</button>
				</div>
			</div>
		</div>
	)
}

export default ModalTicket
