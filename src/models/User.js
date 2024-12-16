// src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    method: {
      type: String,
      enum: ["google", "facebook", "normal"],
    },
    profileComplete: { type: Boolean, default: false },
    facebookId: String,
    displayName: String,
    image: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      // required: true
    },
    dob: Date,
    location: String,

    age: Number,
    gender: String,

    verified: { type: Boolean, default: false },

    refreshToken: String,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
