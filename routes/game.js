const { Router } = require('express');
const isAuth = require('../utils/isAuth');
const gameController = require('../controllers/gameController');

const router = Router();

router.post('/sendRequest', isAuth, gameController.sendGameRequest);

router.post('/respondRequest', isAuth, gameController.respondGameRequest);

router.post('/changeTurn', isAuth, gameController.changeTurn);

router.post('/finish', isAuth, gameController.finishGame);

module.exports = router;