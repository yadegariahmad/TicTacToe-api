const User = require('../models/user');

module.changeStatus = async function ({ userId })
{
  User.findOne({ _id: userId }, user =>
  {
    user.onlineStatus = false;
    return user.save();

  }).then(() =>
  {
    return true;
  });
}

module.searchUser = async function ({ userName })
{
  const users = await User.find({ userName: new RegExp(userName, 'i') });

  return users;
}