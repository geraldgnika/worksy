const express = require("express");
const { protect } = require("../middlewares/authentication_middleware");
const {
  post_job,
  all_jobs,
  fetch_job,
  update_job,
  delete_job,
  toggle_job_status,
  my_jobs,
} = require("../controllers/job_controller");

const router = express.Router();

router.route("/all-jobs").get(all_jobs);
router.route("/").post(protect, post_job).get(all_jobs);
router.route("/my-jobs").get(protect, my_jobs);
router.route("/:id").get(fetch_job).put(protect, update_job).delete(protect, delete_job);
router.put("/:id/toggle-job-status", protect, toggle_job_status);

module.exports = router;
