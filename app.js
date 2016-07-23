'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");

var jsonParser = require("body-parser").json;
var logger = require("morgan");

//Logger
app.use(logger("dev"));

//JSON parsing
app.use(jsonParser());

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


