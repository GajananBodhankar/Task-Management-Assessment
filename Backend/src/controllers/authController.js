const User = require('../models/User');
const { signToken } = require('../utils/tokens');

const sendAuthResponse = (res, statusCode, user) => {
  res.status(statusCode).json({
    token: signToken(user),
    user: user.toSafeObject(),
  });
};

const signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    sendAuthResponse(res, 201, user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    sendAuthResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

module.exports = { signup, login, me };
