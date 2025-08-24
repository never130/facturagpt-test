const { Router } = require('express')
const calendarRouter = Router()

const { authenticateToken } = require('../middlewares/auth/auth')


const {
	deleteEventController,
	getCalendarEventsController,
	createEventController,
	deleteCalendarController,
	getUserCalendarsController,
	createCalendarController,
	checkForCalendarDBController,
	getAllUserPendingInvitationsController,
	getEventDataByJoinIdController,
	acceptInvitationController,
	cancelInvitationController,
	updateCalendarController,
	getCalendarByShareIdController,
	sendInvitationEmailController,
	createSharedEventController,
	getUserSharedEventsController,
	updateEventController,
	getAcceptedInvitationsEventsController,
	getUserWorkShiftsController,
	addUserWorkShiftController,
	addTaskToWorkShiftController,
	removeTaskFromWorkShiftController,
	updateWorkShiftActivityController,
} = require('../controllers/calendar')

calendarRouter.post('/createCalendar', authenticateToken, createCalendarController)
calendarRouter.post('/getUserCalendars', authenticateToken, getUserCalendarsController)
calendarRouter.post('/deleteCalendar', authenticateToken, deleteCalendarController)
calendarRouter.post('/updateCalendar', authenticateToken, updateCalendarController)
calendarRouter.post('/createEvent', authenticateToken, createEventController)
calendarRouter.post('/updateEvent', authenticateToken, updateEventController)
calendarRouter.post('/createSharedEvent', authenticateToken, createSharedEventController)
calendarRouter.post('/getCalendarEvents', authenticateToken, getCalendarEventsController)
calendarRouter.post('/getUserSharedEvents', authenticateToken, getUserSharedEventsController)
calendarRouter.post('/deleteEvent', authenticateToken, deleteEventController)
calendarRouter.post('/checkForCalendarDB', authenticateToken, checkForCalendarDBController)
calendarRouter.post('/getAllUserPendingInvitations', authenticateToken, getAllUserPendingInvitationsController)
calendarRouter.post('/getEventDataByJoinId', authenticateToken, getEventDataByJoinIdController)
calendarRouter.post('/getCalendarByShareId', authenticateToken, getCalendarByShareIdController)
calendarRouter.post('/acceptInvitation', authenticateToken, acceptInvitationController)
calendarRouter.post('/cancelInvitation', authenticateToken, cancelInvitationController)
calendarRouter.post('/sendInvitationEmail', authenticateToken, sendInvitationEmailController)
calendarRouter.post('/getAcceptedInvitations', authenticateToken, getAcceptedInvitationsEventsController)
calendarRouter.post('/getUserWorkShifts', authenticateToken, getUserWorkShiftsController)
calendarRouter.post('/addUserWorkShift', authenticateToken, addUserWorkShiftController)
calendarRouter.post('/addTaskToWorkShift', authenticateToken, addTaskToWorkShiftController)
calendarRouter.post('/removeTaskFromWorkShift', authenticateToken, removeTaskFromWorkShiftController)
calendarRouter.post('/updateWorkShiftActivity', authenticateToken, updateWorkShiftActivityController)

module.exports = calendarRouter
