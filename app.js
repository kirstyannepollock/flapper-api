'use strict';

var express = require("express");
var app = express();

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("express server is listening on port " + port);
});
