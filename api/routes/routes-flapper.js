'use strict';
var express = require("express");
var router = express.Router();
var postController = require("../controllers/post-controller");

// pre-load post
router.param("pID", postController.preLoadPost );

//pre-load comment
router.param("cID", postController.preLoadComment );

//============= route handlers ===============
//============== Posts =======================
// GET /
router.get("/posts/", postController.getAll );

// GET /posts/4
router.get("/posts/:pID", postController.getPost);

// POST /posts
router.post("/posts/", postController.createPost);

// POST /posts/:pID/comments
router.post("/posts/:pID/comments", postController.createComment);

//POST /posts/:pID/vote-up
// POST /posts/:pID/vote-down
router.post("/posts/:pID/vote-:direction", postController.votePostUpDownPrep, postController.votePostUpDown );
//============================================

//============== Comments ====================
// PUT /posts/:pID/comments/:cID
router.put("/posts/:pID/comments/:cID", postController.updateComment);

// DELETE /posts/:pID/comments/:cID
router.delete("/posts/:pID/comments/:cID", postController.deleteComment);


// POST /posts/:pID/comments/:cID/vote-up
// POST /posts/:pID/comments/:cID/vote-down
router.post("/posts/:pID/comments/:cID/vote-:direction", postController.voteCommentUpDownPrep, postController.voteCommentUpDown);
//============================================

module.exports = router;
