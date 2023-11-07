const mongoose = require("mongoose");
const validator = require("validator");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Phone Number can not be empty"],
    validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, "any"); // 'any' means any region
      },
      message: "Please provide a valid Phone number",
    },
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
