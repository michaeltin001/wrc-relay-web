const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { google } = require("googleapis");
const admin = require("firebase-admin");

admin.initializeApp();

exports.logStudentId = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in.");
  }
  const userEmail = request.auth.token.email;
  const { studentId } = request.data;
  const SHEET_ID = process.env.SHEET_ID_LOGS;

  const auth = new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.metadata.readonly"
    ],
  });
  
  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  try {
    const permissions = await drive.permissions.list({
      fileId: SHEET_ID,
      fields: "permissions(emailAddress, role)",
    });

    const isAuthorized = permissions.data.permissions.some(
      (p) => 
        p.emailAddress === userEmail && 
        (p.role === "editor" || p.role === "owner")
    );

    if (!isAuthorized) {
      throw new HttpsError("permission-denied", "You do not have access to this Sheet.");
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[studentId, new Date().toLocaleString(), "Completed"]],
      },
    });

    return { success: true };

  } catch (error) {
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", error.message);
  }
});

exports.sendNotification = onRequest(async (req, res) => {
  const { notification, data } = req.body;
  
  const message = {
    notification: notification,
    data: data,
    topic: "volunteers"
  };
  
  try {
    await admin.messaging().send(message);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: error.message });
  }
});
