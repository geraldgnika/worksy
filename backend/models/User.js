const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user_schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["applicant", "employer"], required: true },
  image: String,
  company_name: String,
  company_description: String,
  company_logo: String,
}, { timestamps: true });

user_schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

user_schema.methods.match_password = async function (provided_password) {
  return await bcrypt.compare(provided_password, this.password);
};

module.exports = mongoose.model("User", user_schema);
