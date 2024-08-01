const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date },
  ipAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

