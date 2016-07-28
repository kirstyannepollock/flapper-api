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
  request.post.save(afterSavePost.bind({request: request, response: response, next: next}));
});


// PUT /posts/:pID/comments/:aID
router.put("/:pID/comments/:aID", function(request, response, next)
{
  // update an comment (pre-loaded because of the aID param)
  request.comment.update(request.body, function (error, result) 
  {
    if (error) { return next(error); }
    response.json(result);
  });

  ///??? we haven't saved the post ????

});

// DELETE /posts/:pID/comments/:aID
router.delete("/:pID/comments/:aID", function(request, response, next)
{
  // delete an comment
  request.comment.remove(function (error, comment) 
  {
    request.post.save(afterSavePost.bind({request: request, response: response, next: next}));
  });

});


// POST /posts/:pID/comments/:aID/vote-up
// POST /posts/:pID/comments/:aID/vote-down
router.post("/:pID/comments/:aID/vote-:direction",
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
    request.comment.vote(request.vote, afterSavePost.bind({request: request, response: response, next: next}) );
  });



module.exports = router;
