const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Game {
    _id: ID!
    date: String!
    draw: Boolean!
    winner: User!
    players: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    userName: String!
    email: String!
    password: String
    onlineStatus: String!
    score: Int!
    games: [Game!]!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  input UserInputData {
    email: String!
    name: String!
    userName: String!
    password: String!
  }

  input GameInputData {
    id: ID!
    draw: Boolean!
    winnerId: String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    searchUser(userName: String!): User
    sendGameRequest(userId: String): Boolean
    respondGameRequest(playerId: String!, opponentUserName: String!, answer: Boolean!): String
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
    changeStatus(userId: String!): Boolean
    finishGame(game: GameInputData): Boolean
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
