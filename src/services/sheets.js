export const fetchRequests = async (accessToken) => {
  const SHEET_ID = import.meta.env.VITE_SHEET_ID_REQUESTS;
  const range = "Sheet1!A2:E";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.values;
};

export const submitLog = async (studentId, accessToken) => {
  const timestamp = new Date().toLocaleString();
  const SHEET_2_ID = import.meta.env.VITE_SHEET_ID_LOGS;
  
  const body = {
    values: [[studentId, timestamp, "Completed"]]
  };

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_2_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
};
