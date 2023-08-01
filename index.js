// Import packages
const express = require("express");
const cors = require("cors");
const api = require("./routes/api");

// Middlewares
const app = express();
app.use(express.json());
app.use(cors())

// Routes
app.use("/api", api);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
