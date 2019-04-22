const Game = require('../models/game');
const User = require('../models/user');
const io = require('../utils/socket');

module.sendGameRequest = async function ({ userId, opponentId })
{
  const opponent = await User.findById(opponentId);
  const user = await User.findById(userId);

  if (opponent.onlineStatus === false)
  {
    return false;
  } else
  {
    io.getIO().broadcast(`gameRequest-${opponent.userName}`, { starter: user.userName });
    return true;
  }
}

module.respondGameRequest = async function ({ playerId, opponentUserName, answer })
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
    io.getIO().broadcast(`gameResponse-${opponentUserName}`, { gameId: game._id, accept: true });
    return game._id;
  } else
  {
    io.getIO().broadcast(`gameResponse-${opponentUserName}`, { gameId: null, accept: false });
    return null;
  }
}

module.finishGame = async function ({ id, draw, winnerId })
{
  const game = await Game.findById(id);
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

    return { winner: null, draw: true };
  } else
  {
    game.draw = false;
    game.winner = winnerId

    const user = await User.findById(winnerId);
    user.score += 3;
    await user.save();
    await game.save();

    return { winner: user.userName, draw: false };
  }
}