const router = require(`express`).Router();
const commentController = require(`../controllers/comment`);

// get all comments 
router.get("/", commentController.getAllComments);

// get specific comment by id
router.get("/:id", commentController.getComment);

// Update specific comment by id
router.put("/update/:id", commentController.updateComment);

// post a new comment
router.post("/add", commentController.postComment);

// delete a comment
router.delete("/delete/:id", commentController.deleteComment);

module.exports = router;