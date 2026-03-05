const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');

function generateToken(user) {
  const payload = {
    id: user.id,
    role: user.role
  };
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await createUser({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'customer'
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res) {
  return res.status(200).json({
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
}

function logout(req, res) {
  return res.status(200).json({
    message:
      'Logout successful on server side. Please remove the JWT token on the client (e.g. localStorage/cookies).'
  });
}

module.exports = {
  register,
  login,
  me,
  logout
};

