const mongoose = require("mongoose");

const job_schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String },
    category: { type: String },
    type: {
      type: String,
      enum: ["Remote", "On-Site", "Hybrid", "Full-Time", "Part-Time", "Contract", "Internship"],
      required: true,
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    salary_min: { type: Number },
    salary_max: { type: Number },
    is_closed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", job_schema);
