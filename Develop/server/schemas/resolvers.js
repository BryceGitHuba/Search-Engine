// resolvers.js
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
// Add any other necessary imports

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (!context.user) {
          throw new AuthenticationError('You need to be logged in!');
        }
        return await User.findById(context.user._id);
      },
    // Add other query resolvers if necessary
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    // Notice the comma at the end of the previous resolver before starting a new one
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new Error('Error creating user');
      }

      const token = signToken(user);
      return { token, user };
    },
    // Add other mutation resolvers such as addUser, saveBook, removeBook
  },
  // If you have any custom types that need special resolvers for their fields, you would add those here
};

module.exports = resolvers;