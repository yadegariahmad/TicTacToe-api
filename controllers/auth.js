const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const respondModel = require('../utils/responseModel');

const User = require('../models/user');

exports.createUser = async (req, res, next) =>
{
  const { email } = req.body;
  const { password } = req.body;
  const { userName } = req.body;
  const { name } = req.body;

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
      const respond = new respondModel({}, 422, 'Invalid input');
      res.json(respond);
    }

    const checkEmail = await User.findOne({ email: email });
    if (checkEmail)
    {
      const respond = new respondModel({}, 400, 'Email exists already!');
      res.json(respond);
    }

    const checkUserName = await User.findOne({ usreName: userName });
    if (checkUserName)
    {
      const respond = new respondModel({}, 400, 'UserName exists already!');
      res.json(respond);
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      userName: userName,
      password: hashedPw
    });
    const createdUser = await user.save();

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
      const respond = new respondModel({}, 404, 'User not found.');
      res.json(respond);
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual)
    {
      const respond = new respondModel({}, 401, 'Password is incorrect.');
      res.json(respond);
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

    const respond = new respondModel({ token, userId: user._id.toString() }, 201, 'User logged in');
    res.json(respond);

  } catch (error)
  {
    next(error);
  }
}