import apiBackend from '@src/apiBackend.js'
import { createAsyncThunk } from '@reduxjs/toolkit'




export const fetchsKanban = createAsyncThunk(
	'kanban/fetchsKanban',
	async ({ workspaceId, kanbanId = null, filter }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.post(
				`/kanban/all`,
				{
					workspaceId,
					kanbanId,
					filter,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return {
				kanbans: res.data.kanbans,
				kanban: res.data.kanban,
			}
		} catch (error) {
			console.error('Error fetchs kanban:', error)
		}
	}
)

export const createIdeaKanban = createAsyncThunk(
	'kanban/createIdeaKanban',
	async ({ workspaceId, kanbanId, kanban, text }) => {
		try {
			const tokenGPT = localStorage.getItem('token-gpt')

			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const response = await apiBackend.post(
				`/kanban/idea`,
				{
					token: tokenGPT,
					workspaceId,
					kanbanId,
					kanban,
					text,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return response.data
		} catch (error) {
			console.error('Error idea kanban:', error)
		}
	}
)

export const fetchKanban = createAsyncThunk(
	'kanban/fetchKanban',
	async ({ workspaceId, kanbanId }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.post(
				`/kanban`,
				{
					workspaceId,
					kanbanId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			
			return res.data
		} catch (error) {
			console.error('Error fetch kanban:', error)
		}
	}
)

export const addKanban = createAsyncThunk(
	'kanban/addKanban',
	async ({ workspaceId, kanbanId, data }, { dispatch }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;


			const res = await apiBackend.post(
				'/kanban/add',
				{
					workspaceId,
					kanbanId,
					data,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			if (error.status == 502) {
				alert('modal limit request')
				throw 'Limit request'
			}
		}
	}
)

export const updateKanban = createAsyncThunk(
	'kanban/updateKanban',
	async ({ workspaceId, kanban }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.post(
				`/kanban/update`,
				{
					workspaceId,
					kanban,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error update kanban:', error)
		}
	}
)

export const deleteKanban = createAsyncThunk(
	'kanban/deleteKanban',
	async ({ workspaceId, data }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.delete(`/kanban`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: {
					workspaceId,
					data,
				},
			})

			return res.data
		} catch (error) {
			console.error('Error delete kanban:', error)
		}
	}
)

export const addKanbanTicket = createAsyncThunk(
	'kanban/addKanbanTicket',
	async ({ workspaceId, kanbanId, ticket }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.post(
				'/kanban/addTicket',
				{
					workspaceId,
					kanbanId,
					ticket,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return res.data
		} catch (error) {
			console.error('Error addKanbanTicket:', error)
		}
	}
)

export const addKanbanTask = createAsyncThunk(
	'kanban/addKanbanTask',
	async ({ workspaceId, kanbanId, ticketId, task }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.post(
				'/kanban/addTask',
				{
					workspaceId,
					kanbanId,
					ticketId,
					task,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error addKanbanTask:', error)
		}
	}
)

export const updateKanbanTicket = createAsyncThunk(
	'kanban/updateKanbanTicket',
	async ({ workspaceId, kanbanId, ticketId, updatedTicket }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.put(
				'/kanban/updateTicket',
				{
					workspaceId,
					kanbanId,
					ticketId,
					updatedTicket,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return res.data
		} catch (error) {
			console.error('Error updateKanbanTicket:', error)
		}
	}
)

export const updateKanbanTask = createAsyncThunk(
	'kanban/updateKanbanTask',
	async ({ workspaceId, kanbanId, ticketId, taskId, updatedTask }) => {

		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.put(
				'/kanban/updateTask',
				{
					workspaceId,
					kanbanId,
					ticketId,
					taskId,
					updatedTask,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return res.data
		} catch (error) {
			console.error('Error updateKanbanTask:', error)
		}
	}
)

export const deleteKanbanTicket = createAsyncThunk(
	'kanban/deleteKanbanTicket',
	async ({ workspaceId, kanbanId, ticketId }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.delete(`/kanban/deleteTicket`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: {
					workspaceId,
					kanbanId,
					ticketId,
				},
			})

			return res.data
		} catch (error) {
			console.error('Error deleteKanbanTicket:', error)
			throw error
		}
	}
)

export const deleteKanbanTask = createAsyncThunk(
	'kanban/deleteKanbanTask',
	async ({ workspaceId, kanbanId, ticketId, taskId }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const res = await apiBackend.delete('/kanban/deleteTask', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: {
					workspaceId,
					kanbanId,
					ticketId,
					taskId,
				},
			})

			return res.data
		} catch (error) {
			console.error('Error deleteKanbanTask:', error)
		}
	}
)

export const fetchChatKanban = createAsyncThunk(
	'kanban/fetchChatKanban',
	async ({ kanbanId, taskId }, { dispatch }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const resp = await apiBackend.get(`/kanban/chat/${kanbanId}/${taskId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			return resp.data
		} catch (error) {
			throw error
		}
	}
)

export const addChatKanban = createAsyncThunk(
	'kanban/addChatKanban',
	async ({ kanbanId, taskId, chat }, { dispatch }) => {
		try {
			const user = localStorage.getItem("user");
			const userJson = JSON.parse(user);
			const token = userJson.accessToken;

			const resp = await apiBackend.post(
				'/kanban/chat',
				{
					kanbanId,
					taskId,
					chat,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return resp.data
		} catch (error) {
			throw error
		}
	}
)
