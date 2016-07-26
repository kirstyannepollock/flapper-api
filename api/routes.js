'use strict';
var express = require("express");
var router = express.Router();
var Question = require("./models").Question;

var decendingCreatedDate = {createdAt: -1};


//================= functions ================

//{request: request, response: response, next: <callback>}
function afterSaveQuestion(error, question)
{
  if (error) { return this.next(error); }
  this.response.status(201); //updated
  this.response.json(question);
}

function New404Error() 
{  
  var error = new Error("Not Found");
  error.status(404);
  return error;
}

//============================================

// pre-load question
router.param("qID", function(request, response, next, id)
{
  Question.findById(id, function (error, question)
  {
    if (error) { return next(error); }
    if (!question) { return next(New404Error); }

    // Why *return* next ...
    request.question = question;
    return next();

  });

});

//pre-load answer
router.param("aID", function(request, response, next, id)
{
  request.answer = request.question.answers.id(id);
  if (!request.answer) { return next(New404Error); }

  next();
});


//============= route handlers ===============
router.get("/", function(request, response, next)
{
  // all questions
  // 2nd param null to get the right method overload to pass 
  // a sort object.
  // Question.Find({}, null, decendingCreatedDate, function(error, questions)
  // {
  //   if (error) { return next(err); }

  //   res.json(questions);
  // });

  Question.find({})
    .sort(decendingCreatedDate)
    .exec(function(error, questions)
    {
      if (error) { return next(error); }
      response.json(questions);
    });
});

// GET /questions/4
router.get("/:qID", function(request, response)
{
  //question is in the request (pre-loaded because of the qID param)
  response.json(request.question);
});


// POST /questions
router.post("/", function(request, response, next)
{
  // create questions
  var question = new Question(request.body);
  question.save(afterSaveQuestion.bind({request: request, response: response, next: next}));
});


// POST /questions/:qID/answers
router.post("/:qID/answers", function(request, response, next)
{
  //question is in the request (pre-loaded because of the qID param)
  // *Add* answers
  request.question.answers.push(request.body);
  request.question.save(afterSaveQuestion.bind({request: request, response: response, next: next}));
});


// PUT /questions/:qID/answers/:aID
router.put("/:qID/answers/:aID", function(request, response, next)
{
  // update an answer (pre-loaded because of the aID param)
  request.answer.update(request.body, function (error, result) 
  {
    if (error) { return next(error); }
    response.json(result);
  });

  ///??? we haven't saved the question ????

});

// DELETE /questions/:qID/answers/:aID
router.delete("/:qID/answers/:aID", function(request, response, next)
{
  // delete an answer
  request.answer.remove(function (error, answer) 
  {
    request.question.save(afterSaveQuestion.bind({request: request, response: response, next: next}));
  });

});


// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
router.post("/:qID/answers/:aID/vote-:direction",
  function(request, response, next)
  {
    if(request.params.direction.search(/^(up|down)$/) === -1 )
    {
      next(New404Error);
    }
    else
    {
      request.vote = request.params.direction;
      next();
    }
  },
  function(request, response, next)
  {
    request.answer.vote(request.vote, afterSaveQuestion.bind({request: request, response: response, next: next}) );
  });



module.exports = router;
