const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET;

// Function to validate email address using regex
const createUser = async (request, response) => {
  const { username, email, password } = request.body;

  const saltRounds = 12
  const passwordHash = bcrypt.hashSync(password, saltRounds);
  
  const user = new User({
    username,
    email,
    passwordHash,
  })

  const savedUser = await user.save();

  response.status(201).json(savedUser);

}

const authenticateUser = async (req, res) => {
  // Get username and password from req.body
  const { username, password } = req.body;


  // Check if the user exists (if not, return 404)
  const user = await User.findOne({username});

  // If the user exists, check if their password is correct (if not, return 401)
  const isPasswordCorrect = user === null ? false : bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordCorrect) {
    return res.status(401).json({error: "Invalid username or passsword"});
  }

  // The user auth checks out, return a signed token (with user info)
  const authToken = jwt.sign(
    {
      user_id: user._id,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: "2d" }
  );

  // Send the token back to the user
  res.status(200).json({ token: authToken });
}

module.exports = {
  createUser,
  authenticateUser
};

