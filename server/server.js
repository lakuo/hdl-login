const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Configure JWT client
const jwtClient = new google.auth.JWT(
  googleCredentials.client_email,
  null,
  googleCredentials.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

// Initialize Google Sheets API
const sheets = google.sheets({ version: "v4" });

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.error("Error making JWT client authorize:", err);
    return;
  } else {
    console.log("Successfully connected to Google Sheets!");
  }
});

const spreadsheetId = "18xetLpL9mGBKzEOpGvuW7CH3h7mwjMdkAst8Nm4v7gM"; // Replace with your actual spreadsheet ID

// Helper function to parse the date in "month-day" format
const parseDate = (dateString) => {
  const parts = dateString.split("-");
  return new Date(new Date().getFullYear(), parts[0] - 1, parts[1]);
};

// Endpoint to get a random login
app.get("/api/random-login", async (req, res) => {
  try {
    const range = "Sheet1!A2:C"; // Adjust if your Google Sheet has a different name or range
    const response = await sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const logins = response.data.values;
    const validLogins = logins.filter((row) => {
      const lastUsedDate = parseDate(row[2]);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return lastUsedDate < sevenDaysAgo;
    });

    if (validLogins.length === 0) {
      return res.status(404).send("No available logins");
    }

    const randomIndex = Math.floor(Math.random() * validLogins.length);
    const randomLogin = validLogins[randomIndex];
    res.json({
      email: randomLogin[0],
      password: randomLogin[1],
      lastUsed: randomLogin[2],
    });
  } catch (error) {
    console.error("Error fetching logins:", error);
    res.status(500).send("Error fetching logins");
  }
});

// Endpoint to mark a login as used
app.post("/api/mark-used", async (req, res) => {
  try {
    const { email } = req.body;
    const range = "Sheet1!A2:C"; // Adjust if your Google Sheet has a different name or range
    const response = await sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const logins = response.data.values;
    const rowIndex = logins.findIndex((row) => row[0] === email) + 2; // Adding 2 because array is 0 indexed and header is not counted
    if (rowIndex < 2) {
      return res.status(404).send("Login not found");
    }

    const updatedRange = `Sheet1!C${rowIndex}`;
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}-${today.getDate()}`;

    await sheets.spreadsheets.values.update({
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: updatedRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[formattedDate]],
      },
    });

    res.send("Login marked as used");
  } catch (error) {
    console.error("Error marking login as used:", error);
    res.status(500).send("Error marking login as used");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
