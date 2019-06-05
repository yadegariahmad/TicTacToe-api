const User = require('../models/user');
const respondModel = require('../utils/responseModel');

exports.changeStatus = async function (req, res, next)
{
  const { userId } = req.body;
  const { status } = req.body;
  
  try
  {
    const user = await User.findOne({_id: userId});
    user.onlineStatus = status;
    user.save();
  } catch (error)
  {
    next(error);
  }
}

exports.searchUser = async function (req, res, next)
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