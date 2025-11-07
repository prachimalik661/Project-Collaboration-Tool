const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const initPassport = require("./config/passport");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const activityRoutes = require("./routes/activityRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

initPassport(passport);
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/activity", activityRoutes);

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () =>{
  console.log("Server running on port: "+ PORT);
});