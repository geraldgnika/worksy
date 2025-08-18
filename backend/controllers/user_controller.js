const fs = require("fs");
const path = require("path");
const User = require("../models/User");

exports.update_profile = async (req, res) => {
  try {
    const { name, image, company_name, company_description, company_logo } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.name = name || user.name;
    user.image = image || user.image;

    if (user.role === "employer") {
      user.company_name = company_name || user.company_name;
      user.company_description = company_description || user.company_description;
      user.company_logo = company_logo || user.company_logo;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      image: user.image,
      role: user.role,
      company_name: user.company_name,
      company_description: user.company_description,
      company_logo: user.company_logo,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
