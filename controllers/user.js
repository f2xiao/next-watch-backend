const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET;

// Function to validate email address using regex
const createUser = async (request, response) => {
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

const authenticateUser = async (req, res) => {
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
  // Check for authorization header (if not included, return 401)
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ error: "Please provide the token in authorization header" });
  }

  logger.info("Auth Header: ", req.headers.authorization);

  // Parse authorization header (remove "Bearer " from header)
  const parsedToken = req.headers.authorization.slice(7);
  logger.info("Parsed toekn: ", parsedToken);

  // Verify the token (if not valid, return 401)
  const decodedPayload = jwt.verify(parsedToken, JWT_SECRET);
  // If token is valid, use the decoded payload, to get the info we need with the payload
  const user = await User.findOne({ username: decodedPayload.username });
  delete user.passwordHash;
  logger.info("user: ", user);
  res.status(200).json(user);
};

module.exports = {
  createUser,
  authenticateUser,
  getOne,
};
