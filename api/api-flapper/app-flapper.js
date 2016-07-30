'use strict';

//================= libraries ==================
var express = require("express");
var jsonParser = require("body-parser").json;
var logger = require("morgan");
//===============================================

//=============== our app =======================
var app = express();
var routes = require("./routes-flapper");
//===============================================

//================= functions ================
function dbCode()
{
  //console.log("connected to db");
}

function accessControl(request, response, next)
{
  response.header("Access-Control-Allow-Origin","*");
  response.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");

  if (request.method === "OPTIONS")
  {
    response.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
    return response.status(200).json({});
  };

  next(); //comment
}

//===============================================

//Logger
app.use(logger("dev"));

//JSON parsing
app.use(jsonParser());

//Mongoose
var mongoose = require("mongoose");
var mongoDbPath = "mongodb://localhost:27017/flapper";
mongoose.connect(mongoDbPath);
var db = mongoose.connection;

db.on("error", function(err)
{
  console.log("connection error!", err);
});

//all db code
db.once("open", dbCode); 

//CORS
app.use(accessControl);

// routes
app.use("/api", routes);

// catch 404 and forward - ** TODO, we have new404Error in routes
// shd bring it out common...
app.use(function(request, response, next)
{
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//error handler
app.use(function(err,request, response)
{
  response.status(err.status || 500);
  response.json({ error: { message: err.message } });
});

var port = process.env.PORT || 3001;

app.listen(port, function()
{
  console.log("express server (app-flapper) is listening on port " + port);
  console.log("Db:  " + mongoDbPath);
});


