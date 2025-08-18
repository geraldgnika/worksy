const express = require("express");
const { protect } = require("../middlewares/authentication_middleware");
const {
  apply,
  fetch_authenticated_user_applications,
  fetch_job_applications,
  update_status,
} = require("../controllers/application_controller");

const router = express.Router();

router.post("/:job_id", protect, apply);
router.get("/job/:job_id", protect, fetch_job_applications);
router.put("/:id/status", protect, update_status);

router.get("/my-applications", protect, fetch_authenticated_user_applications);

module.exports = router;
