const Application = require("../models/Application");
const Job = require("../models/Job");

exports.apply = async (req, res) => {
  try {
    if (req.user.role !== "applicant") {
      return res.status(403).json({ message: "Only applicants can apply." });
    }

    const existing_application = await Application.findOne({
      job: req.params.job_id,
      applicant: req.user._id,
    });

    if (existing_application) {
      return res.status(400).json({ message: "Already applied to this job." });
    }

    const application = await Application.create({
      job: req.params.job_id,
      applicant: req.user._id,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.fetch_authenticated_user_applications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title location type company")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.fetch_job_applications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.job_id);
    
    if (!job || job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view applicants." });
    }
    
    const applications = await Application.find({ job: req.params.job_id })
    .populate("job", "title location category type")
      .populate("applicant", "name email image");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update_status = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id).populate("job");

    if (!app || app.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application." });
    }

    app.status = status;
    await app.save();

    res.json({ message: "Application status updated.", status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
