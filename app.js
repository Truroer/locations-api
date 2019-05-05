const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const locationsRoutes = require("./routes/locations");
const userRoutes = require("./routes/user");

//Body parser for post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongoose connection to mongoDB.com
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${
    process.env.MONGO_ATLAS_PASSWORD
  }@cluster0-o1t8l.mongodb.net/test?retryWrites=true`,
  { useNewUrlParser: true }
);

//Console logging middleware
app.use(morgan("dev"));

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
app.use("/user", userRoutes);

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
