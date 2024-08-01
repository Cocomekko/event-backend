const Event = require('../models/event');

// Create a new event
async function createEvent(req, res) {
  const { name, date, location, description } = req.body;
  const userId = req.user.id;

  const event = new Event({
    name,
    date,
    location,
    description,
    createdBy: userId
  });

  try {
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Read all events for the logged-in user
async function getEvents(req, res) {
  const userId = req.user.id;

  try {
    const events = await Event.find({ createdBy: userId });
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update an event by ID
async function updateEvent(req, res) {
  const { id } = req.params;
  const { name, date, location, description } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    event.name = name || event.name;
    event.date = date || event.date;
    event.location = location || event.location;
    event.description = description || event.description;

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete an event by ID
async function deleteEvent(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await event.remove();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createEvent,
getEvents,
updateEvent,
deleteEvent
};
