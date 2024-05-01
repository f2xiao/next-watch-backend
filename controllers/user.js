const bcrypt = require('bcrypt');
const User = require('../models/user');

// Function to validate email address using regex
const createUser = async (request, response) => {
  const { username, email, password } = request.body;

  const saltRounds = 10
  const passwordHash = bcrypt.hashSync(password, saltRounds);



  try {
    const user = new User({
      username,
      email,
      passwordHash,
    })
  
    const savedUser = await user.save();
  
    response.status(201).json(savedUser);
    
  } catch (error) {
    if(error.message.includes("E11000 duplicate key error")){
      response.status(500).json({error: 'expected `username` to be unique'})
    }
    response.status(500).json({error: error.message});
  }

}

module.exports = {
  createUser
};