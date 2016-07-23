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
router.get("/:qID", function(request, response){
  // all questions
  response.json({response:"You asked for GET:" + request.params.qID});
});

// POST /questions
router.post("/", function(request, response){
  // create questions
  response.json({ response:"You asked for POST", body: request.body });
});


// POST /questions/:qID/answers
router.post("/:qID/answers", function(request, response){
  // create answers
  response.json(
    {
      response:"You asked for POST to /answers", 
      questionID: request.params.qID,      
      body: request.body,
    });
});


// PUT /questions/:qID/answers/:aID
router.put("/:qID/answers/:aID", function(request, response){
  // update an answer
  response.json(
    {
      response:"You asked for PUT to /answers", 
      questionID: request.params.qID,
      answerID: request.params.aID,      
      body: request.body
    });
});

// DELETE /questions/:qID/answers/:aID
router.delete("/:qID/answers/:aID", function(request, response){
  // delete an answer
  response.json(
    {
      response:"You asked for DELETE to /answers", 
      questionID: request.params.qID,
      answerID: request.params.aID,
    });
});


// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
router.post("/:qID/answers/:aID/vote-:direction", function(request, response){
  // vote answer up or down
  response.json(
    {
      response:"You asked for POST to /vote-" + request.params.direction, 
      questionID: request.params.qID,
      answerID: request.params.aID,
      vote: request.params.direction
    });
});



