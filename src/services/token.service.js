const moment = require('moment')
const jwt = require('jsonwebtoken')

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  }

  return jwt.sign(payload, secret)
}

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */

const generateAuthToken = async (user) => {
  const expire = moment().add(process.env.JWT_EXPIRATION_MINUTES, 'minutes')
  const token = generateToken(user.id, expire, 'ACCESS')
  return token
}

module.exports = {
  generateToken,
  generateAuthToken,
}
