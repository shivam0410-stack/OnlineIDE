const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./api/routes/user");
const compileRoute = require("./api/routes/compileRoute");
mongoose.connect(
  "mongodb+srv://" +
    process.env.mongoUser +
    ":" +
    process.env.mongoPass +
    "cluster0.aj0dc.mongodb.net/IDE",
  {
    useNewUrlParser: true,
  }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Cors error handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,GET,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/user", userRoutes);
app.use("/compileRoute", compileRoute);
//Error Handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.starus || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
