'use strict';

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

CommentSchema.method("vote", function (vote, callback)
{
  this.votes = vote =="up" ? this.votes + 1 : this.votes -1;

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

var Post = mongoose.model("Post", PostSchema);

module.exports.Post = Post;