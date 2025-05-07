const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

// Import questionController
const QuestionController = require("../Controllers/questionController");

// Route to post a question
router.post("/", authenticateToken, QuestionController.postQuestion);

// Route to get all questions
router.get("/", QuestionController.getAllQuestions);

// Route to get a question by ID
router.get("/:id", QuestionController.getQuestionById);

// Route to update a question
router.put("/:id", authenticateToken, QuestionController.updateQuestion);

// Route to delete a question
router.delete("/:id", authenticateToken, QuestionController.deleteQuestion);

// Route to post an answer to a question
router.post("/:id/answers", authenticateToken, QuestionController.postAnswer);
router.put("/:id/answers/:answerId/like", authenticateToken, QuestionController.likeAnswer);

// **Route to dislike an answer**
router.put("/:id/answers/:answerId/dislike", authenticateToken, QuestionController.dislikeAnswer);
// Route to edit an answer
router.put("/:id/answers/:answerId", authenticateToken, QuestionController.updateAnswer);

// Route to delete an answer
router.delete("/:id/answers/:answerId", authenticateToken, QuestionController.deleteAnswer);
// In questionroutes.js
router.put("/:id/view", authenticateToken, QuestionController.incrementViewCount);




module.exports = router;
