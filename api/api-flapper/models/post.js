'use strict';

// **TODO: Authentication using Passport - see:
// http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Answer schema hooks must come before we declare the
// Question Schema.
var CommentSchema = new Schema(
  {
    author:   String,
    body:     String,
    upvotes:  {type: Number, default: 0}    
  }
);

CommentSchema.methods.update = function(updates,callback)
{
  // merge answers into Question document
  // this === Answers
  Object.assign(this, updates);

  //save the changes (need to save the parent)
  this.parent().save(callback);
};

CommentSchema.method("vote", function (voteDirection, callback)
{
  this.upvotes = voteDirection =="up" ? this.upvotes + 1 : this.upvotes -1;

  //save the changes (need to save the parent)
  this.parent().save(callback);
});


var PostSchema = new Schema(
  {
    title:    String,
    link:     String,
    upvotes:  {type: Number, default: 0},  
    comments: [CommentSchema]
  }
);


PostSchema.method("vote", function (voteDirection, callback)
{
  this.upvotes = voteDirection =="up" ? this.upvotes + 1 : this.upvotes -1;

  //save the changes 
  this.save(callback);
});

var Post = mongoose.model("Post", PostSchema);

module.exports.Post = Post;