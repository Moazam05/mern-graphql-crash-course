const mongoose = require("mongoose");
const validator = require("validator");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us project name!"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please tell us project description!"],
  },
  //   status should be enum fields
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: [true, "Please tell us project status!"],
  },
  clientId: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
