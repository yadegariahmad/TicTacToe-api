const { Router } = require('express');
const isAuth = require('../utils/isAuth');
const userController = require('../controllers/userController');

const router = Router();

router.put('/changeStatus', isAuth, userController.changeStatus);

router.post('/search', isAuth, userController.searchUser);

module.exports = router;