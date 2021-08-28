const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Aligator Demon x123",
  },
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/dsykf3mo9/image/upload/v1619363046/ProductImage/icons8-male-user-100_jgukfa.png",
  },
});

module.exports = mongoose.model("User", UserSchema);
