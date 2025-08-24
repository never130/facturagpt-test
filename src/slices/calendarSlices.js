import { createSlice } from '@reduxjs/toolkit'
import {
	addTaskToWorkShift,
	addUserWorkShift,
	createCalendar,
	createEvent,
	deleteCalendar,
	deleteEvent,
	getAcceptedInvitationsEvents,
	getCalendarEvents,
	getUserCalendars,
	getUserSharedEvents,
	getUserWorkShifts,
	removeTaskFromWorkShift,
	updateCalendar,
	updateEvent,
	updateWorkShiftActivity,
} from '../actions/calendar'

export const calendarSlices = createSlice({
	name: 'calendar',
	initialState: {
		userCalendars: [],
		selectedCalendar: null,
		selectedSecondaryCalendars: [],
		selectedCalendarData: {},
		selectedSecondaryCalendarsData: {},
		selectedCalendarEvents: [],
		selectedSecondaryCalendarEvents: [],
		allUserEvents: [],
		userSharedEvents: [],
		userInvitations: [],
		userWorkShifts: [],
		modal: null,
	},
	reducers: {
		setModal(state, action) {
			state.modal = action.payload
		},
		setSelectedSecondaryCalendars(state, action) {
			const alreadyPicked = state.selectedSecondaryCalendars.some(
				(cal) => cal === action.payload.id
			)
			const finalArr = alreadyPicked
				? state.selectedSecondaryCalendars.filter(
						(cal) => cal !== action.payload.id
					)
				: [...state.selectedSecondaryCalendars, action.payload.id]
			const finalEvents = finalArr
				.map((calId) => {
					const events = state.userCalendars.filter(
						(cal) => cal.id === calId
					)[0].events
					const calColor = state.userCalendars.filter(
						(cal) => cal.id === calId
					)[0].calendarColor
					events.forEach((element) => {
						element.calendarColor = calColor
					})
					return events
				})
				.flat()
			state.selectedSecondaryCalendars = finalArr
			state.selectedSecondaryCalendarEvents = finalEvents
			let calsData = {}
			finalArr.forEach((calId) => {
				const calData = state.userCalendars.filter((cal) => cal.id === calId)
				calsData[calId] = calData
			})
			state.selectedSecondaryCalendarsData = calsData
		},
		setSecondaryCalendars(state, action) {
			if (action.payload) {
				const finalArr = action.payload.map((cal) => cal.id)
				const finalEvents = finalArr
					.map((calId) => {
						const events = state.userCalendars.filter(
							(cal) => cal.id === calId
						)[0].events
						const calColor = state.userCalendars.filter(
							(cal) => cal.id === calId
						)[0].calendarColor
						events.forEach((element) => {
							element.calendarColor = calColor
						})
						return events
					})
					.flat()
				let calsData = {}
				finalArr.forEach((calId) => {
					const calData = state.userCalendars.filter((cal) => cal.id === calId)
					calsData[calId] = calData
				})
				state.selectedSecondaryCalendars = finalArr
				state.selectedSecondaryCalendarEvents = finalEvents
				state.selectedSecondaryCalendarsData = calsData
			} else {
				state.selectedSecondaryCalendars = []
				state.selectedSecondaryCalendarEvents = []
				state.selectedSecondaryCalendarsData = {}
			}
		},
		swapMainCalendar(state, action) {
			const firstSecondaryCalendarId = state.selectedSecondaryCalendars[0]

			if (!firstSecondaryCalendarId) {
				console.error('No secondary calendars available to swap')
				return
			}

			const newMainCalendar = state.userCalendars.find(
				(cal) => cal.id === firstSecondaryCalendarId
			)

			if (!newMainCalendar) {
				console.error('Selected secondary calendar not found in userCalendars')
				return
			}

			const updatedSecondaryCalendars = state.selectedSecondaryCalendars.filter(
				(calId) => calId !== firstSecondaryCalendarId
			)

			const updatedSecondaryEvents = updatedSecondaryCalendars
				.map((calId) => {
					const calendar = state.userCalendars.find((cal) => cal.id === calId)
					const events = [...calendar.events]
					events.forEach((event) => {
						event.calendarColor = calendar.calendarColor
					})
					return events
				})
				.flat()

			return {
				...state,
				selectedCalendar: newMainCalendar.id,
				selectedCalendarData: newMainCalendar,
				selectedCalendarEvents: newMainCalendar.events.map((event) => ({
					...event,
					calendarColor: newMainCalendar.calendarColor,
				})),
				selectedSecondaryCalendars: updatedSecondaryCalendars,
				selectedSecondaryCalendarEvents: updatedSecondaryEvents,
			}
		},
		setUserCalendars(state, action) {
			state.userCalendars = action.payload
		},
		setSelectedCalendar(state, action) {
			const calColor = action.payload.calendarColor
			const selectedCalendarData = { ...action.payload }
			const selectedCalendar = action.payload.id

			const selectedCalendarEvents = action.payload.events.map((event) => ({
				...event,
				calendarColor: calColor,
			}))

			return {
				...state,
				selectedCalendarData,
				selectedCalendar,
				selectedCalendarEvents,
			}
		},
		setSelectedCalendarEvents(state, action) {
			state.selectedCalendarEvents = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserCalendars.pending, (state) => {
				state.loading = true
			})
			.addCase(getUserCalendars.fulfilled, (state, action) => {
				state.loading = false
				state.userCalendars = action.payload
					? action.payload
					: state.userCalendars
				state.allUserEvents = action.payload
					? action.payload.map((cal) => cal.events).flat()
					: state.allUserEvents
			})
			.addCase(getUserCalendars.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(updateCalendar.pending, (state) => {
				state.loading = true
			})
			.addCase(updateCalendar.fulfilled, (state, action) => {
				if (action.payload) {
					state.loading = false
					state.userCalendars = [
						...state.userCalendars.filter(
							(calendar) => calendar.id !== action.payload.id
						),
						action.payload,
					]
					state.selectedCalendarData =
						action.payload.id === state.selectedCalendar
							? action.payload
							: state.selectedCalendarData
				}
			})
			.addCase(updateCalendar.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(getCalendarEvents.pending, (state) => {
				state.loading = true
			})
			.addCase(getCalendarEvents.fulfilled, (state, action) => {
				state.loading = false
				state.selectedCalendarEvents = action.payload
			})
			.addCase(getCalendarEvents.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(getUserSharedEvents.pending, (state) => {
				state.loading = true
			})
			.addCase(getUserSharedEvents.fulfilled, (state, action) => {
				state.loading = false
				state.userSharedEvents = action.payload
			})
			.addCase(getUserSharedEvents.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(getUserWorkShifts.pending, (state) => {
				state.loading = true
			})
			.addCase(getUserWorkShifts.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload && action.payload?.workShifts) {

					state.userWorkShifts = action.payload.workShifts
				}
			})
			.addCase(getUserWorkShifts.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(addUserWorkShift.pending, (state) => {
				state.loading = true
			})
			.addCase(addUserWorkShift.fulfilled, (state, action) => {
				state.loading = false
				state.userWorkShifts = action.payload.workShifts
			})
			.addCase(addUserWorkShift.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(updateWorkShiftActivity.pending, (state) => {
				state.loading = true
			})
			.addCase(updateWorkShiftActivity.fulfilled, (state, action) => {
				state.loading = false
				state.userWorkShifts = action.payload.workShifts
			})
			.addCase(updateWorkShiftActivity.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(addTaskToWorkShift.pending, (state) => {
				state.loading = true
			})
			.addCase(addTaskToWorkShift.fulfilled, (state, action) => {
				state.loading = false
				state.userWorkShifts = action.payload.workShifts
			})
			.addCase(addTaskToWorkShift.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(removeTaskFromWorkShift.pending, (state) => {
				state.loading = true
			})
			.addCase(removeTaskFromWorkShift.fulfilled, (state, action) => {
				state.loading = false
				state.userWorkShifts = action.payload.workShifts
			})
			.addCase(removeTaskFromWorkShift.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(getAcceptedInvitationsEvents.pending, (state) => {
				state.loading = true
			})
			.addCase(getAcceptedInvitationsEvents.fulfilled, (state, action) => {
				state.loading = false
				state.userInvitations = action.payload
			})
			.addCase(getAcceptedInvitationsEvents.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(updateEvent.pending, (state) => {
				state.loading = true
			})
			.addCase(updateEvent.fulfilled, (state, action) => {
				state.loading = false
				if (
					action.payload &&
					state.selectedCalendarEvents.filter(
						(ev) => ev.id === action.payload.id
					).length > 0
				) {
					const filteredEvs = state.selectedCalendarEvents.filter(
						(ev) => ev.id !== action.payload.id
					)
					state.selectedCalendarEvents = [...filteredEvs, action.payload]
				}
			})
			.addCase(updateEvent.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(createCalendar.pending, (state) => {
				state.loading = true
			})
			.addCase(createCalendar.fulfilled, (state, action) => {
				state.loading = false
				state.userCalendars = [...state.userCalendars, action.payload]
			})
			.addCase(createCalendar.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(deleteCalendar.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteCalendar.fulfilled, (state, action) => {
				state.loading = false
				state.userCalendars = [...state.userCalendars].filter(
					(calendar) => calendar.id !== action.payload
				)
			})
			.addCase(deleteCalendar.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
			.addCase(createEvent.pending, (state) => {
				state.loading = true
			})
			.addCase(createEvent.fulfilled, (state, action) => {
				state.loading = false
				state.selectedCalendarEvents = action.payload
			})
			.addCase(createEvent.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})

			.addCase(deleteEvent.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteEvent.fulfilled, (state, action) => {
				state.loading = false
				state.selectedCalendarEvents = [...state.selectedCalendarEvents].filter(
					(event) => event.id !== action.payload
				)
			})
			.addCase(deleteEvent.rejected, (state, action) => {
				state.error = action.payload
				state.loading = false
			})
	},
})

export const {
	setModal,
	
	setUserCalendars,
	setSelectedCalendar,
	setSelectedCalendarEvents,
	setSelectedSecondaryCalendars,
	swapMainCalendar,
	setSecondaryCalendars,
} = calendarSlices.actions

export default calendarSlices.reducer
