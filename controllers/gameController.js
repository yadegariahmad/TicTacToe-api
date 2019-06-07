const Game = require('../models/game');
const User = require('../models/user');
const io = require('../utils/socket');
const respondModel = require('../utils/responseModel');

exports.sendGameRequest = async function (req, res, next)
{
  const { opponentId } = req.body;
  const { userId } = req.body;

  try
  {
    const opponent = await User.findById(opponentId);
    const user = await User.findById(userId);

    if (!opponent)
    {
      throw Error('user not found');
    }

    if (opponent.onlineStatus === false)
    {
      const respond = new respondModel({}, 504, 'User is offline!');
      res.json(respond);
    } else
    {
      io.getIO().emit(`gameRequest-${opponent._id}`, { starter: user.userName });

      const respond = new respondModel({}, 200, 'Request was sent!');
      res.json(respond);
    }
  } catch (error)
  {
    next(error);
  }
}

exports.respondGameRequest = async function (req, res, next)
{
  const { opponentUserName } = req.body; // one who sent the request
  const { answer } = req.body;
  const { playerId } = req.body;

  try
  {
    const opponent = await User.findOne({ userName: opponentUserName }); // starter

    if (answer)
    {
      const date = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
      const game = new Game({
        date,
        players: [playerId, opponent._id]
      });

      await game.save();
      io.getIO().emit(`gameResponse-${opponent._id}`, { gameId: game._id, accept: true });

      const respond = new respondModel({ gameId: game._id, opponentId: opponent._id }, 200, 'Game was created!');
      res.json(respond);
    } else
    {
      io.getIO().emit(`gameResponse-${opponent._id}`, { gameId: null, accept: false });

      const respond = new respondModel({}, 210, 'Request declined!');
      res.json(respond);
    }
  } catch (error)
  {
    next(error);
  }
}

exports.changeTurn = async function (req, res, next)
{
  const { gameId } = req.body;
  const { playerId } = req.body;
  const { squareNumber } = req.body;

  try
  {
    const game = await Game.findById(gameId);
    // const user = await User.findById(playerId);
    const gamePlayers = game.players;
    const opponentIndex = gamePlayers.indexOf(playerId) == 0 ? 1 : 0;
    const opponent = await User.findById(gamePlayers[opponentIndex]);

    io.getIO().emit(`changeTurn-${opponent._id}`, { squareNumber });

    const respond = new respondModel({}, 200, 'Turn changed!');
    res.json(respond);
  } catch (error)
  {
    next(error);
  }
}

exports.finishGame = async function (req, res, next)
{
  const { gameId } = req.body;
  const { draw } = req.body;
  const { winnerId } = req.body;

  try
  {
    const game = await Game.findById(gameId);
    const players = game.players;

    if (draw)
    {
      game.draw = true;

      players.forEach(async player =>
      {
        const user = await User.findById(player);
        user.score++;
        await user.save();
      });
      await game.save();

      const respond = new respondModel({ winner: null, draw: true }, 200, 'Game finished!');
      res.json(respond);
    } else
    {
      game.draw = false;
      game.winner = winnerId

      const user = await User.findById(winnerId);
      user.score += 3;
      await user.save();
      await game.save();

      const respond = new respondModel({ winner: user.userName, draw: false }, 200, 'Game finished!');
      res.json(respond);
    }
  } catch (error)
  {
    next(error);
  }
}