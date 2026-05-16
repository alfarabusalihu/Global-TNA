const mongoose = require('mongoose');
const validator = require('validator');

const jobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'General'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    validate: [validator.isEmail, 'Invalid email format'],
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  postedBy: {
    type: String, // "Anonymous" or User ID
    default: 'Anonymous',
  },
  anonId: {
    type: String,
    required: function() { return this.postedBy === 'Anonymous'; }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.JobRequest || mongoose.model('JobRequest', jobRequestSchema);
