'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Simple 2 related tables with max 20 Answers per Question,
// Therefore embed Answers as array in Question.
var AnswerSchema = new Schema(
  {
    text: string,
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now},
    votes:     {type:Number, default: 0}    
  }
);

var QuestionSchema = new Schema(
  {
    text: string,
    createdAt: {type:Date, default: Date.now},
    answers: [AnswerSchema]
  }
);


var Question = mongoose.model("Question", QuestionSchema);
module.exports.Question = Question;