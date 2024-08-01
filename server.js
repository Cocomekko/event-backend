const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { registerUser, loginUser, logoutUser } = require('./controllers/authController');
const { createEvent, getEvents, updateEvent, deleteEvent } = require('./controllers/eventController');
const { getUserSessions } = require('./controllers/sessionController');
const { getWeather } = require('./controllers/weatherController');
const authMiddleware = require('./middlewares/authMiddleware');
require('./config/db');

const app = express();
const port = 4000;
app.use(cors())
app.use(bodyParser.json());

// Register
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const { user, token } = await registerUser(email, password, username);
    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;

  try {
    const { user, token, sessionId } = await loginUser(email, password, ipAddress);
    res.status(200).json({ user, token, sessionId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout endpoint
app.post('/logout', authMiddleware, async (req, res) => {
  const { sessionId } = req.body;

  try {
    const response = await logoutUser(sessionId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Event
app.post('/events', authMiddleware, createEvent);
app.get('/events', authMiddleware, getEvents);
app.put('/events/:id', authMiddleware, updateEvent);
app.delete('/events/:id', authMiddleware, deleteEvent);

// Retrieve all user sessions
app.get('/sessions', authMiddleware, getUserSessions);

// Fetch weather information for a given location
app.get('/weather/:location', authMiddleware, getWeather);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

