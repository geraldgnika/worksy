const express = require("express");
const { protect } = require("../middlewares/authentication_middleware");
const { signup, signin, fetch_authenticated_user } = require("../controllers/authentication_controller");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/fetch-authenticated-user", protect, fetch_authenticated_user);

module.exports = router;
