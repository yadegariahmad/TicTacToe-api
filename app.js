const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const { connect } = require('mongoose');
const auth = require('./utils/isAuth');

const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();

app.use(json()); // application/json
app.use(cors());

app.use(auth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err)
    {
      if (!err.originalError)
      {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

app.use((error, _req, res) =>
{
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

connect(
  'mongodb+srv://yadegariahmad:Seyah141374@cluster0-ue3bz.mongodb.net/TicTacToe?retryWrites=true',
  { useNewUrlParser: true }
)
  .then(() =>
  {
    const server = app.listen(8080);
    const io = require('./utils/socket').init(server);
    io.on('connection', () =>
    {
      console.log('Client connected');
    });
    console.log('listening ...');
  })
  .catch(err => console.log(err));