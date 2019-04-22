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

  input UserInputData {
    id: String!
    draw: Boolean!
    winnerId: String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    searchUser(userName: String!): User
    sendGameRequest(userId: String): Boolean
    respondGameRequest(userId: String): Boolean
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
    setOnlineStatus(userId: String!, status: Boolean!): Boolean
    finishGame(game: Game): Boolean
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
