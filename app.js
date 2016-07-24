'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");

var jsonParser = require("body-parser").json;
var logger = require("morgan");

//================= db functions ================
function dbCode()
{
  console.log("connected to db");
}
//===============================================

//Logger
app.use(logger("dev"));

//JSON parsing
app.use(jsonParser());

//Mongoose
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/sandbox");
var db = mongoose.connection;

db.on("error", function(err)
{
  console.log("connection error!", err)
});

//all db code
db.once("open", dbCode); 

//router
app.use("/questions",routes);

// catch 404 and forward
app.use(function(request, response, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//error handler
app.use(function(err,request, response, next){
  response.status(err.status || 500);
  response.json({ error: { message: err.message } })
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("express server is listening on port " + port);
});


