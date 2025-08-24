const { v4: uuidv4 } = require('uuid')
const nano = require('nano')('http://admin:1234@127.0.0.1:5984')


const generateInvitationId = () => {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
	const segmentLength = [3, 4, 3]

	const getRandomSegment = (length) => {
		let segment = ''
		for (let i = 0; i < length; i++) {
			segment += characters.charAt(
				Math.floor(Math.random() * characters.length)
			)
		}
		return segment
	}

	const id = segmentLength.map(getRandomSegment).join('-')
	return id
}

const createCalendar = async ({ selectedWorkspace, calendarData, def }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			await db.create(dbName)
		}

		const calendarsDb = nano.use(dbName)
		const finalId = def ? 'default' : uuidv4()

		const calendarId = `calendar_${selectedWorkspace}_${finalId}`
		const calendarDoc = {
			_id: calendarId,
			id: calendarId,
			...calendarData,
		}

		const response = await calendarsDb.insert(calendarDoc)

		const createdDoc = await calendarsDb.get(calendarId)
		const { _id, _rev, ...filteredData } = createdDoc

		return filteredData
	} catch (error) {
		console.error('Error creating calendar:', error)
		throw error
	}
}

const getTasksByIds = async ({ selectedWorkspace, taskIds }) => {
	try {
		const dbName = `db_calendar_kanban_${selectedWorkspace}`
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return []
		}

		const kanbanDb = nano.use(dbName)
		const allKanbans = await kanbanDb.list({ include_docs: true })

		let matchedTasks = []

		allKanbans.rows.forEach((row) => {
			const kanbanDoc = row.doc
			if (kanbanDoc.tickets && Array.isArray(kanbanDoc.tickets)) {
				kanbanDoc.tickets.forEach((ticket) => {
					if (ticket.tasks && Array.isArray(ticket.tasks)) {
						const matchingTasks = ticket.tasks.filter((task) =>
							taskIds.includes(task.id)
						)
						matchedTasks = [...matchedTasks, ...matchingTasks]
					}
				})
			}
		})

		return matchedTasks
	} catch (error) {
		console.error('Error retrieving tasks by IDs:', error)
		throw error
	}
}

const getUserCalendars = async ({ selectedWorkspace }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return []
		}

		const calendarsDb = nano.use(dbName)
		const docs = await calendarsDb.list({ include_docs: true })

		const allEvents = docs.rows
			.filter((r) => r.id.split('_')[0] !== 'shared')
			.filter((r) => r.id.split('_')[0] !== 'invitations')
			.filter((r) => r.id.split('_')[1] === selectedWorkspace)
			.flatMap((row) => row.doc.events || [])

		const calendars = await Promise.all(
			docs.rows
				.filter((r) => r.id.split('_')[0] !== 'shared')
				.filter((r) => r.id.split('_')[0] !== 'invitations')
				.filter((r) => r.id.split('_')[1] === selectedWorkspace)
				.map(async (row) => {
					const { _id, _rev, ...calendarData } = row.doc

					const importedEventsDetails = calendarData.importedEvents
						? calendarData.importedEvents
								.map((eventId) =>
									allEvents.find((event) => event.id === eventId)
								)
								.filter((event) => event !== undefined)
						: []

					const mergedEvents = [
						...(Array.isArray(calendarData.events) ? calendarData.events : []),
						...(Array.isArray(importedEventsDetails)
							? importedEventsDetails
							: []),
					]
					const attachedTasksData = await getTasksByIds({
						selectedWorkspace,
						taskIds: calendarData.attachedTasks || [],
					})

					return {
						...calendarData,
						events: mergedEvents,
						attachedTasksData,
					}
				})
		)

		return calendars
	} catch (error) {
		console.error('Error retrieving user calendars:', error)
		throw error
	}
}

const deleteCalendar = async ({ selectedWorkspace, calendarId }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return
		}

		const calendarsDb = nano.use(dbName)

		const calendarDoc = await calendarsDb.get(calendarId)

		const response = await calendarsDb.destroy(calendarId, calendarDoc._rev)

		return response
	} catch (error) {
		console.error('Error deleting calendar:', error)
		throw error
	}
}

const updateCalendar = async ({ selectedWorkspace, calendarId, toUpdate }) => {

	const dbName = 'db_calendars'
	const db = nano.db

	const dbList = await db.list()
	if (!dbList.includes(dbName)) {
		return
	}

	const calendarsDb = nano.use(dbName)

	const updateDocument = async () => {
		try {
			const calendarDoc = await calendarsDb.get(calendarId)

			const updatedCalendarDoc = {
				...calendarDoc,
				...toUpdate,
			}

			const response = await calendarsDb.insert(updatedCalendarDoc)

			if (response.ok) {
				const { _id, _rev, ...filteredResponse } = updatedCalendarDoc

				const attachedTasksData = await getTasksByIds({
					selectedWorkspace,
					taskIds: updatedCalendarDoc.attachedTasks || [],
				})

				const finalResponse = {
					...filteredResponse,
					attachedTasksData, 
				}

				return finalResponse
			} else {
				throw new Error(response.reason)
			}
		} catch (error) {
			if (error.statusCode === 409) {
				return updateDocument()
			} else {
				console.error('Error updating calendar:', error)
				throw error
			}
		}
	}

	return updateDocument()
}

const createEvent = async (
	{ selectedWorkspace, calendarId, eventData },
	maxRetries = 7,
	retryDelay = 300
) => {
	const dbName = 'db_calendars'
	const db = nano.db

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const dbList = await db.list()
			if (!dbList.includes(dbName)) {
				throw new Error('Database does not exist.')
			}

			const calendarsDb = nano.use(dbName)
			const calendarDoc = await calendarsDb.get(calendarId)

			let finalEventData = { ...eventData }
			finalEventData.id = uuidv4()

			const updatedEvents = [...calendarDoc.events, finalEventData]

			const updatedCalendarDoc = {
				...calendarDoc,
				events: updatedEvents,
			}

			await calendarsDb.insert(updatedCalendarDoc)

			return updatedEvents
		} catch (error) {
			console.error(`Error adding event on attempt ${attempt}:`, error)

			if (attempt === maxRetries) {
				console.error('Max retries reached. Failing...')
				throw error
			}

			await new Promise((resolve) => setTimeout(resolve, retryDelay))
		}
	}
}

const updateEvent = async ({ eventId, eventData }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			throw new Error('Database does not exist.')
		}

		const calendarsDb = nano.use(dbName)

		const { rows } = await calendarsDb.list({ include_docs: true })

		let calendarDoc = rows.find((row) =>
			row.doc.events.some((event) => event.id === eventId)
		)?.doc

		if (!calendarDoc) {
			throw new Error('Event not found.')
		}

		calendarDoc.events = calendarDoc.events.map((event) =>
			event.id === eventId ? { ...event, ...eventData } : event
		)

		const response = await calendarsDb.insert(calendarDoc)
		if (response.error) {
			throw new Error(response.reason)
		}

		return calendarDoc.events.filter((ev) => ev.id === eventId)[0]
	} catch (error) {
		console.error('Error updating event:', error)
		throw error
	}
}

const createSharedEvent = async ({ selectedWorkspace, eventData }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			throw new Error('Database does not exist.')
		}

		const calendarsDb = nano.use(dbName)
		const sharedDocId = `shared_${selectedWorkspace}`

		let sharedDoc
		try {
			sharedDoc = await calendarsDb.get(sharedDocId)
		} catch (error) {
			if (error.statusCode === 404) {
				sharedDoc = {
					_id: sharedDocId,
					selectedWorkspace,
					events: [], 
				}
			} else {
				throw error
			}
		}

		const finalEventData = {
			...eventData,
			id: uuidv4(),
		}

		const updatedEvents = [...sharedDoc.events, finalEventData]

		const updatedSharedDoc = {
			...sharedDoc,
			events: updatedEvents,
		}

		await calendarsDb.insert(updatedSharedDoc)

		return updatedEvents
	} catch (error) {
		console.error('Error adding shared event:', error)
		throw error
	}
}

const getCalendarEvents = async ({ selectedWorkspace, calendarId }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return []
		}

		const calendarsDb = nano.use(dbName)

		const calendarDoc = await calendarsDb.get(calendarId)
		if (!calendarDoc) {
			return []
		}

		const allDocs = await calendarsDb.list({ include_docs: true })

		const allEvents = allDocs.rows.flatMap((row) => row.doc.events || [])

		const calendarEvents = calendarDoc.events || []

		const importedEventsDetails = calendarDoc.importedEvents
			.map((eventId) => allEvents.find((event) => event.id === eventId))
			.filter((event) => event !== undefined)

		const finalEvents = [...calendarEvents, ...importedEventsDetails]

		return finalEvents
	} catch (error) {
		console.error('Error retrieving calendar events:', error)
		throw error
	}
}

const getUserSharedEvents = async ({ selectedWorkspace }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			throw new Error('Database does not exist.')
		}

		const calendarsDb = nano.use(dbName)
		const sharedDocId = `shared_${selectedWorkspace}`

		try {
			const sharedDoc = await calendarsDb.get(sharedDocId)

			return sharedDoc.events || []
		} catch (error) {
			if (error.statusCode === 404) {
				return []
			} else {
				throw error
			}
		}
	} catch (error) {
		console.error('Error retrieving shared events:', error)
		throw error
	}
}

const retryOperation = async (operation, maxRetries = 5, delay = 300) => {
	let attempts = 0
	while (attempts < maxRetries) {
		try {
			return await operation()
		} catch (error) {
			if (error.statusCode === 409 && attempts < maxRetries - 1) {
				attempts++
				await new Promise((resolve) => setTimeout(resolve, delay))
			} else {
				throw error
			}
		}
	}
}

const getUserWorkShifts = async ({ selectedWorkspace }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			throw new Error('Database does not exist.')
		}

		const calendarsDb = nano.use(dbName)
		const workShiftsDocId = `workShifts_${selectedWorkspace}`

		try {
			const workShiftsDoc = await retryOperation(() =>
				calendarsDb.get(workShiftsDocId)
			)

			const { _id, _rev, ...docContent } = workShiftsDoc
			return docContent
		} catch (error) {
			if (error.statusCode === 404) {
				const newDoc = {
					_id: workShiftsDocId,
					id: selectedWorkspace,
					workShifts: [],
				}

				await retryOperation(() => calendarsDb.insert(newDoc))

				const { _id, _rev, ...docContent } = newDoc
				return docContent
			} else {
				throw error
			}
		}
	} catch (error) {
		console.error('Error retrieving work shifts:', error)
		throw error
	}
}

const addUserWorkShift = async ({ selectedWorkspace, date, shift, lastActivityTime }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			throw new Error('Database does not exist.')
		}

		const calendarsDb = nano.use(dbName)
		const workShiftsDocId = `workShifts_${selectedWorkspace}`

		let workShiftsDoc
		try {
			workShiftsDoc = await retryOperation(() =>
				calendarsDb.get(workShiftsDocId)
			)
		} catch (error) {
			if (error.statusCode === 404) {
				workShiftsDoc = {
					_id: workShiftsDocId,
					id: selectedWorkspace,
					workShifts: [],
				}

				const insertResponse = await retryOperation(() =>
					calendarsDb.insert(workShiftsDoc)
				)
				workShiftsDoc._rev = insertResponse.rev
			} else {
				throw error
			}
		}

		let workShift = workShiftsDoc.workShifts.find((ws) => ws.date === date)

		if (!workShift) {
			workShift = {
				status: 'going',
				date,
				tasks: [],
				shifts: [],
				lastActivityTime,
			}
			workShiftsDoc.workShifts.push(workShift)
		} else {
			workShift.lastActivityTime = lastActivityTime
		}

		let nextShiftNumber = 1
		if (workShift.shifts.length > 0) {
			const lastShift = workShift.shifts[workShift.shifts.length - 1]
			nextShiftNumber = lastShift.number + 1
		}

		const newShift = {
			...shift,
			number: nextShiftNumber,
		}
		workShift.shifts.push(newShift)

		const updateResponse = await retryOperation(() =>
			calendarsDb.insert(workShiftsDoc)
		)
		workShiftsDoc._rev = updateResponse.rev

		const { _id, _rev, ...docContent } = workShiftsDoc
		return docContent
	} catch (error) {
		console.error('Error adding user work shift:', error)
		throw error
	}
}

const updateWorkShiftActivity = async ({ selectedWorkspace, date, lastActivityTime }) => {
	const dbName = 'db_calendars'
	const db = nano.db

	const dbList = await db.list()
	if (!dbList.includes(dbName)) {
		throw new Error('Database does not exist.')
	}

	const calendarsDb = nano.use(dbName)
	const workShiftsDocId = `workShifts_${selectedWorkspace}`

	let workShiftsDoc = await retryOperation(() =>
		calendarsDb.get(workShiftsDocId)
	)

	let workShift = workShiftsDoc.workShifts.find((ws) => ws.date === date)

	if (!workShift) {
		throw new Error(`Work shift for date ${date} not found.`)
	}

	workShift.lastActivityTime = lastActivityTime

	await retryOperation(() => calendarsDb.insert(workShiftsDoc))

	const { _id, _rev, ...docContent } = workShiftsDoc
	return docContent
}

const addTaskToWorkShift = async ({ selectedWorkspace, date, task, hour }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			throw new Error('Database does not exist.')
		}

		const calendarsDb = nano.use(dbName)
		const workShiftsDocId = `workShifts_${selectedWorkspace}`

		let workShiftsDoc = await retryOperation(() =>
			calendarsDb.get(workShiftsDocId)
		)

		let workShift = workShiftsDoc.workShifts.find((ws) => ws.date === date)

		if (!workShift) {
			throw new Error(`Work shift for date ${date} not found.`)
		}

		workShift.tasks.push({ hour, ...task })

		const updateResponse = await retryOperation(() =>
			calendarsDb.insert(workShiftsDoc)
		)
		workShiftsDoc._rev = updateResponse.rev

		const { _id, _rev, ...docContent } = workShiftsDoc
		return docContent
	} catch (error) {
		console.error('Error adding task to work shift:', error)
		throw error
	}
}

const removeTaskFromWorkShift = async ({ selectedWorkspace, date, taskId }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			throw new Error('Database does not exist.')
		}

		const calendarsDb = nano.use(dbName)
		const workShiftsDocId = `workShifts_${selectedWorkspace}`

		let workShiftsDoc = await retryOperation(() =>
			calendarsDb.get(workShiftsDocId)
		)

		let workShift = workShiftsDoc.workShifts.find((ws) => ws.date === date)

		if (!workShift) {
			throw new Error(`Work shift for date ${date} not found.`)
		}

		const taskIndex = workShift.tasks.findIndex((task) => task.id === taskId)

		if (taskIndex === -1) {
			throw new Error(`Task with id ${taskId} not found.`)
		}

		workShift.tasks.splice(taskIndex, 1)

		const updateResponse = await retryOperation(() =>
			calendarsDb.insert(workShiftsDoc)
		)
		workShiftsDoc._rev = updateResponse.rev

		const { _id, _rev, ...docContent } = workShiftsDoc
		return docContent
	} catch (error) {
		console.error('Error removing task from work shift:', error)
		throw error
	}
}

const deleteEvent = async ({ selectedWorkspace, calendarId, eventId }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			throw new Error(`Database ${dbName} does not exist.`)
		}

		const calendarsDb = nano.use(dbName)

		const calendarDoc = await calendarsDb.get(calendarId)

		const updatedEvents = calendarDoc.events.filter(
			(event) => event.id !== eventId
		)

		const updatedCalendarDoc = {
			...calendarDoc,
			events: updatedEvents,
		}

		await calendarsDb.insert(updatedCalendarDoc)

		return eventId
	} catch (error) {
		console.error('Error deleting event:', error)
		throw error
	}
}

const getRandomColor = () => {
	const letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

const checkForCalendarDB = async ({ selectedWorkspace, userEmail }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			await db.create(dbName)
		}

		const calendarsDb = nano.use(dbName)

		const docs = await calendarsDb.list({ include_docs: true })

		if (
			docs.rows.filter((cal) => cal.id.split('_')[1] === selectedWorkspace).length === 0
		) {

			const newCalendar = await createCalendar({
				selectedWorkspace,
				calendarData: {
					owner: userEmail,
					calendarName: userEmail,
					description: '',
					timezone: '(GMT+01:00) España - Madrid',
					language: 'Español',
					country: 'España',
					dateFormat: '31/12/2024',
					hourFormat: '1:00am',
					showSecondayTimezone: false,
					askToChangeTimezone: false,
					eventsDuration: 30,
					fastMeetings: false,
					guestPermissions: 'Ver lista de invitados',
					showWeekends: true,
					participants: [],
					importedEvents: [],
					attachedTasks: [],
					showDeniedEvents: false,
					workingHoursSettings: {},
					shareId: generateInvitationId(),
					showFinishedTasks: true,
					showWeekNumber: true,
					showShorterEventsAs30: false,
					lowerPastEventsBrightness: true,
					weekStartsAt: 'Lunes',
					defaultView: '2 días',
					showEventsCreatedByAythen: true,
					emailEventsPrivacy: 'Calendario por defecto',
					enableWorkSchedule: false,
					createAppointmentsCalendarInsteadOfAvailableHours: false,
					publicCalendar: false,
					publicSharing: false,
					shareWithAythen: true,
					enableSideBySide: false,
					showCalendarInfoOnOtherAythenApps: true,
					events: [],
					calendarColor: getRandomColor(),
					calendarEventsReminder: 10,
					calendarNotifications: {
						newEvents: false,
						modifiedEvents: false,
						canceledEvents: false,
						invitationsAnswers: false,
						dailySchedule: false, 
					},
					previewSettings: {
						showTitle: true,
						showNavButtons: true,
						showDate: true,
						showPrint: true,
						showTabs: true,
						showCalendarsList: true,
						showTimezone: true,
						backgroundColor: 'default',
						border: true,
						defaultCalendar: 'Mes',
						weekStarts: 'Lunes',
						timezone: 'default',
						language: 'default',
					},
				},
				def: true,
			})
			const { _id, _rev, ...calendarData } = newCalendar
			return [calendarData]
		} else {
			const calendars = docs.rows
				.filter((cal) => cal.id.split('_')[1] === selectedWorkspace)
				.map((row) => {
					const { _id, _rev, ...calendarData } = row.doc
					return calendarData
				})
			return calendars
		}
	} catch (error) {
		console.error('Error managing calendars database:', error)
		throw error
	}
}

const getEventDataByJoinId = async ({ joinId }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return null
		}

		const calendarsDb = nano.use(dbName)
		const docs = await calendarsDb.list({ include_docs: true })

		for (const row of docs.rows) {
			const calendar = row.doc
			const event = calendar.events.find((e) => e.joinId === joinId)

			if (event) {
				return event
			}
		}

		return null
	} catch (error) {
		console.error('Error retrieving event data by joinId:', error)
		throw error
	}
}

const getCalendarByShareId = async ({ shareId }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return null
		}

		const calendarsDb = nano.use(dbName)
		const docs = await calendarsDb.list({ include_docs: true })

		for (const row of docs.rows) {
			const calendar = row.doc
			if (calendar.shareId === shareId) {
				return calendar
			}
		}

		return null
	} catch (error) {
		console.error('Error retrieving calendar by shareId:', error)
		throw error
	}
}

const getAllUserPendingInvitations = async ({ selectedWorkspace }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return []
		}

		const calendarsDb = nano.use(dbName)

		const docs = await calendarsDb.list({ include_docs: true })

		let pendingEvents = []

		docs.rows.forEach((row) => {
			const { events } = row.doc

			if (events && Array.isArray(events)) {
				const userPendingEvents = events.filter(
					(event) =>
						event.invitedUsers &&
						event.invitedUsers.some(
							(invitedUser) =>
								invitedUser.id === selectedWorkspace && invitedUser.status === 'pending'
						)
				)

				pendingEvents = pendingEvents.concat(userPendingEvents)
			}
		})

		return pendingEvents
	} catch (error) {
		console.error('Error retrieving pending invitations:', error)
		throw error
	}
}

const acceptInvitation = async ({ selectedWorkspace, eventId }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return
		}

		const calendarsDb = nano.use(dbName)
		const docs = await calendarsDb.list({ include_docs: true })

		for (const row of docs.rows) {
			const calendar = row.doc
			const event = calendar.events.find((e) => e.id === eventId)

			if (event) {
				const invitedUser = event.invitedUsers.find(
					(user) => user.id === selectedWorkspace
				)

				if (invitedUser) {
					invitedUser.status = 'accepted'

					const participantExists = event.participants.some(
						(participant) => participant.id === selectedWorkspace
					)
					if (!participantExists) {
						event.participants.push(invitedUser)
					}

					await calendarsDb.insert(calendar)

					const invitationsDocId = `invitations_${selectedWorkspace}`
					let invitationsDoc

					try {
						invitationsDoc = await calendarsDb.get(invitationsDocId)
					} catch (error) {
						if (error.statusCode === 404) {
							invitationsDoc = {
								_id: invitationsDocId,
								selectedWorkspace,
								eventsInvitations: [],
							}
						} else {
							throw error
						}
					}

					const existingInvitation = invitationsDoc.eventsInvitations.find(
						(invitation) => invitation.eventId === eventId
					)

					if (existingInvitation) {
						existingInvitation.response = 'accepted'
					} else {
						invitationsDoc.eventsInvitations.push({
							eventId,
							response: 'accepted',
						})
					}

					await calendarsDb.insert(invitationsDoc)

					return
				}
			}
		}

	} catch (error) {
		console.error('Error accepting invitation:', error)
		throw error
	}
}

const cancelInvitation = async ({ selectedWorkspace, eventId }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return
		}

		const calendarsDb = nano.use(dbName)
		const docs = await calendarsDb.list({ include_docs: true })

		for (const row of docs.rows) {
			const calendar = row.doc
			const event = calendar.events.find((e) => e.id === eventId)

			if (event) {
				const invitedUser = event.invitedUsers.find(
					(user) => user.id === selectedWorkspace
				)

				if (invitedUser) {
					invitedUser.status = 'denied'

					await calendarsDb.insert(calendar)

					const invitationsDocId = `invitations_${selectedWorkspace}`
					let invitationsDoc

					try {
						invitationsDoc = await calendarsDb.get(invitationsDocId)
					} catch (error) {
						if (error.statusCode === 404) {	
							invitationsDoc = {
								_id: invitationsDocId,
								selectedWorkspace,
								eventsInvitations: [],
							}
						} else {
							throw error
						}
					}

					const existingInvitation = invitationsDoc.eventsInvitations.find(
						(invitation) => invitation.eventId === eventId
					)

					if (existingInvitation) {
						existingInvitation.response = 'denied'
					} else {
						invitationsDoc.eventsInvitations.push({
							eventId,
							response: 'denied',
						})
					}

					await calendarsDb.insert(invitationsDoc)

					return
				}
			}
		}

	} catch (error) {
		console.error('Error denying invitation:', error)
		throw error
	}
}

const getAcceptedInvitationsEvents = async ({ selectedWorkspace }) => {
	try {
		const dbName = 'db_calendars'
		const db = nano.db

		const dbList = await db.list()
		if (!dbList.includes(dbName)) {
			return []
		}

		const calendarsDb = nano.use(dbName)
		const invitationsDocId = `invitations_${selectedWorkspace}`

		let invitationsDoc
		try {
			invitationsDoc = await calendarsDb.get(invitationsDocId)
		} catch (error) {
			if (error.statusCode === 404) {
				return []
			} else {
				throw error
			}
		}

		const acceptedInvitations = invitationsDoc.eventsInvitations

		const acceptedEventIds = acceptedInvitations.map(
			(invitation) => invitation.eventId
		)

		const docs = await calendarsDb.list({ include_docs: true })
		const acceptedEvents = []

		for (const row of docs.rows) {
			const calendar = row.doc

			for (const eventId of acceptedEventIds) {
				if (calendar.events) {
					const event = calendar.events.find((e) => e.id === eventId)
					const response = acceptedInvitations.filter(
						(inv) => inv.eventId === eventId
					)[0].response
					if (event) {
						acceptedEvents.push({ ...event, invited: true, response })
					}
				}
			}
		}

		return acceptedEvents
	} catch (error) {
		console.error('Error retrieving accepted invitation events:', error)
		throw error
	}
}


module.exports = {
	createCalendar: createCalendar,
	getUserCalendars: getUserCalendars,
	deleteCalendar: deleteCalendar,
	updateCalendar: updateCalendar,
	createEvent: createEvent,
	updateEvent: updateEvent,
	createSharedEvent: createSharedEvent,
	getCalendarEvents: getCalendarEvents,
	deleteEvent: deleteEvent,
	getUserSharedEvents: getUserSharedEvents,
	checkForCalendarDB: checkForCalendarDB,
	cancelInvitation: cancelInvitation,
	acceptInvitation: acceptInvitation,
	getAllUserPendingInvitations: getAllUserPendingInvitations,
	getEventDataByJoinId: getEventDataByJoinId,
	getCalendarByShareId: getCalendarByShareId,
	getUserWorkShifts: getUserWorkShifts,
	getAcceptedInvitationsEvents: getAcceptedInvitationsEvents,
	addUserWorkShift: addUserWorkShift,
	addTaskToWorkShift: addTaskToWorkShift,
	removeTaskFromWorkShift: removeTaskFromWorkShift,
	updateWorkShiftActivity: updateWorkShiftActivity,
}
