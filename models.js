'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

function sortAnswers(a,b)
{
  // -ve a before b
  // 0 equal
  // +ve a after b
  if(a.votes === b.votes)
  {
    return b.updatedAt - a.updatedAt; // this should work...
  };

  return b.votes - a.votes;
}

// Simple 2 related tables with max 20 Answers per Question,
// Therefore embed Answers as array in Question.
var AnswerSchema = new Schema(
  {
    text: string,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    votes:     {type: Number, default: 0}    
  }
);

// instance method
AnswersSchema.methods.update = function(updates,callback)
{
  // merge answers into Question document
  // this === Answers
  Object.assign(this, updates, {updatedAt: new Date() })

  //save the changes (need to save the parent)
  this.parent().save(callback);
}

AnswersSchema.methods("vote", function (vote, callback)
{
  this.votes = vote =="up" ? this.votes + 1 : this.votes -1;

  //save the changes (need to save the parent)
  this.parent().save(callback);
}

var QuestionSchema = new Schema(
  {
    text: string,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
  }
);

//Sort the answers before we save
//Guess this is life in the NoSQL world...
//(though we could hook to the "find" method),
//
// I guess if we KNOW we (almost) always want 
// the data in a specific order  - but ALL apps
// that use the db must conform to this std.
// Guess we only offer access via an API
// and never the db directly. Hmmm... 
QuestionSchema.pre("Save", function(next)
{
  this.answers.sort(sortAnswers);
  next();
});

var Question = mongoose.model("Question", QuestionSchema);


module.exports.Question = Question;