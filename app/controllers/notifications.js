const webpush = require('web-push');
const { connectDB } = require("./utils");

const { catchedAsync } = require("../utils/err");


const vapidKeys = {
    publicKey: 'BDULC8Zkoa2EVdJZn-CMkJAYbPWDzAhON8l00yvhOIQLyx7auPzCptaVZFz9ZabWq7SFT_oIWbTWe3Cj31bbENQ',
    privateKey: 'b3daa92zFnWZ24xuid8pdGV-hQ3MveFmKaiJ9oqgOFE'
}


webpush.setVapidDetails(
  'mailto:tu@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendTestNotification = async (req, res) => {
  try {
    const { subscription, title, body, icon } = req.body;

    const payload = JSON.stringify({
      title: 'Test Notification',
      body: 'This is a test notification'
    });


    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ message: 'Notificación enviada' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getVapidPublicKey = (req, res) => {
  res.send(vapidKeys.publicKey);
};

const updateViewNotification = async (req, res) => {
  try {
    const { user } = req;
    const { notificationId } = req.body;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);
    const docNotifications = await dbNotifications.get(notificationId);

    if (docNotifications?.status === 'viewed') {
      res.status(200).json({ success: true, message: 'Notificación ya ha sido actualizada' });
      return;
    }
    const dataNew = {
      ...docNotifications,
      status: 'viewed',
      viewTime: new Date().toISOString()
    }

    await dbNotifications.insert(dataNew);

    res.status(200).json({ success: true, message: 'Notificación vista' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, code: '255' });
  }
};

const getNotificationsStatusNotViewed = async (req, res) => {
  try {
    const { user } = req;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);
    const notifications = await dbNotifications.find({
      selector: {
        $or: [
          { status: { $ne: 'viewed' } },
          { status: { $exists: false } }
        ]
      }
    });

    res.status(200).json({ success: true, notifications });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message, code: '256' });
  }
}












const updateSubscriptionController = async (req, res) => {
  try {
    const user = req.user;
    const { subscription, deviceInfo } = req.body;

    const db = await connectDB(`db_accounts`);

    const account = await db.get(user._id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada"
      });
    }


    if (!account.subscription) {
      account.subscription = [];
    }

    const index = account.subscription.findIndex(item => item.keys.endpoint === subscription.endpoint);

    if (index !== -1) {
      return res.status(200).json({
        success: false,
        message: "Suscripción ya existe"
      });
    }



    account.subscription.push({ keys: subscription, deviceInfo });



    const result = await db.insert(account);

    return res.status(200).json({
      success: true,
      message: "Suscripción actualizada correctamente"
    });
  } catch (error) {
    console.error("Error actualizando la suscripción:", error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la suscripción"
    });
  }
};


const deleteSubscriptionController = async (req, res) => {
  try {
    const user = req.user;
    const { endpoint } = req.body;

    const db = await connectDB(`db_accounts`);

    const account = await db.get(user._id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada"
      });
    }

    const index = account.subscription.findIndex(item => item.keys.endpoint === endpoint);


    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Suscripción no encontrada"
      });
    }

    let newSubscription = account.subscription.filter(item => item.keys.endpoint !== endpoint);


    account.subscription = newSubscription;

    const result = await db.insert(account);

    return res.status(200).json({
      success: true,
      message: "Suscripción eliminada correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar la suscripción:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la suscripción"
    });
  }
};


const addSubscriptionController = async (req, res) => {
  try {
    const user = req.user;

    const { title, message } = req.body;


    const payload = JSON.stringify({
      title: "¡Hola!",
      body: "Tienes una nueva notificación",
      icon: "/icon.png",
      data: { url: 'https://tusitio.com/ofertas' }
    });


    const db = await connectDB(`db_accounts`);

    const account = await db.get(user._id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada"
      });
    }

    for (const sub of account.subscription) {
      const resp = await webpush.sendNotification(sub.keys, payload);
    }

    return res.status(200).json({
      success: true,
      message: "Suscripción agregada correctamente"
    });
  } catch (error) {
    console.error("Error al agregar la suscripción:", error);
    return res.status(500).json({
      success: false,
      message: "Error al agregar la suscripción"
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { user } = req;
    const { notification } = req.body;
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
  }

}


const sendNotification = async (req, res) => {
  try {
    const { user } = req;
    const { notification } = req.body;
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
  }
}




module.exports = {
  sendTestNotification: sendTestNotification,
  getVapidPublicKey: getVapidPublicKey,
  updateViewNotification: updateViewNotification,
  getNotificationsStatusNotViewed: getNotificationsStatusNotViewed,

  updateSubscriptionController: updateSubscriptionController,
  deleteSubscriptionController: deleteSubscriptionController,
  addSubscriptionController: addSubscriptionController,

  sendNotification: sendNotification,
  deleteNotification: deleteNotification,

};
