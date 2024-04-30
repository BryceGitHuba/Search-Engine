const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    me: User
    userById(id: ID!): User
    allUsers: [User]
    bookById(bookId: ID!): Book
    allBooks: [Book]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: ID!): User
    updateBook(bookId: ID!, input: BookInput): Book
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  input BookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Error {
    message: String!
    code: Int!
  }
`;

module.exports = typeDefs;
