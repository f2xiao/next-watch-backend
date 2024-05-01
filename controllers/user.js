const bcrypt = require('bcrypt');
const User = require('../models/user');

// Function to validate email address using regex
const createUser = async (request, response) => {
  const { username, email, password } = request.body;

  const saltRounds = 10
  const passwordHash = bcrypt.hashSync(password, saltRounds);

  const user = new User({
    username,
    email,
    passwordHash,
  })

  const savedUser = await user.save();

  response.status(201).json(savedUser);

}

module.exports = {
  createUser
};