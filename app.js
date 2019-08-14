const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { json } = require('body-parser');
const { connect } = require('mongoose');
const { corsWhitelist } = require('./util/misc');

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/user');

const app = express();

app.use(json()); // application/json
app.use(cors(corsWhitelist()));
app.use(helmet());
app.use(compression());

app.use('/auth', authRoutes);
app.use('/game', gameRoutes);
app.use('/user', userRoutes);

app.use((error, _req, res) =>
{
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ue3bz.mongodb.net/TicTacToe?retryWrites=true`,
  { useNewUrlParser: true }
)
  .then(() =>
  {
    const server = app.listen(process.env.PORT || 8080);
    const io = require('./utils/socket').init(server);
    io.on('connection', () =>
    {
      console.log('Client connected');
    });
    console.log('listening ...');
  })
  .catch(err => console.log(err));