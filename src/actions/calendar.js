
import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from '@reduxjs/toolkit'




export const getUserCalendars = createAsyncThunk(
	'calendar/getUserCalendars',
	async ({  }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/getUserCalendars',
				{ },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const getUserWorkShifts = createAsyncThunk(
	'calendar/getUserWorkShifts',
	async ({  }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/getUserWorkShifts',
				{ },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const addUserWorkShift = createAsyncThunk(
	'calendar/addUserWorkShift',
	async ({ date, shift, lastActivityTime }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/addUserWorkShift',
				{  date, shift, lastActivityTime },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}
)

export const updateWorkShiftActivity = createAsyncThunk(
	'calendar/updateWorkShiftActivity',
	async ({ date, lastActivityTime }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/updateWorkShiftActivity',
				{  date, lastActivityTime },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return res.data
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}
)

export const addTaskToWorkShift = createAsyncThunk(
	'calendar/addTaskToWorkShift',
	async ({ date, task, hour }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/addTaskToWorkShift',
				{ date, task, hour },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}
)

export const removeTaskFromWorkShift = createAsyncThunk(
	'calendar/removeTaskFromWorkShift',
	async ({ date, taskId }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/removeTaskFromWorkShift',
				{ date, taskId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}
)

export const createCalendar = createAsyncThunk(
	'calendar/createCalendar',
	async ({ calendarData, def }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/createCalendar',
				{ calendarData, def },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const deleteCalendar = createAsyncThunk(
	'calendar/deleteCalendar',
	async ({ calendarId }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/deleteCalendar',
				{ calendarId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const updateCalendar = createAsyncThunk(
	'calendar/updateCalendar',
	async ({ calendarId, toUpdate }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/updateCalendar',
				{ calendarId, toUpdate },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const updateEvent = createAsyncThunk(
	'calendar/updateEvent',
	async ({ eventId, eventData }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/updateEvent',
				{ eventId, eventData },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const getCalendarEvents = createAsyncThunk(
	'calendar/getCalendarEvents',
	async ({ calendarId }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/getCalendarEvents',
				{ userId, calendarId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const getUserSharedEvents = createAsyncThunk(
	'calendar/getUserSharedEvents',
	async ({ }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/getUserSharedEvents',
				{ },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const createEvent = createAsyncThunk(
	'calendar/createEvent',
	async ({  calendarId, eventData }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/createEvent',
				{ calendarId, eventData },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const createSharedEvent = createAsyncThunk(
	'calendar/createEvent',
	async ({ eventData }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/createSharedEvent',
				{ eventData },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const deleteEvent = createAsyncThunk(
	'calendar/deleteEvent',
	async ({ calendarId, eventId }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/deleteEvent',
				{ calendarId, eventId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const checkForCalendarDB = createAsyncThunk(
	'calendar/checkForCalendarDB',
	async ({ userEmail }) => {
		try {	
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/checkForCalendarDB',
				{ userEmail },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const getEventDataByJoinId = createAsyncThunk(
	'calendar/getEventDataByJoinId',
	async ({ joinId }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/getEventDataByJoinId',
				{ joinId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const getCalendarByShareId = createAsyncThunk(
	'calendar/getCalendarByShareId',
	async ({ shareId }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/getCalendarByShareId',
				{ shareId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const getAllUserPendingInvitations = createAsyncThunk(
	'calendar/getAllUserPendingInvitations',
	async ({  }) => {
		try {	
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/getAllUserPendingInvitations',
				{ },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const acceptInvitation = createAsyncThunk(
	'calendar/acceptInvitation',
	async ({ eventId }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/acceptInvitation',
				{ eventId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const cancelInvitation = createAsyncThunk(
	'calendar/cancelInvitation',
	async ({ eventId }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/cancelInvitation',
				{ eventId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const getAcceptedInvitationsEvents = createAsyncThunk(
	'calendar/getAcceptedInvitationsEvents',
	async ({ }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/getAcceptedInvitations',
				{ },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

export const sendInvitationEmail = createAsyncThunk(
	'calendar/sendInvitationEmail',
	async ({ email, data }) => {
		try {
			const user = localStorage.getItem('user')
			const userJson = JSON.parse(user)
			const token = userJson.accessToken

			const res = await apiBackend.post(
				'/calendar/sendInvitationEmail',
				{ email, data },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			return res.data
		} catch (error) {
			console.error('Error:', error)
		}
	}
)

