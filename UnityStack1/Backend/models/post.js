const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Link to Organization
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
