const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotification = onRequest(async (req, res) => {
  const {notification, data} = req.body;
  const message = {
    notification: notification,
    data: data,
    topic: "volunteers"
  };
  
  try {
    await admin.messaging().send(message);
    res.json({success: true});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
