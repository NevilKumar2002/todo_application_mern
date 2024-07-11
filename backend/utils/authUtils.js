const validator = require('validator');
const jwt = require('jsonwebtoken');

const cleanUpAndValidate = ({ email, password, confirmPassword, username, name }) => {
  return new Promise((resolve, reject) => {
    if (!name || !password || !email || !confirmPassword || !username) {
      reject("Missing Credentials. Make Sure All the Credentials are provided.");
    }
    if (password !== confirmPassword) {
      reject("Password and Confirm Password should be the same.");
    }
    if (typeof email !== "string") reject("Email is invalid.");
    if (typeof password !== "string") reject("Password is invalid.");
    if (typeof confirmPassword !== "string") reject("Confirm Password is invalid.");
    if (typeof username !== "string") reject("Username is invalid.");
    if (typeof name !== "string") reject("Name is invalid.");
    if (!validator.isEmail(email)) reject("Email is invalid.");
    resolve();
  });
}

const generateJWTToken = (email) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}

module.exports = { cleanUpAndValidate, generateJWTToken };
