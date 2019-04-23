const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports.createUser = async function ({ userInput })
{
  console.log(userInput);
  
  const errors = [];
  if (!validator.isEmail(userInput.email))
  {
    errors.push({ message: 'E-Mail is invalid.' });
  }
  if (
    validator.isEmpty(userInput.password) ||
    !validator.isLength(userInput.password, { min: 5 })
  )
  {
    errors.push({ message: 'Password too short!' });
  }
  if (validator.isEmpty(userInput.userName))
  {
    errors.push({ message: 'Username is empty' })
  }
  if (errors.length > 0)
  {
    const error = new Error('Invalid input.');
    error.data = errors;
    error.code = 422;
    throw error;
  }
  const checkEmail = await User.findOne({ email: userInput.email });
  const checkUserName = await User.findOne({ usreName: userInput.userName });
  if (checkEmail || checkUserName)
  {
    const error = new Error('User exists already!');
    throw error;
  }
  const hashedPw = await bcrypt.hash(userInput.password, 12);
  const user = new User({
    email: userInput.email,
    name: userInput.name,
    password: hashedPw
  });
  const createdUser = await user.save();
  console.log(createdUser._doc);
  
  return { ...createdUser._doc, _id: createdUser._id.toString() };
}

module.exports.login = async function ({ email, password })
{
  const user = await User.findOne({ email: email });
  if (!user)
  {
    const error = new Error('User not found.');
    error.code = 401;
    throw error;
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual)
  {
    const error = new Error('Password is incorrect.');
    error.code = 401;
    throw error;
  }
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email
    },
    'somesupersecretsecret',
    { expiresIn: '1h' }
  );
  user.onlineStatus = true;
  await user.save();
  return { token, userId: user._id.toString() };
}