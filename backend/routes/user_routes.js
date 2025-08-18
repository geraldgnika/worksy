const express = require("express");
const { protect } = require("../middlewares/authentication_middleware");
const {
  update_profile,
} = require("../controllers/user_controller");
const upload = require('../middlewares/upload_middleware');

const router = express.Router();

router.put("/update-profile", protect, update_profile);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const image_url = `${req.protocol}://${req.get("host")}/storage/${
    req.file.filename
  }`;

  res.status(200).json({ image_url });
});

module.exports = router;
