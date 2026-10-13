
const express = require("express");
const cors = require("cors");
const db = require("./models");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobOpeningRoutes = require("./routes/jobOpeningRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobOpeningRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Campus Placement & Interview Tracker API is running!"
  });
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL database connected successfully!");

    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });
