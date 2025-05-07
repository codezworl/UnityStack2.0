const mongoose = require('mongoose');


const answerSchema = new mongoose.Schema(
  {
    // Dynamically reference user based on userRole
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      refPath: 'userRole' // This allows dynamic referencing based on the role
    },

    // Define the role of the user submitting the answer
    userRole: { 
      type: String, 
      enum: ['developer', 'student', 'organization'], 
      required: true 
    },

    // The actual answer text
    text: { 
      type: String, 
      required: true 
    },

    // Optional fields for like/dislike system
    likes: { 
      type: Number, 
      default: 0 
    },
    dislikes: { 
      type: Number, 
      default: 0 
    },

    // Arrays to store the users who liked/disliked the answer
    likedBy: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // Assuming you have a User model to reference
    }],
    dislikedBy: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
    }],

    // Time the answer was submitted
    time: { 
      type: Date, 
      default: Date.now 
    },

    // Optional: Mark an answer as the best answer
    isBest: { 
      type: Boolean, 
      default: false 
    },

    // Store the user's first name for convenience
    userName: { 
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Answer', answerSchema);
