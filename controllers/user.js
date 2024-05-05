const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET;
// const token = require("../utils/token");

// Function to validate email address using regex
const signup = async (request, response) => {
  const { username, email, password } = request.body;

  if (password.length < 6) {
    response
      .status(401)
      .json({ error: "Please provide a password longer than 6" });
  }

  const saltRounds = 12;
  const passwordHash = bcrypt.hashSync(password, saltRounds);

  const user = new User({
    username,
    email,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
};

const login = async (req, res) => {
  // Get username and password from req.body
  const { username, password } = req.body;

  // Check if the user exists (if not, return 404)
  const user = await User.findOne({ username });

  // If the user exists, check if their password is correct (if not, return 401)
  const isPasswordCorrect =
    user === null ? false : bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Invalid username or passsword" });
  }

  // The user auth checks out, return a signed token (with user info)
  const authToken = jwt.sign(
    {
      user_id: user._id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "2d" }
  );

  // Send the token back to the user
  res.status(200).json({ token: authToken });
};

const getOne = async (req, res) => {
  const user = await User.findOne({
    username: req.user.username,
  }).populate({
    path: "nextwatches",
    populate: { path: "watch_id" },
  });

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    delete user.passwordHash;
    logger.info("user: ", user);
    res.status(200).json(user);
  }
};

const getNextwatches = async (request, response) => {
  const user = await User.findById(request.user.user_id).populate(
    "nextwatches"
  );

  logger.info(user);

  response.json(user.nextwatches);
};

const updateShare = async (request, response) => {
  const user = await User.findById(request.user.user_id);

  if (!user) {
    response.status(401).json({ error: "Unauthorized" });
  } else {
    user.share = !user.share;
    user.save();
    response.status(200).json({ message: "Update share successfully" });
  }
};

module.exports = {
  signup,
  login,
  getOne,
  getNextwatches,
  updateShare,
};
