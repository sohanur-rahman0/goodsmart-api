const { User } = require('../models')
const AppError = require('../utils/appError')
const httpStatus = require('http-status')
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new AppError('Email already taken', httpStatus.BAD_REQUEST)
  }
  return User.create(userBody)
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email: email })
}

module.exports = {
  createUser,
  getUserByEmail,
}
