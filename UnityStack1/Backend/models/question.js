const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    // Dynamically reference user based on userRole
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      refPath: 'userRole' // This allows dynamic referencing based on the role
    },

    // Define the role of the user submitting the question
    userRole: { 
      type: String, 
      enum: ['developer', 'student', 'organization'], // Ensure roles match the models
      required: true 
    },

    // Store the user's first name (or company name for organizations)
    userName: { 
      type: String, 
      required: true 
    },

    // The actual question text
    title: { 
      type: String, 
      required: true 
    },

    details: { 
      type: String, 
      required: true 
    },

    // Add tried field
    tried: {
      type: String,
      required: false
    },

    // Tags associated with the question
    tags: [{ 
      type: String 
    }],

    // Other fields related to the question
    votes: { 
      type: Number, 
      default: 0 
    },

    // Answers related to the question (an array of ObjectIds referencing the Answer model)
    answers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Answer' 
    }],

    views: { 
      type: Number, 
      default: 0 
    },

    status: { 
      type: String, 
      default: 'Unanswered' 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
