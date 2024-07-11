const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const UserModel = require("../models/userModel");
const { cleanUpAndValidate, generateJWTToken } = require("../utils/authUtils");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword, username } = req.body;

  try {
    await cleanUpAndValidate({ name, email, password, confirmPassword, username });

    const userEmailExist = await UserModel.findOne({ email });
    if (userEmailExist) {
      return res.status(400).send({
        status: 400,
        message: "User Already Registered. Redirecting to login page...",
      });
    }

    const usernameExist = await UserModel.findOne({ username });
    if (usernameExist) {
      return res.status(400).send({
        status: 400,
        message: "Username Already Taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, parseInt(process.env.SALT));

    const userObj = new UserModel({
      name,
      email,
      username,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    });

    await userObj.save();

    const verificationToken = generateJWTToken(email);
    // sendVerificationEmail({ email, verificationToken });

    res.send({
      status: 200,
      message: "Registration successful. Go to your email to verify.",
    });

  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Database error",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).send({
      status: 400,
      message: "Missing Credentials",
    });
  }

  try {
    let userDb = {};

    if (validator.isEmail(loginId)) {
      userDb = await UserModel.findOne({ email: loginId });
    } else {
      userDb = await UserModel.findOne({ username: loginId });
    }

    if (!userDb) {
      return res.status(400).send({
        status: 400,
        message: "Login id not found, please register first",
      });
    }

    const isMatch = await bcrypt.compare(password, userDb.password);

    if (!isMatch) {
      return res.status(400).send({
        status: 400,
        message: "Password incorrect",
      });
    }

    const token = jwt.sign({ userId: userDb._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.send({ token, userId: loginId });

  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Database error",
      error: error.message,
    });
  }
});

module.exports = router;
