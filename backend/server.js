require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const database_connection = require("./config/database");

const authentication_routes = require("./routes/authentication_routes");
const user_routes = require("./routes/user_routes");
const job_routes = require("./routes/job_routes");
const application_routes = require("./routes/application_routes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

database_connection();

app.use(express.json());

app.use("/api/authentication", authentication_routes);
app.use("/api/user", user_routes);
app.use("/api/jobs", job_routes);
app.use("/api/applications", application_routes);

app.use("/storage", express.static(path.join(__dirname, "storage"), {}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
