const auth = require('../controllers/auth');
const game = require('../controllers/gameController');
const user = require('../controllers/userController');

module.exports = {
  // Auth
  createUser: auth.createUser,
  login: auth.login,

  // User
  changeStatus: user.changeStatus,
  searchUser: user.searchUser,

  // Game
  sendGameRequest: game.sendGameRequest,
  respondGameRequest: game.respondGameRequest,
  changeTurn: game.changeTurn,
  finishGame: game.finishGame
};
