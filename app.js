const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const locationsRoutes = require("./routes/locations");

//Console logging middleware
app.use(morgan("dev"));

//Body parser for post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    req.header("Access-Control-Allow-Methods", "GET, POST");
    return res.status(200).json({});
  }
  next();
});

//Routes to handle requests
app.use("/locations", locationsRoutes);

//Error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
