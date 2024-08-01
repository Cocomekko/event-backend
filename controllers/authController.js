const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../utils/supabaseClient');
const User = require('../models/user');
const Session = require('../models/session');

const JWT_SECRET = process.env.JWT_SECRET;

// User registration
async function registerUser(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.log(error, supabase.auth.signUp);
    throw new Error(error.message);
    
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

  return { user: data.user, token };
}

// User login
async function loginUser(email, password, ipAddress) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

  // Create a session
  const session = new Session({
    user: user._id,
    loginTime: new Date(),
    ipAddress
  });

  await session.save();

  return { user: data.user, token, sessionId: session._id };
}

// User logout
async function logoutUser(sessionId) {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw new Error('Session not found');
  }

  session.logoutTime = new Date();

  await session.save();

  return { message: 'Logged out successfully' };
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};

