import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

import {
	createIdeaKanban,
	addKanban,
	updateKanban,
	deleteKanban,
	fetchsKanban,
	fetchKanban,
	addKanbanTicket,
	addKanbanTask,
	deleteKanbanTicket,
	deleteKanbanTask,
	updateKanbanTicket,
	updateKanbanTask,
} from '../actions/kanban'

export const initialKanban = {
	id: uuidv4(),
	title: '',
	description: '',
	status: '',
	priority: '',
	collaborators: [],
	tickets: [],
	startedAt: new Date().toISOString(),
	endedAt: new Date().toISOString(),
	createdBy: '',
	updatedBy: '',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
}

export const initialTicket = {
	id: uuidv4(),
	title: '',
	description: '',
	color: '',
	collaborator: [],
	tasks: [],
	createdBy: '',
	updatedBy: '',
	startedAt: new Date().toISOString(),
	endedAt: new Date().toISOString(),
}

export const initialTask = {
	id: uuidv4(),
	title: '',
	description: '',
	status: '',
	priority: '',
	date: '',
	list: [],
	createdBy: '',
	updatedBy: '',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
}

const kanbanSlice = createSlice({
	name: 'kanban',
	initialState: {
		loading: false,
		kanban: null,
		kanbans: [
			{
				...initialKanban,
				tickets: [
					{
						...initialTicket,
						tasks: [initialTask],
					},
				],
			},
		],

		tasks: [initialTask],
	},
	reducers: {
		setKanban: (state, action) => {
			state.kanban = action.payload
			const index = state.kanbans.findIndex(
				(kanban) => kanban.id == action.payload.id
			)

			if (index > -1) {
				state.kanbans[index] = action.payload
			}
		},
		setTasks: (state, action) => {
			state.tasks = action.payload
		},
		setTask: (state, action) => {},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchsKanban.fulfilled, (state, action) => {
				state.kanbans = action.payload?.kanbans || []
				state.kanban = action.payload?.kanban || null
			})
			.addCase(fetchKanban.fulfilled, (state, action) => {
				state.kanban = action.payload
			})

			.addCase(addKanban.fulfilled, (state, action) => {
				state.kanbans.push(action.payload)
			})

			.addCase(createIdeaKanban.fulfilled, (state, action) => {
				state.kanban.tickets = action.payload
			})

			.addCase(updateKanban.fulfilled, (state, action) => {})

			.addCase(deleteKanban.fulfilled, (state, action) => {
				const { id } = action.payload

				state.kanbans = state.kanbans.filter((kanban) => kanban.id !== id)

				state.kanban = null
			})
			.addCase(addKanbanTicket.pending, (state) => {
				state.loading = true
			})
			.addCase(addKanbanTicket.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload) {
					state.kanban = action.payload
				}
			})
			.addCase(addKanbanTicket.rejected, (state, action) => {
				state.loading = false
			})
			.addCase(addKanbanTask.pending, (state) => {
				state.loading = true
			})
			.addCase(addKanbanTask.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload) {
					state.kanban = action.payload
				}
			})
			.addCase(addKanbanTask.rejected, (state, action) => {
				state.loading = false
			})
			.addCase(updateKanbanTicket.pending, (state) => {
				state.loading = true
			})
			.addCase(updateKanbanTicket.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload) {
					state.kanban = action.payload
				}
			})
			.addCase(updateKanbanTicket.rejected, (state, action) => {
				state.loading = false
			})
			.addCase(updateKanbanTask.pending, (state) => {
				state.loading = true
			})
			.addCase(updateKanbanTask.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload) {
					state.kanban = action.payload
				}
			})
			.addCase(updateKanbanTask.rejected, (state, action) => {
				state.loading = false
			})
			.addCase(deleteKanbanTicket.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteKanbanTicket.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload) {
					state.kanban = action.payload
				}
			})
			.addCase(deleteKanbanTicket.rejected, (state, action) => {
				state.loading = false
			})
			.addCase(deleteKanbanTask.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteKanbanTask.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload) {
					state.kanban = action.payload
				}
			})
			.addCase(deleteKanbanTask.rejected, (state, action) => {
				state.loading = false
			})
	},
})

export const { setKanban, setTasks, setTask } = kanbanSlice.actions

export default kanbanSlice.reducer
