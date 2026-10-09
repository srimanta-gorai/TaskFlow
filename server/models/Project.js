
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Design", "Development", "Marketing"],
      default: "Development",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    deadline: {
      type: Date,
      default: null,
    },
    color: {
      type: String,
      enum: ["violet", "blue", "emerald", "amber"],
      default: "violet",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
