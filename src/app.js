const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const connectDB = require("./database");
const authRoutes = require("./routes/authRoutes");
const app = express();
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const {sendEmail} = require("./utils/notification_sender");
//Database connection
connectDB();

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false, //disable cross origin resource policy
  })
);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Routes
app.use("/api", auth, routes);
app.use("/auth", authRoutes);
app.post("/send-notification", async (req, res, next) => {
  const { email, subject, message } = req.body;

  try {
    await sendEmail(email, subject, message);
    res.json({ message: "Email sent" });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});
app.use("/uploads", express.static("uploads"));

// Error handling
app.use(errorHandler);

module.exports = app;
