const User = require('../models/user');
const respondModel = require('../utils/responseModel');

module.exports.changeStatus = function (req, res, next)
{
  const { userId } = req.body;

  User.findOne({ _id: userId }, user =>
  {
    user.onlineStatus = false; // status is set online on login
    return user.save();

  }).then(() =>
  {
    const respond = new respondModel({}, 200, 'Status is offline!');
    res.json(respond);
  })
    .catch(error =>
    {
      next(error);
    });
}

module.exports.searchUser = async function (req, res, next)
{
  const { userName } = req.body;
  
  try
  {
    const users = await User.find({ userName: new RegExp(userName, 'i') });

    if (users)
    {
      const respond = new respondModel({ users }, 200, '');
      res.json(respond);
    } else
    {
      const respond = new respondModel({}, 404, '');
      res.json(respond);
    }
  } catch (error)
  {
    next(error);
  }
}