require('dotenv').config({ path: '../expenseapppassword/.env' });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./utils/database");

// Import routes
const userRoutes = require("./routes/user");
const donationRoutes = require("./routes/donation");
const charityRoutes = require("./routes/charity");
const projectRoutes = require("./routes/project");
const reportRoutes = require("./routes/report");
const downloadRoutes = require("./routes/download");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files like JS, CSS

// Routes
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/", downloadRoutes);

// Serve the HTML file for the registration and login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database connection
async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    await db.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
