const Developer = require("../models/Develpor");
const Question = require("../models/question");
const Student = require("../models/Student");
const Organization = require("../models/Organization");
const Answer = require("../models/answer");

// Post a Question (Any Role: Developer, Student, or Organization)
const postQuestion = async (req, res) => {
  try {
    const { userRole, user } = req;  // Extract userRole and user from the request
    const { title, details, tags, tried } = req.body;

    if (!title || !details || !tags || tags.length === 0) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Fetch user details based on userRole
    let userName = "Anonymous";
    if (userRole === "developer") {
      const developer = await Developer.findById(user);
      if (developer) userName = developer.firstName;
    } else if (userRole === "student") {
      const student = await Student.findById(user);
      if (student) userName = student.firstName;
    } else if (userRole === "organization") {
      const organization = await Organization.findById(user);
      if (organization) userName = organization.companyName;
    }

    const newQuestion = new Question({
      user: user,         // User ID
      userRole: userRole, // User role
      userName: userName, // Store the user's name in the question
      title: title,       // Question title
      details: details,   // Question details
      tags: tags,         // Tags for the question
      tried: tried || ""
    });

    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ message: "Error creating question", error: err.message });
  }
};

// Get All Questions (Visible to all users)

// Get All Questions (Visible to all users)
// Get All Questions (Visible to all users)
// Get All Questions (Visible to all users)
const getAllQuestions = async (req, res) => {
  try {
    const { tag, search, sortBy } = req.query; // Get search query
    let questionsQuery = Question.find();  // Default query

    // If search query is provided, filter by title, details, or tags
    if (search) {
      questionsQuery = questionsQuery.find({
        $or: [
          { title: { $regex: search, $options: "i" } }, // Case-insensitive search
          { details: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      });
    }

    // Sorting based on the `sortBy` parameter
    if (sortBy === 'oldest') {
      questionsQuery = questionsQuery.sort({ createdAt: 1 });  // Oldest
    } else if (sortBy === 'mostAnswered') {
      questionsQuery = questionsQuery.sort({ answers: -1 });  // Most answered
    } else if (sortBy === 'unanswered') {
      questionsQuery = questionsQuery.where('answers').size(0);  // Unanswered
    } else {
      questionsQuery = questionsQuery.sort({ createdAt: -1 });  // Default: Newest
    }

    // If a tag is provided, filter questions by that tag
    if (tag) {
      questionsQuery = questionsQuery.where('tags').in([tag]);  // Filter by tag
    }

    const questions = await questionsQuery;

    // Aggregate tags and their counts
    const tagCounts = await Question.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } } // Sort by count in descending order
    ]);

    const enrichedQuestions = await Promise.all(
      questions.map(async (q) => {
        let userName = "Unknown";
        let userRole = "Unknown";

        if (q.userRole === "developer") {
          const developer = await Developer.findById(q.user);
          if (developer) {
            userName = developer.firstName;
            userRole = "Developer";
          }
        } else if (q.userRole === "student") {
          const student = await Student.findById(q.user);
          if (student) {
            userName = student.firstName;
            userRole = "Student";
          }
        } else if (q.userRole === "organization") {
          const organization = await Organization.findById(q.user);
          if (organization) {
            userName = organization.companyName;
            userRole = "Organization";
          }
        }

        return {
          ...q._doc,
          userName: userName,
          userRole: userRole,
        };
      })
    );

    res.status(200).json({ questions: enrichedQuestions, tags: tagCounts });
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// In questionController.js
const incrementViewCount = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check if the logged-in user is the owner
    if (question.user.toString() === req.user.id) {
      return res.status(200).json(question); // Don't increment views if it's the owner's question
    }

    // Increment the view count
    question.views += 1;
    await question.save();

    // Return the updated question
    res.status(200).json(question);
  } catch (err) {
    console.error("Error updating view count:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





// Get Question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params; // The question ID
    const { filterOption } = req.query;  // Get the filter option from query params

    const question = await Question.findById(id).populate("answers");

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Apply filters on the answers based on the filterOption
    let filteredAnswers = [...question.answers];

    switch (filterOption) {
      case "latest":
        filteredAnswers = filteredAnswers.sort((a, b) => new Date(b.time) - new Date(a.time));
        break;
      case "oldest":
        filteredAnswers = filteredAnswers.sort((a, b) => new Date(a.time) - new Date(b.time));
        break;
      case "own":
        filteredAnswers = filteredAnswers.filter(answer => answer.userId.toString() === req.userId);  // Assuming userId is available in the request
        break;
      case "mostLiked":
        filteredAnswers = filteredAnswers.sort((a, b) => b.likes - a.likes);
        break;
      case "mostDisliked":
        filteredAnswers = filteredAnswers.sort((a, b) => b.dislikes - a.dislikes);
        break;
      case "noLikesDislikes":
        filteredAnswers = filteredAnswers.filter(answer => answer.likes === 0 && answer.dislikes === 0);
        break;
      default:
        break;
    }

    // Now prepare the enriched question with filtered answers
    let role = "unknown";
    let name = "User";

    const developer = await Developer.findById(question.user);
    if (developer) {
      role = "developer";
      name = developer.firstName;
    } else {
      const student = await Student.findById(question.user);
      if (student) {
        role = "student";
        name = student.firstName;
      } else {
        const org = await Organization.findById(question.user);
        if (org) {
          role = "organization";
          name = org.companyName;
        }
      }
    }

    const enrichedQuestion = {
      ...question._doc,
      user: question.user.toString(),
      role: role,
      userName: name,
      answers: filteredAnswers,  // Send the filtered answers
    };

    // Send question data, including tags and filtered answers
    res.status(200).json(enrichedQuestion);
  } catch (error) {
    console.error("Error fetching question:", error.message);
    res.status(500).json({ error: "Error fetching question" });
  }
};




// Update Question (Only the user who posted the question can update)
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, details, tags, tried } = req.body;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (question.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only edit your own questions." });
    }

    question.title = title || question.title;
    question.details = details || question.details;
    question.tags = tags || question.tags;
    if (typeof tried !== 'undefined') question.tried = tried;

    await question.save();

    res.status(200).json(question);
  } catch (error) {
    console.error("Error updating question:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Delete Question (Only the user who posted the question can delete)
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (question.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own questions." });
    }

    await Question.findByIdAndDelete(id);

    res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Post Answer to a Question
const postAnswer = async (req, res) => {
  try {
    const { text, userRole, userName, userId } = req.body;  // Extract values from the body
    const { user } = req;  // The logged-in user (i.e., the user posting the answer)

    if (!text.trim()) {
      return res.status(400).json({ message: "Answer text is required." });
    }

    if (!userName || !userRole) {
      return res.status(400).json({ message: "userName and userRole are required." });
    }

    // Create a new Answer
    const newAnswer = new Answer({
      user: userId,  // userId corresponds to the logged-in user
      userRole: userRole,
      text: text,
      userName: userName,
    });

    await newAnswer.save();

    // Find the question and add the new answer
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Ensure the answers field is initialized as an array
    if (!Array.isArray(question.answers)) {
      question.answers = [];
    }

    // Add the new answer ID to the answers array
    question.answers.push(newAnswer._id);
    await question.save();

    res.status(201).json(newAnswer);
  } catch (err) {
    console.error("Error posting answer:", err);
    res.status(500).json({ message: "Error posting answer", error: err.message });
  }
};







// Like an answer
const likeAnswer = async (req, res) => {
  const { answerId } = req.params; // Get the answer ID from the URL
  const userId = req.user.id; // Get the logged-in user's ID

  try {
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Check if the user has already liked the answer
    if (answer.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this answer" });
    }

    // Check if the user has already disliked the answer
    if (answer.dislikedBy.includes(userId)) {
      return res.status(400).json({ message: "You can't like and dislike at the same time" });
    }

    // Update the like count and add the user to the likedBy array
    answer.likes += 1;
    answer.likedBy.push(userId);
    await answer.save();

    res.status(200).json({ message: "Answer liked successfully", answer });
  } catch (err) {
    console.error("Error in likeAnswer:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Dislike an answer
const dislikeAnswer = async (req, res) => {
  const { answerId } = req.params; // Get the answer ID from the URL
  const userId = req.user.id; // Get the logged-in user's ID

  try {
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Check if the user has already disliked the answer
    if (answer.dislikedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already disliked this answer" });
    }

    // Check if the user has already liked the answer
    if (answer.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You can't like and dislike at the same time" });
    }

    // Update the dislike count and add the user to the dislikedBy array
    answer.dislikes += 1;
    answer.dislikedBy.push(userId);
    await answer.save();

    res.status(200).json({ message: "Answer disliked successfully", answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Update Answer (Only the user who posted the answer can update)
const updateAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params; // Get the question ID and answer ID from the URL
    const { text } = req.body;  // The new text for the answer

    // Find the answer by its ID
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' }); // Handle "Answer not found"
    }

    // Ensure the logged-in user is the one who posted the answer
    if (answer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only edit your own answers.' });
    }

    // Update the answer text
    answer.text = text;
    await answer.save();

    res.status(200).json(answer);  // Return the updated answer
  } catch (error) {
    console.error('Error editing answer:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Delete Answer (Only the user who posted the answer can delete)
const deleteAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;  // Get question ID and answer ID from the URL

    // Find the answer by its ID
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });  // Answer not found
    }

    // Ensure the logged-in user is the one who posted the answer
    if (answer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own answers.' });
    }

    // Delete the answer from the database
    await Answer.findByIdAndDelete(answerId);

    // Optionally, remove the answer from the question document (if you are storing answers as an array of references)
    await Question.findByIdAndUpdate(id, { $pull: { answers: answerId } });

    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error deleting answer:', error.message);
    res.status(500).json({ message: 'Error deleting answer' });
  }
};


























module.exports = {
  postQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  postAnswer,
  likeAnswer,
  dislikeAnswer,
  updateAnswer,
  deleteAnswer,
  incrementViewCount,
};
