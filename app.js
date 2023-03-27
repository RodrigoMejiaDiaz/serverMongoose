const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// routes
const rutasLogin = require("./routes/api/login");
const routes = require("./routes/api/rutas");

const app = express();

//Connect Database
connectDB();

//cors
app.use(cors({ origin: true, credentials: true }));

//init Middleware
app.use(express.json({ extended: false }));

//use Routes
app.use("/api", routes, rutasLogin);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
