const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generate_token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "120d" });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, image, role } = req.body;
    const user_exists = await User.findOne({ email });
    
    if (user_exists) return res.status(400).json({ message: "User already exists." });

    const user = await User.create({ name, email, password, role, image });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      token: generate_token(user._id),
      company_name: user.company_name || '',
      company_description: user.company_description || '',
      company_logo: user.company_logo || '',
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.match_password(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generate_token(user._id),
      image: user.image || '',
      company_name: user.company_name || '',
      company_description: user.company_description || '',
      company_logo: user.company_logo || '',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.fetch_authenticated_user = async (req, res) => {
  res.json(req.user);
};
