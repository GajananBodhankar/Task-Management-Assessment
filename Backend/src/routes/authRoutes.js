const express = require('express');
const { login, me, signup } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginSchema, signupSchema } = require('../validators/authValidators');

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);

module.exports = router;
