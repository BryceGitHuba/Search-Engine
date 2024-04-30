const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret, { maxAge: expiration });
    return decoded.data; // Assuming your token is structured with a 'data' object
  } catch (err) {
    console.error('Invalid token', err);
    return null;
  }
}

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (token) {
      try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        req.user = data;
      } catch {
        console.log('Invalid token');
      }
    }
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  getUserFromToken // Add this line to export the function
};