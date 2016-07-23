'use strict';

var express = require("express");
var app = express();

app.use(function(request, response, next){
  //console.log("the leaves are ", request.query.colour);
  next();
});

var port = process.env.PORT || 3000;



app.listen(port, function(){
  console.log("express server is listening on port " + port);
});


