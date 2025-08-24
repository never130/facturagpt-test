const { Router } = require('express')
const routerKanban = Router()

const { authenticateToken } = require('../middlewares/auth/auth')

const {
	createIdeaKanban,

	addKanban,
	updateKanban,

	deleteKanban,

	fetchKanban,
	fetchsKanban,

	fetchChat,
	addChat,
	addTicket,
	addTask,
	deleteTicket,
	deleteTask,
	updateTask,
	updateTicket,
} = require('../controllers/kanban')

routerKanban
	.post('/idea', authenticateToken, createIdeaKanban)

	.post('/add', authenticateToken, addKanban)
	.post('/addTicket', authenticateToken, addTicket)
	.post('/addTask', authenticateToken, addTask)
	.put('/updateTicket', authenticateToken, updateTicket)
	.put('/updateTask', authenticateToken, updateTask)

	.delete('/', authenticateToken, deleteKanban)
	.delete('/deleteTicket', authenticateToken, deleteTicket)
	.delete('/deleteTask', authenticateToken, deleteTask)
	.post('/', authenticateToken, fetchKanban)
	.post('/all', authenticateToken, fetchsKanban)

	
	.get('/chat/:kanbanId/:taskId', authenticateToken, fetchChat)
	.post('/chat', authenticateToken, addChat)

module.exports = routerKanban
