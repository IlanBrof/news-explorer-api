const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../utils/errors/Unauthorized');
const AccessDeniedErr = require('../utils/errors/AccessDenied');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedErr('Unauthorized'); // status(401)
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'secret',
    );
    if (!payload) {
      throw new AccessDeniedErr('Access Denied'); // status(403)
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
module.exports = auth;
