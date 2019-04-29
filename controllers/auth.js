const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const respondModel = require('../utils/responseModel');

const User = require('../models/user');

exports.createUser = async (req, res, next) =>
{
  console.log('body: ', req.body);
  const { email } = req.body;
  const { password } = req.body;
  const { userName } = req.body;


  try
  {
    const errors = [];
    if (!validator.isEmail(email))
    {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    )
    {
      errors.push({ message: 'Password too short!' });
    }
    if (validator.isEmpty(userName))
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
    const checkEmail = await User.findOne({ email: email });
    const checkUserName = await User.findOne({ usreName: userName });
    if (checkEmail || checkUserName)
    {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashedPw
    });
    const createdUser = await user.save();
    console.log(createdUser._doc);

    const respond = new respondModel({ userId: createdUser._id }, 201, 'User created!');
    res.json(respond);
  } catch (error)
  {
    next(error);
  }
}

exports.login = async function (req, res, next)
{
  const { email } = req.body;
  const { password } = req.body;

  try
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
      { expiresIn: '10d' }
    );
    user.onlineStatus = true;
    await user.save();

    const respond = new respondModel({ token, userId: user._id.toString() }, 201, 'User created!');
    res.json(respond);

  } catch (error)
  {
    next(error);
  }
}