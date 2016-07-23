'use strict';
var express = require("express");
var router = express.Router();

module.exports = router;

// GET /questions
router.get("/", function(request, response){
  // all questions
  response.json({response:"You asked for GET"});
});

// GET /questions/4
router.get("/:id", function(request, response){
  // all questions
  response.json({response:"You asked for GET:" + request.params.id});
});

// POST /questions
router.post("/", function(request, response){
  // create questions
  response.json({ response:"You asked for POST", body: request.body });
});



