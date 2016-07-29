'use strict';
var express = require("express");
var router = express.Router();
var Post = require("./models-flapper").Post;
var ascendingNumberOfUpVotes = {upvotes: -1};


//================= functions ================

//{request: request, response: response, next: <callback>}
function afterSavePost(error, post)
{
  if (error) { return this.next(error); }
  this.response.status(201); //updated
  this.response.json(post);
}

//{request: request, response: response, next: <callback>}
function afterSaveComment(error, post)
{
  if (error) { return this.next(error); }
  this.response.status(201); //updated

  // mark the newly added comment as new and return it
  this.request.comment.isNew;
  this.response.json(this.request.comment);
}


function New404Error() 
{  
  var error = new Error("Not Found");
  error.status(404);
  return error;
}

//============================================

// pre-load post
router.param("pID", function(request, response, next, id)
{
  Post.findById(id, function (error, post)
  {
    if (error) { return next(error); }
    if (!post) { return next(New404Error); }

    // Why *return* next ...
    request.post = post;
    return next();

  });

});

//pre-load comment
router.param("cID", function(request, response, next, id)
{
  request.comment = request.post.comments.id(id);
  if (!request.comment) { return next(New404Error); }

  next();
});


//============= route handlers ===============
router.get("/", function(request, response, next)
{

  Post.find({})
    .sort(ascendingNumberOfUpVotes)
    .exec(function(error, posts)
    {
      if (error) { return next(error); }
      response.json(posts);
    });
});

// GET /posts/4
router.get("/:pID", function(request, response)
{
  //post is in the request (pre-loaded because of the pID param)
  response.json(request.post);
});


// POST /posts
router.post("/", function(request, response, next)
{
  // create posts
  var post = new Post(request.body);
  post.save(afterSavePost.bind({request: request, response: response, next: next}));
});


// POST /posts/:pID/comments
router.post("/:pID/comments", function(request, response, next)
{
  //post is in the request (pre-loaded because of the pID param)
  // *Add* comments
  request.post.comments.push(request.body);

  //_id is already added, and everything else is private to
  // the request, so I reckon this is safe.
  var comment = request.post.comments[0];
  request.comment = comment;
  request.post.save(afterSaveComment.bind({request: request, response: response, next: next}));
  
});


// PUT /posts/:pID/comments/:cID
router.put("/:pID/comments/:cID", function(request, response, next)
{
  // update an comment (pre-loaded because of the cID param)
  request.comment.update(request.body, function (error, result) 
  {
    if (error) { return next(error); }
    response.json(result);
  });

  ///??? we haven't saved the post ????

});

// DELETE /posts/:pID/comments/:cID
router.delete("/:pID/comments/:cID", function(request, response, next)
{
  // delete an comment
  request.comment.remove(function (error, comment) 
  {
    request.post.save(afterSavePost.bind({request: request, response: response, next: next}));
  });

});

//POST /posts/:pID/vote-up
// POST /posts/:pID/vote-down
router.post("/:pID/vote-:direction",
  function(request, response, next)
  {
    if(request.params.direction.search(/^(up|down)$/) === -1 )
    {
      next(New404Error);
    }
    else
    {
      request.voteDirection = request.params.direction;
      next();
    }
  },
  function(request, response, next)
  {
    request.post.vote(request.voteDirection, afterSavePost.bind({request: request, response: response, next: next}) );
  });

// POST /posts/:pID/comments/:cID/vote-up
// POST /posts/:pID/comments/:cID/vote-down
router.post("/:pID/comments/:cID/vote-:direction",
  function(request, response, next)
  {
    if(request.params.direction.search(/^(up|down)$/) === -1 )
    {
      next(New404Error);
    }
    else
    {
      request.voteDirection = request.params.direction;
      next();
    }
  },
  function(request, response, next)
  {
    //comment is pre-loaded because of teh cID parameter
    request.comment.vote(request.voteDirection, afterSavePost.bind({request: request, response: response, next: next}) );
  });



module.exports = router;