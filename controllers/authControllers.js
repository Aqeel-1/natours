// eslint-disable-next-line import/no-extraneous-dependencies
const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirme: req.body.passwordConfirme,
    // !Temp
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('you sholud provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('Incorrect email or password, login failed!', 401),
    );
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Check if there is a token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    next(new AppError('user not logged in!', 401));
  }
  // Check if this token correct and it is a real token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );
  // Check if user still exist
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    next(
      new AppError(
        'The user belonging to this token does not longer exist!',
        401,
      ),
    );
  }
  // Check if user dosen't change its  password
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    next(new AppError('User Changed its password!! please login again!!', 401));
  }
  req.user = freshUser;
  next();
});
