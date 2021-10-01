const httpStatus = require('http-status')
const { User } = require('../models')
const AppError = require('../utils/appError')
const userService = require('./user.service')

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email)
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new AppError('Incorrect email or password', httpStatus.UNAUTHORIZED)
  }
  return user
}

module.exports = {
  loginUserWithEmailAndPassword,
}
