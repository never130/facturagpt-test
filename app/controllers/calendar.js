const {
	createCalendar,
	getUserCalendars,
	deleteCalendar,
	createEvent,
	getCalendarEvents,
	deleteEvent,
	checkForCalendarDB,
	cancelInvitation,
	acceptInvitation,
	getEventDataByJoinId,
	getAllUserPendingInvitations,
	updateCalendar,
	getCalendarByShareId,
	createSharedEvent,
	getUserSharedEvents,
	updateEvent,
	getAcceptedInvitationsEvents,
	getUserWorkShifts,
	addUserWorkShift,
	addTaskToWorkShift,
	removeTaskFromWorkShift,
	updateWorkShiftActivity,
} = require('../services/calendar')
const { sendInvitationEmail } = require('../services/email')
const { catchedAsync } = require('../utils/err')

const createCalendarController = async (req, res) => {
	try {
		const { calendarData, def } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

		const resp = await createCalendar({ selectedWorkspace, calendarData, def })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on createCalendarController', err)
		return res.status(500).send('Error on createCalendarController')
	}
}

const getUserCalendarsController = async (req, res) => {
	try {
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await getUserCalendars({ selectedWorkspace })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on getUserCalendarsController', err)
		return res.status(500).send('Error on getUserCalendarsController')
	}
}

const getUserWorkShiftsController = async (req, res) => {
	try {	
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await getUserWorkShifts({ userId: selectedWorkspace })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on getUserWorkShiftsController', err)
		return res.status(500).send('Error on getUserWorkShiftsController')
	}
}
const addUserWorkShiftController = async (req, res) => {
	try {
		const { date, shift, lastActivityTime } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await addUserWorkShift({
			userId: selectedWorkspace,
			date,
			shift,
			lastActivityTime,
		})

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on addUserWorkShiftController', err)
		return res.status(500).send('Error on addUserWorkShiftController')
	}
}

const updateWorkShiftActivityController = async (req, res) => {
	try {
		const { date, shift, lastActivityTime } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await updateWorkShiftActivity({
			selectedWorkspace,
			date,
			shift,
			lastActivityTime,
		})

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on updateWorkShiftActivityController', err)
		return res.status(500).send('Error on updateWorkShiftActivityController')
	}
}
const addTaskToWorkShiftController = async (req, res) => {
	try {
		const { date, task, hour } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await addTaskToWorkShift({ selectedWorkspace, date, task, hour })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on addTaskToWorkShiftController', err)
		return res.status(500).send('Error on addTaskToWorkShiftController')
	}
}
const removeTaskFromWorkShiftController = async (req, res) => {
	try {
		const { date, taskId } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await removeTaskFromWorkShift({ selectedWorkspace, date, taskId })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on removeTaskFromWorkShiftController', err)
		return res.status(500).send('Error on removeTaskFromWorkShiftController')
	}
}

const deleteCalendarController = async (req, res) => {
	try {
		const { userId, calendarId } = req.body
		const resp = await deleteCalendar({ userId, calendarId })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on deleteCalendarController', err)
		return res.status(500).send('Error on deleteCalendarController')
	}
}

const updateCalendarController = async (req, res) => {
	try {
		const { calendarId, toUpdate } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await updateCalendar({ selectedWorkspace, calendarId, toUpdate })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on updateCalendarController', err)
		return res.status(500).send('Error on updateCalendarController')
	}
}

const updateEventController = async (req, res) => {
	try {
		const { eventId, eventData } = req.body
		const resp = await updateEvent({ eventId, eventData })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on updateEventController', err)
		return res.status(500).send('Error on updateEventController')
	}
}

const createEventController = async (req, res) => {
	try {
		const { calendarId, eventData } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await createEvent({ selectedWorkspace, calendarId, eventData })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on createEventController', err)
		return res.status(500).send('Error on createEventController')
	}
}

const createSharedEventController = async (req, res) => {
	try {
		const { calendarsIds, eventData } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await createSharedEvent({ selectedWorkspace, calendarsIds, eventData })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on createSharedEventController', err)
		return res.status(500).send('Error on createSharedEventController')
	}
}

const getCalendarEventsController = async (req, res) => {
	try {
		const { calendarId } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await getCalendarEvents({ selectedWorkspace, calendarId })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on getCalendarEventsController', err)
		return res.status(500).send('Error on getCalendarEventsController')
	}
}
const getUserSharedEventsController = async (req, res) => {
	try {
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await getUserSharedEvents({ selectedWorkspace })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on getUserSharedEventsController', err)
		return res.status(500).send('Error on getUserSharedEventsController')
	}
}

const deleteEventController = async (req, res) => {
	try {
		const { calendarId, eventId } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await deleteEvent({ selectedWorkspace, calendarId, eventId })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on deleteEventController', err)
		return res.status(500).send('Error on deleteEventController')
	}
}

const checkForCalendarDBController = async (req, res) => {
	try {
		const { userEmail } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await checkForCalendarDB({ selectedWorkspace, userEmail })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on checkForCalendarDBController', err)
		return res.status(500).send('Error on checkForCalendarDBController')
	}
}

const getAllUserPendingInvitationsController = async (req, res) => {
	try {
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await getAllUserPendingInvitations({ selectedWorkspace })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on getAllUserPendingInvitationsController', err)
		return res
			.status(500)
			.send('Error on getAllUserPendingInvitationsController')
	}
}

const getEventDataByJoinIdController = async (req, res) => {
	try {
		const { joinId } = req.body
		const resp = await getEventDataByJoinId({ joinId })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on getEventDataByJoinIdController', err)
		return res.status(500).send('Error on getEventDataByJoinIdController')
	}
}

const getCalendarByShareIdController = async (req, res) => {
	try {
		const { shareId } = req.body
		const resp = await getCalendarByShareId({ shareId })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on getCalendarByShareIdController', err)
		return res.status(500).send('Error on getCalendarByShareIdController')
	}
}

const acceptInvitationController = async (req, res) => {
	try {
		const { eventId } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await acceptInvitation({ selectedWorkspace, eventId })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on acceptInvitationController', err)
		return res.status(500).send('Error on acceptInvitationController')
	}
}

const cancelInvitationController = async (req, res) => {
	try {
		const { eventId } = req.body
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await cancelInvitation({ selectedWorkspace, eventId })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on cancelInvitationController', err)
		return res.status(500).send('Error on cancelInvitationController')
	}
}
const sendInvitationEmailController = async (req, res) => {
	try {
		const { email, data } = req.body
		const resp = await sendInvitationEmail({ email, data })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on sendInvitationEmailController', err)
		return res.status(500).send('Error on sendInvitationEmailController')
	}
}

const getAcceptedInvitationsEventsController = async (req, res) => {
	try {
		const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
		const resp = await getAcceptedInvitationsEvents({ selectedWorkspace })

		return res.status(200).send(resp)
	} catch (err) {
		console.error('Error on getAcceptedInvitationsEventsController', err)
		return res
			.status(500)
			.send('Error on getAcceptedInvitationsEventsController')
	}
}
module.exports = {
	createCalendarController: catchedAsync(createCalendarController),
	getUserCalendarsController: catchedAsync(getUserCalendarsController),
	updateCalendarController: catchedAsync(updateCalendarController),
	deleteCalendarController: catchedAsync(deleteCalendarController),

	getCalendarEventsController: catchedAsync(getCalendarEventsController),
	createEventController: catchedAsync(createEventController),
	createSharedEventController: catchedAsync(createSharedEventController),
	getUserSharedEventsController: catchedAsync(getUserSharedEventsController),
	deleteEventController: catchedAsync(deleteEventController),
	checkForCalendarDBController: catchedAsync(checkForCalendarDBController),
	getEventDataByJoinIdController: catchedAsync(getEventDataByJoinIdController),
	getAllUserPendingInvitationsController: catchedAsync(
		getAllUserPendingInvitationsController
	),
	updateEventController: catchedAsync(updateEventController),
	acceptInvitationController: catchedAsync(acceptInvitationController),
	cancelInvitationController: catchedAsync(cancelInvitationController),
	getCalendarByShareIdController: catchedAsync(getCalendarByShareIdController),
	sendInvitationEmailController: catchedAsync(sendInvitationEmailController),
	getAcceptedInvitationsEventsController: catchedAsync(
		getAcceptedInvitationsEventsController
	),
	getUserWorkShiftsController: catchedAsync(getUserWorkShiftsController),
	removeTaskFromWorkShiftController: catchedAsync(
		removeTaskFromWorkShiftController
	),
	addTaskToWorkShiftController: catchedAsync(addTaskToWorkShiftController),
	addUserWorkShiftController: catchedAsync(addUserWorkShiftController),
	updateWorkShiftActivityController: catchedAsync(
		updateWorkShiftActivityController
	),
}
