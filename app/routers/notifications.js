const express = require('express');
const router = express.Router();
const {authenticateToken} = require("../middlewares/auth/auth");
const {catchedAsync} = require("../utils/err");

const { 
    sendTestNotification, 
    getVapidPublicKey, 
    updateViewNotification, 
    getNotificationsStatusNotViewed,

    updateSubscriptionController,
    deleteSubscriptionController,
    addSubscriptionController,


    sendNotification,
    deleteNotification,
    // getNotificationsStatusNotViewed

} = require('../controllers/notifications');


router
.post('/send-test', sendTestNotification)
.put('/view-notification',authenticateToken, catchedAsync(updateViewNotification))
.get('/get-notifications-status-viewed', authenticateToken, catchedAsync(getNotificationsStatusNotViewed))
.post('/get-notifications-status-not-viewed', authenticateToken, catchedAsync(getNotificationsStatusNotViewed))


// new
.post('/send-notification', authenticateToken, catchedAsync(sendNotification))
.post('/delete-notification', authenticateToken, catchedAsync(deleteNotification))



.get('/vapidPublicKey', getVapidPublicKey)
.post("/update-subscription", authenticateToken, updateSubscriptionController)
.post("/delete-subscription", authenticateToken, deleteSubscriptionController)
.post("/addSubscription", authenticateToken, addSubscriptionController)
module.exports = router;
