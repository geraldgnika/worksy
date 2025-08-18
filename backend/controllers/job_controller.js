const Job = require("../models/Job");
const Application = require("../models/Application");

exports.post_job = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs." });
    }

    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.all_jobs = async (req, res) => {
  const {
    location,
    category,
    type,
    minSalary,
    maxSalary,
    userId,
    keyword,
  } = req.query;

  const query = {
    is_closed: false,
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
    ...(keyword && {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }),
  };

  if (minSalary || maxSalary) {
    query.$and = [];

    if (minSalary) {
      query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    }

    if (maxSalary) {
      query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
    }

    if (query.$and.length === 0) {
      delete query.$and;
    }
  }

  try {
    const jobs = await Job.find(query).populate(
      "company",
      "name company_name company_logo"
    );

    let jobs_by_status = {};

    if (userId) {
      const applications = await Application.find({ applicant: userId }).select("job status");

      applications.forEach((app) => {
        jobs_by_status[String(app.job)] = app.status;
      });
    }

    const jobs_with_extras = jobs.map((job) => {
      const jobIdStr = String(job._id);

      return {
        ...job.toObject(),
        application_status: jobs_by_status[jobIdStr] || null,
      };
    });

    res.json(jobs_with_extras);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.my_jobs = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { role } = req.user;

    if (role !== "employer") {
      return res.status(403).json({ message: "Access denied." });
    }

    const jobs = await Job.find({ company: user_id })
      .populate("company", "name company_name company_logo")
      .lean();

    const jobs_with_applications = await Promise.all(
      jobs.map(async (job) => {
        const application_count = await Application.countDocuments({
          job: job._id,
        });
        return {
          ...job,
          application_count,
        };
      })
    );

    res.json(jobs_with_applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.fetch_job = async (req, res) => {
  try {
    const user_id = req.query.user_id || req.query.userId;

    const job = await Job.findById(req.params.id).populate(
      "company",
      "name company_name company_logo"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    let application_status = null;

    if (user_id) {
      const application = await Application.findOne({
        job: job._id,
        applicant: user_id,
      }).select("status");

      if (application) {
        application_status = application.status;
      }
    }

    res.json({
      ...job.toObject(),
      application_status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update_job = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job." });
    }

    Object.assign(job, req.body);
    const updated = await job.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete_job = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job." });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggle_job_status = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to close this job." });
    }

    job.is_closed = !job.is_closed;
    await job.save();

    res.json({ message: "Job marked as closed." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
