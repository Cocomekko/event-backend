const Session = require('../models/session');

async function getUserSessions(req, res) {
  const userId = req.user.id;

  try {
    const sessions = await Session.find({ user: userId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getUserSessions
};

